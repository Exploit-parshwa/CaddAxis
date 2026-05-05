'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Eye, Upload, FileSpreadsheet, X, Save, IndianRupee, UserPlus } from 'lucide-react';
import { getStudents, updateStudent, createStudent, deleteStudent, updateStudentProgress, approveAdmission, confirmStudentAdmission, uploadFile } from '@/app/actions';

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState('enrolled');
    const [showImportModal, setShowImportModal] = useState(false);
    const [showNewAdmissionModal, setShowNewAdmissionModal] = useState(false);
    const [showAdmissionModal, setShowAdmissionModal] = useState(false);
    const [admissionData, setAdmissionData] = useState({
        id: null,
        name: '', phone: '', email: '',
        alt_phone: '', address: '',
        proofs: [], custom_proof: '',
        proof_files: {}
    });
    const [activeMenu, setActiveMenu] = useState(null);
    const [students, setStudents] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [viewProfile, setViewProfile] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [newStudentData, setNewStudentData] = useState({
        name: '', email: '', phone: '', course: 'AutoCAD Civil 3D', status: 'enquiry', fee_total: 0, fee_paid: 0
    });
    const fileInputRef = useRef(null);

    const PROOF_OPTIONS = ['Aadhar Card', 'PAN Card', 'Bank Passbook', 'Voter ID', 'Driving License'];

    // Fetch data on load
    useEffect(() => {
        async function load() {
            const data = await getStudents();
            setStudents(data);
        }
        load();
    }, [isEditing, showNewAdmissionModal]);

    // Filter Logic
    const filteredStudents = students.filter(s => {
        if (activeTab === 'enquiries') return s.status === 'enquiry';
        if (activeTab === 'payments') return s.fee_paid > 0 || s.status === 'admitted';
        if (activeTab === 'enrolled') return s.status === 'enrolled';
        return true;
    });

    const handleEditClick = (student) => {
        setEditFormData(student);
        setIsEditing(student.id);
        setActiveMenu(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedStatus = editFormData.status;
        if (Number(editFormData.fee_paid) >= Number(editFormData.fee_total) && Number(editFormData.fee_total) > 0) {
            updatedStatus = 'enrolled';
        }

        if (editFormData.progress !== undefined) {
            await updateStudentProgress(editFormData.id, editFormData.progress);
        }
        await updateStudent(editFormData.id, { ...editFormData, status: updatedStatus });
        alert('Student Details Updated Successfully!');
        setIsEditing(null);
    };

    const handleNewAdmission = async (e) => {
        e.preventDefault();
        await createStudent(newStudentData);
        alert(newStudentData.status === 'enquiry' ? 'Enquiry Added Successfully!' : 'New student admitted successfully!');
        setShowNewAdmissionModal(false);
        setNewStudentData({ name: '', email: '', phone: '', course: 'AutoCAD Civil 3D', status: 'enquiry', fee_total: 0, fee_paid: 0 });
    };

    const handleAdmissionClick = (student) => {
        setAdmissionData({
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            alt_phone: '',
            address: '',
            proofs: [],
            custom_proof: '',
            proof_files: {}
        });
        setShowAdmissionModal(true);
        setActiveMenu(null);
    };


    const toggleProof = (proof) => {
        setAdmissionData(prev => {
            const isSelected = prev.proofs.includes(proof);
            let newProofs = isSelected ? prev.proofs.filter(p => p !== proof) : [...prev.proofs, proof];

            // Cleanup file if unselected
            let newFiles = { ...prev.proof_files };
            if (isSelected) {
                delete newFiles[proof];
            }

            return {
                ...prev,
                proofs: newProofs,
                proof_files: newFiles
            };
        });
    };

    const handleProofFileChange = (proof, file) => {
        setAdmissionData(prev => ({
            ...prev,
            proof_files: {
                ...prev.proof_files,
                [proof]: file
            },
            // Auto-select the checkbox if file valid
            proofs: prev.proofs.includes(proof) ? prev.proofs : [...prev.proofs, proof]
        }));
    };

    const handleConfirmAdmission = async (e) => {
        e.preventDefault();

        // 1. Validation: Ensure all selected proofs have files (or at least one proof)
        if (admissionData.proofs.length === 0 && !admissionData.custom_proof) {
            // If user entered custom proof text, that's fine. But if using checkboxes, require file.
            // Actually user said "add image * as required". So let's enforce file for checked items.
        }

        for (const proof of admissionData.proofs) {
            if (!admissionData.proof_files[proof]) {
                alert(`Please upload an image for ${proof}.`);
                return;
            }
        }

        // 2. Upload Files
        let uploadedProofs = [];

        for (const proof of admissionData.proofs) {
            const file = admissionData.proof_files[proof];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const uploadRes = await uploadFile(formData);
                if (uploadRes.success) {
                    uploadedProofs.push({ name: proof, url: uploadRes.url });
                } else {
                    alert(`Failed to upload ${proof}: ${uploadRes.error}`);
                    return;
                }
            }
        }

        // Handle custom proof (if just text, it's fine. If file needed for custom, we'd need UI for that too. keeping simple for now)
        // User said: "one other (means custom)".
        // Assuming custom is just text for now as per previous UI, or maybe we add a general file input? 
        // "add image * as reqyured" -> apply to checkboxes mainly.

        const submissionData = {
            ...admissionData,
            uploaded_proofs: uploadedProofs // Pass this new structure
        };

        const res = await confirmStudentAdmission(admissionData.id, submissionData);
        if (res.success) {
            let msg = 'Student Admission Confirmed & Enrolled!';
            if (res.generatedPassword) {
                msg += `\n\n[CREDENTIALS GENERATED]\nPassword: ${res.generatedPassword}\n\nPlease share this with the student.`;
            }
            alert(msg);
            setShowAdmissionModal(false);
            const data = await getStudents();
            setStudents(data);
        } else {
            alert('Error: ' + res.error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
            await deleteStudent(id);
            setStudents(students.filter(s => s.id !== id));
            setActiveMenu(null);
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.name.split('.').pop().toLowerCase();
            if (['csv', 'xlsx', 'xls', 'pdf'].includes(fileType)) {
                alert(`File "${file.name}" selected. Import functionality would process this ${fileType.toUpperCase()} file.`);
                setShowImportModal(false);
            } else {
                alert('Please select a valid file (CSV, Excel, or PDF)');
            }
        }
    };

    return (
        <div onClick={() => setActiveMenu(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#1a1a1a' }}>
                    STUDENT <span style={{ color: 'var(--primary)' }}>MANAGEMENT.</span>
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {activeTab === 'enquiries' && (
                        <button className="btn btn-primary" onClick={() => {
                            setNewStudentData(prev => ({ ...prev, status: 'enquiry' }));
                            setShowNewAdmissionModal(true);
                        }} style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}>
                            <Plus size={16} /> Add Enquiry
                        </button>
                    )}
                    <button className="btn btn-outline" onClick={() => setShowImportModal(true)}>
                        <Upload size={16} /> Import Data
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowNewAdmissionModal(true)}>
                        <UserPlus size={16} /> New Admission
                    </button>
                </div>
            </div>

            {/* New Admission Modal */}
            {showNewAdmissionModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '600px', padding: '2rem', margin: 0, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>New Admission</h2>
                            <button onClick={() => setShowNewAdmissionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleNewAdmission}>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={newStudentData.name}
                                    onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    className="form-input"
                                    value={newStudentData.email}
                                    onChange={e => setNewStudentData({ ...newStudentData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    className="form-input"
                                    value={newStudentData.phone}
                                    onChange={e => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Select Course</label>
                                <select
                                    className="form-select"
                                    value={newStudentData.course}
                                    onChange={e => setNewStudentData({ ...newStudentData, course: e.target.value })}
                                >
                                    <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                                    <option value="Revit Architecture">Revit Architecture</option>
                                    <option value="SolidWorks">SolidWorks</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="CATIA V4/V5">CATIA V4/V5</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Initial Status</label>
                                <select
                                    className="form-select"
                                    value={newStudentData.status}
                                    onChange={e => setNewStudentData({ ...newStudentData, status: e.target.value })}
                                >
                                    <option value="enquiry">Enquiry</option>
                                    <option value="admitted">Admitted</option>
                                    <option value="enrolled">Enrolled</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Confirm Admission
                                </button>
                                <button type="button" onClick={() => setShowNewAdmissionModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Admission Modal */}
            {showAdmissionModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '650px', padding: '2rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserPlus size={24} color="var(--primary)" /> Confirm Admission
                            </h2>
                            <button onClick={() => setShowAdmissionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #dbeafe' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.9rem' }}>Student Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div><strong>Name:</strong> {admissionData.name}</div>
                                <div><strong>Phone:</strong> {admissionData.phone}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>Email:</strong> {admissionData.email}</div>
                            </div>
                        </div>

                        <form onSubmit={handleConfirmAdmission}>
                            <div className="form-group">
                                <label className="form-label">Alternative Number</label>
                                <input type="tel" className="form-input" value={admissionData.alt_phone} onChange={e => setAdmissionData({ ...admissionData, alt_phone: e.target.value })} placeholder="Optional" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Address</label>
                                <textarea className="form-input" rows="3" value={admissionData.address} onChange={e => setAdmissionData({ ...admissionData, address: e.target.value })} placeholder="Enter complete address"></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Government Proofs Submitted</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {PROOF_OPTIONS.map(proof => (
                                        <div key={proof} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={admissionData.proofs.includes(proof)}
                                                    onChange={() => toggleProof(proof)}
                                                    style={{ width: '16px', height: '16px' }}
                                                />
                                                {proof}
                                            </label>
                                            {admissionData.proofs.includes(proof) && (
                                                <input
                                                    type="file"
                                                    required
                                                    accept="image/*"
                                                    onChange={(e) => handleProofFileChange(proof, e.target.files[0])}
                                                    style={{ fontSize: '0.8rem', padding: '0.25rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Other Proof (Custom)</label>
                                <input type="text" className="form-input" value={admissionData.custom_proof} onChange={e => setAdmissionData({ ...admissionData, custom_proof: e.target.value })} placeholder="e.g. Student ID, Ration Card" />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                                    Confirm & Enroll Student
                                </button>
                                <button type="button" onClick={() => setShowAdmissionModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Profile Modal - Simplified for brevity, following similar style */}
            {viewProfile && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '500px', padding: '2.5rem', margin: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 10px 20px -5px rgba(233, 30, 99, 0.4)' }}>
                                {viewProfile.name.charAt(0)}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{viewProfile.name}</h2>
                            <span style={{
                                padding: '0.25rem 1rem',
                                borderRadius: '20px',
                                background: viewProfile.status === 'enrolled' ? '#dcfce7' : viewProfile.status === 'admitted' ? '#e0f2fe' : '#fef9c3',
                                color: viewProfile.status === 'enrolled' ? '#166534' : viewProfile.status === 'admitted' ? '#0369a1' : '#854d0e',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {viewProfile.status}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Student ID</span>
                                <span style={{ fontWeight: '600' }}>#{viewProfile.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Email</span>
                                <span style={{ fontWeight: '500' }}>{viewProfile.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Phone</span>
                                <span style={{ fontWeight: '500' }}>{viewProfile.phone}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Course</span>
                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{viewProfile.course}</span>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Fee</span>
                                    <span style={{ fontWeight: '600' }}>₹ {viewProfile.fee_total}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Paid Amount</span>
                                    <span style={{ fontWeight: '600', color: 'green' }}>₹ {viewProfile.fee_paid}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Outstanding</span>
                                    <span style={{ fontWeight: '600', color: 'red' }}>₹ {viewProfile.fee_total - viewProfile.fee_paid}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setViewProfile(null)} className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }}>Close Profile</button>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '500px', padding: '2rem', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Import Student Data</h2>
                            <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: '2px dashed #e2e8f0',
                                padding: '3rem',
                                textAlign: 'center',
                                marginBottom: '1.5rem',
                                borderRadius: '12px',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                        >
                            <input type="file" ref={fileInputRef} accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileImport} style={{ display: 'none' }} />
                            <FileSpreadsheet size={48} style={{ color: '#94a3b8', marginBottom: '1rem', margin: '0 auto 1rem', display: 'block' }} />
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>Click to upload file</p>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Supports CSV, Excel, PDF</p>
                        </div>
                        <button onClick={() => setShowImportModal(false)} className="btn btn-outline" style={{ width: '100%' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Modal (Keeping structure but applying styles) */}
            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '600px', padding: '2rem', margin: 0, maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Edit Student</h2>
                            <button onClick={() => setIsEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" value={editFormData.name || ''} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" value={editFormData.email || ''} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Course</label>
                                <select className="form-select" value={editFormData.course || ''} onChange={e => setEditFormData({ ...editFormData, course: e.target.value })}>
                                    <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                                    <option value="Revit Architecture">Revit Architecture</option>
                                    <option value="SolidWorks">SolidWorks</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                <div className="form-group">
                                    <label className="form-label">Total Fee</label>
                                    <input type="number" className="form-input" value={editFormData.fee_total || 0} onChange={e => setEditFormData({ ...editFormData, fee_total: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Paid Amount</label>
                                    <input type="number" className="form-input" value={editFormData.fee_paid || 0} onChange={e => setEditFormData({ ...editFormData, fee_paid: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Status</label>
                                <select className="form-select" value={editFormData.status || 'enquiry'} onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}>
                                    <option value="enquiry">Enquiry</option>
                                    <option value="admitted">Admitted</option>
                                    <option value="enrolled">Enrolled</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                        {['Enquiries', 'Payments', 'Enrolled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    border: 'none',
                                    background: activeTab === tab.toLowerCase() ? 'white' : 'transparent',
                                    color: activeTab === tab.toLowerCase() ? 'var(--primary)' : '#64748b',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    boxShadow: activeTab === tab.toLowerCase() ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search students..." className="form-input" style={{ paddingLeft: '2.5rem', width: '250px' }} />
                        </div>
                        <button className="btn btn-outline" style={{ padding: '0.75rem' }}><Filter size={18} /></button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Course</th>
                                <th>Payment Info</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? filteredStudents.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#ffe4e6', color: '#be123c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                {s.name.charAt(0)}
                                            </div>
                                            {s.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{ fontSize: '0.9rem' }}>{s.email}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.phone}</span>
                                        </div>
                                    </td>
                                    <td>{s.course}</td>
                                    <td>
                                        {s.fee_total > 0 ? (
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ color: 'green', fontWeight: '600' }}>₹{s.fee_paid.toLocaleString()}</span>
                                                    <span style={{ color: '#cbd5e1' }}>/</span>
                                                    <span style={{ color: '#64748b' }}>₹{s.fee_total.toLocaleString()}</span>
                                                </div>
                                                <div style={{ background: '#f1f5f9', height: '4px', width: '100%', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                                                    <div style={{ background: 'green', height: '100%', width: `${Math.min((s.fee_paid / s.fee_total) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        ) : <span style={{ color: '#cbd5e1' }}>-</span>}
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: '20px',
                                            background: s.status === 'enrolled' ? '#dcfce7' : s.status === 'admitted' ? '#e0f2fe' : '#fef9c3',
                                            color: s.status === 'enrolled' ? '#166534' : s.status === 'admitted' ? '#0369a1' : '#854d0e',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td style={{ position: 'relative' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === s.id ? null : s.id); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem', borderRadius: '4px', transition: 'background 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {/* Action Dropdown */}
                                        {activeMenu === s.id && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '3rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                                zIndex: 100,
                                                minWidth: '180px',
                                                overflow: 'hidden',
                                                padding: '0.5rem'
                                            }}>
                                                {s.status === 'enquiry' && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleAdmissionClick(s); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#16a34a', borderRadius: '4px', fontWeight: '600' }}>
                                                        <UserPlus size={16} /> Process Admission
                                                    </button>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(s); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#334155', borderRadius: '4px' }}>
                                                    <Edit size={16} /> Edit Details
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setViewProfile(s); setActiveMenu(null); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#334155', borderRadius: '4px' }}>
                                                    <Eye size={16} /> View Profile
                                                </button>
                                                <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 0' }}></div>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#ef4444', borderRadius: '4px' }}>
                                                    <Trash size={16} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        No students found in {activeTab}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <style jsx>{`
                    .dropdown-item:hover { background: #f8fafc !important; color: var(--primary) !important; }
                `}</style>
            </div>
        </div>
    );
}
