import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";
const DIM = "rgba(255,255,255,0.35)";

// ─── ALL DATA FROM CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (2026-05-07) ─────────

const SURFACE_RATINGS = [
  { code: "S11", name: "Red Star Moxin Leather", avg: 3.41, count: 34 },
  { code: "S12", name: "Red Star Mo Yun Bark",   avg: 3.38, count: 34 },
  { code: "S10", name: "Red Star Ink Field",      avg: 2.91, count: 22 },
  { code: "S3",  name: "Tan Xi Special Pure",     avg: 2.83, count: 41 },
  { code: "S6",  name: "Red Star Dan Xuan",       avg: 2.38, count: 24 },
  { code: "S7",  name: "Jing Xian Processed",     avg: 2.06, count: 17 },
  { code: "S4",  name: "Tanpi Sandalwood Bark",   avg: 1.89, count: 54 },
  { code: "S2",  name: "Hongxing Fine Mulberry",  avg: 1.76, count: 29 },
  { code: "S9",  name: "Multi-Session Stage",     avg: 1.62, count: 8  },
  { code: "S8",  name: "Heavy Pulp Fiber",        avg: 1.20, count: 10 },
  { code: "S5",  name: "Water-Damaged Lot",       avg: 1.05, count: 20 },
  { code: "S1",  name: "First Test Sheet",        avg: 1.00, count: 1  },
];

const PHASE_SPLIT = {
  warmup:     { count: 169, avg: 1.72, killPct: 38.5, area: 189.2, hrs: 273.5 },
  production: { count: 125, avg: 3.30, killPct: 0.0,  area: 206.9, hrs: 259.5 },
};

const RATING_DISTRIBUTION = [
  { stars: 1, count: 86 },
  { stars: 2, count: 71 },
  { stars: 3, count: 77 },
  { stars: 4, count: 56 },
  { stars: 5, count: 4  },
];

const DISPOSITION = [
  { code: "SA",  label: "Saved — Archive",    count: 227, avg: 2.68, color: CYAN    },
  { code: "PT",  label: "Paused — Tithe",     count: 50,  avg: 1.46, color: "#666"  },
  { code: "TR",  label: "Tithe — Removed",    count: 15,  avg: 1.33, color: "#444"  },
  { code: "SHP", label: "Showcase",           count: 2,   avg: 1.00, color: MAGENTA },
];

const WEEKDAY_DATA = [
  { day: "Mon", count: 26, avg: 1.35 },
  { day: "Tue", count: 46, avg: 2.17 },
  { day: "Wed", count: 43, avg: 3.09 },
  { day: "Thu", count: 36, avg: 2.72 },
  { day: "Fri", count: 25, avg: 2.72 },
  { day: "Sat", count: 46, avg: 2.07 },
  { day: "Sun", count: 72, avg: 2.42 },
];

const MONTHLY_DATA = [
  { month: "Dec 25", count: 1,   avg: 1.00, area: 2.0,   hrs: 2.5,   kills: 1  },
  { month: "Jan 26", count: 20,  avg: 1.05, area: 24.8,  hrs: 36.0,  kills: 12 },
  { month: "Feb 26", count: 54,  avg: 1.50, area: 59.0,  hrs: 74.0,  kills: 28 },
  { month: "Mar 26", count: 84,  avg: 1.94, area: 86.0,  hrs: 141.0, kills: 20 },
  { month: "Apr 26", count: 113, avg: 3.14, area: 188.3, hrs: 226.0, kills: 4  },
  { month: "May 26", count: 22,  avg: 3.73, area: 36.1,  hrs: 53.5,  kills: 0  },
];

const ENERGY_DATA = [
  { state: "Hot",         count: 235, avg: 2.13 },
  { state: "Sustainable", count: 37,  avg: 3.24 },
  { state: "Depleted",    count: 3,   avg: 3.67 },
];

const BODY_CONDITIONS = [
  { label: "Sciatica day", count: 148, avg: 2.34 },
  { label: "Clear day",    count: 127, avg: 2.24 },
  { label: "Walking day",  count: 43,  avg: 1.91 },
  { label: "Non-walking",  count: 232, avg: 2.37 },
];

const HOURS_DATA = [
  { bucket: "0–1h", count: 56,  avg: 1.27 },
  { bucket: "1–2h", count: 214, avg: 2.60 },
  { bucket: "2–3h", count: 24,  avg: 3.17 },
];

const REST_DAYS_DATA = [
  { days: 0, count: 27,  avg: 1.74 },
  { days: 1, count: 75,  avg: 1.99 },
  { days: 2, count: 43,  avg: 2.30 },
  { days: 3, count: 130, avg: 2.59 },
];

const JESTER_DATA = [
  { label: "No Jester", jester: 0, count: 225, avg: 2.22 },
  { label: "Jester ×1", jester: 1, count: 13,  avg: 1.00 },
  { label: "Jester ×2", jester: 2, count: 37,  avg: 3.24 },
];

const STEPS_DATA = [
  { bucket: "3–6k",  count: 205, avg: 2.28 },
  { bucket: "6–9k",  count: 27,  avg: 3.04 },
  { bucket: "9–12k", count: 43,  avg: 1.91 },
];

const ERUPTION_DAYS = [
  { date: "2026-03-14", day: "Sat", count: 28, area: 36.2, avg: 1.68 },
  { date: "2026-04-08", day: "Wed", count: 22, area: 38.4, avg: 3.45 },
  { date: "2026-05-07", day: "Thu", count: 19, area: 33.2, avg: 3.74 },
  { date: "2026-02-09", day: "Mon", count: 17, area: 29.7, avg: 1.00 },
  { date: "2026-03-19", day: "Thu", count: 16, area: 8.0,  avg: 1.62 },
  { date: "2026-04-12", day: "Sun", count: 15, area: 26.2, avg: 2.93 },
  { date: "2026-04-21", day: "Tue", count: 14, area: 17.6, avg: 3.57 },
  { date: "2026-04-03", day: "Fri", count: 13, area: 22.7, avg: 2.85 },
  { date: "2026-04-26", day: "Sun", count: 13, area: 21.7, avg: 3.00 },
  { date: "2026-03-24", day: "Tue", count: 12, area: 11.8, avg: 2.08 },
];

const FIVE_STAR_TCODES = ["T_199", "T_201", "T_249", "T_292"];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const HBar = ({ label, value, max, sub, color }: {
  label: string; value: number; max: number; sub?: string; color?: string;
}) => {
  const pct = Math.min((value / max) * 100, 100);
  const col = color || CYAN;
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 font-mono text-[10px] tracking-widest uppercase text-right shrink-0 text-muted-foreground">{label}</div>
      <div className="flex-1 relative h-8 bg-white/[0.03] overflow-hidden">
        <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, backgroundColor: col, opacity: 0.6 }} />
        <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, boxShadow: `inset -2px 0 0 ${col}` }} />
        {sub && (
          <div className="absolute inset-0 flex items-center pl-3">
            <span className="font-mono text-[9px] text-white/40 tracking-wide">{sub}</span>
          </div>
        )}
      </div>
      <div className="w-14 font-mono text-xs text-right shrink-0 text-foreground/80">
        {Number.isInteger(value) ? value : value.toFixed(2)}
      </div>
    </div>
  );
};

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-white/10 p-5 sm:p-6 bg-neutral-950/40 ${className}`}>{children}</div>
);

const PanelLabel = ({ children }: { children: string }) => (
  <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-4">{children}</div>
);

const PanelNote = ({ children }: { children: string }) => (
  <p className="font-serif text-xs text-foreground/50 italic pt-3 leading-relaxed">{children}</p>
);

const SectionHead = ({ n, title, note }: { n: string; title: string; note?: string }) => (
  <div className="space-y-2 mb-8">
    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{n}</div>
    <h2 className="text-2xl sm:text-3xl font-light tracking-tight">{title}</h2>
    {note && <p className="font-serif text-sm text-foreground/60 italic max-w-2xl leading-relaxed">{note}</p>}
  </div>
);

// ─── FIVE STAR GRID (live data) ───────────────────────────────────────────────

const FiveStarGrid = () => {
  const { data, isLoading } = trpc.gallery.getAll.useQuery({ phase: "Crucible", sort: "year-desc" });
  const works = useMemo(() => {
    if (!data?.items) return [] as any[];
    const set = new Set(FIVE_STAR_TCODES);
    return data.items
      .filter((w: any) => set.has(w.tCode))
      .sort((a: any, b: any) => parseInt(a.tCode.replace("T_", "")) - parseInt(b.tCode.replace("T_", "")));
  }, [data]);

  if (isLoading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: MAGENTA }} />
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {works.map((w: any) => (
        <Link key={w.id} href={`/works/${w.slug}`}
          className="group relative aspect-square overflow-hidden bg-neutral-950"
          style={{ boxShadow: `0 0 0 1px ${MAGENTA}25` }}
        >
          <img src={w.thumbnailUrl || w.imageUrl} alt={w.tCode}
            loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="font-mono text-[9px] tracking-widest text-white/60">{w.tCode}</div>
            <div className="font-serif text-sm leading-tight" style={{ color: MAGENTA }}>{w.title}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const CrucibleAnatomy = () => {
  const maxMonthCount = Math.max(...MONTHLY_DATA.map(m => m.count));

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-20 sm:space-y-28">

        <Link href="/crucible"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-[#00FFCC] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> The Crucible
        </Link>

        {/* HEADER */}
        <div className="space-y-6">
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Section 05 / Anatomy</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">Anatomy of the Year</h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
            The archive without time as the axis. Every variable measured. Every condition examined.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Works",  value: "294",       accent: CYAN    },
              { label: "Paper Used",   value: "396.2 m²",  accent: CYAN    },
              { label: "Hours",        value: "533.0",     accent: CYAN    },
              { label: "Killed",       value: "65 · 22.1%",accent: "#f87171" },
            ].map(s => (
              <div key={s.label} className="border border-white/10 p-4">
                <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-1.5">{s.label}</div>
                <div className="font-serif text-xl sm:text-2xl font-light" style={{ color: s.accent }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 01 PHASE SPLIT */}
        <section>
          <SectionHead n="01 / Phase Split" title="Before T_170, after T_170"
            note="Same studio. Same artist. Same year. The numbers stop being comparable at T_170."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              { label: "Warm-Up",    range: "T_001–T_169", color: CYAN,    d: PHASE_SPLIT.warmup    },
              { label: "Production", range: "T_170–T_294", color: MAGENTA, d: PHASE_SPLIT.production },
            ] as const).map(({ label, range, color, d }) => (
              <div key={label} className="border p-6 space-y-5" style={{ borderColor: `${color}25` }}>
                <div>
                  <div className="font-mono text-xs tracking-widest uppercase mb-0.5" style={{ color }}>{label}</div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground">{range}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: "Works",      v: String(d.count)           },
                    { k: "Avg Rating", v: d.avg.toFixed(2)          },
                    { k: "Kill Rate",  v: `${d.killPct}%`           },
                    { k: "Area",       v: `${d.area} m²`            },
                    { k: "Hours",      v: `${d.hrs}h`               },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-0.5">{k}</div>
                      <div className="font-serif text-xl font-light">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 02 SURFACE ARISTOCRACY */}
        <section>
          <SectionHead n="02 / Surface Aristocracy" title="Which papers produced the strongest work"
            note="Average rating per substrate, ranked. The paper decides what gestures are even possible."
          />
          <Panel>
            <div className="space-y-2.5">
              {SURFACE_RATINGS.map(s => {
                const color = s.avg >= 3.2 ? MAGENTA : s.avg >= 2.5 ? CYAN : DIM;
                return (
                  <HBar key={s.code} label={s.code} value={s.avg} max={5}
                    sub={`${s.name} · ${s.count} works`} color={color}
                  />
                );
              })}
            </div>
          </Panel>
        </section>

        {/* 03 RATING DISTRIBUTION */}
        <section>
          <SectionHead n="03 / Rating Distribution" title="The shape of the year"
            note="294 works, five levels. The lower bands carry the Warm-Up; the upper bands are the Production phase earning its name."
          />
          <Panel>
            <div className="space-y-2.5">
              {RATING_DISTRIBUTION.map(d => (
                <HBar key={d.stars}
                  label={"★".repeat(d.stars)}
                  value={d.count}
                  max={Math.max(...RATING_DISTRIBUTION.map(x => x.count))}
                  sub={`${d.count} works`}
                  color={d.stars === 5 ? MAGENTA : d.stars === 4 ? CYAN : DIM}
                />
              ))}
            </div>
          </Panel>
        </section>

        {/* 04 DISPOSITION */}
        <section>
          <SectionHead n="04 / Disposition" title="What happened to each work"
            note="SA = archived. PT = held pending. TR = tithe, destroyed. SHP = showcase. Two SHP works exist: T_036 and T_038, both rated 1.0, both made on 2026-02-09."
          />
          <Panel>
            <div className="space-y-2.5">
              {DISPOSITION.map(d => (
                <HBar key={d.code} label={d.code} value={d.count} max={294}
                  sub={`${d.label} · avg ${d.avg.toFixed(2)}`} color={d.color}
                />
              ))}
            </div>
          </Panel>
        </section>

        {/* 05 MONTHLY ARC */}
        <section>
          <SectionHead n="05 / Monthly Arc" title="The year month by month"
            note="Output accelerated every month without exception. April alone is 38% of all works ever made. May has already killed zero."
          />
          <div className="space-y-3">
            {MONTHLY_DATA.map((m, i) => {
              const isLate = i >= 4;
              const barPct = (m.count / maxMonthCount) * 100;
              return (
                <div key={m.month} className="border border-white/10 p-4 sm:p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="font-mono text-xs tracking-widest uppercase" style={{ color: isLate ? MAGENTA : CYAN }}>{m.month}</div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-wider">{m.count} works · avg {m.avg.toFixed(2)}</div>
                  </div>
                  <div className="relative h-2 bg-white/[0.05] mb-3">
                    <div className="absolute inset-y-0 left-0" style={{ width: `${barPct}%`, backgroundColor: isLate ? MAGENTA : CYAN, opacity: 0.7 }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-muted-foreground">
                    <div><span className="text-foreground/60">{m.area.toFixed(1)}m²</span> paper</div>
                    <div><span className="text-foreground/60">{m.hrs}h</span> studio</div>
                    <div><span className={m.kills > 0 ? "text-red-400/70" : "text-white/20"}>{m.kills}</span> kills</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 06 WEEKDAY PATTERNS */}
        <section>
          <SectionHead n="06 / Weekday Patterns" title="When the strongest work gets made"
            note="Wednesday outperforms every other day by a clear margin. Sunday produces the most volume. Monday is the worst day to make art."
          />
          <Panel>
            <div className="space-y-2.5">
              {WEEKDAY_DATA.map(d => (
                <div key={d.day} className="flex items-center gap-3">
                  <div className="w-10 font-mono text-[10px] tracking-widest uppercase text-muted-foreground text-right shrink-0">{d.day}</div>
                  <div className="flex-1 relative h-8 bg-white/[0.03] overflow-hidden">
                    <div className="absolute inset-y-0 left-0"
                      style={{ width: `${(d.count / 72) * 100}%`, backgroundColor: d.day === "Wed" ? MAGENTA : CYAN, opacity: 0.55 }}
                    />
                    <div className="absolute inset-0 flex items-center pl-3">
                      <span className="font-mono text-[9px] text-white/35">{d.count} works</span>
                    </div>
                  </div>
                  <div className="w-12 font-mono text-xs text-right shrink-0"
                    style={{ color: d.avg >= 3 ? MAGENTA : d.avg >= 2.5 ? CYAN : DIM }}>
                    {d.avg.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* 07 ERUPTION DAYS */}
        <section>
          <SectionHead n="07 / Eruption Days" title="The ten biggest production bursts"
            note="Mar 14: 28 works, avg 1.68 — the Warm-Up peak, almost all destroyed. Apr 8: 22 works, avg 3.45 — the Production peak, nothing destroyed."
          />
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  {["Date", "Day", "Works", "Area", "Avg Rating"].map(h => (
                    <th key={h} className="text-left py-3 px-4 tracking-widest uppercase text-muted-foreground font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ERUPTION_DAYS.map((d) => {
                  const isProd = d.avg >= 2.5;
                  return (
                    <tr key={d.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4" style={{ color: isProd ? MAGENTA : CYAN }}>{d.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{d.day}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-foreground">{d.count}</span>
                          <span className="h-1 rounded-full inline-block align-middle"
                            style={{ width: `${d.count * 2.5}px`, backgroundColor: isProd ? MAGENTA : CYAN, opacity: 0.45 }}
                          />
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">{d.area.toFixed(1)}m²</td>
                      <td className="py-3 px-4" style={{ color: isProd ? MAGENTA : DIM }}>{d.avg.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 08 AMBIENT CONDITIONS */}
        <section>
          <SectionHead n="08 / Ambient Conditions" title="What the body was doing"
            note="Energy state, physical condition, movement patterns, Jester frequency, rest days, step counts — every ambient variable correlated against quality."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Panel>
              <PanelLabel>Energy State vs Avg Rating</PanelLabel>
              <div className="space-y-2.5">
                {ENERGY_DATA.map(d => (
                  <HBar key={d.state} label={d.state} value={d.avg} max={5}
                    sub={`n=${d.count}`}
                    color={d.state === "Depleted" ? MAGENTA : d.state === "Sustainable" ? CYAN : DIM}
                  />
                ))}
              </div>
              <PanelNote>Depleted sessions averaged the highest rating. Sustainable beats hot. Running on fumes outperforms running hot.</PanelNote>
            </Panel>

            <Panel>
              <PanelLabel>Body Conditions vs Avg Rating</PanelLabel>
              <div className="space-y-2.5">
                {BODY_CONDITIONS.map(d => (
                  <HBar key={d.label} label={d.label.split(" ")[0]} value={d.avg} max={5}
                    sub={`${d.label} · n=${d.count}`}
                    color={d.avg >= 2.3 ? CYAN : DIM}
                  />
                ))}
              </div>
              <PanelNote>Sciatica days marginally outperform clear days. Walking days are the weakest for quality — the body is elsewhere.</PanelNote>
            </Panel>

            <Panel>
              <PanelLabel>Hours per Work vs Avg Rating</PanelLabel>
              <div className="space-y-2.5">
                {HOURS_DATA.map(d => (
                  <HBar key={d.bucket} label={d.bucket} value={d.avg} max={5}
                    sub={`n=${d.count} works`}
                    color={d.avg >= 3 ? MAGENTA : CYAN}
                  />
                ))}
              </div>
              <PanelNote>Strong correlation: hours invested predicts quality. r=0.643 (STRONG). The one-hour work is almost never the strong work.</PanelNote>
            </Panel>

            <Panel>
              <PanelLabel>Rest Days Before Session vs Rating</PanelLabel>
              <div className="space-y-2.5">
                {REST_DAYS_DATA.map(d => (
                  <HBar key={d.days} label={`${d.days}d rest`} value={d.avg} max={5}
                    sub={`n=${d.count}`}
                    color={d.days >= 3 ? CYAN : DIM}
                  />
                ))}
              </div>
              <PanelNote>More prior rest = better output. Three rest days before a session is the structural sweet spot. n=130 confirm it.</PanelNote>
            </Panel>

            <Panel>
              <PanelLabel>Jester Frequency vs Rating</PanelLabel>
              <div className="space-y-2.5">
                {JESTER_DATA.map(d => (
                  <HBar key={d.jester} label={d.label} value={d.avg} max={5}
                    sub={`n=${d.count}`}
                    color={d.jester === 2 ? MAGENTA : d.jester === 0 ? CYAN : DIM}
                  />
                ))}
              </div>
              <PanelNote>Jester ×1 collapses to 1.00 avg — a functionally dead week. Jester ×2 at 3.24 is the paradox. The pattern hasn't resolved.</PanelNote>
            </Panel>

            <Panel>
              <PanelLabel>Daily Steps vs Rating</PanelLabel>
              <div className="space-y-2.5">
                {STEPS_DATA.map(d => (
                  <HBar key={d.bucket} label={d.bucket} value={d.avg} max={5}
                    sub={`n=${d.count}`}
                    color={d.avg >= 3 ? MAGENTA : CYAN}
                  />
                ))}
              </div>
              <PanelNote>6–9k is the quality window. High-step days (mega walks) correlate with lower output — the body is spent before the studio. r=−0.178 (noise overall).</PanelNote>
            </Panel>
          </div>
        </section>

        {/* 09 FIVE-STAR WORKS */}
        <section>
          <SectionHead n="09 / The Five-Star Works" title="Four survivors"
            note="T_199 · T_201 from W16 on S11. T_249 from W18 on S3. T_292 from W20 on S12. Three surfaces. Three weeks. One standard."
          />
          <FiveStarGrid />
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/40 italic max-w-2xl">
            Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0, generated 2026-05-07.
            294 works · 20 active weeks · 396.2m² executed · 533 hours tracked.
            The year is not finished.
          </p>
        </section>

      </div>
    </div>
  );
};

export default CrucibleAnatomy;
