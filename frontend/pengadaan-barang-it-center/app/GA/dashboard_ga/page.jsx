'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardGA from './DashboardContent'; // Pisahkan konten

export default function DashboardGAPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardGA />
    </ProtectedRoute>
  );
}