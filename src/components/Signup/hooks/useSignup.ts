import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { encryptPayload } from '../../../utils/crypto';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export const useSignup = (setUserDetails: React.Dispatch<React.SetStateAction<{ userId: string, username: string, avatar: number } | undefined>>) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 25) {
      setError(true);
    } else {
      setError(false);
    }
    setUsername(value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !error) {
      setLoading(true);

      const payload = {
        username: username,
        userId: uuidv4(),
        avatar: Math.floor(Math.random() * 7) + 1,
      };

      const token = encryptPayload(payload);
      Cookies.set('payload', token, { path: '/' });

      setUserDetails(payload);

      const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';
      const projectId = redirectUrl.split('/tasks/')[1];

      if (projectId) {
        try {
          const projectDocRef = doc(db, 'projects', projectId);
          await updateDoc(projectDocRef, {
            users: arrayUnion(token),
          });
        } catch (error) {
          console.error('Error adding user to project:', error);
        }
      }

      navigate(redirectUrl);
    }
  };

  return {
    username,
    error,
    loading,
    handleUsernameChange,
    handleKeyPress,
  };
};