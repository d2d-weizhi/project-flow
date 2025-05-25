import { useState, useEffect } from "react";
import { createTask, updateTask, getTasks, deleteTask } from "../../services/api";
import type { ITask } from "../../services/types"; // Import your Task type
import {
	Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, 
	useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import TaskForm from "../TaskForm/TaskForm";

export default function TaskList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);

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
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]); // Add the new task to the list
      handleCloseModal();
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle errors (e.g., display an error message to the user)
    }
  };

  const handleUpdateTask = async (updatedTask: ITask) => {
    try {
      await updateTask(updatedTask); 
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t))); // Update the task in the list
      handleCloseModal();
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle errors
    }
  };

	const handleDelete = (taskId: number) => {
    setTaskIdToDelete(taskId);
    setShowDeleteDialog(true);
  };

	const handleConfirmDelete = async () => {
    if (taskIdToDelete !== null) {
      await deleteTask(taskIdToDelete);
      setTasks(tasks.filter((task) => task.id !== taskIdToDelete));
    }
    setShowDeleteDialog(false);
    setTaskIdToDelete(null);
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

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              {isWidth768 && <TableCell>Description</TableCell>}
              <TableCell className="w-[10%] min-w-[120px]">Status</TableCell>
              {isWidth1024 && <TableCell>Assignee</TableCell>}
              <TableCell className="w-[10%] min-w-[120px]">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                {isWidth768 && <TableCell>{task.description}</TableCell>}
                <TableCell className="w-[10%] min-w-[120px]">
                  {task.status}
                </TableCell>
                {isWidth1024 && <TableCell>{task.assignee}</TableCell>}
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
};
