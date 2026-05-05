
const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'caddaxis_db'
    });

    try {
        console.log("Checking Schema Updates...");

        // 1. Add progress column to students
        const [studentCols] = await connection.query("SHOW COLUMNS FROM students LIKE 'progress'");
        if (studentCols.length === 0) {
            await connection.query("ALTER TABLE students ADD COLUMN progress INT DEFAULT 0");
            console.log("✅ Added 'progress' to students table.");
        }

        // 2. Create live_classes table
        const createLiveClasses = `
            CREATE TABLE IF NOT EXISTS live_classes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_name VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                class_date DATE NOT NULL,
                class_time VARCHAR(20),
                duration_minutes INT DEFAULT 60,
                meeting_link VARCHAR(500),
                platform VARCHAR(50) DEFAULT 'Zoom',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createLiveClasses);
        console.log("✅ Verified 'live_classes' table.");

        // 3. Create recorded_sessions table
        const createRecorded = `
            CREATE TABLE IF NOT EXISTS recorded_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_name VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                recorded_date DATE,
                duration_minutes INT DEFAULT 60,
                video_url VARCHAR(500),
                thumbnail_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createRecorded);
        console.log("✅ Verified 'recorded_sessions' table.");

        // 4. Create exam_results table (Verify it exists)
        const createExamResults = `
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
        `;
        await connection.query(createExamResults);
        console.log("✅ Verified 'exam_results' table.");

    } catch (err) {
        console.error("❌ Schema Update Error:", err);
    } finally {
        await connection.end();
    }
}

updateSchema();
