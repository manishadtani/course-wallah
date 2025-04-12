import express from 'express';
import {
    registerUser,
    loginUser,
    registerInstructor
} from '../controllers/auth.controller.js'; 

const router = express.Router();

// POST request to /api/v1/auth/register (Student registration)
router.post('/register', registerUser);

// POST request to /api/v1/auth/login
router.post('/login', loginUser);

// POST request to /api/v1/auth/register-instructor
router.post('/register-instructor', registerInstructor);

// Add more auth routes later if needed (e.g., forgot password, verify email)

export default router;