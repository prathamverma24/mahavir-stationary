import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types/store';

const defaultSettings: StoreSettings = {
  store_name: 'Shri Mahavir Stationery & Toys',
  tagline: 'Study • Play • Grow',
  logo_url: '/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png',
  whatsapp_number: '919555257650',
  whatsapp_default_message: "Hello Shri Mahavir Stationery & Toys! I'm browsing your online store and have a question about your products.",
  contact_number: '+91 95552 57650',
  email: 'contact@shrimahavirstationery.com',
  address: 'Shop No. 12, Main Market, Opp. Central School, Civil Lines',
  city: 'Haridwar / Roorkee, Uttarakhand - 247667',
  opening_hours: 'Monday – Saturday: 9:30 AM – 9:00 PM | Sunday: 10:00 AM – 8:00 PM',
  announcement_text: '✨ Welcome to Shri Mahavir Stationery & Toys! Fast WhatsApp Ordering with In-Store Pickup & Local Home Delivery ✨',
  delivery_settings: {
    home_delivery_available: true,
    store_pickup_available: true,
    delivery_charge_note: 'As confirmed by store',
    free_delivery_above: 500,
  },
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  currency: 'INR',
  currency_symbol: '₹',
  policies: {
    privacy_policy: 'We value your privacy. Your contact details and delivery addresses collected during checkout are used exclusively to process and fulfill your WhatsApp orders. We never share or trade your information.',
    terms_and_conditions: 'All items displayed on Shri Mahavir Stationery & Toys are subject to stock availability at our physical counter. Orders are confirmed once verified by our store team directly on WhatsApp.',
    return_policy: 'Stationery and toy items can be inspected during in-store pickup or upon delivery. Please contact us via WhatsApp within 48 hours for immediate replacement of damaged articles.',
  },
};

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  reloadSettings: () => Promise<void>;
  updateSettingsState: (newSettings: StoreSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.warn('Could not load live settings, using defaults:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettingsState = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        reloadSettings: fetchSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
