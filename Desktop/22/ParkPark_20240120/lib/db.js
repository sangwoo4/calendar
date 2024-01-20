var mysql = require('mysql2');
var dotenv = require('dotenv');

dotenv.config({path: './lib/.env'});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect();
module.exports = db;