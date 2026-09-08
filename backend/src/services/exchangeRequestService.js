import { prisma } from '../lib/prisma.js'

export async function createExchangeRequest(
  senderId,
  { receiverId, senderSkillId, receiverSkillId }
) {
  const [sender, receiver, senderSkill, receiverSkill] =
    await Promise.all([
      prisma.user.findFirst({
        where: {
          id: senderId,
          deletedAt: null,
        },
        select: {
          id: true,
          username: true,
        },
      }),

      prisma.user.findFirst({
        where: {
          id: receiverId,
          deletedAt: null,
        },
        select: {
          id: true,
          username: true,
        },
      }),

      prisma.userSkill.findFirst({
        where: {
          id: senderSkillId,
          userId: senderId,
          type: 'OFFERED',
        },
        include: {
          skill: true,
        },
      }),

      prisma.userSkill.findFirst({
        where: {
          id: receiverSkillId,
          userId: receiverId,
          type: 'OFFERED',
        },
        include: {
          skill: true,
        },
      }),
    ])

  if (!sender || !receiver) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (senderId === receiverId) {
    const error = new Error('You cannot request an exchange with yourself')
    error.statusCode = 400
    throw error
  }

  if (!senderSkill || !receiverSkill) {
    const error = new Error('Invalid exchange skills selected')
    error.statusCode = 400
    throw error
  }

    const existingRequest = await prisma.exchangeRequest.findFirst({
    where: {
        senderId,
        receiverId,
        senderSkillId: senderSkill.skillId,
        receiverSkillId: receiverSkill.skillId,
        status: 'PENDING',
    },
    })

  if (existingRequest) {
    const error = new Error(
      'A pending request for this exchange already exists'
    )
    error.statusCode = 409
    throw error
  }

  return prisma.exchangeRequest.create({
    data: {
      senderId,
      receiverId,

      senderUsername: sender.username,
      receiverUsername: receiver.username,

      senderSkillId: senderSkill.skillId,
      senderSkillName: senderSkill.skill.name,
      senderProficiency: senderSkill.proficiency,

      receiverSkillId: receiverSkill.skillId,
      receiverSkillName: receiverSkill.skill.name,
      receiverProficiency: receiverSkill.proficiency,

      status: 'PENDING',
    },
  })
}

export async function getReceivedRequests(receiverId) {
  return prisma.exchangeRequest.findMany({
    where: {
      receiverId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getSentRequests(senderId) {
  return prisma.exchangeRequest.findMany({
    where: {
      senderId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function acceptExchangeRequest(requestId, receiverId) {
  const request = await prisma.exchangeRequest.findUnique({
    where: { id: requestId },
  })

  if (!request) {
    const error = new Error('Exchange request not found')
    error.statusCode = 404
    throw error
  }

  if (request.receiverId !== receiverId) {
    const error = new Error(
      'You are not authorized to accept this request'
    )
    error.statusCode = 403
    throw error
  }

  if (request.status !== 'PENDING') {
    const error = new Error(
      'Only pending requests can be accepted'
    )
    error.statusCode = 400
    throw error
  }

  if (
    !request.senderId ||
    !request.receiverId ||
    !request.senderSkillId ||
    !request.receiverSkillId
  ) {
    const error = new Error(
      'Exchange request is missing required information'
    )
    error.statusCode = 400
    throw error
  }

  const result = await prisma.$transaction(async (tx) => {
    const exchange = await tx.exchange.create({
      data: {
        requestId: request.id,
        userAId: request.senderId,
        userBId: request.receiverId,
        skillAId: request.senderSkillId,
        skillBId: request.receiverSkillId,
        status: 'ACTIVE',
      },
    })

    const updatedRequest = await tx.exchangeRequest.update({
      where: { id: request.id },
      data: {
        status: 'ACCEPTED',
      },
    })

    return {
      exchange,
      request: updatedRequest,
    }
  })

  return result
}

export async function rejectExchangeRequest(requestId, receiverId) {
  const request = await prisma.exchangeRequest.findUnique({
    where: {
      id: requestId,
    },
  })

  if (!request) {
    const error = new Error('Exchange request not found')
    error.statusCode = 404
    throw error
  }

  if (request.receiverId !== receiverId) {
    const error = new Error(
      'You are not authorized to reject this request'
    )
    error.statusCode = 403
    throw error
  }

  if (request.status !== 'PENDING') {
    const error = new Error(
      'Only pending requests can be rejected'
    )
    error.statusCode = 400
    throw error
  }

  return prisma.exchangeRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'REJECTED',
    },
  })
}

export async function cancelExchangeRequest(requestId, senderId) {
  const request = await prisma.exchangeRequest.findUnique({
    where: {
      id: requestId,
    },
  })

  if (!request) {
    const error = new Error('Exchange request not found')
    error.statusCode = 404
    throw error
  }

  if (request.senderId !== senderId) {
    const error = new Error(
      'You are not authorized to cancel this request'
    )
    error.statusCode = 403
    throw error
  }

  if (request.status !== 'PENDING') {
    const error = new Error(
      'Only pending requests can be cancelled'
    )
    error.statusCode = 400
    throw error
  }

  return prisma.exchangeRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'CANCELLED',
    },
  })
}