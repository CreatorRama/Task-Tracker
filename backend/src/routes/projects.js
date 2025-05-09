import express from 'express';
const router = express.Router();

import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    projectValidation
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

router
    .route('/')
    .get(protect, getProjects)
    .post(protect, projectValidation, validateRequest, createProject);

router
    .route('/:id')
    .get(protect, getProject)
    .put(protect, projectValidation, validateRequest, updateProject)
    .delete(protect, deleteProject);

export default router;