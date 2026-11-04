import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import InlineVideoCard from './InlineVideoCard';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/mediaStorage';

export default function PortfolioSection({ onPlayVideo, onSelectForHire, onNavigate }) {
  const { siteData } = useSiteData();
  const [activeFilter, setActiveFilter] = useState('all');

  const categoriesObj = siteData.categories || {};
  const filterTabs = [
    { id: 'all', label: 'All Masterworks', price: null },
    ...Object.entries(categoriesObj).map(([id, cat]) => ({
      id,
      label: cat.name,
      price: cat.basePrice,
    })),
  ];

  const portfolioList = siteData.portfolio || [];
  const filteredProjects =
    activeFilter === 'all'
      ? portfolioList
      : portfolioList.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative bg-cine-950">
      {/* Background flare accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>DIRECT 4K INLINE PLAYBACK &bull; INR PRICING</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              PROVEN EDITS.{' '}
              <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
                WATCH DIRECTLY.
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md">
            Click any video card below to play {siteData.name}&apos;s high-quality edits directly on the page with audio, or select a category to book.
          </p>
        </div>

        {/* Filter Navigation Tabs with INR Base Price */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-cine-950 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {tab.price && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    activeFilter === tab.id
                      ? 'bg-cine-950/20 text-cine-950 font-bold'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {formatINR(tab.price)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Portfolio Landscape Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
            <p className="text-sm text-zinc-400 mb-4">
              No sample videos uploaded in this category yet.
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/hire', '', activeFilter)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-cine-950"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Custom Sample in Hire Page</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <InlineVideoCard
                key={project.id}
                project={project}
                onOpenTheater={(vid) => onPlayVideo && onPlayVideo(vid)}
                onSelectForHire={(cat, title, proj) =>
                  onSelectForHire && onSelectForHire(cat, title, proj)
                }
                actionLabel="Hire This Style"
              />
            ))}
          </div>
        )}

        {/* Bottom Callout to Hire Page & Quotation Page */}
        <div className="mt-12 glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/25 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Want a Custom Style or Need a Multi-Video Quotation PDF?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Explore category-specific samples on the Hire page or customize your per-video add-ons in Indian Rupees (₹) on the Quotation page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/hire')}
              className="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-amber-400 text-cine-950 hover:bg-amber-300 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Open Category Hire Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/quotation')}
              className="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
            >
              Calculate ₹ Quote &amp; Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
