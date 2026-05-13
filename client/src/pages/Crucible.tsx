import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CrucibleMasonryGallery } from "../components/CrucibleMasonryGallery";
import { Skeleton } from "../components/ui/skeleton";

export default function Crucible() {
  const { data: fetchResult, isLoading, error } = useQuery<any>({
    queryKey: ["/api/works"],
    queryFn: async () => {
      const res = await fetch("/api/works");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }
  });

  const validWorks = useMemo(() => {
    let rawWorks: any[] = [];
    
    // The server router.get("/api/works") returns { data: allWorks, pagination: {...} }
    if (fetchResult && fetchResult.data && Array.isArray(fetchResult.data)) {
      rawWorks = fetchResult.data;
    } else if (Array.isArray(fetchResult)) {
      rawWorks = fetchResult;
    }

    if (rawWorks.length === 0) return [];

    return rawWorks.filter((work) => {
      if (!work || typeof work !== 'object') return false;
      if (work.disposition === "TR") return false;
      try {
        const oracle = work.technicalObservation ? JSON.parse(work.technicalObservation) : null;
        const isProbablyTrash = oracle?.matrix_flags?.is_kill === true;
        const isConfirmedSave = work.disposition === "SA" || oracle?.matrix_flags?.is_save === true;
        if (isProbablyTrash && !isConfirmedSave) return false;
        if ((work.rating || 0) < 2 && !isConfirmedSave) return false;
      } catch (e) {
        return work.disposition !== "TR";
      }
      return true;
    });
  }, [fetchResult]);

  if (isLoading) return <div className="p-8 grid grid-cols-4 gap-4 bg-background min-h-screen">
    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full opacity-5" />)}
  </div>;

  if (error) {
    return (
      <div className="p-24 font-mono text-red-500 bg-background min-h-screen">
        <div>ERROR_FETCH_FAILURE</div>
        <div className="text-xs mt-4 opacity-50">{error instanceof Error ? error.message : String(error)}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <header className="px-8 pt-24 pb-12 border-b border-white/5">
        <h1 className="font-serif text-5xl text-white mb-2">The Archive</h1>
        <div className="flex items-center gap-4">
          <span className="flex h-2 w-2 rounded-full bg-[#00FFCC] animate-pulse" />
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            {validWorks.length} SURVIVORS // LIVE_FEED
          </p>
        </div>
      </header>
      <CrucibleMasonryGallery 
        works={validWorks} 
        bucketUrl="https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible" 
      />
      <footer className="p-24 flex justify-center opacity-10">
        <span className="font-mono text-[8px] tracking-[1em] text-white uppercase">End_Of_Transmission</span>
      </footer>
    </main>
  );
}
// BUILD_SIGNAL: 1778347999
