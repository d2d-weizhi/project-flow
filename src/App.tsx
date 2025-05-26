import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TaskList from './components/TaskList/TaskList';
import Switch from '@mui/material/Switch';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <div className={`w-screen h-screen p-16 min-w-[360px] ${theme}-theme`}> 
        <div style={{ position: 'fixed', top: 16, right: 16 }}>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
        <TaskList theme={theme} />
      </div>
    </ThemeProvider>
  );
}

export default App;
