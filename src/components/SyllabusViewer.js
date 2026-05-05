'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, FileText, Download, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SyllabusViewer({ content }) {
    const [isLocked, setIsLocked] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        // Check authentication status
        const student = localStorage.getItem('student');
        if (student) {
            setIsLocked(false);
        }
    }, []);

    if (!content) return <p className="text-gray-500 italic">Detailed syllabus available upon request.</p>;

    // Handle Legacy PDF Mode
    if (content.trim().startsWith('PDF_URL:')) {
        const url = content.trim().replace('PDF_URL:', '').trim();

        // Locked State for PDF
        if (isLocked) {
            return (
                <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ background: '#e2e8f0', padding: '1rem', borderRadius: '50%' }}>
                        <Lock size={32} color="#64748b" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Syllabus Locked</h3>
                        <p style={{ color: '#64748b' }}>Login or Sign up to view this content.</p>
                    </div>
                    <Link href="/student/auth" style={{
                        background: '#e91e63', color: 'white', padding: '0.8rem 2rem', borderRadius: '50px',
                        textDecoration: 'none', fontWeight: '600', marginTop: '0.5rem'
                    }}>
                        Unlock Syllabus
                    </Link>
                </div>
            );
        }

        // Unlocked State for PDF (Still show download/view option if user logged in)
        return (
            <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <FileText size={48} color="#e91e63" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Detailed Syllabus PDF</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Full curriculum is available.</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#e91e63',
                        color: 'white',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Download size={18} /> Download Syllabus
                </a>
            </div>
        );
    }

    // Parse Text into Sections
    const sections = parseSyllabus(content);

    // SSR Fallback (prevent mismatch)
    if (!hydrated) return null;

    if (isLocked) {
        // Show Preview: First module, max 3 items, then blur
        const previewSection = sections[0];
        // Ensure we have at least one section
        if (!previewSection) return null;

        const previewItems = previewSection.items.slice(0, 3);

        return (
            <div className="syllabus-container" style={{ position: 'relative' }}>
                {/* Render First Item as Preview (Force Open) */}
                <AccordionItem
                    title={previewSection.title}
                    items={previewItems}
                    defaultOpen={true}
                    locked={true}
                />

                {/* Lock Overlay / Blur Effect */}
                <div style={{
                    marginTop: '-60px', // Pull up to cover bottom of preview
                    position: 'relative',
                    zIndex: 10,
                    padding: '4rem 2rem 2rem',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0), white 40%, white)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    borderRadius: '0 0 12px 12px'
                }}>
                    <div style={{ background: '#fff1f2', padding: '0.8rem', borderRadius: '50%' }}>
                        <Lock size={24} color="#e91e63" />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        Unlock Full Syllabus
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '350px', lineHeight: 1.5 }}>
                        Create a free student account to access the complete curriculum, project details, and course materials.
                    </p>
                    <Link href="/student/auth" style={{
                        background: '#e91e63',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '1rem',
                        letterSpacing: '1px',
                        boxShadow: '0 10px 25px rgba(233, 30, 99, 0.3)',
                        transition: 'transform 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        LOGIN / SIGNUP
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="syllabus-container">
            {sections.map((section, index) => (
                <AccordionItem key={index} title={section.title} items={section.items} defaultOpen={index === 0} />
            ))}
        </div>
    );
}

function AccordionItem({ title, items, defaultOpen, locked }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{
            marginBottom: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white',
            opacity: locked ? 0.9 : 1
        }}>
            <button
                onClick={() => !locked && setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.2rem 1.5rem',
                    background: isOpen ? '#fff1f2' : 'white',
                    border: 'none',
                    cursor: locked ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.3s'
                }}
            >
                <div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: isOpen ? '#e91e63' : '#334155'
                    }}>
                        {title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {locked ? 'Free Preview' : `${items.length} Topics`}
                    </span>
                </div>
                {!locked && (isOpen ? <ChevronUp color="#e91e63" /> : <ChevronDown color="#94a3b8" />)}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {items.map((item, i) => (
                                    <li key={i} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        alignItems: 'flex-start',
                                        fontSize: '0.95rem',
                                        color: '#475569',
                                        lineHeight: 1.6
                                    }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                                        {item}
                                    </li>
                                ))}
                                {locked && (
                                    <li style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '1rem' }}>
                                        + {items.length > 3 ? `${items.length} more items...` : 'More items...'}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper to parse unstructured text into Modules
function parseSyllabus(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections = [];
    let currentSection = { title: 'Core Modules', items: [] };

    lines.forEach(line => {
        const trimmed = line.trim();
        // Detect Headers: Starts with "Module", "Week", "Section", "#", or ends with ":"
        if (
            trimmed.match(/^(Module|Week|Section|Unit|Chapter|Part)\s+\d+/i) ||
            trimmed.startsWith('#') ||
            (trimmed.length < 50 && trimmed.endsWith(':'))
        ) {
            // Push old section if it has items
            if (currentSection.items.length > 0) {
                sections.push(currentSection);
            }
            // Start new section
            currentSection = {
                title: trimmed.replace(/^#\s*/, '').replace(/:$/, ''),
                items: []
            };
        }
        // Detect Bullets
        else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
            currentSection.items.push(trimmed.replace(/^[-•\d+.]\s*/, ''));
        }
        // Fallback: If just text, assume it's a topic
        else {
            currentSection.items.push(trimmed);
        }
    });

    if (currentSection.items.length > 0) {
        sections.push(currentSection);
    }

    // Fallback if parsing failed to find ANY headers
    if (sections.length === 0 && lines.length > 0) {
        return [{ title: 'Course Syllabus', items: lines }];
    }

    return sections;
}
