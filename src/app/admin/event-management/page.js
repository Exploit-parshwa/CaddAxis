'use client';
import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/app/actions';
import { Plus, Edit, Trash, X, Save, Calendar, Clock, MapPin } from 'lucide-react';

export default function EventManagementPage() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        image_url: '',
        status: 'upcoming'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getEvents();
        setEvents(data);
    };

    const handleOpenModal = (event = null) => {
        if (event) {
            setEditingEvent(event.id);
            setFormData({
                title: event.title,
                description: event.description || '',
                event_date: event.event_date.split('T')[0],
                event_time: event.event_time || '',
                location: event.location || '',
                image_url: event.image_url || '',
                status: event.status
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                event_date: '',
                event_time: '',
                location: '',
                image_url: '',
                status: 'upcoming'
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (editingEvent) {
            await updateEvent(editingEvent, formData);
        } else {
            await createEvent(formData);
        }

        setShowModal(false);
        loadData();
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(id);
            loadData();
            alert('Event deleted successfully!');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        EVENT MANAGEMENT <span style={{ color: 'var(--primary)', fontSize: '2rem' }}>.</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Organize and manage college events.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Event
                </button>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '2rem', background: 'white', maxHeight: '90vh', overflow: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', color: '#1e293b' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Event Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="form-input"
                                    placeholder="Enter event title"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="form-input"
                                    placeholder="Event details..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Event Date *</label>
                                    <input
                                        type="date"
                                        value={formData.event_date}
                                        onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Event Time</label>
                                    <input
                                        type="time"
                                        value={formData.event_time}
                                        onChange={e => setFormData({ ...formData, event_time: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Main Campus, Ichalkaranji"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Save size={18} /> {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Events List */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {events.map(event => (
                    <div key={event.id} className="card" style={{ padding: '0', display: 'flex', overflow: 'hidden', flexDirection: 'row' }}>
                        {event.image_url ? (
                            <div style={{ width: '240px', background: '#f1f5f9', flexShrink: 0 }}>
                                <img src={event.image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width: '240px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', flexShrink: 0 }}>
                                <Calendar size={48} />
                            </div>
                        )}

                        <div style={{ flex: 1, padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', fontFamily: 'Oswald', color: '#334155' }}>{event.title}</h3>
                                <span style={{
                                    padding: '0.35rem 1rem',
                                    borderRadius: '50px',
                                    background: event.status === 'upcoming' ? '#eff6ff' : event.status === 'ongoing' ? '#f0fdf4' : event.status === 'completed' ? '#f8fafc' : '#fef2f2',
                                    color: event.status === 'upcoming' ? '#1d4ed8' : event.status === 'ongoing' ? '#15803d' : event.status === 'completed' ? '#64748b' : '#b91c1c',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    border: '1px solid transparent',
                                    borderColor: event.status === 'upcoming' ? '#bfdbfe' : event.status === 'ongoing' ? '#bbf7d0' : event.status === 'completed' ? '#e2e8f0' : '#fecaca'
                                }}>
                                    {event.status}
                                </span>
                            </div>

                            {event.description && (
                                <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                    {event.description}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#475569', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                                    <Calendar size={16} />
                                    {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                {event.event_time && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                                        <Clock size={16} />
                                        {event.event_time}
                                    </span>
                                )}
                                {event.location && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                                        <MapPin size={16} />
                                        {event.location}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    onClick={() => handleOpenModal(event)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.2s' }}
                                >
                                    <Trash size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        <div style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                            <Calendar size={48} />
                        </div>
                        <p style={{ fontSize: '1.1rem' }}>No events found. Click "Add New Event" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
