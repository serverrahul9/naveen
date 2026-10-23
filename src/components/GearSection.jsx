import React from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Camera, Cpu, Sliders, CheckCircle2 } from 'lucide-react';

export default function GearSection() {
  return (
    <section id="gear" className="py-20 relative bg-cine-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-zinc-300 border border-white/10 mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>STUDIO & FIELD RIG</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              CINEMA GEAR &amp; HARDWARE STACK
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            World-class productions demand uncompromising optical and computational equipment. No consumer toys.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creatorConfig.gear.map((item, i) => (
            <div
              key={i}
              className="glass-card p-5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-base text-white mt-2 mb-1">
                  {item.name}
                </h3>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{item.spec}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
