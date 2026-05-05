'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, Shield } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ style }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide if scrolling down AND passed 100px. Show if scrolling up.
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={styles.nav} style={{
            background: 'white',
            borderBottom: '1px solid #eee',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            transition: 'transform 0.3s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            zIndex: 1000,
            boxShadow: isVisible && lastScrollY > 0 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            ...style
        }}>
            <div className={styles.content} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem' }}>
                {/* Logo */}
                <Link href="/" className={styles.logo} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <img
                        src="/logos/caddaxis-logo-enhanced.png"
                        alt="CAD AXIS"
                        style={{
                            height: '75px',
                            width: 'auto',
                            objectFit: 'contain',
                            mixBlendMode: 'multiply',
                            filter: 'contrast(1.2) brightness(1.1)'
                        }}
                    />
                </Link>

                {/* Desktop Menu - Centered Links */}
                <div className={styles.menuDesktop} style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Link href="/" className={styles.link} style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'black', fontWeight: '500' }}>HOME</Link>
                    <Link href="/about" className={styles.link} style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'black', fontWeight: '500' }}>ABOUT</Link>

                    <div className={styles.dropdownContainer}>
                        <Link href="/courses" className={styles.link} style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'black', fontWeight: '500' }}>COURSES</Link>
                    </div>

                    <Link href="/franchise" className={styles.link} style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'black', fontWeight: '500' }}>FRANCHISE</Link>
                    <Link href="/contact" className={styles.link} style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'black', fontWeight: '500' }}>CONTACT</Link>
                </div>

                {/* Right Side - Student Portal Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/student/auth" style={{
                        background: '#FF007F',
                        color: 'white',
                        padding: '0.6rem 1.4rem',
                        borderRadius: '25px', /* Rounded corners */
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'opacity 0.2s'
                    }}>
                        <User size={18} /> Student Portal
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ color: 'black' }}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed', top: '80px', left: 0, width: '100%',
                    background: 'white', borderBottom: '1px solid #e2e8f0', padding: '2rem',
                    display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 100
                }}>
                    <Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>HOME</Link>
                    <Link href="/about" className={styles.link} onClick={() => setIsMenuOpen(false)}>ABOUT</Link>
                    <Link href="/courses" className={styles.link} onClick={() => setIsMenuOpen(false)}>COURSES</Link>
                    <Link href="/franchise" className={styles.link} onClick={() => setIsMenuOpen(false)}>FRANCHISE</Link>
                    <Link href="/contact" className={styles.link} onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                    <Link href="/student/auth" style={{ color: '#FF007F', fontWeight: 'bold' }} onClick={() => setIsMenuOpen(false)}>
                        Student Portal
                    </Link>
                </div>
            )}
        </nav>
    );
}
