'use client';
import { useState, useEffect } from 'react';
import { getStudents, getExamResults } from '@/app/actions';
import { Search, FileText, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MarksheetPage() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredStudents(students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredStudents(students);
        }
    }, [searchTerm, students]);

    const loadStudents = async () => {
        const data = await getStudents();
        setStudents(data);
        setFilteredStudents(data);
    };

    const handleSelectStudent = async (student) => {
        setSelectedStudent(student);
        const data = await getExamResults(student.id);
        setResults(data);
    };

    const generatePDF = () => {
        if (!selectedStudent) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(0, 77, 153); // Primary Blue
        doc.text('CADDAXIS INSTITUTE', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Excellence in CADD Training', 105, 28, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Student Details
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.text(`Student Name: ${selectedStudent.name}`, 20, 50);
        doc.text(`Roll Number: ${selectedStudent.id.toString().padStart(4, '0')}`, 140, 50);
        doc.text(`Course: ${selectedStudent.course}`, 20, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 60);

        // Results Table
        const tableColumn = ["Exam Title", "Date", "Total Marks", "Obtained", "Grade", "Remarks"];
        const tableRows = [];

        results.forEach(result => {
            const tableData = [
                result.exam_title,
                new Date(result.exam_date).toLocaleDateString(),
                result.total_marks,
                result.marks_obtained,
                result.grade,
                result.remarks || '-'
            ];
            tableRows.push(tableData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'grid',
            headStyles: { fillColor: [0, 77, 153] },
            styles: { fontSize: 10 }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.text('Authorized Signatory', 150, finalY + 40);

        doc.save(`${selectedStudent.name.replace(/\s+/g, '_')}_Marksheet.pdf`);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    MARKSHEET GENERATOR <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>View results and print official certificates.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 3fr', gap: '2rem' }}>
                {/* Student Selection Sidebar */}
                <div className="card" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <h3 style={{ fontFamily: 'Oswald', fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Select Student</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: '2.5rem', width: '100%' }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredStudents.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No students found.</div>
                        ) : (
                            filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    onClick={() => handleSelectStudent(student)}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        cursor: 'pointer',
                                        background: selectedStudent?.id === student.id ? '#fff1f2' : 'transparent',
                                        borderLeft: selectedStudent?.id === student.id ? '4px solid var(--primary)' : '4px solid transparent',
                                        transition: 'all 0.2s',
                                        borderBottom: '1px solid #f1f5f9'
                                    }}
                                    className="hover:bg-slate-50"
                                >
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: selectedStudent?.id === student.id ? 'var(--primary-dark)' : '#334155' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{student.course}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Marksheet Preview */}
                <div className="card" style={{ padding: '2.5rem', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                    {selectedStudent ? (
                        <div style={{ animation: 'fadeIn 0.4s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', fontWeight: 600 }}>Student Profile</span>
                                    <h2 style={{ fontSize: '2rem', fontFamily: 'Oswald', color: '#1e293b', margin: '0.25rem 0' }}>{selectedStudent.name}</h2>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.95rem', color: '#64748b' }}>
                                        <span><strong style={{ color: '#334155' }}>ID:</strong> {selectedStudent.id}</span>
                                        <span><strong style={{ color: '#334155' }}>Course:</strong> {selectedStudent.course}</span>
                                    </div>
                                </div>
                                <button onClick={generatePDF} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                                    <Download size={18} /> Download PDF
                                </button>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'Oswald', marginBottom: '1.5rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} color="var(--primary)" /> Academic Performance
                            </h3>

                            {results.length > 0 ? (
                                <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Exam Title</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Date</th>
                                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Total Marks</th>
                                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Obtained</th>
                                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Grade</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((res, index) => (
                                                <tr key={index} style={{ borderBottom: index === results.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '1rem', fontWeight: '500', color: '#334155' }}>{res.exam_title}</td>
                                                    <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(res.exam_date).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>{res.total_marks}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>{res.marks_obtained}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '0.35rem 0.75rem',
                                                            borderRadius: '50px',
                                                            background: res.grade === 'A' ? '#dcfce7' : res.grade === 'B' ? '#dbeafe' : '#fee2e2',
                                                            color: res.grade === 'A' ? '#166534' : res.grade === 'B' ? '#1e40af' : '#991b1b',
                                                            fontWeight: '700', fontSize: '0.8rem',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                        }}>
                                                            {res.grade}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#64748b', fontStyle: 'italic' }}>{res.remarks || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ padding: '4rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                                    <div style={{ marginBottom: '1rem', opacity: 0.5 }}><FileText size={32} /></div>
                                    <p>No exam results found for this student yet.</p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Search size={32} style={{ opacity: 0.5 }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '0.5rem' }}>No Student Selected</h3>
                            <p>Select a student from the list to generate their marksheet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
