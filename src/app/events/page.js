import Navbar from '@/components/Navbar';
import { Calendar, MapPin } from 'lucide-react';

export default function EventsPage() {
    return (
        <main>
            <Navbar />
            <div className="section" style={{ background: 'var(--surface-alt)' }}>
                <div className="container">
                    <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Upcoming Events & Workshops</h1>

                    <div className="grid-2">
                        <div className="card" style={{ display: 'flex' }}>
                            <div style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>15</span>
                                <span style={{ textTransform: 'uppercase' }}>Jan</span>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AutoCAD Workshop 2025</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    <MapPin size={16} /> Main Campus Hall
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    A 2-day intensive workshop on advanced AutoCAD 3D modeling techniques.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ display: 'flex' }}>
                            <div style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>28</span>
                                <span style={{ textTransform: 'uppercase' }}>Feb</span>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Civil Engineering Seminar</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    <MapPin size={16} /> Auditorium
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Guest lecture by Industry Experts on "Future of Infrastructure Design".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
