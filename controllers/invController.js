const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0]?.classification_name || ""
    return res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    return next(error)
  }
}

/* ***************************
 *  Build inventory detail view by inv id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getVehicleById(invId)
    if (!vehicle) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }
    const detail = await utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`
    return res.render("./inventory/detail", { title, nav, detail })
  } catch (error) {
    return next(error)
  }
}

module.exports = invCont
