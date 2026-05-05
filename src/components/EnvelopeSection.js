'use client';
import { useState, useRef, useEffect } from 'react';
import { Heart, X, Sparkles, Check } from 'lucide-react';

export default function EnvelopeSection() {
    const [status, setStatus] = useState('closed'); // 'closed', 'opened'
    const [activeCard, setActiveCard] = useState(null);

    // Cards Data
    const cards = [
        { id: 1, title: "HIGH ROI", subtitle: "110% Return", desc: "Proven business model with low overheads and maximum operational efficiency.", color: "#db2777" },
        { id: 2, title: "360° SUPPORT", subtitle: "Full Service", desc: "From faculty hiring to lead generation. You focus on operations.", color: "#7c3aed" },
        { id: 3, title: "LEGACY BRAND", subtitle: "Since 2008", desc: "Join an elite network of engineering academies trusted by 1.5M+ students.", color: "#059669" }
    ];

    const handleEnvelopeClick = () => {
        if (status === 'closed') {
            setStatus('opened');
            // Auto-select first card after animation? Or let user pick.
            // Let user pick to satisfy "When a user taps a card" requirement.
        }
    };

    return (
        <section style={{ padding: '4rem 0', background: '#fdf2f8', overflow: 'hidden', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>

                {/* HEADLINE */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', color: '#881337' }}>
                        YOUR <span style={{ color: '#E91E63' }}>OFFER</span>
                    </h2>
                </div>

                {/* INTERACTION AREA */}
                <div className="interaction-grid">

                    {/* LEFT: ENVELOPE AREA */}
                    <div className="zone-envelope">
                        <div
                            className={`envelope-wrapper ${status === 'opened' ? 'is-open' : ''}`}
                            onClick={handleEnvelopeClick}
                        >
                            <div className="envelope-back"></div>

                            {/* CARDS PILE */}
                            <div className="cards-stack">
                                {cards.map((card, index) => (
                                    <div
                                        key={card.id}
                                        className={`card-thumb ${status === 'opened' ? 'popped' : ''} ${activeCard?.id === card.id ? 'active' : ''}`}
                                        style={{
                                            '--index': index,
                                            '--color': card.color,
                                            // Staggered delay for popping out
                                            transitionDelay: status === 'opened' ? `${index * 0.2}s` : '0s'
                                        }}
                                        onClick={(e) => {
                                            if (status === 'opened') {
                                                e.stopPropagation();
                                                setActiveCard(card);
                                            }
                                        }}
                                    >
                                        <div className="card-mini-content">
                                            <div className="shape"></div>
                                            <span>{index + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="envelope-front"></div>
                            <div className="envelope-flap"></div>

                            {/* TAP CUE */}
                            {status === 'closed' && (
                                <div className="tap-cue">
                                    <div className="pulse-dot"></div>
                                    <span>TAP TO OPEN</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: DISPLAY AREA */}
                    <div className="zone-display">
                        {!activeCard ? (
                            <div className="empty-state">
                                <div className="placeholder-icon">Select a Card</div>
                                <p>Tap a card from the deck to view details.</p>
                            </div>
                        ) : (
                            <div key={activeCard.id} className="active-card-view">
                                <div className="card-header" style={{ background: activeCard.color }}>
                                    <span>OFFER 0{activeCard.id}</span>
                                    <Sparkles size={20} color="white" opacity={0.8} />
                                </div>
                                <div className="card-body">
                                    <h3 style={{ color: activeCard.color }}>{activeCard.title}</h3>
                                    <span className="badge" style={{ borderColor: activeCard.color, color: activeCard.color }}>
                                        {activeCard.subtitle}
                                    </span>
                                    <p>{activeCard.desc}</p>

                                    <div className="checklist">
                                        <div><Check size={16} color={activeCard.color} /> Verified</div>
                                        <div><Check size={16} color={activeCard.color} /> Active</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <style jsx>{`
                /* GRID LAYOUT - MOBILE FIRST ADAPTIVE */
                .interaction-grid {
                    display: grid;
                    grid-template-columns: 1fr; /* Mobile: Stacked */
                    gap: 3rem;
                    align-items: center;
                    min-height: 500px;
                }
                @media (min-width: 768px) {
                    .interaction-grid {
                        grid-template-columns: 300px 1fr; /* Desktop: Left Env, Right Display */
                        gap: 5rem;
                    }
                }

                /* ZONES */
                .zone-envelope {
                    display: flex;
                    justify-content: center;
                    position: relative;
                    height: 250px; /* Fixed height for the envelope area */
                }
                .zone-display {
                    position: relative;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ENVELOPE STYLES */
                .envelope-wrapper {
                    width: 280px;
                    height: 180px;
                    position: relative;
                    cursor: pointer;
                    margin-top: 50px; /* Push down to easier reach */
                }
                .envelope-back {
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
                    background: #fbcfe8;
                    border-radius: 10px;
                }
                .envelope-front {
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%);
                    clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
                    border-radius: 10px;
                    z-index: 10;
                }
                .envelope-flap {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: #f472b6;
                    clip-path: polygon(0 0, 50% 50%, 100% 0);
                    transform-origin: top;
                    transition: transform 0.6s ease;
                    z-index: 5;
                    border-radius: 10px;
                }
                .envelope-wrapper.is-open .envelope-flap {
                    transform: rotateX(180deg);
                    z-index: 1;
                }

                /* CARDS STACK LOGIC */
                .cards-stack {
                    position: absolute;
                    bottom: 10px;
                    left: 20px;
                    width: calc(100% - 40px);
                    height: 100%;
                    z-index: 2; /* Behind front, in front of flap */
                }

                .card-thumb {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 150px; /* Small card inside env */
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-origin: bottom center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card-thumb .shape {
                    width: 40px; height: 5px; background: var(--color); margin-bottom: 5px; border-radius: 2px;
                }
                .card-thumb span { font-weight: bold; color: #cbd5e1; }

                /* ANIMATION STATES */
                /* Initial: All stacked inside */
                .card-thumb {
                    transform: translateY(0) scale(0.9);
                    opacity: 0; /* Hidden initially */
                }
                
                /* Open: Pop UP and Stack Behind neatly */
                .envelope-wrapper.is-open .card-thumb.popped {
                    opacity: 1;
                    /* Stagger vertical pop-up */
                    transform: translateY(calc(-60px - (var(--index) * 40px))) scale(calc(1 - (var(--index) * 0.05)));
                    z-index: calc(5 - var(--index)); /* Top card is visually front */
                    cursor: pointer;
                }
                
                .envelope-wrapper.is-open .card-thumb.popped:hover {
                    transform: translateY(calc(-70px - (var(--index) * 40px))) scale(1.02);
                }

                /* Active Selection State */
                /* When active, the card visually disappears from stack (optional) or stays highlighted */
                .card-thumb.active {
                    background: #f0fdf4;
                    border-color: #22c55e;
                }

                /* RIGHT SIDE DISPLAY */
                .active-card-view {
                    width: 100%;
                    max-width: 500px;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    border: 1px solid #fce7f3;
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .card-header {
                    padding: 1.5rem;
                    color: white;
                    display: flex; justify-content: space-between; align-items: center;
                    font-weight: bold; letter-spacing: 1px;
                }
                .card-body {
                    padding: 2rem;
                }
                .card-body h3 {
                    font-size: 2rem; fontFamily: 'Oswald'; margin-bottom: 0.5rem; line-height: 1;
                }
                .badge {
                    display: inline-block; padding: 0.2rem 1rem; border: 1px solid; border-radius: 50px; font-size: 0.8rem; font-weight: bold; margin-bottom: 1.5rem;
                }
                .card-body p {
                    font-size: 1.1rem; color: #475569; line-height: 1.6; margin-bottom: 2rem;
                }
                .checklist { display: flex; gap: 1rem; font-size: 0.8rem; font-weight: 600; color: #64748b; }
                .checklist div { display: flex; align-items: center; gap: 5px; }

                .empty-state {
                    text-align: center; color: #94a3b8;
                    border: 2px dashed #e2e8f0;
                    padding: 3rem;
                    border-radius: 20px;
                    width: 100%;
                }
                .placeholder-icon {
                    font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #cbd5e1;
                }

                .tap-cue {
                    position: absolute; bottom: -40px; width: 100%; text-align: center;
                    font-size: 0.8rem; font-weight: bold; letter-spacing: 2px; color: #be185d;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; transform: scale(0.95); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0.6; transform: scale(0.95); }
                }

            `}</style>
        </section>
    );
}
