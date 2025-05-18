import React, { useState } from 'react';
import { updateTask, deleteTask } from '../../services/taskService';
import Card from '../common/Card';
import Button from '../common/Button';
import TaskForm from './TaskForm';
import { formatDate } from '../../utils/formateDate';

const TaskCard = ({ task, projectId, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  console.log(task);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(projectId, task._id, {
        ...task,
        status: newStatus,
      });
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Failed to update task status:', error);
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
      await deleteTask(projectId, task._id);
      onTaskDeleted(task._id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
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

  if (isEditing) {
    return (
      <Card>
        <TaskForm 
          projectId={projectId} 
          task={task} 
          onTaskUpdated={updatedTask => {
            onTaskUpdated(updatedTask);
            setIsEditing(false);
          }} 
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start ">
       
        <div>
          <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
          <p className="text-gray-600 mb-2" style={{whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{task.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {getStatusBadge()}
            <span className="text-xs text-gray-500">
              Created: {formatDate(task.createdAt)}
            </span>
            {task.completedAt && (
              <span className="text-xs text-gray-500">
                Completed: {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {confirmDelete ? (
            <>
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={loading}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              {
                task.status !== 'Completed' &&
                <Button variant="outline" onClick={() => setIsEditing(true)} disabled={loading}>
                Edit
              </Button>
              }
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      {task.status === 'Completed' && 
      <div className='text-green-500'>Completed</div>
      }
      {task.status !== 'completed' && (
        <div className="mt-4 border-t pt-4">
          <div className="flex space-x-2">
            {task.status === 'Not Started' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('In Progress')} 
                disabled={loading}
              >
                Start Task
              </Button>
            )}
            {task.status === 'In Progress' && (
              <Button 
                variant="success" 
                onClick={() => handleStatusChange('Completed')} 
                disabled={loading}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;