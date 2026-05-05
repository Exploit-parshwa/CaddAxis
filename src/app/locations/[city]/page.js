import { getFranchises } from '@/app/actions_franchise';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
    return {
        title: `CaddAxis ${city} - Best CAD Training Institute in ${city}`,
        description: `Join CaddAxis ${city} for certified courses in AutoCAD, Revit, SolidWorks, and more. 100% Placement Assistance in ${city}.`,
        keywords: [`CaddAxis ${city}`, `CAD Classes ${city}`, `AutoCAD Training ${city}`, `Civil Engineering Classes ${city}`]
    };
}

export default async function CityPage({ params }) {
    const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);

    // Schema Markup for Local SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': `CaddAxis ${city}`,
        'url': `https://caddaxis.com/locations/${params.city}`,
        'logo': 'https://caddaxis.com/logo.png',
        'sameAs': [
            'https://facebook.com/caddaxis',
            'https://linkedin.com/company/caddaxis'
        ],
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': city,
            'addressRegion': 'Maharashtra',
            'addressCountry': 'IN'
        },
        'areaServed': city,
        'description': `Premier CAD training institute in ${city} offering professional courses in Civil, Mechanical, and Electrical Engineering.`
    };

    return (
        <main style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1 style={{ fontSize: '3rem', fontFamily: 'Oswald', marginBottom: '1rem' }}>
                CADDAXIS <span style={{ color: '#E91E63' }}>{city.toUpperCase()}</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem', maxWidth: '800px' }}>
                Empowering the engineers of <strong>{city}</strong> with world-class design software training.
                Bridging the gap between academic theory and industry reality.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div style={cardStyle}>
                    <h3 style={cardTitle}>👷 Civil Engineering</h3>
                    <p style={cardText}>Master AutoCAD, Revit Architecture, and Staad Pro in {city}.</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitle}>⚙️ Mechanical Engineering</h3>
                    <p style={cardText}>Expert training in SolidWorks, CATIA, and ANSYS available at our {city} center.</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitle}>⚡ Electrical Engineering</h3>
                    <p style={cardText}>Learn AutoCAD Electrical and Industrial Automation nearby.</p>
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Oswald' }}>Visit Our {city} Center</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#E91E63', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>📍</div>
                    <div>
                        <strong>CaddAxis {city}</strong><br />
                        Near Main Bus Stand, {city}, Maharashtra.
                    </div>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/contact" style={{ background: '#E91E63', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                        Enquire Now
                    </Link>
                </div>
            </div>
        </main>
    );
}

const cardStyle = {
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const cardTitle = {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontFamily: 'Oswald'
};

const cardText = {
    color: '#64748b',
    lineHeight: 1.6
};
