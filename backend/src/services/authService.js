import bcrypt from 'bcrypt'
import {prisma} from '../lib/prisma.js'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export async function register({
  name, username, email, password,
}) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email is already registered')
    }
    throw new Error('Username is already taken')
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  })

  return user
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error('Invalid email or Password')
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordValid) {
    throw new Error('Invalid email or Password')
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  )

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    },
    token,
  }
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export async function changePassword(
  userId,
  currentPassword,
  newPassword
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      passwordHash: true,
    },
  })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const passwordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  )

  if (!passwordValid) {
    const error = new Error('Current password is incorrect')
    error.statusCode = 400
    throw error
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  })
}