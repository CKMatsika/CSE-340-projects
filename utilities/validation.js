const { body, validationResult } = require('express-validator')
const utilities = require("./index")
const validation = {}

/* ******************************
 * Classification Data Validation Rules
 * ***************************** */
validation.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Classification name must be between 2 and 50 characters.')
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('Classification name cannot contain spaces or special characters.')
    ]
}

/* ******************************
 * Inventory Data Validation Rules
 * ***************************** */
validation.inventoryRules = () => {
    return [
        // Classification ID validation
        body('classification_id')
            .isInt({ min: 1 })
            .withMessage('Please select a valid classification.'),

        // Make validation
        body('inv_make')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Make is required and must be 50 characters or less.'),

        // Model validation
        body('inv_model')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Model is required and must be 50 characters or less.'),

        // Year validation
        body('inv_year')
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage('Please provide a valid year between 1900 and next year.'),

        // Price validation
        body('inv_price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number.'),

        // Description validation
        body('inv_description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters.'),

        // Image path validation
        body('inv_image')
            .optional()
            .isLength({ max: 255 })
            .withMessage('Image path cannot exceed 255 characters.'),

        // Thumbnail path validation
        body('inv_thumbnail')
            .optional()
            .isLength({ max: 255 })
            .withMessage('Thumbnail path cannot exceed 255 characters.'),

        // Miles validation
        body('inv_miles')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Mileage must be a non-negative number.'),

        // Color validation
        body('inv_color')
            .optional()
            .isLength({ max: 50 })
            .withMessage('Color cannot exceed 50 characters.')
    ]
}

/* ******************************
 * Check validation results
 * ***************************** */
validation.checkValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArray = errors.array()
        // Store errors in res.locals for the controller to use
        res.locals.errors = errorsArray
        res.locals.validationFailed = true
        next()
    } else {
        next()
    }
}

module.exports = validation
