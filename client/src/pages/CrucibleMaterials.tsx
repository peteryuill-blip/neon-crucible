import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

interface Substrate {
  code: string;
  name: string;
  character: string;
  count: number;
  avgRating: number;
}

interface Ink {
  code: string;
  name: string;
  character: string;
}

// Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (generated 2026-05-07).
const SUBSTRATES: Substrate[] = [
  { code: "S1",  name: "First Test Sheet",        character: "One-off test",                                    count: 1,  avgRating: 1.00 },
  { code: "S2",  name: "Hongxing Fine Mulberry",  character: "Soft, absorbent",                                 count: 29, avgRating: 1.76 },
  { code: "S3",  name: "Tan Xi Special Pure",     character: "Premium raw — late-warmup workhorse",             count: 41, avgRating: 2.83 },
  { code: "S4",  name: "Tanpi Sandalwood Bark",   character: "Mid-weight, textured",                            count: 54, avgRating: 1.89 },
  { code: "S5",  name: "Water-Damaged Lot",       character: "Degraded, unpredictable",                         count: 20, avgRating: 1.05 },
  { code: "S6",  name: "Red Star Dan Xuan",       character: "Lightweight, responsive",                         count: 24, avgRating: 2.38 },
  { code: "S7",  name: "Jing Xian Processed",     character: "Semi-cooked, forgiving",                          count: 17, avgRating: 2.06 },
  { code: "S8",  name: "Heavy Pulp Fiber",        character: "Dense, resistant",                                count: 10, avgRating: 1.20 },
  { code: "S9",  name: "Multi-Session Stage",     character: "Layered accumulation surface",                    count: 8,  avgRating: 1.62 },
  { code: "S10", name: "Red Star Ink Field",      character: "Production phase entry",                          count: 22, avgRating: 2.91 },
  { code: "S11", name: "Red Star Moxin Leather",  character: "Production phase aristocrat — highest avg",       count: 34, avgRating: 3.41 },
  { code: "S12", name: "Red Star Mo Yun Bark",    character: "W20 surface — current active",                    count: 34, avgRating: 3.38 },
];

const INKS: Ink[] = [
  { code: "MB1", name: "Yi De Ge Dense", character: "Max concentration, structural blacks" },
  { code: "MB2", name: "Yi De Ge Mid", character: "Working dilution" },
  { code: "MB3", name: "Yi De Ge Wash", character: "Atmospheric greys" },
  { code: "MB4", name: "Xuan Zong Dense", character: "Alternative brand, cooler tone" },
  { code: "MB5", name: "Xuan Zong Mid", character: "Working dilution" },
  { code: "MB6", name: "Xuan Zong Wash", character: "Atmospheric layer" },
];

const CrucibleMaterials = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">
        {/* Breadcrumb */}
        <Link
          href="/crucible"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-[#00FFCC] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          The Crucible
        </Link>

        {/* Header */}
        <div className="space-y-6">
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Section 03 / Materials
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">
            Substrate &amp; Ink
          </h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            Every work in the Crucible phase is built from a deliberate pairing
            of substrate and ink. Twelve papers, six inks. The choice precedes
            the gesture and shapes everything that follows.
          </p>
        </div>

        {/* Substrates */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              The Twelve Papers
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Substrates
            </h2>
            <p className="font-serif text-sm text-foreground/70 max-w-2xl">
              Each surface is coded S1 through S12 in order of introduction.
              S11 and S12 produced the year's strongest work; S1 and S5 the
              weakest. The paper, more than the ink, decides what is possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBSTRATES.map((s) => {
              // Aristocrat highlight: top 4 average ratings.
              const aristocrat = s.avgRating >= 3.2;
              const accent = aristocrat ? "#d946ef" : "#00FFCC";
              return (
                <div
                  key={s.code}
                  className="border border-white/10 p-5 hover:border-white/30 transition-colors"
                  style={{ boxShadow: aristocrat ? `inset 0 0 0 1px ${accent}30` : undefined }}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <div
                      className="font-mono text-xs tracking-widest uppercase"
                      style={{ color: accent }}
                    >
                      {s.code}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                      {s.count} {s.count === 1 ? "work" : "works"}
                    </div>
                  </div>
                  <div className="font-serif text-lg leading-tight mb-2">
                    {s.name}
                  </div>
                  <div className="font-serif text-sm text-foreground/65 italic">
                    {s.character}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inks */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              The Six Inks
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Inks
            </h2>
            <p className="font-serif text-sm text-foreground/70 max-w-2xl">
              Two brands, three dilutions each. Yi De Ge runs warm; Xuan Zong
              runs cooler. The dilution decides whether the mark is structure,
              body, or atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INKS.map((ink) => (
              <div
                key={ink.code}
                className="border border-white/10 p-5 hover:border-white/30 transition-colors"
              >
                <div className="font-mono text-xs tracking-widest uppercase text-[#00FFCC] mb-3">
                  {ink.code}
                </div>
                <div className="font-serif text-lg leading-tight mb-2">
                  {ink.name}
                </div>
                <div className="font-serif text-sm text-foreground/65 italic">
                  {ink.character}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/60 italic max-w-2xl">
            Surface and ink are recorded for every work in the archive. The
            pairings that recur are not accidents — they are the operating
            grammar of the year.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CrucibleMaterials;
