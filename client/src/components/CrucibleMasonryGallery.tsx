import { useMemo } from "react";
import { Link } from "wouter";

interface Work {
  id: number;
  slug: string;
  title: string;
  tCode: string;
  sovereignId: string;
  phaseId: number;
  medium: string | null;
  dimensions: string | null;
  rating: number | null;
  disposition: "SA" | "TR" | "PT" | "SHP" | "UN" | string;
  technicalObservation: string | null;
  weekNumber: number | null;
  createdAt: string | null;
}

interface Props {
  works: Work[];
  bucketUrl: string;
}

export function CrucibleMasonryGallery({ works, bucketUrl }: Props) {
  const processedWorks = useMemo(() => {
    return [...works]
      .map((work) => {
        // --- PASS 1: WEIGHTING SYSTEM ---
        const ratingWeight = (work.rating || 1) * 10000;
        
        const dateObj = work.createdAt ? new Date(work.createdAt) : new Date("2026-01-01");
        const recencyWeight = dateObj.getTime() / 1000000;

        // Use tCode to create a stable "random" offset
        const tNum = parseInt((work.tCode || "").replace("T_", ""), 10) || 0;
        const jitter = (tNum % 10) * 500; 

        return {
          ...work,
          presenceScore: ratingWeight + recencyWeight + jitter,
        };
      })
      .sort((a, b) => b.presenceScore - a.presenceScore);
  }, [works]);

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen text-[#f5f5f5] py-12 px-4 sm:px-8">
      {/* CSS Columns layout logic tailored to requirements */}
      <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-8 space-y-8">
        {processedWorks.map((work) => {
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

          const imgSrc = `${bucketUrl}/${work.sovereignId}_${work.tCode}_${size}.webp`;

          return (
            <div 
              key={work.id} 
              className="break-inside-avoid relative group cursor-crosshair overflow-hidden rounded bg-[#171717]"
            >
              <Link href={`/work/${work.slug}`}>
                <div className="w-full h-auto transition-all duration-700">
                  <img
                    src={imgSrc}
                    alt={work.title}
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
                      {work.title}
                    </div>
                    <div className="font-mono text-[9px] text-[#06b6d4] uppercase tracking-widest mt-1">
                      {work.dimensions} | {work.medium}
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
