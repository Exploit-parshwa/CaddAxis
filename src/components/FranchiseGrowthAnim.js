'use client';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function FranchiseGrowthAnim() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Mouse interactive values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        let { left, top, width, height } = currentTarget.getBoundingClientRect();
        let x = (clientX - left) / width;
        let y = (clientY - top) / height;
        mouseX.set(x);
        mouseY.set(y);
    };

    // Parallax & Reveal animations
    const yContent = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
    const graphProgress = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

    const maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, white, transparent)`;

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
                background: '#0f172a', /* Matched to Hero & Map sections */
                padding: '6rem 0',
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
        >

            {/* 1. MOUSE SPOTLIGHT BACKGROUND */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(233, 30, 99, 0.15), transparent 70%)',
                    zIndex: 0,
                    opacity: 0.6
                }}
                animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -20, 20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Grid Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.3,
                zIndex: 1
            }}></div>


            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10, padding: '0 2rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '4rem', alignItems: 'center' }}>

                    {/* LEFT: TEXT CONTENT */}
                    <motion.div style={{ y: yContent, opacity }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ width: '8px', height: '8px', background: '#e91e63', borderRadius: '50%', boxShadow: '0 0 10px #e91e63' }}></span>
                            <span style={{ color: '#e91e63', fontFamily: 'Oswald', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 'bold' }}>MARKET DOMINANCE</span>
                        </div>

                        <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontFamily: 'Oswald', lineHeight: 1.1, marginBottom: '2rem' }}>
                            EXPONENTIAL <br />
                            <span style={{
                                color: 'transparent',
                                WebkitTextStroke: '1px white'
                            }}>GROWTH.</span>
                        </h2>

                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
                            Join a network that is scaling faster than the industry average.
                            Our partners witness <span style={{ color: 'white', fontWeight: 'bold' }}>300% ROI</span> within the first 18 months.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {[
                                { val: '15L+', label: 'Students Trained' },
                                { val: '150+', label: 'Active Centers' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <h3 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', margin: 0, color: 'white' }}>{stat.val}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>


                    {/* RIGHT: INTERACTIVE GRAPH ANIMATION */}
                    <div style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {/* THE GRAPH SVG */}
                        <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>

                            {/* Gradient Defs */}
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#e91e63" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#e91e63" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Background Lines */}
                            <line x1="0" y1="350" x2="800" y2="350" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <line x1="0" y1="250" x2="800" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                            {/* The Rising Graph Line */}
                            <motion.path
                                d="M0,350 C100,350 150,300 250,280 C350,260 400,200 500,150 C600,100 700,50 800,20"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="4"
                                filter="url(#glow)"
                                initial={{ pathLength: 0 }}
                                style={{ pathLength: graphProgress }}
                            />

                            {/* Data Points appearing along the line */}
                            {[
                                { x: 250, y: 280, label: 'Q1' },
                                { x: 500, y: 150, label: 'Q2 Growth' },
                                { x: 800, y: 20, label: 'Market Lead' }
                            ].map((pt, i) => (
                                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} style={{ opacity: graphProgress, scale: graphProgress }}>

                                    {/* Pulse Circle */}
                                    <circle cx={pt.x} cy={pt.y} r="8" fill="#fff" />
                                    <circle cx={pt.x} cy={pt.y} r="15" fill="none" stroke="#e91e63" strokeWidth="2" opacity="0.5">
                                        <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                                    </circle>

                                    {/* Tooltip Card */}
                                    <foreignObject x={pt.x - 60} y={pt.y - 80} width="120" height="60">
                                        <div style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(5px)',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            textAlign: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.75rem', color: '#e91e63', fontWeight: 'bold', display: 'block' }}>{pt.label}</span>
                                            <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>+{(i + 1) * 45}%</span>
                                        </div>
                                    </foreignObject>
                                </motion.g>
                            ))}

                        </svg>

                        {/* Floating Glass Cards acting as diverse metrics */}
                        <motion.div
                            style={{
                                position: 'absolute', top: '20%', right: '10%',
                                background: 'rgba(23, 23, 23, 0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem',
                                borderRadius: '12px',
                                width: '180px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)'
                            }}
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Total Revenue</div>
                            <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold', fontFamily: 'Oswald' }}>$4.2M</div>
                            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.2rem' }}>▲ 24.5% vs last year</div>
                        </motion.div>

                    </div>

                </div>

            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    .container > div {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }
                    .container h2 {
                        font-size: 3rem !important;
                    }
                    svg {
                        overflow: visible;
                    }
                }
            `}</style>

        </section>
    );
}
