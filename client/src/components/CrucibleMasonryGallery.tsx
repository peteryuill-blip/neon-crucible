import { useMemo } from "react";
import { Link } from "wouter";

interface Work {
  id: number;
  slug: string;
  title?: string;
  tCode?: string;
  sovereignId?: string;
  phaseId?: number;
  medium?: string | null;
  dimensions?: string | null;
  rating?: number | null;
  disposition?: "SA" | "TR" | "PT" | "SHP" | "UN" | string;
  technicalObservation?: string | null;
  weekNumber?: number | null;
  createdAt?: string | null;
}

interface Props {
  works?: Work[];
  bucketUrl: string;
}

export function CrucibleMasonryGallery({ works = [], bucketUrl }: Props) {
  const processedWorks = useMemo(() => {
    if (!works || !Array.isArray(works)) return [];
    
    return [...works]
      .map((work) => {
        // Fallback for completely empty works
        if (!work) return { id: Math.random(), presenceScore: -1, rating: 1, disposition: "UN" } as any;

        // --- PASS 1: WEIGHTING SYSTEM ---
        const ratingWeight = (work.rating || 1) * 10000;
        
        const dateObj = work.createdAt ? new Date(work.createdAt) : new Date("2026-01-01");
        // Ensure dateObj is valid before calling getTime
        const recencyWeight = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime() / 1000000;

        // Use tCode to create a stable "random" offset safely
        const tCodeSafe = work.tCode || "";
        const tNum = parseInt(tCodeSafe.replace("T_", ""), 10) || 0;
        const jitter = (tNum % 10) * 500; 

        return {
          ...work,
          presenceScore: ratingWeight + recencyWeight + jitter,
        };
      })
      .sort((a, b) => b.presenceScore - a.presenceScore);
  }, [works]);

  if (!processedWorks || processedWorks.length === 0) {
    return <div className="text-white p-8">No archive data found.</div>;
  }

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen text-[#f5f5f5] py-12 px-4 sm:px-8">
      {/* CSS Columns layout logic tailored to requirements */}
      <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-8 space-y-8">
        {processedWorks.map((work) => {
          // Additional safety net for undefined works in map
          if (!work || !work.id) return null;

          const isKilled = work.disposition === "TR";
          const rating = work.rating || 1;

          // Ghost Hole empty rendering check
          if (rating <= 2) {
            return <div key={work.id} aria-hidden="true" className="opacity-0 pointer-events-none" />;
          }

          // Dynamic Sizing Map based on Rating
          let size = "sm";
          if (rating >= 5) size = "lg";
          else if (rating >= 3) size = "md";

          const safeSovId = work.sovereignId || "unknown";
          const safeTCode = work.tCode || "unknown";
          const imgSrc = `${bucketUrl}/${safeSovId}_${safeTCode}_${size}.webp`;
          const safeTitle = work.title || "Untitled";
          const safeSlug = work.slug || safeSovId;

          return (
            <div 
              key={work.id} 
              className="break-inside-avoid relative group cursor-crosshair overflow-hidden rounded bg-[#171717]"
            >
              <Link href={`/work/${safeSlug}`}>
                <div className="w-full h-auto transition-all duration-700 block">
                  <img
                    src={imgSrc}
                    alt={safeTitle}
                    loading="lazy"
                    className={`
                      w-full h-auto object-contain transition-all duration-500
                      ${isKilled ? "grayscale sepia brightness-[0.3]" : ""}
                      hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]
                    `}
                  />

                  {/* Overlay Info */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 flex flex-col justify-end p-6">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-[#22d3ee] mb-2 flex items-center justify-between">
                      <span>{work.tCode} // {work.disposition}</span>
                      {rating >= 5 && <span className="text-[#4ade80]">SOVEREIGN</span>}
                      {isKilled && <span className="text-[#ef4444]">TERMINATED</span>}
                    </div>
                    <div className="font-serif text-lg text-white/90 leading-none mb-1">
                      {safeTitle}
                    </div>
                    <div className="font-mono text-[9px] text-[#06b6d4] uppercase tracking-widest mt-1">
                      {work.dimensions || "N/A"} | {work.medium || "N/A"}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
