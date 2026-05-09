import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface CrucibleWork {
  id: number;
  title: string;
  slug: string;
  tCode?: string;
  phaseId: number;
  rating?: number;
  kineticHours?: number;
  substrateId?: string;
  imageUrl: string;
  thumbnailUrl: string;
  isKilled?: boolean;
  createdAt: string;
  dateCreated: string;
  dimensions: string;
  medium: string;
}

function getTCode(slug: string): string {
  return slug.startsWith("T_") ? slug : `T_${slug}`;
}

function getTCodeIndex(slug: string): number {
  const code = getTCode(slug);
  return parseInt(code.replace("T_", ""), 10);
}

function getGlowClasses(slug: string): string {
  const idx = getTCodeIndex(slug);
  if (idx >= 170) {
    return "border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20";
  }
  return "border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20";
}

function parseAspectRatio(dimensions: string): number {
  if (!dimensions) return 1;
  const match = dimensions.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return 1;
  const w = parseInt(match[1], 10);
  const h = parseInt(match[2], 10);
  return w / h;
}

function getGridSpan(rating: number, aspectRatio: number): { col: number; row: number } {
  if (rating >= 5) {
    if (aspectRatio < 0.7) return { col: 2, row: 3 };
    if (aspectRatio > 1.4) return { col: 3, row: 2 };
    return { col: 2, row: 2 };
  }
  if (rating >= 4) {
    if (aspectRatio < 0.8) return { col: 1, row: 2 };
    if (aspectRatio > 1.3) return { col: 2, row: 1 };
    return { col: 2, row: 2 };
  }
  if (rating >= 3) {
    if (aspectRatio < 0.75) return { col: 1, row: 2 };
    if (aspectRatio > 1.35) return { col: 2, row: 1 };
    return { col: 1, row: 1 };
  }
  return { col: 1, row: 1 };
}

function getImageUrl(work: CrucibleWork): string {
  const r = work.rating || 1;
  if (r >= 4) return work.imageUrl;
  if (r >= 3) return work.imageUrl;
  return work.thumbnailUrl;
}

export default function CrucibleWorks() {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  const works: CrucibleWork[] = React.useMemo(() => {
    if (!data) return [];
    const items = (data as any).items || [];
    const filtered = items.filter((w: any) => w.phaseId === 60606);
    return filtered.sort((a: CrucibleWork, b: CrucibleWork) => {
      const ratingA = a.rating || 1;
      const ratingB = b.rating || 1;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return getTCodeIndex(b.slug) - getTCodeIndex(a.slug);
    });
  }, [data]);

  const errorMsg = error ? String(error.message || error) : null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </Link>
      </div>
      <div className="space-y-6 mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">The Archive</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          Ordered by rating, then by T-code descending. Higher-rated works command larger positions.
        </p>
        <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFCC] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFCC]"></span>
          </span>
          <span>LIVE</span>
          <span className="text-muted-foreground/50">|</span>
          <span>{works.length} works</span>
        </div>
      </div>

      {isLoading && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Loading archive...</div>
      )}

      {errorMsg && (
        <div className="font-mono text-xs tracking-widest text-red-400 uppercase">Error: {errorMsg}</div>
      )}

      {!isLoading && !error && works.length === 0 && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">No works found.</div>
      )}

      {!isLoading && !error && works.length > 0 && (
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1"
          style={{ gridAutoFlow: "dense", gridAutoRows: "minmax(160px, auto)" }}
        >
          {works.map((work) => {
            const glow = getGlowClasses(work.slug);
            const aspect = parseAspectRatio(work.dimensions);
            const span = getGridSpan(work.rating || 1, aspect);
            const src = getImageUrl(work);
            const isKilled = work.isKilled;
            
            return (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className={`group relative overflow-hidden rounded-sm border ${glow} shadow-none transition-all duration-300 hover:shadow-lg ${isKilled ? 'opacity-40 grayscale' : ''}`}
                style={{
                  gridColumn: `span ${span.col}`,
                  gridRow: `span ${span.row}`,
                }}
              >
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                  <span className="font-mono text-xs tracking-widest text-[#00FFCC] uppercase">{work.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground mt-1">{getTCode(work.slug)}</span>
                  {isKilled && (
                    <span className="font-mono text-[10px] text-red-400 mt-1 uppercase">Killed</span>
                  )}
                </div>
                <img 
                  src={src} 
                  alt={work.title} 
                  loading="lazy" 
                  className="w-full h-full object-cover"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
