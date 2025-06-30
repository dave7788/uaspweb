'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';

type Film = {
  id: string;
  title: string;
  image_url: string;
  release_year: number;
};

function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      const { data, error } = await supabase.from('films').select('*');
      if (error) console.error(error);
      else setFilms(data || []);
      setLoading(false);
    };
    fetchFilms();
  }, []);

  const filtered = films.filter(f =>
    f.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Hasil Pencarian: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>Tidak ada hasil ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(film => (
            <Link key={film.id} href={`/film/${film.id}`}>
              <div className="border rounded p-4 hover:shadow">
                <img src={film.image_url} alt={film.title} className="w-full h-48 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{film.title}</h2>
                <p className="text-sm">{film.release_year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Memuat pencarian...</p>}>
      <SearchClient />
    </Suspense>
  );
}
