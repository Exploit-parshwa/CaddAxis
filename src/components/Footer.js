import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--black)', color: 'white', padding: '8rem 4vw 4rem', overflow: 'hidden', position: 'relative' }}>
            <div className="footer-title">CADD AXIS</div>

            <div className="footer-content">
                <div className="footer-brand">
                    <h2>DESIGN YOUR<br /><span style={{ color: 'var(--primary)' }}>FUTURE.</span></h2>
                    <p style={{ color: '#666', maxWidth: '400px', lineHeight: 1.8 }}>
                        The leading institute for engineering design training. Join thousands of successful engineers who started their journey with us.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>PROGRAMS</h3>
                    <ul>
                        <li><Link href="/courses">Civil Engineering</Link></li>
                        <li><Link href="/courses">Mechanical CAD</Link></li>
                        <li><Link href="/courses">Architectural BIM</Link></li>
                        <li><Link href="/courses">Structural Analysis</Link></li>
                        <li><Link href="/verify">Verify Certificate</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>INSTITUTE</h3>
                    <ul>
                        <li><Link href="/">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><Link href="/student/auth">Student Portal</Link></li>
                        <li><Link href="/franchise">Franchise</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div>&copy; {new Date().getFullYear()} CaddAxis Institute. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link href="#">Instagram</Link>
                    <Link href="#">LinkedIn</Link>
                    <Link href="#">Twitter</Link>
                </div>
            </div>
        </footer>
    );
}
