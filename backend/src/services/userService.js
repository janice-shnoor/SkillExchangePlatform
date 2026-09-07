import { prisma } from '../lib/prisma.js'
import fs from 'fs/promises'
import path from 'path'

function userSelect() {
  return {
    id: true,
    name: true,
    username: true,
    avatarUrl: true,
    email: true,
    role: true,
    updatedAt: true,

    reviewsReceived: {
      select: {
        rating: true,
      },
    },
  }
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect(),
  })

  if (!user) {
    throw new Error('User not found')
  }

  const ratings = user.reviewsReceived.map(
    (review) => review.rating
  )

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) /
        ratings.length
      : null

  return {
    ...user,
    averageRating,
    totalRatings: ratings.length,
    reviewsReceived: undefined,
  }
}

export async function updateProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
    },
    select: userSelect(),
  })
}

export async function getUsers() {
  return prisma.user.findMany({
    select: userSelect(),
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
    },
    select: userSelect(),
  })
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  })
}

export async function updateAvatar(userId, avatarUrl) {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      avatarUrl: true,
    },
  })

  if (!currentUser) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl,
    },
    select: userSelect(),
  })

  if (currentUser.avatarUrl) {
    const oldFilename = path.basename(
      currentUser.avatarUrl
    )

    const oldFilePath = path.resolve(
      process.cwd(),
      'uploads/avatars',
      oldFilename
    )

    try {
      await fs.unlink(oldFilePath)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(
          'Failed to remove old avatar:',
          error
        )
      }
    }
  }

  return user
}

export async function removeAvatar(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      avatarUrl: true,
    },
  })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (user.avatarUrl) {
    const filename = path.basename(user.avatarUrl)
    const filePath = path.resolve(
      process.cwd(),
      'uploads/avatars',
      filename
    )

    try {
      await fs.unlink(filePath)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl: null,
    },
    select: userSelect(),
  })
}