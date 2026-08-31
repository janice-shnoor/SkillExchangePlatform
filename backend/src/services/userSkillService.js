import { prisma } from '../lib/prisma.js'

export async function getOfferedSkills(userId) {
  return prisma.userSkill.findMany({
    where: {
      userId,
      type: 'OFFERED',
    },
    include: {
      skill: true,
    },
    orderBy: {
      skill: {
        name: 'asc',
      },
    },
  })
}

export async function getWantedSkills(userId) {
  return prisma.userSkill.findMany({
    where: {
      userId,
      type: 'WANTED',
    },
    include: {
      skill: true,
    },
    orderBy: {
      skill: {
        name: 'asc',
      },
    },
  })
}

export async function addUserSkill(userId, data) {
  return prisma.userSkill.create({
    data: {
      userId,
      skillId: data.skillId,
      type: data.type,
      proficiency: data.proficiency,
    },
    include: {
      skill: true,
    },
  })
}

export async function removeUserSkill(userId, userSkillId) {
  const userSkill = await prisma.userSkill.findUnique({
    where: {
      id: userSkillId,
    },
  })

  if (!userSkill) {
    const error = new Error('Skill not found')
    error.statusCode = 404
    throw error
  }

  if (userSkill.userId !== userId) {
    const error = new Error('You are not allowed to remove this skill')
    error.statusCode = 403
    throw error
  }

  return prisma.userSkill.delete({
    where: {
      id: userSkillId,
    },
  })
}