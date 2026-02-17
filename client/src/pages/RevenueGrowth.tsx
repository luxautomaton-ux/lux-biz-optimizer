import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles, Crown, ArrowRight, TrendingUp, DollarSign,
  ChevronDown, ChevronUp, ExternalLink, Zap, Clock,
  Target, Lock, CheckCircle, BarChart3, Globe, Star,
  Copy, Check,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D } from "@/lib/icons3d";

const REVENUE_LOADING_STEPS = [
  { label: "Analyzing Business Profile", description: "Reviewing your industry, services, and market position", icon: ICONS_3D.analyticsSearch, durationMs: 5000 },
  { label: "Researching Revenue Strategies", description: "AI finding best growth strategies for your niche", icon: ICONS_3D.aiAssistant, durationMs: 10000 },
  { label: "Evaluating Software & SaaS", description: "Matching you with the best tools for growth", icon: ICONS_3D.gear, durationMs: 8000 },
  { label: "Building Growth Plan", description: "Creating actionable steps with ROI estimates", icon: ICONS_3D.rocket, durationMs: 7000 },
];

const SECTION_ICONS: Record<string, string> = {
  marketing: ICONS_3D.megaphone,
  operations: ICONS_3D.gear,
  retention: ICONS_3D.starsRating,
  leadgen: ICONS_3D.radar,
  pricing: ICONS_3D.diamond,
  techstack: ICONS_3D.lightning,
  automation: ICONS_3D.aiBot,
  analytics: ICONS_3D.analyticsChart,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-lux-green/15 text-lux-green border-lux-green/30",
  medium: "bg-lux-gold/15 text-lux-gold border-lux-gold/30",
  hard: "bg-lux-red/15 text-lux-red border-lux-red/30",
};

const EFFORT_COLORS: Record<string, string> = {
  low: "bg-lux-green/15 text-lux-green border-lux-green/30",
  medium: "bg-lux-gold/15 text-lux-gold border-lux-gold/30",
  high: "bg-lux-red/15 text-lux-red border-lux-red/30",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs border-lux-gold/20 hover:bg-lux-gold/10 hover:text-lux-gold">
      {copied ? <Check className="w-3 h-3 text-lux-green" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

export default function RevenueGrowth() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("strategies");
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const { data: profiles } = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const getStrategiesMutation = trpc.revenueGrowth.getStrategies.useMutation();

  const profile = profiles?.[0];

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Please create a company profile first");
      navigate("/company/new");
      return;
    }
    setIsGenerating(true);
    setData(null);
    try {
      const result = await getStrategiesMutation.mutateAsync({ companyProfileId: profile.id });
      setData(result);
      toast.success("Revenue & Growth strategies generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate strategies");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (i: number) => {
    setExpandedSections(prev => {
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
            <p className="text-sm text-muted-foreground mb-4">Sign in to access Revenue & Growth strategies</p>
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
            <img src={ICONS_3D.rocket} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-10">
            <img src={ICONS_3D.diamond} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
                  <img src={ICONS_3D.rocket} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">Revenue & Growth</h1>
                    <Badge className="bg-lux-gold/10 text-lux-gold border-lux-gold/20 gap-1">
                      <Crown className="w-3 h-3" /> Premium
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-lg">
                    AI-powered revenue strategies across every business section. Get personalized software & SaaS recommendations with ROI estimates.
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

            <div className="mt-6">
              <Button onClick={handleGenerate} disabled={isGenerating || !profile} className="bg-gradient-to-r from-lux-gold to-amber-600 text-black font-semibold hover:opacity-90 gap-2">
                <Sparkles className="w-4 h-4" /> {data ? "Regenerate Strategies" : "Generate Growth Plan"}
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isGenerating && (
          <AuditLoader steps={REVENUE_LOADING_STEPS} isComplete={false} title="Building Your Growth Plan" subtitle={`Analyzing revenue opportunities for ${profile?.businessName || "your business"}...`} />
        )}

        {/* Results */}
        {data && !isGenerating && (
          <div className="space-y-6">
            {/* Overall Strategy Summary */}
            {data.overallStrategy && (
              <Card className="premium-card overflow-hidden border-lux-gold/30">
                <CardHeader className="bg-lux-gold/5">
                  <CardTitle className="text-lg font-display flex items-center gap-2 text-lux-gold">
                    <TrendingUp className="w-5 h-5" /> Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4">{data.overallStrategy.summary}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-2xl font-bold text-lux-green">{data.overallStrategy.estimatedRevenueIncrease || "—"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Revenue Increase</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-2xl font-bold text-lux-cyan">{data.overallStrategy.timelineMonths || "—"} mo</p>
                      <p className="text-xs text-muted-foreground mt-1">Timeline</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <Badge className={`${data.overallStrategy.priorityLevel === "high" ? "severity-high" : data.overallStrategy.priorityLevel === "low" ? "severity-low" : "severity-medium"}`}>
                        {data.overallStrategy.priorityLevel || "medium"} priority
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">Priority Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 border border-border/30 p-1 flex-wrap h-auto gap-1">
                <TabsTrigger value="strategies" className="gap-1.5 data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                  <BarChart3 className="w-3.5 h-3.5" /> Strategies
                </TabsTrigger>
                <TabsTrigger value="saas" className="gap-1.5 data-[state=active]:bg-lux-purple/10 data-[state=active]:text-lux-purple">
                  <Globe className="w-3.5 h-3.5" /> Software & SaaS
                </TabsTrigger>
                <TabsTrigger value="quickwins" className="gap-1.5 data-[state=active]:bg-lux-green/10 data-[state=active]:text-lux-green">
                  <Zap className="w-3.5 h-3.5" /> Quick Wins
                </TabsTrigger>
              </TabsList>

              {/* Strategies */}
              <TabsContent value="strategies" className="mt-6 space-y-4">
                {(data.sections || []).map((section: any, i: number) => (
                  <Card key={i} className="premium-card overflow-hidden">
                    <div className="p-4 cursor-pointer" onClick={() => toggleSection(i)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={SECTION_ICONS[section.icon] || ICONS_3D.analyticsChart} alt="" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{section.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{section.currentGap}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {section.expectedImpact && (
                            <>
                              <Badge variant="outline" className="text-[10px] border-lux-green/30 text-lux-green">{section.expectedImpact.revenueImpact}</Badge>
                              <Badge className={DIFFICULTY_COLORS[section.expectedImpact.difficulty] || DIFFICULTY_COLORS.medium} variant="outline">{section.expectedImpact.difficulty}</Badge>
                            </>
                          )}
                          {expandedSections.has(i) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>

                    {expandedSections.has(i) && (
                      <div className="px-4 pb-4 border-t border-border/20 space-y-4">
                        {/* Strategy */}
                        <div className="mt-3">
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{section.strategy}</p>
                        </div>

                        {/* Impact */}
                        {section.expectedImpact && (
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-2 rounded bg-card/50 border border-border/20 text-center">
                              <p className="text-sm font-bold text-lux-green">{section.expectedImpact.revenueImpact}</p>
                              <p className="text-[10px] text-muted-foreground">Revenue Impact</p>
                            </div>
                            <div className="p-2 rounded bg-card/50 border border-border/20 text-center">
                              <p className="text-sm font-bold text-lux-cyan">{section.expectedImpact.timeToResult}</p>
                              <p className="text-[10px] text-muted-foreground">Time to Result</p>
                            </div>
                            <div className="p-2 rounded bg-card/50 border border-border/20 text-center">
                              <Badge className={DIFFICULTY_COLORS[section.expectedImpact.difficulty] || DIFFICULTY_COLORS.medium}>{section.expectedImpact.difficulty}</Badge>
                              <p className="text-[10px] text-muted-foreground mt-1">Difficulty</p>
                            </div>
                          </div>
                        )}

                        {/* Action Steps */}
                        {section.actionSteps?.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-2">Action Steps:</p>
                            {section.actionSteps.map((step: string, j: number) => (
                              <div key={j} className="flex items-start gap-2 mb-1.5">
                                <CheckCircle className="w-3 h-3 text-lux-gold mt-0.5 shrink-0" />
                                <p className="text-xs text-foreground/70">{step}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommended Tools */}
                        {section.recommendedTools?.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-2">Recommended Software & SaaS:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {section.recommendedTools.map((tool: any, j: number) => (
                                <div key={j} className="p-3 rounded-lg bg-card/50 border border-border/20 hover:border-lux-gold/20 transition-colors">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold">{tool.name}</p>
                                    <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
                                  </div>
                                  <p className="text-xs text-foreground/70 mb-1.5">{tool.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-lux-gold font-medium">{tool.pricing}</span>
                                    {tool.website && (
                                      <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-lux-cyan hover:underline flex items-center gap-0.5">
                                        Visit <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                  {tool.whyRecommended && (
                                    <p className="text-[10px] text-lux-green mt-1 italic">{tool.whyRecommended}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </TabsContent>

              {/* SaaS Stack */}
              <TabsContent value="saas" className="mt-6 space-y-6">
                {data.saasStack && (
                  <>
                    {/* Essential */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-lux-green/15 text-lux-green border-lux-green/30">Essential</Badge>
                        <span className="text-xs text-muted-foreground">Total: {data.saasStack.totalMonthlyCostEssential || "$0"}/mo</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(data.saasStack.essential || []).map((tool: any, i: number) => (
                          <Card key={i} className="premium-card p-4">
                            <p className="font-semibold text-sm mb-0.5">{tool.name}</p>
                            <Badge variant="outline" className="text-[10px] mb-2">{tool.category}</Badge>
                            <p className="text-xs text-foreground/70 mb-2">{tool.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-lux-gold font-medium">{tool.monthlyCost}</span>
                              {tool.website && <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-lux-cyan hover:underline flex items-center gap-0.5">Visit <ExternalLink className="w-2.5 h-2.5" /></a>}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Growth */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-lux-gold/15 text-lux-gold border-lux-gold/30">Growth</Badge>
                        <span className="text-xs text-muted-foreground">Total: {data.saasStack.totalMonthlyCostGrowth || "$0"}/mo</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(data.saasStack.growth || []).map((tool: any, i: number) => (
                          <Card key={i} className="premium-card p-4">
                            <p className="font-semibold text-sm mb-0.5">{tool.name}</p>
                            <Badge variant="outline" className="text-[10px] mb-2">{tool.category}</Badge>
                            <p className="text-xs text-foreground/70 mb-2">{tool.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-lux-gold font-medium">{tool.monthlyCost}</span>
                              {tool.website && <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-lux-cyan hover:underline flex items-center gap-0.5">Visit <ExternalLink className="w-2.5 h-2.5" /></a>}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Enterprise */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-lux-purple/15 text-lux-purple border-lux-purple/30">Enterprise</Badge>
                        <span className="text-xs text-muted-foreground">Total: {data.saasStack.totalMonthlyCostEnterprise || "$0"}/mo</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(data.saasStack.enterprise || []).map((tool: any, i: number) => (
                          <Card key={i} className="premium-card p-4">
                            <p className="font-semibold text-sm mb-0.5">{tool.name}</p>
                            <Badge variant="outline" className="text-[10px] mb-2">{tool.category}</Badge>
                            <p className="text-xs text-foreground/70 mb-2">{tool.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-lux-gold font-medium">{tool.monthlyCost}</span>
                              {tool.website && <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-lux-cyan hover:underline flex items-center gap-0.5">Visit <ExternalLink className="w-2.5 h-2.5" /></a>}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Quick Wins */}
              <TabsContent value="quickwins" className="mt-6 space-y-3">
                {(data.quickWins || []).map((win: any, i: number) => (
                  <Card key={i} className="premium-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lux-green/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-lux-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{win.action}</p>
                        <p className="text-xs text-muted-foreground">{win.impact}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={EFFORT_COLORS[win.effort] || EFFORT_COLORS.medium} variant="outline">{win.effort} effort</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-3 h-3" />{win.timeline}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!data && !isGenerating && (
          <div className="text-center py-16">
            <img src={ICONS_3D.rocket} alt="" className="w-24 h-24 mx-auto mb-6 opacity-40 animate-bounce-slow" />
            <h3 className="text-xl font-display font-bold mb-2 text-muted-foreground">Ready to Grow</h3>
            <p className="text-sm text-muted-foreground/60 max-w-md mx-auto mb-6">
              {profile
                ? `Click "Generate Growth Plan" to get AI-powered revenue strategies and SaaS recommendations for ${profile.businessName}.`
                : "Create a company profile first to generate personalized growth strategies."}
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
