import {
  getUserExchanges,
  getExchangeById,
  completeExchange,
  cancelExchange,
} from '../services/exchangeService.js'

export async function getExchanges(req, res, next) {
  try {
    const exchanges = await getUserExchanges(req.user.sub)

    res.status(200).json({
      success: true,
      exchanges,
    })
  } catch (error) {
    next(error)
  }
}

export async function getSingleExchange(req, res, next) {
  try {
    const exchange = await getExchangeById(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      exchange,
    })
  } catch (error) {
    next(error)
  }
}

export async function completeExchangeC(req, res, next) {
  try {
    const exchange = await completeExchange(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      message: 'Exchange completed successfully',
      exchange,
    })
  } catch (error) {
    next(error)
  }
}

export async function cancelExchangeC(req, res, next) {
  try {
    const exchange = await cancelExchange(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      message: 'Exchange cancelled successfully',
      exchange,
    })
  } catch (error) {
    next(error)
  }
}