import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, Category, Banner } from '../types/store';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Tag,
  Gift,
  Star,
  MessageCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'featured'>('bestseller');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [bannersRes, categoriesRes, prodsRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        if (bannersRes.ok) {
          const b = await bannersRes.json();
          setBanners(b.filter((item: Banner) => item.is_active));
        }

        if (categoriesRes.ok) {
          const c = await categoriesRes.json();
          setCategories(c.filter((item: Category) => item.is_active));
        }

        if (prodsRes.ok) {
          const p: Product[] = await prodsRes.json();
          setFeaturedProducts(p.filter(item => item.is_featured).slice(0, 8));
          setNewArrivals(p.filter(item => item.is_new).slice(0, 8));
          setBestSellers(p.filter(item => item.is_best_seller).slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Auto carousel rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const priceBands = [
    { label: 'Under ₹100', query: 'maxPrice=100' },
    { label: '₹100 – ₹200', query: 'minPrice=100&maxPrice=200' },
    { label: '₹200 – ₹300', query: 'minPrice=200&maxPrice=300' },
    { label: '₹300 – ₹500', query: 'minPrice=300&maxPrice=500' },
    { label: '₹500 – ₹1000', query: 'minPrice=500&maxPrice=1000' },
    { label: 'Above ₹1000', query: 'minPrice=1000' },
  ];

  return (
    <div className="space-y-14 md:space-y-20 pb-16">
      {/* ------------------------------------------------------------- */}
      {/* C. HERO CAROUSEL */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {banners.length > 0 ? (
          <div className="relative h-[480px] md:h-[560px] lg:h-[620px] w-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with dark subtle scrim */}
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/65 to-transparent" />

                {/* Banner Content */}
                <div className="container mx-auto px-6 lg:px-12 h-full flex items-center relative z-20">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059] bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#C5A059]/30">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Shri Mahavir Boutique & Store
                    </span>

                    <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight text-balance">
                      {banner.title}
                    </h1>

                    <p className="text-sm md:text-base text-stone-200/90 leading-relaxed font-normal max-w-xl">
                      {banner.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <Link
                        to={banner.button_link || '/shop'}
                        className="bg-[#781D2E] hover:bg-[#631422] text-white border border-[#C5A059]/40 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group active:scale-97"
                      >
                        {banner.button_text || 'Shop Collection'}
                        <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        to="/shop"
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/25 px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
                      >
                        Browse All Items
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider controls */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'w-8 bg-[#C5A059]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-stone-400">Loading showcase...</div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* QUICK VALUE STRIP */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#781D2E] flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-stone-900">100% Genuine Brands</h4>
              <p className="text-[11px] text-stone-500">Classmate, Camlin, Doms, Milton</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#0F172A] flex items-center justify-center shadow-xs shrink-0">
              <MessageCircle className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-stone-900">Personal WhatsApp Care</h4>
              <p className="text-[11px] text-stone-500">Fast human confirmation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-stone-900">Store Pickup & Delivery</h4>
              <p className="text-[11px] text-stone-500">Counter ready in minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#A68238] flex items-center justify-center shadow-xs shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-stone-900">Fair Retail Value</h4>
              <p className="text-[11px] text-stone-500">Special student & bulk offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* D. SHOP BY CATEGORY */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68238]">Curated Catalogues</span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#0F172A] hover:text-[#781D2E] flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            Explore All Categories <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-5">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#C5A059]/60 p-3.5 text-center flex flex-col items-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3 border border-[#E8E2D9] group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#781D2E] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* D2. DYNAMIC PRICE-BASED COLLECTIONS */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="bg-[#0F172A] border border-[#C5A059]/30 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-xl mb-6 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Price Curation</span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-white mt-1">
              Shop by Price Range
            </h2>
            <p className="text-xs text-stone-300/80 mt-1">
              Discover fine writing instruments, journals, gifts and games tailored to your exact budget.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
            {priceBands.map((band, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/shop?${band.query}`)}
                className="bg-white/5 hover:bg-[#C5A059] text-stone-200 hover:text-[#0F172A] border border-[#C5A059]/30 hover:border-[#C5A059] rounded-2xl py-3 px-4 text-center font-serif font-bold text-xs transition-all duration-200 shadow-2xs hover:scale-102"
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* E. FEATURED COLLECTIONS TABS */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68238]">Curated Picks</span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 mt-1">
              Featured Collections
            </h2>
          </div>

          {/* Interactive filter tab buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E2D9] rounded-xl self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'new'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Popular & Deals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {activeTab === 'bestseller' &&
            bestSellers.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickView}
              />
            ))}
          {activeTab === 'new' &&
            newArrivals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickView}
              />
            ))}
          {activeTab === 'featured' &&
            featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickView}
              />
            ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            View All Products in Catalogue <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* F. PROMOTIONAL GIFT SET BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8E2D9] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Promo Text */}
            <div className="lg:col-span-7 p-8 md:p-12 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#A68238] uppercase tracking-widest">
                <Gift className="w-4 h-4 text-[#C5A059]" /> Bespoke Hampers & Bundles
              </span>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#0F172A] leading-tight text-balance">
                Special Birthday & Return Gift Hampers
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg">
                Looking for unique birthday return gifts, student exam stationery bundles or customized school kits? We prepare customized stationery boxes tailored to your budget with fast WhatsApp coordination!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to="/shop?category=cat-gifts"
                  className="bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center gap-2"
                >
                  Explore Gift Hampers <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </Link>

                <a
                  href="https://wa.me/919555257650?text=Hello%20Shri%20Mahavir%20Stationery!%20I%20am%20looking%20for%20bulk%20birthday%20gift%20hampers."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Bulk Enquiry
                </a>
              </div>
            </div>

            {/* Promo Image */}
            <div className="lg:col-span-5 h-72 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-[#FAF8F5]">
              <img
                src="/images/promo_stationery_gifts_1794382962939.jpg"
                alt="Stationery gift hamper"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* G. WHY CHOOSE US */}
      {/* ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A68238]">The Mahavir Tradition</span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 mt-1">
            Why Choose Our Store?
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Serving students, parents, schools and art connoisseurs with dedication, genuine quality, and fair pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#781D2E] flex items-center justify-center font-serif font-bold text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Genuine Brands</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We stock authentic brands like Classmate, Faber-Castell, Camlin, Doms, Pilot and Milton for dependable everyday performance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#0F172A] flex items-center justify-center font-serif font-bold text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Extensive Variety</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              From school notebooks and exam pouches to STEM robotics kits, sports items and board games, find everything in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-[#A68238] flex items-center justify-center font-serif font-bold text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Fair Pricing</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Direct retail-counter pricing with frequent bundle discounts, student offers, and transparent MRP markdowns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-emerald-800 flex items-center justify-center font-serif font-bold text-sm">
              04
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Personal WhatsApp Order</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No online card hassles or complex logins required. Select your cart items, review the summary, and order directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </div>
  );
};
