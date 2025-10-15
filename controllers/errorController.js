const utilities = require("../utilities/")

/* ****************************************
*  Trigger server error for testing (500)
* *************************************** */
async function trigger500(req, res, next) {
    let nav = await utilities.getNav()
    throw new Error("Intentional server error for testing purposes")
}

module.exports = {
    trigger500
}
