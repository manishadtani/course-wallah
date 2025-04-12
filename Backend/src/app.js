import express from 'express'
const app = express()
import userRoutes from './routers/auth.route.js'
import cors from 'cors'



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Your frontend URL (Vite default) or '*' for testing
    credentials: true // If you need to send cookies/auth headers
}));


    
app.use("/api/v1/auth", userRoutes)






const errorHandler = (err, req, res, next) => {
    // Log the error for the developer (server console pe dikhega)
    // In production, you might want more sophisticated logging (e.g., to a file)
    console.error('ERROR STACK: ', err.stack); // Log the stack trace for debugging
    console.error('ERROR MESSAGE: ', err.message); // Log just the message

    // Use the statusCode from our custom error if it exists, otherwise default to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Use the status from our custom error ('fail' or 'error') if it exists, otherwise determine based on statusCode
    const status = err.status || (statusCode >= 500 ? 'error' : 'fail');

    // Send a structured JSON error response to the client (frontend)
    res.status(statusCode).json({
        success: false, // Indicate the request failed
        status: status, // 'fail' for client errors (4xx), 'error' for server errors (5xx)
        message: err.message || 'Something went wrong on the server!', // Send the error message
        // Optional: In development mode, you might want to send the stack trace too
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Register the error handler middleware with Express
app.use(errorHandler);





export default app