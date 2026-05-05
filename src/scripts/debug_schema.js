const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis'
    });

    try {
        const [rows] = await connection.query("SHOW CREATE TABLE franchises");
        console.log("FRANCHISES SCHEMA:", rows[0]['Create Table']);
    } catch (e) {
        console.log("Franchises table likely doesn't exist or error:", e.message);
    }

    try {
        const [rows] = await connection.query("SHOW CREATE TABLE transactions");
        console.log("TRANSACTIONS SCHEMA:", rows[0]['Create Table']);
    } catch (e) {
        console.log("Transactions table likely doesn't exist.");
    }

    await connection.end();
}
main();
