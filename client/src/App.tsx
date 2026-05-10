import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import Crucible from "@/pages/Crucible";
import WorkDetail from "@/pages/WorkDetail";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Crucible} />
        <Route path="/work/:slug" component={WorkDetail} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}
