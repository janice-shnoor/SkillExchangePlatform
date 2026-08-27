import * as service from '../services/userSkillService.js'

export async function getOfferedSkills(req, res, next) {
  try {
    const skills = await service.getOfferedSkills(req.user.sub)

    res.status(200).json({
      success: true,
      skills,
    })
  } catch (e) {
    next(e)
  }
}

export async function getWantedSkills(req, res, next) {
  try {
    const skills = await service.getWantedSkills(req.user.sub)

    res.status(200).json({
      success: true,
      skills,
    })
  } catch (e) {
    next(e)
  }
}

export async function addUserSkill(req, res, next) {
  try {
    const userSkill = await service.addUserSkill(
      req.user.sub,
      req.body
    )

    res.status(201).json({
      success: true,
      userSkill,
    })
  } catch (e) {
    next(e)
  }
}

export async function removeUserSkill(req, res, next) {
  try {
    await service.removeUserSkill(
      req.user.sub,
      req.params.skillId,
      req.params.type
    )

    res.status(200).json({
      success: true,
      message: 'Skill removed',
    })
  } catch (e) {
    next(e)
  }
}