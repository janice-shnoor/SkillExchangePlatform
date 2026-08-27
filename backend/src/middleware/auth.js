import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

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