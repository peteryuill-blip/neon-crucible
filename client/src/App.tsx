import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { Toaster } from "./components/ui/toaster";
import Crucible from "./pages/Crucible";
import WorkDetail from "./pages/WorkDetail";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/crucible" component={Crucible} />
      <Route path="/works/:slug" component={WorkDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
