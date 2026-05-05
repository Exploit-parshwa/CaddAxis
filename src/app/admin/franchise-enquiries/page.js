'use client';
import { useState, useEffect } from 'react';
import { getFranchiseEnquiries, updateFranchiseStatus, deleteFranchiseEnquiry } from '@/app/actions';
import { Phone, Mail, MapPin, IndianRupee, Eye, Check, X as XIcon, Trash } from 'lucide-react';

export default function FranchiseEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getFranchiseEnquiries();
        setEnquiries(data);
    };

    const handleStatusChange = async (id, newStatus) => {
        await updateFranchiseStatus(id, newStatus);
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this enquiry?')) {
            await deleteFranchiseEnquiry(id);
            loadData();
        }
    };

    const filteredEnquiries = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    FRANCHISE ENQUIRIES <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Manage interest for new franchise locations.</p>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['all', 'new', 'contacted', 'interested', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            border: filter === status ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                            background: filter === status ? 'var(--primary)' : 'white',
                            color: filter === status ? 'white' : '#64748b',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: filter === status ? '0 4px 6px -1px rgba(233, 30, 99, 0.2)' : 'none'
                        }}
                    >
                        {status} <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: '0.25rem' }}>({status === 'all' ? enquiries.length : enquiries.filter(e => e.status === status).length})</span>
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredEnquiries.map(enq => (
                    <div key={enq.id} className="card" style={{ padding: '2rem', borderLeft: enq.status === 'new' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'transform 0.2s', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Oswald', color: '#334155' }}>{enq.name}</h3>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={16} /> {enq.email}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={16} /> {enq.phone}
                                    </span>
                                    {enq.city && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={16} /> {enq.city}, {enq.state}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span style={{
                                padding: '0.35rem 1rem',
                                borderRadius: '20px',
                                background: enq.status === 'new' ? '#eff6ff' : enq.status === 'contacted' ? '#fffbeb' : enq.status === 'interested' ? '#f0fdf4' : '#fef2f2',
                                color: enq.status === 'new' ? '#1d4ed8' : enq.status === 'contacted' ? '#b45309' : enq.status === 'interested' ? '#15803d' : '#b91c1c',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                border: '1px solid transparent',
                                borderColor: enq.status === 'new' ? '#bfdbfe' : enq.status === 'contacted' ? '#fde68a' : enq.status === 'interested' ? '#bbf7d0' : '#fecaca'
                            }}>
                                {enq.status}
                            </span>
                        </div>

                        {enq.investment_capacity && (
                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', background: '#fff1f2', padding: '0.75rem 1rem', borderRadius: '8px', display: 'inline-flex' }}>
                                <IndianRupee size={18} />
                                <strong style={{ fontWeight: 600 }}>Investment Capacity:</strong> {enq.investment_capacity}
                            </div>
                        )}

                        {enq.message && (
                            <div style={{ padding: '0', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '2px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Message</div>
                                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#334155' }}>{enq.message}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                Received: {new Date(enq.created_at).toLocaleString()}
                            </span>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => handleStatusChange(enq.id, 'contacted')} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    Mark Contacted
                                </button>
                                <button onClick={() => handleStatusChange(enq.id, 'interested')} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderColor: '#86efac', color: '#16a34a', background: '#f0fdf4' }}>
                                    <Check size={16} style={{ marginRight: '0.5rem' }} /> Mark Interested
                                </button>
                                <button onClick={() => handleStatusChange(enq.id, 'rejected')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fda4af', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                                    Reject
                                </button>
                                <button onClick={() => handleDelete(enq.id)} style={{ padding: '0.5rem', marginLeft: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEnquiries.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        <div style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                            <Mail size={48} />
                        </div>
                        <p style={{ fontSize: '1.1rem' }}>No enquiries found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
