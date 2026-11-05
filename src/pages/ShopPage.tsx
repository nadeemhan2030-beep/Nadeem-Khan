import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, activeCategory, setActiveCategory, setCurrentPage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(650);

  const categories = [
    { id: 'all', label: 'All Catalog', count: products.length },
    { id: 'audio', label: 'Audio & Acoustics', count: products.filter(p => p.category === 'audio').length },
    { id: 'objects', label: 'Horology & Objects', count: products.filter(p => p.category === 'objects').length },
    { id: 'apparel', label: 'Apparel & Knitwear', count: products.filter(p => p.category === 'apparel').length },
    { id: 'home', label: 'Home & Living', count: products.filter(p => p.category === 'home').length }
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }
        if (inStockOnly && !product.inStock) {
          return false;
        }
        if (product.price > maxPrice) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.categoryLabel.toLowerCase().includes(q);
          return matchName || matchDesc || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategory, inStockOnly, maxPrice, searchQuery, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <button
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-neutral-900 dark:text-white font-medium">Shop</span>
        {activeCategory !== 'all' && (
          <>
            <span>/</span>
            <span className="text-neutral-600 dark:text-neutral-300">{activeCategoryObj?.label}</span>
          </>
        )}
      </div>

      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial">
            {activeCategory === 'all' ? 'The Permanent Catalog' : activeCategoryObj?.label}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            Showing <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">{filteredProducts.length}</span> curated works
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audio, watches, knitwear..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-8 space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="font-mono text-[10px] opacity-70">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Granular Filters: Max Price, In Stock, Sorting */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Price Range Slider */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 font-medium">Max Price:</span>
            <input
              type="range"
              min="90"
              max="650"
              step="10"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-28 sm:w-36 accent-neutral-950 dark:accent-white cursor-pointer"
            />
            <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
              ${maxPrice} USD
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* In-Stock Filter */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-neutral-950 focus:ring-0"
              />
              <span>In stock only</span>
            </label>

            <span className="text-neutral-300 dark:text-neutral-700">|</span>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-neutral-900 dark:text-white font-medium border-none focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 space-y-3">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No products match your current filters
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your price ceiling, resetting your search query, or selecting another department.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setInStockOnly(false);
              setMaxPrice(650);
            }}
            className="mt-2 px-4 py-2 text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
