import { prisma } from '../lib/prisma.js'

export async function createReview(exchangeId, reviewerId, rating) {
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

  if (exchange.status !== 'COMPLETED') {
    const error = new Error(
      'Reviews can only be submitted for completed exchanges'
    )
    error.statusCode = 400
    throw error
  }

  const isParticipant =
    exchange.userAId === reviewerId ||
    exchange.userBId === reviewerId

  if (!isParticipant) {
    const error = new Error(
      'You are not authorized to review this exchange'
    )
    error.statusCode = 403
    throw error
  }

  const revieweeId =
    exchange.userAId === reviewerId
      ? exchange.userBId
      : exchange.userAId

  const existingReview = await prisma.review.findUnique({
    where: {
      exchangeId_reviewerId: {
        exchangeId,
        reviewerId,
      },
    },
  })

  if (existingReview) {
    const error = new Error(
      'You have already rated this exchange'
    )
    error.statusCode = 400
    throw error
  }

  return prisma.review.create({
    data: {
      exchangeId,
      reviewerId,
      revieweeId,
      rating,
    },
  })
}