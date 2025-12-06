"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/lib/authService";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);

      console.log("🔐 ProtectedRoute: Starting auth check...");

      // Check if user is authenticated
      const isAuthenticated = authService.isAuthenticated();
      console.log("🔐 ProtectedRoute - isAuthenticated:", isAuthenticated);

      if (!isAuthenticated) {
        console.log(
          "❌ ProtectedRoute: Not authenticated, redirecting to login"
        );
        router.push("/login");
        return;
      }

      // Get current user
      const user = authService.getCurrentUser();
      console.log("🔐 ProtectedRoute - Current user:", user);

      if (!user || !user.role) {
        console.log("❌ ProtectedRoute: No user or role found, logging out");
        authService.logout();
        return;
      }

      // Check role if allowedRoles is specified
      if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.includes(user.role);
        console.log(
          `🔐 ProtectedRoute - Role check: ${user.role} in [${allowedRoles}] = ${hasPermission}`
        );

        if (!hasPermission) {
          console.log(
            `❌ ProtectedRoute: Role ${user.role} not allowed. Redirecting...`
          );

          // Redirect to appropriate dashboard based on role
          switch (user.role) {
            case "admin":
              router.push("/GA/dashboard_ga");
              break;
            case "validator":
              router.push("/finance/dashboard_finance");
              break;
            case "pemohon":
              router.push("/Divisi/dashboard_divisi");
              break;
            default:
              router.push("/unauthorized");
          }
          return;
        }
      }

      console.log("✅ ProtectedRoute: User authorized");
      setIsAuthorized(true);
      setIsLoading(false);
    };

    // Add a small delay to ensure router is ready
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router, allowedRoles]);

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

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Akses Ditolak</h2>
          <p className="mt-2 text-gray-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
