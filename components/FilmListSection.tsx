'use client';

import Link from 'next/link';

interface Film {
  film_id: string;
  value?: number; // untuk rating
  films: {
    title: string;
    genre: string;
  };
}

interface FilmListSectionProps {
  title: string;
  films: any[];
  showRating?: boolean;
  icon?: React.ReactNode;
  bgColor?: 'green' | 'blue' | 'yellow' | 'gray';
}
export default function FilmListSection({
  title,
  icon = '',
  films,
  bgColor = 'gray',
}: FilmListSectionProps) {
  const bgClassMap: Record<string, string> = {
    green: 'bg-green-100 hover:bg-green-200',
    blue: 'bg-blue-100 hover:bg-blue-200',
    yellow: 'bg-yellow-100 hover:bg-yellow-200',
    gray: 'bg-gray-100 hover:bg-gray-200',
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">
        {icon} {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {films.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada data.</p>
        ) : (
          films.map((film) => (
            <Link key={film.film_id} href={`/film/${film.film_id}`}>
              <div
                className={`${bgClassMap[bgColor]} dark:bg-gray-700 p-4 rounded shadow transition-colors dark:hover:bg-gray-600`}
              >
                <p className="font-bold">{film.films.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {film.films.genre}
                </p>
                {film.value !== undefined && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    ★ {film.value}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
