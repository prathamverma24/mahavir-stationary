import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-stone-900">Shopping Bag</h2>
                <p className="text-xs text-stone-500">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-[#781D2E] transition-colors p-1"
                  title="Clear all items"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart drawer"
                className="w-8 h-8 rounded-full hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-800 mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore our collection of fine stationery, art supplies and educational games.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] border border-[#C5A059]/40 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.product.id} className="py-4 flex gap-3 group">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-stone-100 border border-[#E8E2D9] shrink-0"
                  />

                  {/* Item details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-stone-300 hover:text-[#781D2E] transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                        Code: {item.product.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 font-serif tabular-nums">
                          ₹{item.product.selling_price * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-stone-400">
                            (₹{item.product.selling_price} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D9] bg-[#FAF8F5] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-stone-600">Subtotal</span>
                <span className="font-serif font-bold text-lg text-stone-900 tabular-nums">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-[#E8E2D9]">
                <MessageCircle className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Direct WhatsApp checkout with instant store confirmation.</span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#C5A059]/40 py-3.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>

                <button
                  onClick={handleViewCartPage}
                  className="w-full bg-white hover:bg-stone-50 text-stone-800 py-2.5 px-4 rounded-xl font-medium text-xs border border-[#E8E2D9] transition-colors"
                >
                  View Full Bag Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
