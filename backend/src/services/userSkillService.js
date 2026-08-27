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

export async function removeUserSkill(userId, skillId, type) {
  return prisma.userSkill.delete({
    where: {
      userId_skillId_type: {
        userId,
        skillId,
        type,
      },
    },
  })
}