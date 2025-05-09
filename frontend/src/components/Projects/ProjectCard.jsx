import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { formatDate } from '../../utils/formateDate';

const ProjectCard = ({ project }) => {
  const getCompletedTasksCount = () => {
    if (!project.tasks) return 0;
    return project.tasks.filter(task => task.status === 'completed').length;
  };

  const getTotalTasksCount = () => {
    return project.tasks ? project.tasks.length : 0;
  };

  const calculateProgress = () => {
    const total = getTotalTasksCount();
    if (total === 0) return 0;
    return Math.round((getCompletedTasksCount() / total) * 100);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <Link to={`/projects/${project._id}`}>
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{getCompletedTasksCount()} / {getTotalTasksCount()} tasks completed</span>
          <span>Created: {formatDate(project.createdAt)}</span>
        </div>
      </Link>
    </Card>
  );
};

export default ProjectCard;