const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password salt rounds (10-12 is industry standard)
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
        return
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", 'Sorry, the registration failed.')
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process login
* *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }

    try {
        // Compare password with hash
        const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)

        if (passwordMatch) {
            // Remove password from account data
            delete accountData.account_password

            // Create JWT token
            const accessToken = jwt.sign(accountData, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' })

            // Set cookie with token
            res.cookie("jwt", accessToken, {
                httpOnly: true,
                maxAge: 3600000, // 1 hour in milliseconds
                secure: process.env.NODE_ENV === 'production'
            })

            return res.redirect("/account/management")
        } else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()

    // Get account data from JWT token
    const token = req.cookies.jwt
    if (!token) {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret')
        const accountData = await accountModel.getAccountById(decoded.account_id)

        if (!accountData) {
            req.flash("notice", "Account not found.")
            return res.redirect("/account/login")
        }

        res.render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            accountData,
        })
    } catch (error) {
        req.flash("notice", "Please log in.")
        res.redirect("/account/login")
    }
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdate(req, res, next) {
    let nav = await utilities.getNav()

    // Get account data from JWT token
    const token = req.cookies.jwt
    if (!token) {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret')
        const accountData = await accountModel.getAccountById(decoded.account_id)

        if (!accountData) {
            req.flash("notice", "Account not found.")
            return res.redirect("/account/login")
        }

        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            accountData,
        })
    } catch (error) {
        req.flash("notice", "Please log in.")
        res.redirect("/account/login")
    }
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body

    // Validate that account_id is provided
    if (!account_id) {
        req.flash("notice", "Account ID is required.")
        return res.redirect("/account/management")
    }

    // Check if email already exists (but not for the current account)
    const existingEmail = await accountModel.checkExistingEmail(account_email)
    if (existingEmail) {
        // Get current account data to check if it's the same account
        const currentAccount = await accountModel.getAccountById(account_id)
        if (currentAccount.account_email !== account_email) {
            req.flash("notice", "Email address is already in use.")
            return res.redirect(`/account/update/${account_id}`)
        }
    }

    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

    if (updateResult) {
        req.flash("notice", "Account updated successfully.")

        // Update JWT token with new data
        delete updateResult.account_password
        const accessToken = jwt.sign(updateResult, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' })

        res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        })

        res.redirect("/account/management")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.redirect(`/account/update/${account_id}`)
    }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body

    // Hash the new password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error updating the password.')
        return res.redirect(`/account/update/${account_id}`)
    }

    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
        req.flash("notice", "Password updated successfully.")
        res.redirect("/account/management")
    } else {
        req.flash("notice", "Sorry, the password update failed.")
        res.redirect(`/account/update/${account_id}`)
    }
}

/* ****************************************
*  Process logout
* *************************************** */
async function logout(req, res) {
    // Clear the JWT cookie
    res.clearCookie("jwt")
    res.redirect("/")
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    loginAccount,
    buildManagement,
    buildUpdate,
    updateAccount,
    updatePassword,
    logout
}
