const Database = require('better-sqlite3');
const db = new Database('caddaxis.db');

const update = () => {
    // 1. Staff Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      role TEXT,
      phone TEXT,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // 2. Exams Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date DATETIME,
      type TEXT, -- 'theory', 'practical', 'viva'
      total_marks INTEGER,
      course_name TEXT,
      status TEXT DEFAULT 'scheduled'
    );
  `);

    // 3. Exam Results Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      exam_id INTEGER,
      marks_obtained REAL,
      grade TEXT,
      remarks TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(exam_id) REFERENCES exams(id)
    );
  `);

    // 4. Update Students Table (Add phone if missing - SQLite doesn't support ADD COLUMN IF NOT EXISTS easily, so we try/catch)
    try {
        db.exec("ALTER TABLE students ADD COLUMN phone TEXT");
    } catch (e) {
        // Column likely exists
        console.log("Column 'phone' might already exist in students");
    }

    // 5. Update Courses Table if needed (seems ok from init-db)

    console.log('Database schema updated successfully with Staff, Exams, and Results tables.');
};

update();
