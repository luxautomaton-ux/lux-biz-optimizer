import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Zap, Search, BarChart3, Shield, ArrowRight, Star, TrendingUp,
  Eye, MessageSquare, FileText, CheckCircle, ChevronRight,
  Globe, Bot, DollarSign, Target, MapPin, Building2, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { ICONS_3D } from "@/lib/icons3d";

const CITY_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/nAKshaLHJakryYZW.jpg";
const STOREFRONT_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/JcmUvqoiUAnlaOuT.jpeg";
const NEON_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BQOCNOMLmEzKzUrZ.jpg";
const AGENT_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/GJymFbXargxhNYgZ.png";
const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";
const MAPS_PIN_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-2xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
            <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-lux-gold transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-lux-gold transition-colors">Features</a>
            <button onClick={() => setLocation("/pricing")} className="text-sm text-muted-foreground hover:text-lux-gold transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => setLocation("/dashboard")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
                Launch Audit <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation("/signin")} className="text-sm text-muted-foreground hover:text-foreground">Sign In</Button>
                <Button onClick={() => setLocation("/signup")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero with City Skyline */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0">
          <img src={CITY_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10 py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-lux-gold/30 bg-lux-gold/5 text-sm text-lux-gold mb-8 backdrop-blur-sm">
              <Eye className="w-4 h-4" /> YOUR BUSINESS IS INVISIBLE TO AI
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              <span className="text-foreground">Make AI</span><br />
              <span className="text-gradient-gold">Find Your Business</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-4 leading-relaxed">
              We scan your Google Business Profile, compare you to nearby competitors, and show exactly how much money you are leaving on the table.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-lux-gold/60 max-w-xl mx-auto mb-10 italic font-display">
              "See how ChatGPT, Gemini, and Perplexity see your business right now."
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-10 h-14 gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-bold shadow-lg glow-gold" onClick={() => user ? setLocation("/dashboard") : setLocation("/signup")}>
                <Search className="w-5 h-5" /> Audit My Business
              </Button>
              <Button size="lg" variant="outline" className="text-base px-10 h-14 gap-2 bg-transparent border-foreground/20 hover:border-lux-gold/50 hover:text-lux-gold" onClick={() => setLocation("/pricing")}>
                View Pricing <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-lux-gold/10 bg-gradient-to-r from-background via-card/50 to-background">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50+", label: "Data Points Scanned", icon3d: ICONS_3D.magnifyingGlass },
            { value: "3", label: "Competitors Analyzed", icon3d: ICONS_3D.radar },
            { value: "$2.4K", label: "Avg. Monthly Loss Found", icon3d: ICONS_3D.lightning },
            { value: "98%", label: "Need Optimization", icon3d: ICONS_3D.speedometer },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <img src={stat.icon3d} alt="" className="w-8 h-8 mx-auto mb-2 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_80_/_0.03),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Simple Process</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three steps to dominate AI-powered discovery in your market.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon3d: ICONS_3D.checklist, title: "SET UP YOUR PROFILE", desc: "Create your company profile with logo, location, description, and services. This becomes the foundation for your comprehensive AI visibility audit.", color: "from-lux-gold/20 to-lux-gold/5" },
              { step: "02", icon3d: ICONS_3D.analyticsSearch, title: "DEEP AI AUDIT", desc: "We scan 50+ data points from Google Maps, score you across ChatGPT, Gemini & Perplexity, compare you to top 3 competitors, and reveal every money leak.", color: "from-lux-purple/20 to-lux-purple/5" },
              { step: "03", icon3d: ICONS_3D.aiBot, title: "AI FIXES IT", desc: "Add fix services to your cart, purchase, and our AI Agent automatically optimizes your profile, verifies fixes, and confirms improvements.", color: "from-lux-cyan/20 to-lux-cyan/5" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-2xl bg-card border border-border/50 hover:border-lux-gold/20 transition-all group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="text-7xl font-display font-bold text-lux-gold/8 absolute -top-2 -right-2">{item.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-lux-gold/10 flex items-center justify-center mb-5 group-hover:bg-lux-gold/20 transition-colors overflow-hidden">
                    <img src={item.icon3d} alt="" className="w-11 h-11 object-contain" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Storefront Banner Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={STOREFRONT_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/70" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">The Problem</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Most Business Owners<br />
              <span className="text-gradient-gold">Have No Clue</span>
            </h2>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              When someone asks ChatGPT, Gemini, or Perplexity for a recommendation in your industry and city, your business does not show up. Your competitors do. Every day, AI assistants are directing customers to businesses that are optimized for AI discovery, and yours is not one of them.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "AI assistants cannot recommend businesses they cannot understand",
                "Bad listings, missing data, and weak descriptions cost you customers daily",
                "Your competitors are already being recommended by AI, even if they do not know it",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-lux-red/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-lux-red text-xs font-bold">!</span>
                  </div>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
            <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={() => setLocation("/dashboard")}>
              <Zap className="w-4 h-4" /> See How AI Views Your Business
            </Button>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Strategic Evidence</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Observed Outcomes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { industry: "HVAC", name: "Peak HVAC Solutions", before: "Visible on Maps but 0% AI recommendations", after: "Rank #2 in ChatGPT & Perplexity", result: "More booked jobs, fewer no-shows", color: "border-lux-cyan/30", accent: "text-lux-cyan" },
              { industry: "MEDICAL", name: "Downtown Dental", before: "Missing semantic trust attributes", after: "98/100 AI Trust Index Score", result: "High-value implant patients matched", color: "border-lux-green/30", accent: "text-lux-green" },
              { industry: "RETAIL", name: "Vantage Boutique", before: "Inventory invisible to voice agents", after: "Direct voice-to-store sync", result: "Captured 'near me' luxury intent", color: "border-lux-gold/30", accent: "text-lux-gold" },
            ].map((cs, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`p-7 rounded-2xl bg-card border ${cs.color} hover:bg-card/80 transition-all`}>
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground/60 mb-1">{cs.industry}</div>
                <h3 className="font-bold text-lg mb-4">{cs.name}</h3>
                <div className="text-xs text-muted-foreground mb-2 pb-3 border-b border-border/30">Before: {cs.before}</div>
                <div className={`text-sm font-bold ${cs.accent} mb-3 pt-3`}>AFTER: {cs.after}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-lux-green" /> {cs.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.55_0.25_290_/_0.04),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Full Platform</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to dominate AI-powered local discovery.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Google Maps Data Card with Logo */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
              className="premium-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <img src={MAPS_PIN_LOGO} alt="Google Maps" className="w-8 h-8 object-contain" />
                <h3 className="font-semibold text-sm">Live Google Maps Data</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Pull real-time ratings, reviews, photos, hours, and location data directly from Google Maps.</p>
            </motion.div>

            {[  
              { icon3d: ICONS_3D.aiAssistant, title: "Per-LLM Scoring", desc: "Individual scores for ChatGPT, Gemini, and Perplexity with specific issues and fixes for each." },
              { icon3d: ICONS_3D.radar, title: "Competitor Analysis", desc: "Auto-identify top 3 competitors and compare every metric with map visualization." },
              { icon3d: ICONS_3D.lightning, title: "Money Leak Detection", desc: "Identify exactly where you are losing customers and revenue with add-to-cart fix services." },
              { icon3d: ICONS_3D.aiBot, title: "AI Guardian Agent", desc: "Chat with an AI expert that auto-fixes issues, verifies improvements, and updates your profile." },
              { icon3d: ICONS_3D.checklist, title: "Beautiful PDF Reports", desc: "Branded reports with charts, competitor maps, ROI calculator, and actionable roadmap." },
              { icon3d: ICONS_3D.magnifyingGlass, title: "Niche Auto-Scanner", desc: "Auto-scans your industry and location when you set up your profile. Know your market instantly." },
              { icon3d: ICONS_3D.starsRating, title: "Review Strategy", desc: "AI-generated strategy to encourage specific, high-impact reviews from happy customers." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i + 1) * 0.05 }}
                className="premium-card p-6 rounded-xl">
                <div className="w-10 h-10 rounded-lg overflow-hidden mb-3">
                  <img src={f.icon3d} alt="" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}

            {/* Tax Write-Off Card with Lux WriteOff Logo */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="premium-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <img src={LUX_WRITEOFF_LOGO} alt="Lux WriteOff" className="w-8 h-8 object-contain rounded" />
                <h3 className="font-semibold text-sm">Tax Write-Off Info</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Business audit expenses may be tax-deductible. Powered by <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="text-lux-gold hover:underline">Lux WriteOff</a>.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Agent Section with Photo */}
      <section className="py-28 px-4 bg-card/30 border-y border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Meet Your AI Guardian</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                An AI Agent That<br />
                <span className="text-gradient-gold">Does the Work for You</span>
              </h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Our AI Guardian Agent does not just identify problems. It fixes them. Purchase fix services from your audit, and the agent automatically rewrites descriptions, creates review strategies, optimizes SEO, and verifies every change.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Auto-rewrites business descriptions for natural language queries",
                  "Creates customer review gathering strategies",
                  "Optimizes for voice search and AI assistants",
                  "Verifies all fixes and confirms score improvements",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-lux-gold shrink-0" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={() => setLocation("/dashboard")}>
                <Bot className="w-4 h-4" /> Start Your Audit
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-lux-gold/20 shadow-2xl">
                  <img src={AGENT_PHOTO} alt="Lux AI Guardian Agent" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-card border border-lux-gold/30 rounded-xl px-4 py-3 shadow-xl">
                  <div className="text-xs text-muted-foreground">AI Guardian</div>
                  <div className="text-sm font-bold text-lux-gold">Online & Ready</div>
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-lux-green flex items-center justify-center pulse-glow">
                  <span className="w-3 h-3 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neon City CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NEON_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Stop Being <span className="text-gradient-gold">Invisible</span> to AI
          </h2>
          <p className="text-foreground/70 mb-10 max-w-lg mx-auto text-lg">
            Most business owners have no idea that AI assistants cannot find them. Get your free audit now and see exactly where you stand.
          </p>
          <Button size="lg" className="text-lg px-12 h-16 gap-3 bg-lux-gold text-black hover:bg-lux-gold/90 font-bold shadow-2xl glow-gold" onClick={() => setLocation("/dashboard")}>
            <Sparkles className="w-5 h-5" /> Get Your Free Audit
          </Button>
          <p className="text-xs text-muted-foreground/50 mt-6">No credit card required. See your AI visibility score in minutes.</p>
        </div>
      </section>

      {/* Powered By Partners Section */}
      <section className="py-16 px-4 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs tracking-[0.3em] text-muted-foreground/50 mb-8 uppercase">Powered By</div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <img src={LUX_WRITEOFF_LOGO} alt="Lux WriteOff" className="h-12 w-auto object-contain rounded-lg" />
              <span className="text-[10px] text-muted-foreground group-hover:text-lux-gold transition-colors">Lux WriteOff</span>
            </a>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <img src={MAPS_PIN_LOGO} alt="Google Maps" className="h-12 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Google Maps</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-12 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Lux Automaton</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border/30 bg-lux-deep">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-10 w-auto object-contain" />
              <div className="h-8 w-px bg-border/30" />
              <div className="flex items-center gap-2">
                <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-7 w-auto object-contain opacity-60" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <button onClick={() => setLocation("/pricing")} className="hover:text-lux-gold transition-colors">Pricing</button>
              <button onClick={() => setLocation("/dashboard")} className="hover:text-lux-gold transition-colors">Dashboard</button>
              <button onClick={() => setLocation("/about")} className="hover:text-lux-gold transition-colors">About</button>
              <button onClick={() => setLocation("/faq")} className="hover:text-lux-gold transition-colors">FAQ</button>
              <button onClick={() => setLocation("/terms")} className="hover:text-lux-gold transition-colors">Terms</button>
              <button onClick={() => setLocation("/privacy")} className="hover:text-lux-gold transition-colors">Privacy</button>
              <button onClick={() => setLocation("/security")} className="hover:text-lux-gold transition-colors">Security</button>
              <button onClick={() => setLocation("/cookies")} className="hover:text-lux-gold transition-colors">Cookies</button>
              <button onClick={() => setLocation("/acceptable-use")} className="hover:text-lux-gold transition-colors">Acceptable Use</button>
              <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="hover:text-lux-gold transition-colors flex items-center gap-1.5">
                <img src={LUX_WRITEOFF_LOGO} alt="" className="h-4 w-4 object-contain rounded" /> Lux WriteOff
              </a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/20 text-center">
            <p className="text-[11px] text-muted-foreground/40">
              &copy; {new Date().getFullYear()} Lux Automaton. Lux Biz Optimizer is a marketing and technology consulting service. We do not provide legal or tax advice. Any mention of tax write-offs is for educational purposes only; please consult your CPA or tax professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
