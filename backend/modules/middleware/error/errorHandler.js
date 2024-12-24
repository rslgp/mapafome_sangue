// errorHandler.js
import process from 'process';

// Generic Error Handling Middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Default error details
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error (optional)
    console.error(`[Error] ${err.stack || err}`);

    // Send structured response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
    });
};

export default errorHandler;
