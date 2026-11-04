import { useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export default function SEOHead({ activeRoute = '/' }) {
  const { siteData, theme } = useSiteData();

  useEffect(() => {
    const seo = siteData.seo || {};
    // Keep the browser tab title after the N favicon strictly "NAVEEN PRO EDITOR" as requested
    const tabTitle = 'NAVEEN PRO EDITOR';

    let pageDesc =
      seo.metaDescription ||
      siteData.subTagline ||
      'Hire Naveen (NAVEEN PRO EDITOR) — All-in-One 4K Video Shooter & Video Editor for Reels, YouTube, Commercials, Weddings, and DaVinci Resolve Color Grading.';

    if (activeRoute === '/hire') {
      pageDesc = `Select your category, watch ${siteData.name}'s 4K shot & edited sample videos directly, and book Video Shooting + Video Editing.`;
    } else if (activeRoute === '/quotation') {
      pageDesc = `Customize your per-video Video Shooting & Video Editing features, select video quantity, see instant pricing in Indian Rupees (₹), and download a mobile-responsive PDF quotation.`;
    }

    document.title = tabTitle;

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el && value) {
        el.setAttribute(attr, value);
      }
    };

    setMeta('meta[name="title"]', 'content', tabTitle);
    setMeta('meta[name="description"]', 'content', pageDesc);
    if (seo.keywords) {
      setMeta('meta[name="keywords"]', 'content', seo.keywords);
    }
    setMeta('meta[property="og:title"]', 'content', tabTitle);
    setMeta('meta[property="og:description"]', 'content', pageDesc);
    setMeta('meta[name="twitter:title"]', 'content', tabTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDesc);
    setMeta('meta[name="theme-color"]', 'content', theme === 'dark' ? '#070709' : '#f8fafc');

    // Update JSON-LD structured data dynamically with live INR categories & portfolio
    const ldEl = document.getElementById('naveen-schema-ld');
    if (ldEl) {
      const categoriesList = Object.values(siteData.categories || {});
      const minPrice =
        categoriesList.length > 0
          ? Math.min(...categoriesList.map((c) => Number(c.basePrice) || 1200))
          : 1200;
      const maxPrice =
        categoriesList.length > 0
          ? Math.max(...categoriesList.map((c) => Number(c.basePrice) || 10000)) * 5
          : 50000;

      const schemaData = {
        '@context': 'https://schema.org',
        '@type': ['ProfessionalService', 'Person'],
        name: 'NAVEEN PRO EDITOR',
        alternateName: ['Naveen Video Shooter & Editor', 'Naveen Editor'],
        description: pageDesc,
        email: siteData.email,
        telephone: siteData.whatsappDisplay,
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteData.location || 'India',
          addressCountry: 'IN',
        },
        priceRange: `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`,
        currenciesAccepted: 'INR',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Video Shooting & Video Editing Services (INR)',
          itemListElement: categoriesList.map((cat) => ({
            '@type': 'Offer',
            name: cat.name,
            description: cat.description,
            price: String(cat.basePrice || 1200),
            priceCurrency: 'INR',
          })),
        },
      };

      ldEl.textContent = JSON.stringify(schemaData);
    }
  }, [siteData, activeRoute, theme]);

  return null;
}
