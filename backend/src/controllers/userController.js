import * as service from '../services/userService.js'
import fs from 'fs/promises'

export async function getProfile(req, res, next) {
  try {
    const user = await service.getProfile(req.user.sub)

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    next(e)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await service.updateProfile(
      req.user.sub,
      req.body
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    next(e)
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await service.getUsers()

    res.status(200).json({
      success: true,
      users,
    })
  } catch (e) {
    next(e)
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await service.updateUser(
      req.params.id,
      req.body
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    next(e)
  }
}

export async function deleteUser(req, res, next) {
  try {
    await service.deleteUser(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User deleted',
    })
  } catch (e) {
    next(e)
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error(
        'Please select a valid image'
      )
      error.statusCode = 400
      throw error
    }

    const avatarUrl =
      `/uploads/avatars/${req.file.filename}`

    const user = await service.updateAvatar(
      req.user.sub,
      avatarUrl
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path)
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') {
          console.error(
            'Failed to clean up uploaded avatar:',
            cleanupError
          )
        }
      }
    }

    next(e)
  }
}

export async function removeAvatar(req, res, next) {
  try {
    const user = await service.removeAvatar(
      req.user.sub
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (e) {
    next(e)
  }
}