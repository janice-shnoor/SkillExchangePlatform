import * as service from '../services/authService.js'
import { env } from '../config/env.js'

export async function register(req, res, next) {
  try {
    res.status(201).json(
      await service.register(req.validated.body)
    )
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const result = await service.login(req.validated.body)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      user: result.user,
    })
  } catch (e) {
    next(e)
  }
}

export async function currUser(req, res, next) {
  try {
    const user = await service.getCurrentUser(req.user.sub)

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    next(e)
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'none',
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (e) {
    next(e)
  }
}

export async function changePassword(req, res, next) {
  try {
    await service.changePassword(
      req.user.sub,
      req.validated.body.currentPassword,
      req.validated.body.newPassword
    )

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (e) {
    next(e)
  }
}

export async function forgotPassword(req, res, next) {
  try {
    await service.forgotPassword(
      req.validated.body.email
    )

    res.status(200).json({
      success: true,
      message:
        'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (e) {
    next(e)
  }
}

export async function resetPassword(req, res, next) {
  try {
    await service.resetPassword(req.validated.body)

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (e) {
    next(e)
  }
}