import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  Search, Sparkles, Crown, ArrowRight, Star, Globe,
  TrendingUp, Target, CheckCircle, AlertTriangle, XCircle,
  ChevronDown, ChevronUp, Copy, Check, Zap, Shield,
  FileText, MapPin, BarChart3, Lock, Bot, Wrench,
  Clock, ExternalLink, Brain, Loader2,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, GOOGLE_RANK_RESEARCH_STEPS, GOOGLE_RANK_AUTOFIX_STEPS } from "@/lib/icons3d";

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

const STATUS_ICONS: Record<string, { icon: typeof CheckCircle; color: string }> = {
  pass: { icon: CheckCircle, color: "text-lux-green" },
  fail: { icon: XCircle, color: "text-lux-red" },
  needs_improvement: { icon: AlertTriangle, color: "text-lux-orange" },
};

const WEIGHT_COLORS: Record<string, string> = {
  critical: "bg-lux-red/15 text-lux-red border-lux-red/30",
  high: "bg-lux-orange/15 text-lux-orange border-lux-orange/30",
  medium: "bg-lux-gold/15 text-lux-gold border-lux-gold/30",
  low: "bg-lux-green/15 text-lux-green border-lux-green/30",
};

const IMPACT_COLORS: Record<string, string> = {
  critical: "severity-critical",
  high: "severity-high",
  medium: "severity-medium",
  low: "severity-low",
};

export default function GoogleRankOptimizer() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isResearching, setIsResearching] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [researchData, setResearchData] = useState<any>(null);
  const [fixResults, setFixResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedFactors, setExpandedFactors] = useState<Set<number>>(new Set());

  const { data: profiles } = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const deepResearchMutation = trpc.googleRank.deepResearch.useMutation();
  const autoFixAllMutation = trpc.googleRank.autoFixAll.useMutation();

  const profile = profiles?.[0];

  const handleResearch = async () => {
    if (!profile) {
      toast.error("Please create a company profile first");
      navigate("/company/new");
      return;
    }
    setIsResearching(true);
    setResearchData(null);
    setFixResults(null);
    try {
      const result = await deepResearchMutation.mutateAsync({ companyProfileId: profile.id });
      setResearchData(result);
      toast.success("Deep Google research complete!");
    } catch (error: any) {
      toast.error(error.message || "Research failed");
    } finally {
      setIsResearching(false);
    }
  };

  const handleAutoFixAll = async () => {
    if (!profile || !researchData) return;
    setIsFixing(true);
    try {
      const result = await autoFixAllMutation.mutateAsync({
        companyProfileId: profile.id,
        researchData,
      });
      setFixResults(result);
      toast.success(`${result.totalFixesApplied || 0} fixes applied!`);
    } catch (error: any) {
      toast.error(error.message || "Auto-fix failed");
    } finally {
      setIsFixing(false);
    }
  };

  const toggleFactor = (i: number) => {
    setExpandedFactors(prev => {
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
            <p className="text-sm text-muted-foreground mb-4">Sign in to access the Google Rank Optimizer</p>
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-gold via-lux-green to-lux-gold" />
          <div className="absolute top-4 right-4 opacity-15">
            <img src={ICONS_3D.magnifyingGlass} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-10">
            <img src={ICONS_3D.rocket} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-green/20 to-emerald-600/10 flex items-center justify-center shadow-lg shadow-lux-green/10 border border-lux-green/20 overflow-hidden">
                  <img src={ICONS_3D.magnifyingGlass} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">Google Rank Optimizer</h1>
                    <Badge className="bg-lux-gold/10 text-lux-gold border-lux-gold/20 gap-1">
                      <Crown className="w-3 h-3" /> Premium
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-lg">
                    Deep AI research into what Google wants for your business. The AI Agent analyzes every ranking factor, then auto-fixes everything to get you to #1.
                  </p>
                </div>
              </div>
            </div>

            {profile && (
              <div className="mt-6 p-4 rounded-xl bg-card/50 border border-border/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                  <img src={ICONS_3D.checklist} alt="" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{profile.businessName}</p>
                  <p className="text-xs text-muted-foreground">{profile.industry} · {profile.location}</p>
                </div>
                <Badge variant="outline" className="text-xs border-lux-green/30 text-lux-green">Active Profile</Badge>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button onClick={handleResearch} disabled={isResearching || isFixing || !profile} className="bg-gradient-to-r from-lux-gold to-amber-600 text-black font-semibold hover:opacity-90 gap-2">
                <Search className="w-4 h-4" /> {researchData ? "Re-Run Deep Research" : "Start Deep Research"}
              </Button>
              {researchData && !fixResults && (
                <Button onClick={handleAutoFixAll} disabled={isFixing} variant="outline" className="border-lux-green/30 text-lux-green hover:bg-lux-green/10 gap-2">
                  <Bot className="w-4 h-4" /> Auto-Fix ALL Issues
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading States */}
        {isResearching && (
          <AuditLoader
            steps={GOOGLE_RANK_RESEARCH_STEPS}
            isComplete={false}
            title="Deep Google Research"
            subtitle={`Analyzing every ranking factor for ${profile?.businessName || "your business"}...`}
          />
        )}

        {isFixing && (
          <AuditLoader
            steps={GOOGLE_RANK_AUTOFIX_STEPS}
            isComplete={false}
            title="AI Agent Auto-Fixing"
            subtitle="Executing all optimizations automatically..."
          />
        )}

        {/* Fix Results */}
        {fixResults && !isFixing && (
          <Card className="premium-card overflow-hidden border-lux-green/30">
            <CardHeader className="bg-lux-green/5">
              <CardTitle className="text-lg font-display flex items-center gap-2 text-lux-green">
                <CheckCircle className="w-5 h-5" /> Auto-Fix Complete — {fixResults.totalFixesApplied || 0} Fixes Applied
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {fixResults.implementationReport && (
                <div className="space-y-3">
                  <p className="text-sm text-foreground/90">{fixResults.implementationReport.summary}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-lg font-bold text-lux-green">{fixResults.implementationReport.estimatedRankImprovement || "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Rank Improvement</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-lg font-bold text-lux-cyan">{fixResults.implementationReport.estimatedTrafficIncrease || "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Traffic Increase</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-lg font-bold text-lux-gold">{fixResults.implementationReport.estimatedRevenueImpact || "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Revenue Impact</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-lg font-bold text-lux-orange">{fixResults.implementationReport.timelineToResults || "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Time to Results</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Assets */}
              {fixResults.generatedAssets && (
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-lux-gold" /> Generated Assets</h3>

                  {fixResults.generatedAssets.schemaMarkupJsonLd && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-lux-gold">Schema Markup (JSON-LD)</p>
                        <CopyButton text={fixResults.generatedAssets.schemaMarkupJsonLd} />
                      </div>
                      <pre className="text-[10px] text-foreground/60 overflow-x-auto max-h-32 scrollbar-thin">{fixResults.generatedAssets.schemaMarkupJsonLd}</pre>
                    </div>
                  )}

                  {fixResults.generatedAssets.metaTitle && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-lux-gold">Optimized Meta Title</p>
                        <CopyButton text={fixResults.generatedAssets.metaTitle} />
                      </div>
                      <p className="text-sm text-foreground/80">{fixResults.generatedAssets.metaTitle}</p>
                    </div>
                  )}

                  {fixResults.generatedAssets.metaDescription && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-lux-gold">Optimized Meta Description</p>
                        <CopyButton text={fixResults.generatedAssets.metaDescription} />
                      </div>
                      <p className="text-sm text-foreground/80">{fixResults.generatedAssets.metaDescription}</p>
                    </div>
                  )}

                  {fixResults.generatedAssets.optimizedDescription && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-lux-gold">Optimized Business Description</p>
                        <CopyButton text={fixResults.generatedAssets.optimizedDescription} />
                      </div>
                      <p className="text-sm text-foreground/80 whitespace-pre-line">{fixResults.generatedAssets.optimizedDescription}</p>
                    </div>
                  )}

                  {fixResults.generatedAssets.targetKeywords?.length > 0 && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <p className="text-xs font-medium text-lux-gold mb-2">Target Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {fixResults.generatedAssets.targetKeywords.map((kw: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-lux-gold/10 text-lux-gold border border-lux-gold/20 cursor-pointer hover:bg-lux-gold/20" onClick={() => { navigator.clipboard.writeText(kw); toast.success(`Copied: ${kw}`); }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {fixResults.generatedAssets.reviewRequestTemplates?.length > 0 && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <p className="text-xs font-medium text-lux-gold mb-2">Review Request Templates</p>
                      {fixResults.generatedAssets.reviewRequestTemplates.map((t: any, i: number) => (
                        <div key={i} className="mb-2 p-2 rounded bg-background/50 border border-border/10">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[10px]">{t.channel || `Template ${i + 1}`}</Badge>
                            <CopyButton text={t.template || t} />
                          </div>
                          <p className="text-xs text-foreground/70 whitespace-pre-line">{t.template || t}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {fixResults.generatedAssets.citationDirectories?.length > 0 && (
                    <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                      <p className="text-xs font-medium text-lux-gold mb-2">Citation Directories to Submit</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {fixResults.generatedAssets.citationDirectories.map((d: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/10">
                            <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{d.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{d.url}</p>
                            </div>
                            <Badge className={IMPACT_COLORS[d.priority?.toLowerCase()] || "severity-medium"} variant="outline">{d.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {fixResults.implementationReport?.nextSteps?.length > 0 && (
                    <div className="p-3 rounded-lg bg-lux-gold/5 border border-lux-gold/20">
                      <p className="text-xs font-medium text-lux-gold mb-2">Next Steps</p>
                      {fixResults.implementationReport.nextSteps.map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <span className="text-[10px] text-lux-gold font-mono mt-0.5">{i + 1}.</span>
                          <p className="text-xs text-foreground/80">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Research Results */}
        {researchData && !isResearching && (
          <div className="space-y-6">
            {/* Summary Cards */}
            {researchData.researchSummary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="premium-card text-center p-4">
                  <ScoreRing score={researchData.researchSummary.overallReadinessScore || 0} size={56} />
                  <p className="text-xs text-muted-foreground mt-2">Readiness Score</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-lg font-bold text-lux-orange">{researchData.researchSummary.currentRankingEstimate || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current Ranking</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-lg font-bold text-lux-green">{researchData.researchSummary.targetPosition || "#1"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Target Position</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <Badge className={WEIGHT_COLORS[researchData.researchSummary.competitiveDifficulty] || WEIGHT_COLORS.medium}>
                    {researchData.researchSummary.competitiveDifficulty || "medium"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">Difficulty</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-lg font-bold text-lux-cyan">{researchData.researchSummary.estimatedTimeToRank || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Time to Rank</p>
                </Card>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 border border-border/30 p-1 flex-wrap h-auto gap-1">
                <TabsTrigger value="overview" className="gap-1.5 data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <BarChart3 className="w-3.5 h-3.5" /> Ranking Factors
                </TabsTrigger>
                <TabsTrigger value="local" className="gap-1.5 data-[state=active]:bg-lux-green/10 data-[state=active]:text-lux-green">
                  <MapPin className="w-3.5 h-3.5" /> Local SEO
                </TabsTrigger>
                <TabsTrigger value="technical" className="gap-1.5 data-[state=active]:bg-lux-cyan/10 data-[state=active]:text-lux-cyan">
                  <Wrench className="w-3.5 h-3.5" /> Technical SEO
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-1.5 data-[state=active]:bg-lux-purple/10 data-[state=active]:text-lux-purple">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="competitors" className="gap-1.5 data-[state=active]:bg-lux-orange/10 data-[state=active]:text-lux-orange">
                  <Target className="w-3.5 h-3.5" /> Competitors
                </TabsTrigger>
                <TabsTrigger value="fixplan" className="gap-1.5 data-[state=active]:bg-lux-red/10 data-[state=active]:text-lux-red">
                  <Bot className="w-3.5 h-3.5" /> Fix Plan
                </TabsTrigger>
              </TabsList>

              {/* Ranking Factors */}
              <TabsContent value="overview" className="mt-6 space-y-3">
                {(researchData.googleRankingFactors || []).map((factor: any, i: number) => {
                  const statusConfig = STATUS_ICONS[factor.currentStatus] || STATUS_ICONS.needs_improvement;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <Card key={i} className="premium-card overflow-hidden">
                      <div className="p-4 cursor-pointer" onClick={() => toggleFactor(i)}>
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-5 h-5 shrink-0 ${statusConfig.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm truncate">{factor.factor}</p>
                              <Badge className={`${WEIGHT_COLORS[factor.weight] || WEIGHT_COLORS.medium} text-[10px]`}>{factor.weight}</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={factor.currentScore || 0} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground">{factor.currentScore || 0}/{factor.targetScore || 100}</span>
                            </div>
                          </div>
                          {expandedFactors.has(i) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      {expandedFactors.has(i) && (
                        <div className="px-4 pb-4 pt-0 border-t border-border/20">
                          <p className="text-sm text-foreground/80 mt-3">{factor.details}</p>
                          {factor.fixRequired && (
                            <Badge className="mt-2 severity-high text-[10px]">Fix Required</Badge>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </TabsContent>

              {/* Local SEO */}
              <TabsContent value="local" className="mt-6 space-y-4">
                {researchData.localSeoAnalysis && (
                  <>
                    {/* NAP Consistency */}
                    <Card className="premium-card p-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-lux-gold" /> NAP Consistency</h3>
                      <p className="text-xs text-muted-foreground mb-2">Status: {researchData.localSeoAnalysis.napConsistency?.status}</p>
                      {researchData.localSeoAnalysis.napConsistency?.issues?.map((issue: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 mb-1"><AlertTriangle className="w-3 h-3 text-lux-orange mt-0.5 shrink-0" /><p className="text-xs text-foreground/70">{issue}</p></div>
                      ))}
                      {researchData.localSeoAnalysis.napConsistency?.fix && (
                        <div className="mt-2 p-2 rounded bg-lux-green/5 border border-lux-green/20">
                          <p className="text-xs text-lux-green">{researchData.localSeoAnalysis.napConsistency.fix}</p>
                        </div>
                      )}
                    </Card>

                    {/* GBP */}
                    <Card className="premium-card p-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-lux-gold" /> Google Business Profile</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <Progress value={researchData.localSeoAnalysis.googleBusinessProfile?.completeness || 0} className="h-2 flex-1" />
                        <span className="text-xs font-bold">{researchData.localSeoAnalysis.googleBusinessProfile?.completeness || 0}%</span>
                      </div>
                      {researchData.localSeoAnalysis.googleBusinessProfile?.missingFields?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Missing Fields:</p>
                          <div className="flex flex-wrap gap-1">{researchData.localSeoAnalysis.googleBusinessProfile.missingFields.map((f: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-lux-red/30 text-lux-red">{f}</Badge>
                          ))}</div>
                        </div>
                      )}
                      {researchData.localSeoAnalysis.googleBusinessProfile?.optimizations?.map((opt: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 mb-1"><Zap className="w-3 h-3 text-lux-gold mt-0.5 shrink-0" /><p className="text-xs text-foreground/70">{opt}</p></div>
                      ))}
                    </Card>

                    {/* Keywords */}
                    {researchData.localSeoAnalysis.localKeywords?.length > 0 && (
                      <Card className="premium-card p-4">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Search className="w-4 h-4 text-lux-gold" /> Local Keywords</h3>
                        <div className="space-y-2">
                          {researchData.localSeoAnalysis.localKeywords.map((kw: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded bg-card/50 border border-border/20">
                              <p className="text-xs font-medium flex-1">{kw.keyword}</p>
                              <span className="text-[10px] text-muted-foreground">Vol: {kw.searchVolume}</span>
                              <Badge className={WEIGHT_COLORS[kw.difficulty?.toLowerCase()] || WEIGHT_COLORS.medium} variant="outline">{kw.difficulty}</Badge>
                              <span className="text-[10px] text-muted-foreground">Rank: {kw.currentRanking}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Review Strategy */}
                    {researchData.localSeoAnalysis.reviewStrategy && (
                      <Card className="premium-card p-4">
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-lux-gold" /> Review Strategy</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-2 rounded bg-card/50 border border-border/20">
                            <p className="text-lg font-bold">{researchData.localSeoAnalysis.reviewStrategy.currentRating || 0}</p>
                            <p className="text-[10px] text-muted-foreground">Current Rating</p>
                          </div>
                          <div className="text-center p-2 rounded bg-card/50 border border-border/20">
                            <p className="text-lg font-bold text-lux-green">{researchData.localSeoAnalysis.reviewStrategy.targetRating || 0}</p>
                            <p className="text-[10px] text-muted-foreground">Target Rating</p>
                          </div>
                          <div className="text-center p-2 rounded bg-card/50 border border-border/20">
                            <p className="text-lg font-bold">{researchData.localSeoAnalysis.reviewStrategy.currentCount || 0}</p>
                            <p className="text-[10px] text-muted-foreground">Current Reviews</p>
                          </div>
                          <div className="text-center p-2 rounded bg-card/50 border border-border/20">
                            <p className="text-lg font-bold text-lux-green">{researchData.localSeoAnalysis.reviewStrategy.targetCount || 0}</p>
                            <p className="text-[10px] text-muted-foreground">Target Reviews</p>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/80">{researchData.localSeoAnalysis.reviewStrategy.strategy}</p>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Technical SEO */}
              <TabsContent value="technical" className="mt-6 space-y-4">
                {researchData.technicalSeo && (
                  <>
                    {researchData.technicalSeo.schemaMarkup?.jsonLd && (
                      <Card className="premium-card p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-lux-gold" /> Schema Markup (JSON-LD)</h3>
                          <CopyButton text={researchData.technicalSeo.schemaMarkup.jsonLd} />
                        </div>
                        <pre className="text-[10px] text-foreground/60 bg-card/50 p-3 rounded border border-border/20 overflow-x-auto max-h-48">{researchData.technicalSeo.schemaMarkup.jsonLd}</pre>
                      </Card>
                    )}

                    {researchData.technicalSeo.metaTags && (
                      <Card className="premium-card p-4 space-y-3">
                        <h3 className="font-semibold text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-lux-gold" /> Optimized Meta Tags</h3>
                        <div className="p-2 rounded bg-card/50 border border-border/20">
                          <div className="flex items-center justify-between mb-1"><p className="text-xs text-muted-foreground font-medium">Title Tag</p><CopyButton text={researchData.technicalSeo.metaTags.title} /></div>
                          <p className="text-sm text-foreground/90">{researchData.technicalSeo.metaTags.title}</p>
                        </div>
                        <div className="p-2 rounded bg-card/50 border border-border/20">
                          <div className="flex items-center justify-between mb-1"><p className="text-xs text-muted-foreground font-medium">Meta Description</p><CopyButton text={researchData.technicalSeo.metaTags.description} /></div>
                          <p className="text-sm text-foreground/90">{researchData.technicalSeo.metaTags.description}</p>
                        </div>
                        {researchData.technicalSeo.metaTags.keywords?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {researchData.technicalSeo.metaTags.keywords.map((kw: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-lux-gold/10 text-lux-gold border border-lux-gold/20 cursor-pointer hover:bg-lux-gold/20" onClick={() => { navigator.clipboard.writeText(kw); toast.success(`Copied: ${kw}`); }}>{kw}</span>
                            ))}
                          </div>
                        )}
                      </Card>
                    )}

                    {researchData.technicalSeo.siteSpeed?.recommendations?.length > 0 && (
                      <Card className="premium-card p-4">
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-lux-gold" /> Site Speed</h3>
                        {researchData.technicalSeo.siteSpeed.recommendations.map((r: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 mb-1.5"><ArrowRight className="w-3 h-3 text-lux-gold mt-0.5 shrink-0" /><p className="text-xs text-foreground/70">{r}</p></div>
                        ))}
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Content Strategy */}
              <TabsContent value="content" className="mt-6 space-y-4">
                {researchData.contentStrategy && (
                  <>
                    {researchData.contentStrategy.optimizedBusinessDescription && (
                      <Card className="premium-card p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-lux-gold" /> Optimized Business Description</h3>
                          <CopyButton text={researchData.contentStrategy.optimizedBusinessDescription} />
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{researchData.contentStrategy.optimizedBusinessDescription}</p>
                      </Card>
                    )}

                    {researchData.contentStrategy.blogTopics?.length > 0 && (
                      <Card className="premium-card p-4">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-lux-gold" /> Blog Topics for SEO</h3>
                        {researchData.contentStrategy.blogTopics.map((topic: any, i: number) => (
                          <div key={i} className="p-3 rounded bg-card/50 border border-border/20 mb-2">
                            <p className="text-sm font-medium">{topic.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-muted-foreground">Keyword: {topic.targetKeyword}</span>
                              <span className="text-[10px] text-lux-green">Est. Traffic: {topic.estimatedTraffic}</span>
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}

                    {researchData.contentStrategy.faqContent?.length > 0 && (
                      <Card className="premium-card p-4">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-lux-gold" /> FAQ Content</h3>
                        {researchData.contentStrategy.faqContent.map((faq: any, i: number) => (
                          <div key={i} className="p-3 rounded bg-card/50 border border-border/20 mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">{faq.question}</p>
                              <CopyButton text={`Q: ${faq.question}\nA: ${faq.answer}`} />
                            </div>
                            <p className="text-xs text-foreground/70">{faq.answer}</p>
                          </div>
                        ))}
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Competitors */}
              <TabsContent value="competitors" className="mt-6 space-y-4">
                {(researchData.competitorInsights || []).map((comp: any, i: number) => (
                  <Card key={i} className="premium-card p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-lux-orange" /> {comp.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-lux-green font-medium mb-1">Strengths</p>
                        {comp.strengths?.map((s: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1"><CheckCircle className="w-3 h-3 text-lux-green mt-0.5 shrink-0" /><p className="text-xs text-foreground/70">{s}</p></div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs text-lux-red font-medium mb-1">Weaknesses</p>
                        {comp.weaknesses?.map((w: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1"><XCircle className="w-3 h-3 text-lux-red mt-0.5 shrink-0" /><p className="text-xs text-foreground/70">{w}</p></div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="p-2 rounded bg-lux-green/5 border border-lux-green/20">
                        <p className="text-[10px] text-lux-green font-medium">Copy This:</p>
                        <p className="text-xs text-foreground/70">{comp.whatToCopy}</p>
                      </div>
                      <div className="p-2 rounded bg-lux-red/5 border border-lux-red/20">
                        <p className="text-[10px] text-lux-red font-medium">Avoid This:</p>
                        <p className="text-xs text-foreground/70">{comp.whatToAvoid}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Fix Plan */}
              <TabsContent value="fixplan" className="mt-6 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2"><Bot className="w-5 h-5 text-lux-gold" /> AI Agent Fix Plan</h3>
                  {!fixResults && (
                    <Button onClick={handleAutoFixAll} disabled={isFixing} size="sm" className="bg-gradient-to-r from-lux-green to-emerald-600 text-black font-semibold gap-2">
                      <Zap className="w-3.5 h-3.5" /> Execute All Fixes
                    </Button>
                  )}
                </div>
                {(researchData.autoFixPlan || []).sort((a: any, b: any) => (a.priority || 99) - (b.priority || 99)).map((fix: any, i: number) => (
                  <Card key={i} className="premium-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lux-gold/10 flex items-center justify-center text-xs font-bold text-lux-gold">{fix.priority || i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm truncate">{fix.title}</p>
                          <Badge className={IMPACT_COLORS[fix.impact?.toLowerCase()] || "severity-medium"} variant="outline">{fix.impact}</Badge>
                          <Badge variant="outline" className="text-[10px]">{fix.effort}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{fix.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">{fix.estimatedTime}</p>
                        <Badge variant="outline" className="text-[10px] mt-0.5">{fix.category}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!researchData && !isResearching && (
          <div className="text-center py-16">
            <img src={ICONS_3D.magnifyingGlass} alt="" className="w-24 h-24 mx-auto mb-6 opacity-40 animate-bounce-slow" />
            <h3 className="text-xl font-display font-bold mb-2 text-muted-foreground">Ready to Optimize</h3>
            <p className="text-sm text-muted-foreground/60 max-w-md mx-auto mb-6">
              {profile
                ? `Click "Start Deep Research" to analyze every Google ranking factor for ${profile.businessName} and build an auto-fix plan.`
                : "Create a company profile first to run Google ranking research."}
            </p>
            {!profile && (
              <Button onClick={() => navigate("/company/new")} className="bg-gradient-to-r from-lux-gold to-amber-600 text-black font-semibold gap-2">
                <ArrowRight className="w-4 h-4" /> Create Company Profile
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
