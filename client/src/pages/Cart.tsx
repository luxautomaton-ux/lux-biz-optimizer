import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  ShoppingCart, Trash2, CreditCard, Loader2, CheckCircle,
  ArrowLeft, Zap, FileText, Clock, Bot, Sparkles, DollarSign,
} from "lucide-react";
import { ICONS_3D } from "@/lib/icons3d";

const serviceIcons: Record<string, any> = {
  full_audit: FileText,
  description_rewrite: Zap,
  review_strategy: FileText,
  competitor_deep_dive: FileText,
  ad_campaign: Zap,
  seo_optimization: Zap,
  monitoring_annual: Clock,
  ai_agent_fix: Bot,
};

export default function Cart() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const cartQuery = trpc.cart.list.useQuery(undefined, { enabled: !!user });
  const purchasesQuery = trpc.cart.purchases.useQuery(undefined, { enabled: !!user });

  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => {
      toast.success("Item removed from cart");
      utils.cart.list.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const checkout = trpc.cart.checkout.useMutation({
    onSuccess: (data) => {
      toast.success(`Purchase complete! ${data.itemCount} service(s) for $${data.total.toLocaleString()}. AI Agent is now working on your fixes.`);
      utils.cart.list.invalidate();
      utils.cart.purchases.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const cartItems = cartQuery.data || [];
  const purchases = (purchasesQuery.data || []).filter((p: any) => p.status !== "in_cart");
  const total = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} className="hover:bg-lux-gold/10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
            <img src={ICONS_3D.shoppingCart} alt="" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Service Cart</h1>
            <p className="text-sm text-muted-foreground">Add-on services to fix your AI visibility issues</p>
          </div>
          {cartItems.length > 0 && (
            <Badge className="ml-auto bg-lux-gold/10 text-lux-gold border-lux-gold/20">{cartItems.length} items</Badge>
          )}
        </div>

        {cartItems.length === 0 && purchases.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-lux-gold/5 border border-lux-gold/10 flex items-center justify-center overflow-hidden">
              <img src={ICONS_3D.shoppingCart} alt="" className="w-12 h-12 object-contain opacity-30" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-display font-bold mb-1">Your Cart is Empty</h2>
              <p className="text-sm text-muted-foreground">
                Run an audit first, then add fix services from the audit results page.
              </p>
            </div>
            <Button onClick={() => setLocation("/dashboard")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Active Cart */}
        {cartItems.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-lux-gold/70">IN CART</h2>
            {cartItems.map((item: any) => {
              const Icon = serviceIcons[item.serviceType] || Zap;
              return (
                <div key={item.id} className="rounded-xl border border-border/50 bg-card hover:border-lux-gold/20 transition-all p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-lux-gold" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.serviceName}</div>
                      <div className="text-[10px] text-muted-foreground tracking-wider">{item.serviceType.replace(/_/g, " ").toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-display font-bold text-lux-gold">${item.price.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem.mutate({ id: item.id })}
                      disabled={removeItem.isPending}
                      className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            <Separator className="bg-border/30" />

            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-3xl font-display font-bold text-lux-gold">${total.toLocaleString()}</span>
            </div>

            <div className="rounded-xl bg-lux-gold/5 border border-lux-gold/10 p-4 flex items-start gap-3">
              <Bot className="w-5 h-5 text-lux-gold mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-display font-bold">AI Agent Auto-Fix</div>
                <p className="text-xs text-muted-foreground">
                  After purchase, our AI Agent will automatically execute fixes for each service, update your company profile, and run verification tests to confirm improvements.
                </p>
              </div>
            </div>

            <Button
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
              className="w-full h-14 text-sm font-bold tracking-wider gap-2 bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:from-lux-gold/90 hover:to-amber-600/90 rounded-xl shadow-lg shadow-lux-gold/10"
            >
              {checkout.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              PURCHASE & START AI FIX — ${total.toLocaleString()}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3" />
              Business expense — may qualify as a tax write-off. Visit <a href="https://luxwriteoff.com" target="_blank" rel="noopener" className="text-lux-gold hover:underline ml-1">luxwriteoff.com</a>
            </p>
          </div>
        )}

        {/* Purchase History */}
        {purchases.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground">PURCHASED SERVICES</h2>
            {purchases.map((item: any) => {
              const Icon = serviceIcons[item.serviceType] || Zap;
              const statusColor = item.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : item.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-muted text-muted-foreground";
              return (
                <div key={item.id} className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-lux-gold/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-lux-gold/50" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.serviceName}</div>
                      <div className="text-xs text-muted-foreground">${item.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-[10px] ${statusColor}`}>
                      {item.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {item.status === "in_progress" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {item.status.toUpperCase().replace("_", " ")}
                    </Badge>
                    {item.status === "completed" && (
                      <Button size="sm" variant="outline" className="bg-transparent border-border/50 hover:border-lux-gold/20 text-xs" onClick={() => {
                        toast.info("View fix results in the AI Agent chat.");
                        if (item.auditId) setLocation(`/agent?audit=${item.auditId}`);
                      }}>
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
