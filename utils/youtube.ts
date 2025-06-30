export function extractYouTubeId(url: string): string {
  if (!url) return '';

  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);

  return match ? match[1] : '';
}
