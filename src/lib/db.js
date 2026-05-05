import mysql from 'mysql2/promise';

let pool;

if (!global.mysqlPool) {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'caddaxis_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

    // Enforce SSL in Production ONLY if explicitly enabled (e.g. AWS RDS)
    if (process.env.NODE_ENV === 'production' && process.env.DB_SSL === 'true') {
        dbConfig.ssl = { rejectUnauthorized: true };
    }

    try {
        global.mysqlPool = mysql.createPool(dbConfig);
    } catch (e) {
        console.error("CRITICAL: Database Connection Failed", e);
        // Fail hard if critical DB is missing in production? 
        // Or let it retry. Pool doesn't connect immediately, so error might be later.
    }
}

pool = global.mysqlPool;

export default pool;
