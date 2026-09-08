import bcrypt from 'bcrypt'
import crypto from 'crypto'
import {prisma} from '../lib/prisma.js'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { generateResetToken } from '../utils/passwordReset.js'
import { sendEmail } from '../lib/mailer.js'

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
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
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
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
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
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
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

export async function forgotPassword(email) {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null, },
    select: {
      id: true,
      email: true,
    },
  })

  // Do not reveal whether an account exists.
  if (!user) {
    return
  }

  const { token, tokenHash } = generateResetToken()

  // Invalidate any previous reset tokens for this user.
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  })

  const expiresAt = new Date(
    Date.now() + 60 * 60 * 1000
  )

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  })

  const resetUrl =
    `${env.FRONTEND_URL}/reset-password?token=${token}`

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your SkillExchange password',
      text: [
        'A password reset was requested for your SkillExchange account.',
        '',
        `Reset your password: ${resetUrl}`,
        '',
        'This link expires in 1 hour.',
        '',
        'If you did not request this, contact services',
      ].join('\n'),

      html: `
        <p>
          A password reset was requested for your SkillExchange account.
        </p>

        <p>
          <a href="${resetUrl}">Reset your password</a>
        </p>

        <p>This link expires in 1 hour.</p>

        <p>
          If you did not request this, contact services.
        </p>
      `,
    })
  } catch (error) {
    // The client must not learn whether the account exists
    // or whether the email provider failed.
    console.error('Password reset email failed:', error)

    // Remove the token because no reset email was successfully sent.
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    })
  }
}

export async function resetPassword({ token, newPassword }) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      usedAt: true,
      user: {
        select: {
          deletedAt: true,
        },
      },
    },
  })

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt <= new Date() ||
    resetToken.user.deletedAt
  ) {
    const error = new Error('Invalid or expired password reset token')
    error.statusCode = 400
    throw error
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        passwordHash,
      },
    }),

    prisma.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    }),
  ])
}