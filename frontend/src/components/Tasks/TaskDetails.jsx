import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formateDate';
import TaskForm from './TaskForm';

const TaskDetails = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTaskById(projectId, taskId);
        setTask(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [projectId, taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(projectId, taskId, {
        ...task,
        status: newStatus,
        ...(newStatus === 'completed' ? { completedAt: new Date() } : {}),
      });
      setTask(updatedTask);
    } catch (err) {
        console.error('Failed to update task status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      setLoading(true);
      await deleteTask(projectId, taskId);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTask(updatedTask);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    const statusColors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
    };
    
    const statusLabels = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'completed': 'Completed',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}>
        {statusLabels[task.status]}
      </span>
    );
  };

  if (loading && !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <TaskForm 
          projectId={projectId} 
          task={task}
          onTaskUpdated={handleTaskUpdated}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Task Details</h1>
        
        <div className="flex space-x-2">
          {confirmDelete ? (
            <>
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                Confirm Delete
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={loading}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} disabled={loading}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <div className="flex items-center mt-1 space-x-2">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">
              Created: {formatDate(task.createdAt)}
            </span>
            {task.completedAt && (
              <span className="text-sm text-gray-500">
                Completed: {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
        </div>
        
        {task.status !== 'completed' && (
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              {task.status === 'not-started' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('in-progress')} 
                  disabled={loading}
                >
                  Start Task
                </Button>
              )}
              {task.status === 'in-progress' && (
                <Button 
                  variant="success" 
                  onClick={() => handleStatusChange('completed')} 
                  disabled={loading}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskDetails;