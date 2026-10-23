import React from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Video, Mail, MessageCircle, MapPin, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onOpenHireMe }) {
  return (
    <footer className="bg-cine-950 border-t border-white/10 pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-footer Callout Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-16 border border-amber-500/30 bg-gradient-to-r from-cine-900 via-cine-850 to-cine-900 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center lg:text-left z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              LET'S SCALE YOUR AUDIENCE
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1 mb-2">
              READY FOR YOUR NEXT VIRAL PIECE?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Whether you need full on-set camera direction or rapid post-production editing, we elevate your content to Hollywood standard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto">
            <button
              onClick={() => onOpenHireMe()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Get Instant Project Quote</span>
            </button>

            <a
              href={`https://wa.me/${creatorConfig.whatsappNumber}?text=${encodeURIComponent("Hi Marcus! Let's talk about shooting and editing a new project.")}`}
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
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
                <Video className="w-4 h-4 text-cine-950 stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                {creatorConfig.brandName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              {creatorConfig.subTagline}
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{creatorConfig.location}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5">
              <li><a href="#portfolio" className="hover:text-amber-400 transition-colors">Featured Works</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Video Shooting &amp; Editing</a></li>
              <li><a href="#color-lab" className="hover:text-amber-400 transition-colors">Color Grading Suite</a></li>
              <li><a href="#gear" className="hover:text-amber-400 transition-colors">Cinema Gear Stack</a></li>
              <li><a href="#testimonials" className="hover:text-amber-400 transition-colors">Client Reviews</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2">
              <a
                href={`mailto:${creatorConfig.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{creatorConfig.email}</span>
              </a>
              <a
                href={`https://wa.me/${creatorConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{creatorConfig.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Config note */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} {creatorConfig.brandName}. All rights reserved. Directed &amp; Edited by {creatorConfig.name}.
          </div>
          <div className="text-zinc-400">
            Client details &amp; pricing fully customizable in <span className="font-mono text-zinc-300">src/config/creatorConfig.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
