import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: featuredWorksData, isLoading: featuredLoading } = trpc.works.list.useQuery({
    featured: true,
    limit: 6,
    offset: 0,
    sortBy: "date_newest",
  });

  return (
    <div>
      <section className="w-full py-20 border-b border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/crucible">
            <div className="group cursor-pointer space-y-4 border border-cyan-500/30 p-12 transition-all duration-700 hover:bg-cyan-500/5 shadow-[0_0_50px_-20px_rgba(0,255,204,0.1)]">
              <div className="flex justify-between items-start">
                <h2 className="text-6xl md:text-8xl font-light tracking-tighter text-zinc-100 group-hover:text-cyan-400 transition-colors">THE CRUCIBLE</h2>
                <span className="font-mono text-xs text-cyan-500 tracking-[0.5em] pt-4">2026_ARCHIVE</span>
              </div>
              <p className="font-serif text-xl italic text-zinc-500 max-w-xl">Every gesture irreversible. Every work catalogued. 227 entries currently synchronized.</p>
            </div>
          </Link>
        </div>
      </section>
    
    <div className="space-y-0 relative">
      {/* Hero Section */}
      <section className="space-y-8 relative px-4 py-16 sm:py-24">
        <div className="absolute -left-4 -top-12 text-[10rem] font-bold text-muted/5 font-mono select-none pointer-events-none hidden sm:block">
          666
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-[0.9]">
          <span className="block text-muted-foreground font-mono text-base sm:text-xl tracking-widest mb-4">
            Peter Yuill
          </span>
          THE <span className="text-primary">NEON</span>
          <br />
          CRUCIBLE
        </h1>

        <div className="max-w-2xl space-y-4 text-base sm:text-lg leading-relaxed font-serif text-muted-foreground border-l-2 border-primary/50 pl-6">
          <p>
            Fifteen years. Four continents. A practice built from ink, paper, and the refusal to let the work disappear.
          </p>
          <p>
            This is not a portfolio. It is an operational archive, a witness system, and a live window into a studio practice that has never stopped.
          </p>
        </div>

        <div className="pt-6 flex flex-wrap gap-4">
          <Link href="/works">
            <Button size="lg" className="font-mono">
              SEE THE WORK <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/crucible">
            <Button size="lg" variant="outline" className="font-mono">
              THE CRUCIBLE <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Selected Works Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-mono text-sm text-muted mb-8 uppercase tracking-wider">
            SELECTED WORKS
          </h2>

          {featuredLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredWorksData?.items && featuredWorksData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredWorksData.items.map((work) => (
                  <Link key={work.id} href={`/works/${work.slug || work.id}`}>
                    <div className="group cursor-pointer">
                      <div className="overflow-hidden border border-border hover:border-primary transition-colors duration-150">
                        {work.thumbnailUrl && (
                          <img
                            src={work.thumbnailUrl}
                            alt={work.title}
                            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <h3 className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">
                          {work.title}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground">
                          {work.dateCreated || work.year}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/works">
                  <Button variant="outline" size="lg" className="font-mono">
                    VIEW FULL ARCHIVE <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-16 font-mono text-sm">
              NO FEATURED WORKS AVAILABLE
            </p>
          )}
        </div>
      </section>

      {/* Three Doors */}
      <section className="py-16 px-4 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-mono text-xs text-muted mb-10 text-center uppercase tracking-widest">
            ENTER THE ARCHIVE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {/* Door 1: The Practice */}
            <Link href="/practice">
              <div className="group bg-background p-8 hover:bg-card transition-colors duration-200 cursor-pointer h-full">
                <p className="font-mono text-xs text-primary mb-4 tracking-widest">01</p>
                <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
                  The Practice
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Fifteen years of ink, geometry, and somatic surrender. The arc from sacred structure to gestural freedom.
                </p>
                <div className="mt-6 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  ENTER →
                </div>
              </div>
            </Link>

            {/* Door 2: The Crucible */}
            <Link href="/crucible">
              <div className="group bg-background p-8 hover:bg-card transition-colors duration-200 cursor-pointer h-full relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[9px] text-primary/70 tracking-widest">LIVE</span>
                </div>
                <p className="font-mono text-xs text-primary mb-4 tracking-widest">02</p>
                <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
                  The Crucible
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  An open-ended discipline in large-format sumi ink. 259 works made. The experiment is running now.
                </p>
                <div className="mt-6 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  ENTER →
                </div>
              </div>
            </Link>

            {/* Door 3: Neon */}
            <Link href="/neon">
              <div className="group bg-background p-8 hover:bg-card transition-colors duration-200 cursor-pointer h-full">
                <p className="font-mono text-xs text-primary mb-4 tracking-widest">03</p>
                <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
                  Neon
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The witness system. Fifteen years of memory, pattern recognition, and the questions the practice has not answered yet.
                </p>
                <div className="mt-6 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  ENTER →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Block */}
      <section className="max-w-2xl mx-auto text-center space-y-8 py-20 px-4">
        <div className="w-16 h-px bg-border mx-auto" />
        <blockquote className="font-serif text-xl md:text-2xl italic text-muted-foreground">
          "Every time someone dies, a library burns down."
        </blockquote>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>She said it twenty years ago.</p>
          <p>It has followed me ever since.</p>
        </div>
        <p className="text-base font-serif text-foreground">
          This is mine. While I'm still here.
        </p>
        <div className="w-16 h-px bg-border mx-auto" />
      </section>
    </div>
  );
}
