import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  BarChart3, Calculator, DollarSign, TrendingUp,
  Users, Target, Zap, ArrowRight, Sparkles,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";

export default function MarketAnalytics() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [monthlyCustomers, setMonthlyCustomers] = useState(100);
  const [avgTicket, setAvgTicket] = useState(150);
  const [currentConversion, setCurrentConversion] = useState(15);
  const [projectedImprovement, setProjectedImprovement] = useState(35);

  const auditsQuery = trpc.audit.list.useQuery(undefined, { enabled: !!user });
  const audits = (auditsQuery.data || []) as any[];
  const completedAudits = audits.filter(a => a.status === "complete");

  const roi = useMemo(() => {
    const currentRevenue = monthlyCustomers * avgTicket * (currentConversion / 100);
    const projectedRevenue = monthlyCustomers * avgTicket * (projectedImprovement / 100);
    const monthlyGain = projectedRevenue - currentRevenue;
    const annualGain = monthlyGain * 12;
    const auditCost = 1500;
    const roiPercent = ((annualGain - auditCost) / auditCost) * 100;
    return { currentRevenue, projectedRevenue, monthlyGain, annualGain, auditCost, roiPercent };
  }, [monthlyCustomers, avgTicket, currentConversion, projectedImprovement]);

  const projectionData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const improvement = Math.min(projectedImprovement, currentConversion + ((projectedImprovement - currentConversion) * (month / 6)));
      return {
        month: `M${month}`,
        current: Math.round(monthlyCustomers * avgTicket * (currentConversion / 100)),
        projected: Math.round(monthlyCustomers * avgTicket * (improvement / 100)),
      };
    });
  }, [monthlyCustomers, avgTicket, currentConversion, projectedImprovement]);

  const scoreDistribution = useMemo(() => {
    if (completedAudits.length === 0) return [
      { name: "Critical (0-30)", value: 35, color: "#ef4444" },
      { name: "Needs Work (31-60)", value: 40, color: "#f59e0b" },
      { name: "Good (61-80)", value: 18, color: "#3b82f6" },
      { name: "Excellent (81-100)", value: 7, color: "#10b981" },
    ];
    const ranges = [0, 0, 0, 0];
    completedAudits.forEach(a => {
      const s = a.overallScore ?? 0;
      if (s <= 30) ranges[0]++;
      else if (s <= 60) ranges[1]++;
      else if (s <= 80) ranges[2]++;
      else ranges[3]++;
    });
    return [
      { name: "Critical (0-30)", value: ranges[0], color: "#ef4444" },
      { name: "Needs Work (31-60)", value: ranges[1], color: "#f59e0b" },
      { name: "Good (61-80)", value: ranges[2], color: "#3b82f6" },
      { name: "Excellent (81-100)", value: ranges[3], color: "#10b981" },
    ];
  }, [completedAudits]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lux-gold to-amber-600 flex items-center justify-center shadow-lg shadow-lux-gold/10">
            <BarChart3 className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Market Analytics</h1>
            <p className="text-sm text-muted-foreground">ROI calculator and market intelligence for AI optimization.</p>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="rounded-2xl border border-lux-gold/20 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-lux-gold" />
            <h3 className="text-sm font-display font-bold">ROI Calculator</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs tracking-wider text-muted-foreground font-semibold">MONTHLY CUSTOMER INQUIRIES</Label>
                    <span className="text-sm font-display font-bold text-lux-gold">{monthlyCustomers}</span>
                  </div>
                  <Slider value={[monthlyCustomers]} onValueChange={([v]) => setMonthlyCustomers(v)} min={10} max={1000} step={10} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs tracking-wider text-muted-foreground font-semibold">AVERAGE TICKET VALUE ($)</Label>
                    <span className="text-sm font-display font-bold text-lux-gold">${avgTicket}</span>
                  </div>
                  <Slider value={[avgTicket]} onValueChange={([v]) => setAvgTicket(v)} min={25} max={5000} step={25} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs tracking-wider text-muted-foreground font-semibold">CURRENT CONVERSION RATE (%)</Label>
                    <span className="text-sm font-display font-bold">{currentConversion}%</span>
                  </div>
                  <Slider value={[currentConversion]} onValueChange={([v]) => setCurrentConversion(v)} min={1} max={50} step={1} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs tracking-wider text-muted-foreground font-semibold">PROJECTED CONVERSION AFTER OPTIMIZATION (%)</Label>
                    <span className="text-sm font-display font-bold text-emerald-400">{projectedImprovement}%</span>
                  </div>
                  <Slider value={[projectedImprovement]} onValueChange={([v]) => setProjectedImprovement(v)} min={currentConversion} max={80} step={1} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-background border border-border/30 p-4 text-center">
                    <div className="text-[10px] tracking-wider text-muted-foreground mb-1">CURRENT MONTHLY</div>
                    <div className="text-xl font-display font-bold">${Math.round(roi.currentRevenue).toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-background border border-emerald-500/20 p-4 text-center">
                    <div className="text-[10px] tracking-wider text-muted-foreground mb-1">PROJECTED MONTHLY</div>
                    <div className="text-xl font-display font-bold text-emerald-400">${Math.round(roi.projectedRevenue).toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-background border border-lux-gold/20 p-4 text-center">
                    <div className="text-[10px] tracking-wider text-muted-foreground mb-1">MONTHLY GAIN</div>
                    <div className="text-xl font-display font-bold text-lux-gold">${Math.round(roi.monthlyGain).toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-background border border-blue-500/20 p-4 text-center">
                    <div className="text-[10px] tracking-wider text-muted-foreground mb-1">ANNUAL GAIN</div>
                    <div className="text-xl font-display font-bold text-blue-400">${Math.round(roi.annualGain).toLocaleString()}</div>
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-lux-gold/5 to-emerald-500/5 border border-lux-gold/20 p-5 text-center">
                  <div className="text-[10px] tracking-wider text-muted-foreground mb-1">RETURN ON INVESTMENT</div>
                  <div className="text-4xl font-display font-bold text-lux-gold">{Math.round(roi.roiPercent)}%</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Based on ${roi.auditCost.toLocaleString()} audit investment</div>
                </div>
              </div>
            </div>

            {/* Revenue Projection Chart */}
            <div className="mt-6">
              <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground mb-4">12-MONTH REVENUE PROJECTION</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff" }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Line type="monotone" dataKey="current" stroke="#666" strokeDasharray="5 5" name="Current Path" dot={false} />
                  <Line type="monotone" dataKey="projected" stroke="#d4a843" strokeWidth={2} name="Optimized Path" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="text-sm font-display font-bold">Score Distribution (Industry Average)</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={scoreDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {scoreDistribution.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="text-sm font-display font-bold">Key Market Insights</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: Users, label: "98% of local businesses are NOT optimized for AI discovery", color: "text-red-400", bg: "bg-red-500/10" },
                { icon: TrendingUp, label: "Voice search queries grew 35% year-over-year", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { icon: Target, label: "AI-recommended businesses see 3x more conversions", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: DollarSign, label: "Average business loses $2,400/mo from poor AI visibility", color: "text-lux-gold", bg: "bg-lux-gold/10" },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/30">
                  <div className={`w-8 h-8 rounded-lg ${insight.bg} flex items-center justify-center shrink-0`}>
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">{insight.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-lux-gold/5 to-amber-600/5 border border-lux-gold/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-lux-gold" />
            <div>
              <h3 className="font-display font-bold">Ready to stop losing money?</h3>
              <p className="text-sm text-muted-foreground">Run a full audit to see your exact numbers and get a custom roadmap.</p>
            </div>
          </div>
          <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={() => setLocation("/dashboard")}>
            <Zap className="w-4 h-4" /> Start Audit <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
