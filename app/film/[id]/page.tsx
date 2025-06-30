'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase';
import { useParams } from 'next/navigation';
import FilmActions from '../../../components/FilmActions';
import CommentSection from '../../../components/CommentSection';
import RatingSection from '../../../components/RatingSection';

export default function FilmDetail() {
  const params = useParams();
  const filmId = params.id as string;

  const [film, setFilm] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);
      setUserId(currentUser?.id || null);

      const filmRes = await supabase.from('films').select('*').eq('id', filmId).single();
      setFilm(filmRes.data);

      if (currentUser) {
        const [{ data: fav }, { data: bm }] = await Promise.all([
          supabase.from('favorites').select('*').eq('user_id', currentUser.id).eq('film_id', filmId).maybeSingle(),
          supabase.from('bookmarks').select('*').eq('user_id', currentUser.id).eq('film_id', filmId).maybeSingle(),
        ]);
        setIsFavorite(!!fav);
        setIsBookmarked(!!bm);
      }
    };

    init();
  }, [filmId]);

  const toggleFavorite = async () => {
    if (!userId) return alert('Harap login terlebih dahulu.');
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('film_id', filmId);
    } else {
      await supabase.from('favorites').insert({ user_id: userId, film_id: filmId });
    }
    setIsFavorite(!isFavorite);
  };

  const toggleBookmark = async () => {
    if (!userId) return alert('Harap login terlebih dahulu.');
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('film_id', filmId);
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, film_id: filmId });
    }
    setIsBookmarked(!isBookmarked);
  };

  if (!film) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading film detail...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 text-black dark:text-white">
      {/* === TRAILER VIDEO === */}
      {film.trailer_url && (
        <div className="relative w-full pt-[56.25%] mb-6">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded"
            src={`https://www.youtube.com/embed/${film.trailer_url}`}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* === JUDUL DAN GENRE === */}
      <h1 className="text-3xl font-bold mb-2">{film.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{film.genre}</p>

      {/* === FAVORITE & BOOKMARK BUTTONS === */}
      <FilmActions
        userId={userId ?? ''}
        filmId={filmId}
        isFavorite={isFavorite}
        isBookmarked={isBookmarked}
        onToggleFavorite={toggleFavorite}
        onToggleBookmark={toggleBookmark}
        trailerUrl={film.trailer_url}
      />

      {/* === DESKRIPSI === */}
      <p className="mb-4">{film.description || 'No description available.'}</p>

      {/* === RATING SECTION === */}
      <RatingSection filmId={filmId} user={user} />

      {/* === KOMENTAR === */}
      <CommentSection filmId={filmId} user={user} />
    </main>
  );
}
