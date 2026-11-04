import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Eye,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { resolvePlayableUrl, formatINR } from '../utils/mediaStorage';

export default function InlineVideoCard({
  project,
  onOpenTheater,
  onSelectForHire,
  isSelected = false,
  actionLabel = 'Hire This Style',
}) {
  const videoRef = useRef(null);
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setVideoError(false);
    setIsPlaying(false);
    setProgress(0);
    resolvePlayableUrl(project.videoUrl).then((url) => {
      if (mounted) {
        setResolvedUrl(url || project.videoUrl || '');
      }
    });
    return () => {
      mounted = false;
    };
  }, [project.videoUrl]);

  const togglePlayInline = (e) => {
    if (e) e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      // Pause any other playing inline videos on the page so audio doesn't overlap
      document.querySelectorAll('video[data-inline-player="true"]').forEach((otherVid) => {
        if (otherVid !== vid && !otherVid.paused) {
          otherVid.pause();
        }
      });
      vid.muted = isMuted;
      vid.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback if browser blocks unmuted play
        vid.muted = true;
        setIsMuted(true);
        vid.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const pct = (vid.currentTime / vid.duration) * 100;
    setProgress(pct);
    const mins = Math.floor(vid.currentTime / 60);
    const secs = Math.floor(vid.currentTime % 60);
    setCurrentTimeStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
  };

  const handleScrub = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio * 100);
  };

  return (
    <div
      className={`group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-2xl shadow-amber-500/15'
          : 'border-white/10'
      }`}
    >
      {/* Direct Playable Landscape Video Viewport */}
      <div
        className="cinema-dark relative aspect-video bg-black overflow-hidden cursor-pointer select-none"
        onClick={togglePlayInline}
      >
        {resolvedUrl && !videoError ? (
          <video
            ref={videoRef}
            data-inline-player="true"
            src={resolvedUrl}
            poster={project.thumbnail || '/images/hero-cinematography.jpg'}
            playsInline
            preload="metadata"
            loop
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <img
            src={project.thumbnail || '/images/hero-cinematography.jpg'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Cinematic Gradient Overlay when paused */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/45 transition-opacity duration-300 pointer-events-none ${
            isPlaying ? 'opacity-20 group-hover:opacity-70' : 'opacity-90'
          }`}
        />

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
              {project.categoryLabel || project.category}
            </span>
            {project.quality && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                {project.quality}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {project.price > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-emerald-500/90 text-cine-950 shadow-lg">
                {formatINR(project.price)}
              </span>
            )}
            {project.views && (
              <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/75 backdrop-blur-md text-zinc-200">
                <Eye className="w-3 h-3 text-amber-400" />
                {project.views}
              </span>
            )}
          </div>
        </div>

        {/* Center Play Indicator when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-amber-400 text-cine-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 fill-cine-950 ml-0.5" />
            </div>
            <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/75 text-white border border-white/15 backdrop-blur-md">
              Click to Play Directly
            </span>
          </div>
        )}

        {/* Bottom Inline Video Player Controls Bar */}
        <div
          className="absolute bottom-0 inset-x-0 p-3 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrubber Bar */}
          <div
            onClick={handleScrub}
            className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/scrub"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-100"
              style={{ width: `${isPlaying || progress > 0 ? Math.max(progress, 3) : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayInline}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-cine-950 text-white transition-colors"
                title={isPlaying ? 'Pause Video' : 'Play Video Directly'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="text-[11px] font-mono text-zinc-300">
                {isPlaying ? currentTimeStr : project.duration || '0:30'}
              </span>

              {isPlaying && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Playing HQ
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {project.aspect && (
                <span className="text-[10px] font-mono text-zinc-300 bg-white/10 px-2 py-0.5 rounded">
                  {project.aspect}
                </span>
              )}
              {onOpenTheater && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current && !videoRef.current.paused) {
                      videoRef.current.pause();
                    }
                    onOpenTheater(project);
                  }}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-cine-950 text-white transition-colors"
                  title="Open Fullscreen Cinema Player"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1">
            <span className="truncate">
              Client: <span className="text-zinc-200">{project.client}</span>
            </span>
            {isSelected && (
              <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tags */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={togglePlayInline}
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPlaying ? 'Pause Inline' : 'Play Inline HQ'}</span>
            </button>

            {onSelectForHire && (
              <button
                type="button"
                onClick={() => onSelectForHire(project.category, project.title, project)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-cine-950 shadow-lg shadow-amber-500/25'
                    : 'bg-amber-400/15 text-amber-400 hover:bg-amber-400 hover:text-cine-950 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

