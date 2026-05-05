'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, PlayCircle, Video, AlertCircle } from 'lucide-react';

export default function StudentAccessSection({ courseName, courseSlug }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydration matching: only run on client
        const stored = localStorage.getItem('student');
        if (stored) {
            try {
                setStudent(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse student data", e);
            }
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    // 1. Not Logged In - Show Nothing (as requested)
    if (!student) {
        return null;
    }

    // Normalized comparison
    // We assume courseName matches exactly what's in the DB `courses` column.
    // If not, we might need a mapping, but let's assume exact match for now based on previous `actions.js` logic.
    const isEnrolledInThisCourse = student.course === courseName;
    const isApproved = student.status === 'enrolled'; // Admin approval check

    // 2. Logged In & Enrolled in THIS Course
    if (isEnrolledInThisCourse) {
        if (isApproved) {
            // SUCCESS: ACCESS GRANTED (Admin Approved)
            return (
                <div style={{ marginTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '30px', background: 'var(--primary)', borderRadius: '4px', display: 'block' }}></span>
                        Student Portal
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Link href="/student/dashboard" style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2rem',
                            borderRadius: '16px', textDecoration: 'none', color: '#166534',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                            transition: 'transform 0.2s'
                        }} className="hover:scale-105">
                            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                                <Video size={32} color="#16a34a" />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Join Live Class</span>
                        </Link>

                        <Link href="/student/dashboard" style={{
                            background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2rem',
                            borderRadius: '16px', textDecoration: 'none', color: '#1e40af',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                            transition: 'transform 0.2s'
                        }} className="hover:scale-105">
                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '50%' }}>
                                <PlayCircle size={32} color="#2563eb" />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Watch Recordings</span>
                        </Link>
                    </div>
                </div>
            );
        } else {
            // FAIL: PENDING APPROVAL (Enquiry submitted, not enrolled yet)
            return (
                <div style={{
                    marginTop: '3rem',
                    background: '#fff7ed', // Orange/Yellow bg
                    border: '1px solid #fed7aa', // Orange border
                    borderRadius: '12px',
                    padding: '3rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'white', width: '60px', height: '60px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #ffedd5'
                    }}>
                        <Lock size={28} color="#f97316" />
                    </div>

                    <h3 style={{
                        fontSize: '1.5rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase', marginBottom: '1rem'
                    }}>
                        Access Pending
                    </h3>

                    <p style={{ color: '#9a3412', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        Your admission request is currently under review by our admin team. Once approved, you will gain instant access to live classes and recordings.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/contact" className="btn" style={{
                            background: '#f97316', color: 'white', padding: '0.8rem 2rem', borderRadius: '50px',
                            textDecoration: 'none', fontWeight: 'bold'
                        }}>
                            Contact Admin
                        </Link>
                    </div>
                </div>
            );
        }
    }

    // 3. Logged In BUT Enrolled in DIFFERENT Course
    return (
        <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <AlertCircle size={24} color="#64748b" style={{ marginTop: '4px' }} />
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>
                        Not Enrolled
                    </h4>
                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                        You are currently logged in as <strong>{student.name}</strong> (Enrolled in: {student.course}).
                        To access this course's content, you need to enroll separately.
                    </p>
                    <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                        Request Course Change &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
