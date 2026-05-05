import './globals.css';

export const metadata = {
    metadataBase: new URL('https://caddaxis.com'),
    title: {
        default: 'CADD Axis Institute | Engineering CAD Training Specialists',
        template: '%s | CADD Axis'
    },
    description: 'Master industry-standard CAD, CAM, and CAE software like AutoCAD, Revit, SolidWorks. India\'s leading Franchise Network for Civil & Mechanical Engineering Training.',
    keywords: ['CAD Training', 'AutoCAD Course', 'Revit Training', 'Civil Engineering', 'Mechanical CAD', 'Franchise Opportunity', 'Skill Development'],
    authors: [{ name: 'CADD Axis' }],
    creator: 'CADD Axis',
    publisher: 'CADD Axis',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://caddaxis.com',
        siteName: 'CADD Axis',
        title: 'CADD Axis Institute | Engineering CAD Training Specialists',
        description: 'Master industry-standard CAD, CAM, and CAE software. Specialized training in Architecture, Civil, and Mechanical Engineering.',
        images: [
            {
                url: '/images/og-image.jpg', // Ensure this image exists or is generic
                width: 1200,
                height: 630,
                alt: 'CADD Axis Institute',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CADD Axis Institute',
        description: 'Engineering CAD Training Specialists',
        creator: '@caddaxis',
    },
    verification: {
        google: 'google-site-verification-code', // Placeholder
    },
}

import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Lucide Icons */}
                <script src="https://unpkg.com/lucide@latest"></script>
                {/* Fonts are imported in global.css */}
            </head>
            <body>
                <CustomCursor />
                {children}
            </body>
        </html>
    )
}
