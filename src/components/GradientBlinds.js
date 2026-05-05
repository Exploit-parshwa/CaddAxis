'use client';
import { useRef, useEffect, useState } from 'react';

export default function GradientBlinds({
    gradientColors = ['#FF007F', '#000000', '#FF007F'], // Our Brand Colors
    blindCount = 12,
    noise = 0.3
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Setup sizing
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        let t = 0;
        let animationId;

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;

            // Clear
            ctx.fillStyle = '#111'; // Dark backdrop for contrast
            ctx.fillRect(0, 0, w, h);

            const blindWidth = w / blindCount;

            for (let i = 0; i < blindCount; i++) {
                const x = i * blindWidth;

                // Create gradient for each blind
                const g = ctx.createLinearGradient(x, 0, x + blindWidth, h);
                // Animate colors
                const offset = Math.sin(t * 0.002 + i * 0.2) * 0.5 + 0.5;

                // Dynamic mixing of brand colors
                g.addColorStop(0, gradientColors[0]);
                g.addColorStop(offset, gradientColors[1]); // Black/Dark in middle
                g.addColorStop(1, gradientColors[2]);

                ctx.fillStyle = g;
                ctx.fillRect(x, 0, blindWidth, h);

                // Add Noise/Grain
                if (noise > 0) {
                    // Simple noise overlay optimization
                    // (Canvas noise is heavy, usually done via image overlay, but here is a lightweight approx)
                    ctx.fillStyle = `rgba(0,0,0,${noise * 0.2})`;
                    if (Math.random() > 0.5) ctx.fillRect(x, Math.random() * h, blindWidth, 2);
                }
            }

            t += 1;
            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [gradientColors, blindCount, noise]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
    );
}
