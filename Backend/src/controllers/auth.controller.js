import User from '../models/user.model.js'; // <-- Using 'user.model.js'
import generateToken from '../utils/generateToken.js'; // We still need this

import asyncHandler from '../middleware/asyncHandler.js';
import createErrorResponse from '../utils/createErrorResponse.js';


export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return next(createErrorResponse('Please provide name, email, and password', 400));
    }
    if (password.length < 6) {
         return next(createErrorResponse('Password must be at least 6 characters long', 400));
    }

    // Check if user (email) already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return next(createErrorResponse('Email address is already registered', 400));
    }

    // Create user (role defaults to 'Student')
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password // Hashing happens automatically via pre-save hook
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response directly
    res.status(201).json({ // 201 Created
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved, // Send these fields too for consistency
        brandSlug: user.brandSlug,
        token: token
    });
});


// @desc    Authenticate user (login)
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return next(createErrorResponse('Please provide email and password', 400));
    }

    // Find user by email, including password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
        return next(createErrorResponse('Invalid email or password', 401)); // 401 Unauthorized
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response directly
    res.status(200).json({ // 200 OK
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        brandSlug: user.brandSlug,
        token: token
    });
});


// @desc    Register as an Instructor (pending approval)
// @route   POST /api/v1/auth/register-instructor
// @access  Public
export const registerInstructor = asyncHandler(async (req, res, next) => {
    const { name, email, password, brandSlug } = req.body;

    // Validation (same as before)
    if (!name || !email || !password || !brandSlug) {
        return next(createErrorResponse('Please provide name, email, password, and a unique brand name', 400));
    }
     if (password.length < 6) {
        return next(createErrorResponse('Password must be at least 6 characters long', 400));
     }
     const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
     const formattedSlug = brandSlug.toLowerCase().trim();
     if (!slugRegex.test(formattedSlug)) {
         return next(createErrorResponse('Brand name can only contain lowercase letters, numbers, and hyphens, and cannot start/end with a hyphen.', 400));
     }

    // Check if email or brandSlug already exists (same as before)
    const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { brandSlug: formattedSlug }]
    });
    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            return next(createErrorResponse('Email address is already registered', 400));
        } else {
            return next(createErrorResponse(`Brand name "${formattedSlug}" is already taken. Please choose another.`, 400));
        }
    }

    // Create instructor user (same as before)
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'Instructor',
        isApproved: false,
        brandSlug: formattedSlug
    });

    // Send success message (no token needed here yet) - same as before
    res.status(201).json({
        success: true,
        message: 'Instructor registration successful! Your account is pending approval from the admin.'
    });
});




// @desc    Login Instructor
// @route   POST /api/v1/auth/login-instructor
// @access  Public
export const loginInstructor = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return next(createErrorResponse('Please provide email and password', 400));
    }

    // Find instructor
    const instructor = await User.findOne({
        email: email.toLowerCase(),
        role: 'Instructor'
    }).select('+password');

    if (!instructor) {
        return next(createErrorResponse('No instructor found with this email', 404));
    }

    // Check if approved
    if (!instructor.isApproved) {
        return next(createErrorResponse('Instructor account is pending approval from admin', 403));
    }

    // Compare password
    const isMatch = await instructor.comparePassword(password);
    if (!isMatch) {
        return next(createErrorResponse('Invalid password', 401));
    }

    // Generate token
    const token = generateToken(instructor._id, instructor.role);

    // Send response
    res.status(200).json({
        success: true,
        message: "Login successful",
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
        isApproved: instructor.isApproved,
        brandSlug: instructor.brandSlug,
        token
    });
});