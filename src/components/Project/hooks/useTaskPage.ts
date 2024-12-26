import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { decryptPayload } from '../../../utils/crypto';
import Cookies from 'js-cookie';

interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  completed: boolean;
}

interface User {
  id: string;
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

  useEffect(() => {
    const token = Cookies.get('payload');
    if (!token) {
      navigate(`/signup?redirect=/tasks/${projectId}`);
      return;
    }

    const fetchTasksAndUsers = async () => {
      try {
        // Fetch tasks
        const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData: Task[] = [];
        tasksSnapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksData);

        // Fetch project and users
        const projectDocRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectDocRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          setProjectName(projectData.name);
          const usersData: User[] = projectData.users.map((user: string) => decryptPayload(user));
          setUsers(usersData);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching tasks and users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndUsers();
  }, [projectId, navigate]);

  const handleAddTask = async (userId: string) => {
    if (!newTaskName) return;

    setAddingTask(userId);
    try {
      const newTask = {
        name: newTaskName,
        description: newTaskDescription,
        assignedTo: userId,
        projectId,
        completed: false,
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
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