import express from 'express';
import { createCourse } from '../controllers/course.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/courses
router.post('/', protect, createCourse);

export default router;
