'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Eye, X, Check } from 'lucide-react';
import { getCertificates, createCertificate, getStudents } from '@/app/actions';

export default function CertificatesPage() {
    const [activeTab, setActiveTab] = useState('issue');
    const [selectedStudent, setSelectedStudent] = useState(''); // ID now
    const [selectedCourse, setSelectedCourse] = useState('AutoCAD Civil 3D');
    const [generatedCert, setGeneratedCert] = useState(null);
    const [viewCertModal, setViewCertModal] = useState(null);

    const [dbCertificates, setDbCertificates] = useState([]);
    const [studentList, setStudentList] = useState([]);

    // Load Data
    useEffect(() => {
        async function load() {
            const certs = await getCertificates();
            setDbCertificates(certs);
            const students = await getStudents();
            setStudentList(students);
        }
        load();
    }, [generatedCert]); // Reload list when new cert generated

    const handleGenerate = async (e) => {
        e.preventDefault();

        // Find student name
        const studentObj = studentList.find(s => s.id == selectedStudent) || { name: 'Unknown Student' };

        const certId = `CERT-2025-${Math.floor(10000 + Math.random() * 90000)}`;
        const newCert = {
            unique_id: certId,
            student_name: studentObj.name,
            course_name: selectedCourse,
            url: `http://localhost:3000/verify/${certId}`
        };

        const res = await createCertificate(newCert);
        if (res.success) {
            setGeneratedCert({ ...newCert, date: new Date().toLocaleDateString() });
        } else {
            if (res.error.includes('Insufficient Wallet Balance')) {
                if (confirm("Insufficient Wallet Balance! Would you like to recharge now?")) {
                    window.location.href = '/admin/recharge';
                }
            } else {
                alert('Error generating certificate: ' + res.error);
            }
        }
    };

    const handleViewCertificate = (cert) => {
        setViewCertModal({
            id: cert.unique_id,
            student: cert.student_name,
            course: cert.course_name,
            date: new Date(cert.issue_date).toLocaleDateString(),
            url: `http://localhost:3000/verify/${cert.unique_id}`
        });
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    CERTIFICATE MANAGEMENT <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Issue and manage student certifications.</p>
            </div>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '2rem' }}>
                <button
                    onClick={() => setActiveTab('issue')}
                    style={{
                        padding: '1rem 0.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'issue' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'issue' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem'
                    }}
                >
                    Issue New Certificate
                </button>
                <button
                    onClick={() => setActiveTab('records')}
                    style={{
                        padding: '1rem 0.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'records' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'records' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem'
                    }}
                >
                    Certification Records
                </button>
            </div>

            {/* View Certificate Modal */}
            {viewCertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
                    
                    <button
                        onClick={() => setViewCertModal(null)}
                        style={{ position: 'absolute', right: '1rem', top: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', zIndex: 3100, transition: 'all 0.2s' }}
                    >
                        <X size={18} />
                    </button>

                    {(() => {
                        const borderSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23a0845c' stroke-width='1'%3E%3Cellipse cx='24' cy='24' rx='10' ry='14'/%3E%3Cellipse cx='24' cy='24' rx='14' ry='10'/%3E%3Ccircle cx='24' cy='24' r='3'/%3E%3Ccircle cx='24' cy='6' r='2'/%3E%3Ccircle cx='24' cy='42' r='2'/%3E%3Ccircle cx='6' cy='24' r='2'/%3E%3Ccircle cx='42' cy='24' r='2'/%3E%3Cpath d='M12 12 L16 16 M36 12 L32 16 M12 36 L16 32 M36 36 L32 32'/%3E%3C/g%3E%3C/svg%3E")`;
                        
                        return (
                    <div style={{
                        width: '794px', height: '1123px', margin: 'auto',
                        backgroundColor: '#fff', position: 'relative',
                        fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1a1a1a',
                        boxSizing: 'border-box', overflow: 'hidden',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
                        transform: 'scale(0.82)', transformOrigin: 'center'
                    }}>
                        {/* Ornamental Border */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.55 }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.55 }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center', opacity: 0.55 }} />
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center', opacity: 0.55 }} />

                        {/* Inner gold border */}
                        <div style={{ position: 'absolute', top: '36px', left: '36px', right: '36px', bottom: '36px', border: '1.5px solid #b8a06a', pointerEvents: 'none', zIndex: 2 }} />

                        {/* Watermark */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', height: '520px', opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
                            <svg viewBox="0 0 520 520" style={{ width: '100%', height: '100%' }}>
                                <circle cx="260" cy="260" r="250" fill="none" stroke="#c0392b" strokeWidth="3" />
                                <circle cx="260" cy="260" r="240" fill="none" stroke="#c0392b" strokeWidth="1" />
                                <defs>
                                    <path id="topArcAdmin" d="M 40,260 a 220,220 0 1,1 440,0" fill="none" />
                                    <path id="bottomArcAdmin" d="M 460,260 a 220,220 0 1,1 -440,0" fill="none" />
                                </defs>
                                <text fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#c0392b" letterSpacing="2">
                                    <textPath href="#topArcAdmin" startOffset="8%">TRAINING AND SKILL DEVELOPMENT</textPath>
                                </text>
                                <text fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#c0392b" letterSpacing="2">
                                    <textPath href="#bottomArcAdmin" startOffset="18%">ICHALKARANJI</textPath>
                                </text>
                                <text x="260" y="240" textAnchor="middle" fontFamily="Arial" fontSize="38" fontWeight="900" fill="#c0392b">CADD AXIS</text>
                                <text x="260" y="290" textAnchor="middle" fontFamily="Arial" fontSize="38" fontWeight="900" fill="#c0392b">CENTRE</text>
                            </svg>
                        </div>

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '50px 60px 40px 60px', boxSizing: 'border-box' }}>

                            <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet" />

                            {/* Logo */}
                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                                    <div style={{ backgroundColor: '#E91E63', color: '#fff', padding: '6px 22px', transform: 'skewX(-12deg)', fontWeight: '900', fontSize: '46px', lineHeight: 1, fontFamily: "'Montserrat', Arial Black, sans-serif", letterSpacing: '3px' }}>CADD</div>
                                    <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                                        <div style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1', fontFamily: "'Montserrat', sans-serif", color: '#1a1a1a' }}>Axis</div>
                                        <div style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '6px', fontFamily: "'Montserrat', sans-serif", color: '#1a1a1a', marginTop: '-2px', textAlign: 'center' }}>CENTRE</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '4px', marginTop: '6px', fontFamily: "'Montserrat', sans-serif", textDecoration: 'underline', textUnderlineOffset: '4px' }}>ACCESS YOUR CAREER</div>
                            </div>

                            <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.6', textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                                CADDAxis Centre Training Services Pvt.Ltd.<br />
                                Registered under Ministry of Corporate Affairs , Govt. of India<br />
                                An ISO 9001:2005, ISO29990:2010 & 21001:2018 certified Organization
                            </div>

                            <div style={{ fontFamily: "'Times New Roman', 'Georgia', serif", fontSize: '46px', fontWeight: '700', letterSpacing: '8px', marginTop: '15px', marginBottom: '12px', color: '#1a1a1a', textAlign: 'center' }}>CERTIFICATE</div>

                            <div style={{ border: '1.5px solid #555', borderRadius: '30px', padding: '10px 40px', textAlign: 'center', marginBottom: '18px' }}>
                                <div style={{ fontSize: '11.5px', letterSpacing: '0.5px', color: '#444' }}>AUTHORISED TRAINING CENTRE (ATC) CODE & NAME</div>
                                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '3px', color: '#1a1a1a' }}>C0143- CADDAXIS CENTRE, ICHALKARANJI</div>
                            </div>

                            {/* Photo */}
                            <div style={{ position: 'absolute', top: '230px', right: '60px', width: '110px', height: '140px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', overflow: 'hidden', zIndex: 3 }}>
                                <img src={viewCertModal.photo || "/uploads/default-photo.png"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Student Photo" />
                            </div>

                            <div style={{ fontSize: '20px', color: '#333', marginTop: '10px', textAlign: 'center', lineHeight: '1.6' }}>
                                This is to certificate gratefully<br />presented to
                            </div>

                            <div style={{ fontFamily: "'Alex Brush', cursive", fontSize: '72px', color: '#1a1a1a', margin: '5px 0 5px 0', lineHeight: '1.1' }}>
                                {viewCertModal.student}
                            </div>

                            <div style={{ fontSize: '16px', textAlign: 'center', lineHeight: '1.7', color: '#333' }}>
                                has successfully completed and passed the prescribed examination<br />
                                with <span style={{ fontWeight: '900', fontSize: '18px' }}>A+</span> Grade <span style={{ fontWeight: '900', fontSize: '18px' }}>96%</span> has been awarded the
                            </div>

                            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '12px', textAlign: 'center', color: '#1a1a1a', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                CERTIFICATE IN {viewCertModal.course}
                            </div>

                            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', color: '#333' }}>(COURSE DURATION: 3 MONTHS)</div>

                            <div style={{ fontSize: '15px', marginTop: '14px', textAlign: 'center', color: '#333' }}>Prepared in line with guidelines of</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginTop: '2px' }}>CADD Axis Centre</div>

                            <div style={{ border: '1.5px solid #555', borderRadius: '30px', padding: '6px 40px', textAlign: 'center', marginTop: '16px' }}>
                                <div style={{ fontSize: '11px', color: '#555' }}>Certificate Number</div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a1a' }}>{viewCertModal.id.replace('CERT-', 'CX-').toUpperCase()}</div>
                            </div>

                            <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '12px', color: '#1a1a1a' }}>
                                DATE OF ISSUE: {viewCertModal.date}
                            </div>

                            <div style={{ flex: 1 }} />

                            {/* Signatures */}
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px', boxSizing: 'border-box', marginBottom: '55px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ borderTop: '1.5px solid #333', width: '200px', paddingTop: '6px' }}>
                                        <div style={{ fontSize: '13px' }}>Authorised by:</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#E91E63' }}>CADDAXIS CENTRE</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Alex Brush', cursive", fontSize: '38px', color: '#1a3a6b', whiteSpace: 'nowrap', zIndex: 2 }}>
                                        {viewCertModal.student}
                                    </div>
                                    <div style={{ position: 'absolute', top: '-80px', right: '-45px', width: '120px', height: '120px', opacity: 0.4, zIndex: 3, pointerEvents: 'none' }}>
                                        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                                            <circle cx="100" cy="100" r="90" fill="none" stroke="#c0392b" strokeWidth="4" />
                                            <circle cx="100" cy="100" r="80" fill="none" stroke="#c0392b" strokeWidth="2" />
                                            <circle cx="100" cy="100" r="45" fill="none" stroke="#c0392b" strokeWidth="1.5" />
                                            <defs>
                                                <path id="sealTopA" d="M 15,100 a 85,85 0 1,1 170,0" fill="none" />
                                                <path id="sealBotA" d="M 185,100 a 85,85 0 1,1 -170,0" fill="none" />
                                            </defs>
                                            <text fontFamily="Arial" fontSize="11" fontWeight="bold" fill="#c0392b">
                                                <textPath href="#sealTopA" startOffset="5%">AND SKILL DEVELOPMENT</textPath>
                                            </text>
                                            <text fontFamily="Arial" fontSize="11" fontWeight="bold" fill="#c0392b">
                                                <textPath href="#sealBotA" startOffset="22%">ICHALKARANJI</textPath>
                                            </text>
                                            <text x="100" y="92" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#c0392b">CADD AXIS</text>
                                            <text x="100" y="112" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#c0392b">CENTRE</text>
                                        </svg>
                                    </div>
                                    <div style={{ borderTop: '1.5px solid #333', width: '200px', paddingTop: '6px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700' }}>Head of the insutitute(ATC)</div>
                                        <div style={{ fontSize: '12px' }}>Sign & Seal of ATC</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ width: '100%', textAlign: 'center', marginBottom: '5px' }}>
                                <div style={{ fontSize: '12px', color: '#333' }}>
                                    Online Certifcate verification available on: <span style={{ fontWeight: '800' }}>www.caddaxis.com</span>
                                </div>
                                <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
                                    Grade system: A+ :  Excellent (85% & Above)  |  A : Very Good (70% to 84%)  |  B : Good (55% to 69%)  |  C : Average (40% to 54%)
                                </div>
                            </div>
                        </div>
                    </div>
                        );
                    })()}
                </div>
            )}

            {activeTab === 'issue' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Oswald', fontSize: '1.4rem', color: '#334155' }}>Generate Certificate</h3>
                        <form onSubmit={handleGenerate} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Select Student</label>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">-- Select Student --</option>
                                    {studentList.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Course Completed</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="form-select"
                                >
                                    <option>AutoCAD Civil 3D</option>
                                    <option>Revit Architecture</option>
                                    <option>Revit MEP</option>
                                    <option>SolidWorks</option>
                                    <option>CATIA V4/V5</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Generate & Save</button>
                        </form>
                    </div>

                    {generatedCert && (
                        <div className="card" style={{ padding: '2rem', background: 'white', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <div style={{ padding: '1.5rem', border: '8px solid #B8860B', background: '#fafafa', position: 'relative', textAlign: 'center', fontFamily: 'Open Sans, sans-serif' }}>
                                {/* Small Logo */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', marginBottom: '1rem' }}>
                                    <div style={{ background: '#E91E63', color: 'white', padding: '0.1rem 0.3rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>CADD</div>
                                    <div style={{ color: '#212121', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>Axis CENTRE</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>This is to certificate gratefully presented to</div>
                                <h2 style={{ fontFamily: '"Alex Brush", cursive', fontSize: '2.5rem', color: '#005696', margin: '0 0 1rem 0', fontWeight: 'normal' }}>
                                    {generatedCert.student_name}
                                </h2>
                                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', color: '#212121', marginBottom: '1.5rem', letterSpacing: '2px' }}>
                                    CERTIFICATE IN {generatedCert.course_name}
                                </h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Certificate ID: <strong style={{ color: '#334155' }}>{generatedCert.unique_id}</strong></p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: <strong style={{ color: '#334155' }}>{generatedCert.date}</strong></p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ background: 'white', padding: '0.3rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                                            <QRCodeSVG value={generatedCert.url} size={50} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#166534', fontWeight: 'bold', padding: '0.75rem', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                <Check size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                Certificate Successfully Generated!
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'records' && (
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Valid ID</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Issue Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dbCertificates.map(c => (
                                <tr key={c.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--primary)', letterSpacing: '0.5px' }}>{c.unique_id}</td>
                                    <td style={{ fontWeight: '500', color: '#334155' }}>{c.student_name}</td>
                                    <td>{c.course_name}</td>
                                    <td style={{ color: '#64748b' }}>{new Date(c.issue_date).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleViewCertificate(c)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
