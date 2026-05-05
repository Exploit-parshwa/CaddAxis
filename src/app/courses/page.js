'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { getCourses } from '@/app/actions';

export default function Courses() {
    const [allCourses, setAllCourses] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getCourses();
                setAllCourses(data);
            } catch (e) {
                console.error("Failed to load courses", e);
            } finally {
                setLoading(false);
            }
        };
        loadCourses();
    }, []);

    const filteredCourses = filter === 'ALL'
        ? allCourses
        : allCourses.filter(c => c.tag === filter);

    const handleFilter = (category) => {
        setFilter(category);
        setVisibleCount(6);
    };

    return (
        <>
            <CustomCursor />
            <Navbar />

            <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', background: '#f8fafc' }}>
                {/* PAGE HEADER */}
                <section className="section" style={{ paddingBottom: '2rem', background: '#fff' }}>
                    <h1 className="display-text" style={{ fontSize: '5vw' }}>OUR <span className="highlight">COURSES</span></h1>
                    <p style={{ maxWidth: '600px', marginTop: '1rem', color: '#555' }}>
                        Industry-oriented curriculum designed by experts. Choose your path and master the tools that build the world.
                    </p>
                </section>

                {/* FILTER BAR */}
                <div style={{ padding: '0 4vw 4rem', display: 'flex', gap: '2rem', overflowX: 'auto', background: '#fff' }}>
                    {['ALL', 'CIVIL', 'MECHANICAL', 'ARCHITECTURAL'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className="btn-main"
                            style={{
                                padding: '0.8rem 2rem',
                                marginTop: 0,
                                background: filter === cat ? 'var(--primary)' : 'white',
                                color: filter === cat ? 'white' : 'black',
                                borderColor: filter === cat ? 'var(--primary)' : 'black',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* COURSE GRID */}
                <section className="poster-grid" style={{ padding: '0 4vw 4rem', minHeight: '500px' }}>
                    {loading ? (
                        <>
                            {/* SKELETON LOADER */}
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} style={{ height: '400px', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    <div className="skeleton" style={{ height: '300px', width: '100%' }}></div>
                                    <div style={{ padding: '1rem' }}>
                                        <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '30px', width: '80%' }}></div>
                                    </div>
                                </div>
                            ))}
                            <style jsx>{`
                                .skeleton {
                                    background: #eee;
                                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                                    border-radius: 5px;
                                    background-size: 200% 100%;
                                    animation: 1.5s shine linear infinite;
                                }
                                @keyframes shine {
                                    to {
                                        background-position-x: -200%;
                                    }
                                }
                            `}</style>
                        </>
                    ) : filteredCourses.length > 0 ? (
                        filteredCourses.slice(0, visibleCount).map((c) => (
                            <Link href={`/courses/${c.slug}`} key={c.id} className="poster-card" data-hover="true" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img
                                        src={c.image_url || '/assets/images/poster_civil.png'}
                                        alt={c.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    />
                                </div>
                                <div className="poster-content">
                                    <span className="poster-tag">{c.tag}</span>
                                    <h3 className="poster-title">{c.title}</h3>
                                    <div className="poster-meta">
                                        <span>{c.duration || '3 MONTHS'}</span>
                                        <span>CERTIFIED</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#888' }}>
                            <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>NO COURSES FOUND</h3>
                            <p>We are constantly adding new programs. Check back soon!</p>
                        </div>
                    )}
                </section>

                {/* LOAD MORE BUTTON */}
                {!loading && visibleCount < filteredCourses.length && (
                    <div style={{ textAlign: 'center', paddingBottom: '8rem' }}>
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="btn-main"
                            style={{ background: 'transparent', color: 'black', border: '1px solid black' }}
                        >
                            LOAD MORE COURSES
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
