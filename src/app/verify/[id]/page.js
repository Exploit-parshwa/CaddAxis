import Link from 'next/link';
import pool from '@/lib/db';
import { CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default async function VerifyPage(props) {
    const params = await props.params;
    const { id } = params;

    let cert = null;
    try {
        const [rows] = await pool.query('SELECT * FROM certificates WHERE unique_id = ?', [id]);
        cert = rows[0] || null;
    } catch (e) {
        console.error("DB Error", e);
    }

    if (!cert) {
        return <NotFound id={id} />;
    }

    // Format the date
    const issueDate = cert.issue_date ? new Date(cert.issue_date) : new Date();
    const day = issueDate.getDate().toString().padStart(2, '0');
    const month = (issueDate.getMonth() + 1).toString().padStart(2, '0');
    const year = issueDate.getFullYear();
    const formattedDate = `${day}/ ${month} /${year}`;

    // Build the ornamental border SVG as a data URI for the chain/scroll pattern
    const borderSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23a0845c' stroke-width='1'%3E%3Cellipse cx='24' cy='24' rx='10' ry='14'/%3E%3Cellipse cx='24' cy='24' rx='14' ry='10'/%3E%3Ccircle cx='24' cy='24' r='3'/%3E%3Ccircle cx='24' cy='6' r='2'/%3E%3Ccircle cx='24' cy='42' r='2'/%3E%3Ccircle cx='6' cy='24' r='2'/%3E%3Ccircle cx='42' cy='24' r='2'/%3E%3Cpath d='M12 12 L16 16 M36 12 L32 16 M12 36 L16 32 M36 36 L32 32'/%3E%3C/g%3E%3C/svg%3E")`;

    return (
        <main style={{ background: '#e2e8f0', minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet" />

            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', background: 'white', padding: '1rem 2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <CheckCircle size={24} />
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Certificate Verified & Authentic</span>
                </div>

                {/* ===== CERTIFICATE — Exact PDF Replica ===== */}
                <div style={{
                    width: '794px',
                    height: '1123px',
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    position: 'relative',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#1a1a1a',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
                    transform: 'scale(0.88)',
                    transformOrigin: 'top center',
                    marginBottom: '-120px'
                }}>

                    {/* ── Ornamental Border (top, bottom, left, right) ── */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.55 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.55 }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center', opacity: 0.55 }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '32px', backgroundImage: borderSvg, backgroundSize: '48px 48px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center', opacity: 0.55 }} />

                    {/* ── Inner thin gold border ── */}
                    <div style={{ position: 'absolute', top: '36px', left: '36px', right: '36px', bottom: '36px', border: '1.5px solid #b8a06a', pointerEvents: 'none', zIndex: 2 }} />

                    {/* ── Large Circular Watermark Seal (center) ── */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '520px', height: '520px',
                        opacity: 0.06,
                        pointerEvents: 'none', zIndex: 0
                    }}>
                        <svg viewBox="0 0 520 520" style={{ width: '100%', height: '100%' }}>
                            {/* Outer circle */}
                            <circle cx="260" cy="260" r="250" fill="none" stroke="#c0392b" strokeWidth="3" />
                            <circle cx="260" cy="260" r="240" fill="none" stroke="#c0392b" strokeWidth="1" />
                            {/* Curved text top */}
                            <defs>
                                <path id="topArc" d="M 40,260 a 220,220 0 1,1 440,0" fill="none" />
                                <path id="bottomArc" d="M 460,260 a 220,220 0 1,1 -440,0" fill="none" />
                            </defs>
                            <text fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#c0392b" letterSpacing="2">
                                <textPath href="#topArc" startOffset="8%">TRAINING AND SKILL DEVELOPMENT</textPath>
                            </text>
                            <text fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#c0392b" letterSpacing="2">
                                <textPath href="#bottomArc" startOffset="18%">ICHALKARANJI</textPath>
                            </text>
                            {/* Center text */}
                            <text x="260" y="240" textAnchor="middle" fontFamily="Arial" fontSize="38" fontWeight="900" fill="#c0392b">CADD AXIS</text>
                            <text x="260" y="290" textAnchor="middle" fontFamily="Arial" fontSize="38" fontWeight="900" fill="#c0392b">CENTRE</text>
                        </svg>
                    </div>

                    {/* ── Content Area ── */}
                    <div style={{
                        position: 'relative', zIndex: 1,
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        height: '100%', padding: '50px 60px 40px 60px', boxSizing: 'border-box'
                    }}>

                        {/* ── Header / Logo ── */}
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                                <div style={{
                                    backgroundColor: '#E91E63', color: '#fff',
                                    padding: '6px 22px', transform: 'skewX(-12deg)',
                                    fontWeight: '900', fontSize: '46px', lineHeight: 1,
                                    fontFamily: "'Montserrat', Arial Black, sans-serif",
                                    letterSpacing: '3px'
                                }}>CADD</div>
                                <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                                    <div style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1', fontFamily: "'Montserrat', sans-serif", color: '#1a1a1a' }}>Axis</div>
                                    <div style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '6px', fontFamily: "'Montserrat', sans-serif", color: '#1a1a1a', marginTop: '-2px', textAlign: 'center' }}>CENTRE</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '4px', marginTop: '6px', fontFamily: "'Montserrat', sans-serif", textDecoration: 'underline', textUnderlineOffset: '4px' }}>ACCESS YOUR CAREER</div>
                        </div>

                        {/* ── Sub-header info ── */}
                        <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.6', textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                            CADDAxis Centre Training Services Pvt.Ltd.<br />
                            Registered under Ministry of Corporate Affairs , Govt. of India<br />
                            An ISO 9001:2005, ISO29990:2010 & 21001:2018 certified Organization
                        </div>

                        {/* ── CERTIFICATE Title ── */}
                        <div style={{
                            fontFamily: "'Times New Roman', 'Georgia', serif",
                            fontSize: '46px', fontWeight: '700',
                            letterSpacing: '8px', marginTop: '15px', marginBottom: '12px',
                            color: '#1a1a1a', textAlign: 'center'
                        }}>CERTIFICATE</div>

                        {/* ── ATC Box ── */}
                        <div style={{
                            border: '1.5px solid #555', borderRadius: '30px',
                            padding: '10px 40px', textAlign: 'center',
                            marginBottom: '18px'
                        }}>
                            <div style={{ fontSize: '11.5px', letterSpacing: '0.5px', color: '#444' }}>AUTHORISED TRAINING CENTRE (ATC) CODE & NAME</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '3px', color: '#1a1a1a' }}>C0143- CADDAXIS CENTRE, ICHALKARANJI</div>
                        </div>

                        {/* ── Student Photo (absolute, top-right) ── */}
                        <div style={{
                            position: 'absolute', top: '230px', right: '60px',
                            width: '110px', height: '140px',
                            backgroundColor: '#f0f0f0', border: '1px solid #ccc',
                            overflow: 'hidden', zIndex: 3
                        }}>
                            <img src={cert.photo_url || "/uploads/default-photo.png"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Student Photo" />
                        </div>

                        {/* ── "This is to certificate..." ── */}
                        <div style={{ fontSize: '20px', color: '#333', marginTop: '10px', textAlign: 'center', lineHeight: '1.6' }}>
                            This is to certificate gratefully<br />presented to
                        </div>

                        {/* ── Student Name (cursive) ── */}
                        <div style={{
                            fontFamily: "'Alex Brush', cursive",
                            fontSize: '72px', color: '#1a1a1a',
                            margin: '5px 0 5px 0', lineHeight: '1.1'
                        }}>
                            {cert.student_name}
                        </div>

                        {/* ── Exam result text ── */}
                        <div style={{ fontSize: '16px', textAlign: 'center', lineHeight: '1.7', color: '#333' }}>
                            has successfully completed and passed the prescribed examination<br />
                            with <span style={{ fontWeight: '900', fontSize: '18px' }}>A+</span> Grade <span style={{ fontWeight: '900', fontSize: '18px' }}>96%</span> has been awarded the
                        </div>

                        {/* ── Course Title (BLACK + BOLD, as in PDF) ── */}
                        <div style={{
                            fontSize: '28px', fontWeight: '900',
                            marginTop: '12px', textAlign: 'center',
                            color: '#1a1a1a', letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            CERTIFICATE IN {cert.course_name}
                        </div>

                        {/* ── Course Duration (in parentheses, normal black) ── */}
                        <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', color: '#333' }}>
                            (COURSE DURATION: 3 MONTHS)
                        </div>

                        {/* ── Guidelines text ── */}
                        <div style={{ fontSize: '15px', marginTop: '14px', textAlign: 'center', color: '#333' }}>
                            Prepared in line with guidelines of
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginTop: '2px' }}>
                            CADD Axis Centre
                        </div>

                        {/* ── Certificate Number Box ── */}
                        <div style={{
                            border: '1.5px solid #555', borderRadius: '30px',
                            padding: '6px 40px', textAlign: 'center',
                            marginTop: '16px'
                        }}>
                            <div style={{ fontSize: '11px', color: '#555' }}>Certificate Number</div>
                            <div style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a1a' }}>{cert.unique_id.replace('CERT-', 'CX-').toUpperCase()}</div>
                        </div>

                        {/* ── Date of Issue ── */}
                        <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '12px', color: '#1a1a1a' }}>
                            DATE OF ISSUE: {formattedDate}
                        </div>

                        {/* ── Spacer to push signatures down ── */}
                        <div style={{ flex: 1 }} />

                        {/* ── Signature Section ── */}
                        <div style={{
                            width: '100%', display: 'flex',
                            justifyContent: 'space-between', alignItems: 'flex-end',
                            padding: '0 20px', boxSizing: 'border-box',
                            marginBottom: '55px'
                        }}>
                            {/* Left: Authorised by */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ borderTop: '1.5px solid #333', width: '200px', paddingTop: '6px' }}>
                                    <div style={{ fontSize: '13px' }}>Authorised by:</div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#E91E63' }}>CADDAXIS CENTRE</div>
                                </div>
                            </div>

                            {/* Right: Signature + Seal + Title */}
                            <div style={{ textAlign: 'center', position: 'relative' }}>
                                {/* Cursive signature above line */}
                                <div style={{
                                    position: 'absolute', top: '-55px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontFamily: "'Alex Brush', cursive",
                                    fontSize: '38px', color: '#1a3a6b',
                                    whiteSpace: 'nowrap', zIndex: 2
                                }}>
                                    {cert.student_name}
                                </div>

                                {/* Circular seal stamp overlapping the signature area */}
                                <div style={{
                                    position: 'absolute', top: '-80px', right: '-45px',
                                    width: '120px', height: '120px',
                                    opacity: 0.4, zIndex: 3, pointerEvents: 'none'
                                }}>
                                    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                                        <circle cx="100" cy="100" r="90" fill="none" stroke="#c0392b" strokeWidth="4" />
                                        <circle cx="100" cy="100" r="80" fill="none" stroke="#c0392b" strokeWidth="2" />
                                        <circle cx="100" cy="100" r="45" fill="none" stroke="#c0392b" strokeWidth="1.5" />
                                        <defs>
                                            <path id="sealTop" d="M 15,100 a 85,85 0 1,1 170,0" fill="none" />
                                            <path id="sealBot" d="M 185,100 a 85,85 0 1,1 -170,0" fill="none" />
                                        </defs>
                                        <text fontFamily="Arial" fontSize="11" fontWeight="bold" fill="#c0392b">
                                            <textPath href="#sealTop" startOffset="5%">AND SKILL DEVELOPMENT</textPath>
                                        </text>
                                        <text fontFamily="Arial" fontSize="11" fontWeight="bold" fill="#c0392b">
                                            <textPath href="#sealBot" startOffset="22%">ICHALKARANJI</textPath>
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

                        {/* ── Footer ── */}
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

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <Link href="/" className="btn btn-outline" style={{ background: 'white' }}>Back to Home</Link>
                </div>
            </div>
        </main>
    );
}

function NotFound({ id }) {
    return (
        <main style={{ background: 'var(--surface-alt)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <div className="card" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', color: 'var(--accent)' }}>
                        <XCircle size={64} />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent)' }}>Invalid Certificate</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        We could not find a certificate with ID: <br /><span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: 'bold' }}>{id}</span>
                    </p>
                    <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem', color: '#9f1239', marginBottom: '2rem' }}>
                        Please check the ID and try again, or contact the administration.
                    </div>
                    <Link href="/" className="btn btn-outline">Back to Home</Link>
                </div>
            </div>
        </main>
    )
}
