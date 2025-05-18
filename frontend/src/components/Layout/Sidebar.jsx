import React from 'react';
import { NavLink } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';

const Sidebar = () => {
  const { projects, loading } = useProjects();

  console.log("sidebar " ,projects);

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block p-2 rounded-md transition-colors duration-200 ${
                  isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`
              }
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects/new"
              className={({ isActive }) =>
                `block p-2 rounded-md transition-colors duration-200 ${
                  isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`
              }
            >
              Create Project
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        {loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : projects && projects.length > 0 ? (
          <ul className="space-y-2">
            {projects.map(project => (
              <li key={project._id}>
                <NavLink
                  to={`/projects/${project._id}`}
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition-colors duration-200 ${
                      isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`
                  }
                >
                  {project.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No projects yet</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;