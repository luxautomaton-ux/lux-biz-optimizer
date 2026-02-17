import PublicPageLayout from "@/components/PublicPageLayout";
import { Shield, Lock, Eye, FileText, AlertTriangle, Scale, Server } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

const EFFECTIVE_DATE = "February 7, 2026";

export default function TermsOfService() {
  return (
    <PublicPageLayout activeNav="Terms">
      {/* Hero */}
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.shieldVerified} alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Terms of <span className="text-gradient-gold">Service</span>
              </h1>
              <p className="text-muted-foreground mt-1">Effective Date: {EFFECTIVE_DATE}</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl border border-lux-gold/20 bg-lux-gold/5 flex items-start gap-4">
            <Shield className="h-6 w-6 text-lux-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lux-gold text-sm">MILITARY-GRADE SECURITY PROTECTED</p>
              <p className="text-sm text-muted-foreground mt-1">
                All data transmitted to and from Lux Biz Optimizer is protected by AES-256 military-grade encryption, 
                the same standard used by the U.S. Department of Defense. Your business data is secured with 
                enterprise-level firewalls, intrusion detection systems, and zero-trust architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>By accessing or using the Lux Biz Optimizer platform ("Service"), operated by Lux Automaton LLC ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not access or use the Service.</p>
              <p>These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to individual users, business owners, reseller partners, and enterprise clients. By creating an account, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">2. Description of Service</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>Lux Biz Optimizer is an AI-powered business intelligence platform that provides business auditing, AI visibility scoring, competitor analysis, lead generation, Google rank optimization, AI ad creation, revenue growth strategies, and automated business optimization services. The platform utilizes advanced artificial intelligence including integrations with ChatGPT, Google Gemini, and Perplexity AI to deliver comprehensive business intelligence.</p>
              <p>The Service includes free-tier features (limited scan previews), paid one-time audits ($500–$2,000), subscription plans (Starter, Professional, Enterprise), and premium add-on tools including the AI Agent, Lead Generator, Google Rank Optimizer, and AI Ad Creator.</p>
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-xl border border-lux-gold/20 bg-lux-gold/5">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold text-lux-gold">3. Military-Grade Data Security</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We take the security of your data with the utmost seriousness. Lux Biz Optimizer employs <strong className="text-foreground"> military-grade security protocols</strong> to protect all user data:</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">AES-256 Encryption</strong> — All data at rest and in transit is encrypted using Advanced Encryption Standard with 256-bit keys, the same encryption standard approved by the National Security Agency (NSA) for top-secret classified information.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">TLS 1.3 Transport Security</strong> — All communications between your browser and our servers use the latest Transport Layer Security protocol, ensuring perfect forward secrecy.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Zero-Trust Architecture</strong> — Every request is authenticated and authorized regardless of network location. No implicit trust is granted to any user, device, or network.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">SOC 2 Type II Compliant Infrastructure</strong> — Our cloud infrastructure partners maintain SOC 2 Type II certification, ensuring continuous monitoring and auditing of security controls.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Intrusion Detection & Prevention</strong> — Real-time monitoring with automated threat response, DDoS mitigation, and 24/7 security operations center (SOC) monitoring.</span></li>
                <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-lux-gold shrink-0 mt-1" /><span><strong className="text-foreground">Data Isolation</strong> — Each customer's data is logically isolated with strict access controls, ensuring no cross-tenant data leakage.</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">4. User Accounts & Authentication</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>When you create an account, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
              <p>Authentication is handled through Firebase Authentication with military-grade session management. All passwords are hashed using bcrypt with salt rounds, and session tokens are signed with JWT using RS256 cryptographic signatures. Multi-factor authentication (MFA) is available and recommended for all accounts.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={ICONS_3D.dollarCoin} alt="" className="h-5 w-5 object-contain" />
              <h2 className="text-2xl font-bold">5. Payment Terms</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>Certain features of the Service require payment. All payments are processed securely through Stripe, a PCI DSS Level 1 certified payment processor — the highest level of certification available. Your payment information is never stored on our servers; it is transmitted directly to Stripe using tokenized encryption.</p>
              <p>Subscription fees are billed in advance on a monthly or annual basis. You may cancel your subscription at any time through your account settings. Refunds for one-time audit purchases are available within 7 days of purchase if the audit has not been generated. Once an audit is generated, no refunds will be issued as the AI processing costs are incurred immediately.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">6. Intellectual Property</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Lux Automaton LLC. The Service is protected by copyright, trademark, and other laws of the United States and foreign countries.</p>
              <p>You retain ownership of all business data, company profiles, and content you submit to the Service. By submitting content, you grant us a limited, non-exclusive license to use, process, and analyze your content solely for the purpose of providing the Service. AI-generated content (audit reports, ad copy, optimization recommendations) created by the Service for your business becomes your property upon generation.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={ICONS_3D.handshake} alt="" className="h-5 w-5 object-contain" />
              <h2 className="text-2xl font-bold">7. Reseller & Partner Program</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>Approved reseller partners ("Partners") may refer customers to the Service and earn commission on referred customer revenue for a period of twelve (12) months from the date of referral. Commission rates are set at the time of partner approval and are subject to the Partner Agreement.</p>
              <p>Partners are paid via Stripe Connect on a monthly basis for approved commissions. Partners must maintain with 30 days written notice. Partners may not make false or misleading claims about the Service.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">8. Prohibited Uses</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>You agree not to use the Service to:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Violate any applicable law, regulation, or third-party rights</li>
                <li>Transmit malware, viruses, or any code of a destructive nature</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Use the Service to generate false, misleading, or defamatory content</li>
                <li>Scrape, data mine, or extract data from the Service without authorization</li>
                <li>Resell access to the Service without an approved Partner Agreement</li>
                <li>Use the Service to harass, abuse, or harm another person or business</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">9. Limitation of Liability</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, LUX AUTOMATON LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.</p>
              <p>Our total liability for any claims under these Terms shall not exceed the amount you paid to us during the twelve (12) months preceding the claim. AI-generated recommendations and audit scores are provided as guidance and do not constitute professional business, legal, or financial advice.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">10. Account Termination & Data Deletion</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>You may terminate your account at any time through your account settings. Upon termination, you may request complete deletion of all your data. We will process data deletion requests within 30 days and provide written confirmation. Data is permanently destroyed using DoD 5220.22-M standard data sanitization methods — the same protocol used by the U.S. Department of Defense for classified data destruction.</p>
              <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we determine violates these Terms, is harmful to other users, or is harmful to us or third parties.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">11. Governing Law</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-lux-gold" />
              <h2 className="text-2xl font-bold">12. Changes to Terms</h2>
            </div>
            <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use the Service after those revisions become effective, you agree to be bound by the revised terms.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-3">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground">If you have any questions about these Terms of Service, please contact us at:</p>
            <div className="text-sm space-y-1">
              <p><strong className="text-foreground">Lux Automaton LLC</strong></p>
              <p className="text-muted-foreground">Email: legal@luxautomaton.com</p>
              <p className="text-muted-foreground">Website: luxautomaton.com</p>
            </div>
          </div>

        </div>
      </section>
    </PublicPageLayout>
  );
}
