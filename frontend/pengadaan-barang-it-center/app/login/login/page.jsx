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
  const [loginSuccess, setLoginSuccess] = useState(false); // State baru

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Hentikan event bubbling
    
    setError('');
    setLoading(true);
    setLoginSuccess(false); // Reset success state

    // Validasi input
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username dan password harus diisi');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData.username, formData.password);
      
      console.log('Login berhasil:', response);
      
      // Set state success untuk mencegah multiple redirect
      setLoginSuccess(true);
      
      // Pastikan response memiliki user dan role
      if (!response.user || !response.user.role) {
        setError('Data user tidak valid. Silakan coba lagi.');
        setLoading(false);
        setLoginSuccess(false);
        return;
      }

      // Redirect berdasarkan role - TANPA setTimeout
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

    } catch (err) {
      console.error('Login error details:', err);
      
      // JANGAN lakukan redirect apapun di sini
      // Hanya tampilkan error
      if (err.error) {
        setError(err.error);
      } else if (err.message) {
        setError(err.message);
      } else if (err.status === 401 || err.status === 403) {
        setError('Username atau password salah');
      } else if (err.status === 404) {
        setError('Endpoint login tidak ditemukan');
      } else if (err.status >= 500) {
        setError('Terjadi kesalahan server. Silakan coba lagi nanti.');
      } else {
        setError('Username atau password salah');
      }
      
      // Reset state
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-950">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/logo/ItCenter.png" alt="Logo IT Center" className="h-14" />
        </div>

        <h1 className="text-center text-white font-bold text-2xl mb-6 drop-shadow">
          Login
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/30 border border-red-500/50 text-white rounded text-sm animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || loginSuccess}
            className={`w-full text-white font-bold py-3 rounded-lg transition ${
              loading || loginSuccess
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-700/80 hover:bg-blue-900/90'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memproses...
              </div>
            ) : loginSuccess ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengalihkan...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
      </div>
    </div>
  );
}