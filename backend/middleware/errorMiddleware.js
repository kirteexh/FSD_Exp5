/**
 * Centralized Error Handling Middleware for Express & Mongoose
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  console.error(`❌ [Error]: ${err.name || 'Error'}: ${err.message}`);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid resource ID format: '${err.value}'. Expected a 24-character hexadecimal MongoDB ObjectId.`;
    return res.status(400).json({
      success: false,
      errorType: 'CastError',
      message
    });
  }

  // Mongoose Validation Error (e.g., missing required fields, invalid numbers)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      errorType: 'ValidationError',
      message: 'Validation failed',
      errors: messages
    });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered in database';
    return res.status(400).json({
      success: false,
      errorType: 'DuplicateKeyError',
      message
    });
  }

  // General internal server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;

