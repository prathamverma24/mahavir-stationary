import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import {
  BookOpen,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Shield,
  FileText,
  RotateCcw,
  X,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const policyContent = {
    privacy: {
      title: 'Privacy Policy',
      content: settings.policies.privacy_policy,
      icon: Shield,
    },
    terms: {
      title: 'Terms & Conditions',
      content: settings.policies.terms_and_conditions,
      icon: FileText,
    },
    returns: {
      title: 'Return & Exchange Policy',
      content: settings.policies.return_policy,
      icon: RotateCcw,
    },
  };

  return (
    <footer id="store-contact" className="bg-[#0B1220] text-stone-200 pt-16 pb-10 border-t border-[#C5A059]/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Store Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 p-1 rounded-xl border border-[#C5A059]/40 shadow-xs shrink-0">
                <img
                  src={settings.logo_url || '/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png'}
                  alt={settings.store_name}
                  className="h-11 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white leading-tight">
                  {settings.store_name}
                </h3>
                <p className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase">
                  {settings.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Your premier boutique destination for curated stationery, luxury fine pens, artist colors, backpacks, educational kits and kids toys.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Storefront
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#C5A059] tracking-wider mb-4">
              Curated Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Complete Catalogue
                </Link>
              </li>
              <li>
                <Link to="/shop?new=true" className="hover:text-white transition-colors">
                  New Season Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?offers=true" className="hover:text-white transition-colors">
                  Special Offers & Bundles
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors opacity-70">
                  Store Management Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#C5A059] tracking-wider mb-4">
              Featured Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=cat-notebooks" className="hover:text-white transition-colors">
                  Notebooks & Premium Registers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-pens" className="hover:text-white transition-colors">
                  Fine Writing, Pens & Inks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-art" className="hover:text-white transition-colors">
                  Artisanal Paints & Sketchpads
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-bags" className="hover:text-white transition-colors">
                  School Bags & Geometry Cases
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-edu-toys" className="hover:text-white transition-colors">
                  STEM & Mind Development Games
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-games" className="hover:text-white transition-colors">
                  Family Board Games & Puzzles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#C5A059] tracking-wider mb-4">
              Store & Boutique Hours
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">{settings.address}</p>
                <p className="text-stone-400">{settings.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href={`tel:${settings.contact_number}`} className="hover:text-white">
                {settings.contact_number}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white truncate">
                {settings.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-stone-300 pt-1">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-white">Opening Hours:</p>
                <p className="text-stone-400 text-[11px] leading-tight">{settings.opening_hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Policies & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicyModal('returns')}
              className="hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Return & Replacement
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const current = policyContent[activePolicyModal as keyof typeof policyContent];
              if (!current) return null;
              const IconComp = current.icon;
              return (
                <div>
                  <div className="flex items-center gap-2.5 mb-4 text-[#0F172A]">
                    <IconComp className="w-6 h-6 text-[#C5A059]" />
                    <h3 className="font-serif font-bold text-lg">{current.title}</h3>
                  </div>
                  <div className="text-xs text-stone-600 leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] max-h-80 overflow-y-auto whitespace-pre-line">
                    {current.content}
                  </div>
                  <div className="mt-5 text-right">
                    <button
                      onClick={() => setActivePolicyModal(null)}
                      className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#C5A059]/40 text-white text-xs font-semibold rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </footer>
  );
};
