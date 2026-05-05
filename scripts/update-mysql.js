const mysql = require('mysql2/promise');

async function updateSchema() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'caddaxis_db'
        });

        console.log('Connected to MySQL...');

        // 1. Staff Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'Instructor',
                phone VARCHAR(20),
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Staff table checked/created.');

        // 2. Exams Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS exams (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                type VARCHAR(50) DEFAULT 'paper',
                total_marks INT DEFAULT 100,
                course_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Exams table checked/created.');

        // 3. Exam Results Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS exam_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                exam_id INT NOT NULL,
                marks_obtained DECIMAL(5,2),
                grade VARCHAR(5),
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
            )
        `);
        console.log('Exam Results table checked/created.');

        // 4. Update Students Table (Add phone if missing)
        try {
            const [columns] = await connection.query("SHOW COLUMNS FROM students LIKE 'phone'");
            if (columns.length === 0) {
                await connection.query("ALTER TABLE students ADD COLUMN phone VARCHAR(20)");
                console.log("Added 'phone' column to students table.");
            } else {
                console.log("'phone' column already exists in students table.");
            }
        } catch (err) {
            console.error("Error checking/adding phone column:", err);
        }

        // 5. Franchise Enquiries
        await connection.query(`
            CREATE TABLE IF NOT EXISTS franchise_enquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                city VARCHAR(100),
                state VARCHAR(100),
                investment_capacity VARCHAR(100),
                message TEXT,
                status VARCHAR(20) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Franchise Enquiries table checked/created.');

        // 6. Contact Messages
        await connection.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                subject VARCHAR(255),
                message TEXT,
                status VARCHAR(20) DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Contact Messages table checked/created.');

        // 7. Courses Table - Ensure it exists (it should, but just in case)
        // init-db.js created it in sqlite. 
        await connection.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                duration VARCHAR(50),
                fee VARCHAR(50),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Courses table checked/created.');

        await connection.end();
        console.log('Update Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration Failed:', err);
        process.exit(1);
    }
}

updateSchema();
