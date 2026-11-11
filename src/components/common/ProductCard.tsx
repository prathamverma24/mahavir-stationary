import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { calculateDiscount } from '../../utils/orderUtils';
import { ShoppingBag, Eye, Heart, Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = calculateDiscount(product.mrp, product.selling_price);
  const inStock = product.stock_quantity > 0;
  const isWished = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock_quantity) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#C5A059]/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-square bg-[#FAF8F5] overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges: clean unboxed discount & stock indicator */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#781D2E] text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#0F172A] border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-bold tracking-widest px-2 py-0.5 rounded shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-[#781D2E] hover:bg-white shadow-xs transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-[#781D2E] text-[#781D2E]' : ''}`} />
        </button>

        {/* Quick View Button (Desktop hover overlay) */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block z-10">
            <button
              onClick={handleQuickViewClick}
              className="w-full bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold py-2 rounded-xl shadow-md border border-[#E8E2D9] flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" /> Quick View
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line: Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="truncate uppercase tracking-wider text-[10px] font-semibold text-[#A68238]">{product.category_name || 'Stationery'}</span>
            <span className="font-mono text-stone-400">SKU: {product.sku}</span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-[#781D2E] transition-colors">
            <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug mb-2 font-display">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Stock status */}
        <div className="pt-2 border-t border-stone-100 mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-base text-stone-900 tabular-nums">
                ₹{product.selling_price}
              </span>
              {product.mrp > product.selling_price && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ₹{product.mrp}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-semibold uppercase tracking-wider ${inStock ? 'text-emerald-800' : 'text-stone-400'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Stepper & Add To Cart Button */}
          {inStock ? (
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8E2D9] rounded-lg bg-[#FAF8F5] overflow-hidden shrink-0">
                <button
                  onClick={decrementQty}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  className="p-1.5 hover:bg-stone-200 text-stone-600 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-semibold tabular-nums text-stone-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock_quantity}
                  className="p-1.5 hover:bg-stone-200 text-stone-600 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs active:scale-97 ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#0F172A] hover:bg-[#1E293B] text-white border border-transparent hover:border-[#C5A059]/30'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" /> Add to Bag
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl font-medium text-xs bg-stone-100 text-stone-400 cursor-not-allowed text-center"
            >
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
