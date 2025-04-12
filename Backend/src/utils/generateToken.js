// backend/src/utils/generateToken.js
import jwt from 'jsonwebtoken';
// Assuming your config is in backend/src/config/config.js
// Adjust path if your config file is elsewhere
import config from '../config/config.js';

const generateToken = (userId, role) => {
    // Token mein user ki ID aur role store kar rahe hain.
    // Isse baad mein middleware user ko identify kar payega.
    const payload = {
        id: userId, // User's unique MongoDB ID (_id)
        role: role   // User's role ('Student', 'Instructor', 'Admin')
    };

    // JWT_SECRET .env file se aayega (via config.js)
    // 'expiresIn' batata hai token kitne time tak valid rahega.
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '30d' // Example: 30 days validity
    });
};

export default generateToken;