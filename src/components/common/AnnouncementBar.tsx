import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.announcement_text) return null;

  return (
    <div className="bg-[#0F172A] text-stone-200 text-xs font-medium px-4 py-2 flex items-center justify-between border-b border-[#C5A059]/20 relative z-40 tracking-wide">
      <div className="container mx-auto flex items-center justify-center gap-2 text-center overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
        <span className="truncate">{settings.announcement_text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="text-stone-400 hover:text-white p-1 rounded transition-colors shrink-0 ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
