import React from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Video, Mail, MessageCircle, MapPin, Sparkles, FileText, Sliders } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { siteData } = useSiteData();

  const handleLink = (e, route, hash) => {
    e.preventDefault();
    if (onNavigate) onNavigate(route, hash);
  };

  return (
    <footer className="bg-cine-950 border-t border-white/10 pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-footer Callout Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-16 border border-amber-500/30 bg-gradient-to-r from-cine-900 via-cine-850 to-cine-900 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center lg:text-left z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              SCALE YOUR AUDIENCE WITH {siteData.name.toUpperCase()}
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1 mb-2">
              READY FOR YOUR NEXT VIRAL EDIT?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Watch category-specific edits directly, customize your per-video requirements in Indian Rupees (₹), and download an instant mobile-responsive PDF quotation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto">
            <button
              type="button"
              onClick={(e) => handleLink(e, '/hire')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Hire {siteData.name}</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleLink(e, '/quotation')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Get ₹ Quote &amp; PDF</span>
            </button>

            <a
              href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
                `Hi ${siteData.name}! Let's talk about editing a new video project.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cine-950 border-2 border-amber-400 flex items-center justify-center">
                <span className="font-display font-black text-base text-amber-400">N</span>
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                NAVEEN PRO EDITOR
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              {siteData.subTagline}
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteData.location}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLink(e, '/')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Landscape Showcase Home
                </a>
              </li>
              <li>
                <a
                  href="/hire"
                  onClick={(e) => handleLink(e, '/hire')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Hire {siteData.name} (Category Videos)
                </a>
              </li>
              <li>
                <a
                  href="/quotation"
                  onClick={(e) => handleLink(e, '/quotation')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Quotation &amp; PDF Builder (₹ INR)
                </a>
              </li>
              <li>
                <a
                  href="/#color-lab"
                  onClick={(e) => handleLink(e, '/', '#color-lab')}
                  className="hover:text-amber-400 transition-colors"
                >
                  DaVinci Color Grading Lab
                </a>
              </li>
              <li>
                <a
                  href="/naveen"
                  onClick={(e) => handleLink(e, '/naveen')}
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>/naveen Admin Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2">
              <a
                href={`mailto:${siteData.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{siteData.email}</span>
              </a>
              <a
                href={`https://wa.me/${siteData.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{siteData.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Admin Note */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} {siteData.brandName}. All rights reserved. Edited &amp; Directed by {siteData.name}.
          </div>
          <div>
            Manage pricing in ₹, upload videos &amp; view hire messages at{' '}
            <button
              type="button"
              onClick={(e) => handleLink(e, '/naveen')}
              className="font-mono text-amber-400 hover:underline"
            >
              /naveen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
