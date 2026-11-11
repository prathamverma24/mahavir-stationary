import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types/store';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Tag,
  Check,
  ChevronDown,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters from URL or local
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const offersOnly = searchParams.get('offers') === 'true';
  const inStockOnly = searchParams.get('inStock') === 'true';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products?${searchParams.toString()}`),
        ]);

        if (catRes.ok) {
          const c = await catRes.json();
          setCategories(c.filter((cat: Category) => cat.is_active));
        }

        if (prodRes.ok) {
          const p = await prodRes.json();
          setProducts(p);
        }
      } catch (err) {
        console.error('Failed to load shop catalogue:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentSearch) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    offersOnly ||
    inStockOnly;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900">
            {currentCategory
              ? categories.find(c => c.id === currentCategory)?.name || 'Category Products'
              : 'Product Catalogue'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing <span className="font-semibold text-stone-800 tabular-nums">{products.length}</span> items
            {currentSearch && ` for "${currentSearch}"`}
          </p>
        </div>

        {/* Top Controls: Mobile filter trigger + Sort dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#E8E2D9] text-xs font-semibold text-stone-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" /> Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#781D2E]" />
            )}
          </button>

          <div className="relative flex items-center bg-white border border-[#E8E2D9] rounded-xl px-3 py-1.5 shadow-2xs text-xs font-medium text-stone-700">
            <span className="text-stone-400 mr-2 text-[11px]">Sort by:</span>
            <select
              value={currentSort}
              onChange={e => updateParam('sortBy', e.target.value)}
              className="bg-transparent font-semibold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* ----------------------------------------------------------- */}
        {/* DESKTOP SIDEBAR FILTERS */}
        {/* ----------------------------------------------------------- */}
        <aside className="hidden lg:block space-y-6">
          {/* Active Filter Clear Header */}
          {hasActiveFilters && (
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Filters Applied</span>
              <button
                onClick={clearAllFilters}
                className="text-[#781D2E] hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>
          )}

          {/* Search within catalogue */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-3">
              Search Catalogue
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name, SKU, brand..."
                value={currentSearch}
                onChange={e => updateParam('search', e.target.value)}
                className="w-full text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl pl-8 pr-3 py-2 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {currentSearch && (
                <button
                  onClick={() => updateParam('search', null)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-3">
              Categories
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !currentCategory
                    ? 'bg-[#0F172A] text-white font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors truncate ${
                    currentCategory === cat.id
                      ? 'bg-[#0F172A] text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-3">
              Price Range (₹)
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block mb-1">Min (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={currentMinPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block mb-1">Max (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={currentMaxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-800"
                />
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '< ₹150', min: '', max: '150' },
                { label: '₹150-₹300', min: '150', max: '300' },
                { label: '₹300-₹700', min: '300', max: '700' },
                { label: '> ₹700', min: '700', max: '' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    updateParam('minPrice', p.min);
                    updateParam('maxPrice', p.max);
                  }}
                  className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded-md transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Toggles: In Stock & Offers */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-1">
              Product Status
            </h3>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => updateParam('inStock', e.target.checked ? 'true' : null)}
                className="w-4 h-4 rounded text-[#0F172A] focus:ring-0 cursor-pointer accent-[#0F172A]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={offersOnly}
                onChange={e => updateParam('offers', e.target.checked ? 'true' : null)}
                className="w-4 h-4 rounded text-[#781D2E] focus:ring-0 cursor-pointer accent-[#781D2E]"
              />
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#781D2E]" /> Special Offers & Discounts
              </span>
            </label>
          </div>
        </aside>

        {/* ----------------------------------------------------------- */}
        {/* PRODUCTS GRID */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-stone-100 animate-pulse rounded-2xl h-80 border border-stone-200"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D9] shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                No matching products found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find items matching your current filters. Try resetting the filters or searching for another keyword.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* MOBILE FILTERS SHEET */}
      {/* ----------------------------------------------------------- */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-serif font-bold text-base text-stone-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-2">Category</p>
                <div className="space-y-1">
                  <button
                    onClick={() => updateParam('category', null)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-lg ${
                      !currentCategory ? 'bg-[#0F172A] text-white font-bold' : 'text-stone-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => updateParam('category', c.id)}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded-lg truncate ${
                        currentCategory === c.id ? 'bg-[#0F172A] text-white font-bold' : 'text-stone-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock & Offers */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => updateParam('inStock', e.target.checked ? 'true' : null)}
                    className="accent-[#0F172A]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={offersOnly}
                    onChange={e => updateParam('offers', e.target.checked ? 'true' : null)}
                    className="accent-[#781D2E]"
                  />
                  <span>Offers & Discounts</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white py-3 rounded-xl font-bold text-xs"
              >
                Apply Filters ({products.length} Items)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full bg-stone-100 text-stone-700 py-2.5 rounded-xl text-xs font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </div>
  );
};
