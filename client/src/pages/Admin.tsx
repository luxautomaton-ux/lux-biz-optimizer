import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { DollarSign, TrendingUp, Users, Activity, Calculator, BarChart3, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [companyCount, setCompanyCount] = useState(10);

  // Redirect non-admin users
  if (!loading && (!user || user.role !== "admin")) {
    navigate("/dashboard");
    return null;
  }

  // Cost per audit breakdown (estimated)
  const COST_PER_AUDIT = {
    googleMapsApiCalls: 0.05, // Text search + details + competitor search
    llmAnalysisCalls: 0.15, // Main audit analysis
    perLlmScoring: 0.09, // 3 LLM scores (ChatGPT, Gemini, Perplexity)
    competitorAnalysis: 0.03, // Competitor data processing
    total: 0.32,
  };

  const COST_PER_SCAN = {
    googleMapsApiCalls: 0.03,
    llmProcessing: 0.05,
    total: 0.08,
  };

  const COST_PER_LEAD_BATCH = {
    googleMapsApiCalls: 0.10, // 50 leads
    llmAnalysis: 0.20, // AI analysis for 20 leads
    total: 0.30,
  };

  const COST_PER_AI_FIX = {
    llmGeneration: 0.12,
    verification: 0.03,
    total: 0.15,
  };

  const calculateCosts = (companies: number) => {
    const audits = companies;
    const scans = companies * 0.5; // Assume 50% run niche scanner
    const leadBatches = companies * 0.3; // Assume 30% use lead generator
    const aiFixes = companies * 1.5; // Assume 1.5 fixes per company on average

    const auditCost = audits * COST_PER_AUDIT.total;
    const scanCost = scans * COST_PER_SCAN.total;
    const leadCost = leadBatches * COST_PER_LEAD_BATCH.total;
    const fixCost = aiFixes * COST_PER_AI_FIX.total;

    const totalCost = auditCost + scanCost + leadCost + fixCost;
    const avgRevenuePerCompany = 800; // Average between $500-$2000
    const totalRevenue = companies * avgRevenuePerCompany;
    const profit = totalRevenue - totalCost;
    const profitMargin = (profit / totalRevenue) * 100;

    return {
      auditCost,
      scanCost,
      leadCost,
      fixCost,
      totalCost,
      totalRevenue,
      profit,
      profitMargin,
    };
  };

  const costs = calculateCosts(companyCount);

  return (
    <DashboardLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-lux-gold to-lux-orange bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Operational analytics and cost calculator for Lux Biz Optimizer
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lux-gold/10 border border-lux-gold/20">
            <AlertCircle className="h-5 w-5 text-lux-gold" />
            <span className="text-sm font-medium">Admin Access</span>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-lux-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Cost/Audit</CardTitle>
                  <Calculator className="h-4 w-4 text-lux-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lux-gold">${COST_PER_AUDIT.total.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Maps + LLM + Analysis</p>
                </CardContent>
              </Card>

              <Card className="border-lux-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Revenue/Audit</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">$800</div>
                  <p className="text-xs text-muted-foreground mt-1">$500-$2000 range</p>
                </CardContent>
              </Card>

              <Card className="border-lux-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{costs.profitMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">After all costs</p>
                </CardContent>
              </Card>

              <Card className="border-lux-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit ({companyCount})</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">${costs.profit.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Net after costs</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-lux-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-lux-gold" />
                  Cost Calculator
                </CardTitle>
                <CardDescription>
                  Calculate operational costs for different company volumes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyCount">Number of Companies</Label>
                  <Input
                    id="companyCount"
                    type="number"
                    value={companyCount}
                    onChange={(e) => setCompanyCount(parseInt(e.target.value) || 10)}
                    min={1}
                    max={1000}
                    className="max-w-xs"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Cost Breakdown</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Usage</TableHead>
                        <TableHead className="text-right">Cost/Unit</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Audits</TableCell>
                        <TableCell className="text-right">{companyCount}</TableCell>
                        <TableCell className="text-right">${COST_PER_AUDIT.total}</TableCell>
                        <TableCell className="text-right font-semibold">${costs.auditCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Niche Scans</TableCell>
                        <TableCell className="text-right">{(companyCount * 0.5).toFixed(0)}</TableCell>
                        <TableCell className="text-right">${COST_PER_SCAN.total}</TableCell>
                        <TableCell className="text-right font-semibold">${costs.scanCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lead Generation</TableCell>
                        <TableCell className="text-right">{(companyCount * 0.3).toFixed(0)} batches</TableCell>
                        <TableCell className="text-right">${COST_PER_LEAD_BATCH.total}</TableCell>
                        <TableCell className="text-right font-semibold">${costs.leadCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AI Fixes</TableCell>
                        <TableCell className="text-right">{(companyCount * 1.5).toFixed(0)}</TableCell>
                        <TableCell className="text-right">${COST_PER_AI_FIX.total}</TableCell>
                        <TableCell className="text-right font-semibold">${costs.fixCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total Operational Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold text-lg text-lux-gold">${costs.totalCost.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Revenue & Profit</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold text-green-500">${costs.totalRevenue.toFixed(2)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
                      <div className="text-2xl font-bold text-red-500">${costs.totalCost.toFixed(2)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-lux-gold/10 border border-lux-gold/20">
                      <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
                      <div className="text-2xl font-bold text-lux-gold">${costs.profit.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-blue-500">Manus API Usage</div>
                      <p className="text-sm text-muted-foreground">
                        All costs shown are for Manus LLM API calls only. Google Maps API is free via Manus proxy.
                        Firebase storage and database costs are minimal (estimated $0.01-0.05 per company).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              {[10, 30, 50, 100].slice(0, 3).map((count) => {
                const calc = calculateCosts(count);
                return (
                  <Card key={count} className="border-lux-gold/20">
                    <CardHeader>
                      <CardTitle className="text-lux-gold">{count} Companies</CardTitle>
                      <CardDescription>Quick estimate</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="font-semibold text-red-500">${calc.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-semibold text-green-500">${calc.totalRevenue.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Profit:</span>
                        <span className="font-bold text-lux-gold">${calc.profit.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {calc.profitMargin.toFixed(1)}% margin
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-lux-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-lux-gold" />
                  Usage Analytics
                </CardTitle>
                <CardDescription>
                  Real-time usage tracking across all platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm mt-2">Track audits, scans, leads, and LLM usage in real-time</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-lux-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-lux-gold" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage users and monitor activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>User management coming soon</p>
                  <p className="text-sm mt-2">View all users, activity logs, and subscription status</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
