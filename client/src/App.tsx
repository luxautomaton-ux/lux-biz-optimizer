import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuditResults from "./pages/AuditResults";
import Scanner from "./pages/Scanner";
import MarketAnalytics from "./pages/MarketAnalytics";
import AgentChat from "./pages/AgentChat";
import Reports from "./pages/Reports";
import Pricing from "./pages/Pricing";
import PartnerDashboard from "./pages/PartnerDashboard";
import Settings from "./pages/Settings";
import CompanyProfile from "./pages/CompanyProfile";
import Cart from "./pages/Cart";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import LeadGenerator from "./pages/LeadGenerator";
import Admin from "./pages/Admin";
import About from "./pages/About";
import AdCreator from "./pages/AdCreator";
import GoogleRankOptimizer from "./pages/GoogleRankOptimizer";
import RevenueGrowth from "./pages/RevenueGrowth";
import TermsOfService from "./pages/TermsOfService";
import PrivacyNotice from "./pages/PrivacyNotice";
import FAQ from "./pages/FAQ";
import CookiePolicy from "./pages/CookiePolicy";
import DataSecurity from "./pages/DataSecurity";
import AcceptableUse from "./pages/AcceptableUse";
import ShopifyOptimizer from "./pages/ShopifyOptimizer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/audit/:id" component={AuditResults} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/analytics" component={MarketAnalytics} />
      <Route path="/agent" component={AgentChat} />
      <Route path="/reports" component={Reports} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/partner" component={PartnerDashboard} />
      <Route path="/settings" component={Settings} />
      <Route path="/company/new" component={CompanyProfile} />
      <Route path="/company/:id" component={CompanyProfile} />
      <Route path="/cart" component={Cart} />
      <Route path="/leads" component={LeadGenerator} />
      <Route path="/admin" component={Admin} />
      <Route path="/about" component={About} />
      <Route path="/ads" component={AdCreator} />
      <Route path="/google-rank" component={GoogleRankOptimizer} />
      <Route path="/revenue" component={RevenueGrowth} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyNotice} />
      <Route path="/faq" component={FAQ} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/security" component={DataSecurity} />
      <Route path="/acceptable-use" component={AcceptableUse} />
      <Route path="/shopify" component={ShopifyOptimizer} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
