import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TaskList from './components/TaskList/TaskList';
import Switch from '@mui/material/Switch';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

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
  const isMobilePortrait = useMediaQuery("(max-width: 720px)");

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
      <div className={`flex flex-col w-screen h-screen ${isMobilePortrait ? "p-8" : "p-16"} min-w-[360px] ${theme}-theme`}> 
        <div className="flex w-full h-max justify-end items-center">
          <div className="flex w-max h-max items-center mr-2"
            style={{
              color: theme === "light" ? "#121212" : "#fefefe"
            }}
          >
            {theme === "light" ? (<LightModeIcon />) : <DarkModeIcon />}</div>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
        <div className="flex-1 w-full justify-start items-start">
          <TaskList theme={theme} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
