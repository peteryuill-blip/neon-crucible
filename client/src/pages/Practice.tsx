import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  {
    code: "PH0A-PH0C",
    years: "2011-2017",
    title: "Foundation",
    description: "Hong Kong. Hyper-detailed architectural drawings, street presence, sacred geometry emerging from commercial practice. The cosmopolitan apprenticeship that built the practitioner.",
    color: "#888888",
  },
  {
    code: "PH1",
    years: "2018",
    title: "Absurdity of Meaning",
    description: "The ego death. A solo exhibition that dismantled the prior practice and forced a confrontation with what painting actually was. The origin point of the current arc.",
    color: "#FFFFFF",
  },
  {
    code: "PH1A",
    years: "2018-2019",
    title: "Institutional Geometry",
    description: "Sacred geometry enters institutional space. Peninsula Hotels, JLL, Swire commissions. The vocabulary expands under pressure of professional scale.",
    color: "#C0C0C0",
  },
  {
    code: "PH2",
    years: "2019-2020",
    title: "Alignment: Circular Paradigm",
    description: "Peak geometric refinement. The Alignment series. Gold leaf as threshold marker. The most technically precise work in the career to this point.",
    color: "#FFD700",
  },
  {
    code: "PH2A",
    years: "2020",
    title: "Equinox of the Gods: Thelemic Rupture",
    description: "The first one-shot ink rupture. Jonathan LeVine Projects, New York. Control surrenders to velocity. The method that would define everything that followed.",
    color: "#FF4400",
  },
  {
    code: "PH3 / PH3A",
    years: "2022-2023",
    title: "Echoes / Celestial Secrets",
    description: "Inward turn. The distillation of seven years into essential questions. Celestial Secrets at West Eden Gallery, Bangkok: the practice's first Thai institutional moment.",
    color: "#4A0080",
  },
  {
    code: "PH4",
    years: "2024",
    title: "Nomadic: Emotional Crisis and Expressionism",
    description: "Vietnam. 195 paintings in seven weeks. Color returning for the first time in fifteen years. Maximum output density. Zero institutional context. The body painting in survival mode.",
    color: "#FF00FF",
  },
  {
    code: "NE",
    years: "2025-present",
    title: "New Era",
    description: "Bangkok. Sumi ink on raw Xuan. The synthesis of fifteen years: structural precision and somatic surrender operating as one. The Crucible Year is this practice at full declaration.",
    color: "#00FF99",
  },
];

export default function Practice() {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-20">

      {/* Header */}
      <header className="space-y-6 border-b border-border pb-12">
        <p className="font-mono text-xs tracking-widest text-primary">THE PRACTICE</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter leading-tight">
          Fifteen Years.<br />
          <span className="text-primary">One Question.</span>
        </h1>
        <p className="font-serif text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          What happens in the space between order and chaos?
        </p>
      </header>

      {/* The Painter */}
      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          The Work
        </h2>
        <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          <p>
            Peter Yuill is a painter who has spent fifteen years asking the same question
            through different materials, different cities, and different states of crisis
            and clarity. The answer keeps changing. The question does not.
          </p>
          <p>
            Each work is a single-shot irreversible act: sumi ink or acrylic on East
            Asian rice paper, one mark, one decision, no revision. The constraint is not
            stylistic. It is ethical. The painting must be honest because there is no
            going back.
          </p>
          <p>
            The practice operates at the intersection of sacred geometry and somatic
            mark-making. Two approaches that appear opposite and turn out to be the
            same thing approached from different ends. Structure enables the gesture.
            Gesture animates the structure. The space between is where the work lives.
          </p>
        </div>
      </section>

      {/* The Arc */}
      <section className="space-y-10">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            The Arc
          </h2>
          <span className="font-mono text-xs text-muted-foreground/60">2011-PRESENT</span>
        </div>

        <div className="space-y-0">
          {phases.map((phase, i) => (
            <div
              key={phase.code}
              className="group grid grid-cols-[4px_1fr] gap-6 sm:gap-8 border-b border-border/40 py-6 last:border-0"
            >
              {/* Color bar */}
              <div
                className="w-1 self-stretch opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: phase.color }}
              />

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
                    {phase.code}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40">
                    {phase.years}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
                  {phase.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Synthesis */}
      <section className="space-y-6 border-l-2 border-primary/50 pl-8">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Where It Stands Now
        </h2>
        <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          <p>
            The Crucible Year is the first primarily constructive phase in the practice's
            history. The three prior destruction-reconstruction cycles (2018, 2020, 2024)
            each cleared ground that the next phase built on. The current practice is
            building on cleared ground with nothing left to demolish.
          </p>
          <p>
            The recent breakthrough is restraint. Not adding marks for the sake of marks.
            Knowing when to stop. Letting the paper have its space. The six Rating-5 works
            produced in a single week in April 2026 are the first works the practice
            considers genuinely close to exhibition quality under the current standard.
          </p>
          <p>
            The work is documented in real time by a system called Neon, a 15-year
            cognitive architecture that witnesses, analyses, and holds the practice to
            account. The Crucible Year is this system in its most intensive operational
            moment.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/crucible">
            <Button className="font-mono">
              SEE THE CRUCIBLE YEAR <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/neon">
            <Button variant="outline" className="font-mono">
              MEET NEON <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Works link */}
      <section className="border-t border-border pt-12 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground mb-1">
            THE ARCHIVE
          </p>
          <p className="font-serif text-sm text-foreground/70">
            152 works catalogued, 2018-2025
          </p>
        </div>
        <Link href="/works">
          <Button variant="outline" className="font-mono">
            VIEW WORKS <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

    </div>
  );
}
