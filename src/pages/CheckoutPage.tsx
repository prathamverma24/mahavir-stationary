import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatWhatsAppMessage,
  createWhatsAppUrl,
  calculateOrderTotals,
} from '../utils/orderUtils';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Store,
  Truck,
  ArrowLeft,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'Home Delivery' | 'Store Pickup'>('Home Delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Roorkee');
  const [pincode, setPincode] = useState('247667');
  const [notes, setNotes] = useState('');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    whatsAppUrl: string;
    whatsAppMessage: string;
    customerPhone: string;
    totalAmount: number;
    orderType: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // If cart is empty and no order just completed, redirect to shop
  if (items.length === 0 && !completedOrder) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-stone-900">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white text-xs font-semibold rounded-xl"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Handle Form Submission & WhatsApp Order Placement
  const handlePlaceOrderOnWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp/mobile number');
      return;
    }

    if (orderType === 'Home Delivery' && !address.trim()) {
      setErrorMsg('Please enter your delivery street address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Save order to server database
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_phone: cleanPhone,
        delivery_address: orderType === 'Home Delivery' ? address.trim() : 'Store Counter Pickup',
        city: orderType === 'Home Delivery' ? city.trim() : '',
        pincode: orderType === 'Home Delivery' ? pincode.trim() : '',
        order_type: orderType,
        additional_notes: notes.trim(),
        items: items.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to record order request in database');
      }

      const savedOrder = await res.json();

      // Step 2: Format WhatsApp message from actual items and customer input
      const formattedMsg = formatWhatsAppMessage({
        orderNumber: savedOrder.order_number,
        customer: {
          name: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          orderType: orderType,
          notes: notes.trim(),
        },
        items: savedOrder.items.map((item: any) => ({
          product_name: item.product_name,
          product_sku: item.product_sku,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        subtotal: savedOrder.subtotal,
        deliveryChargeNote: 'As confirmed by store',
        totalAmount: savedOrder.total_amount,
      });

      // Step 3: Build wa.me URL
      const waUrl = createWhatsAppUrl(settings.whatsapp_number, formattedMsg);

      // Step 4: Save completed state for confirmation screen
      setCompletedOrder({
        orderNumber: savedOrder.order_number,
        whatsAppUrl: waUrl,
        whatsAppMessage: formattedMsg,
        customerPhone: cleanPhone,
        totalAmount: savedOrder.total_amount,
        orderType: savedOrder.order_type,
      });

      // Step 5: Clear cart now that order is securely saved
      clearCart();

      // Step 6: Attempt to open WhatsApp window automatically
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'An error occurred while creating your order request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.whatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // -------------------------------------------------------------------------
  // POST-ORDER SUCCESS SCREEN
  // -------------------------------------------------------------------------
  if (completedOrder) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-2xl">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Header check icon */}
          <div className="text-center space-y-3">
            <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Request Saved Successfully
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
              Order {completedOrder.orderNumber} Prepared!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Your order request has been registered with our store database. Complete the conversation on WhatsApp to confirm your items, delivery time, or pickup slot.
            </p>
          </div>

          {/* Primary Action Button (Green WhatsApp CTA) */}
          <div className="space-y-3 pt-2">
            <a
              href={completedOrder.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-98 text-center"
            >
              <MessageSquare className="w-5 h-5 fill-white" /> Open Order on WhatsApp Now
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            <button
              onClick={handleCopyText}
              className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied to Clipboard!' : 'Copy Formatted WhatsApp Message'}
            </button>
          </div>

          {/* Notice Banner */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" /> Important Note on Confirmation:
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Your order is not officially confirmed or paid until our store representative verifies stock availability and confirms with you directly on WhatsApp.
            </p>
          </div>

          {/* Message Preview Accordion */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <div className="bg-stone-50 px-4 py-2.5 text-xs font-bold text-stone-700 border-b border-stone-200">
              Generated WhatsApp Message:
            </div>
            <pre className="p-4 text-[11px] text-stone-700 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto bg-stone-50/40">
              {completedOrder.whatsAppMessage}
            </pre>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#0F172A] hover:text-[#781D2E] hover:underline"
            >
              ← Back to Stationery Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN CHECKOUT FORM
  // -------------------------------------------------------------------------
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-8 max-w-6xl">
      {/* Breadcrumb / Title */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-2 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
        </Link>
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900">
          Direct WhatsApp Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Provide your contact details. Your order will be sent directly to our retail counter via WhatsApp.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrderOnWhatsApp} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Info (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E2D9] shadow-2xs p-6 md:p-8 space-y-6">
          {/* Step 1: Order Type Selection */}
          <div>
            <label className="block text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-2">
              Order Fulfillment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('Home Delivery')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                  orderType === 'Home Delivery'
                    ? 'border-[#0F172A] bg-[#FAF8F5] text-[#0F172A]'
                    : 'border-[#E8E2D9] bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <Truck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-xs">Home Delivery</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Delivered to your doorstep</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Store Pickup')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                  orderType === 'Store Pickup'
                    ? 'border-[#0F172A] bg-[#FAF8F5] text-[#0F172A]'
                    : 'border-[#E8E2D9] bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <Store className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-xs">In-Store Pickup</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Collect from counter</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Contact Information */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">
              Customer Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Name <span className="text-[#781D2E]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan Sharma"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                WhatsApp / Mobile Number <span className="text-[#781D2E]">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E8E2D9] bg-stone-100 text-stone-600 text-xs font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-r-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                We will send your order confirmation and receipt link to this number.
              </p>
            </div>
          </div>

          {/* Step 3: Delivery Address (Only if Home Delivery) */}
          {orderType === 'Home Delivery' ? (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">
                Delivery Address
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address, House No. / Flat <span className="text-[#781D2E]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House No., Street Name, Landmark"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] text-xs text-stone-800">
              <p className="font-serif font-bold flex items-center gap-1.5 text-[#0F172A]">
                <Store className="w-4 h-4 text-[#C5A059]" /> Store Counter Pickup Selected
              </p>
              <p className="text-[11px] text-stone-600 mt-1">
                Your items will be kept packed at our counter: <strong>{settings.address}, {settings.city}</strong>. No delivery address required!
              </p>
            </div>
          )}

          {/* Optional Notes */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Special Instructions / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Call before coming, gift wrap needed"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp Button (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 space-y-6">
          <h2 className="font-serif font-bold text-lg text-stone-900 pb-3 border-b border-[#E8E2D9]">
            Order Items Summary
          </h2>

          {/* Itemized Snapshot list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-stone-100">
            {items.map((item, idx) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-stone-900 line-clamp-1">
                    {idx + 1}. {item.product.name}
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono">
                    SKU: {item.product.sku} • Qty: {item.quantity} × ₹{item.product.selling_price}
                  </p>
                </div>
                <span className="font-serif font-bold text-stone-900 tabular-nums">
                  ₹{item.product.selling_price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="pt-4 border-t border-[#E8E2D9] space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center justify-between">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-serif font-bold text-stone-900 tabular-nums">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Delivery Charge</span>
              <span className="text-stone-500 font-medium">As confirmed by store</span>
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] flex items-baseline justify-between">
              <span className="font-bold text-stone-900 text-sm">Estimated Total</span>
              <span className="font-serif font-bold text-2xl text-[#0F172A] tabular-nums">
                ₹{subtotal}
              </span>
            </div>
          </div>

          {/* Step 4 Prominent WhatsApp Button */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] disabled:bg-stone-300 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Order Request...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 fill-white" /> Place Order on WhatsApp
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure • Direct Store Confirmation</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
