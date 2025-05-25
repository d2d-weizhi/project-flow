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

# My Workflow:

1. Set up Project: Created project structure, initialized Git repository, and drafted the README.

2. Implemented Mock API: Set up json-server to simulate a backend API for local development.

3. Created API Service:  Wrote functions in api.ts to handle CRUD operations (GET, POST, PUT, DELETE) for tasks.

4. Built Task List Component (using MUI): 

  - Fetched and displayed tasks in a MUI Table.
  - Added buttons/icons for Edit and Delete actions using MUI's IconButton.
  - Implemented responsive design to hide/show columns based on screen width.

5. Created Task Form Component:

  - Built a form using basic HTML elements to handle both creating and editing tasks.
  - Used useState to manage form data. 
  - Included validation (using the required attribute).

6. Added Tailwind CSS and MUI components.

  - Followed the Vite Tailwind CSS setup.
  - Used the Table UI component from MUI.
  - Styled our custom Window.
  - Implemented the form field components from MUI.
  - Added validation.
  - Split the TaskLists view into 3 sub-sections, each one for a specific status.

7. Added reducer/actions for State Management.
   
  - Modified the state management to using reducer/actions.
  - Also ensured that the state management included 3 arrays for tracking tasks under each status.
  - TODO: I need to add more documentation to the reducer section so it is more readable.

8. Dark/Light Modes.

  - For now, the MUI table is able to toggle between dark and light mode, but it is a simple implementation. Perhaps not the most effective. With a little more time, it can definitely be achieved.
  - Created simple CSS classes in `global.css` so that we can easily insert the right class into the relevant components and tags.

9.  Using `localStorage` for unique user sessions.

  - Added `localStorage` for tracking the selected theme
  - The sample data used in `db.json` is now ported over for initialSeeding of the storage.


## Key Observations and Decisions:

### Styling Approach:

- I've opted to use Tailwind CSS for overall layout and text styling, as it provides a rapid development workflow and good control over spacing, colors, and typography.
- I've decided to use pre-built MUI components for our Buttons, Tables and so on.

- **Important Note:** I've observed that Tailwind CSS classes might not always work as expected when applied directly to some MUI components. To maintain styling consistency and avoid conflicts, I'll use Tailwind CSS primarily for outer layout styling and rely on MUI's styling mechanisms (e.g., the sx prop, custom themes) for styling within MUI components.

### Functionality Choices:

- **Prioritizing Core Features**: Given the time constraints of this assignment, I focused on delivering a solid foundation with core CRUD (Create, Read, Update, Delete) functionality for tasks. This involved building a user-friendly Task List and Task Form.
- **Local Storage for Persistence (Unique User Sessions)**: To provide a basic level of data persistence and simulate unique user sessions, I implemented localStorage to store task data. This approach avoids the need for a full backend database setup, which would have exceeded the scope of this assignment. 
- **Dark and Light Theme**: To enhance the user experience, I implemented a dark and light theme switcher, allowing users to customize their visual preference. This feature leverages CSS variables and conditional class names for efficient theme toggling.

### Collaboration and Future Enhancements:

- **Accelerated Development with Gemini**: I collaborated with Gemini, a large language model, to significantly speed up the development process. Gemini assisted in generating code snippets, suggesting solutions, and identifying potential issues. I maintained a hands-on approach, thoroughly testing and modifying the generated code to ensure its correctness and alignment with best practices.
- **Drag-and-Drop and Filtering (Future Considerations)**: While time constraints prevented me from implementing advanced features like drag-and-drop task management and filtering within the Task List, I recognize their value and plan to explore them in future iterations of this project.