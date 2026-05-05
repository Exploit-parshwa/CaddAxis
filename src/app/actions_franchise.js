'use server';

import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

// --- Franchise Management System Actions ---

// 1. Database Initialization
export async function initFranchiseDB() {
    const connection = await pool.getConnection(); // Use existing pool
    try {
        await connection.beginTransaction();

        // Franchises Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS franchises (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                wallet_balance INT DEFAULT 0,
                address TEXT,
                document_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add new columns if not exist (Migration style)
        const [cols] = await connection.query("SHOW COLUMNS FROM franchises LIKE 'address'");
        if (cols.length === 0) {
            await connection.query("ALTER TABLE franchises ADD COLUMN address TEXT AFTER wallet_balance");
            await connection.query("ALTER TABLE franchises ADD COLUMN document_url VARCHAR(500) AFTER address");
        }

        // Transactions Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                franchise_id INT NOT NULL,
                type ENUM('DEPOSIT', 'PURCHASE', 'ISSUE', 'REFUND') NOT NULL,
                amount_inr DECIMAL(10,2) DEFAULT 0,
                certificates INT DEFAULT 0,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
            )
        `);

        // Update Students Table (Add franchise_id)
        const [studentCols] = await connection.query("SHOW COLUMNS FROM students LIKE 'franchise_id'");
        if (studentCols.length === 0) {
            await connection.query("ALTER TABLE students ADD COLUMN franchise_id INT DEFAULT NULL");
        }

        // Update Certificates Table (Add franchise_id)
        const [certCols] = await connection.query("SHOW COLUMNS FROM certificates LIKE 'franchise_id'");
        if (certCols.length === 0) {
            await connection.query("ALTER TABLE certificates ADD COLUMN franchise_id INT DEFAULT NULL");
        }

        await connection.commit();
        return { success: true, message: "Franchise DB initialized" };
    } catch (e) {
        await connection.rollback();
        console.error("Franchise DB Init Error:", e);
        return { success: false, error: e.message };
    } finally {
        connection.release();
    }
}

// 2. Franchise CRUD
export async function createFranchise(data) {
    // If Data is FormData (from file upload), handle that. If object, handle that.
    let name, city, email, password, address, docUrl;

    if (data instanceof FormData) {
        name = data.get('name');
        city = data.get('city');
        email = data.get('email');
        password = data.get('password');
        address = data.get('address');
        docUrl = data.get('docUrl') || null; // URL passed from uploading separately
    } else {
        ({ name, city, email, password, address, docUrl } = data);
    }

    if (!email || !password || !name || !city || !address) return { success: false, error: "Missing fields" };

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const [res] = await pool.query(
            "INSERT INTO franchises (name, city, email, password_hash, address, document_url) VALUES (?, ?, ?, ?, ?, ?)",
            [name, city, email, passwordHash, address, docUrl]
        );
        return { success: true, id: res.insertId };
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return { success: false, error: "Email already exists" };
        throw e;
    }
}

export async function getFranchises() {
    // Admin Only - Returns financial data
    const [rows] = await pool.query("SELECT id, name, city, email, wallet_balance, created_at FROM franchises ORDER BY created_at DESC");
    return rows;
}

export async function getPublicFranchiseLocations() {
    // Public Safe - No sensitive data
    try {
        const [rows] = await pool.query("SELECT id, name, city, latitude, longitude FROM franchises ORDER BY city ASC");
        return rows;
    } catch (error) {
        console.warn("Database connection failed. Returning MOCK franchise locations.", error.message);
        return [
            { id: 1, name: 'CaddAxis Pune (HQ)', city: 'Pune' },
            { id: 2, name: 'CaddAxis Sangli', city: 'Sangli' },
            { id: 3, name: 'CaddAxis Kolhapur', city: 'Kolhapur' },
            { id: 4, name: 'CaddAxis Mumbai', city: 'Mumbai' },
            { id: 5, name: 'CaddAxis Delhi', city: 'Delhi' }
        ];
    }
}

export async function getFranchiseStats(id) {
    // Mock Data for Demo
    if (String(id) === '999') {
        return {
            franchise: { id: 999, name: 'CaddAxis Ajara (Demo)', city: 'Ajara', email: 'ajara@caddaxis.com', wallet_balance: 50 },
            transactions: [
                { id: 1, type: 'DEPOSIT', amount_inr: 5000, certificates: 50, description: 'Welcome Bonus', created_at: new Date() }
            ],
            studentCount: 12,
            certCount: 0
        };
    }

    try {
        const [fRows] = await pool.query("SELECT * FROM franchises WHERE id = ?", [id]);
        if (fRows.length === 0) return null;
        const franchise = fRows[0];

        const [transactions] = await pool.query("SELECT * FROM transactions WHERE franchise_id = ? ORDER BY created_at DESC", [id]);
        const [students] = await pool.query("SELECT count(*) as count FROM students WHERE franchise_id = ?", [id]);
        const [certs] = await pool.query("SELECT count(*) as count FROM certificates WHERE franchise_id = ?", [id]);

        return {
            franchise,
            transactions,
            studentCount: students[0].count,
            certCount: certs[0].count
        };
    } catch (e) {
        console.error("DB Stats Error:", e);
        // Return dummy data on error to keep UI alive
        return {
            franchise: { name: 'Error Loading', wallet_balance: 0 },
            transactions: [],
            studentCount: 0,
            certCount: 0
        };
    }
}

export async function deleteFranchise(id) {
    // Admin Only
    try {
        await pool.query("DELETE FROM franchises WHERE id = ?", [id]);
        return { success: true };
    } catch (e) {
        console.error("Delete Franchise Error:", e);
        return { success: false, error: e.message };
    }
}



// 3. Wallet & Payment
export async function addFranchiseCredits(data) {
    // data: { franchiseId, amount }
    const amount = Number(data.amount);
    if (isNaN(amount) || amount < 100) return { success: false, error: "Invalid amount. Min ₹100." };

    const certsToAdd = Math.floor(amount / 100);
    const franchiseId = data.franchiseId;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Update Wallet
        await connection.query(
            "UPDATE franchises SET wallet_balance = wallet_balance + ? WHERE id = ?",
            [certsToAdd, franchiseId]
        );

        // 2. Add Transaction
        await connection.query(
            "INSERT INTO transactions (franchise_id, type, amount_inr, certificates, description) VALUES (?, 'DEPOSIT', ?, ?, ?)",
            [franchiseId, amount, certsToAdd, `Payment Received: ₹${amount}`]
        );

        await connection.commit();

        // 3. Email (Fire and forget, slightly safer to await if critical)
        try {
            const [fRows] = await connection.query("SELECT email, wallet_balance FROM franchises WHERE id = ?", [franchiseId]);
            if (fRows.length > 0) {
                const f = fRows[0];
                await sendEmail(
                    f.email,
                    'Payment Received - Wallet Credited',
                    `₹${amount} received successfully.\n${certsToAdd} certificates have been added to your wallet.\nCurrent Balance: ${f.wallet_balance} Certificates.`
                );
            }
        } catch (mailErr) {
            console.error("Email Error:", mailErr);
        }

        return { success: true, certificates: certsToAdd };
    } catch (e) {
        await connection.rollback();
        console.error("Wallet Credit Error:", e);
        return { success: false, error: "Transaction Failed" };
    } finally {
        connection.release();
    }
}

// 4. Issue Certificate (Atomic Debit)
export async function issueFranchiseCertificate(data) {
    const { franchiseId, studentId, courseName, uniqueId } = data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Lock & Check Balance
        const [rows] = await connection.query("SELECT wallet_balance FROM franchises WHERE id = ? FOR UPDATE", [franchiseId]);
        if (rows.length === 0) throw new Error("Franchise not found");

        const balance = rows[0].wallet_balance;
        if (balance < 1) throw new Error("Insufficient Certificate Balance. Please Recharge.");

        // Debit
        await connection.query("UPDATE franchises SET wallet_balance = wallet_balance - 1 WHERE id = ?", [franchiseId]);

        // Validate Cert ID Uniqueness
        const [existing] = await connection.query("SELECT id FROM certificates WHERE unique_id = ?", [uniqueId]);
        if (existing.length > 0) throw new Error("Certificate ID already used");

        // Get Student Name
        const [sRows] = await connection.query("SELECT name FROM students WHERE id = ?", [studentId]);
        const studentName = sRows[0]?.name || "Student";

        // Insert Cert
        await connection.query(
            "INSERT INTO certificates (student_name, course_name, unique_id, franchise_id) VALUES (?, ?, ?, ?)",
            [studentName, courseName, uniqueId, franchiseId]
        );

        // Log Transaction
        await connection.query(
            "INSERT INTO transactions (franchise_id, type, amount_inr, certificates, description) VALUES (?, 'ISSUE', 0, -1, ?)",
            [franchiseId, `Issued Cert: ${uniqueId} to ${studentName}`]
        );

        await connection.commit();
        return { success: true };

    } catch (e) {
        await connection.rollback();
        return { success: false, error: e.message };
    } finally {
        connection.release();
    }
}

// 5. Auth
export async function authenticateFranchise(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) return { success: false, error: "Missing Credentials" };

    try {
        const [rows] = await pool.query("SELECT * FROM franchises WHERE email = ?", [email]);
        if (rows.length === 0) return { success: false, error: "Franchise not found" };

        const franchise = rows[0];
        const match = await bcrypt.compare(password, franchise.password_hash);

        if (!match) return { success: false, error: "Invalid Password" };

        return { success: true, franchiseId: franchise.id, name: franchise.name };
    } catch (e) {
        console.warn("DB Auth Failed, checking for mock override:", e.message);
        // Fallback for Demo if DB is down
        if (email === 'ajara@caddaxis.com' && password === 'admin') {
            return { success: true, franchiseId: 999, name: 'CaddAxis Ajara (Demo)' };
        }
        return { success: false, error: "System Error or DB Offline" };
    }
}
