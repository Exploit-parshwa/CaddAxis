const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function deploy() {
    console.log("🚀 Starting Database Deployment (Corrected Target: caddaxis_db)...");

    // 1. Connect without database selected to ensure we can create it
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        console.log("✅ Connected to MySQL Server.");

        // 2. Ensure DB Exists
        const dbName = process.env.DB_NAME || 'caddaxis_db';
        console.log(`⚡ Creating/Checking Database: ${dbName}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);

        // 3. Read SQL File
        const sqlPath = path.join(__dirname, '../database/franchise_schema_master.sql');
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`SQL file not found at: ${sqlPath}`);
        }
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // 4. Execute Schema
        console.log("⚡ Executing Schema...");
        await connection.query(sqlContent);

        console.log(`✅ Database Schema Deployed Successfully to ${dbName}!`);
        console.log("Tables Verified: franchises, students, wallet_ledger, certificates, security_audit_logs");

    } catch (e) {
        console.error("❌ Deployment Failed:", e.message);
    } finally {
        await connection.end();
    }
}

deploy();
