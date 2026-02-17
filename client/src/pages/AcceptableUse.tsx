import PublicPageLayout from "@/components/PublicPageLayout";
import { Shield, AlertTriangle, Ban, Scale, FileText, CheckCircle } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

const EFFECTIVE_DATE = "February 7, 2026";

export default function AcceptableUse() {
  return (
    <PublicPageLayout activeNav="Acceptable Use">
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.shieldVerified} alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Acceptable <span className="text-gradient-gold">Use Policy</span></h1>
              <p className="text-muted-foreground mt-1">Effective Date: {EFFECTIVE_DATE}</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl border border-lux-gold/20 bg-lux-gold/5 flex items-start gap-4">
            <Shield className="h-6 w-6 text-lux-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lux-gold text-sm">PROTECTING OUR COMMUNITY</p>
              <p className="text-sm text-muted-foreground mt-1">This Acceptable Use Policy ensures a safe, secure, and productive environment for all users of Lux Biz Optimizer. Violations may result in immediate account suspension or termination.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div className="space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">1. Purpose</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>This Acceptable Use Policy ("AUP") governs your use of the Lux Biz Optimizer platform and all associated services provided by Lux Automaton LLC. This AUP supplements our Terms of Service and applies to all users, including individual accounts, business accounts, reseller partners, and enterprise clients.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">2. Permitted Uses</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>You may use the Service for:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Auditing and optimizing your own business's AI visibility and online presence</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Generating AI-powered reports, ad copy, and optimization recommendations for your business</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Using the Lead Generator to identify potential business opportunities</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Managing client accounts as an approved reseller partner</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Accessing educational resources and AI tools for legitimate business purposes</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3"><Ban className="h-5 w-5 text-red-400" /><h2 className="text-2xl font-bold text-red-400">3. Prohibited Activities</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>The following activities are strictly prohibited:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Using the Service to harass, threaten, or defame any person or business",
                  "Submitting false, misleading, or fraudulent business information",
                  "Attempting to reverse engineer, decompile, or extract source code",
                  "Using automated scripts, bots, or scrapers to access the Service",
                  "Reselling access without an approved Partner Agreement",
                  "Circumventing rate limits, security measures, or access controls",
                  "Using the Service to generate spam, phishing content, or malware",
                  "Impersonating another user, business, or Lux Automaton staff",
                  "Sharing account credentials with unauthorized third parties",
                  "Using the Service for any illegal purpose under applicable law",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/20">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">4. Security Requirements</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>To maintain the military-grade security of our platform, all users must:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Use strong, unique passwords and enable multi-factor authentication when available</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Report any suspected security vulnerabilities through our responsible disclosure program</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Not share API keys, session tokens, or authentication credentials</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span>Keep all account recovery information current and secure</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Scale className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">5. Enforcement</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>Violations of this AUP may result in:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Warning</strong> — First-time minor violations will receive a written warning with instructions for correction.</span></li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Temporary Suspension</strong> — Repeated or moderate violations may result in temporary account suspension (7–30 days).</span></li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Permanent Termination</strong> — Severe violations, including security breaches, fraud, or illegal activity, will result in immediate and permanent account termination.</span></li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Legal Action</strong> — We reserve the right to pursue legal remedies for violations that cause harm to Lux Automaton, its users, or third parties.</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">6. Reporting Violations</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>If you become aware of any violation of this AUP, please report it immediately to abuse@luxautomaton.com. All reports are investigated promptly and handled with strict confidentiality. We do not tolerate retaliation against users who report violations in good faith.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-3">
            <h2 className="text-xl font-bold">Questions About This Policy?</h2>
            <p className="text-muted-foreground">Contact us at legal@luxautomaton.com or through the Support section in your dashboard.</p>
            <div className="text-sm space-y-1">
              <p><strong className="text-foreground">Lux Automaton LLC</strong></p>
              <p className="text-muted-foreground">Portland, Oregon</p>
            </div>
          </div>

        </div>
      </section>
    </PublicPageLayout>
  );
}
