import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";
const DIM = "rgba(255,255,255,0.25)";
const GRID_LINE = "rgba(255,255,255,0.07)";

// ─── ALL DATA FROM CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (2026-05-07) ─────────

const WEEKLY_ARC = [
  { week: 2,  avg: 1.00, count: 1,  killPct: 100, hrs: 2.5,   area: 2.0,   surface: "S1"  },
  { week: 5,  avg: 1.00, count: 12, killPct: 83,  hrs: 36.0,  area: 12.5,  surface: "S5"  },
  { week: 6,  avg: 1.06, count: 16, killPct: 56,  hrs: 29.0,  area: 16.7,  surface: "S2"  },
  { week: 7,  avg: 1.20, count: 10, killPct: 100, hrs: 10.0,  area: 5.0,   surface: "S8"  },
  { week: 8,  avg: 1.24, count: 21, killPct: 29,  hrs: 23.0,  area: 33.1,  surface: "S4"  },
  { week: 9,  avg: 2.33, count: 15, killPct: 33,  hrs: 30.0,  area: 16.4,  surface: "S6"  },
  { week: 12, avg: 1.68, count: 28, killPct: 46,  hrs: 41.0,  area: 36.2,  surface: "S4"  },
  { week: 13, avg: 1.80, count: 30, killPct: 7,   hrs: 52.5,  area: 21.5,  surface: "S2"  },
  { week: 14, avg: 2.38, count: 26, killPct: 19,  hrs: 47.5,  area: 28.3,  surface: "S3"  },
  { week: 15, avg: 2.83, count: 23, killPct: 17,  hrs: 46.0,  area: 40.2,  surface: "S4"  },
  { week: 16, avg: 3.24, count: 37, killPct: 0,   hrs: 74.0,  area: 64.6,  surface: "S11" },
  { week: 17, avg: 3.12, count: 26, killPct: 0,   hrs: 52.0,  area: 44.2,  surface: "S10" },
  { week: 18, avg: 3.30, count: 27, killPct: 0,   hrs: 54.0,  area: 39.4,  surface: "S3"  },
  { week: 19, avg: 3.67, count: 3,  killPct: 0,   hrs: 6.0,   area: 2.9,   surface: "S6"  },
  { week: 20, avg: 3.74, count: 19, killPct: 0,   hrs: 47.5,  area: 33.2,  surface: "S12" },
];

const PRODUCTION_START_WEEK = 15;

const GAP_WINDOWS = [
  { after: "2025-12-29", before: "2026-01-20", days: 22 },
  { after: "2026-02-01", before: "2026-02-08", days: 7  },
  { after: "2026-02-21", before: "2026-03-14", days: 21 },
  { after: "2026-04-26", before: "2026-05-06", days: 10 },
];

const SAME_DAY_CLUSTERS = [
  { date: "2026-03-14", count: 28 }, { date: "2026-04-08", count: 22 },
  { date: "2026-05-07", count: 19 }, { date: "2026-02-09", count: 17 },
  { date: "2026-03-19", count: 16 }, { date: "2026-04-12", count: 15 },
  { date: "2026-04-21", count: 14 }, { date: "2026-04-03", count: 13 },
  { date: "2026-04-26", count: 13 }, { date: "2026-03-24", count: 12 },
  { date: "2026-04-18", count: 12 }, { date: "2026-04-15", count: 9  },
  { date: "2026-02-16", count: 8  }, { date: "2026-02-01", count: 8  },
  { date: "2026-04-21", count: 5  }, { date: "2026-03-28", count: 4  },
  { date: "2026-01-28", count: 3  }, { date: "2026-01-30", count: 2  },
];

// ─── SVG CHART PRIMITIVES ─────────────────────────────────────────────────────

const PAD = { L: 52, R: 16, T: 24, B: 44 };

const useChartScale = (data: typeof WEEKLY_ARC) => {
  const minWk = data[0].week;
  const maxWk = data[data.length - 1].week;
  const W = 800;
  const H_INNER = (n: number) => n - PAD.T - PAD.B;
  const xFor = (wk: number, w = W) => PAD.L + ((wk - minWk) / (maxWk - minWk)) * (w - PAD.L - PAD.R);
  return { W, minWk, maxWk, xFor, H_INNER };
};

// ─── CHART 1: Quality Arc ─────────────────────────────────────────────────────

const QualityArc = () => {
  const H = 300;
  const { W, xFor, H_INNER } = useChartScale(WEEKLY_ARC);
  const iH = H_INNER(H);
  const yFor = (v: number) => PAD.T + iH - (v / 5) * iH;
  const prodX = xFor(PRODUCTION_START_WEEK);

  const warmup = WEEKLY_ARC.filter(d => d.week <= PRODUCTION_START_WEEK);
  const prod   = WEEKLY_ARC.filter(d => d.week >= PRODUCTION_START_WEEK);
  const pts = (arr: typeof WEEKLY_ARC) => arr.map(d => `${xFor(d.week)},${yFor(d.avg)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[1,2,3,4,5].map(y => (
        <g key={y}>
          <line x1={PAD.L} x2={W-PAD.R} y1={yFor(y)} y2={yFor(y)} stroke={GRID_LINE} strokeWidth="1" />
          <text x={PAD.L-8} y={yFor(y)+4} textAnchor="end" fill={DIM} fontSize="10" fontFamily="monospace">{y}</text>
        </g>
      ))}
      <rect x={prodX} y={PAD.T} width={W-PAD.R-prodX} height={iH} fill={MAGENTA} opacity="0.04" />
      <line x1={prodX} x2={prodX} y1={PAD.T} y2={H-PAD.B} stroke={MAGENTA} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <text x={prodX+6} y={PAD.T+13} fill={MAGENTA} fontSize="9" fontFamily="monospace" letterSpacing="0.1em">T_170 · PRODUCTION</text>
      <polyline points={pts(warmup)} fill="none" stroke={CYAN} strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={pts(prod)} fill="none" stroke={MAGENTA} strokeWidth="2.5" strokeLinejoin="round" />
      {WEEKLY_ARC.map(d => (
        <circle key={d.week} cx={xFor(d.week)} cy={yFor(d.avg)} r="3.5"
          fill={d.week >= PRODUCTION_START_WEEK ? MAGENTA : CYAN} />
      ))}
      <line x1={PAD.L} x2={W-PAD.R} y1={H-PAD.B} y2={H-PAD.B} stroke={DIM} strokeWidth="1" />
      {WEEKLY_ARC.filter((_, i) => i % 2 === 0 || i === WEEKLY_ARC.length - 1).map(d => (
        <text key={d.week} x={xFor(d.week)} y={H-PAD.B+16} textAnchor="middle" fill={DIM} fontSize="9" fontFamily="monospace">W{d.week}</text>
      ))}
      <text x={PAD.L} y={PAD.T-8} fill={DIM} fontSize="9" fontFamily="monospace" letterSpacing="0.15em">AVG RATING</text>
    </svg>
  );
};

// ─── CHART 2: Kill Rate ───────────────────────────────────────────────────────

const KillRateChart = () => {
  const H = 260;
  const { W, xFor, H_INNER } = useChartScale(WEEKLY_ARC);
  const iH = H_INNER(H);
  const barW = ((W - PAD.L - PAD.R) / WEEKLY_ARC.length) - 5;
  const yFor = (v: number) => PAD.T + iH - (v / 100) * iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 25, 50, 75, 100].map(y => (
        <g key={y}>
          <line x1={PAD.L} x2={W-PAD.R} y1={yFor(y)} y2={yFor(y)} stroke={GRID_LINE} strokeWidth="1" />
          <text x={PAD.L-8} y={yFor(y)+4} textAnchor="end" fill={DIM} fontSize="10" fontFamily="monospace">{y}%</text>
        </g>
      ))}
      {WEEKLY_ARC.map((d, i) => {
        const x = PAD.L + (i / WEEKLY_ARC.length) * (W - PAD.L - PAD.R) + 2;
        const y = yFor(d.killPct);
        const h = Math.max(H - PAD.B - y, 1);
        const isProd = d.week >= PRODUCTION_START_WEEK;
        const color = d.killPct === 0 ? "rgba(255,255,255,0.06)" : isProd ? MAGENTA : CYAN;
        return (
          <g key={d.week}>
            <rect x={x} y={y} width={barW} height={h} fill={color} opacity={d.killPct === 0 ? 1 : 0.75} />
            {d.killPct > 0 && (
              <text x={x + barW/2} y={y-4} textAnchor="middle" fill={isProd ? MAGENTA : CYAN} fontSize="9" fontFamily="monospace">{d.killPct}%</text>
            )}
            <text x={x + barW/2} y={H-PAD.B+16} textAnchor="middle" fill={DIM} fontSize="9" fontFamily="monospace">W{d.week}</text>
          </g>
        );
      })}
      <line x1={PAD.L} x2={W-PAD.R} y1={H-PAD.B} y2={H-PAD.B} stroke={DIM} strokeWidth="1" />
      <text x={PAD.L} y={PAD.T-8} fill={DIM} fontSize="9" fontFamily="monospace" letterSpacing="0.15em">KILL RATE %</text>
    </svg>
  );
};

// ─── CHART 3: Weekly Volume (count + area stacked) ───────────────────────────

const VolumeChart = () => {
  const H = 260;
  const { W, xFor, H_INNER } = useChartScale(WEEKLY_ARC);
  const iH = H_INNER(H);
  const maxCount = Math.max(...WEEKLY_ARC.map(d => d.count));
  const barW = ((W - PAD.L - PAD.R) / WEEKLY_ARC.length) - 5;
  const yFor = (v: number) => PAD.T + iH - (v / maxCount) * iH;
  const ticks = [0, Math.round(maxCount * 0.5), maxCount];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {ticks.map(y => (
        <g key={y}>
          <line x1={PAD.L} x2={W-PAD.R} y1={yFor(y)} y2={yFor(y)} stroke={GRID_LINE} strokeWidth="1" />
          <text x={PAD.L-8} y={yFor(y)+4} textAnchor="end" fill={DIM} fontSize="10" fontFamily="monospace">{y}</text>
        </g>
      ))}
      {WEEKLY_ARC.map((d, i) => {
        const x = PAD.L + (i / WEEKLY_ARC.length) * (W - PAD.L - PAD.R) + 2;
        const y = yFor(d.count);
        const h = Math.max(H - PAD.B - y, 1);
        const isProd = d.week >= PRODUCTION_START_WEEK;
        return (
          <g key={d.week}>
            <rect x={x} y={y} width={barW} height={h} fill={isProd ? MAGENTA : CYAN} opacity="0.65" />
            <text x={x + barW/2} y={y - 4} textAnchor="middle" fill="white" fontSize="9" fontFamily="monospace" opacity="0.55">{d.count}</text>
            <text x={x + barW/2} y={H-PAD.B+16} textAnchor="middle" fill={DIM} fontSize="9" fontFamily="monospace">W{d.week}</text>
          </g>
        );
      })}
      <line x1={PAD.L} x2={W-PAD.R} y1={H-PAD.B} y2={H-PAD.B} stroke={DIM} strokeWidth="1" />
      <text x={PAD.L} y={PAD.T-8} fill={DIM} fontSize="9" fontFamily="monospace" letterSpacing="0.15em">WORKS / WEEK</text>
    </svg>
  );
};

// ─── CHART 4: Hours per Week ─────────────────────────────────────────────────

const HoursChart = () => {
  const H = 220;
  const { W, xFor, H_INNER } = useChartScale(WEEKLY_ARC);
  const iH = H_INNER(H);
  const maxHrs = Math.max(...WEEKLY_ARC.map(d => d.hrs));
  const barW = ((W - PAD.L - PAD.R) / WEEKLY_ARC.length) - 5;
  const yFor = (v: number) => PAD.T + iH - (v / maxHrs) * iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 25, 50, 74].map(y => (
        <g key={y}>
          <line x1={PAD.L} x2={W-PAD.R} y1={yFor(y)} y2={yFor(y)} stroke={GRID_LINE} strokeWidth="1" />
          <text x={PAD.L-8} y={yFor(y)+4} textAnchor="end" fill={DIM} fontSize="10" fontFamily="monospace">{y}h</text>
        </g>
      ))}
      {WEEKLY_ARC.map((d, i) => {
        const x = PAD.L + (i / WEEKLY_ARC.length) * (W - PAD.L - PAD.R) + 2;
        const y = yFor(d.hrs);
        const h = Math.max(H - PAD.B - y, 1);
        const isProd = d.week >= PRODUCTION_START_WEEK;
        return (
          <g key={d.week}>
            <rect x={x} y={y} width={barW} height={h} fill={isProd ? MAGENTA : CYAN} opacity="0.5" />
            <text x={x + barW/2} y={y - 3} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0.45">{d.hrs}</text>
            <text x={x + barW/2} y={H-PAD.B+16} textAnchor="middle" fill={DIM} fontSize="9" fontFamily="monospace">W{d.week}</text>
          </g>
        );
      })}
      <line x1={PAD.L} x2={W-PAD.R} y1={H-PAD.B} y2={H-PAD.B} stroke={DIM} strokeWidth="1" />
      <text x={PAD.L} y={PAD.T-8} fill={DIM} fontSize="9" fontFamily="monospace" letterSpacing="0.15em">STUDIO HOURS / WEEK</text>
    </svg>
  );
};

// ─── CHART 5: Area per Week ───────────────────────────────────────────────────

const AreaChart = () => {
  const H = 220;
  const { W, xFor, H_INNER } = useChartScale(WEEKLY_ARC);
  const iH = H_INNER(H);
  const maxArea = Math.max(...WEEKLY_ARC.map(d => d.area));
  const barW = ((W - PAD.L - PAD.R) / WEEKLY_ARC.length) - 5;
  const yFor = (v: number) => PAD.T + iH - (v / maxArea) * iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 20, 40, 64].map(y => (
        <g key={y}>
          <line x1={PAD.L} x2={W-PAD.R} y1={yFor(y)} y2={yFor(y)} stroke={GRID_LINE} strokeWidth="1" />
          <text x={PAD.L-8} y={yFor(y)+4} textAnchor="end" fill={DIM} fontSize="10" fontFamily="monospace">{y}m²</text>
        </g>
      ))}
      {WEEKLY_ARC.map((d, i) => {
        const x = PAD.L + (i / WEEKLY_ARC.length) * (W - PAD.L - PAD.R) + 2;
        const y = yFor(d.area);
        const h = Math.max(H - PAD.B - y, 1);
        const isProd = d.week >= PRODUCTION_START_WEEK;
        return (
          <g key={d.week}>
            <rect x={x} y={y} width={barW} height={h} fill={isProd ? MAGENTA : CYAN} opacity="0.45" />
            <text x={x + barW/2} y={y - 3} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0.4">{d.area}</text>
            <text x={x + barW/2} y={H-PAD.B+16} textAnchor="middle" fill={DIM} fontSize="9" fontFamily="monospace">W{d.week}</text>
          </g>
        );
      })}
      <line x1={PAD.L} x2={W-PAD.R} y1={H-PAD.B} y2={H-PAD.B} stroke={DIM} strokeWidth="1" />
      <text x={PAD.L} y={PAD.T-8} fill={DIM} fontSize="9" fontFamily="monospace" letterSpacing="0.15em">PAPER AREA / WEEK (m²)</text>
    </svg>
  );
};

// ─── SHARED ───────────────────────────────────────────────────────────────────

const ChartWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-white/10 p-4 sm:p-5 bg-neutral-950/50">{children}</div>
);

const ChartBlock = ({ label, note, children }: { label: string; note: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{label}</div>
      <p className="font-serif text-sm text-foreground/60 italic max-w-2xl leading-relaxed">{note}</p>
    </div>
    <ChartWrap>{children}</ChartWrap>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const CrucibleTime = () => {
  const dominantSurfaces = useMemo(() =>
    [...new Set(WEEKLY_ARC.map(d => d.surface))], []);

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
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Section 04 / Time</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">The Year Unfolding</h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
            Five readings of the same year through time. Every variable that has a week number attached to it.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Active Weeks",  value: "20"        },
              { label: "Gap Avg",       value: "0.44 days" },
              { label: "Longest Gap",   value: "22 days"   },
              { label: "Archive Span",  value: "Dec–May"   },
            ].map(s => (
              <div key={s.label} className="border border-white/10 p-3.5">
                <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-1">{s.label}</div>
                <div className="font-serif text-lg font-light" style={{ color: CYAN }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 01 QUALITY ARC */}
        <section className="space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">01 / Quality Arc</div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-3">Average rating, week by week</h2>
            <p className="font-serif text-sm text-foreground/65 italic max-w-2xl leading-relaxed">
              The trajectory from W2 to W20. Cyan is Warm-Up, magenta is Production. T_170 at W15 is where the practice stops rehearsing and starts building. The line does not return below 3.0 after that.
            </p>
          </div>
          <ChartWrap><QualityArc /></ChartWrap>

          {/* Per-week data table */}
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  {["Week","Avg","Count","Kill%","Hours","Area m²","Surface"].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 tracking-widest uppercase text-muted-foreground font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKLY_ARC.map(d => {
                  const isProd = d.week >= PRODUCTION_START_WEEK;
                  return (
                    <tr key={d.week} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 tracking-widest" style={{ color: isProd ? MAGENTA : CYAN }}>W{d.week}</td>
                      <td className="py-2.5 px-3 text-foreground/80">{d.avg.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-foreground/70">{d.count}</td>
                      <td className="py-2.5 px-3" style={{ color: d.killPct === 0 ? "rgba(255,255,255,0.2)" : "rgba(248,113,113,0.8)" }}>
                        {d.killPct > 0 ? `${d.killPct}%` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-foreground/60">{d.hrs}h</td>
                      <td className="py-2.5 px-3 text-foreground/60">{d.area.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{d.surface}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 02 KILL RATE */}
        <section className="space-y-4">
          <ChartBlock
            label="02 / Kill Rate Evolution"
            note="The descent is not smooth. W7 burns everything. W13 saves almost everything. W16 is where the kill rate hits zero and never returns. The Tithe becomes obsolete because the work earned its survival."
          >
            <KillRateChart />
          </ChartBlock>
        </section>

        {/* 03 VOLUME */}
        <section className="space-y-4">
          <ChartBlock
            label="03 / Weekly Volume"
            note="W16 is the production peak: 37 works, 74 hours, 64.6m². W19 is the trough: 3 works, 6 hours. The quiet weeks are recovery or travel, not failure."
          >
            <VolumeChart />
          </ChartBlock>
        </section>

        {/* 04 HOURS */}
        <section className="space-y-4">
          <ChartBlock
            label="04 / Studio Hours per Week"
            note="Hours invested correlates strongly with quality (r=0.643). W16 is the most worked week: 74 hours. The production phase averages more hours per week than the Warm-Up, while producing fewer works — longer sessions, stronger outcomes."
          >
            <HoursChart />
          </ChartBlock>
        </section>

        {/* 05 AREA */}
        <section className="space-y-4">
          <ChartBlock
            label="05 / Paper Consumed per Week"
            note="396.2m² total across the year. W16 consumed 64.6m² in a single week. The production phase has already matched the Warm-Up in total area (206.9m² vs 189.2m²) in fewer works and fewer weeks."
          >
            <AreaChart />
          </ChartBlock>
        </section>

        {/* 06 GAP ANALYSIS */}
        <section>
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">06 / Gap Analysis</div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-3">The silences</h2>
          <p className="font-serif text-sm text-foreground/65 italic max-w-2xl leading-relaxed mb-6">
            Average gap between works: 0.44 days. Standard deviation: 2.06 days. Four significant breaks.
          </p>
          <div className="space-y-3">
            {GAP_WINDOWS.map((g, i) => (
              <div key={i} className="border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-6">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Gap {i + 1}</div>
                  <div className="font-serif text-sm text-foreground/80">{g.after} → {g.before}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-light" style={{ color: CYAN }}>{g.days}</div>
                  <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">days</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 07 ERUPTION CLUSTERS */}
        <section>
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">07 / Same-Day Eruptions</div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-3">When the studio becomes a factory</h2>
          <p className="font-serif text-sm text-foreground/65 italic max-w-2xl leading-relaxed mb-6">
            Days where multiple works were completed in a single session. The biggest eruption days define the character of each phase.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SAME_DAY_CLUSTERS.sort((a, b) => b.count - a.count).slice(0, 12).map((c) => {
              const isLate = c.date >= "2026-04-01";
              return (
                <div key={c.date + c.count} className="border border-white/10 p-3.5"
                  style={{ borderColor: isLate ? `${MAGENTA}20` : `${CYAN}15` }}
                >
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-1">{c.date}</div>
                  <div className="font-serif text-2xl font-light" style={{ color: isLate ? MAGENTA : CYAN }}>{c.count}</div>
                  <div className="font-mono text-[9px] text-muted-foreground">works in one day</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/40 italic max-w-2xl">
            Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0, generated 2026-05-07.
            Archive span: 2025-12-29 → 2026-05-07. 20 active weeks. The year is not finished.
          </p>
        </section>

      </div>
    </div>
  );
};

export default CrucibleTime;
