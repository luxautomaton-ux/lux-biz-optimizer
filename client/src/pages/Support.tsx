import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ICONS_3D } from "@/lib/icons3d";
import {
  MessageSquare, Plus, Loader2, Send, AlertCircle, CheckCircle, Clock,
  HelpCircle, Bug, CreditCard, Settings, Shield, Crown, Bot,
  ChevronRight, ArrowLeft, User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "other", label: "General Question", icon: HelpCircle },
  { value: "billing", label: "Billing & Payments", icon: CreditCard },
  { value: "technical", label: "Bug Report", icon: Bug },
  { value: "feature_request", label: "Feature Request", icon: Settings },
  { value: "audit_issue", label: "Audit Issue", icon: Shield },
  { value: "account", label: "Account Issue", icon: User },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-blue-400 border-blue-500/20" },
  { value: "medium", label: "Medium", color: "text-amber-400 border-amber-500/20" },
  { value: "high", label: "High", color: "text-orange-400 border-orange-500/20" },
  { value: "urgent", label: "Urgent", color: "text-red-400 border-red-500/20" },
];

export default function Support() {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");
  const [replyMessage, setReplyMessage] = useState("");

  const { data: tickets, isLoading, refetch } = trpc.support.list.useQuery(undefined, { enabled: !!user });
  const { data: ticketDetail, isLoading: detailLoading } = trpc.support.getById.useQuery(
    { id: selectedTicketId! },
    { enabled: !!selectedTicketId && view === "detail" }
  );

  const createMutation = trpc.support.create.useMutation({
    onSuccess: (data) => {
      toast.success("Ticket created! AI agent is reviewing it.");
      setSubject("");
      setDescription("");
      setCategory("general");
      setPriority("medium");
      setSelectedTicketId(data.ticketId);
      setView("detail");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const replyMutation = trpc.support.reply.useMutation({
    onSuccess: () => {
      setReplyMessage("");
      toast.success("Reply sent! AI agent is processing...");
      // Refetch ticket detail after a short delay for AI response
      setTimeout(() => {
        refetch();
      }, 3000);
    },
    onError: (err) => toast.error(err.message),
  });

  const closeMutation = trpc.support.close.useMutation({
    onSuccess: () => {
      toast.success("Ticket closed");
      setView("list");
      refetch();
    },
  });

  const handleCreate = () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate({ subject, description, category: category as any, priority: priority as any });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="outline" className="text-emerald-400 border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case "in_progress": return <Badge variant="outline" className="text-blue-400 border-blue-500/20"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "waiting": return <Badge variant="outline" className="text-amber-400 border-amber-500/20"><Clock className="w-3 h-3 mr-1" />Waiting</Badge>;
      case "closed": return <Badge variant="outline" className="text-muted-foreground border-border/50"><CheckCircle className="w-3 h-3 mr-1" />Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-lux-gold/20 bg-gradient-to-br from-card via-card/95 to-lux-gold/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-gold via-lux-orange to-lux-gold" />
          <div className="absolute top-4 right-4 opacity-15">
            <img src={ICONS_3D.headsetSupport} alt="" className="w-24 h-24 object-contain animate-bounce-slow" />
          </div>
          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lux-gold/20 to-amber-600/10 flex items-center justify-center shadow-lg shadow-lux-gold/10 border border-lux-gold/20 overflow-hidden">
                  <img src={ICONS_3D.headsetSupport} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gradient-gold">Support Center</h1>
                  </div>
                  <p className="text-muted-foreground max-w-xl">
                    Get help from our AI-powered support agent. Submit tickets and get instant responses — complex issues are escalated to our team.
                  </p>
                </div>
              </div>
              {view === "list" && (
                <Button onClick={() => setView("create")} className="gap-2 bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:opacity-90">
                  <Plus className="w-4 h-4" /> New Ticket
                </Button>
              )}
              {view !== "list" && (
                <Button variant="outline" onClick={() => { setView("list"); setSelectedTicketId(null); }} className="gap-2 border-lux-gold/20">
                  <ArrowLeft className="w-4 h-4" /> Back to Tickets
                </Button>
              )}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img src={ICONS_3D.aiBot} alt="" className="w-5 h-5 object-contain" />
                <span>AI Agent Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Military-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>24/7 Availability</span>
              </div>
            </div>
          </div>
        </div>

        {/* CREATE TICKET VIEW */}
        {view === "create" && (
          <Card className="border-lux-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-lux-gold" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>Describe your issue and our AI agent will respond immediately</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of your issue" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-2"><c.icon className="w-3.5 h-3.5" />{c.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or screenshots if applicable."
                  rows={6}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="w-full bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:opacity-90"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        )}

        {/* TICKET LIST VIEW */}
        {view === "list" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-lux-gold" />
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <Card className="border-lux-gold/10">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="font-semibold text-lg">No Support Tickets</h3>
                  <p className="text-sm text-muted-foreground mt-1">You haven't submitted any support tickets yet.</p>
                  <Button onClick={() => setView("create")} className="mt-4 gap-2 bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:opacity-90">
                    <Plus className="w-4 h-4" /> Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket: any) => (
                <Card
                  key={ticket.id}
                  className="border-lux-gold/10 hover:border-lux-gold/30 transition-colors cursor-pointer"
                  onClick={() => { setSelectedTicketId(ticket.id); setView("detail"); }}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-lux-gold/10 flex items-center justify-center">
                          {CATEGORIES.find(c => c.value === ticket.category)
                            ? (() => { const Icon = CATEGORIES.find(c => c.value === ticket.category)!.icon; return <Icon className="h-5 w-5 text-lux-gold" />; })()
                            : <HelpCircle className="h-5 w-5 text-lux-gold" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(ticket.status)}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TICKET DETAIL VIEW */}
        {view === "detail" && selectedTicketId && (
          <div className="space-y-6">
            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-lux-gold" />
              </div>
            ) : ticketDetail ? (
              <>
                {/* Ticket Info */}
                <Card className="border-lux-gold/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          #{ticketDetail.ticket.id} — {ticketDetail.ticket.subject}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {ticketDetail.ticket.category} • {ticketDetail.ticket.priority} priority • {new Date(ticketDetail.ticket.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticketDetail.ticket.status)}
                        {ticketDetail.ticket.status !== "closed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => closeMutation.mutate({ ticketId: selectedTicketId })}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            Close Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticketDetail.ticket.description}</p>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="border-lux-gold/10">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-lux-gold" /> Conversation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ticketDetail.messages.map((msg: any, i: number) => (
                      <div key={i} className={`flex gap-3 ${msg.senderType === "user" ? "justify-end" : ""}`}>
                        {msg.senderType !== "user" && (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lux-gold/20 to-amber-600/20 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-lux-gold" />
                          </div>
                        )}
                        <div className={`max-w-[75%] rounded-lg p-3 ${msg.senderType === "user"
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : msg.senderType === "admin"
                            ? "bg-purple-500/10 border border-purple-500/20"
                            : "bg-lux-gold/5 border border-lux-gold/10"
                          }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {msg.senderType === "user" ? "You" : msg.senderType === "admin" ? "Admin" : "AI Agent"}
                            </span>
                            <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.senderType === "user" && (
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {(user as any)?.photoUrl ? (
                              <img src={(user as any).photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Reply Box */}
                    {ticketDetail.ticket.status !== "closed" && (
                      <>
                        <Separator />
                        <div className="flex gap-3">
                          <Textarea
                            value={replyMessage}
                            onChange={e => setReplyMessage(e.target.value)}
                            placeholder="Type your reply..."
                            rows={3}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              if (!replyMessage.trim()) return;
                              replyMutation.mutate({ ticketId: selectedTicketId, message: replyMessage });
                            }}
                            disabled={replyMutation.isPending || !replyMessage.trim()}
                            className="self-end bg-gradient-to-r from-lux-gold to-amber-600 text-black hover:opacity-90"
                          >
                            {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-red-500/10">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400/40" />
                  <p className="text-muted-foreground">Ticket not found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
