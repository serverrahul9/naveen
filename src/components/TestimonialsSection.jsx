import React from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { Star, Quote, Award } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative bg-cine-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>INDUSTRY REPUTATION</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            TRUSTED BY{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              TOP CREATORS &amp; BRANDS
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Real feedback from high-growth YouTubers, global product brands, and digital agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creatorConfig.testimonials.map((testi, i) => (
            <div
              key={i}
              className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {testi.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                  "{testi.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={testi.avatar}
                  alt={testi.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/40"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {testi.author}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {testi.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
