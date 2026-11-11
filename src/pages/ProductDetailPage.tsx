import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types/store';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { calculateDiscount, createWhatsAppUrl } from '../utils/orderUtils';
import { ProductCard } from '../components/common/ProductCard';
import {
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Check,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data: Product = await res.json();
          setProduct(data);
          setSelectedImage(0);
          setQuantity(1);

          // Fetch related
          if (data.category_id) {
            const relRes = await fetch(`/api/products?category=${data.category_id}`);
            if (relRes.ok) {
              const relData: Product[] = await relRes.json();
              setRelatedProducts(relData.filter(p => p.id !== data.id).slice(0, 4));
            }
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-[#0F172A] border-t-transparent rounded-full" />
        <p className="text-xs text-stone-500 mt-3">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The product you are looking for may have been moved or removed.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const discountPercent = calculateDiscount(product.mrp, product.selling_price);
  const inStock = product.stock_quantity > 0;
  const isWished = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNowWhatsApp = () => {
    const text = `Hello ${settings.store_name || 'Shri Mahavir Stationery & Toys'}!

I would like to order this item:
Product: ${product.name}
Code/SKU: ${product.sku}
Quantity: ${quantity}
Price: ₹${product.selling_price * quantity}

Please confirm availability and delivery! Thank you.`;
    const url = createWhatsAppUrl(settings.whatsapp_number, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to="/shop" className="hover:text-stone-900">Shop</Link>
        {product.category_name && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to={`/shop?category=${product.category_id}`} className="hover:text-stone-900">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#E8E2D9] shadow-xs relative">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#781D2E] text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-[#781D2E] shadow-md transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-[#781D2E] text-[#781D2E]' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-[#C5A059] shadow-xs scale-102' : 'border-[#E8E2D9] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase & Details Module (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#A68238]">{product.category_name}</span>
              <span className="font-mono bg-[#FAF8F5] border border-[#E8E2D9] px-2 py-0.5 rounded-sm">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-4 py-2 border-y border-stone-100">
              <span className="font-serif font-bold text-3xl text-stone-900 tabular-nums">
                ₹{product.selling_price}
              </span>
              {product.mrp > product.selling_price && (
                <span className="text-base text-stone-400 line-through tabular-nums">
                  MRP ₹{product.mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-stone-900 bg-[#C5A059]/25 px-2.5 py-1 rounded-md">
                  Save ₹{product.mrp - product.selling_price} ({discountPercent}%)
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-stone-600">Availability:</span>
              <span className={`font-semibold uppercase tracking-wider text-[11px] ${inStock ? 'text-emerald-800' : 'text-stone-400'}`}>
                {inStock ? `In Stock (${product.stock_quantity} available)` : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-2">Description & Details</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line font-normal">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Zone */}
          <div className="pt-6 border-t border-[#E8E2D9] space-y-4">
            {inStock ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-[#E8E2D9] rounded-xl bg-[#FAF8F5]">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 hover:bg-stone-200 text-stone-600 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2.5 hover:bg-stone-200 text-stone-600 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    Total: ₹{product.selling_price * quantity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#0F172A] hover:bg-[#1E293B] border border-transparent hover:border-[#C5A059]/40 text-white active:scale-98'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-[#C5A059]" />}
                    {added ? 'Added to Bag' : 'Add to Bag'}
                  </button>

                  <button
                    onClick={handleBuyNowWhatsApp}
                    className="py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" /> Order via WhatsApp
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-stone-100 text-stone-600 text-center rounded-2xl text-xs font-medium border border-[#E8E2D9]">
                This item is currently sold out. Contact us on WhatsApp for arrival updates.
              </div>
            )}

            {/* Trust Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-center">
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] mx-auto mb-1" />
                <p className="text-[11px] font-serif font-bold text-stone-800">100% Genuine</p>
                <p className="text-[10px] text-stone-500">Authentic school supply</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
                <Truck className="w-5 h-5 text-[#C5A059] mx-auto mb-1" />
                <p className="text-[11px] font-serif font-bold text-stone-800">Store Pickup</p>
                <p className="text-[10px] text-stone-500">Ready in 30 mins</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
                <RotateCcw className="w-5 h-5 text-[#C5A059] mx-auto mb-1" />
                <p className="text-[11px] font-serif font-bold text-stone-800">Easy Exchange</p>
                <p className="text-[10px] text-stone-500">48-hr replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E8E2D9]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold text-[#A68238] uppercase tracking-widest">Recommendations</span>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                You May Also Need
              </h2>
            </div>
            <Link
              to={`/shop?category=${product.category_id}`}
              className="text-xs font-bold text-[#0F172A] hover:text-[#781D2E] hover:underline"
            >
              View More in Category →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
