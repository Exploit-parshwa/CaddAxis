import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'caddaxis-secure-key-2026';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // 1. Admin Protection
    if (path.startsWith('/admin')) {
        if (path === '/admin/login') return NextResponse.next(); // Allow login page

        const token = request.cookies.get('admin_session')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);
            // Token is valid
            return NextResponse.next();
        } catch (e) {
            // Invalid token
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }

    // 2. Student Protection (Optional but recommended)
    if (path.startsWith('/student') && !path.startsWith('/student/auth')) {
        const token = request.cookies.get('student_session')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/student/auth', request.url));
        }
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (e) {
            return NextResponse.redirect(new URL('/student/auth', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/student/:path*'],
};
