import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Neon from "./pages/Neon";
import Works from "./pages/Works";
import Dashboard from "./pages/Dashboard";
import Archive from "./pages/Archive";
import About from "./pages/About";
import Voices from "./pages/Voices";
import NeonIdentity from "./pages/NeonIdentity";
import Statistics from "./pages/Statistics";
import Commissions from "./pages/Commissions";
import Contact from "./pages/Contact";
import Descent from "./pages/Descent";
import WorkDetail from "./pages/WorkDetail";
import Practice from "./pages/Practice";
import Crucible from "./pages/Crucible";
import CrucibleWorks from "./pages/CrucibleWorks";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWorks from "./pages/admin/AdminWorks";
import AdminPhases from "./pages/admin/AdminPhases";
import AdminEssays from "./pages/admin/AdminEssays";
import AdminMetaquestions from "./pages/admin/AdminMetaquestions";
import AdminArchive from "./pages/admin/AdminArchive";
import Login from "./pages/Login";
import { trpc } from "./lib/trpc";
import { Loader2 } from "lucide-react";
import { useCanonicalUrl } from "./hooks/useCanonicalUrl";

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">ACCESS DENIED</h1>
          <p className="text-muted-foreground font-mono text-sm">ADMIN PRIVILEGES REQUIRED</p>
          <a href="/" className="text-primary underline font-mono text-sm">RETURN TO SITE →</a>
        </div>
      </div>
    );
  }

  return <Component />;
}

function PublicRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        {/* Primary navigation */}
        <Route path="/works" component={Works} />
        <Route path="/works/:slug" component={WorkDetail} />
        <Route path="/practice" component={Practice} />
        <Route path="/crucible" component={CrucibleIntro} />
        <Route path="/crucible/paintings" component={CruciblePaintings} />
<Route path="/crucible/materials" component={CrucibleMaterials} />
<Route path="/crucible/time" component={CrucibleTime} />
<Route path="/crucible/anatomy" component={CrucibleAnatomy} />
        <Route path="/neon" component={Neon} />
        <Route path="/neon/identity" component={NeonIdentity} />
        <Route path="/about" component={About} />
        {/* Secondary or legacy pages, still accessible but not in primary nav */}
        <Route path="/archive" component={Archive} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/commissions" component={Commissions} />
        <Route path="/contact" component={Contact} />
        <Route path="/voices" component={Voices} />
        <Route path="/descent" component={Descent} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin routes */}
      <Route path="/manage">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/manage/works">
        <AdminRoute component={AdminWorks} />
      </Route>
      <Route path="/manage/phases">
        <AdminRoute component={AdminPhases} />
      </Route>
      <Route path="/manage/essays">
        <AdminRoute component={AdminEssays} />
      </Route>
      <Route path="/manage/metaquestions">
        <AdminRoute component={AdminMetaquestions} />
      </Route>
      <Route path="/manage/archive">
        <AdminRoute component={AdminArchive} />
      </Route>
      {/* Login */}
      <Route path="/login" component={Login} />
      {/* Public */}
      <Route>
        <PublicRouter />
      </Route>
    </Switch>
  );
}

function App() {
  useCanonicalUrl();

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
