import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Sparkles, Plus, Building2, BarChart3, TrendingDown, Clock,
  CheckCircle, AlertTriangle, Loader2, MapPin,
  Globe, Star, ShoppingCart, Zap, Trash2,
} from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const profilesQuery = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const auditsQuery = trpc.audit.list.useQuery(undefined, { enabled: !!user });
  const cartQuery = trpc.cart.list.useQuery(undefined, { enabled: !!user });

  const createAudit = trpc.audit.create.useMutation({
    onSuccess: (data) => {
      if (data.existing) {
        toast.info("Audit already exists for this company. Viewing results.");
      } else if (data.inProgress) {
        toast.info("Audit is already in progress.");
      } else {
        toast.success("Audit initiated! Scanning your business...");
      }
      setLocation(`/audit/${data.auditId}`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const utils = trpc.useUtils();
  const deleteProfile = trpc.company.delete.useMutation({
    onSuccess: () => {
      toast.success("Business profile deleted.");
      utils.company.list.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-lux-green";
    if (score >= 60) return "text-lux-gold";
    if (score >= 40) return "text-lux-orange";
    return "text-lux-red";
  };

  const getScoreBg = (score: number | null) => {
    if (!score) return "bg-muted/30";
    if (score >= 80) return "bg-lux-green/10 border-lux-green/20";
    if (score >= 60) return "bg-lux-gold/10 border-lux-gold/20";
    if (score >= 40) return "bg-lux-orange/10 border-lux-orange/20";
    return "bg-lux-red/10 border-lux-red/20";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle className="w-4 h-4 text-lux-green" />;
      case "scanning": case "analyzing": return <Loader2 className="w-4 h-4 text-lux-gold animate-spin" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const profiles = profilesQuery.data || [];
  const audits = auditsQuery.data || [];
  const cartItems = cartQuery.data || [];

  const isAdmin = user?.role === "admin";
  const canAddProfile = isAdmin || profiles.length === 0;

  // Map audits to company profiles
  const getAuditForProfile = (profileId: number) => {
    return audits.find((a: any) => a.companyProfileId === profileId);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold/20 to-lux-orange/10 flex items-center justify-center border border-lux-gold/20 overflow-hidden">
              <img src={ICONS_3D.speedometer} alt="" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-gold">Command Center</h1>
              <p className="text-sm text-muted-foreground">Manage your companies and AI visibility audits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setLocation("/cart")} className="gap-2 border-lux-gold/20 hover:border-lux-gold/40">
                <ShoppingCart className="w-4 h-4" />
                <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-lux-gold text-black">
                  {cartItems.length}
                </Badge>
              </Button>
            )}
            {canAddProfile && (
              <Button onClick={() => setLocation("/company/new")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
                <Plus className="w-4 h-4" /> Add Company
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {profiles.length === 0 && (
          <Card className="premium-card border-dashed border-lux-gold/20">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lux-gold/20 to-lux-orange/10 flex items-center justify-center border border-lux-gold/20 overflow-hidden">
                <img src={ICONS_3D.analyticsChart} alt="" className="w-16 h-16 object-contain" />
              </div>
              <div className="text-center max-w-lg">
                <h2 className="text-xl font-bold mb-2 font-display">Set Up Your First Company</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create a company profile to get started. We'll use this information to run a comprehensive AI visibility audit and show you exactly where you're losing customers to competitors.
                </p>
              </div>
              <Button onClick={() => setLocation("/company/new")} size="lg" className="gap-2 mt-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold shadow-lg">
                <Plus className="w-5 h-5" /> Create Company Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Company Profiles Grid */}
        {profiles.length > 0 && (
          <div className="grid gap-5">
            {profiles.map((profile: any) => {
              const audit = getAuditForProfile(profile.id);
              return (
                <Card key={profile.id} className="premium-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left: Company Info */}
                      <div className="flex items-start gap-5 flex-1 min-w-0">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 overflow-hidden">
                          {profile.logoUrl ? (
                            <img src={profile.logoUrl} alt={profile.businessName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-7 h-7 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg truncate">{profile.businessName}</h3>
                            <Badge variant="outline" className="text-[10px] shrink-0 border-lux-gold/30 text-lux-gold">{profile.industry}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
                            {profile.website && <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />Website</span>}
                          </div>

                          {/* Audit Status */}
                          {audit ? (
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getScoreBg(audit.overallScore)}`}>
                                {getStatusIcon(audit.status)}
                                {audit.status === "complete" ? (
                                  <>
                                    <span className={`text-2xl font-bold font-display ${getScoreColor(audit.overallScore)}`}>
                                      {Math.round(audit.overallScore ?? 0)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">/100</span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold">{audit.status === "failed" ? "FAILED" : "SCANNING..."}</span>
                                )}
                              </div>
                              {audit.estimatedMonthlyLoss != null && audit.estimatedMonthlyLoss > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lux-red/10 border border-lux-red/20">
                                  <TrendingDown className="w-4 h-4 text-lux-red" />
                                  <span className="text-sm font-bold text-lux-red">
                                    ${Math.round(audit.estimatedMonthlyLoss).toLocaleString()}/mo
                                  </span>
                                </div>
                              )}
                              {audit.aiVisibilityScore != null && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Star className="w-3.5 h-3.5 text-lux-gold" />
                                  <span>AI Visibility: <span className="font-semibold text-foreground">{Math.round(audit.aiVisibilityScore)}/100</span></span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <Badge variant="secondary" className="text-[10px] bg-muted/50">NO AUDIT YET</Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {audit && audit.status === "complete" ? (
                          <Button size="sm" onClick={() => setLocation(`/audit/${audit.id}`)} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
                            <BarChart3 className="w-4 h-4" /> View Audit
                          </Button>
                        ) : audit && (audit.status === "scanning" || audit.status === "analyzing") ? (
                          <Button size="sm" variant="outline" onClick={() => setLocation(`/audit/${audit.id}`)} className="gap-2 border-lux-gold/30">
                            <Loader2 className="w-4 h-4 animate-spin" /> In Progress
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => createAudit.mutate({ companyProfileId: profile.id })}
                            disabled={createAudit.isPending}
                            className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold"
                          >
                            {createAudit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            Run Audit
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setLocation(`/company/${profile.id}`)} className="text-xs hover:text-lux-gold">
                          Edit Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${profile.businessName}?`)) {
                              deleteProfile.mutate({ id: profile.id });
                            }
                          }}
                          className="text-xs text-muted-foreground hover:text-lux-red hover:bg-lux-red/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        {audits.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <Card className="premium-card">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold font-display text-gradient-gold mb-1">{profiles.length}</div>
                <div className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Companies</div>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold font-display text-lux-green mb-1">{audits.filter((a: any) => a.status === "complete").length}</div>
                <div className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Audits Complete</div>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold font-display text-lux-gold mb-1">
                  {Math.round(audits.filter((a: any) => a.overallScore).reduce((sum: number, a: any) => sum + (a.overallScore ?? 0), 0) / Math.max(audits.filter((a: any) => a.overallScore).length, 1))}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Avg Score</div>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold font-display text-lux-red mb-1">
                  ${Math.round(audits.reduce((sum: number, a: any) => sum + (a.estimatedMonthlyLoss ?? 0), 0)).toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Total Loss/Mo</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
