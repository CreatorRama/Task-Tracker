import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
// import ProjectList from './components/Projects/ProjectList';
import CreateProject from './components/Projects/CreateProject';
import TaskList from './components/Tasks/TaskList';
import TaskDetails from './components/Tasks/TaskDetails';
import PrivateRoute from './components/common/PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <div className="flex flex-1">
              <Sidebar />
              
              <main className="flex-1 bg-gray-50 min-w-64">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/" element={<PrivateRoute />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    {/* <Route path="projects" element={<ProjectList />} /> */}
                    <Route path="projects/new" element={<CreateProject />} />
                    <Route path="projects/:projectId" element={<TaskList />} />
                    <Route path="projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
                  </Route>
                  
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
            
            <Footer />
          </div>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;