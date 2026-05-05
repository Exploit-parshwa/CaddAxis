'use client';
import { useState, useEffect } from 'react';
import { getRechargeRequests, processRecharge } from '@/app/actions';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function RechargeApprovals() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        setLoading(true);
        const data = await getRechargeRequests(filter);
        setRequests(data);
        setLoading(false);
    };

    const handleAction = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        const res = await processRecharge(id, action);
        if (res.success) {
            alert("Success!");
            loadData();
        } else {
            alert("Error: " + res.error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#1a1a1a' }}>
                    WALLET <span style={{ color: 'var(--primary)' }}>APPROVALS.</span>
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {['pending', 'approved', 'rejected', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.4rem 1rem',
                                border: 'none',
                                background: filter === f ? 'var(--primary)' : 'transparent',
                                color: filter === f ? 'white' : '#64748b',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Franchise</th>
                            <th>Amount</th>
                            <th>Reference (UTR)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                        ) : requests.length > 0 ? (
                            requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {new Date(req.request_date).toLocaleString()}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{req.franchise_name || 'Franchise'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.franchise_email}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{req.city}</div>
                                    </td>
                                    <td style={{ fontFamily: 'Oswald', fontSize: '1.1rem', color: '#10b981' }}>
                                        ₹{Number(req.amount).toLocaleString()}
                                    </td>
                                    <td style={{ fontFamily: 'monospace', background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                                        {req.transaction_ref || 'N/A'}
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase',
                                            background: req.status === 'pending' ? '#fff7ed' : req.status === 'approved' ? '#dcfce7' : '#fee2e2',
                                            color: req.status === 'pending' ? '#c2410c' : req.status === 'approved' ? '#166534' : '#991b1b',
                                            border: `1px solid ${req.status === 'pending' ? '#ffedd5' : req.status === 'approved' ? '#bbf7d0' : '#fca5a5'}`
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleAction(req.id, 'approve')}
                                                    style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem' }}
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'reject')}
                                                    style={{ padding: '0.4rem 0.8rem', background: '#ffffff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem' }}
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
