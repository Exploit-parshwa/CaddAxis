'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, IndianRupee, X, Eye, Edit, Save, Plus } from 'lucide-react';
import { getStudents, getPaymentsByStudent, createPayment } from '@/app/actions';

export default function PaymentsPage() {
    const [viewHistory, setViewHistory] = useState(null);
    const [editPayment, setEditPayment] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [students, setStudents] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const studentsData = await getStudents();
        setStudents(studentsData);
    };

    const handleViewHistory = async (student) => {
        const history = await getPaymentsByStudent(student.id);
        setPaymentHistory({ ...paymentHistory, [student.id]: history });
        setViewHistory({ ...student, history });
    };

    const handleEditPayment = (student) => {
        setEditFormData({
            ...student,
            newPaymentAmount: '',
            newPaymentMethod: 'Cash',
            newPaymentDate: new Date().toISOString().split('T')[0],
            newPaymentNotes: ''
        });
        setEditPayment(student.id);
    };

    const handleSavePayment = async () => {
        const amount = Number(editFormData.newPaymentAmount);
        if (!amount || amount <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        if (amount > editFormData.fee_total - editFormData.fee_paid) {
            const confirm = window.confirm(`Amount exceeds remaining balance. Continue anyway?`);
            if (!confirm) return;
        }

        setLoading(true);
        const result = await createPayment({
            student_id: editPayment,
            amount: amount,
            payment_method: editFormData.newPaymentMethod,
            payment_date: editFormData.newPaymentDate,
            notes: editFormData.newPaymentNotes
        });

        if (result.success) {
            const newPaid = editFormData.fee_paid + amount;
            const newRemaining = editFormData.fee_total - newPaid;

            // Create WhatsApp message
            const whatsappMessage = `✅ *Payment Confirmation - CaddAxis Institute*

Dear ${editFormData.name},

Your payment has been successfully recorded!

*Payment Details:*
💰 Amount Paid: ₹${amount.toLocaleString()}
📝 Payment Method: ${editFormData.newPaymentMethod}
📅 Date: ${new Date(editFormData.newPaymentDate).toLocaleDateString()}
🧾 Receipt: ${result.receipt_number}

*Fee Summary:*
Total Fee: ₹${editFormData.fee_total.toLocaleString()}
Total Paid: ₹${newPaid.toLocaleString()}
${newRemaining > 0 ? `Remaining Balance: ₹${newRemaining.toLocaleString()}` : '✅ Fee Fully Paid!'}

${newRemaining > 0 ? 'Please complete the remaining payment at your earliest convenience.' : 'Thank you for completing your payment! You are now fully enrolled.'}

For any queries, contact us at +91 95477 14747

Thank you!
- CaddAxis Team`;

            const whatsappUrl = `https://wa.me/${editFormData.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

            alert(`Payment recorded successfully! Receipt: ${result.receipt_number}\n\nThis payment has been saved to the database and will reflect in revenue reports.`);

            // Ask if they want to send WhatsApp notification
            const sendWhatsApp = window.confirm('Would you like to send a payment confirmation via WhatsApp to the student?');
            if (sendWhatsApp && editFormData.phone) {
                window.open(whatsappUrl, '_blank');
            }

            setEditPayment(null);
            loadData(); // Reload to show updated balances
        } else {
            alert('Error recording payment: ' + result.error);
        }
        setLoading(false);
    };

    const totalPending = students.reduce((sum, s) => sum + (s.fee_total - s.fee_paid), 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#1a1a1a' }}>
                    FEE <span style={{ color: 'var(--primary)' }}>MANAGEMENT.</span>
                </h1>
                <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600', color: '#be123c', border: '1px solid #ffe4e6', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 10px rgba(255, 0, 0, 0.05)' }}>
                    Total Pending: <span style={{ fontSize: '1.1rem' }}>₹ {totalPending.toLocaleString()}</span>
                </div>
            </div>

            {/* Edit Payment Modal */}
            {editPayment && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '600px', padding: '2rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Record Payment</h2>
                            <button onClick={() => setEditPayment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{editFormData.name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{editFormData.course}</p>
                                </div>
                                {!editFormData.phone && (
                                    <div style={{ padding: '0.25rem 0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', fontSize: '0.75rem', color: '#1e40af' }}>
                                        No Phone
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem', }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Fee</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155' }}>₹ {editFormData.fee_total?.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'green' }}>₹ {editFormData.fee_paid?.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e11d48' }}>₹ {(editFormData.fee_total - editFormData.fee_paid)?.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400e', display: 'flex', gap: '0.5rem' }}>
                            <span>⚠️</span> This payment will be permanently recorded and can be viewed in history.
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Payment Amount (₹) *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editFormData.newPaymentAmount || ''}
                                    onChange={e => setEditFormData({ ...editFormData, newPaymentAmount: e.target.value })}
                                    placeholder="Enter amount"
                                    required
                                    style={{ fontSize: '1.1rem', fontWeight: '600' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Method *</label>
                                <select
                                    className="form-select"
                                    value={editFormData.newPaymentMethod || 'Cash'}
                                    onChange={e => setEditFormData({ ...editFormData, newPaymentMethod: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card">Card</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={editFormData.newPaymentDate || ''}
                                    onChange={e => setEditFormData({ ...editFormData, newPaymentDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes (Optional)</label>
                                <textarea
                                    className="form-input"
                                    value={editFormData.newPaymentNotes || ''}
                                    onChange={e => setEditFormData({ ...editFormData, newPaymentNotes: e.target.value })}
                                    placeholder="Add any notes..."
                                    rows={2}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={handleSavePayment}
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                            >
                                <Save size={18} /> {loading ? 'Processing...' : 'Confirm Payment'}
                            </button>
                            <button onClick={() => setEditPayment(null)} className="btn btn-outline" style={{ flex: 1 }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History Modal */}
            {viewHistory && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '600px', padding: '2rem', margin: 0, maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Payment History</h2>
                            <button onClick={() => setViewHistory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewHistory.name}</h3>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{viewHistory.course}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>REMAINING</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e11d48' }}>₹ {(viewHistory.fee_total - viewHistory.fee_paid).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Transactions</h3>

                        {viewHistory.history && viewHistory.history.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {viewHistory.history.map((txn) => (
                                    <div key={txn.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '1.1rem' }}>₹ {Number(txn.amount).toLocaleString()}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(txn.payment_date).toLocaleDateString()} • {txn.payment_method}
                                            </div>
                                            {txn.notes && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem', fontStyle: 'italic' }}>"{txn.notes}"</div>}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                                #{txn.receipt_number}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #ced4da' }}>
                                No payment history found
                            </div>
                        )}

                        <button onClick={() => setViewHistory(null)} className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }}>
                            Close History
                        </button>
                    </div>
                </div>
            )}

            <div className="card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search by name..." className="form-input" style={{ paddingLeft: '2.5rem', width: '300px' }} />
                        </div>
                        <button className="btn btn-outline" style={{ padding: '0.75rem' }}><Filter size={18} /></button>
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Fee Info</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => {
                            const remaining = s.fee_total - s.fee_paid;
                            const status = remaining <= 0 ? 'Fully Paid' : 'Pending';
                            return (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{s.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.course}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'green', fontWeight: '600' }}>₹{s.fee_paid.toLocaleString()}</span>
                                            <span style={{ color: '#cbd5e1' }}>/</span>
                                            <span style={{ color: '#64748b' }}>₹{s.fee_total.toLocaleString()}</span>
                                        </div>
                                        {remaining > 0 && (
                                            <div style={{ fontSize: '0.8rem', color: '#e11d48', marginTop: '2px', fontWeight: '500' }}>
                                                Due: ₹{remaining.toLocaleString()}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: '20px',
                                            background: remaining <= 0 ? '#dcfce7' : '#fee2e2',
                                            color: remaining <= 0 ? '#166534' : '#991b1b',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEditPayment(s)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', height: 'auto' }}
                                            >
                                                <Plus size={14} /> Pay
                                            </button>
                                            <button
                                                onClick={() => handleViewHistory(s)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', height: 'auto' }}
                                            >
                                                <Eye size={14} /> History
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
