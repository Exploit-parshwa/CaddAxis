'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FranchiseMap from '@/components/FranchiseMap';
import EnvelopeSection from '@/components/EnvelopeSection';
import FranchiseApplicationForm from '@/components/FranchiseApplicationForm';
import FranchiseGrowthAnim from '@/components/FranchiseGrowthAnim';
import MagneticHeroContent from '@/components/MagneticHeroContent';
import CivilHeroAnim from '@/components/CivilHeroAnim';
import { Shield, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export default function FranchisePage() {
    const { scrollY } = useScroll();
    const bgTextScale = useTransform(scrollY, [0, 500], [1, 1.5]);
    const bgTextX = useTransform(scrollY, [0, 500], ['0%', '-10%']);
    const contentY = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <main style={{ background: '#f8fafc', overflowX: 'hidden' }}>
            <Navbar style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: 'none' }} />

            {/* HERO SECTION - PEAK LEVEL PARALLAX */}
            <section style={{
                position: 'relative',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                color: 'white',
                overflow: 'hidden',
                marginTop: '-80px', // Pull UP under translucent navbar
                paddingTop: '80px' // Compensate content padding
            }}>
                {/* 1. SCROLLING BACKGROUND TEXT 'CADDAXIS' */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 0,
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}>
                    <motion.h1
                        style={{
                            fontSize: '25vw',
                            fontFamily: 'Oswald',
                            fontWeight: 'bold',
                            color: 'transparent',
                            WebkitTextStroke: '2px rgba(255,255,255,0.05)',
                            whiteSpace: 'nowrap',
                            scale: bgTextScale,
                            x: bgTextX,
                            margin: 0,
                            padding: 0,
                            lineHeight: 1
                        }}
                    >
                        CADDAXIS
                    </motion.h1>
                </div>

                {/* 2. OVERLAY GRADIENT for Depth */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'radial-gradient(circle at center, transparent 0%, #0f172a 90%)',
                    zIndex: 1
                }}></div>

                {/* 3. ALIVE HERO CONTENT */}
                <MagneticHeroContent />
            </section>


            {/* GROWTH ANIMATION */}
            <FranchiseGrowthAnim />

            {/* NETWORK PRESENCE MAP */}
            <section style={{ padding: '8rem 4vw', background: '#0f172a', color: 'white' }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', textAlign: 'center', marginBottom: '1rem' }}>NETWORK <span className="highlight">PRESENCE</span></h2>
                    <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '4rem' }}>Explore our active training centers across the nation.</p>
                    <FranchiseMap />
                </div>
            </section>

            {/* INTERACTIVE ENVELOPE - OFFER */}
            <EnvelopeSection />

            {/* BLUEPRINT / PROCESS SECTION */}
            <section style={{ padding: '8rem 4vw', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', color: '#1e293b', marginBottom: '1.5rem' }}>THE <span className="highlight">BLUEPRINT</span></h2>
                            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7 }}>
                                We don't just give you a signboard; we built a comprehensive business ecosystem. From faculty training to centralized placement support, we ensure your center is profitable from Day 1.
                            </p>
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: '#f0fdf4', padding: '0.8rem', borderRadius: '50%' }}><Shield size={24} color="#16a34a" /></div>
                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>Territory Protection</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: '#eff6ff', padding: '0.8rem', borderRadius: '50%' }}><TrendingUp size={24} color="#2563eb" /></div>
                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>Digital Marketing Support</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: '#fdf4ff', padding: '0.8rem', borderRadius: '50%' }}><Users size={24} color="#d946ef" /></div>
                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>Centralized Placements</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', marginBottom: '2rem' }}>SETUP <span className="highlight">TIMELINE</span></h3>
                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {[
                                    { step: '01', title: 'Application', desc: 'Submit initial inquiry and location details.' },
                                    { step: '02', title: 'Site Survey', desc: 'Our team visits your location for feasibility.' },
                                    { step: '03', title: 'Agreement', desc: 'Sign franchise MOU and welcome kit handover.' },
                                    { step: '04', title: 'Launch', desc: 'Inauguration and first batch commencement.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                                        <span style={{ fontSize: '2rem', fontFamily: 'Oswald', color: '#e2e8f0' }}>{s.step}</span>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#334155' }}>{s.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ANIMATED CONSTRUCTION HERO */}
            <section style={{ background: '#f8fafc', padding: '0 0 6rem 0' }}>
                <CivilHeroAnim />
            </section>

            {/* APPLICATION FORM */}
            <section id="apply" style={{ padding: '6rem 4vw', background: '#0f172a', color: 'white' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald' }}>START <span className="highlight">PARTNERSHIP</span></h2>
                        <p style={{ color: '#94a3b8' }}>Initialize the application process.</p>
                    </div>

                    <FranchiseApplicationForm />
                </div>
            </section>

            <Footer />
        </main >
    );
}
