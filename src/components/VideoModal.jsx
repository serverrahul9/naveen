import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { resolvePlayableUrl, formatINR } from '../utils/mediaStorage';

export default function VideoModal({ video, isOpen, onClose, onSelectForHire }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    let mounted = true;
    if (video?.videoUrl) {
      resolvePlayableUrl(video.videoUrl).then((url) => {
        if (mounted) setResolvedUrl(url || video.videoUrl);
      });
    } else {
      setResolvedUrl('');
    }
    return () => {
      mounted = false;
    };
  }, [video]);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="cinema-dark relative w-full max-w-5xl bg-cine-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-cine-950/90 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
              {video.title}
            </h3>
            {video.quality && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {video.quality}
              </span>
            )}
            {video.aspect && (
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-zinc-300">
                {video.aspect}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black flex items-center justify-center aspect-video overflow-hidden group">
          {resolvedUrl && (
            <video
              ref={videoRef}
              src={resolvedUrl}
              poster={video.thumbnail}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}

          {/* Quick Top-Right Custom Controls Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Details & Direct Hire CTA */}
        <div className="p-5 sm:p-6 bg-cine-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {video.categoryLabel || 'Featured Video'}
              </span>
              {video.price > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Starting {formatINR(video.price)} / video
                </span>
              )}
              <span className="text-xs text-zinc-400">
                {video.views} &bull; {video.client}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              {video.description}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onSelectForHire) {
                onSelectForHire(video.category, video.title, video);
              }
            }}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-cine-950" />
            <span>Hire For This Style</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
