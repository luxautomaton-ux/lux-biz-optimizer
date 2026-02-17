import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Search, Loader2, Star, Globe, Phone, Clock, MapPin,
  TrendingUp, Zap, Target, Sparkles, BarChart3, DollarSign,
} from "lucide-react";
import AuditLoader from "@/components/AuditLoader";
import { ICONS_3D, SCANNER_LOADING_STEPS } from "@/lib/icons3d";

const MAPS_PIN_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png";

export default function Scanner() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [niche, setNiche] = useState("");
  const [territory, setTerritory] = useState("");
  const [activeScanId, setActiveScanId] = useState<number | null>(null);

  const createScan = trpc.scanner.scan.useMutation({
    onSuccess: (data) => {
      toast.success("Niche scan initiated!");
      setActiveScanId(data.scanId);
    },
    onError: (err) => toast.error(err.message),
  });

  const scanQuery = trpc.scanner.get.useQuery(
    { id: activeScanId! },
    {
      enabled: !!activeScanId,
      refetchInterval: (query) => {
        const d = query.state.data as any;
        return d && (d.status === "complete" || d.status === "failed") ? false : 3000;
      },
    }
  );

  const scansListQuery = trpc.scanner.list.useQuery(undefined, { enabled: !!user });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() || !territory.trim()) {
      toast.error("Please enter both niche and territory");
      return;
    }
    createScan.mutate({ niche: niche.trim(), territory: territory.trim() });
  };

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case "High": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low": return "bg-muted/50 text-muted-foreground border-border";
      default: return "text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const scanData = scanQuery.data;
  const results = (scanData?.results || []) as any[];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
            <img src={ICONS_3D.radar} alt="" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Niche Scanner</h1>
            <p className="text-sm text-muted-foreground">Scan every business in a specific niche and territory. Find opportunities.</p>
          </div>
        </div>

        {/* Scan Form */}
        <div className="rounded-2xl border border-lux-gold/20 bg-gradient-to-br from-card to-card/80 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-lux-gold/10 via-transparent to-lux-gold/10" />
          <div className="p-6">
            <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-xs tracking-wider text-lux-gold/70 font-semibold">NICHE / INDUSTRY</Label>
                <Input placeholder="e.g. Dentist, HVAC, Coffee Shop" value={niche} onChange={e => setNiche(e.target.value)} className="bg-background border-border/50 focus:border-lux-gold/30" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-xs tracking-wider text-lux-gold/70 font-semibold">TERRITORY / LOCATION</Label>
                <Input placeholder="e.g. Austin, TX" value={territory} onChange={e => setTerritory(e.target.value)} className="bg-background border-border/50 focus:border-lux-gold/30" />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="h-10 gap-2 px-8 bg-lux-gold text-black hover:bg-lux-gold/90 font-bold" disabled={createScan.isPending}>
                  {createScan.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  SCAN
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {activeScanId && scanData && (scanData.status === "scanning" || scanData.status === "pending") && (
          <div className="max-w-2xl mx-auto">
            <AuditLoader
              steps={SCANNER_LOADING_STEPS}
              isComplete={false}
              title={`Scanning ${niche || "businesses"}...`}
              subtitle={`Finding and analyzing businesses in ${territory || "your area"}`}
            />
          </div>
        )}

        {/* Results */}
        {scanData && scanData.status === "complete" && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-lux-gold" />
                {results.length} Businesses Found
              </h2>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Badge className="gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> {results.filter((r: any) => r.opportunityLevel === "High").length} High Opportunity
                </Badge>
              </div>
            </div>

            <div className="grid gap-3">
              {results.map((biz: any, i: number) => (
                <div key={i} className="rounded-xl border border-border/50 bg-card hover:border-lux-gold/20 transition-all p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-lux-gold/10 flex items-center justify-center text-[10px] font-bold text-lux-gold">#{i + 1}</span>
                        <h3 className="font-bold text-sm">{biz.name}</h3>
                        <Badge className={`text-[9px] ${getOpportunityColor(biz.opportunityLevel)}`}>
                          {biz.opportunityLevel} Opportunity
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground ml-10">
                        {biz.address && <span className="flex items-center gap-1"><img src={MAPS_PIN_LOGO} alt="" className="w-3.5 h-3.5 object-contain" /> {biz.address}</span>}
                        {biz.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {biz.rating} ({biz.reviewCount ?? 0})</span>}
                        {biz.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {biz.phone}</span>}
                        {biz.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>}
                        {biz.hasHours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hours Listed</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-xl font-black ${getScoreColor(biz.optimizationScore)}`}>
                          {biz.optimizationScore}
                        </div>
                        <div className="text-[9px] text-muted-foreground tracking-wider">OPT SCORE</div>
                      </div>
                      {biz.estimatedRevenuePotential && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />{biz.estimatedRevenuePotential}
                          </div>
                          <div className="text-[9px] text-muted-foreground tracking-wider">POTENTIAL</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Scans */}
        {user && scansListQuery.data && (scansListQuery.data as any[]).length > 0 && !activeScanId && (
          <div>
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-lux-gold/50" /> Previous Scans
            </h2>
            <div className="grid gap-3">
              {(scansListQuery.data as any[]).map((scan: any) => (
                <div key={scan.id} className="rounded-xl border border-border/50 bg-card cursor-pointer hover:border-lux-gold/20 transition-all p-4 flex items-center justify-between" onClick={() => setActiveScanId(scan.id)}>
                  <div>
                    <div className="font-semibold text-sm">{scan.niche} in {scan.territory}</div>
                    <div className="text-xs text-muted-foreground">{scan.totalFound ?? 0} businesses found</div>
                  </div>
                  <Badge className={`text-[9px] ${scan.status === "complete" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                    {scan.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!activeScanId && (!scansListQuery.data || (scansListQuery.data as any[]).length === 0) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-lux-gold/5 border border-lux-gold/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src={ICONS_3D.radar} alt="" className="w-12 h-12 object-contain opacity-30" />
            </div>
            <p className="text-muted-foreground mb-2">No scans yet</p>
            <p className="text-xs text-muted-foreground/60">Enter a niche and territory above to scan for businesses and opportunities</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
