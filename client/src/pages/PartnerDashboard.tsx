import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ICONS_3D } from "@/lib/icons3d";
import {
  Handshake, Users, DollarSign, TrendingUp, BarChart3, Copy, ExternalLink,
  Crown, Calculator, FileText, Receipt, Loader2, CheckCircle, Clock, AlertCircle,
  ArrowUpRight, Percent, Wallet, CreditCard, Building2, Globe, Sparkles,
  Zap, Target, MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [profitCalcUsers, setProfitCalcUsers] = useState(25);

  const { data: partner, isLoading: partnerLoading } = trpc.partner.me.useQuery(undefined, { enabled: !!user });
  const { data: dashboardData, isLoading: dashLoading } = trpc.partner.dashboard.useQuery(undefined, {
    enabled: !!partner,
  });

  const registerMutation = trpc.partner.register.useMutation({
    onSuccess: () => {
      toast.success("Partner application submitted successfully!");
      window.location.reload();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleRegister = () => {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    registerMutation.mutate({ companyName, website, description });
  };

  const copyReferralLink = () => {
    if (partner?.id) {
      navigator.clipboard.writeText(`${window.location.origin}?ref=LUX-${partner.id}`);
      toast.success("Referral link copied!");
    }
  };

  // Profit calculator
  const COMMISSION_RATE = partner?.commissionRate || 20;
  const AVG_REVENUE_PER_USER = 800;
  const calcProfit = {
    totalUsers: profitCalcUsers,
    avgRevenue: AVG_REVENUE_PER_USER,
    grossRevenue: profitCalcUsers * AVG_REVENUE_PER_USER,
    commissionRate: COMMISSION_RATE,
    yourEarnings: profitCalcUsers * AVG_REVENUE_PER_USER * (COMMISSION_RATE / 100),
    yearlyEarnings: profitCalcUsers * AVG_REVENUE_PER_USER * (COMMISSION_RATE / 100),
  };

  // Tax write-offs
  const taxWriteOffs = [
    { category: "Software & SaaS Subscriptions", description: "Lux Biz Optimizer subscription, CRM tools, marketing software", potential: "$2,400 - $12,000/yr" },
    { category: "Home Office Deduction", description: "Dedicated workspace for managing partner business", potential: "$1,500 - $5,000/yr" },
    { category: "Internet & Phone", description: "Business portion of internet and phone bills", potential: "$600 - $2,400/yr" },
    { category: "Marketing & Advertising", description: "Costs to promote your referral link and partner business", potential: "$1,000 - $10,000/yr" },
    { category: "Professional Development", description: "Courses, conferences, certifications for business growth", potential: "$500 - $5,000/yr" },
    { category: "Business Insurance", description: "E&O insurance, general liability for consulting", potential: "$500 - $3,000/yr" },
    { category: "Vehicle & Travel", description: "Client meetings, networking events, business travel", potential: "$2,000 - $15,000/yr" },
    { category: "Contractor Payments", description: "Virtual assistants, freelancers helping manage clients", potential: "$1,000 - $20,000/yr" },
  ];

  if (partnerLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-lux-gold" />
        </div>
      </DashboardLayout>
    );
  }

  // Registration form for non-partners
  if (!partner) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card/95 to-emerald-500/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
            <div className="absolute top-4 right-4 opacity-15">
              <img src={ICONS_3D.handshake} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
            </div>
            <div className="relative p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-500/20 overflow-hidden">
                  <img src={ICONS_3D.handshake} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    Partner Program
                  </h1>
                  <p className="text-muted-foreground max-w-xl mt-1">
                    Become a Lux Automaton reseller. Earn {COMMISSION_RATE}% commission on every customer you refer for a full year.
                    <Badge variant="outline" className="ml-2 border-emerald-500/30 text-emerald-400 bg-emerald-500/5">$299 Setup Fee</Badge>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Percent, title: `${COMMISSION_RATE}% Commission`, desc: "Earn on every referred customer's spend for 12 months", color: "text-emerald-400" },
              { icon: Wallet, title: "Monthly Payouts", desc: "Get paid via Stripe Connect every month automatically", color: "text-blue-400" },
              { icon: BarChart3, title: "Full Dashboard", desc: "Track customers, revenue, and analytics in real-time", color: "text-purple-400" },
            ].map((b, i) => (
              <Card key={i} className="border-emerald-500/10">
                <CardContent className="pt-6">
                  <b.icon className={`h-8 w-8 ${b.color} mb-3`} />
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration Form */}
          <Card className="border-emerald-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-emerald-400" />
                Apply to Become a Partner
              </CardTitle>
              <CardDescription>Fill in your company details to get started. There is a one-time $299 setup fee for new partners.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your SaaS company name" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" />
              </div>
              <div className="space-y-2">
                <Label>Tell us about your business</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="How do you plan to refer customers?" rows={3} />
              </div>
              <Button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90"
              >
                {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Handshake className="h-4 w-4 mr-2" />}
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Pending status
  if (partner.status === "pending") {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card via-card/95 to-amber-500/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
            <div className="relative p-8 text-center">
              <Clock className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h1 className="text-3xl font-display font-bold tracking-tight text-amber-400">Application Under Review</h1>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Your partner application for <strong>{partner.companyName}</strong> is being reviewed. We'll notify you once it's approved.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboardData?.stats;
  const customers = dashboardData?.customers || [];
  const payouts = dashboardData?.payouts || [];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card/95 to-emerald-500/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
          <div className="absolute top-4 right-4 opacity-15">
            <img src={ICONS_3D.handshake} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-10">
            <img src={ICONS_3D.dollarCoin} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
          </div>
          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-500/20 overflow-hidden">
                  <img src={ICONS_3D.handshake} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      Partner Dashboard
                    </h1>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{partner.companyName} — {COMMISSION_RATE}% commission rate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyReferralLink} className="gap-2 border-emerald-500/20 hover:border-emerald-500/40">
                  <Copy className="w-3 h-3" /> Copy Referral Link
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img src={ICONS_3D.userProfile} alt="" className="w-5 h-5 object-contain" />
                <span>Customer Management</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img src={ICONS_3D.analyticsChart} alt="" className="w-5 h-5 object-contain" />
                <span>Revenue Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img src={ICONS_3D.dollarCoin} alt="" className="w-5 h-5 object-contain" />
                <span>Stripe Payouts</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active customers</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${(stats?.totalCommissions || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime commission</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <Wallet className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">${(stats?.pendingPayout || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Next payout cycle</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">${(stats?.totalPaidOut || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed payouts</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-border/50">
            <TabsTrigger value="onboarding" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
              <Sparkles className="w-3.5 h-3.5" /> Onboarding
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Users className="w-3.5 h-3.5" /> Customers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Calculator className="w-3.5 h-3.5" /> Profit Calc
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Receipt className="w-3.5 h-3.5" /> Payments
            </TabsTrigger>
            <TabsTrigger value="tax" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <FileText className="w-3.5 h-3.5" /> Tax Write-Offs
            </TabsTrigger>
          </TabsList>

          {/* ONBOARDING TAB */}
          <TabsContent value="onboarding" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Step 1: Platform Tutorial */}
              <Card className="border-lux-gold/20 bg-lux-gold/5 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-lux-gold/20 blur-3xl rounded-full group-hover:bg-lux-gold/30 transition-all" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lux-gold/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-lux-gold" />
                    </div>
                    Step 1: Platform Masterclass
                  </CardTitle>
                  <CardDescription>Rapid orientation of the Lux Intelligence Suite</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Run Audit", desc: "The engine of our platform. Enter a company name/location to trigger a deep AI scan." },
                    { title: "Review Fixers", desc: "Show clients the exact revenue leaks identify by our LLM analysis." },
                    { title: "Niche Scanner", desc: "Use this to find local businesses with low scores to target for outreach." },
                    { title: "Agent Chat", desc: "Your 24/7 technical consultant for specific client optimization questions." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="h-5 w-5 rounded-full bg-lux-gold text-black text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Step 2: Client Acquisition */}
              <Card className="border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    Step 2: Closing Your First Client
                  </CardTitle>
                  <CardDescription>Our proven 3-step closing sequence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-card border border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">The "Free Audit" Hook</p>
                    <p className="text-[11px] leading-relaxed">
                      "I ran an AI Visibility scan for [Business Name] and noticed you're losing approximately $[Loss] per month because ChatGPT and Gemini can't find your services. Can I send you the full report?"
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Identify high-intent keywords using the Niche Scanner.</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Screen share the Audit Results page specifically highlighting the "Revenue Leak" section.</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Offer the $500 Audit or $997 Monthly Pro plan using your referral link.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Tutorial */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-lux-gold" />
                  Partner Dashboard walkthrough
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="aspect-video rounded-xl bg-muted/20 border border-dashed flex items-center justify-center relative overflow-hidden">
                      <img src={ICONS_3D.userProfile} alt="" className="w-12 h-12 object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold">1. Customer Tab</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Track every lead and active customer. Monitor their "Total Spend" and the commission you've earned from each.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-video rounded-xl bg-muted/20 border border-dashed flex items-center justify-center relative overflow-hidden">
                      <img src={ICONS_3D.analyticsChart} alt="" className="w-12 h-12 object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold">2. Analytics Tab</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Visualize your growth profile. See month-over-month revenue trends and customer lifetime value insights.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-video rounded-xl bg-muted/20 border border-dashed flex items-center justify-center relative overflow-hidden">
                      <img src={ICONS_3D.dollarCoin} alt="" className="w-12 h-12 object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold">3. Profit Calculator</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Plan your business goals. Estimate your MRR (Monthly Recurring Revenue) based on your acquisition targets.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources Section */}
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Marketing Assets & Resources
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Pitch Deck v1.0", type: "PDF", icon: FileText },
                  { title: "Logo & Brand Kit", type: "ZIP", icon: Globe },
                  { title: "Email Scrips (Cold)", type: "DOC", icon: MessageSquare },
                  { title: "LinkedIn Outreach", type: "DOC", icon: Sparkles },
                  { title: "Audit Walkthrough", type: "MP4", icon: Globe },
                ].map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                        <res.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{res.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{res.type}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CUSTOMERS TAB */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="border-emerald-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={ICONS_3D.userProfile} alt="" className="w-5 h-5 object-contain" />
                  Referred Customers
                </CardTitle>
                <CardDescription>All customers who signed up using your referral link</CardDescription>
              </CardHeader>
              <CardContent>
                {customers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="font-medium">No customers yet</p>
                    <p className="text-sm mt-1">Share your referral link to start earning commissions</p>
                    <Button variant="outline" size="sm" onClick={copyReferralLink} className="mt-4 gap-2 border-emerald-500/20">
                      <Copy className="w-3 h-3" /> Copy Referral Link
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Spend</TableHead>
                        <TableHead className="text-right">Your Commission</TableHead>
                        <TableHead>AI Agent Tasks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((c: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-medium text-emerald-400">
                                {(c.name || c.email || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{c.name || "User"}</p>
                                <p className="text-xs text-muted-foreground">{c.email || ""}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/20">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">${(c.totalSpend || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium text-emerald-400">${(c.commission || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <img src={ICONS_3D.aiBot} alt="" className="w-4 h-4 object-contain" />
                              <span className="text-sm">{c.agentTasks || 0} tasks</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-emerald-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["This Month", "Last Month", "2 Months Ago"].map((label, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-emerald-500/20" style={{ width: `${Math.max(20, 100 - i * 30)}px` }}>
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(30, 100 - i * 25)}%` }} />
                          </div>
                          <span className="text-sm font-medium">${((stats?.totalCommissions || 0) * (1 - i * 0.2)).toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-emerald-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-emerald-400" /> Customer Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-2xl font-bold text-emerald-400">{stats?.totalCustomers || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Customers</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-2xl font-bold text-blue-400">{stats?.totalCustomers || 0}</p>
                      <p className="text-xs text-muted-foreground">Active This Month</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <p className="text-2xl font-bold text-purple-400">${(stats?.totalCustomers ? (stats.totalRevenue / stats.totalCustomers) : 0).toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Avg Revenue/Customer</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <p className="text-2xl font-bold text-amber-400">{COMMISSION_RATE}%</p>
                      <p className="text-xs text-muted-foreground">Commission Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PROFIT CALCULATOR TAB */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="border-emerald-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={ICONS_3D.dollarCoin} alt="" className="w-5 h-5 object-contain" />
                  Profit Calculator
                </CardTitle>
                <CardDescription>Estimate your earnings based on referred customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Number of Referred Customers</Label>
                  <Input
                    type="number"
                    value={profitCalcUsers}
                    onChange={e => setProfitCalcUsers(parseInt(e.target.value) || 1)}
                    min={1}
                    max={1000}
                    className="max-w-xs"
                  />
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-sm text-muted-foreground">Gross Revenue (from your users)</p>
                    <p className="text-2xl font-bold mt-1">${calcProfit.grossRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{profitCalcUsers} users × ${AVG_REVENUE_PER_USER} avg</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-sm text-muted-foreground">Your Commission ({COMMISSION_RATE}%)</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">${calcProfit.yourEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Per year (12-month window)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-lux-gold/5 border border-lux-gold/20">
                    <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-lux-gold mt-1">${(calcProfit.yourEarnings / 12).toFixed(0)}/mo</p>
                    <p className="text-xs text-muted-foreground mt-1">Passive income estimate</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  {[10, 25, 50, 100].map(n => (
                    <div key={n} className="p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => setProfitCalcUsers(n)}>
                      <p className="text-xs text-muted-foreground">{n} customers</p>
                      <p className="text-lg font-bold text-emerald-400">${(n * AVG_REVENUE_PER_USER * COMMISSION_RATE / 100).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">${(n * AVG_REVENUE_PER_USER * COMMISSION_RATE / 100 / 12).toFixed(0)}/mo</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="border-emerald-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  Payment History
                </CardTitle>
                <CardDescription>All payouts processed via Stripe Connect</CardDescription>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="font-medium">No payouts yet</p>
                    <p className="text-sm mt-1">Payouts are processed monthly when your balance exceeds $50</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((p: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium text-emerald-400">${(p.amount || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={p.status === "completed" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}>
                              {p.status === "completed" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">Stripe Connect</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">{p.stripePayoutId || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAX WRITE-OFFS TAB */}
          <TabsContent value="tax" className="space-y-6">
            <Card className="border-emerald-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={ICONS_3D.documentReport} alt="" className="w-5 h-5 object-contain" />
                  Tax Write-Off Opportunities
                </CardTitle>
                <CardDescription>
                  As a Lux Automaton partner, you may be eligible for these business deductions. Consult a tax professional for your specific situation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Potential Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxWriteOffs.map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{t.category}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.description}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-400">{t.potential}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className="my-6" />
                <div className="p-4 rounded-lg bg-gradient-to-r from-lux-gold/5 to-amber-500/5 border border-lux-gold/20">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-lux-gold" />
                    <div>
                      <h3 className="font-semibold text-lux-gold">Lux WriteOff — Coming Soon</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our upcoming AI-powered tax deduction finder will automatically scan your business expenses and identify every possible write-off.
                        Maximize your savings with military-grade accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
