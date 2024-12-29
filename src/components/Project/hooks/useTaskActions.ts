
import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  completed: boolean;
}

export const useTaskActions = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState<string>('');
  const [editTaskDescription, setEditTaskDescription] = useState<string>('');

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskDocRef);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditTaskName(task.title);
    setEditTaskDescription(task.description);
  };

  const handleUpdateTask = async (taskId: string) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        title: editTaskName,
        description: editTaskDescription,
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, title: editTaskName, description: editTaskDescription } : task));
      setEditingTask(null);
      setEditTaskName('');
      setEditTaskDescription('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return {
    editingTask,
    editTaskName,
    editTaskDescription,
    handleDeleteTask,
    handleEditTask,
    handleUpdateTask,
    setEditTaskName,
    setEditTaskDescription,
  };
};