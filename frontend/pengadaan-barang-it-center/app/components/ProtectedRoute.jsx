'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import authService from '../../lib/authService';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      const isAuthenticated = authService.isAuthenticated();
      console.log('Is authenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
        return;
      }

      const user = authService.getCurrentUser();
      console.log('Current user:', user);
      
      if (!user || !user.role) {
        console.log('No user or role found, logging out');
        authService.logout();
        return;
      }

      // Cek role jika ada allowedRoles
      if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          console.log(`Role ${user.role} not allowed for this page. Redirecting...`);
          
          // Redirect ke dashboard sesuai role
          switch(user.role) {
            case 'admin':
              router.push('/GA/dashboard_ga');
              break;
            case 'validator':
              router.push('/finance/dashboard_finance');
              break;
            case 'pemohon':
              router.push('/Divisi/dashboard_divisi');
              break;
            default:
              router.push('/unauthorized');
          }
          return;
        }
      }

      // Tambahan: Redirect jika user sudah login tapi mengakses login page
      if (pathname === '/login') {
        console.log('Already logged in, redirecting to dashboard');
        switch(user.role) {
          case 'admin':
            router.push('/GA/dashboard_ga');
            break;
          case 'validator':
            router.push('/finance/dashboard_finance');
            break;
          case 'pemohon':
            router.push('/Divisi/dashboard_divisi');
            break;
          default:
            router.push('/');
        }
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}