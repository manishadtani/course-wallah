import express from "express";
import { getPendingInstructors, approveInstructor } from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js"; // assuming you have these

const router = express.Router();

// Get all instructors who are not approved
router.get("/pending-instructors", protect, isAdmin, getPendingInstructors);

// Approve instructor by ID
router.put("/approve-instructor/:id", protect, isAdmin, approveInstructor);

export default router;
