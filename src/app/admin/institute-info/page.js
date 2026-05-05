'use client';
import { useState, useEffect } from 'react';
import { getInstituteInfo } from '@/app/actions';
import { Building, Users, FileText, IndianRupee, MapPin, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstituteInfoPage() {
    const [franchises, setFranchises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFranchise, setSelectedFranchise] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getInstituteInfo();
            setFranchises(data);
        } catch (e) {
            console.error("Failed to load info", e);
        }
        setLoading(false);
    };

    const filtered = franchises.filter(f =>
        f.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#1e293b', letterSpacing: '-0.5px', margin: 0 }}>
                        INSTITUTE INFO <span style={{ color: 'var(--primary)' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Performance overview and documentation for all franchise partners.
                    </p>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search City or Email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '3rem', width: '100%', borderRadius: '50px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Institute Data...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: selectedFranchise ? '1fr 1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', transition: 'all 0.3s ease' }}>

                    {/* LIST OF FRANCHISES */}
                    {filtered.map(franchise => (
                        <motion.div
                            layoutId={franchise.id}
                            key={franchise.id}
                            onClick={() => setSelectedFranchise(franchise)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: selectedFranchise?.id === franchise.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                overflow: 'hidden',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            whileHover={{ y: -5 }}
                        >
                            <div style={{ padding: '1.5rem', background: 'linear-gradient(to right, #f8fafc, white)', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontFamily: 'Oswald', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Building size={20} color="var(--primary)" />
                                            {franchise.city.toUpperCase()} CENTER
                                        </h3>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>{franchise.email}</div>
                                    </div>
                                    {franchise.balance < 1000 && (
                                        <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 'bold' }}>
                                            LOW BALANCE
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Key Stats Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #f1f5f9' }}>
                                <StatBox icon={Users} label="Students" value={franchise.stats.enrolled || 0} color="#3b82f6" />
                                <StatBox icon={FileText} label="Certificates" value={franchise.stats.certificates || 0} color="#8b5cf6" />
                                <StatBox icon={IndianRupee} label="Wallet" value={`₹${franchise.balance}`} color="#10b981" />
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                                    Joined: {new Date(franchise.created_at || Date.now()).toLocaleDateString()}
                                </span>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    View Details <ExternalLink size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* DETAIL VIEW (Right Panel) */}
                    {selectedFranchise && (
                        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                            <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                                <div style={{ padding: '2rem', background: '#1e293b', color: 'white' }}>
                                    <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', margin: 0 }}>{selectedFranchise.city} DASHBOARD</h2>
                                    <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Full activity log and documentation.</p>
                                </div>

                                <div style={{ padding: '2rem' }}>

                                    {/* 1. Documents Gallery */}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ImageIcon size={18} /> UPLOADED DOCUMENTS
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                                        {selectedFranchise.documents && selectedFranchise.documents.length > 0 ? (
                                            selectedFranchise.documents.map((doc, i) => (
                                                <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ height: '100px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {/* Placeholder for Image, ideally use Next/Image */}
                                                        {doc.url ? (
                                                            <img src={doc.url} alt={doc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <FileText size={32} color="#cbd5e1" />
                                                        )}
                                                    </div>
                                                    <div style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {doc.title || doc.doc_type}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                                No documents uploaded yet.
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Detailed Performance Stats */}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Building size={18} /> PERFORMANCE METRICS
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <MetricRow label="Total Enquiries" value={selectedFranchise.stats.enquiries || '0'} />
                                        <MetricRow label="Enrolled Students" value={selectedFranchise.stats.enrolled || '0'} highlight />
                                        <MetricRow label="Course Completions" value={selectedFranchise.stats.completed || '0'} />
                                        <MetricRow label="Certificates Issued" value={selectedFranchise.stats.certificates || '0'} />
                                        <MetricRow label="Wallet Balance" value={'₹' + selectedFranchise.balance} color={selectedFranchise.balance < 500 ? 'red' : 'green'} />
                                        <MetricRow label="Last Active" value="Just now" />
                                    </div>

                                    <button
                                        onClick={() => setSelectedFranchise(null)}
                                        style={{ marginTop: '2.5rem', width: '100%', padding: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        CLOSE DETAILS
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                            <Building size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p>No franchises found matching your search.</p>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

// Helper Components
function StatBox({ icon: Icon, label, value, color }) {
    return (
        <div style={{ padding: '1rem', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: '50%', background: `${color}15`, color: color }}>
                    <Icon size={18} />
                </div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
}

function MetricRow({ label, value, highlight, color }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{label}</span>
            <span style={{ fontSize: '1rem', fontWeight: highlight ? 'bold' : '500', color: color || (highlight ? '#1e293b' : '#334155') }}>{value}</span>
        </div>
    );
}
