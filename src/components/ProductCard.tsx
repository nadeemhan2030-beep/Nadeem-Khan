import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, toggleWishlist, isInWishlist, navigateToProduct } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0], product.sizes?.[0]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateToProduct(product)}
      className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Slot (65-70% height) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/80">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400 bg-neutral-100 dark:bg-neutral-800 text-center">
            <span className="text-xs uppercase tracking-wider font-medium">{product.categoryLabel}</span>
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-1">{product.name}</span>
          </div>
        )}

        {/* Quiet editorial text indicators - NEVER pill badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase text-neutral-900 bg-white/90 dark:bg-neutral-900/90 dark:text-neutral-100 px-2 py-0.5 rounded backdrop-blur-xs">
          {product.isNewArrival ? (
            <span>New Release</span>
          ) : product.originalPrice ? (
            <span>Special Value</span>
          ) : (
            <span>{product.categoryLabel.split(' ')[0]}</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 dark:bg-neutral-900/90 dark:text-rose-400 shadow-sm'
              : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 opacity-90 group-hover:opacity-100'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.inStock ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata with subtle dot separator */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">★ {product.rating.toFixed(1)}</span>
            <span className="text-[11px] opacity-80">({product.reviewCount})</span>
          </div>

          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Variants line */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-semibold text-neutral-950 dark:text-neutral-50 tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1">
              {product.variants.slice(0, 3).map(v => (
                <span
                  key={v.id}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-neutral-700"
                  style={{ backgroundColor: v.colorHex || '#999' }}
                  title={v.name}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[10px] text-neutral-400 font-mono">+{product.variants.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
