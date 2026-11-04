import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import {
  Sparkles,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  FileText,
  Sliders,
  Film,
  Home,
} from 'lucide-react';

export default function Navbar({ activeRoute, onNavigate }) {
  const { siteData, theme, toggleTheme, unreadCount } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, route, hash) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(route, hash);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeRoute !== '/'
          ? 'bg-cine-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo: N Letter Icon + NAVEEN PRO EDITOR */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-cine-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="font-display font-black text-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              N
            </span>
          </div>
          <div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors block leading-none">
              NAVEEN PRO EDITOR
            </span>
            <p className="text-[10px] text-zinc-400 hidden sm:block tracking-wider uppercase font-mono mt-1">
              4K VIDEO SHOOTER &bull; ELITE VIDEO EDITOR
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-full backdrop-blur-md">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeRoute === '/'
                ? 'bg-amber-400 text-cine-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>

          <a
            href="/#portfolio"
            onClick={(e) => handleNavClick(e, '/', '#portfolio')}
            className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Shot &amp; Edited Works
          </a>

          <a
            href="/hire"
            onClick={(e) => handleNavClick(e, '/hire')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeRoute === '/hire'
                ? 'bg-amber-400 text-cine-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Hire (Shoot / Edit)</span>
          </a>

          <a
            href="/quotation"
            onClick={(e) => handleNavClick(e, '/quotation')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeRoute === '/quotation'
                ? 'bg-amber-400 text-cine-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotation &amp; PDF (₹)</span>
          </a>

          <a
            href="/#color-lab"
            onClick={(e) => handleNavClick(e, '/', '#color-lab')}
            className="text-xs font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Color Lab
          </a>

          <a
            href="/naveen"
            onClick={(e) => handleNavClick(e, '/naveen')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeRoute === '/naveen'
                ? 'bg-cyan-400 text-cine-950 shadow-md shadow-cyan-500/20'
                : 'text-cyan-400 hover:bg-cyan-500/15 border border-cyan-500/20'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>/naveen Panel</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white keep-white">
                {unreadCount}
              </span>
            )}
          </a>
        </nav>

        {/* Actions & Dark/Light Mode Toggle */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-amber-400 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark or Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Quick Quotation Button on Medium Screens */}
          <button
            type="button"
            onClick={(e) => handleNavClick(e, '/quotation')}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Get ₹ Quote PDF</span>
          </button>

          {/* Quick WhatsApp link */}
          <a
            href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
              `Hi ${siteData.name}! I saw NAVEEN PRO EDITOR and want to book video shooting / editing.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Hire Me CTA */}
          <button
            type="button"
            onClick={(e) => handleNavClick(e, '/hire')}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-cine-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-cine-950" />
            <span>Book Shoot / Edit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls (Theme + Menu) */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="sm:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-cine-900/95 border-b border-white/10 backdrop-blur-2xl px-6 py-6 mt-2 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="text-sm font-semibold text-zinc-200 hover:text-amber-400 py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Home Landscape Showcase</span>
              <Home className="w-4 h-4 text-amber-400" />
            </a>
            <a
              href="/#portfolio"
              onClick={(e) => handleNavClick(e, '/', '#portfolio')}
              className="text-sm font-medium text-zinc-200 hover:text-amber-400 py-2 border-b border-white/5"
            >
              Shot &amp; Edited Masterworks
            </a>
            <a
              href="/hire"
              onClick={(e) => handleNavClick(e, '/hire')}
              className="text-sm font-semibold text-amber-400 py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Hire {siteData.name} (Video Shoot &amp; Edit)</span>
              <Film className="w-4 h-4" />
            </a>
            <a
              href="/quotation"
              onClick={(e) => handleNavClick(e, '/quotation')}
              className="text-sm font-semibold text-cyan-400 py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Custom Quotation &amp; PDF Download (₹)</span>
              <FileText className="w-4 h-4" />
            </a>
            <a
              href="/#color-lab"
              onClick={(e) => handleNavClick(e, '/', '#color-lab')}
              className="text-sm font-medium text-zinc-200 hover:text-amber-400 py-2 border-b border-white/5"
            >
              DaVinci Color Grading Lab
            </a>
            <a
              href="/naveen"
              onClick={(e) => handleNavClick(e, '/naveen')}
              className="text-sm font-semibold text-emerald-400 py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>/naveen Admin Dashboard</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white keep-white">
                  {unreadCount} New
                </span>
              ) : (
                <Sliders className="w-4 h-4" />
              )}
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={(e) => handleNavClick(e, '/hire')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Book Video Shoot / Edit Now</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleNavClick(e, '/quotation')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
            >
              <FileText className="w-4 h-4" />
              <span>Build Shoot &amp; Edit Quotation PDF (₹)</span>
            </button>

            <a
              href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
                `Hi ${siteData.name}! I saw NAVEEN PRO EDITOR and want to discuss a video shooting / editing project.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {siteData.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
