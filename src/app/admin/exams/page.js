'use client';
import { useState, useEffect } from 'react';
import { getExams, createExam, deleteExam, getStudents, addExamResult, getExamResults, requestCertificate } from '@/app/actions';
import { FileText, Lock, Users, Monitor, Award, Plus, Trash, Search, Save, X, Check } from 'lucide-react';

export default function ExamsPage() {
    const [activeTab, setActiveTab] = useState('enrollment');
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Results Entry State
    const [selectedExamId, setSelectedExamId] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentForMarks, setSelectedStudentForMarks] = useState(null);
    const [marksData, setMarksData] = useState({ marks_obtained: '', grade: '', remarks: '' });

    const [newExam, setNewExam] = useState({ title: '', date: '', type: 'paper', total_marks: 100, course_name: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const examsData = await getExams();
        setExams(examsData);
        const studentsData = await getStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
    };

    useEffect(() => {
        if (searchTerm) {
            setFilteredStudents(students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredStudents(students);
        }
    }, [searchTerm, students]);


    const handleCreateExam = async (e) => {
        e.preventDefault();
        await createExam(newExam);
        alert('Exam scheduled successfully!');
        setShowModal(false);
        setNewExam({ title: '', date: '', type: 'paper', total_marks: 100, course_name: '' });
        loadData(); // Reload exams
    };

    const handleDeleteExam = async (id) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            await deleteExam(id);
            loadData();
        }
    };

    const handleSaveResult = async (e) => {
        e.preventDefault();
        if (!selectedExamId || !selectedStudentForMarks) {
            alert('Please select an exam and a student.');
            return;
        }

        const res = await addExamResult({
            student_id: selectedStudentForMarks.id,
            exam_id: selectedExamId,
            ...marksData
        });

        if (res.success) {
            alert('Result saved successfully!');
            setMarksData({ marks_obtained: '', grade: '', remarks: '' });
            setSelectedStudentForMarks(null);
        }
    };

    // Auto-calculate grade
    useEffect(() => {
        const marks = parseFloat(marksData.marks_obtained);
        const exam = exams.find(e => e.id == selectedExamId);
        if (!isNaN(marks) && exam) {
            const percentage = (marks / exam.total_marks) * 100;
            let grade = 'F';
            if (percentage >= 80) grade = 'A';
            else if (percentage >= 60) grade = 'B';
            else if (percentage >= 40) grade = 'C';
            else if (percentage >= 33) grade = 'D'; // Standard passing

            setMarksData(prev => ({ ...prev, grade }));
        }
    }, [marksData.marks_obtained, selectedExamId, exams]);


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        EXAMINATION CELL <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Schedule exams and manage student results.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Schedule New Exam
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', color: '#1e293b' }}>Schedule Exam</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateExam} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Exam Title</label>
                                <input required placeholder="Mid-Term Assessment" value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input required type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select value={newExam.type} onChange={e => setNewExam({ ...newExam, type: e.target.value })} className="form-select">
                                    <option value="paper">Paper Based</option>
                                    <option value="online">Online / Lab</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Course Name</label>
                                <input required placeholder="AutoCAD Civil 3D" value={newExam.course_name} onChange={e => setNewExam({ ...newExam, course_name: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Marks</label>
                                <input required type="number" placeholder="100" value={newExam.total_marks} onChange={e => setNewExam({ ...newExam, total_marks: e.target.value })} className="form-input" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Schedule</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    {[
                        { id: 'enrollment', label: 'All Exams', icon: Users },
                        { id: 'certificates', label: 'Certificates', icon: Award },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '1.25rem',
                                border: 'none',
                                background: activeTab === tab.id ? 'white' : 'transparent',
                                borderTop: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? '600' : '500',
                                color: activeTab === tab.id ? 'var(--primary)' : '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '2.5rem' }}>

                    {activeTab === 'enrollment' && (
                        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                            {exams.map(exam => (
                                <div key={exam.id} style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    transition: 'transform 0.2s',
                                    borderLeft: `5px solid ${exam.type === 'paper' ? '#f59e0b' : '#3b82f6'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'Oswald', color: '#1e293b' }}>{exam.title}</h4>
                                        <button onClick={() => handleDeleteExam(exam.id)} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }}><Trash size={16} /></button>
                                    </div>
                                    <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Course:</span>
                                            <span style={{ fontWeight: 500, color: '#334155' }}>{exam.course_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Date:</span>
                                            <span style={{ fontWeight: 500, color: '#334155' }}>{new Date(exam.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: () => exam.type === 'paper' ? '#fffbeb' : '#eff6ff', color: exam.type === 'paper' ? '#b45309' : '#1d4ed8', borderRadius: '50px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exam.type}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Max Marks: {exam.total_marks}</span>
                                    </div>
                                </div>
                            ))}
                            {exams.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>No exams scheduled. Click "Schedule New Exam" to begin.</div>}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                            {/* Step 1: Select Exam */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h3 style={{ fontFamily: 'Oswald', fontSize: '1.3rem', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'inline-block' }}>1. Select Exam</h3>
                                <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {exams.map(exam => (
                                        <div
                                            key={exam.id}
                                            onClick={() => setSelectedExamId(exam.id)}
                                            style={{
                                                padding: '1.25rem',
                                                border: selectedExamId === exam.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: selectedExamId === exam.id ? '#fff1f2' : 'white',
                                                transition: 'all 0.2s',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ fontWeight: '600', color: selectedExamId === exam.id ? 'var(--primary)' : '#334155', marginBottom: '0.25rem' }}>{exam.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(exam.date).toLocaleDateString()} • {exam.course_name}</div>
                                            {selectedExamId === exam.id && (
                                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Select Student & Enter Marks */}
                            <div>
                                <h3 style={{ fontFamily: 'Oswald', fontSize: '1.3rem', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>2. Enter Results</h3>
                                {!selectedExamId ? (
                                    <div style={{ padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                                        Please select an exam from the list to proceed.
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem' }}>
                                        {/* Student Search */}
                                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="text"
                                                placeholder="Search Student Name..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="form-input"
                                                style={{ paddingLeft: '2.5rem' }}
                                            />
                                            {searchTerm && !selectedStudentForMarks && (
                                                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 10, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                                    {filteredStudents.map(student => (
                                                        <div
                                                            key={student.id}
                                                            onClick={() => { setSelectedStudentForMarks(student); setSearchTerm(''); }}
                                                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                        >
                                                            <span style={{ fontWeight: 500, color: '#334155' }}>{student.name}</span>
                                                            <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{student.course}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Result Form */}
                                        {selectedStudentForMarks ? (
                                            <div className="card" style={{ padding: '2rem', border: '2px solid var(--primary)', animation: 'fadeIn 0.3s ease-in-out' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Student</div>
                                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{selectedStudentForMarks.name}</div>
                                                    </div>
                                                    <button onClick={() => setSelectedStudentForMarks(null)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                                                </div>

                                                <form onSubmit={handleSaveResult} style={{ display: 'grid', gap: '1.25rem' }}>
                                                    <div className="form-group">
                                                        <label className="form-label">Marks Obtained <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Max: {exams.find(e => e.id == selectedExamId)?.total_marks})</span></label>
                                                        <input
                                                            type="number"
                                                            required
                                                            value={marksData.marks_obtained}
                                                            onChange={e => setMarksData({ ...marksData, marks_obtained: e.target.value })}
                                                            className="form-input"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                                        <div className="form-group">
                                                            <label className="form-label">Grade</label>
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={marksData.grade}
                                                                className="form-input"
                                                                style={{ background: '#f8fafc', fontWeight: 'bold' }}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Remarks</label>
                                                            <input
                                                                type="text"
                                                                value={marksData.remarks}
                                                                onChange={e => setMarksData({ ...marksData, remarks: e.target.value })}
                                                                className="form-input"
                                                                placeholder="Good"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                        <Save size={18} /> Save Result
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ marginBottom: '0.5rem' }}><Search size={32} style={{ opacity: 0.3 }} /></div>
                                                Search and select a student above to enter marks.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* NEW: Certificates Tab (V2 Feature) */}
                    {activeTab === 'certificates' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <CertificateRequestForm students={students} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: Certificate Request (V2) ---
function CertificateRequestForm({ students }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    // Hardcoded Franchise ID for now (In real app, get from session)
    const franchiseId = 1;

    const handleApply = async () => {
        if (!selectedStudent) return;

        // Popup Confirmation
        const amount = 500; // Example Cert Fee
        if (!confirm(`Confirm certificate application for ${selectedStudent.name}? This will deduct ₹${amount} from your wallet.`)) return;

        setLoading(true);
        // Import requestCertificate dynamically or pass as prop if Next.js Client Comp issues


        const res = await requestCertificate({
            franchiseId,
            studentId: selectedStudent.id,
            courseName: selectedStudent.course,
            amount
        });

        if (res.success) {
            alert("Success! Certificate Generated. Email sent to your inbox.");
            setSelectedStudent(null);
        } else {
            alert("Error: " + res.error);
        }
        setLoading(false);
    };

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.4rem', color: '#1e293b', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                Apply for Certificate
            </h3>

            {!selectedStudent ? (
                <div style={{ position: 'relative' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Student</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Type student name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    {searchTerm && (
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                            {filtered.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => setSelectedStudent(s)}
                                    style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                >
                                    {s.name} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({s.course})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold' }}>{selectedStudent.name}</span>
                        <button onClick={() => setSelectedStudent(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                        Course: {selectedStudent.course}<br />
                        Fee Status: {parseFloat(selectedStudent.fee_paid) >= parseFloat(selectedStudent.fee_total) ? <span style={{ color: 'green' }}>Paid</span> : <span style={{ color: 'orange' }}>Pending</span>}
                    </div>

                    <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '0.85rem', color: '#92400e', marginBottom: '1rem' }}>
                        <b>Note:</b> ₹500 will be deducted from your wallet balance.
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? 'Processing...' : 'Confirm & Apply'}
                    </button>
                </div>
            )}
        </div>
    );
}
