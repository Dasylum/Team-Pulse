import React, { useEffect, useState } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Signup } from './components/Signup/Signup';
import { CreateProject } from './components/Project/CreateProject';
import { TasksPage } from './components/Project/TasksPage';
import Cookies from 'js-cookie';
import { decryptPayload } from './utils/crypto';
import { Typography, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Match the title color
    },
  },
});

function App() {
  const [userDetails, setUserDetails] = useState<{ username: string, avatar: number, userId: string } | undefined>();
  const [creatingProject, setCreatingProject] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decryptedPayload = decryptPayload(token);
      setUserDetails(decryptedPayload as { username: string, avatar: number, userId: string });
    }
  }, []);

  const handleCreateProjectClick = () => {
    setCreatingProject(true);
  };

  const handleProjectCreated = (projectId: string) => {
    console.log('Project created:', projectId);
    setCreatingProject(false);
    navigate(`/tasks/${projectId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          background: 'linear-gradient(135deg, #EEF7FF, #FFBBA7)',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {userDetails ? (
          <>
            <Typography variant="h4" component="h2">
              Welcome, {userDetails.username}!
            </Typography>
            {creatingProject ? (
              <CreateProject onProjectCreated={handleProjectCreated} userDetails={userDetails.userId} />
            ) : (
              <>
                <Button variant="contained" color="primary" onClick={handleCreateProjectClick}>
                  Create a New Project
                </Button>
              </>
            )}
          </>
        ) : (
          <Signup setUserDetails={setUserDetails} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tasks/:projectId" element={<TasksPage />} />
        <Route path="/signup" element={<Signup setUserDetails={() => {}} />} />
      </Routes>
    </Router>
  );
}