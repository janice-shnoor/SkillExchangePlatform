export const validate = schema => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  })

  if (!result.success) {
    const errors = result.error.flatten()

    const message =
      errors.fieldErrors.body?.[0] ||
      errors.fieldErrors.params?.[0] ||
      errors.fieldErrors.query?.[0] ||
      'Please check the entered information.'

    return res.status(422).json({
      success: false,
      message,
      errors,
    })
  }

  req.validated = result.data
  next()
}