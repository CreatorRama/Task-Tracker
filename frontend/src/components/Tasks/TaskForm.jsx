import React, { useState } from 'react';
import { createTask, updateTask } from '../../services/taskService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const TaskForm = ({ projectId, task = null, onTaskCreated, onTaskUpdated, onCancel }) => {
  // Map status values to match backend expectations
  const isEditing = !!task;
  const statusMap = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  };

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Not Started', // Match backend format
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        project: projectId, // Explicitly include project ID
        status: statusMap[formData.status] || formData.status // Convert status if needed
      };

      if (isEditing) {
        const updatedTask = await updateTask(projectId, task._id, payload);
        onTaskUpdated(updatedTask);
      } else {
        const newTask = await createTask(projectId, payload);
        onTaskCreated(newTask);
      }
    } catch (error) {
      console.error('Task submission error:', error.response?.data);
      setErrors({
        general: error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          'Failed to save task'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          {errors.general}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''
            }`}
          placeholder="Task title"
        />
        {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''
            } h-24`}
          placeholder="Task description"
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
      </div>

      {isEditing && (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;