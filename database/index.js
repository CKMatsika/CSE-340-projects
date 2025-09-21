const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
const env = (process.env.NODE_ENV || "").replace(/['"]/g, "").toLowerCase()
const needsSSL =
  env === "development" ||
  process.env.DATABASE_SSL === "true" ||
  (process.env.DATABASE_URL || "").includes("render.com")

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
}

if (needsSSL) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

pool = new Pool(poolConfig)

if (env === "development") {
  // Added for troubleshooting queries during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text, error: error.message })
        throw error
      }
    },
  }
} else {
  module.exports = pool
}
