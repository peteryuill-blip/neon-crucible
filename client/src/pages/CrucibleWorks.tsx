import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface CrucibleWork {
  id: number;
  title: string;
  slug: string;
  tCode: string | null;
  phaseId: number;
  rating: number | null;
  disposition: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  dateCreated: string | null;
  dimensions: string | null;
  medium: string | null;
}

// Tier classes are fully-written strings so Tailwind JIT can detect them.
// Grid: 2 cols mobile / 3 cols tablet / 4 cols desktop.
// Row height: 140px (set on container via gridAutoRows).
//
// 5★ → full-width panoramic, 2 rows tall
// 4★ → half-width block, 2 rows tall  (landscape on desktop, portrait-half on mobile)
// 3★ → half-width strip, 1 row tall
// 1-2★ → quarter-width thumbnail
function getTierClasses(rating: number): string {
  if (rating >= 5) return "col-span-2 sm:col-span-3 md:col-span-4 row-span-2";
  if (rating >= 4) return "col-span-1 sm:col-span-2 md:col-span-2 row-span-2";
  if (rating >= 3) return "col-span-1 sm:col-span-2 md:col-span-2 row-span-1";
  return "col-span-1 row-span-1";
}

function getTNum(work: CrucibleWork): number {
  const code = work.tCode || work.slug;
  return parseInt(code.replace("T_", ""), 10) || 0;
}

function getGlowClasses(work: CrucibleWork): string {
  if (getTNum(work) >= 170) {
    return "border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20";
  }
  return "border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20";
}

function GalleryImage({ work, isLarge }: { work: CrucibleWork; isLarge: boolean }) {
  const base = (work.imageUrl || "").replace(/_full\.jpg$/, "");
  const thumb = work.thumbnailUrl || work.imageUrl || "";
  const full = work.imageUrl || "";

  const sources: string[] = React.useMemo(() => {
    if (!base) return [full];
    if (isLarge) {
      return [`${base}_large.jpg`, `${base}_medium.jpg`, thumb, full].filter(Boolean);
    }
    return [thumb, `${base}_medium.jpg`, full].filter(Boolean);
  }, [base, isLarge, thumb, full]);

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
      return getTNum(b) - getTNum(a);
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
          style={{ gridAutoFlow: "dense", gridAutoRows: "140px" }}
        >
          {works.map((work) => {
            const rating = work.rating ?? 1;
            const tierClasses = getTierClasses(rating);
            const isLarge = rating >= 4;
            const glow = getGlowClasses(work);
            const isKilled = work.disposition === "TR";
            const displayCode = work.tCode || work.slug;

            return (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className={`${tierClasses} group relative overflow-hidden rounded-sm border ${glow} shadow-none transition-all duration-300 hover:shadow-lg${isKilled ? " opacity-40 grayscale" : ""}`}
                style={{ minHeight: "140px" }}
              >
                <GalleryImage work={work} isLarge={isLarge} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                  <span className="font-mono text-xs tracking-widest text-[#00FFCC] uppercase">{work.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground mt-1">{displayCode}</span>
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
