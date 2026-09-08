import { getAdminOverview } from '../services/adminService.js'

export async function getOverview(req, res, next) {
  try {
    const overview = await getAdminOverview()

    res.status(200).json({
      success: true,
      ...overview,
    })
  } catch (error) {
    next(error)
  }
}