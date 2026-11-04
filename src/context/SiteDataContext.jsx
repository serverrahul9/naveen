import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { creatorConfig as defaultCreatorConfig } from '../config/creatorConfig';
import {
  saveSiteDataToFirebase,
  saveInquiriesToFirebase,
  subscribeToFirebaseSiteData,
  subscribeToFirebaseInquiries,
  ensureFirebaseSeeded,
} from '../config/firebase';

const SITE_DATA_KEY = 'naveen_pro_editor_site_data_v3';
const INQUIRIES_KEY = 'naveen_pro_editor_inquiries_v3';
const THEME_KEY = 'naveen_editor_theme_v2';

const SiteDataContext = createContext(null);

function mergeWithDefaults(parsed) {
  if (!parsed || typeof parsed !== 'object') return defaultCreatorConfig;
  return {
    ...defaultCreatorConfig,
    ...parsed,
    brandName: parsed.brandName || 'NAVEEN PRO EDITOR',
    seo: {
      ...defaultCreatorConfig.seo,
      ...(parsed.seo || {}),
    },
    socials: {
      ...defaultCreatorConfig.socials,
      ...(parsed.socials || {}),
    },
    quotationConfig: {
      ...defaultCreatorConfig.quotationConfig,
      ...(parsed.quotationConfig || {}),
      customizations:
        parsed.quotationConfig?.customizations?.length > 0
          ? parsed.quotationConfig.customizations
          : defaultCreatorConfig.quotationConfig.customizations,
    },
    categories:
      parsed.categories && Object.keys(parsed.categories).length > 0
        ? parsed.categories
        : defaultCreatorConfig.categories,
    portfolio:
      Array.isArray(parsed.portfolio) && parsed.portfolio.length > 0
        ? parsed.portfolio
        : defaultCreatorConfig.portfolio,
  };
}

function loadInitialSiteData() {
  try {
    const raw = localStorage.getItem(SITE_DATA_KEY);
    if (!raw) return defaultCreatorConfig;
    return mergeWithDefaults(JSON.parse(raw));
  } catch (err) {
    console.warn('Error loading site data from localStorage:', err);
    return defaultCreatorConfig;
  }
}

function loadInitialInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) return defaultCreatorConfig.initialInquiries || [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCreatorConfig.initialInquiries || [];
  } catch {
    return defaultCreatorConfig.initialInquiries || [];
  }
}

function loadInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return 'dark';
}

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(loadInitialSiteData);
  const [inquiries, setInquiries] = useState(loadInitialInquiries);
  const [theme, setTheme] = useState(loadInitialTheme);
  const [firebaseStatus, setFirebaseStatus] = useState('connecting'); // 'connecting' | 'connected' | 'local_fallback'

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Connect & Subscribe to Firebase Realtime Database
  useEffect(() => {
    ensureFirebaseSeeded(defaultCreatorConfig, defaultCreatorConfig.initialInquiries || []);

    const unsubSite = subscribeToFirebaseSiteData(
      (remoteData) => {
        const merged = mergeWithDefaults(remoteData);
        setSiteData(merged);
        try {
          localStorage.setItem(SITE_DATA_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
      },
      (status) => setFirebaseStatus(status)
    );

    const unsubInq = subscribeToFirebaseInquiries((remoteInquiries) => {
      setInquiries(remoteInquiries);
      try {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(remoteInquiries));
      } catch {
        // ignore
      }
    });

    return () => {
      if (typeof unsubSite === 'function') unsubSite();
      if (typeof unsubInq === 'function') unsubInq();
    };
  }, []);

  // Helper to update siteData locally + persist to localStorage + save to Firebase
  const applySiteDataUpdate = useCallback((updaterFn) => {
    setSiteData((prev) => {
      const next = typeof updaterFn === 'function' ? updaterFn(prev) : updaterFn;
      try {
        localStorage.setItem(SITE_DATA_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      saveSiteDataToFirebase(next);
      return next;
    });
  }, []);

  // Helper to update inquiries locally + persist to localStorage + save to Firebase
  const applyInquiriesUpdate = useCallback((updaterFn) => {
    setInquiries((prev) => {
      const next = typeof updaterFn === 'function' ? updaterFn(prev) : updaterFn;
      try {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      saveInquiriesToFirebase(next);
      return next;
    });
  }, []);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === SITE_DATA_KEY && e.newValue) {
        try {
          setSiteData(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      } else if (e.key === INQUIRIES_KEY && e.newValue) {
        try {
          setInquiries(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      } else if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Profile & Branding updater
  const updateProfile = useCallback(
    (patch) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        ...patch,
        socials: patch.socials ? { ...prev.socials, ...patch.socials } : prev.socials,
      }));
    },
    [applySiteDataUpdate]
  );

  // SEO updater
  const updateSEO = useCallback(
    (seoPatch) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          ...seoPatch,
        },
      }));
    },
    [applySiteDataUpdate]
  );

  // Quotation settings updater
  const updateQuotationConfig = useCallback(
    (patch) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        quotationConfig: {
          ...prev.quotationConfig,
          ...patch,
        },
      }));
    },
    [applySiteDataUpdate]
  );

  // Add/Update/Delete Video Customization per video
  const addCustomization = useCallback(
    (newItem) => {
      const item = {
        id: `cust-${Date.now()}`,
        name: newItem.name || 'Custom Shoot / Edit Add-On',
        description: newItem.description || 'Custom video shooting or editing enhancement per video.',
        pricePerVideo: Number(newItem.pricePerVideo) || 500,
        category: newItem.category || 'Shoot & Edit',
        popular: Boolean(newItem.popular),
        active: newItem.active !== false,
      };
      applySiteDataUpdate((prev) => ({
        ...prev,
        quotationConfig: {
          ...prev.quotationConfig,
          customizations: [...(prev.quotationConfig.customizations || []), item],
        },
      }));
      return item;
    },
    [applySiteDataUpdate]
  );

  const updateCustomization = useCallback(
    (id, patch) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        quotationConfig: {
          ...prev.quotationConfig,
          customizations: (prev.quotationConfig.customizations || []).map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...patch,
                  pricePerVideo:
                    patch.pricePerVideo !== undefined
                      ? Number(patch.pricePerVideo) || 0
                      : c.pricePerVideo,
                }
              : c
          ),
        },
      }));
    },
    [applySiteDataUpdate]
  );

  const deleteCustomization = useCallback(
    (id) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        quotationConfig: {
          ...prev.quotationConfig,
          customizations: (prev.quotationConfig.customizations || []).filter((c) => c.id !== id),
        },
      }));
    },
    [applySiteDataUpdate]
  );

  // Category CRUD
  const saveCategory = useCallback(
    (catKey, categoryData) => {
      const cleanKey =
        catKey ||
        categoryData.id ||
        categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      applySiteDataUpdate((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [cleanKey]: {
            ...(prev.categories[cleanKey] || {}),
            ...categoryData,
            id: cleanKey,
            basePrice: Number(categoryData.basePrice) || 1000,
            deliveryDays: Number(categoryData.deliveryDays) || 2,
            suggestions: Array.isArray(categoryData.suggestions)
              ? categoryData.suggestions
              : prev.categories[cleanKey]?.suggestions || [],
          },
        },
      }));
    },
    [applySiteDataUpdate]
  );

  const deleteCategory = useCallback(
    (catKey) => {
      applySiteDataUpdate((prev) => {
        const nextCats = { ...prev.categories };
        if (Object.keys(nextCats).length <= 1) return prev;
        delete nextCats[catKey];
        return {
          ...prev,
          categories: nextCats,
        };
      });
    },
    [applySiteDataUpdate]
  );

  // Portfolio Video CRUD
  const addProject = useCallback(
    (project) => {
      const newProj = {
        id: project.id || `work-${Date.now()}`,
        title: project.title || 'Untitled Shoot & Edit',
        client: project.client || 'Brand Client',
        category: project.category || 'reels',
        categoryLabel: project.categoryLabel || 'Shoot + Edit',
        views: project.views || 'New Upload',
        aspect: project.aspect || '16:9 Landscape 4K',
        quality: project.quality || '4K 60fps HQ',
        price: Number(project.price) || 1500,
        duration: project.duration || '0:45',
        thumbnail: project.thumbnail || '/images/hero-cinematography.jpg',
        videoUrl: project.videoUrl || '',
        description:
          project.description || 'Shot & edited by Naveen (NAVEEN PRO EDITOR).',
        tags: Array.isArray(project.tags)
          ? project.tags
          : String(project.tags || 'Shoot & Edit,4K,Cinema')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
        featured: project.featured !== false,
        createdAt: new Date().toISOString(),
      };

      applySiteDataUpdate((prev) => ({
        ...prev,
        portfolio: [newProj, ...(prev.portfolio || [])],
      }));
      return newProj;
    },
    [applySiteDataUpdate]
  );

  const updateProject = useCallback(
    (id, patch) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        portfolio: (prev.portfolio || []).map((p) =>
          p.id === id
            ? {
                ...p,
                ...patch,
                price: patch.price !== undefined ? Number(patch.price) || 0 : p.price,
                tags:
                  patch.tags !== undefined
                    ? Array.isArray(patch.tags)
                      ? patch.tags
                      : String(patch.tags)
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                    : p.tags,
              }
            : p
        ),
      }));
    },
    [applySiteDataUpdate]
  );

  const deleteProject = useCallback(
    (id) => {
      applySiteDataUpdate((prev) => ({
        ...prev,
        portfolio: (prev.portfolio || []).filter((p) => p.id !== id),
      }));
    },
    [applySiteDataUpdate]
  );

  // Client Inquiries / Messages (Saved in Firebase Realtime Database)
  const addInquiry = useCallback(
    (inquiryData) => {
      const newInquiry = {
        id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: inquiryData.type || 'hire_form',
        typeLabel:
          inquiryData.typeLabel ||
          (inquiryData.type === 'custom_unsatisfied'
            ? 'Custom Style Message (Videos Not Matched)'
            : inquiryData.type === 'quotation'
            ? 'Custom Quotation Saved'
            : 'Hire Me Booking'),
        serviceScope: inquiryData.serviceScope || 'Both: Video Shooting + Editing',
        status: 'new',
        unread: true,
        createdAt: new Date().toISOString(),
        clientName: inquiryData.clientName || 'Anonymous Client',
        clientEmail: inquiryData.clientEmail || '',
        clientPhone: inquiryData.clientPhone || '',
        brandName: inquiryData.brandName || '',
        category: inquiryData.category || 'reels',
        categoryName: inquiryData.categoryName || 'Video Shoot & Edit',
        selectedVideoTitle: inquiryData.selectedVideoTitle || '',
        videoCount: Number(inquiryData.videoCount) || 1,
        pricePerVideoINR: Number(inquiryData.pricePerVideoINR) || 0,
        estimatedTotalINR: Number(inquiryData.estimatedTotalINR) || 0,
        selectedCustomizations: inquiryData.selectedCustomizations || [],
        rawFootageUrl: inquiryData.rawFootageUrl || '',
        referenceLink: inquiryData.referenceLink || '',
        quotationNumber: inquiryData.quotationNumber || '',
        message: inquiryData.message || '',
      };

      applyInquiriesUpdate((prev) => [newInquiry, ...prev]);
      return newInquiry;
    },
    [applyInquiriesUpdate]
  );

  const updateInquiryStatus = useCallback(
    (id, status, unread = false) => {
      applyInquiriesUpdate((prev) =>
        prev.map((inq) =>
          inq.id === id
            ? {
                ...inq,
                status: status || inq.status,
                unread: unread !== undefined ? unread : false,
              }
            : inq
        )
      );
    },
    [applyInquiriesUpdate]
  );

  const deleteInquiry = useCallback(
    (id) => {
      applyInquiriesUpdate((prev) => prev.filter((inq) => inq.id !== id));
    },
    [applyInquiriesUpdate]
  );

  const markAllInquiriesRead = useCallback(() => {
    applyInquiriesUpdate((prev) => prev.map((inq) => ({ ...inq, unread: false })));
  }, [applyInquiriesUpdate]);

  const resetToDefaults = useCallback(() => {
    applySiteDataUpdate(defaultCreatorConfig);
    applyInquiriesUpdate(defaultCreatorConfig.initialInquiries || []);
  }, [applySiteDataUpdate, applyInquiriesUpdate]);

  const unreadCount = inquiries.filter((i) => i.unread).length;

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        setSiteData: applySiteDataUpdate,
        inquiries,
        unreadCount,
        firebaseStatus,
        theme,
        setTheme,
        toggleTheme,
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
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        markAllInquiriesRead,
        resetToDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used inside a SiteDataProvider');
  }
  return ctx;
}
