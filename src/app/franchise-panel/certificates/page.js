'use client';
import { useState, useEffect } from 'react';
import { Award, CheckCircle, Search, UserCheck } from 'lucide-react';

export default function FranchiseCertificates() {
    const [stats, setStats] = useState({ issued: 0, balance: 0 });
    const [requests, setRequests] = useState([]);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [issueData, setIssueData] = useState({ studentId: '', courseId: '', uniqueId: '' });

    // Mock Load
    useEffect(() => {
        setStats({ issued: 15, balance: 45 });
        setRequests([
            { id: 1, student: 'Rohan Patil', course: 'Civil 3D', date: '2024-01-20', status: 'Issued', certId: 'CX-2024-001' },
            { id: 2, student: 'Sneha Deshmukh', course: 'Revit Arch', date: '2024-01-22', status: 'Pending', certId: '-' }
        ]);
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: 0 }}>CERTIFICATE <span style={{ color: '#E91E63' }}>DESK</span></h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: '8px', color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={18} /> Balance: {stats.balance}
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Instant Issue</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input placeholder="Student ID / Name" className="franchise-input" />
                    <select className="franchise-input">
                        <option>Select Course</option>
                        <option>AutoCAD Civil 3D</option>
                        <option>Revit Architecture</option>
                    </select>
                    <button style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Validate & Issue
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', color: '#334155' }}>Issue History</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Course</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Cert ID</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.student}</td>
                                <td style={{ padding: '1rem' }}>{r.course}</td>
                                <td style={{ padding: '1rem' }}>{r.date}</td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{r.certId}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
                                        background: r.status === 'Issued' ? '#dcfce7' : '#f1f5f9',
                                        color: r.status === 'Issued' ? '#166534' : '#64748b'
                                    }}>{r.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .franchise-input {
                    padding: 0.8rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
