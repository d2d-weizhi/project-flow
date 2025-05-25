import type { ITask } from "./types";

const API_URL = 'http://localhost:3001';

export const getTasks = async (): Promise<ITask[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
};

// GET a single task by ID
export const getTaskById = async (id: number): Promise<ITask> => {
  const response = await fetch(`${API_URL}/tasks/${id}`);
  return response.json();
};

// POST a new task
export const createTask = async (task: ITask): Promise<ITask> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response.json();
};

// PUT (update) an existing task
export const updateTask = async (task: ITask): Promise<ITask> => {
  const response = await fetch(`${API_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response.json();
};

// DELETE a task by ID
export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
};