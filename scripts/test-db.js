const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing MySQL Connection (127.0.0.1)...');
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'caddaxis_db'
        });

        console.log('Pool created. Attempting query...');
        const [rows] = await pool.query('SELECT 1 as val');
        console.log('Connection successful. Result:', rows);
        await pool.end();
    } catch (e) {
        console.error('CRITICAL DATABASE ERROR:', e.code, e.message);
    }
}

testConnection();
