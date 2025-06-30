import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
