import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Send, Loader2, Bot, User, ArrowRight, Lock, Sparkles,
  Shield, Wrench, Search, Star, BrainCircuit, Zap,
} from "lucide-react";
import { Streamdown } from "streamdown";

const AGENT_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/GJymFbXargxhNYgZ.png";

export default function AgentChat() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [auditId] = useState(() => {
    const id = searchParams.get("auditId");
    return id ? parseInt(id) : undefined;
  });

  const chatHistory = trpc.chat.history.useQuery(
    { auditId },
    { enabled: !!user }
  );

  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      chatHistory.refetch();
      setMessage("");
    },
    onError: (err) => toast.error(err.message),
  });

  const auditQuery = trpc.audit.get.useQuery(
    { id: auditId! },
    { enabled: !!auditId }
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory.data, sendMessage.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user) {
      toast.error("Please sign in to use the AI Agent");
      return;
    }
    sendMessage.mutate({ message: message.trim(), auditId });
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6 p-6">
          <div className="relative">
            <img src={AGENT_PHOTO} alt="Lux AI Guardian" className="w-24 h-24 rounded-full border-2 border-lux-gold/30 shadow-lg shadow-lux-gold/10 object-cover" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-lux-gold flex items-center justify-center">
              <Lock className="w-4 h-4 text-black" />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-xl font-display font-bold mb-2">Lux AI Guardian Agent</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sign in to access your dedicated AI business optimization expert. Get real-time guidance, description rewrites, review strategies, and automated fixes.
            </p>
            <Button onClick={() => setLocation("/signin")} className="gap-2 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
              Sign In to Access <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const messages = (chatHistory.data || []) as any[];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-card to-card/80">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={AGENT_PHOTO} alt="Lux AI Guardian" className="w-10 h-10 rounded-full border border-lux-gold/30 object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sm flex items-center gap-2">
                  Lux AI Guardian
                  <Badge className="text-[9px] gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Sparkles className="w-2.5 h-2.5" /> ONLINE
                  </Badge>
                </h1>
                <p className="text-xs text-muted-foreground">
                  {auditQuery.data ? `Context: ${(auditQuery.data as any).businessName}` : "Your AI business optimization expert"}
                </p>
              </div>
            </div>
            {auditQuery.data && (
              <Badge className="text-xs gap-1 bg-lux-gold/10 text-lux-gold border-lux-gold/20">
                Score: {Math.round((auditQuery.data as any).overallScore ?? 0)}/100
              </Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-6">
                <div className="relative mx-auto w-fit">
                  <img src={AGENT_PHOTO} alt="Lux AI Guardian" className="w-20 h-20 rounded-full border-2 border-lux-gold/20 shadow-lg shadow-lux-gold/10 object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-lux-gold to-amber-600 flex items-center justify-center">
                    <BrainCircuit className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold mb-2">Welcome to the AI Guardian</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    I'm your dedicated business optimization expert powered by Lux Automaton. Ask me anything about improving your AI visibility, Google Business Profile, reviews, SEO, or competitor strategy.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {[
                    { icon: Search, text: "How can I improve my Google Business description for voice search?" },
                    { icon: Star, text: "Create a review strategy to get more 5-star reviews" },
                    { icon: BrainCircuit, text: "What do AI assistants look for in a business listing?" },
                    { icon: Wrench, text: "Help me write an AI-optimized business description" },
                    { icon: Shield, text: "Analyze my competitors and find opportunities" },
                    { icon: Zap, text: "How can I get Gemini to recommend my business?" },
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(prompt.text)}
                      className="p-3 rounded-xl bg-card border border-border/50 text-xs text-left text-muted-foreground hover:border-lux-gold/30 hover:text-foreground transition-all flex items-start gap-2.5 group"
                    >
                      <prompt.icon className="w-4 h-4 text-lux-gold/50 group-hover:text-lux-gold shrink-0 mt-0.5" />
                      <span>{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg: any, i: number) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role !== "user" && (
                  <img src={AGENT_PHOTO} alt="AI" className="w-8 h-8 rounded-full border border-lux-gold/20 object-cover shrink-0 mt-1" />
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === "user"
                    ? "bg-lux-gold text-black"
                    : "bg-card border border-border/50"
                  }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm font-medium">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm prose-invert max-w-none">
                      <Streamdown>{msg.content}</Streamdown>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    {(user as any)?.photoUrl ? (
                      <img src={(user as any).photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-lux-gold" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {sendMessage.isPending && (
              <div className="flex gap-3">
                <img src={AGENT_PHOTO} alt="AI" className="w-8 h-8 rounded-full border border-lux-gold/20 object-cover shrink-0" />
                <div className="bg-card border border-border/50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-lux-gold" />
                    <span className="text-xs text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-card/50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask the AI Guardian anything about your business optimization..."
              className="flex-1 bg-background border-border/50 focus:border-lux-gold/30"
              disabled={sendMessage.isPending}
            />
            <Button type="submit" disabled={sendMessage.isPending || !message.trim()} className="gap-2 px-6 bg-lux-gold text-black hover:bg-lux-gold/90 font-semibold">
              {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
