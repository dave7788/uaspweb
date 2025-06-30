'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';

export default function ProfilePage() {
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setUsername(data.username || '');
      setBio(data.bio || '');
    }

    // Fetch favorites
    const { data: favData } = await supabase
      .from('favorites')
      .select('film_id, films (*)')
      .eq('user_id', user.id);
    setFavorites(favData || []);

    // Fetch bookmarks
    const { data: bmData } = await supabase
      .from('bookmarks')
      .select('film_id, films (*)')
      .eq('user_id', user.id);
    setBookmarks(bmData || []);

    // Fetch ratings
    const { data: rtData } = await supabase
      .from('ratings')
      .select('film_id, value, films (*)')
      .eq('user_id', user.id);
    setRatings(rtData || []);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updates = {
      id: user?.id,
      bio,
      username,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  return (
    <main className="max-w-5xl mx-auto p-6 text-black dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-10 transition-colors">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>

      {/* Favorite Films */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">❤️ Favorite Films</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">Tidak ada favorite.</p>
          )}
          {favorites.map((fav) => (
            <Link key={fav.film_id} href={`/film/${fav.film_id}`}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow hover:bg-green-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-bold">{fav.films.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{fav.films.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bookmarked Films */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔖 Bookmarked Films</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {bookmarks.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">Belum ada bookmark.</p>
          )}
          {bookmarks.map((bm) => (
            <Link key={bm.film_id} href={`/film/${bm.film_id}`}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-bold">{bm.films.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{bm.films.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Rated Films */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🎯 Rated Films</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratings.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">Belum ada film yang diberi rating.</p>
          )}
          {ratings.map((rate) => (
            <Link key={rate.film_id} href={`/film/${rate.film_id}`}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-bold">{rate.films.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rating: <span className="text-yellow-500">★ {rate.value}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
