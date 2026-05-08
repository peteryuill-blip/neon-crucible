import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

interface WeekDatum {
  week: number;
  avg: number;
  count: number;
  killPct: number;
}

// Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (generated 2026-05-07).
const WEEKLY_ARC: WeekDatum[] = [
  { week: 2,  avg: 1.00, count: 1,  killPct: 100 },
  { week: 5,  avg: 1.00, count: 12, killPct: 83  },
  { week: 6,  avg: 1.06, count: 16, killPct: 56  },
  { week: 7,  avg: 1.20, count: 10, killPct: 100 },
  { week: 8,  avg: 1.24, count: 21, killPct: 29  },
  { week: 9,  avg: 2.33, count: 15, killPct: 33  },
  { week: 12, avg: 1.68, count: 28, killPct: 46  },
  { week: 13, avg: 1.80, count: 30, killPct: 7   },
  { week: 14, avg: 2.38, count: 26, killPct: 19  },
  { week: 15, avg: 2.83, count: 23, killPct: 17  },
  { week: 16, avg: 3.24, count: 37, killPct: 0   },
  { week: 17, avg: 3.12, count: 26, killPct: 0   },
  { week: 18, avg: 3.30, count: 27, killPct: 0   },
  { week: 19, avg: 3.67, count: 3,  killPct: 0   },
  { week: 20, avg: 3.74, count: 19, killPct: 0   },
];

// Production phase begins at W15 (T_170 created here).
const PRODUCTION_START_WEEK = 15;

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";
const GRID = "rgba(255,255,255,0.08)";
const AXIS = "rgba(255,255,255,0.4)";

// ============================================================
// Quality Arc — line chart of average rating per week.
// ============================================================
const QualityArc = () => {
  const W = 800;
  const H = 320;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 40;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const minWeek = WEEKLY_ARC[0].week;
  const maxWeek = WEEKLY_ARC[WEEKLY_ARC.length - 1].week;
  const yMax = 5;

  const xFor = (week: number) =>
    PAD_L + ((week - minWeek) / (maxWeek - minWeek)) * innerW;
  const yFor = (avg: number) => PAD_T + innerH - (avg / yMax) * innerH;

  const points = WEEKLY_ARC.map((d) => `${xFor(d.week)},${yFor(d.avg)}`).join(" ");

  // Split into pre/post production for two-tone polyline.
  const warmupPoints = WEEKLY_ARC
    .filter((d) => d.week <= PRODUCTION_START_WEEK)
    .map((d) => `${xFor(d.week)},${yFor(d.avg)}`)
    .join(" ");
  const productionPoints = WEEKLY_ARC
    .filter((d) => d.week >= PRODUCTION_START_WEEK)
    .map((d) => `${xFor(d.week)},${yFor(d.avg)}`)
    .join(" ");

  const productionX = xFor(PRODUCTION_START_WEEK);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Y-axis grid */}
      {[1, 2, 3, 4, 5].map((y) => (
        <g key={y}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yFor(y)}
            y2={yFor(y)}
            stroke={GRID}
            strokeWidth="1"
          />
          <text
            x={PAD_L - 10}
            y={yFor(y) + 4}
            textAnchor="end"
            fill={AXIS}
            fontSize="10"
            fontFamily="monospace"
          >
            {y}.0
          </text>
        </g>
      ))}

      {/* Production phase shaded region */}
      <rect
        x={productionX}
        y={PAD_T}
        width={W - PAD_R - productionX}
        height={innerH}
        fill={MAGENTA}
        opacity="0.05"
      />

      {/* Production phase marker line */}
      <line
        x1={productionX}
        x2={productionX}
        y1={PAD_T}
        y2={H - PAD_B}
        stroke={MAGENTA}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <text
        x={productionX + 6}
        y={PAD_T + 14}
        fill={MAGENTA}
        fontSize="10"
        fontFamily="monospace"
        letterSpacing="0.1em"
      >
        T_170 · PRODUCTION
      </text>

      {/* Lines */}
      <polyline points={warmupPoints} fill="none" stroke={CYAN} strokeWidth="2" />
      <polyline points={productionPoints} fill="none" stroke={MAGENTA} strokeWidth="2" />

      {/* Points */}
      {WEEKLY_ARC.map((d) => {
        const isProd = d.week >= PRODUCTION_START_WEEK;
        return (
          <circle
            key={d.week}
            cx={xFor(d.week)}
            cy={yFor(d.avg)}
            r="3"
            fill={isProd ? MAGENTA : CYAN}
          />
        );
      })}

      {/* X-axis */}
      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={H - PAD_B}
        y2={H - PAD_B}
        stroke={AXIS}
        strokeWidth="1"
      />
      {WEEKLY_ARC.map((d, i) => {
        // Skip every other label on small renderings to reduce crowding.
        if (i % 2 !== 0 && i !== WEEKLY_ARC.length - 1) return null;
        return (
          <text
            key={d.week}
            x={xFor(d.week)}
            y={H - PAD_B + 16}
            textAnchor="middle"
            fill={AXIS}
            fontSize="10"
            fontFamily="monospace"
          >
            W{d.week}
          </text>
        );
      })}

      {/* Axis labels */}
      <text
        x={PAD_L}
        y={PAD_T - 6}
        fill={AXIS}
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="0.15em"
      >
        AVG RATING
      </text>
    </svg>
  );
};

// ============================================================
// Kill Rate — bar chart of % killed per week.
// ============================================================
const KillRate = () => {
  const W = 800;
  const H = 280;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 40;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const barWidth = innerW / WEEKLY_ARC.length - 4;
  const yFor = (pct: number) => PAD_T + innerH - (pct / 100) * innerH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {[0, 25, 50, 75, 100].map((y) => (
        <g key={y}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yFor(y)}
            y2={yFor(y)}
            stroke={GRID}
            strokeWidth="1"
          />
          <text
            x={PAD_L - 10}
            y={yFor(y) + 4}
            textAnchor="end"
            fill={AXIS}
            fontSize="10"
            fontFamily="monospace"
          >
            {y}%
          </text>
        </g>
      ))}

      {/* Bars */}
      {WEEKLY_ARC.map((d, i) => {
        const x = PAD_L + (i / WEEKLY_ARC.length) * innerW + 2;
        const y = yFor(d.killPct);
        const h = H - PAD_B - y;
        const isProd = d.week >= PRODUCTION_START_WEEK;
        const color = d.killPct === 0 ? "rgba(255,255,255,0.08)" : isProd ? MAGENTA : CYAN;
        return (
          <g key={d.week}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 1)}
              fill={color}
              opacity={d.killPct === 0 ? 0.4 : 0.85}
            />
            <text
              x={x + barWidth / 2}
              y={H - PAD_B + 16}
              textAnchor="middle"
              fill={AXIS}
              fontSize="9"
              fontFamily="monospace"
            >
              W{d.week}
            </text>
          </g>
        );
      })}

      {/* X-axis */}
      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={H - PAD_B}
        y2={H - PAD_B}
        stroke={AXIS}
        strokeWidth="1"
      />

      <text
        x={PAD_L}
        y={PAD_T - 6}
        fill={AXIS}
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="0.15em"
      >
        KILL RATE
      </text>
    </svg>
  );
};

// ============================================================
// Production Volume — bar chart of work count per week.
// ============================================================
const ProductionVolume = () => {
  const W = 800;
  const H = 280;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 40;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const maxCount = useMemo(
    () => Math.max(...WEEKLY_ARC.map((d) => d.count)),
    []
  );
  // Round up to a nice tick.
  const yMax = Math.ceil(maxCount / 10) * 10;

  const barWidth = innerW / WEEKLY_ARC.length - 4;
  const yFor = (n: number) => PAD_T + innerH - (n / yMax) * innerH;

  const ticks = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {ticks.map((y) => (
        <g key={y}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yFor(y)}
            y2={yFor(y)}
            stroke={GRID}
            strokeWidth="1"
          />
          <text
            x={PAD_L - 10}
            y={yFor(y) + 4}
            textAnchor="end"
            fill={AXIS}
            fontSize="10"
            fontFamily="monospace"
          >
            {Math.round(y)}
          </text>
        </g>
      ))}

      {WEEKLY_ARC.map((d, i) => {
        const x = PAD_L + (i / WEEKLY_ARC.length) * innerW + 2;
        const y = yFor(d.count);
        const h = H - PAD_B - y;
        const isProd = d.week >= PRODUCTION_START_WEEK;
        return (
          <g key={d.week}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 1)}
              fill={isProd ? MAGENTA : CYAN}
              opacity="0.75"
            />
            <text
              x={x + barWidth / 2}
              y={y - 4}
              textAnchor="middle"
              fill="white"
              fontSize="9"
              fontFamily="monospace"
              opacity="0.6"
            >
              {d.count}
            </text>
            <text
              x={x + barWidth / 2}
              y={H - PAD_B + 16}
              textAnchor="middle"
              fill={AXIS}
              fontSize="9"
              fontFamily="monospace"
            >
              W{d.week}
            </text>
          </g>
        );
      })}

      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={H - PAD_B}
        y2={H - PAD_B}
        stroke={AXIS}
        strokeWidth="1"
      />

      <text
        x={PAD_L}
        y={PAD_T - 6}
        fill={AXIS}
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="0.15em"
      >
        WORKS / WEEK
      </text>
    </svg>
  );
};

const CrucibleTime = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">
        <Link
          href="/crucible"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-[#00FFCC] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          The Crucible
        </Link>

        <div className="space-y-6">
          <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Section 04 / Time
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">
            The Year Unfolding
          </h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            Three readings of the same year, each from a different angle. The
            data is honest. Every work in the archive carried a rating; every
            week carried a kill rate. The arc shows what happened.
          </p>
        </div>

        {/* Quality Arc */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              01 / Quality Arc
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Average rating, week by week
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            The trajectory from W2 to W20. Cyan is the Warm-Up phase, magenta
            the Production phase. T_170, made in W15, is the inflection where
            the practice stops rehearsing and starts building.
          </p>
          <div className="border border-white/10 p-4 sm:p-6 bg-neutral-950/50">
            <QualityArc />
          </div>
        </section>

        {/* Kill Rate */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              02 / Kill Rate Evolution
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              The Tithe falls silent
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            The descent is uneven. W7 burns everything; W13 saves almost
            everything. The structural break comes at W16: kill rate hits
            zero and never returns. The Tithe becomes obsolete because the
            work has earned its survival.
          </p>
          <div className="border border-white/10 p-4 sm:p-6 bg-neutral-950/50">
            <KillRate />
          </div>
        </section>

        {/* Volume */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              03 / Weekly Volume
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              How much, when
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            Eruption days and burst weeks. The peaks are when a substrate-ink
            pairing locked in and the studio became a production line. The
            troughs are recovery, travel, or paper running out.
          </p>
          <div className="border border-white/10 p-4 sm:p-6 bg-neutral-950/50">
            <ProductionVolume />
          </div>
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/60 italic max-w-2xl">
            The year is not finished. These charts will keep moving until W52.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CrucibleTime;
