const mysql = require("mysql2");
const dotenv = require("dotenv").config();


const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  port: process.env.DBPORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log("Database connected successfully");
  connection.release();
});

module.exports = pool;
