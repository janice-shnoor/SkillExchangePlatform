import { 
    createExchangeRequest,
    getReceivedRequests,
    getSentRequests,
    acceptExchangeRequest,
    rejectExchangeRequest,
    cancelExchangeRequest,
 } from '../services/exchangeRequestService.js'

export async function createRequest(req, res, next) {
  try {
    const request = await createExchangeRequest(
      req.user.sub,
      req.body
    )

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully',
      request,
    })
  } catch (error) {
    next(error)
  }
}

export async function getReceived(req, res, next) {
  try {
    const requests = await getReceivedRequests(req.user.sub)

    res.status(200).json({
      success: true,
      requests,
    })
  } catch (error) {
    next(error)
  }
}

export async function getSent(req, res, next) {
  try {
    const requests = await getSentRequests(req.user.sub)

    res.status(200).json({
      success: true,
      requests,
    })
  } catch (error) {
    next(error)
  }
}

export async function acceptRequest(req, res, next) {
  try {
    const request = await acceptExchangeRequest(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      message: 'Exchange request accepted',
      request,
    })
  } catch (error) {
    next(error)
  }
}

export async function rejectRequest(req, res, next) {
  try {
    const request = await rejectExchangeRequest(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      message: 'Exchange request rejected',
      request,
    })
  } catch (error) {
    next(error)
  }
}

export async function cancelRequest(req, res, next) {
  try {
    const request = await cancelExchangeRequest(
      req.params.id,
      req.user.sub
    )

    res.status(200).json({
      success: true,
      message: 'Exchange request cancelled',
      request,
    })
  } catch (error) {
    next(error)
  }
}