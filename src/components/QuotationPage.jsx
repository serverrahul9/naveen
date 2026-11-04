import React, { useState, useMemo } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { formatINR } from '../utils/mediaStorage';
import { downloadQuotationPDF } from '../utils/pdfQuotationGenerator';
import confetti from 'canvas-confetti';
import {
  FileText,
  Download,
  Sparkles,
  Check,
  Plus,
  Minus,
  Send,
  Smartphone,
  Printer,
  CheckCircle2,
  Sliders,
  Layers,
  Calculator,
  MessageCircle,
  User,
  Phone,
  Mail,
} from 'lucide-react';

export default function QuotationPage({ onNavigate }) {
  const { siteData, addInquiry } = useSiteData();
  const quotationConfig = siteData.quotationConfig || {};
  const categoriesObj = siteData.categories || {};
  const categoryKeys = Object.keys(categoriesObj);

  // Selected Base Category
  const [selectedCatKey, setSelectedCatKey] = useState(categoryKeys[0] || 'reels');
  const activeCategory = categoriesObj[selectedCatKey] || {
    id: 'reels',
    name: 'Video Editing',
    basePrice: 1200,
    aspectRatio: '16:9 / 9:16',
  };

  // Active customizations managed by Naveen
  const availableCustomizations = useMemo(
    () => (quotationConfig.customizations || []).filter((c) => c.active !== false),
    [quotationConfig.customizations]
  );

  // Selected Customization IDs
  const [selectedCustIds, setSelectedCustIds] = useState(() =>
    availableCustomizations.filter((c) => c.popular).map((c) => c.id)
  );

  // Number of videos (Multiplier)
  const [videoCount, setVideoCount] = useState(3);

  // Client Details for PDF & Dashboard Submission
  const [clientName, setClientName] = useState('');
  const [clientBrand, setClientBrand] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // PDF Format option ('mobile' is mobile-responsive default, 'a4' is standard A4)
  const [pdfLayoutMode, setPdfLayoutMode] = useState('mobile');
  const [sentToDashboard, setSentToDashboard] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Unique Quotation ID
  const [quotationNumber] = useState(
    () => `QT-NVN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const toggleCustomization = (id) => {
    setSelectedCustIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSentToDashboard(false);
  };

  const selectAllCustomizations = () => {
    setSelectedCustIds(availableCustomizations.map((c) => c.id));
  };

  const clearCustomizations = () => {
    setSelectedCustIds([]);
  };

  // Real-Time Price Calculation (Per Video + Multiplier)
  const pricing = useMemo(() => {
    const basePricePerVideo = Number(activeCategory.basePrice) || 1200;
    const selectedCustomizations = availableCustomizations.filter((c) =>
      selectedCustIds.includes(c.id)
    );
    const customizationsPerVideoTotal = selectedCustomizations.reduce(
      (sum, item) => sum + (Number(item.pricePerVideo) || 0),
      0
    );

    // Price per 1 video automatically increases with each selected customization
    const singleVideoPrice = basePricePerVideo + customizationsPerVideoTotal;

    // Multiply by number of videos
    const count = Math.max(1, Number(videoCount) || 1);
    const subtotalAllVideos = singleVideoPrice * count;

    // Optional bulk discount if enabled by Naveen
    let discountPercent = 0;
    if (quotationConfig.enableBulkDiscount && Array.isArray(quotationConfig.bulkDiscounts)) {
      const sortedRules = [...quotationConfig.bulkDiscounts].sort(
        (a, b) => Number(b.minVideos) - Number(a.minVideos)
      );
      const matchedRule = sortedRules.find((r) => count >= Number(r.minVideos));
      if (matchedRule) {
        discountPercent = Number(matchedRule.percent) || 0;
      }
    }

    const discountAmount = Math.round(subtotalAllVideos * (discountPercent / 100));
    const grandTotal = subtotalAllVideos - discountAmount;

    return {
      basePricePerVideo,
      selectedCustomizations,
      customizationsPerVideoTotal,
      singleVideoPrice,
      videoCount: count,
      subtotalAllVideos,
      discountPercent,
      discountAmount,
      grandTotal,
    };
  }, [activeCategory, availableCustomizations, selectedCustIds, videoCount, quotationConfig]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const validDays = Number(quotationConfig.validityDays) || 14;
  const validDate = new Date(today.getTime() + validDays * 24 * 60 * 60 * 1000);
  const validUntilStr = validDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleDownloadPDF = () => {
    downloadQuotationPDF({
      quotationNumber,
      dateStr,
      validUntilStr,
      siteData,
      quotationConfig,
      clientName: clientName.trim() || 'Valued Client',
      clientBrand: clientBrand.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      clientNotes: clientNotes.trim(),
      category: activeCategory,
      selectedCustomizations: pricing.selectedCustomizations,
      videoCount: pricing.videoCount,
      basePricePerVideo: pricing.basePricePerVideo,
      customizationsPerVideoTotal: pricing.customizationsPerVideoTotal,
      singleVideoPrice: pricing.singleVideoPrice,
      subtotalAllVideos: pricing.subtotalAllVideos,
      discountPercent: pricing.discountPercent,
      discountAmount: pricing.discountAmount,
      grandTotal: pricing.grandTotal,
      layoutMode: pdfLayoutMode,
    });

    setPdfDownloaded(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#06b6d4', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const handleSendQuotationToNaveen = (e) => {
    if (e) e.preventDefault();
    addInquiry({
      type: 'quotation',
      typeLabel: `Quotation Submitted (${quotationNumber})`,
      quotationNumber,
      clientName: clientName.trim() || 'Quotation Visitor',
      clientPhone: clientPhone.trim() || 'Not provided',
      clientEmail: clientEmail.trim(),
      brandName: clientBrand.trim(),
      category: selectedCatKey,
      categoryName: activeCategory.name,
      selectedVideoTitle: `${pricing.selectedCustomizations.length} Customizations Selected`,
      videoCount: pricing.videoCount,
      pricePerVideoINR: pricing.singleVideoPrice,
      estimatedTotalINR: pricing.grandTotal,
      selectedCustomizations: pricing.selectedCustomizations.map(
        (c) => `${c.name} (+${formatINR(c.pricePerVideo)}/vid)`
      ),
      message:
        clientNotes.trim() ||
        `Generated quotation ${quotationNumber}: ${pricing.videoCount}x ${activeCategory.name} at ${formatINR(pricing.singleVideoPrice)}/video = ${formatINR(pricing.grandTotal)}.`,
    });

    setSentToDashboard(true);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <section className="pt-28 pb-24 min-h-screen relative bg-cine-950">
      {/* Ambient Background Glows */}
      <div className="absolute top-24 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Quotation Header (Managed by Naveen in /naveen) */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE PER-VIDEO CUSTOMIZER &bull; MOBILE-RESPONSIVE PDF</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-3">
            {quotationConfig.quotationName || 'NAVEEN STUDIO — OFFICIAL VIDEO EDITING QUOTATION'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            {quotationConfig.quotationSubtitle ||
              'Select your base video type, pick custom editing features per video, choose the number of videos to multiply your quote, and download an instant mobile-responsive PDF.'}
          </p>
        </div>

        {/* Main 2-Column Interactive Builder & Live Quotation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Configuration Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: Select Base Video Package */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-cine-950 font-mono font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span>Choose Base Video Format</span>
                </h2>
                <span className="text-xs font-mono text-amber-400">
                  Base Rate / Video
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(categoriesObj).map(([catKey, cat]) => {
                  const isSelected = selectedCatKey === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setSelectedCatKey(catKey)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-display font-bold text-sm sm:text-base text-white">
                          {cat.name}
                        </span>
                        <span className="font-mono font-bold text-sm text-amber-400 shrink-0">
                          {formatINR(cat.basePrice)}/vid
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Select Video Customizations (Per-Video Add-Ons) */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-cyan-400 text-cine-950 font-mono font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <span>Select Customizations Per Video</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Each customization automatically increases the single-video price before multiplying by your total video count.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={selectAllCustomizations}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearCustomizations}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableCustomizations.map((cust) => {
                  const isChecked = selectedCustIds.includes(cust.id);
                  return (
                    <div
                      key={cust.id}
                      onClick={() => toggleCustomization(cust.id)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all flex flex-col justify-between gap-2 ${
                        isChecked
                          ? 'bg-violet-500/15 border-violet-400 shadow-md shadow-violet-500/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-violet-500 text-white keep-white'
                                : 'border border-zinc-500 bg-black/20'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-xs sm:text-sm text-white leading-snug">
                              {cust.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                              {cust.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                          {cust.category || 'Add-On'}
                        </span>
                        <span
                          className={`font-mono font-bold text-xs sm:text-sm ${
                            isChecked ? 'text-emerald-400' : 'text-violet-400'
                          }`}
                        >
                          +{formatINR(cust.pricePerVideo)}/vid
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Select Number of Videos (Quantity Multiplier) */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-emerald-400 text-cine-950 font-mono font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <span>Select Number of Videos (Multiplier)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your customized per-video price ({formatINR(pricing.singleVideoPrice)}) multiplies automatically by the number of videos.
                  </p>
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setVideoCount(Math.max(1, videoCount - 1))}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={videoCount}
                    onChange={(e) => setVideoCount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 text-center font-display font-black text-2xl text-white bg-white/5 border border-white/15 rounded-xl py-1.5 focus:outline-none focus:border-amber-400"
                  />

                  <button
                    type="button"
                    onClick={() => setVideoCount(videoCount + 1)}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Smooth Range Slider */}
              <div className="mb-5">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={Math.min(30, videoCount)}
                  onChange={(e) => setVideoCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                  <span>1 Video</span>
                  <span>5 Videos</span>
                  <span>10 Videos</span>
                  <span>20 Videos</span>
                  <span>30+ Videos</span>
                </div>
              </div>

              {/* Quick Multiplier Preset Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[1, 3, 5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setVideoCount(num)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      videoCount === num
                        ? 'bg-amber-400 text-cine-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    &times;{num} {num === 1 ? 'Vid' : 'Vids'}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: Optional Client Details for Personalized PDF & Dashboard */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10">
              <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-purple-400 text-cine-950 font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <span>Your Details (Appears on Downloaded PDF &amp; Dashboard)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Name / Client Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Aman Gupta"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Brand / YouTube / Instagram Name
                  </label>
                  <input
                    type="text"
                    value={clientBrand}
                    onChange={(e) => setClientBrand(e.target.value)}
                    placeholder="e.g. GrowthX Studio"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="aman@brand.in"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Project Notes / Custom Requirements (Printed on PDF)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Optional notes, target delivery dates, or special instructions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Mobile-Responsive Quotation Summary & PDF Download (5 Cols, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="glass-card rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
              {/* Top Invoice Banner */}
              <div className="cinema-dark p-6 bg-gradient-to-br from-cine-900 via-cine-950 to-black border-b border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    LIVE QUOTATION PREVIEW
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {quotationNumber}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white leading-snug">
                  {quotationConfig.quotationName || 'OFFICIAL VIDEO EDITING QUOTATION'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Date: {dateStr} &bull; Valid Until: {validUntilStr}
                </p>
              </div>

              {/* Itemized Breakdown Body */}
              <div className="p-6 space-y-5">
                {/* Per-Video Breakdown Box */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    1. Single Video Rate Breakdown
                  </div>

                  {/* Base Video */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-white">
                        Base: {activeCategory.name}
                      </span>
                      <span className="block text-[10px] text-zinc-400">
                        {activeCategory.aspectRatio}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">
                      {formatINR(pricing.basePricePerVideo)}
                    </span>
                  </div>

                  {/* Selected Customizations */}
                  {pricing.selectedCustomizations.length === 0 ? (
                    <div className="py-2 px-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400 italic">
                      No extra customizations selected (+₹0/video)
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {pricing.selectedCustomizations.map((cust) => (
                        <div
                          key={cust.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs"
                        >
                          <span className="text-zinc-200 truncate pr-2">
                            + {cust.name}
                          </span>
                          <span className="font-mono font-bold text-emerald-400 shrink-0">
                            +{formatINR(cust.pricePerVideo)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customized Price Per 1 Video */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs sm:text-sm">
                    <span className="font-bold text-zinc-200">
                      Customized Price Per 1 Video:
                    </span>
                    <span className="font-mono font-extrabold text-base text-white">
                      {formatINR(pricing.singleVideoPrice)} / video
                    </span>
                  </div>
                </div>

                {/* Multiplier Box */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">
                      Video Quantity Multiplier:
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {formatINR(pricing.singleVideoPrice)} &times; {pricing.videoCount}{' '}
                      {pricing.videoCount === 1 ? 'Video' : 'Videos'}
                    </span>
                  </div>

                  {pricing.discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Volume Discount ({pricing.discountPercent}% OFF):</span>
                      <span className="font-mono">-{formatINR(pricing.discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-500/20 flex items-baseline justify-between">
                    <span className="font-display font-bold text-sm uppercase text-white">
                      Grand Total (INR):
                    </span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-amber-400">
                      {formatINR(pricing.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* PDF Layout Selector (Mobile Responsive vs Standard A4) */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Select PDF Format Style:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfLayoutMode('mobile')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        pdfLayoutMode === 'mobile'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile-Responsive PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPdfLayoutMode('a4')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        pdfLayoutMode === 'a4'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Standard A4 Print PDF</span>
                    </button>
                  </div>
                </div>

                {/* Primary Actions: Download PDF & Send to /naveen Dashboard */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="w-full py-4 px-5 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-cine-950 shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download Quotation PDF ({formatINR(pricing.grandTotal)})</span>
                  </button>

                  {pdfDownloaded && (
                    <div className="text-center text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PDF Quotation downloaded! Ready to view or share on mobile.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleSendQuotationToNaveen}
                      className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center justify-center gap-1.5"
                    >
                      {sentToDashboard ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Sent to {siteData.name}!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Send Quote to {siteData.name}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
                        `Hi ${siteData.name}! I created Quotation ${quotationNumber} on your website:\n• Format: ${activeCategory.name} (${formatINR(pricing.basePricePerVideo)}/vid)\n• Customizations: ${
                          pricing.selectedCustomizations.map((c) => c.name).join(', ') || 'Base Edit'
                        }\n• Single Video Rate: ${formatINR(pricing.singleVideoPrice)}/video\n• Quantity: ${pricing.videoCount} videos\n• Total Quote: ${formatINR(pricing.grandTotal)}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Admin Shortcut Hint */}
                {onNavigate && (
                  <div className="pt-3 border-t border-white/10 text-center">
                    <button
                      type="button"
                      onClick={() => onNavigate('/naveen')}
                      className="text-[11px] font-mono text-zinc-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>
                        {siteData.name} can edit quotation title &amp; per-video customization prices in /naveen
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

