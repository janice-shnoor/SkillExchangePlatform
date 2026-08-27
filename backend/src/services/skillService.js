import { prisma } from '../lib/prisma.js'

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export async function createSkill(data) {
  return prisma.skill.create({
    data: {
      name: data.name,
      description: data.description || null,
    },
  })
}

export async function updateSkill(id, data) {
  return prisma.skill.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
    },
  })
}

export async function deleteSkill(id) {
  return prisma.skill.delete({
    where: { id },
  })
}