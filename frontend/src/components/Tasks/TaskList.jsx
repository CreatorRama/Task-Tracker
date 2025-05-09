import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTasks } from '../../services/taskService';
import { getProjectById } from '../../services/projectService';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';

const TaskList = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      const tasksData = await getTasks(projectId); // Uses updated service
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  fetchProjectAndTasks();
}, [projectId]);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  const filteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => task.status !== 'Completed');
      case 'completed':
        return tasks.filter(task => task.status === 'Completed');
      default:
        return tasks;
    }
  };

  if (loading) {
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

  return (
    <div className="p-6">
      {project && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'primary' : 'outline'} 
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={filter === 'completed' ? 'primary' : 'outline'} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        
        <Button variant="primary" onClick={() => setShowTaskForm(!showTaskForm)}>
          {showTaskForm ? 'Cancel' : 'Add Task'}
        </Button>
      </div>
      
      {showTaskForm && (
        <Card className="mb-6">
          <TaskForm 
            projectId={projectId} 
            onTaskCreated={handleTaskCreated} 
            onCancel={() => setShowTaskForm(false)}
          />
        </Card>
      )}
      
      {filteredTasks().length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks().map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              projectId={projectId}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;