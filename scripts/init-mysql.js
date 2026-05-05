const mysql = require('mysql2/promise');

async function init() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS caddaxis_db');
    await connection.query('USE caddaxis_db');

    const tables = [
        `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        duration VARCHAR(100),
        fee DECIMAL(10, 2),
        image VARCHAR(255),
        category VARCHAR(100) DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'enquiry',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        unique_id VARCHAR(100) UNIQUE,
        student_id INT,
        student_name VARCHAR(255),
        course_name VARCHAR(255),
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
    )`
    ];

    for (const sql of tables) {
        await connection.query(sql);
    }

    console.log('Tables created successfully via MySQL.');

    // Seed Data
    const [courses] = await connection.query('SELECT * FROM courses');
    if (courses.length === 0) {
        const seedCourses = [
            ['AutoCAD Civil 3D', 'Civil infrastructure design and documentation.', '3 Months', 15000],
            ['AutoCAD Revit Architecture', 'Building Information Modeling (BIM) software.', '3 Months', 18000],
            ['AutoCAD Revit MEP', 'Mechanical, electrical, and plumbing design.', '3 Months', 18000],
            ['CAD SolidWorks', '3D design solutions for rapid creation of parts.', '3 Months', 20000],
            ['CATIA V4', 'Product design and innovation software.', '4 Months', 25000],
            ['Civil Engineering', 'Comprehensive civil engineering drafting.', '6 Months', 35000]
        ];
        const sql = 'INSERT INTO courses (title, description, duration, fee) VALUES ?';
        await connection.query(sql, [seedCourses]);
        console.log('Courses seeded.');
    }

    const [students] = await connection.query('SELECT * FROM students');
    if (students.length === 0) {
        const seedStudents = [
            ['Rahul Sharma', 'rahul@example.com', '9876543210', 'enrolled'],
            ['Priya Patel', 'priya@example.com', '8765432109', 'admitted'],
            ['Amit Kumar', 'amit@example.com', '7654321098', 'enquiry']
        ];
        await connection.query('INSERT INTO students (name, email, phone, status) VALUES ?', [seedStudents]);
        console.log('Students seeded.');
    }

    process.exit(0);
}

init().catch(err => {
    console.error(err);
    process.exit(1);
});
