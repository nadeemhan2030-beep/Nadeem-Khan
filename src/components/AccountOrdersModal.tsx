import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Heart,
  CreditCard,
  MapPin,
  Search,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Order } from '../types';

export const AccountOrdersModal: React.FC = () => {
  const {
    isOrdersModalOpen,
    setIsOrdersModalOpen,
    currentUser,
    orders,
    cancelOrder,
    getOrderById,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    setIsCartOpen,
    setIsAuthModalOpen
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'tracker' | 'wishlist' | 'profile'>('orders');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  if (!isOrdersModalOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    const found = getOrderById(trackingQuery);
    setTrackedOrder(found || null);
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white font-editorial">
              Nadeem &amp; Co. Member Portal
            </h2>
            <p className="text-xs text-neutral-500">
              {currentUser ? `Signed in as ${currentUser.name} (${currentUser.email})` : 'Guest Session'}
            </p>
          </div>

          <button
            onClick={() => setIsOrdersModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 relative flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders ({orders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-3 relative flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Live Order Tracker</span>
            {activeTab === 'tracker' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 relative flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Wishlist ({wishlist.length})</span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 relative flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses &amp; Wallet</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div
                    key={order.id}
                    className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 text-xs">
                      <div>
                        <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm">
                          {order.orderNumber}
                        </span>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Label (Zero-pill clean text) */}
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
                            <span className="text-rose-500">Cancelled</span>
                          )}
                        </div>

                        <span className="font-mono font-semibold text-sm text-neutral-950 dark:text-white tabular-nums">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-md object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-neutral-900 dark:text-white">{item.product.name}</span>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              Qty: {item.quantity} · ${item.product.price} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Courier: {order.carrier} (Track: {order.trackingNumber})
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTrackedOrder(order);
                            setActiveTab('tracker');
                          }}
                          className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
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
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <Package className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs">No orders recorded in this session yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE ORDER TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              {/* Tracker Search Form */}
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={e => setTrackingQuery(e.target.value)}
                    placeholder="Enter order reference number (e.g. ORD-89211)..."
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono uppercase text-neutral-900 dark:text-neutral-100 placeholder:normal-case focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Locate
                </button>
              </form>

              {/* Tracked Order Result Card */}
              {trackedOrder ? (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-mono">
                        Tracking Status
                      </span>
                      <h4 className="text-base font-bold text-neutral-950 dark:text-white font-mono">
                        {trackedOrder.orderNumber}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Estimated Arrival</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {trackedOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Visual Progress Bar */}
                  <div className="space-y-2">
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

                    <div className="grid grid-cols-4 text-center text-[10px] text-neutral-500 font-medium pt-1">
                      <span className="text-neutral-900 dark:text-white">Order Confirmed</span>
                      <span className="text-neutral-900 dark:text-white">Packaging Studio</span>
                      <span className={trackedOrder.status === 'in_transit' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''}>
                        Carrier Transit
                      </span>
                      <span className={trackedOrder.status === 'delivered' ? 'text-emerald-600 font-bold' : ''}>
                        Final Delivery
                      </span>
                    </div>
                  </div>

                  {/* Tracking Milestones */}
                  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs space-y-3 font-mono">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Carrier</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{trackedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Tracking Number</span>
                      <span>{trackedOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Destination</span>
                      <span>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.country}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 text-xs">
                  Enter an order reference number above (e.g. <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer" onClick={() => setTrackingQuery('ORD-89211')}>ORD-89211</span>) to view real-time delivery telematics.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">{product.name}</h4>
                        <div className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                          ${product.price} USD
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => {
                            addToCart(product, 1, product.variants?.[0], product.sizes?.[0]);
                            setIsCartOpen(true);
                          }}
                          className="flex-1 py-1.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-semibold rounded-md hover:opacity-90"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-md"
                          title="Remove from wishlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs">Your wishlist is empty.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES & WALLET */}
          {activeTab === 'profile' && (
            <div className="space-y-6 text-xs">
              {currentUser ? (
                <>
                  {/* Saved Delivery Addresses */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                      Saved Shipping Addresses
                    </h4>
                    {currentUser.addresses.map(addr => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex justify-between items-start"
                      >
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white block">{addr.fullName}</span>
                          <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                            {addr.streetAddress} {addr.apartment}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-400">
                            {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </p>
                          <p className="text-neutral-400 mt-1 font-mono text-[11px]">{addr.phone}</p>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono uppercase bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Saved Cards */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                      Saved Payment Cards
                    </h4>
                    {currentUser.savedCards.map(card => (
                      <div
                        key={card.id}
                        className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white block uppercase font-mono">
                              {card.brand} ending in {card.last4}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              Expires {card.expMonth}/{card.expYear} · {card.cardholderName}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Verified</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <p className="text-neutral-500">Sign in to manage your addresses and saved payment methods.</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-lg text-xs font-semibold"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
