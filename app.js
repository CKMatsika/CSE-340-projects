const express = require("express")
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorRoute = require("./routes/errorRoute")
const bodyParser = require("body-parser")
const pool = require("./database")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * *********************** */
app.use(cookieParser())

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
    next()
})

// JWT Token Check Middleware - runs on every request
app.use(async (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        try {
            const jwt = require('jsonwebtoken')
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret')
            res.locals.accountData = decoded
        } catch (error) {
            // Token is invalid, clear it
            res.clearCookie('jwt')
            res.locals.accountData = null
        }
    } else {
        res.locals.accountData = null
    }
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Static Files
app.use(express.static("./public"))

// View Engine and Templates
app.set("view engine", "ejs")
app.use(require("express-ejs-layouts"))
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 * *********************** */
app.use("/", static)

// Account routes
app.use("/account", accountRoute)

// Inventory routes
app.use("/inv", inventoryRoute)

// Error routes (must be last)
app.use("/", errorRoute)

/* ***********************
* Local Server Information
* Values from .env (environment) file
*********************** */
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

module.exports = app
