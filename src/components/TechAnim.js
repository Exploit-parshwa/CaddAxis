'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function TechAnim() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax & Rotate effects
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} style={{
            background: '#0f172a',
            padding: '8rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>

            {/* Background Grid - Engineering Paper Look */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.5
            }}></div>

            <style jsx>{`
                .tech-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }
                .tech-anim-container {
                    position: relative;
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .software-cloud {
                    margin-top: 4rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    opacity: 0.5;
                }
                .software-item {
                    color: white;
                    font-family: 'Oswald';
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                }
                @media (max-width: 768px) {
                    .tech-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 2rem;
                    }
                    .tech-anim-container {
                        height: 300px;
                        margin-top: 2rem;
                    }
                    .software-cloud {
                        flex-wrap: wrap;
                        gap: 1rem;
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                <div className="tech-grid">

                    {/* Left: Text Content */}
                    <motion.div style={{ opacity }} initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <h4 style={{ color: '#e91e63', fontFamily: 'Oswald', letterSpacing: '2px', fontSize: '1rem', marginBottom: '1rem' }}>
                            /// FUTURE ENGINEERING
                        </h4>
                        <h2 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'Oswald', lineHeight: 1.1, marginBottom: '2rem' }}>
                            DESIGN THE <br />
                            <span style={{ color: 'transparent', WebkitTextStroke: '1px white' }}>IMPOSSIBLE.</span>
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
                            Experience the precision of modern CAD and the power of simulation.
                            From exact blueprints to realistic renders, we bridge the gap between imagination and reality.
                        </p>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', justifyContent: 'center' }}>
                            <div>
                                <h3 style={{ color: '#e91e63', fontSize: '2.5rem', fontFamily: 'Oswald', margin: 0 }}>0.01mm</h3>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Precision</span>
                            </div>
                            <div>
                                <h3 style={{ color: '#e91e63', fontSize: '2.5rem', fontFamily: 'Oswald', margin: 0 }}>4K</h3>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Render Quality</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Abstract Animation */}
                    <div className="tech-anim-container">

                        {/* Rotating Gear / Turbine Abstract */}
                        <motion.div
                            style={{
                                width: '300px', height: '300px',
                                border: '2px dashed rgba(233, 30, 99, 0.3)',
                                borderRadius: '50%',
                                position: 'absolute',
                                rotate
                            }}
                        />
                        <motion.div
                            style={{
                                width: '250px', height: '250px',
                                border: '10px solid rgba(255,255,255,0.05)',
                                borderTop: '10px solid #e91e63',
                                borderRadius: '50%',
                                position: 'absolute',
                                rotate: useTransform(scrollYProgress, [0, 1], [0, -180])
                            }}
                        />

                        {/* Central Blueprint Cube (SVG) */}
                        <motion.svg
                            viewBox="0 0 200 200"
                            style={{ width: '180px', height: '180px', filter: 'drop-shadow(0 0 20px rgba(233,30,99,0.3))' }}
                        >
                            {/* Animated Path: Drawing a Cube */}
                            <motion.path
                                d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z M20 60 L100 100 L180 60 M100 100 L100 180"
                                fill="none"
                                stroke="#e91e63"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                            />
                            {/* Inner fill glow */}
                            <motion.path
                                d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z"
                                fill="#e91e63"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: [0, 0.1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                        </motion.svg>

                        {/* Floating Particles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: '10px', height: '10px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    top: '50%', left: '50%'
                                }}
                                animate={{
                                    x: [0, (Math.random() - 0.5) * 400],
                                    y: [0, (Math.random() - 0.5) * 400],
                                    opacity: [1, 0],
                                    scale: [1, 0]
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                        ))}

                    </div>

                </div>

                {/* Bottom Strip: Software Icons (Text) */}
                <div className="software-cloud">
                    {['AUTOCAD', 'REVIT', 'SOLIDWORKS', 'CATIA', 'ANSYS', '3DS MAX'].map(sw => (
                        <span key={sw} className="software-item">{sw}</span>
                    ))}
                </div>

            </div>
        </section>
    );
}
