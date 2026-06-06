import { Suspense } from 'react';

export const metadata = {
  title: 'Browse Cars',
  description: 'Browse our premium collection of pre-owned cars. Filter by brand, fuel type, price range, and more at Hariram Motors, Surat.',
};

function CatalogLoading() {
  return (
    <div className="pt-[72px] min-h-screen">
      <div className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="skeleton h-10 w-64 rounded mb-2" />
          <div className="skeleton h-5 w-40 rounded" />
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import CatalogClient from './CatalogClient';

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogClient />
    </Suspense>
  );
}
