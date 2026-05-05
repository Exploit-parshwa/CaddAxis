const mysql = require('mysql2/promise');

async function seedCourseDetails() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'caddaxis_db'
    });

    const courses = [
        {
            title: 'AutoCAD Civil 3D',
            description: 'Master land development, corridor design, and pipe networks for civil infrastructure projects.',
            image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop', // Architecture/Civil vibe
            syllabus: `
- Introduction to Civil 3D Interface
- Points and Point Groups
- Surface Creation and Analysis
- Alignments and Profiles
- Corridor Design & Modeling
- Pipe Networks (Sanitary & Storm)
- Grading and Parcel Design
- Plan Production and Documentation
- Quantity Takeoff
            `
        },
        {
            title: 'Revit Architecture',
            description: 'Comprehensive BIM training covering 3D modeling, floor plans, and construction documentation.',
            image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', // Modern Interior/Drafting
            syllabus: `
- Introduction to BIM & Revit Architecture
- Starting a Design: Levels and Grids
- Modeling Walls, Doors, and Windows
- Floor and Roof Creation
- Stairs, Railings, and Ramps
- Curtain Walls and Specialized Families
- Views, Camera, and Walkthroughs
- Rendering and Visualization
- Construction Documentation & Detailing
            `
        },
        {
            title: 'CATIA V5/V6',
            description: 'Advanced surface modeling and product design for automotive and aerospace industries.',
            image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', // Industrial/Tech
            syllabus: `
- Introduction to CATIA V5/V6
- Sketcher Workbench & Constraints
- Part Design & Solid Modeling
- Wireframe and Surface Design
- Assembly Design & Management
- Drafting and Detailing
- Generative Shape Design
- Sheet Metal Design
- DMU Kinematics (Basic)
            `
        },
        {
            title: 'SolidWorks',
            description: '3D CAD design software for analysis and product development.',
            image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // 3D Printing/Design
            syllabus: `
- SolidWorks Fundamentals
- Sketching and Parametric Modeling
- Extrude, Revolve, Sweep, and Loft Features
- Advanced Part Modeling
- Assembly Modeling & Mates
- Drawing & Detailing
- Sheet Metal & Weldments
- Simulation Xpress (Basic FEA)
- Rendering with PhotoView 360
            `
        },
        {
            title: 'Revit MEP',
            description: 'Mechanical, Electrical, and Plumbing design and documentation specialist training.',
            image_url: 'https://images.unsplash.com/photo-1581093588401-fbb0777e1343?q=80&w=1000&auto=format&fit=crop', // HVAC/Pipes
            syllabus: `
- Introduction to Revit MEP
- HVAC Systems: Ducts and Air Terminals
- Piping Systems: Plumbing and Fire Protection
- Electrical Systems: Lighting and Power
- Family Creation for MEP
- Scheduling and Quantity Takeoff
- Coordination and Collision Check
- Construction Documents
            `
        },
        {
            title: 'Civil Engineering',
            description: 'Complete suite covering drafting, analysis, and surveying technologies.',
            image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop', // Construction Site
            syllabus: `
- AutoCAD 2D & 3D
- Staad.Pro (Structural Analysis)
- ETABS (Building Analysis)
- Revit Structure
- Surveying Concepts
- Estimation and Costing
- Construction Management Basics
            `
        }
    ];

    try {
        console.log('Seeding course details...');

        // Clear existing courses to avoid duplicates if re-running or just update matching titles
        // For safety, I'll update matching titles. If not found, I insert.

        for (const course of courses) {
            const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Check if exists
            const [rows] = await pool.query('SELECT id FROM courses WHERE title = ?', [course.title]);

            if (rows.length > 0) {
                // Update
                await pool.query('UPDATE courses SET description=?, image_url=?, syllabus=?, slug=? WHERE id=?',
                    [course.description, course.image_url, course.syllabus, slug, rows[0].id]);
                console.log(`Updated: ${course.title}`);
            } else {
                // Insert
                await pool.query('INSERT INTO courses (title, description, duration, fee, slug, image_url, syllabus) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [course.title, course.description, '3 Months', 15000, slug, course.image_url, course.syllabus]);
                console.log(`Created: ${course.title}`);
            }
        }
        console.log('Seeding complete.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await pool.end();
    }
}

seedCourseDetails();
