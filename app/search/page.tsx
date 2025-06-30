'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${query}%`);

      if (!error) setResults(data || []);
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil pencarian: "{query}"</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.length === 0 ? (
          <p className="text-gray-500 italic">Tidak ada film ditemukan.</p>
        ) : (
          results.map((film) => (
            <Link key={film.id} href={`/film/${film.id}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                <h2 className="font-bold">{film.title}</h2>
                <p className="text-sm text-gray-500">{film.release_year}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
