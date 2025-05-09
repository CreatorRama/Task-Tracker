import express from 'express';
const router = express.Router();
import {
    register,
    login,
    registerValidation,
    loginValidation
} from '../controllers/authController.js'

import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
// router.get('/me', protect, getMe);

export default router;
