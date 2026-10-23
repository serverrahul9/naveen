import React, { useState } from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Play, Sparkles, Filter, Eye, Clock, Layers, ArrowUpRight } from 'lucide-react';

export default function PortfolioSection({ onPlayVideo, onSelectForHire }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Works' },
    { id: 'reels', label: 'Shorts & Reels (9:16)' },
    { id: 'youtube', label: 'YouTube & Documentaries' },
    { id: 'commercial', label: 'Commercials & Ads' },
    { id: 'music_films', label: 'Music & Narrative' },
    { id: 'corporate_events', label: 'Weddings & Real Estate' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? creatorConfig.portfolio
    : creatorConfig.portfolio.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative bg-cine-950">
      {/* Background flare accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>SELECTED MASTERWORKS</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              PROVEN RESULTS.{' '}
              <span className="text-zinc-500">VIRAL IMPACT.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md">
            Every cut is engineered for maximum retention, emotional resonance, and audience conversion.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-cine-950 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col border border-white/10"
            >
              {/* Media Preview Box */}
              <div 
                className="relative aspect-video bg-cine-900 overflow-hidden cursor-pointer"
                onClick={() => onPlayVideo(project)}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cine-950 via-transparent to-black/30 group-hover:opacity-60 transition-opacity" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    {project.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-black/60 backdrop-blur-md text-emerald-400">
                      <Eye className="w-3 h-3" />
                      {project.views}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-black/60 backdrop-blur-md text-zinc-300">
                      {project.duration}
                    </span>
                  </div>
                </div>

                {/* Centered Play Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-amber-400/90 text-cine-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 backdrop-blur-sm">
                    <Play className="w-6 h-6 fill-cine-950 ml-1" />
                  </div>
                </div>
              </div>

              {/* Information & Action Footer */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-400 mb-1">
                    Client: <span className="text-zinc-200">{project.client}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onPlayVideo(project)}
                    className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Watch Preview</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => onSelectForHire(project.category, project.title)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-cine-950 border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Get This Style</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
