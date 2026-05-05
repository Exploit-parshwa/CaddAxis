'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight } from 'lucide-react';

export default function FranchiseLogin() {
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
            // Dynamically import to avoid server/client issues if any
            const { authenticateFranchise } = await import('@/app/actions_franchise');
            const result = await authenticateFranchise(formData);

            if (result.success) {
                // Set cookie manually for this simple implementation
                document.cookie = `franchise_session=${result.franchiseId}; path=/; max-age=86400`;
                document.cookie = `franchise_name=${result.name}; path=/; max-age=86400`;

                router.push('/franchise-panel/dashboard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('System Error');
        }
        setLoading(false);
    };

    return (
        <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(233, 30, 99, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#E91E63', border: '1px solid rgba(233, 30, 99, 0.2)' }}>
                        <Building2 size={32} />
                    </div>
                    <h1 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '0.5rem' }}>PARTNER <span style={{ color: '#E91E63' }}>LOGIN</span></h1>
                    <p style={{ color: '#94a3b8' }}>Access your franchise control center.</p>
                </div>

                <form onSubmit={handleLogin} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }}
                            placeholder="franchise@caddaxis.com"
                            onFocus={(e) => e.target.style.borderColor = '#E91E63'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }}
                            placeholder="••••••••"
                            onFocus={(e) => e.target.style.borderColor = '#E91E63'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <button
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', background: '#E91E63', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        {loading ? 'Authenticating...' : <>Login to Console <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>
        </main>
    );
}
