'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomCursor from '@/components/CustomCursor';

export default function AdminLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            const { authenticateAdmin } = await import('@/app/actions');
            const result = await authenticateAdmin(formData);

            if (result.success

            ) {
                console.log("Admin Login Successful. Redirecting...");
                window.location.href = '/admin/dashboard';
            } else {
                console.warn("Admin Login Failed:", result.error);
                setError(result.error);
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('An unexpected error occurred.');
        }
        setLoading(false);
    };

    return (
        <main style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>

            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3.5rem 3rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid white',
                boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -10px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                        borderRadius: '16px',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontFamily: 'Oswald',
                        boxShadow: '0 10px 20px rgba(233, 30, 99, 0.3)'
                    }}>
                        C
                    </div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', margin: '0 0 0.5rem', letterSpacing: '-0.5px', color: '#1e293b' }}>
                        ADMIN <span style={{ color: '#E91E63' }}>PORTAL</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Secure access for administrators</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#334155',
                                padding: '0.875rem 1rem',
                                fontFamily: 'Inter',
                                fontSize: '1rem',
                                outline: 'none',
                                borderRadius: '12px',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#E91E63'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(233, 30, 99, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#334155',
                                padding: '0.875rem 1rem',
                                fontFamily: 'Inter',
                                fontSize: '1rem',
                                outline: 'none',
                                borderRadius: '12px',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#E91E63'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(233, 30, 99, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <button
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontFamily: 'Inter',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            border: 'none',
                            boxShadow: '0 10px 20px -5px rgba(233, 30, 99, 0.4)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 25px -5px rgba(233, 30, 99, 0.5)'; }}
                        onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px -5px rgba(233, 30, 99, 0.4)'; }}
                    >
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Protected by CaddAxis Security</p>
                </div>
            </div>
        </main>
    );
}
