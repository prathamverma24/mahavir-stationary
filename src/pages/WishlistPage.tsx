import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/store';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistItems() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const allProds: Product[] = await res.json();
          setProducts(allProds.filter(p => wishlist.includes(p.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistItems();
  }, [wishlist]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-[#0F172A] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-md text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#C5A059] mx-auto">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-stone-900">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          Explore our stationery collection and click the heart icon on any product to save it here for later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Explore Catalogue <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900">
          My Saved Wishlist
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
