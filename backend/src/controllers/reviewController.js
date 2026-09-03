import { createReview } from '../services/reviewService.js'

export async function createReviewController(req, res, next) {
  try {
    const review = await createReview(
      req.params.exchangeId,
      req.user.sub,
      req.body.rating
    )

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    })
  } catch (error) {
    next(error)
  }
}