import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import {
  saveSiteDataToFirebase,
  saveInquiriesToFirebase,
} from '../config/firebase';
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
  Save,
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
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Just now');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Explicit Save Handler that syncs all current state to Firebase + localStorage
  const handleManualSaveDetails = async (label = 'All Details') => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveSiteDataToFirebase(siteData),
        saveInquiriesToFirebase(inquiries),
      ]);
      const nowStr = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSavedTime(nowStr);
      showToast(`✓ ${label} Saved Successfully to Firebase!`);
    } catch {
      showToast(`✓ ${label} Saved Locally!`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- TAB 1: INQUIRIES & HIRE MESSAGES STATE ---
  const [inquiryFilter, setInquiryFilter] = useState('all');
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
  const [projQuality, setProjQuality] = useState('4K 60fps Shot & Edited');
  const [projAspect, setProjAspect] = useState('16:9 Landscape 4K');
  const [projDuration, setProjDuration] = useState('0:30');
  const [projViews, setProjViews] = useState('New Edit');
  const [projVideoUrl, setProjVideoUrl] = useState('');
  const [projPreviewUrl, setProjPreviewUrl] = useState('');
  const [projThumbnail, setProjThumbnail] = useState('/images/hero-cinematography.jpg');
  const [projDescription, setProjDescription] = useState('');
  const [projTags, setProjTags] = useState('Shoot & Edit, 4K, Color Grade');

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

      showToast(`High-quality video "${file.name}" uploaded & ready!`);
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

  const handleSaveProject = async (e) => {
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
      categoryLabel: catObj?.name || 'Shoot + Edit',
      price: Number(projPrice) || catObj?.basePrice || 1500,
      quality: projQuality.trim() || '4K 60fps HQ',
      aspect: projAspect.trim() || '16:9 Landscape 4K',
      duration: projDuration.trim() || '0:30',
      views: projViews.trim() || 'Featured Edit',
      videoUrl: projVideoUrl.trim(),
      thumbnail: projThumbnail || '/images/hero-cinematography.jpg',
      description:
        projDescription.trim() ||
        `Shot & edited by ${siteData.name} (${siteData.brandName}).`,
      tags: projTags,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
    } else {
      addProject(payload);
    }

    await handleManualSaveDetails(editingProjectId ? 'Project Changes' : 'New Video Project');
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
    window.scrollTo({ top: 140, behavior: 'smooth' });
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
  const [newCustCategory] = useState('Shoot & Edit');
  const [newCustPopular, setNewCustPopular] = useState(false);

  const handleAddCustomization = async (e) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    addCustomization({
      name: newCustName.trim(),
      description: newCustDesc.trim() || 'Custom video shooting or editing add-on per video.',
      pricePerVideo: Number(newCustPrice) || 500,
      category: newCustCategory || 'Shoot & Edit',
      popular: newCustPopular,
      active: true,
    });
    setNewCustName('');
    setNewCustDesc('');
    setNewCustPrice(500);
    setNewCustPopular(false);
    await handleManualSaveDetails('New Customization');
  };

  // --- TAB 4: CATEGORY & BASE INR PRICING STATE ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState(2000);
  const [newCatAspect, setNewCatAspect] = useState('16:9 Landscape 4K');
  const [newCatDays] = useState(3);
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const key = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    saveCategory(key, {
      id: key,
      name: newCatName.trim(),
      basePrice: Number(newCatPrice) || 2000,
      aspectRatio: newCatAspect.trim() || '16:9 Landscape',
      deliveryDays: Number(newCatDays) || 3,
      badge: 'Shoot + Edit',
      description:
        newCatDesc.trim() ||
        `Professional ${newCatName.trim()} shooting & editing by ${siteData.name}.`,
      suggestions: ['Complete Shoot + Edit', 'Cinema Color Grading & SFX'],
    });
    setNewCatName('');
    setNewCatDesc('');
    await handleManualSaveDetails(`Category "${newCatName}"`);
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
      await handleManualSaveDetails('Hero Showreel Video');
    } catch (err) {
      showToast(`Error uploading showreel: ${err.message}`);
    }
  };

  const navTabs = [
    {
      id: 'inquiries',
      label: 'Client Messages',
      sub: 'Hire Me & Quotes',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : inquiries.length,
    },
    {
      id: 'projects',
      label: 'Upload HQ Videos',
      sub: `${(siteData.portfolio || []).length} Portfolio Videos`,
      icon: Film,
    },
    {
      id: 'quotation',
      label: 'Quotation & ₹ Rates',
      sub: `${(quotationConfig.customizations || []).length} Per-Video Items`,
      icon: Calculator,
    },
    {
      id: 'categories',
      label: 'Categories (₹)',
      sub: `${categoryKeys.length} Active Formats`,
      icon: Layers,
    },
    {
      id: 'settings',
      label: 'Profile & SEO',
      sub: 'Contact & Branding',
      icon: Settings,
    },
  ];

  return (
    <section className="pt-24 pb-24 min-h-screen bg-cine-950 relative">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-display font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Compact Dashboard Header Bar with Global SAVE DETAILS Button */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                /naveen ADMIN PANEL
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Firebase ({firebaseStatus === 'connected' ? 'naveen-a3142 Live' : 'Synced'}) &bull; Saved: {lastSavedTime}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              NAVEEN PRO EDITOR &mdash; Studio Control Center
            </h1>
          </div>

          {/* Global Actions + Prominent SAVE DETAILS Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/quotation')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition-all"
            >
              ₹ Quotation Page
            </button>

            <button
              type="button"
              onClick={() => handleManualSaveDetails('All Website Details')}
              disabled={isSaving}
              className="pro-btn-primary px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white keep-white flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save All Details'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout: Compact Cards on Left (3 cols) + Active Workspace on Right (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Compact Small Cards on Left */}
          <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-20">
            <div className="text-[11px] font-mono uppercase tracking-wider text-violet-400 px-1">
              Manage Sections
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? 'pro-btn-primary border-transparent text-white keep-white shadow-lg'
                        : 'glass-card border-white/10 text-zinc-300 hover:border-violet-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-black/25 text-white keep-white'
                            : 'bg-violet-500/15 text-violet-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-xs sm:text-sm truncate">
                          {tab.label}
                        </div>
                        <div className="text-[10px] opacity-75 truncate">{tab.sub}</div>
                      </div>
                    </div>

                    {tab.badge !== undefined && tab.badge !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-black/30 text-white keep-white'
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

            {/* Compact Quick Save Card on Left */}
            <div className="glass-card rounded-xl p-3.5 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">Firebase Cloud Sync</span>
                <span className="text-[10px] font-mono text-zinc-400">{lastSavedTime}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Click below anytime to save your latest pricing, videos, and settings to Firebase.
              </p>
              <button
                type="button"
                onClick={() => handleManualSaveDetails('All Details')}
                className="w-full py-2.5 px-3 rounded-xl font-display font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Details Now</span>
              </button>
            </div>
          </div>

          {/* RIGHT WORKSPACE (9 cols) */}
          <div className="lg:col-span-9">
            {/* =====================================================================
                TAB 1: HIRE ME FORMS & CLIENT DIRECT MESSAGES
            ===================================================================== */}
            {activeTab === 'inquiries' && (
              <div className="space-y-5">
                <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: `All (${inquiries.length})` },
                      {
                        id: 'hire_form',
                        label: `Hire Bookings (${inquiries.filter((i) => i.type === 'hire_form').length})`,
                      },
                      {
                        id: 'custom_unsatisfied',
                        label: `Direct Messages (${
                          inquiries.filter((i) => i.type === 'custom_unsatisfied').length
                        })`,
                      },
                      {
                        id: 'quotation',
                        label: `Quotations (${inquiries.filter((i) => i.type === 'quotation').length})`,
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setInquiryFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          inquiryFilter === f.id
                            ? 'pro-btn-primary text-white keep-white'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-52">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search client, phone..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400"
                      />
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          markAllInquiriesRead();
                          handleManualSaveDetails('Read Status');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-200 shrink-0"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="glass-card rounded-2xl p-10 text-center border border-white/10">
                    <Inbox className="w-9 h-9 text-zinc-500 mx-auto mb-2" />
                    <h3 className="font-display font-bold text-base text-white">
                      No Client Inquiries Found
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      When clients submit the Hire Me form, send a direct message, or save a Quotation, their details appear here.
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
                          className={`glass-card rounded-2xl p-5 border transition-all ${
                            inq.unread ? 'border-violet-500/60' : 'border-white/10'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                                  isCustomMsg
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : isQuote
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                    : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                                }`}
                              >
                                {inq.typeLabel || 'Hire Request'}
                              </span>

                              {inq.serviceScope && (
                                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {inq.serviceScope}
                                </span>
                              )}

                              {inq.unread && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                                  NEW
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <select
                                value={inq.status || 'new'}
                                onChange={(e) =>
                                  updateInquiryStatus(inq.id, e.target.value, false)
                                }
                                className="bg-cine-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-400"
                              >
                                <option value="new">Status: New</option>
                                <option value="contacted">Status: Contacted</option>
                                <option value="in_progress">Status: In Progress</option>
                                <option value="completed">Status: Completed</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleManualSaveDetails('Inquiry Status')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/20 hover:bg-violet-500 text-violet-300 hover:text-white border border-violet-500/30 flex items-center gap-1 transition-all"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Hi ${inq.clientName}! This is ${siteData.name} (${siteData.brandName}). I received your ${inq.categoryName} inquiry on my website!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
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

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3.5 text-xs">
                            <div className="space-y-1">
                              <div className="font-display font-bold text-sm text-white">
                                {inq.clientName}
                                {inq.brandName && (
                                  <span className="text-violet-400 font-normal text-xs ml-1.5">
                                    ({inq.brandName})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{inq.clientPhone || 'N/A'}</span>
                              </div>
                              {inq.clientEmail && (
                                <div className="flex items-center gap-1.5 text-zinc-300">
                                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>{inq.clientEmail}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="font-semibold text-white">
                                Category: <span className="text-violet-400">{inq.categoryName}</span>
                              </div>
                              {inq.selectedVideoTitle && (
                                <div className="text-zinc-300 truncate">
                                  Style: <span className="text-sky-400">{inq.selectedVideoTitle}</span>
                                </div>
                              )}
                              {inq.referenceLink && (
                                <a
                                  href={inq.referenceLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Reference Link</span>
                                </a>
                              )}
                            </div>

                            <div className="md:text-right">
                              <div className="font-display font-black text-xl text-emerald-400">
                                {formatINR(inq.estimatedTotalINR)}
                              </div>
                              <div className="text-zinc-400 font-mono text-[11px]">
                                {inq.videoCount} {inq.videoCount === 1 ? 'Video' : 'Videos'}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-zinc-200">
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
              <div className="space-y-8">
                <form
                  onSubmit={handleSaveProject}
                  className="glass-card rounded-2xl p-5 sm:p-6 border border-violet-500/30 space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <div>
                      <h2 className="font-display font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-violet-400" />
                        <span>
                          {editingProjectId
                            ? 'Edit Video Project Details'
                            : 'Upload New High-Quality Video (Shoot / Edit)'}
                        </span>
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Upload your 4K/1080p MP4 edit or paste a video link, then click &ldquo;Save Project Details&rdquo;.
                      </p>
                    </div>

                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={resetProjectForm}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-zinc-300"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Compact Video Upload Box (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-violet-500/40 bg-violet-500/5 hover:bg-violet-500/10 cursor-pointer transition-all text-center">
                        <Upload className="w-7 h-7 text-violet-400 mb-1.5" />
                        <span className="font-display font-bold text-xs sm:text-sm text-white">
                          Select High-Quality Video File
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                          MP4, WebM, MOV &bull; Direct Inline Playback
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
                          <div className="flex justify-between text-xs font-mono text-violet-400">
                            <span>Uploading video...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {uploadedFileMeta && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 truncate">
                          ✓ {uploadedFileMeta.name} ({uploadedFileMeta.size})
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                          Or Paste Direct Video URL:
                        </label>
                        <input
                          type="text"
                          value={projVideoUrl}
                          onChange={(e) => {
                            setProjVideoUrl(e.target.value);
                            setProjPreviewUrl(e.target.value);
                          }}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-400"
                        />
                      </div>

                      {projPreviewUrl && (
                        <div className="cinema-dark rounded-xl overflow-hidden bg-black border border-white/15 p-2 space-y-2">
                          <video
                            ref={previewVideoRef}
                            src={projPreviewUrl}
                            poster={projThumbnail}
                            controls
                            playsInline
                            className="w-full aspect-video rounded-lg object-contain bg-black"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={captureCurrentVideoFrame}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-violet-500/20 text-violet-300 hover:bg-violet-500 hover:text-white flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Capture Frame</span>
                            </button>

                            <label className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-white/10 text-zinc-200 hover:bg-white/20 cursor-pointer">
                              <span>Custom Thumbnail</span>
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

                    {/* Right: Project Fields + Save Button (7 cols) */}
                    <div className="lg:col-span-7 space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Video Title *
                          </label>
                          <input
                            type="text"
                            value={projTitle}
                            onChange={(e) => setProjTitle(e.target.value)}
                            placeholder="e.g. SUPERCAR SHOOT & EDIT"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400"
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
                            placeholder="e.g. Velocity Motors"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Category
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
                            className="w-full bg-cine-800 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400"
                          >
                            {Object.entries(categoriesObj).map(([key, cat]) => (
                              <option key={key} value={key}>
                                {cat.name} ({formatINR(cat.basePrice)}/vid)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-emerald-400 mb-1">
                            Price in ₹ (INR)
                          </label>
                          <input
                            type="number"
                            value={projPrice}
                            onChange={(e) => setProjPrice(e.target.value)}
                            className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Quality Badge
                          </label>
                          <input
                            type="text"
                            value={projQuality}
                            onChange={(e) => setProjQuality(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">
                              Views
                            </label>
                            <input
                              type="text"
                              value={projViews}
                              onChange={(e) => setProjViews(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={projDescription}
                          onChange={(e) => setProjDescription(e.target.value)}
                          placeholder="Describe camera shoot & editing techniques..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="pro-btn-primary px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white keep-white flex items-center gap-2 hover:scale-[1.02] transition-all"
                        >
                          <Save className="w-4 h-4" />
                          <span>
                            {editingProjectId
                              ? 'Save Project Details'
                              : 'Save & Publish Video Project'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Published Videos Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg text-white">
                      Published Portfolio Videos ({(siteData.portfolio || []).length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('Portfolio Videos')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Portfolio Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(siteData.portfolio || []).map((project) => (
                      <div key={project.id} className="relative group">
                        <InlineVideoCard
                          project={project}
                          onOpenTheater={(vid) => onPlayVideo && onPlayVideo(vid)}
                          onSelectForHire={() => startEditProject(project)}
                          actionLabel="Edit Details"
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
              <div className="space-y-6">
                {/* Quotation Heading & Terms Card with Explicit SAVE DETAILS Button */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h2 className="font-display font-extrabold text-lg text-white">
                        1. Quotation Heading &amp; PDF Settings
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Edit the Quotation title, validity, and terms shown on `/quotation` and in downloaded PDFs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('Quotation Heading & PDF Settings')}
                      className="pro-btn-primary px-4 py-2 rounded-xl font-display font-bold text-xs uppercase text-white keep-white flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Quotation Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Quotation Name / Title
                      </label>
                      <input
                        type="text"
                        value={quotationConfig.quotationName || ''}
                        onChange={(e) =>
                          updateQuotationConfig({ quotationName: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-violet-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Validity (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={quotationConfig.validityDays || 14}
                        onChange={(e) =>
                          updateQuotationConfig({
                            validityDays: Number(e.target.value) || 14,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-violet-400"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Quotation Subtitle
                      </label>
                      <input
                        type="text"
                        value={quotationConfig.quotationSubtitle || ''}
                        onChange={(e) =>
                          updateQuotationConfig({ quotationSubtitle: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-400"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        PDF Terms &amp; Notes
                      </label>
                      <textarea
                        rows={2}
                        value={quotationConfig.termsAndNotes || ''}
                        onChange={(e) =>
                          updateQuotationConfig({ termsAndNotes: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('Quotation Settings')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Details</span>
                    </button>
                  </div>
                </div>

                {/* Per-Video Customizations Manager with Explicit SAVE Buttons */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-violet-500/30 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h2 className="font-display font-extrabold text-lg text-white">
                        2. Per-Video Shoot &amp; Edit Customizations (₹ INR)
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Edit the customization name or price per video in ₹, then click &ldquo;Save Details&rdquo;.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('All Customization Prices')}
                      className="pro-btn-primary px-4 py-2 rounded-xl font-display font-bold text-xs uppercase text-white keep-white flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save All Customizations</span>
                    </button>
                  </div>

                  {/* Add New Customization Form */}
                  <form
                    onSubmit={handleAddCustomization}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-mono uppercase text-violet-400 mb-1">
                        New Customization Name *
                      </label>
                      <input
                        type="text"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="e.g. Drone Shoot / 3D Intro"
                        className="w-full bg-cine-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={newCustDesc}
                        onChange={(e) => setNewCustDesc(e.target.value)}
                        placeholder="Details about this shoot/edit feature"
                        className="w-full bg-cine-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono uppercase text-emerald-400 mb-1">
                        Price / Video (₹) *
                      </label>
                      <input
                        type="number"
                        value={newCustPrice}
                        onChange={(e) => setNewCustPrice(e.target.value)}
                        className="w-full bg-cine-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add &amp; Save</span>
                      </button>
                    </div>
                  </form>

                  {/* Editable List of Customizations */}
                  <div className="space-y-2.5">
                    {(quotationConfig.customizations || []).map((cust) => (
                      <div
                        key={cust.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center"
                      >
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={cust.name}
                            onChange={(e) =>
                              updateCustomization(cust.id, { name: e.target.value })
                            }
                            className="w-full bg-cine-900/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                          />
                        </div>

                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={cust.description}
                            onChange={(e) =>
                              updateCustomization(cust.id, { description: e.target.value })
                            }
                            className="w-full bg-cine-900/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs font-mono font-bold text-emerald-400">
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
                              className="w-full bg-cine-900/90 border border-emerald-500/30 rounded-lg pl-6 pr-2 py-1.5 text-xs font-mono font-bold text-emerald-400"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleManualSaveDetails(`"${cust.name}"`)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 flex items-center gap-1 transition-all"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteCustomization(cust.id);
                              showToast(`Removed "${cust.name}"`);
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
              <div className="space-y-6">
                <form
                  onSubmit={handleAddCategory}
                  className="glass-card rounded-2xl p-5 border border-violet-500/30 space-y-3"
                >
                  <h2 className="font-display font-bold text-base sm:text-lg text-white">
                    Add New Video Category (₹ INR)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-300 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Pre-Wedding Shoot & Edit"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-400 mb-1">
                        Base Price / Video (₹) *
                      </label>
                      <input
                        type="number"
                        value={newCatPrice}
                        onChange={(e) => setNewCatPrice(e.target.value)}
                        className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-300 mb-1">
                        Aspect Ratio
                      </label>
                      <input
                        type="text"
                        value={newCatAspect}
                        onChange={(e) => setNewCatAspect(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="pro-btn-primary w-full py-2 px-4 rounded-xl font-bold text-xs uppercase text-white keep-white flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add &amp; Save</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Existing Categories List with Explicit SAVE DETAILS Button on Each Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categoriesObj).map(([catKey, cat]) => (
                    <div
                      key={catKey}
                      className="glass-card rounded-2xl p-5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="font-mono text-xs text-violet-400 font-bold uppercase">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleManualSaveDetails(`Category "${cat.name}"`)
                            }
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteCategory(catKey);
                              showToast(`Deleted category ${cat.name}`);
                            }}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-0.5">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) =>
                              saveCategory(catKey, { ...cat, name: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-emerald-400 mb-0.5">
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
                            className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-zinc-400 mb-0.5">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={cat.description || ''}
                            onChange={(e) =>
                              saveCategory(catKey, {
                                ...cat,
                                description: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-zinc-200"
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
              <div className="space-y-6">
                {/* Profile & Contact Card with Explicit SAVE DETAILS Button */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white">
                        1. Editor Identity, Contact Info &amp; Hero Showreel
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Update your phone, WhatsApp, email, headlines, and showreel video, then click &ldquo;Save Profile Details&rdquo;.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('Profile & Contact Details')}
                      className="pro-btn-primary px-4 py-2 rounded-xl font-display font-bold text-xs uppercase text-white keep-white flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Creator Name
                      </label>
                      <input
                        type="text"
                        value={siteData.name || ''}
                        onChange={(e) => updateProfile({ name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Studio Brand Name
                      </label>
                      <input
                        type="text"
                        value={siteData.brandName || ''}
                        onChange={(e) => updateProfile({ brandName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-violet-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={siteData.email || ''}
                        onChange={(e) => updateProfile({ email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-emerald-400 mb-1">
                        WhatsApp Number (With Country Code)
                      </label>
                      <input
                        type="text"
                        value={siteData.whatsappNumber || ''}
                        onChange={(e) =>
                          updateProfile({ whatsappNumber: e.target.value })
                        }
                        className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Display Phone Text
                      </label>
                      <input
                        type="text"
                        value={siteData.whatsappDisplay || ''}
                        onChange={(e) =>
                          updateProfile({ whatsappDisplay: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={siteData.location || ''}
                        onChange={(e) => updateProfile({ location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Hero Headline Line 1
                      </label>
                      <input
                        type="text"
                        value={siteData.heroTitleLine1 || ''}
                        onChange={(e) =>
                          updateProfile({ heroTitleLine1: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        Hero Headline Highlight
                      </label>
                      <input
                        type="text"
                        value={siteData.heroTitleHighlight || ''}
                        onChange={(e) =>
                          updateProfile({ heroTitleHighlight: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-violet-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-violet-400 mb-1">
                        Upload Showreel Video
                      </label>
                      <label className="w-full flex items-center justify-center gap-2 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/40 rounded-xl px-3 py-2 text-xs font-bold text-violet-300 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
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
                      <label className="block text-xs text-zinc-300 mb-1">
                        Hero Sub-Tagline
                      </label>
                      <textarea
                        rows={2}
                        value={siteData.subTagline || ''}
                        onChange={(e) => updateProfile({ subTagline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('Profile & Contact Details')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Details</span>
                    </button>
                  </div>
                </div>

                {/* SEO Manager Card with Explicit SAVE DETAILS Button */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-sky-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white">
                        2. Search Engine Optimization (SEO) Settings
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Manage Google search description &amp; keywords for NAVEEN PRO EDITOR.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualSaveDetails('SEO Settings')}
                      className="pro-btn-primary px-4 py-2 rounded-xl font-display font-bold text-xs uppercase text-white keep-white flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save SEO Details</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={siteData.seo?.metaDescription || ''}
                        onChange={(e) =>
                          updateSEO({ metaDescription: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data to Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
