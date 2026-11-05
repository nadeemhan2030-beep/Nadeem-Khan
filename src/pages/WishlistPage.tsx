import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
    setCurrentPage,
    navigateToProduct
  } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
          Saved Wishlist
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review your private collection of saved pieces ({wishlist.length} items).
        </p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col justify-between shadow-xs group"
            >
              <div
                onClick={() => navigateToProduct(product)}
                className="cursor-pointer"
              >
                <div className="relative aspect-4/3 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 text-rose-500 hover:scale-110 transition-transform"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-neutral-400 block">{product.categoryLabel}</span>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {product.name}
                  </h3>
                  <div className="font-mono text-sm font-bold text-neutral-950 dark:text-white">
                    ${product.price} USD
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(product, 1, product.variants?.[0], product.sizes?.[0]);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-2 px-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 space-y-3">
          <Heart className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click the heart icon on any piece across our collection to save it to your wishlist.
          </p>
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-2 px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90"
          >
            Explore the Collection
          </button>
        </div>
      )}

    </div>
  );
};
