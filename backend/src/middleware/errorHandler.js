export const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  // Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target || ['field'];
    return res.status(409).json({
      success: false,
      message: `A record with this ${fields} already exists.`,
      error: 'DUPLICATE_ENTRY'
    });
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested resource was not found.',
      error: 'NOT_FOUND'
    });
  }

  // Zod Validation Error
  if (err.name === 'ZodError') {
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(422).json({
      success: false,
      message: details[0]?.message || 'Validation failed.',
      error: 'VALIDATION_ERROR',
      details
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: 'UNAUTHORIZED'
    });
  }

  // Multer Error
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      error: 'UPLOAD_ERROR'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    error: err.errorCode || 'INTERNAL_SERVER_ERROR'
  });
};
