'use client';

export default function ReportsPage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    ANALYTICS & REPORTS <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Overview of system performance and financial metrics.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ fontFamily: 'Oswald', fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem' }}>Revenue Report</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Revenue (Dec 2024 - Jan 2025)</span>
                        <strong style={{ fontSize: '2rem', color: '#0f172a' }}>2.5 Lakhs</strong>
                    </div>
                </div>
                <div className="card" style={{ padding: '2rem', borderLeft: '4px solid #0ea5e9' }}>
                    <h3 style={{ fontFamily: 'Oswald', fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem' }}>Student Performance</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Average Score</span>
                        <strong style={{ fontSize: '2rem', color: '#0f172a' }}>85%</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}
