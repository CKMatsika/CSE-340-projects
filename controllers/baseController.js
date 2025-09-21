const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res, next){
  try {
    const nav = await utilities.getNav()
    return res.render("index", {title: "Home", nav})
  } catch (error) {
    return next(error)
  }
}

module.exports = baseController
