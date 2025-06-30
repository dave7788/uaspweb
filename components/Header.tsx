'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  // Ambil session dan user dari Supabase
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Gagal ambil session:', error.message);
        return;
      }

      setUser(session?.user ?? null);
    };

    fetchSession();

    // Supaya realtime update saat login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Setup dark mode
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
        
        {/* Logo (Kiri) */}
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
          🎬 FilmList
        </Link>

        {/* Spacer Tengah - tetap jaga layout */}
        <div className="hidden md:flex w-1/2 justify-center"></div>

        {/* Right nav (Kanan) */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-xl hover:text-blue-500 transition"
            title="Toggle Dark Mode"
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          {!user && (
            <Link href="/register" className="hover:text-blue-600 font-medium">
              Register
            </Link>
          )}

          {user ? (
            <>
              <Link href="/profile" className="hover:text-blue-600 font-medium">
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
