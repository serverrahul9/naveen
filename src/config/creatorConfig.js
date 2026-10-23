// Creator Profile & Business Configuration
// Change this anytime to update your client's contact info, pricing, and branding!

export const creatorConfig = {
  name: "Marcus Vance",
  brandName: "VANCE CINEMATICS",
  tagline: "Director of Photography & Elite Video Editor",
  subTagline: "Crafting viral retention edits, cinematic commercial films, and world-class color grading that turn viewers into lifelong clients.",
  
  // Contact details
  email: "marcus.vance@vancecineworks.com",
  whatsappNumber: "+15553829481", // Format without symbols for WhatsApp API link: 15553829481
  whatsappDisplay: "+1 (555) 382-9481",
  location: "Los Angeles, CA • Available Worldwide (On-Set & Remote)",
  
  // Social Handles
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },

  // Key Creator Metrics
  stats: [
    { label: "Views Generated", value: "780M+", sub: "across YouTube & TikTok" },
    { label: "Projects Delivered", value: "450+", sub: "Commercials, Reels & Films" },
    { label: "Avg Retention Lift", value: "+54%", sub: "Audience watch time boost" },
    { label: "Delivery Speed", value: "24-48h", sub: "Rush options available" },
  ],

  // Production & Shooting Gear
  gear: [
    { name: "Sony FX6 Cinema Line", category: "Primary Camera", spec: "Full-frame 4K 120fps, 10-bit 4:2:2 DCI" },
    { name: "Sony A7S III", category: "B-Cam & Low Light", spec: "4K 120fps 15+ stops dynamic range" },
    { name: "DZOFilm Vespid Prime Lenses", category: "Cinema Glass", spec: "25mm, 35mm, 50mm, 75mm T2.1" },
    { name: "DJI Ronin RS3 Pro", category: "Stabilization", spec: "LiDAR autofocus tracking system" },
    { name: "DJI Avata 2 & Mavic 3 Pro", category: "Aerial FPV Drone", spec: "Cinematic fly-throughs & 5.1K aerials" },
    { name: "Aputure 300d II & 600c Pro", category: "Studio Lighting", spec: "Full RGBWW modifiers & lantern diffusers" },
    { name: "Sennheiser MKH 416 & Rode Pro", category: "Audio Suite", spec: "Broadcast directional shotgun + 32-bit float" },
    { name: "DaVinci Resolve Studio 19", category: "Color Suite", spec: "Calibrated Flanders OLED & Speed Editor" },
  ],

  // Project Categories & Smart Suggestions
  categories: {
    reels: {
      id: "reels",
      name: "Shorts, Reels & TikTok",
      icon: "Smartphone",
      badge: "Highest Viral ROI",
      aspectRatio: "9:16 Vertical",
      description: "Aggressive retention pacing, kinetic typography, viral sound design, and hooks engineered to explode on Instagram, TikTok, and YouTube Shorts.",
      basePrice: 95,
      deliveryDays: 2,
      suggestions: [
        "Alex Hormozi Style Kinetic Captions (Glowing text + sound emojis)",
        "Aesthetic Luxury B-Roll Montage (Beat sync + speed ramps + film glow)",
        "High-CTR Problem/Solution Hook (Split screen + zoom pops)",
        "Gym & Fitness Motivational Reel (Phonk beat match + camera shake)",
        "Podcast Snippet with Multi-Cam Auto-Tracking & Soundwaves",
        "Streetwear & Product Hype Reel (Fast whip pans & glitch cuts)"
      ]
    },
    youtube: {
      id: "youtube",
      name: "YouTube & Long-Form",
      icon: "Youtube",
      badge: "High Watch-Time",
      aspectRatio: "16:9 Cinematic",
      description: "Full episodic editing, deep research documentary pacing, visual storytelling, custom motion graphics, sound design, and retention graph optimization.",
      basePrice: 380,
      deliveryDays: 4,
      suggestions: [
        "Vox / Magnates-Style Documentary (3D map animations + newspaper popups)",
        "Talking Head + B-Roll Overlays (Punchy zooms + dynamic infographics)",
        "High-Energy MrBeast Pacing (Fast-cut storytelling + SFX every 3s)",
        "Minimalist Cinematic Vlog (Sam Kolder travel transitions & soundscapes)",
        "Tech & Gadget Review (Crisp macro b-roll + animated spec comparison)",
        "Finance & Case Study Breakdown (Custom chart animations + sound design)"
      ]
    },
    commercial: {
      id: "commercial",
      name: "Commercials & Brand Ads",
      icon: "Film",
      badge: "High Conversion",
      aspectRatio: "16:9 / 4:5 / 9:16",
      description: "High-ticket brand commercials, product launches, TVCs, and paid social performance ads that drive customer action and boost ROAS.",
      basePrice: 750,
      deliveryDays: 5,
      suggestions: [
        "Supercar / Automotive Motion Commercial (Wet streets + anamorphic flares)",
        "D2C High-Converting Physical Product Ad (Macro studio lighting)",
        "App & SaaS UI 3D Motion Graphics Showcase",
        "Fashion & Apparel Brand Lifestyle Commercial (35mm film aesthetic)",
        "Kickstarter / Crowdfunding Founder Story Pitch",
        "Beverage / Food Sensory Commercial (Cinematic slow motion & splash SFX)"
      ]
    },
    music_films: {
      id: "music_films",
      name: "Music Videos & Narrative",
      icon: "Music",
      badge: "Artistic & Cinematic",
      aspectRatio: "2.39:1 Anamorphic",
      description: "Cinematography shooting, director's cut editing, music video pacing, VFX compositing, analog film emulation, and high-impact visual rhythm.",
      basePrice: 1200,
      deliveryDays: 7,
      suggestions: [
        "Moody Dark Trap / Hip-Hop Visuals (CRT glitch, laser tracking, 3D)",
        "Indie / Synthwave Retro Music Video (Film halation, neon bloom, VHS)",
        "Cinematic Short Film / Trailer (DaVinci film print LUT + Dolby 5.1 mix)",
        "Live Festival / World Tour Recap Reel (Fast sync + crowd energy)"
      ]
    },
    corporate_events: {
      id: "corporate_events",
      name: "Weddings & Real Estate",
      icon: "Building2",
      badge: "Luxury & Emotion",
      aspectRatio: "16:9 / 9:16 Multi",
      description: "Emotional wedding films, luxury real estate aerial tours, corporate keynotes, and high-end experiential event highlights.",
      basePrice: 850,
      deliveryDays: 5,
      suggestions: [
        "Luxury Real Estate FPV Drone Fly-Through & Architecture Reel",
        "Cinematic Wedding Highlight Film (Emotional vows audio mix + golden hour)",
        "Corporate Summit & Keynote Highlight Reel with Custom Lower-Thirds",
        "Resort & Hospitality Sensory Experience (Macro cuisine & ambiance)"
      ]
    }
  },

  // Featured Works Portfolio
  portfolio: [
    {
      id: "work-1",
      title: "APEX // Cyberpunk Night Drive",
      client: "Rimac Automobili Concept",
      category: "commercial",
      categoryLabel: "Commercial & Ads",
      views: "4.2M Views",
      aspect: "16:9 4K",
      duration: "0:45",
      thumbnail: "/images/commercial-car.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: "Shot with Sony FX6 on stabilized Russian arm rig. Color graded in DaVinci Resolve with custom Kodak 2383 film print emulation.",
      tags: ["Commercial", "Automotive", "Color Grade", "Sound Design", "Night Shoot"]
    },
    {
      id: "work-2",
      title: "THE HIGHLANDS // Cinematic Odyssey",
      client: "National Geographic Creator Spotlight",
      category: "youtube",
      categoryLabel: "YouTube & Documentary",
      views: "1.8M Views",
      aspect: "16:9 6K",
      duration: "14:20",
      thumbnail: "/images/hero-cinematography.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description: "Shot on location in Scottish Highlands. Features cinematic drone aerials, multi-layered atmospheric sound design, and 48% retention rate.",
      tags: ["Documentary", "YouTube", "Cinematography", "Drone", "Storytelling"]
    },
    {
      id: "work-3",
      title: "TUNNEL VISION // Urban Streetwear Reel",
      client: "Kith NYC Spring Campaign",
      category: "reels",
      categoryLabel: "Shorts & Viral Reels",
      views: "12.4M Views",
      aspect: "9:16 Vertical",
      duration: "0:28",
      thumbnail: "/images/viral-reel.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description: "Viral 9:16 vertical hook with kinetic typography, beat synchronization, speed ramps, and sub-bass impact sound design.",
      tags: ["Viral Reel", "9:16", "Streetwear", "Kinetic Typography", "Sound Design"]
    },
    {
      id: "work-4",
      title: "DA VINCI SUITE // Color Science Reel",
      client: "Studio Masterclass & Demo",
      category: "commercial",
      categoryLabel: "Color Grading & VFX",
      views: "890K Views",
      aspect: "16:9 4K",
      duration: "1:15",
      thumbnail: "/images/color-grading-suite.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description: "Side-by-side ACES Log to Rec.709 transformation with skin tone isolation, power windows, and custom film grain halation.",
      tags: ["Color Grading", "DaVinci Resolve", "Post-Production", "ACES", "Log Footage"]
    },
    {
      id: "work-5",
      title: "AFTER HOURS // Neo-Soul Music Video",
      client: "Atlantic Records Indie Release",
      category: "music_films",
      categoryLabel: "Music Videos & Narrative",
      views: "3.1M Views",
      aspect: "2.39:1 Scope",
      duration: "3:42",
      thumbnail: "/images/commercial-car.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      description: "Anamorphic glass flare visuals, seamless match cuts, CRT glitch transitions, and stylized 16mm film texture overlay.",
      tags: ["Music Video", "Anamorphic", "Match Cuts", "Film Grain", "VFX"]
    },
    {
      id: "work-6",
      title: "MONTECITO ESTATE // Architectural Tour",
      client: "Sotheby's International Realty",
      category: "corporate_events",
      categoryLabel: "Weddings & Real Estate",
      views: "950K Views",
      aspect: "16:9 4K",
      duration: "2:10",
      thumbnail: "/images/hero-cinematography.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: "FPV indoor drone navigation combined with gimbal glidecam movements, warm golden hour tones, and spatial ambient audio.",
      tags: ["Real Estate", "FPV Drone", "Architecture", "Luxury", "Smooth Glide"]
    }
  ],

  // Client Testimonials
  testimonials: [
    {
      quote: "Marcus took our YouTube channel retention from 28% to over 54%. The storytelling, pacing, and sound effects make every single second feel premium. He's our secret weapon.",
      author: "David Sterling",
      role: "Creator with 2.4M Subscribers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      metric: "+120% Viewership"
    },
    {
      quote: "We hired Marcus to both shoot and edit our global launch commercial. The cinematography with the FX6 and his color grading looked like a multimillion dollar Hollywood production.",
      author: "Elena Rostova",
      role: "Global Brand Director, Aether Audio",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      metric: "$1.4M First-Week Sales"
    },
    {
      quote: "His turnaround on our TikTok and Reels campaigns was insane. 48 hours, zero revisions needed. Every hook gripped the viewer instantly. Easily the best editor we've ever worked with.",
      author: "Marcus Chen",
      role: "Agency Founder, HyperScale Media",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      metric: "18M+ Organic Impressions"
    }
  ],

  // FAQ
  faqs: [
    {
      q: "How does the raw footage delivery work?",
      a: "You can upload your raw files to Google Drive, Dropbox, Frame.io, or WeTransfer. We can also handle camera ingest directly if you book our shooting package on location."
    },
    {
      q: "What is your revision turnaround policy?",
      a: "Every project comes with 2 to 3 rounds of comprehensive revisions. Minor tweaks (text edits, audio balance, quick cuts) are delivered within 12-24 hours via Frame.io interactive timestamp review."
    },
    {
      q: "Can you both shoot the video and edit it?",
      a: "Yes! Marcus is a full Director of Photography and Video Editor. We provide complete turnkey production (Sony FX6 cinema camera package, lighting, drone, audio) or remote post-production editing only."
    },
    {
      q: "How does the Hire Me booking process work?",
      a: "Select your category, pick suggested topics or describe your vision, select how many videos you need, and submit your WhatsApp number & contact details. Your inquiry goes straight to Marcus's email and WhatsApp for immediate response within 2 hours."
    }
  ]
};
