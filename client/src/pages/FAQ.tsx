import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";
import { useState } from "react";
import PublicPageLayout from "@/components/PublicPageLayout";

interface FAQItem { q: string; a: string; category: string; }

const faqs: FAQItem[] = [
  { category: "Security", q: "How secure is my business data?", a: "Your data is protected by military-grade AES-256 encryption — the same standard used by the U.S. Department of Defense and NSA for top-secret classified information. All data in transit uses TLS 1.3 with perfect forward secrecy. Our infrastructure is SOC 2 Type II certified with 24/7 security monitoring, intrusion detection, and automated threat response." },
  { category: "Security", q: "Do you sell or share my data with third parties?", a: "Absolutely not. We never sell, rent, trade, or share your personal or business data with any third party for marketing or advertising purposes. Your data is used exclusively to deliver the Service to you. When we use AI providers (OpenAI, Google) for analysis, your data is processed under enterprise agreements that prohibit them from using your data for model training." },
  { category: "Security", q: "What happens to my data if I delete my account?", a: "When you request account deletion, all your personal and business data is permanently destroyed within 30 days using DoD 5220.22-M standard data sanitization — the same protocol used by the U.S. military for classified data destruction. You will receive written confirmation once deletion is complete. This process is irreversible." },
  { category: "Security", q: "Is my payment information safe?", a: "All payments are processed by Stripe, a PCI DSS Level 1 certified payment processor — the highest level of security certification in the payments industry. Your credit card number, CVV, and banking details are never stored on our servers. We only receive a transaction confirmation and the last four digits for receipt purposes." },
  { category: "Platform", q: "What is Lux Biz Optimizer?", a: "Lux Biz Optimizer is an AI-powered business intelligence platform that audits your business's visibility across AI platforms (ChatGPT, Google Gemini, Perplexity), analyzes your Google Business Profile, compares you to competitors, and provides actionable recommendations to optimize your business for the AI era. It's built by Lux Automaton LLC." },
  { category: "Platform", q: "How does the AI audit work?", a: "Our AI agent queries multiple AI platforms (ChatGPT, Gemini, Perplexity) with prompts a real customer would use to find businesses like yours. It then analyzes whether your business appears in AI responses, scores your visibility, identifies gaps, and generates a comprehensive report with specific actions to improve your ranking." },
  { category: "Platform", q: "What AI tools are available?", a: "We offer several premium AI tools: AI Agent (automated business optimization), Google Rank Optimizer (deep SEO analysis and auto-fix), AI Ad Creator (platform-specific ad copy for Facebook, Instagram, TikTok, X, LinkedIn, and AI chatbots), Lead Generator (find potential customers), Revenue & Growth (AI-powered revenue strategies with SaaS recommendations), Shopify Store Optimizer (full e-commerce audit and auto-fix), and Niche Scanner (market opportunity analysis)." },
  { category: "Platform", q: "Can the AI Agent automatically fix issues?", a: "Yes! The AI Agent can detect errors in your business listings, website SEO, and AI visibility, then automatically generate fixes. It has access to all optimization tools and will research the best solutions using multiple AI models. For changes that require your approval, it will present recommendations for you to review before implementation." },
  { category: "Billing", q: "What are the pricing tiers?", a: "We offer flexible pricing: Free tier (limited scan preview), one-time audits ($500–$2,000 depending on depth), and subscription plans — Starter ($99/mo), Professional ($249/mo), and Enterprise (custom pricing). Each tier unlocks progressively more AI tools and features. Annual plans receive a 20% discount." },
  { category: "Billing", q: "Can I cancel my subscription?", a: "Yes, you can cancel your subscription at any time through your account Settings page. Your access continues until the end of your current billing period. No cancellation fees are charged. You can also request complete data deletion if you wish." },
  { category: "Billing", q: "Do you offer refunds?", a: "Refunds for one-time audit purchases are available within 7 days if the audit has not been generated. Once an audit is generated, no refunds are issued as AI processing costs are incurred immediately. Subscription refunds are handled on a case-by-case basis — contact our support team." },
  { category: "Partner", q: "How does the Reseller/Partner Program work?", a: "SaaS companies and agencies can apply to become reseller partners. Approved partners earn commission on all referred customer revenue for 12 months from the date of referral. Partners get a dedicated dashboard to manage their customers, track earnings, and view analytics. Payments are processed monthly via Stripe Connect." },
  { category: "Partner", q: "What commission do partners earn?", a: "Commission rates are set during the partner approval process and vary based on volume commitments and partner tier. Partners receive monthly payouts via Stripe Connect for all approved commissions. The Partner Dashboard provides real-time tracking of referrals, conversions, and earnings." },
  { category: "Support", q: "How do I get help?", a: "You can submit a support ticket through the Support section in your dashboard. Our AI Agent handles first-line customer service and can resolve most issues instantly. For complex issues that the AI cannot resolve, your ticket is escalated to our human support team and the admin is notified via email. We aim to respond to all escalated tickets within 24 hours." },
  { category: "Support", q: "What are your support hours?", a: "Our AI Agent provides 24/7 instant support for common questions and issues. Human support is available Monday through Friday, 9 AM to 6 PM Pacific Time. Enterprise customers receive priority support with dedicated account managers." },
];

const categories = ["Security", "Platform", "Billing", "Partner", "Support"];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/30 rounded-xl overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors">
        <span className="font-semibold text-foreground pr-4">{item.q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-lux-gold shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border/20 pt-4">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("Security");

  return (
    <PublicPageLayout activeNav="FAQs">
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.aiBot} alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Frequently Asked <span className="text-gradient-gold">Questions</span>
              </h1>
              <p className="text-muted-foreground mt-1">Everything you need to know about Lux Biz Optimizer</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl border border-lux-gold/20 bg-lux-gold/5 flex items-start gap-4">
            <Shield className="h-6 w-6 text-lux-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lux-gold text-sm">MILITARY-GRADE SECURITY ACROSS ALL OPERATIONS</p>
              <p className="text-sm text-muted-foreground mt-1">Every interaction with our platform is protected by AES-256 encryption and zero-trust security architecture. Your questions, data, and business information are always secure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-lux-gold text-black" : "bg-card/50 text-muted-foreground hover:bg-card border border-border/30"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {faqs.filter(f => f.category === activeCategory).map((item, i) => (
              <FAQAccordion key={i} item={item} />
            ))}
          </div>
          <div className="mt-12 p-6 rounded-xl border border-border/30 bg-card/50 text-center">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">Our AI Agent is available 24/7 to help, or submit a support ticket for human assistance.</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => setLocation("/agent")} className="bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">Ask AI Agent</Button>
              <Button onClick={() => setLocation("/support")} variant="outline" className="border-lux-gold/30 text-lux-gold hover:bg-lux-gold/10">Submit Ticket</Button>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
