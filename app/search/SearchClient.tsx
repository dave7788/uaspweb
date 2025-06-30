'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

type Film = {
  id: string;
  title: string;
  image_url: string;
  release_year: number;
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!query) return setResults([]);

      setLoading(true);
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${query}%`);
      if (!error && data) setResults(data);
      setLoading(false);
    }
    fetchData();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Hasil pencarian: <span className="italic">{query}</span>
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada hasil.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((f) => (
            <Link key={f.id} href={`/film/${f.id}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-[1.02] transition cursor-pointer">
                <img src={f.image_url} alt={f.title} className="h-48 w-full object-cover rounded mb-2" />
                <h2 className="text-lg font-semibold">{f.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.release_year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
