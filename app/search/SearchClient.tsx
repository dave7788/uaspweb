// app/search/SearchClient.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    };
    fetchData();
  }, [query]);

  return (
    <div>
      {results.length === 0 ? (
        <p>Tidak ada hasil.</p>
      ) : (
        results.map((film) => <p key={film.id}>{film.title}</p>)
      )}
    </div>
  );
}
