'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Home, Users, BookOpen, User, ClipboardList, Award, FileText, BarChart, Settings, Layout, Globe, LogOut, IndianRupee, Building2, Mail, Calendar, Video, Map } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    // In a real app, check authentication here

    // Check for Franchise Role via Cookie
    const [isFranchise, setIsFranchise] = useState(false);
    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        if (getCookie('ui_role') === 'FRANCHISE') {
            setIsFranchise(true);
        }
    }, []);

    const menuItems = [
        { name: 'Dashboard', icon: Layout, href: '/admin/dashboard' },
        { name: 'Students', icon: Users, href: '/admin/students' },
        { name: 'Fees', icon: IndianRupee, href: '/admin/fees' },
        { name: 'Payments', icon: ClipboardList, href: '/admin/payments' },
        { name: 'Staff', icon: User, href: '/admin/staff' },
        { name: 'Exams', icon: ClipboardList, href: '/admin/exams' },
        { name: 'Certificates', icon: Award, href: '/admin/certificates' },
        { name: 'Marksheet', icon: FileText, href: '/admin/marksheet' },
        { name: 'Courses', icon: BookOpen, href: '/admin/courses' },

        { name: 'Online Classes', icon: Video, href: '/admin/online-classes' },
        { name: 'Events', icon: Calendar, href: '/admin/event-management' },
        { name: 'Messages', icon: Mail, href: '/admin/contact-messages' },

        // Super Admin Only
        { name: 'Reports', icon: BarChart, href: '/admin/reports', superAdmin: true },
        { name: 'Institute Info', icon: Building2, href: '/admin/institute-info', superAdmin: true },
        { name: 'Wallet Approvals', icon: IndianRupee, href: '/admin/payments/approvals', superAdmin: true },
        { name: 'Accounts', icon: Settings, href: '/admin/accounts', superAdmin: true },
        { name: 'Franchise List', icon: Building2, href: '/admin/franchise-list', superAdmin: true },
        { name: 'Franchise Map', icon: Map, href: '/admin/franchise-map', superAdmin: true },
        { name: 'Edit Website', icon: Globe, href: '/admin/website', bottom: true, superAdmin: true },
    ].filter(item => !isFranchise || !item.superAdmin);

    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: '#ffffff',
                borderRight: '1px solid #f1f5f9',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50
            }}>
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{
                        background: '#E91E63',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(233, 30, 99, 0.3)'
                    }}>
                        <span style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'white' }}>C</span>
                    </div>
                    <div>
                        <h2 style={{ color: '#1a1a1a', fontFamily: 'Oswald, sans-serif', fontSize: '1.4rem', letterSpacing: '0.5px', lineHeight: 1, margin: 0 }}>
                            CADDAXIS
                        </h2>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#E91E63', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {isFranchise ? 'FRANCHISE PANEL' : 'Administration'}
                        </span>
                    </div>
                </div>

                <nav style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                    {menuItems.filter(i => !i.bottom).map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1.25rem',
                                    borderRadius: '8px',
                                    color: isActive ? '#E91E63' : '#64748b',
                                    background: isActive ? '#fdf2f8' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    fontWeight: isActive ? '600' : '500',
                                    borderLeft: isActive ? '3px solid #E91E63' : '3px solid transparent'
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#E91E63';
                                        e.currentTarget.style.background = '#fefefe';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#64748b';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span style={{ fontSize: '0.9rem', letterSpacing: '0.3px' }}>{item.name}</span>
                            </Link>
                        );
                    })}

                    <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid #f8fafc' }}>
                        {menuItems.filter(i => i.bottom).map(item => (
                            <Link key={item.name} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', borderRadius: '8px', color: '#64748b', transition: 'all 0.2s', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                document.cookie = 'ui_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                window.location.href = '/admin/login';
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1.25rem',
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                transition: 'color 0.2s',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#ef4444'}
                            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                        >
                            <LogOut size={18} />
                            <span>Logout System</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '280px', width: 'calc(100% - 280px)', padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
