/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/")



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Error testing route
app.use("/error", errorRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  try {
    const status = err.status || 500
    const nav = await utilities.getNav()
    return res.status(status).render("error/error", {
      title: status === 404 ? "404 - Page Not Found" : "Server Error",
      status,
      message: status === 404 ? "The page you requested could not be found." : (err.message || "An unexpected error occurred."),
      nav,
    })
  } catch (renderErr) {
    // Fallback minimal error response if rendering fails
    const status = err.status || 500
    return res.status(status).send(status === 404 ? "404 Not Found" : "Internal Server Error")
  }
})