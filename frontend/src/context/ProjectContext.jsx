import { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await getProjects();
    setProjects(Array.isArray(data) ? data : []); // Ensure array
  } catch (err) {
    setError(err.message || 'Failed to fetch projects');
    setProjects([]); // Reset to empty array on error
  } finally {
    setLoading(false);
  }
};

  const handleCreateProject = async (projectData) => {
  try {
    setLoading(true);
    setError(null);
    const newProject = await createProject(projectData);
    setProjects(prev => [...(prev || []), newProject]); // Safe spread
    return newProject;
  } catch (err) {
    console.error('Error:', err.response?.data || err);
    setError(err.response?.data?.error || err.message || 'Failed to create project');
    throw err;
  } finally {
    setLoading(false);
  }
};

  const handleUpdateProject = async (id, projectData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await updateProject(id, projectData);
      setProjects(
        projects.map(project => project._id === id ? updatedProject : project)
      );
      return updatedProject;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProject(id);
      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    projects,
    setProjects,
    loading,
    error,
    fetchProjects,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
