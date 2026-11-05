import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, Tag, X, Sparkles, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-neutral-950 dark:text-white">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our permanent collection of studio acoustics, aerospace titanium chronographs, and Italian textiles.
        </p>
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-4 px-6 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review your items and proceed to secure checkout.
        </p>
      </div>

      {/* Free Shipping Tracker */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
        {amountNeeded > 0 ? (
          <>
            <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
              <span>Add <strong className="font-mono tabular-nums">${amountNeeded} USD</strong> more to unlock <strong>Complimentary Express Delivery</strong></span>
              <span className="font-mono text-neutral-500">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-950 dark:bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>You have unlocked Complimentary Express Delivery!</span>
          </div>
        )}
      </div>

      {/* Two Column Layout: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-xs">
          {cart.map(item => (
            <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span>{item.product.categoryLabel}</span>
                    {item.selectedVariant && (
                      <>
                        <span>·</span>
                        <span>{item.selectedVariant.name}</span>
                      </>
                    )}
                    {item.selectedSize && (
                      <>
                        <span>·</span>
                        <span>Size {item.selectedSize}</span>
                      </>
                    )}
                  </div>
                  <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300 block mt-1">
                    ${item.product.price} USD each
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono tabular-nums text-xs font-semibold text-neutral-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-mono text-sm font-bold text-neutral-950 dark:text-white tabular-nums w-20 text-right">
                  ${item.product.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove piece"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono font-semibold">{appliedCoupon.code}</span>
                  <span className="text-[11px] opacity-80">({appliedCoupon.description})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-neutral-400 hover:text-rose-600"
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
                  placeholder="Promo code (WELCOME10)"
                  className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 uppercase placeholder:normal-case focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-medium bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-lg hover:opacity-90"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-neutral-900 dark:text-white tabular-nums">${cartSubtotal.toFixed(2)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Promotional Discount</span>
                <span className="tabular-nums">-${cartDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-neutral-900 dark:text-white tabular-nums">
                {cartShipping === 0 ? 'Complimentary' : `$${cartShipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (8.25%)</span>
              <span className="text-neutral-900 dark:text-white tabular-nums">${cartTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-950 dark:text-white font-sans">
              <span>Total Due</span>
              <span className="font-mono tabular-nums">${cartTotal.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentPage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
