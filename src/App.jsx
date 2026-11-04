import React, { useState, useEffect, useCallback } from 'react';
import { SiteDataProvider } from './context/SiteDataContext';
import SEOHead from './components/SEOHead';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import ColorGradeLab from './components/ColorGradeLab';
import ServicesSection from './components/ServicesSection';
import GearSection from './components/GearSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import HirePage from './components/HirePage';
import QuotationPage from './components/QuotationPage';
import NaveenDashboard from './components/NaveenDashboard';

function normalizeRoute(pathname) {
  const clean = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/naveen' || clean.startsWith('/naveen/')) return '/naveen';
  if (clean === '/hire' || clean.startsWith('/hire/')) return '/hire';
  if (
    clean === '/quotation' ||
    clean === '/quote' ||
    clean.startsWith('/quotation/')
  ) {
    return '/quotation';
  }
  return '/';
}

function AppContent() {
  const [activeRoute, setActiveRoute] = useState(() =>
    normalizeRoute(window.location.pathname)
  );
  const [selectedHireCategory, setSelectedHireCategory] = useState('reels');
  const [selectedHireVideoTitle, setSelectedHireVideoTitle] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(normalizeRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((route, hash = '', category = '', videoTitle = '') => {
    const targetRoute = normalizeRoute(route);
    if (category) setSelectedHireCategory(category);
    if (videoTitle !== undefined) setSelectedHireVideoTitle(videoTitle);

    const url = hash ? `${targetRoute}${hash}` : targetRoute;
    if (window.location.pathname + window.location.hash !== url) {
      window.history.pushState({}, '', url);
    }
    setActiveRoute(targetRoute);

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectForHire = useCallback(
    (category = 'reels', videoTitle = '') => {
      handleNavigate('/hire', '', category, videoTitle);
    },
    [handleNavigate]
  );

  return (
    <div className="min-h-screen bg-cine-950 text-slate-100 relative selection:bg-amber-400 selection:text-cine-950 transition-colors duration-300">
      {/* Dynamic SEO Manager */}
      <SEOHead activeRoute={activeRoute} />

      {/* Top Navigation with Dark/Light Mode Toggle & Route Links */}
      <Navbar activeRoute={activeRoute} onNavigate={handleNavigate} />

      {/* Route Views */}
      {activeRoute === '/naveen' ? (
        <NaveenDashboard
          onNavigate={handleNavigate}
          onPlayVideo={(vid) => setActiveVideo(vid)}
        />
      ) : activeRoute === '/hire' ? (
        <HirePage
          initialCategory={selectedHireCategory}
          initialVideoTitle={selectedHireVideoTitle}
          onPlayVideo={(vid) => setActiveVideo(vid)}
          onNavigate={handleNavigate}
          isEmbedded={false}
        />
      ) : activeRoute === '/quotation' ? (
        <QuotationPage onNavigate={handleNavigate} />
      ) : (
        /* Full Animated Landscape Home Website */
        <main>
          <Hero
            onNavigate={handleNavigate}
            onPlayVideo={(vid) => setActiveVideo(vid)}
          />

          <PortfolioSection
            onPlayVideo={(vid) => setActiveVideo(vid)}
            onSelectForHire={handleSelectForHire}
            onNavigate={handleNavigate}
          />

          <ColorGradeLab onSelectForHire={handleSelectForHire} />

          <ServicesSection
            onOpenHireMe={(type) => {
              if (type === 'shoot') {
                handleSelectForHire('commercial', 'On-Location Cinema Shooting Package');
              } else {
                handleSelectForHire('reels', 'High-Retention Video Editing Package');
              }
            }}
          />

          {/* Interactive Category Hire & Direct Message Section Embedded on Home as well */}
          <HirePage
            initialCategory={selectedHireCategory}
            initialVideoTitle={selectedHireVideoTitle}
            onPlayVideo={(vid) => setActiveVideo(vid)}
            onNavigate={handleNavigate}
            isEmbedded={true}
          />

          <GearSection />

          <TestimonialsSection />

          <FAQSection />
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Fullscreen Cinema Video Modal Player */}
      <VideoModal
        video={activeVideo}
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        onSelectForHire={handleSelectForHire}
      />

      {/* Floating WhatsApp Direct Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}
