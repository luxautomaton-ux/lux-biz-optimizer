import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShoppingCart, Sparkles, Crown, Star, Globe,
  TrendingUp, Target, CheckCircle, AlertTriangle, XCircle,
  ChevronDown, ChevronUp, Copy, Check, Zap, Shield,
  FileText, BarChart3, Lock, Bot, Wrench,
  Clock, ExternalLink, Brain, Loader2, Search,
  Eye, Code, Image, DollarSign, Package,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, SHOPIFY_AUDIT_LOADING_STEPS } from "@/lib/icons3d";

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "oklch(0.72 0.2 145)" : score >= 60 ? "oklch(0.78 0.14 80)" : score >= 40 ? "oklch(0.7 0.2 55)" : "oklch(0.6 0.22 25)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.2 0.02 270)" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs border-lux-gold/20 hover:bg-lux-gold/10 hover:text-lux-gold">
      {copied ? <Check className="w-3 h-3 text-lux-green" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  high: { bg: "bg-lux-orange/10", text: "text-lux-orange", border: "border-lux-orange/20" },
  medium: { bg: "bg-lux-gold/10", text: "text-lux-gold", border: "border-lux-gold/20" },
  low: { bg: "bg-lux-green/10", text: "text-lux-green", border: "border-lux-green/20" },
};

const CATEGORY_ICONS: Record<string, typeof ShoppingCart> = {
  seo: Search,
  aeo: Brain,
  cro: TrendingUp,
  ux: Eye,
  performance: Zap,
  trust: Shield,
  content: FileText,
  schema: Code,
  images: Image,
  pricing: DollarSign,
};

export default function ShopifyOptimizer() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [storeUrl, setStoreUrl] = useState("");
  const [shopifyApiKey, setShopifyApiKey] = useState("");
  const [shopifyApiSecret, setShopifyApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showApiFields, setShowApiFields] = useState(false);
  const [autoFixSeo, setAutoFixSeo] = useState(false);
  const [autoFixContent, setAutoFixContent] = useState(false);
  const [autoFixTheme, setAutoFixTheme] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  const auditMutation = trpc.shopify.audit.useMutation();

  const handleAudit = async () => {
    if (!storeUrl.trim()) {
      toast.error("Please enter your Shopify store URL");
      return;
    }
    setIsAuditing(true);
    setAuditData(null);
    try {
      const result = await auditMutation.mutateAsync({
        storeUrl: storeUrl.trim(),
        shopifyApiKey: shopifyApiKey || undefined,
        shopifyApiSecret: shopifyApiSecret || undefined,
        accessToken: accessToken || undefined,
        dryRun: !showApiFields,
        autoFixSeo,
        autoFixContent,
        autoFixTheme,
      });
      setAuditData(result);
      toast.success("Shopify store audit complete!");
    } catch (error: any) {
      toast.error(error.message || "Audit failed");
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleIssue = (i: number) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="premium-card max-w-md text-center p-8">
            <Lock className="w-12 h-12 text-lux-gold mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">Sign In Required</h2>
            <p className="text-sm text-muted-foreground mb-4">Sign in to access the Shopify Store Optimizer</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-lux-gold/20 bg-gradient-to-br from-card via-card/95 to-lux-gold/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-gold via-lux-purple to-lux-gold" />
          <div className="absolute top-4 right-4 opacity-15">
            <img src={ICONS_3D.shoppingCart} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-10">
            <img src={ICONS_3D.rocket} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-purple/20 to-purple-600/10 flex items-center justify-center shadow-lg shadow-lux-purple/10 border border-lux-purple/20 overflow-hidden">
                  <img src={ICONS_3D.shoppingCart} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">Shopify Store Optimizer</h1>
                    <Badge className="bg-lux-gold/10 text-lux-gold border-lux-gold/20 gap-1">
                      <Crown className="w-3 h-3" /> Add-On
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-lg">
                    Full Shopify audit covering SEO, AI visibility, CRO, UX, performance, and trust signals. AI provides exact fixes — or auto-applies them with API access.
                  </p>
                </div>
              </div>
            </div>

            {/* Store URL Input */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-card/50 border border-border/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-lux-gold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Shopify Store URL</label>
                    <Input
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      placeholder="mystore.myshopify.com or mystore.com"
                      className="mt-1 bg-background/50 border-border/30 focus:border-lux-gold/50"
                    />
                  </div>
                </div>

                {/* API Access Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-lux-purple" />
                    <div>
                      <p className="text-sm font-semibold">Enable Auto-Fix (API Access)</p>
                      <p className="text-xs text-muted-foreground">Connect your Shopify Admin API to let the AI auto-fix issues</p>
                    </div>
                  </div>
                  <Switch checked={showApiFields} onCheckedChange={setShowApiFields} />
                </div>

                {showApiFields && (
                  <div className="space-y-3 p-4 rounded-lg border border-lux-purple/20 bg-lux-purple/5">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Shield className="w-3 h-3 text-lux-gold" />
                      Your API keys are encrypted with AES-256 and never stored permanently
                    </p>
                    <Input
                      value={shopifyApiKey}
                      onChange={(e) => setShopifyApiKey(e.target.value)}
                      placeholder="Shopify API Key"
                      className="bg-background/50 border-border/30"
                    />
                    <Input
                      value={shopifyApiSecret}
                      onChange={(e) => setShopifyApiSecret(e.target.value)}
                      placeholder="Shopify API Secret"
                      type="password"
                      className="bg-background/50 border-border/30"
                    />
                    <Input
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="Admin API Access Token"
                      type="password"
                      className="bg-background/50 border-border/30"
                    />

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-lux-gold" />
                          <span className="text-xs font-medium">Auto-Fix SEO</span>
                        </div>
                        <Switch checked={autoFixSeo} onCheckedChange={setAutoFixSeo} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-lux-cyan" />
                          <span className="text-xs font-medium">Auto-Fix Content</span>
                        </div>
                        <Switch checked={autoFixContent} onCheckedChange={setAutoFixContent} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-lux-purple" />
                          <span className="text-xs font-medium">Auto-Fix Theme</span>
                        </div>
                        <Switch checked={autoFixTheme} onCheckedChange={setAutoFixTheme} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleAudit} disabled={isAuditing || !storeUrl.trim()} className="bg-gradient-to-r from-lux-gold to-amber-600 text-black font-semibold hover:opacity-90 gap-2 w-full md:w-auto">
                <ShoppingCart className="w-4 h-4" /> {auditData ? "Re-Run Shopify Audit" : "Start Shopify Audit"}
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isAuditing && (
          <AuditLoader
            steps={SHOPIFY_AUDIT_LOADING_STEPS}
            isComplete={false}
            title="Shopify Store Audit"
            subtitle={`Deep-scanning ${storeUrl}...`}
          />
        )}

        {/* Results */}
        {auditData && !isAuditing && (
          <>
            {/* Score Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: "Overall", score: auditData.overallScore, icon: Star },
                { label: "SEO", score: auditData.seoScore, icon: Search },
                { label: "AI Visibility", score: auditData.aeoScore, icon: Brain },
                { label: "Conversion", score: auditData.croScore, icon: TrendingUp },
                { label: "UX", score: auditData.uxScore, icon: Eye },
                { label: "Speed", score: auditData.performanceScore, icon: Zap },
                { label: "Trust", score: auditData.trustScore, icon: Shield },
              ].map((item) => (
                <Card key={item.label} className="premium-card text-center p-4">
                  <div className="flex justify-center mb-2">
                    <ScoreRing score={item.score} size={52} />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </p>
                </Card>
              ))}
            </div>

            {/* Revenue Impact Banner */}
            {auditData.estimatedRevenueImpact && (
              <Card className="premium-card overflow-hidden border-lux-green/30">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lux-green/10 flex items-center justify-center shrink-0">
                    <img src={ICONS_3D.dollarCoin} alt="" className="w-9 h-9 object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lux-green text-sm">Estimated Revenue Impact</p>
                    <p className="text-sm text-muted-foreground mt-1">{auditData.estimatedRevenueImpact}</p>
                  </div>
                  <Badge className="bg-lux-green/10 text-lux-green border-lux-green/20">
                    <DollarSign className="w-3 h-3 mr-1" /> Opportunity
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 border border-border/30 p-1">
                <TabsTrigger value="overview" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <BarChart3 className="w-3 h-3" /> Overview
                </TabsTrigger>
                <TabsTrigger value="issues" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <AlertTriangle className="w-3 h-3" /> Issues ({auditData.issues?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <Search className="w-3 h-3" /> SEO & Meta
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <Brain className="w-3 h-3" /> AI Visibility
                </TabsTrigger>
                <TabsTrigger value="schema" className="gap-1.5 text-xs data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <Code className="w-3 h-3" /> Schema
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                {auditData.topRecommendations?.length > 0 && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <img src={ICONS_3D.trophy} alt="" className="w-6 h-6 object-contain" /> Top Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {auditData.topRecommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border/20">
                          <div className="w-6 h-6 rounded-full bg-lux-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-lux-gold">{i + 1}</span>
                          </div>
                          <p className="text-sm text-foreground/90">{rec}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {auditData.competitorInsights && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Target className="w-5 h-5 text-lux-gold" /> Competitor Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{auditData.competitorInsights}</p>
                      <CopyButton text={auditData.competitorInsights} />
                    </CardContent>
                  </Card>
                )}

                {auditData.googleMerchantCenterTips && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Package className="w-5 h-5 text-lux-gold" /> Google Merchant Center Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{auditData.googleMerchantCenterTips}</p>
                      <CopyButton text={auditData.googleMerchantCenterTips} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent value="issues" className="space-y-3 mt-4">
                {/* Issue Summary */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {["critical", "high", "medium", "low"].map((sev) => {
                    const count = auditData.issues?.filter((i: any) => i.severity === sev).length || 0;
                    const style = SEVERITY_STYLES[sev] || SEVERITY_STYLES.low;
                    return (
                      <div key={sev} className={`p-3 rounded-lg border ${style.border} ${style.bg} text-center`}>
                        <p className={`text-lg font-bold ${style.text}`}>{count}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{sev}</p>
                      </div>
                    );
                  })}
                </div>

                {auditData.issues?.sort((a: any, b: any) => b.priorityScore - a.priorityScore).map((issue: any, i: number) => {
                  const style = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.low;
                  const CategoryIcon = CATEGORY_ICONS[issue.category] || FileText;
                  const isExpanded = expandedIssues.has(i);
                  return (
                    <Card key={i} className={`premium-card overflow-hidden border ${style.border}`}>
                      <div className="p-4 cursor-pointer hover:bg-card/50 transition-colors" onClick={() => toggleIssue(i)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                              <CategoryIcon className={`w-4 h-4 ${style.text}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm">{issue.title}</h3>
                                <Badge variant="outline" className={`text-[10px] ${style.text} ${style.border}`}>{issue.severity}</Badge>
                                <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground capitalize">{issue.category}</Badge>
                                {issue.autoFixable && (
                                  <Badge className="text-[10px] bg-lux-purple/10 text-lux-purple border-lux-purple/20 gap-1">
                                    <Bot className="w-2.5 h-2.5" /> Auto-Fixable
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{issue.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">Priority</p>
                              <p className={`text-sm font-bold ${style.text}`}>{issue.priorityScore}</p>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-4 border-t border-border/20 pt-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-lux-gold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Business Impact</p>
                              <p className="text-sm text-muted-foreground">{issue.impact}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-lux-cyan flex items-center gap-1"><Clock className="w-3 h-3" /> Estimated Time</p>
                              <p className="text-sm text-muted-foreground">{issue.estimatedTimeToFix}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-lux-green flex items-center gap-1"><Wrench className="w-3 h-3" /> How to Fix (Shopify Admin)</p>
                              <CopyButton text={issue.manualFix} />
                            </div>
                            <div className="p-3 rounded-lg bg-card/30 border border-border/20">
                              <p className="text-xs text-muted-foreground whitespace-pre-line font-mono">{issue.manualFix}</p>
                            </div>
                          </div>

                          {issue.autoFixable && issue.autoFixAction && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-lux-purple flex items-center gap-1"><Bot className="w-3 h-3" /> Auto-Fix Action</p>
                              <div className="p-3 rounded-lg bg-lux-purple/5 border border-lux-purple/20">
                                <p className="text-xs text-muted-foreground whitespace-pre-line font-mono">{issue.autoFixAction}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </TabsContent>

              {/* SEO & Meta Tab */}
              <TabsContent value="seo" className="space-y-4 mt-4">
                {auditData.metaTagOptimizations && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Search className="w-5 h-5 text-lux-gold" /> Meta Tag Optimizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-4 rounded-lg bg-card/30 border border-border/20">
                        <p className="text-sm text-muted-foreground whitespace-pre-line font-mono">{auditData.metaTagOptimizations}</p>
                      </div>
                      <CopyButton text={auditData.metaTagOptimizations} />
                    </CardContent>
                  </Card>
                )}

                {auditData.productDescriptionRewrites && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <FileText className="w-5 h-5 text-lux-gold" /> AI-Optimized Product Descriptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-4 rounded-lg bg-card/30 border border-border/20">
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{auditData.productDescriptionRewrites}</p>
                      </div>
                      <CopyButton text={auditData.productDescriptionRewrites} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* AI Visibility Tab */}
              <TabsContent value="ai" className="space-y-4 mt-4">
                {auditData.aiVisibilityAnalysis && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <img src={ICONS_3D.aiBot} alt="" className="w-6 h-6 object-contain" /> AI Visibility Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{auditData.aiVisibilityAnalysis}</p>
                      <CopyButton text={auditData.aiVisibilityAnalysis} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Schema Tab */}
              <TabsContent value="schema" className="space-y-4 mt-4">
                {auditData.schemaMarkupSuggestions && (
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Code className="w-5 h-5 text-lux-gold" /> Schema Markup (JSON-LD)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground mb-2">Copy and paste this into your Shopify theme.liquid file before the closing &lt;/head&gt; tag:</p>
                      <div className="p-4 rounded-lg bg-card/30 border border-border/20 overflow-x-auto">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{auditData.schemaMarkupSuggestions}</pre>
                      </div>
                      <CopyButton text={auditData.schemaMarkupSuggestions} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* API Access CTA */}
            {!auditData.hasApiAccess && (
              <Card className="premium-card overflow-hidden border-lux-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-lux-purple/10 flex items-center justify-center shrink-0">
                      <Bot className="w-8 h-8 text-lux-purple" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg mb-1">Unlock Auto-Fix with API Access</h3>
                      <p className="text-sm text-muted-foreground">Connect your Shopify Admin API to let the AI Agent automatically apply all fixes — SEO meta tags, product descriptions, schema markup, and theme optimizations.</p>
                    </div>
                    <Button onClick={() => { setShowApiFields(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-lux-purple text-white hover:bg-lux-purple/90 gap-2 shrink-0">
                      <Zap className="w-4 h-4" /> Connect API
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {!auditData && !isAuditing && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Search, title: "Full SEO Audit", desc: "Meta tags, URL handles, sitemaps, canonical tags, heading structure, and internal linking analysis" },
              { icon: Brain, title: "AI Visibility Check", desc: "How ChatGPT, Gemini, and Perplexity discover and recommend your products to shoppers" },
              { icon: TrendingUp, title: "CRO & UX Analysis", desc: "Conversion funnel optimization, trust signals, mobile UX, checkout flow, and page speed" },
              { icon: Code, title: "Schema Markup", desc: "Product, Organization, and BreadcrumbList JSON-LD schema ready to paste into your theme" },
              { icon: Image, title: "Image Optimization", desc: "Alt text, file sizes, lazy loading, WebP conversion, and responsive image recommendations" },
              { icon: DollarSign, title: "Revenue Impact", desc: "Projected revenue increase from implementing all optimizations with ROI calculations" },
            ].map((feature, i) => (
              <Card key={i} className="premium-card p-5 hover:border-lux-gold/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
