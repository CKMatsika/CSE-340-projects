/* *****************************
*   Get all classifications
* *************************** */
async function getClassifications() {
    try {
        const data = await pool.query("SELECT * FROM classification ORDER BY classification_name")
        return data
    } catch (error) {
        console.error("getClassifications error: " + error)
        throw error
    }
}

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
*   Get inventory item by make, model, year (composite key)
* *************************** */
async function getInventoryByCompositeKey(inv_make, inv_model, inv_year) {
    try {
        const data = await pool.query(
            `SELECT i.*, c.classification_name
            FROM inventory AS i
            JOIN classification AS c ON i.classification_id = c.classification_id
            WHERE i.inv_make = $1 AND i.inv_model = $2 AND i.inv_year = $3`,
            [inv_make, inv_model, inv_year]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getInventoryByCompositeKey error: " + error)
        throw error
    }
}

module.exports = {
    addClassification,
    addInventory,
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByCompositeKey
}
