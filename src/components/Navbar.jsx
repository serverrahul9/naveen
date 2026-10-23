import React, { useState, useEffect } from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Video, Sparkles, MessageCircle, Phone, Menu, X, ArrowRight, Award } from 'lucide-react';

export default function Navbar({ onOpenHireMe, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Featured Works', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Color Lab', href: '#color-lab' },
    { name: 'Production Gear', href: '#gear' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cine-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <Video className="w-5 h-5 text-cine-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {creatorConfig.brandName}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block tracking-wide">
              DIRECTOR &bull; CINEMATOGRAPHY &bull; SENIOR EDITOR
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick WhatsApp link */}
          <a
            href={`https://wa.me/${creatorConfig.whatsappNumber}?text=${encodeURIComponent("Hi Marcus! I saw your video portfolio and want to discuss a project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          {/* Hire Me CTA */}
          <button
            onClick={() => onOpenHireMe()}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-cine-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 fill-cine-950" />
            <span>Hire Me / Instant Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cine-900/95 border-b border-white/10 backdrop-blur-2xl px-6 py-6 mt-2 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-200 hover:text-amber-400 py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHireMe();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Hire Me & Calculate Quote</span>
            </button>

            <a
              href={`https://wa.me/${creatorConfig.whatsappNumber}?text=${encodeURIComponent("Hi Marcus! I saw your video portfolio and want to discuss a project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp: {creatorConfig.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
