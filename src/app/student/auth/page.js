'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentSignIn, studentSignUp, sendPasswordResetOTP, resetPasswordWithOTP } from '@/app/actions';
import { LogIn, UserPlus, Mail, Lock, User, Phone, BookOpen, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export default function StudentAuthPage() {
    const router = useRouter();
    const [view, setView] = useState('signin'); // signin, signup, forgot, reset
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Animation state for sliding form
    const [isSliding, setIsSliding] = useState(false);

    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', course: 'AutoCAD Civil 3D'
    });
    const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });

    // PERSISTENCE LOGIC
    useEffect(() => {
        const saved = localStorage.getItem('caddaxis_signup_draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSignUpData(prev => ({ ...prev, ...parsed, password: '', confirmPassword: '' })); // Don't restore passwords
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        // Save draft but EXCLUDE passwords
        const { password, confirmPassword, ...draft } = signUpData;
        if (draft.name || draft.email || draft.phone) {
            localStorage.setItem('caddaxis_signup_draft', JSON.stringify(draft));
        }
    }, [signUpData]);

    const handleSwitchView = (newView) => {
        setIsSliding(true);
        setTimeout(() => {
            setView(newView);
            setIsSliding(false);
            setError('');
            setSuccessMsg('');
        }, 300);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await studentSignIn(signInData.email, signInData.password);
            if (result.success) {
                localStorage.setItem('student', JSON.stringify(result.student));
                window.location.href = '/student/dashboard';
            } else {
                setError(result.error);
            }
        } catch (e) {
            setError("An unexpected error occurred. Please try again.");
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (signUpData.password !== signUpData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (signUpData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await studentSignUp(signUpData);

        if (result.success) {
            localStorage.removeItem('caddaxis_signup_draft');
            alert('Account created successfully! Please sign in.');
            window.location.href = '/';
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        const result = await sendPasswordResetOTP(resetData.email);
        if (result.success) {
            setSuccessMsg(result.message);
            if (result.mock) {
                alert("Mock OTP sent to console. Check server logs.");
            }
            handleSwitchView('reset');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await resetPasswordWithOTP(resetData.email, resetData.otp, resetData.newPassword);
        if (result.success) {
            alert('Password reset successfully! Please login with new password.');
            handleSwitchView('signin');
            setSignInData({ ...signInData, email: resetData.email });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <main className="auth-page">
            <CustomCursor />
            <Navbar />

            <div className="auth-container">
                {/* LEFT SIDE: ARTWORK */}
                <div className="auth-art">
                    <div className="art-overlay">
                        <h1 className="art-title">
                            WELCOME <br />
                            <span className="highlight">FUTURE</span><br />
                            ENGINEER
                        </h1>
                        <p className="art-subtitle">Access your world-class curriculum and shape the future.</p>
                    </div>
                    <img src="/assets/images/login_bg.png" alt="Login Art" className="art-img" />
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="auth-form-wrapper">
                    <div className={`auth-form-content ${isSliding ? 'fade-out' : 'fade-in'}`}>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 className="display-text" style={{ fontSize: '3rem' }}>
                                {view === 'signup' && 'JOIN US'}
                                {view === 'signin' && 'SIGN IN'}
                                {view === 'forgot' && 'RECOVER'}
                                {view === 'reset' && 'NEW PASS'}
                            </h2>
                            <p style={{ color: '#666' }}>
                                {view === 'signup' && 'Start your journey with CaddAxis today.'}
                                {view === 'signin' && 'Welcome back. Please enter your details.'}
                                {view === 'forgot' && 'Don\'t worry, happens to the best of us.'}
                                {view === 'reset' && 'Secure your account with a new password.'}
                            </p>
                        </div>

                        {error && <div className="alert error">{error}</div>}
                        {successMsg && <div className="alert success">{successMsg}</div>}

                        {/* Sign In Form */}
                        {view === 'signin' && (
                            <form onSubmit={handleSignIn} className="modern-form">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        value={signInData.email}
                                        onChange={e => setSignInData({ ...signInData, email: e.target.value })}
                                        required
                                        className="minimal-input"
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="PASSWORD"
                                        value={signInData.password}
                                        onChange={e => setSignInData({ ...signInData, password: e.target.value })}
                                        required
                                        className="minimal-input"
                                    />
                                    <button type="button" onClick={() => handleSwitchView('forgot')} className="link-btn">
                                        Forgot Password?
                                    </button>
                                </div>
                                <button disabled={loading} className="btn-main full-width" data-hover="true">
                                    {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
                                </button>
                                <div className="form-footer">
                                    New Student? <button type="button" onClick={() => handleSwitchView('signup')} className="highlight-link">Create Account</button>
                                </div>
                            </form>
                        )}

                        {/* Forgot Password View */}
                        {view === 'forgot' && (
                            <form onSubmit={handleSendOTP} className="modern-form">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="REGISTERED EMAIL"
                                        value={resetData.email}
                                        onChange={e => setResetData({ ...resetData, email: e.target.value })}
                                        required
                                        className="minimal-input"
                                    />
                                </div>
                                <button disabled={loading} className="btn-main full-width" data-hover="true">
                                    {loading ? 'SENDING...' : 'SEND RECOVERY OTP'}
                                </button>
                                <button type="button" onClick={() => handleSwitchView('signin')} className="link-btn center">
                                    &larr; Back to Login
                                </button>
                            </form>
                        )}

                        {/* Reset Password View */}
                        {view === 'reset' && (
                            <form onSubmit={handleResetPassword} className="modern-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="OTP CODE"
                                        value={resetData.otp}
                                        onChange={e => setResetData({ ...resetData, otp: e.target.value })}
                                        required
                                        className="minimal-input center-text"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="NEW PASSWORD"
                                        value={resetData.newPassword}
                                        onChange={e => setResetData({ ...resetData, newPassword: e.target.value })}
                                        required
                                        className="minimal-input"
                                    />
                                </div>
                                <button disabled={loading} className="btn-main full-width" data-hover="true">
                                    {loading ? 'UPDATING...' : 'SET NEW PASSWORD'}
                                </button>
                            </form>
                        )}

                        {/* Sign Up Form */}
                        {view === 'signup' && (
                            <form onSubmit={handleSignUp} className="modern-form">
                                <div className="input-group">
                                    <input type="text" placeholder="FULL NAME" onChange={e => setSignUpData({ ...signUpData, name: e.target.value })} required className="minimal-input" />
                                </div>
                                <div className="input-group">
                                    <input type="tel" placeholder="PHONE NUMBER" onChange={e => setSignUpData({ ...signUpData, phone: e.target.value })} required className="minimal-input" />
                                </div>
                                <div className="input-group">
                                    <input type="email" placeholder="EMAIL ADDRESS" onChange={e => setSignUpData({ ...signUpData, email: e.target.value })} required className="minimal-input" />
                                </div>
                                <div className="input-group">
                                    <select onChange={e => setSignUpData({ ...signUpData, course: e.target.value })} className="minimal-input">
                                        <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                                        <option value="Revit Architecture">Revit Architecture</option>
                                        <option value="SolidWorks">SolidWorks</option>
                                        <option value="CATIA V4/V5">CATIA V4/V5</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <input type="password" placeholder="PASSWORD" onChange={e => setSignUpData({ ...signUpData, password: e.target.value })} required className="minimal-input" />
                                </div>
                                <div className="input-group">
                                    <input type="password" placeholder="CONFIRM PASSWORD" onChange={e => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} required className="minimal-input" />
                                </div>
                                <button disabled={loading} className="btn-main full-width" data-hover="true">
                                    {loading ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}
                                </button>
                                <div className="form-footer">
                                    Have an account? <button type="button" onClick={() => handleSwitchView('signin')} className="highlight-link">Sign In</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    padding-top: var(--header-height);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .auth-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    flex: 1;
                    min-height: calc(100vh - var(--header-height));
                }
                .auth-art {
                    position: relative;
                    background: #000;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .art-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.6;
                    transition: transform 10s ease;
                }
                .auth-art:hover .art-img {
                    transform: scale(1.1);
                }
                .art-overlay {
                    position: absolute;
                    z-index: 2;
                    text-align: left;
                    padding: 4rem;
                }
                .art-title {
                    font-size: 4rem;
                    color: white;
                    line-height: 1;
                    margin-bottom: 2rem;
                }
                .art-subtitle {
                    color: rgba(255,255,255,0.7);
                    font-size: 1.2rem;
                    max-width: 300px;
                }
                .auth-form-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    background: var(--surface);
                }
                .auth-form-content {
                    width: 100%;
                    max-width: 450px;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .fade-out { opacity: 0; transform: translateY(20px); }
                .fade-in { opacity: 1; transform: translateY(0); }
                
                .modern-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .input-group { position: relative; }
                .minimal-input {
                    width: 100%;
                    padding: 1rem 0;
                    border: none;
                    border-bottom: 2px solid #ddd;
                    font-family: 'Oswald';
                    font-size: 1.2rem;
                    background: transparent;
                    outline: none;
                    transition: border-color 0.3s;
                }
                .minimal-input:focus { border-bottom-color: var(--primary); }
                .link-btn {
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                    cursor: pointer;
                    display: block;
                    width: 100%;
                    text-align: right;
                }
                .link-btn:hover { color: var(--primary); }
                .full-width { width: 100%; text-align: center; margin-top: 1rem; }
                .form-footer {
                    text-align: center;
                    margin-top: 2rem;
                    font-size: 0.9rem;
                    color: #666;
                }
                .highlight-link {
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-weight: 600;
                    cursor: pointer;
                    text-transform: uppercase;
                }
                
                @media (max-width: 900px) {
                    .auth-container { grid-template-columns: 1fr; }
                    .auth-art { display: none; } /* Hide art on mobile to focus on form */
                }
            `}</style>
        </main>
    );
}
