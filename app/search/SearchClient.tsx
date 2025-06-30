'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';

type Film = {
  id: string;
  title: string;
  image_url: string;
  release_year: number;
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${query}%`);
      
      if (error) {
        console.error(error.message);
      } else {
        setFilms(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [query]);

  if (loading) return <p>Loading...</p>;

  if (films.length === 0) return <p>Tidak ada hasil ditemukan untuk: "{query}"</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {films.map((film) => (
        <Link href={`/film/${film.id}`} key={film.id}>
          <div className="bg-white dark:bg-gray-800 shadow rounded p-4 hover:shadow-lg transition">
            <img src={film.image_url} alt={film.title} className="w-full h-48 object-cover rounded mb-2" />
            <h2 className="text-lg font-semibold">{film.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{film.release_year}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
