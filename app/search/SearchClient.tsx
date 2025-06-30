'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${query}%`);

      if (!error) setResults(data || []);
    };

    if (query) fetchData();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil pencarian untuk: "{query}"</h1>

      {results.length === 0 ? (
        <p className="text-gray-500">Tidak ditemukan hasil.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((film) => (
            <Link key={film.id} href={`/film/${film.id}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition">
                <img src={film.image_url} alt={film.title} className="h-48 w-full object-cover rounded mb-2" />
                <h2 className="font-semibold">{film.title}</h2>
                <p className="text-sm text-gray-500">{film.release_year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
