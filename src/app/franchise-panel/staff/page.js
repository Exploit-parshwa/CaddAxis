'use client';
import { useState, useEffect } from 'react';
import { getStaff, createStaff, deleteStaff } from '@/app/actions';
import { Plus, Trash, User } from 'lucide-react';

export default function FranchiseStaff() {
    const [staff, setStaff] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Instructor', phone: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        const data = await getStaff();
        setStaff(data); // In V2 this should be filtered by franchise
    };

    const handleAdd = async () => {
        await createStaff(newStaff);
        setShowAdd(false);
        setNewStaff({ name: '', email: '', role: 'Instructor', phone: '' });
        load();
    };

    const handleDelete = async (id) => {
        if (confirm('Delete staff?')) {
            await deleteStaff(id);
            load();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald' }}>STAFF <span style={{ color: '#E91E63' }}>MEMBERS</span></h1>
                <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#E91E63', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Staff
                </button>
            </div>

            {showAdd && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Name" className="input" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
                        <input placeholder="Email" className="input" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
                        <input placeholder="Phone" className="input" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
                        <select className="input" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}>
                            <option>Instructor</option>
                            <option>Counselor</option>
                            <option>Manager</option>
                        </select>
                    </div>
                    <button onClick={handleAdd} style={{ marginTop: '1rem', padding: '0.8rem 2rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {staff.map(s => (
                    <div key={s.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#64748b" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>{s.name}</h4>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.role} • {s.email}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(s.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                ))}
            </div>
            <style jsx>{` .input { padding: 0.8rem; border: 1px solid #e2e8f0; borderRadius: 8px; width: 100%; outline: none; } `}</style>
        </div>
    );
}
