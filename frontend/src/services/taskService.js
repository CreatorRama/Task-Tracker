import api from '../utils/axios';

export const getTasks = async (projectId) => {
  try {
    const response = await api.get(`/tasks?project=${projectId}`);
    return response.data.data; // Match backend response structure
  } catch (error) {
    throw error.response?.data || { message: 'Could not fetch tasks' };
  }
};

export const getTaskById = async (projectId, taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not fetch task' };
  }
};

export const createTask = async (projectId, taskData) => {
  try {
  console.log(taskData)
    const response = await api.post('/tasks', { 
      ...taskData,
      project: projectId // Ensure project ID is included
    });
    return response.data.data;
  } catch (error) {
    console.error('Task creation error:', error.response?.data);
    throw error.response?.data || { message: 'Could not create task' };
  }
};

export const updateTask = async (projectId, taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not update task' };
  }
};

export const deleteTask = async (projectId, taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not delete task' };
  }
};