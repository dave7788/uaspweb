'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface CommentSectionProps {
  filmId: string | number;
  user: { id: string | number; [key: string]: any } | null;
}

export default function CommentSection({ filmId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('content, created_at, user_id, profiles(username)')
      .eq('film_id', filmId)
      .order('created_at', { ascending: false });
    setComments(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Harap login terlebih dahulu.');

    const { error } = await supabase.from('comments').insert({
      film_id: filmId,
      user_id: user.id,
      content,
    });

    if (!error) {
      setContent('');
      fetchComments();
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filmId]);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">Komentar</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentarmu..."
            className="w-full border rounded p-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          Login untuk menulis komentar.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada komentar.</p>
        ) : (
          comments.map((c, i) => (
            <div
              key={i}
              className="border-b pb-2 border-gray-300 dark:border-gray-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">{c.profiles?.username || 'Anonim'}</span> ·{' '}
                {new Date(c.created_at).toLocaleString()}
              </p>
              <p className="text-gray-800 dark:text-gray-200">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
