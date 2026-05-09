import React, { useMemo } from "react";
import { Link } from "wouter";

interface Work {
  id: number;
  tCode: string;
  title: string;
  slug: string;
  rating: number;
  dateCreated: string | null;
  dimensions: string | null;
  disposition: string | null;
  thumbnailUrl: string | null;
}

interface Props {
  works: Work[];
}

const R2_BASE = "https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible/";

export default function CrucibleMasonryGallery({ works }: Props) {
  const processedWorks = useMemo(() => {
    return [...works]
      .map((work) => {
        // --- PASS 1: WEIGHTING SYSTEM ---
        // Score = (Rating Weight) + (Recency Weight) + (Deterministic Jitter)
        const ratingWeight = (work.rating || 1) * 10000;
        
        const dateObj = work.dateCreated ? new Date(work.dateCreated) : new Date("2026-01-01");
        const recencyWeight = dateObj.getTime() / 1000000;

        // Use tCode to create a stable "random" offset so it doesn't jump on every hover,
        // but feels randomized on every fresh load of the data.
        const tNum = parseInt(work.tCode.replace("T_", ""), 10) || 0;
        const jitter = (tNum % 10) * 500; 

        return {
          ...work,
          presenceScore: ratingWeight + recencyWeight + jitter,
        };
      })
      .sort((a, b) => b.presenceScore - a.presenceScore);
  }, [works]);

  return (
    <div className="w-full px-4 sm:px-8 py-12">
      {/* The "Broken Grid": 
        Using CSS columns ensures aspect ratios are 100% preserved. 
        Gaps are created by randomized margins on the items.
      */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        {processedWorks.map((work, idx) => {
          const isKilled = work.disposition === "TR";
          const rating = work.rating || 1;
          
          // --- PASS 2: DYNAMIC SCALING ---
          // Mapping rating to the pre-sized R2 files: lg, md, sm
          let suffix = "_sm.webp";
          let scaleClass = "w-full scale-95 opacity-60"; // 1-2 stars (Ghostly/Small)
          
          if (rating >= 5) {
            suffix = "_lg.webp";
            scaleClass = "w-full scale-100 opacity-100"; // 5 stars (Dominant)
          } else if (rating === 4) {
            suffix = "_md.webp";
            scaleClass = "w-full scale-98 opacity-90";  // 4 stars
          }

          // Deterministic organic spacing (The "Gap" Logic)
          const tNum = parseInt(work.tCode.replace("T_", ""), 10) || 0;
          const marginTop = (tNum % 4) * 20; // Creates 0px to 60px variance

          const padIndex = String(tNum).padStart(3, "0");
          const imgSrc = `${R2_BASE}666${padIndex}_T_${padIndex}${suffix}`;

          return (
            <div 
              key={work.id} 
              className="break-inside-avoid animate-in fade-in duration-1000"
              style={{ marginTop: `${marginTop}px` }}
            >
              <Link href={`/works/${work.slug}`}>
                <div className={`group relative transition-all duration-700 cursor-crosshair ${scaleClass}`}>
                  
                  {/* The Image: Maintains native aspect ratio */}
                  <img
                    src={imgSrc}
                    alt={work.title}
                    loading="lazy"
                    className={`
                      w-full h-auto border border-white/5 
                      transition-all duration-500 
                      group-hover:border-[#00FFCC]/40 group-hover:shadow-[0_0_40px_rgba(0,255,204,0.1)]
                      ${isKilled ? "grayscale sepia brightness-[0.3]" : ""}
                    `}
                    onError={(e) => (e.currentTarget.src = work.thumbnailUrl || "")}
                  />

                  {/* Minimal Abstract Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 flex flex-col justify-end p-6">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-[#00FFCC] mb-2">
                      {work.tCode} // {work.disposition || "LIVE"}
                    </div>
                    <div className="font-serif text-lg text-white/90 leading-none mb-1">
                      {work.title}
                    </div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                      {work.dimensions}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Stochastic "Oracle Static" (Injected empty space blocks) */}
              {idx % 11 === 0 && (
                <div className="h-24 w-full border-l border-white/5 mt-8 opacity-10 flex items-center px-4">
                  <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-white">
                    Null_Space_Entry_{work.tCode}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

