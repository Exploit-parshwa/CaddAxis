import { courses as staticCourses } from '@/data/courses';
import { getCourseBySlug } from '@/app/actions';
import Link from 'next/link';
import { Clock, IndianRupee, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import React from 'react';

import StudentAccessSection from '@/components/StudentAccessSection';
import EnquiryForm from '@/components/EnquiryForm';

import SyllabusViewer from '@/components/SyllabusViewer';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }) {
    const { slug } = await params;

    // 1. Try fetching from DB first (Admin updates take priority)
    let course = await getCourseBySlug(slug);

    // 2. Fallback to Static Data
    if (!course) {
        course = staticCourses.find(c => c.slug === slug);
    }

    if (!course) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Course Not Found</h1>
                    <Link href="/courses" className="btn btn-primary">Back to Courses</Link>
                </div>
            </main>
        );
    }


    return (
        <main style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '4rem' }}>

            {/* HERO SECTION - PREMIUM CENTERED */}
            <div style={{
                position: 'relative',
                height: '60vh',
                minHeight: '500px',
                background: '#0f172a',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                {/* Background Image */}
                {/* Background Image or Video */}
                {(course.image_url && (course.image_url.endsWith('.mp4') || course.image_url.endsWith('.webm'))) ? (
                    <video
                        src={course.image_url}
                        autoPlay muted loop playsInline
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `url(${course.img || course.image_url || '/assets/images/hero_eng.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>
                )}

                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(3px)'
                }}></div>

                {/* Back Button - Absolute Top Left */}
                <Link href="/courses" style={{
                    position: 'absolute', top: '2rem', left: '2rem', zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                    padding: '0.8rem 1.5rem', borderRadius: '50px',
                    color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s'
                }}>
                    <ArrowLeft size={18} /> Back to Courses
                </Link>

                <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '2rem' }}>
                    <span style={{
                        background: 'rgba(232, 34, 106, 0.1)', color: 'var(--primary)',
                        padding: '0.5rem 1.2rem', borderRadius: '50px',
                        fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px',
                        marginBottom: '1.5rem', display: 'inline-block', border: '1px solid rgba(232, 34, 106, 0.3)'
                    }}>
                        {course.tag || 'CERTIFICATION PROGRAM'}
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)', // Responsive font size
                        fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem',
                        textTransform: 'uppercase', fontFamily: 'Oswald',
                        color: 'white',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        {course.title}
                    </h1>

                    <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.6 }}>
                        {course.description && course.description.substring(0, 150)}...
                    </p>
                </div>
            </div>

            {/* INFO STRIP */}
            <div style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', padding: '1.5rem 0', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ background: 'rgba(232, 34, 106, 0.2)', padding: '0.6rem', borderRadius: '50%', color: 'var(--primary)' }}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{course.duration || 'Flexible'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ background: 'rgba(232, 34, 106, 0.2)', padding: '0.6rem', borderRadius: '50%', color: 'var(--primary)' }}>
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Course Fee</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Enquire to Unlock</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ background: 'rgba(232, 34, 106, 0.2)', padding: '0.6rem', borderRadius: '50%', color: 'var(--primary)' }}>
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Certification</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>ISO Verified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="container" style={{ marginTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

                    {/* Left Column: Syllabus & Details */}
                    <div style={{ gridColumn: 'span 2' }}>

                        <StudentAccessSection courseName={course.title} courseSlug={course.slug} />

                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ width: '8px', height: '30px', background: 'var(--primary)', display: 'block', borderRadius: '4px' }}></span>
                                Course Overview
                            </h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
                                {course.description}
                            </p>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '3rem', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <BookOpen color="var(--primary)" />
                                Curriculum Analysis
                            </h2>

                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <SyllabusViewer content={course.syllabus} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Floating Enquiry Card */}
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <div style={{
                            background: 'white', borderRadius: '20px', padding: '2.5rem',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Interested?</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Get full syllabus PDF and fee structure.</p>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <EnquiryForm courseTitle={course.title} />

                                <Link
                                    href={`https://wa.me/919547714747?text=${encodeURIComponent("Hello Sir i want to know more about " + course.title)}`}
                                    target="_blank"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        padding: '1rem', borderRadius: '8px',
                                        background: '#25D366', color: 'white', fontWeight: 600, textDecoration: 'none',
                                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                                    }}
                                >
                                    WhatsApp Enquiry
                                </Link>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Need immediate assistance?</p>
                                <a href="tel:+919547714747" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>+91 95477 14747</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
