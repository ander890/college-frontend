"use client";
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Jika sudah login (ada token), redirect ke dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_token')) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const result = await res.json();
      if (!res.ok) {
        // Jika API mengembalikan error field, gunakan itu
        if (result.error && (result.error.toLowerCase().includes('username') || result.error.toLowerCase().includes('password'))) {
          setError('Username atau password salah');
        } else if (result.message && (result.message.toLowerCase().includes('username') || result.message.toLowerCase().includes('password'))) {
          setError('Username atau password salah');
        } else {
          setError(result.error || result.message || 'Login gagal');
        }
        return;
      }
      if (result.data.token) {
        localStorage.setItem('admin_token', result.data.token);
      }
      if (result.data.user && result.data.user.id) {
        localStorage.setItem('admin_id', result.data.user.id);
      }
  toast.success(result.message || 'Login berhasil!');
      console.log('Token after login:', localStorage.getItem('admin_token'));
      console.log('Redirecting to /admin/dashboard...');
      router.push('/admin/dashboard');
      setTimeout(() => {
        console.log('Current path after push:', window.location.pathname);
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Terjadi kesalahan');
      } else {
        setError('Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-gray-800/95 p-10 sm:p-14 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col gap-7 border border-orange-200 dark:border-orange-400"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-900 dark:text-blue-200 mb-4 tracking-tight drop-shadow">Login</h2>
        <div className="flex flex-col gap-4">
          <label htmlFor="username" className="font-semibold text-base sm:text-lg text-blue-900 dark:text-blue-100">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Masukkan username..."
            value={form.username}
            onChange={handleChange}
            className="border-2 border-blue-200 dark:border-blue-700 rounded-xl px-5 py-3 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white transition-all"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="password" className="font-semibold text-base sm:text-lg text-blue-900 dark:text-blue-100">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Masukkan password..."
              value={form.password}
              onChange={handleChange}
              className="border-2 border-blue-200 dark:border-blue-700 rounded-xl px-5 py-3 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white transition-all w-full pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-2.1 2.1A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.925-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.197 4.197A9.956 9.956 0 0112 21c2.21 0 4.267-.72 5.925-1.95m2.1-2.1A9.956 9.956 0 0021 12c0-5.523-4.477-10-10-10-1.657 0-3.22.402-4.575 1.125m-2.1 2.1A9.956 9.956 0 003 12c0 1.657.402 3.22 1.125 4.575" /></svg>
              )}
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-base text-center font-semibold mt-2">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg sm:text-xl rounded-xl transition-colors mt-4 shadow-md"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
