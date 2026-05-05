const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('caddaxis.db');

const init = async () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      duration TEXT,
      fee REAL,
      image TEXT,
      category TEXT DEFAULT 'General',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      course_id INTEGER,
      status TEXT DEFAULT 'enrolled',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unique_id TEXT UNIQUE,
      student_id INTEGER,
      student_name TEXT,
      course_name TEXT,
      issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  console.log('Tables created');

  // Seed Admin
  const adminEmail = 'admin@caddaxis.com';
  const existingAdmin = db.prepare('SELECT * FROM admins WHERE email = ?').get(adminEmail);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare('INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)').run(adminEmail, hashedPassword, 'Super Admin', 'super_admin');
    console.log('Admin seeded: admin@caddaxis.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  // Seed detailed sample data
  const student = db.prepare('SELECT * FROM students WHERE email = ?').get('student@demo.com');
  let studentId;

  if (!student) {
    const info = db.prepare('INSERT INTO students (name, email, phone) VALUES (?, ?, ?)').run('John Doe', 'student@demo.com', '9876543210');
    studentId = info.lastInsertRowid;
    console.log('Sample student created');
  } else {
    studentId = student.id;
  }

  const cert = db.prepare('SELECT * FROM certificates WHERE unique_id = ?').get('CERT-TEST-123');
  if (!cert) {
    db.prepare(`
      INSERT INTO certificates (unique_id, student_id, student_name, course_name, issue_date) 
      VALUES (?, ?, ?, ?, ?)
    `).run('CERT-TEST-123', studentId, 'John Doe', 'Full Stack Development', Date.now());
    console.log('Sample certificate created: CERT-TEST-123');
  }
};

init();
