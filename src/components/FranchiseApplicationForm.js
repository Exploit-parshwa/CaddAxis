'use client';
import { useState, useMemo } from 'react';
import { submitFranchiseEnquiry } from '@/app/actions';
import { Loader2, ArrowRight } from 'lucide-react';

const LOCATION_DATA = {
    "Maharashtra": {
        "Pune": ["Pune City", "Pimpri-Chinchwad", "Baramati", "Lonavala"],
        "Sangli": ["Sangli City", "Miraj", "Islampur", "Vita"],
        "Kolhapur": ["Kolhapur City", "Ichalkaranji", "Jaysingpur"],
        "Satara": ["Satara City", "Karad", "Mahabaleshwar"],
        "Mumbai": ["Andheri", "Bandra", "Dadar", "Thane", "Navi Mumbai"],
        "Nagpur": ["Nagpur City", "Kamptee"]
    },
    "Karnataka": {
        "Bangalore": ["Indiranagar", "Koramangala", "Whitefield", "Electronic City"],
        "Mysore": ["Mysore City"],
        "Belgaum": ["Belgaum City", "Gokak"]
    },
    "Delhi NCR": {
        "Delhi": ["Connaught Place", "South Delhi", "West Delhi"],
        "Noida": ["Sector 18", "Sector 62"],
        "Gurgaon": ["Cyber City", "Udyog Vihar"]
    }
};

const INVESTMENT_OPTIONS = [
    "5L – 10L",
    "10L – 15L",
    "15L – 25L",
    "25L+"
];

export default function FranchiseApplicationForm() {
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        state: '',
        district: '',
        city: '',
        customState: '',
        customDistrict: '',
        customCity: '',
        investment: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Phone Validation (Numbers only, max 10)
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset downstream dropdowns when upstream changes
        if (name === 'state') {
            setFormData(prev => ({ ...prev, state: value, district: '', city: '', customState: '', customDistrict: '', customCity: '' }));
        }
        if (name === 'district') {
            setFormData(prev => ({ ...prev, district: value, city: '', customDistrict: '', customCity: '' }));
        }
    };

    const isDistrictsAvailable = useMemo(() => {
        return formData.state && LOCATION_DATA[formData.state];
    }, [formData.state]);

    const isCitiesAvailable = useMemo(() => {
        return formData.district && LOCATION_DATA[formData.state]?.[formData.district];
    }, [formData.state, formData.district]);

    const isValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            formData.name.trim().length > 0 &&
            formData.phone.length === 10 &&
            emailRegex.test(formData.email) &&
            formData.state &&
            (formData.state !== 'Custom' || formData.customState) &&
            formData.district &&
            (formData.district !== 'Custom' || formData.customDistrict) &&
            formData.city &&
            (formData.city !== 'Custom' || formData.customCity) &&
            formData.investment
        );
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct Final Location String
        const finalState = formData.state === 'Custom' ? formData.customState : formData.state;
        const finalDistrict = formData.district === 'Custom' ? formData.customDistrict : formData.district;
        const finalCity = formData.city === 'Custom' ? formData.customCity : formData.city;
        const locationString = `${finalCity}, ${finalDistrict}, ${finalState}`;

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('phone', `+91${formData.phone}`);
        payload.append('email', formData.email);
        payload.append('city', locationString); // Saving combined location to existing 'city' column
        payload.append('investment', formData.investment);
        payload.append('message', formData.message);

        const res = await submitFranchiseEnquiry(payload);
        setLoading(false);

        if (res.success) {
            alert('Application Submitted Successfully! We will contact you shortly.');
            // Reset Form
            setFormData({
                name: '', phone: '', email: '', state: '', district: '', city: '',
                customState: '', customDistrict: '', customCity: '', investment: '', message: ''
            });
        } else {
            alert('Submission Failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', background: '#1e293b', padding: '3rem', borderRadius: '12px', border: '1px solid #334155' }}>

            {/* FULL NAME */}
            <div style={inputGroupStyle}>
                <label style={labelStyle}>FULL NAME</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                />
            </div>

            {/* PHONE & EMAIL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>PHONE NUMBER</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}>
                        <span style={{ padding: '0.9rem', color: '#94a3b8', borderRight: '1px solid #334155', background: '#1e293b', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>+91</span>
                        <input
                            name="phone"
                            type="text"
                            placeholder="9999999999"
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={{ ...inputStyle, border: 'none', borderRadius: '0 8px 8px 0' }}
                        />
                    </div>
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* LOCATION CASCADE */}
            <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '8px', border: '1px dashed #334155' }}>
                <label style={{ ...labelStyle, marginBottom: '1rem', display: 'block' }}>PROPOSED LOCATION</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

                    {/* STATE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <select name="state" value={formData.state} onChange={handleInputChange} style={selectStyle}>
                            <option value="">Select State</option>
                            {Object.keys(LOCATION_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                            <option value="Custom">Other / Custom</option>
                        </select>
                        {formData.state === 'Custom' && (
                            <input name="customState" placeholder="Enter State" value={formData.customState} onChange={handleInputChange} style={inputStyle} />
                        )}
                    </div>

                    {/* DISTRICT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <select name="district" value={formData.district} onChange={handleInputChange} style={selectStyle} disabled={!isDistrictsAvailable && formData.state !== 'Custom'}>
                            <option value="">Select District</option>
                            {isDistrictsAvailable && Object.keys(LOCATION_DATA[formData.state]).map(d => <option key={d} value={d}>{d}</option>)}
                            <option value="Custom">Other / Custom</option>
                        </select>
                        {formData.district === 'Custom' && (
                            <input name="customDistrict" placeholder="Enter District" value={formData.customDistrict} onChange={handleInputChange} style={inputStyle} />
                        )}
                    </div>

                    {/* CITY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <select name="city" value={formData.city} onChange={handleInputChange} style={selectStyle} disabled={!isCitiesAvailable && formData.district !== 'Custom'}>
                            <option value="">Select City</option>
                            {isCitiesAvailable && LOCATION_DATA[formData.state][formData.district].map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="Custom">Other / Custom</option>
                        </select>
                        {formData.city === 'Custom' && (
                            <input name="customCity" placeholder="Enter City" value={formData.customCity} onChange={handleInputChange} style={inputStyle} />
                        )}
                    </div>

                </div>
            </div>

            {/* INVESTMENT CAPACITY */}
            <div style={inputGroupStyle}>
                <label style={labelStyle}>INVESTMENT CAPACITY</label>
                <select name="investment" value={formData.investment} onChange={handleInputChange} style={selectStyle}>
                    <option value="">Select Investment Range</option>
                    {INVESTMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            {/* MESSAGE */}
            <div style={inputGroupStyle}>
                <label style={labelStyle}>ADDITIONAL MESSAGE (OPTIONAL)</label>
                <textarea
                    name="message"
                    rows={4}
                    placeholder="Any specific queries..."
                    value={formData.message}
                    onChange={handleInputChange}
                    style={inputStyle}
                ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
                type="submit"
                disabled={!isValid || loading}
                className="btn-main"
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    background: isValid ? 'var(--primary)' : '#475569',
                    color: isValid ? 'white' : '#94a3b8',
                    border: 'none',
                    cursor: isValid ? 'pointer' : 'not-allowed',
                    padding: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? <><Loader2 className="spin" size={20} /> PROCESSING...</> : <>SUBMIT PROPOSAL <ArrowRight size={20} /></>}
            </button>

            <style jsx>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </form>
    );
}

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle = {
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '1px'
};

const inputStyle = {
    width: '100%',
    padding: '0.9rem',
    background: '#0f172a',
    border: '1px solid #334155',
    color: 'white',
    fontFamily: 'inherit',
    outline: 'none',
    fontSize: '0.95rem',
    borderRadius: '8px'
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none', // Can use a custom arrow if needed but standard is fine for mvp
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right .7em top 50%',
    backgroundSize: '.65em auto',
};
