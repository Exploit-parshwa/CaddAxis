'use client';
import { getStudents, createStudent } from '@/app/actions';
// ... icons

export default function FranchiseStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    // Filter
    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: 0 }}>STUDENT <span style={{ color: '#E91E63' }}>MANAGEMENT</span></h1>
                <button style={{ background: '#E91E63', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <UserPlus size={18} /> New Admission
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '0.7rem 1rem 0.7rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '300px', outline: 'none' }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Contact</th>
                            <th style={{ padding: '1rem' }}>Course</th>
                            <th style={{ padding: '1rem' }}>Fee Status</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{s.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem' }}>{s.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.phone}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{s.course}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: s.fee_paid < s.fee_total ? '#ca8a04' : '#16a34a', fontWeight: 'bold' }}>
                                        ₹{s.fee_paid} / ₹{s.fee_total}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                                        background: s.status === 'enrolled' ? '#dcfce7' : '#fef9c3',
                                        color: s.status === 'enrolled' ? '#166534' : '#854d0e'
                                    }}>
                                        {s.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}>
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
