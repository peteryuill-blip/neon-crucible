import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";

interface WorkData {
  id: number;
  title: string;
  slug: string;
  phaseId: number;
  rating?: number;
  imageUrl: string;
  thumbnailUrl: string;
  dimensions: string;
  medium: string;
  dateCreated: string;
  year: string;
  colorPalette?: string | null;
  emotionalRegister?: string | null;
  curatorialHook?: string | null;
  neonReading?: string | null;
  conceptTags?: string[] | null;
  seriesName?: string | null;
  weekNumber?: number | null;
  technique?: string | null;
}

function parseMedium(medium: string): { ink: string; paper: string } {
  if (!medium) return { ink: "", paper: "" };
  const parts = medium.split(" on ");
  if (parts.length >= 2) {
    return { ink: parts[0].trim(), paper: parts.slice(1).join(" on ").trim() };
  }
  return { ink: medium, paper: "" };
}

export default function CrucibleWorkDetail() {
  const slug = window.location.pathname.split("/").pop() || "";
  const { data, isLoading, error } = trpc.gallery.getBySlug.useQuery({ slug });

  const work: WorkData | null = React.useMemo(() => {
    if (!data) return null;
    return (data as any).item || data || null;
  }, [data]);

  const errorMsg = error ? String(error.message || error) : null;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Loading work...</span>
      </div>
    );
  }

  if (errorMsg || !work) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <span className="font-mono text-xs tracking-widest text-red-400 uppercase">
          {errorMsg || "Work not found"}
        </span>
      </div>
    );
  }

  const { ink, paper } = parseMedium(work.medium);

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-16">

      {/* 1. Hero Image */}
      <div className="w-full">
        <img
          src={work.imageUrl}
          alt={work.title}
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </div>

      {/* 2. Phase Tag */}
      <div className="font-mono text-xs tracking-widest uppercase text-[#00FFCC]">
        Crucible
      </div>

      {/* 3. Publication Title + 4. Studio Subtitle */}
      <div className="space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight">
          {work.title}
        </h1>
        <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
          {work.slug}
        </p>
      </div>

      {/* 5–10. Core Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 border-t border-b border-white/10 py-8">
        {/* 5. Date */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Date</span>
          <span className="font-serif text-base text-foreground/90">{work.dateCreated}</span>
        </div>

        {/* 6. Dimensions */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Dimensions</span>
          <span className="font-serif text-base text-foreground/90">{work.dimensions}</span>
        </div>

        {/* 7. Paper */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Paper</span>
          <span className="font-serif text-base text-foreground/90">{paper || "—"}</span>
        </div>

        {/* 8. Ink */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Ink</span>
          <span className="font-serif text-base text-foreground/90">{ink || "—"}</span>
        </div>

        {/* 9. Week */}
        {work.weekNumber !== null && work.weekNumber !== undefined && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Week</span>
            <span className="font-serif text-base text-foreground/90">Week {work.weekNumber}</span>
          </div>
        )}

        {/* 10. Series */}
        {work.seriesName && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block">Series</span>
            <span className="font-serif text-base text-foreground/90">{work.seriesName}</span>
          </div>
        )}
      </div>

      {/* 11. Curatorial Hook */}
      {work.curatorialHook && (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Curatorial Hook</h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/85 pl-4 border-l border-[#00FFCC]/30">
            {work.curatorialHook}
          </p>
        </section>
      )}

      {/* 12. Neon Reading */}
      {work.neonReading && (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Neon Reading</h2>
          <div className="border border-white/10 rounded-sm p-6 sm:p-8">
            <p className="font-serif text-base leading-relaxed text-foreground/80">
              {work.neonReading}
            </p>
          </div>
        </section>
      )}

      {/* 13. Concept Tags */}
      {work.conceptTags && work.conceptTags.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Concept Tags</h2>
          <div className="flex flex-wrap gap-2">
            {work.conceptTags.map((tag) => (
              <span key={tag} className="font-mono text-xs px-3 py-1 border border-white/15 rounded-sm text-foreground/70">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 14. Emotional Register */}
      {work.emotionalRegister && (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Emotional Register</h2>
          <p className="font-mono text-sm text-foreground/70">
            {work.emotionalRegister}
          </p>
        </section>
      )}

      {/* 15. Color Palette */}
      {work.colorPalette && (
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Color Palette</h2>
          <p className="font-mono text-sm text-foreground/70">
            {work.colorPalette}
          </p>
        </section>
      )}

      {/* 16. Back to Works */}
      <div className="pt-8 border-t border-white/10">
        <Link
          href="/crucible/works"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground transition-colors duration-300 hover:text-[#00FFCC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Works
        </Link>
      </div>
    </div>
  );
}
