import Link from 'next/link';

export default function FilmListSection({
  title,
  films,
  icon,
  bgColor = 'gray',
}: {
  title: string;
  films: any[];
  icon: string;
  bgColor?: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{icon} {title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {films.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Tidak ada data.</p>
        ) : (
          films.map((film) => (
            <Link key={film.film_id} href={`/film/${film.film_id}`}>
              <div className={`bg-${bgColor}-100 dark:bg-gray-700 p-4 rounded shadow hover:bg-${bgColor}-200 dark:hover:bg-gray-600`}>
                <p className="font-bold">{film.films.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {film.films.genre} {film.value ? `· ★ ${film.value}` : ''}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
