'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getFranchises, createFranchise } from '../../actions_franchise'; // Reusing existing action

// Styles for the map container
const containerStyle = {
    width: '100%',
    height: '700px'
};

// Initial center of India
const center = {
    lat: 20.5937,
    lng: 78.9629
};

// Dark Mode Google Map Styles for premium look
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

export default function FranchiseMapPage() {
    const [franchises, setFranchises] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY // Ensure this is set in .env
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getFranchises();

        // Enrich data with static coords for demo/MVP
        // In real prod, we would Geocode the city name or store lat/lng in DB
        const enrichedData = data.map(f => ({
            ...f,
            position: getCoordinatesForCity(f.city)
        }));
        setFranchises(enrichedData);
    };

    // Helper to mock coordinates for known cities (to ensure pins appear correctly without paid Geocoding API for now)
    const getCoordinatesForCity = (city) => {
        const cityMap = {
            'Ichalkaranji': { lat: 16.6992, lng: 74.4587 },
            'Kolhapur': { lat: 16.7050, lng: 74.2433 },
            'Sangli': { lat: 16.8524, lng: 74.5815 },
            'Pune': { lat: 18.5204, lng: 73.8567 },
            'Mumbai': { lat: 19.0760, lng: 72.8777 },
            'Satara': { lat: 17.6805, lng: 74.0183 },
            'Karad': { lat: 17.2777, lng: 74.2081 }
        };
        // Default random jitter around center if unknown, to avoid stacking
        return cityMap[city] || { lat: 20.5937 + (Math.random() - 0.5), lng: 78.9629 + (Math.random() - 0.5) };
    };

    return isLoaded ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '85vh', gap: '1rem', background: '#f8fafc', padding: '1rem' }}>

            {/* LEFT: MAP */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={5}
                    options={{ styles: mapStyles, disableDefaultUI: false }}
                >
                    {franchises.map(f => (
                        <Marker
                            key={f.id}
                            position={f.position}
                            onClick={() => setSelectedFranchise(f)}
                            animation={window.google.maps.Animation.DROP}
                        />
                    ))}
                </GoogleMap>
            </div>

            {/* RIGHT: INFO PANEL */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>
                    FRANCHISE <span style={{ color: '#E91E63' }}>HUB</span>
                </h2>

                {selectedFranchise ? (
                    <div className="fade-in-up">
                        <div style={{ width: '100%', height: '150px', background: '#E91E63', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '3rem', fontFamily: 'Oswald', margin: 0 }}>{selectedFranchise.city.substring(0, 2).toUpperCase()}</h1>
                            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>REGION CODE</span>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem' }}>{selectedFranchise.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            📍 {selectedFranchise.city}, Maharashtra
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>WALLET BALANCE</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>{selectedFranchise.wallet_balance} CR</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>SINCE</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155' }}>2024</div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b' }}>CONTACT MANAGER</h4>
                            <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedFranchise.email}</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>+91 95477 14747</p>
                        </div>

                        <button onClick={() => setSelectedFranchise(null)} style={{ marginTop: '2rem', width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close Details</button>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', color: '#94a3b8' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                        <p>Select a location on the map to view detailed franchise analytics and contact info.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#cbd5e1' }}>Try clicking "Sangli" or "Kolhapur"</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    ) : <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map Engine...</div>;
}
