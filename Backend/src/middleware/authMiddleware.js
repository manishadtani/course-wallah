// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js'; // Utility for handling async errors
import createErrorResponse from '../utils/createErrorResponse.js'; // Our error factory function
// IMPORTANT: Use your lowercase model name for import
import User from '../models/user.model.js'; // To fetch user details from DB
import config from '../config/config.js'; // To get JWT_SECRET

// Middleware 1: Protect Routes (Checks if user is logged in)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for token in Authorization header
    // Format is usually "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract token from header ("Bearer " ko hata kar)
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using the secret key
            // jwt.verify throws an error if token is invalid or expired
            console.log(config.JWT_SECRET)
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // 4. Token is valid! Find the user in DB based on ID from token payload
            // We stored { id: userId, role: userRole } in the token payload (see generateToken.js)
            // `.select('-password')` ensures we don't fetch the hashed password
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Check if user still exists in DB (maybe deleted after token was issued?)
            if (!req.user) {
                return next(createErrorResponse('User belonging to this token no longer exists', 401));
            }

            // 6. User is valid and found! Attach user object to the request (`req.user`)
            // Now subsequent middleware or route handlers can access logged-in user's info.
            next(); // Proceed to the next middleware or route handler

        } catch (error) {
            // Handle JWT verification errors specifically
            console.error('JWT Error:', error.name, error.message); // Log the error for debugging
            if (error.name === 'JsonWebTokenError') {
                return next(createErrorResponse('Not authorized, token failed (invalid signature)', 401));
            }
            if (error.name === 'TokenExpiredError') {
                return next(createErrorResponse('Not authorized, token expired', 401));
            }
            // Generic fallback for other errors during verification
            return next(createErrorResponse('Not authorized, token issue', 401));
        }
    }

    // If no token found in the header at all
    if (!token) {
        return next(createErrorResponse('Not authorized, no token provided', 401));
    }
});


// Middleware 2: Authorize Roles (Checks if logged-in user has a specific role)
// Takes one or more roles as arguments (e.g., authorize('Admin'), authorize('Instructor', 'Admin'))
export const authorize = (...roles) => {
    // This returns the actual middleware function
    return (req, res, next) => {
        // IMPORTANT: This middleware should ONLY run AFTER the 'protect' middleware
        // because 'protect' attaches the `req.user` object.
        if (!req.user) {
            // This case shouldn't ideally happen if 'protect' ran first, but as a safeguard:
             return next(createErrorResponse('Authorization check failed: User not logged in.', 401));
        }

        // Check if the logged-in user's role is included in the allowed roles list
        if (!roles.includes(req.user.role)) {
            // User has a role, but it's not the required one (e.g., Student trying to access Admin route)
            return next(
                createErrorResponse(`Role '${req.user.role}' is not authorized to access this route`, 403) // 403 Forbidden
            );
        }

        // User has the required role!
        next(); // Proceed
    };
};


// Middleware 3: Specific check for Approved Instructors
// Checks role AND approval status. Useful for routes only approved instructors can access.
export const isApprovedInstructor = asyncHandler(async (req, res, next) => {
    // IMPORTANT: This should also run AFTER 'protect' middleware.
     if (!req.user) {
        return next(createErrorResponse('Authorization check failed: User not logged in.', 401));
     }

     // Check if the user is an instructor AND is approved
    if (req.user.role === 'Instructor' && req.user.isApproved) {
        next(); // User is an approved instructor, proceed
    } else if (req.user.role === 'Instructor' && !req.user.isApproved) {
        // User is an instructor but not approved yet
        return next(createErrorResponse('Account not approved by admin yet.', 403));
    } else {
        // User is not an instructor at all
        return next(createErrorResponse('User is not an instructor.', 403));
    }
});

// Example Usage (in route files later):
// router.get('/profile', protect, getUserProfile); // Only logged-in users
// router.get('/admin/users', protect, authorize('Admin'), getAllUsers); // Only Admins
// router.post('/courses', protect, isApprovedInstructor, createCourse); // Only Approved Instructors