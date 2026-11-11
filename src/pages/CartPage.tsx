import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-xl text-center space-y-5">
        <div className="w-24 h-24 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#C5A059] mx-auto">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          You haven't added any stationery, art kits or toys to your bag yet. Browse our catalogue to discover great school and creative essentials.
        </p>
        <div className="pt-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
          >
            Start Shopping Now <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your selected stationery and toys ({totalItems} items)
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#781D2E] hover:underline font-semibold self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table / List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E2D9] shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-6 divide-y divide-stone-100">
            {items.map(item => (
              <div key={item.product.id} className="py-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                {/* Product info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-[#FAF8F5] border border-[#E8E2D9] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono">Code: {item.product.sku}</span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="block font-semibold text-sm text-stone-900 hover:text-[#781D2E] transition-colors leading-snug line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      ₹{item.product.selling_price} each
                    </p>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-50">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E8E2D9] rounded-xl bg-[#FAF8F5]">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 hover:bg-stone-200 text-stone-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-stone-200 text-stone-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-serif font-bold text-base text-stone-900 tabular-nums">
                      ₹{item.product.selling_price * item.quantity}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}
                    className="text-stone-300 hover:text-[#781D2E] transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D9] flex items-center justify-between">
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#0F172A] hover:text-[#781D2E] hover:underline flex items-center gap-1.5 uppercase tracking-wider"
            >
              ← Continue Shopping
            </Link>
            <span className="text-xs text-stone-500">{totalItems} items in bag</span>
          </div>
        </div>

        {/* Right: Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 space-y-5">
          <h2 className="font-serif font-bold text-lg text-stone-900 pb-3 border-b border-[#E8E2D9]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex items-center justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900 tabular-nums font-serif text-sm">
                ₹{subtotal}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Delivery Charge</span>
              <span className="text-stone-500 font-medium">As confirmed on WhatsApp</span>
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] flex items-baseline justify-between">
              <span className="font-bold text-sm text-stone-900">Total Estimated Amount</span>
              <span className="font-serif font-bold text-xl text-[#0F172A] tabular-nums">
                ₹{subtotal}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] text-xs text-stone-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> WhatsApp Ordering Guarantee
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              No online card transactions needed. We confirm stock and pickup/delivery details with you directly.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>
      </div>
    </div>
  );
};
