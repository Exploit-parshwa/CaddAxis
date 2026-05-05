import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis_db',
    };

    try {
        const pool = mysql.createPool(dbConfig);
        const [rows] = await pool.query("SELECT * FROM franchises");
        console.log("Franchises found:", rows.length);
        rows.forEach(r => console.log(`- ${r.name} (${r.email})`));
        await pool.end();
    } catch (e) {
        console.error("Check Failed:", e.message);
    }
}
check();
