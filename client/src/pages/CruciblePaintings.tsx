import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import CrucibleLayout from "@/components/CrucibleLayout";

const CRUCIBLE_PHASE_ID = 60606;

export default function CruciblePaintings() {
  const [search, setSearch] = useState("");
  const { data: galleryData, isLoading } = trpc.gallery.getAll.useQuery({
    phaseId: CRUCIBLE_PHASE_ID,
    search: search || undefined,
    limit: 300,
  });

  const sortedWorks = useMemo(() => {
    if (!galleryData?.items) return [];
    return [...galleryData.items].sort((a, b) => {
      const scoreA = (Number(a.rating || 0) * 1000) + Number(a.sortOrder || 0);
      const scoreB = (Number(b.rating || 0) * 1000) + Number(b.sortOrder || 0);
      return scoreB - scoreA;
    });
  }, [galleryData]);

  const getGridStyles = (rating: number, tCode: string) => {
    const isProduction = parseInt(tCode?.replace("T_", "") || "0") >= 170;
    const accent = isProduction ? "shadow-magenta-500/10" : "shadow-cyan-500/10";
    if (rating >= 5) return `col-span-12 md:col-span-6 row-span-3 shadow-[0_0_50px_-20px_rgba(0,255,204,0.3)] border-cyan-500/20`;
    if (rating >= 4) return `col-span-12 md:col-span-4 row-span-2 ${accent} border-zinc-800`;
    if (rating >= 3) return `col-span-6 md:col-span-3 row-span-2 border-zinc-900`;
    return `col-span-4 md:col-span-2 row-span-1 border-zinc-900/30 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-700`;
  };

  return (
    <CrucibleLayout>
      <div className="max-w-[1600px] mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-900 pb-12">
          <div className="space-y-2">
            <h1 className="text-6xl font-light tracking-tighter text-zinc-100">The <span className="text-cyan-400">Paintings</span></h1>
            <p className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] uppercase">Irreversible Gestures // Chronological Priority Sorting</p>
          </div>
          <input
            type="text"
            placeholder="SEARCH ARCHIVE..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="font-mono text-[10px] bg-transparent border-b border-zinc-800 px-0 py-2 w-full max-w-xs tracking-[0.2em] focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-40"><Loader2 className="w-5 h-5 animate-spin text-cyan-500/50" /></div>
        ) : (
          <div className="grid grid-cols-12 auto-rows-[140px] gap-4 grid-flow-dense">
            {sortedWorks.map((work) => (
              <Link key={work.id} href={`/works/${work.slug || work.id}`}>
                <div className={`group relative overflow-hidden bg-zinc-950 border transition-all duration-1000 cursor-pointer ${getGridStyles(work.rating || 0, work.tCode || "")}`}>
                  <img
                    src={work.rating >= 4 ? work.imageUrl : work.thumbnailUrl}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 font-mono text-[8px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {work.tCode} // {work.sovereignId}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CrucibleLayout>
  );
}
