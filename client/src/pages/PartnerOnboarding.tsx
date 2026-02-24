import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ICONS_3D } from "@/lib/icons3d";
import {
    CheckCircle, ArrowRight, Handshake, Target, DollarSign, BarChart3,
    Copy, Users, Sparkles, Zap, MessageSquare, Globe, FileText,
    TrendingUp, Shield, Star, ExternalLink, Crown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const STEPS = [
    {
        id: 1,
        title: "Platform Overview",
        icon: Zap,
        color: "from-lux-gold/20 to-amber-600/10",
        borderColor: "border-lux-gold/20",
        tagColor: "text-lux-gold",
        description: "Understand the full power of Lux Biz Optimizer",
        content: [
            {
                heading: "What You're Selling",
                body: "Lux Biz Optimizer is an AI-powered business visibility platform. Local businesses are invisible to AI search engines like ChatGPT, Gemini, and Perplexity — costing them thousands in lost customers monthly. You help them fix that.",
            },
            {
                heading: "The Core Product",
                body: "An AI Visibility Audit that shows business owners exactly where they're losing customers, with an AI Agent that automatically fixes the issues. Deep dive features include Lead Generation, Google Rank Optimization, AI Ad Creation, and Shopify Store audits.",
            },
            {
                heading: "Your Edge",
                body: "No other platform gives local businesses this level of AI-specific visibility analysis. Wellows charges $200-500/mo for basic LLM tracking. You offer the full suite plus automatic fixes.",
            },
        ],
        checklist: [
            "Sign in and create a test company profile",
            "Run a full audit on a sample business",
            "Explore the AI Agent and see auto-fix in action",
            "Export a PDF report to see the client deliverable",
        ],
    },
    {
        id: 2,
        title: "Getting Clients to Sign Up",
        icon: Target,
        color: "from-emerald-500/20 to-green-600/10",
        borderColor: "border-emerald-500/20",
        tagColor: "text-emerald-400",
        description: "The proven outreach system that closes deals",
        content: [
            {
                heading: "The Free Audit Hook",
                body: "Run a free audit for a prospect before calling them. Pull up the results on a screen share and show the \"Revenue Leak\" section. Asking \"Did you know ChatGPT can't recommend your business?\" opens every conversation.",
            },
            {
                heading: "Your Referral Link",
                body: "Every signup through your link gets tracked automatically. Share it via email, LinkedIn, Instagram DMs, or in-person. Use UTM params to track different channels: ?ref=LUX-[YourID]&src=linkedin",
            },
            {
                heading: "Who to Target",
                body: "Best prospects: local service businesses (plumbers, dentists, salons, restaurants) with 3-4 star ratings, fewer than 50 Google reviews, no website, or outdated content. Use the Lead Generator to find hundreds in minutes.",
            },
        ],
        checklist: [
            "Use the Lead Generator to pull 100+ local businesses",
            "Filter for low reviews, no website, poor AI visibility",
            "Send the Free Audit outreach message (below)",
            "Follow up with the Revenue Leak PDF report",
        ],
        template: `Subject: ChatGPT can't find your business (I checked)

Hi [Name],

I ran an AI Visibility scan for [Business Name] and noticed you're losing approximately $[Loss]/month because ChatGPT, Gemini, and voice assistants can't find your services.

I put together a quick report — can I send it over?

[Your Name]`,
    },
    {
        id: 3,
        title: "Dashboard Walkthrough",
        icon: BarChart3,
        color: "from-blue-500/20 to-indigo-600/10",
        borderColor: "border-blue-500/20",
        tagColor: "text-blue-400",
        description: "Master every feature you'll be using with clients",
        items: [
            { icon: FileText, title: "Audit Dashboard", desc: "Your first deliverable for every client. Shows their AI Visibility Score, Revenue Leak, and competitor comparison. Always the starting point." },
            { icon: Target, title: "Lead Generator", desc: "Search businesses by niche + location. Filter by low reviews, missing website, poor photos. Export full contact lists with AI opportunity scores." },
            { icon: Globe, title: "Google Rank Optimizer", desc: "AI generates optimized meta titles, schema JSON-LD, keyword maps, and GBP optimization plans — all ready to hand to the client or implement directly." },
            { icon: MessageSquare, title: "AI Agent Chat", desc: "Your 24/7 technical consultant for client questions. Also executes fixes: rewrites descriptions, generates review strategies, creates ad copy." },
            { icon: BarChart3, title: "Market Analytics", desc: "Compare your client against top competitors in their niche. Ideal for showing the gap and justifying the investment." },
            { icon: Sparkles, title: "AI Ad Creator", desc: "Generate platform-specific ads for Facebook, Instagram, TikTok, LinkedIn, and LLM-discoverable content in one click." },
        ],
    },
    {
        id: 4,
        title: "Referral Link & Commission",
        icon: DollarSign,
        color: "from-purple-500/20 to-violet-600/10",
        borderColor: "border-purple-500/20",
        tagColor: "text-purple-400",
        description: "How tracking and payouts work",
        content: [
            {
                heading: "How Tracking Works",
                body: "Every client who signs up through your referral link is automatically tagged to your account in Firestore. Their purchases, audit runs, and AI Agent usage are all tracked. You earn 20% of everything they spend for 12 months.",
            },
            {
                heading: "Commission Structure",
                body: "Free audit referrals earn nothing — but every paid conversion earns 20%. One-time audits ($500-$2,000), monthly subscriptions ($99-$299/mo), add-ons ($99-$999), and AI Agent plans all count. A single client spending $500 earns you $100.",
            },
            {
                heading: "Payout Timeline",
                body: "Commissions accumulate monthly. Payouts are processed via Stripe Connect on the 1st of each month for balances over $50. You'll receive a payment history table in your Partner Dashboard showing every transaction.",
            },
        ],
        checklist: [
            "Copy your referral link from Partner Dashboard",
            "Add it to your email signature, LinkedIn bio, and website",
            "Set up Stripe Connect in your Partner Dashboard settings",
            "Track first referral within 7 days",
        ],
    },
    {
        id: 5,
        title: "Payout Setup & Tax Write-Offs",
        icon: Crown,
        color: "from-amber-500/20 to-yellow-600/10",
        borderColor: "border-amber-500/20",
        tagColor: "text-amber-400",
        description: "Get paid and maximize your deductions",
        content: [
            {
                heading: "Setting Up Stripe Connect",
                body: "Go to Partner Dashboard → Payments tab → Connect Stripe. This takes 5 minutes and is required to receive payouts. You'll need a bank account and basic business info.",
            },
            {
                heading: "Tax Write-Off Opportunities",
                body: "As a Lux partner running a consulting business, your software subscriptions, home office, internet, and marketing expenses are all potentially deductible. The Tax Write-Offs tab in your dashboard lists all categories with estimated savings.",
            },
            {
                heading: "Lux WriteOff Integration",
                body: "Our upcoming Lux WriteOff product will automatically identify every business expense deduction. As a partner you'll get early access — another value-add to offer your clients.",
            },
        ],
        checklist: [
            "Connect Stripe account in Partner Dashboard",
            "Review the Tax Write-Offs tab for your category list",
            "Set aside 20-25% of commission for self-employment taxes",
            "Consult a CPA for your specific deduction strategy",
        ],
    },
];

export default function PartnerOnboarding() {
    const [activeStep, setActiveStep] = useState(0);
    const [, setLocation] = useLocation();

    const step = STEPS[activeStep];

    const copyTemplate = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Template copied to clipboard!");
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-5xl mx-auto space-y-8">

                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card/95 to-emerald-500/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
                    <div className="absolute top-4 right-4 opacity-15">
                        <img src={ICONS_3D.handshake} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
                    </div>
                    <div className="relative p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20 overflow-hidden">
                                <img src={ICONS_3D.handshake} alt="" className="w-12 h-12 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                                    Partner Onboarding
                                </h1>
                                <p className="text-muted-foreground mt-1">Your 5-step guide to closing your first client and earning commissions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />20% Commission Rate</span>
                            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" />12-Month Revenue Share</span>
                            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" />Monthly Stripe Payouts</span>
                        </div>
                    </div>
                </div>

                {/* Step Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {STEPS.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveStep(i)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap
                ${activeStep === i
                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                    : "border-border/50 text-muted-foreground hover:border-emerald-500/20 hover:text-foreground"
                                }`}
                        >
                            {i < activeStep
                                ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                                : <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border ${activeStep === i ? "bg-emerald-500 border-emerald-500 text-black" : "border-border text-muted-foreground"}`}>{s.id}</span>
                            }
                            {s.title}
                        </button>
                    ))}
                </div>

                {/* Step Content */}
                <Card className={`border ${step.borderColor} bg-gradient-to-br ${step.color}`}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} border ${step.borderColor} flex items-center justify-center`}>
                                <step.icon className={`w-5 h-5 ${step.tagColor}`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] ${step.tagColor} ${step.borderColor}`}>
                                        STEP {step.id} OF {STEPS.length}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl mt-1">{step.title}</CardTitle>
                                <CardDescription>{step.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Content blocks */}
                        {step.content && (
                            <div className="grid gap-4">
                                {step.content.map((c, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-card/60 border border-border/40">
                                        <h3 className={`font-semibold ${step.tagColor} mb-2 text-sm`}>{c.heading}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Feature grid for step 3 */}
                        {step.items && (
                            <div className="grid gap-3 md:grid-cols-2">
                                {step.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 p-4 rounded-xl bg-card/60 border border-border/40">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <item.icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Email template */}
                        {step.template && (
                            <div className="space-y-2">
                                <h3 className={`font-semibold ${step.tagColor} text-sm`}>Outreach Template</h3>
                                <div className="relative p-4 rounded-xl bg-card border border-border/50 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {step.template}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyTemplate(step.template!)}
                                        className="absolute top-3 right-3 gap-1.5 h-7 text-[11px]"
                                    >
                                        <Copy className="w-3 h-3" /> Copy
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Checklist */}
                        {step.checklist && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className={`font-semibold ${step.tagColor} text-sm`}>Action Items</h3>
                                    <div className="space-y-2">
                                        {step.checklist.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-sm">
                                                <Star className={`w-4 h-4 ${step.tagColor} shrink-0 mt-0.5`} />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className="border-border/50"
                    >
                        Previous Step
                    </Button>

                    {activeStep < STEPS.length - 1 ? (
                        <Button
                            onClick={() => setActiveStep(prev => prev + 1)}
                            className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setLocation("/partner")}
                            className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90"
                        >
                            Go to Partner Dashboard <ExternalLink className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Quick Links */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-lux-gold" /> Quick Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { label: "Partner Dashboard", path: "/partner", icon: Handshake, color: "text-emerald-400" },
                                { label: "Lead Generator", path: "/leads", icon: Target, color: "text-lux-gold" },
                                { label: "Run Sample Audit", path: "/dashboard", icon: BarChart3, color: "text-blue-400" },
                            ].map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => setLocation(link.path)}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-lux-gold/30 transition-all text-left"
                                >
                                    <link.icon className={`w-5 h-5 ${link.color}`} />
                                    <span className="text-sm font-medium">{link.label}</span>
                                    <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
}
