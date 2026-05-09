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

type SizeTier = { col: number; row: number };

function getSizeTier(rating: number): SizeTier {
  if (rating >= 5) return { col: 2, row: 2 };
  if (rating >= 4) return { col: 2, row: 1 };
  if (rating >= 3) return { col: 1, row: 2 };
  return { col: 1, row: 1 };
}

function getGlowClasses(slug: string): string {
  const idx = parseInt(slug.replace("T_", ""), 10);
  if (idx >= 170) {
    return "border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20";
  }
  return "border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20";
}

function getTCode(slug: string): string {
  return slug.startsWith("T_") ? slug : `T_${slug}`;
}

function GalleryImage({ work, tier }: { work: CrucibleWork; tier: SizeTier }) {
  const base = work.imageUrl.replace(/_full\.jpg$/, "");
  const isLarge = tier.col >= 2 || tier.row >= 2;

  const sources = React.useMemo((): string[] => {
    if (isLarge) {
      return [`${base}_large.jpg`, `${base}_medium.jpg`, work.thumbnailUrl, work.imageUrl];
    }
    return [work.thumbnailUrl, `${base}_medium.jpg`, `${base}_large.jpg`, work.imageUrl];
  }, [base, isLarge, work.thumbnailUrl, work.imageUrl]);

  const [srcIndex, setSrcIndex] = React.useState(0);

  return (
    <img
      src={sources[srcIndex]}
      alt={work.title}
      loading="lazy"
      className="w-full h-full object-cover"
      onError={() => setSrcIndex((i) => Math.min(i + 1, sources.length - 1))}
    />
  );
}

export default function CrucibleWorks() {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  const works: CrucibleWork[] = React.useMemo(() => {
    if (!data) return [];
    const items = (data as any).items || [];
    const filtered = items.filter((w: any) => w.phaseId === 60606);
    return filtered.sort((a: CrucibleWork, b: CrucibleWork) => {
      const ratingA = a.rating ?? 1;
      const ratingB = b.rating ?? 1;
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
          style={{ gridAutoFlow: "dense", gridAutoRows: "150px" }}
        >
          {works.map((work) => {
            const rating = work.rating ?? 1;
            const tier = getSizeTier(rating);
            const glow = getGlowClasses(work.slug);
            const isKilled = work.isKilled;

            return (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className={`group relative overflow-hidden rounded-sm border ${glow} shadow-none transition-all duration-300 hover:shadow-lg${isKilled ? " opacity-40 grayscale" : ""}`}
                style={{
                  gridColumn: `span ${tier.col}`,
                  gridRow: `span ${tier.row}`,
                  minHeight: "150px",
                }}
              >
                <GalleryImage work={work} tier={tier} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                  <span className="font-mono text-xs tracking-widest text-[#00FFCC] uppercase">{work.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground mt-1">{getTCode(work.slug)}</span>
                  {isKilled && (
                    <span className="font-mono text-[10px] text-red-400 mt-1 uppercase">Killed</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
