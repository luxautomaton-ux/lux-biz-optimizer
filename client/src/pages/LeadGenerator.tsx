import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Search, Loader2, Star, Globe, Phone, MapPin, Download, Sparkles,
  Target, TrendingUp, DollarSign, FileText, Mail, Building2, Filter,
  Zap, Brain, ArrowRight, Lock, Crown,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, LEAD_GEN_LOADING_STEPS } from "@/lib/icons3d";

const MAPS_PIN_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png";

export default function LeadGenerator() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Custom search state
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [filters, setFilters] = useState({
    noWebsite: false,
    lowReviews: false,
    noPhotos: false,
    noHours: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, any>>({});
  const [searchMode, setSearchMode] = useState<"ai" | "custom">("ai");

  // Fetch company profiles for AI-driven search
  const { data: profiles } = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  const generateLeadsMutation = trpc.leads.generate.useMutation();
  const analyzeLeadMutation = trpc.leads.analyzeWithAI.useMutation();
  const exportLeadsMutation = trpc.leads.export.useMutation();

  const selectedProfile = useMemo(() => {
    if (!profiles || !selectedProfileId) return null;
    return profiles.find((p: any) => p.id === parseInt(selectedProfileId));
  }, [profiles, selectedProfileId]);

  const handleAIGenerate = async () => {
    if (!selectedProfile) {
      toast.error("Please select a company profile");
      return;
    }
    // Auto-populate from company data
    const autoNiche = selectedProfile.industry || "";
    const autoLocation = selectedProfile.location || selectedProfile.address || "";

    if (!autoNiche || !autoLocation) {
      toast.error("Company profile missing industry or location. Please update your profile first.");
      return;
    }

    setNiche(autoNiche);
    setLocation(autoLocation);
    await runLeadGeneration(autoNiche, autoLocation);
  };

  const handleCustomGenerate = async () => {
    if (!niche || !location) {
      toast.error("Please enter niche and location");
      return;
    }
    await runLeadGeneration(niche, location);
  };

  const runLeadGeneration = async (searchNiche: string, searchLocation: string) => {
    if (!user) {
      toast.error("Please sign in to generate leads");
      return;
    }

    setIsGenerating(true);
    setLeads([]);
    setAiAnalysis({});

    try {
      const result = await generateLeadsMutation.mutateAsync({
        niche: searchNiche,
        location: searchLocation,
        radius: parseInt(radius),
        minRating: minRating ? parseFloat(minRating) : undefined,
        maxRating: maxRating ? parseFloat(maxRating) : undefined,
        filters,
      });

      setLeads(result.leads);
      toast.success(`Found ${result.leads.length} leads`);

      // Run AI analysis on first 20 leads
      for (const lead of result.leads.slice(0, 20)) {
        try {
          const analysis = await analyzeLeadMutation.mutateAsync({
            leadData: lead,
            niche: searchNiche,
          });
          setAiAnalysis(prev => ({ ...prev, [lead.placeId]: analysis }));
        } catch (err) {
          console.error("AI analysis failed for lead:", lead.name);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate leads");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    try {
      const result = await exportLeadsMutation.mutateAsync({
        leads,
        aiAnalysis,
        format,
        niche,
        location,
      });

      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.filename;
      link.click();

      toast.success(`Exported ${leads.length} leads as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    }
  };

  return (
    <DashboardLayout>
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Header with 3D Icons */}
      <div className="relative overflow-hidden rounded-2xl border border-lux-gold/20 bg-gradient-to-br from-card via-card/95 to-lux-gold/5">
        <div className="absolute inset-0 bg-[url('https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png')] bg-no-repeat bg-right-bottom opacity-5 bg-contain" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-gold via-lux-orange to-lux-gold" />

        {/* Floating 3D icons decoration */}
        <div className="absolute top-4 right-4 opacity-15">
          <img src={ICONS_3D.radar} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
        </div>
        <div className="absolute bottom-4 right-32 opacity-10">
          <img src={ICONS_3D.magnifyingGlass} alt="" className="w-16 h-16 object-contain animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
                <img src={ICONS_3D.megaphone} alt="" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">AI Lead Generator</h1>
                  <Badge className="bg-lux-gold/10 text-lux-gold border-lux-gold/20 gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-xl">
                  Discover businesses in any niche that need optimization. AI-powered analysis identifies the highest-value prospects with personalized outreach strategies.
                </p>
              </div>
            </div>
            {leads.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-lux-gold">{leads.length}</p>
                  <p className="text-xs text-muted-foreground">Leads Found</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("csv")}
                  className="gap-2 border-lux-gold/20 hover:border-lux-gold/40 hover:bg-lux-gold/5"
                >
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img src={MAPS_PIN_LOGO} alt="" className="w-5 h-5" />
              <span>Google Maps Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img src={ICONS_3D.aiAssistant} alt="" className="w-5 h-5 object-contain" />
              <span>AI Opportunity Scoring</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img src={ICONS_3D.megaphone} alt="" className="w-5 h-5 object-contain" />
              <span>Outreach Strategies</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img src={ICONS_3D.checklist} alt="" className="w-5 h-5 object-contain" />
              <span>CSV / Excel / PDF Export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Mode Tabs */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "ai" | "custom")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card border border-border/50">
          <TabsTrigger value="ai" className="gap-2 data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
            <img src={ICONS_3D.aiBot} alt="" className="w-4 h-4 object-contain" /> AI-Powered Search
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-2 data-[state=active]:bg-lux-gold/10 data-[state=active]:text-lux-gold">
            <img src={ICONS_3D.magnifyingGlass} alt="" className="w-4 h-4 object-contain" /> Custom Search
          </TabsTrigger>
        </TabsList>

        {/* AI-Powered Search */}
        <TabsContent value="ai">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <img src={ICONS_3D.lightning} alt="" className="w-6 h-6 object-contain" />
                AI-Powered Lead Discovery
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select your company profile and the AI will automatically find businesses in your niche and area that need optimization services.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {profiles && profiles.length > 0 ? (
                <>
                  <div>
                    <Label>Select Company Profile</Label>
                    <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choose a company profile..." />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p: any) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.businessName} — {p.industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProfile && (
                    <div className="p-4 rounded-lg bg-lux-gold/5 border border-lux-gold/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-lux-gold" />
                        <span className="font-semibold text-lux-gold">{selectedProfile.businessName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div><span className="text-foreground/70">Industry:</span> {selectedProfile.industry || "Not set"}</div>
                        <div><span className="text-foreground/70">Location:</span> {selectedProfile.location}</div>
                        <div><span className="text-foreground/70">Services:</span> {Array.isArray(selectedProfile.services) ? (selectedProfile.services as string[]).join(", ") : "Not set"}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        AI will search for <strong className="text-lux-gold">{selectedProfile.industry}</strong> businesses near <strong className="text-lux-gold">{selectedProfile.location}</strong> that need optimization.
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Search Radius</Label>
                      <Select value={radius} onValueChange={setRadius}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 mile</SelectItem>
                          <SelectItem value="5">5 miles</SelectItem>
                          <SelectItem value="10">10 miles</SelectItem>
                          <SelectItem value="25">25 miles</SelectItem>
                          <SelectItem value="50">50 miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleAIGenerate}
                        disabled={isGenerating || !selectedProfileId}
                        className="w-full gap-2 bg-lux-gold hover:bg-lux-gold/90 text-black font-semibold"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isGenerating ? "AI Searching..." : "Find Leads with AI"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <img src={ICONS_3D.analyticsSearch} alt="" className="w-16 h-16 object-contain mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground mb-3">No company profiles found. Create one to use AI-powered lead discovery.</p>
                  <Button onClick={() => navigate("/company-profile")} variant="outline" className="gap-2">
                    <ArrowRight className="w-4 h-4" /> Create Company Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Search */}
        <TabsContent value="custom">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <img src={ICONS_3D.magnifyingGlass} alt="" className="w-6 h-6 object-contain" />
                Custom Lead Search
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manually enter search criteria to find businesses in any niche and location.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="niche">Industry / Niche</Label>
                  <Input
                    id="niche"
                    placeholder="e.g., Restaurants, Plumbers, Dentists"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Los Angeles, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="radius">Radius (miles)</Label>
                  <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mile</SelectItem>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minRating">Min Rating</Label>
                  <Input
                    id="minRating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="e.g., 3.0"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="maxRating">Max Rating</Label>
                  <Input
                    id="maxRating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="e.g., 4.5"
                    value={maxRating}
                    onChange={(e) => setMaxRating(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Opportunity Filters
                </Label>
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noWebsite"
                      checked={filters.noWebsite}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, noWebsite: !!checked }))}
                    />
                    <label htmlFor="noWebsite" className="text-sm cursor-pointer">No Website</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowReviews"
                      checked={filters.lowReviews}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, lowReviews: !!checked }))}
                    />
                    <label htmlFor="lowReviews" className="text-sm cursor-pointer">Low Reviews (&lt;10)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noPhotos"
                      checked={filters.noPhotos}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, noPhotos: !!checked }))}
                    />
                    <label htmlFor="noPhotos" className="text-sm cursor-pointer">No Photos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noHours"
                      checked={filters.noHours}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, noHours: !!checked }))}
                    />
                    <label htmlFor="noHours" className="text-sm cursor-pointer">No Hours Listed</label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCustomGenerate}
                disabled={isGenerating}
                className="gap-2 bg-lux-gold hover:bg-lux-gold/90 text-black font-semibold"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isGenerating ? "Generating Leads..." : "Generate Leads"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Bar */}
      {leads.length > 0 && !isGenerating && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
          <div className="flex items-center gap-3">
            <img src={ICONS_3D.trophy} alt="" className="w-8 h-8 object-contain" />
            <h2 className="text-lg font-display font-bold">
              Found <span className="text-lux-gold">{leads.length}</span> Leads
            </h2>
            <Badge variant="secondary" className="gap-1">
              <img src={ICONS_3D.aiAssistant} alt="" className="w-3 h-3 object-contain" />
              AI Analyzed: {Object.keys(aiAnalysis).length}/{Math.min(leads.length, 20)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> CSV
            </Button>
            <Button onClick={() => handleExport("excel")} variant="outline" size="sm" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Excel
            </Button>
            <Button onClick={() => handleExport("pdf")} variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> PDF
            </Button>
          </div>
        </div>
      )}

      {/* Loading State with AuditLoader */}
      {isGenerating && (
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <AuditLoader
              steps={LEAD_GEN_LOADING_STEPS}
              isComplete={false}
              title="Discovering Leads..."
              subtitle="AI is searching Google Maps and analyzing opportunities"
            />
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {leads.length > 0 && !isGenerating && (
        <div className="space-y-3">
          {leads.map((lead, i) => {
            const analysis = aiAnalysis[lead.placeId];
            return (
              <Card key={i} className="bg-card border-border/50 hover:border-lux-gold/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-lux-gold" />
                        <h3 className="font-bold text-lg">{lead.name}</h3>
                        {lead.rating && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            {lead.rating} ({lead.reviewCount ?? 0})
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted-foreground mb-3">
                        {lead.address && (
                          <div className="flex items-center gap-1.5">
                            <img src={MAPS_PIN_LOGO} alt="" className="w-3.5 h-3.5 object-contain" />
                            {lead.address}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.website && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-lux-gold hover:underline truncate max-w-[200px]">
                              {lead.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </a>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </div>
                        )}
                      </div>

                      {/* Opportunity Flags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {!lead.website && <Badge variant="outline" className="text-xs text-red-400 border-red-500/20">No Website</Badge>}
                        {(lead.reviewCount ?? 0) < 10 && <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/20">Low Reviews</Badge>}
                        {!lead.hasPhotos && <Badge variant="outline" className="text-xs text-orange-400 border-orange-500/20">No Photos</Badge>}
                        {!lead.hasHours && <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/20">No Hours</Badge>}
                      </div>

                      {analysis && (
                        <div className="mt-3 p-3 rounded-lg bg-lux-gold/5 border border-lux-gold/20">
                          <div className="flex items-center gap-2 mb-2">
                            <img src={ICONS_3D.aiAssistant} alt="" className="w-5 h-5 object-contain" />
                            <span className="text-sm font-semibold text-lux-gold">AI Opportunity Analysis</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{analysis.opportunitySummary}</p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {analysis.painPoints?.map((point: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                          {analysis.outreachAngle && (
                            <div className="mt-2 p-2 rounded bg-background/50 text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">Outreach Angle:</span> {analysis.outreachAngle}
                            </div>
                          )}
                          {analysis.estimatedValue && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Est. Value: ${analysis.estimatedValue}/mo</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-lux-gold mb-1">{lead.opportunityScore ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Opportunity</div>
                      <Badge
                        variant="secondary"
                        className={`mt-2 ${
                          lead.opportunityLevel === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          lead.opportunityLevel === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}
                      >
                        {lead.opportunityLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {leads.length === 0 && !isGenerating && (
        <Card className="bg-card border-border/50">
          <CardContent className="p-12 text-center">
            <img src={ICONS_3D.radar} alt="" className="w-20 h-20 object-contain mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Ready to Find Leads</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Use AI-powered search to automatically find businesses in your niche that need optimization,
              or customize your search criteria for targeted lead generation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </DashboardLayout>
  );
}
