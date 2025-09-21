const errorController = {}

/* ***************************
 *  Intentional 500 error trigger
 * ************************** */
errorController.trigger500 = async function (req, res, next) {
  try {
    const err = new Error("Intentional 500 error for testing")
    err.status = 500
    throw err
  } catch (error) {
    return next(error)
  }
}

module.exports = errorController
