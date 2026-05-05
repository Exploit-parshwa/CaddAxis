import mysql from 'mysql2/promise';

async function getCert() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis_db',
    });

    try {
        const [rows] = await pool.query("SELECT * FROM certificates LIMIT 1");
        console.log(rows);
    } catch(e) {
        console.log(e);
    } finally {
        await pool.end();
    }
}
getCert();
