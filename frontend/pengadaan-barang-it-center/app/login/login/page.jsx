'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../lib/authService';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.username, formData.password);
      
      console.log('Login berhasil:', response);
      console.log('User role:', response.user.role);

      // Tunggu sebentar sebelum redirect
      setTimeout(() => {
        if (response.user.role === 'admin') {
          console.log('Redirecting to /GA/dashboard_ga');
          router.push('/GA/dashboard_ga');
        } else if (response.user.role === 'validator') {
          console.log('Redirecting to /finance/dashboard_finance');
          router.push('/finance/dashboard_finance');
        } else if (response.user.role === 'pemohon') {
          console.log('Redirecting to /Divisi/dashboard_divisi');
          router.push('/Divisi/dashboard_divisi');
        } else {
          router.push('/dashboard');
        }
      }, 100);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.error || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-950">
      {/* Card Glassmorphism */}
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo/ItCenter.png" alt="Logo IT Center" className="h-14" />
        </div>

        {/* Title */}
        <h1 className="text-center text-white font-bold text-2xl mb-6 drop-shadow">
          Login
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 bg-white/20 text-white placeholder-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 bg-white/20 text-white placeholder-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700/80 text-white font-bold py-3 rounded-lg hover:bg-blue-900/90 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-6 text-center text-gray-200 text-sm">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <div className="bg-black/20 p-3 rounded-lg text-left space-y-1">
            <p><span className="font-medium">Admin:</span> ga_admin / password123</p>
            <p><span className="font-medium">Validator:</span> finance_val / password123</p>
            <p><span className="font-medium">Pemohon:</span> kepala_it / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}