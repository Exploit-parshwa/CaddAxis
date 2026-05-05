'use client';
import { useState } from 'react';
import { IndianRupee, CheckCircle, Smartphone, CreditCard, Wallet, Clock } from 'lucide-react';
import { submitRechargeRequest } from '@/app/actions';
import { QRCodeSVG } from 'qrcode.react';

export default function RechargePage() {
    const [step, setStep] = useState(1); // 1=Select, 2=Scan, 3=SubmitDetails, 4=Success
    const [amount, setAmount] = useState(1000);
    const [transactionRef, setTransactionRef] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock Business UPI ID - In real app, this comes from ENV
    const upiId = "caddaxis.business@okhdfcbank";

    const handleSelectAmount = (amt) => {
        setAmount(amt);
        setStep(2);
    };

    const handleStartSubmission = () => {
        setStep(3);
    };

    const handleSubmitProof = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await submitRechargeRequest({
                amount: amount,
                paymentMethod: 'UPI',
                transactionRef: transactionRef
                // proofUrl: ... if we added file upload logic, but text ref works for now
            });

            if (res.success) {
                setStep(4);
            } else {
                alert("Submission Failed: " + res.error);
            }
        } catch (e) {
            alert("Network Error");
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    WALLET RECHARGE <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Add funds securely via UPI. Admin approval required for safety.</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <div style={{ color: step >= 1 ? 'var(--primary)' : 'inherit', fontWeight: step >= 1 ? 'bold' : 'normal' }}>1. Plan</div>
                    <div style={{ width: '30px', height: '1px', background: '#cbd5e1', margin: '0 1rem' }}></div>
                    <div style={{ color: step >= 2 ? 'var(--primary)' : 'inherit', fontWeight: step >= 2 ? 'bold' : 'normal' }}>2. Scan</div>
                    <div style={{ width: '30px', height: '1px', background: '#cbd5e1', margin: '0 1rem' }}></div>
                    <div style={{ color: step >= 3 ? 'var(--primary)' : 'inherit', fontWeight: step >= 3 ? 'bold' : 'normal' }}>3. Verify</div>
                    <div style={{ width: '30px', height: '1px', background: '#cbd5e1', margin: '0 1rem' }}></div>
                    <div style={{ color: step >= 4 ? 'var(--primary)' : 'inherit', fontWeight: step >= 4 ? 'bold' : 'normal' }}>4. Status</div>
                </div>

                {step === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
                        {[
                            { amt: 1000, label: 'Starter', certs: '~10 Certs' },
                            { amt: 5000, label: 'Growth', certs: '~50 Certs' },
                            { amt: 10000, label: 'Enterprise', certs: '~100 Certs' }
                        ].map((plan) => (
                            <button
                                key={plan.amt}
                                onClick={() => handleSelectAmount(plan.amt)}
                                className="card"
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.2s',
                                    background: 'white'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <h3 style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '500' }}>{plan.label}</h3>
                                <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', color: '#1e293b', margin: '1rem 0' }}>₹{plan.amt.toLocaleString()}</div>
                                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>{plan.certs}</div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Scan QR to Pay <span style={{ color: 'var(--primary)', fontFamily: 'Oswald' }}>₹{amount}</span></h2>

                        <div style={{ background: 'white', padding: '1.5rem', display: 'inline-block', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                            <QRCodeSVG value={`upi://pay?pa=${upiId}&pn=CaddAxis&am=${amount}&cu=INR`} size={200} />
                        </div>

                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Business UPI: <strong style={{ color: '#334155' }}>{upiId}</strong>
                        </p>

                        <button
                            onClick={handleStartSubmission}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            I Have Made The Payment
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Back
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Verify Payment</h2>
                        <form onSubmit={handleSubmitProof}>
                            <div className="form-group">
                                <label className="form-label">Amount Paid</label>
                                <input className="form-input" value={`₹ ${amount}`} disabled style={{ background: '#f1f5f9' }} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Transaction ID / UTR Number *</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. 430129012832"
                                    required
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                />
                                <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                                    Found in your GPay/PhonePe/Bank history for this transaction. This is required for admin approval.
                                </small>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    background: loading ? '#94a3b8' : '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'wait' : 'pointer',
                                    width: '100%',
                                    marginTop: '1rem'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                style={{ marginTop: '1rem', width: '100%', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                            >
                                Back
                            </button>
                        </form>
                    </div>
                )}

                {step === 4 && (
                    <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{ width: '80px', height: '80px', background: '#fff7ed', color: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Clock size={40} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontFamily: 'Oswald', color: '#1e293b', marginBottom: '1rem' }}>REQUEST SUBMITTED</h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                            Your recharge request for <strong style={{ color: '#1e293b' }}>₹{amount}</strong> is under review.
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1rem' }}>
                            Reference: {transactionRef}<br />
                            Balance will be updated once Admin verifies the UTR.
                        </p>

                        <div style={{ marginTop: '3rem' }}>
                            <button
                                onClick={() => window.location.href = '/admin/dashboard'}
                                style={{ padding: '0.8rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
