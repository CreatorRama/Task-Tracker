import api from '../utils/axios';

export const getProjects = async () => {
  try {
    console.log("fsfdhkhfda");
    const response = await api.get('/projects');
    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not fetch projects' };
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not fetch project' };
  }
};

export const createProject = async (projectData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await api.post('/projects', projectData, config);
    console.log(response);
    return response?.data?.data;
  } catch (error) {
    // Special handling for project limit reached
    if (error.response?.data?.error?.includes('maximum limit')) {
      throw new Error('PROJECT_LIMIT_REACHED');
    }
    throw error.response?.data || { message: 'Could not create project' };
  }
};


export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not update project' };
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Could not delete project' };
  }
};
