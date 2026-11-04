import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import {
  saveMediaFile,
  extractVideoThumbnail,
  formatINR,
  formatDuration,
  formatFileSize,
} from '../utils/mediaStorage';
import InlineVideoCard from './InlineVideoCard';
import {
  Inbox,
  Film,
  Calculator,
  Layers,
  Settings,
  Upload,
  Plus,
  Trash2,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Camera,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  Search,
} from 'lucide-react';

export default function NaveenDashboard({ onNavigate, onPlayVideo }) {
  const {
    siteData,
    inquiries,
    unreadCount,
    firebaseStatus,
    updateProfile,
    updateSEO,
    updateQuotationConfig,
    addCustomization,
    updateCustomization,
    deleteCustomization,
    saveCategory,
    deleteCategory,
    addProject,
    updateProject,
    deleteProject,
    updateInquiryStatus,
    deleteInquiry,
    markAllInquiriesRead,
    resetToDefaults,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'projects' | 'quotation' | 'categories' | 'settings'
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // --- TAB 1: INQUIRIES & HIRE MESSAGES STATE ---
  const [inquiryFilter, setInquiryFilter] = useState('all'); // 'all' | 'hire_form' | 'custom_unsatisfied' | 'quotation'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter !== 'all' && inq.type !== inquiryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (inq.clientName || '').toLowerCase().includes(q) ||
        (inq.clientPhone || '').toLowerCase().includes(q) ||
        (inq.categoryName || '').toLowerCase().includes(q) ||
        (inq.message || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // --- TAB 2: PROJECTS & HIGH-QUALITY VIDEO UPLOAD STATE ---
  const categoriesObj = siteData.categories || {};
  const categoryKeys = Object.keys(categoriesObj);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projCategory, setProjCategory] = useState(categoryKeys[0] || 'reels');
  const [projPrice, setProjPrice] = useState(1500);
  const [projQuality, setProjQuality] = useState('4K 60fps UHD');
  const [projAspect, setProjAspect] = useState('16:9 Landscape 4K');
  const [projDuration, setProjDuration] = useState('0:30');
  const [projViews, setProjViews] = useState('New Edit');
  const [projVideoUrl, setProjVideoUrl] = useState('');
  const [projPreviewUrl, setProjPreviewUrl] = useState('');
  const [projThumbnail, setProjThumbnail] = useState('/images/hero-cinematography.jpg');
  const [projDescription, setProjDescription] = useState('');
  const [projTags, setProjTags] = useState('4K Edit, Color Grade, Viral Pacing');

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileMeta, setUploadedFileMeta] = useState(null);
  const previewVideoRef = useRef(null);

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadProgress(10);

    try {
      // Save high-quality video via server / IndexedDB
      const saved = await saveMediaFile(file, setUploadProgress);
      setProjVideoUrl(saved.url);
      setProjPreviewUrl(saved.playableUrl || saved.url);
      setUploadedFileMeta({
        name: file.name,
        size: formatFileSize(file.size),
        storageType: saved.storageType,
      });

      if (!projTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setProjTitle(cleanName.toUpperCase());
      }

      // Automatically extract a crisp thumbnail & duration from the uploaded video
      const thumbInfo = await extractVideoThumbnail(file, 1.2);
      if (thumbInfo) {
        if (thumbInfo.thumbnailDataUrl) {
          setProjThumbnail(thumbInfo.thumbnailDataUrl);
        }
        if (thumbInfo.durationSeconds) {
          setProjDuration(formatDuration(thumbInfo.durationSeconds));
        }
        if (thumbInfo.width && thumbInfo.height) {
          setProjAspect(
            thumbInfo.width >= thumbInfo.height ? '16:9 Landscape 4K' : '9:16 Vertical'
          );
        }
      }

      showToast(`High-quality video "${file.name}" uploaded & ready to play!`);
    } catch (err) {
      showToast(`Upload error: ${err.message}`);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleThumbnailFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProjThumbnail(reader.result);
        showToast('Custom thumbnail image applied!');
      }
    };
    reader.readAsDataURL(file);
  };

  const captureCurrentVideoFrame = () => {
    const vid = previewVideoRef.current;
    if (!vid || !vid.videoWidth) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(vid.videoWidth, 1280);
      canvas.height = Math.round(canvas.width * (vid.videoHeight / vid.videoWidth));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setProjThumbnail(dataUrl);
      showToast('Captured current video frame as thumbnail!');
    } catch {
      showToast('Could not capture frame from external cross-origin video.');
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projTitle.trim() || !projVideoUrl.trim()) {
      showToast('Please enter a project title and upload a video (or paste video URL).');
      return;
    }

    const catObj = categoriesObj[projCategory];
    const payload = {
      title: projTitle.trim(),
      client: projClient.trim() || siteData.brandName,
      category: projCategory,
      categoryLabel: catObj?.name || 'Featured Edit',
      price: Number(projPrice) || catObj?.basePrice || 1500,
      quality: projQuality.trim() || '4K 60fps HQ',
      aspect: projAspect.trim() || '16:9 Landscape 4K',
      duration: projDuration.trim() || '0:30',
      views: projViews.trim() || 'Featured Edit',
      videoUrl: projVideoUrl.trim(),
      thumbnail: projThumbnail || '/images/hero-cinematography.jpg',
      description:
        projDescription.trim() ||
        `High-retention ${catObj?.name || 'video'} edit crafted by ${siteData.name}.`,
      tags: projTags,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
      showToast('Project updated! Changes are live on the website.');
    } else {
      addProject(payload);
      showToast('New high-quality video project published to your website!');
    }

    resetProjectForm();
  };

  const startEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjTitle(proj.title || '');
    setProjClient(proj.client || '');
    setProjCategory(proj.category || categoryKeys[0] || 'reels');
    setProjPrice(proj.price || 1500);
    setProjQuality(proj.quality || '4K 60fps UHD');
    setProjAspect(proj.aspect || '16:9 Landscape 4K');
    setProjDuration(proj.duration || '0:30');
    setProjViews(proj.views || 'Featured');
    setProjVideoUrl(proj.videoUrl || '');
    setProjPreviewUrl(proj.videoUrl || '');
    setProjThumbnail(proj.thumbnail || '/images/hero-cinematography.jpg');
    setProjDescription(proj.description || '');
    setProjTags(Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags || '');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjClient('');
    setProjVideoUrl('');
    setProjPreviewUrl('');
    setProjDescription('');
    setUploadedFileMeta(null);
  };

  // --- TAB 3: QUOTATION & CUSTOMIZATION PRICING STATE ---
  const quotationConfig = siteData.quotationConfig || {};
  const [newCustName, setNewCustName] = useState('');
  const [newCustDesc, setNewCustDesc] = useState('');
  const [newCustPrice, setNewCustPrice] = useState(500);
  const [newCustCategory, setNewCustCategory] = useState('Add-On');
  const [newCustPopular, setNewCustPopular] = useState(false);

  const handleAddCustomization = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    addCustomization({
      name: newCustName.trim(),
      description: newCustDesc.trim() || 'Custom video editing enhancement per video.',
      pricePerVideo: Number(newCustPrice) || 500,
      category: newCustCategory.trim() || 'Add-On',
      popular: newCustPopular,
      active: true,
    });
    setNewCustName('');
    setNewCustDesc('');
    setNewCustPrice(500);
    setNewCustPopular(false);
    showToast('New per-video customization added to Quotation page!');
  };

  // --- TAB 4: CATEGORY & BASE INR PRICING STATE ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState(2000);
  const [newCatAspect, setNewCatAspect] = useState('16:9 Landscape 4K');
  const [newCatDays, setNewCatDays] = useState(3);
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const key = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    saveCategory(key, {
      id: key,
      name: newCatName.trim(),
      basePrice: Number(newCatPrice) || 2000,
      aspectRatio: newCatAspect.trim() || '16:9 Landscape',
      deliveryDays: Number(newCatDays) || 3,
      badge: 'Custom Category',
      description:
        newCatDesc.trim() ||
        `Professional ${newCatName.trim()} editing by ${siteData.name}.`,
      suggestions: ['High-Retention Storytelling', 'Cinema Color Grading & SFX'],
    });
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Category "${newCatName}" added with ₹ INR pricing!`);
  };

  // --- TAB 5: SHOWREEL UPLOAD IN SETTINGS ---
  const handleShowreelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const saved = await saveMediaFile(file);
      updateProfile({
        showreelUrl: saved.url,
        showreelTitle: `${siteData.brandName} // ${file.name.replace(/\.[^/.]+$/, '')}`,
      });
      showToast('New Hero Showreel video uploaded and live!');
    } catch (err) {
      showToast(`Error uploading showreel: ${err.message}`);
    }
  };

  return (
    <section className="pt-28 pb-24 min-h-screen bg-cine-950 relative">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-cine-950 font-display font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>/naveen MASTER CONTROL DASHBOARD</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Firebase Realtime Sync ({firebaseStatus === 'connected' ? 'naveen-a3142 Live' : 'Active'})
                </span>
              </div>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Welcome, {siteData.name} &mdash; NAVEEN PRO EDITOR
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage all Indian Rupee (₹) pricing, upload high-quality 4K video edits, customize your Quotation PDF builder, and respond to client Hire requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/hire')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400/15 text-amber-400 border border-amber-500/30 hover:bg-amber-400 hover:text-cine-950 transition-all"
            >
              Preview Hire Page
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/quotation')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-400/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-400 hover:text-cine-950 transition-all"
            >
              Preview ₹ Quotation Page
            </button>
          </div>
        </div>

        {/* Quick Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('inquiries')}
            className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer hover:border-amber-400/40 transition-all"
          >
            <div className="text-xs text-zinc-400 flex items-center justify-between">
              <span>Client Hire Messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white keep-white">
                  {unreadCount} New
                </span>
              )}
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              {inquiries.length}
            </div>
            <div className="text-[11px] text-amber-400 mt-0.5">
              Hire Forms &amp; Custom Messages
            </div>
          </div>

          <div
            onClick={() => setActiveTab('projects')}
            className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer hover:border-amber-400/40 transition-all"
          >
            <div className="text-xs text-zinc-400">Playable Portfolio Videos</div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              {(siteData.portfolio || []).length}
            </div>
            <div className="text-[11px] text-cyan-400 mt-0.5">
              Direct HQ Inline Playback
            </div>
          </div>

          <div
            onClick={() => setActiveTab('quotation')}
            className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer hover:border-amber-400/40 transition-all"
          >
            <div className="text-xs text-zinc-400">Quotation Customizations</div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              {(quotationConfig.customizations || []).length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Per-Video Add-Ons in ₹ INR
            </div>
          </div>

          <div
            onClick={() => setActiveTab('categories')}
            className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer hover:border-amber-400/40 transition-all"
          >
            <div className="text-xs text-zinc-400">Video Categories</div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              {categoryKeys.length}
            </div>
            <div className="text-[11px] text-amber-400 mt-0.5">
              Starting {formatINR(
                Math.min(...Object.values(categoriesObj).map((c) => Number(c.basePrice) || 1200))
              )}/vid
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-white/10">
          {[
            {
              id: 'inquiries',
              label: 'Hire Me Forms & Client Messages',
              icon: Inbox,
              badge: unreadCount > 0 ? unreadCount : null,
            },
            {
              id: 'projects',
              label: 'Upload HQ Videos & Projects',
              icon: Film,
              badge: (siteData.portfolio || []).length,
            },
            {
              id: 'quotation',
              label: 'Quotation & Per-Video ₹ Pricing',
              icon: Calculator,
            },
            {
              id: 'categories',
              label: 'Categories & Base ₹ Rates',
              icon: Layers,
            },
            {
              id: 'settings',
              label: 'Contact, Branding & SEO',
              icon: Settings,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-amber-400 text-cine-950 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-cine-950 text-amber-400'
                        : 'bg-rose-500 text-white keep-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            TAB 1: HIRE ME FORMS & CLIENT DIRECT MESSAGES
        ===================================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `All (${inquiries.length})` },
                  {
                    id: 'hire_form',
                    label: `Hire Bookings (${inquiries.filter((i) => i.type === 'hire_form').length})`,
                  },
                  {
                    id: 'custom_unsatisfied',
                    label: `Direct Messages / Unsatisfied Samples (${
                      inquiries.filter((i) => i.type === 'custom_unsatisfied').length
                    })`,
                  },
                  {
                    id: 'quotation',
                    label: `Saved Quotations (${inquiries.filter((i) => i.type === 'quotation').length})`,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setInquiryFilter(f.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      inquiryFilter === f.id
                        ? 'bg-cyan-400 text-cine-950 font-bold'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search client, phone, message..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      markAllInquiriesRead();
                      showToast('All inquiries marked as read.');
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-200 shrink-0"
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center border border-white/10">
                <Inbox className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white">
                  No Client Inquiries Found
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  When clients submit the Hire Me form, send a direct custom message, or submit a Quotation, their details appear right here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const isCustomMsg = inq.type === 'custom_unsatisfied';
                  const isQuote = inq.type === 'quotation';
                  const cleanPhone = (inq.clientPhone || '').replace(/\D/g, '');

                  return (
                    <div
                      key={inq.id}
                      onClick={() => {
                        if (inq.unread) updateInquiryStatus(inq.id, inq.status, false);
                      }}
                      className={`glass-card rounded-2xl p-5 sm:p-6 border transition-all ${
                        inq.unread
                          ? 'border-amber-400/60 bg-amber-500/5'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex items-start sm:items-center gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isCustomMsg
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isQuote
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {inq.typeLabel || 'Hire Request'}
                          </span>

                          {inq.serviceScope && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {inq.serviceScope}
                            </span>
                          )}

                          {inq.unread && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-cine-950">
                              NEW UNREAD
                            </span>
                          )}

                          <span className="text-xs font-mono text-zinc-400">
                            {new Date(inq.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={inq.status || 'new'}
                            onChange={(e) => {
                              updateInquiryStatus(inq.id, e.target.value, false);
                              showToast(`Status updated to ${e.target.value}`);
                            }}
                            className="bg-cine-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="new">Status: New Inquiry</option>
                            <option value="contacted">Status: Contacted Client</option>
                            <option value="in_progress">Status: Editing In Progress</option>
                            <option value="completed">Status: Completed &amp; Paid</option>
                          </select>

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `Hi ${inq.clientName}! This is ${siteData.name} (${siteData.brandName}). I received your ${inq.categoryName} inquiry on my website and would love to get started!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-cine-950 hover:bg-emerald-400 flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-cine-950" />
                              <span>Reply on WhatsApp</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              deleteInquiry(inq.id);
                              showToast('Inquiry deleted.');
                            }}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Client Contact & Project Scope Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                        <div className="space-y-1">
                          <div className="text-zinc-400 font-mono uppercase text-[10px]">
                            Client Contact Details
                          </div>
                          <div className="font-display font-bold text-base text-white">
                            {inq.clientName}
                            {inq.brandName && (
                              <span className="text-amber-400 font-normal text-xs ml-1.5">
                                ({inq.brandName})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 font-mono">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{inq.clientPhone || 'N/A'}</span>
                          </div>
                          {inq.clientEmail && (
                            <div className="flex items-center gap-2 text-zinc-300">
                              <Mail className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{inq.clientEmail}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="text-zinc-400 font-mono uppercase text-[10px]">
                            Selected Category &amp; Reference
                          </div>
                          <div className="font-semibold text-white">
                            Category: <span className="text-amber-400">{inq.categoryName}</span>
                          </div>
                          {inq.selectedVideoTitle && (
                            <div className="text-zinc-300">
                              Reference: <span className="text-cyan-400">{inq.selectedVideoTitle}</span>
                            </div>
                          )}
                          {inq.referenceLink && (
                            <a
                              href={inq.referenceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open Client Reference Video</span>
                            </a>
                          )}
                          {inq.rawFootageUrl && (
                            <a
                              href={inq.rawFootageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-amber-400 hover:underline block"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open Raw Footage Link</span>
                            </a>
                          )}
                        </div>

                        <div className="space-y-1 md:text-right">
                          <div className="text-zinc-400 font-mono uppercase text-[10px]">
                            Quantity &amp; Estimated Budget (INR)
                          </div>
                          <div className="font-display font-black text-2xl text-emerald-400">
                            {formatINR(inq.estimatedTotalINR)}
                          </div>
                          <div className="text-zinc-300 font-mono">
                            {inq.videoCount} {inq.videoCount === 1 ? 'Video' : 'Videos'}
                            {inq.pricePerVideoINR > 0 && ` @ ${formatINR(inq.pricePerVideoINR)}/vid`}
                          </div>
                        </div>
                      </div>

                      {/* Customizations if any */}
                      {Array.isArray(inq.selectedCustomizations) &&
                        inq.selectedCustomizations.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {inq.selectedCustomizations.map((c, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                              >
                                + {c}
                              </span>
                            ))}
                          </div>
                        )}

                      {/* Client Message Box */}
                      <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
                        <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                          Client Message / Requirements:
                        </span>
                        {inq.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: UPLOAD HIGH-QUALITY VIDEOS & MANAGE PORTFOLIO PROJECTS
        ===================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-10">
            {/* Upload / Edit Form */}
            <form
              onSubmit={handleSaveProject}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span>
                      {editingProjectId
                        ? 'Edit Video Project'
                        : 'Upload New High-Quality Video Edit'}
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Upload your high-quality MP4 / WebM / MOV edit directly from your device or paste a video link. All uploaded videos play directly on the website!
                  </p>
                </div>

                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 text-zinc-300 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: High-Quality Video File Dropzone & Live Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400">
                    1. Upload High-Quality Video File (MP4 / WebM / MOV)
                  </label>

                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-amber-400/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-all text-center">
                    <Upload className="w-8 h-8 text-amber-400 mb-2" />
                    <span className="font-display font-bold text-sm text-white">
                      Click to Select High-Quality Video File
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      Supports 4K / 1080p MP4, WebM, MOV &bull; Plays directly inline
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>

                  {isUploadingVideo && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-amber-400">
                        <span>Saving high-quality video...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadedFileMeta && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <span className="truncate font-semibold">
                        ✓ {uploadedFileMeta.name} ({uploadedFileMeta.size})
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20">
                        Ready
                      </span>
                    </div>
                  )}

                  {/* Or Direct Video URL */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Or Paste Direct Video URL (.mp4 / link):
                    </label>
                    <input
                      type="text"
                      value={projVideoUrl}
                      onChange={(e) => {
                        setProjVideoUrl(e.target.value);
                        setProjPreviewUrl(e.target.value);
                      }}
                      placeholder="https://... or uploaded automatically above"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Live Video Preview & Frame Capture */}
                  {projPreviewUrl && (
                    <div className="cinema-dark rounded-2xl overflow-hidden bg-black border border-white/15 p-2 space-y-2">
                      <video
                        ref={previewVideoRef}
                        src={projPreviewUrl}
                        poster={projThumbnail}
                        controls
                        playsInline
                        className="w-full aspect-video rounded-xl object-contain bg-black"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={captureCurrentVideoFrame}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-cine-950 transition-colors flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Use Current Frame as Thumbnail</span>
                        </button>

                        <label className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/10 text-zinc-200 hover:bg-white/20 cursor-pointer">
                          <span>Upload Custom Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Project Metadata & ₹ Price (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
                    2. Project Details &amp; Indian Rupee (₹) Pricing
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Video Title *
                      </label>
                      <input
                        type="text"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="e.g. CYBERPUNK COMMERCIAL // 4K EDIT"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Client / Brand Name
                      </label>
                      <input
                        type="text"
                        value={projClient}
                        onChange={(e) => setProjClient(e.target.value)}
                        placeholder="e.g. RedBull India / Creator Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Category (Shows on Hire Page &amp; Portfolio)
                      </label>
                      <select
                        value={projCategory}
                        onChange={(e) => {
                          const catKey = e.target.value;
                          setProjCategory(catKey);
                          if (categoriesObj[catKey]?.basePrice) {
                            setProjPrice(categoriesObj[catKey].basePrice);
                          }
                        }}
                        className="w-full bg-cine-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        {Object.entries(categoriesObj).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.name} ({formatINR(cat.basePrice)}/vid)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Price for This Style in ₹ (INR)
                      </label>
                      <input
                        type="number"
                        value={projPrice}
                        onChange={(e) => setProjPrice(e.target.value)}
                        placeholder="1500"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Video Quality Badge
                      </label>
                      <input
                        type="text"
                        value={projQuality}
                        onChange={(e) => setProjQuality(e.target.value)}
                        placeholder="4K 60fps UHD"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={projDuration}
                          onChange={(e) => setProjDuration(e.target.value)}
                          placeholder="0:45"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Views / Badge
                        </label>
                        <input
                          type="text"
                          value={projViews}
                          onChange={(e) => setProjViews(e.target.value)}
                          placeholder="2.4M Views"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Edit Description (Color grading, pacing, SFX details)
                    </label>
                    <textarea
                      rows={2}
                      value={projDescription}
                      onChange={(e) => setProjDescription(e.target.value)}
                      placeholder="Describe the editing techniques, retention pacing, and color grading used..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={projTags}
                      onChange={(e) => setProjTags(e.target.value)}
                      placeholder="Commercial, 4K Landscape, DaVinci Resolve, Sound Design"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-cine-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-cine-950" />
                      <span>
                        {editingProjectId
                          ? 'Save Project Changes'
                          : 'Publish High-Quality Video to Website'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Existing Portfolio Videos Grid */}
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Manage Published Website Videos ({(siteData.portfolio || []).length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(siteData.portfolio || []).map((project) => (
                  <div key={project.id} className="relative group">
                    <InlineVideoCard
                      project={project}
                      onOpenTheater={(vid) => onPlayVideo && onPlayVideo(vid)}
                      onSelectForHire={() => startEditProject(project)}
                      actionLabel="Edit Project"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        deleteProject(project.id);
                        showToast(`Deleted "${project.title}"`);
                      }}
                      className="absolute top-14 right-3 z-30 p-2 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white keep-white shadow-lg"
                      title="Delete Video Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: QUOTATION NAME & PER-VIDEO CUSTOMIZATION PRICING MANAGER (₹ INR)
        ===================================================================== */}
        {activeTab === 'quotation' && (
          <div className="space-y-8">
            {/* Quotation Title & Terms Settings */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-white">
                    1. Quotation Page Name, Heading &amp; PDF Settings
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Customize the Quotation title and terms that users see on `/quotation` and on their downloaded PDF.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400">Auto-Saves Instantly</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Quotation Name / Title (Shown on Website &amp; PDF Header)
                  </label>
                  <input
                    type="text"
                    value={quotationConfig.quotationName || ''}
                    onChange={(e) => updateQuotationConfig({ quotationName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Quotation Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={quotationConfig.validityDays || 14}
                    onChange={(e) =>
                      updateQuotationConfig({ validityDays: Number(e.target.value) || 14 })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Quotation Page Subtitle
                  </label>
                  <input
                    type="text"
                    value={quotationConfig.quotationSubtitle || ''}
                    onChange={(e) => updateQuotationConfig({ quotationSubtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    PDF Terms &amp; Payment Notes
                  </label>
                  <textarea
                    rows={2}
                    value={quotationConfig.termsAndNotes || ''}
                    onChange={(e) => updateQuotationConfig({ termsAndNotes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Per-Video Customizations Manager */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6">
              <div>
                <h2 className="font-display font-extrabold text-xl text-white">
                  2. Manage Video Customizations &amp; Price Per Video (₹ INR)
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  When a user selects any customization below on the Quotation page, its price in ₹ is added to the single-video price and then multiplied by the number of videos they select!
                </p>
              </div>

              {/* Add New Customization Form */}
              <form
                onSubmit={handleAddCustomization}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-mono uppercase text-cyan-400 mb-1">
                    New Customization Name *
                  </label>
                  <input
                    type="text"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. 3D Blender Intro Animation"
                    className="w-full bg-cine-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newCustDesc}
                    onChange={(e) => setNewCustDesc(e.target.value)}
                    placeholder="Custom 3D title animation & sound effects"
                    className="w-full bg-cine-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-emerald-400 mb-1">
                    Price / Video (₹) *
                  </label>
                  <input
                    type="number"
                    value={newCustPrice}
                    onChange={(e) => setNewCustPrice(e.target.value)}
                    placeholder="500"
                    className="w-full bg-cine-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase bg-cyan-400 text-cine-950 hover:bg-cyan-300 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>

              {/* Editable List of Customizations */}
              <div className="space-y-3">
                {(quotationConfig.customizations || []).map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-mono text-zinc-400 mb-0.5">
                        Customization Name
                      </label>
                      <input
                        type="text"
                        value={cust.name}
                        onChange={(e) =>
                          updateCustomization(cust.id, { name: e.target.value })
                        }
                        className="w-full bg-cine-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-mono text-zinc-400 mb-0.5">
                        Description
                      </label>
                      <input
                        type="text"
                        value={cust.description}
                        onChange={(e) =>
                          updateCustomization(cust.id, { description: e.target.value })
                        }
                        className="w-full bg-cine-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-emerald-400 mb-0.5">
                        Price Per Video (₹ INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-mono font-bold text-emerald-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={cust.pricePerVideo}
                          onChange={(e) =>
                            updateCustomization(cust.id, {
                              pricePerVideo: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-cine-900/80 border border-emerald-500/30 rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-2 pt-3 md:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateCustomization(cust.id, { popular: !cust.popular })
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border ${
                          cust.popular
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-white/5 text-zinc-400 border-white/10'
                        }`}
                      >
                        {cust.popular ? '★ Popular' : 'Standard'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteCustomization(cust.id);
                          showToast(`Removed "${cust.name}"`);
                        }}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Customization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: CATEGORIES & BASE INR PRICING MANAGER
        ===================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-4"
            >
              <h2 className="font-display font-bold text-xl text-white">
                Add New Video Category (₹ INR)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Gaming & Stream Edits"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-emerald-400 mb-1">
                    Base Price Per Video (₹) *
                  </label>
                  <input
                    type="number"
                    value={newCatPrice}
                    onChange={(e) => setNewCatPrice(e.target.value)}
                    placeholder="1800"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Aspect Ratio</label>
                  <input
                    type="text"
                    value={newCatAspect}
                    onChange={(e) => setNewCatAspect(e.target.value)}
                    placeholder="16:9 Landscape 4K"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase bg-amber-400 text-cine-950 hover:bg-amber-300 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categoriesObj).map(([catKey, cat]) => (
                <div
                  key={catKey}
                  className="glass-card rounded-3xl p-6 border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-amber-400 uppercase">
                      ID: {catKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCategory(catKey);
                        showToast(`Deleted category ${cat.name}`);
                      }}
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          saveCategory(catKey, { ...cat, name: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-emerald-400 mb-1">
                        Base Price / Video (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={cat.basePrice}
                        onChange={(e) =>
                          saveCategory(catKey, {
                            ...cat,
                            basePrice: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono font-bold text-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Aspect Ratio
                      </label>
                      <input
                        type="text"
                        value={cat.aspectRatio || ''}
                        onChange={(e) =>
                          saveCategory(catKey, { ...cat, aspectRatio: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Delivery Days
                      </label>
                      <input
                        type="number"
                        value={cat.deliveryDays || 2}
                        onChange={(e) =>
                          saveCategory(catKey, {
                            ...cat,
                            deliveryDays: Number(e.target.value) || 2,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Category Description
                      </label>
                      <textarea
                        rows={2}
                        value={cat.description || ''}
                        onChange={(e) =>
                          saveCategory(catKey, { ...cat, description: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: WEBSITE BRANDING, CONTACT, SHOWREEL & SEO SETTINGS
        ===================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Profile, Contact & Showreel */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
              <h2 className="font-display font-bold text-xl text-white border-b border-white/10 pb-3">
                1. Editor Identity, Contact Info &amp; Hero Showreel
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Editor Name</label>
                  <input
                    type="text"
                    value={siteData.name || ''}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Studio Brand Name</label>
                  <input
                    type="text"
                    value={siteData.brandName || ''}
                    onChange={(e) => updateProfile({ brandName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={siteData.email || ''}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-emerald-400 mb-1">
                    WhatsApp Number (Digits with Country Code, e.g. 919876543210)
                  </label>
                  <input
                    type="text"
                    value={siteData.whatsappNumber || ''}
                    onChange={(e) => updateProfile({ whatsappNumber: e.target.value })}
                    className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Display Phone / WhatsApp Text
                  </label>
                  <input
                    type="text"
                    value={siteData.whatsappDisplay || ''}
                    onChange={(e) => updateProfile({ whatsappDisplay: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={siteData.location || ''}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Hero Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={siteData.heroTitleLine1 || ''}
                    onChange={(e) => updateProfile({ heroTitleLine1: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Hero Headline Highlight
                  </label>
                  <input
                    type="text"
                    value={siteData.heroTitleHighlight || ''}
                    onChange={(e) => updateProfile({ heroTitleHighlight: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-amber-400 mb-1">
                    Upload Master Showreel Video
                  </label>
                  <label className="w-full flex items-center justify-center gap-2 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-amber-400 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Showreel MP4</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleShowreelUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs text-zinc-300 mb-1">Hero Sub-Tagline</label>
                  <textarea
                    rows={2}
                    value={siteData.subTagline || ''}
                    onChange={(e) => updateProfile({ subTagline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* SEO Manager */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-4">
              <h2 className="font-display font-bold text-xl text-white border-b border-white/10 pb-3">
                2. Search Engine Optimization (SEO) Settings for Naveen Editor
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={siteData.seo?.siteTitle || ''}
                    onChange={(e) => updateSEO({ siteTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteData.seo?.metaDescription || ''}
                    onChange={(e) => updateSEO({ metaDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    SEO Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={siteData.seo?.keywords || ''}
                    onChange={(e) => updateSEO({ keywords: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  showToast('Website data reset to factory defaults.');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Data to Default</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
