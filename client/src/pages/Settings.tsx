import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Settings as SettingsIcon, User, Building2, ExternalLink,
  CreditCard, DollarSign, Zap, Sparkles, CheckCircle, Loader2,
  LogOut, ChevronRight, Camera,
} from "lucide-react";
import { useRef, useState } from "react";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const profilesQuery = trpc.company.list.useQuery(undefined, { enabled: !!user });
  const purchasesQuery = trpc.cart.purchases.useQuery(undefined, { enabled: !!user });

  const profiles = profilesQuery.data || [];
  const purchases = (purchasesQuery.data || []).filter((p: any) => p.status !== "in_cart");
  const totalSpent = purchases.reduce((sum: number, p: any) => sum + p.price, 0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const uploadPhoto = trpc.user.uploadPhoto.useMutation({
    onSuccess: () => {
      toast.success("Profile photo updated!");
      utils.auth.me.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadPhoto.mutate({
        fileName: file.name,
        fileBase64: base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold to-amber-600 flex items-center justify-center shadow-lg shadow-lux-gold/10">
            <SettingsIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account, profiles, and preferences</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-lux-gold/20 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30 flex items-center gap-2">
            <User className="w-4 h-4 text-lux-gold" />
            <h3 className="text-sm font-display font-bold">Account</h3>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lux-gold/20 to-amber-600/20 border border-lux-gold/20 flex items-center justify-center overflow-hidden">
                  {(user as any)?.photoUrl ? (
                    <img src={(user as any).photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-display font-bold text-lux-gold">
                      {(user?.name || user?.email || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  disabled={uploadPhoto.isPending}
                >
                  {uploadPhoto.isPending ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <div className="font-display font-bold">{user?.name || "Not set"}</div>
                <div className="text-sm text-muted-foreground">{user?.email || "Not set"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Profiles */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Company Profiles</h3>
            </div>
            <span className="text-xs text-muted-foreground">{profiles.length} profile(s)</span>
          </div>
          <div className="p-4 space-y-2">
            {profiles.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/30 hover:border-lux-gold/20 transition-all cursor-pointer" onClick={() => setLocation(`/company/${p.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center overflow-hidden">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-4 h-4 text-lux-gold/50" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{p.businessName}</div>
                    <div className="text-xs text-muted-foreground">{p.location} · {p.industry}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2 bg-transparent border-lux-gold/20 hover:bg-lux-gold/5 text-lux-gold" onClick={() => setLocation("/company/new")}>
              <Building2 className="w-4 h-4" /> Add Company Profile
            </Button>
          </div>
        </div>

        {/* Purchase History */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Purchase History</h3>
            </div>
            <span className="text-sm font-display font-bold text-lux-gold">${totalSpent.toLocaleString()} total</span>
          </div>
          <div className="p-4 space-y-2">
            {purchases.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No purchases yet</p>
            )}
            {purchases.map((p: any) => {
              const statusColor = p.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : p.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-muted text-muted-foreground";
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/30">
                  <div>
                    <div className="text-sm font-semibold">{p.serviceName}</div>
                    <div className="text-[10px] text-muted-foreground tracking-wider">{p.serviceType.replace(/_/g, " ").toUpperCase()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-display font-bold">${p.price.toLocaleString()}</span>
                    <Badge className={`text-[10px] ${statusColor}`}>
                      {p.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {p.status === "in_progress" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {p.status.toUpperCase().replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tax Write-Off */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 border border-emerald-500/20 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">Track Your Business Expenses</h3>
              <p className="text-xs text-muted-foreground">AI audit services may qualify as tax-deductible business expenses.</p>
            </div>
          </div>
          <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
              <ExternalLink className="w-3 h-3" /> Lux WriteOff
            </Button>
          </a>
        </div>

        {/* Use Cases */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30 flex items-center gap-2">
            <Zap className="w-4 h-4 text-lux-gold" />
            <h3 className="text-sm font-display font-bold">Use Cases</h3>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            {[
              { title: "Local Service Businesses", desc: "HVAC, plumbing, electrical, landscaping - dominate 'near me' searches and AI recommendations." },
              { title: "Medical & Dental Practices", desc: "Build trust signals that AI systems use to recommend healthcare providers." },
              { title: "Restaurants & Hospitality", desc: "Optimize for voice search queries like 'best Italian restaurant near me' across all AI platforms." },
              { title: "Retail & E-Commerce", desc: "Make your inventory and specialties visible to AI shopping assistants." },
              { title: "Professional Services", desc: "Law firms, accountants, consultants - establish authority in AI-powered discovery." },
              { title: "Multi-Location Businesses", desc: "Optimize each location independently for maximum local AI visibility." },
            ].map((uc, i) => (
              <div key={i} className="p-3 rounded-xl bg-background border border-border/30">
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-lux-gold" /> {uc.title}
                </h4>
                <p className="text-xs text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <Button variant="outline" className="w-full bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400 gap-2" onClick={logout}>
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </DashboardLayout>
  );
}
