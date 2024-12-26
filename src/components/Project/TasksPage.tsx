import React from 'react';
import { Typography, Box, Paper, CircularProgress, Avatar, TextField, Checkbox, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { decryptPayload } from '../../utils/crypto';
import { useTasksPage } from './hooks/useTaskPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Match the title color
    },
  },
});

interface User {
  userId: string;
  username: string;
  avatar: number;
}
export const TasksPage = () => {
  const {
    tasks,
    users,
    projectName,
    loading,
    newTaskName,
    newTaskDescription,
    addingTask,
    setNewTaskName,
    setNewTaskDescription,
    handleAddTask,
    handleToggleComplete,
  } = useTasksPage();

  const token = Cookies.get('payload');
  const userDetails: User|null = token ? decryptPayload(token) as User : null;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #EEF7FF, #FFBBA7)',
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EEF7FF, #FFBBA7)',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <Typography variant="h4" component="h1" style={{ fontWeight: 'bold', color: '#000000', marginBottom: '16px' }}>
          {projectName}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          {users.map((user) => (
            <Box key={user.userId} sx={{ width: '200px', textAlign: 'center' }}>
              <Avatar
                src={`${process.env.PUBLIC_URL}/assets/${user.avatar}.png`}
                alt={user.username}
                sx={{ width: 56, height: 56, margin: '0 auto 8px' }}
              />
              <Typography variant="h6" component="h2">
                {user.username}
              </Typography>
              {tasks
                .filter((task) => task.assignedTo === user.userId)
                .map((task) => (
                  <Paper key={task.id} sx={{ margin: '8px', padding: '8px', display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, !task.completed)}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{task.title}</Typography>
                      <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                    </Box>
                  </Paper>
                ))}
              {userDetails && userDetails.userId === user.userId && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                  <TextField
                    label="Task Name"
                    variant="outlined"
                    size="small"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    sx={{ marginBottom: '8px' }}
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    size="small"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    sx={{ marginBottom: '8px' }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleAddTask(user.userId)}
                    disabled={addingTask === user.userId}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};