// backend/src/utils/createErrorResponse.js

function createErrorResponse(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    return error;
}

export default createErrorResponse;