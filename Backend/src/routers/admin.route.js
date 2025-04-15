import express from 'express';
const router = express.Router();

import {
    getAllUsers,
    approveInstructor,
    deleteUser,
    loginAdmin
} from '../controllers/admin.controller.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/login', loginAdmin);





// Apply protect + admin check on all routes
router.use(protect);
router.use(authorize('Admin'));





// GET all users

router.get('/users', getAllUsers);

// Approve an instructor
router.put('/approve-instructor/:id', approveInstructor);

// Delete a user
router.delete('/user/:id', deleteUser);

export default router;
