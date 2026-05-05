const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
    console.log("Connecting to DB...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis'
    });

    try {
        await connection.beginTransaction();

        // 1. Franchises Table
        console.log("Creating franchises table...");
        await connection.query(`
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

        // 2. Transactions Table
        console.log("Creating transactions table...");
        await connection.query(`
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

        // 3. Update Students Table (Add franchise_id)
        console.log("Updating students table...");
        const [cols] = await connection.query("SHOW COLUMNS FROM students LIKE 'franchise_id'");
        if (cols.length === 0) {
            await connection.query("ALTER TABLE students ADD COLUMN franchise_id INT DEFAULT NULL");
            await connection.query("ALTER TABLE students ADD CONSTRAINT fk_student_franchise FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL");
        }

        // 4. Update Certificates Table (Add franchise_id)
        console.log("Updating certificates table...");
        const [certCols] = await connection.query("SHOW COLUMNS FROM certificates LIKE 'franchise_id'");
        if (certCols.length === 0) {
            await connection.query("ALTER TABLE certificates ADD COLUMN franchise_id INT DEFAULT NULL");
            await connection.query("ALTER TABLE certificates ADD CONSTRAINT fk_cert_franchise FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL");
        }

        await connection.commit();
        console.log("Schema updated successfully.");
    } catch (e) {
        await connection.rollback();
        console.error("Schema update failed:", e);
    } finally {
        await connection.end();
    }
}

main();
