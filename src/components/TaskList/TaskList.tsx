import { useState, useEffect } from "react";
import { getTasks, deleteTask } from "../../services/api";
import type { ITask } from "../../services/types"; // Import your Task type
import {
     Table,
     TableBody,
     TableCell,
     TableContainer,
     TableHead,
     TableRow,
     Paper,
     Button, // For actions (Edit/Delete)
     IconButton, // For icons within buttons
		 useMediaQuery
   } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import TaskForm from "../TaskForm/TaskForm";

export default function TaskList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const isWidth1024 = useMediaQuery('(min-width: 1024px)');
	const isWidth768 = useMediaQuery('(min-width: 768px)');
	
  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);

	const handleCreateTask = async (newTask: ITask) => {
    // 1. Make API call to create the task using createTask(newTask)
    // 2. Update the tasks state (either refetch all tasks or optimistically update) 
    // 3. Close the modal
    handleCloseModal(); 
  };

  const handleUpdateTask = async (updatedTask: ITask) => {
    // 1. Make API call to update the task using updateTask(updatedTask)
    // 2. Update the tasks state
    // 3. Close the modal
    handleCloseModal();
  };

	const handleDelete = async (taskId: number) => {
    // Optional: Add confirmation dialog here
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId)); 
  };

  const handleCreateTaskOpen = () => {
    setModalMode('create'); 
    setSelectedTask(null); 
    setIsModalOpen(true);
  };

  const handleEditTaskOpen = (task: ITask) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Task List</h2>

      <Button variant="contained" onClick={handleCreateTaskOpen}>
        Create New Task
      </Button>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
							{isWidth768 && (
              	<TableCell>Description</TableCell>
							)}
              <TableCell className="w-[10%] min-w-[120px]">Status</TableCell>
							{isWidth1024 && (
              	<TableCell>Assignee</TableCell>
							)}
              <TableCell className="w-[10%] min-w-[120px]">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
								{isWidth768 && (
                	<TableCell>{task.description}</TableCell>
								)}
                <TableCell className="w-[10%] min-w-[120px]">{task.status}</TableCell>
								{isWidth1024 && (
									<TableCell>{task.assignee}</TableCell>
								)}
                <TableCell className="w-[10%] min-w-[120px]">
                  <IconButton onClick={() => handleEditTaskOpen(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
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
};
