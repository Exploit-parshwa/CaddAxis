'use client';
import { useState } from 'react';

export default function EditWebsitePage() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    WEBSITE CONTENT <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Customize the public-facing pages.</p>
            </div>

            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50px', display: 'inline-flex', gap: '0.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                {['Home Page', 'About Us', 'Contact Info', 'Footer'].map(tab => {
                    const tabKey = tab.toLowerCase().replace(' ', '-');
                    const isActive = activeTab === tabKey;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                color: isActive ? 'white' : '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="card" style={{ padding: '2.5rem', maxWidth: '800px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Changes saved!'); }} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label className="form-label">Hero Title</label>
                        <input type="text" defaultValue="Engineering Excellence Starts Here" className="form-input" style={{ fontSize: '1.1rem' }} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hero Subtitle</label>
                        <textarea rows={3} defaultValue="Master industry-standard CAD, CAM, and CAE software with expert guidance." className="form-input" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hero Image URL</label>
                        <input type="text" placeholder="https://..." defaultValue="" className="form-input" />
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Paste a direct image link here.</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Announcement Bar</label>
                        <input type="text" defaultValue="Admissions open for 2025 batches." className="form-input" />
                    </div>

                    <button className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', justifySelf: 'start', marginTop: '1rem' }}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}
