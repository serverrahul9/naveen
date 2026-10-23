import React from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Play, Sparkles, ArrowRight, Video, Camera, Award, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenHireMe, onPlayShowreel }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Cinematic Image with Gradient Masks */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-cinematography.jpg"
          alt="Cinematic production shoot with cinema camera"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 scale-105 animate-pulse-slow transform origin-center"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-950 via-cine-950/70 to-cine-950/30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-cine-950/60 to-cine-950" />
        <div className="absolute inset-0 bg-film-grain pointer-events-none" />

        {/* Anamorphic amber flare light streak */}
        <div className="absolute top-1/4 -left-1/4 w-[150%] h-[2px] bg-gradient-to-r from-transparent via-amber-400/35 to-transparent blur-sm rotate-[-2deg] pointer-events-none" />
        <div className="absolute top-1/3 -right-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm rotate-[1deg] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Availability Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-xl animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-300">
            Accepting New Production &amp; Editing Projects
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Worldwide Delivery
          </span>
        </div>

        {/* Main Punchy Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white max-w-5xl leading-[1.08] mb-6">
          CINEMATIC VISION.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent text-glow">
            VIRAL RETENTION.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed mb-10">
          Professional on-location video shooting with cinema-grade 4K/6K rigs and high-retention post-production editing for top creators, commercial brands, and music artists.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => onOpenHireMe()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-cine-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-[0.98] transition-all group"
          >
            <Sparkles className="w-5 h-5 fill-cine-950" />
            <span>Hire Me / Estimate Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onPlayShowreel()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-xl font-display font-semibold text-sm tracking-wide text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl hover:border-amber-400/40 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300 group-hover:text-cine-950 group-hover:fill-cine-950 ml-0.5 transition-colors" />
            </div>
            <span>Watch 2026 Showreel</span>
            <span className="text-xs text-zinc-400 font-mono">0:45</span>
          </button>
        </div>

        {/* Proof & Stats Grid */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {creatorConfig.stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-4 sm:p-5 text-left border border-white/10 hover:border-amber-500/30 transition-all group"
            >
              <div className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-amber-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-300 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-amber-400" /> Sony FX6 Cinema Rig
          </span>
          <span className="text-zinc-700">&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DaVinci Resolve Studio 19
          </span>
          <span className="text-zinc-700">&bull;</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Frame.io Fast Timestamp Reviews
          </span>
        </div>
      </div>
    </section>
  );
}
