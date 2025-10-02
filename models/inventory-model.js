const pool = require("../database")

/* *****************************
*   Register new classification
* *************************** */
async function addClassification(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error("model error: " + error)
        throw error
    }
}

/* *****************************
*   Register new inventory item
* *************************** */
async function addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
){
    try {
        const sql = `INSERT INTO inventory (
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

        const params = [
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        ]

        const result = await pool.query(sql, params)
        return result.rows[0]
    } catch (error) {
        console.error("model error: " + error)
        throw error
    }
}

/* *****************************
*   Get all classifications
* *************************** */
async function getClassifications(){
    try {
        const result = await pool.query("SELECT * FROM classification ORDER BY classification_name")
        return result
    } catch (error) {
        console.error("model error: " + error)
        throw error
    }
}

/* *****************************
*   Get inventory by classification ID
* *************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT i.*, c.classification_name
            FROM inventory AS i
            JOIN classification AS c ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error)
        throw error
    }
}

/* *****************************
*   Get inventory item by ID
* *************************** */
async function getInventoryById(inv_id) {
    try {
        // Try with inv_id first, if that fails, try with id
        let data = await pool.query(
            `SELECT i.*, c.classification_name
            FROM inventory AS i
            JOIN classification AS c ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        // If inv_id doesn't exist, try with id column
        try {
            const data = await pool.query(
                `SELECT i.*, c.classification_name
                FROM inventory AS i
                JOIN classification AS c ON i.classification_id = c.classification_id
                WHERE i.id = $1`,
                [inv_id]
            )
            return data.rows[0]
        } catch (secondError) {
            console.error("getInventoryById error: " + error)
            console.error("Also tried with id column: " + secondError)
            throw error
        }
    }
}

module.exports = {
    addClassification,
    addInventory,
    getClassifications,
    getInventoryByClassificationId,
    getInventoryById
}
