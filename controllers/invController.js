const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data.rows)
    let nav = await utilities.getNav()
    const className = data.rows[0]?.classification_name || "Unknown Classification"
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory detail view by inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)
    const detail = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detail,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name: null,
    })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        inv_make: null,
        inv_model: null,
        inv_year: null,
        inv_description: null,
        inv_image: null,
        inv_thumbnail: null,
        inv_price: null,
        inv_miles: null,
        inv_color: null,
        classification_id: null,
    })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body

    // Check if validation failed
    if (res.locals.validationFailed) {
        let nav = await utilities.getNav()
        return res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: res.locals.errors,
            classification_name,
        })
    }

    try {
        const result = await invModel.addClassification(classification_name)

        // Rebuild navigation to include new classification
        req.flash("notice", `Classification "${classification_name}" was successfully added.`)
        res.redirect("/inv/")
    } catch (error) {
        req.flash("notice", "Sorry, there was an error adding the classification.")
        res.status(500).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav: await utilities.getNav(),
            errors: [{ msg: "Database error occurred" }],
            classification_name,
        })
    }
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    // Check if validation failed
    if (res.locals.validationFailed) {
        const classificationList = await utilities.buildClassificationList(classification_id)
        return res.render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: res.locals.errors,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
    }

    try {
        const result = await invModel.addInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        )

        req.flash("notice", `Vehicle "${inv_make} ${inv_model}" was successfully added.`)
        res.redirect("/inv/")
    } catch (error) {
        const classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, there was an error adding the vehicle.")
        res.status(500).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: [{ msg: "Database error occurred" }],
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
    }
}

module.exports = invCont
