const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
    console.log("Connecting to DB...", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        db: process.env.DB_NAME
    });

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'caddaxis'
        });

        console.log("Creating Table if missing...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                duration VARCHAR(50),
                fee INT,
                image_url VARCHAR(255),
                tag VARCHAR(50),
                syllabus TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Truncating courses...");
        await connection.query("DELETE FROM courses");
        await connection.query("ALTER TABLE courses AUTO_INCREMENT = 1");

        const courses = [
            // CIVIL
            { tag: 'CIVIL', title: 'AutoCAD Civil 3D', slug: 'autocad-civil-3d', img: '/assets/images/poster_civil.png', description: 'Master land development and civil engineering design.', duration: '3 Months', fee: 25000 },
            { tag: 'CIVIL', title: 'Revit Structure', slug: 'revit-structure', img: '/assets/images/poster_civil.png', description: 'Advanced structural BIM modeling and detailing.', duration: '2.5 Months', fee: 22000 },
            { tag: 'CIVIL', title: 'STAAD Pro V8i', slug: 'staad-pro-v8i', img: '/assets/images/poster_civil.png', description: 'Structural power for analysis and design.', duration: '2 Months', fee: 18000 },
            { tag: 'CIVIL', title: 'E-Tabs', slug: 'etabs', img: '/assets/images/poster_civil.png', description: 'Integrated analysis, design and drafting.', duration: '2 Months', fee: 20000 },
            { tag: 'CIVIL', title: '3ds Max for Architects', slug: '3ds-max-for-architects', img: '/assets/images/poster_civil.png', description: '3D modeling, animation, and rendering.', duration: '3 Months', fee: 25000 },
            { tag: 'CIVIL', title: 'Google SketchUp', slug: 'google-sketchup', img: '/assets/images/poster_civil.png', description: 'Intuitive 3D modeling for architectural design.', duration: '1.5 Months', fee: 12000 },
            { tag: 'CIVIL', title: 'Total Station Surveying', slug: 'total-station', img: '/assets/images/poster_civil.png', description: 'Modern surveying techniques and equipment usage.', duration: '1 Month', fee: 10000 },
            // MECH
            { tag: 'MECHANICAL', title: 'SolidWorks Professional', slug: 'solidworks-professional', img: '/assets/images/poster_mech.png', description: 'Industry-standard 3D mechanical design.', duration: '3 Months', fee: 28000 },
            { tag: 'MECHANICAL', title: 'CATIA V5', slug: 'catia-v5', img: '/assets/images/poster_mech.png', description: 'Multi-platform software suite for CAD/CAM/CAE.', duration: '3 Months', fee: 30000 },
            { tag: 'MECHANICAL', title: 'ANSYS Workbench', slug: 'ansys-workbench', img: '/assets/images/poster_mech.png', description: 'Engineering simulation and 3D design.', duration: '2 Months', fee: 25000 },
            { tag: 'MECHANICAL', title: 'Creo Parametric', slug: 'creo-parametric', img: '/assets/images/poster_mech.png', description: 'Scalable 3D CAD product development packages.', duration: '2.5 Months', fee: 24000 },
            { tag: 'MECHANICAL', title: 'Unigraphics NX', slug: 'unigraphics-nx', img: '/assets/images/poster_mech.png', description: 'Integrated CAD/CAM/CAE solution.', duration: '3 Months', fee: 32000 },
            // ARCH
            { tag: 'ARCHITECTURAL', title: 'Revit Architecture', slug: 'revit-architecture', img: '/assets/images/hero_eng.png', description: 'Building Information Modeling for architects.', duration: '3 months', fee: 25000 },
            { tag: 'ARCHITECTURAL', title: 'AutoCAD Architecture', slug: 'autocad-architecture', img: '/assets/images/hero_eng.png', description: 'Architectural design and documentation.', duration: '2 Months', fee: 15000 },
            { tag: 'ARCHITECTURAL', title: 'Lumion 3D', slug: 'lumion-3d', img: '/assets/images/hero_eng.png', description: 'Fast 3D rendering for architects.', duration: '1 Month', fee: 12000 }
        ];

        console.log("Seeding...");
        for (const c of courses) {
            await connection.query(
                "INSERT INTO courses (title, slug, description, duration, fee, image_url, tag, syllabus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [c.title, c.slug, c.description, c.duration, c.fee, c.img, c.tag, '']
            );
        }
        console.log("Seeding Complete. 15 Courses Inserted.");
        process.exit();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
