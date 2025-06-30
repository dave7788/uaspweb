'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Link from 'next/link';

type Film = {
  id: string;
  title: string;
  image_url: string;
  release_year: number;
};

export default function HomePage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage, setFilmsPerPage] = useState(6);

  useEffect(() => {
    const fetchFilms = async () => {
      const { data, error } = await supabase.from('films').select('*');
      if (error) alert(error.message);
      else setFilms(data || []);
    };
    fetchFilms();
  }, []);

  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
  const startIndex = (currentPage - 1) * filmsPerPage;
  const paginatedFilms = filteredFilms.slice(startIndex, startIndex + filmsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-black dark:text-white transition-colors">
      <h1 className="text-3xl font-bold text-center mb-6">🎬 Daftar Film</h1>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Cari judul film..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:border-blue-400"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {paginatedFilms.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400 italic">Film tidak ditemukan.</p>
        ) : (
          paginatedFilms.map((film) => (
            <Link href={`/film/${film.id}`} key={film.id}>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
                <img
                  src={film.image_url}
                  alt={film.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{film.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{film.release_year}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="self-center font-medium">
              {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Dropdown jumlah film per halaman */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Film per halaman:</label>
            <select
              value={filmsPerPage}
              onChange={(e) => {
                setFilmsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>
      )}
    </main>
  );
}
