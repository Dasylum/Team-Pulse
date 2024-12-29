import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, doc, addDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { decryptPayload } from '../../../utils/crypto';
import Cookies from 'js-cookie';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  completed: boolean;
}

interface User {
  userId: string;
  username: string;
  avatar: number;
}

export const useTasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [addingTask, setAddingTask] = useState<string | null>(null);

  const addUserToProject = async (projectId: string | undefined, userDetails: string | undefined) => {
    try {
      if (!projectId || !userDetails) return;

      const projectDocRef = doc(db, 'projects', projectId);
      const result = await updateDoc(projectDocRef, {
        users: arrayUnion(userDetails),
      });

      return result;
    } catch (error) {
      console.error('Error adding user to project:', error);
      throw error;
    }
  };

  const fetchTasksAndUsers = useCallback(async () => {
    try {
      if (!projectId) return;
      // Fetch project and users
      const projectDocRef = doc(db, 'projects', projectId);
      const unsubscribeProject = onSnapshot(projectDocRef, (projectDoc) => {
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          setProjectName(projectData.name);
          const usersData: User[] = projectData.users.map((user: string) => decryptPayload(user));
          setUsers(usersData);
        } else {
          console.error('No such document!');
        }
      });
  
      // Listen for real-time updates on tasks
      const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
      const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksData);
      });
  
      return () => {
        unsubscribeProject();
        unsubscribeTasks();
      };
    } catch (error) {
      console.error('Error fetching tasks and users:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);
  
  useEffect(() => {
    const token = Cookies.get('payload');
    if (!token) {
      navigate(`/signup?redirect=/tasks/${projectId}`);
      return;
    } else {
        //Separate userAdding to project API call from creating project API call
      setLoading(true);
      try {
        addUserToProject(projectId, token).then((res) => {
            setLoading(false)
            fetchTasksAndUsers();
        });
      } catch (err) {
        console.error('Failed to create project:', err);
      } finally {
        setLoading(false);
      }
    }

    

  }, [projectId, navigate, fetchTasksAndUsers]);

  const handleAddTask = async (userId: string) => {
    if (!newTaskName) return;

    setAddingTask(userId);
    try {
      const newTask = {
        title: newTaskName,
        description: newTaskDescription,
        assignedTo: userId,
        projectId,
        isDone: false,
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { id: docRef.id, title: newTaskName, description: newTaskDescription, assignedTo: userId, completed: false }]);
      setNewTaskName('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setAddingTask(null);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, { completed });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, completed } : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return {
    tasks,
    setTasks, 
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
  };
};