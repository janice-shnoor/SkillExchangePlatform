import multer from 'multer'

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

  // Multer upload errors
  if (err instanceof multer.MulterError) {
    statusCode = 400

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image must be 5 MB or smaller'
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Only JPG, PNG images are allowed'
    } else {
      message = 'Invalid image upload'
    }
  }

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