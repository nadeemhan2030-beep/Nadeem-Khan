import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Variant, Review, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  Shield,
  RotateCcw,
  Truck,
  ArrowLeft,
  Share2
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setCurrentPage,
    currentUser,
    showToast
  } = useStore();

  // Fallback to first product if none selected
  const activeProduct: Product = selectedProduct || products[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(activeProduct.variants?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(activeProduct.sizes?.[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Customer reviews state
  const [localReviews, setLocalReviews] = useState<Review[]>(activeProduct.reviews || []);
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (activeProduct) {
      setQuantity(1);
      setSelectedVariant(activeProduct.variants?.[0]);
      setSelectedSize(activeProduct.sizes?.[0]);
      setLocalReviews(activeProduct.reviews || []);
      setActiveTab('overview');
    }
  }, [activeProduct]);

  const isFavorited = isInWishlist(activeProduct.id);

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedVariant, selectedSize);
    setIsCartOpen(true);
  };

  const handleInstantBuy = () => {
    addToCart(activeProduct, quantity, selectedVariant, selectedSize);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: currentUser?.name || 'Verified Customer',
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment.trim(),
      verified: true
    };

    setLocalReviews(prev => [newReview, ...prev]);
    setReviewComment('');
    showToast('Your verified impression has been submitted.');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.');
    }
  };

  // Related products from same category or featured
  const relatedProducts = products
    .filter(p => p.id !== activeProduct.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
      
      {/* Breadcrumb & Back Button */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </button>
          <span>/</span>
          <span className="text-neutral-500">{activeProduct.categoryLabel}</span>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]">
            {activeProduct.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg flex items-center gap-1 text-xs"
          title="Share piece"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Gallery & Guarantees */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-md">
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 backdrop-blur-xs">
              {activeProduct.categoryLabel}
            </div>
          </div>

          {/* Value Strips */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck className="w-4 h-4 text-neutral-900 dark:text-white" />
              <span className="font-semibold text-neutral-900 dark:text-white">Complimentary Delivery</span>
              <span className="text-[11px] text-neutral-400">On all orders over $150</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-neutral-900 dark:text-white" />
              <span className="font-semibold text-neutral-900 dark:text-white">30-Day In-Home Trial</span>
              <span className="text-[11px] text-neutral-400">Risk-free return window</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <Shield className="w-4 h-4 text-neutral-900 dark:text-white" />
              <span className="font-semibold text-neutral-900 dark:text-white">Two-Year Warranty</span>
              <span className="text-[11px] text-neutral-400">Comprehensive hardware care</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col space-y-6 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>{activeProduct.categoryLabel}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                  {activeProduct.rating.toFixed(1)}
                </span>
                <span>({localReviews.length || activeProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial">
              {activeProduct.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-3 font-mono">
              <span className="text-2xl font-bold text-neutral-950 dark:text-white tabular-nums">
                ${activeProduct.price} USD
              </span>
              {activeProduct.originalPrice && (
                <span className="text-sm text-neutral-400 line-through tabular-nums">
                  ${activeProduct.originalPrice} USD
                </span>
              )}
              {activeProduct.inStock && (
                <span className="text-xs font-sans text-emerald-600 dark:text-emerald-400 ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {activeProduct.stockCount} in stock
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {activeProduct.description}
          </p>

          {/* Color Finish Picker */}
          {activeProduct.variants && activeProduct.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Color Finish:</span>
                <span className="text-neutral-500">{selectedVariant?.name || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-2">
                {activeProduct.variants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative p-1 rounded-full border transition-all ${
                        isSelected
                          ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-950/20 dark:ring-white/20'
                          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                      title={variant.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-xs"
                        style={{ backgroundColor: variant.colorHex || '#555' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Picker (for apparel) */}
          {activeProduct.sizes && activeProduct.sizes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Size:</span>
                <span className="text-neutral-500">{selectedSize || 'Select size'}</span>
              </div>
              <div className="flex items-center gap-2">
                {activeProduct.sizes.map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono tabular-nums text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(activeProduct.stockCount, quantity + 1))}
                  className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                  disabled={quantity >= activeProduct.stockCount}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={!activeProduct.inStock}
                className="flex-1 py-3 px-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm disabled:opacity-50"
              >
                Add to Bag
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(activeProduct.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  isFavorited
                    ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Checkout Button */}
            <button
              onClick={handleInstantBuy}
              disabled={!activeProduct.inStock}
              className="w-full py-3 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Buy Now with Express Checkout
            </button>
          </div>

        </div>
      </div>

      {/* Tabs: Specifications & Customer Impressions */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 relative ${
              activeTab === 'overview'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Engineering Highlights
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 relative ${
              activeTab === 'specs'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Technical Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 relative ${
              activeTab === 'reviews'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Client Reviews ({localReviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>
        </div>

        <div className="pt-6 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {activeTab === 'overview' && (
            <ul className="space-y-2.5 list-disc list-inside">
              {activeProduct.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          )}

          {activeTab === 'specs' && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(activeProduct.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <dt className="text-neutral-400 font-medium">{key}</dt>
                  <dd className="text-neutral-900 dark:text-neutral-100 font-mono text-right">{val}</dd>
                </div>
              ))}
            </dl>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Reviews List */}
              <div className="space-y-4">
                {localReviews.length > 0 ? (
                  localReviews.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{r.author}</span>
                        <span className="text-[11px] text-neutral-400 font-mono">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                            }`}
                          />
                        ))}
                        {r.verified && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 ml-2 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Verified Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 italic">No reviews published yet for this piece.</p>
                )}
              </div>

              {/* Submit Review */}
              <form onSubmit={handleAddReview} className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-semibold text-neutral-900 dark:text-white">Leave an Impression</h4>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400' : 'text-neutral-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Share details on acoustic clarity, fit, material tactile quality..."
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Publish Impression
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Pieces Grid */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial">
          Complementary Nadeem &amp; Co. Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};
