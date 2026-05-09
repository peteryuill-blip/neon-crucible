import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface CrucibleWork {
  id: number;
  title: string;
  slug: string;
  phaseId: number;
  rating?: number;
  imageUrl: string;
  thumbnailUrl: string;
  isKilled?: boolean;
  dateCreated: string;
  dimensions: string;
  medium: string;
}

function getTCode(slug: string): string {
  return slug.startsWith("T_") ? slug : `T_${slug}`;
}

function getGlowClasses(slug: string): string {
  const idx = parseInt(slug.replace("T_", ""), 10);
  if (idx >= 170) {
    return "border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20";
  }
  return "border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20";
}

// 3-tier size system: Small (1x1), Medium (2x1), Large (2x2)
type SizeTier = { col: number; row: number };
const SIZE_PATTERN: SizeTier[] = [
  { col: 1, row: 1 }, // small
  { col: 1, row: 1 }, // small
  { col: 2, row: 1 }, // medium-wide
  { col: 1, row: 1 }, // small
  { col: 1, row: 2 }, // medium-tall
  { col: 1, row: 1 }, // small
  { col: 1, row: 1 }, // small
  { col: 2, row: 2 }, // large
  { col: 1, row: 1 }, // small
  { col: 2, row: 1 }, // medium-wide
  { col: 1, row: 1 }, // small
  { col: 1, row: 1 }, // small
];

function getSizeTier(index: number, rating: number): SizeTier {
  // If rating exists and varies, use it to boost size
  if (rating >= 5) return { col: 2, row: 2 };
  if (rating >= 4) return { col: 2, row: 1 };
  // Otherwise cycle through pattern for visual variety
  return SIZE_PATTERN[index % SIZE_PATTERN.length];
}

function getImageUrl(work: CrucibleWork, tier: SizeTier): string {
  const base = work.imageUrl.replace("_full.jpg", "");
  if (tier.col >= 2 && tier.row >= 2) return work.imageUrl; // full for large
  if (tier.col >= 2 || tier.row >= 2) return base + "_large.jpg";
  return work.thumbnailUrl; // thumb for small
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
      return parseInt(b.slug.replace("T_", ""), 10) - parseInt(a.slug.replace("T_", ""), 10);
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1"
          style={{ gridAutoFlow: "dense", gridAutoRows: "200px" }}
        >
          {works.map((work, index) => {
            const glow = getGlowClasses(work.slug);
            const tier = getSizeTier(index, work.rating || 1);
            const src = getImageUrl(work, tier);
            const isKilled = work.isKilled;
            
            return (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className={`group relative overflow-hidden rounded-sm border ${glow} shadow-none transition-all duration-300 hover:shadow-lg ${isKilled ? 'opacity-40 grayscale' : ''}`}
                style={{
                  gridColumn: `span ${tier.col}`,
                  gridRow: `span ${tier.row}`,
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
