import { prisma } from '../lib/prisma.js'

function userSelect() {
  return {
    id: true,
    name: true,
    username: true,
    email: true,
    role: true,
    updatedAt: true,
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

  return user
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