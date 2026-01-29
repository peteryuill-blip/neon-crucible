import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";

// Phase data structure
interface PhaseData {
  code: string;
  numericId: string;
  year: string;
  title: string;
  narrative: string;
  metadata: string;
  heroImage: string;
  lineColor: string;
  isVoid?: boolean;
}

// All 9 phases from NE (2025) to PH1 (2018)
const phases: PhaseData[] = [
  {
    code: "NE",
    numericId: "30009",
    year: "2025",
    title: "[PLACEHOLDER - Neon Emergence Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about the return to ink, somatic investigation, and the convergence of seven years]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/NE-hero.jpg",
    lineColor: "oklch(0.10 0.01 255)", // ink black
  },
  {
    code: "PH4A",
    numericId: "30008",
    year: "2024-2025",
    title: "The Drought",
    narrative: "No surviving works. The void moved into the heart.",
    metadata: "2024-2025 · 4 months · 0 works",
    heroImage: "",
    lineColor: "oklch(0.10 0.01 255)",
    isVoid: true,
  },
  {
    code: "PH4",
    numericId: "30007",
    year: "2024",
    title: "[PLACEHOLDER - Ink Storms Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about chromatic storms, portals, and the velocity of ink]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH4-hero.jpg",
    lineColor: "oklch(0.10 0.01 255)", // ink black
  },
  {
    code: "PH3A",
    numericId: "30006",
    year: "2023",
    title: "[PLACEHOLDER - Celestial Secrets Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about celestial codification and geometric return]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH3A-hero.jpg",
    lineColor: "oklch(0.45 0.01 255)", // grey
  },
  {
    code: "PH3",
    numericId: "30005",
    year: "2022",
    title: "[PLACEHOLDER - Echoes Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about echoes, persistence, and memory in paint]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH3-hero.jpg",
    lineColor: "oklch(0.45 0.01 255)", // grey
  },
  {
    code: "PH2A",
    numericId: "30004",
    year: "2020",
    title: "[PLACEHOLDER - Equinox Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about Thelemic rupture and sacred invocation]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH2A-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)", // gold cracking (dashed)
  },
  {
    code: "PH2",
    numericId: "30003",
    year: "2019-2020",
    title: "[PLACEHOLDER - Alignment Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about alignment, sacred geometry, and systematic practice]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH2-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)", // gold receding
  },
  {
    code: "PH1A",
    numericId: "30002",
    year: "2018-2019",
    title: "[PLACEHOLDER - Institutional Geometry Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about institutional commissions and geometric foundations]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH1A-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)", // pure gold
  },
  {
    code: "PH1",
    numericId: "30001",
    year: "2018",
    title: "[PLACEHOLDER - Absurdity of Meaning Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about the beginning, geometric abstraction, and first investigations]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH1-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)", // pure gold
  },
];

// Threshold data
const thresholds = [
  { afterPhase: "PH4A", text: "The void breaks. Colour returns." },
  { afterPhase: "PH2A", text: "Thelemic rupture. Irreversible." },
  { afterPhase: "PH1A", text: "From institution to invocation." },
];

// X-Ray Panel Component
function XRayPanel({ 
  phase, 
  isOpen, 
  onClose 
}: { 
  phase: PhaseData; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`xray-title-${phase.code}`}
    >
      <div className="container max-w-3xl mx-auto py-16 px-4 md:px-8">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors duration-150"
          aria-label="Close analysis"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-12 font-mono text-sm">
          <header className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-secondary">
              {phase.year} · {phase.code}
            </span>
            <h2 
              id={`xray-title-${phase.code}`}
              className="font-serif text-3xl font-light"
            >
              {phase.title}
            </h2>
          </header>

          {/* Material Signature */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-secondary">
              Material Signature
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              [PLACEHOLDER - Substrate, medium, technique explanation for {phase.code}]
            </p>
          </div>

          {/* NEON Analysis */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-secondary">
              NEON Analysis
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>[PLACEHOLDER - XX works catalogued]</p>
              <p>[PLACEHOLDER - XX hours of analysis]</p>
              <p>[PLACEHOLDER - XXXX+ words documented]</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs uppercase tracking-wider text-secondary block mb-1">
                  Key Discovery:
                </span>
                <span className="text-muted-foreground">
                  [PLACEHOLDER - Pattern insight for {phase.code}]
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-secondary block mb-1">
                  Phase Breakthrough:
                </span>
                <span className="text-muted-foreground">
                  [PLACEHOLDER - Work title and significance]
                </span>
              </div>
            </div>
          </div>

          {/* Representative Works */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-secondary">
              Representative Works
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <a 
                  key={i}
                  href={`/works?phase=${phase.numericId}`}
                  className="group"
                >
                  <div className="aspect-square bg-card border border-border group-hover:border-primary transition-colors duration-150 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">
                      [IMG {i}]
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Close CTA */}
          <div className="pt-8 border-t border-border">
            <button
              onClick={onClose}
              className="font-mono text-sm uppercase tracking-wider text-primary hover:text-secondary transition-colors duration-150"
            >
              ← Return to Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phase Block Component
function PhaseBlock({ phase, index }: { phase: PhaseData; index: number }) {
  const [xrayOpen, setXrayOpen] = useState(false);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && xrayOpen) {
        setXrayOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [xrayOpen]);

  // Special rendering for PH4A (The Drought)
  if (phase.isVoid) {
    return (
      <article
        id={phase.code}
        className="relative py-48 md:py-64 px-4 md:px-8"
        style={{ backgroundColor: "oklch(0.05 0.01 255)" }}
        aria-label={`Phase ${phase.code}: The Drought. Zero works. Four months.`}
      >
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <p 
            className="font-serif text-xl md:text-2xl font-light leading-relaxed"
            style={{ color: "oklch(0.40 0.01 255)" }}
          >
            {phase.narrative}
          </p>
          <p 
            className="font-serif text-lg font-light italic leading-relaxed"
            style={{ color: "oklch(0.30 0.01 255)" }}
          >
            Some phases are measured not by what was made,<br />
            but by what was endured.
          </p>
          <p 
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: "oklch(0.25 0.01 255)" }}
          >
            {phase.metadata}
          </p>
        </div>
      </article>
    );
  }

  return (
    <>
      <article
        id={phase.code}
        className="relative py-24 md:py-32 px-4 md:px-8"
        aria-label={`Phase ${phase.code}: ${phase.title}. Press Enter to reveal detailed analysis.`}
      >
        <div className="container max-w-5xl mx-auto">
          {/* Phase Header */}
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-secondary">
              {phase.year} · {phase.code}
            </span>
            <button
              onClick={() => setXrayOpen(true)}
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-150 min-h-[44px] py-2"
              aria-expanded={xrayOpen}
              aria-controls={`xray-${phase.code}`}
            >
              <span>Analysis</span>
              <span className="text-base group-hover:scale-110 transition-transform">ⓘ</span>
            </button>
          </div>

          {/* Phase Base Layer */}
          <div className="phase-base space-y-8">
            {/* Hero Image */}
            <div className="w-full max-w-3xl mx-auto">
              <div className="aspect-[4/3] bg-card border border-border flex items-center justify-center">
                <span className="text-muted-foreground font-mono text-sm">
                  [HERO IMAGE: {phase.code}]
                </span>
              </div>
            </div>

            {/* Phase Title */}
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-center">
              {phase.title}
            </h2>

            {/* Institutional Narrative */}
            <p className="font-sans text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto text-center">
              {phase.narrative}
            </p>

            {/* Metadata */}
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground text-center">
              {phase.metadata}
            </p>

            {/* CTA */}
            <div className="flex justify-center">
              <a
                href={`/works?phase=${phase.numericId}`}
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-primary hover:text-secondary transition-colors duration-150"
              >
                <span>→</span>
                <span>View Phase Archive</span>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* X-Ray Panel */}
      <XRayPanel 
        phase={phase} 
        isOpen={xrayOpen} 
        onClose={() => setXrayOpen(false)} 
      />
    </>
  );
}

// Threshold Component
function Threshold({ text }: { text: string }) {
  return (
    <section className="relative py-32 md:py-48 px-4">
      <div className="container max-w-3xl mx-auto text-center">
        <p 
          className="font-sans text-base font-light tracking-widest uppercase"
          style={{ color: "oklch(0.50 0.01 255)" }}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

// Conductive Line Component
function ConductiveLine() {
  const [activePhase, setActivePhase] = useState<string>("NE");
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const phaseId = entry.target.id;
            if (phaseId) {
              setActivePhase(phaseId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all phase sections
    phases.forEach((phase) => {
      const element = document.getElementById(phase.code);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Get current line color based on active phase
  const currentPhase = phases.find((p) => p.code === activePhase);
  const lineColor = currentPhase?.lineColor || "oklch(0.72 0.12 75)";
  const isDashed = activePhase === "PH2A";
  const isFractured = activePhase === "PH4A";

  return (
    <div 
      className="fixed left-1/2 top-0 h-full w-px pointer-events-none z-30 hidden lg:block"
      aria-hidden="true"
    >
      <svg
        ref={lineRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {isFractured ? (
          // Fractured line for PH4A
          <>
            {[...Array(10)].map((_, i) => (
              <line
                key={i}
                x1="50%"
                y1={`${10 + i * 8}%`}
                x2="50%"
                y2={`${12 + i * 8}%`}
                stroke={lineColor}
                strokeWidth="1"
                opacity="0.1"
                style={{
                  transform: `translateX(${Math.sin(i) * 10}px) rotate(${Math.random() * 10 - 5}deg)`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </>
        ) : (
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke={lineColor}
            strokeWidth="1"
            strokeDasharray={isDashed ? "8 4" : "none"}
            style={{
              transition: "stroke 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)",
            }}
          />
        )}

        {/* Recursion marker at NE (circle) */}
        <circle
          cx="50%"
          cy="10%"
          r="4"
          fill={activePhase === "NE" ? "oklch(0.75 0.10 188)" : "oklch(0.10 0.01 255)"}
          style={{ transition: "fill 0.3s ease" }}
        />

        {/* Recursion marker at PH3A (square) */}
        <rect
          x="calc(50% - 4px)"
          y="40%"
          width="8"
          height="8"
          fill="none"
          stroke={activePhase === "PH3A" ? "oklch(0.75 0.10 188)" : "oklch(0.45 0.01 255)"}
          strokeWidth="1"
          style={{ transition: "stroke 0.3s ease" }}
        />
      </svg>
    </div>
  );
}

// Termination Section
function Termination() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {/* Geometric origin symbol (circle with cross) */}
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 200 200" 
          className="mx-auto opacity-40"
          aria-hidden="true"
        >
          <circle 
            cx="100" 
            cy="100" 
            r="80" 
            stroke="oklch(0.72 0.12 75)" 
            strokeWidth="1" 
            fill="none"
          />
          <line 
            x1="20" 
            y1="100" 
            x2="180" 
            y2="100" 
            stroke="oklch(0.72 0.12 75)" 
            strokeWidth="1"
          />
          <line 
            x1="100" 
            y1="20" 
            x2="100" 
            y2="180" 
            stroke="oklch(0.72 0.12 75)" 
            strokeWidth="1"
          />
        </svg>
        
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-8 opacity-50">
          Origin Point · 2018
        </p>
      </div>
    </section>
  );
}

// Main Descent Page
export default function Descent() {
  return (
    <main className="relative" role="main">
      {/* Conductive Line */}
      <ConductiveLine />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 relative">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight">
            The Descent
          </h1>

          <p className="font-mono text-sm uppercase tracking-wider text-secondary">
            2018–2025
          </p>

          <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto">
            <p className="font-sans text-lg leading-relaxed">
              Scroll down to go back. The deeper you go, the older the work.
              This is not explanation. This is excavation.
            </p>
            <p className="font-sans text-lg leading-relaxed">
              Nine phases. Seven years. One continuous investigation into what happens
              when geometry meets ink, control meets chaos, and the studio becomes
              archaeological site.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Phase Blocks with Thresholds */}
      {phases.map((phase, index) => {
        // Find if there's a threshold after this phase
        const threshold = thresholds.find((t) => t.afterPhase === phase.code);

        return (
          <div key={phase.code}>
            <PhaseBlock phase={phase} index={index} />
            {threshold && <Threshold text={threshold.text} />}
          </div>
        );
      })}

      {/* Termination */}
      <Termination />
    </main>
  );
}
