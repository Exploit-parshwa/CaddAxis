
const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'caddaxis_db'
    });

    try {
        // Add reset_otp and reset_otp_expiry to student_auth
        const [columns] = await connection.query("SHOW COLUMNS FROM student_auth LIKE 'reset_otp'");
        if (columns.length === 0) {
            await connection.query("ALTER TABLE student_auth ADD COLUMN reset_otp VARCHAR(10)");
            await connection.query("ALTER TABLE student_auth ADD COLUMN reset_otp_expiry BIGINT");
            console.log("Added 'reset_otp' and 'reset_otp_expiry' to student_auth table.");
        } else {
            console.log("'reset_otp' already exists.");
        }
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        await connection.end();
    }
}

updateSchema();
