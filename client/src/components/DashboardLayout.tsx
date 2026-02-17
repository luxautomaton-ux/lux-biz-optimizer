import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard, LogOut, PanelLeft, Search, BarChart3,
  Building2, MessageSquare, FileText, Settings, ShoppingCart,
  Crown, DollarSign, Target, Shield, TrendingUp, Headphones,
  Handshake, Globe, Megaphone, Star, ChevronDown,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { ICONS_3D } from "@/lib/icons3d";

const LOGO_DARK = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/BvdpMuTyVbgGsyQt.png";
const LUX_AUTOMATON_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/120389219/SfmIWOrDAfqsxxur.png";

/* ─── NAV ITEM TYPE ──────────────────────────────────────────────── */
type NavItem = {
  icon: any;
  label: string;
  path: string;
  icon3d: string;
  premium?: boolean;
  star?: boolean;
};

type NavGroup = {
  key: string;
  title: string;
  titleClass?: string;
  titleIcon?: React.ReactNode;
  items: NavItem[];
  adminOnly?: boolean;
};

/* ─── NAV GROUPS ─────────────────────────────────────────────────── */
const navGroups: NavGroup[] = [
  {
    key: "start",
    title: "GETTING STARTED",
    titleClass: "text-muted-foreground/60",
    items: [
      { icon: Building2, label: "Company Profile", path: "/company/new", icon3d: ICONS_3D.checklist },
      { icon: LayoutDashboard, label: "Audit Dashboard", path: "/dashboard", icon3d: ICONS_3D.speedometer },
    ],
  },
  {
    key: "ai",
    title: "AI TOOLS",
    titleClass: "text-lux-gold/70",
    titleIcon: <Crown className="h-2.5 w-2.5" />,
    items: [
      { icon: MessageSquare, label: "AI Agent", path: "/agent", premium: true, icon3d: ICONS_3D.aiBot },
      { icon: Globe, label: "Google Rank", path: "/google-rank", premium: true, icon3d: ICONS_3D.magnifyingGlass },
      { icon: Megaphone, label: "AI Ad Creator", path: "/ads", premium: true, icon3d: ICONS_3D.megaphone },
      { icon: Target, label: "Lead Generator", path: "/leads", premium: true, star: true, icon3d: ICONS_3D.targetBullseye },
      { icon: TrendingUp, label: "Revenue & Growth", path: "/revenue", premium: true, icon3d: ICONS_3D.rocket },
      { icon: ShoppingCart, label: "Shopify Optimizer", path: "/shopify", premium: true, star: true, icon3d: ICONS_3D.shoppingCart },
    ],
  },
  {
    key: "intel",
    title: "INTELLIGENCE",
    titleClass: "text-muted-foreground/60",
    items: [
      { icon: Search, label: "Niche Scanner", path: "/scanner", icon3d: ICONS_3D.radar },
      { icon: BarChart3, label: "Market Analytics", path: "/analytics", icon3d: ICONS_3D.analyticsChart },
      { icon: FileText, label: "Reports & Export", path: "/reports", icon3d: ICONS_3D.documentReport },
    ],
  },
  {
    key: "account",
    title: "ACCOUNT",
    titleClass: "text-muted-foreground/60",
    items: [
      { icon: ShoppingCart, label: "Cart", path: "/cart", icon3d: ICONS_3D.shoppingCart },
      { icon: DollarSign, label: "Pricing", path: "/pricing", icon3d: ICONS_3D.diamond },
      { icon: Headphones, label: "Support", path: "/support", icon3d: ICONS_3D.headsetSupport },
      { icon: Settings, label: "Settings", path: "/settings", icon3d: ICONS_3D.gear },
    ],
  },
  {
    key: "partner",
    title: "PARTNER",
    titleClass: "text-emerald-400/60",
    titleIcon: <Handshake className="h-2.5 w-2.5" />,
    items: [
      { icon: Handshake, label: "Partner Dashboard", path: "/partner", icon3d: ICONS_3D.handshake },
    ],
  },
  {
    key: "admin",
    title: "ADMIN",
    titleClass: "text-red-400/60",
    titleIcon: <Shield className="h-2.5 w-2.5" />,
    adminOnly: true,
    items: [
      { icon: Shield, label: "Admin Dashboard", path: "/admin", icon3d: ICONS_3D.shieldVerified },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const COLLAPSED_GROUPS_KEY = "sidebar-collapsed-groups";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-14 w-auto object-contain" />
            <h1 className="text-2xl font-bold tracking-tight text-center">Sign in to continue</h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access the Lux Biz Optimizer platform to audit and optimize your business for AI discovery.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => { window.location.href = "/signin"; }}
              size="lg"
              className="w-full bg-gradient-to-r from-lux-gold to-lux-orange text-black font-semibold hover:opacity-90"
            >
              Sign In
            </Button>
            <Button
              onClick={() => { window.location.href = "/signup"; }}
              size="lg"
              variant="outline"
              className="w-full border-lux-gold/30 text-lux-gold hover:bg-lux-gold/10"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (w: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Collapsible groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(COLLAPSED_GROUPS_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem(COLLAPSED_GROUPS_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  useEffect(() => { if (isCollapsed) setIsResizing(false); }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  /* ─── Render a single nav item ─────────────────────────────────── */
  const renderItem = (item: NavItem) => {
    const isActive = location === item.path;
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setLocation(item.path)}
          tooltip={item.label}
          className="h-8 transition-all font-normal text-[13px]"
        >
          <img src={item.icon3d} alt="" className={`h-4 w-4 object-contain shrink-0 ${isActive ? "" : "opacity-60"}`} />
          <span className="flex items-center gap-1.5 truncate">
            {item.label}
            {item.star && (
              <Star className="h-3 w-3 text-lux-gold fill-lux-gold drop-shadow-[0_0_4px_oklch(0.78_0.14_80)] shrink-0" />
            )}
            {item.premium && !item.star && (
              <Crown className="h-2.5 w-2.5 text-lux-orange shrink-0" />
            )}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  /* ─── Render a collapsible group ───────────────────────────────── */
  const renderGroup = (group: NavGroup) => {
    if (group.adminOnly && user?.role !== "admin") return null;
    const isGroupCollapsed = collapsedGroups.has(group.key);
    // Auto-expand if current page is in this group
    const hasActivePage = group.items.some(i => location === i.path);

    return (
      <div key={group.key} className="px-2 py-0.5">
        {/* Group header - clickable to collapse/expand */}
        <button
          onClick={() => toggleGroup(group.key)}
          className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-accent/30 transition-colors group-data-[collapsible=icon]:hidden"
        >
          <span className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest ${group.titleClass || "text-muted-foreground/60"}`}>
            {group.title}
            {group.titleIcon}
          </span>
          <ChevronDown
            className={`h-3 w-3 text-muted-foreground/40 transition-transform duration-200 ${isGroupCollapsed && !hasActivePage ? "-rotate-90" : ""
              }`}
          />
        </button>
        {/* Items - show if not collapsed OR if active page is in this group */}
        {(!isGroupCollapsed || hasActivePage) && (
          <SidebarMenu className="mt-0.5 space-y-0">
            {group.items.map(renderItem)}
          </SidebarMenu>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r-0" disableTransition={isResizing}>
          <SidebarHeader className="h-14 justify-center shrink-0">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors shrink-0"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed && (
                <div className="flex items-center min-w-0 cursor-pointer" onClick={() => setLocation("/")}>
                  <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-7 w-auto object-contain" />
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 overflow-y-auto overflow-x-hidden">
            {navGroups.map(renderGroup)}
          </SidebarContent>

          <SidebarFooter className="p-2 shrink-0">
            <div className="flex items-center justify-center gap-2 pb-1.5 mb-1.5 border-b border-border/30 group-data-[collapsible=icon]:hidden">
              <img src={LUX_AUTOMATON_LOGO} alt="Lux Automaton" className="h-4 w-auto object-contain opacity-40" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center">
                  <Avatar className="h-7 w-7 border shrink-0">
                    {(user as any)?.photoUrl && (
                      <AvatarImage src={(user as any).photoUrl} alt={user?.name || ""} />
                    )}
                    <AvatarFallback className="text-[10px] font-medium bg-primary/20 text-primary">
                      {user?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-xs font-medium truncate leading-none">{user?.name || user?.email || "User"}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{user?.email || ""}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <img src={LOGO_DARK} alt="Lux Biz Optimizer" className="h-7 w-auto object-contain" />
            </div>
          </div>
        )}
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </>
  );
}
