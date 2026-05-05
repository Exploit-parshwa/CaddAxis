
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'caddaxis_db',
};

async function run() {
    console.log("Connecting to DB...");
    const con = await mysql.createConnection(dbConfig);

    console.log("Creating/Updating Tables...");

    // Franchise Enquiries
    await con.query(`
        CREATE TABLE IF NOT EXISTS franchise_enquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            city VARCHAR(100),
            investment_capacity VARCHAR(100),
            message TEXT,
            status ENUM('new', 'contacted', 'interested', 'rejected') DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Contact Messages
    await con.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Schema Updated Successfully.");
    await con.end();
}

run().catch(console.error);
