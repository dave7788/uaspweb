'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Film = {
  id: string;
  title: string;
  image_url: string;
  release_year: number;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setFilms(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchFilms();
    } else {
      setFilms([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">🔎 Hasil Pencarian untuk: <span className="italic">{query}</span></h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Memuat hasil...</p>
      ) : films.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">Tidak ada film ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {films.map((film) => (
            <Link key={film.id} href={`/film/${film.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded shadow hover:scale-[1.02] hover:shadow-lg transition-transform cursor-pointer">
                <img
                  src={film.image_url}
                  alt={film.title}
                  className="w-full h-60 object-cover rounded-t"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{film.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{film.release_year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
