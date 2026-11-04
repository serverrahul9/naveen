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
  Layers,
  Activity,
} from 'lucide-react';

export default function Navbar({ activeRoute, onNavigate }) {
  const { siteData, theme, toggleTheme, unreadCount } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, route, hash) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(route, hash);
  };

  const navItems = [
    {
      label: 'Home',
      sub: 'Landscape Reel',
      route: '/',
      hash: '',
      icon: Home,
      isActive: activeRoute === '/',
    },
    {
      label: 'Works',
      sub: '4K Portfolio',
      route: '/',
      hash: '#portfolio',
      icon: Layers,
      isActive: false,
    },
    {
      label: 'Hire Naveen',
      sub: 'Shoot & Edit',
      route: '/hire',
      hash: '',
      icon: Film,
      isActive: activeRoute === '/hire',
    },
    {
      label: '₹ Quotation',
      sub: 'PDF Calculator',
      route: '/quotation',
      hash: '',
      icon: FileText,
      isActive: activeRoute === '/quotation',
    },
    {
      label: 'Color Lab',
      sub: 'DaVinci Grade',
      route: '/',
      hash: '#color-lab',
      icon: Activity,
      isActive: false,
    },
    {
      label: '/naveen',
      sub: 'Admin Panel',
      route: '/naveen',
      hash: '',
      icon: Sliders,
      isActive: activeRoute === '/naveen',
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeRoute !== '/'
          ? 'bg-[#070810]/95 backdrop-blur-2xl border-b border-violet-500/20 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-[#06070c]/90 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Compact Menu Trigger + Brand Logo (N Letter + NAVEEN PRO EDITOR) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Compact Left Card Drawer Toggle (for smaller screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:text-white hover:bg-violet-500/25 transition-all"
            aria-label="Toggle Navigation Cards"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 p-[1.5px] shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[10px] bg-[#070810] flex items-center justify-center">
                <span className="font-display font-black text-lg bg-gradient-to-br from-violet-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                  N
                </span>
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-violet-300 transition-colors block leading-none">
                NAVEEN PRO EDITOR
              </span>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block tracking-wider uppercase font-mono mt-0.5">
                4K VIDEO SHOOTER &bull; VIDEO EDITOR
              </p>
            </div>
          </a>
        </div>

        {/* Center Desktop Navigation (Visible on all laptops lg:flex 1024px+) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0d101d]/90 border border-violet-500/20 px-2 py-1.5 rounded-2xl shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.hash ? `${item.route}${item.hash}` : item.route}
                onClick={(e) => handleNavClick(e, item.route, item.hash)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  item.isActive
                    ? 'pro-btn-primary text-white keep-white shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-violet-500/15'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white keep-white">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions & Dark/Light Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-violet-500/15 border border-white/10 text-zinc-300 hover:text-violet-300 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark or Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-violet-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Quick WhatsApp link */}
          <a
            href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
              `Hi ${siteData.name}! I saw NAVEEN PRO EDITOR and want to book video shooting / editing.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={(e) => handleNavClick(e, '/hire')}
            className="pro-btn-primary relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white keep-white hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire / Shoot</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>
        </div>
      </div>

      {/* Compact Left-Aligned Floating Mini-Cards Drawer (Instead of giant full-screen stretched bars!) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-16 left-4 z-50 w-72 max-w-[88vw] bg-[#0a0c16] border border-violet-500/35 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-violet-400 px-1.5 mb-2 flex items-center justify-between">
              <span>Quick Navigation</span>
              <span className="text-zinc-500">NAVEEN PRO</span>
            </div>

            {/* Compact 2-Column Small Cards Grid on the Left */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.hash ? `${item.route}${item.hash}` : item.route}
                    onClick={(e) => handleNavClick(e, item.route, item.hash)}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                      item.isActive
                        ? 'pro-btn-primary border-transparent text-white keep-white'
                        : 'bg-[#121626] border-white/10 text-zinc-200 hover:border-violet-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className="w-4 h-4 text-violet-400" />
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-rose-500 text-white keep-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">{item.sub}</div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Compact Bottom Action Row */}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={(e) => handleNavClick(e, '/quotation')}
                className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>₹ Quote PDF</span>
              </button>
              <a
                href={`https://wa.me/${siteData.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
