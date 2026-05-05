export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/student/auth', '/verify/'],
        },
        sitemap: 'https://caddaxis.com/sitemap.xml',
    }
}
