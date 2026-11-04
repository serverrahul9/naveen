import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import InlineVideoCard from './InlineVideoCard';
import { formatINR } from '../utils/mediaStorage';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  MessageSquarePlus,
  Send,
  Film,
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';

export default function HirePage({
  initialCategory = 'reels',
  initialVideoTitle = '',
  onPlayVideo,
  onNavigate,
  isEmbedded = false,
}) {
  const { siteData, addInquiry } = useSiteData();
  const categoriesObj = siteData.categories || {};
  const categoryKeys = Object.keys(categoriesObj);

  const [selectedCategory, setSelectedCategory] = useState(
    categoriesObj[initialCategory] ? initialCategory : categoryKeys[0] || 'reels'
  );
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(initialVideoTitle || '');

  // Form mode: 'book_category' (satisfied / standard hire) OR 'unsatisfied_custom' (not satisfied with category videos -> direct message to Naveen)
  const [formMode, setFormMode] = useState('book_category');
  // Service scope: Both Video Shooter + Video Editor, Shooting Only, or Editing Only
  const [serviceScope, setServiceScope] = useState('Both: Video Shooting + Editing');

  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [videoCount, setVideoCount] = useState(3);
  const [customBudgetINR, setCustomBudgetINR] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [rawFootageUrl, setRawFootageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    if (initialCategory && categoriesObj[initialCategory]) {
      setSelectedCategory(initialCategory);
    }
    if (initialVideoTitle) {
      setSelectedVideoTitle(initialVideoTitle);
    }
  }, [initialCategory, initialVideoTitle]);

  const currentCategory =
    categoriesObj[selectedCategory] ||
    categoriesObj[categoryKeys[0]] || {
      id: 'reels',
      name: 'Video Editing',
      basePrice: 1200,
      deliveryDays: 2,
      aspectRatio: '16:9 / 9:16',
      description: 'High-retention editing by Naveen.',
    };

  // Filter videos belonging to the selected category
  const categoryVideos = (siteData.portfolio || []).filter(
    (vid) => vid.category === selectedCategory
  );

  const estimatedTotalINR =
    formMode === 'unsatisfied_custom' && customBudgetINR
      ? Number(customBudgetINR) || currentCategory.basePrice * videoCount
      : (Number(currentCategory.basePrice) || 1200) * videoCount;

  const handleSelectVideoForHire = (catKey, videoTitle) => {
    if (catKey && categoriesObj[catKey]) {
      setSelectedCategory(catKey);
    }
    setSelectedVideoTitle(videoTitle);
    setFormMode('book_category');
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSwitchToUnsatisfiedMessage = () => {
    setFormMode('unsatisfied_custom');
    setSelectedVideoTitle('Custom Style Requested (Not in Samples)');
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!clientName.trim()) nextErrors.clientName = 'Please enter your name';
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, '').length < 7) {
      nextErrors.clientPhone = 'Please enter your WhatsApp or phone number';
    }
    if (formMode === 'unsatisfied_custom' && !message.trim()) {
      nextErrors.message =
        'Please describe the video style or requirement you want Naveen to create';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const saved = addInquiry({
      type: formMode === 'unsatisfied_custom' ? 'custom_unsatisfied' : 'hire_form',
      typeLabel:
        formMode === 'unsatisfied_custom'
          ? `Direct Message (${serviceScope})`
          : `${serviceScope} Booking`,
      serviceScope,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      brandName: brandName.trim(),
      category: selectedCategory,
      categoryName: currentCategory.name,
      selectedVideoTitle:
        formMode === 'unsatisfied_custom'
          ? 'Custom Style Requested (Sample Not Matched)'
          : selectedVideoTitle || `Any ${currentCategory.name} Style`,
      videoCount: Number(videoCount) || 1,
      pricePerVideoINR: Number(currentCategory.basePrice) || 1200,
      estimatedTotalINR,
      referenceLink: referenceLink.trim(),
      rawFootageUrl: rawFootageUrl.trim(),
      message:
        message.trim() ||
        `Interested in hiring ${siteData.name} for ${videoCount} ${currentCategory.name} video(s).`,
    });

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#06b6d4', '#10b981', '#ffffff'],
      });
    } catch {
      // ignore
    }

    setSubmittedInquiry(saved);
  };

  const resetHireForm = () => {
    setSubmittedInquiry(null);
    setMessage('');
    setReferenceLink('');
    setRawFootageUrl('');
  };

  return (
    <section
      id="hire-me"
      className={`${
        isEmbedded ? 'py-24 border-t border-white/10' : 'pt-28 pb-24 min-h-screen'
      } relative bg-cine-950`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP-BY-STEP CATEGORY VIDEO SELECTION &amp; DIRECT HIRE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-3">
            HIRE {siteData.name.toUpperCase()} FOR YOUR NEXT EDIT
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            1. Select your category below &rarr; 2. Watch {siteData.name}&apos;s related sample videos directly &rarr; 3. Book a style you love, or if not satisfied with the samples, send a direct custom message to {siteData.name}!
          </p>
        </div>

        {/* STEP 1: Category Selector Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-cine-950 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span>Select Video Category (Prices in ₹ INR)</span>
            </h2>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/quotation')}
                className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Need Custom Add-ons &amp; PDF Quote?</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {Object.entries(categoriesObj).map(([catKey, cat]) => {
              const isSelected = selectedCategory === catKey;
              const videoCountForCat = (siteData.portfolio || []).filter(
                (v) => v.category === catKey
              ).length;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(catKey);
                    setSelectedVideoTitle('');
                    setSubmittedInquiry(null);
                  }}
                  className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.01]'
                      : 'glass-card border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                        {cat.aspectRatio}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">
                        {videoCountForCat} {videoCountForCat === 1 ? 'Video' : 'Videos'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-white mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">Base Price</span>
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {formatINR(cat.basePrice)}/vid
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Category-Related Videos Grid (Playable Directly) */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-cine-950 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>
                  Watch {currentCategory.name} Related Videos ({categoryVideos.length} Available)
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Play the videos below directly on this page. Click &ldquo;Select &amp; Hire&rdquo; on any video you like, or scroll down if you want something different!
              </p>
            </div>

            <button
              type="button"
              onClick={handleSwitchToUnsatisfiedMessage}
              className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Not Satisfied With Samples? Message {siteData.name} Directly</span>
            </button>
          </div>

          {categoryVideos.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-white/10">
              <Film className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-80" />
              <h3 className="font-display font-bold text-lg text-white mb-1">
                No Sample Videos Uploaded for {currentCategory.name} Yet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-5">
                Don&apos;t worry! You can send a direct message to {siteData.name} below with your custom reference link and project brief.
              </p>
              <button
                type="button"
                onClick={handleSwitchToUnsatisfiedMessage}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-cine-950"
              >
                Send Custom Message to {siteData.name}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryVideos.map((project) => (
                <InlineVideoCard
                  key={project.id}
                  project={project}
                  isSelected={selectedVideoTitle === project.title}
                  onOpenTheater={(vid) => onPlayVideo && onPlayVideo(vid)}
                  onSelectForHire={(catKey, title) => handleSelectVideoForHire(catKey, title)}
                  actionLabel={
                    selectedVideoTitle === project.title ? 'Selected for Hire' : 'Select & Hire'
                  }
                />
              ))}
            </div>
          )}

          {/* Prominent Callout Banner: If Videos Not Satisfied -> Direct Message to Naveen */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-cyan-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Not Satisfied With the {currentCategory.name} Sample Videos Above?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                  Every creator and brand has a unique style! Directly message{' '}
                  <strong className="text-amber-400">{siteData.name}</strong> with your custom idea or reference link — your message goes straight to his{' '}
                  <span className="font-mono text-cyan-400">/naveen</span> dashboard!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwitchToUnsatisfiedMessage}
              className="w-full md:w-auto shrink-0 px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Send Direct Custom Message</span>
            </button>
          </div>
        </div>

        {/* STEP 3: Hire / Direct Message Form (Saves directly to /naveen dashboard) */}
        <div ref={formRef} className="scroll-mt-28 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-white/10 bg-cine-950/60">
              <button
                type="button"
                onClick={() => setFormMode('book_category')}
                className={`p-4 sm:p-5 text-left flex items-center gap-3 transition-all ${
                  formMode === 'book_category'
                    ? 'bg-amber-400/15 border-b-2 border-amber-400 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    formMode === 'book_category'
                      ? 'bg-amber-400 text-cine-950'
                      : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm sm:text-base">
                    Book {currentCategory.name} Edit
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Hire {siteData.name} for a sample style you liked ({formatINR(currentCategory.basePrice)}/video)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormMode('unsatisfied_custom')}
                className={`p-4 sm:p-5 text-left flex items-center gap-3 transition-all ${
                  formMode === 'unsatisfied_custom'
                    ? 'bg-cyan-400/15 border-b-2 border-cyan-400 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    formMode === 'unsatisfied_custom'
                      ? 'bg-cyan-400 text-cine-950'
                      : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm sm:text-base">
                    Videos Not Satisfied? Direct Message
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Send custom requirement directly to {siteData.name}&apos;s dashboard
                  </div>
                </div>
              </button>
            </div>

            {/* Form Body or Confirmation */}
            <div className="p-6 sm:p-8">
              {submittedInquiry ? (
                <div className="py-6 text-center max-w-xl mx-auto space-y-5 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Saved in /naveen Dashboard
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-3">
                      MESSAGE SENT TO {siteData.name.toUpperCase()}!
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                      Your inquiry has been delivered directly to {siteData.name}&apos;s{' '}
                      <span className="font-mono text-amber-400">/naveen</span> dashboard. You can also ping him immediately on WhatsApp below!
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-4 text-left text-xs sm:text-sm space-y-2 border border-white/10">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Inquiry Type:</span>
                      <span className="font-semibold text-amber-400">
                        {submittedInquiry.typeLabel}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Client Name &amp; Phone:</span>
                      <span className="font-semibold text-white">
                        {submittedInquiry.clientName} ({submittedInquiry.clientPhone})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Category &amp; Videos:</span>
                      <span className="font-semibold text-white">
                        {submittedInquiry.categoryName} &times; {submittedInquiry.videoCount}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-zinc-400">Estimated Budget (INR):</span>
                      <span className="font-mono font-bold text-emerald-400 text-base">
                        {formatINR(submittedInquiry.estimatedTotalINR)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
                        `Hi ${siteData.name}! I just submitted a ${submittedInquiry.typeLabel} on your website.\nName: ${submittedInquiry.clientName}\nCategory: ${submittedInquiry.categoryName} (${submittedInquiry.videoCount} videos)\nBudget: ${formatINR(submittedInquiry.estimatedTotalINR)}\nMessage: ${submittedInquiry.message}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 text-cine-950 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-cine-950" />
                      <span>Chat on WhatsApp Now</span>
                    </a>

                    <button
                      type="button"
                      onClick={resetHireForm}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Context Banner */}
                  {formMode === 'unsatisfied_custom' ? (
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-zinc-200 flex items-start gap-3">
                      <MessageSquarePlus className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-400 font-bold block mb-0.5">
                          Direct Custom Style Message to {siteData.name}
                        </strong>
                        Didn&apos;t find the exact edit you need in the {currentCategory.name} videos above? Tell {siteData.name} exactly what style you want and paste a reference link below. This appears directly in his <span className="font-mono">/naveen</span> Hire Me inbox!
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-zinc-400">Selected Category:</span>{' '}
                        <strong className="text-amber-400 font-bold">
                          {currentCategory.name} ({formatINR(currentCategory.basePrice)}/video)
                        </strong>
                        {selectedVideoTitle && (
                          <span className="block sm:inline sm:ml-3 text-emerald-400 font-semibold">
                            &bull; Reference Video: {selectedVideoTitle}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-sm text-white bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                        Est: {formatINR(estimatedTotalINR)}
                      </span>
                    </div>
                  )}

                  {/* Service Scope Selector: Video Shooter + Video Editor (2-in-1) */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
                      Select Service Scope ({siteData.name} is Both Video Shooter &amp; Video Editor):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        'Both: Video Shooting + Editing',
                        'Video Editing Only',
                        'Video Shooting Only (Camera DOP)',
                      ].map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => setServiceScope(scope)}
                          className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
                            serviceScope === scope
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                              : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                          }`}
                        >
                          {scope}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Client Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Your Name <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Rahul Verma"
                          className={`w-full bg-white/5 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none ${
                            errors.clientName ? 'border-rose-500' : 'border-white/10 focus:border-amber-400'
                          }`}
                        />
                      </div>
                      {errors.clientName && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        WhatsApp / Phone <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full bg-white/5 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none ${
                            errors.clientPhone ? 'border-rose-500' : 'border-white/10 focus:border-emerald-400'
                          }`}
                        />
                      </div>
                      {errors.clientPhone && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.clientPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Reference Link Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Number of Videos
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVideoCount(Math.max(1, videoCount - 1))}
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={videoCount}
                          onChange={(e) => setVideoCount(Math.max(1, Number(e.target.value) || 1))}
                          className="w-20 text-center bg-white/5 border border-white/10 rounded-xl py-2 text-sm font-bold text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setVideoCount(videoCount + 1)}
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {formMode === 'unsatisfied_custom' ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Reference Video Link (Reel/YouTube)
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              value={referenceLink}
                              onChange={(e) => setReferenceLink(e.target.value)}
                              placeholder="https://instagram.com/reel/..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Your Expected Budget in ₹ (Optional)
                          </label>
                          <input
                            type="number"
                            value={customBudgetINR}
                            onChange={(e) => setCustomBudgetINR(e.target.value)}
                            placeholder={`e.g. ${(currentCategory.basePrice || 1200) * videoCount}`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Brand / Channel Name
                          </label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="Your YouTube or Instagram Handle"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Raw Footage Link (Drive / Optional)
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              value={rawFootageUrl}
                              onChange={(e) => setRawFootageUrl(e.target.value)}
                              placeholder="Google Drive / Dropbox URL"
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message / Custom Vision */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {formMode === 'unsatisfied_custom'
                        ? `Direct Message to ${siteData.name} (Explain what editing style you want) *`
                        : `Project Notes / Message for ${siteData.name}`}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        formMode === 'unsatisfied_custom'
                          ? `Hi ${siteData.name}, the sample videos in ${currentCategory.name} were different from what I need. I am looking for...`
                          : `Describe your vision, pacing, captions, or deadline requirements...`
                      }
                      className={`w-full bg-white/5 border rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none ${
                        errors.message ? 'border-rose-500' : 'border-white/10 focus:border-amber-400'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-zinc-400">
                      Instant delivery to <span className="font-mono text-amber-400">/naveen</span> dashboard &amp; WhatsApp
                    </div>

                    <button
                      type="submit"
                      className={`w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-cine-950 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                        formMode === 'unsatisfied_custom'
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-cyan-500/20'
                          : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-amber-500/25'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {formMode === 'unsatisfied_custom'
                          ? `Send Direct Message to ${siteData.name}`
                          : `Submit Hire Request (${formatINR(estimatedTotalINR)})`}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
