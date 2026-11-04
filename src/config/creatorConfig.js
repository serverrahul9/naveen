// Default Creator Profile, INR Pricing, Portfolio, & Quotation Customizations for Naveen
// NAVEEN PRO EDITOR — All-in-One Professional Video Shooter & Elite Video Editor
// Everything here is saved in Firebase & dynamically editable from the /naveen dashboard route!

export const creatorConfig = {
  name: "Naveen",
  brandName: "NAVEEN PRO EDITOR",
  tagline: "Professional Video Shooter & Elite Video Editor (2-in-1 Studio)",
  subTagline:
    "Complete 4K/6K on-location video shooting (Sony FX6, Gimbal, FPV Drone & Cinema Lighting) combined with high-retention video editing, VFX, and DaVinci Resolve color grading — all by one creator.",
  heroTitleLine1: "4K VIDEO SHOOTER.",
  heroTitleHighlight: "PRO VIDEO EDITOR.",
  currency: "INR",
  currencySymbol: "₹",

  // Contact details (Manageable from /naveen & saved in Firebase)
  email: "naveen.edits@naveenstudio.in",
  whatsappNumber: "919876543210", // Without + for wa.me links
  whatsappDisplay: "+91 98765 43210",
  location: "India • Available for On-Location Video Shoots & Remote Video Editing Worldwide",

  // Showreel configuration
  showreelUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  showreelThumbnail: "/images/hero-cinematography.jpg",
  showreelTitle: "NAVEEN PRO EDITOR // 2026 Video Shooting & Editing Showreel (4K 60fps)",
  showreelDuration: "0:45",

  // SEO Configuration (Manageable from /naveen)
  seo: {
    siteTitle: "NAVEEN PRO EDITOR",
    metaDescription:
      "Hire Naveen (NAVEEN PRO EDITOR) — India's all-in-one 4K Video Shooter (Cinematographer) & Elite Video Editor for viral Instagram Reels, YouTube videos, weddings, commercials, and DaVinci Resolve color grading. Instant INR (₹) quotation & PDF.",
    keywords:
      "NAVEEN PRO EDITOR, Naveen Video Shooter, Naveen Video Editor, Video Shooter and Editor India, Cinematographer and Editor, Reels Shoot and Edit, YouTube Video Editor, Wedding Cinematographer, Commercial Video Shoot, DaVinci Resolve Colorist",
    ogImage: "/images/hero-cinematography.jpg",
    canonicalUrl: "https://naveen-a3142.web.app",
  },

  // Social Handles
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },

  // Key Creator Metrics
  stats: [
    { label: "Views Generated", value: "250M+", sub: "Shot & Edited by Naveen" },
    { label: "Shoots & Edits Delivered", value: "620+", sub: "Reels, YouTube, Ads & Weddings" },
    { label: "2-in-1 Advantage", value: "Shoot + Edit", sub: "Cinema Camera + Post-Production" },
    { label: "Express Turnaround", value: "24-48h", sub: "Direct WhatsApp & Frame.io" },
  ],

  // Quotation Page & Per-Video Customization Settings (Manageable by Naveen in /naveen & synced with Firebase)
  quotationConfig: {
    quotationName: "NAVEEN PRO EDITOR — SHOOT & EDIT QUOTATION",
    quotationSubtitle:
      "Select your base video category, add custom Video Shooting and/or Video Editing features per video, and choose the number of videos for an instant INR (₹) quote & mobile-responsive PDF.",
    validityDays: 14,
    termsAndNotes:
      "• Naveen handles both on-location 4K Video Shooting and complete Post-Production Editing.\n• 50% advance payment to confirm shoot/edit slot; remaining 50% upon final master approval.\n• Includes 2 rounds of free timestamped revisions per video.",
    enableBulkDiscount: true,
    bulkDiscounts: [
      { minVideos: 5, percent: 10, label: "5+ Videos (10% Bulk Discount)" },
      { minVideos: 10, percent: 15, label: "10+ Videos (15% Creator Retainer Discount)" },
      { minVideos: 20, percent: 20, label: "20+ Videos (20% Monthly Batch Discount)" },
    ],
    // Customizable per-video Shooting & Editing add-ons that Naveen can edit/add/remove in /naveen
    customizations: [
      {
        id: "cust-shoot-camera",
        name: "On-Location 4K Cinema Camera Shoot (Sony FX6 / A7S III)",
        description: "Naveen shoots your video on location with cinema prime lenses, gimbal stabilization & direction.",
        pricePerVideo: 2500,
        category: "Video Shooting",
        popular: true,
        active: true,
      },
      {
        id: "cust-shoot-drone",
        name: "FPV & Aerial Drone Cinematography Shoot",
        description: "Dynamic indoor FPV fly-throughs and 5.1K outdoor aerial drone shots captured by Naveen.",
        pricePerVideo: 1800,
        category: "Video Shooting",
        popular: false,
        active: true,
      },
      {
        id: "cust-shoot-lighting",
        name: "Pro Studio Lighting & Wireless Broadcast Audio Setup",
        description: "Aputure RGBWW cinema lighting modifiers + 32-bit float wireless lapel & boom audio capture.",
        pricePerVideo: 1200,
        category: "Video Shooting",
        popular: false,
        active: true,
      },
      {
        id: "cust-captions",
        name: "Dynamic Kinetic Captions & Subtitles",
        description: "Hormozi / Iman Gadzhi style animated word-by-word glowing captions with emojis & highlights.",
        pricePerVideo: 350,
        category: "Video Editing",
        popular: true,
        active: true,
      },
      {
        id: "cust-sfx",
        name: "Immersive Sound Design & Foley Mastering",
        description: "Multi-layered whooshes, risers, sub-bass drops, ambient soundscapes & crisp vocal EQ.",
        pricePerVideo: 400,
        category: "Audio Suite",
        popular: true,
        active: true,
      },
      {
        id: "cust-color",
        name: "DaVinci Resolve Cinema Color Grading",
        description: "10-bit Log to Rec.709 conversion, Kodak 2383 film look, skin tone isolation & halation glow.",
        pricePerVideo: 600,
        category: "Color Science",
        popular: true,
        active: true,
      },
      {
        id: "cust-mograph",
        name: "Advanced After Effects Motion Graphics & VFX",
        description: "Custom 3D camera tracking, animated charts, map animations, UI popups & speed ramps.",
        pricePerVideo: 900,
        category: "VFX & 3D",
        popular: false,
        active: true,
      },
      {
        id: "cust-broll",
        name: "Premium 4K Stock B-Roll & Visual Storytelling",
        description: "Curated licensed 4K cinema stock footage, archival clips & visual metaphors synced to script.",
        pricePerVideo: 450,
        category: "Storytelling",
        popular: false,
        active: true,
      },
      {
        id: "cust-thumbnail",
        name: "High-CTR Custom Thumbnail / Reel Cover Design",
        description: "Scroll-stopping YouTube thumbnail or Instagram Reel cover engineered for maximum clicks.",
        pricePerVideo: 300,
        category: "Branding",
        popular: true,
        active: true,
      },
      {
        id: "cust-rush",
        name: "24-Hour Priority Express Delivery",
        description: "Jump to the front of the editing queue with guaranteed first-cut delivery within 24 hours.",
        pricePerVideo: 800,
        category: "Speed",
        popular: false,
        active: true,
      },
    ],
  },

  // Project Categories (Shooting + Editing in Indian Rupees ₹)
  categories: {
    reels: {
      id: "reels",
      name: "Shorts, Reels & TikTok",
      icon: "Smartphone",
      badge: "Shoot + Viral Edit",
      aspectRatio: "9:16 Vertical & 16:9",
      description:
        "On-location Reel shooting or high-retention editing with kinetic typography, speed ramps, and viral sound design.",
      basePrice: 1200,
      deliveryDays: 2,
      suggestions: [
        "Complete Reel Shoot + Viral Speed-Ramp Edit",
        "Alex Hormozi / Iman Gadzhi Style Kinetic Captions",
        "Aesthetic Luxury B-Roll Montage (Beat sync + film glow)",
        "Gym & Fitness Shoot + Phonk Beat Match Edit",
        "Podcast Multi-Cam Shoot + Auto-Tracking Snippet Edit",
      ],
    },
    youtube: {
      id: "youtube",
      name: "YouTube & Long-Form",
      icon: "Youtube",
      badge: "High Watch-Time",
      aspectRatio: "16:9 Landscape 4K",
      description:
        "Multi-cam studio shooting and full episodic documentary editing, visual storytelling, custom motion graphics & retention optimization.",
      basePrice: 3500,
      deliveryDays: 4,
      suggestions: [
        "Vox / Documentary Explainer (3D maps + newspaper animations)",
        "Talking Head Shoot + B-Roll Overlays & Infographics",
        "High-Energy MrBeast Pacing (Fast-cut storytelling + SFX)",
        "Cinematic Travel & Lifestyle Shoot + Seamless Edit",
      ],
    },
    commercial: {
      id: "commercial",
      name: "Commercials & Brand Ads",
      icon: "Film",
      badge: "Cinema Shoot + Edit",
      aspectRatio: "16:9 Landscape / Multi",
      description:
        "Full commercial video shooting (Sony FX6, lighting, gimbal) and high-converting post-production for D2C brands, cars, and products.",
      basePrice: 6000,
      deliveryDays: 5,
      suggestions: [
        "Automotive / Supercar Night Shoot + Speed-Ramp Edit",
        "D2C Product Studio Shoot + Macro Commercial Edit",
        "App & SaaS UI 3D Motion Graphics Promo",
        "Fashion & Apparel Lifestyle Shoot + 35mm Film Grade",
      ],
    },
    music_films: {
      id: "music_films",
      name: "Music Videos & Cinematic",
      icon: "Music",
      badge: "DOP Shoot + VFX Edit",
      aspectRatio: "2.39:1 Anamorphic / 16:9",
      description:
        "Full music video direction & cinematography shooting combined with beat-synced cuts, VFX rotoscoping, and analog film emulation.",
      basePrice: 8500,
      deliveryDays: 6,
      suggestions: [
        "Hip-Hop / Rap Music Video Shoot + 3D VFX Edit",
        "Indie / Retro Cinematic Music Video (Film halation & neon)",
        "Cinematic Short Film Shoot + DaVinci Kodak 2383 Grade",
        "Live Concert / Event Shoot + High-Energy Aftermovie Edit",
      ],
    },
    corporate_events: {
      id: "corporate_events",
      name: "Weddings & Real Estate",
      icon: "Building2",
      badge: "Full Shoot + Film Edit",
      aspectRatio: "16:9 Landscape 4K",
      description:
        "Complete wedding cinematography & pre-wedding shoots, luxury real estate FPV drone tours, and emotional highlight film editing.",
      basePrice: 7000,
      deliveryDays: 5,
      suggestions: [
        "Luxury Real Estate FPV Drone Shoot & Architecture Edit",
        "Wedding & Pre-Wedding Cinema Shoot + Highlight Film Edit",
        "Corporate Summit Multi-Cam Shoot & Keynote Edit",
        "Luxury Resort & Hospitality Shoot + Sensory Edit",
      ],
    },
  },

  // Featured Works Portfolio (Shot & Edited by Naveen — Direct Playable High-Quality Videos)
  portfolio: [
    {
      id: "work-1",
      title: "APEX // Cyberpunk Supercar Shoot & Edit",
      client: "Velocity Motors India",
      category: "commercial",
      categoryLabel: "Commercial Shoot + Edit",
      views: "4.2M Views",
      aspect: "16:9 Landscape 4K",
      quality: "4K 60fps Shot & Edited",
      price: 6000,
      duration: "0:15",
      thumbnail: "/images/commercial-car.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description:
        "Shot on location by Naveen with Sony FX6 on gimbal rig and edited with speed-ramped transitions, engine SFX, and DaVinci Resolve Kodak 2383 color grading.",
      tags: ["Shot & Edited", "Commercial", "Sony FX6", "Color Grade", "4K Landscape"],
      featured: true,
    },
    {
      id: "work-2",
      title: "HIMALAYAN ODYSSEY // Documentary Shoot & Film",
      client: "Wanderlust Creators Collective",
      category: "youtube",
      categoryLabel: "YouTube Shoot + Edit",
      views: "2.8M Views",
      aspect: "16:9 Landscape 4K",
      quality: "4K HDR Master",
      price: 3500,
      duration: "0:30",
      thumbnail: "/images/hero-cinematography.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description:
        "Filmed on location with drone aerials and edited with widescreen documentary storytelling, custom map animations, and 64% audience retention.",
      tags: ["Documentary", "Drone Shoot", "YouTube Edit", "Storytelling", "16:9 Cinema"],
      featured: true,
    },
    {
      id: "work-3",
      title: "TUNNEL VISION // Streetwear Reel Shoot & Edit",
      client: "Urban Monkey Campaign",
      category: "reels",
      categoryLabel: "Shorts, Reels & TikTok",
      views: "12.4M Views",
      aspect: "9:16 / 16:9 Cut",
      quality: "1080p 60fps HQ",
      price: 1200,
      duration: "0:15",
      thumbnail: "/images/viral-reel.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      description:
        "Handheld gimbal shoot + viral retention hook edit with kinetic glowing typography, beat-matched whip pans, and sub-bass impact SFX.",
      tags: ["Reel Shoot", "Viral Edit", "Kinetic Captions", "Speed Ramp", "High ROI"],
      featured: true,
    },
    {
      id: "work-4",
      title: "DAVINCI SUITE // S-Log3 Shoot to Cinema Grade",
      client: "Naveen Pro Editor Color Lab",
      category: "commercial",
      categoryLabel: "Color Grading & Shoot",
      views: "1.1M Views",
      aspect: "16:9 Landscape 4K",
      quality: "4K 10-Bit ProRes",
      price: 6000,
      duration: "0:15",
      thumbnail: "/images/color-grading-suite.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
      description:
        "Shot in 10-bit S-Log3 and graded in DaVinci Resolve Studio with skin tone isolation, power windows, and organic 35mm film grain halation.",
      tags: ["Color Grading", "DaVinci Resolve", "10-Bit Shoot", "ACES", "Log Footage"],
      featured: false,
    },
    {
      id: "work-5",
      title: "MIDNIGHT PULSE // Hip-Hop Music Video Shoot & VFX",
      client: "Gully Groove Records",
      category: "music_films",
      categoryLabel: "Music Video Shoot + Edit",
      views: "3.6M Views",
      aspect: "2.39:1 Anamorphic",
      quality: "4K Cinema Scope",
      price: 8500,
      duration: "0:15",
      thumbnail: "/images/commercial-car.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      description:
        "Directed, shot with anamorphic lenses & RGB lighting, and edited with seamless match cuts, 3D VFX rotoscoping, and CRT glitch transitions.",
      tags: ["Music Video", "Camera DOP", "Anamorphic", "VFX Edit", "Beat Sync"],
      featured: true,
    },
    {
      id: "work-6",
      title: "UDAIPUR PALACE // Royal Wedding & Drone Film",
      client: "Luxe Weddings & Estates India",
      category: "corporate_events",
      categoryLabel: "Weddings & Real Estate",
      views: "980K Views",
      aspect: "16:9 Landscape 4K",
      quality: "4K 60fps UHD",
      price: 7000,
      duration: "0:15",
      thumbnail: "/images/hero-cinematography.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      description:
        "Shot with FPV indoor drone & gimbal and edited with emotional audio mixing, warm golden hour grading, and spatial ambient sound.",
      tags: ["Wedding Shoot", "Real Estate", "FPV Drone", "Cinematic Edit", "Golden Hour"],
      featured: false,
    },
  ],

  // Camera Shooting & Post-Production Hardware/Software Stack
  gear: [
    { name: "Sony FX6 & A7S III Cinema Line", category: "Primary Shoot Cameras", spec: "Full-Frame 4K 120fps 10-bit 4:2:2 S-Log3" },
    { name: "DJI Ronin RS3 Pro & Prime Lenses", category: "Stabilization & Glass", spec: "LiDAR Autofocus + 24mm/35mm/50mm/85mm Primes" },
    { name: "DJI Avata 2 FPV & Mavic 3 Pro", category: "Aerial Drone Shoot", spec: "5.1K Apple ProRes & Indoor FPV Fly-Throughs" },
    { name: "Aputure 600c Pro & Sennheiser Audio", category: "Lighting & Field Audio", spec: "RGBWW Studio Modifiers + 32-Bit Float Mics" },
    { name: "DaVinci Resolve Studio 19", category: "Color & Finishing", spec: "ACEScc Color Science & Speed Editor" },
    { name: "Adobe Premiere Pro & After Effects", category: "Editing & VFX Suite", spec: "3D Camera Tracker, Rotobrush 3 & MoGraph" },
    { name: "Apple Mac Studio M3 Ultra", category: "Editing Workstation", spec: "192GB Unified Memory • 8K ProRes RAW Realtime" },
    { name: "Frame.io Cloud Review Pipeline", category: "Client Collaboration", spec: "Frame-Accurate Timestamped Revisions" },
  ],

  // Client Testimonials
  testimonials: [
    {
      quote:
        "Having Naveen both shoot and edit our videos was a game-changer. Because he edits what he shoots, every camera movement and transition flows seamlessly. Our retention jumped from 31% to 62%!",
      author: "Aarav Mehta",
      role: "Tech & Finance Creator (1.8M Subscribers)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      metric: "+140% Watch Time",
    },
    {
      quote:
        "Naveen shot our product commercial on his Sony cinema rig and delivered the final color-graded Reels and ad edits in 48 hours. Generated ₹42 Lakhs in our launch week!",
      author: "Priya Sharma",
      role: "Founder, Aura Luxe Cosmetics",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      metric: "4.8x Ad ROAS",
    },
    {
      quote:
        "Whether we book Naveen for an on-location shoot + edit or send him raw footage remotely, his speed ramps, kinetic captions, and sound design are unmatched in India.",
      author: "Rohan Kapoor",
      role: "Agency Director, ScaleUp Media",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      metric: "22M+ Organic Views",
    },
  ],

  // FAQ
  faqs: [
    {
      q: "Does Naveen do both Video Shooting and Video Editing?",
      a: "Yes! Naveen is a complete 2-in-1 Video Shooter (Cinematographer with 4K camera rig, gimbal, drone, lighting & audio) AND Senior Video Editor. You can book him for Complete Shoot + Edit, Video Shooting Only, or Remote Video Editing Only.",
    },
    {
      q: "How does the Quotation Calculator & PDF download work?",
      a: "Visit the Quotation page, select your video category, pick your desired Shooting and/or Editing customizations per video, and choose how many videos you need. The price updates automatically in Indian Rupees (₹) and you can download a mobile-responsive PDF quote!",
    },
    {
      q: "What if I don't find my exact video style in the sample videos?",
      a: "On the Hire page, if the category sample videos don't match what you have in mind, use the 'Not Satisfied? Send Direct Message to Naveen' option to send your custom reference link and message directly to Naveen's dashboard!",
    },
    {
      q: "How do I send raw footage if I only need Video Editing?",
      a: "You can share your raw files via Google Drive, Frame.io, WeTransfer, or Dropbox link in the Hire form or on WhatsApp. If you book Naveen for Shooting + Editing, he brings his own cinema camera setup and handles footage ingest directly!",
    },
  ],

  // Initial Sample Client Inquiries / Messages (Visible in /naveen Dashboard & synced to Firebase)
  initialInquiries: [
    {
      id: "inq-sample-1",
      type: "hire_form",
      typeLabel: "Shoot + Edit Booking",
      serviceScope: "Both: Video Shooting + Editing",
      status: "new",
      unread: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      clientName: "Vikramaditya Singh",
      clientEmail: "vikram@finverseindia.in",
      clientPhone: "+91 98201 55432",
      brandName: "FinVerse YouTube Channel",
      category: "youtube",
      categoryName: "YouTube & Long-Form",
      selectedVideoTitle: "HIMALAYAN ODYSSEY // Documentary Shoot & Film",
      videoCount: 4,
      estimatedTotalINR: 24000,
      selectedCustomizations: [
        "On-Location 4K Cinema Camera Shoot (Sony FX6 / A7S III)",
        "Dynamic Kinetic Captions & Subtitles",
      ],
      rawFootageUrl: "",
      message:
        "Hi Naveen! We want to hire you for both shooting and editing 4 YouTube episodes at our studio this month.",
    },
    {
      id: "inq-sample-2",
      type: "custom_unsatisfied",
      typeLabel: "Custom Style Message (Sample Not Matched)",
      serviceScope: "Both: Video Shooting + Editing",
      status: "new",
      unread: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      clientName: "Sneha Nair",
      clientEmail: "sneha@glowskin.co.in",
      clientPhone: "+91 97400 11223",
      brandName: "GlowSkin D2C",
      category: "reels",
      categoryName: "Shorts, Reels & TikTok",
      selectedVideoTitle: "Custom Style Requested",
      videoCount: 10,
      estimatedTotalINR: 22000,
      referenceLink: "https://instagram.com/reel/sample-reference",
      message:
        "Hey Naveen, I checked the Reels category videos — we need a minimalist aesthetic skincare product shoot + UGC reel edit with soft pastel typography. Can we book a 10-reel shoot & edit package?",
    },
  ],
};
