import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast, setCurrentPage, setActiveCategory } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to the Nadeem & Co. private gazette.');
  };

  const navigateToCat = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xl font-bold font-editorial text-neutral-950 dark:text-white uppercase tracking-tight">
              Nadeem &amp; Co.
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
              An independent studio workshop dedicated to acoustic clarity, mechanical horology, and natural material longevity. Designed in Copenhagen, forged globally.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white block mb-1.5">
                Join the Private Gazette
              </span>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>You are subscribed to private releases and seasonal previews.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Social Media Links (Point 16) */}
            <div className="pt-3">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                Follow Nadeem &amp; Co.
              </span>
              <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  X (Twitter)
                </a>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Pinterest
                </a>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  YouTube
                </a>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Spotify
                </a>
              </div>
            </div>
          </div>

          {/* Links Column 1: Store Departments */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
              Collection
            </h4>
            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => navigateToCat('all')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Complete Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCat('audio')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Studio Acoustics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCat('objects')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Horology &amp; Chronographs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCat('apparel')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Italian Merino Knitwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCat('home')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Architectural Lighting
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Client Care */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
              Client Care
            </h4>
            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Track Package
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Order Receipts &amp; Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <span
                  onClick={() => showToast('30-day home trial and complimentary returns active on all orders.')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  30-Day Risk-Free Returns
                </span>
              </li>
              <li>
                <span
                  onClick={() => showToast('Two-year comprehensive hardware warranty included with every piece.')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Two-Year Warranty Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Trust & Payments */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
              Secure Commerce
            </h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              Every checkout is tokenized with 256-bit encryption. Cash on Delivery supported with SMS confirmation.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500 pt-1">
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">VISA</span>
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">MASTERCARD</span>
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">AMEX</span>
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">APPLE PAY</span>
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-emerald-600 dark:text-emerald-400">COD</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-10 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Nadeem &amp; Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span
              onClick={() => showToast('Privacy Policy: Customer data is never sold or used for telemetry.')}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => showToast('Terms of Service: Standard luxury retail and consumer protection terms.')}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            >
              Terms of Service
            </span>
            <span
              onClick={() => showToast('Ethical Sourcing: 100% recyclable molded pulp, zero single-use plastics.')}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            >
              Ethical Sourcing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
