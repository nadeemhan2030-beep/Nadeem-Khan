import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, products, navigateToProduct } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isSearchModalOpen) return null;

  const popularSearches = ['Titanium', 'Merino', 'Wireless', 'Opal', 'Brass', 'Leather'];

  return (
    <div
      onClick={() => setIsSearchModalOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search audio, watches, knitwear, interiors..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-2 py-1 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Content area */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="space-y-3 py-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Popular Inquiries
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                Matches ({results.length})
              </span>
              {results.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    navigateToProduct(product);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-md object-cover bg-neutral-100"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                        {product.name}
                      </h4>
                      <div className="text-[11px] text-neutral-400">
                        {product.categoryLabel} · <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold">${product.price}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-500">
              No matching pieces found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
