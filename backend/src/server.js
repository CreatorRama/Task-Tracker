import express from 'express';
import cors from 'cors';
import config from './config/default.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import errorHandler from './utils/errorHandler.js';

// Initialize express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

