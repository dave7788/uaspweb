'use client';

interface FilmActionsProps {
  userId: string;
  filmId: string;
  isFavorite: boolean;
  isBookmarked: boolean;
  onToggleFavorite: () => void;
  onToggleBookmark: () => void;
  trailerUrl?: string;
}

export default function FilmActions({
  userId,
  filmId,
  isFavorite,
  isBookmarked,
  onToggleFavorite,
  onToggleBookmark,
  trailerUrl,
}: FilmActionsProps) {
  return (
    <>
      <div className="flex gap-4 mb-6">
        <button
          onClick={onToggleFavorite}
          className={`px-4 py-2 rounded transition ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white text-red-500 border border-red-500 dark:bg-gray-800 dark:text-red-400 dark:border-red-400'
          }`}
        >
          {isFavorite ? '❤️ Favorited' : '♡ Add to Favorite'}
        </button>

        <button
          onClick={onToggleBookmark}
          className={`px-4 py-2 rounded transition ${
            isBookmarked
              ? 'bg-yellow-500 text-black dark:text-white'
              : 'bg-white text-yellow-600 border border-yellow-500 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-300'
          }`}
        >
          {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
        </button>
      </div>

      {trailerUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Trailer</h2>
          <div className="aspect-w-16 aspect-h-9">
          </div>
        </div>
      )}
    </>
  );
}

function getYoutubeVideoId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : '';
}
