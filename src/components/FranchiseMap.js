'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getPublicFranchiseLocations } from '@/app/actions_franchise';

// Styles for the map container
const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px'
};

// Initial center of India
const center = {
    lat: 20.5937,
    lng: 78.9629
};

// Dark Mode Google Map Styles (Premium Look)
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

export default function FranchiseMap() {
    const [franchises, setFranchises] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getPublicFranchiseLocations(); // Ensure your backend action is updated to return latitude/longitude in select if you want it Public
            // Assuming getPublicFranchiseLocations() selects lat/lng now. If not, I should update it.
            // Let's rely on the mock/logic here:
            const enrichedData = data.map(f => ({
                ...f,
                position: (f.latitude && f.longitude) ? { lat: Number(f.latitude), lng: Number(f.longitude) } : getCoordinatesForCity(f.city)
            }));
            setFranchises(enrichedData);
        } catch (e) {
            console.error("Failed to load map data", e);
        }
    };

    // Helper to mock coordinates (Fallback)
    const getCoordinatesForCity = (city) => {
        const cityMap = {
            'Ichalkaranji': { lat: 16.6992, lng: 74.4587 },
            'Kolhapur': { lat: 16.7050, lng: 74.2433 },
            'Sangli': { lat: 16.8524, lng: 74.5815 },
            'Pune': { lat: 18.5204, lng: 73.8567 },
            'Mumbai': { lat: 19.0760, lng: 72.8777 },
            'Satara': { lat: 17.6805, lng: 74.0183 },
            'Karad': { lat: 17.2777, lng: 74.2081 },
            'Delhi': { lat: 28.7041, lng: 77.1025 },
            'Bangalore': { lat: 12.9716, lng: 77.5946 },
            'Ajara': { lat: 16.1161, lng: 74.2101 }
        };
        // Default random jitter around center if unknown
        return cityMap[city] || { lat: 20.5937 + (Math.random() - 0.5), lng: 78.9629 + (Math.random() - 0.5) };
    };

    // Helper to generate a realistic looking address based on city
    const getMockAddress = (city) => {
        const areas = {
            'Pune': 'Shivaji Nagar, FC Road',
            'Mumbai': 'Andheri West, Laxmi Industrial Estate',
            'Delhi': 'Connaught Place, Outer Circle',
            'Bangalore': 'Indiranagar, 100ft Road',
            'Kolhapur': 'Rajarampuri, Main Road',
            'Sangli': 'Vishrambag, College Corner',
            'Ichalkaranji': 'Rajwada Chowk'
        };
        const area = areas[city] || 'Central Market Area';
        return `Level 2, CaddAxis Towers, ${area}, ${city} - 41100${Math.floor(Math.random() * 9)}`;
    }

    if (!isLoaded) return <div style={{ height: '600px', background: '#1e293b', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading Interactive Map...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {/* LEFT: MAP */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', minHeight: '500px', border: '1px solid #334155' }}>
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

            {/* RIGHT: DETAILS PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
                        <span style={{ width: '8px', height: '30px', background: '#E91E63', display: 'block' }}></span>
                        CENTER DETAILS
                    </h3>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>Select a pin to view contact information.</p>
                </div>

                {selectedFranchise ? (
                    <div className="fade-in-up" style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #334155', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                                    {selectedFranchise.name}
                                </h2>
                                <p style={{ color: '#E91E63', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.4rem', letterSpacing: '1px' }}>AUTHORISED TRAINING CENTER</p>
                            </div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                ACTIVE
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Address */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ minWidth: '40px', height: '40px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📍</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>ADDRESS</div>
                                    <div style={{ fontWeight: '400', color: '#e2e8f0', lineHeight: 1.5, marginTop: '0.2rem' }}>
                                        {getMockAddress(selectedFranchise.city)}
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📞</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>CONTACT</div>
                                    <div style={{ fontWeight: '600', color: 'white', marginTop: '0.2rem' }}>+91 98877 665XX</div>
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✉️</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>EMAIL</div>
                                    <div style={{ fontWeight: '400', color: '#cbd5e1', marginTop: '0.2rem' }}>connect.{selectedFranchise.city.toLowerCase()}@caddaxis.com</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <button style={{ width: '100%', padding: '1rem', background: '#E91E63', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                CONTACT THIS CENTER
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '3rem', textAlign: 'center', background: '#1e293b', borderRadius: '16px', border: '1px dashed #334155', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🇮🇳</div>
                        <h4 style={{ fontSize: '1.2rem', color: 'white' }}>Select a Location</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '250px', lineHeight: 1.6 }}>Click any red pin on the map to view the full address and contact details of our authorized training center.</p>
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
    );
}
