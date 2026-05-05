'use client';
import { useState, useEffect } from 'react';
import { getContactMessages, updateContactStatus, deleteContactMessage } from '@/app/actions';
import { Phone, Mail, MessageSquare, Eye, Check, Trash } from 'lucide-react';

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getContactMessages();
        setMessages(data);
    };

    const handleStatusChange = async (id, newStatus) => {
        await updateContactStatus(id, newStatus);
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            await deleteContactMessage(id);
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.status === filter);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                    CONTACT MESSAGES <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>View and manage inquiries from the website.</p>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['all', 'unread', 'read', 'replied'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            border: filter === status ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                            background: filter === status ? 'var(--primary)' : 'white',
                            color: filter === status ? 'white' : '#64748b',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: filter === status ? '0 4px 6px -1px rgba(233, 30, 99, 0.2)' : 'none'
                        }}
                    >
                        {status} <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: '0.25rem' }}>({status === 'all' ? messages.length : messages.filter(m => m.status === status).length})</span>
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredMessages.map(msg => (
                    <div key={msg.id} className="card" style={{ padding: '2rem', borderLeft: msg.status === 'unread' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'transform 0.2s', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Oswald', color: '#334155' }}>{msg.name}</h3>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={16} /> {msg.email}
                                    </span>
                                    {msg.phone && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={16} /> {msg.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span style={{
                                padding: '0.35rem 1rem',
                                borderRadius: '20px',
                                background: msg.status === 'unread' ? '#eff6ff' : msg.status === 'read' ? '#fffbeb' : '#f0fdf4',
                                color: msg.status === 'unread' ? '#1d4ed8' : msg.status === 'read' ? '#b45309' : '#15803d',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                border: '1px solid transparent',
                                borderColor: msg.status === 'unread' ? '#bfdbfe' : msg.status === 'read' ? '#fde68a' : '#bbf7d0'
                            }}>
                                {msg.status}
                            </span>
                        </div>

                        {msg.subject && (
                            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '2px solid #cbd5e1' }}>
                                <strong style={{ fontSize: '0.9rem', color: '#475569', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Subject</strong>
                                <span style={{ color: '#1e293b', fontWeight: 500 }}>{msg.subject}</span>
                            </div>
                        )}

                        <div style={{ padding: '0', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <MessageSquare size={16} /> Message Content
                            </div>
                            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#334155', background: '#fff', padding: '0' }}>{msg.message}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                Received: {new Date(msg.created_at).toLocaleString()}
                            </span>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {msg.status === 'unread' && (
                                    <button onClick={() => handleStatusChange(msg.id, 'read')} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                        <Eye size={16} style={{ marginRight: '0.5rem' }} /> Mark as Read
                                    </button>
                                )}
                                <button onClick={() => handleStatusChange(msg.id, 'replied')} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    <Check size={16} style={{ marginRight: '0.5rem' }} /> Mark as Replied
                                </button>
                                <button onClick={() => handleDelete(msg.id)} style={{ width: '36px', height: '36px', color: '#dc2626', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredMessages.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        <div style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                            <Mail size={48} />
                        </div>
                        <p style={{ fontSize: '1.1rem' }}>No messages found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
