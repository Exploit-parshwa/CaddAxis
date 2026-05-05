'use client';
import { useState, useEffect } from 'react';
import { getExams, createExam, deleteExam } from '@/app/actions';
import { Plus, Trash, ClipboardList } from 'lucide-react';

export default function FranchiseExams() {
    const [exams, setExams] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', date: '', type: 'offline', total_marks: 100, course_name: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        const data = await getExams();
        setExams(data);
    };

    const handleAdd = async () => {
        await createExam(newExam);
        setShowAdd(false);
        load();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald' }}>EXAMS & <span style={{ color: '#E91E63' }}>MARKSHEETS</span></h1>
                <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#E91E63', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Schedule Exam
                </button>
            </div>

            {showAdd && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Exam Title" className="input" onChange={e => setNewExam({ ...newExam, title: e.target.value })} />
                        <input type="date" className="input" onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                        <input placeholder="Course" className="input" onChange={e => setNewExam({ ...newExam, course_name: e.target.value })} />
                        <input placeholder="Total Marks" type="number" className="input" onChange={e => setNewExam({ ...newExam, total_marks: e.target.value })} />
                    </div>
                    <button onClick={handleAdd} style={{ marginTop: '1rem', padding: '0.8rem 2rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Schedule</button>
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Course</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{e.title}</td>
                                <td style={{ padding: '1rem' }}>{new Date(e.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>{e.course_name}</td>
                                <td style={{ padding: '1rem' }}><span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>{e.type}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{` .input { padding: 0.8rem; border: 1px solid #e2e8f0; borderRadius: 8px; width: 100%; outline: none; } `}</style>
        </div>
    );
}
