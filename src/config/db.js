const { Pool } = require("pg");

module.exports = new Pool({
    user: 'mauror',
    password: 'launchbase',
    host: "localhost",
    port: 5432,
    database: "foodfy"
})