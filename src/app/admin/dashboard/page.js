'use client';
import { useState, useEffect } from 'react';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { getWalletBalance } from '@/app/actions';

export default function AdminDashboard() {
    const [role, setRole] = useState('SUPER');

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        const r = getCookie('ui_role');
        if (r === 'FRANCHISE') setRole('FRANCHISE');
    }, []);

    const isFranchise = role === 'FRANCHISE';

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif', paddingBottom: '3rem' }}>
            {/* Header Section */}
            <div style={{
                background: 'white',
                padding: '2rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '3rem'
            }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', margin: 0, fontSize: '2rem', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                        {isFranchise ? 'FRANCHISE DASHBOARD' : 'MAIN DASHBOARD'} <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
                        {isFranchise ? 'Manage your center operations and students.' : 'Welcome back, Administrator'}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link href="/" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>
                        View Website
                    </Link>
                    <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                                {isFranchise ? 'Center Manager' : 'Admin User'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {isFranchise ? 'partner@caddaxis.com' : 'admin@caddaxis.com'}
                            </div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isFranchise ? '#e0f2fe' : 'rgb(255 220 230)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFranchise ? '#0284c7' : 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>
                            {isFranchise ? 'F' : 'A'}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 3rem' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Stat Card 1 */}
                    <div className="card" style={{ padding: '2rem', margin: 0 }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isFranchise ? 'Center Enrollment' : 'Total Enrollment'}
                        </p>
                        <h3 style={{ fontSize: '2.5rem', margin: '1rem 0', color: '#1e293b', fontFamily: 'Oswald' }}>
                            {isFranchise ? '154' : '5.2K'}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 500 }}>
                            <span style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>+12%</span>
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last month</span>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="card" style={{ padding: '2rem', margin: 0 }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isFranchise ? 'Active Batches' : 'Active Courses'}
                        </p>
                        <h3 style={{ fontSize: '2.5rem', margin: '1rem 0', color: '#1e293b', fontFamily: 'Oswald' }}>
                            {isFranchise ? '8' : '120'}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#E91E63', fontWeight: 500 }}>
                            <span style={{ background: '#fce7f3', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>+1 New</span>
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>this week</span>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="card" style={{ padding: '2rem', margin: 0 }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue (YTD)</p>
                        <h3 style={{ fontSize: '2.5rem', margin: '1rem 0', color: '#1e293b', fontFamily: 'Oswald' }}>
                            {isFranchise ? '₹4.5L' : '₹45L'}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 500 }}>
                            <span style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>+8%</span>
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>growth</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Oswald', fontSize: '1.4rem', color: '#1e293b', margin: 0 }}>Wallet & Activity</h3>
                        {isFranchise && (
                            <Link href="/admin/recharge" style={{ background: '#E91E63', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                + Recharge Wallet
                            </Link>
                        )}
                    </div>

                    {isFranchise && (
                        <div className="card" style={{ padding: '0', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div style={{ padding: '2rem', borderRight: '1px solid #f1f5f9' }}>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Available Balance</p>
                                <WalletBalance />
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Certificate Cost</p>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#334155', marginTop: '0.5rem' }}>₹100 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}>/ cert</span></div>
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ padding: '0' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: i !== 3 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff1f2', color: '#E91E63', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontSize: '0.9rem' }}>
                                    ●
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                                        {isFranchise ? 'Student fees pending' : 'New student registration verified'}
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                        {isFranchise ? 'Reminder for Batch A1' : 'Rahul Kumar for AutoCAD Civil 3D Course'}
                                    </div>
                                </div>
                                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: '500' }}>2m ago</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function WalletBalance() {
    const [balance, setBalance] = useState('...');

    useEffect(() => {
        getWalletBalance().then(r => setBalance(r.balance)).catch(() => setBalance(0));
    }, []);

    return (
        <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', color: '#1e293b', marginTop: '0.5rem' }}>
            ₹{Number(balance).toLocaleString()}
        </div>
    );
}
