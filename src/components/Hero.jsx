import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { resolvePlayableUrl, formatINR } from '../utils/mediaStorage';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  Maximize2,
  Film,
} from 'lucide-react';

export default function Hero({ onNavigate, onPlayVideo }) {
  const { siteData } = useSiteData();
  const videoRef = useRef(null);

  const featuredVideos = [
    {
      id: 'hero-showreel',
      title: siteData.showreelTitle || `${siteData.brandName} // 2026 Master Showreel`,
      categoryLabel: 'Master 4K Showreel',
      videoUrl: siteData.showreelUrl,
      thumbnail: siteData.showreelThumbnail || '/images/hero-cinematography.jpg',
      duration: siteData.showreelDuration || '0:45',
      quality: '4K 60fps Master',
      aspect: '16:9 Landscape',
      price: 1200,
      client: siteData.brandName,
      description: siteData.subTagline,
    },
    ...(siteData.portfolio || []).slice(0, 3),
  ];

  const [activeDeckIdx, setActiveDeckIdx] = useState(0);
  const activeDeckVideo = featuredVideos[activeDeckIdx] || featuredVideos[0];

  const [resolvedUrl, setResolvedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let mounted = true;
    resolvePlayableUrl(activeDeckVideo?.videoUrl).then((url) => {
      if (mounted) {
        setResolvedUrl(url || activeDeckVideo?.videoUrl || '');
      }
    });
    return () => {
      mounted = false;
    };
  }, [activeDeckVideo?.videoUrl]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const categoriesList = Object.values(siteData.categories || {});
  const lowestPrice =
    categoriesList.length > 0
      ? Math.min(...categoriesList.map((c) => Number(c.basePrice) || 1200))
      : 1200;

  const marqueeItems = [
    '4K 60FPS LANDSCAPE & VERTICAL MASTERING',
    'DAVINCI RESOLVE STUDIO COLOR GRADING',
    'HIGH-RETENTION YOUTUBE & REELS EDITING',
    'AFTER EFFECTS 3D MOTION GRAPHICS',
    'IMMERSIVE DOLBY ATMOSPHERIC SOUND DESIGN',
    `TRANSPARENT INDIAN RUPEE PRICING (STARTING ${formatINR(lowestPrice)})`,
    'INSTANT MOBILE-RESPONSIVE PDF QUOTATION',
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-10 overflow-hidden">
      {/* Background Cinematic Landscape Backdrop */}
      <div className="cinema-dark absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-cinematography.jpg"
          alt="Naveen Editor Cinematic Landscape Studio"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cine-950 via-cine-950/75 to-cine-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-cine-950/60 to-cine-950" />
        <div className="absolute inset-0 bg-film-grain opacity-80" />

        {/* Animated Anamorphic Light Streaks */}
        <div className="absolute top-1/4 -left-1/4 w-[150%] h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm rotate-[-2deg] animate-pulse" />
        <div className="absolute top-2/3 -right-1/4 w-[150%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent blur-sm rotate-[1.5deg] animate-pulse" />
      </div>

      {/* Main Landscape Hero Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Kinetic Headline, INR Badge & CTAs (5 cols on desktop) */}
          <div className="lg:col-span-6 text-left space-y-6">
            {/* Live Availability & INR Badge */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-zinc-200">
                {siteData.name} is Accepting New Edits
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                From {formatINR(lowestPrice)} / Video
              </span>
            </div>

            {/* Main Punchy Landscape Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white leading-[1.06]">
              {siteData.heroTitleLine1 || 'LANDSCAPE CINEMA.'}{' '}
              <span className="block mt-1 bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent text-glow">
                {siteData.heroTitleHighlight || 'VIRAL RETENTION.'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
              {siteData.subTagline}
            </p>

            {/* Primary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('/hire')}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-cine-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <Sparkles className="w-4 h-4 fill-cine-950" />
                <span>Hire {siteData.name} / Watch Samples</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/quotation')}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl hover:border-cyan-400/50 transition-all group"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Instant ₹ Quotation &amp; PDF</span>
              </button>
            </div>

            {/* Feature Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-amber-400" /> Direct 4K Inline Playback
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DaVinci Resolve Studio 19
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" /> 24-48h Express Turnaround
              </span>
            </div>
          </div>

          {/* Right Column: Live Widescreen 16:9 Interactive Video Deck (6 cols on desktop) */}
          <div className="lg:col-span-6">
            <div className="cinema-dark relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/15 shadow-2xl box-glow backdrop-blur-2xl">
              {/* Top Monitor Frame Bar */}
              <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-2xl bg-black/70 border border-white/10 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-400 font-bold">LIVE 16:9 DECK</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-200 truncate max-w-[180px] sm:max-w-[260px]">
                    {activeDeckVideo?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {activeDeckVideo?.quality || '4K 60fps'}
                  </span>
                </div>
              </div>

              {/* 16:9 Widescreen Video Viewport */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden bg-black cursor-pointer group"
                onClick={togglePlay}
              >
                {resolvedUrl && (
                  <video
                    ref={videoRef}
                    key={resolvedUrl}
                    src={resolvedUrl}
                    poster={activeDeckVideo?.thumbnail || '/images/hero-cinematography.jpg'}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

                {/* Corner Viewfinder Brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute bottom-14 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute bottom-14 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

                {/* Bottom Controls Bar */}
                <div
                  className="absolute bottom-0 inset-x-0 p-3.5 flex items-center justify-between gap-3 bg-black/75 backdrop-blur-md border-t border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-2 rounded-xl bg-amber-400 text-cine-950 hover:bg-amber-300 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-cine-950" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="px-2.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 text-xs font-mono transition-colors"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400" />
                          <span className="hidden sm:inline">Tap for Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span className="hidden sm:inline">Audio On</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayVideo && onPlayVideo(activeDeckVideo)}
                      className="px-3 py-2 rounded-xl bg-white/15 hover:bg-amber-400 hover:text-cine-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Theater Mode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Channel Switcher Pills inside Landscape Deck */}
              <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {featuredVideos.map((vid, idx) => (
                  <button
                    key={vid.id || idx}
                    type="button"
                    onClick={() => setActiveDeckIdx(idx)}
                    className={`p-2 rounded-xl text-left transition-all border flex items-center gap-2 ${
                      activeDeckIdx === idx
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={vid.thumbnail || '/images/hero-cinematography.jpg'}
                      alt={vid.title}
                      className="w-9 h-7 rounded object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold truncate text-white">
                        {idx === 0 ? 'Showreel' : vid.title.split('//')[0]}
                      </div>
                      <div className="text-[9px] font-mono text-amber-400 truncate">
                        {vid.categoryLabel || '4K Edit'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proof & Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {(siteData.stats || []).map((stat, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 text-left border border-white/10 group"
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
      </div>

      {/* Animated Landscape Marquee Ticker */}
      <div className="relative z-10 mt-8 border-y border-white/10 bg-cine-900/80 backdrop-blur-md py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4 mx-6">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-mono text-xs font-semibold tracking-wider text-zinc-300">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
