import React from 'react';
import { TextField, Typography, CircularProgress, Box } from '@mui/material';
import { useSignup } from './hooks/useSignup';

interface Props {
  setUserDetails: React.Dispatch<React.SetStateAction<{ userId: string, username: string, avatar: number } | undefined>>;
}

export const Signup = ({ setUserDetails }: Props) => {
  const { username, error, loading, handleUsernameChange, handleKeyPress } = useSignup(setUserDetails);

  return (
    <Box
      sx={{
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
      <Typography variant="h3" component="h1" style={{ fontWeight: 'bold', color: '#000000' }}>
        Team Pulse
      </Typography>
      <TextField
        id="outlined-basic"
        label="Pick A Username"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
        onKeyPress={handleKeyPress}
        error={error}
        helperText={error ? 'Username cannot exceed 25 characters' : ''}
        InputProps={{
          style: {
            borderColor: '#000000',
            width: '255.18px',
            opacity: loading ? 0.5 : 1,
          },
        }}
        InputLabelProps={{
          style: {
            color: '#000000',
          },
        }}
        disabled={loading}
      />
      {loading && <CircularProgress color="primary" />}
    </Box>
  );
};