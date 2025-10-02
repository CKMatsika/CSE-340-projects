// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validation = require("../utilities/validation")

// Route to build inventory detail view by make, model, year
router.get("/detail/:invMake/:invModel/:invYear", invController.buildByCompositeKey)

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build management view
router.get("/", invController.buildManagement)

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification)

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory)

// Route to process add classification with validation
router.post("/add-classification",
    validation.classificationRules(),
    validation.checkValidation,
    invController.addClassification
)

// Route to process add inventory with validation
router.post("/add-inventory",
    validation.inventoryRules(),
    validation.checkValidation,
    invController.addInventory
)

module.exports = router
