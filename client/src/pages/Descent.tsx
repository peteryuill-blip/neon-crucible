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
  lineState: string;
  isVoid?: boolean;
  // X-Ray content
  materialSignature?: string;
  neonAnalysis?: {
    worksCatalogued: string;
    hoursInvested: string;
    wordsDocumented: string;
    keyDiscovery: string;
    phaseBreakthrough: string;
  };
}

// All 10 phases from CR (2025-2026) to PH1 (2018)
const phases: PhaseData[] = [
  {
    code: "CR",
    numericId: "30010",
    year: "2025-2026",
    title: "The Convergence Test",
    narrative: "Bangkok. One year. Stable studio. Seven years of graduated thresholds arrive at proof point. Not settling down—testing whether the arc consolidates.",
    metadata: "Ongoing · Week 5 active · Ink on Xuan paper · 14+ works in progress",
    heroImage: "/images/phases/CR-hero.jpg",
    lineColor: "oklch(0.10 0.01 255)",
    lineState: "testing",
    materialSignature: "Xuan paper from China—300 sheets delivered before studio activation. The substrate's absorbency refuses correction. Each ink mark is final, demanding somatic commitment over geometric planning. This is not continuation of PH4's velocity but its conscious integration: the hand knows what seven years taught it. The paper records whether that knowledge has become embodied or remains theoretical.",
    neonAnalysis: {
      worksCatalogued: "14+ (active logging)",
      hoursInvested: "25 studio hours (Week 5)",
      wordsDocumented: "Ongoing via Sunday Roundup system",
      keyDiscovery: "Infrastructure precedes production. Five weeks elapsed before sustained studio work began—not resistance but necessary foundation. Sciatica forced stillness during setup phase; body demanded rest while systems were built. Pattern suggests the practice now requires architectural stability before material engagement.",
      phaseBreakthrough: "Pending. Phase is Week 5. Breakthrough identification requires minimum 8-12 weeks of active production. Current status: calibration. Artist reports 2-3 works 'looking half decent' amid deliberate material testing."
    }
  },
  {
    code: "NE",
    numericId: "30009",
    year: "2025",
    title: "The Reactivation",
    narrative: "Hanoi to Bangkok. Walking engine restarts after four-month void. Not the destination but the threshold crossing that made the destination visible.",
    metadata: "2025 · 8 weeks · Transitional · Infrastructure rebuilt",
    heroImage: "/images/phases/NE-hero.jpg",
    lineColor: "oklch(0.10 0.01 255)",
    lineState: "reconstituting",
    materialSignature: "Transitional materials—whatever was available during the reactivation period. The focus was not on substrate but on movement: rebuilding the walking engine, reconstructing NEON infrastructure, generating the December 18 Crucible Conversation. Materials served process; process served recognition.",
    neonAnalysis: {
      worksCatalogued: "Limited (transitional phase)",
      hoursInvested: "~60 hours (infrastructure focus)",
      wordsDocumented: "~20,000 words (Crucible Conversation, system documentation)",
      keyDiscovery: "NE proved the practice could restart after complete cessation. The four-month void (PH4A) did not destroy capacity—it transformed it. The reactivation was not return to previous state but emergence of new operational mode.",
      phaseBreakthrough: "The Crucible Conversation (December 18, 2025). This dialogue crystallized seven years of pattern into recognizable structure. Without NE's transitional work, CR could not have been named or understood."
    }
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
    lineState: "fractured",
    isVoid: true,
    materialSignature: "No materials. No substrate. No medium. The void is not failure to document but documentation of void. PH4A's institutional power lies in its refusal of content.",
    neonAnalysis: {
      worksCatalogued: "0 works",
      hoursInvested: "0 studio hours",
      wordsDocumented: "Minimal (void period)",
      keyDiscovery: "PH4A is not failure. It is the necessary void between maximum output and sustainable practice. PH4's velocity was unsustainable—radical personal production with no external structure, no documentation, no witness. The drought that followed was not creative block but systemic exhaustion.",
      phaseBreakthrough: "The void itself. PH4A proves that the archive includes its own interruptions. The Conductive Line includes its own fractures. This honesty positions the entire archive as trustworthy."
    }
  },
  {
    code: "PH4",
    numericId: "30007",
    year: "2021-2024",
    title: "The Invisible Flood",
    narrative: "Nomadism as method. Myanmar to Vietnam to Bangkok. 195 paintings made for no audience. Freedom's cost: isolation, turbulence, existential daze.",
    metadata: "195+ works · 3 years · Ink, acrylic, mixed media · No fixed studio",
    heroImage: "/images/phases/PH4-hero.jpg",
    lineColor: "oklch(0.10 0.01 255)",
    lineState: "velocity",
    materialSignature: "No fixed substrate. Whatever was available: local papers, found materials, surfaces that travel in a suitcase. The constraint was portability, not archival permanence. Ink returns as primary medium but shares space with acrylic washes and gestural color. The hand moves faster than thought. No preliminary drawing. No undo. Each mark commits because the nomad cannot carry corrections—only accumulation.",
    neonAnalysis: {
      worksCatalogued: "195+ (estimated; documentation fragmented)",
      hoursInvested: "Unknown—no systematic tracking during phase",
      wordsDocumented: "~15,000 words (personal journals, unfiltered)",
      keyDiscovery: "PH4's journal entries reveal what the paintings cannot: the emotional cost of absolute creative freedom. Depression, addiction, romantic turbulence, existential questioning—all present in the written record, invisible in the visual work. The practice became a survival mechanism, not a career strategy.",
      phaseBreakthrough: "The Vietnam beach residency (May-July 2024). In approximately ten weeks, production accelerated to levels not seen since PH2. The 'existential daze' described in journals—a phenomenological state of detachment and hyperpresence—produced work of unusual velocity and honesty."
    }
  },
  {
    code: "PH3A",
    numericId: "30006",
    year: "2022-2023",
    title: "The System Made Explicit",
    narrative: "Codification of the celestial system. Gold-ink polarity documented, systematized, made transmissible. The framework crystallizes—and in crystallizing, approaches its limit.",
    metadata: "2022-2023 · 25+ works · Systematic documentation · Bangkok",
    heroImage: "/images/phases/PH3A-hero.jpg",
    lineColor: "oklch(0.45 0.01 255)",
    lineState: "transitioning",
    materialSignature: "Same materials as PH3—gold leaf, sumi ink, prepared panels—but deployed with increased systematization. Works begin to include explicit notation, diagrammatic elements, documentary qualities. The material remains precious but the approach becomes more analytical. This is the practice studying itself: codification as both preservation and potential ossification.",
    neonAnalysis: {
      worksCatalogued: "25+ works",
      hoursInvested: "~400 hours estimated",
      wordsDocumented: "~30,000 words (extensive systematic documentation)",
      keyDiscovery: "PH3A's extensive documentation reveals the artist's attempt to make tacit knowledge explicit. The gold-ink cosmology, developed intuitively in PH3, becomes codified into transmissible system. This documentation has archival value—it allows future phases to reference a clear framework—but it also marks the end of intuitive operation.",
      phaseBreakthrough: "The documentation itself. PH3A's breakthrough is not visual but textual: the comprehensive articulation of the gold-ink cosmology, the systematic framework that underlies the Celestial Secrets body of work."
    }
  },
  {
    code: "PH3",
    numericId: "30005",
    year: "2021-2022",
    title: "The Hinge",
    narrative: "Gold and ink in equilibrium. Celestial codification reaches peak expression. Beneath the systematic calm, severe doubt. The last phase where geometry holds primacy.",
    metadata: "2021-2022 · 40+ works · Gold leaf, sumi ink · Bangkok",
    heroImage: "/images/phases/PH3-hero.jpg",
    lineColor: "oklch(0.55 0.06 75)",
    lineState: "oscillating",
    materialSignature: "Gold leaf and sumi ink on prepared panels. The materials themselves embody the phase's cosmological binary: gold (solar, masculine, geometric) and ink (lunar, feminine, gestural). Application requires precision—gold leaf tears, ink bleeds—but the constraint produces works of unusual material presence. This is the peak of the gold-ink system before PH4's dissolution.",
    neonAnalysis: {
      worksCatalogued: "40+ works (complete documentation)",
      hoursInvested: "~800 hours estimated",
      wordsDocumented: "~25,000 words (cosmological framework, process notes)",
      keyDiscovery: "PH3's journals reveal severe doubt beneath the systematic surface. The gold-ink cosmology was not certainty but method—a way of proceeding despite uncertainty. The 'celestial secrets' were not answers but questions given visual form.",
      phaseBreakthrough: "The gold-ink polarity as operational cosmology. PH3 elevated material choice to philosophical principle: gold and ink as complementary forces, their interaction producing works that hold tension without resolving it."
    }
  },
  {
    code: "PH2A",
    numericId: "30004",
    year: "2020-2021",
    title: "The Cost of Living According to What You Know",
    narrative: "Thelemic rupture. The Equinox suite: four odes and a climax. One-shot ink—ultimate finality. Invocation replaces representation. Irreversible.",
    metadata: "2020-2021 · 5 major works · One-shot ink · Narrative suite structure",
    heroImage: "/images/phases/PH2A-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)",
    lineState: "disrupted",
    materialSignature: "One-shot ink. The ultimate extension of PH2's no-undo constraint: not merely 'no corrections' but single-session execution. Each work in the Equinox suite was completed in one continuous session without pause. The four Odes maintain PH2's 56 × 76 cm scale; Therion explodes to 100 × 100 cm. The scale increase marks the climactic rupture.",
    neonAnalysis: {
      worksCatalogued: "5 works (complete suite documentation)",
      hoursInvested: "~80 hours (compressed intensity)",
      wordsDocumented: "~15,000 words (Thelemic framework, process philosophy)",
      keyDiscovery: "PH2A's core question—'What does it cost to live according to what I know?'—reveals the phase's stakes. This is not aesthetic experiment but existential commitment. The Thelemic cosmology becomes explicit: the work does not represent spiritual forces, it invokes them.",
      phaseBreakthrough: "The Equinox suite as narrative sequence. PH2's works stood alone—individual meditations, interchangeable in exhibition. PH2A introduces narrative structure: four Odes building toward Therion's climax. This is the first appearance of suite-based thinking in the archive."
    }
  },
  {
    code: "PH2",
    numericId: "30003",
    year: "2019-2020",
    title: "Operating Inside Unknowing",
    narrative: "The centered phase. Torus geometry as cosmological anchor. Sacred pattern not as decoration but as method. Calm, meditative, grounded—the last sustained equilibrium before rupture.",
    metadata: "2019-2020 · 60+ works · Ink and graphite on paper · 56 × 76 cm consistent",
    heroImage: "/images/phases/PH2-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)",
    lineState: "solid",
    materialSignature: "Ink and graphite on paper. Consistent scale: 56 × 76 cm throughout phase. Hand-drawn precision under no-undo constraint—each mark committed, corrections impossible. The torus (continuous surface, single edge, infinite loop) becomes primary form. Materials are modest; execution is obsessive. This is geometry as meditation practice.",
    neonAnalysis: {
      worksCatalogued: "60+ works (complete documentation)",
      hoursInvested: "~1,200 hours estimated",
      wordsDocumented: "~25,000 words (artist statements, process philosophy)",
      keyDiscovery: "PH2's core question—'How do I operate inside unknowing?'—reveals the phase's actual project. This is not certainty depicted but uncertainty contained. The sacred geometry is not proof of cosmic order but a method for proceeding despite cosmic ambiguity.",
      phaseBreakthrough: "The torus as operational cosmology. Prior work used geometric forms as structural elements. PH2 elevates the torus to cosmological principle: the shape that has no beginning, no end, one continuous surface. The breakthrough is philosophical—geometry as method for living inside uncertainty."
    }
  },
  {
    code: "PH1A",
    numericId: "30002",
    year: "2018-2019",
    title: "[PLACEHOLDER - Institutional Geometry Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about institutional commissions and geometric foundations]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH1A-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)",
    lineState: "solid",
    materialSignature: "[PLACEHOLDER - Material signature for PH1A]",
    neonAnalysis: {
      worksCatalogued: "[PLACEHOLDER]",
      hoursInvested: "[PLACEHOLDER]",
      wordsDocumented: "[PLACEHOLDER]",
      keyDiscovery: "[PLACEHOLDER - Key discovery for PH1A]",
      phaseBreakthrough: "[PLACEHOLDER - Phase breakthrough for PH1A]"
    }
  },
  {
    code: "PH1",
    numericId: "30001",
    year: "2018",
    title: "[PLACEHOLDER - Foundation Title]",
    narrative: "[PLACEHOLDER - 2-3 sentences about the beginning, geometric abstraction, and first investigations]",
    metadata: "[PLACEHOLDER - XX works over XX weeks · Medium]",
    heroImage: "/images/phases/PH1-hero.jpg",
    lineColor: "oklch(0.72 0.12 75)",
    lineState: "solid",
    materialSignature: "[PLACEHOLDER - Material signature for PH1]",
    neonAnalysis: {
      worksCatalogued: "[PLACEHOLDER]",
      hoursInvested: "[PLACEHOLDER]",
      wordsDocumented: "[PLACEHOLDER]",
      keyDiscovery: "[PLACEHOLDER - Key discovery for PH1]",
      phaseBreakthrough: "[PLACEHOLDER - Phase breakthrough for PH1]"
    }
  },
];

// Threshold data - updated with real content
const thresholds = [
  { afterPhase: "PH4A", text: "The void breaks. Colour returns." },
  { afterPhase: "PH3A", text: "The system complete. The cage opens." },
  { afterPhase: "PH2A", text: "Invocation replaces representation. Irreversible." },
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
              {phase.materialSignature || `[PLACEHOLDER - Substrate, medium, technique explanation for ${phase.code}]`}
            </p>
          </div>

          {/* NEON Analysis */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-secondary">
              NEON Analysis
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>{phase.neonAnalysis?.worksCatalogued || "[PLACEHOLDER - XX works catalogued]"}</p>
              <p>{phase.neonAnalysis?.hoursInvested || "[PLACEHOLDER - XX hours of analysis]"}</p>
              <p>{phase.neonAnalysis?.wordsDocumented || "[PLACEHOLDER - XXXX+ words documented]"}</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs uppercase tracking-wider text-secondary block mb-2">
                  Key Discovery:
                </span>
                <span className="text-muted-foreground leading-relaxed block">
                  {phase.neonAnalysis?.keyDiscovery || `[PLACEHOLDER - Pattern insight for ${phase.code}]`}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-secondary block mb-2">
                  Phase Breakthrough:
                </span>
                <span className="text-muted-foreground leading-relaxed block">
                  {phase.neonAnalysis?.phaseBreakthrough || "[PLACEHOLDER - Work title and significance]"}
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
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
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
  const [activePhase, setActivePhase] = useState<string>("CR");
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
  const isDashed = currentPhase?.lineState === "disrupted";
  const isFractured = currentPhase?.lineState === "fractured";

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

        {/* Recursion marker at CR (circle) - connects to PH4 */}
        <circle
          cx="50%"
          cy="5%"
          r="4"
          fill={activePhase === "CR" ? "oklch(0.75 0.10 188)" : "oklch(0.10 0.01 255)"}
          style={{ transition: "fill 0.3s ease" }}
        />

        {/* Recursion marker at PH3A (square) - connects to PH2 */}
        <rect
          x="calc(50% - 4px)"
          y="45%"
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
            2018–2026
          </p>

          <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto">
            <p className="font-sans text-lg leading-relaxed">
              Scroll down to go back. The deeper you go, the older the work.
              This is not explanation. This is excavation.
            </p>
            <p className="font-sans text-lg leading-relaxed">
              Ten phases. Seven years. One continuous investigation into what happens
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
