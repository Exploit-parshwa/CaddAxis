'use client';
import { useEffect, useRef } from 'react';

export default function Silk() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationId;

        // Configuration
        const color = '#FF007F'; // Hot Pink
        const spark = false;
        const speed = 0.5;

        // State
        let lines = [];
        const gap = 15; // Gap between lines
        let t = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initLines();
        };

        const initLines = () => {
            lines = [];
            // Create vertical lines that will ripple
            for (let x = 0; x <= width; x += gap) {
                lines.push({
                    x: x,
                    y: 0,
                    targetX: x,
                    velocity: 0,
                    k: 0.05 + Math.random() * 0.05 // Spring constant
                });
            }
        };

        const draw = () => {
            // Clear with slight fade for trail effect if desired, but for clean silk: full clear
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15; // Low opacity for layering

            // We will draw multiple "layers" of silk logic
            // Layer 1: Horizontal Waves
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                for (let x = 0; x < width; x += 10) {
                    // Perlin-ish noise using sin/cos
                    const yOffset = height / 2
                        + Math.sin((x * 0.005) + (t * speed) + i) * 100
                        + Math.cos((x * 0.01) - (t * 0.8) + i * 2) * 50;

                    if (x === 0) ctx.moveTo(x, yOffset);
                    else ctx.lineTo(x, yOffset);
                }
                ctx.stroke();
            }

            // Layer 2: "CAD" style vertical flow
            // Actually, let's do a classic "Silk" generative art effect
            // Rotating symmetry lines

            // Re-implementing a smooth generative silk smoke effect
            // Logic: Particles moving in noise field
        };

        // NEW IMPLEMENTATION: Generative Silk Ribbon
        // A collection of points moving in a noise field leaving trails

        let paths = [];
        const pathCount = 30; // Number of strands

        const initPaths = () => {
            paths = [];
            for (let i = 0; i < pathCount; i++) {
                paths.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: 0,
                    history: []
                });
            }
        };

        const drawSilk = () => {
            // Fade out
            // ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            // ctx.fillRect(0,0, width, height);
            ctx.clearRect(0, 0, width, height);

            t += 0.005;

            ctx.strokeStyle = '#FF007F';
            ctx.lineWidth = 0.5; // Very fine lines
            ctx.globalAlpha = 0.4;

            // Draw noise curves
            // We draw a large set of curves that morph slowly

            for (let i = 0; i < pathCount; i++) {
                let p = paths[i];

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);

                // Draw a long seamless curve based on time
                for (let j = 0; j < width; j += 10) {
                    const x = j;
                    // Complex wave function
                    const y = (height / 2)
                        + Math.sin(x * 0.002 + t + i * 0.1) * 150
                        + Math.cos(x * 0.005 - t * 0.5 + i * 0.2) * 100
                        + Math.sin(x * 0.01 + t * 2) * 20;

                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        resize();
        initPaths();

        const loop = () => {
            drawSilk();
            animationId = requestAnimationFrame(loop);
        };
        loop();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.6
            }}
        />
    );
}
