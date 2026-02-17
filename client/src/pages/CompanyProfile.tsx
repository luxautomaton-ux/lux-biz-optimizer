import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import {
  Building2, Upload, X, Plus, MapPin, Globe, Phone, Mail,
  Briefcase, Target, DollarSign, Loader2, ArrowRight,
  CheckCircle, Edit, Sparkles, Trash2,
} from "lucide-react";

const industries = [
  { value: "hvac", label: "HVAC & Heating" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "restaurant", label: "Restaurant & Food" },
  { value: "hotel", label: "Hotel & Hospitality" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "dental", label: "Dental" },
  { value: "medical", label: "Medical & Clinic" },
  { value: "medspa", label: "Med Spa & Wellness" },
  { value: "law", label: "Law & Legal" },
  { value: "accounting", label: "Accounting & Finance" },
  { value: "consulting", label: "Consulting" },
  { value: "automotive", label: "Automotive & Repair" },
  { value: "salon", label: "Salon & Beauty" },
  { value: "barber", label: "Barber Shop" },
  { value: "fitness", label: "Fitness & Gym" },
  { value: "realestate", label: "Real Estate" },
  { value: "construction", label: "Construction" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "landscaping", label: "Landscaping" },
  { value: "photography", label: "Photography" },
  { value: "pet", label: "Pet Services" },
  { value: "other", label: "Other" },
];

const growthGoals = [
  { value: "phone_leads", label: "Phone Leads" },
  { value: "foot_traffic", label: "Foot Traffic" },
  { value: "appointments", label: "Appointment Bookings" },
  { value: "online_orders", label: "Online Orders" },
  { value: "brand_awareness", label: "Brand Awareness" },
];

export default function CompanyProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const editId = params.id ? parseInt(params.id) : null;

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("other");
  const [location, setLocationVal] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [avgLeadValue, setAvgLeadValue] = useState(150);
  const [growthGoal, setGrowthGoal] = useState("phone_leads");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileQuery = trpc.company.get.useQuery(
    { id: editId! },
    { enabled: !!editId }
  );

  useEffect(() => {
    const data = profileQuery.data as any;
    if (data && !initialized) {
      setBusinessName(data.businessName || "");
      setIndustry(data.industry || "other");
      setLocationVal(data.location || "");
      setDescription(data.description || "");
      setWebsite(data.website || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setServices(data.services || []);
      setTargetAudience(data.targetAudience || "");
      setAvgLeadValue(data.avgLeadValue || 150);
      setGrowthGoal(data.growthGoal || "phone_leads");
      if (data.logoUrl) setLogoPreview(data.logoUrl);
      setInitialized(true);
    }
  }, [profileQuery.data, initialized]);

  const utils = trpc.useUtils();

  const createProfile = trpc.company.create.useMutation({
    onSuccess: async (data) => {
      if (logoFile) await uploadLogo(data.id);
      toast.success("Company profile created! Ready to run your audit.");
      utils.company.list.invalidate();
      setLocation(`/dashboard`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateProfile = trpc.company.update.useMutation({
    onSuccess: async () => {
      if (logoFile && editId) await uploadLogo(editId);
      toast.success("Company profile updated!");
      utils.company.list.invalidate();
      utils.company.get.invalidate({ id: editId! });
      setLocation(`/dashboard`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteProfile = trpc.company.delete.useMutation({
    onSuccess: () => {
      toast.success("Company profile deleted.");
      utils.company.list.invalidate();
      setLocation("/dashboard");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const uploadLogoMutation = trpc.company.uploadLogo.useMutation();

  const uploadLogo = async (profileId: number) => {
    if (!logoFile) return;
    const reader = new FileReader();
    return new Promise<void>((resolve) => {
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          await uploadLogoMutation.mutateAsync({
            companyProfileId: profileId,
            fileName: logoFile.name,
            fileBase64: base64,
            mimeType: logoFile.type,
          });
        } catch (e) { console.error("Logo upload failed:", e); }
        resolve();
      };
      reader.readAsDataURL(logoFile);
    });
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Logo must be under 5MB"); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (s: string) => setServices(services.filter(x => x !== s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim() || !industry) {
      toast.error("Business name, industry, and location are required");
      return;
    }
    const data = {
      businessName: businessName.trim(),
      industry,
      location: location.trim(),
      description: description.trim() || undefined,
      website: website.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      services: services.length > 0 ? services : undefined,
      targetAudience: targetAudience.trim() || undefined,
      avgLeadValue,
      growthGoal,
    };
    if (editId) {
      updateProfile.mutate({ id: editId, ...data });
    } else {
      createProfile.mutate(data);
    }
  };

  const handleDelete = () => {
    if (!editId) return;
    if (confirm("Are you sure you want to delete this business profile? This action cannot be undone and will delete all associated audit data.")) {
      deleteProfile.mutate({ id: editId });
    }
  };

  const isPending = createProfile.isPending || updateProfile.isPending || uploadLogoMutation.isPending || deleteProfile.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold to-amber-600 flex items-center justify-center shadow-lg shadow-lux-gold/10 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-black" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">
                {editId ? "Edit Company Profile" : "Set Up Your Company"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {editId
                  ? "Update your business information to improve audit accuracy."
                  : "Create your company profile first. This information powers your AI visibility audit."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo & Basic Info */}
          <div className="rounded-2xl border border-lux-gold/20 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Business Identity</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-28 h-28 rounded-2xl border-2 border-dashed border-lux-gold/20 hover:border-lux-gold/50 flex items-center justify-center cursor-pointer transition-all bg-background/50 overflow-hidden group"
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <Upload className="w-6 h-6 text-lux-gold/40" />
                        <span className="text-[10px] text-lux-gold/60 font-semibold">UPLOAD LOGO</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-lux-gold/70 font-semibold">BUSINESS NAME *</Label>
                      <Input placeholder="e.g. Acme Plumbing Co." value={businessName} onChange={e => setBusinessName(e.target.value)} className="bg-background border-border/50 focus:border-lux-gold/30" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-lux-gold/70 font-semibold">INDUSTRY *</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="bg-background border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {industries.map(ind => (
                            <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-wider text-lux-gold/70 font-semibold">CITY / REGION *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lux-gold/40" />
                      <Input placeholder="e.g. Austin, TX" value={location} onChange={e => setLocationVal(e.target.value)} className="bg-background pl-9 border-border/50 focus:border-lux-gold/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Business Description</h3>
              <span className="text-[10px] text-muted-foreground ml-auto">Our AI will optimize this for voice search</span>
            </div>
            <div className="p-6">
              <Textarea
                placeholder="Tell us about your business, what makes you unique, your specialties, and what customers love about you..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-background min-h-[120px] border-border/50 focus:border-lux-gold/30"
              />
            </div>
          </div>

          {/* Contact & Online Presence */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <Globe className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Contact & Online Presence</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">WEBSITE</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input placeholder="https://yourbusiness.com" value={website} onChange={e => setWebsite(e.target.value)} className="bg-background pl-9 border-border/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">PHONE</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} className="bg-background pl-9 border-border/50" />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">EMAIL</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input placeholder="info@yourbusiness.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-background pl-9 border-border/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">FULL ADDRESS</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input placeholder="123 Main St, Austin, TX 78701" value={address} onChange={e => setAddress(e.target.value)} className="bg-background pl-9 border-border/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <Target className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Services & Target Market</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a service (e.g. Emergency Plumbing)"
                  value={newService}
                  onChange={e => setNewService(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                  className="bg-background border-border/50"
                />
                <Button type="button" variant="outline" size="icon" onClick={addService} className="border-lux-gold/20 hover:bg-lux-gold/10">
                  <Plus className="w-4 h-4 text-lux-gold" />
                </Button>
              </div>
              {services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <Badge key={s} className="gap-1 pr-1 bg-lux-gold/10 text-lux-gold border-lux-gold/20 hover:bg-lux-gold/20">
                      {s}
                      <button type="button" onClick={() => removeService(s)} className="ml-1 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs tracking-wider text-muted-foreground font-semibold">TARGET AUDIENCE</Label>
                <Input
                  placeholder="e.g. Homeowners in Austin aged 30-55"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Revenue & Goals */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">Revenue & Growth</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">AVG LEAD / TICKET VALUE ($)</Label>
                  <Input type="number" value={avgLeadValue} onChange={e => setAvgLeadValue(Number(e.target.value))} className="bg-background border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-muted-foreground font-semibold">PRIMARY GROWTH GOAL</Label>
                  <Select value={growthGoal} onValueChange={setGrowthGoal}>
                    <SelectTrigger className="bg-background border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {growthGoals.map(g => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            {editId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="h-14 px-8 border-lux-red/30 text-lux-red hover:bg-lux-red/10 rounded-xl"
                disabled={isPending}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                DELETE
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-14 text-sm font-bold tracking-wider gap-2 bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:from-lux-gold/90 hover:to-amber-600/90 rounded-xl shadow-lg shadow-lux-gold/10"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : editId ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              {editId ? "UPDATE COMPANY PROFILE" : "CREATE PROFILE & CONTINUE"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
