'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SecureContent({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    const [devToolsOpen, setDevToolsOpen] = useState(false);

    useEffect(() => {
        if (isAdmin) return; // Skip for admin

        const handleContext = (e) => e.preventDefault();

        const handleKeyDown = (e) => {
            // Print Screen
            if (e.key === 'PrintScreen') {
                // We can't actually stop OS screenshot, but we can detect the key and hide content temporarily
                // or copy trash to clipboard
                document.body.style.filter = 'blur(20px)';
                setTimeout(() => document.body.style.filter = 'none', 3000);

                // Clear Clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.writeText("Copyright Protected Content - CaddAxis").catch(() => { });
                }
                alert("Screenshots are disabled to protect intellectual property.");
            }

            // Prevent Save, Inspect, Print
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'p')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
            }
        };

        const detectDevTools = () => {
            if (isAdmin) return;
            const threshold = 160;
            if (
                window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold
            ) {
                setDevToolsOpen(true);
            } else {
                setDevToolsOpen(false);
            }
        }

        window.addEventListener('resize', detectDevTools);
        document.addEventListener('contextmenu', handleContext);
        document.addEventListener('keydown', handleKeyDown);

        detectDevTools();

        return () => {
            window.removeEventListener('resize', detectDevTools);
            document.removeEventListener('contextmenu', handleContext);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAdmin]);

    if (devToolsOpen && !isAdmin) {
        return (
            <div style={{ height: '100vh', background: 'black', color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'monospace' }}>
                <h1 style={{ fontSize: '3rem' }}>SECURITY ALERT</h1>
                <p>Developer Tools are strictly prohibited.</p>
            </div>
        );
    }

    return (
        <div className="secure-wrapper" style={{ position: 'relative' }}>
            {!isAdmin && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: 99999,
                    background: 'transparent',
                    // Subtle diagonal text pattern could be added here via CSS
                }}></div>
            )}
            {children}
        </div>
    );
}
