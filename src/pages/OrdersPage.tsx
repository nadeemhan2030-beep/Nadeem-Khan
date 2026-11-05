import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  CreditCard,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const {
    orders,
    cancelOrder,
    getOrderById,
    currentUser,
    setCurrentPage,
    navigateToProduct
  } = useStore();

  const [activeTab, setActiveTab] = useState<'history' | 'tracking' | 'wallet'>('history');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(orders[0] || null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const match = getOrderById(trackingInput);
    setTrackedOrder(match || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
          Orders &amp; Package Tracking
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review your previous commissions, download receipts, and track live courier shipments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 relative flex items-center gap-2 ${
            activeTab === 'history'
              ? 'text-neutral-950 dark:text-white font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Order History ({orders.length})</span>
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`pb-3 relative flex items-center gap-2 ${
            activeTab === 'tracking'
              ? 'text-neutral-950 dark:text-white font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Live Demo Order Tracking</span>
          {activeTab === 'tracking' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`pb-3 relative flex items-center gap-2 ${
            activeTab === 'wallet'
              ? 'text-neutral-950 dark:text-white font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses &amp; Cards</span>
          {activeTab === 'wallet' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
          )}
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map(order => (
              <div
                key={order.id}
                className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-neutral-950 dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className="text-neutral-400 font-mono">
                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Carrier: {order.carrier} · Tracking: <span className="font-mono">{order.trackingNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 font-medium">
                      {order.status === 'processing' && (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Preparing Shipment
                        </span>
                      )}
                      {order.status === 'in_transit' && (
                        <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> In Transit
                        </span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="text-rose-500 font-medium">Cancelled</span>
                      )}
                    </div>

                    <span className="font-mono text-sm font-bold text-neutral-950 dark:text-white tabular-nums">
                      ${order.total.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      onClick={() => navigateToProduct(item.product)}
                      className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                        <div className="text-xs">
                          <h4 className="font-semibold text-neutral-900 dark:text-white hover:underline">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant.name}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                        ${item.product.price * item.quantity} USD
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-neutral-500">
                    Delivering to: <span className="font-medium text-neutral-800 dark:text-neutral-200">{order.shippingAddress.fullName}</span>, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackedOrder(order);
                        setActiveTab('tracking');
                      }}
                      className="px-3.5 py-1.5 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Track Package
                    </button>

                    {order.status === 'processing' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 space-y-3">
              <Package className="w-10 h-10 mx-auto text-neutral-400" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                No orders registered yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore our catalog to commission studio acoustics and handcrafted pieces.
              </p>
              <button
                onClick={() => {
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90"
              >
                Explore Collection
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE ORDER TRACKING */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                placeholder="Enter Order # (e.g. ORD-89211) or Tracking #..."
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono uppercase text-neutral-900 dark:text-white placeholder:normal-case focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90"
            >
              Track Order
            </button>
          </form>

          {trackedOrder ? (
            <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">
                    Tracking Manifest
                  </span>
                  <h3 className="text-lg font-bold font-mono text-neutral-950 dark:text-white">
                    {trackedOrder.orderNumber}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Estimated Arrival</span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {trackedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Visual 4-Step Progress Line */}
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-2 rounded-full bg-emerald-600" />
                  <div className={`h-2 rounded-full ${
                    trackedOrder.status !== 'processing' ? 'bg-emerald-600' : 'bg-emerald-600/40 animate-pulse'
                  }`} />
                  <div className={`h-2 rounded-full ${
                    trackedOrder.status === 'in_transit' || trackedOrder.status === 'delivered'
                      ? 'bg-emerald-600'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  }`} />
                  <div className={`h-2 rounded-full ${
                    trackedOrder.status === 'delivered' ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`} />
                </div>

                <div className="grid grid-cols-4 text-center text-[10px] text-neutral-500 font-medium">
                  <span className="text-neutral-900 dark:text-white font-semibold">1. Confirmed</span>
                  <span className={trackedOrder.status === 'processing' ? 'text-emerald-600 font-bold' : 'text-neutral-900 dark:text-white'}>
                    2. Packaging
                  </span>
                  <span className={trackedOrder.status === 'in_transit' ? 'text-sky-600 font-bold' : ''}>
                    3. Courier Transit
                  </span>
                  <span className={trackedOrder.status === 'delivered' ? 'text-emerald-600 font-bold' : ''}>
                    4. Delivered
                  </span>
                </div>
              </div>

              {/* Waybill Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Carrier</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{trackedOrder.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Tracking ID</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{trackedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Destination</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.country}
                  </span>
                </div>
              </div>

              {/* Items in this parcel */}
              <div className="space-y-2 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                  Parcel Contents ({trackedOrder.items.length})
                </span>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {trackedOrder.items.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-md object-cover bg-neutral-100"
                        />
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white">{item.product.name}</span>
                          <span className="text-[11px] text-neutral-400 block font-mono">
                            Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant.name}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                        ${item.product.price * item.quantity} USD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-500">
              No parcel located with this reference. Try searching for <span className="font-mono font-semibold cursor-pointer underline" onClick={() => setTrackingInput('ORD-89211')}>ORD-89211</span>.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES & WALLET */}
      {activeTab === 'wallet' && (
        <div className="space-y-8 text-xs">
          {currentUser ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Addresses */}
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Saved Delivery Addresses
                </h3>
                {currentUser.addresses.map(addr => (
                  <div key={addr.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-1">
                    <span className="font-semibold text-neutral-900 dark:text-white block">{addr.fullName}</span>
                    <p className="text-neutral-500">{addr.streetAddress} {addr.apartment}</p>
                    <p className="text-neutral-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-neutral-400 font-mono text-[11px]">{addr.phone}</p>
                  </div>
                ))}
              </div>

              {/* Wallet Cards */}
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Demo Saved Cards
                </h3>
                {currentUser.savedCards.map(card => (
                  <div key={card.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono uppercase font-bold text-neutral-900 dark:text-white block">
                        {card.brand} ending in {card.last4}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Expires {card.expMonth}/{card.expYear} · {card.cardholderName}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Demo Verified</span>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 space-y-3">
              <p>Sign in to view your saved addresses and payment options.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
