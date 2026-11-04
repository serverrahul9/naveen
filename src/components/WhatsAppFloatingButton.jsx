import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const { siteData } = useSiteData();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip Bubble */}
      {showTooltip && (
        <div className="mb-2.5 max-w-[230px] bg-cine-900 border border-emerald-500/30 text-white rounded-2xl p-3 shadow-2xl backdrop-blur-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 p-1 text-zinc-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{siteData.name} Online</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-tight">
            Need high-retention video editing? Message {siteData.name} directly on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
          `Hi ${siteData.name}! I'm interested in hiring you for video editing.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-cine-950 shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-emerald-300/50"
        aria-label="Chat on WhatsApp"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-25" />
        <MessageCircle className="w-7 h-7 text-cine-950 fill-cine-950 group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </div>
  );
}
