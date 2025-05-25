import React, { createContext, useReducer } from 'react';
import type { ITask } from "../services/types";

interface TaskState {
  tasksByStatus: {
    Todo: ITask[];
    InProgress: ITask[];
    Done: ITask[];
  };
}

type TaskAction =
  | { type: "FETCH_TASKS"; payload: ITask[] }
  | { type: "CREATE_TASK"; payload: ITask }
  | { type: "UPDATE_TASK"; payload: ITask }
  | { type: "DELETE_TASK"; payload: number }; // Payload is the task ID

const initialState: TaskState = {
  tasksByStatus: {
    Todo: [],
    InProgress: [],
    Done: [],
  },
};

function taskReducer (state: TaskState, action: TaskAction) {
	const isValidStatus = (status: string): status is keyof typeof state.tasksByStatus => {
    return ['Todo', 'InProgress', 'Done'].includes(status);
  };

  switch (action.type) {
    case 'FETCH_TASKS':
      return {
        ...state,
        tasksByStatus: {
          Todo: action.payload.filter((task) => task.status === "Todo"),
          InProgress: action.payload.filter(
            (task) => task.status === "In Progress"
          ),
          Done: action.payload.filter((task) => task.status === "Done"),
        },
      };
    case 'CREATE_TASK':
      if (isValidStatus(action.payload.status)) { 
       return {
         ...state,
         tasksByStatus: {
           ...state.tasksByStatus,
           [action.payload.status]: [ // Now TypeScript knows the status is valid
             ...state.tasksByStatus[action.payload.status],
             action.payload,
           ],
         },
       };
     } else {
       // Handle the invalid status (e.g., log an error or return the state unchanged)
       console.error('Invalid task status:', action.payload.status);
       return state; 
     }
    case 'UPDATE_TASK':
      const updatedTask = action.payload;
			if (isValidStatus(updatedTask.status)) {
				const originalStatus = state.tasksByStatus[updatedTask.status]
					.find((task) => task.id === updatedTask.id)
					? updatedTask.status
					: (Object.keys(state.tasksByStatus) as (keyof typeof state.tasksByStatus)[]).find( // Assertion here
							(key) => state.tasksByStatus[key].find((task) => task.id === updatedTask.id)
						); // Find the original status 

				// If the status has changed, move the task
				if (originalStatus && originalStatus !== updatedTask.status) {
					return {
						...state,
						tasksByStatus: {
							...state.tasksByStatus,
							[originalStatus]: state.tasksByStatus[originalStatus].filter(
								(task) => task.id !== updatedTask.id
							),
							[updatedTask.status]: [
								...state.tasksByStatus[updatedTask.status],
								updatedTask,
							],
						},
					};
				}

				// If the status hasn't changed, just update the task in place
				return {
					...state,
					tasksByStatus: {
						...state.tasksByStatus,
						[updatedTask.status]: state.tasksByStatus[
							updatedTask.status
						].map((task) =>
							task.id === updatedTask.id ? updatedTask : task
						),
					},
				};
			} else {
				console.error('Invalid task status:', updatedTask.status);
				return state; // Or handle the error differently
			}
    case 'DELETE_TASK':
      return {
        ...state,
        tasksByStatus: {
          ...state.tasksByStatus,
          Todo: state.tasksByStatus.Todo.filter(
            (task) => task.id !== action.payload
          ),
          InProgress: state.tasksByStatus.InProgress.filter(
            (task) => task.id !== action.payload
          ),
          Done: state.tasksByStatus.Done.filter(
            (task) => task.id !== action.payload
          ),
        },
      };
    default:
      return state;
    }
};

interface TasksContextProps {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

export const TasksContext = createContext<TasksContextProps>(
  {} as TasksContextProps
); // Initialize with empty object

interface TaskProviderProps {
  children: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};