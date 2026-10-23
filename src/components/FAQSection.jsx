import React, { useState } from 'react';
import { creatorConfig } from '../config/creatorConfig';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-20 relative bg-cine-950 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-zinc-300 border border-white/10 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {creatorConfig.faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 bg-black/20 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
