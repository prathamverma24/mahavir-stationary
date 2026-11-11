import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiscount,
  formatCurrency,
  generateOrderId,
  calculateOrderTotals,
  formatWhatsAppMessage,
  createWhatsAppUrl,
} from './orderUtils.js';

test('calculateDiscount returns correct percentage', () => {
  assert.equal(calculateDiscount(200, 150), 25);
  assert.equal(calculateDiscount(100, 80), 20);
  assert.equal(calculateDiscount(100, 100), 0);
  assert.equal(calculateDiscount(0, 50), 0);
});

test('formatCurrency formats Indian rupee format', () => {
  assert.equal(formatCurrency(350), '₹350');
  assert.equal(formatCurrency(1250), '₹1,250');
});

test('generateOrderId creates properly formatted year-prefixed ID', () => {
  const currentYear = new Date().getFullYear();
  const id = generateOrderId('0001');
  assert.equal(id, `#MH-${currentYear}-0001`);
});

test('calculateOrderTotals computes correct line items and subtotal', () => {
  const items = [
    { unit_price: 100, quantity: 2 },
    { unit_price: 150, quantity: 1 },
  ];
  const { subtotal, total, totalItems } = calculateOrderTotals(items, 0);
  assert.equal(subtotal, 350);
  assert.equal(total, 350);
  assert.equal(totalItems, 3);
});

test('formatWhatsAppMessage formats the exact requested template', () => {
  const message = formatWhatsAppMessage({
    orderNumber: '#MH-2026-0001',
    customer: {
      name: 'Rohan Sharma',
      phone: '9876543210',
      address: 'House 42, Civil Lines',
      city: 'Roorkee',
      pincode: '247667',
      orderType: 'Home Delivery',
    },
    items: [
      { product_name: 'Classmate Long Notebook', product_sku: 'ABC-01', quantity: 2, unit_price: 100 },
      { product_name: 'Reynolds Ball Pens Pack', product_sku: 'XYZ-02', quantity: 1, unit_price: 150 },
    ],
    subtotal: 350,
    totalAmount: 350,
  });

  assert.match(message, /Hello Shri Mahavir Stationery & Toys!/);
  assert.match(message, /Order ID: #MH-2026-0001/);
  assert.match(message, /Name: Rohan Sharma/);
  assert.match(message, /Phone: 9876543210/);
  assert.match(message, /Address: House 42, Civil Lines, Roorkee, 247667/);
  assert.match(message, /Product Code: ABC-01/);
  assert.match(message, /Subtotal: ₹350/);
  assert.match(message, /Delivery Charge: As confirmed by store/);
  assert.match(message, /Total Estimated Amount: ₹350/);
  assert.match(message, /Order Type: Home Delivery/);
  assert.match(message, /Please confirm product availability and the final order details\./);
});

test('createWhatsAppUrl creates valid wa.me link with encoded text', () => {
  const url = createWhatsAppUrl('+91 95552 57650', 'Hello Store');
  assert.equal(url, 'https://wa.me/919555257650?text=Hello%20Store');
});
