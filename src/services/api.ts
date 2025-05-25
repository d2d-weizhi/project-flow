import type { ITask } from "./types";

// Helper function to get tasks from localStorage
const getLocalTasks = (): ITask[] => {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Helper function to save tasks to localStorage
const setLocalTasks = (tasks: ITask[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Seed initial data from db.json on first load
const seedInitialData = () => {
  if (!localStorage.getItem('tasks')) { // Only seed if localStorage is empty
    const initialTasks: ITask[] = [
    	{
				"id": "1",
				"title": "Complete Project Proposal",
				"description": "Finalize the proposal document and submit it to the client.",
				"status": "Done",
				"assignee": "John Doe"
			},
			{
				"id": "2",
				"title": "Design User Interface",
				"description": "Create mockups and prototypes for the main dashboard.",
				"status": "Done",
				"assignee": "Jane Smith"
			},
			{
				"id": "1748155388332",
				"title": "Generate 3 Distinct Moodboards",
				"description": "We need to generate 3 distinct moodboards to present the client next week.",
				"status": "In Progress",
				"assignee": "Jeremy Lee"
			},
			{
				"id": "1748155482752",
				"title": "User Flows & Information Architecture",
				"description": "Identify the key user flows as well as the required sitemap.",
				"status": "In Progress",
				"assignee": "Torence Tan"
			},
			{
				"id": "1748156922772",
				"title": "Meet up with Client",
				"description": "Routine check-in and progress updates.",
				"status": "Todo",
				"assignee": "Chen Weizhi"
			}
		];
    setLocalTasks(initialTasks);
  }
};

seedInitialData(); // Call the seeding function when the app loads

// ... (Modified API functions) ...

export const getTasks = async (): Promise<ITask[]> => {
  return getLocalTasks();
};

export const getTaskById = async (id: string): Promise<ITask | undefined> => {
  const tasks = getLocalTasks();
  return tasks.find(task => task.id === id); 
};

export const createTask = async (task: ITask): Promise<ITask> => {
  const tasks = getLocalTasks();
  const newTask = { ...task, id: Date.now().toString() }; // Generate a simple ID 
  tasks.push(newTask);
  setLocalTasks(tasks);
  return newTask;
};

export const updateTask = async (updatedTask: ITask): Promise<void> => {
  const tasks = getLocalTasks();
  const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = updatedTask;
    setLocalTasks(tasks);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = getLocalTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  setLocalTasks(updatedTasks);
};