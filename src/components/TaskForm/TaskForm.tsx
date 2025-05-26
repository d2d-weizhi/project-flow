import React, { useState, useEffect } from 'react';
import type { ITask } from '../../services/types';
import { TextField, Button, MenuItem  } from '@mui/material';

interface TaskFormProps {
	theme: string;
  initialTask?: ITask | null; // For editing existing tasks
  onSubmit: (task: ITask) => void;
  onClose: () => void;
}

export default function TaskForm ({ theme, initialTask, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('Todo');
  const [assignee, setAssignee] = useState('');

	const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
	const [assigneeError, setAssigneeError] = useState(false);

  // Update the form fields if initialTask is provided (for editing)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setStatus(initialTask.status);
      setAssignee(initialTask.assignee);
    }
  }, [initialTask]); // Only run this effect when initialTask changes

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
		
		setTitleError(title.trim() === '');
    setDescriptionError(description.trim() === '');
		setAssigneeError(assignee.trim() === '');

		if (title.trim() === '' || description.trim() === '' || assignee.trim() === '') {
      return; // Stop submission if there are errors
    }

    const newTask: ITask = {
      id: (initialTask?.id || Date.now()).toString(), // Generate a temporary ID if creating
      title,
      description,
      status,
      assignee,
    };

		console.log(newTask);

    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>{initialTask ? 'Edit Task' : 'Create New Task'}</h2>
      <TextField 
        label="Title"
        variant={theme === "light" ? "outlined" : "filled"} 
				className="form-fields"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
				placeholder={"Enter a Task Title"}
				error={titleError}
				helperText={titleError ? 'Title is required' : ''}
        fullWidth // Makes the input take up full width
      />

      <TextField
        label="Description"
        multiline // Makes it a multiline textarea
        rows={4} // Sets the initial height (number of rows)
        variant={theme === "light" ? "outlined" : "filled"}
				className="form-fields"
        value={description}
				placeholder={"Enter a Task Description."}
        onChange={(e) => setDescription(e.target.value)}
				error={descriptionError}
				helperText={descriptionError ? 'Description is required' : ''}
        fullWidth
      />

      <TextField
        label="Status"
				className="form-fields"
        select // Makes it a dropdown select
				variant={theme === "light" ? "outlined" : "filled"}
        value={status}
        onChange={(e) => setStatus(e.target.value as ITask['status'])}
        fullWidth
      >
        <MenuItem value="Todo">Todo</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>

      <TextField 
        label="Assignee"
        variant={theme === "light" ? "outlined" : "filled"}
				className="form-fields"
        value={assignee}
				placeholder="Who this task is assigned to"
        onChange={(e) => setAssignee(e.target.value)}
				error={assigneeError}
				helperText={assigneeError ? 'Assignee is required' : ''}
        fullWidth
      />

      <div className="flex justify-end gap-4 mt-4"> 
        <Button variant="contained" type="submit" style={{ fontFamily: "Roboto" }}>
          Save Task
        </Button>
        <Button variant="outlined" onClick={onClose} style={{ fontFamily: "Roboto" }}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
