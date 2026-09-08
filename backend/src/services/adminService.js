import { prisma } from '../lib/prisma.js'

export async function getAdminOverview() {
  const [
    totalUsers,
    activeUsers,
    skills,
    exchanges,
    popularSkillGroups,
    ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
        where: {
        deletedAt: null,
        },
    }),

    prisma.skill.count(),

    prisma.exchange.count(),

    prisma.userSkill.groupBy({
        by: ['skillId'],
        _count: {
        skillId: true,
        },
        orderBy: {
        _count: {
            skillId: 'desc',
        },
        },
        take: 5,
    }),
    ])

  const skillIds = popularSkillGroups.map(
    (item) => item.skillId
  )

  const popularSkills = await prisma.skill.findMany({
    where: {
      id: {
        in: skillIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  const skillMap = new Map(
    popularSkills.map((skill) => [skill.id, skill])
  )

  const formattedPopularSkills = popularSkillGroups.map(
    (item) => ({
      id: item.skillId,
      name: skillMap.get(item.skillId)?.name,
      usageCount: item._count.skillId,
    })
  )

  return {
    stats: {
        totalUsers,
        activeUsers,
        skills,
        exchanges,
    },
    popularSkills: formattedPopularSkills,
  }
}