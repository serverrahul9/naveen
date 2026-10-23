import React, { useState } from 'react';
import { Sliders, Eye, Sparkles, Check, Activity, Film } from 'lucide-react';

export default function ColorGradeLab({ onSelectForHire }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeGrade, setActiveGrade] = useState('kodak');

  const gradePresets = {
    kodak: {
      name: 'Kodak 2383 Film Print',
      tag: 'Warm Filmic Tones',
      desc: 'Deep warm shadow halation, rich golden highlights, organic 35mm film grain, and creamy skin tone roll-off.',
      scopes: 'Shadows: -0.04 | Mids: +0.06 | Highlights: +0.12',
      filterCss: 'contrast(125%) saturate(120%) sepia(20%) hue-rotate(-5deg) brightness(102%)'
    },
    teal_orange: {
      name: 'Hollywood Blockbuster',
      tag: 'Teal & Amber Contrast',
      desc: 'Punchy complementary color separation. Cold cyan shadows with vibrant warm amber skin tones.',
      scopes: 'Shadows: Cyan +0.14 | Highlights: Amber +0.18',
      filterCss: 'contrast(140%) saturate(135%) hue-rotate(10deg) brightness(100%)'
    },
    noir: {
      name: 'Tokyo Neon Cyberpunk',
      tag: 'Electric Night Mood',
      desc: 'Inky black levels with saturated magenta and cyan highlight bloom, ideal for night car and tech commercials.',
      scopes: 'Shadows: Deep Black | Highlights: Neon Violet +0.22',
      filterCss: 'contrast(150%) saturate(155%) hue-rotate(25deg) brightness(95%)'
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  return (
    <section id="color-lab" className="py-24 relative bg-cine-900 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>DAVINCI RESOLVE COLOR SCIENCE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            FLAT LOG TO{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
              HOLLYWOOD MASTER
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Drag the interactive slider below to inspect our color pipeline: from desaturated 10-bit S-Log3 camera sensor data to fully color-graded theatrical delivery.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {Object.entries(gradePresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setActiveGrade(key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeGrade === key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{preset.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-300">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Comparison Slider */}
        <div className="max-w-5xl mx-auto">
          <div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/15 cursor-ew-resize select-none group"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Graded Layer (Right Side / Full Base) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/images/color-grading-suite.jpg"
                alt="Finished Color Graded Master"
                className="w-full h-full object-cover"
                style={{
                  filter: gradePresets[activeGrade].filterCss
                }}
              />
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/90 text-cine-950 shadow-lg">
                &bull; COLOR GRADED (REC.709 FILM PRINT)
              </div>
            </div>

            {/* Flat LOG Layer (Left Side / Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/images/color-grading-suite.jpg"
                alt="Raw S-Log3 Uncorrected"
                className="absolute inset-0 w-full h-full object-cover max-w-none filter contrast-50 brightness-110 saturate-25 grayscale-[35%]"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md text-xs font-mono font-bold bg-zinc-800/90 text-zinc-300 border border-white/10 shadow-lg">
                &bull; RAW 10-BIT S-LOG3 SENSOR
              </div>
            </div>

            {/* Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-cine-950 flex items-center justify-center shadow-xl border-2 border-amber-400 font-bold text-xs">
                &harr;
              </div>
            </div>

            {/* Bottom Scopes Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-cine-950/85 backdrop-blur-md px-6 py-3 border-t border-white/10 flex items-center justify-between z-20 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-400 font-semibold">ACEScc Pipeline</span>
                <span className="hidden sm:inline text-zinc-500">&bull;</span>
                <span className="hidden sm:inline font-mono text-zinc-400">
                  {gradePresets[activeGrade].scopes}
                </span>
              </div>
              <span className="text-zinc-400 text-[11px] font-mono">
                Drag slider across image
              </span>
            </div>
          </div>

          {/* Color Suite Details Box */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                Color Precision
              </h4>
              <p className="text-xs text-zinc-400">
                Calibrated Flanders OLED reference monitors ensuring flawless color playback on iPhones, MacBooks, and HDR TVs.
              </p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                Skin Tone Purity
              </h4>
              <p className="text-xs text-zinc-400">
                Custom vectorscope power windows to isolate realistic skin undertones regardless of challenging ambient lighting.
              </p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Need Color Grading?
                </h4>
                <p className="text-xs text-zinc-400">
                  Included in every project.
                </p>
              </div>
              <button
                onClick={() => onSelectForHire('commercial', 'Color Grading Master')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-400 text-cine-950 hover:bg-amber-300 transition-colors"
              >
                Hire Colorist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
