'use client';
import { useState, useEffect } from 'react';
import { addFranchiseCredits, getFranchises, initFranchiseDB } from '../../actions_franchise';
import { IndianRupee, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

export default function PaymentsPage() {
    const [amount, setAmount] = useState(1000);
    const [franchises, setFranchises] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dbInit, setDbInit] = useState(false);

    useEffect(() => {
        // Load Franchises for selection (Simulating Admin View or Franchise picking self)
        getFranchises().then(res => {
            setFranchises(res);
            if (res.length > 0) setSelectedFranchise(res[0].id);
        });
    }, [dbInit]);

    const handleInitDB = async () => {
        setLoading(true);
        const res = await initFranchiseDB();
        setLoading(false);
        if (res.success) {
            alert("Database Initialized Successfully!");
            setDbInit(true);
        } else {
            alert("DB Init Failed: " + res.error);
        }
    };

    const handlePay = async () => {
        if (!selectedFranchise) return alert("Select a franchise");
        if (amount < 100) return alert("Minimum ₹100");

        setLoading(true);
        setMessage('');

        // Simulating Payment Gateway Success
        // In real app: Razorpay.open() -> onSuccess -> call action

        const res = await addFranchiseCredits({ franchiseId: selectedFranchise, amount });

        setLoading(false);
        if (res.success) {
            setMessage(`SUCCESS: Added ${res.certificates} Certificates! Email sent.`);
            // Refresh franchises to show new balance
            getFranchises().then(f => setFranchises(f));
        } else {
            setMessage("ERROR: " + res.error);
        }
    };

    const certs = Math.floor(amount / 100);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2.5rem' }}>CERTIFICATE <span style={{ color: '#E91E63' }}>PAYMENTS</span></h1>
                <button onClick={handleInitDB} style={{ background: '#333', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    Admin: Init DB Schema
                </button>
            </div>

            {/* Pricing Card */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '12px', color: '#E91E63' }}>
                        <Zap size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Franchise Wallet Recharge</h3>
                        <p style={{ color: '#64748b' }}>Purchase credits to issue certificates instantly.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Select Franchise (Simulation)</label>
                        <select
                            value={selectedFranchise}
                            onChange={e => setSelectedFranchise(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '500' }}
                        >
                            <option value="">-- Select Franchise --</option>
                            {franchises.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.city}) - Bal: {f.wallet_balance}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                            Currently showing all franchises for Admin Demo. In prod, Franchise only sees self.
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Payment Amount (INR)</label>
                        <div style={{ position: 'relative' }}>
                            <IndianRupee size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1.2rem', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#166534', fontWeight: '600' }}>YOU WILL RECEIVE</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#15803d', fontFamily: 'Oswald' }}>{certs}</span>
                            <span style={{ fontSize: '1rem', color: '#166534' }}> CERTIFICATES</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b' }}>Rate</span>
                            <span style={{ fontWeight: '600' }}>₹100 / Cert</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePay}
                    disabled={loading || !selectedFranchise}
                    style={{
                        width: '100%', marginTop: '2rem', padding: '1.2rem',
                        background: '#E91E63', color: 'white', border: 'none', borderRadius: '8px',
                        fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Processing Secure Payment...' : `PAY ₹${amount} NOW`}
                </button>

                {message && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: message.startsWith('ERROR') ? '#fef2f2' : '#f0fdf4', color: message.startsWith('ERROR') ? '#dc2626' : '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {message.startsWith('ERROR') ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                        {message}
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem', display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><ShieldCheck size={16} /> 256-bit Secure</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Zap size={16} /> Instant Credit</div>
                <div>Server-Side Validation</div>
            </div>
        </div>
    );
}
