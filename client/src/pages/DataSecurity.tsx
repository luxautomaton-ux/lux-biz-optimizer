import PublicPageLayout from "@/components/PublicPageLayout";
import { Shield, Lock, Server, Eye, Fingerprint, AlertTriangle, CheckCircle } from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

export default function DataSecurity() {
  const securityLayers = [
    { icon: Lock, title: "AES-256 Encryption", desc: "The gold standard of encryption, approved by the NSA for top-secret classified information. Every byte of your data — at rest and in transit — is encrypted with 256-bit Advanced Encryption Standard keys.", color: "text-lux-gold" },
    { icon: Shield, title: "TLS 1.3 Transport", desc: "All communications use the latest Transport Layer Security protocol with perfect forward secrecy, ensuring that even if a key is compromised in the future, past communications remain secure.", color: "text-lux-gold" },
    { icon: Fingerprint, title: "Zero-Trust Architecture", desc: "Every request is authenticated and authorized regardless of network location. No user, device, or network is implicitly trusted. Continuous verification is enforced at every access point.", color: "text-lux-gold" },
    { icon: Server, title: "SOC 2 Type II Infrastructure", desc: "Our cloud infrastructure maintains SOC 2 Type II certification, demonstrating continuous compliance with security, availability, processing integrity, confidentiality, and privacy trust principles.", color: "text-lux-gold" },
    { icon: Eye, title: "24/7 Security Operations Center", desc: "Real-time monitoring by automated systems and security professionals. Intrusion detection, anomaly detection, and automated threat response operate around the clock.", color: "text-lux-gold" },
    { icon: AlertTriangle, title: "DDoS Mitigation", desc: "Enterprise-grade distributed denial-of-service protection absorbs and mitigates volumetric, protocol, and application-layer attacks before they reach our infrastructure.", color: "text-lux-gold" },
  ];

  const compliance = [
    { label: "CCPA Compliant", desc: "California Consumer Privacy Act" },
    { label: "GDPR Ready", desc: "General Data Protection Regulation" },
    { label: "PCI DSS Level 1", desc: "Payment Card Industry (via Stripe)" },
    { label: "SOC 2 Type II", desc: "Service Organization Controls" },
    { label: "COPPA Compliant", desc: "Children's Online Privacy Protection" },
    { label: "DoD 5220.22-M", desc: "Data Sanitization Standard" },
  ];

  return (
    <PublicPageLayout activeNav="Security">
      <section className="pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lux-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src={ICONS_3D.shieldVerified} alt="" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Military-Grade <span className="text-gradient-gold">Data Security</span></h1>
              <p className="text-muted-foreground mt-1">Your data is protected by the same standards used by the U.S. Department of Defense</p>
            </div>
          </div>
          <div className="mt-6 p-5 rounded-xl border border-lux-gold/30 bg-gradient-to-r from-lux-gold/10 to-lux-orange/10 flex items-start gap-4">
            <Shield className="h-8 w-8 text-lux-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-lux-gold text-lg">DEFENSE-GRADE SECURITY POSTURE</p>
              <p className="text-sm text-muted-foreground mt-2">Lux Automaton treats every piece of your business data as if it were classified information. We employ the same encryption standards, access controls, and data handling protocols used by military and intelligence organizations worldwide. Security is not a feature — it is the foundation of everything we build.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Six Layers of Protection</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {securityLayers.map((layer, i) => (
              <div key={i} className="p-5 rounded-xl border border-border/30 bg-card/30 hover:border-lux-gold/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                    <layer.icon className="h-5 w-5 text-lux-gold" />
                  </div>
                  <h3 className="font-bold text-foreground">{layer.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Secure Data Lifecycle</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Collection", desc: "Data is collected over TLS 1.3 encrypted connections. Only the minimum required data is collected (data minimization principle). All form inputs are sanitized to prevent injection attacks." },
              { step: "2", title: "Processing", desc: "Data is processed in isolated, encrypted environments. AI analysis occurs in sandboxed containers with no persistent storage. Processing logs are encrypted and access-controlled." },
              { step: "3", title: "Storage", desc: "All data at rest is encrypted with AES-256. Database records are stored in geographically redundant, SOC 2 Type II certified data centers. Backups are encrypted with separate keys." },
              { step: "4", title: "Access", desc: "Zero-trust access controls enforce authentication and authorization for every request. All access is logged with immutable audit trails. Role-based permissions ensure least-privilege access." },
              { step: "5", title: "Deletion", desc: "When you request data deletion, all records are permanently destroyed using DoD 5220.22-M standard — a multi-pass overwrite protocol that makes data recovery impossible, even with forensic tools." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-5 rounded-xl border border-border/30 bg-card/30">
                <div className="h-10 w-10 rounded-full bg-lux-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-lux-gold font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Compliance & Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {compliance.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-lux-gold/20 bg-lux-gold/5 text-center">
                <CheckCircle className="h-6 w-6 text-lux-gold mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-3">
            <h2 className="text-xl font-bold">Responsible Disclosure</h2>
            <p className="text-muted-foreground">If you discover a security vulnerability, please report it responsibly to our security team at security@luxautomaton.com. We appreciate the security research community and will acknowledge valid reports. Please do not publicly disclose vulnerabilities before we have had the opportunity to address them.</p>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
