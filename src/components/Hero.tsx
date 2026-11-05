import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onSelectCategory }) => {
  const { products, navigateToProduct } = useStore();
  const featuredItem = products[0];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Editorial Content Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
                Autumn 2026 Edition
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial leading-[1.15] text-balance">
                Acoustic Purity &amp; Architectural Form
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg">
                Engineered for those who value quiet precision. Discover our collection of studio acoustic hardware, Grade 2 titanium chronographs, and artisanal Italian textiles.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm group"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => onSelectCategory('audio')}
                className="inline-flex items-center px-4 py-2.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                View Studio Audio
              </button>
            </div>

            {/* Natural editorial trust indicators */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Free Express Delivery &gt; $150</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>30-Day Home Trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Campaign Visual Column */}
          <div className="lg:col-span-7">
            <div
              onClick={() => featuredItem && navigateToProduct(featuredItem)}
              className="relative aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-xl group cursor-pointer"
            >
              <img
                src="/src/assets/images/hero_acoustic_lifestyle_1793877308301.jpg"
                alt="Nadeem &amp; Co. Acoustic Lifestyle Studio Setup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-medium drop-shadow-sm flex items-center gap-2">
                  <span>Featured: {featuredItem?.name || 'Aeon Acoustic Studio'}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs">Explore</span>
                </span>
                <span className="font-mono tabular-nums opacity-90 drop-shadow-sm font-semibold">${featuredItem?.price || 380} USD</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
