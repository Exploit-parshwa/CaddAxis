'use client';
import { useState, useEffect } from 'react';
import { getFranchises, createFranchise, deleteFranchise } from '../../actions_franchise';
import { Plus, MapPin, Mail, CreditCard, Building2, Trash2 } from 'lucide-react';

export default function FranchiseListPage() {
    const [franchises, setFranchises] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newFranchise, setNewFranchise] = useState({ name: '', city: '', email: '', password: '', address: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getFranchises();
        setFranchises(data);
    };

    const handleCreate = async () => {
        if (!newFranchise.name || !newFranchise.city || !newFranchise.email || !newFranchise.password || !newFranchise.address) {
            return alert("Fill all fields, including Address");
        }

        // Ensure file is selected (as per "take documents")
        if (!file) {
            return alert("Please upload franchise agreement or relevant documents.");
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', newFranchise.name);
        formData.append('city', newFranchise.city);
        formData.append('email', newFranchise.email);
        formData.append('password', newFranchise.password);
        formData.append('address', newFranchise.address);
        if (newFranchise.latitude) formData.append('latitude', newFranchise.latitude);
        if (newFranchise.longitude) formData.append('longitude', newFranchise.longitude);
        formData.append('file', file); // Append file directly

        try {
            const res = await createFranchise(formData);

            setLoading(false);
            if (res.success) {
                alert("Franchise Created Successfully!");
                setShowAdd(false);
                setNewFranchise({ name: '', city: '', email: '', password: '', address: '' });
                setFile(null);
                loadData();
            } else {
                alert("Error: " + res.error);
            }
        } catch (e) {
            setLoading(false);
            console.error(e);
            alert("System Error: " + e.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this franchise? This will delete all associated data.")) {
            const res = await deleteFranchise(id);
            if (res.success) {
                alert("Franchise Deleted");
                loadData();
            } else {
                alert("Error: " + res.error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', marginBottom: '0.5rem' }}>FRANCHISE <span style={{ color: '#E91E63' }}>NETWORK</span></h1>
                    <p style={{ color: '#64748b' }}>Manage all city partners and certificate wallets.</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    style={{ background: '#E91E63', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    <Plus size={20} /> Add Franchise
                </button>
            </div>

            {showAdd && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Onboard New Franchise</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <input placeholder="Franchise Name (e.g. CaddAxis Kolhapur)" value={newFranchise.name} onChange={e => setNewFranchise({ ...newFranchise, name: e.target.value })} style={inputStyle} />
                        <input placeholder="City" value={newFranchise.city} onChange={e => setNewFranchise({ ...newFranchise, city: e.target.value })} style={inputStyle} />
                        <input placeholder="Email Login" value={newFranchise.email} onChange={e => setNewFranchise({ ...newFranchise, email: e.target.value })} style={inputStyle} />
                        <input placeholder="Password" type="password" value={newFranchise.password} onChange={e => setNewFranchise({ ...newFranchise, password: e.target.value })} style={inputStyle} />

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Exact Address</label>
                            <textarea
                                placeholder="Enter full physical address of the institute..."
                                value={newFranchise.address}
                                onChange={e => setNewFranchise({ ...newFranchise, address: e.target.value })}
                                style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', height: '300px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                            <LocationPicker onLocationSelect={(loc) => setNewFranchise(prev => ({ ...prev, latitude: loc.lat, longitude: loc.lng }))} />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Franchise Documents (PDF/Zip)</label>
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files[0])}
                                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={handleCreate} disabled={loading} style={{ padding: '0.8rem 2rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            {loading ? 'Processing...' : 'Create Franchise'}
                        </button>
                        <button onClick={() => setShowAdd(false)} style={{ padding: '0.8rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {franchises.map(f => (
                    <div key={f.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f1f5f9', transition: 'transform 0.2s', cursor: 'default', position: 'relative' }}>
                        <button
                            onClick={() => handleDelete(f.id)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Delete Franchise"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: '#fdf2f8', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
                                <Building2 size={24} />
                            </div>
                            <div style={{ padding: '0.5rem 1rem', background: f.wallet_balance > 10 ? '#f0fdf4' : '#fef2f2', color: f.wallet_balance > 10 ? '#166534' : '#dc2626', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {f.wallet_balance} CR
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'Oswald' }}>{f.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <MapPin size={16} /> {f.city}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                            <Mail size={16} /> {f.email}
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {f.id}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>Joined: {new Date(f.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const inputStyle = {
    padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', outline: 'none'
};

function LocationPicker({ onLocationSelect }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    });
    const [marker, setMarker] = useState(null);

    const mapContainerStyle = { width: '100%', height: '100%' };
    const center = { lat: 20.5937, lng: 78.9629 }; // India Center

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        onLocationSelect({ lat, lng });
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={4}
            onClick={handleMapClick}
        >
            {marker && <Marker position={marker} />}
        </GoogleMap>
    );
}
