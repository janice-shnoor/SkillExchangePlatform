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

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    statusCode = 409

    const field = err.meta?.target?.[0]

    if (field === 'username') {
      message = 'Username is already taken'
    } else if (field === 'email') {
      message = 'Email is already registered'
    } else {
      message = 'This information is already in use'
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
  })
}