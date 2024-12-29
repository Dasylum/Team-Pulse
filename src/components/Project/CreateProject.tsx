import React from 'react';
import { TextField, CircularProgress } from '@mui/material';

import { useCreateProject } from './hooks/useCreateProject';

interface Props {
  onProjectCreated: (projectName: string) => void;
  userDetails: string | undefined;
}

export const CreateProject = ({ onProjectCreated }: Props) => {
  const { projectName, error, loading, handleProjectNameChange, handleKeyPress } = useCreateProject({ onProjectCreated });

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Enter Project Name"
        variant="outlined"
        value={projectName}
        onChange={handleProjectNameChange}
        onKeyPress={handleKeyPress}
        error={error}
        helperText={error ? 'Project name cannot exceed 25 characters' : ''}
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
    </>
  );
};