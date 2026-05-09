import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./";
import { Toaster } from "./";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
