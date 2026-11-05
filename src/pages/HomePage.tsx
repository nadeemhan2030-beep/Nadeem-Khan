import React from 'react';
import { useStore } from '../context/StoreContext';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setCurrentPage, setActiveCategory, navigateToCategory } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  const collections = [
    {
      id: 'audio',
      title: 'Studio Acoustics',
      description: 'Bio-cellulose drivers, 38-hour battery & knurled dials',
      image: '/src/assets/images/product_wireless_headphones_1793877308714.jpg'
    },
    {
      id: 'objects',
      title: 'Horology & Objects',
      description: 'Grade 2 aerospace titanium chronographs & honed travertine',
      image: '/src/assets/images/product_ceramic_chronograph_1793877309613.jpg'
    },
    {
      id: 'apparel',
      title: 'Italian Merino Knitwear',
      description: '19.5-micron virgin wool spun in Biella with seamless comfort',
      image: '/src/assets/images/product_merino_knitwear_1793877310306.jpg'
    },
    {
      id: 'home',
      title: 'Architectural Lighting',
      description: 'Cantilever brushed brass arches & frosted opal glass orbs',
      image: '/src/assets/images/product_brass_table_lamp_1793877310802.jpg'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <Hero
        onExplore={() => {
          setActiveCategory('all');
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={navigateToCategory}
      />

      {/* Featured Collections Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Curated Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial mt-1">
              Seasonal Department Focus
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1.5"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map(col => (
            <div
              key={col.id}
              onClick={() => navigateToCategory(col.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={col.image}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold font-editorial">
                  {col.title}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400 line-clamp-1">{col.description}</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pieces Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Selected Edition
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial mt-1">
              Featured Studio Releases
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1.5"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Craftsmanship & Material Manifesto */}
      <section className="bg-neutral-100 dark:bg-neutral-900/60 border-y border-neutral-200 dark:border-neutral-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                The Nadeem &amp; Co. Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-editorial">
                Subtractive Engineering &amp; Organic Permanence
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Every piece in our catalog is stripped of non-essential ornamentation. We believe tools and objects should age into heirloom artifacts rather than obsolete electronics.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Shop the Full Line
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <ShieldCheck className="w-5 h-5 text-neutral-900 dark:text-white" />
                <h4 className="font-semibold text-neutral-900 dark:text-white">Grade 2 Titanium &amp; Brass</h4>
                <p className="text-neutral-500 leading-relaxed text-[11px]">
                  Machined with aerospace tolerances and surface-treated for corrosion immunity.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <Truck className="w-5 h-5 text-neutral-900 dark:text-white" />
                <h4 className="font-semibold text-neutral-900 dark:text-white">Complimentary Shipping</h4>
                <p className="text-neutral-500 leading-relaxed text-[11px]">
                  Delivered in zero-plastic recycled molded pulp packaging on all orders over $150.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <RotateCcw className="w-5 h-5 text-neutral-900 dark:text-white" />
                <h4 className="font-semibold text-neutral-900 dark:text-white">30-Day Home Trial</h4>
                <p className="text-neutral-500 leading-relaxed text-[11px]">
                  Audition headphones and objects in your personal acoustic space risk-free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
