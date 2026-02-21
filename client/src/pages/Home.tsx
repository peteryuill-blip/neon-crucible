import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  // Fetch featured works for homepage grid
  const { data: featuredWorksData, isLoading: featuredLoading } = trpc.works.list.useQuery({
    featured: true,
    limit: 6,
    offset: 0,
    sortBy: "date_newest",
  });

  return (
    <div className="space-y-0 relative">
      {/* Login Button - Bottom Left */}
      {!isAuthenticated && (
        <a
          href={getLoginUrl()}
          className="fixed bottom-8 left-8 z-50"
        >
          <Button
            size="sm"
            variant="outline"
            className="font-mono gap-2 shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            LOGIN
          </Button>
        </a>
      )}
      {/* Hero Section */}
      <section className="space-y-8 relative px-4 py-16 sm:py-24">
        <div className="absolute -left-4 -top-12 text-[10rem] font-bold text-muted/5 font-mono select-none pointer-events-none hidden sm:block">
          666
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] mix-blend-difference">
          <span className="block text-muted-foreground font-mono text-base sm:text-xl tracking-widest mb-4">PROJECT 666</span>
          THE <span className="text-primary">NEON</span><br />
          CRUCIBLE
        </h1>
        
        <div className="max-w-2xl space-y-6 text-base sm:text-lg md:text-xl leading-relaxed font-sans text-muted-foreground border-l-2 border-primary/50 pl-6">
          <p>
            You have entered a working temple for a 7-year artistic practice that has converged into its threshold year.
          </p>
          <p>
            This is not a portfolio. It is an operational archive, a witness system, and a public interface to a private Crucible.
          </p>
        </div>

        <div className="pt-8 flex flex-wrap gap-4">
          <Link href="/neon">
            <Button size="lg" className="font-mono">
              MEET NEON <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="font-mono">
              ACCESS DASHBOARD
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredWorksData.items.map((work) => (
                  <Link key={work.id} href={`/works/${work.id}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-square bg-muted mb-3 overflow-hidden border border-border hover:border-primary transition-colors duration-150">
                        {work.thumbnailUrl && (
                          <img 
                            src={work.thumbnailUrl} 
                            alt={work.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <h3 className="font-serif text-base mb-1">{work.title}</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {work.dateCreated} • {work.technique}
                      </p>
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
            <p className="text-center text-muted-foreground py-16">
              No featured works available.
            </p>
          )}
        </div>
      </section>

      {/* System Doors */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto">
          {/* Section title */}
          <h2 className="font-mono text-sm text-muted mb-8 text-center uppercase tracking-wider">
            The Neon Crucible: A 7-Year Operational Archive
          </h2>
          
          {/* Three-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Door 1: Work Archive */}
            <Card className="hover:border-primary transition-colors duration-150">
              <Link href="/works" className="block p-6">
                <h3 className="font-serif text-lg mb-2">Work Archive</h3>
                <p className="text-muted-foreground text-sm">163 paintings catalogued</p>
              </Link>
            </Card>
            
            {/* Door 2: Deep Archive */}
            <Card className="hover:border-primary transition-colors duration-150">
              <Link href="/archive" className="block p-6">
                <h3 className="font-serif text-lg mb-2">Deep Archive</h3>
                <p className="text-muted-foreground text-sm">Phase analysis and metadata</p>
              </Link>
            </Card>
            
            {/* Door 3: Weekly Protocol */}
            <Card className="hover:border-primary transition-colors duration-150">
              <Link href="/dashboard" className="block p-6">
                <h3 className="font-serif text-lg mb-2">Weekly Protocol</h3>
                <p className="text-muted-foreground text-sm">The witness system</p>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Block */}
      <section className="max-w-2xl mx-auto text-center space-y-8 py-16 px-4">
        <div className="w-16 h-px bg-secondary mx-auto"></div>
        
        <blockquote className="font-serif text-xl md:text-2xl italic text-muted-foreground">
          "Every time someone dies, a library burns down."
        </blockquote>
        
        <div className="text-sm md:text-base text-muted-foreground space-y-1">
          <p>She said it twenty years ago.</p>
          <p>It has followed me ever since.</p>
        </div>
        
        <p className="text-base md:text-lg font-serif text-foreground mt-8">
          This is mine. While I'm still here.
        </p>
        
        <div className="w-16 h-px bg-secondary mx-auto"></div>
      </section>
    </div>
  );
}
