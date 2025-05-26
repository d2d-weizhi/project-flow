import { useContext, useState, useEffect } from "react";
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
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  const isWidth1024 = useMediaQuery("(min-width: 1024px)");
  const isWidth768 = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      dispatch({ type: "FETCH_TASKS", payload: fetchedTasks });
    };
    fetchTasks();
  }, [dispatch]); // Add dispatch to the dependency array

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
			
			<div className="flex w-full h-max">
				<div className="flex w-1/2 items-center justify-start">
					<Button variant="contained" onClick={handleCreateTaskOpen}>
        		Create New Task
      		</Button>
				</div>
				<div className="flex w-1/2 items-center justify-end">
					<TextField variant="standard" className="mr-2 w-32" value={searchFilter} placeholder="Enter keywords here..." />
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
              <TableCell className="w-[10%] min-w-[150px]">
								<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Status</span>
							</TableCell>
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
            {state.tasksByStatus.Todo.map((task) => (
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
                <TableCell className="w-[10%] min-w-[150px]">
                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{task.status}</span>
                </TableCell>
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

      <h3 className={theme === "light" ? "light-header" : "dark-header" }>In-Progress</h3>

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
              <TableCell className="w-[10%] min-w-[150px]">
								<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
									Status
								</span>
							</TableCell>
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
            {state.tasksByStatus.InProgress.map((task) => (
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
                <TableCell className="w-[10%] min-w-[150px]">
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                  	{task.status}
									</span>
                </TableCell>
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

      <h3 className={theme === "light" ? "light-header" : "dark-header" }>Completed</h3>

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
              <TableCell className="w-[10%] min-w-[150px]">
								<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
									Status
								</span>
							</TableCell>
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
            {state.tasksByStatus.Done.map((task) => (
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
                <TableCell className="w-[10%] min-w-[150px]">
									<span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                  	{task.status}
									</span>
                </TableCell>
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

      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center z-50 md:bg-transparent" // Positioning
        >
          <div
            className="bg-white p-4 rounded-md shadow-md max-w-[600px] w-full max-h-[90vh] overflow-y-auto relative md:max-h-[80vh] md:w-[90%]"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            <button
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 p-2" // Position the button
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>
            <TaskForm
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
