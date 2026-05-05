-- ==================================================================================
-- CADDAXIS FRANCHISE SYSTEM - MASTER DATABASE SCHEMA (V1.1)
-- ARCHITECT: Antigravity (Google Deepmind / Advanced Agentic Coding)
-- DATE: 2026-01-09
-- UPDATED: Added 'students' table definition as it was missing.
-- ==================================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------------
-- 1. FRANCHISES TABLE
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS franchises (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    reg_number VARCHAR(50) UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'PENDING',
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    address TEXT,
    wallet_balance INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------------
-- 2. STUDENTS TABLE (CORE ENITY)
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    course VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    fee_total INT DEFAULT 0,
    fee_paid INT DEFAULT 0,
    
    -- Franchise Fields (Added directly in Create to be safe)
    franchise_id INT UNSIGNED DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    enquiry_source VARCHAR(50) DEFAULT 'WALK_IN',
    placement_status ENUM('OPEN', 'PLACED', 'OPT_OUT') DEFAULT 'OPEN',
    created_by_user_id INT DEFAULT NULL,
    
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL,
    INDEX idx_franchise_student (franchise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------------
-- 3. WALLET LEDGER
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wallet_ledger (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    franchise_id INT UNSIGNED NOT NULL,
    transaction_type ENUM('PURCHASE', 'ISSUE_CERT', 'ADMIN_CREDIT', 'ADMIN_DEBIT', 'REFUND') NOT NULL,
    amount_paid_inr DECIMAL(12, 2) DEFAULT 0.00,
    certificates_exchanged INT NOT NULL,
    balance_snapshot INT UNSIGNED NOT NULL,
    payment_reference_id VARCHAR(100) DEFAULT NULL,
    related_student_id INT UNSIGNED DEFAULT NULL,
    description VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE RESTRICT,
    INDEX idx_franchise_date (franchise_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------------
-- 4. CERTIFICATES
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    unique_cert_id VARCHAR(50) NOT NULL UNIQUE,
    student_id INT UNSIGNED NOT NULL,
    franchise_id INT UNSIGNED NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    verification_hash VARCHAR(64),
    pdf_url VARCHAR(255),
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    INDEX idx_unique_id (unique_cert_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------------
-- 5. AUDIT LOGS
-- ----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_type ENUM('SUPER_ADMIN', 'FRANCHISE_ADMIN', 'SYSTEM') NOT NULL,
    actor_id INT UNSIGNED NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_affected VARCHAR(100),
    details JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_actor (actor_type, actor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
