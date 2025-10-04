// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validation = require("../utilities/validation")
const utilities = require("../utilities/")

// Route to build inventory detail view by make, model, year
router.get("/detail/:invMake/:invModel/:invYear", invController.buildByCompositeKey)

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build management view (protected for Employee/Admin)
router.get("/", utilities.requireEmployeeOrAdmin, invController.buildManagement)

// Route to build add classification view (protected for Employee/Admin)
router.get("/add-classification", utilities.requireEmployeeOrAdmin, invController.buildAddClassification)

// Route to build add inventory view (protected for Employee/Admin)
router.get("/add-inventory", utilities.requireEmployeeOrAdmin, invController.buildAddInventory)

// Route to process add classification with validation (protected for Employee/Admin)
router.post("/add-classification",
    utilities.requireEmployeeOrAdmin,
    validation.classificationRules(),
    validation.checkValidation,
    invController.addClassification
)

// Route to process add inventory with validation (protected for Employee/Admin)
router.post("/add-inventory",
    utilities.requireEmployeeOrAdmin,
    validation.inventoryRules(),
    validation.checkValidation,
    invController.addInventory
)

module.exports = router
