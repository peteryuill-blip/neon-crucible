import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo } from "react";

interface CrucibleWork {
  id: number;
  tCode: string;
  sovereignId: string;
  title: string;
  slug: string;
  phaseId: number;
  rating: number;
  surface: string;
  surfaceName: string;
  ink: string;
  disposition: string;
  hours: number;
  weekNumber: number;
  orientation: string;
  dimensions: string;
  dateCreated: string;
  medium: string;
  imageUrl: string;
  thumbnailUrl: string;
  curatorialHook: string;
  neonReading: string;
  seriesName: string;
  isPublished: boolean;
}

// Parse "T_249" into 249. Returns -1 on failure so it sorts to the end.
const parseTNumber = (tCode: string): number => {
  const n = parseInt((tCode || "").replace("T_", ""), 10);
  return Number.isFinite(n) ? n : -1;
};

const isProductionPhase = (tCode: string): boolean => parseTNumber(tCode) >= 170;

// Grid footprint by rating. Layout signal only, never rendered as text.
const footprintClass = (rating: number): string => {
  if (rating >= 5) return "col-span-2 row-span-2";
  if (rating === 4) return "col-span-2 row-span-1";
  return "col-span-1 row-span-1";
};

const CrucibleWorks = () => {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery({
    phase: "Crucible",
    sort: "year-desc",
  });

  const sortedWorks = useMemo(() => {
    if (!data?.items) return [] as CrucibleWork[];
    const items = [...data.items] as CrucibleWork[];
    // Rating descending, then T-number ascending within each bucket.
    items.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return parseTNumber(a.tCode) - parseTNumber(b.tCode);
    });
    return items;
  }, [data]);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <Link
          href="/crucible"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-[#00FFCC] transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          The Crucible
        </Link>

        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Section 02 / The Archive
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">
            The Archive
          </h1>
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFCC] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFCC]"></span>
            </span>
            <span>
              {isLoading ? "Loading" : `${sortedWorks.length} works · live`}
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
            Every work made inside the Crucible Year. Sumi ink on Red Star rice
            papers. The grid weights itself by curatorial significance — the
            strongest work occupies the most space.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-[#00FFCC]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="font-mono text-sm text-red-400 py-32 text-center">
            Archive unavailable. {error.message}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && sortedWorks.length === 0 && (
          <div className="font-mono text-sm text-muted-foreground py-32 text-center">
            No works published yet.
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && sortedWorks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[260px] gap-2">
            {sortedWorks.map((work) => {
              const production = isProductionPhase(work.tCode);
              const accent = production ? "#d946ef" : "#00FFCC";
              const useThumb = work.rating <= 2;
              const src = useThumb
                ? work.thumbnailUrl || work.imageUrl
                : work.imageUrl;

              return (
                <Link
                  key={work.id}
                  href={`/works/${work.slug}`}
                  className={`${footprintClass(
                    work.rating
                  )} group relative overflow-hidden bg-neutral-950 transition-transform duration-300 hover:z-10`}
                  style={{
                    boxShadow: `0 0 0 1px ${accent}20`,
                  }}
                >
                  <img
                    src={src}
                    alt={`${work.title} (${work.tCode})`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Phase glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 60px ${accent}40, 0 0 30px ${accent}30`,
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-white/60 mb-1">
                      {work.tCode}
                    </div>
                    <div
                      className="font-serif text-base sm:text-lg leading-tight text-white"
                      style={{ color: accent }}
                    >
                      {work.title}
                    </div>
                    <div className="font-mono text-[10px] tracking-wider uppercase text-white/70 mt-1">
                      {work.dimensions}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!isLoading && !error && sortedWorks.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-8 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#00FFCC" }}
              />
              <span>Warm-Up · T_001–T_169</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#d946ef" }}
              />
              <span>Production · T_170–T_294</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrucibleWorks;
