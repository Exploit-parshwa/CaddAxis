import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis_db',
    };

    console.log("Connecting to DB...", dbConfig.host, dbConfig.database);
    const pool = mysql.createPool(dbConfig);

    const email = 'ajara@caddaxis.com';
    const password = 'admin'; // Simple password for demo
    const name = 'CaddAxis Ajara';
    const city = 'Ajara';

    try {
        // Init table if not exists (copy from actions_franchise because we cant import it easily)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS franchises (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                wallet_balance INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Helper tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                franchise_id INT NOT NULL,
                type ENUM('DEPOSIT', 'PURCHASE', 'ISSUE', 'REFUND') NOT NULL,
                amount_inr DECIMAL(10,2) DEFAULT 0,
                certificates INT DEFAULT 0,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
            )
        `);

        // Check if exists
        const [existing] = await pool.query("SELECT * FROM franchises WHERE email = ?", [email]);
        if (existing.length > 0) {
            console.log("Franchise already exists:", existing[0]);

            // Should update password to be sure
            const newHash = await bcrypt.hash(password, 10);
            await pool.query("UPDATE franchises SET password_hash = ? WHERE id = ?", [newHash, existing[0].id]);
            console.log("Password updated to 'admin'");

            return;
        }

        const hash = await bcrypt.hash(password, 10);
        const [res] = await pool.query(
            "INSERT INTO franchises (name, city, email, password_hash, wallet_balance) VALUES (?, ?, ?, ?, 10)",
            [name, city, email, hash]
        );

        console.log("Franchise Created!", res.insertId);
        console.log(`Login: ${email}`);
        console.log(`Password: ${password}`);

        // Add initial transaction
        await pool.query(
            "INSERT INTO transactions (franchise_id, type, amount_inr, certificates, description) VALUES (?, 'DEPOSIT', 0, 10, 'Welcome Bonus')",
            [res.insertId]
        );

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

run();
