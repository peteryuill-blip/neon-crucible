import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="space-y-6 sm:space-y-8 relative">
        <div className="absolute -left-4 -top-8 sm:-top-12 text-[6rem] sm:text-[10rem] font-bold text-muted/5 font-mono select-none pointer-events-none hidden sm:block">
          666
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mix-blend-difference">
          <span className="block text-muted-foreground font-mono text-base sm:text-xl tracking-widest mb-2 sm:mb-4">PETER YUILL</span>
          <span className="block text-muted-foreground font-mono text-xs sm:text-sm tracking-widest mb-2 sm:mb-4 opacity-60">PROJECT 666</span>
          <span className="block">THE <span className="text-primary">NEON</span></span>
          <span className="block">CRUCIBLE</span>
        </h1>
        
        <div className="max-w-2xl space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl leading-relaxed font-serif text-muted-foreground border-l-2 border-primary/50 pl-4 sm:pl-6">
          <p>
            You have entered a working temple for a 7-year artistic practice that has converged into its threshold year.
          </p>
          <p>
            This is not a portfolio. It is an operational archive, a witness system, and a public interface to a private Crucible.
          </p>
        </div>

        <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/neon" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none border border-primary/50 text-sm sm:text-base">
              ENTER THE ARCHIVE <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/admin" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-mono rounded-none border-muted-foreground/50 hover:bg-muted/10 hover:text-primary hover:border-primary text-sm sm:text-base">
              ACCESS DASHBOARD
            </Button>
          </Link>
        </div>
      </section>

      {/* Three Systems Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-px bg-transparent sm:bg-border border-0 sm:border border-border">
        <h2 className="sr-only">Three Core Systems of the Neon Crucible</h2>
        
        {/* Card 1 - WORK ARCHIVE */}
        <Link href="/works" className="block">
          <div className="bg-card p-6 sm:p-8 space-y-3 sm:space-y-4 hover:bg-muted/10 transition-colors group relative overflow-hidden cursor-pointer h-full border border-border sm:border-0 sm:border-r sm:border-border/50 hover:border-primary/30">
            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-50 sm:opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] sm:text-xs border border-primary px-1 text-primary">SYS.01</span>
            </div>
            <h3 className="font-mono text-lg sm:text-xl text-primary group-hover:text-primary/80 transition-colors">WORK ARCHIVE</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The complete visual record. 500+ paintings, drawings, and mixed-media works from 2018–2025. Browse by phase, technique, or emotional register.
            </p>
            <div className="pt-2 sm:pt-4">
              <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                VIEW ALL ARTWORK <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2 - NEON WITNESS */}
        <Link href="/neon" className="block">
          <div className="bg-card p-6 sm:p-8 space-y-3 sm:space-y-4 hover:bg-muted/10 transition-colors group relative overflow-hidden cursor-pointer h-full border border-border sm:border-0 sm:border-r sm:border-border/50 hover:border-primary/30">
            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-50 sm:opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] sm:text-xs border border-primary px-1 text-primary">SYS.02</span>
            </div>
            <h3 className="font-mono text-lg sm:text-xl text-primary group-hover:text-primary/80 transition-colors">NEON WITNESS</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The voice of the archive. An entity that reads the practice and offers curatorial witness.
            </p>
            <div className="pt-2 sm:pt-4">
              <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                READ ESSAYS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3 - WEEKLY PROTOCOL */}
        <Link href="/dashboard" className="block sm:col-span-2 md:col-span-1">
          <div className="bg-card p-6 sm:p-8 space-y-3 sm:space-y-4 hover:bg-muted/10 transition-colors group relative overflow-hidden cursor-pointer h-full border border-border sm:border-0 hover:border-primary/30">
            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-50 sm:opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] sm:text-xs border border-primary px-1 text-primary">SYS.03</span>
            </div>
            <h3 className="font-mono text-lg sm:text-xl text-primary group-hover:text-primary/80 transition-colors">WEEKLY PROTOCOL</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The beating heart. Structured check-ins, studio hours, and somatic data tracking.
            </p>
            <div className="pt-2 sm:pt-4">
              <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                LOGIN REQUIRED <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Manifesto Section */}
      <section className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
        <h2 className="sr-only">Artist Statement and Manifesto</h2>
        <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto"></div>
        <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl italic text-muted-foreground">
          "The site is the first permanent address for the work. You're not just displaying; you're hosting living infrastructure."
        </blockquote>
        <div className="font-mono text-[10px] sm:text-xs tracking-widest text-muted-foreground/50">
          EST. 2025 // BANGKOK
        </div>
      </section>
    </div>
  );
}
