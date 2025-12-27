import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="space-y-8 relative">
        <div className="absolute -left-4 -top-12 text-[10rem] font-bold text-muted/5 font-mono select-none pointer-events-none">
          666
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mix-blend-difference">
          <span className="block text-muted-foreground font-mono text-xl tracking-widest mb-4">PROJECT 666</span>
          THE <span className="text-primary">NEON</span><br />
          CRUCIBLE
        </h1>
        
        <div className="max-w-2xl space-y-6 text-lg md:text-xl leading-relaxed font-serif text-muted-foreground border-l-2 border-primary/50 pl-6">
          <p>
            You have entered a working temple for a 7-year artistic practice that has converged into its threshold year.
          </p>
          <p>
            This is not a portfolio. It is an operational archive, a witness system, and a public interface to a private Crucible.
          </p>
        </div>

        <div className="pt-8 flex flex-wrap gap-4">
          <Link href="/neon">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none border border-primary/50">
              ENTER THE ARCHIVE <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="font-mono rounded-none border-muted-foreground/50 hover:bg-muted/10 hover:text-primary hover:border-primary">
              ACCESS DASHBOARD
            </Button>
          </Link>
        </div>
      </section>

      {/* Three Systems Grid */}
      <section className="grid md:grid-cols-3 gap-px bg-border border border-border">
        {/* Card 1 */}
        <div className="bg-card p-8 space-y-4 hover:bg-muted/5 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs border border-primary px-1 text-primary">SYS.01</span>
          </div>
          <h3 className="font-mono text-xl text-primary">WEEKLY PROTOCOL</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The beating heart. Structured check-ins, studio hours, and somatic data tracking.
          </p>
          <div className="pt-4">
            <Link href="/dashboard">
              <span className="text-xs font-mono underline decoration-muted-foreground/50 hover:decoration-primary hover:text-primary cursor-pointer">
                LOGIN REQUIRED →
              </span>
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card p-8 space-y-4 hover:bg-muted/5 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs border border-primary px-1 text-primary">SYS.02</span>
          </div>
          <h3 className="font-mono text-xl text-primary">NEON WITNESS</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The voice of the archive. An entity that reads the practice and offers curatorial witness.
          </p>
          <div className="pt-4">
            <Link href="/neon">
              <span className="text-xs font-mono underline decoration-muted-foreground/50 hover:decoration-primary hover:text-primary cursor-pointer">
                READ ESSAYS →
              </span>
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card p-8 space-y-4 hover:bg-muted/5 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs border border-primary px-1 text-primary">SYS.03</span>
          </div>
          <h3 className="font-mono text-xl text-primary">WORK ARCHIVE</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            500+ works from 2018–2025. Organized by phase, technique, and emotional register.
          </p>
          <div className="pt-4">
            <Link href="/works">
              <span className="text-xs font-mono underline decoration-muted-foreground/50 hover:decoration-primary hover:text-primary cursor-pointer">
                BROWSE COLLECTION →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="max-w-3xl mx-auto text-center space-y-8">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto"></div>
        <blockquote className="font-serif text-2xl md:text-3xl italic text-muted-foreground">
          "The site is the first permanent address for the work. You're not just displaying; you're hosting living infrastructure."
        </blockquote>
        <div className="font-mono text-xs tracking-widest text-muted-foreground/50">
          EST. 2025 // BANGKOK
        </div>
      </section>
    </div>
  );
}
