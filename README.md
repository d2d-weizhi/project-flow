# ProjectFlow

ProjectFlow is a prototype task management application built with React that makes it easy to organize and track project tasks. The app provides a clean and intuitive interface for creating, assigning, filtering, and managing tasks, helping teams stay on top of their workload and improve collaboration. 

## Key Features:

- **Task Management**: Create, edit, delete, and assign tasks with detailed descriptions and statuses.
- **Filtering & Search**: Easily find tasks based on status, assignee, or keywords.
- **Mock API Integration**: Simulates real-world API interactions for data persistence.
- **State Management with Redux Toolkit**: Ensures efficient and predictable data flow.
- **Responsive Design**: Optimised for both desktop and mobile devices.
- **Unit & Component Testing**:  Includes comprehensive tests to ensure code quality and functionality.

## Included Features:
- **Drag-and-Drop Reordering**: Intuitively prioritise and reorder tasks within lists.
- **User Role Management**:  Implement different permission levels for admins and regular users.
- **Theme Persistence**: Allow users to choose and save their preferred light or dark theme.

---

# Architectural Design/Thought-Process

ProjectFlow will have a single-page application (SPA) structure with a primary focus on the task list view. 


## Navigation:

- A sidebar will provide access to:
- All Tasks: The main task list view
- Filters: A dedicated section for applying task filters
- (Optional) Projects:  If we decide to add project grouping, we can include a section to manage projects.
- User profile and settings (e.g., theme switching) will be accessible from a dropdown menu in the header.

## Component Structure:

The application will follow a modular component-based architecture:

```
src/
  components/
    TaskList/
      TaskList.tsx
      TaskList.styles.ts (or TaskList.module.css if using CSS Modules)
      TaskItem/
        TaskItem.tsx 
        TaskItem.styles.ts
    TaskForm/
      TaskForm.tsx
      TaskForm.styles.ts
    Filters/
      Filters.tsx
      Filters.styles.ts
    UI/  (Reusable UI elements)
      Button/ 
        Button.tsx
        Button.styles.ts
      Input/
        Input.tsx
        Input.styles.ts
    ... other components
  redux/ (or context/)
    tasksSlice.ts (or tasksReducer.ts)
    store.ts
  services/ 
    api.ts (for interacting with the mock API)
  pages/ 
    TasksPage.tsx  
    (Add more pages if needed)
  App.tsx
  index.tsx
```