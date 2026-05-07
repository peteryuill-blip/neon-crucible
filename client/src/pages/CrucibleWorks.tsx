import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const CRUCIBLE_PHASE_ID = 60606;

export default function CrucibleWorks() {
  const [search, setSearch] = useState("");

  const { data: galleryData, isLoading } = trpc.gallery.getAll.useQuery({
    phaseId: CRUCIBLE_PHASE_ID,
    search: search || undefined,
    limit: 300,
  });

  // Weighted Sorting: Best works first, then chronological within ratings
  const sortedWorks = useMemo(() => {
    if (!galleryData?.items) return [];
    return [...galleryData.items].sort((a, b) => {
      const scoreA = (Number(a.rating || 0) * 1000) + Number(a.sortOrder || 0);
      const scoreB = (Number(b.rating || 0) * 1000) + Number(b.sortOrder || 0);
      return scoreB - scoreA;
    });
  }, [galleryData]);

  const getGridStyles = (rating: number, tCode: string) => {
    // T_170 is the Production inflection point for magenta accents
    const isProduction = parseInt(tCode?.replace("T_", "") || "0") >= 170;
    const accentColor = isProduction ? "shadow-magenta-500/20" : "shadow-cyan-500/20";
    const borderColor = isProduction ? "hover:border-magenta-500/50" : "hover:border-cyan-500/50";

    if (rating >= 5) return `col-span-12 md:col-span-6 row-span-3 shadow-[0_0_40px_-15px_rgba(0,255,204,0.3)] border-cyan-500/20 ${borderColor}`;
    if (rating >= 4) return `col-span-12 md:col-span-4 row-span-2 ${accentColor} border-zinc-800 ${borderColor}`;
    if (rating >= 3) return `col-span-6 md:col-span-3 row-span-2 border-zinc-900 ${borderColor}`;
    return `col-span-4 md:col-span-2 row-span-1 border-zinc-900/50 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 ${borderColor}`;
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto py-12 px-6 space-y-16">
        <header className="space-y-6 border-b border-zinc-900 pb-12">
          <div className="flex items-center justify-between">
            <Link href="/crucible">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase cursor-pointer hover:text-cyan-400 transition-colors">
                ← Return to Crucible
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-magenta-500 animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-600">Oracle V7.0 Active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-light tracking-tighter text-zinc-100">
              The <span className="text-cyan-400">Archive</span>
            </h1>
            <p className="font-serif text-lg italic text-zinc-500 max-w-2xl">
              227 works synchronized. Irreversible gestures mapped by quality drift and temporal inflection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="SEARCH BY ID OR SUBSTRATE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="font-mono text-[10px] bg-transparent border-b border-zinc-800 px-0 py-2 w-full max-w-xs tracking-[0.2em] placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            <span className="font-mono text-[10px] text-zinc-600">
              {galleryData?.total ?? "—"} ENTRIES // PHASE_60606
            </span>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-500/50" />
          </div>
        ) : (
          <div className="grid grid-cols-12 auto-rows-[120px] gap-4 grid-flow-dense pb-40">
            {sortedWorks.map((work) => {
              const styles = getGridStyles(work.rating || 0, work.tCode || "");
              return (
                <Link key={work.id} href={`/works/${work.slug || work.id}`}>
                  <div className={`group relative overflow-hidden bg-zinc-950 border transition-all duration-1000 cursor-pointer ${styles}`}>
                    {/* The Image Layer */}
                    <img
                      src={work.rating >= 4 ? work.imageUrl : work.thumbnailUrl}
                      alt={work.title}
                      className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                      loading="lazy"
                    />

                    {/* HUD Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                      <div className="space-y-1">
                        <p className="font-mono text-[9px] tracking-widest text-cyan-400">
                          ID_{work.tCode} // {work.sovereignId}
                        </p>
                        <p className="font-mono text-[8px] text-zinc-500 uppercase">
                          {work.surface} · {work.dimensions}
                        </p>
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400">
                        {"★".repeat(work.rating || 0)}
                      </div>
                    </div>

                    {/* Underglow accent line */}
                    <div className={`absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-1000 
                      ${parseInt(work.tCode?.replace("T_", "") || "0") >= 170 ? 'bg-magenta-500' : 'bg-cyan-500'}`} 
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
