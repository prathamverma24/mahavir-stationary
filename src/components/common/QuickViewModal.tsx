import React, { useState } from 'react';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { calculateDiscount, createWhatsAppUrl } from '../../utils/orderUtils';
import { X, ShoppingBag, Plus, Minus, MessageSquare, Check, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const discountPercent = calculateDiscount(product.mrp, product.selling_price);
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleInstantWhatsApp = () => {
    const text = `Hello ${settings.store_name || 'Shri Mahavir Stationery & Toys'}! I'm interested in ordering:

Product: ${product.name}
SKU: ${product.sku}
Quantity: ${quantity}
Price: ₹${product.selling_price * quantity}

Please confirm stock and delivery availability. Thank you!`;
    const url = createWhatsAppUrl(settings.whatsapp_number, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:flex-row"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-white shadow-md flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="md:w-1/2 bg-[#FAF8F5] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E2D9]">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-[#E8E2D9] flex items-center justify-center relative">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#781D2E] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-[#C5A059] shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span className="uppercase tracking-wider text-[10px] font-bold text-[#A68238]">{product.category_name || 'Stationery'}</span>
              <span className="font-mono text-stone-400">SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl font-bold font-serif text-stone-900 leading-snug mb-3">
              {product.name}
            </h2>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
                ₹{product.selling_price}
              </span>
              {product.mrp > product.selling_price && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  MRP ₹{product.mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-stone-900 bg-[#C5A059]/20 px-2 py-0.5 rounded-sm">
                  Save ₹{product.mrp - product.selling_price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-600 mb-6 bg-stone-50 p-2.5 rounded-xl border border-[#E8E2D9]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>100% Genuine product • Fast WhatsApp confirmation</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            {inStock ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-stone-200 text-stone-600 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 hover:bg-stone-200 text-stone-600 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-emerald-800 font-medium">
                    {product.stock_quantity} in stock
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#0F172A] hover:bg-[#1E293B] text-white border border-transparent hover:border-[#C5A059]/40 shadow-xs'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-[#C5A059]" />}
                    {added ? 'Added to Bag' : 'Add to Bag'}
                  </button>

                  <button
                    onClick={handleInstantWhatsApp}
                    className="py-3 px-4 rounded-xl font-semibold text-xs bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" /> Order on WhatsApp
                  </button>
                </div>
              </>
            ) : (
              <div className="p-3 bg-stone-100 text-stone-600 text-center rounded-xl text-xs font-medium">
                Currently Out of Stock. Contact store for restock alert.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
