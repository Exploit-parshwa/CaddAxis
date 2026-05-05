'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentDashboard } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Video, Calendar, Clock, LogOut, IndianRupee,
    CheckCircle, PlayCircle, Trophy, Target, Shield,
    User, ChevronRight, Zap, PenTool, LayoutDashboard, FileText
} from 'lucide-react';

export default function StudentDashboardPage() {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        // Prevent right click globally
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    useEffect(() => {
        const studentData = localStorage.getItem('student');
        if (!studentData) {
            router.push('/student/auth');
            return;
        }
        const parsedStudent = JSON.parse(studentData);
        setStudent(parsedStudent);
        loadDashboard(parsedStudent.id);
    }, []);

    const loadDashboard = async (studentId) => {
        try {
            const data = await getStudentDashboard(studentId);
            if (data?.student) {
                setDashboardData(data);
                setStudent(data.student);
            } else {
                throw new Error("No data");
            }
        } catch (error) {
            console.error("Dashboard load failed", error);
            // Mock data fallback
            setDashboardData({
                student: { id: studentId, name: 'Student', course: 'AutoCAD Civil 3D', fee_total: 15000, fee_paid: 5000, progress: 35 },
                liveClasses: [],
                recordedSessions: [],
                examResults: [],
                hasAccess: false
            });
            setStudent({ id: studentId, name: 'Student', course: 'AutoCAD Civil 3D' });
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('student');
        router.push('/student/auth');
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.substring(0, 11) || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
        }
        return url;
    };

    if (loading) return (
        <div style={{ background: '#f8fafc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div className="loader-ring"></div>
            <style jsx>{`
                .loader-ring {
                    width: 40px; height: 40px; border: 4px solid #e2e8f0;
                    border-top: 4px solid #e91e63; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'live', label: 'Live Classes', icon: Video },
        { id: 'library', label: 'Recordings', icon: BookOpen },
        { id: 'exams', label: 'Exams & Results', icon: FileText },
    ];

    return (
        <main style={{ background: '#f1f5f9', minHeight: '100vh', color: '#1e293b', fontFamily: 'Inter, sans-serif', overflow: 'hidden', display: 'flex' }}>

            {/* Sidebar Navigation - BRAND COLORS */}
            <motion.aside
                initial={{ x: -100 }} animate={{ x: 0 }}
                style={{ width: '280px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', zIndex: 20, boxShadow: '4px 0 24px rgba(0,0,0,0.1)' }}
            >
                <div style={{ padding: '2rem', borderBottom: '1px solid #1e293b' }}>
                    <div style={{ fontFamily: 'Oswald', fontSize: '1.5rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', background: '#e91e63', borderRadius: '2px' }}></div>
                        CAD<span style={{ color: '#e91e63' }}>AXIS</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', paddingLeft: '1.2rem' }}>GEN NEXT EDUCATION</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, padding: '2rem 1rem' }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                background: activeTab === item.id ? '#e91e63' : 'transparent',
                                color: activeTab === item.id ? 'white' : '#94a3b8',
                                border: 'none', borderRadius: '8px', cursor: 'pointer',
                                transition: 'all 0.2s', textAlign: 'left', fontWeight: 500,
                                fontSize: '0.95rem'
                            }}
                        >
                            <item.icon size={20} /> {item.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '2rem', borderTop: '1px solid #1e293b', background: '#020617' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #334155' }}>
                            <User size={20} color="#cbd5e1" />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{student.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {student.id}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', background: 'transparent', color: '#94a3b8', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        <LogOut size={16} /> SIGN OUT
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', position: 'relative' }}>

                {/* Brand Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    style={{ marginBottom: '3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>CURRENTLY ENROLLED IN</p>
                            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', lineHeight: 1, color: '#0f172a' }}>
                                {student.course.toUpperCase()}
                            </h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                            <div style={{ color: '#e91e63', fontSize: '0.9rem', fontWeight: 600 }}>Active Session</div>
                        </div>
                    </div>
                </motion.header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
                        >
                            {/* Stats */}
                            <div className="card-feature">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div className="card-label">Overall Progress</div>
                                        <div className="card-val">{dashboardData.student.progress}%</div>
                                    </div>
                                    <div className="icon-box"><Target size={24} color="#e91e63" /></div>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${dashboardData.student.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="card-feature">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div className="card-label">Fees Paid</div>
                                        <div className="card-val">₹{dashboardData.student.fee_paid?.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.8rem', color: (dashboardData.student.fee_total - dashboardData.student.fee_paid) > 0 ? '#ef4444' : '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>
                                            {(dashboardData.student.fee_total - dashboardData.student.fee_paid) > 0 ? 'Pending Dues' : 'Fully Paid'}
                                        </div>
                                    </div>
                                    <div className="icon-box" style={{ background: '#f1f5f9' }}><IndianRupee size={24} color="#0f172a" /></div>
                                </div>
                            </div>

                            <div className="card-feature" style={{ background: '#0f172a', color: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div className="card-label" style={{ color: '#94a3b8' }}>Next Class</div>
                                    <Calendar size={20} color="#e91e63" />
                                </div>
                                {dashboardData.liveClasses?.[0] ? (
                                    <>
                                        <div style={{ fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '0.5rem' }}>TODAY</div>
                                        <div style={{ color: '#e91e63', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={16} /> {dashboardData.liveClasses[0].class_time}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ fontSize: '1.2rem', color: '#94a3b8' }}>No classes scheduled</div>
                                )}
                            </div>

                            {/* Content Block */}
                            <div style={{ gridColumn: 'span 3', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontFamily: 'Oswald', fontSize: '1.4rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    CONTINUE LEARNING
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {dashboardData.recordedSessions?.slice(0, 3).map((session, i) => (
                                        <div key={i} onClick={() => setSelectedVideo(session)} className="video-card">
                                            <div className="play-overlay"><PlayCircle size={32} color="white" /></div>
                                            <div style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '0.3rem', lineHeight: 1.3 }}>{session.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{session.duration_minutes} Mins</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'live' && (
                        <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {dashboardData.liveClasses?.length > 0 ? dashboardData.liveClasses.map(cls => (
                                <div key={cls.id} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ background: '#fdf2f8', padding: '1rem', borderRadius: '12px' }}>
                                            <Video size={32} color="#e91e63" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{cls.title}</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{cls.description}</p>
                                            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                                                <span style={{ display: 'flex', gap: '5px' }}><Clock size={16} /> {cls.class_time}</span>
                                                <span style={{ display: 'flex', gap: '5px' }}><Calendar size={16} /> {new Date(cls.class_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href={cls.meeting_link} target="_blank" style={{ background: '#e91e63', color: 'white', padding: '0.8rem 2rem', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)', transition: 'transform 0.2s' }} className="btn-hover">
                                        JOIN NOW
                                    </a>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                                    <h3>No live sessions scheduled</h3>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'library' && (
                        <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                            {dashboardData.recordedSessions?.map(session => (
                                <div key={session.id} onClick={() => setSelectedVideo(session)} className="video-card large">
                                    <div className="thumb-placeholder">
                                        <PlayCircle size={48} color="#e91e63" />
                                    </div>
                                    <div style={{ padding: '1.2rem' }}>
                                        <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>{session.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(session.recorded_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'exams' && (
                        <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <tr>
                                            <th className="th-cell">Exam Name</th>
                                            <th className="th-cell">Date</th>
                                            <th className="th-cell">Score</th>
                                            <th className="th-cell">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.examResults?.map(exam => (
                                            <tr key={exam.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td className="td-cell" style={{ fontWeight: 600 }}>{exam.exam_title}</td>
                                                <td className="td-cell">{new Date(exam.exam_date).toLocaleDateString()}</td>
                                                <td className="td-cell">{exam.marks_obtained}/{exam.total_marks}</td>
                                                <td className="td-cell">
                                                    <span className={`status-badge ${['A', 'A+'].includes(exam.grade) ? 'pass' : 'fail'}`}>
                                                        {exam.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedVideo(null)}>
                        <div style={{ width: '90%', maxWidth: '1000px', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <iframe src={getEmbedUrl(selectedVideo.video_url)} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .card-feature {
                    background: white; padding: 2rem; border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    transition: transform 0.2s ease;
                }
                .card-feature:hover { transform: translateY(-3px); }
                .card-label { font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .card-val { font-size: 2.2rem; font-family: 'Oswald', sans-serif; color: #0f172a; margin-top: 0.5rem; }
                .icon-box { background: #fdf2f8; padding: 0.8rem; border-radius: 50%; width: fit-content; height: fit-content; }
                .progress-track { width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 1rem; }
                .progress-fill { height: 100%; background: #e91e63; border-radius: 4px; transition: width 0.5s ease; }
                
                .video-card { background: #f8fafc; border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; position: relative; border: 1px solid #e2e8f0; }
                .video-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .video-card.large .thumb-placeholder { height: 160px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; }
                .play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.2s; }
                .video-card:hover .play-overlay { opacity: 1; }
                
                .th-cell { padding: 1.2rem; text-align: left; color: #64748b; font-weight: 600; font-size: 0.9rem; }
                .td-cell { padding: 1.2rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
                .status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
                .status-badge.pass { background: #dcfce7; color: #166534; }
                .status-badge.fail { background: #fee2e2; color: #991b1b; }
                
                .btn-hover:hover { transform: scale(1.02); }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f1f5f9; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            `}</style>
        </main>
    );
}
