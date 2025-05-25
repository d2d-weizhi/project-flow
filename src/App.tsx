import { useState, useEffect } from 'react';
import TaskList from './components/TaskList/TaskList';
import Switch from '@mui/material/Switch';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Default to light theme if none is stored
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever the theme changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`w-screen h-screen p-16 min-w-[700px] ${theme}-theme`}> 
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <Switch checked={theme === 'dark'} onChange={toggleTheme} />
      </div>
      <TaskList theme={theme} />
    </div>
  );
}

export default App;
