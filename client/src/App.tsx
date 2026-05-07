import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import WorkDetail from "@/pages/WorkDetail";
import CrucibleIntro from "@/pages/CrucibleIntro";
import CruciblePaintings from "@/pages/CruciblePaintings";
import CrucibleMaterials from "@/pages/CrucibleMaterials";
import CrucibleTime from "@/pages/CrucibleTime";
import CrucibleAnatomy from "@/pages/CrucibleAnatomy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/works/:slug" component={WorkDetail} />
      
      {/* Crucible Architecture */}
      <Route path="/crucible" component={CrucibleIntro} />
      <Route path="/crucible/paintings" component={CruciblePaintings} />
      <Route path="/crucible/materials" component={CrucibleMaterials} />
      <Route path="/crucible/time" component={CrucibleTime} />
      <Route path="/crucible/anatomy" component={CrucibleAnatomy} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
