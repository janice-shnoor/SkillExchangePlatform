import { prisma } from '../lib/prisma.js'

export async function getMessages(exchangeId, userId) {
  const exchange = await prisma.exchange.findUnique({
    where: {
      id: exchangeId,
    },
  })

  if (!exchange) {
    const error = new Error('Exchange not found')
    error.statusCode = 404
    throw error
  }

  const isParticipant =
    exchange.userAId === userId ||
    exchange.userBId === userId

  if (!isParticipant) {
    const error = new Error(
      'You are not authorized to access this exchange'
    )
    error.statusCode = 403
    throw error
  }

  return prisma.message.findMany({
    where: {
      exchangeId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export async function sendMessage(exchangeId, userId, content) {
  const exchange = await prisma.exchange.findUnique({
    where: {
      id: exchangeId,
    },
  })

  if (!exchange) {
    const error = new Error('Exchange not found')
    error.statusCode = 404
    throw error
  }

  const isParticipant =
    exchange.userAId === userId ||
    exchange.userBId === userId

  if (!isParticipant) {
    const error = new Error(
      'You are not authorized to send messages in this exchange'
    )
    error.statusCode = 403
    throw error
  }

  return prisma.message.create({
    data: {
      exchangeId,
      senderId: userId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  })
}