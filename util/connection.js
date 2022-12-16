const mysql = require("mysql2");
require('dotenv').config();

// connect the database
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER, // from .env
    password: process.env.DB_PASSWORD, // from .env
    database: 'team'
});

module.exports = db;