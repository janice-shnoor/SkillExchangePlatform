export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)

    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(err, req, res, next) {
  console.error(err)

  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {})
  })
}