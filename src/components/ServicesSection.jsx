import React from 'react';
import { Camera, Film, Sparkles, CheckCircle, ArrowRight, Zap, Volume2, Palette, Video, Radio } from 'lucide-react';

export default function ServicesSection({ onOpenHireMe }) {
  const shootServices = [
    {
      title: "Cinema Camera Direction",
      desc: "Full-frame 4K/6K shooting on Sony FX6 & A7S III with cinema primes for shallow depth of field and filmic texture.",
      specs: "4K 120fps DCI • 10-Bit 4:2:2 • Anamorphic Primes"
    },
    {
      title: "FPV Aerial Drone & Gimbal",
      desc: "High-speed indoor & outdoor fly-throughs with DJI Avata 2 FPV and motorized Ronin RS3 Pro tracking.",
      specs: "FPV Flythrough • LiDAR Autofocus • Smooth Motion"
    },
    {
      title: "Commercial Studio Lighting",
      desc: "Artistic key, fill, and rim lighting with Aputure RGBWW fixtures, lantern diffusers, and atmospheric haze.",
      specs: "Aputure 600c & 300d • Soft Diffusers • Cinematic Haze"
    },
    {
      title: "Broadcast Field Audio",
      desc: "Pristine audio capture using directional Sennheiser MKH 416 boom and 32-bit float dual wireless transmitters.",
      specs: "32-Bit Float • Zero Clipping • Multi-Mic Setup"
    }
  ];

  const editServices = [
    {
      title: "Viral Retention Pacing",
      desc: "Editing engineered to keep audience retention above 50% through micro-zooms, pattern interrupts, and seamless cuts.",
      specs: "YouTube Long-form • Reels/Shorts • High CTR Hooks"
    },
    {
      title: "DaVinci Resolve Color Science",
      desc: "Holistic color correction from LOG sensor inputs to cinema film print stocks (Kodak 2383 / Fuji 3513) with skin tone isolation.",
      specs: "ACEScc Pipeline • Custom Power Windows • HDR Master"
    },
    {
      title: "Immersive Sound Design & Foley",
      desc: "Custom multi-layered audio landscapes with punchy sub-bass hits, custom risers, realistic whooshes, and stereo panning.",
      specs: "Sub Drops • Atmospheric Ambience • Voice EQ Clarity"
    },
    {
      title: "Motion Graphics & Kinetic Text",
      desc: "Custom 3D tracked typography, glowing animated subtitles (Hormozi style), infographic charts, and branded intro stingers.",
      specs: "After Effects VFX • 3D Camera Tracking • 60fps Motion"
    }
  ];

  return (
    <section id="services" className="py-24 relative bg-cine-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>FULL PRODUCTION CAPABILITIES</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            FROM ON-SET SHOOTING TO{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              ELITE POST-PRODUCTION
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Book on-location production in Los Angeles and worldwide, or send raw footage from anywhere for rapid, world-class post-production.
          </p>
        </div>

        {/* Dual Service Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Column 1: Video Shooting & Cinematography */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    Phase 1 &bull; Production
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    On-Location Cinematography
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {shootServices.map((service, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all">
                    <h4 className="font-semibold text-sm text-white mb-1 flex items-center justify-between">
                      <span>{service.title}</span>
                      <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded">
                        On-Set
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                      {service.desc}
                    </p>
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {service.specs}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenHireMe('shoot')}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-2 transition-all"
            >
              <span>Book Video Shooting Package</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Column 2: Video Editing & Post-Production */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Phase 2 &bull; Post-Production
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    Elite Video Editing Studio
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {editServices.map((service, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-all">
                    <h4 className="font-semibold text-sm text-white mb-1 flex items-center justify-between">
                      <span>{service.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded">
                        Remote / In-Studio
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                      {service.desc}
                    </p>
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {service.specs}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenHireMe('edit')}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-cine-950" />
              <span>Book Editing / Send Raw Footage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
