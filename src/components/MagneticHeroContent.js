'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function MagneticHeroContent() {
    return (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* 3D PERSPECTIVE TEXT */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, perspective: '1000px', padding: '0 2rem' }}>

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ color: '#64748b', fontFamily: 'Oswald', letterSpacing: '4px', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}
                >
                    AUTHORIZED PARTNERSHIP ACCESS
                </motion.h2>

                <h1 style={{
                    fontFamily: 'Oswald',
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    lineHeight: 1,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '-1px',
                    margin: '0 0 1rem 0'
                }}>
                    BUILD YOUR <span style={{ color: 'transparent', WebkitTextStroke: '1px #e91e63' }}>LEGACY</span>
                </h1>

                {/* ANIMATED SUBTEXT */}
                <p style={{ maxWidth: '600px', margin: '2rem auto', color: '#94a3b8', fontSize: '1rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <TypewriterText text="> INITIATING SECURE FRANCHISE PROTOCOL..." delay={1000} />
                </p>
                <div style={{ height: '2px', width: '60px', background: '#e91e63', margin: '0 auto 3rem', opacity: 0.7 }}></div>
            </div>

            {/* HOLD TO UNLOCK BUTTON */}
            <div style={{ position: 'relative', height: '120px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <UnlockButton />
            </div>

        </div>
    );
}

function TypewriterText({ text, delay }) {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let timeout;
        const start = setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                setDisplayed(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(timer);
            }, 50);
            return () => clearInterval(timer);
        }, delay);
        return () => clearTimeout(start);
    }, [text, delay]);

    return <span>{displayed}<span className="cursor">|</span><style jsx>{`.cursor { animation: blink 1s infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style></span>;
}

function UnlockButton() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, holding, success
    const requestRef = useRef();
    const isHolding = useRef(false);
    const [attempts, setAttempts] = useState(0);

    //Cleanup on unmount
    useEffect(() => {
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const updateProgress = () => {
        if (isHolding.current) {
            setProgress(prev => {
                // Faster fill for better UX (approx 1.5s total hold time)
                const next = prev + 1.5;
                if (next >= 100) {
                    isHolding.current = false;
                    setStatus('success');
                    window.location.href = '#apply';
                    return 100;
                }
                requestRef.current = requestAnimationFrame(updateProgress);
                return next;
            });
        } else {
            setProgress(prev => {
                if (prev <= 0) {
                    setStatus('idle');
                    return 0;
                }
                // Fast decay so it feels responsive
                const next = prev - 5;
                requestRef.current = requestAnimationFrame(updateProgress);
                return next;
            });
        }
    };

    const startHold = (e) => {
        // Prevent default touch actions (scrolling/context menu)
        // e.preventDefault(); // Commented out to allow scroll if they miss slightly, but we handle touch carefully
        if (status === 'success') return;

        isHolding.current = true;
        setStatus('holding');
        cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(updateProgress);
    };

    const endHold = () => {
        if (status === 'success') return;

        isHolding.current = false;
        // If user just tapped (didn't hold enough), count as attempt
        if (progress < 20) {
            setAttempts(prev => prev + 1);
        }
    };

    // If user struggles with hold, allow click
    const handleForceUnlock = () => {
        setStatus('success');
        setProgress(100);
        window.location.href = '#apply';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                onContextMenu={(e) => e.preventDefault()} // Block right click/long press menu
                style={{
                    position: 'relative',
                    width: '280px',
                    height: '80px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    backdropFilter: 'blur(10px)',
                    touchAction: 'none' // DISALLOW SCROLLING WHILE HOLDING THIS BUTTON
                }}
            >
                {/* FILL BAR */}
                <motion.div
                    style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: `${progress}%`,
                        background: '#e91e63',
                        zIndex: 0
                    }}
                />

                {/* SCANNER LINE */}
                {progress > 0 && progress < 100 && (
                    <div style={{
                        position: 'absolute', left: `${progress}%`, top: 0, bottom: 0, width: '2px', background: 'white',
                        boxShadow: '0 0 15px white', zIndex: 2
                    }} />
                )}

                {/* TEXT */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{
                        fontFamily: 'Oswald',
                        fontSize: '1.2rem',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        mixBlendMode: 'difference',
                        fontWeight: 'bold'
                    }}>
                        {status === 'success' ? 'ACCESS GRANTED' : (attempts > 2 ? 'CLICK TO ENTER' : 'HOLD TO INITIALIZE')}
                    </span>
                    {status === 'holding' && progress < 100 && (
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', marginTop: '4px' }}>
                            VERIFYING... {Math.floor(progress)}%
                        </span>
                    )}
                </div>

                {/* CORNER MARKERS */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: '2px solid #e91e63', borderLeft: '2px solid #e91e63' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderBottom: '2px solid #e91e63', borderRight: '2px solid #e91e63' }} />
            </div>

            {/* FALLBACK FOR IMPATIENT USERS */}
            {attempts > 2 && status !== 'success' && (
                <button
                    onClick={handleForceUnlock}
                    style={{ background: 'none', border: 'none', color: '#e91e63', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    Difficulties? Click here to start
                </button>
            )}
        </div>
    );
}
