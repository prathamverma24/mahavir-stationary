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

export interface CartItem {
  product: Product;
  quantity: number;
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
}
