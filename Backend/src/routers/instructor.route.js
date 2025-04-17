import express from 'express';
import { getInstructorByUsername } from '../controllers/instructor.controller.js';

const router = express.Router();

// GET /api/instructors/:username
router.get('/:username', getInstructorByUsername);

export default router;
