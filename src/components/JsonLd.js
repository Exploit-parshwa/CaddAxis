export default function JsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "EducationalOrganization",
                    "name": "CaddAxis Institute",
                    "url": "https://www.cadinstitute.in",
                    "logo": "https://www.cadinstitute.in/logo.png",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-9547714747",
                        "contactType": "customer service",
                        "areaServed": "IN",
                        "availableLanguage": "en"
                    },
                    "sameAs": [
                        "https://facebook.com/caddaxis",
                        "https://instagram.com/caddaxis"
                    ],
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "5/40, Janta Rd, Shahu Corner",
                        "addressLocality": "Ichalkaranji",
                        "addressRegion": "Maharashtra",
                        "postalCode": "416115",
                        "addressCountry": "IN"
                    },
                    "description": "ISO 9001:2015 Certified Institute providing advanced training in AutoCAD, Revit, SolidWorks, Catia, and Civil Engineering designs."
                })
            }}
        />
    )
}
