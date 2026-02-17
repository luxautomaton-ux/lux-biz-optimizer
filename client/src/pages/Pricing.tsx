import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  CheckCircle, ArrowRight, Crown, Star, Shield,
  MessageSquare, FileText, Search, BarChart3,
  DollarSign, ExternalLink, Target, Sparkles, Zap,
  Camera, BrainCircuit, Handshake,
} from "lucide-react";

const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";

const tiers = [
  {
    name: "FREE SCAN",
    price: "$0",
    period: "",
    description: "See how AI sees your business right now",
    highlight: false,
    color: "border-border/50",
    features: [
      { text: "Overall AI Visibility Score", included: true },
      { text: "Google Maps data snapshot", included: true },
      { text: "Top 3 competitor identification", included: true },
      { text: "Basic score breakdown", included: true },
      { text: "Revenue loss estimate", included: true },
      { text: "Detailed analysis & recommendations", included: false },
      { text: "AI Agent access", included: false },
      { text: "PDF report export", included: false },
    ],
    cta: "Run Free Scan",
    ctaPath: "/dashboard",
  },
  {
    name: "SINGLE AUDIT",
    price: "$500",
    period: "one-time",
    description: "Complete deep audit with full analysis",
    highlight: false,
    color: "border-blue-500/20",
    features: [
      { text: "Everything in Free Scan", included: true },
      { text: "Full 50+ data point analysis", included: true },
      { text: "Per-LLM scores (ChatGPT, Gemini, Perplexity)", included: true },
      { text: "Revenue leak identification with fixes", included: true },
      { text: "Custom recommendations & roadmap", included: true },
      { text: "PDF report with charts & graphs", included: true },
      { text: "AI Agent (1 session)", included: true },
      { text: "Competitor deep comparison", included: true },
    ],
    cta: "Get Full Audit",
    ctaPath: "/dashboard",
  },
  {
    name: "PROFESSIONAL",
    price: "$997",
    period: "/month",
    description: "Ongoing optimization with AI Guardian",
    highlight: true,
    color: "border-lux-gold/40",
    features: [
      { text: "Everything in Single Audit", included: true },
      { text: "Unlimited audits & re-scans", included: true },
      { text: "Unlimited AI Agent access", included: true },
      { text: "Niche scanner (unlimited territories)", included: true },
      { text: "Automated monitoring & alerts", included: true },
      { text: "AI description rewriting", included: true },
      { text: "Review strategy generation", included: true },
      { text: "Monthly progress reports", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Professional",
    ctaPath: "/dashboard",
  },
  {
    name: "ENTERPRISE",
    price: "$2,000",
    period: "/month",
    description: "Full-service AI optimization + implementation",
    highlight: false,
    color: "border-purple-500/20",
    features: [
      { text: "Everything in Professional", included: true },
      { text: "Done-for-you implementation", included: true },
      { text: "Google Business Profile management", included: true },
      { text: "Ad creation & optimization", included: true },
      { text: "Multi-location support", included: true },
      { text: "Custom AI agent training", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "White-label reports", included: true },
      { text: "API access", included: true },
    ],
    cta: "Contact Sales",
    ctaPath: "/dashboard",
  },
];

const addOns = [
  { name: "AI Description Rewrite", price: "$149", desc: "AI-optimized Google Business description for voice search & LLMs", icon: FileText },
  { name: "Review Strategy", price: "$99", desc: "Custom review acquisition strategy with templates & scripts", icon: Star },
  { name: "Photo Optimization", price: "$199", desc: "AI-scored photo audit + 10 AI-generated business photos", icon: Camera },
  { name: "Competitor Deep Dive", price: "$299", desc: "Extended analysis of up to 10 competitors with gap report", icon: Target },
  { name: "Ad Campaign Setup", price: "$399", desc: "Google Ads campaign creation optimized for AI discovery", icon: BarChart3 },
  { name: "Monitoring (Annual)", price: "$1,997", desc: "12-month automated monitoring with monthly reports & alerts", icon: Shield },
];

export default function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
            <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-9 w-auto object-contain" />
          </div>
          <Button onClick={() => setLocation("/dashboard")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
            Launch Audit <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #d4a843 0%, transparent 50%), radial-gradient(circle at 70% 50%, #d4a843 0%, transparent 50%)" }} />
        <div className="max-w-3xl mx-auto relative">
          <Badge className="mb-4 bg-lux-gold/10 text-lux-gold border-lux-gold/20 text-xs gap-1">
            <DollarSign className="w-3 h-3" /> Potential Tax Write-Off
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Invest in <span className="text-lux-gold">AI Visibility</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose the level of insight and optimization that matches your business goals. Every tier includes live Google Maps data and AI analysis.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <div key={i} className={`rounded-2xl ${tier.color} border bg-card relative ${tier.highlight ? "shadow-lg shadow-lux-gold/10 ring-1 ring-lux-gold/20" : ""}`}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-lux-gold to-amber-600 text-black gap-1 text-[10px] font-bold border-0">
                    <Crown className="w-3 h-3" /> MOST POPULAR
                  </Badge>
                </div>
              )}
              <div className="p-5 pb-3">
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground mb-1">{tier.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold">{tier.price}</span>
                  {tier.period && <span className="text-xs text-muted-foreground">{tier.period}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{tier.description}</p>
              </div>
              <div className="px-5 pb-5 space-y-4">
                <div className="space-y-2.5">
                  {tier.features.map((f, j) => (
                    <div key={j} className={`flex items-start gap-2 text-xs ${f.included ? "text-foreground" : "text-muted-foreground/30"}`}>
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${f.included ? "text-emerald-400" : "text-muted-foreground/15"}`} />
                      {f.text}
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full gap-2 font-semibold ${tier.highlight ? "bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:from-lux-gold/90 hover:to-amber-600/90" : "bg-transparent border border-border/50 hover:border-lux-gold/30 hover:bg-lux-gold/5 text-foreground"}`}
                  onClick={() => setLocation(tier.ctaPath)}
                >
                  {tier.cta} <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-bold tracking-tight mb-2">Add-On Services</h2>
            <p className="text-sm text-muted-foreground">Enhance your audit with specialized optimization services. Add to your cart from the audit results page.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card hover:border-lux-gold/20 transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                    <addon.icon className="w-4 h-4 text-lux-gold" />
                  </div>
                  <span className="text-lg font-display font-bold text-lux-gold">{addon.price}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{addon.name}</h3>
                <p className="text-xs text-muted-foreground">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Program */}
      <section className="py-16 px-4 bg-emerald-500/5 border-y border-emerald-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs gap-1">
                <Handshake className="w-3 h-3" /> Reseller Program
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
                Become a <span className="text-emerald-400">Lux Partner</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Join our exclusive partner network and earn 20% recurring commission on every business you refer. Perfect for agency owners, consultants, and marketing professionals.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "20% Lifetime Recurring Commission",
                  "Dedicated Partner Dashboard & Analytics",
                  "Done-for-you Marketing Materials",
                  "Priority Support & Training",
                  "Monthly Payouts via Stripe Connect"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setLocation("/partner")}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold px-8"
                >
                  Join Partner Program <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Setup Fee</span>
                  <span className="text-xl font-bold font-display text-emerald-400">$299 <span className="text-[10px] text-muted-foreground font-normal tracking-normal uppercase">One-Time</span></span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border border-emerald-500/20 flex items-center justify-center p-12 relative">
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-3xl" />
                <Handshake className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />

                {/* Floaties */}
                <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-card border border-emerald-500/20 flex items-center justify-center shadow-xl animate-bounce-slow">
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="absolute bottom-12 left-8 w-14 h-14 rounded-2xl bg-card border border-emerald-500/20 flex items-center justify-center shadow-xl animate-bounce-slow [animation-delay:0.5s]">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Write-Off */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src={LUX_WRITEOFF_LOGO} alt="Lux WriteOff" className="w-12 h-12 object-contain rounded-lg" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight mb-3">Potential Tax Write-Off</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            Business consulting and marketing audit expenses are generally deductible as ordinary business expenses under IRS Section 162. Track your write-offs with Lux WriteOff.
          </p>
          <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
              <ExternalLink className="w-4 h-4" /> Learn More at Lux WriteOff
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-8 w-auto object-contain" />
            <div className="h-6 w-px bg-border/30" />
            <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-6 w-auto object-contain opacity-50" />
          </div>
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Lux Automaton. Pricing subject to change. Tax write-off information is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
