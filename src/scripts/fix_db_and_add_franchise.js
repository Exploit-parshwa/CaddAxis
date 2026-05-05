const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'caddaxis'
};

async function main() {
    console.log("🛠️ Repairing DB Schema...");
    let connection;

    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log("✅ Connected.");

        // 1. Check Franchises
        console.log("🔹 Checking 'franchises' table...");
        const [fTables] = await connection.query("SHOW TABLES LIKE 'franchises'");
        if (fTables.length === 0) {
            console.log("   Creating 'franchises' table...");
            await connection.query(`
                CREATE TABLE franchises (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    city VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
                    document_url VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB
            `);
        } else {
            console.log("   Table exists. Checking columns...");
            const [cols] = await connection.query("SHOW COLUMNS FROM franchises LIKE 'wallet_balance'");
            if (cols.length === 0) {
                console.log("   Adding 'wallet_balance' column...");
                await connection.query("ALTER TABLE franchises ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00");
            }
        }

        // 2. Check Transactions
        console.log("🔹 Checking 'transactions' table...");
        const [tTables] = await connection.query("SHOW TABLES LIKE 'transactions'");
        if (tTables.length === 0) {
            console.log("   Creating 'transactions' table...");
            // Removed FK constraint for simplicity and robustness
            await connection.query(`
                CREATE TABLE transactions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    franchise_id INT NOT NULL,
                    type ENUM('DEPOSIT', 'PURCHASE', 'ISSUE', 'REFUND') NOT NULL,
                    amount DECIMAL(10,2) DEFAULT 0.00,
                    description TEXT,
                    status VARCHAR(50) DEFAULT 'success',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB
            `);
        }

        // 3. User Setup
        console.log("🔹 Checking User: ajara@caddaxis.com");
        const [users] = await connection.query("SELECT * FROM franchises WHERE email = 'ajara@caddaxis.com'");

        if (users.length === 0) {
            console.log("   Creating user...");
            const hashedPassword = await bcrypt.hash('ajara123', 10);
            await connection.query(`
                INSERT INTO franchises (name, city, email, password_hash, wallet_balance) 
                VALUES (?, ?, ?, ?, ?)
            `, ['Ajara Training Center', 'Ajara', 'ajara@caddaxis.com', hashedPassword, 0.00]);
            console.log("✅ User created.");
        } else {
            console.log("✅ User already exists (ID: " + users[0].id + ")");
        }

        console.log("🎉 Setup Complete.");

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        if (connection) await connection.end();
    }
}

main();
