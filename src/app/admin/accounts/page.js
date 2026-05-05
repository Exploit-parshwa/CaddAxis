'use client';
import { useState, useEffect } from 'react';
import { submitRechargeRequest, getRechargeRequests, processRecharge, uploadFile } from '@/app/actions';
import { CreditCard, IndianRupee, Clock, CheckCircle, XCircle, Upload, Search, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountsPage() {
    const [activeTab, setActiveTab] = useState('recharge'); // 'recharge' or 'admin'
    const [balance, setBalance] = useState(0); // Mock balance for now

    // Recharge Form State
    const [rechargeData, setRechargeData] = useState({ amount: '', payment_method: 'UPI', transaction_ref: '', proof_url: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Admin State
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // Mock Franchise ID for demo (simulating session)
    const franchiseId = 1;

    useEffect(() => {
        if (activeTab === 'admin') {
            loadRequests();
        }
    }, [activeTab]);

    const loadRequests = async () => {
        setLoadingRequests(true);
        const data = await getRechargeRequests();
        setRequests(data);
        setLoadingRequests(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await uploadFile(formData);
            if (res.success) {
                setRechargeData(prev => ({ ...prev, proof_url: res.url }));
            }
        } catch (err) {
            alert("Upload failed");
        }
        setIsUploading(false);
    };

    const handleSubmitRecharge = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await submitRechargeRequest({ ...rechargeData, franchiseId });
        if (res.success) {
            alert("Recharge request submitted successfully! Please wait for approval.");
            setRechargeData({ amount: '', payment_method: 'UPI', transaction_ref: '', proof_url: '' });
        } else {
            alert("Error: " + res.error);
        }
        setIsSubmitting(false);
    };

    const handleProcessRequest = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;
        const res = await processRecharge(id, action);
        if (res.success) {
            alert(`Request ${action}ed successfully.`);
            loadRequests();
        } else {
            alert("Failed: " + res.error);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#1e293b', margin: 0 }}>
                    ACCOUNTS & BILLING <span style={{ color: 'var(--primary)' }}>.</span>
                </h1>
                <p style={{ color: '#64748b' }}>Manage your wallet balance and view transaction history.</p>
            </div>

            {/* Navigation Tabs (Simulated Role Access) */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setActiveTab('recharge')}
                    style={{
                        padding: '1rem 2rem', border: 'none', background: 'none',
                        borderBottom: activeTab === 'recharge' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'recharge' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <CreditCard size={18} /> Recharge Wallet
                </button>
                <button
                    onClick={() => setActiveTab('admin')}
                    style={{
                        padding: '1rem 2rem', border: 'none', background: 'none',
                        borderBottom: activeTab === 'admin' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'admin' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <History size={18} /> Admin Requests (Super Admin)
                </button>
            </div>

            {/* TAB 1: FRANCHISE RECHARGE */}
            {activeTab === 'recharge' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>

                    {/* Balance Card */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, opacity: 0.8, fontWeight: '400', fontSize: '1rem' }}>Available Balance</h3>
                                <div style={{ fontSize: '3rem', fontFamily: 'Oswald', margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                                    <IndianRupee size={32} /> {balance.toLocaleString()}
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Updated Just Now</p>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                <CreditCard size={32} color="#4ade80" />
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                <ArrowUpRight size={16} color="#4ade80" /> Last Credit: ₹0.00
                            </div>
                        </div>
                    </div>

                    {/* Recharge Form */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>Top-up Wallet</h3>

                        <form onSubmit={handleSubmitRecharge} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="form-input"
                                    placeholder="e.g. 5000"
                                    value={rechargeData.amount}
                                    onChange={e => setRechargeData({ ...rechargeData, amount: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Mode</label>
                                <select
                                    className="form-select"
                                    value={rechargeData.payment_method}
                                    onChange={e => setRechargeData({ ...rechargeData, payment_method: e.target.value })}
                                >
                                    <option value="UPI">UPI / GPay / PhonePe</option>
                                    <option value="NEFT">Bank Transfer (NEFT/IMPS)</option>
                                    <option value="CASH">Cash Deposit</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Transaction ID / UTR</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Enter Reference Number"
                                    value={rechargeData.transaction_ref}
                                    onChange={e => setRechargeData({ ...rechargeData, transaction_ref: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Upload Payment Screenshot</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                                        <Upload size={16} /> {isUploading ? "Uploading..." : "Choose File"}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    </label>
                                </div>
                                {rechargeData.proof_url && <div style={{ fontSize: '0.8rem', color: 'green', marginTop: '0.5rem' }}>✓ Proof Uploaded</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading || !rechargeData.proof_url}
                                className="btn btn-primary"
                                style={{ marginTop: '1rem', width: '100%' }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 2: SUPER ADMIN REQUESTS */}
            {activeTab === 'admin' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontFamily: 'Oswald', margin: 0 }}>Pending Requests</h3>
                        <button onClick={loadRequests} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '50px', padding: '0.5rem 1rem', cursor: 'pointer' }}>Refresh</button>
                    </div>

                    {loadingRequests ? <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading Requests...</div> : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {requests.filter(r => r.status === 'pending').map(req => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
                                            ₹ {req.amount}
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b', marginLeft: '0.5rem' }}>via {req.payment_method}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                            Franchise: {req.city || 'Unknown'} ({req.franchise_email})
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                            Ref: {req.transaction_ref} • {new Date(req.request_date).toLocaleString()}
                                        </div>
                                        {req.proof_url && (
                                            <a href={req.proof_url} target="_blank" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                                View Proof ↗
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={() => handleProcessRequest(req.id, 'approve')}
                                            className="btn"
                                            style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleProcessRequest(req.id, 'reject')}
                                            className="btn"
                                            style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {requests.filter(r => r.status === 'pending').length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8' }}>
                                    No pending recharge requests.
                                </div>
                            )}
                        </div>
                    )}

                    <h3 style={{ fontSize: '1.4rem', fontFamily: 'Oswald', margin: '3rem 0 1.5rem' }}>Recent History</h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Franchise</th>
                                    <th>Details</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.filter(r => r.status !== 'pending').map(req => (
                                    <tr key={req.id}>
                                        <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                        <td>{req.city}</td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem' }}>{req.payment_method} - {req.transaction_ref}</div>
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>₹{req.amount}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                                background: req.status === 'approved' ? '#dcfce7' : '#fee2e2',
                                                color: req.status === 'approved' ? '#166534' : '#991b1b'
                                            }}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

        </div>
    );
}
