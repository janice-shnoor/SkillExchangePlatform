import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from '../utils/errors.js'

export function authenticate(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    req.user = payload

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export function authorize(...roles) {
  return (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : next(new AppError('Forbidden', 403, 'FORBIDDEN'))
}