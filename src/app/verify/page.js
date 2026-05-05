'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function VerifyCertificate() {
    const [certId, setCertId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setTimeout(() => {
            // Mock result
            if (certId === 'CAD123') {
                setResult({
                    status: 'valid',
                    student: 'Rahul Patil',
                    course: 'AutoCAD Civil 3D Master Class',
                    issueDate: '12 Dec 2024',
                    grade: 'A+'
                });
            } else if (certId === 'ERR500') {
                setResult({ status: 'error', message: 'Database connection timeout. Please try again.' });
            } else {
                setResult({ status: 'invalid' });
            }
            setIsVerifying(false);
        }, 2000);
    };

    return (
        <main className="verify-page">
            <CustomCursor />
            <Navbar />

            <section className="verify-section">
                <div className="bg-overlay"></div>

                <div className="content-wrapper">
                    <h1 className="luxury-title">AUTHENTICATE <br /><span className="gold-text">EXCELLENCE</span></h1>
                    <p className="subtitle">Enter your unique certificate ID to validate your credentials.</p>

                    <form onSubmit={handleVerify} className="verify-form">
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="CERTIFICATE ID (e.g. CAD123)"
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                className="luxury-input"
                            />
                            <button className="verify-btn" disabled={isVerifying}>
                                {isVerifying ? 'VALIDATING...' : 'VERIFY NOW'}
                            </button>
                        </div>
                    </form>

                    {result && (
                        <div className={`result-card ${result.status}`}>
                            {result.status === 'valid' && (
                                <>
                                    <div className="status-icon success">✓</div>
                                    <h3>CERTIFICATE VERIFIED</h3>
                                    <div className="cert-details">
                                        <div className="detail-row">
                                            <span>Issued To:</span>
                                            <strong>{result.student}</strong>
                                        </div>
                                        <div className="detail-row">
                                            <span>Course:</span>
                                            <strong>{result.course}</strong>
                                        </div>
                                        <div className="detail-row">
                                            <span>Date:</span>
                                            <strong>{result.issueDate}</strong>
                                        </div>
                                        <div className="detail-row">
                                            <span>Grade:</span>
                                            <strong>{result.grade}</strong>
                                        </div>
                                    </div>
                                    <div className="digital-seal">
                                        <img src="/assets/images/logo.png" alt="Seal" />
                                    </div>
                                </>
                            )}

                            {result.status === 'invalid' && (
                                <>
                                    <div className="status-icon error">✕</div>
                                    <h3>INVALID CERTIFICATE</h3>
                                    <p>The ID you entered does not match our records. Please contact support.</p>
                                </>
                            )}

                            {result.status === 'error' && (
                                <>
                                    <div className="status-icon warning">⚠</div>
                                    <h3>Verfication Unavailable</h3>
                                    <p>{result.message || 'System is currently undergoing maintenance.'}</p>
                                    <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid white', color: 'white', cursor: 'pointer' }}>RETRY</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <style jsx>{`
                .verify-page {
                    background: #050505;
                    color: white;
                    min-height: 100vh;
                }
                .verify-section {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8rem 4vw;
                    overflow: hidden;
                }
                .bg-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: url('/assets/images/cert_bg.png');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.2;
                    z-index: 0;
                }
                .content-wrapper {
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    width: 100%;
                    text-align: center;
                }
                .luxury-title {
                    font-size: 5rem;
                    line-height: 1;
                    margin-bottom: 2rem;
                    font-family: 'Oswald';
                    letter-spacing: -2px;
                }
                .gold-text {
                    color: #D4AF37; /* Gold Color */
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
                }
                .subtitle {
                    color: #aaa;
                    font-size: 1.2rem;
                    margin-bottom: 4rem;
                }
                .verify-form {
                    margin-bottom: 4rem;
                }
                .input-container {
                    position: relative;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .luxury-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1.5rem 2rem;
                    color: white;
                    font-family: 'Oswald';
                    font-size: 1.5rem;
                    border-radius: 50px;
                    outline: none;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .luxury-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: #D4AF37;
                    box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
                }
                .verify-btn {
                    margin-top: 1.5rem;
                    background: #D4AF37;
                    color: black;
                    border: none;
                    padding: 1rem 3rem;
                    font-family: 'Oswald';
                    font-weight: bold;
                    font-size: 1.2rem;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .verify-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
                }
                
                .result-card {
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 3rem;
                    border-radius: 20px;
                    animation: fadeUp 0.5s ease;
                }
                .result-card.valid {
                    border-color: #D4AF37;
                    background: linear-gradient(135deg, rgba(212,175,55,0.05), transparent);
                }
                .result-card.invalid {
                    border-color: #ff4444;
                }
                .status-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .status-icon.success { color: #D4AF37; }
                .status-icon.error { color: #ff4444; }
                
                .cert-details {
                    margin-top: 2rem;
                    text-align: left;
                    display: inline-block;
                    width: 100%;
                    max-width: 400px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .detail-row span { color: #888; }
                .detail-row strong { color: white; font-size: 1.2rem; }
                
                .digital-seal {
                    margin-top: 2rem;
                    opacity: 0.8;
                }
                .digital-seal img {
                    height: 80px;
                    filter: grayscale(1) brightness(2);
                }

                @media (max-width: 768px) {
                    .luxury-title { font-size: 3rem; }
                }
            `}</style>

            <Footer />
        </main>
    );
}
