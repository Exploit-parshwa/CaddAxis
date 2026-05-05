"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Quote, TrendingUp, Users, Award, Briefcase, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <main>
            <Navbar />

            {/* HERO SECTION - DYNAMIC & ALIVE */}
            <section style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: '#fff',
                paddingTop: '80px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Animated Grid */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.5,
                    zIndex: 0
                }}></div>

                {/* Floating "Blueprint" Elements */}
                <div style={{ position: 'absolute', top: '20%', right: '5%', opacity: 0.1, animation: 'float 6s ease-in-out infinite' }}>
                    <Briefcase size={300} strokeWidth={0.5} color="var(--primary)" />
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 4vw' }}>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '50px', marginBottom: '2rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        EST. 2008
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(4rem, 10vw, 8rem)',
                        lineHeight: 0.9,
                        marginBottom: '2rem',
                        color: 'var(--black)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        fontFamily: 'Oswald',
                        letterSpacing: '-2px'
                    }}>
                        Structuring <br />
                        <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--primary)' }}>Ambition.</span>
                    </h1>
                    <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <p style={{ maxWidth: '500px', fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                            We are not just an institute. We are the <span className="highlight">architects</span> of the next generation of engineering talent.
                            Bridging the gap between theory and reality.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Zap size={24} fill="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Oswald' }}>ISO 9001:2015</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Certified Excellence</div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                `}</style>
            </section>

            {/* THE TIMELINE - "From Garage to Globe" */}
            <section style={{ padding: '8rem 4vw', background: '#0f172a', color: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', marginBottom: '5rem', borderBottom: '1px solid #334155', paddingBottom: '2rem' }}>OUR <span style={{ color: 'var(--primary)' }}>EVOLUTION</span></h2>

                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {/* Vertical Line */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '100%', background: '#334155' }}></div>

                        {[
                            { year: '2008', title: 'The Blueprint', text: 'Founded in a small garage in Pune with 5 workstations and a mission to democratize CAD software access.' },
                            { year: '2012', title: 'Expansion Phase', text: 'Opened 10 centers across Maharashtra. Partnered with Autodesk as an authorized training center.' },
                            { year: '2016', title: 'Digital Shift', text: 'Launched the Student Portal and Hybrid Learning models, reaching students in remote areas.' },
                            { year: '2020', title: 'Industry Integration', text: 'Signed MOUs with L&T and Tata Motors for direct campus placements.' },
                            { year: '2024', title: 'National Leader', text: 'Celebrating 15k+ graduates and 50+ centers pan-India.' }
                        ].map((item, i) => (
                            <div key={i} style={{ marginBottom: '4rem', paddingLeft: '3rem', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: '-9px', top: '0',
                                    width: '20px', height: '20px', background: 'var(--primary)',
                                    borderRadius: '50%', border: '4px solid #0f172a'
                                }}></div>
                                <div style={{ fontSize: '4rem', fontFamily: 'Oswald', opacity: 0.2, lineHeight: 0.8, marginBottom: '0.5rem' }}>{item.year}</div>
                                <h3 style={{ fontSize: '2rem', fontFamily: 'Oswald', marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: '#94a3b8', maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.6 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MEET THE MINDS - (User liked this, keeping it but checking spacing) */}
            <section style={{ padding: '8rem 4vw', background: '#fff' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#fdf2f8', color: 'var(--primary)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.8rem' }}>LEADERSHIP</div>
                            <h2 style={{ fontSize: '3.5rem', fontFamily: 'Oswald', marginBottom: '2rem', lineHeight: 1.1 }}>MEET THE <br /><span className="highlight">MINDS</span></h2>
                            <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                                "At CaddAxis, we don't just teach software; we build careers. Our leadership team consists of industry veterans from L&T, Tata Motors, and AECOM who have shaped the infrastructure of modern India."
                            </p>

                            <div style={{ background: '#f8fafc', padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                                <Quote size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p style={{ fontSize: '1.3rem', fontStyle: 'italic', fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                                    "Our mission is to bridge the gap between academic knowledge and industry application. Every CaddAxis center is a hub of innovation."
                                </p>
                                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                                        <img src="/assets/images/founder.png" alt="Parshwa Kalantre" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>Parshwa Kalantre</div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Founder & CEO</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            {[
                                { name: "Expert Mentor", role: "Design Head", img: "/assets/images/founder.png" },
                                { name: "Expert Mentor", role: "Technical Lead", img: "/assets/images/founder1.jpg" },
                                { name: "Expert Mentor", role: "Operations", img: "/assets/images/founder.png" },
                                { name: "Expert Mentor", role: "Strategy", img: "/assets/images/founder1.jpg" }
                            ].map((mentor, i) => (
                                <div key={i} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', height: '280px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                                    <img src={mentor.img} alt={mentor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', transition: 'all 0.5s ease' }}
                                        onMouseOver={(e) => { e.target.style.filter = 'grayscale(0%)'; e.target.style.transform = 'scale(1.1)'; }}
                                        onMouseOut={(e) => { e.target.style.filter = 'grayscale(100%)'; e.target.style.transform = 'scale(1)'; }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, width: '100%',
                                        padding: '1.5rem',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                        color: 'white',
                                        pointerEvents: 'none'
                                    }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Oswald' }}>{mentor.name.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{mentor.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MANIFESTO - BIG TYPOGRAPHY */}
            <section style={{ padding: '6rem 4vw', background: '#f1f5f9' }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Oswald', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.2, color: '#1e293b', textTransform: 'uppercase' }}>
                            "To empower the <span style={{ color: 'var(--primary)' }}>builders</span> of tomorrow with the tools of today, creating a world where <span style={{ textDecoration: 'underline', textDecorationThickness: '4px' }}>imagination</span> meets engineering precision."
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}
