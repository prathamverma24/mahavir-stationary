export interface OrderItemInput {
  product_id?: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  line_total?: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  orderType: 'Home Delivery' | 'Store Pickup';
  notes?: string;
}

export interface WhatsAppOrderInput {
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItemInput[];
  subtotal: number;
  deliveryChargeNote?: string;
  totalAmount: number;
}

/**
 * Calculates discount percentage rounded to nearest integer
 */
export function calculateDiscount(mrp: number, sellingPrice: number): number {
  if (!mrp || mrp <= 0 || sellingPrice >= mrp) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

/**
 * Formats currency in INR format (₹)
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Generates human-friendly sequential-style Order ID e.g. #MH-2026-0412
 */
export function generateOrderId(customSuffix?: string | number): string {
  const year = new Date().getFullYear();
  const randomPart = customSuffix ?? Math.floor(1000 + Math.random() * 9000);
  return `#MH-${year}-${randomPart}`;
}

/**
 * Computes subtotal, delivery, and total amounts accurately
 */
export function calculateOrderTotals(
  items: Array<{ unit_price: number; quantity: number }>,
  deliveryCharge = 0
): { subtotal: number; total: number; totalItems: number } {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal,
    total: subtotal + (deliveryCharge > 0 ? deliveryCharge : 0),
    totalItems,
  };
}

/**
 * Generates exact WhatsApp message according to the business specification
 */
export function formatWhatsAppMessage(data: WhatsAppOrderInput): string {
  const { orderNumber, customer, items, subtotal, deliveryChargeNote, totalAmount } = data;

  let addressBlock = '';
  if (customer.orderType === 'Home Delivery') {
    const fullAddr = [customer.address, customer.city, customer.pincode].filter(Boolean).join(', ');
    addressBlock = `Address: ${fullAddr || 'Not provided'}`;
  } else {
    addressBlock = `Pickup: In-Store Pickup selected`;
  }

  const itemsList = items
    .map((item, index) => {
      const lineTotal = item.unit_price * item.quantity;
      return `${index + 1}. ${item.product_name}\n   Product Code: ${item.product_sku || 'N/A'}\n   Quantity: ${item.quantity}\n   Price: ₹${item.unit_price}\n   Total: ₹${lineTotal}`;
    })
    .join('\n\n');

  const notesBlock = customer.notes ? `\nAdditional Instructions: ${customer.notes}` : '';
  const deliveryText = deliveryChargeNote || 'As confirmed by store';

  return `Hello Shri Mahavir Stationery & Toys!

I would like to place an order.

Order ID: ${orderNumber}

Customer Details:
Name: ${customer.name}
Phone: ${customer.phone}
${addressBlock}${notesBlock}

Order Items:

${itemsList}

Subtotal: ₹${subtotal}
Delivery Charge: ${deliveryText}
Total Estimated Amount: ₹${totalAmount}

Order Type: ${customer.orderType}

Please confirm product availability and the final order details.

Thank you!`;
}

/**
 * Builds WhatsApp link with phone number and encoded text
 */
export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip non-numeric characters
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
