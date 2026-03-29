require('dotenv').config();
const mysql = require('mysql2');

// Create the connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use Promises (cleaner for async/await)
const promisePool = pool.promise();

console.log('✅ Connected to Secure MySQL Instance');

module.exports = promisePool;