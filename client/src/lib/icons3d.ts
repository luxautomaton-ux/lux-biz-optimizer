/**
 * 3D Icon CDN URLs for premium visual experience
 * All icons are gold-themed to match the Lux brand
 */
export const ICONS_3D = {
  // Analytics & Audit
  analyticsSearch: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/iHKjOtCJnuTlGinE.png",
  analyticsChart: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/ZsltQARKGKgSfCKa.jpg",

  // AI & Robot
  aiAssistant: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/cczsAhRuacNMBGVC.png",
  aiBot: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/QpKcgnNGAsRQqYks.png",

  // Security & Shield
  shieldVerified: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/mutLvimandJffFni.png",

  // Shopping Cart
  shoppingCart: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BMGwMpQMncKEXuDU.webp",

  // Rocket / Launch
  rocket: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/fFleFtmxQCVmTCoH.jpg",

  // Search / Magnifying Glass
  magnifyingGlass: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/NICYoMFkNJZQGXmd.jpg",

  // Stars / Rating
  starsRating: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/eUabnxvBVIKAyFRs.png",

  // Lightning / Energy
  lightning: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/yMPsadMAfZuNihlN.webp",

  // Megaphone / Marketing
  megaphone: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wonHjjQlUlBrXapH.png",

  // Gear / Settings
  gear: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BtIxqrfJlAjknsUw.png",

  // Trophy / Award
  trophy: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/vVxogiJlVFLVjPNH.png",

  // Diamond / Premium
  diamond: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/UnIlVrrNrLKPgSdW.png",

  // Speedometer / Gauge
  speedometer: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/oyZQWvMaxEmXubxw.png",

  // Checklist / Tasks
  checklist: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/xacVhqEqPxDZTwEv.png",

  // Radar / Scan
  radar: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/pyXNFqywmwyZznge.png",

  // Checklist alt
  checklistAlt: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/lGceGfhdFOMMBQlH.jpg",

  // Headset / Support
  headsetSupport: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/MgsFyWzOsNKVrCjC.webp",

  // Handshake / Partner
  handshake: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/pRxfTPbfBcatSDuR.jpg",

  // User / Profile
  userProfile: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/kfLkSbYmjKdkTEnX.png",

  // Dollar Coin / Money
  dollarCoin: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/xIzAYtUaqxmghylr.png",

  // Target / Bullseye
  targetBullseye: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/cuVKRrbqvZsFYnMA.jpg",

  // Document / Report
  documentReport: "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/UXiFjyxuefJdPXfM.png",
} as const;

/**
 * Loading step configurations for different operations
 */
export interface LoadingStep {
  label: string;
  description: string;
  icon: string;
  durationMs: number;
}

export const AUDIT_LOADING_STEPS: LoadingStep[] = [
  {
    label: "Connecting to Google Maps",
    description: "Pulling live business data, reviews, and photos",
    icon: ICONS_3D.magnifyingGlass,
    durationMs: 5000,
  },
  {
    label: "Scanning Competitors",
    description: "Analyzing top competitors in your area",
    icon: ICONS_3D.radar,
    durationMs: 8000,
  },
  {
    label: "ChatGPT Analysis",
    description: "Testing how ChatGPT recommends your business",
    icon: ICONS_3D.aiAssistant,
    durationMs: 10000,
  },
  {
    label: "Gemini Analysis",
    description: "Testing how Google Gemini finds your business",
    icon: ICONS_3D.aiBot,
    durationMs: 10000,
  },
  {
    label: "Perplexity Analysis",
    description: "Testing how Perplexity AI discovers your business",
    icon: ICONS_3D.analyticsSearch,
    durationMs: 8000,
  },
  {
    label: "Generating Report",
    description: "Compiling scores, money leaks, and recommendations",
    icon: ICONS_3D.checklist,
    durationMs: 5000,
  },
];

export const LEAD_GEN_LOADING_STEPS: LoadingStep[] = [
  {
    label: "Searching Google Maps",
    description: "Finding businesses in your target area",
    icon: ICONS_3D.magnifyingGlass,
    durationMs: 6000,
  },
  {
    label: "Analyzing Opportunities",
    description: "Identifying businesses with optimization gaps",
    icon: ICONS_3D.analyticsChart,
    durationMs: 5000,
  },
  {
    label: "AI Scoring Leads",
    description: "Ranking leads by opportunity value",
    icon: ICONS_3D.aiAssistant,
    durationMs: 8000,
  },
  {
    label: "Building Outreach Strategies",
    description: "Creating personalized outreach angles",
    icon: ICONS_3D.megaphone,
    durationMs: 6000,
  },
];

export const SCANNER_LOADING_STEPS: LoadingStep[] = [
  {
    label: "Scanning Territory",
    description: "Mapping businesses in your niche and area",
    icon: ICONS_3D.radar,
    durationMs: 5000,
  },
  {
    label: "Analyzing Market",
    description: "Evaluating competition density and gaps",
    icon: ICONS_3D.analyticsChart,
    durationMs: 8000,
  },
  {
    label: "Generating Insights",
    description: "Building competitive intelligence report",
    icon: ICONS_3D.checklist,
    durationMs: 5000,
  },
];

export const AD_CREATOR_LOADING_STEPS: LoadingStep[] = [
  {
    label: "Analyzing Your Brand",
    description: "Extracting unique selling points and brand voice",
    icon: ICONS_3D.analyticsSearch,
    durationMs: 5000,
  },
  {
    label: "Crafting Facebook & Instagram Ads",
    description: "Writing scroll-stopping copy for Meta platforms",
    icon: ICONS_3D.megaphone,
    durationMs: 8000,
  },
  {
    label: "Creating TikTok & X Content",
    description: "Generating viral hooks and tweet threads",
    icon: ICONS_3D.rocket,
    durationMs: 8000,
  },
  {
    label: "Writing LinkedIn Campaigns",
    description: "Building professional B2B ad content",
    icon: ICONS_3D.checklist,
    durationMs: 6000,
  },
  {
    label: "Optimizing for AI Discovery",
    description: "Making your business discoverable by ChatGPT, Gemini & Perplexity",
    icon: ICONS_3D.aiBot,
    durationMs: 8000,
  },
  {
    label: "Scoring & Finalizing",
    description: "Rating each platform and building your posting schedule",
    icon: ICONS_3D.starsRating,
    durationMs: 5000,
  },
];

export const GOOGLE_RANK_RESEARCH_STEPS: LoadingStep[] = [
  {
    label: "Pulling Google Maps Data",
    description: "Extracting live business listing, reviews, and photos",
    icon: ICONS_3D.magnifyingGlass,
    durationMs: 6000,
  },
  {
    label: "Analyzing Top Competitors",
    description: "Researching the top 5 competitors in your area",
    icon: ICONS_3D.radar,
    durationMs: 8000,
  },
  {
    label: "Deep Google Research",
    description: "AI analyzing every Google ranking factor for your niche",
    icon: ICONS_3D.aiAssistant,
    durationMs: 12000,
  },
  {
    label: "Local SEO Analysis",
    description: "Checking NAP consistency, citations, and local signals",
    icon: ICONS_3D.analyticsSearch,
    durationMs: 8000,
  },
  {
    label: "Technical SEO Audit",
    description: "Generating schema markup, meta tags, and site recommendations",
    icon: ICONS_3D.gear,
    durationMs: 8000,
  },
  {
    label: "Building Fix Plan",
    description: "Creating prioritized auto-fix plan for #1 ranking",
    icon: ICONS_3D.checklist,
    durationMs: 5000,
  },
];

export const GOOGLE_RANK_AUTOFIX_STEPS: LoadingStep[] = [
  {
    label: "AI Agent Initializing",
    description: "Loading research data and fix plan",
    icon: ICONS_3D.aiBot,
    durationMs: 4000,
  },
  {
    label: "Generating Optimized Content",
    description: "Writing SEO-optimized descriptions, meta tags, and schema",
    icon: ICONS_3D.checklist,
    durationMs: 10000,
  },
  {
    label: "Applying All Fixes",
    description: "AI Agent executing every optimization automatically",
    icon: ICONS_3D.gear,
    durationMs: 15000,
  },
  {
    label: "Generating Implementation Report",
    description: "Compiling results, assets, and next steps",
    icon: ICONS_3D.analyticsChart,
    durationMs: 6000,
  },
];

export const AI_AGENT_LOADING_STEPS: LoadingStep[] = [
  {
    label: "AI Agent Initializing",
    description: "Loading your business data and audit results",
    icon: ICONS_3D.aiBot,
    durationMs: 3000,
  },
  {
    label: "Executing Fix",
    description: "AI Agent is applying the optimization",
    icon: ICONS_3D.gear,
    durationMs: 12000,
  },
  {
    label: "Verifying Results",
    description: "Confirming changes were applied correctly",
    icon: ICONS_3D.shieldVerified,
    durationMs: 5000,
  },
];

export const SHOPIFY_AUDIT_LOADING_STEPS: LoadingStep[] = [
  {
    label: "Connecting to Shopify Store",
    description: "Crawling homepage, collections, and product pages",
    icon: ICONS_3D.shoppingCart,
    durationMs: 6000,
  },
  {
    label: "SEO & Schema Analysis",
    description: "Checking meta tags, structured data, and URL handles",
    icon: ICONS_3D.magnifyingGlass,
    durationMs: 8000,
  },
  {
    label: "AI Visibility Check",
    description: "Testing how ChatGPT, Gemini & Perplexity find your products",
    icon: ICONS_3D.aiBot,
    durationMs: 10000,
  },
  {
    label: "CRO & UX Analysis",
    description: "Evaluating conversion funnel, trust signals, and mobile UX",
    icon: ICONS_3D.analyticsChart,
    durationMs: 8000,
  },
  {
    label: "Performance & Speed Audit",
    description: "Analyzing page load times, image optimization, and Core Web Vitals",
    icon: ICONS_3D.speedometer,
    durationMs: 6000,
  },
  {
    label: "Generating Optimization Plan",
    description: "Building prioritized fix list with auto-fix capabilities",
    icon: ICONS_3D.checklist,
    durationMs: 8000,
  },
];
