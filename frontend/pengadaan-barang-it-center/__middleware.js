import { NextResponse } from 'next/server';

// Daftar route yang diproteksi berdasarkan role
const protectedRoutes = {
  '/GA': ['admin'],
  '/finance': ['validator'],
  '/Divisi': ['pemohon'],
  // Tambahkan route lain sesuai kebutuhan
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Cari apakah pathname termasuk dalam protected routes
  let requiredRole = null;
  
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      requiredRole = roles[0]; // Ambil role pertama
      break;
    }
  }
  
  if (!requiredRole) {
    return NextResponse.next();
  }
  
  // Cek token dari cookie atau localStorage (via header)
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Note: Untuk validasi token lebih lanjut, 
  // Anda perlu API endpoint untuk verifikasi token
  // Atau gunakan JWT decode di client side saja
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/GA/:path*',
    '/finance/:path*',
    '/Divisi/:path*',
  ],
};
