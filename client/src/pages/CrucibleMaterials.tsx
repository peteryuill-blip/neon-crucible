import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";
const DIM = "rgba(255,255,255,0.25)";

// ─── ALL DATA FROM CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (2026-05-07) ─────────

const SUBSTRATES = [
  { code: "S11", name: "Red Star Moxin Leather",  count: 34, avg: 3.41, phase: "Production",       character: "Production phase aristocrat. Highest average rating of any surface. Takes the gesture whole and returns it magnified.",              introduced: "W16" },
  { code: "S12", name: "Red Star Mo Yun Bark",    count: 34, avg: 3.38, phase: "Production",       character: "Current active surface. Bark-fiber texture creates unpredictable ink absorption patterns the gesture must negotiate in real time.", introduced: "W20" },
  { code: "S10", name: "Red Star Ink Field",      count: 22, avg: 2.91, phase: "Production entry", character: "The entry point to the production phase. Steady surface, predictable behavior. A platform for working at speed.",                   introduced: "W17" },
  { code: "S3",  name: "Tan Xi Special Pure",     count: 41, avg: 2.83, phase: "Late Warm-Up",     character: "Premium raw paper. The year's dominant Warm-Up surface by work count. Rewarded commitment with its best results in W18.",          introduced: "W14" },
  { code: "S6",  name: "Red Star Dan Xuan",       count: 24, avg: 2.38, phase: "Warm-Up",          character: "Lightweight, highly responsive. Small marks travel far. The surface that punishes hesitation most visibly.",                        introduced: "W9"  },
  { code: "S7",  name: "Jing Xian Processed",     count: 17, avg: 2.06, phase: "Warm-Up",          character: "Semi-cooked. Offers a forgiving early window — ink can be worked in the first seconds. Unforgiving over multiple layers.",          introduced: "W12" },
  { code: "S4",  name: "Tanpi Sandalwood Bark",   count: 54, avg: 1.89, phase: "Warm-Up primary",  character: "The Warm-Up workhorse by count: 54 works. Mid-weight with visible texture. Most of the Tithe was made on S4.",                    introduced: "W8"  },
  { code: "S2",  name: "Hongxing Fine Mulberry",  count: 29, avg: 1.76, phase: "Warm-Up",          character: "Soft and absorbent. Ink spreads on contact. The surface requires velocity — deliberate marks look deliberate in the worst way.",    introduced: "W6"  },
  { code: "S9",  name: "Multi-Session Stage",     count: 8,  avg: 1.62, phase: "Warm-Up",          character: "Built for layered accumulation. Multiple sessions, multiple passes. The only surface in the archive designed for revision.",         introduced: "W12" },
  { code: "S8",  name: "Heavy Pulp Fiber",        count: 10, avg: 1.20, phase: "Warm-Up",          character: "Dense and resistant. Ink sits on the surface rather than absorbing. Fights the mark. The session numbers reflect the difficulty.",   introduced: "W7"  },
  { code: "S5",  name: "Water-Damaged Lot",       count: 20, avg: 1.05, phase: "Warm-Up",          character: "Degraded stock acquired at reduced cost. Buckles unpredictably. Ink behavior shifts from sheet to sheet. Near-total Tithe rate.",    introduced: "W5"  },
  { code: "S1",  name: "First Test Sheet",        count: 1,  avg: 1.00, phase: "Test",             character: "A single sheet. A single work. The first mark of the year. Killed. S1 exists in the archive as the baseline: where everything started.", introduced: "W2" },
];

const INKS = [
  {
    code: "MB1", name: "Yi De Ge Dense", brand: "Yi De Ge",
    dilution: "Undiluted", tone: "Warm black",
    character: "Maximum concentration. The structural ink. Used for the first marks of a session, the marks that decide whether the work lives. No atmosphere — pure declaration.",
    pairedWith: ["S11", "S3", "S12"],
  },
  {
    code: "MB2", name: "Yi De Ge Mid", brand: "Yi De Ge",
    dilution: "Working dilution", tone: "Warm mid-grey",
    character: "The primary working ink across the year. Sits between declaration and atmosphere. Most works contain MB2 as the dominant layer. The ink the hand reaches for without thinking.",
    pairedWith: ["S4", "S3", "S11"],
  },
  {
    code: "MB3", name: "Yi De Ge Wash", brand: "Yi De Ge",
    dilution: "Heavy dilution", tone: "Warm pale grey",
    character: "Atmospheric layer. Used to establish tonal ground before committed marks, or to unify after them. The ink that makes a surface feel inhabited rather than struck.",
    pairedWith: ["S3", "S6", "S12"],
  },
  {
    code: "MB4", name: "Xuan Zong Dense", brand: "Xuan Zong",
    dilution: "Undiluted", tone: "Cool black",
    character: "The alternative dense. Cooler tone than MB1 — the mark reads differently on the same surface. Used when the work requires a harder edge, a more mechanical presence.",
    pairedWith: ["S10", "S11", "S3"],
  },
  {
    code: "MB5", name: "Xuan Zong Mid", brand: "Xuan Zong",
    dilution: "Working dilution", tone: "Cool mid-grey",
    character: "The Xuan Zong working dilution. Carries the cooler tone of MB4 into sustained passages. Useful for large-area marks where MB1 would be too assertive.",
    pairedWith: ["S10", "S4", "S3"],
  },
  {
    code: "MB6", name: "Xuan Zong Wash", brand: "Xuan Zong",
    dilution: "Heavy dilution", tone: "Cool pale grey",
    character: "The coolest atmospheric layer. Creates tonal depth on surfaces that read warm from the paper itself. The counter to MB3 — same structural role, different character.",
    pairedWith: ["S12", "S10", "S6"],
  },
];

// Surface ranking for a miniature bar inside each card
const maxAvg = 5;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const SectionHead = ({ n, title, note }: { n: string; title: string; note?: string }) => (
  <div className="space-y-2 mb-8">
    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{n}</div>
    <h2 className="text-2xl sm:text-3xl font-light tracking-tight">{title}</h2>
    {note && <p className="font-serif text-sm text-foreground/60 italic max-w-2xl leading-relaxed">{note}</p>}
  </div>
);

const RatingBar = ({ avg, color }: { avg: number; color: string }) => (
  <div className="relative h-1.5 bg-white/[0.06] mt-3">
    <div className="absolute inset-y-0 left-0" style={{ width: `${(avg / maxAvg) * 100}%`, backgroundColor: color, opacity: 0.7 }} />
    <div className="absolute inset-y-0 left-0" style={{ width: `${(avg / maxAvg) * 100}%`, boxShadow: `inset -2px 0 0 ${color}` }} />
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const CrucibleMaterials = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-20 sm:space-y-28">

        <Link href="/crucible"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-[#00FFCC] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> The Crucible
        </Link>

        {/* HEADER */}
        <div className="space-y-5">
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Section 03 / Materials</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">Substrate & Ink</h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
            Twelve papers. Six inks. The choice of material precedes the gesture and shapes everything that follows. Every work in the archive is built from a deliberate pairing of these elements.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Substrates",   value: "12"      },
              { label: "Ink grades",   value: "6"       },
              { label: "Paper used",   value: "396.2m²" },
              { label: "Top surface",  value: "S11 · 3.41" },
            ].map(s => (
              <div key={s.label} className="border border-white/10 p-3.5">
                <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-1">{s.label}</div>
                <div className="font-serif text-lg font-light" style={{ color: CYAN }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSTRATES */}
        <section>
          <SectionHead n="01 / The Twelve Papers" title="Substrates"
            note="Introduced in order of use. S11 and S12 are the aristocrats of the archive. S5 and S1 are the floor. The paper decides what gestures are even possible."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBSTRATES.map(s => {
              const aristocrat = s.avg >= 3.2;
              const mid = s.avg >= 2.3;
              const accent = aristocrat ? MAGENTA : mid ? CYAN : DIM;
              return (
                <div key={s.code}
                  className="border border-white/10 p-5 sm:p-6 hover:border-white/25 transition-colors"
                  style={aristocrat ? { borderColor: `${MAGENTA}30`, boxShadow: `inset 0 0 40px ${MAGENTA}06` } : undefined}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-mono text-xs tracking-widest uppercase mb-0.5" style={{ color: accent }}>{s.code}</div>
                      <div className="font-serif text-lg leading-tight">{s.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-2xl font-light" style={{ color: accent }}>{s.avg.toFixed(2)}</div>
                      <div className="font-mono text-[9px] tracking-widest text-muted-foreground">avg</div>
                    </div>
                  </div>

                  {/* Rating bar */}
                  <RatingBar avg={s.avg} color={accent} />

                  {/* Metadata row */}
                  <div className="flex items-center gap-4 mt-3 mb-3 font-mono text-[10px] tracking-wider text-muted-foreground">
                    <span>{s.count} works</span>
                    <span>·</span>
                    <span>{s.phase}</span>
                    <span>·</span>
                    <span>intro {s.introduced}</span>
                  </div>

                  {/* Character */}
                  <p className="font-serif text-sm text-foreground/65 leading-relaxed">{s.character}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SURFACE QUICK RANK */}
        <section>
          <SectionHead n="02 / Surface Performance" title="Ranked by average rating"
            note="All twelve surfaces, ordered by what they returned. The aristocrats are at the top. The floor is at the bottom."
          />
          <div className="border border-white/10 p-5 sm:p-6 space-y-3">
            {SUBSTRATES.map(s => {
              const aristocrat = s.avg >= 3.2;
              const mid = s.avg >= 2.3;
              const accent = aristocrat ? MAGENTA : mid ? CYAN : DIM;
              return (
                <div key={s.code} className="flex items-center gap-3">
                  <div className="w-10 font-mono text-[10px] tracking-widest uppercase text-right shrink-0 text-muted-foreground">{s.code}</div>
                  <div className="flex-1 relative h-7 bg-white/[0.03] overflow-hidden">
                    <div className="absolute inset-y-0 left-0" style={{ width: `${(s.avg / 5) * 100}%`, backgroundColor: accent, opacity: 0.6 }} />
                    <div className="absolute inset-y-0 left-0" style={{ width: `${(s.avg / 5) * 100}%`, boxShadow: `inset -2px 0 0 ${accent}` }} />
                    <div className="absolute inset-0 flex items-center pl-3">
                      <span className="font-mono text-[9px] text-white/35 tracking-wide">{s.name} · {s.count} works</span>
                    </div>
                  </div>
                  <div className="w-12 font-mono text-xs text-right shrink-0" style={{ color: accent }}>{s.avg.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INKS */}
        <section>
          <SectionHead n="03 / The Six Inks" title="Inks"
            note="Two brands, three dilutions each. Yi De Ge runs warm; Xuan Zong runs cooler. The dilution decides whether the mark is structure, body, or atmosphere."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INKS.map(ink => {
              const isYiDeGe = ink.brand === "Yi De Ge";
              const accent = isYiDeGe ? CYAN : MAGENTA;
              const isDense = ink.dilution === "Undiluted";
              return (
                <div key={ink.code}
                  className="border border-white/10 p-5 sm:p-6 hover:border-white/25 transition-colors"
                  style={isDense ? { borderColor: `${accent}25` } : undefined}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-mono text-xs tracking-widest uppercase mb-0.5" style={{ color: accent }}>{ink.code}</div>
                      <div className="font-serif text-lg leading-tight">{ink.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-[10px] tracking-widest uppercase mb-0.5" style={{ color: accent }}>{ink.brand}</div>
                      <div className="font-mono text-[9px] text-muted-foreground">{ink.tone}</div>
                    </div>
                  </div>

                  {/* Dilution indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    {["Undiluted","Working dilution","Heavy dilution"].map((level) => (
                      <div key={level}
                        className="h-1.5 flex-1 rounded-none"
                        style={{
                          backgroundColor: ink.dilution === level ? accent : "rgba(255,255,255,0.07)",
                          opacity: ink.dilution === level ? 0.8 : 1,
                        }}
                      />
                    ))}
                    <span className="font-mono text-[9px] text-muted-foreground tracking-wider whitespace-nowrap">{ink.dilution}</span>
                  </div>

                  {/* Character */}
                  <p className="font-serif text-sm text-foreground/65 leading-relaxed mb-3">{ink.character}</p>

                  {/* Common pairings */}
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-muted-foreground">
                    <span className="uppercase">Common with</span>
                    {ink.pairedWith.map(s => (
                      <span key={s} className="border border-white/15 px-1.5 py-0.5" style={{ color: accent, borderColor: `${accent}25` }}>{s}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INK SYSTEM LOGIC */}
        <section className="border border-white/10 p-6 sm:p-8">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-5">04 / The Ink System</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-serif text-sm text-foreground/70 leading-relaxed">
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: CYAN }}>Dense (MB1, MB4)</div>
              <p>The structural tier. Marks made with undiluted ink are declarations — the first gesture on a surface, the mark that commits the work to a direction. Both brands at maximum concentration.</p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: CYAN }}>Working Dilution (MB2, MB5)</div>
              <p>The primary tier. Most works are built on working-dilution ink. The middle ground where speed and precision coexist. The ink the hand reaches for without deliberation.</p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: CYAN }}>Wash (MB3, MB6)</div>
              <p>The atmospheric tier. Heavy dilution creates tonal ground — the field on which bolder marks land. The difference between a surface that has been prepared and one that has been struck.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/40 italic max-w-2xl">
            Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0, generated 2026-05-07.
            12 substrates · 6 inks · 396.2m² consumed · 294 works.
          </p>
        </section>

      </div>
    </div>
  );
};

export default CrucibleMaterials;
