
const pool = require('./src/lib/db').default;

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE students');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

checkSchema();
