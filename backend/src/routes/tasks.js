import express from 'express';
const router = express.Router();
import  {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    taskValidation
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

router
    .route('/')
    .get(protect, getTasks)
    .post(protect, taskValidation, validateRequest, createTask);

router
    .route('/:id')
    .get(protect, getTask)
    .put(protect, validateRequest, updateTask)
    .delete(protect, deleteTask);

export default router;