// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/account-controller")
const validation = require("../utilities/validation")

// Route to build login view
router.get("/login", accountController.buildLogin)

// Route to build registration view
router.get("/register", accountController.buildRegister)

// Route to process registration with validation
router.post("/register",
    validation.registationRules(),
    validation.checkValidation,
    accountController.registerAccount
)

// Route to process login
router.post("/login", accountController.loginAccount)

// Route to build account management view
router.get("/management", accountController.buildManagement)

// Route to build account update view
router.get("/update/:account_id", accountController.buildUpdate)

// Route to process account update with validation
router.post("/update/:account_id",
    validation.accountUpdateRules(),
    validation.checkValidation,
    accountController.updateAccount
)

// Route to process password update with validation
router.post("/update-password/:account_id",
    validation.passwordUpdateRules(),
    validation.checkValidation,
    accountController.updatePassword
)

// Route to process logout
router.get("/logout", accountController.logout)

module.exports = router
