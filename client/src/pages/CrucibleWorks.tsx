import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface CrucibleWork {
  id: number;
  title: string;
  slug: string;
  phaseId: number;
  imageUrl: string;
  thumbnailUrl: string;
  dimensions: string;
  medium: string;
  dateCreated: string;
}

function getTCodeIndex(slug: string): number {
  return parseInt(slug.replace("T_", ""), 10);
}

function getGlowClasses(slug: string): { resting: string; hover: string } {
  const idx = getTCodeIndex(slug);
  if (idx >= 170) {
    return { resting: "border-fuchsia-500/20", hover: "hover:shadow-fuchsia-500/30" };
  }
  return { resting: "border-cyan-500/20", hover: "hover:shadow-cyan-500/30" };
}

function getGridSpan(index: number): string {
  // No rating data — use position-based sizing for visual variety
  if (index % 7 === 0) return "col-span-1 sm:col-span-2 row-span-2";
  if (index % 5 === 0) return "col-span-1 sm:col-span-2 row-span-1";
  return "col-span-1 row-span-1";
}

export default function CrucibleWorks() {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  const works: CrucibleWork[] = React.useMemo(() => {
    if (!data) return [];
    // API returns { items: [...] }
    const items = (data as any).items || [];
    const filtered = items.filter((w: any) => w.phaseId === 60606);
    // Sort by tCode ascending
    return filtered.sort((a: CrucibleWork, b: CrucibleWork) => {
      return getTCodeIndex(a.slug) - getTCodeIndex(b.slug);
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
      <div className="space-y-6 mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">The Archive</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          A complete index of the Crucible phase. Works are ordered by T-code, with visual weight distributed across the grid.
        </p>
        <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFCC] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFCC]"></span>
          </span>
          <span>LIVE</span>
          <span className="text-muted-foreground/50">|</span>
          <span>{works.length} works displayed</span>
        </div>
      </div>

      {isLoading && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Loading archive...</div>
      )}

      {errorMsg && (
        <div className="font-mono text-xs tracking-widest text-red-400 uppercase">
          Error: {errorMsg}
        </div>
      )}

      {!isLoading && !error && works.length === 0 && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          No works found in this phase.
        </div>
      )}

      {!isLoading && !error && works.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {works.map((work, index) => {
            const glow = getGlowClasses(work.slug);
            const span = getGridSpan(index);
            const src = work.imageUrl || work.thumbnailUrl;
            return (
              <Link key={work.id} href={`/works/${work.slug}`} className={`group relative overflow-hidden rounded-sm border ${glow.resting} ${glow.hover} shadow-none transition-all duration-300 hover:shadow-lg ${span}`}>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
                  <span className="font-mono text-xs tracking-widest text-[#00FFCC] uppercase">{work.title}</span>
                  <span className="font-mono text-xs text-muted-foreground mt-1">{work.dimensions}</span>
                  <span className="font-mono text-xs text-muted-foreground mt-1">{work.slug}</span>
                </div>
                <img src={src} alt={work.title} loading="lazy" className="w-full h-full object-cover" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
