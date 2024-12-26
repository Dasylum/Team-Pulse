import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';

import { db } from '../../firebaseConfig';

interface Props {
  onProjectCreated: (projectName: string) => void;
  userDetails: string | undefined;
}

export const CreateProject = ({ onProjectCreated, userDetails }: Props) => {
  const [projectName, setProjectName] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 25) {
      setError(true);
    } else {
      setError(false);
    }
    setProjectName(value);
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !error) {
      setLoading(true);
      try {
        // Add project to Firestore
        const createdProjectDetails = await addDoc(collection(db, 'projects'), {
          name: projectName,
          users: [userDetails]
        });

       const projectId = createdProjectDetails.id;

        // Pass the projectId to onProjectCreated
        onProjectCreated(projectId);
      } catch (err) {
        console.error('Failed to create project:', err);
      } finally {
        setLoading(false);
      }
    }
  };

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