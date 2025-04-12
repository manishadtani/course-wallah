// backend/src/middleware/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
    // Ensure the function call is wrapped in a Promise
    // If it rejects (throws an error), catch it and pass to next()
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;