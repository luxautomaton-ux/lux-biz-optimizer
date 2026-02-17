import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";

interface NavLink {
  label: string;
  path: string;
  active?: boolean;
}

interface PublicPageLayoutProps {
  children: React.ReactNode;
  /** Which nav item is currently active */
  activeNav?: string;
  /** Show the back-to-home breadcrumb */
  showBackLink?: boolean;
}

const mainNavLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/#features" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

const legalLinks: NavLink[] = [
  { label: "Terms of Service", path: "/terms" },
  { label: "Privacy Notice", path: "/privacy" },
  { label: "Data Security", path: "/security" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Acceptable Use", path: "/acceptable-use" },
  { label: "FAQs", path: "/faq" },
];

const productLinks: NavLink[] = [
  { label: "AI Audit", path: "/dashboard" },
  { label: "Google Rank Optimizer", path: "/google-rank" },
  { label: "AI Ad Creator", path: "/ads" },
  { label: "Lead Generator", path: "/leads" },
  { label: "Shopify Optimizer", path: "/shopify" },
  { label: "Revenue & Growth", path: "/revenue" },
];

export default function PublicPageLayout({ children, activeNav, showBackLink = true }: PublicPageLayoutProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── HEADER / NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-2xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
            <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-10 w-auto object-contain" />
          </div>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            {mainNavLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  if (link.path.startsWith("/#")) {
                    setLocation("/");
                    setTimeout(() => {
                      document.getElementById(link.path.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  } else {
                    setLocation(link.path);
                  }
                }}
                className={`text-sm transition-colors ${
                  activeNav === link.label
                    ? "text-lux-gold font-semibold"
                    : "text-muted-foreground hover:text-lux-gold"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold"
              >
                Launch App <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/signin")}
                  className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setLocation("/signup")}
                  className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── BACK LINK ─── */}
      {showBackLink && (
        <div className="pt-20 pb-2 max-w-4xl mx-auto px-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lux-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      )}

      {/* ─── PAGE CONTENT ─── */}
      <main className={showBackLink ? "" : "pt-16"}>
        {children}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/30 bg-lux-deep">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Top section: Logo + columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-10 w-auto object-contain mb-4" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-powered business optimization platform by Lux Automaton. Make AI find your business.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-6 w-auto object-contain opacity-50" />
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">Product</h4>
              <ul className="space-y-2.5">
                {productLinks.map(link => (
                  <li key={link.path}>
                    <button
                      onClick={() => setLocation(link.path)}
                      className="text-xs text-muted-foreground hover:text-lux-gold transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {legalLinks.map(link => (
                  <li key={link.path}>
                    <button
                      onClick={() => setLocation(link.path)}
                      className="text-xs text-muted-foreground hover:text-lux-gold transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setLocation("/about")} className="text-xs text-muted-foreground hover:text-lux-gold transition-colors">About Lux Automaton</button></li>
                <li><button onClick={() => setLocation("/pricing")} className="text-xs text-muted-foreground hover:text-lux-gold transition-colors">Pricing</button></li>
                <li><button onClick={() => setLocation("/partner")} className="text-xs text-muted-foreground hover:text-lux-gold transition-colors">Partner Program</button></li>
                <li><button onClick={() => setLocation("/support")} className="text-xs text-muted-foreground hover:text-lux-gold transition-colors">Support</button></li>
                <li>
                  <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-lux-gold transition-colors flex items-center gap-1.5">
                    <img src={LUX_WRITEOFF_LOGO} alt="" className="h-3.5 w-3.5 object-contain rounded" /> Lux WriteOff
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground/40">
              &copy; {new Date().getFullYear()} Lux Automaton LLC. All rights reserved. Lux Biz Optimizer is a marketing and technology consulting service.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40">
              <button onClick={() => setLocation("/terms")} className="hover:text-lux-gold transition-colors">Terms</button>
              <button onClick={() => setLocation("/privacy")} className="hover:text-lux-gold transition-colors">Privacy</button>
              <button onClick={() => setLocation("/security")} className="hover:text-lux-gold transition-colors">Security</button>
              <button onClick={() => setLocation("/cookies")} className="hover:text-lux-gold transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
