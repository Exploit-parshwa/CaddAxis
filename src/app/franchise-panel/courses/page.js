'use client';
import { useState, useEffect } from 'react';
import { getCourses } from '@/app/actions';
import { Search, BookOpen } from 'lucide-react';

export default function FranchiseCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getCourses();
            setCourses(data);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', mb: '2rem' }}>AVAILABLE <span style={{ color: '#E91E63' }}>COURSES</span></h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Courses available for enrollment in your center.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {courses.map(c => (
                    <div key={c.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <div style={{ height: '150px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {c.image_url ? (
                                <img src={c.image_url} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <BookOpen size={48} color="#cbd5e1" />
                            )}
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>{c.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#E91E63' }}>₹{c.fee}</span>
                                <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{c.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
