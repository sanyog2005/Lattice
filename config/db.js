const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    // Using 127.0.0.1 instead of localhost avoids the IPv6 conflict
    host: process.env.DB_HOST || "127.0.0.1", 
    user: process.env.DB_USER || "root",
    // Adding || "" ensures it sends an empty string if the .env key is blank
    password: process.env.DB_PASSWORD || "", 
    database: process.env.DB_NAME || "bookings",
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0,
    dateStrings: true,
    timezone: "Z"
});

// --- ADD THIS TEST BLOCK ---
// This will tell you EXACTLY if the connection works when you start the server
pool.getConnection()
    .then((connection) => {
        console.log(`✅ DB Connected Successfully to: ${process.env.DB_NAME} || "bookings"`);
        connection.release(); // Release it back to the pool
    })
    .catch((err) => {
        console.error('❌ Database Connection Failed:', err.message);
    });

// Export the pool directly
module.exports = pool;