const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables from .env file

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // MySQL server host, fallback to localhost
  user: process.env.DB_USER || "root", // MySQL username, fallback to root
  password: process.env.DB_PASSWORD || "", // MySQL password, fallback to an empty string
  database: process.env.DB_NAME || "test", // MySQL database, fallback to test
  waitForConnections: true, // Queue connection requests if pool is full
  connectionLimit: 10, // Max number of concurrent connections
  queueLimit: 0, // Unlimited queue for connection requests
});

// Test the connection
(async () => {
  try {
    const connection = await db.getConnection(); // Attempt to get a connection
    console.log("Successfully connected to MySQL!"); // Log success message
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message); // Log specific error message
    process.exit(1); // Exit the process if unable to connect
  }
})();

module.exports = db;
