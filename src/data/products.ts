import { Product, Coupon, User, Order } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'aeon-studio-headphones',
    name: 'Aeon Studio Wireless Over-Ear',
    category: 'audio',
    categoryLabel: 'Audio & Acoustics',
    price: 380,
    originalPrice: 420,
    rating: 4.9,
    reviewCount: 128,
    image: '/src/assets/images/product_wireless_headphones_1793877308714.jpg',
    description: 'Precision-tuned acoustic architecture with custom 40mm bio-cellulose drivers, active noise suppression, and machined knurled aluminum mechanical dials.',
    features: [
      '40mm bio-cellulose acoustic drivers',
      'Hybrid active noise cancellation with transparency mode',
      'Up to 38 hours playback with rapid USB-C charging',
      'Lambskin leather memory foam earpads',
      'Lossless LDAC, aptX Adaptive & AAC Bluetooth 5.3 codecs'
    ],
    specs: {
      'Frequency Response': '10Hz – 45,000Hz',
      'Battery Life': '38 Hours (ANC On)',
      'Weight': '295g',
      'Connectivity': 'Bluetooth 5.3, 3.5mm analog, USB-C DAC',
      'Materials': 'Anodized 6063 Aluminum, Full-Grain Leather'
    },
    inStock: true,
    stockCount: 14,
    variants: [
      { id: 'matte-black', name: 'Obsidian Black', colorHex: '#1C1917' },
      { id: 'silver-travertine', name: 'Brushed Titanium', colorHex: '#78716C' },
      { id: 'cognac-leather', name: 'Cognac Saddle', colorHex: '#9A3412' }
    ],
    isFeatured: true,
    isNewArrival: false,
    reviews: [
      {
        id: 'rev-1',
        author: 'Julian Vance',
        rating: 5,
        date: '2026-10-18',
        comment: 'The analog feel of the knurled dials and the neutral acoustic profile is second to none. Replaces my high-end studio monitors for travel.',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Sophia Chen',
        rating: 5,
        date: '2026-10-24',
        comment: 'Exquisite build quality. The lambskin cups are incredibly comfortable even after a 9-hour transatlantic flight.',
        verified: true
      }
    ]
  },
  {
    id: 'apex-field-chronograph',
    name: 'Apex Field Titanium Chronograph',
    category: 'objects',
    categoryLabel: 'Horology & Objects',
    price: 420,
    rating: 4.8,
    reviewCount: 94,
    image: '/src/assets/images/product_ceramic_chronograph_1793877309613.jpg',
    description: 'Minimalist tool watch machined from Grade 2 aerospace titanium with a bead-blasted finish, matte slate dial, and vegetable-tanned olive calfskin strap.',
    features: [
      'Grade 2 aerospace titanium case (39mm diameter)',
      'Sapphire crystal glass with anti-reflective dual coating',
      'Mecha-quartz precision chronograph movement with flyback',
      'Swiss Super-LumiNova BGW9 indices',
      '100m water resistance (10 ATM)'
    ],
    specs: {
      'Case Diameter': '39.0mm',
      'Lug-to-Lug': '46.5mm',
      'Thickness': '10.8mm',
      'Movement': 'Seiko VK64 Meca-Quartz Hybrid',
      'Strap Width': '20mm tapered'
    },
    inStock: true,
    stockCount: 8,
    variants: [
      { id: 'olive-leather', name: 'Olive Drab Leather', colorHex: '#4D5339' },
      { id: 'black-horween', name: 'Coal Horween Leather', colorHex: '#27272A' },
      { id: 'titanium-mesh', name: 'Titanium Mesh Bracelet', colorHex: '#A1A1AA' }
    ],
    isFeatured: true,
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-3',
        author: 'Marcus Weber',
        rating: 5,
        date: '2026-09-30',
        comment: 'The 39mm proportion is perfect. The tactile click of the chronograph pushers gives mechanical feedback with quartz reliability.',
        verified: true
      }
    ]
  },
  {
    id: 'astella-merino-crewneck',
    name: 'Astella Virgin Merino Crewneck',
    category: 'apparel',
    categoryLabel: 'Apparel & Knitwear',
    price: 210,
    originalPrice: 240,
    rating: 4.9,
    reviewCount: 82,
    image: '/src/assets/images/product_merino_knitwear_1793877310306.jpg',
    description: 'Spun from 19.5-micron extrafine Australian virgin merino wool in Biella, Italy. Unrivaled thermoregulation, natural odor resistance, and silky handfeel.',
    features: [
      '100% Extrafine Australian Virgin Merino Wool',
      'Seamless 3D tubular knit construction for zero chafing',
      'Natural moisture-wicking and thermal buffering',
      'Pre-washed and shrink-resistant treatment',
      'Finished with reinforced double-rib cuffs'
    ],
    specs: {
      'Fiber Gauge': '19.5 Micron',
      'Knit Type': '12-Gauge Milano Knit',
      'Origin': 'Spun in Biella, Italy',
      'Care': 'Hand wash cold or gentle wool cycle; dry flat'
    },
    inStock: true,
    stockCount: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'charcoal-melange', name: 'Charcoal Mélange', colorHex: '#3F3F46' },
      { id: 'natural-ecru', name: 'Raw Ecru', colorHex: '#F5F5F4' },
      { id: 'midnight-navy', name: 'Midnight Navy', colorHex: '#1E293B' }
    ],
    isFeatured: true,
    isNewArrival: false,
    reviews: [
      {
        id: 'rev-4',
        author: 'David L.',
        rating: 5,
        date: '2026-10-12',
        comment: 'Drapes effortlessly without any scratchiness against the skin. Wears equally well over a t-shirt or tailored coat.',
        verified: true
      }
    ]
  },
  {
    id: 'crescent-brass-table-lamp',
    name: 'Crescent Brass & Frosted Opal Lamp',
    category: 'home',
    categoryLabel: 'Home & Architecture',
    price: 260,
    rating: 4.7,
    reviewCount: 46,
    image: '/src/assets/images/product_brass_table_lamp_1793877310802.jpg',
    description: 'Sculptural table lamp featuring a solid spun brass cantilever arch framing a hand-blown frosted triplex opal glass sphere, casting warm ambient radiance.',
    features: [
      'Hand-finished brushed solid brass cantilever frame',
      'Hand-blown matte triplex opal glass orb diffuser',
      'Rotary brass step-less rotary dimmer switch on base',
      'Integrated warm 2700K 95+ CRI architectural LED',
      'Braided black textile cord with solid brass plug casing'
    ],
    specs: {
      'Dimensions': '34cm H × 22cm W × 18cm D',
      'Color Temperature': '2700K Warm Dimming',
      'Luminous Output': '480 Lumens (Dimmable 5% – 100%)',
      'Voltage': '100–240V Universal AC adapter included',
      'Weight': '2.6 kg (solid brass weighted base)'
    },
    inStock: true,
    stockCount: 6,
    variants: [
      { id: 'brushed-brass', name: 'Brushed Brass', colorHex: '#D97706' },
      { id: 'blackened-bronze', name: 'Blackened Bronze', colorHex: '#292524' }
    ],
    isFeatured: true,
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-5',
        author: 'Claire Moreau',
        rating: 5,
        date: '2026-10-29',
        comment: 'Like a sculpture on my walnut credenza. The dimming curve is super smooth with no flicker whatsoever.',
        verified: true
      }
    ]
  },
  {
    id: 'monolith-desktop-monitor',
    name: 'Monolith High-Fidelity Bookshelf Speaker',
    category: 'audio',
    categoryLabel: 'Audio & Acoustics',
    price: 540,
    originalPrice: 590,
    rating: 4.9,
    reviewCount: 63,
    image: '/src/assets/images/hero_acoustic_lifestyle_1793877308301.jpg',
    description: 'Single compact active studio monitor housed in acoustic damped American walnut with solid aluminum baffle and custom silk-dome tweeter.',
    features: [
      '5.25-inch woven carbon fiber mid-woofer',
      '1-inch ferrofluid-cooled silk dome tweeter',
      '120W Class-D bi-amplified architecture',
      'Optical, RCA, balanced TRS, and Bluetooth LDAC inputs',
      'Rear acoustic port with low-turbulence tuning'
    ],
    specs: {
      'Frequency Response': '42Hz – 28,000Hz (±2dB)',
      'Total Output': '120W Peak (80W Woofer + 40W Tweeter)',
      'Dimensions': '300 × 185 × 230 mm',
      'Cabinet': 'High-density MDF with American Walnut veneer'
    },
    inStock: true,
    stockCount: 5,
    variants: [
      { id: 'walnut-aluminum', name: 'American Walnut', colorHex: '#78350F' },
      { id: 'smoked-ash', name: 'Smoked Nordic Ash', colorHex: '#44403C' }
    ],
    isFeatured: false,
    isNewArrival: false,
    reviews: []
  },
  {
    id: 'travertine-catchall-vessel',
    name: 'Roman Travertine Catchall & Burner',
    category: 'objects',
    categoryLabel: 'Horology & Objects',
    price: 95,
    rating: 4.6,
    reviewCount: 38,
    image: '/src/assets/images/product_ceramic_chronograph_1793877309613.jpg',
    description: 'Chiseled from a solid block of unpolished natural Roman travertine with unique geological cavities and an integrated solid brass incense pin.',
    features: [
      '100% natural honed Italian Roman travertine',
      'Unique cavity pattern on every individual piece',
      'Removable solid knurled brass incense holder insert',
      'Cork protective base to preserve tabletop surfaces'
    ],
    specs: {
      'Dimensions': '24cm × 14cm × 3.5cm',
      'Weight': '1.45 kg',
      'Origin': 'Tivoli, Italy'
    },
    inStock: true,
    stockCount: 19,
    variants: [
      { id: 'classic-travertine', name: 'Warm Roman Sand', colorHex: '#E7E5E4' },
      { id: 'grey-florentine', name: 'Florentine Gray', colorHex: '#A8A29E' }
    ],
    isFeatured: false,
    isNewArrival: false,
    reviews: []
  },
  {
    id: 'vachetta-leather-folio',
    name: 'Vachetta Full-Grain Leather Folio',
    category: 'apparel',
    categoryLabel: 'Apparel & Leather',
    price: 185,
    rating: 4.8,
    reviewCount: 52,
    image: '/src/assets/images/product_merino_knitwear_1793877310306.jpg',
    description: 'Hand-stitched vegetable-tanned Tuscan vachetta leather designed to carry an iPad Pro / 14-inch laptop, writing pad, and fountain pen. Develops a rich golden patina over years.',
    features: [
      'Uncorrected vegetable-tanned Tuscan vachetta leather',
      'Hand-waxed linen thread saddle stitching',
      'Dual interior sleeves for tablet and notebooks',
      'Solid brass YKK Excella zipper hardware'
    ],
    specs: {
      'Dimensions': '34cm × 25cm × 2.5cm',
      'Compatibility': 'MacBook Air 13"/14", iPad Pro 12.9", A4 pad',
      'Origin': 'Florence, Italy'
    },
    inStock: true,
    stockCount: 11,
    variants: [
      { id: 'saddle-tan', name: 'Raw Caramel Tan', colorHex: '#B45309' },
      { id: 'espresso-brown', name: 'Dark Espresso', colorHex: '#451A03' }
    ],
    isFeatured: false,
    isNewArrival: false,
    reviews: []
  },
  {
    id: 'fumed-oak-pourover-stand',
    name: 'Fumed Oak & Glass Pour-Over Station',
    category: 'home',
    categoryLabel: 'Home & Architecture',
    price: 145,
    rating: 4.9,
    reviewCount: 71,
    image: '/src/assets/images/product_brass_table_lamp_1793877310802.jpg',
    description: 'Architectural manual coffee brewing station made from oil-sealed fumed European oak with adjustable brass dripping ring and heat-resistant borosilicate glass server.',
    features: [
      'Fumed European white oak sealed with food-safe plant oils',
      'Precision height-adjustable brass ring for any dripper',
      '600ml hand-blown borosilicate glass server included',
      'Silicone non-slip drip coaster'
    ],
    specs: {
      'Height': '27cm',
      'Base Footprint': '16cm × 16cm',
      'Compatibility': 'Hario V60 01/02, Kalita Wave 155/185'
    },
    inStock: true,
    stockCount: 15,
    isFeatured: false,
    isNewArrival: true,
    reviews: []
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    description: '10% off your entire order',
    discountType: 'percentage',
    discountValue: 10
  },
  {
    code: 'NADEEM25',
    description: '$25 off orders above $100',
    discountType: 'fixed',
    discountValue: 25,
    minSpend: 100
  },
  {
    code: 'ATELIER25',
    description: '$25 off orders above $100',
    discountType: 'fixed',
    discountValue: 25,
    minSpend: 100
  },
  {
    code: 'FREESHIP',
    description: 'Complimentary priority delivery',
    discountType: 'free_shipping',
    discountValue: 0
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-alex-morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@designstudio.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Alex Morgan',
        streetAddress: '742 Evergreen Terrace',
        apartment: 'Suite 4B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94110',
        country: 'United States',
        phone: '+1 (415) 890-2134',
        isDefault: true
      }
    ],
    savedCards: [
      {
        id: 'card-1',
        brand: 'visa',
        last4: '4242',
        expMonth: '11',
        expYear: '28',
        cardholderName: 'Alex Morgan'
      }
    ]
  },
  {
    id: 'user-elena-vance',
    name: 'Elena Vance',
    email: 'elena.vance@atelier-arch.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'vip',
    addresses: [
      {
        id: 'addr-2',
        fullName: 'Elena Vance',
        streetAddress: '120 Wooster Street',
        apartment: 'Penthouse East',
        city: 'New York',
        state: 'NY',
        postalCode: '10012',
        country: 'United States',
        phone: '+1 (212) 555-0199',
        isDefault: true
      }
    ],
    savedCards: [
      {
        id: 'card-2',
        brand: 'amex',
        last4: '0005',
        expMonth: '08',
        expYear: '29',
        cardholderName: 'Elena Vance'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-89211',
    orderNumber: 'ORD-89211',
    date: '2026-11-01T14:22:00Z',
    items: [
      {
        id: 'item-demo-1',
        product: PRODUCTS[0],
        quantity: 1,
        selectedVariant: PRODUCTS[0].variants?.[0]
      }
    ],
    shippingAddress: DEMO_USERS[0].addresses[0],
    shippingMethod: {
      id: 'express',
      name: 'Express Courier',
      price: 24,
      estimatedDays: '1-2 Business Days'
    },
    paymentMethod: {
      type: 'card',
      details: 'Visa ending in 4242'
    },
    subtotal: 380,
    discount: 38,
    tax: 28.96,
    shippingFee: 24,
    total: 394.96,
    status: 'in_transit',
    trackingNumber: 'ATL-984028471',
    carrier: 'DHL Express Global',
    estimatedDelivery: 'November 7, 2026'
  }
];
