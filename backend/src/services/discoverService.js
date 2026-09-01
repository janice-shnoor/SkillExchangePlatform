import { prisma } from '../lib/prisma.js'

export async function searchUsers(userId, { skill, type, proficiency }) {
  return prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },

      userSkills: {
        some: {
          ...(type && { type }),
          ...(proficiency && { proficiency }),
          ...(skill && {
            skill: {
              name: {
                contains: skill,
                mode: 'insensitive',
              },
            },
          }),
        },
      },
    },

    select: {
      id: true,
      name: true,
      username: true,
      userSkills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 30,
  })
}

export async function getRecommendations(userId) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userSkills: true,
    },
  })

  if (!currentUser) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const wanted = currentUser.userSkills.filter(
    (item) => item.type === 'WANTED'
  )

  const offered = currentUser.userSkills.filter(
    (item) => item.type === 'OFFERED'
  )

  if (wanted.length === 0 || offered.length === 0) {
    return []
  }

  const candidates = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },

      AND: [
        {
          userSkills: {
            some: {
              type: 'OFFERED',
              OR: wanted.map((item) => ({
                skillId: item.skillId,
                proficiency: item.proficiency,
              })),
            },
          },
        },
        {
          userSkills: {
            some: {
              type: 'WANTED',
              OR: offered.map((item) => ({
                skillId: item.skillId,
                proficiency: item.proficiency,
              })),
            },
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      username: true,
      userSkills: {
        include: {
          skill: true,
        },
      },
    },
  })

  const recommendations = candidates.map((user) => {
    const theirOffered = user.userSkills.filter(
      (item) => item.type === 'OFFERED'
    )

    const theirWanted = user.userSkills.filter(
      (item) => item.type === 'WANTED'
    )

    const wantedMatches = wanted.filter((mySkill) =>
      theirOffered.some(
        (theirSkill) =>
          theirSkill.skillId === mySkill.skillId &&
          theirSkill.proficiency === mySkill.proficiency
      )
    )

    const offeredMatches = offered.filter((mySkill) =>
      theirWanted.some(
        (theirSkill) =>
          theirSkill.skillId === mySkill.skillId &&
          theirSkill.proficiency === mySkill.proficiency
      )
    )

    const matchScore = wantedMatches.length*3 + offeredMatches.length
    const count = wantedMatches.length + offeredMatches.length

    return {
      ...user,
      count,
      _matchScore:matchScore,
    }
  })

    return recommendations
    .sort((a, b) => b._matchScore - a._matchScore)
    .slice(0, 3)
}