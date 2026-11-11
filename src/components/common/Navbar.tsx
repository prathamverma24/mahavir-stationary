import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Product } from '../../types/store';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSuggestions([]);
  }, [location.pathname]);

  // Live search suggestions debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const prods = await res.json();
          setSuggestions(prods.slice(0, 5));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle outside click for search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-20">
          {/* Zone 1: Brand Wordmark & Official Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-stone-900 group whitespace-nowrap shrink-0"
          >
            <img
              src={settings.logo_url || '/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png'}
              alt={settings.store_name}
              className="h-11 md:h-13 w-auto object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base md:text-lg tracking-tight text-[#0F172A] leading-tight">
                {settings.store_name}
              </span>
              <span className="text-[10px] font-bold text-[#A68238] tracking-widest uppercase">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <Link
              to="/"
              className={`hover:text-[#781D2E] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.pathname === '/' ? 'text-[#781D2E] font-bold border-b-2 border-[#781D2E]' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#781D2E] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.pathname === '/shop' && !location.search.includes('offers=true') && !location.search.includes('new=true')
                  ? 'text-[#781D2E] font-bold border-b-2 border-[#781D2E]'
                  : ''
              }`}
            >
              Shop All
            </Link>
            <Link
              to="/shop?new=true"
              className="hover:text-[#781D2E] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              New Arrivals
            </Link>
            <Link
              to="/shop?offers=true"
              className="hover:text-[#781D2E] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Special Offers
            </Link>
            <a
              href="#store-contact"
              className="hover:text-[#781D2E] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Contact Us
            </a>
          </nav>

          {/* Search bar & Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input Box */}
            <div ref={searchBoxRef} className="relative hidden md:block w-48 lg:w-64">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search fine stationery, gifts, toys..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full bg-[#FAF8F5] text-stone-900 text-xs rounded-full pl-9 pr-4 py-2 border border-[#E8E2D9] focus:outline-hidden focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all placeholder:text-stone-400"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>

              {/* Live search dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E8E2D9] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-stone-500">Searching catalogue...</div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      <div className="px-3 py-2 bg-stone-50 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-100">
                        Products ({suggestions.length})
                      </div>
                      <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                        {suggestions.map(p => (
                          <Link
                            key={p.id}
                            to={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 p-2.5 hover:bg-stone-50 transition-colors"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-9 h-9 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-stone-800 truncate">{p.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                <span className="font-semibold text-stone-900 tabular-nums">₹{p.selling_price}</span>
                                {p.mrp > p.selling_price && (
                                  <span className="line-through text-stone-400 tabular-nums">₹{p.mrp}</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-xs font-semibold text-[#0F172A] hover:text-[#781D2E] bg-[#FAF8F5] hover:bg-stone-100 border-t border-stone-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        View all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-500">
                      No matching stationery or toys found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="p-2 text-stone-700 hover:text-[#781D2E] rounded-full hover:bg-stone-100 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#781D2E] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Zone 3: Primary Action - Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag with ${totalItems} items`}
              className="flex items-center gap-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#C5A059]/40 px-4 py-2 rounded-xl font-medium text-xs shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span className="hidden sm:inline font-semibold">Bag</span>
              <span className="bg-[#C5A059] text-[#0F172A] font-bold text-xs px-1.5 py-0.5 rounded-full tabular-nums">
                {totalItems}
              </span>
            </button>

            {/* Admin Link */}
            <Link
              to="/admin"
              title="Store Admin Panel"
              className="hidden sm:flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              <span className="text-[11px] font-medium">Admin</span>
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-stone-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search notebooks, pens, toys..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-stone-100 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-stone-200 focus:outline-hidden focus:border-[#C5A059] focus:bg-white"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bottom-0 bg-white z-40 overflow-y-auto border-t border-stone-200 animate-in slide-in-from-top-4 duration-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <img
                src={settings.logo_url || '/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png'}
                alt={settings.store_name}
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm text-[#0F172A] leading-tight">
                  {settings.store_name}
                </span>
                <span className="text-[9px] font-bold text-[#A68238] tracking-widest uppercase">
                  {settings.tagline}
                </span>
              </div>
            </div>
            <div className="pb-4 border-b border-stone-100">
              <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">Navigation</p>
              <nav className="flex flex-col space-y-3 font-semibold text-stone-800">
                <Link
                  to="/"
                  className="py-2 hover:text-[#781D2E] flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
                <Link
                  to="/shop"
                  className="py-2 hover:text-[#781D2E] flex items-center justify-between"
                >
                  <span>All Products & Catalogue</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
                <Link
                  to="/shop?new=true"
                  className="py-2 hover:text-[#781D2E] flex items-center justify-between"
                >
                  <span>New Arrivals</span>
                  <span className="text-[11px] font-bold text-stone-900 bg-[#C5A059]/20 text-[#A68238] px-2 py-0.5 rounded-full">New</span>
                </Link>
                <Link
                  to="/shop?offers=true"
                  className="py-2 hover:text-[#781D2E] flex items-center justify-between"
                >
                  <span>Special Offers & Deals</span>
                  <span className="text-[11px] font-bold text-[#781D2E] bg-[#781D2E]/10 px-2 py-0.5 rounded-full">Save</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="py-2 hover:text-[#781D2E] flex items-center justify-between"
                >
                  <span>Saved Wishlist ({wishlist.length})</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
                <Link
                  to="/admin"
                  className="py-2 text-stone-600 hover:text-stone-900 flex items-center justify-between"
                >
                  <span>Admin Store Management</span>
                  <ShieldCheck className="w-4 h-4 text-stone-400" />
                </Link>
              </nav>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" /> Order Helpline: {settings.contact_number}
              </p>
              <p className="text-stone-500">{settings.opening_hours}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full bg-[#0F172A] border border-[#C5A059]/30 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" /> View Shopping Bag ({totalItems} items)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
