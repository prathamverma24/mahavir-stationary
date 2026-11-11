import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { createWhatsAppUrl } from '../../utils/orderUtils';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSettings();
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const messageToSend =
    settings.whatsapp_default_message?.trim() ||
    `Hello Shri Mahavir Stationery & Toys! I'm browsing your online store and have a question about your products.`;

  const handleOpenWhatsApp = () => {
    const url = createWhatsAppUrl(settings.whatsapp_number, messageToSend);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-none">
      {/* Tooltip bubble */}
      {tooltipVisible && (
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-[#0F172A] text-stone-200 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-[#C5A059]/30 animate-in fade-in slide-in-from-right-4 duration-300 max-w-xs">
          <span>Need help or personal recommendations? Chat on WhatsApp!</span>
          <button
            onClick={() => setTooltipVisible(false)}
            aria-label="Dismiss chat hint"
            className="text-stone-400 hover:text-white transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleOpenWhatsApp}
        aria-label="Chat with store on WhatsApp"
        className="pointer-events-auto w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/30"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366] group-hover:scale-105 transition-transform" />
      </button>
    </div>
  );
};
