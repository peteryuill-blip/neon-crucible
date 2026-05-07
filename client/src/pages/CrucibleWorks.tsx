import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CrucibleWorks() {
  const [search, setSearch] = useState("");

  const filter = useMemo(() => ({
    phase: "Crucible",
    search: search || undefined,
    sort: "year-desc" as const,
  }), [search]);

  const { data: galleryData, isLoading } = trpc.gallery.getAll.useQuery(filter);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-10">
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex items-center gap-3">
          <Link href="/crucible">
            <span className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              ← THE CRUCIBLE
            </span>
          </Link>
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter">
          The <span className="text-primary">Archive</span>
        </h1>
        <p className="font-serif text-lg text-muted-foreground max-w-2xl">
          Every saved work from the Crucible Year. Ordered newest first.
          Each one irreversible. Each one catalogued.
        </p>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            {galleryData?.total ?? "—"} WORKS IN ARCHIVE
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] text-primary/70 tracking-widest">LIVE</span>
          </div>
        </div>
      </header>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="SEARCH ARCHIVE..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="font-mono text-xs bg-background border border-border px-4 py-2 w-full max-w-sm tracking-widest placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : galleryData?.items && galleryData.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {galleryData.items.map((work) => (
            <Link key={work.id} href={`/works/${work.slug || work.id}`}>
              <div className="group cursor-pointer bg-background">
                <div className="w-full overflow-hidden aspect-video bg-card/30">
                  {work.thumbnailUrl ? (
                    <img
                      src={work.thumbnailUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-[10px] text-muted-foreground/30">{work.slug}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1 border-t border-border/50">
                  <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                    {work.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/60">
                    {work.dateCreated} · {work.dimensions}
                  </p>
                  {work.medium && (
                    <p className="font-mono text-[10px] text-muted-foreground/40 truncate">
                      {work.medium}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border/50 p-16 text-center">
          <p className="font-mono text-xs text-muted-foreground/50">
            {search ? "NO WORKS MATCH YOUR SEARCH" : "NO WORKS IN ARCHIVE YET"}
          </p>
        </div>
      )}
    </div>
  );
}
