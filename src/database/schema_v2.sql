-- Database Schema Updates for Feature Request (V2)

-- 1. Exam Types
-- Check if 'type' column exists in 'exams' first, if not add it. 
-- Since we cannot do conditional ALTER in plain SQL easily without stored procedure, 
-- we will just run ALTER and ignore "Duplicate column" error in Node logic, or use generic ADD.
ALTER TABLE exams ADD COLUMN type ENUM('online', 'offline') DEFAULT 'offline';

-- 2. Franchise Balance & Documents
ALTER TABLE franchises ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.00;

CREATE TABLE IF NOT EXISTS franchise_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    title VARCHAR(255),
    doc_type ENUM('license', 'proof', 'photo', 'other') NOT NULL,
    url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);

-- 3. Certificate Requests & Transactions
CREATE TABLE IF NOT EXISTS certificate_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    student_id INT NOT NULL,
    course_name VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    transaction_id VARCHAR(100), -- Reference to payment/deduction transaction
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    type ENUM('debit', 'credit') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    status ENUM('success', 'failed', 'pending') DEFAULT 'success',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);

-- 4. Course Enhancements
ALTER TABLE courses ADD COLUMN is_authorized BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN author_id INT DEFAULT NULL; -- NULL = Super Admin, ID = Franchise
ALTER TABLE courses ADD COLUMN base_fee DECIMAL(10,2) DEFAULT 0.00;

CREATE TABLE IF NOT EXISTS franchise_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    course_id INT NOT NULL,
    selling_price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollment_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    status ENUM('pending', 'viewed', 'implemented') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);

-- 5. Accounts / Recharge
CREATE TABLE IF NOT EXISTS recharge_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    proof_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);
