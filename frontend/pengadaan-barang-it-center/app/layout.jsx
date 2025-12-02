'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import authService from '../lib/authService';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Jika sudah login dan mengakses halaman login, redirect
    if (currentUser && pathname === '/login') {
      switch(currentUser.role) {
        case 'admin':
          router.push('/GA/dashboard_ga');
          break;
        case 'validator':
          router.push('/finance/dashboard_finance');
          break;
        case 'pemohon':
          router.push('/Divisi/dashboard_divisi');
          break;
      }
    }
  }, [pathname, router]);

  // Halaman login tidak perlu layout
  if (pathname === '/login') {
    return (
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}