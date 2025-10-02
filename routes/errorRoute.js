const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to intentionally trigger a server error (500)
router.get("/trigger", errorController.trigger500)

module.exports = router
