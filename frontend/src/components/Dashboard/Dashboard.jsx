import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { projects, loading, error, fetchProjects } = useProjects();
  console.log(projects);
  console.log(projects.data);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  console.log(projects);

  const getCompletedTasksCount = (project) => {
    
    if (!project.data) return 0;
    
    return project.data.filter(task => task.status === 'Completed').length;
  };

  const getTotalTasksCount = (project) => {
    
    return project.data ? project.count : 0;
  };

  const calculateProjectProgress = (project) => {
    const total = getTotalTasksCount(project);
    if (total === 0) return 0;
    return Math.round((getCompletedTasksCount(project) / total) * 100);
  };

  if (Array.isArray(projects) && loading) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}</h1>
        <Link to="/projects/new">
          <Button variant="primary">Create New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
            <p className="text-gray-600 mb-4">Create your first project to get started.</p>
            <Link to="/projects/new">
              <Button variant="primary">Create Project</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(projects) && projects.map(project => (
            <Link to={`/projects/${project._id}`} key={project._id} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{calculateProjectProgress(project)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateProjectProgress(project)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{getCompletedTasksCount(project)} / {getTotalTasksCount(project)} tasks completed</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;