'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CivilHeroAnim() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for camera orbit
    const springConfig = { damping: 40, stiffness: 200 };
    const rotateX = useSpring(useTransform(mouseY, [-500, 500], [20, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-1000, 1000], [-35, 35]), springConfig);

    // Construction Progress: 0 = Wireframe Foundation, 1 = Completed Luxury Tower
    const progress = useTransform(mouseX, [-600, 600], [0, 1]);

    // Transforms for different stages of construction based on mouse position
    const wireframeOpacity = useTransform(progress, [0, 0.45], [1, 0]);
    const solidOpacity = useTransform(progress, [0.35, 1], [0, 1]);
    const lightIntensity = useTransform(progress, [0.6, 1], [0, 1]);
    const craneY = useTransform(progress, [0, 0.8], [200, -300]); // Crane moves up as building grows

    useEffect(() => {
        const handleMove = (e) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [mouseX, mouseY]);

    return (
        <div style={{
            width: '100%',
            height: '900px', // Grand height for huge impact
            background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            perspective: '2000px',
            position: 'relative',
            cursor: 'ew-resize',
            fontFamily: 'Oswald, sans-serif'
        }}>

            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                <div style={{ position: 'absolute', width: '100%', height: '1px', top: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ position: 'absolute', width: '1px', height: '100%', left: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            {/* Title / HUD */}
            <div style={{ position: 'absolute', top: '5%', left: '5%', color: '#94a3b8', zIndex: 10 }}>
                <h2 style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>The <span style={{ color: '#E91E63' }}>Pinnacle</span></h2>
                <div style={{ fontSize: '0.9rem', letterSpacing: '4px' }}>RESIDENTIAL TOWER // 100 CR PROJECT</div>
            </div>

            {/* Instruction */}
            <motion.div style={{ position: 'absolute', bottom: '10%', opacity: 0.5, color: '#fff', fontSize: '0.8rem', letterSpacing: '2px' }}
                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 3 }}>
                DRAG CURSOR TO CONSTRUCT REALITY
            </motion.div>


            {/* 3D SCENE ROTATOR */}
            <motion.div
                style={{
                    position: 'relative',
                    width: 0, height: 0,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* --- THE MEGATOWER --- */}
                {/* We build it in tiered sections for a 'Skyscraper' look */}

                {/* Podium / Base (Lobby Level) */}
                <Block
                    y={350} width={300} depth={300} height={80}
                    color="#0f172a"
                    texture="lobby"
                    wireframeOpacity={wireframeOpacity} solidOpacity={solidOpacity}
                    delay={0}
                />

                {/* Section 1 (Floors 1-10) */}
                <Block
                    y={200} width={240} depth={240} height={220}
                    color="#1e293b"
                    texture="apartments"
                    wireframeOpacity={wireframeOpacity} solidOpacity={solidOpacity}
                    delay={0.1}
                />

                {/* Section 2 (Floors 11-20) */}
                <Block
                    y={0} width={200} depth={200} height={180}
                    color="#1e293b"
                    texture="apartments"
                    wireframeOpacity={wireframeOpacity} solidOpacity={solidOpacity}
                    delay={0.2}
                />

                {/* Section 3 (Floors 21-30) */}
                <Block
                    y={-150} width={160} depth={160} height={120}
                    color="#1e293b"
                    texture="glass"
                    wireframeOpacity={wireframeOpacity} solidOpacity={solidOpacity}
                    delay={0.3}
                />

                {/* Spire / Crown */}
                <Block
                    y={-240} width={100} depth={100} height={60}
                    color="linear-gradient(135deg, #E91E63 0%, #881337 100%)"
                    texture="none"
                    isCrown
                    wireframeOpacity={wireframeOpacity} solidOpacity={solidOpacity}
                    delay={0.4}
                />

                {/* Animated Crane Moving Up */}
                <motion.div style={{ position: 'absolute', x: 180, z: 0, y: craneY, transformStyle: 'preserve-3d' }}>
                    <Crane rotation={-45} />
                </motion.div>


                {/* Environment Reflections (Fake Floor Reflection) */}
                <motion.div
                    style={{
                        position: 'absolute', transform: 'rotateX(90deg) translateZ(400px)',
                        width: '600px', height: '600px', marginLeft: -300, marginTop: -300,
                        background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, transparent 60%)',
                        opacity: solidOpacity
                    }}
                />

            </motion.div>
        </div>
    );
}

// ----------------------------------------------------------------------
// SUB COMPONENTS
// ----------------------------------------------------------------------

function Block({ width, height, depth, y, color, texture, wireframeOpacity, solidOpacity, delay, isCrown }) {
    // Dynamic styles based on texture type
    const isGlass = texture === 'glass';
    const isLobby = texture === 'lobby';

    // CSS Gradients for "Rich" Look
    const glassGradient = 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(51, 65, 85, 0.9) 100%)';
    const lobbyGradient = 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)';
    const crownGradient = color; // Pass-through for crown

    const bg = isCrown ? crownGradient : (isLobby ? lobbyGradient : glassGradient);

    const border = isCrown ? 'none' : '1px solid rgba(148, 163, 184, 0.1)';
    const boxShadow = isCrown ? '0 0 50px rgba(233, 30, 99, 0.4)' : 'inset 0 0 30px rgba(0,0,0,0.5)';

    return (
        <motion.div
            style={{ position: 'absolute', transformStyle: 'preserve-3d', y }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay, duration: 1, ease: 'backOut' }}
        >
            {/* SOLID LUXURY FACADE */}
            <Group width={width} height={height} depth={depth} opacity={solidOpacity}>
                <Face type="front" width={width} height={height} tz={depth / 2} bg={bg} border={border} boxShadow={boxShadow} texture={texture} />
                <Face type="back" width={width} height={height} tz={-depth / 2} rotateY={180} bg={bg} border={border} boxShadow={boxShadow} texture={texture} />
                <Face type="left" width={depth} height={height} tz={width / 2} rotateY={-90} bg={bg} border={border} boxShadow={boxShadow} texture={texture} />
                <Face type="right" width={depth} height={height} tz={width / 2} rotateY={90} bg={bg} border={border} boxShadow={boxShadow} texture={texture} />
                <Face type="top" width={width} height={depth} tz={height / 2} rotateX={90} bg={isCrown ? '#E91E63' : '#0f172a'} border={border} />
            </Group>

            {/* WIREFRAME BLUEPRINT */}
            <Group width={width} height={height} depth={depth} opacity={wireframeOpacity}>
                <WireFrameFace width={width} height={height} tz={depth / 2} />
                <WireFrameFace width={width} height={height} tz={-depth / 2} rotateY={180} />
                <WireFrameFace width={depth} height={height} tz={width / 2} rotateY={-90} />
                <WireFrameFace width={depth} height={height} tz={width / 2} rotateY={90} />
            </Group>
        </motion.div>
    )
}

function Group({ children, opacity, ...props }) {
    return <motion.div style={{ position: 'absolute', transformStyle: 'preserve-3d', opacity }} {...props}>{children}</motion.div>
}

function Face({ type, width, height, tz, rotateY = 0, rotateX = 0, bg, border, boxShadow, texture }) {
    return (
        <div style={{
            position: 'absolute',
            width, height,
            background: bg,
            border: border,
            boxShadow: boxShadow,
            top: '50%', left: '50%',
            marginLeft: -width / 2, marginTop: -height / 2,
            transform: `translateZ(${tz}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            backfaceVisibility: 'hidden',
            overflow: 'hidden'
        }}>
            {/* Window Grid Pattern for "Apartment" Texture */}
            {texture === 'apartments' && (
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 40px' // Window Aspect Ratio
                }}>
                    {/* Random lit windows effect simulation via gradient overlay? Hard in pure CSS without many divs. 
                        We keep it sleek/minimal dark glass. */}
                    <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(255,255,255,0.1)', opacity: 0.5 }}></div>
                </div>
            )}
            {/* Lobby Entrance Detail */}
            {texture === 'lobby' && type === 'front' && (
                <div style={{ position: 'absolute', bottom: 0, left: '20%', width: '60%', height: '40%', background: 'rgba(255,255,255,0.1)', borderTop: '2px solid #E91E63' }}></div>
            )}
        </div>
    )
}

function WireFrameFace({ width, height, tz, rotateY = 0, rotateX = 0 }) {
    return (
        <div style={{
            position: 'absolute', width, height,
            border: '1px solid rgba(56, 189, 248, 0.4)', // Light Blue Cyan
            background: 'rgba(56, 189, 248, 0.05)',
            boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.1)',
            top: '50%', left: '50%',
            marginLeft: -width / 2, marginTop: -height / 2,
            transform: `translateZ(${tz}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            backfaceVisibility: 'hidden'
        }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(56, 189, 248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
    )
}

function Crane({ rotation }) {
    return (
        <motion.div
            style={{ position: 'absolute', width: 20, height: 400, background: '#f59e0b', transformStyle: 'preserve-3d', rotateY: rotation }}
        >
            {/* Mast */}
            <div style={{ width: 10, height: '100%', border: '1px solid black', margin: '0 auto' }}></div>
            {/* Jib */}
            <div style={{ position: 'absolute', top: 0, left: -50, width: 200, height: 10, background: '#fbbf24' }}></div>
        </motion.div>
    )
}
