'use client';
import { useState, useEffect } from 'react';
import { createLiveClass, deleteLiveClass, createRecordedSession, deleteRecordedSession, getLiveClasses, getRecordedSessions } from '@/app/actions';
import { Video, Calendar, Trash2, Plus, PlayCircle, ExternalLink, Upload, Clock } from 'lucide-react';

export default function OnlineClassesPage() {
    const [activeTab, setActiveTab] = useState('live'); // 'live' or 'recorded'
    const [loading, setLoading] = useState(false);
    const [liveClasses, setLiveClasses] = useState([]);
    const [recordedSessions, setRecordedSessions] = useState([]);

    // Forms
    const [liveData, setLiveData] = useState({
        course_name: 'AutoCAD Civil 3D', title: '', description: '', class_date: '', class_time: '', duration_minutes: 60, meeting_link: '', platform: 'Zoom'
    });
    const [recordedData, setRecordedData] = useState({
        course_name: 'AutoCAD Civil 3D', title: '', description: '', recorded_date: '', duration_minutes: 60, video_url: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        // For simplicity, fetching all for a generic or specific course could be refactored. 
        // Here we fetch dependent on selected course in dropdown? No, admin sees all?
        // Let's just fetch for the default course for now or implement a filter.
        // Actually actions.js getLiveClasses takes a courseName. Let's start with a hardcoded list or allow filtering.
        // Better: Fetch ALL classes. The existing action strictly filters by course.
        // I will stick to 'AutoCAD Civil 3D' as default for view, but ideally Admin needs to see all.
        // LIMITATION: Action filters by course. I should update action or just iterate courses.
        // For this demo, let's stick to the selected course in the form.

        const course = activeTab === 'live' ? liveData.course_name : recordedData.course_name;

        if (activeTab === 'live') {
            const data = await getLiveClasses(course);
            setLiveClasses(data);
        } else {
            const data = await getRecordedSessions(course);
            setRecordedSessions(data);
        }
        setLoading(false);
    };

    const handleCreateLive = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createLiveClass(liveData);
        if (res.success) {
            alert('Live Class Scheduled!');
            loadData();
            setLiveData({ ...liveData, title: '', meeting_link: '' });
        }
        setLoading(false);
    };

    const handleCreateRecorded = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createRecordedSession(recordedData);
        if (res.success) {
            alert('Recorded Session Added!');
            loadData();
            setRecordedData({ ...recordedData, title: '', video_url: '' });
        }
        setLoading(false);
    };

    const handleDeleteLive = async (id) => {
        if (!confirm('Delete this class?')) return;
        await deleteLiveClass(id);
        loadData();
    };

    const handleDeleteRecorded = async (id) => {
        if (!confirm('Delete this session?')) return;
        await deleteRecordedSession(id);
        loadData();
    };

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        ONLINE CLASSES <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Schedule live sessions and manage recorded content.
                    </p>
                </div>

                {/* Custom Tab Switcher */}
                <div style={{ display: 'flex', background: 'white', padding: '0.35rem', borderRadius: '50px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <button
                        onClick={() => setActiveTab('live')}
                        style={{
                            padding: '0.6rem 1.5rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: activeTab === 'live' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'live' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Video size={16} /> Live Classes
                    </button>
                    <button
                        onClick={() => setActiveTab('recorded')}
                        style={{
                            padding: '0.6rem 1.5rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: activeTab === 'recorded' ? '#0ea5e9' : 'transparent', // Secondary color usage
                            color: activeTab === 'recorded' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                            fontSize: '0.9rem'
                        }}
                    >
                        <PlayCircle size={16} /> Recorded Sessions
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) 0.8fr', gap: '2.5rem', alignItems: 'start' }}>

                {/* Left Column: Form */}
                <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{
                        padding: '1.5rem',
                        background: activeTab === 'live' ? 'linear-gradient(135deg, var(--primary) 0%, #be185d 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        color: 'white'
                    }}>
                        <h2 style={{ fontSize: '1.1rem', fontFamily: 'Oswald', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, letterSpacing: '0.5px' }}>
                            {activeTab === 'live' ? <Plus size={20} /> : <Upload size={20} />}
                            {activeTab === 'live' ? 'SCHEDULE LIVE CLASS' : 'UPLOAD RECORDED SESSION'}
                        </h2>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        {activeTab === 'live' ? (
                            <form onSubmit={handleCreateLive} style={{ display: 'grid', gap: '1.25rem' }}>
                                {/* Course Selection */}
                                <div className="form-group">
                                    <label className="form-label">Course</label>
                                    <select
                                        className="form-select"
                                        value={liveData.course_name}
                                        onChange={e => { setLiveData({ ...liveData, course_name: e.target.value }); loadData(); }}
                                    >
                                        <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                                        <option value="Revit Architecture">Revit Architecture</option>
                                        <option value="SolidWorks">SolidWorks</option>
                                        <option value="CATIA V4/V5">CATIA V4/V5</option>
                                    </select>
                                </div>

                                {/* Class Title */}
                                <div className="form-group">
                                    <label className="form-label">Class Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Intro to Surfaces"
                                        value={liveData.title}
                                        onChange={e => setLiveData({ ...liveData, title: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                {/* Date & Time Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input required type="date" value={liveData.class_date} onChange={e => setLiveData({ ...liveData, class_date: e.target.value })} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time</label>
                                        <input required type="time" value={liveData.class_time} onChange={e => setLiveData({ ...liveData, class_time: e.target.value })} className="form-input" />
                                    </div>
                                </div>

                                {/* Platform & Duration Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Platform</label>
                                        <select value={liveData.platform} onChange={e => setLiveData({ ...liveData, platform: e.target.value })} className="form-select">
                                            <option value="Zoom">Zoom</option>
                                            <option value="Google Meet">Google Meet</option>
                                            <option value="Teams">Microsoft Teams</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration (mins)</label>
                                        <input type="number" value={liveData.duration_minutes} onChange={e => setLiveData({ ...liveData, duration_minutes: e.target.value })} className="form-input" />
                                    </div>
                                </div>

                                {/* Meeting Room ID */}
                                <div className="form-group">
                                    <label className="form-label">Room ID / Name</label>
                                    <input required type="text" placeholder="e.g. civil-batch-2026" value={liveData.meeting_link} onChange={e => setLiveData({ ...liveData, meeting_link: e.target.value })} className="form-input" />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea rows="3" value={liveData.description} onChange={e => setLiveData({ ...liveData, description: e.target.value })} className="form-input"></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        marginTop: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        background: 'linear-gradient(135deg, var(--primary) 0%, #be185d 100%)'
                                    }}
                                >
                                    {loading ? 'SCHEDULING...' : 'SCHEDULE CLASS'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateRecorded} style={{ display: 'grid', gap: '1.25rem' }}>
                                {/* Course Selection */}
                                <div className="form-group">
                                    <label className="form-label">Course</label>
                                    <select
                                        value={recordedData.course_name}
                                        onChange={e => { setRecordedData({ ...recordedData, course_name: e.target.value }); loadData(); }}
                                        className="form-select"
                                    >
                                        <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                                        <option value="Revit Architecture">Revit Architecture</option>
                                        <option value="SolidWorks">SolidWorks</option>
                                        <option value="CATIA V4/V5">CATIA V4/V5</option>
                                    </select>
                                </div>

                                {/* Session Title */}
                                <div className="form-group">
                                    <label className="form-label">Session Title</label>
                                    <input required type="text" placeholder="e.g. Advanced Part Design" value={recordedData.title} onChange={e => setRecordedData({ ...recordedData, title: e.target.value })} className="form-input" />
                                </div>

                                {/* Date & Duration Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Date Recorded</label>
                                        <input required type="date" value={recordedData.recorded_date} onChange={e => setRecordedData({ ...recordedData, recorded_date: e.target.value })} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration (mins)</label>
                                        <input type="number" value={recordedData.duration_minutes} onChange={e => setRecordedData({ ...recordedData, duration_minutes: e.target.value })} className="form-input" />
                                    </div>
                                </div>

                                {/* Video URL */}
                                <div className="form-group">
                                    <label className="form-label">Video URL</label>
                                    <input required type="url" placeholder="YouTube / Vimeo Link" value={recordedData.video_url} onChange={e => setRecordedData({ ...recordedData, video_url: e.target.value })} className="form-input" />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea rows="3" value={recordedData.description} onChange={e => setRecordedData({ ...recordedData, description: e.target.value })} className="form-input"></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        marginTop: '1rem',
                                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                        borderColor: '#0284c7'
                                    }}
                                >
                                    {loading ? 'UPLOADING...' : 'UPLOAD SESSION'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column: List & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* List Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontFamily: 'Oswald', color: '#475569' }}>
                            {activeTab === 'live' ? 'Scheduled Classes' : 'Library Content'}
                        </h3>
                        <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '600', color: '#64748b' }}>
                            {activeTab === 'live' ? liveClasses.length : recordedSessions.length} ITEMS
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {activeTab === 'live' ? (
                            <>
                                {liveClasses.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>
                                        <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>No live classes scheduled for this course yet.</p>
                                    </div>
                                )}
                                {liveClasses.map(cls => (
                                    <div key={cls.id} style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderLeft: '4px solid var(--primary)',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Oswald', color: '#1e293b' }}>{cls.title}</h4>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(cls.class_date).toLocaleDateString()}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {cls.class_time}</span>
                                                </div>
                                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid #dbeafe', fontWeight: '600', textTransform: 'uppercase' }}>
                                                        {cls.platform}
                                                    </span>
                                                    <a href={`/admin/online-classes/live/${cls.meeting_link}`} target="_blank" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: '600' }}>
                                                        Start Class <Video size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLive(cls.id)}
                                                style={{
                                                    background: '#fee2e2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s',
                                                    padding: '0.4rem', borderRadius: '6px'
                                                }}
                                                title="Delete Class"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {recordedSessions.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>
                                        <Video size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>No recorded sessions found.</p>
                                    </div>
                                )}
                                {recordedSessions.map(session => (
                                    <div key={session.id} style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderLeft: '4px solid #0ea5e9',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Oswald', color: '#1e293b' }}>{session.title}</h4>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(session.recorded_date).toLocaleDateString()}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {session.duration_minutes} mins</span>
                                                </div>
                                                <div style={{ marginTop: '1rem' }}>
                                                    <a href={session.video_url} target="_blank" style={{ fontSize: '0.85rem', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: '600' }}>
                                                        Watch Video <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteRecorded(session.id)}
                                                style={{
                                                    background: '#fee2e2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                    padding: '0.4rem', borderRadius: '6px'
                                                }}
                                                title="Delete Session"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}
