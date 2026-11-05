import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Moon,
  Sun,
  Heart,
  Menu,
  X,
  Package,
  Layers,
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeCategory,
    setActiveCategory,
    cartCount,
    setIsCartOpen,
    currentUser,
    setIsAuthModalOpen,
    setIsSearchModalOpen,
    wishlist,
    isDarkMode,
    toggleTheme,
    logout
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', action: () => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'shop', label: 'Shop', action: () => { setActiveCategory('all'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'audio', label: 'Audio', action: () => { setActiveCategory('audio'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'objects', label: 'Objects', action: () => { setActiveCategory('objects'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'apparel', label: 'Apparel', action: () => { setActiveCategory('apparel'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'home-living', label: 'Living', action: () => { setActiveCategory('home'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
  ];

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-neutral-950/95 border-b border-neutral-200/90 dark:border-neutral-800/90 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              setCurrentPage('home');
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 font-editorial uppercase whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity text-left"
          >
            Nadeem &amp; Co.
          </button>

          {/* Zone 2: Desktop clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {navLinks.map(link => {
              const isActive =
                (link.id === 'home' && currentPage === 'home') ||
                (link.id === 'shop' && currentPage === 'shop' && activeCategory === 'all') ||
                (link.id === activeCategory && currentPage === 'shop') ||
                (link.id === 'home-living' && activeCategory === 'home' && currentPage === 'shop');

              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                    isActive
                      ? 'text-neutral-950 dark:text-white font-semibold'
                      : 'hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Functional interactive zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Search collection (Cmd+K)"
              aria-label="Search collection"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => {
                setCurrentPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 rounded-lg transition-colors relative ${
                currentPage === 'wishlist'
                  ? 'text-rose-500 bg-neutral-100 dark:bg-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
              title="View Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Login Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors"
                    aria-label="User account menu"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{currentUser.name}</p>
                        <p className="text-neutral-500 truncate text-[11px]">{currentUser.email}</p>
                        {currentUser.role === 'vip' && (
                          <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                            Nadeem &amp; Co. VIP Member
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setCurrentPage('orders');
                          setIsUserMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3.5 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" /> My Orders &amp; Receipts
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('wishlist');
                          setIsUserMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3.5 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlist.length})
                        </span>
                      </button>

                      <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setCurrentPage('auth');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button (Slide-over drawer trigger) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm whitespace-nowrap shrink-0 group"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono tabular-nums bg-white/20 dark:bg-neutral-900/15 px-1.5 py-0.5 rounded text-[11px] font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fully Responsive Mobile Navigation Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-neutral-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between p-6">
            
            {/* Top brand & close */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-xl font-bold font-editorial text-neutral-950 dark:text-white">
                  Nadeem &amp; Co.
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleMobileNav(link.action)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-left"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </nav>

              {/* Essential Actions */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <button
                  onClick={() => handleMobileNav(() => setCurrentPage('wishlist'))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" /> Wishlist
                  </span>
                  <span className="font-mono tabular-nums text-neutral-400">{wishlist.length}</span>
                </button>

                <button
                  onClick={() => handleMobileNav(() => setCurrentPage('orders'))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" /> Orders &amp; Tracking
                  </span>
                </button>

                <button
                  onClick={() => handleMobileNav(() => setIsCartOpen(true))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Shopping Bag
                  </span>
                  <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-white">{cartCount}</span>
                </button>
              </div>
            </div>

            {/* Bottom user & theme row */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900">
                  <div className="truncate">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-600"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleMobileNav(() => setCurrentPage('auth'))}
                  className="w-full py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg text-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
