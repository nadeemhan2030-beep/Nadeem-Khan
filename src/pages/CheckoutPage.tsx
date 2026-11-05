import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    currentUser,
    createOrder,
    setCurrentPage,
    showToast
  } = useStore();

  const defaultAddr = currentUser?.addresses?.[0];

  // Customer & Shipping Form
  const [fullName, setFullName] = useState(defaultAddr?.fullName || currentUser?.name || 'Alex Morgan');
  const [email, setEmail] = useState(currentUser?.email || 'alex.morgan@designstudio.io');
  const [phone, setPhone] = useState(defaultAddr?.phone || '+1 (415) 890-2134');
  const [streetAddress, setStreetAddress] = useState(defaultAddr?.streetAddress || '742 Evergreen Terrace');
  const [apartment, setApartment] = useState(defaultAddr?.apartment || 'Suite 4B');
  const [city, setCity] = useState(defaultAddr?.city || 'San Francisco');
  const [state, setState] = useState(defaultAddr?.state || 'CA');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '94110');
  const [country] = useState('United States');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Shipping Courier Option
  const shippingOptions = [
    { id: 'standard', name: 'Standard Courier', price: cartShipping, days: '3–5 Business Days' },
    { id: 'express', name: 'DHL Express Global', price: 24, days: '1–2 Business Days' },
    { id: 'priority', name: 'FedEx Priority Air', price: 38, days: 'Next Business Day' }
  ];
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  // Payment Method: Default to Cash on Delivery (Demo Checkout) as requested
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'apple_pay'>('cod');

  // Demo Card fields (if user chooses card)
  const [demoCardNum, setDemoCardNum] = useState('4242 •••• •••• 4242');
  const [demoExp, setDemoExp] = useState('12/28');
  const [demoCvc, setDemoCvc] = useState('123');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-editorial text-neutral-950 dark:text-white">
          No items in bag to checkout
        </h2>
        <p className="text-xs text-neutral-500">
          Please add at least one piece to your shopping bag before continuing.
        </p>
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const finalTotal = Math.max(
    0,
    Math.round((cartSubtotal - cartDiscount + selectedShipping.price + cartTax) * 100) / 100
  );

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!streetAddress.trim()) errs.streetAddress = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State / Province is required';
    if (!postalCode.trim()) errs.postalCode = 'Postal code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName,
      streetAddress,
      apartment,
      city,
      state,
      postalCode,
      country,
      phone
    };

    let paymentDetails = 'Cash on Delivery (Demo Mode)';
    if (paymentMethod === 'card') {
      paymentDetails = 'Demo Visa (ending in 4242)';
    } else if (paymentMethod === 'apple_pay') {
      paymentDetails = 'Apple Pay (Demo Biometric)';
    }

    setTimeout(() => {
      createOrder({
        items: cart,
        shippingAddress,
        shippingMethod: {
          id: selectedShipping.id,
          name: selectedShipping.name,
          price: selectedShipping.price,
          estimatedDays: selectedShipping.days
        },
        paymentMethod: {
          type: paymentMethod,
          details: paymentDetails
        },
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        shippingFee: selectedShipping.price,
        total: finalTotal
      });

      setIsSubmitting(false);
      setCurrentPage('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => {
              setCurrentPage('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shopping Bag
          </button>
          <h1 className="text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
            Checkout
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Complete your shipping address and select your payment option.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>Demo Checkout Mode</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Details, Address, Shipping, Payment */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Customer Details & Shipping Address */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
              1. Customer &amp; Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                    errors.fullName ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                    errors.email ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  placeholder="Street and house number"
                  onChange={e => {
                    setStreetAddress(e.target.value);
                    if (errors.streetAddress) setErrors({ ...errors, streetAddress: '' });
                  }}
                  className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                    errors.streetAddress ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                {errors.streetAddress && <p className="text-[11px] text-rose-500 mt-1">{errors.streetAddress}</p>}
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Apartment, Suite (Optional)
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                    errors.phone ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => {
                    setCity(e.target.value);
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                    errors.city ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => {
                      setState(e.target.value);
                      if (errors.state) setErrors({ ...errors, state: '' });
                    }}
                    className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden ${
                      errors.state ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  />
                  {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => {
                      setPostalCode(e.target.value);
                      if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                    }}
                    className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden ${
                      errors.postalCode ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  />
                  {errors.postalCode && <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Courier Speed */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
              2. Delivery Courier Speed
            </h2>
            <div className="space-y-2.5">
              {shippingOptions.map(option => (
                <label
                  key={option.id}
                  onClick={() => setSelectedShipping(option)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedShipping.id === option.id
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_speed"
                      checked={selectedShipping.id === option.id}
                      onChange={() => setSelectedShipping(option)}
                      className="w-4 h-4 text-neutral-950 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">{option.name}</p>
                      <p className="text-[11px] text-neutral-500">{option.days}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-white tabular-nums">
                    {option.price === 0 ? 'Complimentary' : `$${option.price} USD`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Options (Featuring Cash on Delivery Demo) */}
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
                3. Payment Method
              </h2>
              <span className="text-[11px] font-mono text-neutral-400">Demo Environment</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: Cash on Delivery (Featured) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Truck className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-80">
                    Recommended
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold">Cash on Delivery</div>
                  <div className="text-[11px] opacity-75">Pay courier upon arrival</div>
                </div>
              </button>

              {/* Option 2: Demo Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <div>
                  <div className="text-xs font-semibold">Demo Test Card</div>
                  <div className="text-[11px] opacity-75">Simulated tokenized card</div>
                </div>
              </button>

              {/* Option 3: Apple Pay Demo */}
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <div>
                  <div className="text-xs font-semibold">Apple Pay (Demo)</div>
                  <div className="text-[11px] opacity-75">Instant authorization</div>
                </div>
              </button>
            </div>

            {/* Cash on Delivery Notice */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery Demo Checkout Active</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                  No payment details or real card numbers are collected. You will receive an instant unique order ID (`#ORD-XXXXX`), an itemized receipt, and tracking details. You can pay the courier via Cash or POS terminal when package arrives.
                </p>
              </div>
            )}

            {/* Demo Card Notice */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs space-y-3">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Demo Card Simulation (No Real Card Data Collected)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px]">Card</span>
                    <span>{demoCardNum}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px]">Exp</span>
                    <span>{demoExp}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px]">CVC</span>
                    <span>{demoCvc}</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Click below to confirm your demo purchase and generate an official receipt.
                </p>
              </div>
            )}

            {/* Apple Pay Notice */}
            {paymentMethod === 'apple_pay' && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs space-y-1 text-center">
                <p className="font-semibold text-neutral-900 dark:text-white">Instant Demo Authorization</p>
                <p className="text-[11px] text-neutral-500">Biometric token simulation ready.</p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs sticky top-24">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
            Order Review
          </h2>

          {/* Items Summary */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-md object-cover bg-neutral-100 dark:bg-neutral-800"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant.name}` : ''}
                    </span>
                  </div>
                </div>
                <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                  ${item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums text-neutral-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span className="tabular-nums">-${cartDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping ({selectedShipping.name})</span>
              <span className="tabular-nums text-neutral-900 dark:text-white">
                {selectedShipping.price === 0 ? 'Complimentary' : `$${selectedShipping.price.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Sales Tax (8.25%)</span>
              <span className="tabular-nums text-neutral-900 dark:text-white">${cartTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-950 dark:text-white font-sans">
              <span>Total Due</span>
              <span className="font-mono tabular-nums">${finalTotal.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Place Order (${finalTotal.toFixed(2)} USD)</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
            By clicking &quot;Place Order&quot;, your order will be instantly confirmed in Demo Mode and registered with a unique tracking code.
          </p>
        </div>

      </form>
    </div>
  );
};
