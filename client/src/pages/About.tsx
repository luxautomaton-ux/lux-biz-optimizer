import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ICONS_3D } from "@/lib/icons3d";
import {
  ArrowRight, Cpu, GraduationCap, Palette,
  Sparkles, Target, Globe, Zap, CheckCircle,
} from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";

const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";
const AGENT_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/GJymFbXargxhNYgZ.png";

const NEON_OFFICE = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/MxCZGVBCJJRutaPb.jpg";
const DARK_OFFICE = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/VSueCVfEusONpkEq.jpg";
const CITY_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/nAKshaLHJakryYZW.jpg";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <PublicPageLayout activeNav="About">
      {/* Hero with Neon Office */}
      <section className="relative min-h-[60vh] flex items-center justify-center -mt-8">
        <div className="absolute inset-0">
          <img src={NEON_OFFICE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
              <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-14 w-auto object-contain" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6">
              <span className="text-foreground">About</span><br />
              <span className="text-gradient-gold">Lux Automaton</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-4 leading-relaxed">
              Building the future of AI-powered business. We design intelligent tools, automation platforms, and education experiences that make advanced technology accessible to everyone.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-lux-gold/60 max-w-xl mx-auto italic font-display">
              "We don't just build software. We build intelligent ecosystems."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_80_/_0.03),transparent_60%)]" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Our Mission</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-8">
            Make AI <span className="text-gradient-gold">Practical, Powerful & Profitable</span>
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-8">
            Lux Automaton is an AI innovation company dedicated to helping entrepreneurs, creators, and small businesses turn artificial intelligence into real growth, real systems, and real income. Founded on the belief that AI should empower people — not overwhelm them.
          </p>
          <p className="text-foreground/60 leading-relaxed max-w-3xl mx-auto">
            We believe the next generation of entrepreneurs won't be limited by resources — they'll be amplified by intelligent systems. From AI-driven SaaS platforms to digital education and media innovation, Lux Automaton exists to simplify complexity and help people move faster in an AI-first world.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-24 px-4 bg-card/30 border-y border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">What We Do</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Three Core Pillars</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Where automation, creativity, and strategy come together to transform modern business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon3d: ICONS_3D.gear, lucide: Cpu, title: "AI Software & Automation", desc: "We create intelligent tools and AI agents designed to streamline business workflows — from finance and compliance to marketing, productivity, and decision-making.", color: "from-lux-gold/20 to-lux-gold/5", accent: "border-lux-gold/30" },
              { icon3d: ICONS_3D.trophy, lucide: GraduationCap, title: "Education & Digital Growth", desc: "Through platforms like Study AI Courses and community-driven programs, we help individuals learn how to use AI to build skills, increase income, and future-proof their careers.", color: "from-lux-purple/20 to-lux-purple/5", accent: "border-lux-purple/30" },
              { icon3d: ICONS_3D.diamond, lucide: Palette, title: "Creative Innovation & Media", desc: "Lux Automaton blends technology with storytelling, helping brands and creators build powerful digital identities powered by AI-assisted design, content, and strategy.", color: "from-lux-cyan/20 to-lux-cyan/5", accent: "border-lux-cyan/30" },
            ].map((pillar, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className={`relative p-8 rounded-2xl bg-card border ${pillar.accent} hover:border-lux-gold/30 transition-all group overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-lux-gold/10 flex items-center justify-center mb-6 group-hover:bg-lux-gold/20 transition-colors overflow-hidden">
                    <img src={pillar.icon3d} alt="" className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lux Biz Optimizer Product Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CITY_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Our Flagship Product</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6"><span className="text-gradient-gold">Lux Biz Optimizer</span></h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">Our AI-powered business visibility platform scans your Google Business Profile, scores you across ChatGPT, Gemini, and Perplexity, compares you to top competitors, and reveals exactly how much money you're leaving on the table.</p>
              <div className="space-y-3 mb-8">
                {["50+ data points scanned from Google Maps", "Per-LLM scoring for ChatGPT, Gemini & Perplexity", "AI Agent that auto-fixes visibility issues", "Beautiful branded PDF reports with ROI calculator", "Lead generator to find businesses that need your help"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-lux-gold shrink-0" /><span className="text-sm text-foreground/80">{item}</span></div>
                ))}
              </div>
              <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={() => setLocation("/dashboard")}><Zap className="w-4 h-4" /> Try It Free</Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 border-lux-gold/20 shadow-2xl bg-card/50 backdrop-blur-sm flex items-center justify-center">
                  <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="w-48 h-auto object-contain" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-card border border-lux-gold/30 rounded-xl px-4 py-3 shadow-xl">
                  <div className="text-xs text-muted-foreground">AI Visibility</div>
                  <div className="text-sm font-bold text-lux-gold">Platform Live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.55_0.25_290_/_0.04),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-lux-gold/20 shadow-2xl">
                  <img src={AGENT_PHOTO} alt="Asa Spade — Founder" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card border border-lux-gold/30 rounded-xl px-4 py-3 shadow-xl">
                  <div className="text-xs text-muted-foreground">Founder & CEO</div>
                  <div className="text-sm font-bold text-lux-gold">Asa Spade</div>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-lux-gold flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">Meet the Founder</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6"><span className="text-gradient-gold">Asa Spade</span></h2>
              <p className="text-foreground/70 mb-4 leading-relaxed">Lux Automaton was founded by Asa Spade, a visionary entrepreneur, AI strategist, and creative technologist based in Portland, Oregon.</p>
              <p className="text-foreground/60 mb-4 leading-relaxed">Known for blending business strategy with cutting-edge technology, Asa built Lux Automaton to bridge the gap between innovation and real-world application. His work focuses on helping individuals and organizations leverage AI not just as a tool, but as a strategic partner for growth.</p>
              <p className="text-foreground/60 mb-6 leading-relaxed">With a background rooted in entrepreneurship, digital transformation, and community building, Asa has developed multiple AI-driven initiatives focused on financial automation, education, and intelligent business systems. His leadership combines creative vision with practical execution — empowering others to build smarter businesses and unlock new opportunities in the AI era.</p>
              <p className="text-sm text-lux-gold/60 italic font-display">"For Asa, Lux Automaton isn't just a company — it's a platform for innovation, learning, and long-term impact."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={DARK_OFFICE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <div className="text-xs tracking-[0.3em] text-lux-gold/60 mb-4 uppercase">The Vision Ahead</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Building <span className="text-gradient-gold">What's Next</span>
          </h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">As AI continues to reshape industries, Lux Automaton is committed to building systems that put people at the center of technology. Our goal is to create tools and experiences that make automation feel human, learning feel accessible, and growth feel achievable.</p>
          <p className="text-foreground/60 mb-10 max-w-xl mx-auto">We're not just building apps. We're building the future of intelligent entrepreneurship.</p>
          <Button size="lg" className="text-lg px-12 h-16 gap-3 bg-lux-gold text-black hover:bg-lux-gold/90 font-bold shadow-2xl glow-gold" onClick={() => setLocation("/dashboard")}>
            <Sparkles className="w-5 h-5" /> Start Your AI Audit
          </Button>
        </div>
      </section>

      {/* Ecosystem Logos */}
      <section className="py-16 px-4 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs tracking-[0.3em] text-muted-foreground/50 mb-8 uppercase">The Lux Ecosystem</div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setLocation("/")}>
              <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-12 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Lux Biz Optimizer</span>
            </div>
            <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <img src={LUX_WRITEOFF_LOGO} alt="Lux WriteOff" className="h-12 w-auto object-contain rounded-lg" />
              <span className="text-[10px] text-muted-foreground group-hover:text-lux-gold transition-colors">Lux WriteOff</span>
            </a>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-12 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Lux Automaton</span>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
