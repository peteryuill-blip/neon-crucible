import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Quote, Loader2 } from "lucide-react";

export default function Press() {
  // Query for featured works (for bio strip thumbnails)
  const { data: featuredWorksData, isLoading: featuredLoading } = trpc.works.list.useQuery({
    featured: true,
    sortBy: "date_newest",
    limit: 6,
    offset: 0,
  });

  const featuredWorks = featuredWorksData?.items || [];

  // Query for press clippings
  const { data: clippings, isLoading: clippingsLoading } = trpc.pressClippings.getAll.useQuery();

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* SECTION 1: Bio Strip with Featured Works Thumbnails */}
      <section className="bio-strip py-6 sm:py-8 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Bio paragraph */}
          <p className="text-sm leading-relaxed max-w-2xl">
            Peter Yuill is a painter based in Bangkok, Thailand, working primarily in ink, gold leaf, and sacred geometry. 
            His practice explores threshold cosmology—the space between order and dissolution. Since 2018, he has catalogued 
            163 paintings across seven distinct phases, from geometric rigor to somatic intuition.
          </p>
          
          {/* Featured works thumbnail strip */}
          {featuredLoading ? (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full aspect-square bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : featuredWorks.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {featuredWorks.slice(0, 6).map((work) => (
                <img 
                  key={work.id}
                  src={work.thumbnailUrl || work.imageUrl || ''} 
                  alt={work.title}
                  className="w-full aspect-square object-cover rounded hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-mono">
              Featured works will appear here once marked in the archive.
            </p>
          )}
        </div>
      </section>

      <Separator className="bg-border" />

      {/* SECTION 2: Press Items (existing press clippings) */}
      <section className="press-items px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-primary">EXTERNAL VOICES</span>
            <h2 className="text-2xl sm:text-3xl font-serif">Press & Commentary</h2>
          </div>

          {/* Press clippings */}
          {clippingsLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-muted rounded w-2/3 mb-3"></div>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </Card>
              ))}
            </div>
          ) : clippings && clippings.length > 0 ? (
            <div className="space-y-6">
              {clippings.map((clipping) => (
                <Card key={clipping.id} className="p-6 hover:border-primary/50 transition-colors">
                  {/* Publication name + date */}
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-mono text-sm text-primary uppercase tracking-wide">{clipping.source}</p>
                    {clipping.date && (
                      <p className="font-mono text-xs text-muted-foreground">{clipping.date}</p>
                    )}
                  </div>
                  
                  {/* Article title */}
                  <h3 className="font-serif text-xl mb-3">{clipping.title}</h3>
                  
                  {/* Excerpt */}
                  {clipping.excerpt && (
                    <div className="relative pl-4 border-l-2 border-muted mb-4">
                      <Quote className="absolute -left-2 -top-1 w-4 h-4 text-muted-foreground/50" />
                      <p className="text-sm leading-relaxed text-muted-foreground font-serif italic">
                        {clipping.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Author */}
                  {clipping.author && (
                    <p className="text-xs text-muted-foreground mb-4">— {clipping.author}</p>
                  )}
                  
                  {/* CTA button */}
                  {clipping.url && (
                    <Button variant="secondary" size="sm" asChild>
                      <a href={clipping.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        Read Article
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </Card>
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
        </div>
      </section>

      {/* SECTION 3: Inquiry Footer */}
      <section className="inquiry-footer py-8 px-4 bg-card text-center border-t border-border">
        <p className="font-mono text-sm text-muted-foreground mb-2">
          For press inquiries:
        </p>
        <a 
          href="mailto:peteryuill@gmail.com" 
          className="text-primary hover:text-secondary transition-colors font-mono text-sm"
        >
          peteryuill@gmail.com
        </a>
      </section>
    </div>
  );
}
