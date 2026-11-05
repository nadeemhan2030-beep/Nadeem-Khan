export interface Variant {
  id: string;
  name: string;
  colorHex?: string;
  sku?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'audio' | 'objects' | 'apparel' | 'home';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  variants?: Variant[];
  sizes?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique item id (productId + variant)
  product: Product;
  quantity: number;
  selectedVariant?: Variant;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface SavedCard {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'generic';
  last4: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'vip';
  addresses: Address[];
  savedCards: SavedCard[];
}

export type OrderStatus = 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  shippingAddress: Address;
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: {
    type: 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'cod';
    details: string;
  };
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minSpend?: number;
}
