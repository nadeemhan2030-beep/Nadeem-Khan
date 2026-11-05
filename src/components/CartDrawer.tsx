import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentPage
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Slide-over panel */}
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-950 dark:text-white font-editorial tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs font-mono tabular-nums text-neutral-500">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 px-6 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs">
            {amountNeeded > 0 ? (
              <div className="space-y-1.5">
                <p className="text-neutral-600 dark:text-neutral-300">
                  Add <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">${amountNeeded}</span> more for <span className="font-medium text-neutral-900 dark:text-white">Complimentary Express Shipping</span>.
                </p>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You unlocked Complimentary Express Delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-500 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                        {item.selectedVariant && <span>{item.selectedVariant.name}</span>}
                        {item.selectedVariant && item.selectedSize && <span>·</span>}
                        {item.selectedSize && <span>Size {item.selectedSize}</span>}
                      </div>
                    </div>

                    {/* Stepper & Line Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono tabular-nums text-xs font-medium text-neutral-900 dark:text-neutral-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-neutral-950 dark:text-neutral-50 tabular-nums">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Your bag is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs">Explore our catalog to find studio acoustic devices and artisanal objects.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-4">
              
              {/* Promo Code Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-semibold">{appliedCoupon.code}</span>
                      <span className="text-[11px] opacity-80">({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-neutral-500 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 uppercase placeholder:normal-case focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
                {!appliedCoupon && (
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Try codes <span className="font-mono font-semibold text-neutral-600 dark:text-neutral-300 cursor-pointer" onClick={() => setCouponInput('WELCOME10')}>WELCOME10</span> or <span className="font-mono font-semibold text-neutral-600 dark:text-neutral-300 cursor-pointer" onClick={() => setCouponInput('NADEEM25')}>NADEEM25</span>
                  </p>
                )}
              </div>

              {/* Financial Calculation Lines */}
              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-neutral-900 dark:text-neutral-100">${cartSubtotal.toFixed(2)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="tabular-nums">-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums text-neutral-900 dark:text-neutral-100">
                    {cartShipping === 0 ? 'Complimentary' : `$${cartShipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span className="tabular-nums text-neutral-900 dark:text-neutral-100">${cartTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-sm font-semibold text-neutral-950 dark:text-white">
                  <span className="font-sans">Total</span>
                  <span className="tabular-nums">${cartTotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-sm group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
