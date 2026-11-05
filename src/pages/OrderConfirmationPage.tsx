import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Printer, Package, ArrowRight, Truck, Clock } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder, orders, setCurrentPage } = useStore();

  // Use last created order or first from orders list
  const order = lastOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-editorial text-neutral-950 dark:text-white">
          No recent order located
        </h2>
        <p className="text-xs text-neutral-500">
          You haven't placed an order in this active session yet.
        </p>
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 space-y-8 animate-in fade-in duration-300">
      
      {/* Success Hero Banner */}
      <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Order Successfully Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
          Thank you for your order
        </h1>

        <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
          Your order has been registered in our workshop. A confirmation receipt has been generated and your pieces are being scheduled for dispatch.
        </p>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-xs font-semibold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
            <span>Order Reference:</span>
            <span className="text-emerald-600 dark:text-emerald-400">{order.orderNumber}</span>
          </div>
        </div>
      </div>

      {/* 4-Step Delivery Progress Tracker */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Estimated Delivery
            </h3>
            <span className="text-xs font-mono text-neutral-500">{order.estimatedDelivery}</span>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            Carrier: <span className="font-semibold text-neutral-900 dark:text-white">{order.carrier}</span> · Tracking: <span className="text-neutral-900 dark:text-white font-semibold">{order.trackingNumber}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="h-2 rounded-full bg-emerald-600" />
            <div className="h-2 rounded-full bg-emerald-600 animate-pulse" />
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="grid grid-cols-4 text-center text-[11px] font-medium pt-1">
            <span className="text-neutral-900 dark:text-white">Confirmed</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Packaging</span>
            <span className="text-neutral-400">Carrier Transit</span>
            <span className="text-neutral-400">Delivered</span>
          </div>
        </div>
      </div>

      {/* Itemized Invoice & Delivery Summary */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white font-editorial">
              Official Receipt &amp; Packing List
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Date: {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Purchased Items Table */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {order.items.map(item => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">{item.product.name}</h4>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant.name}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                  </div>
                </div>
              </div>
              <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                ${item.product.price * item.quantity} USD
              </span>
            </div>
          ))}
        </div>

        {/* Financial Line Breakdown */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs font-mono space-y-1.5">
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>Subtotal</span>
            <span className="tabular-nums">${order.subtotal.toFixed(2)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>Shipping ({order.shippingMethod.name})</span>
            <span className="tabular-nums">
              {order.shippingFee === 0 ? 'Complimentary' : `$${order.shippingFee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>Estimated Sales Tax (8.25%)</span>
            <span className="tabular-nums">${order.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-950 dark:text-white font-sans">
            <span>Total Paid</span>
            <span className="font-mono tabular-nums">${order.total.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
            <span className="font-semibold text-neutral-900 dark:text-white block">Delivery Destination</span>
            <p className="text-neutral-600 dark:text-neutral-300">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-500">{order.shippingAddress.streetAddress} {order.shippingAddress.apartment}</p>
            <p className="text-neutral-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p className="text-neutral-400 font-mono text-[11px]">{order.shippingAddress.phone}</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
            <span className="font-semibold text-neutral-900 dark:text-white block">Payment Details</span>
            <p className="text-neutral-600 dark:text-neutral-300">{order.paymentMethod.details}</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">Status: Authorized in Demo Mode</p>
            <p className="text-neutral-400 text-[11px]">No further payment action required.</p>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={() => {
            setCurrentPage('orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-1 py-3.5 px-6 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Package className="w-4 h-4" />
          <span>Track in Order History</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3.5 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-center"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
};
