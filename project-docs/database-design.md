# 🗄️ Database Design Document
## CADD Axis — Complete Schema Analysis & Design
**Version:** 2.0 | **Date:** March 10, 2026 | **Engine:** MySQL 8.0

---

## 1. Database Overview

| Property | Value |
|---|---|
| **Database Name** | `caddaxis_db` |
| **Engine** | InnoDB (with Foreign Key support) |
| **Character Set** | utf8mb4 / utf8mb4_unicode_ci |
| **Total Tables** | 18 (core: 6, V2 extensions: 8, support: 4) |
| **Primary ORM** | None (raw SQL via mysql2/promise) |

---

## 2. All Tables

### 2.1 `students` — Core Entity

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Unique student ID |
| `name` | VARCHAR(255) | NOT NULL | Full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| `phone` | VARCHAR(50) | - | Contact number |
| `course` | VARCHAR(255) | - | Enrolled course name (denormalized) |
| `status` | VARCHAR(50) | DEFAULT 'enquiry' | Lifecycle: `enquiry` → `enrolled` → `completed` |
| `fee_total` | DECIMAL(10,2) | DEFAULT 0 | Total course fee |
| `fee_paid` | DECIMAL(10,2) | DEFAULT 0 | Amount paid so far |
| `franchise_id` | INT | DEFAULT NULL, FK → franchises(id) | Owning franchise (NULL = HQ direct) |
| `alternative_phone` | VARCHAR(50) | - | Secondary contact |
| `address` | TEXT | - | Student's full address |
| `proofs` | TEXT | - | JSON or CSV of uploaded ID proofs |
| `progress` | INT | DEFAULT 0 | Course completion percentage (0-100) |
| `password` | VARCHAR(255) | - | Legacy field (deprecated, use student_auth) |
| `joined_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |

**Indexes:** `franchise_id` (for franchise-scoped queries)

---

### 2.2 `student_auth` — Authentication Credentials

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Auth record ID |
| `student_id` | INT | NOT NULL, FK → students(id) ON DELETE CASCADE | Linked student |
| `email` | VARCHAR(255) | NOT NULL | Login email |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash |
| `reset_otp` | VARCHAR(10) | - | 6-digit OTP for password reset |
| `reset_otp_expiry` | BIGINT | - | OTP expiry timestamp (Unix ms) |
| `last_login` | TIMESTAMP | - | Last successful login |

**Relationship:** One-to-One with `students`

---

### 2.3 `courses` — Course Catalog

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Course ID |
| `title` | VARCHAR(255) | - | Display name (e.g., "AutoCAD Civil 3D") |
| `slug` | VARCHAR(255) | UNIQUE | URL-safe identifier |
| `description` | TEXT | - | Rich text course description |
| `duration` | VARCHAR(100) | - | E.g., "3 Months" |
| `fee` | DECIMAL(10,2) | - | Standard fee in INR |
| `image_url` | VARCHAR(500) | - | Poster/thumbnail image path |
| `syllabus` | TEXT | - | Markdown-formatted syllabus |
| `tag` | VARCHAR(100) | - | Category: CIVIL / MECHANICAL / ARCHITECTURAL |
| `is_authorized` | BOOLEAN | DEFAULT FALSE | Whether super admin has approved |
| `author_id` | INT | DEFAULT NULL | NULL = Super Admin created |
| `base_fee` | DECIMAL(10,2) | DEFAULT 0 | Minimum fee before franchise markup |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

---

### 2.4 `payments` — Fee Payments

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Payment ID |
| `student_id` | INT | FK → students(id) | Linked student |
| `amount` | DECIMAL(10,2) | NOT NULL | Payment amount in INR |
| `payment_method` | VARCHAR(50) | - | Cash / UPI / Bank Transfer / Online |
| `payment_date` | DATE | - | Date of payment |
| `receipt_number` | VARCHAR(100) | UNIQUE | Auto-generated: `RCP-{timestamp}-{random}` |
| `notes` | TEXT | - | Admin notes on payment |

**Trigger:** On INSERT, also runs `UPDATE students SET fee_paid = fee_paid + amount WHERE id = student_id` (in transaction)

---

### 2.5 `certificates` — Issued Certificates

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Certificate record ID |
| `student_name` | VARCHAR(255) | - | Name printed on cert (denormalized) |
| `course_name` | VARCHAR(255) | - | Course name on cert |
| `unique_id` | VARCHAR(100) | UNIQUE | Verification code (e.g., "CERT-2026-0042") |
| `franchise_id` | INT | DEFAULT NULL | Issuing franchise |
| `issue_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date of issuance |

---

### 2.6 `franchises` — Franchise Partners

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Franchise ID |
| `name` | VARCHAR(255) | NOT NULL | Center name |
| `city` | VARCHAR(100) | NOT NULL | Operating city |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash |
| `wallet_balance` | INT/DECIMAL | DEFAULT 0 | Available balance in wallet |
| `address` | TEXT | - | Physical address |
| `document_url` | VARCHAR(500) | - | Agreement/contract document URL |
| `latitude` | DECIMAL(10,8) | - | GPS latitude for map |
| `longitude` | DECIMAL(11,8) | - | GPS longitude for map |
| `balance` | DECIMAL(10,2) | DEFAULT 0 | Alternative V2 balance field |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |

**Indexes:** `idx_city (city)`

---

### 2.7 `transactions` — Financial Ledger

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Transaction ID |
| `franchise_id` | INT | FK → franchises(id) ON DELETE CASCADE | Related franchise |
| `type` | ENUM | 'debit'/'credit'/'DEPOSIT'/'PURCHASE'/'ISSUE' | Transaction type |
| `amount` | DECIMAL(10,2) | - | Amount in INR |
| `amount_inr` | DECIMAL(10,2) | - | Alternative amount column (V1 schema) |
| `certificates` | INT | - | Certificate count change |
| `description` | VARCHAR(255) | - | Human-readable description |
| `status` | ENUM | 'success'/'failed'/'pending' | Transaction status |
| `transaction_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp |

> **Note:** This table has schema inconsistency between V1 (`amount_inr`, `certificates`, `DEPOSIT/PURCHASE/ISSUE`) and V2 (`amount`, `debit/credit`). Recommend consolidation.

---

### 2.8 `exams` — Examination Records

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Exam ID |
| `title` | VARCHAR(255) | - | Exam name |
| `date` | DATE | - | Exam date |
| `type` | ENUM | 'online'/'offline' DEFAULT 'offline' | Delivery mode |
| `total_marks` | INT | - | Maximum score |
| `course_name` | VARCHAR(255) | - | Related course (denormalized) |

---

### 2.9 `exam_results` — Student Exam Scores

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Result ID |
| `student_id` | INT | FK → students(id) | Student tested |
| `exam_id` | INT | FK → exams(id) | Exam taken |
| `marks_obtained` | INT | - | Score achieved |
| `grade` | VARCHAR(10) | - | Grade letter (A+, A, B+, etc.) |
| `remarks` | TEXT | - | Admin notes |

**Constraint:** UNIQUE(student_id, exam_id) — enforced in application logic

---

### 2.10 `events` — Institute Events

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Event ID |
| `title` | VARCHAR(255) | - | Event title |
| `description` | TEXT | - | Full description |
| `event_date` | DATE | - | Event date |
| `event_time` | TIME | - | Start time |
| `location` | VARCHAR(255) | - | Venue |
| `image_url` | VARCHAR(500) | - | Event poster |
| `status` | VARCHAR(50) | DEFAULT 'upcoming' | upcoming/ongoing/completed |

---

### 2.11 `staff` — Staff Records

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Staff ID |
| `name` | VARCHAR(255) | - | Full name |
| `email` | VARCHAR(255) | - | Contact email |
| `role` | VARCHAR(100) | - | Job role/position |
| `phone` | VARCHAR(50) | - | Contact number |
| `joined_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Join date |

---

### 2.12 `live_classes` — Scheduled Live Classes

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Class ID |
| `course_name` | VARCHAR(255) | - | Which course (denormalized) |
| `title` | VARCHAR(255) | - | Class topic |
| `description` | TEXT | - | Class details |
| `class_date` | DATE | - | Scheduled date |
| `class_time` | TIME | - | Scheduled time |
| `duration_minutes` | INT | DEFAULT 60 | Duration in minutes |
| `meeting_link` | VARCHAR(500) | - | Zoom/Meet URL |
| `platform` | VARCHAR(50) | DEFAULT 'Zoom' | Platform used |

---

### 2.13 `recorded_sessions` — Recorded Course Content

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Session ID |
| `course_name` | VARCHAR(255) | - | Which course |
| `title` | VARCHAR(255) | - | Session title |
| `description` | TEXT | - | Description |
| `recorded_date` | DATE | - | Recording date |
| `duration_minutes` | INT | DEFAULT 60 | Length |
| `video_url` | VARCHAR(500) | - | Video URL/embed |

---

### 2.14 `contact_messages` — Website Contact Form Submissions

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Message ID |
| `name` | VARCHAR(255) | - | Sender name |
| `email` | VARCHAR(255) | - | Sender email |
| `phone` | VARCHAR(50) | - | Sender phone |
| `subject` | VARCHAR(255) | - | Message subject |
| `message` | TEXT | - | Full message |
| `status` | VARCHAR(50) | DEFAULT 'unread' | Read status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp |

---

### 2.15 `franchise_enquiries` — Franchise Application Form Submissions

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Enquiry ID |
| `name` | VARCHAR(255) | - | Applicant name |
| `email` | VARCHAR(255) | - | Contact email |
| `phone` | VARCHAR(50) | - | Contact phone |
| `city` | VARCHAR(100) | - | Proposed city |
| `investment_capacity` | VARCHAR(100) | - | Budget range |
| `message` | TEXT | - | Additional information |
| `status` | VARCHAR(50) | DEFAULT 'pending' | Processing status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission date |

---

### 2.16 `recharge_requests` — Wallet Recharge Workflow

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Request ID |
| `franchise_id` | INT | FK → franchises(id) ON DELETE CASCADE | Requesting franchise |
| `amount` | DECIMAL(10,2) | NOT NULL | Recharge amount |
| `payment_method` | VARCHAR(50) | - | UPI / NEFT / Cash |
| `transaction_ref` | VARCHAR(100) | - | Payment reference/UTR |
| `proof_url` | VARCHAR(500) | - | Screenshot upload URL |
| `status` | ENUM | 'pending'/'approved'/'rejected' | Approval status |
| `request_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Request date |
| `approved_at` | TIMESTAMP | NULL | Approval timestamp |

---

### 2.17 `certificate_requests` — Certificate Request Workflow

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT AUTO_INCREMENT | PRIMARY KEY | Request ID |
| `franchise_id` | INT | FK → franchises(id) | Requesting franchise |
| `student_id` | INT | FK → students(id) | Target student |
| `course_name` | VARCHAR(255) | - | Course name |
| `amount` | DECIMAL(10,2) | NOT NULL | Cost charged |
| `status` | ENUM | 'pending'/'approved'/'rejected' | Status |
| `request_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Request date |
| `approved_at` | TIMESTAMP | NULL | Approval date |
| `transaction_id` | VARCHAR(100) | - | Reference to transaction record |

---

### 2.18 Supporting Tables

| Table | Purpose |
|---|---|
| `franchise_documents` | Document uploads per franchise (license, proof, photos) |
| `franchise_courses` | Many-to-many: franchise ↔ authorized courses (with selling_price) |
| `enrollment_requests` | Franchise enrolling a student into a course (pending/approved) |
| `course_suggestions` | Franchise suggesting new courses to HQ |

---

## 3. Entity Relationship Diagram (Textual)

```
franchises (1) ──────┬──── (*) students
                     │
                     ├──── (*) transactions
                     │
                     ├──── (*) certificates
                     │
                     ├──── (*) recharge_requests
                     │
                     ├──── (*) certificate_requests
                     │
                     ├──── (*) franchise_documents
                     │
                     ├──── (*) franchise_courses ──── (*) courses
                     │
                     └──── (*) enrollment_requests
                                    │
students (1) ──────┬──── (1) student_auth
                   │
                   ├──── (*) payments
                   │
                   ├──── (*) exam_results ──── (*) exams
                   │
                   └──── (*) certificate_requests

courses (standalone, denormalized references)
    └── Referenced by: live_classes.course_name, recorded_sessions.course_name

events (standalone, no FK relationships)
staff (standalone, no FK relationships)
contact_messages (standalone)
franchise_enquiries (standalone)
```

---

## 4. Data Flow

### Student Lifecycle
```
Website Visit → submitEnquiry()
    → INSERT INTO students (status='enquiry')
    
Admin Approval → approveAdmission()
    → UPDATE students SET status='enrolled'
    → INSERT INTO student_auth (auto-generated password)
    
Payment → createPayment()
    → BEGIN TRANSACTION
    → INSERT INTO payments
    → UPDATE students SET fee_paid += amount
    → COMMIT

Certificate → createCertificate()
    → BEGIN TRANSACTION
    → Check franchise wallet
    → UPDATE franchises SET wallet_balance -= 100
    → INSERT INTO transactions (debit)
    → INSERT INTO certificates
    → COMMIT
```

### Financial Flow
```
Franchise Admin → submitRechargeRequest()
    → INSERT INTO recharge_requests (status='pending')

Super Admin → processRecharge(requestId, 'approve')
    → BEGIN TRANSACTION
    → UPDATE recharge_requests SET status='approved'
    → UPDATE franchises SET wallet_balance += amount
    → INSERT INTO transactions (DEPOSIT)
    → COMMIT
```

---

## 5. Indexing Strategy

### Current Indexes

| Table | Column(s) | Type | Purpose |
|---|---|---|---|
| `students` | `email` | UNIQUE | Login + duplicate prevention |
| `students` | `franchise_id` | INDEX | Franchise data scoping |
| `franchises` | `email` | UNIQUE | Login + duplicate prevention |
| `franchises` | `city` | INDEX | Geographic lookups |
| `certificates` | `unique_id` | UNIQUE | Certificate verification |
| `courses` | `slug` | UNIQUE | URL-based lookups |

### Recommended Additional Indexes

| Table | Column(s) | Reason |
|---|---|---|
| `students` | `(status, franchise_id)` | Dashboard stats queries |
| `payments` | `(student_id, payment_date)` | Payment history lookups |
| `transactions` | `(franchise_id, transaction_date)` | Transaction history |
| `live_classes` | `(course_name, class_date)` | Student dashboard filtering |
| `exam_results` | `(student_id, exam_id)` | Result uniqueness + lookups |
| `contact_messages` | `(status, created_at)` | Admin message queues |
| `recharge_requests` | `(franchise_id, status)` | Approval workflow queries |

---

## 6. Data Consistency Rules

| Rule | Enforcement |
|---|---|
| Payment amount must update student's `fee_paid` | Database transaction (BEGIN/COMMIT/ROLLBACK) |
| Certificate issuance must deduct wallet balance | `FOR UPDATE` row lock + transaction |
| Duplicate certificate IDs not allowed | UNIQUE constraint on `unique_id` |
| Duplicate student emails not allowed | UNIQUE constraint + application check |
| Recharge can only be processed once | Status check (`pending` only) in transaction |
| Student auth must reference valid student | FK with ON DELETE CASCADE |
| Franchise deletion cascades to related data | ON DELETE CASCADE on FKs |

---

## 7. Suggestions for Improvement

### Issue 1: Denormalized Course References
**Problem:** `students.course`, `live_classes.course_name`, `recorded_sessions.course_name` store course name as a string instead of `course_id` FK.
**Impact:** Course name changes break relationships; no referential integrity.
**Fix:** Replace `course_name VARCHAR` with `course_id INT FK → courses(id)` everywhere.

### Issue 2: Duplicate Balance Columns
**Problem:** `franchises` has both `wallet_balance` (INT) and `balance` (DECIMAL) columns.
**Impact:** Confusion about which column is authoritative.
**Fix:** Consolidate to a single `wallet_balance DECIMAL(12,2)` column.

### Issue 3: Inconsistent Transaction Schema
**Problem:** `transactions` has conflicting ENUM types between V1 and V2.
**Impact:** Queries may silently miss records with wrong enum values.
**Fix:** Standardize ENUMs to `('DEPOSIT', 'DEBIT', 'REFUND', 'CERTIFICATE_PURCHASE')`.

### Issue 4: No Soft Deletes
**Problem:** DELETE operations permanently remove records.
**Impact:** Accidental deletion is irreversible; audit trail lost.
**Fix:** Add `deleted_at TIMESTAMP NULL` column and filter `WHERE deleted_at IS NULL`.

### Issue 5: No Updated Timestamps
**Problem:** Most tables lack `updated_at` columns.
**Impact:** No tracking of when records were last modified.
**Fix:** Add `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`.

---

## 8. Proposed Scalable Schema (Next-Gen)

```sql
-- Core principle: Normalize foreign keys, add audit columns, use UUIDs for public IDs

CREATE TABLE students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    franchise_id BIGINT UNSIGNED,
    status ENUM('enquiry', 'enrolled', 'active', 'completed', 'dropped') DEFAULT 'enquiry',
    
    -- Financial
    fee_total DECIMAL(12,2) DEFAULT 0,
    fee_paid DECIMAL(12,2) DEFAULT 0,
    
    -- Profile
    avatar_url VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL,
    INDEX idx_franchise_status (franchise_id, status),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE enrollments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    franchise_id BIGINT UNSIGNED,
    status ENUM('pending', 'active', 'completed', 'dropped') DEFAULT 'pending',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL,
    UNIQUE KEY unique_enrollment (student_id, course_id)
) ENGINE=InnoDB;

-- This normalizes the student-course relationship
-- instead of storing course as a string in the students table
```
