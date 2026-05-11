import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import Crucible from "@/pages/Crucible";
import WorkDetail from "@/pages/WorkDetail";
import NotFound from "@/pages/NotFound";
import { useState } from "react";

export default function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={Crucible} />
          <Route path="/work/:slug" component={WorkDetail} />
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
