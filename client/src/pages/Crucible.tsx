import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CrucibleMasonryGallery from "../components/CrucibleMasonryGallery";
import { Skeleton } from "../components/ui/skeleton";

export default function Crucible() {
  const { data: allWorks, isLoading, error } = useQuery<any[]>({
    queryKey: ["/api/works/phase/60606"],
  });

  const validWorks = useMemo(() => {
    if (!allWorks) return [];
    return allWorks.filter((work) => {
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
  }, [allWorks]);

  if (isLoading) return <div className="p-8 grid grid-cols-4 gap-4 bg-background min-h-screen">
    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full opacity-5" />)}
  </div>;

  if (error) return <div className="p-24 font-mono text-red-500 bg-background min-h-screen">ERROR_FETCH_FAILURE</div>;

  return (
    <main className="min-h-screen bg-background">
      <header className="px-8 pt-24 pb-12 border-b border-white/5">
        <h1 className="font-serif text-5xl text-white mb-2">The Archive</h1>
        <div className="flex items-center gap-4">
          <span className="flex h-2 w-2 rounded-full bg-[#00FFCC] animate-pulse" />
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            {validWorks.length} SURVIVORS // PHASE_60606 // LIVE_FEED
          </p>
        </div>
      </header>
      <CrucibleMasonryGallery works={validWorks} />
      <footer className="p-24 flex justify-center opacity-10">
        <span className="font-mono text-[8px] tracking-[1em] text-white uppercase">End_Of_Transmission</span>
      </footer>
    </main>
  );
}
