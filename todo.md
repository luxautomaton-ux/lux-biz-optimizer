# Business AI Lister - Project TODO

## Database & Architecture
- [x] Design and implement database schema (audits, businesses, competitors, reports, subscriptions, photos, chat messages)
- [x] Set up tRPC routers for all feature domains

## Core Backend Features
- [x] Google Maps API integration for live business data (ratings, reviews, photos, hours, location)
- [x] AI Visibility Scoring Engine (ChatGPT, Gemini, Perplexity scoring simulation)
- [x] Competitor analysis engine (find top 3 competitors, compare metrics)
- [x] AI-powered business description rewriter (natural language / voice search optimization)
- [x] Photo scoring system (semantic quality, atmosphere, AI discoverability)
- [x] Niche scanner (scan all businesses in industry/territory)
- [x] LLM integration for AI agent chat and audit generation
- [x] PDF report generation with charts, graphs, ROI calculator

## Frontend Pages
- [x] Landing page with hero, case studies, how-it-works, pricing preview
- [x] Dashboard layout with sidebar navigation
- [x] Audit Dashboard (business input form, audit results display)
- [x] Market Scanner page (niche/territory scan)
- [x] Market Analytics page (charts, competitor comparison)
- [x] ~~Photo Optimizer page~~ (REMOVED in Phase 2)
- [x] AI Agent Fixer chat page (paid subscribers only)
- [x] Reports & Export page (PDF preview, download)
- [x] Pricing page (free preview, one-time audits $500-$2000, subscriptions)
- [x] User Profile & Settings page
- [x] ~~Implementation Guide / Roadmap page~~ (REMOVED in Phase 2, guidance integrated into AI Agent)

## Business Logic
- [x] Multi-tier pricing model (Free Scan, Deep Audit, Implementation)
- [x] Free audit preview (limited insights to market paid audit)
- [x] ROI calculator showing money saved
- [x] Tax write-off information via Lux WriteOff integration
- [x] Service add-ons (Audit, Implementation, Monitoring as separate services)
- [x] Review strategy generator (encourage specific customer reviews)
- [x] SEO/keyword optimization recommendations
- [x] Google Business Profile optimizer
- [x] Ad creation and optimization suggestions

## Testing
- [x] Server-side unit tests for audit scoring
- [x] Server-side unit tests for competitor analysis
- [x] Server-side unit tests for description rewriter
- [x] ~~Server-side unit tests for photo scoring~~ (removed with Photo Optimizer)
- [x] Server-side unit tests for chat
- [x] Server-side unit tests for reports
- [x] Server-side unit tests for profile
- [x] Server-side unit tests for auth (25 total tests passing)

## Refactor - Phase 2
- [x] Remove Photo Optimizer page and route
- [x] Create company profile setup page with logo upload, name, location, description
- [x] Company profile stores logo in S3 and metadata in DB
- [x] Audit is linked to company profile (one audit per company)
- [x] Integrate Google Maps view into audit results showing location and closest competitors
- [x] Build add-on cart system (add services to cart, pay for them)
- [x] AI Agent auto-fix workflow: automatically fixes issues, updates company profile, runs verification test
- [x] Update navigation to remove Photo Optimizer and add Company Profile
- [x] Update dashboard to show company profile setup as first step
- [x] Money leaks section with clear actionable items linked to add-ons
- [x] Updated all vitest tests for new company profile and cart features (25 tests passing)

## Phase 3 - Visual & Functional Enhancement
- [ ] Add individual LLM scores (ChatGPT, Gemini, Perplexity) with specific fix details for each
- [ ] Show what is wrong and what needs to be fixed for each LLM
- [ ] AI Agent provides actionable fixes for each LLM issue
- [ ] Audit Dashboard shows all purchased fixes with status and exportability
- [ ] Company profile saves all information when saved
- [ ] Niche scanner auto-runs with company info on profile save
- [ ] Auto-scanner results saved and added to export
- [ ] Beautiful branded PDF export with colors, charts, city theme
- [x] City-themed design with local business photos on background banners
- [x] Rich photography throughout the app
- [x] Enhanced font splash and typography (Playfair Display + Space Grotesk)
- [x] Profile photos and agent profile photo integration
- [x] Agent profile photo: https://carhostinggurus.com/wp-content/uploads/2026/01/ChatGPT-Image-Nov-7-2025-05_10_40-PM.png
- [x] Rename app to "Lux Biz Optimizer"
- [x] All pages enhanced with photos and visual richness (Home, Dashboard, DashboardLayout)
- [ ] Export includes niche scanner data

## Phase 4 - Firebase Authentication Integration
- [x] Install Firebase SDK (firebase package)
- [x] Create Firebase config file with provided credentials
- [x] Build Firebase authentication service (sign up, sign in, sign out, auth state)
- [x] Create sign-up page with email/password form
- [x] Create sign-in page with email/password form
- [x] Replace Manus OAuth context with Firebase auth context
- [x] Update useAuth hook to use Firebase auth state
- [x] Update database schema to use Firebase UID as user identifier
- [x] Remove Manus OAuth dependencies (openId, OAuth callback routes)
- [x] Update all tRPC procedures to validate Firebase auth tokens
- [x] Update server context to extract Firebase user from token
- [x] Update DashboardLayout to use Firebase auth
- [x] Update all protected routes to use Firebase auth
- [x] Remove Manus OAuth sign-in redirects and replace with Firebase auth UI
- [x] Test sign-up, sign-in, and sign-out flows
- [x] Verify all protected routes work with Firebase auth

## Phase 5 - Complete All Remaining Features
- [x] Per-LLM scoring breakdown (ChatGPT, Gemini, Perplexity) with individual scores and fix details
- [x] Each LLM shows what is wrong and what needs to be fixed
- [x] AI Agent provides actionable fixes for each LLM issue
- [x] Audit Dashboard shows all purchased fixes with status tracking
- [x] Company profile saves all information completely when saved
- [x] Niche scanner auto-runs with company info on profile save
- [x] Auto-scanner results saved and added to export
- [x] Beautiful branded PDF export with colors, charts, city theme, logo
- [x] PDF preview before export
- [x] Fix Firebase Admin credential parsing (private key format with fallback)
- [x] Polish Scanner page with enhanced visuals
- [x] Polish AgentChat page with agent profile photo
- [x] Polish Reports page with PDF preview
- [x] Polish Pricing page with enhanced visuals
- [x] Polish CompanyProfile page
- [x] Polish Cart page
- [x] Polish Settings page
- [x] Write/update all vitest tests (25 tests passing)
- [x] Verify all features end-to-end

## Phase 6 - Logo & Branding Update
- [x] Download dark background logo and upload to CDN
- [x] Download light background logo and upload to CDN
- [x] Update DashboardLayout sidebar to show only logo image (no text)
- [x] Update Home page header/nav to show only logo image (no text)
- [x] Update SignIn and SignUp pages with logo
- [x] Update Reports PDF header/footer with logo
- [x] Update Pricing page nav/footer with logo
- [ ] Update favicon with logo

## Phase 7 - Partner & Brand Logo Integration
- [x] Download and upload Lux Automaton logo to CDN
- [x] Download and upload Lux WriteOff logo to CDN
- [x] Download and upload Google Maps 3D pin logo to CDN
- [x] Add Lux Automaton logo to footer "by Lux Automaton" sections across all pages
- [x] Add Lux WriteOff logo to tax write-off sections and pricing page
- [x] Add Google Maps 3D pin logo to audit results, scanner, and maps integration sections
- [x] Update Home page with partner logos
- [x] Update Dashboard with relevant logos
- [x] Update Reports/PDF export with partner logos

## Phase 8 - Firebase Data Storage & Admin Cost Calculator
- [ ] Set up Firebase Firestore for all app data (company profiles, audits, scans, cart)
- [ ] Set up Firebase Storage for image uploads (logos, photos)
- [ ] Migrate server-side data layer from MySQL/Drizzle to Firestore
- [ ] Connect real Google Maps Places API for live business data
- [ ] Build admin cost calculator page showing per-audit operational costs
- [ ] Cost estimates for 10, 30, 50, 100 companies
- [ ] Track Manus API usage (LLM calls only) vs Firebase costs
- [ ] Show breakdown: Maps API calls, LLM calls, Firebase reads/writes, Storage
- [ ] Ensure all images stored in Firebase Storage not S3
- [ ] Real data flow: Google Maps → Firestore → UI (no mock data)

## Phase 9 - Netlify Readiness & Audit Enhancement
- [ ] Ensure app builds for Netlify deployment (static frontend + serverless functions)
- [ ] Add netlify.toml configuration
- [ ] Enhance audit to deliver maximum value beyond $500-2000 price point
- [ ] Add comprehensive SEO analysis section to audit
- [ ] Add voice search optimization analysis
- [ ] Add AI citation analysis (how LLMs reference the business)
- [ ] Add customer journey mapping from AI discovery
- [ ] Add revenue impact calculator with real projections
- [ ] Add actionable 30/60/90 day roadmap in audit
- [ ] Add competitive gap analysis with specific recommendations

## Phase 10 - AI Agent Fix Execution & Lead Generator
- [x] AI Agent can actually execute fixes (not just recommend) - runAutoFix function implemented
- [x] Description rewriting: Agent rewrites business description optimized for AI/voice search
- [x] Review response generation: Agent creates responses to reviews
- [x] SEO optimization: Agent generates meta descriptions, title tags, keywords
- [x] Photo optimization: Agent provides specific photo improvement suggestions
- [x] Hours optimization: Agent suggests optimal hours based on competitor analysis
- [x] Service listing: Agent generates comprehensive service descriptions
- [x] Fix verification: Agent tests fixes and confirms improvements
- [x] Build Lead Generator tool with Google Maps integration
- [x] Lead Generator: Search businesses by niche, location, radius
- [x] Lead Generator: Filter by rating, review count, missing data (no website, no photos, etc.)
- [x] Lead Generator: Export full contact data (name, phone, email, address, website)
- [x] Lead Generator: Export to CSV, Excel, PDF with all business details
- [x] Lead Generator: Show opportunity score for each lead
- [x] Add Lead Generator as premium add-on ($299-$999 depending on lead count)
- [ ] Lead Generator pricing tiers: 100 leads ($299), 500 leads ($699), Unlimited ($999/mo) - to be added to Pricing page

## Phase 11 - AI-Enhanced Lead Generator
- [x] Use Manus LLM to analyze each lead and provide opportunity insights
- [x] AI scores leads based on: missing data, low reviews, no website, poor description
- [x] AI generates personalized outreach message for each lead (outreachAngle)
- [x] AI identifies specific pain points for each business
- [x] AI estimates revenue potential for targeting each lead
- [x] Lead Generator exports include AI-generated pitch and opportunity summary
- [x] Batch AI analysis for 100+ leads with progress tracking (first 20 leads analyzed automatically)

## Phase 12 - Admin Access & Cost Calculator
- [x] Set luxautomaton@gmail.com as admin user with role="admin"
- [x] Create admin-only page at /admin route
- [x] Admin page: Cost calculator showing per-audit operational costs
- [x] Admin page: Usage tracking (total audits, scans, leads generated, LLM calls)
- [x] Admin page: Cost estimates for 10, 30, 50, 100 companies
- [x] Admin page: Breakdown of Manus API usage (LLM calls only)
- [x] Admin page: Revenue tracking (audit sales, add-on purchases, subscriptions)
- [x] Admin page: User management (list all users, view activity)
- [x] Implement role-based access control (admin vs user)
- [x] Restrict admin page access to admin role only
- [x] Add admin link to sidebar navigation (only visible to admin)
- [ ] Test admin access with luxautomaton@gmail.com

## Phase 13 - Lead Generator Enhancements & Admin Sidebar
- [x] Add DashboardLayout to Lead Generator page to match all pages
- [x] Add admin link to sidebar (only visible to admin users)
- [x] Lead Generator: auto-populate from company audit data
- [x] Lead Generator: two modes - AI-driven (uses company info) and custom search
- [x] Lead Generator: AI finds leads based on business niche, location, and competitors

## Phase 14 - Lead Generator Header
- [x] Add proper header to Lead Generator page matching other pages style

## Phase 15 - 3D Icons & Loading Graphics
- [x] Find and integrate 3D icon assets for key features (audit, scanner, leads, agent, maps, reports)
- [x] Create reusable AuditLoader component with circular progress, percentage, and countdown timer
- [x] Loading graphic shows accurate time estimate based on operation type
- [x] Integrate loading component into audit generation, scanner, lead generator, and AI agent
- [x] Replace flat Lucide icons with 3D icons in sidebar, headers, and feature cards

## Phase 16 - Photo-Rich Branding, Admin Overhaul, Support Tickets & Account Management

### Photo-Rich Branding
- [ ] Search and download local store/business photos for banners and backgrounds
- [ ] Add photo banners to Dashboard, Scanner, Lead Generator, Reports pages
- [ ] Add branded background images to section headers across all pages
- [ ] Ensure consistent premium branded look throughout the app

### Admin Dashboard Overhaul
- [ ] Show all AI Agent tools and their current status (active/idle/error)
- [ ] Show tasks being executed by AI Agent in real-time
- [ ] AI Agent error detection and auto-fix capability
- [ ] Give Agent access to all API keys for research and auto-fix
- [ ] Agent auto-fix report generation
- [ ] Expandable user detail cards showing: full user info, agent activity history, total spending
- [ ] Each user card shows all agent actions performed for that customer
- [ ] Admin can view detailed breakdown of each user's purchases and fixes

### Support Ticket System
- [ ] Database schema for support tickets (user, subject, description, status, priority, messages)
- [ ] Users can create support tickets from their dashboard
- [ ] AI Agent handles first-line customer service on tickets
- [ ] AI Agent auto-responds to common issues
- [ ] Escalation: AI Agent sends admin email notification when it cannot resolve an issue
- [ ] Ticket status tracking (open, in-progress, resolved, escalated)
- [ ] Admin can view and manage all tickets

### Account Management
- [ ] Users can cancel their account from Settings
- [ ] Users can request data deletion (GDPR-style)
- [ ] Confirmation flow before account deletion
- [ ] All user data removed on deletion (audits, companies, tickets, purchases)
- [ ] Admin notified when user cancels account

## Phase 17 - About Page
- [x] Create About page with Lux Automaton company info, mission, founder bio, and vision
- [x] Add About link to footer navigation on Home/splash page
- [x] Add About route to App.tsx
- [x] Match luxury dark theme with city/tech imagery

## Phase 18 - Revenue & Growth AI Suggestions
- [x] Create Revenue & Growth tRPC procedure that uses AI to generate revenue strategies per business
- [x] AI suggests software tools, SaaS platforms, and automation for each business section
- [x] Revenue suggestions cover: marketing, operations, customer retention, lead gen, pricing, tech stack
- [x] Build Revenue & Growth page with expandable sections for each category
- [x] Add recommended SaaS/software tools with descriptions and use cases
- [x] Add Revenue & Growth to sidebar navigation
- [x] Connect to company profile data for personalized recommendations

## Phase 19 - Google Rank Optimizer (AI Agent Add-On Tool)
- [x] Create deep research tRPC procedure that analyzes what Google wants for the business niche
- [x] AI Agent researches Google ranking factors, local SEO, schema markup, NAP consistency
- [x] AI Agent auto-generates optimized content: meta titles, descriptions, keywords, schema JSON-LD
- [x] AI Agent creates Google Business Profile optimization plan with exact fixes
- [x] Auto-fix execution: Agent applies all fixes and generates implementation report
- [x] Build Google Rank Optimizer page matching existing app layout/style (DashboardLayout)
- [x] Add loading states with AuditLoader component
- [x] Add to sidebar navigation
- [x] Add route to App.tsx

## Phase 20 - AI Ad Creator (All Platforms + LLM Discovery)
- [x] Create AI Ad Creator tRPC procedure that generates ads from company profile
- [x] Generate platform-specific ads: Facebook, Instagram, TikTok, X/Twitter, LinkedIn
- [x] Generate LLM-discoverable content for ChatGPT, Gemini, Perplexity promotion
- [x] Each ad includes: headline, body copy, hashtags, CTA, character count, score
- [x] Platform scoring system (1-100) for ad quality per platform
- [x] Copy-paste ready output for each platform
- [x] Build AI Ad Creator page with DashboardLayout matching app style
- [x] Add to sidebar navigation and App.tsx routes

## Phase 21 - Reseller/Partner Program
- [ ] Database schema: partners table (company info, Stripe account, commission rate, status)
- [ ] Database schema: partner_referrals table (partner → user mapping, referral date, revenue share period)
- [ ] Database schema: partner_commissions table (monthly commission tracking, amounts, status)
- [ ] Database schema: partner_payouts table (Stripe payout records, amounts, dates)
- [ ] Partner registration/application flow
- [ ] Partner Dashboard - Overview with KPIs (total customers, revenue, commissions, payouts)
- [ ] Partner Dashboard - Customer management table with details
- [ ] Partner Dashboard - Analytics (charts, trends, growth metrics)
- [ ] Partner Dashboard - Profit Calculator (commission estimator)
- [ ] Partner Dashboard - AI Agent tasks per customer view
- [ ] Partner Dashboard - Agent tools usage tracking
- [ ] Partner Dashboard - Payment history per customer (how much they paid, how much partner earned)
- [ ] Partner Dashboard - Revenue sharing (cut for 1 year per referred user)
- [ ] Stripe payment integration for partner payouts
- [ ] Payment reports with export capability
- [ ] Tax write-off suggestions with Lux WriteOff promotion
- [ ] Partner sidebar navigation and routes

## Phase 22 - Menu Reorganization
- [x] Reorganize sidebar menu with clearer grouping and hierarchy
- [x] Group: Getting Started (Company Profile, Audit Dashboard)
- [x] Group: AI Tools (AI Agent, Google Rank Optimizer, AI Ad Creator, Lead Generator, Revenue & Growth)
- [x] Group: Intelligence (Niche Scanner, Market Analytics, Reports & Export)
- [x] Group: Account (Cart, Pricing, Support, Settings)
- [x] Group: Admin (Admin Dashboard) - admin only
- [x] Group: Partner Program (Partner Dashboard) - partner section with handshake icon

## Phase 23 - Legal & Compliance Pages (Military-Grade Security)
- [x] Terms of Service page with military-grade security language
- [x] Privacy Notice page with data protection and encryption details
- [x] FAQs page covering security, billing, features, and data handling
- [x] Cookie Policy page
- [x] Data Security page highlighting military-grade encryption and compliance
- [x] Acceptable Use Policy page
- [x] Add all routes to App.tsx
- [x] Add footer links to all legal pages on Home page and other pages
- [x] Consistent dark luxury theme across all legal pages

## Phase 24 - Shopify Store Optimizer (Add-on)
- [x] Backend tRPC procedure for Shopify store audit (crawl + AI analysis)
- [x] AI analysis covers: SEO, AEO, CRO, UX, performance, trust signals, AI visibility
- [x] Structured optimization plan with severity, impact, and step-by-step fixes
- [x] Auto-fix capability when Shopify API keys are provided
- [x] Shopify credential input (store domain, Admin API token, scopes)
- [x] Dry-run mode with diff/preview before applying changes
- [x] Per-category auto-fix toggles (SEO, product content, theme/UX)
- [x] ShopifyOptimizer.tsx UI page matching app style
- [x] Add to sidebar navigation and App.tsx routes
- [x] Loading component with Shopify-specific steps

## Phase 25 - Unified Page Layout
- [x] Create shared PublicPageLayout component with consistent header, nav, and footer
- [x] Refactor TermsOfService to use PublicPageLayout
- [x] Refactor PrivacyNotice to use PublicPageLayout
- [x] Refactor FAQ to use PublicPageLayout
- [x] Refactor CookiePolicy to use PublicPageLayout
- [x] Refactor DataSecurity to use PublicPageLayout
- [x] Refactor About to use PublicPageLayout
- [x] Create AcceptableUse page with PublicPageLayout
- [x] Create ShopifyOptimizer page with DashboardLayout (app page)
- [x] Add all routes to App.tsx
- [x] Update Home footer with all legal page links
- [x] Add Shopify Optimizer to sidebar navigation

## Phase 26 - Star Highlight for Featured Tools
- [x] Add star badge to Lead Finder in sidebar to highlight it as a featured tool
- [x] Add star badge to Shopify Optimizer in sidebar to highlight it as a featured tool

## Phase 27 - Sidebar Menu Fix & Admin Enhancements
- [ ] Fix sidebar menu overlap - links are overlapping and not all visible
- [ ] Add API Key management section to Admin dashboard
- [ ] Add App Settings section to Admin dashboard
- [ ] Add Stripe setup/configuration section to Admin dashboard

## Phase 28 - Partner Dashboard, Support Page & Admin Enhancements
- [ ] Complete Partner Dashboard - Overview with KPIs
- [ ] Partner Dashboard - Customer management table
- [ ] Partner Dashboard - Analytics charts and trends
- [ ] Partner Dashboard - Profit Calculator
- [ ] Partner Dashboard - AI Agent tasks per customer
- [ ] Partner Dashboard - Payment history and reports
- [ ] Partner Dashboard - Tax write-off suggestions with Lux WriteOff promo
- [ ] Build Support page - Create ticket form
- [ ] Support page - Ticket list with status tracking
- [ ] Support page - AI Agent auto-response on tickets
- [ ] Support page - Escalation to admin notification
- [ ] Admin - Add API Key management tab
- [ ] Admin - Add App Settings tab
- [ ] Admin - Add Stripe Setup/Configuration tab
- [ ] All pages match consistent header and DashboardLayout style

## Phase 29 - Partner Pricing & Onboarding
- [ ] Fix all remaining TypeScript errors (PartnerDashboard stats, routers category type)
- [ ] Add Partner/Reseller pricing tier to Pricing page with setup fee
- [ ] Create Partner Onboarding tutorial page with step-by-step guide
- [ ] Onboarding covers: platform overview, getting businesses to sign up, dashboard walkthrough, referral link usage, commission tracking, payout setup
- [ ] Add routes for Support, PartnerDashboard, and PartnerOnboarding pages
- [ ] Add sidebar links for Support and Partner pages
