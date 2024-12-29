import { addDoc, collection } from 'firebase/firestore';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../../firebaseConfig';


interface Props {
  onProjectCreated: (projectName: string) => void;
}
export const useCreateProject = ({onProjectCreated}: Props) => {
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
          users: []
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

  return {
    projectName,
    error,
    loading,
    handleProjectNameChange,
    handleKeyPress,
  };
}