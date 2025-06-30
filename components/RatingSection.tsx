'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export default function RatingSection({ filmId, user }: { filmId: string; user: any }) {
  const [rating, setRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRating();
    }
    fetchAverageRating();
  }, [filmId, user]);

  const fetchUserRating = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('value')
        .eq('film_id', filmId)
        .eq('user_id', user.id)
        .single();

      if (error) console.warn('Fetch user rating error:', error.message);
      if (data) setRating(data.value);
    } catch (err) {
      console.error('Unexpected error in fetchUserRating:', err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('value')
        .eq('film_id', filmId);

      if (error) {
        console.warn('Fetch average rating error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const total = data.reduce((acc, cur) => acc + cur.value, 0);
        setAverageRating(total / data.length);
      } else {
        setAverageRating(null);
      }
    } catch (err) {
      console.error('Unexpected error in fetchAverageRating:', err);
    }
  };

  const handleRatingChange = async (value: number) => {
    if (!user) return alert('Harap login terlebih dahulu.');

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          film_id: filmId,
          user_id: user.id,
          value,
        }, { onConflict: 'film_id,user_id' });

      if (error) {
        console.error('Gagal memberikan rating:', error.message);
        alert('Gagal memberikan rating!');
        return;
      }

      setRating(value);
      fetchAverageRating();
    } catch (err) {
      console.error('Unexpected error in handleRatingChange:', err);
      alert('Terjadi kesalahan saat memberi rating!');
    }
  };

  return (
    <div className="mt-6 mb-4">
      <h2 className="font-semibold mb-2">Rating</h2>
      <div className="flex gap-1 items-center mb-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            onClick={() => handleRatingChange(val)}
            className={`text-2xl transition ${
              rating && val <= rating ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {averageRating !== null ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Rata-rata: {averageRating.toFixed(1)} / 5
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">Belum ada rating.</p>
      )}
    </div>
  );
}
