import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles, Copy, Check, Crown, ArrowRight, Star,
  TrendingUp, Clock, Target, Users, DollarSign, Zap,
  ChevronDown, ChevronUp, ExternalLink, BarChart3,
  MessageSquare, Globe, Lock, Brain,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, AD_CREATOR_LOADING_STEPS } from "@/lib/icons3d";

// Platform configs with colors and icons
const PLATFORMS: Record<string, { label: string; color: string; bgClass: string; icon: string; charLimit: string }> = {
  facebook: { label: "Facebook", color: "text-blue-400", bgClass: "bg-blue-500/10 border-blue-500/20", icon: "📘", charLimit: "125-250 chars" },
  instagram: { label: "Instagram", color: "text-pink-400", bgClass: "bg-pink-500/10 border-pink-500/20", icon: "📸", charLimit: "2,200 chars" },
  tiktok: { label: "TikTok", color: "text-cyan-400", bgClass: "bg-cyan-500/10 border-cyan-500/20", icon: "🎵", charLimit: "150 chars" },
  twitter: { label: "X / Twitter", color: "text-neutral-300", bgClass: "bg-neutral-500/10 border-neutral-500/20", icon: "𝕏", charLimit: "280 chars" },
  linkedin: { label: "LinkedIn", color: "text-sky-400", bgClass: "bg-sky-500/10 border-sky-500/20", icon: "💼", charLimit: "3,000 chars" },
};

const LLM_CONFIGS: Record<string, { label: string; color: string; bgClass: string }> = {
  chatgpt: { label: "ChatGPT", color: "text-emerald-400", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
  gemini: { label: "Google Gemini", color: "text-blue-400", bgClass: "bg-blue-500/10 border-blue-500/20" },
  perplexity: { label: "Perplexity AI", color: "text-violet-400", bgClass: "bg-violet-500/10 border-violet-500/20" },
};

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

function AdCard({ ad, platform }: { ad: any; platform: string }) {
  const [expanded, setExpanded] = useState(false);
  const config = PLATFORMS[platform];

  // Build the full copyable text based on platform
  const getCopyText = () => {
    if (platform === "facebook") return `${ad.headline}\n\n${ad.primaryText}\n\n${ad.hashtags?.join(" ") || ""}`;
    if (platform === "instagram") return `${ad.caption}\n\n${ad.hashtags?.join(" ") || ""}`;
    if (platform === "tiktok") return `${ad.caption}\n\n${ad.hashtags?.join(" ") || ""}\n\n📝 Script:\n${ad.script || ""}`;
    if (platform === "twitter") return ad.thread?.length > 0 ? ad.thread.join("\n\n---\n\n") : ad.text;
    if (platform === "linkedin") return `${ad.headline}\n\n${ad.body}\n\n${ad.hashtags?.join(" ") || ""}`;
    return JSON.stringify(ad, null, 2);
  };

  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${config.bgClass} border ${config.color} text-xs`}>
              {config.icon} {ad.type?.replace(/_/g, " ") || "Post"}
            </Badge>
            {ad.charCount && <span className="text-[10px] text-muted-foreground">{ad.charCount} chars</span>}
          </div>
          <CopyButton text={getCopyText()} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main content preview */}
        {ad.headline && <p className="font-semibold text-foreground">{ad.headline}</p>}
        {ad.primaryText && <p className="text-sm text-muted-foreground leading-relaxed">{ad.primaryText}</p>}
        {ad.caption && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{ad.caption}</p>}
        {ad.text && <p className="text-sm text-muted-foreground">{ad.text}</p>}
        {ad.body && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{ad.body}</p>}
        {ad.hookLine && (
          <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 font-medium mb-0.5">Hook (First 3 Seconds):</p>
            <p className="text-sm font-semibold text-foreground">{ad.hookLine}</p>
          </div>
        )}

        {/* Hashtags */}
        {ad.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ad.hashtags.slice(0, expanded ? undefined : 8).map((tag: string, i: number) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-lux-gold/5 text-lux-gold/70 border border-lux-gold/10">{tag}</span>
            ))}
            {!expanded && ad.hashtags.length > 8 && (
              <span className="text-[10px] text-muted-foreground">+{ad.hashtags.length - 8} more</span>
            )}
          </div>
        )}

        {/* CTA */}
        {ad.callToAction && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-lux-gold/30 text-lux-gold">{ad.callToAction}</Badge>
          </div>
        )}

        {/* Expandable details */}
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-lux-gold transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Less details" : "More details"}
        </button>

        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border/30">
            {ad.script && (
              <div className="p-2 rounded bg-card/50 border border-border/20">
                <p className="text-xs text-muted-foreground font-medium mb-1">Full Script:</p>
                <p className="text-xs text-foreground/80 whitespace-pre-line">{ad.script}</p>
                <div className="mt-1"><CopyButton text={ad.script} /></div>
              </div>
            )}
            {ad.reelScript && (
              <div className="p-2 rounded bg-card/50 border border-border/20">
                <p className="text-xs text-muted-foreground font-medium mb-1">Reel Script:</p>
                <p className="text-xs text-foreground/80 whitespace-pre-line">{ad.reelScript}</p>
                <div className="mt-1"><CopyButton text={ad.reelScript} /></div>
              </div>
            )}
            {ad.thread?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Thread ({ad.thread.length} tweets):</p>
                {ad.thread.map((tweet: string, i: number) => (
                  <div key={i} className="p-2 rounded bg-card/50 border border-border/20 flex items-start gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{i + 1}.</span>
                    <p className="text-xs text-foreground/80 flex-1">{tweet}</p>
                    <CopyButton text={tweet} />
                  </div>
                ))}
              </div>
            )}
            {ad.imagePrompt && (
              <div className="p-2 rounded bg-lux-purple/5 border border-lux-purple/20">
                <p className="text-xs text-lux-purple font-medium mb-1">AI Image Prompt:</p>
                <p className="text-xs text-foreground/70">{ad.imagePrompt}</p>
                <div className="mt-1"><CopyButton text={ad.imagePrompt} /></div>
              </div>
            )}
            {ad.targetingTips && <p className="text-xs text-muted-foreground"><Target className="w-3 h-3 inline mr-1" />Targeting: {ad.targetingTips}</p>}
            {ad.bestTimeToPost && <p className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />Best time: {ad.bestTimeToPost}</p>}
            {ad.estimatedReach && <p className="text-xs text-muted-foreground"><Users className="w-3 h-3 inline mr-1" />Est. reach: {ad.estimatedReach}</p>}
            {ad.soundSuggestion && <p className="text-xs text-muted-foreground">🎵 Sound: {ad.soundSuggestion}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LLMDiscoveryCard({ data, llm }: { data: any; llm: string }) {
  const [expanded, setExpanded] = useState(false);
  const config = LLM_CONFIGS[llm];

  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${config.bgClass} border ${config.color} text-xs`}>
              <Brain className="w-3 h-3 mr-1" /> {config.label}
            </Badge>
            <ScoreRing score={data.score || 0} size={40} />
          </div>
          <CopyButton text={data.optimizedDescription || ""} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">Optimized Description for {config.label}:</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{data.optimizedDescription}</p>
        </div>

        {data.recommendationText && (
          <div className="p-2 rounded-lg bg-lux-gold/5 border border-lux-gold/20">
            <p className="text-xs text-lux-gold font-medium mb-1">How {config.label} Should Recommend You:</p>
            <p className="text-xs text-foreground/80 leading-relaxed">{data.recommendationText}</p>
            <div className="mt-1"><CopyButton text={data.recommendationText} /></div>
          </div>
        )}

        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-lux-gold transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Less" : "Prompt triggers & key phrases"}
        </button>

        {expanded && (
          <div className="space-y-3 pt-2 border-t border-border/30">
            {data.promptTriggers?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1.5">Prompts That Surface Your Business:</p>
                {data.promptTriggers.map((prompt: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground/70 italic">"{prompt}"</p>
                    <CopyButton text={prompt} />
                  </div>
                ))}
              </div>
            )}
            {data.keyPhrases?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1.5">Key Phrases to Embed:</p>
                <div className="flex flex-wrap gap-1">
                  {data.keyPhrases.map((phrase: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-lux-gold/10 text-lux-gold border border-lux-gold/20 cursor-pointer hover:bg-lux-gold/20 transition-colors" onClick={() => { navigator.clipboard.writeText(phrase); toast.success(`Copied: ${phrase}`); }}>
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdCreator() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [adGoal, setAdGoal] = useState<string>("leads");
  const [tone, setTone] = useState<string>("professional");
  const [budget, setBudget] = useState<string>("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("facebook");

  const { data: profiles } = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const generateAdsMutation = trpc.adCreator.generateAds.useMutation();

  // Use first profile (the user's business)
  const profile = profiles?.[0];

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Please create a company profile first");
      navigate("/company/new");
      return;
    }

    setIsGenerating(true);
    setAdData(null);

    try {
      const result = await generateAdsMutation.mutateAsync({
        companyProfileId: profile.id,
        adGoal: adGoal as any,
        tone: tone as any,
        budget: budget as any,
      });
      setAdData(result);
      toast.success("Ad campaigns generated for all platforms!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate ads");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="premium-card max-w-md text-center p-8">
            <Lock className="w-12 h-12 text-lux-gold mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">Sign In Required</h2>
            <p className="text-sm text-muted-foreground mb-4">Sign in to access the AI Ad Creator</p>
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-gold via-lux-orange to-lux-gold" />
          <div className="absolute top-4 right-4 opacity-15">
            <img src={ICONS_3D.megaphone} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-10">
            <img src={ICONS_3D.rocket} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
                  <img src={ICONS_3D.megaphone} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">AI Ad Creator</h1>
                    <Badge className="bg-lux-gold/10 text-lux-gold border-lux-gold/20 gap-1">
                      <Crown className="w-3 h-3" /> Premium
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-lg">
                    Generate copy-paste ready ads for every platform. AI creates optimized content for Facebook, Instagram, TikTok, X, LinkedIn — plus makes your business discoverable by ChatGPT, Gemini & Perplexity.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Profile Card */}
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

            {/* Settings Row */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Ad Goal</label>
                <Select value={adGoal} onValueChange={setAdGoal}>
                  <SelectTrigger className="bg-card/50 border-border/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Direct Sales</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-card/50 border-border/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Budget Level</label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="bg-card/50 border-border/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low ($100-500/mo)</SelectItem>
                    <SelectItem value="medium">Medium ($500-2K/mo)</SelectItem>
                    <SelectItem value="high">High ($2K+/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerate} disabled={isGenerating || !profile} className="w-full bg-gradient-to-r from-lux-gold to-amber-600 text-black font-semibold hover:opacity-90 gap-2">
                  <Sparkles className="w-4 h-4" /> Generate All Ads
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <AuditLoader
            steps={AD_CREATOR_LOADING_STEPS}
            isComplete={false}
            title="Creating Your Ad Campaigns"
            subtitle={`Generating optimized ads for ${profile?.businessName || "your business"} across all platforms...`}
          />
        )}

        {/* Results */}
        {adData && !isGenerating && (
          <div className="space-y-8">
            {/* Overall Strategy Summary */}
            {adData.overallStrategy && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="premium-card text-center p-4">
                  <ScoreRing score={adData.overallStrategy.totalScore || 0} size={56} />
                  <p className="text-xs text-muted-foreground mt-2">Overall Score</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-2xl font-bold text-lux-gold">{adData.overallStrategy.bestPlatform || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Best Platform</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-2xl font-bold text-lux-green">{adData.overallStrategy.estimatedMonthlyReach || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. Monthly Reach</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-2xl font-bold text-lux-cyan">{adData.overallStrategy.estimatedLeads || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. Leads</p>
                </Card>
                <Card className="premium-card text-center p-4">
                  <p className="text-2xl font-bold text-lux-orange">{adData.overallStrategy.estimatedROI || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. ROI</p>
                </Card>
              </div>
            )}

            {/* Platform Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 border border-border/30 p-1 flex-wrap h-auto gap-1">
                {Object.entries(PLATFORMS).map(([key, config]) => {
                  const platformData = adData.platforms?.[key];
                  return (
                    <TabsTrigger key={key} value={key} className="gap-1.5 data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
                      <span>{config.icon}</span>
                      <span className="hidden sm:inline">{config.label}</span>
                      {platformData?.score && <ScoreRing score={platformData.score} size={24} />}
                    </TabsTrigger>
                  );
                })}
                <TabsTrigger value="llm" className="gap-1.5 data-[state=active]:bg-lux-purple/10 data-[state=active]:text-lux-purple">
                  <Brain className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">AI Discovery</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-1.5 data-[state=active]:bg-lux-cyan/10 data-[state=active]:text-lux-cyan">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Schedule</span>
                </TabsTrigger>
              </TabsList>

              {/* Platform Ad Tabs */}
              {Object.entries(PLATFORMS).map(([key, config]) => (
                <TabsContent key={key} value={key} className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h2 className="text-xl font-display font-bold">{config.label} Ads</h2>
                      <p className="text-xs text-muted-foreground">Optimal: {config.charLimit} · Score: {adData.platforms?.[key]?.score || 0}/100</p>
                    </div>
                    {adData.overallStrategy?.budgetAllocation?.[key] && (
                      <Badge variant="outline" className="ml-auto text-xs border-lux-gold/30 text-lux-gold">
                        <DollarSign className="w-3 h-3 mr-0.5" /> {adData.overallStrategy.budgetAllocation[key]} budget
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(adData.platforms?.[key]?.ads || []).map((ad: any, i: number) => (
                      <AdCard key={i} ad={ad} platform={key} />
                    ))}
                  </div>
                  {(!adData.platforms?.[key]?.ads || adData.platforms[key].ads.length === 0) && (
                    <Card className="premium-card p-8 text-center">
                      <p className="text-muted-foreground">No ads generated for this platform. Try regenerating.</p>
                    </Card>
                  )}
                </TabsContent>
              ))}

              {/* LLM Discovery Tab */}
              <TabsContent value="llm" className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-lux-purple" />
                  <div>
                    <h2 className="text-xl font-display font-bold">AI / LLM Discovery</h2>
                    <p className="text-xs text-muted-foreground">Content optimized for AI chatbots to recommend your business</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {Object.entries(LLM_CONFIGS).map(([key]) => (
                    adData.llmDiscovery?.[key] && (
                      <LLMDiscoveryCard key={key} data={adData.llmDiscovery[key]} llm={key} />
                    )
                  ))}
                </div>
              </TabsContent>

              {/* Weekly Schedule Tab */}
              <TabsContent value="schedule" className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-lux-cyan" />
                  <div>
                    <h2 className="text-xl font-display font-bold">Weekly Posting Schedule</h2>
                    <p className="text-xs text-muted-foreground">Optimal posting times for maximum engagement</p>
                  </div>
                </div>
                {adData.overallStrategy?.weeklyPostingSchedule?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {adData.overallStrategy.weeklyPostingSchedule.map((slot: any, i: number) => (
                      <Card key={i} className="premium-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center text-lg">
                            {PLATFORMS[slot.platform?.toLowerCase()]?.icon || "📅"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{slot.day}</p>
                            <p className="text-xs text-muted-foreground">{slot.platform} · {slot.contentType}</p>
                          </div>
                          <Badge variant="outline" className="text-xs border-lux-cyan/30 text-lux-cyan">
                            <Clock className="w-3 h-3 mr-0.5" /> {slot.time}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="premium-card p-8 text-center">
                    <p className="text-muted-foreground">No schedule data available.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Business Summary */}
            {adData.businessSummary && (
              <Card className="premium-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <img src={ICONS_3D.analyticsSearch} alt="" className="w-6 h-6 object-contain" />
                    Brand Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Target Audience</p>
                      <p className="text-sm text-foreground/90">{adData.businessSummary.targetAudience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Brand Voice</p>
                      <p className="text-sm text-foreground/90">{adData.businessSummary.brandVoice}</p>
                    </div>
                  </div>
                  {adData.businessSummary.uniqueSellingPoints?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1.5">Unique Selling Points</p>
                      <div className="flex flex-wrap gap-2">
                        {adData.businessSummary.uniqueSellingPoints.map((usp: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs border-lux-gold/20 text-lux-gold/80">{usp}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!adData && !isGenerating && (
          <div className="text-center py-16">
            <img src={ICONS_3D.megaphone} alt="" className="w-24 h-24 mx-auto mb-6 opacity-40 animate-bounce-slow" />
            <h3 className="text-xl font-display font-bold mb-2 text-muted-foreground">Ready to Create Ads</h3>
            <p className="text-sm text-muted-foreground/60 max-w-md mx-auto mb-6">
              {profile
                ? `Select your ad goal, tone, and budget above, then click "Generate All Ads" to create copy-paste ready content for every platform.`
                : "Create a company profile first to generate personalized ad campaigns."}
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
