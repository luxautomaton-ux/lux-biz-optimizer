import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import {
  Loader2, TrendingDown, Eye, Star, Globe, Target,
  ArrowRight, FileText, MessageSquare, CheckCircle, AlertTriangle,
  DollarSign, Zap, BarChart3, ShoppingCart, ExternalLink, MapPin, Bot,
  BrainCircuit, Sparkles, Shield, Camera, Search, TrendingUp, Wrench,
  CircleCheck, CircleX, Clock, ChevronDown, ChevronUp, Building2,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, AUDIT_LOADING_STEPS } from "@/lib/icons3d";

const AGENT_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/GJymFbXargxhNYgZ.png";
const MAPS_PIN_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";

const ADD_ON_SERVICES = [
  { type: "description_rewrite", name: "AI Description Rewrite", price: 299, desc: "Optimize your business description for voice search & AI discovery", icon: FileText },
  { type: "review_strategy", name: "Review Strategy & Templates", price: 199, desc: "Custom review gathering strategy with templates and timing", icon: Star },
  { type: "seo_optimization", name: "Full SEO Optimization", price: 499, desc: "Complete SEO overhaul for AI and voice search readiness", icon: Search },
  { type: "competitor_deep_dive", name: "Competitor Deep Dive", price: 399, desc: "Detailed analysis of every competitor advantage with action plan", icon: Target },
  { type: "ad_campaign", name: "Ad Campaign Strategy", price: 599, desc: "Google Ads campaign with copy, keywords, and targeting", icon: Zap },
  { type: "ai_agent_fix", name: "Full AI Agent Fix (All Issues)", price: 999, desc: "AI Agent fixes ALL identified issues automatically", icon: Bot },
];

const LLM_ICONS: Record<string, { label: string; color: string; bgColor: string }> = {
  chatgpt: { label: "ChatGPT", color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20" },
  gemini: { label: "Google Gemini", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20" },
  perplexity: { label: "Perplexity AI", color: "text-violet-400", bgColor: "bg-violet-500/10 border-violet-500/20" },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function AuditResults() {
  const params = useParams<{ id: string }>();
  const auditId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [expandedLLM, setExpandedLLM] = useState<string | null>("chatgpt");

  const { data: audit, isLoading } = trpc.audit.get.useQuery(
    { id: auditId },
    {
      refetchInterval: (query) => {
        const d = query.state.data as any;
        return d && (d.status === "complete" || d.status === "failed") ? false : 3000;
      }
    }
  );

  const { data: purchasedFixes } = trpc.audit.purchasedFixes.useQuery(
    { auditId },
    { enabled: !!audit && audit.status === "complete" }
  );

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Added to cart! AI Agent will fix this after purchase.");
      utils.cart.list.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAddToCart = (service: typeof ADD_ON_SERVICES[0]) => {
    addToCart.mutate({
      auditId,
      companyProfileId: (audit as any)?.companyProfileId ?? undefined,
      serviceType: service.type as any,
      serviceName: service.name,
      price: service.price,
    });
  };

  const onMapReady = useCallback((map: google.maps.Map) => {
    if (!audit) return;
    const a = audit as any;
    const lat = a.latitude;
    const lng = a.longitude;
    const competitors = (a.competitorData || []) as any[];

    if (lat && lng) {
      map.setCenter({ lat, lng });
      map.setZoom(14);

      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: a.businessName,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: "#d4a843",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        label: { text: "★", color: "#000000", fontSize: "14px", fontWeight: "bold" },
      });

      competitors.forEach((comp: any, i: number) => {
        const compLat = comp.geometry?.location?.lat;
        const compLng = comp.geometry?.location?.lng;
        if (compLat && compLng) {
          new google.maps.Marker({
            position: { lat: compLat, lng: compLng },
            map,
            title: comp.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#ef4444",
              fillOpacity: 0.8,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
            label: { text: `${i + 1}`, color: "#ffffff", fontSize: "11px", fontWeight: "bold" },
          });
        }
      });

      new google.maps.Circle({
        strokeColor: "#d4a843",
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: "#d4a843",
        fillOpacity: 0.05,
        map,
        center: { lat, lng },
        radius: 3000,
      });
    }
  }, [audit]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-lux-gold" />
        </div>
      </DashboardLayout>
    );
  }

  if (!audit) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <AlertTriangle className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Audit not found</p>
          <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (audit.status === "scanning" || audit.status === "analyzing" || audit.status === "pending") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-8">
          <AuditLoader
            steps={AUDIT_LOADING_STEPS}
            isComplete={false}
            title={audit.status === "scanning" ? "Scanning Business Data..." : "AI Analysis in Progress..."}
            subtitle={audit.status === "scanning"
              ? "Pulling live data from Google Maps, reviews, photos, and competitor listings."
              : "Our AI is analyzing 50+ data points across ChatGPT, Gemini, and Perplexity."}
          />
        </div>
      </DashboardLayout>
    );
  }

  const analysis = (audit.aiAnalysis || {}) as any;
  const businessData = (audit.businessData || {}) as any;
  const competitors = (audit.competitorData || []) as any[];
  const moneyLeaks = (analysis.moneyLeaks || []) as any[];
  const chatgptIssues = (audit.chatgptIssues || { score: 50, issues: [], summary: "" }) as any;
  const geminiIssues = (audit.geminiIssues || { score: 50, issues: [], summary: "" }) as any;
  const perplexityIssues = (audit.perplexityIssues || { score: 50, issues: [], summary: "" }) as any;

  const llmData = { chatgpt: chatgptIssues, gemini: geminiIssues, perplexity: perplexityIssues };

  const radarData = [
    { subject: "AI Visibility", score: audit.aiVisibilityScore ?? 0 },
    { subject: "Maps Presence", score: audit.mapsPresenceScore ?? 0 },
    { subject: "Reviews", score: audit.reviewScore ?? 0 },
    { subject: "Photos", score: audit.photoScore ?? 0 },
    { subject: "SEO", score: audit.seoScore ?? 0 },
    { subject: "Competitor Gap", score: audit.competitorGapScore ?? 0 },
  ];

  const llmBarData = [
    { name: "ChatGPT", score: audit.chatgptScore ?? 0, fill: "#10b981" },
    { name: "Gemini", score: audit.geminiScore ?? 0, fill: "#3b82f6" },
    { name: "Perplexity", score: audit.perplexityScore ?? 0, fill: "#8b5cf6" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const hasCoords = !!(audit as any).latitude && !!(audit as any).longitude;
  const totalMonthlyLoss = moneyLeaks.reduce((sum: number, l: any) => sum + (l.estimatedLoss ?? 0), 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header with Score Ring */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-lux-gold/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${(audit.overallScore ?? 0) >= 70 ? "border-emerald-500/50" : (audit.overallScore ?? 0) >= 40 ? "border-amber-500/50" : "border-red-500/50"
                  }`}>
                  <div className="text-center">
                    <div className={`text-3xl font-black ${getScoreColor(audit.overallScore ?? 0)}`}>
                      {Math.round(audit.overallScore ?? 0)}
                    </div>
                    <div className="text-[9px] text-muted-foreground tracking-wider">SCORE</div>
                  </div>
                </div>
                <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${(audit.overallScore ?? 0) >= 70 ? "bg-emerald-500 text-black" : (audit.overallScore ?? 0) >= 40 ? "bg-amber-500 text-black" : "bg-red-500 text-white"
                  }`}>
                  {getScoreGrade(audit.overallScore ?? 0)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {(audit as any).logoUrl ? (
                    <img src={(audit as any).logoUrl} alt={audit.businessName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold tracking-tight">{audit.businessName}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {audit.businessLocation} · {audit.industry}
                  </p>
                  {businessData.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(businessData.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{businessData.rating} ({businessData.user_ratings_total} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2 bg-transparent border-border/50" onClick={() => setLocation(`/reports?auditId=${audit.id}`)}>
                <FileText className="w-4 h-4" /> Export PDF
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent border-border/50" onClick={() => setLocation("/cart")}>
                <ShoppingCart className="w-4 h-4" /> Cart
              </Button>
              <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={() => setLocation(`/agent?auditId=${audit.id}`)}>
                <MessageSquare className="w-4 h-4" /> AI Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <div className="text-xl font-black text-red-400">${Math.round(audit.estimatedMonthlyLoss ?? 0).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">MONTHLY LOSS</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 text-lux-gold mx-auto mb-1" />
              <div className={`text-xl font-black ${getScoreColor(audit.aiVisibilityScore ?? 0)}`}>{Math.round(audit.aiVisibilityScore ?? 0)}</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">AI VISIBILITY</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 text-center">
              <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className={`text-xl font-black ${getScoreColor(audit.mapsPresenceScore ?? 0)}`}>{Math.round(audit.mapsPresenceScore ?? 0)}</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">MAPS SCORE</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 text-center">
              <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className={`text-xl font-black ${getScoreColor(audit.reviewScore ?? 0)}`}>{Math.round(audit.reviewScore ?? 0)}</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">REVIEWS</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 text-center">
              <Search className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className={`text-xl font-black ${getScoreColor(audit.seoScore ?? 0)}`}>{Math.round(audit.seoScore ?? 0)}</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">SEO SCORE</div>
            </CardContent>
          </Card>
        </div>

        {/* LLM Scores - Featured Section */}
        <Card className="bg-card border-border/50 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 font-display">
              <BrainCircuit className="w-5 h-5 text-lux-gold" /> How AI Assistants See Your Business
            </CardTitle>
            <p className="text-xs text-muted-foreground">Individual scores and specific issues for each major AI platform</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* LLM Score Bar */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {llmBarData.map((llm) => {
                const key = llm.name.toLowerCase().replace(" ", "") as keyof typeof LLM_ICONS;
                const meta = LLM_ICONS[key] || { label: llm.name, color: "text-foreground", bgColor: "bg-card" };
                return (
                  <div key={llm.name} className={`rounded-xl p-4 border ${meta.bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
                      <span className={`text-2xl font-black ${getScoreColor(llm.score)}`}>{llm.score}</span>
                    </div>
                    <Progress value={llm.score} className="h-2" />
                    <div className="text-[10px] text-muted-foreground mt-1">{getScoreGrade(llm.score)} Grade</div>
                  </div>
                );
              })}
            </div>

            {/* Expandable LLM Details */}
            {Object.entries(llmData).map(([key, data]: [string, any]) => {
              const meta = LLM_ICONS[key];
              const isExpanded = expandedLLM === key;
              const issues = data.issues || [];
              return (
                <div key={key} className={`rounded-xl border ${meta.bgColor} overflow-hidden`}>
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedLLM(isExpanded ? null : key)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
                      <Badge variant="secondary" className="text-[10px]">{issues.length} issues found</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${getScoreColor(data.score ?? 50)}`}>{data.score ?? 50}/100</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      {data.summary && (
                        <p className="text-sm text-muted-foreground border-l-2 border-current pl-3 ml-1 opacity-80">{data.summary}</p>
                      )}
                      {issues.length > 0 ? issues.map((issue: any, i: number) => (
                        <div key={i} className="rounded-lg bg-background/50 border border-border/30 p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${issue.severity === "critical" ? "text-red-400" : issue.severity === "high" ? "text-orange-400" : issue.severity === "medium" ? "text-yellow-400" : "text-blue-400"
                                }`} />
                              <div>
                                <h4 className="text-sm font-semibold">{issue.issue}</h4>
                              </div>
                            </div>
                            <Badge className={`text-[10px] shrink-0 ${SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.medium}`}>
                              {issue.severity?.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="ml-6 mt-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Wrench className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">HOW TO FIX</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{issue.fix}</p>
                          </div>
                          {issue.fixCategory && (
                            <div className="ml-6 mt-2">
                              <Badge variant="outline" className="text-[10px]">{issue.fixCategory}</Badge>
                            </div>
                          )}
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No specific issues identified</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Google Map */}
        {hasCoords && (
          <Card className="bg-card border-border/50 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 font-display">
                <img src={MAPS_PIN_LOGO} alt="Maps" className="w-5 h-5 object-contain" /> Location & Competitor Map
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full bg-lux-gold mr-1 align-middle" /> Your Business · <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1 align-middle" /> Competitors · Circle = 3km Reach
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px]">
                <MapView onMapReady={onMapReady} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-card border border-border/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="money-leaks">Money Leaks</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="fix-services">Fix Services</TabsTrigger>
            {purchasedFixes && purchasedFixes.length > 0 && (
              <TabsTrigger value="purchased-fixes">Purchased Fixes ({purchasedFixes.length})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-sm font-display">Score Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.28 0.02 270)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 10 }} />
                      <Radar name="Score" dataKey="score" stroke="#d4a843" fill="#d4a843" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-sm font-display">Category Scores</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={radarData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 11 }} />
                      <YAxis type="category" dataKey="subject" width={100} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 270)", border: "1px solid oklch(0.28 0.02 270)", borderRadius: 8, color: "oklch(0.93 0.005 270)" }} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {radarData.map((entry, index) => (
                          <Cell key={index} fill={getBarColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Strengths</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(analysis.strengths || []).map((s: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mt-1 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Weaknesses</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(analysis.weaknesses || []).map((w: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-amber-400 mt-1 shrink-0" /> {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Opportunities</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(analysis.opportunities || []).map((o: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400 mt-1 shrink-0" /> {o}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Money Leaks */}
          <TabsContent value="money-leaks" className="space-y-4">
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="text-sm font-bold">Total Estimated Monthly Loss</div>
                    <div className="text-xs text-muted-foreground">Revenue you are leaving on the table</div>
                  </div>
                </div>
                <div className="text-3xl font-black text-red-400">${totalMonthlyLoss.toLocaleString()}/mo</div>
              </CardContent>
            </Card>
            {moneyLeaks.map((leak: any, i: number) => {
              const matchingService = ADD_ON_SERVICES.find(s => s.type === leak.fixService);
              return (
                <Card key={i} className="bg-card border-border/50 hover:border-lux-gold/20 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <DollarSign className={`w-5 h-5 mt-0.5 shrink-0 ${leak.priority === "high" ? "text-red-400" : leak.priority === "medium" ? "text-amber-400" : "text-blue-400"}`} />
                        <div>
                          <h3 className="font-bold text-sm">{leak.area}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{leak.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-2">
                        <div className="text-lg font-bold text-red-400">${(leak.estimatedLoss ?? 0).toLocaleString()}/mo</div>
                        <Badge className={`text-[10px] ${SEVERITY_COLORS[leak.priority] || ""}`}>{leak.priority?.toUpperCase()}</Badge>
                        {matchingService && (
                          <Button size="sm" className="gap-1 text-xs bg-lux-gold text-black hover:bg-lux-gold/90 mt-1 w-full font-semibold" onClick={() => handleAddToCart(matchingService)} disabled={addToCart.isPending}>
                            <ShoppingCart className="w-3 h-3" /> Fix ${matchingService.price}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {moneyLeaks.length === 0 && <div className="text-center py-12 text-muted-foreground">No money leaks identified</div>}
          </TabsContent>

          {/* Competitors */}
          <TabsContent value="competitors" className="space-y-4">
            {competitors.map((comp: any, i: number) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm">{comp.name}</h3>
                      <p className="text-xs text-muted-foreground">{comp.formatted_address}</p>
                    </div>
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Competitor #{i + 1}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div><div className="text-xs text-muted-foreground">Rating</div><div className="text-lg font-bold flex items-center gap-1">{comp.rating ?? "N/A"} <Star className="w-3 h-3 text-amber-400" /></div></div>
                    <div><div className="text-xs text-muted-foreground">Reviews</div><div className="text-lg font-bold">{comp.user_ratings_total ?? 0}</div></div>
                    <div><div className="text-xs text-muted-foreground">Website</div><div className="text-sm">{comp.website ? <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-lux-gold flex items-center gap-1 hover:underline">Visit <ExternalLink className="w-3 h-3" /></a> : "None"}</div></div>
                    <div><div className="text-xs text-muted-foreground">Hours</div><div className="text-sm">{comp.opening_hours ? "Listed" : "Not Listed"}</div></div>
                  </div>
                  {analysis.competitorInsights?.[i] && (
                    <div className="mt-3 p-3 rounded-lg bg-background border border-border/30">
                      <div className="text-xs font-semibold text-amber-400 mb-1">Their Advantage</div>
                      <p className="text-xs text-muted-foreground">{analysis.competitorInsights[i].advantage}</p>
                      <div className="text-xs font-semibold text-red-400 mt-2 mb-1">Your Gap</div>
                      <p className="text-xs text-muted-foreground">{analysis.competitorInsights[i].yourGap}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {competitors.length === 0 && <div className="text-center py-12 text-muted-foreground">No competitor data available</div>}
          </TabsContent>

          {/* Roadmap */}
          <TabsContent value="roadmap" className="space-y-4">
            {(analysis.roadmap || []).map((phase: any, i: number) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center text-sm font-bold text-lux-gold">{phase.phase}</div>
                    <div>
                      <h3 className="font-bold text-sm">{phase.title}</h3>
                      <p className="text-xs text-muted-foreground">{phase.timeline} · Expected ROI: {phase.expectedROI}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 ml-13">
                    {(phase.actions || []).map((action: string, j: number) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-lux-gold mt-1 shrink-0" /> {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Fix Services */}
          <TabsContent value="fix-services" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Add services to your cart. After purchase, our AI Agent automatically executes fixes and verifies improvements.
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {ADD_ON_SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.type} className="bg-card border-border/50 hover:border-lux-gold/30 transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center shrink-0 group-hover:bg-lux-gold/20 transition-colors">
                            <Icon className="w-5 h-5 text-lux-gold" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{service.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-black text-lux-gold">${service.price}</div>
                        </div>
                      </div>
                      <Button className="w-full mt-3 gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" size="sm" onClick={() => handleAddToCart(service)} disabled={addToCart.isPending}>
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="bg-lux-gold/5 border-lux-gold/20">
              <CardContent className="p-4 flex items-start gap-3">
                <img src={AGENT_PHOTO} alt="AI Agent" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <div className="text-sm font-semibold">How the AI Agent Works</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    1. Add services to cart → 2. Purchase → 3. AI Agent automatically executes all fixes → 4. Verification test confirms improvements → 5. Updated company profile with new scores
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchased Fixes */}
          {purchasedFixes && purchasedFixes.length > 0 && (
            <TabsContent value="purchased-fixes" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                Track the status of your purchased services. Completed fixes include full implementation details.
              </div>
              {purchasedFixes.map((fix: any) => {
                const results = fix.fixResults as any;
                return (
                  <Card key={fix.id} className="bg-card border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {fix.status === "completed" ? (
                            <CircleCheck className="w-5 h-5 text-emerald-400" />
                          ) : fix.status === "in_progress" ? (
                            <Loader2 className="w-5 h-5 animate-spin text-lux-gold" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <h3 className="font-bold text-sm">{fix.serviceName}</h3>
                            <p className="text-xs text-muted-foreground">${fix.price} · {fix.serviceType}</p>
                          </div>
                        </div>
                        <Badge className={fix.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : fix.status === "in_progress" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}>
                          {fix.status === "completed" ? "COMPLETED" : fix.status === "in_progress" ? "IN PROGRESS" : "PURCHASED"}
                        </Badge>
                      </div>
                      {results && (
                        <div className="space-y-3 mt-3">
                          {results.fixSummary && (
                            <p className="text-sm text-muted-foreground border-l-2 border-lux-gold/30 pl-3">{results.fixSummary}</p>
                          )}
                          {results.implementationSteps && results.implementationSteps.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-bold text-lux-gold tracking-wider">IMPLEMENTATION STEPS</div>
                              {results.implementationSteps.map((step: any, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-5 h-5 rounded-full bg-lux-gold/10 flex items-center justify-center text-[10px] font-bold text-lux-gold shrink-0 mt-0.5">{step.step}</span>
                                  <div>
                                    <span className="font-medium text-foreground">{step.action}</span>
                                    {step.details && <p className="text-xs mt-0.5">{step.details}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {results.verificationChecklist && results.verificationChecklist.length > 0 && (
                            <div className="space-y-1.5 mt-2">
                              <div className="text-xs font-bold text-emerald-400 tracking-wider">VERIFICATION</div>
                              {results.verificationChecklist.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {item.passed ? <CircleCheck className="w-3.5 h-3.5 text-emerald-400" /> : <CircleX className="w-3.5 h-3.5 text-red-400" />}
                                  {item.item}
                                </div>
                              ))}
                            </div>
                          )}
                          {results.estimatedRevenueRecovery && (
                            <div className="mt-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                              <div className="text-xs text-emerald-400 font-bold">Estimated Revenue Recovery: <span className="text-lg">${results.estimatedRevenueRecovery.toLocaleString()}/mo</span></div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          )}
        </Tabs>

        {/* Tax Write-Off Banner */}
        <Card className="bg-gradient-to-r from-lux-gold/5 to-emerald-500/5 border-lux-gold/20">
          <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={LUX_WRITEOFF_LOGO} alt="Lux WriteOff" className="w-10 h-10 object-contain rounded-lg" />
              <div>
                <h3 className="font-bold text-sm">This Audit May Be Tax Deductible</h3>
                <p className="text-xs text-muted-foreground">Business consulting expenses can often be written off. Track it with Lux WriteOff.</p>
              </div>
            </div>
            <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent border-lux-gold/30 text-lux-gold hover:bg-lux-gold/10">
                <ExternalLink className="w-3 h-3" /> Visit Lux WriteOff
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
