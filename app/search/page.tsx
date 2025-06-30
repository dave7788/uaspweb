// app/search/page.tsx (server component)
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil Pencarian</h1>
      <SearchClient />
    </div>
  );
}
