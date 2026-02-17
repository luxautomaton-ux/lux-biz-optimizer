import PublicPageLayout from "@/components/PublicPageLayout";
import { Shield, Cookie, Lock } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

const EFFECTIVE_DATE = "February 7, 2026";

export default function CookiePolicy() {
  return (
    <PublicPageLayout activeNav="Cookies">
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.shieldVerified} alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Cookie <span className="text-gradient-gold">Policy</span></h1>
              <p className="text-muted-foreground mt-1">Effective Date: {EFFECTIVE_DATE}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Cookie className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">1. What Are Cookies</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to the website owners. Lux Biz Optimizer uses cookies strictly for essential functionality and security — never for advertising or tracking.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">2. Cookies We Use</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-card/50">
                      <th className="text-left p-3 font-semibold text-foreground border-b border-border/30">Cookie</th>
                      <th className="text-left p-3 font-semibold text-foreground border-b border-border/30">Purpose</th>
                      <th className="text-left p-3 font-semibold text-foreground border-b border-border/30">Duration</th>
                      <th className="text-left p-3 font-semibold text-foreground border-b border-border/30">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-mono text-xs">session_token</td>
                      <td className="p-3">Authentication — keeps you signed in securely</td>
                      <td className="p-3">7 days</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-lux-gold/10 text-lux-gold text-xs font-medium">Essential</span></td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-mono text-xs">csrf_token</td>
                      <td className="p-3">Security — prevents cross-site request forgery attacks</td>
                      <td className="p-3">Session</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-lux-gold/10 text-lux-gold text-xs font-medium">Essential</span></td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-mono text-xs">sidebar_width</td>
                      <td className="p-3">Preference — remembers your sidebar width setting</td>
                      <td className="p-3">Persistent</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">Functional</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs">theme</td>
                      <td className="p-3">Preference — remembers your dark/light theme choice</td>
                      <td className="p-3">Persistent</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">Functional</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">We do <strong className="text-foreground">not</strong> use any advertising cookies, tracking cookies, or third-party analytics cookies. We do not participate in any ad networks or cookie-based retargeting.</p>
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-xl border border-lux-gold/20 bg-lux-gold/5">
            <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold text-lux-gold">3. Cookie Security</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>All authentication cookies are:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">HttpOnly</strong> — Cannot be accessed by JavaScript, preventing XSS attacks</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Secure</strong> — Only transmitted over HTTPS encrypted connections</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">SameSite=Strict</strong> — Prevents cross-site request forgery</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Signed with RS256</strong> — Cryptographically signed to prevent tampering</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Cookie className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">4. Managing Cookies</h2></div>
            <div className="pl-8 text-muted-foreground leading-relaxed space-y-3">
              <p>You can control and delete cookies through your browser settings. However, disabling essential cookies will prevent you from signing in and using the Service. Most browsers allow you to refuse cookies, delete existing cookies, and set preferences for specific websites.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-3">
            <h2 className="text-xl font-bold">Questions About Cookies?</h2>
            <p className="text-muted-foreground">Contact us at privacy@luxautomaton.com</p>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
