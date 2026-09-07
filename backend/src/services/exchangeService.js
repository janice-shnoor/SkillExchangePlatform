import { prisma } from '../lib/prisma.js'

export async function getUserExchanges(userId) {
  return prisma.exchange.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
    },
    include: {
      userA: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          name: true,
        },
      },
      userB: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          name: true,
        },
      },
      skillA: true,
      skillB: true,
      reviews: {
        where: { reviewerId: userId },
        select: { rating: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getExchangeById(exchangeId, userId) {
  const exchange = await prisma.exchange.findUnique({
    where: {
      id: exchangeId,
    },
    include: {
      userA: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          name: true,
        },
      },
      userB: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          name: true,
        },
      },
      skillA: true,
      skillB: true,
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

  return exchange
}

export async function completeExchange(exchangeId, userId) {
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
      'You are not authorized to complete this exchange'
    )
    error.statusCode = 403
    throw error
  }

  if (exchange.status !== 'ACTIVE') {
    const error = new Error(
      'Only active exchanges can be completed'
    )
    error.statusCode = 400
    throw error
  }

  return prisma.exchange.update({
    where: {
      id: exchangeId,
    },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })
}

export async function cancelExchange(exchangeId, userId) {
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
      'You are not authorized to cancel this exchange'
    )
    error.statusCode = 403
    throw error
  }

  if (exchange.status !== 'ACTIVE') {
    const error = new Error(
      'Only active exchanges can be cancelled'
    )
    error.statusCode = 400
    throw error
  }

  return prisma.exchange.update({
    where: {
      id: exchangeId,
    },
    data: {
      status: 'CANCELLED',
      completedAt: new Date(),
    },
  })
}