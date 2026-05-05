'use client';
import { useState, useEffect } from 'react';
import { getStaff, createStaff, updateStaff, deleteStaff } from '@/app/actions';
import { Plus, Edit, Trash, X, Save } from 'lucide-react';

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Instructor', phone: '' });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        const data = await getStaff();
        setStaff(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateStaff(isEditing, formData);
            alert('Staff updated successfully');
        } else {
            await createStaff(formData);
            alert('Staff added successfully');
        }
        setShowModal(false);
        setIsEditing(null);
        setFormData({ name: '', email: '', role: 'Instructor', phone: '' });
        loadStaff();
    };

    const handleEdit = (s) => {
        setFormData(s);
        setIsEditing(s.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await deleteStaff(id);
            loadStaff();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        STAFF DIRECTORY <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Manage instructors and administrative staff.</p>
                </div>
                <button
                    onClick={() => { setIsEditing(null); setFormData({ name: '', email: '', role: 'Instructor', phone: '' }); setShowModal(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> Add Staff Member
                </button>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="card" style={{ width: '550px', padding: '0', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h2 style={{ fontSize: '1.25rem', fontFamily: 'Oswald', margin: 0, color: '#1e293b' }}>
                                {isEditing ? 'EDIT STAFF MEMBER' : 'ADD NEW STAFF'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input required placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input required type="email" placeholder="e.g. john@caddaxis.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input required placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="form-select">
                                    <option value="Instructor">Instructor</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Counselor">Counselor</option>
                                </select>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Save size={18} /> Save Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Role</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Phone</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#475569' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length > 0 ? staff.map((s, index) => (
                            <tr key={s.id} style={{ borderBottom: index === staff.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#1e293b' }}>{s.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        background: s.role === 'Admin' ? '#fce7f3' : s.role === 'Instructor' ? '#e0f2fe' : '#f1f5f9',
                                        color: s.role === 'Admin' ? '#be185d' : s.role === 'Instructor' ? '#0369a1' : '#475569'
                                    }}>
                                        {s.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{s.email}</td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{s.phone}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(s)} className="btn btn-icon" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="btn btn-icon btn-icon-danger" title="Delete">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No staff members found. Add one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
