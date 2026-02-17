import PublicPageLayout from "@/components/PublicPageLayout";
import { Shield, Lock, Eye, Globe, Server, Database, UserX, Bell } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

const EFFECTIVE_DATE = "February 7, 2026";

export default function PrivacyNotice() {
  return (
    <PublicPageLayout activeNav="Privacy">
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.shieldVerified} alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Privacy <span className="text-gradient-gold">Notice</span></h1>
              <p className="text-muted-foreground mt-1">Effective Date: {EFFECTIVE_DATE}</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl border border-lux-gold/20 bg-lux-gold/5 flex items-start gap-4">
            <Lock className="h-6 w-6 text-lux-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lux-gold text-sm">YOUR DATA IS PROTECTED BY MILITARY-GRADE ENCRYPTION</p>
              <p className="text-sm text-muted-foreground mt-1">Lux Automaton employs AES-256 encryption, zero-trust architecture, and DoD-standard data handling protocols. We never sell, share, or monetize your personal or business data. Your privacy is not just a policy — it is an operational security mandate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Database className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">1. Information We Collect</h2></div>
            <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed">
              <div><h3 className="text-foreground font-semibold mb-2">Account Information</h3><p>When you create an account, we collect your name, email address, and password (stored as a cryptographic hash — we never see or store your plaintext password). If you sign up through a third-party provider, we receive your name and email from that provider.</p></div>
              <div><h3 className="text-foreground font-semibold mb-2">Business Information</h3><p>When you create a company profile or run an audit, we collect your business name, industry, location, description, website, phone number, email, services offered, and target audience. This information is used exclusively to generate your AI audit and optimization recommendations.</p></div>
              <div><h3 className="text-foreground font-semibold mb-2">Usage Data</h3><p>We automatically collect information about how you interact with the Service, including pages visited, features used, audit generation timestamps, and general analytics. This data is anonymized and used solely to improve the Service.</p></div>
              <div><h3 className="text-foreground font-semibold mb-2">Payment Information</h3><p>Payment processing is handled entirely by Stripe. We never receive, store, or have access to your full credit card number, CVV, or banking details. We only receive a transaction confirmation and the last four digits of your card for receipt purposes.</p></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Server className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">2. How We Use Your Information</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We use the information we collect exclusively for the following purposes:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Service Delivery</strong> — To generate AI audits, competitor analyses, lead generation, ad creation, and optimization recommendations for your business.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Account Management</strong> — To create and manage your account, process payments, and provide customer support.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Service Improvement</strong> — To analyze anonymized usage patterns and improve the accuracy of our AI models and user experience.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Security</strong> — To detect, prevent, and address technical issues, fraud, and security threats.</span></li>
              </ul>
              <p className="font-semibold text-lux-gold">We NEVER sell, rent, trade, or share your personal or business data with third parties for marketing purposes.</p>
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-xl border border-lux-gold/20 bg-lux-gold/5">
            <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold text-lux-gold">3. Military-Grade Data Protection Measures</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Encryption at Rest</h4><p className="text-sm">AES-256 encryption for all stored data, including database records, file storage, and backups.</p></div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Encryption in Transit</h4><p className="text-sm">TLS 1.3 with perfect forward secrecy for all data transmitted between your device and our servers.</p></div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Access Controls</h4><p className="text-sm">Role-based access control (RBAC) with principle of least privilege. All access is logged and audited.</p></div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Secure Infrastructure</h4><p className="text-sm">Hosted on SOC 2 Type II certified cloud infrastructure with geographic redundancy and 99.99% uptime SLA.</p></div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Penetration Testing</h4><p className="text-sm">Regular third-party penetration testing and vulnerability assessments to identify and remediate threats.</p></div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30"><h4 className="font-semibold text-foreground mb-1">Incident Response</h4><p className="text-sm">24/7 security monitoring with documented incident response procedures and breach notification within 72 hours.</p></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">4. Third-Party Services</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We integrate with the following third-party services to deliver the Service. Each maintains their own privacy policies:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Google Maps Platform</strong> — Used to retrieve publicly available business listing data, reviews, and location information.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">OpenAI (ChatGPT)</strong> — Used for AI analysis. Your business data is sent to OpenAI's API for processing but is not used to train their models per our enterprise agreement.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Stripe</strong> — PCI DSS Level 1 certified payment processor. Handles all payment data independently.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Firebase</strong> — Used for authentication services. Google Cloud's security infrastructure protects authentication data.</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><UserX className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">5. Your Rights (CCPA / GDPR)</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>Regardless of your location, we extend the following rights to all users:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Right to Access</strong> — You may request a complete copy of all personal data we hold about you.</span></li>
                <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Right to Rectification</strong> — You may update or correct your personal information at any time through your account settings.</span></li>
                <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Right to Deletion</strong> — You may request complete deletion of your account and all associated data. Deletion is performed using DoD 5220.22-M standard data sanitization.</span></li>
                <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Right to Portability</strong> — You may export your data in a machine-readable format (CSV, JSON, PDF).</span></li>
                <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Right to Object</strong> — You may object to the processing of your personal data for specific purposes.</span></li>
              </ul>
              <p>To exercise any of these rights, contact us at privacy@luxautomaton.com or through the Support section in your account.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Database className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">6. Data Retention</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We retain your personal data only for as long as necessary to provide the Service and fulfill the purposes described in this Privacy Notice. When you delete your account, all personal data is permanently destroyed within 30 days using military-grade data sanitization protocols. Anonymized, aggregated data that cannot be linked back to any individual may be retained indefinitely for analytical purposes.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">7. Children's Privacy</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>The Service is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal data from a child under 18, we will take immediate steps to delete that information.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-lux-gold" /><h2 className="text-2xl font-bold">8. Changes to This Privacy Notice</h2></div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We may update this Privacy Notice from time to time. We will notify you of any material changes by posting the new Privacy Notice on this page and updating the "Effective Date" at the top. For significant changes, we will provide additional notice via email or in-app notification. We encourage you to review this Privacy Notice periodically.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-3">
            <h2 className="text-xl font-bold">Contact Our Privacy Team</h2>
            <p className="text-muted-foreground">For any privacy-related questions, data requests, or concerns:</p>
            <div className="text-sm space-y-1">
              <p><strong className="text-foreground">Lux Automaton LLC — Privacy Office</strong></p>
              <p className="text-muted-foreground">Email: privacy@luxautomaton.com</p>
              <p className="text-muted-foreground">Website: luxautomaton.com</p>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
