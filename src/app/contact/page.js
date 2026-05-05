'use client';
import { useState } from 'react';
import { submitContactMessage } from '@/app/actions';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';

export default function Contact() {
    return (
        <>
            <CustomCursor />
            <Navbar />

            <main className="contact-main" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: '100vh', paddingTop: 'var(--header-height)' }}>
                {/* 
                    Note: gridTemplateColumns using minmax to prevent overflow issues on some browsers.
                    Added paddingTop to account for fixed header overlay 
                 */}

                {/* LEFT: INFO & FORM */}
                <div style={{ padding: '4rem 4vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, letterSpacing: '2px' }}>GET IN TOUCH</span>
                    <h1 className="display-text" style={{ fontSize: '4vw', marginBottom: '2rem' }}>LET'S START <br />A CONVERSATION</h1>

                    <div style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>VISIT US</h3>
                            <p style={{ color: '#666' }}>
                                Plot No. 45, Industrial Estate,<br />
                                Ichalkaranji, Maharashtra,<br />
                                India - 416115
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>CONTACT</h3>
                            <p style={{ color: '#666' }}>
                                hello@caddaxis.com<br />
                                +91 95477 14747
                            </p>
                        </div>
                    </div>

                    <ContactForm />
                </div>

                {/* RIGHT: IMAGE/MAP */}
                <div style={{ background: 'black', position: 'relative', height: '100%', minHeight: '500px' }}>
                    <img src="/assets/images/contact_office.jpg" alt="Office" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />

                    <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', color: 'white' }}>
                        <h2 style={{ fontSize: '3rem' }}>OPENING HOURS</h2>
                        <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                </div>

            </main>

            <Footer />
        </>
    );
}

function ContactForm() {
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'submitting' || status === 'success') return;

        setStatus('submitting');
        setMsg('');

        const formData = new FormData(e.target);

        try {
            const res = await submitContactMessage(formData);
            if (res.success) {
                setStatus('success');
                setMsg('Message received! We will contact you shortly.');
                e.target.reset(); // Clear form
            } else {
                setStatus('error');
                setMsg('Could not send message. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setMsg('Network error. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ borderBottom: '1px solid #ddd' }}>
                <input name="name" type="text" placeholder="YOUR NAME" required style={{ width: '100%', padding: '1rem 0', border: 'none', fontFamily: 'Oswald', fontSize: '1.5rem', outline: 'none', background: 'transparent' }} disabled={status === 'submitting'} />
            </div>
            <div style={{ borderBottom: '1px solid #ddd' }}>
                <input name="email" type="email" placeholder="YOUR EMAIL" required style={{ width: '100%', padding: '1rem 0', border: 'none', fontFamily: 'Oswald', fontSize: '1.5rem', outline: 'none', background: 'transparent' }} disabled={status === 'submitting'} />
            </div>
            <div style={{ borderBottom: '1px solid #ddd' }}>
                <input name="phone" type="text" placeholder="PHONE NUMBER" style={{ width: '100%', padding: '1rem 0', border: 'none', fontFamily: 'Oswald', fontSize: '1.5rem', outline: 'none', background: 'transparent' }} disabled={status === 'submitting'} />
            </div>
            <div style={{ borderBottom: '1px solid #ddd' }}>
                <textarea name="message" placeholder="YOUR MESSAGE" required rows={3} style={{ width: '100%', padding: '1rem 0', border: 'none', fontFamily: 'inter', fontSize: '1rem', outline: 'none', background: 'transparent', resize: 'none' }} disabled={status === 'submitting'} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    type="submit"
                    className="btn-main"
                    style={{
                        width: 'fit-content',
                        opacity: status === 'submitting' ? 0.7 : 1,
                        cursor: status === 'submitting' || status === 'success' ? 'not-allowed' : 'pointer'
                    }}
                    disabled={status === 'submitting' || status === 'success'}
                    data-hover={status !== 'submitting' && status !== 'success'}
                >
                    {status === 'submitting' ? 'SENDING...' : (status === 'success' ? 'MESSAGE SENT' : 'SEND MESSAGE')}
                </button>

                {status === 'success' && <span style={{ color: 'green', fontWeight: 'bold' }}>✓ {msg}</span>}
                {status === 'error' && <span style={{ color: 'red', fontWeight: 'bold' }}>✕ {msg}</span>}
            </div>
        </form>
    );
}
