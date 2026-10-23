import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import ColorGradeLab from './components/ColorGradeLab';
import ServicesSection from './components/ServicesSection';
import GearSection from './components/GearSection';
import HireMeWizard from './components/HireMeWizard';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { creatorConfig } from './config/creatorConfig';

export default function App() {
  // Modal state
  const [isHireMeModalOpen, setIsHireMeModalOpen] = useState(false);
  const [selectedHireCategory, setSelectedHireCategory] = useState('reels');
  const [selectedHireStyle, setSelectedHireStyle] = useState('');

  // Video modal state
  const [activeVideo, setActiveVideo] = useState(null);

  // Trigger Hire Me with optional pre-selected category and style
  const handleOpenHireMe = (category = 'reels', style = '') => {
    setSelectedHireCategory(category || 'reels');
    setSelectedHireStyle(style || '');
    setIsHireMeModalOpen(true);
  };

  // Trigger Showreel
  const handlePlayShowreel = () => {
    setActiveVideo({
      id: "showreel",
      title: "VANCE CINEMATICS // 2026 Director & Editor Showreel",
      client: "Global Creator & Commercial Reel",
      category: "commercial",
      categoryLabel: "2026 Master Showreel",
      views: "1.2B Views Total",
      aspect: "16:9 DCI 4K",
      duration: "0:45",
      thumbnail: "/images/hero-cinematography.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: "Compiled footage highlighting 4K/6K cinema camera shooting on Sony FX6, DaVinci Resolve film stock color grading, FPV drone aerials, and high-retention viral editing."
    });
  };

  return (
    <div className="min-h-screen bg-cine-950 text-slate-100 relative selection:bg-amber-400 selection:text-cine-950">
      {/* Top Navbar */}
      <Navbar onOpenHireMe={() => handleOpenHireMe('reels')} />

      {/* Hero Section */}
      <Hero
        onOpenHireMe={() => handleOpenHireMe('reels')}
        onPlayShowreel={handlePlayShowreel}
      />

      {/* Featured Works & Portfolio with Category Filter */}
      <PortfolioSection
        onPlayVideo={(video) => setActiveVideo(video)}
        onSelectForHire={(category, style) => handleOpenHireMe(category, style)}
      />

      {/* Interactive Color Grading Before/After Lab */}
      <ColorGradeLab
        onSelectForHire={(category, style) => handleOpenHireMe(category, style)}
      />

      {/* Production Services (Shooting + Editing) */}
      <ServicesSection
        onOpenHireMe={(type) => {
          if (type === 'shoot') {
            handleOpenHireMe('commercial', 'On-Location Cinema Shooting Package');
          } else {
            handleOpenHireMe('reels', 'High-Retention Video Editing Package');
          }
        }}
      />

      {/* Dedicated Interactive "Hire Me & Project Estimator" Section On Page */}
      <section id="hire-me" className="py-24 relative bg-cine-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <span>GET AN ACCURATE ESTIMATE IN SECONDS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-3">
            HIRE MARCUS FOR YOUR NEXT PROJECT
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Choose your format, explore smart topic ideas, pick your quantity, and enter your contact details. All project briefs are instantly dispatched to client email &amp; direct WhatsApp.
          </p>
        </div>

        <HireMeWizard
          initialCategory={selectedHireCategory}
          initialStyle={selectedHireStyle}
          isOpen={false}
        />
      </section>

      {/* Studio Camera & Post-Production Hardware Stack */}
      <GearSection />

      {/* Client Testimonials */}
      <TestimonialsSection />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Footer */}
      <Footer onOpenHireMe={() => handleOpenHireMe('reels')} />

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        onSelectForHire={(category, style) => handleOpenHireMe(category, style)}
      />

      {/* Hire Me Standalone Pop-up Modal */}
      {isHireMeModalOpen && (
        <HireMeWizard
          initialCategory={selectedHireCategory}
          initialStyle={selectedHireStyle}
          isOpen={true}
          onClose={() => setIsHireMeModalOpen(false)}
        />
      )}

      {/* Floating Instant WhatsApp Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
