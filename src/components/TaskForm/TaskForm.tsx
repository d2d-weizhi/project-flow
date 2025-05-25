import React, { useState, useEffect } from 'react';
import type { ITask } from '../../services/types';

interface TaskFormProps {
  initialTask?: ITask | null; // For editing existing tasks
  onSubmit: (task: ITask) => void;
  onClose: () => void;
}

export default function TaskForm ({ initialTask, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('Todo');
  const [assignee, setAssignee] = useState('');

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

    const newTask: ITask = {
      id: initialTask?.id || Date.now(), // Generate a temporary ID if creating
      title,
      description,
      status,
      assignee,
    };

    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialTask ? 'Edit Task' : 'Create New Task'}</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ITask['status'])}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignee">Assignee:</label>
        <input
          type="text"
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>
      <button type="submit">Save Task</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};