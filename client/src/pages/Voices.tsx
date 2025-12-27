import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Quote } from "lucide-react";

export default function Voices() {
  const { data: clippings, isLoading } = trpc.pressClippings.getAll.useQuery();

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* Header */}
      <section className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-primary">EXTERNAL VOICES</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What Others Have Written
          </h1>
        </div>
        
        <p className="max-w-2xl text-sm sm:text-lg text-muted-foreground font-serif leading-relaxed">
          Collected observations from critics, curators, and publications who have encountered the work. 
          These fragments exist not as validation, but as documentation of the practice's passage through the world.
        </p>
      </section>

      <Separator className="bg-border" />

      {/* Clippings Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-3 sm:space-y-4 p-4 sm:p-6 border border-border">
              <div className="h-3 sm:h-4 bg-muted rounded w-1/3"></div>
              <div className="h-16 sm:h-20 bg-muted rounded"></div>
              <div className="h-2 sm:h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : clippings && clippings.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          {clippings.map((clipping) => (
            <a
              key={clipping.id}
              href={clipping.url || "#"}
              target={clipping.url ? "_blank" : undefined}
              rel={clipping.url ? "noopener noreferrer" : undefined}
              className="group block"
            >
              <article 
                className="h-full p-4 sm:p-6 border border-border hover:border-primary/50 hover:bg-muted/5 transition-all duration-300 space-y-3 sm:space-y-4 bg-card cursor-pointer"
              >
                {/* Source & Date */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] sm:text-xs tracking-widest text-primary uppercase truncate">
                    {clipping.source}
                  </span>
                  {clipping.date && (
                    <span className="font-mono text-[10px] sm:text-xs text-muted-foreground shrink-0">
                      {clipping.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-medium leading-snug group-hover:text-primary transition-colors">
                  {clipping.title}
                </h3>

                {/* Excerpt */}
                {clipping.excerpt && (
                  <div className="relative pl-3 sm:pl-4 border-l-2 border-muted group-hover:border-primary/30 transition-colors">
                    <Quote className="absolute -left-1.5 sm:-left-2 -top-0.5 sm:-top-1 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/50" />
                    <p className="text-xs sm:text-sm text-muted-foreground font-serif italic leading-relaxed line-clamp-4 sm:line-clamp-none">
                      {clipping.excerpt}
                    </p>
                  </div>
                )}

                {/* Author & Link Indicator */}
                <div className="flex items-center justify-between pt-1 sm:pt-2 gap-2">
                  {clipping.author && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      — {clipping.author}
                    </span>
                  )}
                  {clipping.url && (
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                      <span className="hidden sm:inline">Read Article</span>
                      <span className="sm:hidden">Read</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </span>
                  )}
                </div>
              </article>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 space-y-3 sm:space-y-4">
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            No press clippings have been added yet.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground/50">
            External voices will appear here as they are collected.
          </p>
        </div>
      )}

      {/* Footer Note */}
      <section className="pt-6 sm:pt-8">
        <div className="p-4 sm:p-6 border border-border bg-card/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-mono leading-relaxed">
            These excerpts are presented as historical documentation. The practice exists independent of external commentary. 
            For press inquiries: peteryuill@gmail.com
          </p>
        </div>
      </section>
    </div>
  );
}
