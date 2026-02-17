import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  FileText, Loader2, Zap, Star, Eye, Target, TrendingDown,
  CheckCircle, AlertTriangle, DollarSign, ArrowRight, Printer,
  ExternalLink, MapPin, BrainCircuit, Sparkles, Globe, Search,
  Camera, Shield, TrendingUp, BarChart3,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const AGENT_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/GJymFbXargxhNYgZ.png";
const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";
const LUX_WRITEOFF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/wryPInepxaCrmhhs.png";
const MAPS_PIN_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/qsckqqnqYIdQgtgA.png";

export default function Reports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [auditId] = useState(() => {
    const id = searchParams.get("auditId");
    return id ? parseInt(id) : undefined;
  });

  const auditQuery = trpc.audit.get.useQuery(
    { id: auditId! },
    { enabled: !!auditId }
  );

  const auditsQuery = trpc.audit.list.useQuery(undefined, { enabled: !!user && !auditId });

  const handlePrint = () => { window.print(); };

  const audit = auditQuery.data as any;
  const analysis = audit?.aiAnalysis || {};
  const businessData = audit?.businessData || {};
  const competitors = (audit?.competitorData || []) as any[];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  if (!auditId) {
    const audits = (auditsQuery.data || []) as any[];
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">Reports & Export</h1>
              <p className="text-sm text-muted-foreground">Generate and export professional branded audit reports.</p>
            </div>
          </div>

          {audits.filter(a => a.status === "complete").length > 0 ? (
            <div className="grid gap-3">
              {audits.filter(a => a.status === "complete").map((a: any) => (
                <Card key={a.id} className="bg-card border-border/50 hover:border-lux-gold/20 transition-all cursor-pointer" onClick={() => setLocation(`/reports?auditId=${a.id}`)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{a.businessName}</div>
                      <div className="text-xs text-muted-foreground">{a.businessLocation} · Score: {Math.round(a.overallScore ?? 0)}/100</div>
                    </div>
                    <Button size="sm" className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
                      <FileText className="w-3 h-3" /> View Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No completed audits yet. Run an audit first to generate reports.</p>
              <Button onClick={() => setLocation("/dashboard")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90">
                <Zap className="w-4 h-4" /> Start Audit
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (auditQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-lux-gold" />
        </div>
      </DashboardLayout>
    );
  }

  if (!audit || audit.status !== "complete") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <AlertTriangle className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Audit not ready for report generation</p>
          <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const radarData = [
    { subject: "AI Visibility", score: audit.aiVisibilityScore ?? 0 },
    { subject: "Maps", score: audit.mapsPresenceScore ?? 0 },
    { subject: "Reviews", score: audit.reviewScore ?? 0 },
    { subject: "Photos", score: audit.photoScore ?? 0 },
    { subject: "SEO", score: audit.seoScore ?? 0 },
    { subject: "Competitors", score: audit.competitorGapScore ?? 0 },
  ];

  const llmScores = [
    { name: "ChatGPT", score: audit.chatgptScore ?? 0, color: "#10b981" },
    { name: "Gemini", score: audit.geminiScore ?? 0, color: "#3b82f6" },
    { name: "Perplexity", score: audit.perplexityScore ?? 0, color: "#8b5cf6" },
  ];

  const moneyLeaks = analysis.moneyLeaks || [];
  const totalLoss = moneyLeaks.reduce((sum: number, l: any) => sum + (l.estimatedLoss ?? 0), 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
        {/* Print Controls */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">Report Preview</h1>
              <p className="text-xs text-muted-foreground">{audit.businessName} · {audit.businessLocation}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent border-border/50" onClick={() => setLocation(`/audit/${audit.id}`)}>
              <ArrowRight className="w-4 h-4" /> Back to Audit
            </Button>
            <Button className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold" onClick={handlePrint}>
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>
        </div>

        {/* ============ PRINTABLE REPORT ============ */}
        <div ref={reportRef} className="space-y-4 print:space-y-3" id="printable-report">
          {/* Cover Header */}
          <div className="relative overflow-hidden rounded-2xl border border-lux-gold/20 print:border-lux-gold/40">
            <div className="bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a2e] p-8 md:p-10 text-center relative">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #d4a843 0%, transparent 50%), radial-gradient(circle at 75% 75%, #d4a843 0%, transparent 50%)" }} />
              <div className="relative">
                <div className="flex flex-col items-center gap-2 mb-6">
                  <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-12 w-auto object-contain" />
                  <div className="text-[10px] text-lux-gold/60 tracking-[0.2em] uppercase">AI Intelligence Report</div>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">{audit.businessName}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {audit.businessLocation} · {audit.industry}
                </p>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span>Generated: {new Date(audit.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span>·</span>
                  <span>by Lux Automaton</span>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="rounded-xl border border-lux-gold/20 bg-card p-4 text-center">
              <div className={`text-3xl font-black ${getScoreClass(audit.overallScore ?? 0)}`}>{Math.round(audit.overallScore ?? 0)}</div>
              <div className="text-[9px] text-muted-foreground tracking-wider mt-1">OVERALL SCORE</div>
              <div className={`text-xs font-bold mt-1 ${getScoreClass(audit.overallScore ?? 0)}`}>{getScoreGrade(audit.overallScore ?? 0)}</div>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-card p-4 text-center">
              <div className="text-2xl font-black text-red-400">${Math.round(audit.estimatedMonthlyLoss ?? 0).toLocaleString()}</div>
              <div className="text-[9px] text-muted-foreground tracking-wider mt-1">MONTHLY LOSS</div>
              <div className="text-xs text-red-400 mt-1">${Math.round((audit.estimatedMonthlyLoss ?? 0) * 12).toLocaleString()}/yr</div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-card p-4 text-center">
              <div className="text-2xl font-black text-amber-400">{businessData.rating ?? "N/A"}</div>
              <div className="text-[9px] text-muted-foreground tracking-wider mt-1">GOOGLE RATING</div>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(businessData.rating || 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />)}
              </div>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-card p-4 text-center">
              <div className="text-2xl font-black text-blue-400">{businessData.user_ratings_total ?? 0}</div>
              <div className="text-[9px] text-muted-foreground tracking-wider mt-1">TOTAL REVIEWS</div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4 text-center">
              <div className={`text-2xl font-black ${getScoreClass(audit.aiVisibilityScore ?? 0)}`}>{Math.round(audit.aiVisibilityScore ?? 0)}</div>
              <div className="text-[9px] text-muted-foreground tracking-wider mt-1">AI VISIBILITY</div>
            </div>
          </div>

          {/* AI Platform Scores */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-lux-gold" />
              <h3 className="text-sm font-display font-bold">AI Platform Visibility Scores</h3>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/30">
              {llmScores.map((llm) => (
                <div key={llm.name} className="p-5 text-center">
                  <div className="text-xs text-muted-foreground mb-2">{llm.name}</div>
                  <div className="text-4xl font-black" style={{ color: llm.color }}>{llm.score}</div>
                  <div className="text-[10px] mt-1" style={{ color: llm.color }}>{getScoreGrade(llm.score)} Grade</div>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${llm.score}%`, backgroundColor: llm.color }} />
                  </div>
                </div>
              ))}
            </div>
            {/* LLM Issues Summary */}
            <div className="p-4 border-t border-border/30 space-y-3">
              {[
                { key: "chatgpt", label: "ChatGPT", data: audit.chatgptIssues, color: "#10b981" },
                { key: "gemini", label: "Google Gemini", data: audit.geminiIssues, color: "#3b82f6" },
                { key: "perplexity", label: "Perplexity AI", data: audit.perplexityIssues, color: "#8b5cf6" },
              ].map(({ key, label, data, color }) => {
                const issues = (data as any)?.issues || [];
                const summary = (data as any)?.summary || "";
                if (issues.length === 0 && !summary) return null;
                return (
                  <div key={key} className="rounded-lg bg-background/50 border border-border/30 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs font-bold" style={{ color }}>{label}</span>
                      <Badge variant="secondary" className="text-[9px] ml-auto">{issues.length} issues</Badge>
                    </div>
                    {summary && <p className="text-xs text-muted-foreground mb-2">{summary}</p>}
                    {issues.slice(0, 3).map((issue: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mt-1.5">
                        <AlertTriangle className={`w-3 h-3 mt-0.5 shrink-0 ${issue.severity === "critical" ? "text-red-400" : issue.severity === "high" ? "text-orange-400" : "text-yellow-400"}`} />
                        <div>
                          <span className="font-medium text-foreground">{issue.issue}</span>
                          <span className="text-emerald-400/80 ml-1">→ {issue.fix}</span>
                        </div>
                      </div>
                    ))}
                    {issues.length > 3 && <p className="text-[10px] text-muted-foreground mt-2">+{issues.length - 3} more issues in full audit</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <h3 className="text-sm font-display font-bold mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-lux-gold" /> Score Radar</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.28 0.02 270)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke="#d4a843" fill="#d4a843" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <h3 className="text-sm font-display font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-lux-gold" /> Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={radarData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 10 }} />
                  <YAxis type="category" dataKey="subject" width={90} tick={{ fill: "oklch(0.6 0.02 270)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.015 270)", border: "1px solid oklch(0.28 0.02 270)", borderRadius: 8, color: "oklch(0.93 0.005 270)" }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {radarData.map((entry, index) => (
                      <Cell key={index} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Money Leaks */}
          {moneyLeaks.length > 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-card overflow-hidden">
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-display font-bold">Revenue Leaks Identified</h3>
                </div>
                <div className="text-lg font-black text-red-400">${totalLoss.toLocaleString()}/mo</div>
              </div>
              <div className="divide-y divide-border/20">
                {moneyLeaks.map((leak: any, i: number) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <DollarSign className={`w-4 h-4 mt-0.5 shrink-0 ${leak.priority === "high" ? "text-red-400" : "text-amber-400"}`} />
                      <div>
                        <div className="font-semibold text-sm">{leak.area}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">{leak.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-red-400">${(leak.estimatedLoss ?? 0).toLocaleString()}/mo</div>
                      <Badge className={`text-[9px] mt-1 ${leak.priority === "high" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>{leak.priority?.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths, Weaknesses, Opportunities */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-card p-4">
              <h3 className="text-sm font-display font-bold flex items-center gap-2 mb-3"><CheckCircle className="w-4 h-4 text-emerald-400" /> Strengths</h3>
              <ul className="space-y-2">
                {(analysis.strengths || []).map((s: string, i: number) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-card p-4">
              <h3 className="text-sm font-display font-bold flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-amber-400" /> Weaknesses</h3>
              <ul className="space-y-2">
                {(analysis.weaknesses || []).map((w: string, i: number) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
              <h3 className="text-sm font-display font-bold flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-blue-400" /> Opportunities</h3>
              <ul className="space-y-2">
                {(analysis.opportunities || []).map((o: string, i: number) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" /> {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitor Comparison */}
          {competitors.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-4 border-b border-border/30 flex items-center gap-2">
                <Target className="w-4 h-4 text-lux-gold" />
                <h3 className="text-sm font-display font-bold">Competitor Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 text-xs text-muted-foreground">
                      <th className="text-left p-3 font-medium">Business</th>
                      <th className="text-center p-3 font-medium">Rating</th>
                      <th className="text-center p-3 font-medium">Reviews</th>
                      <th className="text-center p-3 font-medium">Website</th>
                      <th className="text-center p-3 font-medium">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-lux-gold/10 bg-lux-gold/5">
                      <td className="p-3 font-bold flex items-center gap-2"><Sparkles className="w-3 h-3 text-lux-gold" /> {audit.businessName}</td>
                      <td className="p-3 text-center font-bold">{businessData.rating ?? "N/A"} <Star className="w-3 h-3 text-amber-400 inline" /></td>
                      <td className="p-3 text-center font-bold">{businessData.user_ratings_total ?? 0}</td>
                      <td className="p-3 text-center">{businessData.website ? "Yes" : "No"}</td>
                      <td className="p-3 text-center">{businessData.opening_hours ? "Listed" : "No"}</td>
                    </tr>
                    {competitors.map((comp: any, i: number) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="p-3 text-muted-foreground">{comp.name}</td>
                        <td className="p-3 text-center">{comp.rating ?? "N/A"} <Star className="w-3 h-3 text-amber-400 inline" /></td>
                        <td className="p-3 text-center">{comp.user_ratings_total ?? 0}</td>
                        <td className="p-3 text-center">{comp.website ? "Yes" : "No"}</td>
                        <td className="p-3 text-center">{comp.opening_hours ? "Listed" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {analysis.competitorInsights && analysis.competitorInsights.length > 0 && (
                <div className="p-4 border-t border-border/30 space-y-2">
                  {analysis.competitorInsights.map((insight: any, i: number) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{insight.competitorName}:</span> {insight.advantage} <span className="text-red-400">Gap: {insight.yourGap}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {Array.isArray(audit.recommendations) && audit.recommendations.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-4 border-b border-border/30 flex items-center gap-2">
                <Shield className="w-4 h-4 text-lux-gold" />
                <h3 className="text-sm font-display font-bold">Recommendations & Roadmap</h3>
              </div>
              <div className="divide-y divide-border/20">
                {(audit.recommendations as any[]).map((rec: any, i: number) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-lux-gold/10 flex items-center justify-center text-[10px] font-bold text-lux-gold">{i + 1}</span>
                        <span className="font-semibold text-sm">{rec.title}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <Badge className={`text-[9px] ${rec.impact === "high" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{rec.impact} impact</Badge>
                        <Badge className={`text-[9px] ${rec.effort === "easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>{rec.effort} effort</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap */}
          {analysis.roadmap && analysis.roadmap.length > 0 && (
            <div className="rounded-2xl border border-lux-gold/20 bg-card overflow-hidden">
              <div className="p-4 border-b border-border/30 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-lux-gold" />
                <h3 className="text-sm font-display font-bold">Implementation Roadmap</h3>
              </div>
              <div className="p-4 space-y-4">
                {analysis.roadmap.map((phase: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center text-xs font-bold text-lux-gold">{phase.phase}</div>
                      {i < analysis.roadmap.length - 1 && <div className="w-px h-full bg-lux-gold/10 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-sm">{phase.title}</h4>
                      <p className="text-xs text-muted-foreground">{phase.timeline} · ROI: {phase.expectedROI}</p>
                      <ul className="mt-2 space-y-1">
                        {(phase.actions || []).map((action: string, j: number) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <ArrowRight className="w-3 h-3 text-lux-gold mt-0.5 shrink-0" /> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tax Write-Off */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-lux-gold/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <h3 className="font-display font-bold text-sm">Tax Write-Off Information</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Business consulting and marketing audit expenses are generally tax-deductible as ordinary and necessary business expenses under IRS Section 162. This audit may qualify as a deductible expense.
            </p>
            <p className="text-xs text-muted-foreground">
              Track and manage your business write-offs with <a href="https://luxwriteoff.com" target="_blank" rel="noopener noreferrer" className="text-lux-gold hover:underline font-semibold">Lux WriteOff</a> for maximum tax savings.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-border/30">
            <div className="flex flex-col items-center gap-1 mb-3">
              <div className="flex items-center gap-2">
                <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-8 w-auto object-contain" />
                <div className="h-5 w-px bg-border/30" />
                <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-5 w-auto object-contain opacity-50" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-md mx-auto">
              This report is generated by Lux Biz Optimizer AI analysis engine. Results are estimates based on available public data from Google Maps, business listings, and AI platform analysis. Actual results may vary.
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span>luxwriteoff.com</span>
              <span>·</span>
              <span>Confidential</span>
              <span>·</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
