const express = require("express")
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const bodyParser = require("body-parser")
const session = require("express-session")
const pool = require("./database")

/* ***********************
 * Middleware
 * *********************** */
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool: pool,
    }),
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
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

/* ***********************
 * Log statement to confirm server operation
 *********************** */
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`)
})
