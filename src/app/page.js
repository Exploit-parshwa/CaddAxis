'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import TechAnim from '@/components/TechAnim';

export default function Home() {
    // Trusted Colleges
    const colleges = [
        { name: 'SIT', logo: '/logos/logo1.png' },
        { name: 'DKTE', logo: '/logos/logo2.png' },
        { name: 'TKITE', logo: '/logos/logo3.png' },
        { name: 'JJMCOE', logo: '/logos/logo4.png' },
        // Duplicates for marquee smoothness
        { name: 'SIT', logo: '/logos/logo1.png' },
        { name: 'DKTE', logo: '/logos/logo2.png' },
        { name: 'TKITE', logo: '/logos/logo3.png' },
        { name: 'JJMCOE', logo: '/logos/logo4.png' }
    ];

    return (
        <main style={{ overflowX: 'hidden' }}>
            <Navbar />
            <HeroSection />

            {/* 1. MARQUEE SCROLLER (Stats) - MATCHING PHP UI STRIP */}
            <div style={{ background: 'black', padding: '1.5rem 0', overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '5px solid #e91e63' }}>
                <div className="marquee-content" style={{ display: 'inline-flex', animation: 'scroll 40s linear infinite' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginRight: '4rem' }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Oswald', fontSize: '1.2rem', letterSpacing: '1px' }}>
                                /// 5200+ STUDENTS TRAINED
                            </span>
                            <span style={{ color: '#e91e63', fontWeight: 'bold', fontFamily: 'Oswald', fontSize: '1.2rem', margin: '0 2rem' }}>
                                /// 98% PLACEMENT RATE
                            </span>
                            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Oswald', fontSize: '1.2rem', letterSpacing: '1px' }}>
                                /// 15+ YEARS EXPERIENCE
                            </span>
                            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Oswald', fontSize: '1.2rem', letterSpacing: '1px', marginLeft: '2rem' }}>
                                /// ISO CERTIFIED
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. FEATURED PROGRAMS (White Bg) - MATCHING PHP UI */}
            <section style={{ padding: '6rem 4vw', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', color: 'black', margin: 0, lineHeight: 1 }}>
                            Featured <span style={{ color: '#e91e63' }}>Programs</span>
                        </h2>
                        <Link href="/courses" style={{
                            fontSize: '0.9rem', fontWeight: '700', color: 'black', borderBottom: '2px solid black',
                            textTransform: 'uppercase', fontFamily: 'Oswald', paddingBottom: '4px', letterSpacing: '1px'
                        }}>
                            VIEW ALL PROGRAMS
                        </Link>
                    </div>

                    {/* Poster Grid */}
                    <div className="poster-grid">

                        {/* 1. MECHANICAL */}
                        <div className="poster-card">
                            <img src="/images/student_mech.png" alt="Mechanical" />
                            <div className="poster-content">
                                <span className="poster-tag">Mechanical</span>
                                <h3 className="poster-title">SolidWorks Master</h3>
                                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', opacity: 0.9 }}>Advanced product design & simulation techniques.</p>
                            </div>
                        </div>

                        {/* 2. CIVIL */}
                        <div className="poster-card">
                            <img src="/images/student_villa.png" alt="Civil" />
                            <div className="poster-content">
                                <span className="poster-tag">Civil</span>
                                <h3 className="poster-title">Revit Architecture</h3>
                                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', opacity: 0.9 }}>Building Information Modeling (BIM) from scratch.</p>
                            </div>
                        </div>

                        {/* 3. RESEARCH/SIMULATION (Matches PHP content 'Ansys') */}
                        <div className="poster-card">
                            {/* Abstract image for simulation */}
                            <img src="/images/student_civil.png" alt="Simulation" />
                            <div className="poster-content">
                                <span className="poster-tag">Research</span>
                                <h3 className="poster-title">Ansys & Simulation</h3>
                                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', opacity: 0.9 }}>Finite Element Analysis for complex engineering problems.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. TRUSTED BY (College Marquee) */}
            <section style={{ padding: '2rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.85rem', color: '#64748b', letterSpacing: '2px', fontWeight: 'bold', fontFamily: 'Oswald' }}>TRUSTED BY</h3>
                </div>

                <div className="logos-marquee">
                    <div className="marquee-content">
                        {[...colleges, ...colleges, ...colleges].map((college, idx) => (
                            <div key={idx} className="college-item">
                                <img
                                    src={college.logo}
                                    alt={college.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* 4. MADE BY STUDENTS - DYNAMIC GRID */}
            <section style={{ padding: '6rem 4vw', background: '#0f172a', color: 'white' }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Left Text */}
                    <div style={{ position: 'sticky', top: '150px' }}>
                        <h2 style={{ fontSize: '4rem', fontFamily: 'Oswald', lineHeight: 0.9, marginBottom: '2rem' }}>
                            MADE BY <br /> <span style={{ color: '#ea1d5d' }}>STUDENTS</span>
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                            From complex mechanical assemblies to skyscraper blueprints, see what our students create in their first 30 days.
                        </p>
                        <Link href="/student/projects" style={{
                            background: 'white', color: 'black', padding: '1rem 2.5rem',
                            fontWeight: 'bold', fontFamily: 'Oswald', textDecoration: 'none',
                            display: 'inline-block', letterSpacing: '1px', border: '2px solid white',
                            transition: 'all 0.3s ease'
                        }}>
                            EXPLORE LAB
                        </Link>
                    </div>

                    {/* Right Grid - Dynamic Mapping */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { title: 'GEAR ASSEMBLY', cat: 'Mechanical', img: '/images/student_mech.png' },
                            { title: 'SKYSCRAPER BIM', cat: 'Civil', img: '/images/student_civil.png' },
                            { title: 'ROBOTIC ARM', cat: 'Mechatronics', img: '/images/student_robot.png' },
                            { title: 'AERO ENGINE', cat: 'Simulation', img: '/images/student_mech.png' },
                            { title: 'MODERN VILLA', cat: 'Architecture', img: '/images/student_villa.png' },
                            { title: 'DRONE PROTO', cat: 'Product Design', img: '/images/student_mech.png' },
                            { title: 'EV CHASSIS', cat: 'Automotive', img: '/images/student_robot.png' },
                            { title: 'STEEL STRUCT', cat: 'Civil', img: '/images/student_civil.png' },
                            { title: 'TURBINE BLADE', cat: 'CFD', img: '/images/student_civil.png' }
                        ].map((item, idx) => (
                            <div key={idx} className="project-card" style={{ height: '280px', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                                }}>
                                    <span style={{ color: '#ea1d5d', fontWeight: 'bold', fontSize: '0.7rem', display: 'block', marginBottom: '0.3rem' }}>
                                        {item.cat.toUpperCase()} CODE #{100 + idx}
                                    </span>
                                    <h4 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', textTransform: 'uppercase', margin: 0 }}>
                                        {item.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CTA SECTION - MATCHING PHP 'READY TO START?' UI EXACTLY */}
            <section style={{ padding: '8rem 4vw', background: '#f0f0f0', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', lineHeight: 1, marginBottom: '2rem', fontFamily: 'Oswald', color: 'black' }}>
                        READY TO <span className="text-outline" style={{ cursor: 'pointer' }}>START?</span>
                    </h2>
                    <p style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.6, color: '#444', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        Join the elite community of designers and engineers. Your career transformation begins with a single click.
                    </p>
                    <Link href="/contact" style={{
                        display: 'inline-block',
                        background: '#e91e63', // Matches Primary
                        color: 'white',
                        padding: '1.2rem 3rem',
                        fontFamily: 'Oswald',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        letterSpacing: '1px',
                        textDecoration: 'none',
                        border: '1px solid #e91e63',
                        transition: 'all 0.3s ease'
                    }}>
                        BOOK FREE DEMO
                    </Link>
                </div>
            </section>

            {/* 5. TECH ANIMATION SECTION */}
            <TechAnim />

            <style jsx>{`
                /* HERO TEXT ADJUSTMENT */
                .display-text {
                    font-family: 'Oswald', sans-serif;
                    font-size: clamp(2.5rem, 5vw, 5rem); /* REDUCED SIZE */
                    line-height: 0.9;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                }
                .hero-content {
                    width: 55%; /* Slight increase for better wrap */
                    z-index: 2;
                }

                /* COLLEGE MARQUEE STYLES */
                .logos-marquee { overflow: hidden; white-space: nowrap; padding: 1rem 0; }
                .marquee-content { display: inline-flex; animation: scroll 35s linear infinite; }
                .logos-marquee:hover .marquee-content { animation-play-state: paused; }
                
                .college-item {
                    margin: 0 3rem;
                    width: 160px; /* Reduced slightly from 180px */
                    height: 80px;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .college-item img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: grayscale(100%) opacity(0.7);
                    mix-blend-mode: multiply; /* ENSURES NO WHITE BG PATCH */
                    transition: all 0.3s ease;
                }
                
                /* HOVER EFFECT: Scale Item Up + Colorize Image */
                .college-item:hover {
                    transform: scale(1.2); /* Slightly gentler pop */
                }
                .college-item:hover img {
                    filter: grayscale(0%) opacity(1);
                }

                /* POSTER GRID STYLES */
                .poster-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 2rem;
                }
                .poster-card {
                    height: 500px;
                    position: relative;
                    overflow: hidden;
                    background: #000;
                    color: white;
                    cursor: none; /* Custom cursor intent from PHP, standard here */
                }
                .poster-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.7;
                    transition: opacity 0.4s ease, transform 0.6s ease;
                }
                .poster-content {
                    position: absolute;
                    bottom: 0; left: 0; width: 100%;
                    padding: 2rem;
                    z-index: 2;
                    transform: translateY(20px);
                    transition: transform 0.4s ease;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                }
                
                /* HOVER EFFECTS */
                .poster-card:hover img {
                    opacity: 0.4;
                    transform: scale(1.1);
                }
                .poster-card:hover .poster-content {
                    transform: translateY(0);
                }
                
                .poster-tag {
                    background: #e91e63;
                    color: white;
                    padding: 0.2rem 0.8rem;
                    font-size: 0.8rem; /* Matches CSS */
                    text-transform: uppercase;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 0.5rem;
                    font-family: 'Oswald', sans-serif;
                }
                .poster-title {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    line-height: 1;
                }
            `}</style>

            <Footer />
        </main>
    );
}
