import * as service from '../services/discoverService.js'

export async function searchUsers(req, res, next) {
  try {
    const results = await service.searchUsers(
    req.user.sub,
    {
        skill: req.query.skill,
        type: req.query.type,
        proficiency: req.query.proficiency,
    }
    )
    res.status(200).json({
      success: true,
      results,
    })
  } catch (e) {
    next(e)
  }
}

export async function getRecommendations(req, res, next) {
  try {
    const results = await service.getRecommendations(req.user.sub)

    res.status(200).json({
      success: true,
      results,
    })
  } catch (e) {
    next(e)
  }
}