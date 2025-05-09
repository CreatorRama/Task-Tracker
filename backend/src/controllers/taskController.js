import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { body } from 'express-validator';

// Validation rules
export const taskValidation = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('description').notEmpty().withMessage('Task description is required'),
  body('status').isIn(['Not Started', 'In Progress', 'Completed']).withMessage('Status must be Not Started, In Progress, or Completed'),
  body('project').notEmpty().withMessage('Project ID is required')
];

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    let query = { user: req.user.id };

    // If project ID is provided, filter by project
    if (req.query.project) {
      query.project = req.query.project;
    }

    // If status is provided, filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    console.log('Incoming task data:', req.body); // Log incoming data
    
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if project exists and belongs to user
    const project = await Project.findById(req.body.project);
    console.log('Found project:', project?._id); // Log project verification

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Make sure user owns the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add tasks to this project'
      });
    }

    const task = await Task.create(req.body);

    console.log("task created")

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
     console.error('Task creation error:', err);
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }

    // If project ID is being updated, check if new project exists and belongs to user
    if (req.body.project && req.body.project !== task.project.toString()) {
      const project = await Project.findById(req.body.project);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Make sure user owns the project
      if (project.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to move task to this project'
        });
      }
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};