import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Coupon, Variant, Address, SavedCard } from '../types';
import { PRODUCTS, AVAILABLE_COUPONS, DEMO_USERS, INITIAL_ORDERS } from '../data/products';

export type PageType = 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'order-confirmation' | 'orders' | 'wishlist' | 'auth';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  navigateToProduct: (product: Product) => void;
  navigateToCategory: (category: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: Variant, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Auth
  currentUser: User | null;
  login: (email: string, password?: string) => boolean;
  loginDemo: (role: 'customer' | 'vip') => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  updateAddress: (address: Address) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;

  // Orders
  orders: Order[];
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingNumber' | 'carrier' | 'estimatedDelivery'>) => Order;
  cancelOrder: (orderId: string) => boolean;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'atelier_cart_v1',
  USER: 'atelier_user_v1',
  ORDERS: 'atelier_orders_v1',
  WISHLIST: 'atelier_wishlist_v1',
  THEME: 'atelier_theme_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation page state
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark luxury theme
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Products
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return DEMO_USERS[0]; // Seed with friendly demo account
    } catch {
      return DEMO_USERS[0];
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: `${PRODUCTS[0].id}-${PRODUCTS[0].variants?.[0]?.id || 'default'}-nosize`,
          product: PRODUCTS[0],
          quantity: 1,
          selectedVariant: PRODUCTS[0].variants?.[0]
        }
      ];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
      return [PRODUCTS[1].id, PRODUCTS[2].id];
    } catch {
      return [];
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Could not save user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist', e);
    }
  }, [wishlist]);

  // Navigation helpers
  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, variant?: Variant, size?: string) => {
    const variantId = variant?.id || 'standard';
    const sizeId = size || 'nosize';
    const cartItemId = `${product.id}-${variantId}-${sizeId}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            quantity,
            selectedVariant: variant,
            selectedSize: size
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from shopping bag.', 'info');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Financial calculations
  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100 * 100) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      cartDiscount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  // Free shipping over $150 or with coupon
  const isFreeShipping = cartSubtotal >= 150 || appliedCoupon?.discountType === 'free_shipping';
  const cartShipping = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 15);
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.0825 * 100) / 100; // 8.25%
  const cartTotal = Math.max(0, Math.round((cartSubtotal - cartDiscount + cartShipping + cartTax) * 100) / 100);

  // Coupon handling
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === clean);
    if (!coupon) {
      return { success: false, message: 'Invalid promotional code.' };
    }
    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Code requires a minimum spend of $${coupon.minSpend}.`
      };
    }
    setAppliedCoupon(coupon);
    showToast(`Code "${coupon.code}" applied: ${coupon.description}!`);
    return { success: true, message: `Applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth
  const login = (email: string) => {
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      showToast(`Welcome back, ${matched.name}.`);
      setIsAuthModalOpen(false);
      return true;
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'customer',
      addresses: [],
      savedCards: []
    };
    setCurrentUser(newUser);
    showToast(`Signed in as ${newUser.name}.`);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginDemo = (role: 'customer' | 'vip') => {
    const user = role === 'vip' ? DEMO_USERS[1] : DEMO_USERS[0];
    setCurrentUser(user);
    showToast(`Signed in as demo ${role === 'vip' ? 'VIP' : 'customer'}: ${user.name}`);
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'customer',
      addresses: [],
      savedCards: []
    };
    setCurrentUser(newUser);
    showToast(`Account created! Welcome to Nadeem & Co., ${name}.`);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out of your account.', 'info');
  };

  const updateAddress = (address: Address) => {
    if (!currentUser) return;
    const existingIndex = currentUser.addresses.findIndex(a => a.id === address.id);
    let updatedAddresses = [...currentUser.addresses];
    if (existingIndex > -1) {
      updatedAddresses[existingIndex] = address;
    } else {
      updatedAddresses.push(address);
    }
    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
  };

  const addSavedCard = (card: Omit<SavedCard, 'id'>) => {
    if (!currentUser) return;
    const newCard: SavedCard = {
      ...card,
      id: `card-${Date.now()}`
    };
    const updatedUser = {
      ...currentUser,
      savedCards: [...currentUser.savedCards, newCard]
    };
    setCurrentUser(updatedUser);
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingNumber' | 'carrier' | 'estimatedDelivery'>): Order => {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `ATL-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (orderData.shippingMethod.id === 'priority' ? 1 : orderData.shippingMethod.id === 'express' ? 2 : 4));
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      status: 'processing',
      trackingNumber,
      carrier: orderData.shippingMethod.id === 'priority' ? 'FedEx Priority Air' : 'DHL Express Global',
      estimatedDelivery
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;
    if (order.status === 'delivered') {
      showToast('Delivered orders cannot be cancelled online.', 'error');
      return false;
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    showToast(`Order ${order.orderNumber} has been cancelled.`);
    return true;
  };

  const getOrderById = (orderIdOrNumber: string) => {
    const clean = orderIdOrNumber.trim().toUpperCase();
    return orders.find(o => o.id === orderIdOrNumber || o.orderNumber.toUpperCase() === clean);
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activeCategory,
        setActiveCategory,
        navigateToProduct,
        navigateToCategory,
        isDarkMode,
        toggleTheme,
        products,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        login,
        loginDemo,
        register,
        logout,
        updateAddress,
        addSavedCard,
        orders,
        lastOrder,
        setLastOrder,
        createOrder,
        cancelOrder,
        getOrderById,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
