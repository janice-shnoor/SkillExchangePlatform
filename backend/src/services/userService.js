import { prisma } from '../lib/prisma.js'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

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
  const user = await prisma.user.findFirst({
    where: {
    id: userId,
    deletedAt: null,
  },
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
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
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
    where: {
      deletedAt: null,
    },
    select: userSelect(),
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function updateUser(id, data) {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
    },
    select: userSelect(),
  })
}

// Delete Function for Deleteing the Row
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  })
}


export async function softDeleteUser(id) {
  const deletedPasswordHash = await bcrypt.hash(
    crypto.randomBytes(32).toString('hex'),
    12
  )

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        deletedAt: true,
        avatarUrl: true,
      },
    })

    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    if (user.deletedAt) {
      const error = new Error('User is already deleted')
      error.statusCode = 400
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

    await tx.exchangeRequest.updateMany({
      where: {
        status: 'PENDING',
        OR: [
          { senderId: id },
          { receiverId: id },
        ],
      },
      data: {
        status: 'CANCELLED',
      },
    })

    await tx.exchange.updateMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { userAId: id },
          { userBId: id },
        ],
      },
      data: {
        status: 'CANCELLED',
      },
    })

    await tx.userSkill.deleteMany({
      where: {
        userId: id,
      },
    })

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: id,
      },
    })

    await tx.user.update({
      where: {
        id,
      },
      data: {
        name: 'Deleted User',
        username: `deleted_${crypto.randomBytes(11).toString('hex')}`,
        email: `${crypto.randomBytes(16).toString('hex')}@deleted.local`,
        avatarUrl: null,
        passwordHash: deletedPasswordHash,
        deletedAt: new Date(),
      },
    })

    return {
      id,
    }
  })
}

export async function updateAvatar(userId, avatarUrl) {
  const currentUser = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
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
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
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