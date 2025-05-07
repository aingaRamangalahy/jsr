import { Request, Response, NextFunction } from 'express';

// Error interface for typed errors
interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Record<string, unknown>;
  path?: string;
  value?: unknown;
}

/**
 * Error handler middleware for consistent error responses
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const errorCode = err.code || 'SERVER_ERROR';
  
  console.error('Error:', {
    path: req.path,
    method: req.method,
    statusCode,
    message,
    stack: err.stack
  });
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    error: {
      message,
      code: errorCode,
      ...(err.errors && { details: err.errors })
    }
  });
};

/**
 * Not found middleware for handling non-existent routes
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
};

/**
 * Custom error class for application errors
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors?: Record<string, unknown>;
  
  constructor(
    message: string,
    statusCode = 500,
    code = 'SERVER_ERROR',
    errors?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * Create a 400 Bad Request error
   */
  static badRequest(
    message = 'Bad Request',
    code = 'BAD_REQUEST',
    errors?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 400, code, errors);
  }
  
  /**
   * Create a 401 Unauthorized error
   */
  static unauthorized(
    message = 'Unauthorized',
    code = 'UNAUTHORIZED',
    errors?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 401, code, errors);
  }
  
  /**
   * Create a 403 Forbidden error
   */
  static forbidden(
    message = 'Forbidden',
    code = 'FORBIDDEN',
    errors?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 403, code, errors);
  }
  
  /**
   * Create a 404 Not Found error
   */
  static notFound(
    message = 'Resource not found',
    code = 'NOT_FOUND',
    errors?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 404, code, errors);
  }
} 