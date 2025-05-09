import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const { createProject, loading, projects,setProjects } = useProjects();
  const navigate = useNavigate();

  // Check if user has reached the project limit (4)
  const hasReachedLimit = projects && projects.length >= 4;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
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

  // In your handleSubmit function (CreateProject.jsx)
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm() || hasReachedLimit) return;
  
  try {
    const newProject = await createProject(formData);
    // Safely update projects state
    navigate(`/projects/${newProject._id}`);
  } catch (error) {
    console.error('Error:', error);
    setErrors({ 
      ...errors,
      general: error.response?.data?.error || 
              error.message || 
              'Failed to create project' 
    });
  }
};
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      {hasReachedLimit && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Project Limit Reached</p>
          <p>You can only have up to 4 active projects. Please delete an existing project before creating a new one.</p>
        </div>
      )}
      
      <Card>
        {errors.general && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={hasReachedLimit}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="My Awesome Project"
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={hasReachedLimit}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.description ? 'border-red-500' : ''
              } h-32`}
              placeholder="Describe your project here..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              className="mr-2"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || hasReachedLimit}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;