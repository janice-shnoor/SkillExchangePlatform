import * as service from '../services/skillService.js'

export async function getSkills(req, res, next) {
  try {
    const skills = await service.getSkills()

    res.status(200).json({
      success: true,
      skills,
    })
  } catch (e) {
    next(e)
  }
}

export async function createSkill(req, res, next) {
  try {
    const skill = await service.createSkill(req.body)

    res.status(201).json({
      success: true,
      skill,
    })
  } catch (e) {
    next(e)
  }
}

export async function updateSkill(req, res, next) {
  try {
    const skill = await service.updateSkill(
      req.params.id,
      req.body
    )

    res.status(200).json({
      success: true,
      skill,
    })
  } catch (e) {
    next(e)
  }
}

export async function deleteSkill(req, res, next) {
  try {
    await service.deleteSkill(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Skill deleted',
    })
  } catch (e) {
    next(e)
  }
}