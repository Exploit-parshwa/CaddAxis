'use client';
import { useState, useEffect } from 'react';
import { getFranchiseStats } from '@/app/actions_franchise';
import { CreditCard, Users, Award, AlertCircle } from 'lucide-react';

export default function FranchiseDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get ID from cookie
        const match = document.cookie.match(new RegExp('(^| )franchise_session=([^;]+)'));
        if (match) {
            const id = match[2];
            loadData(id);
        } else {
            window.location.href = '/franchise-panel/login';
        }
    }, []);

    const loadData = async (id) => {
        const data = await getFranchiseStats(id);
        setStats(data);
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Error loading dashboard.</div>;

    const { franchise, transactions, studentCount, certCount } = stats;

    return (
        <div>
            <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '0.5rem' }}>DASHBOARD</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Welcome back, {franchise.name}. Here is your overview.</p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', borderRadius: '10px', background: '#fdf2f8', color: '#E91E63' }}><CreditCard size={24} /></div>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Certificate Balance</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'Oswald' }}>{franchise.wallet_balance}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', borderRadius: '10px', background: '#f0f9ff', color: '#0ea5e9' }}><Users size={24} /></div>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Total Students</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'Oswald' }}>{studentCount}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a' }}><Award size={24} /></div>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Certificates Issued</p>
                        <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'Oswald' }}>{certCount}</h3>
                    </div>
                </div>
            </div>

            {/* Alert / CTA */}
            {franchise.wallet_balance < 5 && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1rem', color: '#9f1239', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AlertCircle />
                    <div>
                        <strong>Low Balance Warning:</strong> You have {franchise.wallet_balance} certificates left. Please recharge your wallet to avoid interruption in certificate issuance.
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Wallet Activity</h3>
                </div>
                <div style={{ padding: '0 1.5rem' }}>
                    {transactions.length === 0 ? (
                        <p style={{ padding: '2rem 0', color: '#94a3b8', textAlign: 'center' }}>No transactions found.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>
                                    <th style={{ padding: '1rem 0' }}>Date</th>
                                    <th style={{ padding: '1rem 0' }}>Type</th>
                                    <th style={{ padding: '1rem 0' }}>Description</th>
                                    <th style={{ padding: '1rem 0', textAlign: 'right' }}>Certificates</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 5).map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '1rem 0', color: '#64748b' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                background: t.type === 'DEPOSIT' ? '#f0fdf4' : '#fff1f2',
                                                color: t.type === 'DEPOSIT' ? '#166534' : '#be123c',
                                                fontWeight: 'bold'
                                            }}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', color: '#334155' }}>{t.description}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold', color: t.certificates > 0 ? '#16a34a' : '#ef4444' }}>
                                            {t.certificates > 0 ? '+' : ''}{t.certificates}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
