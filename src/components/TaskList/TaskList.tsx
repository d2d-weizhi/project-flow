import React, { useContext, useState, useEffect } from "react";
import { TasksContext } from "../../context/TasksContext";
import {
  createTask,
  updateTask,
  getTasks,
  deleteTask,
} from "../../services/api";
import type { ITask } from "../../services/types"; // Import your Task type
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
	TextField,
  Paper,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import TaskForm from "../TaskForm/TaskForm";

export default function TaskList({theme}: {theme: string}) {
  const { state, dispatch } = useContext(TasksContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

	// Discovered the delay in updating the state and refreshing the UI.
	// Decided to use these arrays as a way to maintain a fresh copy.
	const [todoTasks, setTodoTasks] = useState<ITask[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<ITask[]>([]);
	const [doneTasks, setDoneTasks] = useState<ITask[]>([]);
	
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isTodoTasksEmpty, setIsTodoTasksEmpty] = useState<boolean>(false);
	const [isInProgressTasksEmpty, setIsInProgressTasksEmpty] = useState<boolean>(false);
	const [isDoneTasksEmpty, setIsDoneTasksEmpty] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  const isWidth1024 = useMediaQuery("(min-width: 1024px)");
  const isWidth768 = useMediaQuery("(min-width: 768px)");
	const isMobilePortrait = useMediaQuery("(max-width: 720px)");

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      dispatch({ type: "FETCH_TASKS", payload: fetchedTasks });
    };
    fetchTasks();
		// Always get a fresh copy.
		setTodoTasks(state.tasksByStatus.Todo);
		setInProgressTasks(state.tasksByStatus.InProgress);
		setDoneTasks(state.tasksByStatus.Done);
  }, [dispatch, todoTasks, inProgressTasks, doneTasks]); // Add dispatch to the dependency array

  const handleCreateTask = async (newTask: ITask) => {
    try {
      const createdTask = await createTask(newTask);
      dispatch({ type: "CREATE_TASK", payload: createdTask });
      handleCloseModal();
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle errors (e.g., display an error message to the user)
    }
  };

  const handleUpdateTask = async (updatedTask: ITask) => {
    try {
      await updateTask(updatedTask);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle errors
    }
  };

  const handleDelete = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (taskIdToDelete !== null) {
      try {
        await deleteTask(taskIdToDelete);
        dispatch({ type: "DELETE_TASK", payload: taskIdToDelete });
      } catch (error) {
        console.error("Error deleting task:", error);
        // Handle errors
      }
    }
    setShowDeleteDialog(false);
    setTaskIdToDelete(null);
  };

  const handleCreateTaskOpen = () => {
    setModalMode("create");
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTaskOpen = (task: ITask) => {
    setModalMode("edit");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-max items-start">
      <h2>Task List</h2>
			
			<div className={`flex ${isMobilePortrait && "flex-col flex-col-reversed"} w-full h-max`}>
				<div className={`flex ${isMobilePortrait ? "w-full mb-4" : "w-1/2"} items-center justify-start`}>
					<Button variant="contained" onClick={handleCreateTaskOpen}
						className={`${isMobilePortrait && "w-full h-9"}`}
					>
        		Create New Task
      		</Button>
				</div>
				<div className={`flex ${isMobilePortrait ? "w-full" : "w-1/2"} items-center justify-end`}>
					<TextField 
						variant={theme === "light" ? "standard" : "filled"} 
						className={`mr-2 w-[40%] min-w-[180px] ${isMobilePortrait && "w-full"} ${theme === "dark" && "text-white"}`}
						value={searchFilter} 
						placeholder="Enter keywords here..." 
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setSearchFilter(event.target.value);
							setIsTodoTasksEmpty(state.tasksByStatus.Todo.filter(task => task.title.toLowerCase().includes(event.target.value)).length === 0);
							setIsInProgressTasksEmpty(state.tasksByStatus.InProgress.filter(task => task.title.toLowerCase().includes(event.target.value)).length === 0);
							setIsDoneTasksEmpty(state.tasksByStatus.Done.filter(task => task.title.toLowerCase().includes(event.target.value)).length === 0);
						}}
					/>
				</div>
			</div>
      

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <h3 className={theme === "light" ? "light-header" : "dark-header" }>TO-DO</h3>
			
			{isTodoTasksEmpty ? (
				<div className="flex w-full h-20 items-center justify-center">
					You have no To-Do Tasks for now.
				</div>
			) : (
				<TableContainer component={Paper} className={`mt-4`}>
	        <Table>
	          <TableHead className={`${theme}-theme-table`}>
	            <TableRow>
	              <TableCell
	                className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
	              >
	                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Title</span>
	              </TableCell>
	              {isWidth768 && (
	                <TableCell
	                  className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
	                >
	                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Description</span>
	                </TableCell>
	              )}
								{!isMobilePortrait && (
		              <TableCell className="w-[10%] min-w-[150px]">
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Status</span>
									</TableCell>
								)}
	              {isWidth1024 && (
	                <TableCell className="w-[10%] min-w-[180px]">
	                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Assignee</span>
	                </TableCell>
	              )}
	              <TableCell className="w-[10%] min-w-[120px]">
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
										Actions
									</span>
								</TableCell>
	            </TableRow>
	          </TableHead>
	          <TableBody className={`${theme}-theme-table`}>
							{state.tasksByStatus.Todo.filter(task => task.title.toLowerCase().includes(searchFilter)).map((task) => (
		            <TableRow key={task.id}>
		              <TableCell
		                className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
		              >
		                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{task.title}</span>
		              </TableCell>
		              {isWidth768 && (
		                <TableCell
		                  className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
		                >
		                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{task.description}</span>
		                </TableCell>
		              )}
									{!isMobilePortrait && (
			              <TableCell className="w-[10%] min-w-[150px]">
			                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{task.status}</span>
			              </TableCell>
									)}
		              {isWidth1024 && (
		                  <TableCell className="w-[10%] min-w-[180px]">
		                    <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{task.assignee}</span>
		                  </TableCell>
		                )}
		                <TableCell className="w-[10%] min-w-[120px]">
		                  <IconButton onClick={() => handleEditTaskOpen(task)} 
												style={{
													color: theme === "dark" ? "white" : "black",
												}}	
											>
		                    <EditIcon />
		                  </IconButton>
		                  <IconButton onClick={() => handleDelete(task.id)}
												style={{
													color: theme === "dark" ? "white" : "black",
												}}		
											>
		                    <DeleteIcon />
		                  </IconButton>
		                </TableCell>
		              </TableRow>
		            ))}
	          </TableBody>
	        </Table>
	      </TableContainer>
			)}
	    
      <h3 className={theme === "light" ? "light-header" : "dark-header" }>In-Progress</h3>
			
			{isInProgressTasksEmpty ? (
				<div className="flex w-full h-20 items-center justify-center">
					You have no In-Progress Tasks for now.
				</div>
			) : (
				<TableContainer component={Paper} className="mt-4">
	        <Table>
	          <TableHead className={`${theme}-theme-table`}>
	            <TableRow>
	              <TableCell
	                className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
	              >
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                	Title
									</span>
	              </TableCell>
	              {isWidth768 && (
	                <TableCell
	                  className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
	                >
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                  	Description
										</span>
	                </TableCell>
	              )}
								{!isMobilePortrait && (
		              <TableCell className="w-[10%] min-w-[150px]">
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
											Status
										</span>
									</TableCell>
								)}
	              {isWidth1024 && (
	                <TableCell className="w-[10%] min-w-[180px]">
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                 		Assignee
										</span>
	                </TableCell>
	              )}
	              <TableCell className="w-[10%] min-w-[120px]">
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
										Actions
									</span>
								</TableCell>
	            </TableRow>
	          </TableHead>
	          <TableBody className={`${theme}-theme-table`}>
	            {state.tasksByStatus.InProgress.filter(task => task.title.toLowerCase().includes(searchFilter)).map((task) => (
	              <TableRow key={task.id}>
	                <TableCell
	                  className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
	                >
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                  	{task.title}
										</span>
	                </TableCell>
	                {isWidth768 && (
	                  <TableCell
	                    className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
	                  >
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                    	{task.description}
											</span>
	                  </TableCell>
	                )}
									{!isMobilePortrait && (
		                <TableCell className="w-[10%] min-w-[150px]">
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
		                  	{task.status}
											</span>
		                </TableCell>
									)}
	                {isWidth1024 && (
	                  <TableCell className="w-[10%] min-w-[180px]">
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                    	{task.assignee}
											</span>
	                  </TableCell>
	                )}
	                <TableCell className="w-[10%] min-w-[120px]">
	                  <IconButton onClick={() => handleEditTaskOpen(task)}
											style={{
												color: theme === "dark" ? "white" : "black",
											}}	
										>
	                    <EditIcon />
	                  </IconButton>
	                  <IconButton onClick={() => handleDelete(task.id)}
											style={{
												color: theme === "dark" ? "white" : "black",
											}}
										>
	                    <DeleteIcon />
	                  </IconButton>
	                </TableCell>
	              </TableRow>
	            ))}
	          </TableBody>
	        </Table>
	      </TableContainer>
			)}
	    
      <h3 className={theme === "light" ? "light-header" : "dark-header" }>Completed</h3>

			{isDoneTasksEmpty ? (
				<div className="flex w-full h-20 items-center justify-center">
					You have not completed any tasks yet.
				</div>
			) : (
				<TableContainer component={Paper} className="mt-4">
	        <Table>
	          <TableHead className={`${theme}-theme-table`}>
	            <TableRow>
	              <TableCell
	                className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
	              >
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                	Title
									</span>
	              </TableCell>
	              {isWidth768 && (
	                <TableCell
	                  className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
	                >
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                  	Description
										</span>
	                </TableCell>
	              )}
								{!isMobilePortrait && (
		              <TableCell className="w-[10%] min-w-[150px]">
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
											Status
										</span>
									</TableCell>
								)}
	              {isWidth1024 && (
	                <TableCell className="w-[10%] min-w-[180px]">
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                  	Assignee
										</span>
	                </TableCell>
	              )}
	              <TableCell className="w-[10%] min-w-[100px]">
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
										Actions
									</span>
								</TableCell>
	            </TableRow>
	          </TableHead>
	          <TableBody className={`${theme}-theme-table`}>
	            {state.tasksByStatus.Done.filter(task => task.title.toLowerCase().includes(searchFilter)).map((task) => (
	              <TableRow key={task.id}>
	                <TableCell
	                  className={`${isWidth1024 ? "w-[20%]" : "min-w-[150px]"}`}
	                >
										<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                  	{task.title}
										</span>
	                </TableCell>
	                {isWidth768 && (
	                  <TableCell
	                    className={`${isWidth1024 ? "w-[30%]" : "min-w-[250px]"}`}
	                  >
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                    	{task.description}
											</span>
	                  </TableCell>
	                )}
									{!isMobilePortrait && (
		                <TableCell className="w-[10%] min-w-[150px]">
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
		                  	{task.status}
											</span>
		                </TableCell>
									)}
	                {isWidth1024 && (
	                  <TableCell className="w-[10%] min-w-[180px]">
											<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
	                    	{task.assignee}
											</span>
	                  </TableCell>
	                )}
	                <TableCell className="w-[10%] min-w-[100px]">
	                  <IconButton onClick={() => handleDelete(task.id)}
											style={{
												color: theme === "dark" ? "white" : "black",
											}}
										>
	                    <DeleteIcon />
	                  </IconButton>
	                </TableCell>
	              </TableRow>
	            ))}
	          </TableBody>
	        </Table>
	      </TableContainer>
			)}
	      

      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center z-50 md:bg-transparent" // Positioning
        >
          <div
            className={`${theme === "light" ? "light-theme" : "dark-theme"} p-4 rounded-md shadow-md max-w-[600px] w-full max-h-[90vh] overflow-y-auto relative md:max-h-[80vh] md:w-[90%]`}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            <button
              className={`absolute top-2 right-2 cursor-pointer ${theme === "light" ? "text-gray-500 hover:text-gray-700" : "text-gray-200 hover:text-white-50"} p-2`} // Position the button
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>
            <TaskForm
							theme={theme}
              initialTask={modalMode === "edit" ? selectedTask : undefined}
              onSubmit={
                modalMode === "edit" ? handleUpdateTask : handleCreateTask
              }
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
