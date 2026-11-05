import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  Printer,
  ChevronRight,
  Smartphone,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    currentUser,
    createOrder,
    setIsOrdersModalOpen,
    addSavedCard,
    showToast
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'confirmed'>('shipping');

  // Shipping Form State
  const defaultAddr = currentUser?.addresses?.[0];
  const [shippingAddress, setShippingAddress] = useState<Address>({
    id: defaultAddr?.id || 'addr-new',
    fullName: defaultAddr?.fullName || currentUser?.name || 'Alex Morgan',
    streetAddress: defaultAddr?.streetAddress || '742 Evergreen Terrace',
    apartment: defaultAddr?.apartment || 'Suite 4B',
    city: defaultAddr?.city || 'San Francisco',
    state: defaultAddr?.state || 'CA',
    postalCode: defaultAddr?.postalCode || '94110',
    country: defaultAddr?.country || 'United States',
    phone: defaultAddr?.phone || '+1 (415) 890-2134'
  });

  const [email, setEmail] = useState(currentUser?.email || 'alex.morgan@designstudio.io');

  // Shipping Method
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Ground Delivery',
      price: cartShipping,
      estimatedDays: '3–5 Business Days'
    },
    {
      id: 'express',
      name: 'DHL Express Courier',
      price: 24,
      estimatedDays: '1–2 Business Days'
    },
    {
      id: 'priority',
      name: 'FedEx Priority Overnight',
      price: 38,
      estimatedDays: 'Next Business Day'
    }
  ];
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);

  // Payment State
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'paypal' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || 'Alex Morgan');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  // Cash on Delivery OTP simulation
  const [codPhone, setCodPhone] = useState(shippingAddress.phone);
  const [codCode, setCodCode] = useState('8492');
  const [codInput, setCodInput] = useState('');
  const [isCodCodeSent, setIsCodCodeSent] = useState(false);

  // Processing Animation Status State
  const [processingStage, setProcessingStage] = useState('Encrypting transaction via 256-bit TLS...');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  // Format Card Number (grouped in 4s)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      setExpiry(`${raw.substring(0, 2)}/${raw.substring(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  // Card brand detection
  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5')) return 'mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'amex';
    return 'generic';
  };

  // 1-Click Test Card Fill
  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardholderName(currentUser?.name || 'Alex Morgan');
    setExpiry('12/28');
    setCvc('123');
    showToast('Populated with secure test card details.');
  };

  // Final Total with selected shipping option
  const adjustedShippingFee = selectedShippingMethod.price;
  const finalTotal = Math.max(0, Math.round((cartSubtotal - cartDiscount + adjustedShippingFee + cartTax) * 100) / 100);

  // Advance to Payment
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.streetAddress || !shippingAddress.postalCode) {
      showToast('Please complete all required shipping fields.', 'error');
      return;
    }
    setStep('payment');
  };

  // Execute Payment
  const handleProcessPayment = () => {
    if (paymentType === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        showToast('Please enter a valid card number (or click "Use Test Card").', 'error');
        return;
      }
      if (!expiry || !cvc) {
        showToast('Please enter expiry date and CVC.', 'error');
        return;
      }
    }

    if (paymentType === 'cod' && !isCodCodeSent) {
      setIsCodCodeSent(true);
      showToast(`Verification code sent to ${codPhone}. Demo code: 8492`);
      return;
    }

    if (paymentType === 'cod' && codInput !== codCode) {
      showToast('Invalid verification code. Please enter 8492.', 'error');
      return;
    }

    // Launch Processing simulation
    setStep('processing');
    setProcessingStage('Encrypting transaction payload with 256-bit TLS...');

    setTimeout(() => {
      setProcessingStage('Connecting to issuing bank via 3D Secure 2.0...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Authorizing payment and reserving inventory...');
    }, 1800);

    setTimeout(() => {
      // Determine payment method label
      let paymentDetails = 'Credit Card ending in 4242';
      if (paymentType === 'card') {
        const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
        const brand = detectCardBrand(cardNumber);
        paymentDetails = `${brand.toUpperCase()} ending in ${last4}`;
        if (saveCardForFuture) {
          const [m, y] = expiry.split('/');
          addSavedCard({
            brand,
            last4,
            expMonth: m || '12',
            expYear: y || '28',
            cardholderName
          });
        }
      } else if (paymentType === 'apple_pay') {
        paymentDetails = 'Apple Pay (Instant Biometric)';
      } else if (paymentType === 'paypal') {
        paymentDetails = 'PayPal Express (Authorized)';
      } else if (paymentType === 'cod') {
        paymentDetails = 'Cash on Delivery (Verified by SMS)';
      }

      const newOrder = createOrder({
        items: cart,
        shippingAddress,
        shippingMethod: selectedShippingMethod,
        paymentMethod: {
          type: paymentType,
          details: paymentDetails
        },
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        shippingFee: adjustedShippingFee,
        total: finalTotal
      });

      setConfirmedOrder(newOrder);
      setStep('confirmed');
      showToast('Payment successful! Your order has been placed.');
    }, 2800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleFinishAndTrack = () => {
    setIsCheckoutOpen(false);
    setIsOrdersModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col my-auto max-h-[95vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg font-bold text-neutral-950 dark:text-white">
              Nadeem &amp; Co. Checkout
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Multi-Step Progress Tracker */}
        {step !== 'confirmed' && step !== 'processing' && (
          <div className="px-6 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'shipping'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-emerald-600 text-white'
              }`}>
                {step === 'shipping' ? '1' : '✓'}
              </span>
              <span className={step === 'shipping' ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500'}>
                Shipping Details
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'payment'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              }`}>
                2
              </span>
              <span className={step === 'payment' ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-400'}>
                Payment &amp; Review
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          
          {/* STEP 1: Shipping Address & Method */}
          {step === 'shipping' && (
            <form onSubmit={handleContinueToPayment} className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                  1. Contact &amp; Shipping Destination
                </h3>
                <p className="text-xs text-neutral-500">Enter where we should deliver your curated pieces.</p>
              </div>

              {currentUser && currentUser.addresses.length > 0 && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">Saved Address:</span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {currentUser.addresses[0].streetAddress}, {currentUser.addresses[0].city}, {currentUser.addresses[0].postalCode}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Active Profile</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.streetAddress}
                    onChange={e => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                    placeholder="House / Street name and number"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Apartment, Suite (optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={e => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">ZIP / Postal</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method Selector */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Select Delivery Courier Speed
                </h4>
                <div className="space-y-2">
                  {shippingMethods.map(method => (
                    <label
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedShippingMethod.id === method.id
                          ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={selectedShippingMethod.id === method.id}
                          onChange={() => setSelectedShippingMethod(method)}
                          className="w-4 h-4 text-neutral-950 focus:ring-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{method.name}</p>
                          <p className="text-[11px] text-neutral-500">{method.estimatedDays}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-white tabular-nums">
                        {method.price === 0 ? 'Complimentary' : `$${method.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Continue to Payment &amp; Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway Selection & Details */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    2. Select Payment System
                  </h3>
                  <p className="text-xs text-neutral-500">Secure end-to-end tokenized transaction.</p>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to shipping
                </button>
              </div>

              {/* Payment Gateway Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    paymentType === 'card'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    paymentType === 'apple_pay'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('paypal')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    paymentType === 'paypal'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    paymentType === 'cod'
                      ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Pay on Delivery</span>
                </button>
              </div>

              {/* CARD PAYMENT INTERFACE */}
              {paymentType === 'card' && (
                <div className="space-y-4">
                  {/* Interactive Card Visual Preview */}
                  <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl p-6 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 bg-amber-400/80 rounded-md" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Nadeem &amp; Co. Encrypted</span>
                      </div>
                      <span className="font-mono text-sm uppercase tracking-wider font-bold">
                        {detectCardBrand(cardNumber)}
                      </span>
                    </div>

                    <div className="font-mono text-lg tracking-widest text-neutral-100">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Cardholder</span>
                        <span className="font-medium tracking-wide uppercase truncate max-w-[170px] block">
                          {cardholderName || 'Alex Morgan'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Expires</span>
                        <span className="font-mono">{expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Test Card Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline font-mono flex items-center gap-1"
                    >
                      ⚡ Autofill Demo Test Card
                    </button>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={e => handleCardNumberChange(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden focus:border-neutral-950"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={cardholderName}
                        onChange={e => setCardholderName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={expiry}
                          onChange={e => handleExpiryChange(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-center focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cvc}
                          onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-center focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCardForFuture}
                      onChange={e => setSaveCardForFuture(e.target.checked)}
                      className="rounded text-neutral-950 focus:ring-0"
                    />
                    <span>Save card securely for future purchases</span>
                  </label>
                </div>
              )}

              {/* APPLE PAY / GOOGLE PAY INTERFACE */}
              {paymentType === 'apple_pay' && (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-3">
                  <Smartphone className="w-8 h-8 mx-auto text-neutral-900 dark:text-white" />
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Apple Pay &amp; Google Pay Ready</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Complete your purchase instantly with Face ID, Touch ID, or your biometric passkey.
                  </p>
                </div>
              )}

              {/* PAYPAL INTERFACE */}
              {paymentType === 'paypal' && (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-3">
                  <div className="text-xl font-bold font-editorial text-blue-600">PayPal</div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">One-Touch PayPal Checkout</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    You will be directed to PayPal to authorize the payment of ${finalTotal.toFixed(2)} USD.
                  </p>
                </div>
              )}

              {/* CASH ON DELIVERY INTERFACE */}
              {paymentType === 'cod' && (
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-3 text-xs">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Pay upon Delivery to Courier
                  </h4>
                  <p className="text-neutral-500 leading-relaxed">
                    You can pay the courier via Cash, Mobile POS card terminal, or instant QR transfer upon physical delivery.
                  </p>
                  
                  {isCodCodeSent ? (
                    <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                        Verification SMS code sent! Enter demo code <span className="font-mono font-bold">8492</span>:
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={codInput}
                        onChange={e => setCodInput(e.target.value)}
                        className="w-48 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-center text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={codPhone}
                        onChange={e => setCodPhone(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs"
                      />
                      <span className="text-[11px] text-neutral-400">Mobile for courier SMS</span>
                    </div>
                  )}
                </div>
              )}

              {/* Order Summary & Final Authorize Button */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-neutral-500">
                    <span>Items Subtotal</span>
                    <span className="tabular-nums">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="tabular-nums">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping ({selectedShippingMethod.name})</span>
                    <span className="tabular-nums">
                      {adjustedShippingFee === 0 ? 'Complimentary' : `$${adjustedShippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Tax (8.25%)</span>
                    <span className="tabular-nums">${cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-neutral-950 dark:text-white pt-1 border-t border-neutral-200 dark:border-neutral-700 font-sans">
                    <span>Amount to Authorize</span>
                    <span className="font-mono tabular-nums">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize &amp; Pay ${finalTotal.toFixed(2)} USD</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Animated Gateway Processing */}
          {step === 'processing' && (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-200 dark:border-neutral-800 border-t-neutral-950 dark:border-t-white animate-spin" />
                <Lock className="w-6 h-6 text-neutral-700 dark:text-neutral-300 absolute inset-0 m-auto" />
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Processing Secure Payment
                </h4>
                <p className="text-xs text-neutral-500 font-mono animate-pulse">
                  {processingStage}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-[11px] text-neutral-400 max-w-xs">
                Do not refresh the browser. Your transaction is being authenticated with your bank.
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed & Receipt View */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Success Banner */}
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-editorial">
                  Order Confirmed
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Thank you for your purchase. We are preparing your pieces for dispatch.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Order Ref: {confirmedOrder.orderNumber}
                  </span>
                </div>
              </div>

              {/* Delivery Timeline Tracker */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white">Delivery Timeline</span>
                  <span className="font-mono text-neutral-500">Est. {confirmedOrder.estimatedDelivery}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-600" />
                    <span className="font-medium text-neutral-900 dark:text-white">Confirmed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Packaging</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <span className="text-neutral-400">Shipped</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <span className="text-neutral-400">Delivered</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>Carrier: {confirmedOrder.carrier}</span>
                  <span className="font-mono">Tracking: {confirmedOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Itemized Order Receipt */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-900 dark:text-white">Receipt Summary</span>
                  <button
                    onClick={handlePrintReceipt}
                    className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {confirmedOrder.items.map(item => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-neutral-900 dark:text-white">{item.product.name}</span>
                        <div className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant.name}` : ''}
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono space-y-1">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>${confirmedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {confirmedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-${confirmedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span>{confirmedOrder.shippingFee === 0 ? 'Free' : `$${confirmedOrder.shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Sales Tax</span>
                    <span>${confirmedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-neutral-950 dark:text-white pt-1 border-t border-neutral-200 dark:border-neutral-700 font-sans">
                    <span>Total Paid</span>
                    <span className="font-mono">${confirmedOrder.total.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-neutral-500">
                  <p><span className="font-semibold text-neutral-700 dark:text-neutral-300">Payment:</span> {confirmedOrder.paymentMethod.details}</p>
                  <p><span className="font-semibold text-neutral-700 dark:text-neutral-300">Ship to:</span> {confirmedOrder.shippingAddress.fullName}, {confirmedOrder.shippingAddress.streetAddress}, {confirmedOrder.shippingAddress.city} {confirmedOrder.shippingAddress.postalCode}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleFinishAndTrack}
                  className="flex-1 py-3 px-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                  View in My Orders
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-center"
                >
                  Return to Store
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
