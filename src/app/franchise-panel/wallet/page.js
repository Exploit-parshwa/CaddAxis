'use client';
import { Wallet, IndianRupee, History } from 'lucide-react';

export default function FranchiseWallet() {
    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', marginBottom: '2rem' }}>WALLET & <span style={{ color: '#E91E63' }}>TOPUP</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Available Balance</p>
                            <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', margin: 0 }}>45 <span style={{ fontSize: '1rem', color: '#cbd5e1' }}>Credits</span></h2>
                        </div>
                        <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Wallet size={24} color="#E91E63" />
                        </div>
                    </div>

                    <button style={{ width: '100%', padding: '1rem', background: '#E91E63', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Add Credits
                    </button>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>1 Credit = 1 Certificate Issue</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={18} /> Transaction History
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold', fontSize: '0.95rem' }}>{i === 1 ? 'Wallet Recharge' : 'Certificate Issue'}</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>22 Jan 2026</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold', color: i === 1 ? '#16a34a' : '#ef4444' }}>
                                        {i === 1 ? '+50' : '-1'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Credits</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
