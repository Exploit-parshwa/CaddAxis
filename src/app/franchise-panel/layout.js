'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, Users, Wallet, Settings, LogOut, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FranchiseLayout({ children }) {
    const pathname = usePathname();
    const [name, setName] = useState('Partner');

    useEffect(() => {
        // Simple cookie parse to get name
        const match = document.cookie.match(new RegExp('(^| )franchise_name=([^;]+)'));
        if (match) setName(decodeURIComponent(match[2]));
    }, []);

    // If on login page, render full screen
    if (pathname === '/franchise-panel/login') {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Dashboard', href: '/franchise-panel/dashboard', icon: LayoutDashboard },
        { name: 'Students', href: '/franchise-panel/students', icon: Users },
        { name: 'Certificate Issue', href: '/franchise-panel/certificates', icon: Award },
        { name: 'Courses', href: '/franchise-panel/courses', icon: Building2 }, // Reusing icon
        { name: 'Staff', href: '/franchise-panel/staff', icon: Users },
        { name: 'Exams & Results', href: '/franchise-panel/exams', icon: Settings }, // Using Settings icon temporarily
        { name: 'Wallet & Topup', href: '/franchise-panel/wallet', icon: Wallet },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column', zIndex: 50 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '36px', height: '36px', background: '#E91E63', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontFamily: 'Oswald', color: '#0f172a', margin: 0, lineHeight: 1 }}>CADDAXIS</h2>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Partner Console</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Logged in as:</p>
                        <p style={{ fontWeight: 'bold', color: '#334155', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {menuItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '8px',
                                        color: isActive ? '#E91E63' : '#64748b',
                                        background: isActive ? '#fdf2f8' : 'transparent',
                                        fontWeight: isActive ? '600' : '500',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={() => {
                            document.cookie = 'franchise_session=; path=/; max-age=0';
                            document.cookie = 'franchise_name=; path=/; max-age=0';
                            window.location.href = '/franchise-panel/login';
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            width: '100%',
                            padding: '0.8rem',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
