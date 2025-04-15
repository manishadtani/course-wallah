import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/user.model.js';
import createErrorResponse from '../utils/createErrorResponse.js';
import generateToken from '../utils/generateToken.js'

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin





export const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'Admin' }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(createErrorResponse('Invalid credentials or not an admin', 401));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
        success: true,
        message: "Admin login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    });
});








export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

// @desc    Approve instructor
// @route   PUT /api/admin/approve-instructor/:id
// @access  Private/Admin
export const approveInstructor = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json(createErrorResponse("User not found"));
    }

    if (user.role !== 'Instructor') {
        return res.status(400).json(createErrorResponse("User is not an Instructor"));
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "Instructor approved successfully" });
});

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json(createErrorResponse("User not found"));
    }

    await user.deleteOne(); // ✅ This works

    res.status(200).json({ message: 'User deleted successfully' });
});
