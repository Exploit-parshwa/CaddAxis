const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function updateSchema() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'caddaxis_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log('Updating schema...');

        // 1. Add new columns to courses table
        console.log('Adding columns to courses table...');

        // Add slug
        try {
            await pool.query('ALTER TABLE courses ADD COLUMN slug VARCHAR(255) UNIQUE');
            console.log('Added slug column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('slug column already exists.');
            else throw e;
        }

        // Add image_url
        try {
            await pool.query('ALTER TABLE courses ADD COLUMN image_url TEXT');
            console.log('Added image_url column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('image_url column already exists.');
            else throw e;
        }

        // Add syllabus
        try {
            await pool.query('ALTER TABLE courses ADD COLUMN syllabus TEXT');
            console.log('Added syllabus column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('syllabus column already exists.');
            else throw e;
        }

        // 2. Populate slugs for existing courses if missing
        console.log('Populating missing slugs...');
        const [courses] = await pool.query('SELECT id, title FROM courses WHERE slug IS NULL');
        for (const course of courses) {
            let slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (!slug) slug = `course-${course.id}`; // Fallback

            try {
                await pool.query('UPDATE courses SET slug = ? WHERE id = ?', [slug, course.id]);
                console.log(`Updated slug for ${course.title} -> ${slug}`);
            } catch (e) {
                console.log(`Could not update slug for ${course.title} (might be duplicate): ${e.message}`);
                // Try appending ID if duplicate
                const uniqueSlug = `${slug}-${course.id}`;
                await pool.query('UPDATE courses SET slug = ? WHERE id = ?', [uniqueSlug, course.id]);
                console.log(`Updated slug with unique ID: ${uniqueSlug}`);
            }
        }

        console.log('Schema update complete.');

    } catch (error) {
        console.error('Schema update failed:', error);
    } finally {
        await pool.end();
    }
}

updateSchema();
