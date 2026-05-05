'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        // HARDENING: Disable on:
        // 1. Touch devices (pointer: coarse)
        // 2. Users who prefer reduced motion
        // 3. Small screens (often mobile even if they have a mouse connected)
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isSmallScreen = window.innerWidth < 1024;

        if (isTouch || prefersReducedMotion || isSmallScreen) {
            return; // Do not initialize custom cursor
        }

        const moveCursor = (e) => {
            requestAnimationFrame(() => {
                if (cursor) cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                if (dot) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            });
        };

        const addHover = () => cursor?.classList.add('hovered');
        const removeHover = () => cursor?.classList.remove('hovered');

        window.addEventListener('mousemove', moveCursor);

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, .interactive-card, .course-item, .poster-card, [data-hover="true"]');
            if (target) addHover();
            else removeHover();
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="cursor"></div>
            <div ref={dotRef} className="cursor-dot"></div>
        </>
    );
}
