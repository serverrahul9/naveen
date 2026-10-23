import React, { useState, useEffect } from 'react';
import { creatorConfig } from '../config/creatorConfig';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Smartphone,
  Mail,
  User,
  Film,
  Camera,
  Layers,
  Clock,
  Send,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  DollarSign,
  Link as LinkIcon,
  X
} from 'lucide-react';

export default function HireMeWizard({ initialCategory = 'reels', initialStyle = '', isOpen, onClose }) {
  // Wizard Steps: 1: Category & Topics, 2: Quantity & Scope, 3: Contact & Submission
  const [step, setStep] = useState(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'reels');
  const [selectedSuggestions, setSelectedSuggestions] = useState(initialStyle ? [initialStyle] : []);
  const [customTopic, setCustomTopic] = useState('');
  
  // Scope & Quantity
  const [videoCount, setVideoCount] = useState(3);
  const [productionType, setProductionType] = useState('editing'); // 'editing' or 'shoot_and_edit'
  const [turnaround, setTurnaround] = useState('standard'); // 'standard', 'express_48h', 'rush_24h'
  
  // Contact Details (Demand User WhatsApp & Email)
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [brandOrChannel, setBrandOrChannel] = useState('');
  const [rawFootageUrl, setRawFootageUrl] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Status State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Sync initialCategory or initialStyle when opened from cards
  useEffect(() => {
    if (initialCategory && creatorConfig.categories[initialCategory]) {
      setSelectedCategory(initialCategory);
    }
    if (initialStyle) {
      setSelectedSuggestions((prev) => Array.from(new Set([...prev, initialStyle])));
    }
  }, [initialCategory, initialStyle, isOpen]);

  const categoryData = creatorConfig.categories[selectedCategory] || creatorConfig.categories.reels;

  // Toggle dynamic topic suggestion
  const toggleSuggestion = (topic) => {
    if (selectedSuggestions.includes(topic)) {
      setSelectedSuggestions(selectedSuggestions.filter((s) => s !== topic));
    } else {
      setSelectedSuggestions([...selectedSuggestions, topic]);
    }
  };

  // Price Calculation Logic
  const calculatePricing = () => {
    const basePerVideo = categoryData.basePrice;
    let baseTotal = basePerVideo * videoCount;

    // Shooting day package add-on
    let shootingFee = 0;
    if (productionType === 'shoot_and_edit') {
      const shootDays = Math.max(1, Math.ceil(videoCount / 3));
      shootingFee = shootDays * 650; // $650 per shoot day
    }

    // Volume discount
    let discountPercent = 0;
    if (videoCount >= 10) discountPercent = 0.20; // 20% off
    else if (videoCount >= 5) discountPercent = 0.10; // 10% off

    const discountAmount = Math.round(baseTotal * discountPercent);
    const discountedBase = baseTotal - discountAmount;

    // Turnaround speed multiplier
    let rushFee = 0;
    if (turnaround === 'rush_24h') rushFee = Math.round(baseTotal * 0.35);
    else if (turnaround === 'express_48h') rushFee = Math.round(baseTotal * 0.15);

    const totalEstimate = discountedBase + shootingFee + rushFee;

    return {
      basePerVideo,
      baseTotal,
      discountPercent,
      discountAmount,
      shootingFee,
      rushFee,
      totalEstimate
    };
  };

  const pricing = calculatePricing();

  // Validate Contact Step
  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!userEmail.trim() || !userEmail.includes('@')) errors.userEmail = 'Please provide a valid email address.';
    if (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, '').length < 7) {
      errors.whatsappNumber = 'Please provide a valid WhatsApp number so our team can send drafts & previews.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate Email and WhatsApp Brief Text
  const generateBriefText = () => {
    const cleanWhatsApp = `${countryCode} ${whatsappNumber.trim()}`;
    const allTopics = [
      ...selectedSuggestions,
      customTopic.trim() ? `Custom: ${customTopic.trim()}` : null
    ].filter(Boolean).join(', ');

    return `*PROJECT INQUIRY & ESTIMATE BRIEF*
---------------------------------------
Client Name: ${fullName}
Client Email: ${userEmail}
Client WhatsApp: ${cleanWhatsApp}
Brand/Channel: ${brandOrChannel || 'N/A'}
Target Deadline: ${targetDeadline || 'Flexible'}

PROJECT SCOPE:
Category: ${categoryData.name} (${categoryData.aspectRatio})
Quantity: ${videoCount} video(s)
Production Type: ${productionType === 'shoot_and_edit' ? 'Video Shooting + Post-Production Editing' : 'Post-Production Editing Only'}
Turnaround: ${turnaround.toUpperCase()}

TOPICS & SUGGESTIONS:
${allTopics || 'None selected (creator recommendation requested)'}

RAW FOOTAGE / ASSETS:
Link: ${rawFootageUrl || 'Will share via Google Drive/Dropbox'}

ADDITIONAL NOTES:
${additionalNotes || 'None'}

ESTIMATED BUDGET:
Estimated Total: $${pricing.totalEstimate.toLocaleString()} USD
(Base: $${pricing.basePerVideo}/vid, Qty: ${videoCount}${pricing.discountAmount > 0 ? `, Savings: -$${pricing.discountAmount}` : ''}${pricing.shootingFee > 0 ? `, Shooting Fee: +$${pricing.shootingFee}` : ''})
---------------------------------------
Delivered via Vance Cinematics Portfolio System`;
  };

  // Submit Handler: Triggers mailto delivery & triggers confetti
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const brief = generateBriefText();

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#06b6d4', '#10b981', '#ffffff']
      });
    } catch (err) {
      // safe fallback
    }

    // Prepare mailto link to client's email
    const subject = encodeURIComponent(`[NEW VIDEO PROJECT] ${categoryData.name} (${videoCount} Videos) - ${fullName}`);
    const body = encodeURIComponent(brief);
    const mailtoUrl = `mailto:${creatorConfig.email}?subject=${subject}&body=${body}`;

    // Attempt to open mail client automatically
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();

    setIsSubmitted(true);
  };

  const copyBriefToClipboard = () => {
    navigator.clipboard.writeText(generateBriefText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(1);
    setFullName('');
    setUserEmail('');
    setWhatsappNumber('');
    setCustomTopic('');
    setSelectedSuggestions([]);
    if (onClose) onClose();
  };

  // If used as a standalone modal or on-page section
  const content = (
    <div className="w-full max-w-5xl mx-auto bg-cine-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
      {/* Wizard Header Bar */}
      <div className="px-6 sm:px-8 py-5 bg-cine-950 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              PROJECT ESTIMATOR &amp; BOOKING
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select your category, pick viral topics, choose video volume, and receive direct quote &amp; email delivery.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Steps Header */}
      {!isSubmitted && (
        <div className="px-6 sm:px-8 py-4 bg-cine-950/60 border-b border-white/5 flex items-center justify-between text-xs sm:text-sm">
          <div
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step >= 1 ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
              step >= 1 ? 'bg-amber-400 text-cine-950' : 'bg-white/10 text-zinc-400'
            }`}>
              1
            </span>
            <span>Category &amp; Topics</span>
          </div>

          <div className="h-0.5 flex-1 max-w-[60px] sm:max-w-[100px] bg-white/10 mx-2" />

          <div
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step >= 2 ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
              step >= 2 ? 'bg-amber-400 text-cine-950' : 'bg-white/10 text-zinc-400'
            }`}>
              2
            </span>
            <span>Quantity &amp; Estimate</span>
          </div>

          <div className="h-0.5 flex-1 max-w-[60px] sm:max-w-[100px] bg-white/10 mx-2" />

          <div
            onClick={() => {
              if (step < 3) setStep(3);
            }}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step >= 3 ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
              step >= 3 ? 'bg-amber-400 text-cine-950' : 'bg-white/10 text-zinc-400'
            }`}>
              3
            </span>
            <span>Contact &amp; Submit</span>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="p-6 sm:p-8">
        {/* SUCCESS CONFIRMATION VIEW */}
        {isSubmitted ? (
          <div className="py-8 text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Inquiry Dispatched to Client
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-3">
                PROJECT BRIEF DELIVERED!
              </h3>
              <p className="text-sm text-zinc-300 mt-2 max-w-lg mx-auto">
                All details have been compiled and sent to <span className="text-amber-400 font-medium">{creatorConfig.email}</span>. We also prepared an instant direct WhatsApp link so you can immediately chat with Marcus.
              </p>
            </div>

            {/* Project Summary Box */}
            <div className="glass-card rounded-2xl p-5 text-left border border-white/10 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Client:</span>
                <span className="font-semibold text-white">{fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Client WhatsApp:</span>
                <span className="font-mono font-semibold text-emerald-400">{countryCode} {whatsappNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Category &amp; Volume:</span>
                <span className="font-semibold text-white">{categoryData.name} ({videoCount} videos)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Selected Topics:</span>
                <span className="text-zinc-200 text-right max-w-xs truncate">
                  {selectedSuggestions.join(', ') || 'Custom Vision'}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-white">Estimated Investment:</span>
                <span className="font-display font-black text-amber-400 text-base">
                  ${pricing.totalEstimate.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {/* WhatsApp Direct Chat */}
              <a
                href={`https://wa.me/${creatorConfig.whatsappNumber}?text=${encodeURIComponent(generateBriefText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-cine-950 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-cine-950" />
                <span>Chat Now on WhatsApp</span>
              </a>

              {/* Copy Brief */}
              <button
                onClick={copyBriefToClipboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Brief Copied!' : 'Copy Project Brief'}</span>
              </button>

              {/* Start New */}
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-xs text-zinc-400 hover:text-white"
              >
                New Calculation
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* STEP 1: CATEGORY & DYNAMIC TOPIC SUGGESTIONS */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* 1A: Category Cards */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
                    Step 1A: Choose Video Format / Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {Object.entries(creatorConfig.categories).map(([catKey, cat]) => {
                      const isSelected = selectedCategory === catKey;
                      return (
                        <div
                          key={catKey}
                          onClick={() => {
                            setSelectedCategory(catKey);
                            // Clear suggestion if category changed
                            if (selectedCategory !== catKey) {
                              setSelectedSuggestions([]);
                            }
                          }}
                          className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400 shadow-xl shadow-amber-500/10'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-300">
                                {cat.aspectRatio}
                              </span>
                              <span className="text-[10px] font-bold text-amber-400">
                                {cat.badge}
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-base text-white mb-1">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {cat.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Starting from</span>
                            <span className="font-mono font-bold text-amber-400">
                              ${cat.basePrice} / video
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 1B: Category-Related Video Topic Suggestions */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Suggested Topics &amp; Viral Styles for {categoryData.name}</span>
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Click to add suggestions to your order
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {categoryData.suggestions.map((topic, idx) => {
                      const isSelected = selectedSuggestions.includes(topic);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleSuggestion(topic)}
                          className={`text-xs px-3.5 py-2 rounded-xl transition-all text-left flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/10 font-medium'
                              : 'bg-white/5 text-zinc-300 hover:text-white border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-cyan-400 text-cine-950 font-bold' : 'border border-zinc-500'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span>{topic}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Topic Input */}
                  <div className="pt-3 border-t border-white/10">
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Or Describe Your Custom Topic / Reference Link:
                    </label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. Vox style explainers on AI technology, or paste YouTube link for reference"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Continue button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Next: Select Quantity &amp; Scope</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: QUANTITY, SCOPE & ESTIMATE */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* 2A: Number of Videos (Stepper & Preset Bundles) */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                        How many videos do you need?
                      </label>
                      <p className="text-xs text-zinc-400">
                        Higher volume unlocks automated bundle discounts up to 20% off.
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setVideoCount(Math.max(1, videoCount - 1))}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <div className="w-16 text-center">
                        <span className="font-display font-extrabold text-3xl text-white">
                          {videoCount}
                        </span>
                        <span className="block text-[10px] text-zinc-400 uppercase font-mono">
                          {videoCount === 1 ? 'Video' : 'Videos'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVideoCount(videoCount + 1)}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Preset Packages Quick Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { count: 1, label: 'Single Pilot', badge: null },
                      { count: 3, label: 'Tri-Pack', badge: 'Popular' },
                      { count: 5, label: 'Growth Batch', badge: '10% OFF' },
                      { count: 10, label: 'Monthly Retainer', badge: '20% OFF' },
                    ].map((pkg) => (
                      <button
                        key={pkg.count}
                        type="button"
                        onClick={() => setVideoCount(pkg.count)}
                        className={`p-3 rounded-xl text-center border transition-all ${
                          videoCount === pkg.count
                            ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                            : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm font-bold text-white">{pkg.count} Videos</div>
                        <div className="text-[11px] text-zinc-400">{pkg.label}</div>
                        {pkg.badge && (
                          <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {pkg.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2B: Production Scope: Editing vs Shoot + Edit */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                    Select Production Scope
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setProductionType('editing')}
                      className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                        productionType === 'editing'
                          ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/10 text-amber-400">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white">
                            Post-Production Editing Only
                          </h4>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            You provide raw footage / Drive link
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Includes pattern interrupts, sound design, DaVinci color grading, kinetic typography, and 2 revision cycles.
                      </p>
                    </div>

                    <div
                      onClick={() => setProductionType('shoot_and_edit')}
                      className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                        productionType === 'shoot_and_edit'
                          ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/10 text-cyan-400">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white">
                            On-Set Shooting + Full Editing
                          </h4>
                          <span className="text-[11px] text-cyan-300 font-mono">
                            Turnkey Cinema Production
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Includes Sony FX6 cinema package, Ronin gimbal, drone operator, lighting, audio capture + full post-production.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2C: Turnaround Speed */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Turnaround Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'standard', label: 'Standard Delivery', days: '3-5 Days', fee: 'No rush fee' },
                      { id: 'express_48h', label: 'Express 48 Hours', days: '48h First Cut', fee: '+15%' },
                      { id: 'rush_24h', label: 'Priority Rush 24h', days: '24h Delivery', fee: '+35%' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTurnaround(t.id)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          turnaround === t.id
                            ? 'bg-amber-400/10 border-amber-400 text-white font-medium'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{t.label}</div>
                        <div className="text-[11px] text-zinc-400">{t.days}</div>
                        <div className="text-[10px] font-mono text-amber-400 mt-0.5">{t.fee}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Pricing Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cine-800 to-cine-850 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                      Real-Time Investment Estimate
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-display font-black text-3xl sm:text-4xl text-white">
                        ${pricing.totalEstimate.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">USD</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 space-x-2">
                      <span>{videoCount} {categoryData.name} Video(s)</span>
                      {pricing.discountAmount > 0 && (
                        <span className="text-emerald-400 font-semibold">
                          &bull; Saved ${pricing.discountAmount}
                        </span>
                      )}
                      {pricing.shootingFee > 0 && (
                        <span className="text-cyan-400 font-semibold">
                          &bull; Includes Cinema Shooting
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white border border-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Next: Enter Contact &amp; Submit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DEMAND USER CONTACT DETAILS (WHATSAPP, EMAIL, BRIEF) */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-300">
                    <strong className="text-amber-400 font-semibold">Direct Communication Priority:</strong> We deliver all video cuts, timeline updates, and timestamp review links directly to your <span className="text-white underline">WhatsApp</span> and email for 24-hour turnaround response.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Henderson"
                        className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          formErrors.fullName ? 'border-red-500' : 'border-white/10 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Email Address <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="alex@brand.com"
                        className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          formErrors.userEmail ? 'border-red-500' : 'border-white/10 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    {formErrors.userEmail && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.userEmail}</p>
                    )}
                  </div>

                  {/* USER WHATSAPP NUMBER (DEMANDED AS REQUESTED) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Your WhatsApp Number <strong className="text-emerald-400">* (Required for Drafts &amp; Fast Approval)</strong></span>
                      </span>
                      <span className="text-[11px] text-zinc-400">Direct Chat &amp; Revisions</span>
                    </label>

                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-cine-800 border border-white/10 rounded-xl px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="+1">🇺🇸 +1 (US/CA)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+91">🇮🇳 +91 (India)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+61">🇦🇺 +61 (Australia)</option>
                        <option value="+49">🇩🇪 +49 (Germany)</option>
                        <option value="+33">🇫🇷 +33 (France)</option>
                        <option value="+65">🇸🇬 +65 (Singapore)</option>
                      </select>

                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 555-0199 or 9876543210"
                        className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          formErrors.whatsappNumber ? 'border-red-500' : 'border-white/10 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                    {formErrors.whatsappNumber && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.whatsappNumber}</p>
                    )}
                  </div>

                  {/* Brand / Channel Name */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Brand / YouTube / Instagram Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={brandOrChannel}
                      onChange={(e) => setBrandOrChannel(e.target.value)}
                      placeholder="@yourbrand or youtube.com/@channel"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Target Deadline */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Target Launch Date / Deadline
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="date"
                        value={targetDeadline}
                        onChange={(e) => setTargetDeadline(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Raw Footage Link */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                      <span>Raw Footage / Asset Link (Drive, Dropbox, Frame.io)</span>
                      <span className="text-[11px] text-zinc-500">Can be uploaded later</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="url"
                        value={rawFootageUrl}
                        onChange={(e) => setRawFootageUrl(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Additional Vision Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Specific Instructions, Music Preferences, or Style Notes
                    </label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Mention any specific sound effects, reference channels, or color vibes you want us to match..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* Final Submission Card */}
                <div className="p-4 rounded-xl bg-cine-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-zinc-400">
                    <div>
                      Submitting delivers to client: <span className="text-amber-400 font-mono">{creatorConfig.email}</span>
                    </div>
                    <div>
                      And unlocks instant 1-click WhatsApp sync to <span className="text-emerald-400 font-mono">{creatorConfig.whatsappDisplay}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white border border-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-cine-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4 fill-cine-950" />
                      <span>Submit Project Brief</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-5xl my-auto" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="hire-me" className="py-24 relative bg-cine-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {content}
      </div>
    </section>
  );
}
