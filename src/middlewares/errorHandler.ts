import { Context, Next } from 'hono';

// Error handling middleware
export const errorHandler = async (c: Context, next: Next) => {
  try {
    // Attempt to execute the next middleware or route handler
    await next();
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Error occurred:', error);

    // Check if the error is an instance of Error and safely access its properties
    let message = 'An unexpected error occurred';
    if (error instanceof Error) {
      message = error.message;
    }

    // Return a standardized error response
    return c.json({
      message: message,
      error: message || 'Unknown error'
    }, 500); // 500 Internal Server Error
  }
};
