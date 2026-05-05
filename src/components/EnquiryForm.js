'use client';
import { useState } from 'react';
import { submitEnquiry } from '@/app/actions';

export default function EnquiryForm({ courseTitle }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.target);
        formData.append('course', courseTitle);

        const res = await submitEnquiry(formData);
        setLoading(false);

        if (res.success) {
            setStatus('success');

            // Construct WhatsApp Message for Admin Notification
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const text = `🔔 *New Demo Request*\n\nClass: *${courseTitle}*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nPlease confirm availability.`;

            const waUrl = `https://wa.me/919547714747?text=${encodeURIComponent(text)}`;

            // Open WhatsApp immediately
            window.open(waUrl, '_blank');

            e.target.reset();
            setShowForm(false); // Hide form after successful submission
        } else {
            alert(res.error || "Submission failed");
        }
    };

    if (status === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#166534', fontWeight: 'bold' }}>Request Sent!</h3>
                <p style={{ color: '#15803d', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    We have received your enquiry. We also opened WhatsApp for you to send a quick confirmation message to our team.
                </p>
                <a
                    href={`https://wa.me/919547714747?text=${encodeURIComponent(`🔔 *New Demo Request*\n\nClass: *${courseTitle}*`)}`}
                    target="_blank"
                    className="btn"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: '#25D366', color: 'white', padding: '0.6rem 1rem',
                        borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem'
                    }}
                >
                    Open WhatsApp Again
                </a>
                <br />
                <button onClick={() => { setStatus(null); setShowForm(false); }} style={{ marginTop: '1.5rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: '0.85rem' }}>
                    Book another demo
                </button>
            </div>
        );
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
                style={{
                    width: '100%', textAlign: 'center', justifyContent: 'center', padding: '1rem',
                    borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
            >
                Book Free Demo Class
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.8rem', animation: 'fadeIn 0.3s ease-in-out' }}>
            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem', display: 'block' }}>Full Name *</label>
                <input required name="name" className="form-input" placeholder="e.g. John Doe" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
            </div>
            <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem', display: 'block' }}>Email Address *</label>
                <input required name="email" type="email" className="form-input" placeholder="e.g. john@example.com" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
            </div>
            <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem', display: 'block' }}>Phone Number *</label>
                <input required name="phone" type="tel" className="form-input" placeholder="e.g. 9876543210" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
            </div>

            <button type="submit" disabled={loading} className="btn" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', opacity: loading ? 0.7 : 1, fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {loading ? 'Booking...' : (
                    <>
                        <span>Confirm Booking</span>
                    </>
                )}
            </button>
        </form>
    );
}
