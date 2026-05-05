'use client';
import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, uploadFile, syncStaticCourses } from '@/app/actions';
import { Plus, Edit, Trash, X, Save, Upload, FileText } from 'lucide-react';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);

    // Dynamic Categories
    const [categories, setCategories] = useState(['CIVIL', 'MECHANICAL', 'ARCHITECTURAL', 'ELECTRICAL']);
    const [customCatInput, setCustomCatInput] = useState('');

    const [newCourseData, setNewCourseData] = useState({ title: '', duration: '', fee: '', description: '', slug: '', image_url: '', syllabus: '', tag: '' });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Sync static courses to DB first
        await syncStaticCourses();

        const data = await getCourses();
        setCourses(data);

        // Extract existing tags to populate dynamic categories
        const tags = [...new Set(data.map(c => c.tag).filter(Boolean))];
        setCategories(prev => [...new Set([...prev, ...tags])]);
    };

    const handleFileUpload = async (e, field, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadFile(formData);
            if (res.success) {
                const val = field === 'syllabus' ? `PDF_URL:${res.url}` : res.url;
                if (isEdit) {
                    setEditFormData(prev => ({ ...prev, [field]: val }));
                } else {
                    setNewCourseData(prev => ({ ...prev, [field]: val }));
                }
            } else {
                alert('Upload failed: ' + res.error);
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        }
        setIsUploading(false);
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        // Handle custom category
        let finalData = { ...newCourseData };
        if (newCourseData.tag === 'ADD_NEW') {
            if (customCatInput.trim()) {
                finalData.tag = customCatInput.trim();
                // Add to local state immediately
                setCategories(prev => [...new Set([...prev, finalData.tag])]);
            } else {
                alert("Please enter a category name");
                return;
            }
        }

        await createCourse(finalData);
        alert('Course added successfully!');
        setShowAddModal(false);
        setNewCourseData({ title: '', duration: '', fee: '', description: '', slug: '', image_url: '', syllabus: '', tag: '' });
        setCustomCatInput('');
        loadData();
    };

    const handleEditClick = (course) => {
        setEditFormData(course);
        setEditingCourse(course.id);
        setCustomCatInput('');
    };

    const handleSaveEdit = async () => {
        let finalData = { ...editFormData };
        if (editFormData.tag === 'ADD_NEW') {
            if (customCatInput.trim()) {
                finalData.tag = customCatInput.trim();
                setCategories(prev => [...new Set([...prev, finalData.tag])]);
            } else {
                alert("Please enter a category name");
                return;
            }
        }

        await updateCourse(editingCourse, finalData);
        alert('Course updated successfully!');
        setEditingCourse(null);
        setEditFormData({});
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            await deleteCourse(id);
            loadData();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#1a1a1a' }}>
                    COURSE <span style={{ color: 'var(--primary)' }}>MANAGEMENT.</span>
                </h1>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <Plus size={16} /> Add Course
                </button>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Add New Course</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCourse} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Course Title *</label>
                                <input required className="form-input" placeholder="e.g. Master Diploma in Architecture" value={newCourseData.title} onChange={e => setNewCourseData({ ...newCourseData, title: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Slug (Optional)</label>
                                <input className="form-input" placeholder="e.g. master-diploma-arch" value={newCourseData.slug} onChange={e => setNewCourseData({ ...newCourseData, slug: e.target.value })} />
                            </div>

                            {/* Image Upload */}
                            <div className="form-group">
                                <label className="form-label">Hero Image/Video</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                        <Upload size={14} /> Upload File
                                        <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'image_url', false)} />
                                    </label>
                                    {isUploading && <span style={{ fontSize: '0.8rem', color: 'orange', alignSelf: 'center' }}>Uploading...</span>}
                                </div>
                                <input className="form-input" placeholder="https://..." value={newCourseData.image_url} onChange={e => setNewCourseData({ ...newCourseData, image_url: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Duration *</label>
                                <input required className="form-input" placeholder="e.g. 6 Months" value={newCourseData.duration} onChange={e => setNewCourseData({ ...newCourseData, duration: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" value={newCourseData.tag} onChange={e => setNewCourseData({ ...newCourseData, tag: e.target.value })}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="ADD_NEW" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Category</option>
                                </select>
                                {newCourseData.tag === 'ADD_NEW' && (
                                    <input
                                        className="form-input"
                                        style={{ marginTop: '0.5rem', borderColor: 'var(--primary)' }}
                                        placeholder="Enter new category name..."
                                        value={customCatInput}
                                        onChange={e => setCustomCatInput(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Fee (₹) *</label>
                                <input required className="form-input" placeholder="e.g. 25000" value={newCourseData.fee} onChange={e => setNewCourseData({ ...newCourseData, fee: e.target.value })} />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Short Description</label>
                                <textarea className="form-input" placeholder="Brief overview..." value={newCourseData.description} onChange={e => setNewCourseData({ ...newCourseData, description: e.target.value })} style={{ minHeight: '80px', resize: 'vertical' }} />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Detailed Syllabus (Text or PDF)</label>
                                <div style={{ marginBottom: '0.8rem' }}>
                                    <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <FileText size={16} /> Upload Syllabus PDF
                                        <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'syllabus', false)} />
                                    </label>
                                    <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                        Will replace text below with PDF viewer
                                    </span>
                                </div>
                                <textarea className="form-input" placeholder="# Module 1..." value={newCourseData.syllabus} onChange={e => setNewCourseData({ ...newCourseData, syllabus: e.target.value })} style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'monospace' }} />
                            </div>

                            {/* Authorized Checkbox */}
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={newCourseData.is_authorized || false}
                                        onChange={e => setNewCourseData({ ...newCourseData, is_authorized: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>CADD Axis Authorized (Official Course)</span>
                                </label>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ flex: 1, opacity: isUploading ? 0.7 : 1 }}>Add Course</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCourse && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Edit Course</h2>
                            <button onClick={() => setEditingCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Course Title</label>
                                <input type="text" className="form-input" value={editFormData.title || ''} onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Duration</label>
                                <input type="text" className="form-input" value={editFormData.duration || ''} onChange={e => setEditFormData({ ...editFormData, duration: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category (Tag)</label>
                                <select className="form-select" value={editFormData.tag || ''} onChange={e => setEditFormData({ ...editFormData, tag: e.target.value })}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="ADD_NEW" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Category</option>
                                </select>
                                {editFormData.tag === 'ADD_NEW' && (
                                    <input
                                        className="form-input"
                                        style={{ marginTop: '0.5rem', borderColor: 'var(--primary)' }}
                                        placeholder="Enter new category name..."
                                        value={customCatInput}
                                        onChange={e => setCustomCatInput(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Fee (₹)</label>
                                <input type="text" className="form-input" value={editFormData.fee || ''} onChange={e => setEditFormData({ ...editFormData, fee: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug</label>
                                <input type="text" className="form-input" value={editFormData.slug || ''} onChange={e => setEditFormData({ ...editFormData, slug: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Hero Image/Video</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                        <Upload size={14} /> Upload File
                                        <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'image_url', true)} />
                                    </label>
                                    {isUploading && <span style={{ fontSize: '0.8rem', color: 'orange', alignSelf: 'center' }}>Uploading...</span>}
                                </div>
                                <input type="text" className="form-input" value={editFormData.image_url || ''} onChange={e => setEditFormData({ ...editFormData, image_url: e.target.value })} />
                            </div>

                            {/* Authorized Checkbox Edit */}
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editFormData.is_authorized || false}
                                        onChange={e => setEditFormData({ ...editFormData, is_authorized: e.target.checked ? 1 : 0 })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>CADD Axis Authorized (Official Course)</span>
                                </label>
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Short Description</label>
                                <textarea className="form-input" value={editFormData.description || ''} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} style={{ minHeight: '80px', resize: 'vertical' }} />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Detailed Syllabus (Text or PDF)</label>
                                <div style={{ marginBottom: '0.8rem' }}>
                                    <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <FileText size={16} /> Upload Syllabus PDF
                                        <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'syllabus', true)} />
                                    </label>
                                    <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                        Will replace text below with PDF viewer
                                    </span>
                                </div>
                                <textarea className="form-input" value={editFormData.syllabus || ''} onChange={e => setEditFormData({ ...editFormData, syllabus: e.target.value })} style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'monospace' }} />
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={handleSaveEdit} disabled={isUploading} className="btn btn-primary" style={{ flex: 1, opacity: isUploading ? 0.7 : 1 }}>
                                    <Save size={18} /> Save Changes
                                </button>
                                <button onClick={() => setEditingCourse(null)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Duration</th>
                            <th>Fee (₹)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? courses.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {c.image_url ? (
                                                <img src={c.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>IMG</span>
                                            )}
                                        </div>
                                        <div>
                                            {c.title}
                                            {c.is_authorized == 1 && (
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center',
                                                    fontSize: '0.7rem', background: '#dcfce7', color: '#166534',
                                                    padding: '2px 6px', borderRadius: '4px', marginLeft: '8px',
                                                    border: '1px solid #bbf7d0', fontWeight: 'bold'
                                                }}>
                                                    AUTHORIZED
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{c.duration}</td>
                                <td style={{ fontFamily: 'monospace', fontWeight: '500' }}>₹ {Number(c.fee).toLocaleString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEditClick(c)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(c.id)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Trash size={14} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No courses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

