import fs from 'fs';
import path from 'path';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  selling_price: number;
  mrp: number;
  stock_quantity: number;
  category_id: string;
  category_name?: string;
  images: string[];
  is_new: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  city?: string;
  pincode?: string;
  order_type: 'Home Delivery' | 'Store Pickup';
  additional_notes?: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  order_status: 'Pending Request' | 'WhatsApp Confirmed' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  logo_url: string;
  whatsapp_number: string;
  whatsapp_default_message?: string;
  contact_number: string;
  email: string;
  address: string;
  city: string;
  opening_hours: string;
  announcement_text: string;
  delivery_settings: {
    home_delivery_available: boolean;
    store_pickup_available: boolean;
    delivery_charge_note: string;
    free_delivery_above?: number;
  };
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  currency: string;
  currency_symbol: string;
  policies: {
    privacy_policy: string;
    terms_and_conditions: string;
    return_policy: string;
  };
  admin_password_hash?: string;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  orders: Order[];
  settings: StoreSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

// Initial seed data
const initialCategories: Category[] = [
  {
    id: 'cat-notebooks',
    name: 'Notebooks & Papers',
    slug: 'notebooks-papers',
    description: 'School notebooks, practical records, spiral longbooks & drawing pads',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cat-pens',
    name: 'Pens & Pencils',
    slug: 'pens-pencils',
    description: 'Ball pens, gel pens, rollerballs, wooden & mechanical pencils',
    image_url: 'https://images.unsplash.com/photo-1585336261026-77884d673898?auto=format&fit=crop&w=600&q=80',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cat-art',
    name: 'Art & Craft',
    slug: 'art-craft',
    description: 'Acrylic paints, watercolors, sketchpads, brushes & craft sheets',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cat-bags',
    name: 'School Bags',
    slug: 'school-bags',
    description: 'Ergonomic backpacks, themed character bags, pouches & accessories',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cat-bottles',
    name: 'Bottles & Tiffins',
    slug: 'bottles-tiffins',
    description: 'Insulated thermosteel bottles, leakproof lunchboxes & sippers',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'cat-edu-toys',
    name: 'Educational Toys',
    slug: 'educational-toys',
    description: 'STEM building kits, world map puzzles, flashcards & abacus',
    image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    display_order: 6,
    is_active: true,
  },
  {
    id: 'cat-sports',
    name: 'Sports Items',
    slug: 'sports-items',
    description: 'Cricket sets, badminton rackets, footballs, skipping ropes',
    image_url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80',
    display_order: 7,
    is_active: true,
  },
  {
    id: 'cat-kids-toys',
    name: 'Kids Toys',
    slug: 'kids-toys',
    description: 'Stunt remote cars, kitchen play sets, action heroes & construction toys',
    image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    display_order: 8,
    is_active: true,
  },
  {
    id: 'cat-soft-toys',
    name: 'Soft Toys',
    slug: 'soft-toys',
    description: 'Plush teddy bears, huggable animal cushions & cartoon soft toys',
    image_url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    display_order: 9,
    is_active: true,
  },
  {
    id: 'cat-games',
    name: 'Games',
    slug: 'games',
    description: 'Monopoly, UNO cards, Carrom boards, Chess & family board games',
    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    display_order: 10,
    is_active: true,
  },
  {
    id: 'cat-gifts',
    name: 'Gifts & Accessories',
    slug: 'gifts-accessories',
    description: 'Stationery gift sets, fancy desk organizers, novelty pens & diaries',
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    display_order: 11,
    is_active: true,
  },
];

const initialProducts: Product[] = [
  // 1. Notebooks & Papers
  {
    id: 'prod-001',
    name: 'Classmate Spiral Longbook (Single Line, 240 Pages, Pack of 3)',
    slug: 'classmate-spiral-longbook-pack-3',
    sku: 'SM-NB-01',
    description: 'Premium chlorine-free paper notebook with sturdy twin wire-o spiral binding. Smooth 70 GSM writing surface suitable for fountain and gel pens with no ink bleed-through.',
    selling_price: 240,
    mrp: 285,
    stock_quantity: 45,
    category_id: 'cat-notebooks',
    category_name: 'Notebooks & Papers',
    images: [
      '/src/assets/images/hero_stationery_school_1794382961056.jpg',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.8,
    review_count: 54,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'A4 Vibrant Origami & Craft Paper Sheets (100 Sheets, 10 Colors)',
    slug: 'a4-vibrant-origami-craft-paper-100-sheets',
    sku: 'SM-NB-02',
    description: 'Assorted high-vibrancy double-sided craft and origami paper sheets. Ideal for school projects, 3D paper crafts, greeting cards and paper folding.',
    selling_price: 140,
    mrp: 180,
    stock_quantity: 60,
    category_id: 'cat-notebooks',
    category_name: 'Notebooks & Papers',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    rating: 4.6,
    review_count: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Camlin Hardbound Practical Record Book (180 Pages, Interleaved)',
    slug: 'camlin-hardbound-practical-record-book',
    sku: 'SM-NB-03',
    description: 'Standard science practical journal notebook with one side ruled and one side plain cartridge paper for diagrams. Durable hardbound cover.',
    selling_price: 110,
    mrp: 130,
    stock_quantity: 35,
    category_id: 'cat-notebooks',
    category_name: 'Notebooks & Papers',
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    rating: 4.7,
    review_count: 31,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 2. Pens & Pencils
  {
    id: 'prod-004',
    name: 'Hauser XO Retractable Ball Pen (Blue Ink, Pack of 5)',
    slug: 'hauser-xo-retractable-ball-pen-pack-5',
    sku: 'SM-PEN-01',
    description: 'Ultra-low viscosity German ink technology for effortless and smudge-free writing. Soft ergonomic rubber grip with click retractable mechanism.',
    selling_price: 90,
    mrp: 100,
    stock_quantity: 80,
    category_id: 'cat-pens',
    category_name: 'Pens & Pencils',
    images: [
      '/src/assets/images/hero_stationery_school_1794382961056.jpg',
      'https://images.unsplash.com/photo-1585336261026-77884d673898?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 88,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Faber-Castell Triangular Drawing Pencils Set (12 Grades: 2B - 8B)',
    slug: 'faber-castell-triangular-drawing-pencils-set',
    sku: 'SM-PEN-02',
    description: 'Professional grade graphite sketching pencils with SV bonded break-resistant leads. Ergonomic triangular barrel for tireless sketching and shading.',
    selling_price: 180,
    mrp: 220,
    stock_quantity: 30,
    category_id: 'cat-pens',
    category_name: 'Pens & Pencils',
    images: [
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    rating: 4.8,
    review_count: 19,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Pilot V5 Hi-Tecpoint Liquid Ink Rollerball Pen (Pack of 3)',
    slug: 'pilot-v5-hi-tecpoint-liquid-ink-pen-3pack',
    sku: 'SM-PEN-03',
    description: 'Legendary pure liquid ink rollerball pen with unique multi-dimple tip. Delivers precise 0.5mm razor-sharp lines with smooth continuous flow.',
    selling_price: 210,
    mrp: 240,
    stock_quantity: 40,
    category_id: 'cat-pens',
    category_name: 'Pens & Pencils',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 3. Art & Craft
  {
    id: 'prod-007',
    name: 'Camel Artist Acrylic Colors (12 Shades x 20ml Tubes Kit)',
    slug: 'camel-artist-acrylic-colors-12-shades',
    sku: 'SM-ART-01',
    description: 'Rich, high-pigment acrylic tubes with satin finish. Water-soluble when wet and permanent water-resistant when dry. Perfect for canvas, wood, terracotta and paper.',
    selling_price: 380,
    mrp: 450,
    stock_quantity: 25,
    category_id: 'cat-art',
    category_name: 'Art & Craft',
    images: [
      '/src/assets/images/hero_art_craft_supplies_1794382964948.jpg',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.8,
    review_count: 42,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    name: 'Faber-Castell Connector Felt Pens (25 Assorted Colors with Clips)',
    slug: 'faber-castell-connector-pens-25-shades',
    sku: 'SM-ART-02',
    description: 'Bright and vibrant food-grade washable marker pens. Unique interlocking caps allow children to clip pens together to build creative models while coloring.',
    selling_price: 190,
    mrp: 230,
    stock_quantity: 50,
    category_id: 'cat-art',
    category_name: 'Art & Craft',
    images: [
      'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    rating: 4.7,
    review_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 4. School Bags & Accessories
  {
    id: 'prod-009',
    name: 'Ergonomic Waterproof Kids School Backpack (Spacious 3-Compartment)',
    slug: 'ergonomic-waterproof-kids-school-backpack',
    sku: 'SM-BAG-01',
    description: 'Durable tear-resistant polyester school bag with padded air-mesh back support, adjustable shoulder straps, reflective safety strips and dual bottle holders.',
    selling_price: 799,
    mrp: 1199,
    stock_quantity: 18,
    category_id: 'cat-bags',
    category_name: 'School Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    rating: 4.7,
    review_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-010',
    name: 'Multi-Function Cartoon Pencil Box with Dual Sharpeners & Calculator',
    slug: 'multi-function-cartoon-pencil-box-popout',
    sku: 'SM-BAG-02',
    description: 'Interactive magnetic pencil case with push-button pop-out compartments, built-in dual pencil sharpener, mini calculator and eraser holder.',
    selling_price: 280,
    mrp: 350,
    stock_quantity: 35,
    category_id: 'cat-bags',
    category_name: 'School Bags',
    images: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    rating: 4.6,
    review_count: 36,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 5. Bottles & Tiffins
  {
    id: 'prod-011',
    name: 'Milton Thermosteel Insulated Water Bottle (750ml, Hot & Cold 24hr)',
    slug: 'milton-thermosteel-insulated-water-bottle-750ml',
    sku: 'SM-BOT-01',
    description: '100% rust-proof 304 grade stainless steel vacuum insulated flask. Keeps drinks icy cold or steaming hot for 24 hours. Leakproof flip-lid with carry strap.',
    selling_price: 649,
    mrp: 790,
    stock_quantity: 22,
    category_id: 'cat-bottles',
    category_name: 'Bottles & Tiffins',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 53,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-012',
    name: 'Cello Stainless Steel 3-Tier Leakproof Kids Lunch Tiffin Box',
    slug: 'cello-stainless-steel-3-tier-tiffin-box',
    sku: 'SM-BOT-02',
    description: 'Food grade BPA-free airtight tiffin box with stainless steel inner containers. Keeps food warm and fresh with silicone gasket leak-prevention seal.',
    selling_price: 499,
    mrp: 620,
    stock_quantity: 26,
    category_id: 'cat-bottles',
    category_name: 'Bottles & Tiffins',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    rating: 4.8,
    review_count: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 6. Educational Toys
  {
    id: 'prod-013',
    name: 'Skillmatics World Map Geography STEM Floor Puzzle (100 Pieces)',
    slug: 'skillmatics-world-map-geography-puzzle',
    sku: 'SM-EDU-01',
    description: 'Extra thick jigsaw puzzle pieces featuring countries, landmarks, wildlife and ocean geography. Includes educational fact cards and interactive search-and-find activity.',
    selling_price: 450,
    mrp: 599,
    stock_quantity: 20,
    category_id: 'cat-edu-toys',
    category_name: 'Educational Toys',
    images: [
      '/src/assets/images/hero_educational_toys_1794382963964.jpg',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 48,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-014',
    name: 'Classic Wooden Abacus 10-Row Counting & Math Frame',
    slug: 'classic-wooden-abacus-counting-frame',
    sku: 'SM-EDU-02',
    description: 'Handcrafted solid natural pine wood abacus with 100 smooth rainbow-painted counting beads. Develops spatial math ability and fine motor coordination.',
    selling_price: 320,
    mrp: 420,
    stock_quantity: 28,
    category_id: 'cat-edu-toys',
    category_name: 'Educational Toys',
    images: [
      '/src/assets/images/hero_educational_toys_1794382963964.jpg',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    rating: 4.8,
    review_count: 17,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 7. Sports Items
  {
    id: 'prod-015',
    name: 'Yonex Carbon Shaft Badminton Racket Set with 3 Shuttlecocks',
    slug: 'yonex-badminton-racket-set-with-shuttles',
    sku: 'SM-SPT-01',
    description: 'Lightweight isometric aluminum-carbon frame with high-tension nylon gutting. Set includes 2 rackets, full zipped thermal cover and a tube of 3 durable nylon shuttlecocks.',
    selling_price: 899,
    mrp: 1250,
    stock_quantity: 15,
    category_id: 'cat-sports',
    category_name: 'Sports Items',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.8,
    review_count: 39,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-016',
    name: 'Cosco Dynamo Hand-Stitched All-Weather Football (Size 5)',
    slug: 'cosco-dynamo-hand-stitched-football-size-5',
    sku: 'SM-SPT-02',
    description: 'Top-tier synthetic leather 32-panel hand-stitched football with latex bladder for shape retention and high air pressure stability on turf or grass.',
    selling_price: 680,
    mrp: 850,
    stock_quantity: 18,
    category_id: 'cat-sports',
    category_name: 'Sports Items',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    rating: 4.7,
    review_count: 21,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 8. Kids Toys
  {
    id: 'prod-017',
    name: 'Hot Wheels 5-Car Themed Die-Cast Collector Gift Pack',
    slug: 'hot-wheels-5-car-gift-pack',
    sku: 'SM-TOY-01',
    description: 'Authentic 1:64 scale die-cast metal vehicles with authentic styling and eye-catching decos. Ready for speed tracks and collector showcases.',
    selling_price: 699,
    mrp: 799,
    stock_quantity: 32,
    category_id: 'cat-kids-toys',
    category_name: 'Kids Toys',
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 73,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-018',
    name: '360° Rotating Stunt RC Car with LED Headlights & USB Charger',
    slug: '360-rotating-stunt-rc-car-rechargeable',
    sku: 'SM-TOY-02',
    description: 'Double-sided driving remote control car that flips, spins, and overcomes obstacles with high-grip soft rubber tires. Long lasting rechargeable battery included.',
    selling_price: 949,
    mrp: 1399,
    stock_quantity: 14,
    category_id: 'cat-kids-toys',
    category_name: 'Kids Toys',
    images: [
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    rating: 4.8,
    review_count: 27,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 9. Soft Toys
  {
    id: 'prod-019',
    name: 'Premium Plush Brown Huggable Teddy Bear (40 cm, Hypoallergenic)',
    slug: 'premium-plush-brown-teddy-bear-40cm',
    sku: 'SM-SFT-01',
    description: 'Super-soft velvety fur teddy bear filled with 100% virgin conjugate microfiber. Skin-safe, non-toxic and easily machine washable.',
    selling_price: 499,
    mrp: 699,
    stock_quantity: 24,
    category_id: 'cat-soft-toys',
    category_name: 'Soft Toys',
    images: [
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 10. Games
  {
    id: 'prod-020',
    name: 'Mattel UNO Classic Card Game (Original 112 Cards Edition)',
    slug: 'mattel-uno-classic-card-game-original',
    sku: 'SM-GAM-01',
    description: 'The world-famous fast-paced family color matching card game. Includes customizable wild cards to create your own family game night rules.',
    selling_price: 135,
    mrp: 149,
    stock_quantity: 75,
    category_id: 'cat-games',
    category_name: 'Games',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    rating: 4.9,
    review_count: 92,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-021',
    name: 'Funskool Monopoly India Edition Board Game',
    slug: 'funskool-monopoly-india-edition-board-game',
    sku: 'SM-GAM-02',
    description: 'Classic real estate trading board game featuring prime Indian cities and landmarks. Teaches financial awareness, negotiation and strategic decision-making.',
    selling_price: 649,
    mrp: 799,
    stock_quantity: 19,
    category_id: 'cat-games',
    category_name: 'Games',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    rating: 4.8,
    review_count: 34,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 11. Gifts & Accessories
  {
    id: 'prod-022',
    name: 'Curated Birthday Stationery Gift Hamper Box (With Plush Bunny & Pastel Journal)',
    slug: 'curated-birthday-stationery-gift-hamper-box',
    sku: 'SM-GFT-01',
    description: 'Delightful gift package containing a gold-foil hardbound notebook, 4 novelty cartoon gel pens, cute cloud paperclips, sticky notes and a mini plush bunny companion in a reusable wooden keepsake box with satin ribbon.',
    selling_price: 549,
    mrp: 750,
    stock_quantity: 15,
    category_id: 'cat-gifts',
    category_name: 'Gifts & Accessories',
    images: [
      '/src/assets/images/promo_stationery_gifts_1794382962939.jpg',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    rating: 5.0,
    review_count: 29,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-023',
    name: 'Multi-Compartment Wooden Desk Organizer with Pen Stand & Drawer',
    slug: 'multi-compartment-wooden-desk-organizer',
    sku: 'SM-GFT-02',
    description: 'Eco-friendly natural engineered wood desk tidy organizer. 5 vertical sorting slots for notebooks, letters, calculators and 2 pull-out drawers for pins and clips.',
    selling_price: 399,
    mrp: 550,
    stock_quantity: 20,
    category_id: 'cat-gifts',
    category_name: 'Gifts & Accessories',
    images: [
      'https://images.unsplash.com/photo-1507842229451-7f01be837a27?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    rating: 4.7,
    review_count: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialBanners: Banner[] = [
  {
    id: 'ban-01',
    title: 'Back to School Essentials',
    subtitle: 'From premium notebooks and precision pens to ergonomic backpacks. Everything your student needs to excel.',
    image_url: '/src/assets/images/hero_stationery_school_1794382961056.jpg',
    button_text: 'Shop School Supplies',
    button_link: '/shop?category=cat-notebooks',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'ban-02',
    title: 'Explore Our Amazing Toys & Games',
    subtitle: 'Spark curiosity, creative problem-solving and boundless joy with STEM kits, board games and safe kids toys.',
    image_url: '/src/assets/images/hero_educational_toys_1794382963964.jpg',
    button_text: 'Discover Toys & Games',
    button_link: '/shop?category=cat-edu-toys',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'ban-03',
    title: 'Creativity Starts Here: Art & Craft',
    subtitle: 'Rich artist acrylics, fine brushes, sketchbooks and vibrant crafting materials for imaginative minds.',
    image_url: '/src/assets/images/hero_art_craft_supplies_1794382964948.jpg',
    button_text: 'Explore Art Collection',
    button_link: '/shop?category=cat-art',
    display_order: 3,
    is_active: true,
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-demo-001',
    order_number: '#MH-2026-1001',
    customer_name: 'Aarav Mehta',
    customer_phone: '9876543210',
    delivery_address: 'Flat 302, Green Valley Apartments, Civil Lines',
    city: 'Roorkee',
    pincode: '247667',
    order_type: 'Home Delivery',
    additional_notes: 'Please ring bell twice or call before arriving',
    subtotal: 520,
    delivery_charge: 0,
    total_amount: 520,
    order_status: 'Completed',
    items: [
      {
        id: 'item-01',
        order_id: 'ord-demo-001',
        product_id: 'prod-001',
        product_name: 'Classmate Spiral Longbook (Single Line, 240 Pages, Pack of 3)',
        product_sku: 'SM-NB-01',
        quantity: 1,
        unit_price: 240,
        line_total: 240,
      },
      {
        id: 'item-02',
        order_id: 'ord-demo-001',
        product_id: 'prod-010',
        product_name: 'Multi-Function Cartoon Pencil Box with Dual Sharpeners & Calculator',
        product_sku: 'SM-BAG-02',
        quantity: 1,
        unit_price: 280,
        line_total: 280,
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-demo-002',
    order_number: '#MH-2026-1002',
    customer_name: 'Pooja Verma',
    customer_phone: '9897123456',
    delivery_address: 'In-Store Pickup',
    city: 'Haridwar',
    pincode: '',
    order_type: 'Store Pickup',
    additional_notes: 'Will pick up today evening around 6 PM',
    subtotal: 450,
    delivery_charge: 0,
    total_amount: 450,
    order_status: 'WhatsApp Confirmed',
    items: [
      {
        id: 'item-03',
        order_id: 'ord-demo-002',
        product_id: 'prod-013',
        product_name: 'Skillmatics World Map Geography STEM Floor Puzzle (100 Pieces)',
        product_sku: 'SM-EDU-01',
        quantity: 1,
        unit_price: 450,
        line_total: 450,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const initialSettings: StoreSettings = {
  store_name: 'Shri Mahaveer Stationery & Toys',
  tagline: 'Study • Play • Grow',
  logo_url: '',
  whatsapp_number: '919555257650',
  whatsapp_default_message: "Hello Shri Mahaveer Stationery & Toys! I'm browsing your online store and have a question about your products.",
  contact_number: '+91 95552 57650',
  email: 'contact@shrimahaveerstationery.com',
  address: 'Shop No. 12, Main Market, Opp. Central School, Civil Lines',
  city: 'Haridwar / Roorkee, Uttarakhand - 247667',
  opening_hours: 'Monday – Saturday: 9:30 AM – 9:00 PM | Sunday: 10:00 AM – 8:00 PM',
  announcement_text: '✨ Welcome to Shri Mahaveer Stationery & Toys! Fast WhatsApp Ordering with In-Store Pickup & Local Home Delivery ✨',
  delivery_settings: {
    home_delivery_available: true,
    store_pickup_available: true,
    delivery_charge_note: 'As confirmed by store',
    free_delivery_above: 500,
  },
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  currency: 'INR',
  currency_symbol: '₹',
  policies: {
    privacy_policy: 'We value your privacy. Your contact details, phone number and delivery addresses collected during checkout are used exclusively to process and fulfill your WhatsApp orders and store queries. We never sell, share or trade your personal information with external parties.',
    terms_and_conditions: 'All items displayed on Shri Mahaveer Stationery & Toys are subject to stock availability at our physical retail counter. WhatsApp order requests submitted via this website are confirmed once our store team verifies product availability, delivery slot and any applicable delivery charges with you directly on WhatsApp.',
    return_policy: 'Stationery and toy items can be inspected during in-store pickup or upon delivery. If any manufacturing defect or damaged article is detected, please notify us via WhatsApp within 48 hours for immediate replacement or store exchange credit.',
  },
  admin_password_hash: 'admin123', // Default bootstrap admin password
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);
        if (parsed.settings && !parsed.settings.whatsapp_default_message) {
          parsed.settings.whatsapp_default_message = initialSettings.whatsapp_default_message;
          this.save(parsed);
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error loading database, initializing fresh store:', err);
    }

    const defaultData: DatabaseSchema = {
      categories: initialCategories,
      products: initialProducts,
      banners: initialBanners,
      orders: initialOrders,
      settings: initialSettings,
    };

    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  // Categories
  getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.display_order - b.display_order);
  }

  getCategory(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id || c.slug === id);
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const id = `cat-${Date.now()}`;
    const newCategory: Category = { ...category, id };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Products
  getProducts(query?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    inStockOnly?: boolean;
    hasOffer?: boolean;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
    includeInactive?: boolean;
  }): Product[] {
    let result = [...this.data.products];

    if (!query?.includeInactive) {
      result = result.filter(p => p.is_active);
    }

    if (query?.category) {
      result = result.filter(
        p => p.category_id === query.category || p.slug === query.category
      );
    }

    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          (p.category_name && p.category_name.toLowerCase().includes(s))
      );
    }

    if (query?.minPrice !== undefined) {
      result = result.filter(p => p.selling_price >= query.minPrice!);
    }
    if (query?.maxPrice !== undefined) {
      result = result.filter(p => p.selling_price <= query.maxPrice!);
    }

    if (query?.isNew) {
      result = result.filter(p => p.is_new);
    }
    if (query?.isFeatured) {
      result = result.filter(p => p.is_featured);
    }
    if (query?.isBestSeller) {
      result = result.filter(p => p.is_best_seller);
    }
    if (query?.inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }
    if (query?.hasOffer) {
      result = result.filter(p => p.mrp > p.selling_price);
    }

    // Sort
    if (query?.sortBy === 'price-asc') {
      result.sort((a, b) => a.selling_price - b.selling_price);
    } else if (query?.sortBy === 'price-desc') {
      result.sort((a, b) => b.selling_price - a.selling_price);
    } else if (query?.sortBy === 'popular') {
      result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    } else {
      // Default: newest or featured
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }

  getProduct(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const category = this.data.categories.find(c => c.id === product.category_id);
    const newProduct: Product = {
      ...product,
      id,
      category_name: category ? category.name : undefined,
      created_at: now,
      updated_at: now,
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    let categoryName = this.data.products[idx].category_name;
    if (updates.category_id) {
      const cat = this.data.categories.find(c => c.id === updates.category_id);
      if (cat) categoryName = cat.name;
    }
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      category_name: categoryName,
      updated_at: now,
    };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Banners
  getBanners(): Banner[] {
    return [...this.data.banners].sort((a, b) => a.display_order - b.display_order);
  }

  createBanner(banner: Omit<Banner, 'id'>): Banner {
    const id = `ban-${Date.now()}`;
    const newBanner: Banner = { ...banner, id };
    this.data.banners.push(newBanner);
    this.save();
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<Banner>): Banner | null {
    const idx = this.data.banners.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.banners[idx] = { ...this.data.banners[idx], ...updates };
    this.save();
    return this.data.banners[idx];
  }

  deleteBanner(id: string): boolean {
    const initialLen = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    if (this.data.banners.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getOrder(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.order_number === id);
  }

  /**
   * Secure order creation with server-side price validation
   */
  createOrder(payload: {
    customer_name: string;
    customer_phone: string;
    delivery_address?: string;
    city?: string;
    pincode?: string;
    order_type: 'Home Delivery' | 'Store Pickup';
    additional_notes?: string;
    items: Array<{ product_id: string; quantity: number }>;
  }): Order {
    const orderId = `ord-${Date.now()}`;
    const orderNumSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#MH-${new Date().getFullYear()}-${orderNumSuffix}`;

    const validatedItems: OrderItem[] = [];
    let subtotal = 0;

    for (const itemReq of payload.items) {
      const prod = this.data.products.find(p => p.id === itemReq.product_id);
      if (!prod) continue;
      const qty = Math.max(1, itemReq.quantity);
      const lineTotal = prod.selling_price * qty;
      subtotal += lineTotal;

      validatedItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        order_id: orderId,
        product_id: prod.id,
        product_name: prod.name,
        product_sku: prod.sku,
        quantity: qty,
        unit_price: prod.selling_price,
        line_total: lineTotal,
      });

      // Decrease stock if tracked
      if (prod.stock_quantity >= qty) {
        prod.stock_quantity -= qty;
      }
    }

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: payload.customer_name.trim(),
      customer_phone: payload.customer_phone.trim(),
      delivery_address: payload.delivery_address?.trim() || '',
      city: payload.city?.trim() || '',
      pincode: payload.pincode?.trim() || '',
      order_type: payload.order_type,
      additional_notes: payload.additional_notes?.trim() || '',
      subtotal,
      delivery_charge: 0, // As confirmed by store on WhatsApp
      total_amount: subtotal,
      order_status: 'Pending Request',
      items: validatedItems,
      created_at: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['order_status']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.order_number === id);
    if (!order) return null;
    order.order_status = status;
    this.save();
    return order;
  }

  // Settings
  getSettings(): StoreSettings {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  verifyAdmin(password: string): boolean {
    const currentPass = this.data.settings.admin_password_hash || 'admin123';
    return password === currentPass;
  }

  // Bulk import
  bulkImportProducts(products: Array<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): number {
    let count = 0;
    const now = new Date().toISOString();
    for (const p of products) {
      const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const cat = this.data.categories.find(c => c.id === p.category_id);
      this.data.products.push({
        ...p,
        id,
        category_name: cat ? cat.name : undefined,
        created_at: now,
        updated_at: now,
      });
      count++;
    }
    this.save();
    return count;
  }
}

export const db = new Database();
