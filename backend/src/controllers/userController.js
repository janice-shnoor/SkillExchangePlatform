import * as service from '../services/userService.js'

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