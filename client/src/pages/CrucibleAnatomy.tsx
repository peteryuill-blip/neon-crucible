import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";
const GRID = "rgba(255,255,255,0.08)";
const AXIS = "rgba(255,255,255,0.4)";

interface CrucibleWork {
  id: number;
  tCode: string;
  sovereignId: string;
  title: string;
  slug: string;
  rating: number;
  surface: string;
  surfaceName: string;
  thumbnailUrl: string;
  imageUrl: string;
  dimensions: string;
}

// Source: CY_HYPER_UNIFIED_FEATURE_MATRIX V7.0 (generated 2026-05-07).
// Surface average ratings, sorted descending.
const SURFACE_RATINGS = [
  { code: "S11", avg: 3.41 },
  { code: "S12", avg: 3.38 },
  { code: "S10", avg: 2.91 },
  { code: "S3",  avg: 2.83 },
  { code: "S6",  avg: 2.38 },
  { code: "S7",  avg: 2.06 },
  { code: "S4",  avg: 1.89 },
  { code: "S2",  avg: 1.76 },
  { code: "S9",  avg: 1.62 },
  { code: "S8",  avg: 1.20 },
  { code: "S5",  avg: 1.05 },
  { code: "S1",  avg: 1.00 },
];

const PHASE_SPLIT = {
  warmup:     { count: 169, avg: 1.72, killPct: 39, area: 189.2 },
  production: { count: 125, avg: 3.30, killPct: 0,  area: 206.9 },
};

const RATING_DISTRIBUTION = [
  { stars: 1, count: 86 },
  { stars: 2, count: 71 },
  { stars: 3, count: 77 },
  { stars: 4, count: 56 },
  { stars: 5, count: 4  },
];

const FIVE_STAR_TCODES = [
  "T_199", "T_201", "T_249", "T_292",
];

// ============================================================
// Panel 1: Surface Aristocracy — horizontal bar chart
// ============================================================
const SurfaceAristocracy = () => {
  const max = 5;
  return (
    <div className="space-y-2">
      {SURFACE_RATINGS.map((s) => {
        const pct = (s.avg / max) * 100;
        const aristocrat = s.avg >= 3.2;
        const color = aristocrat ? MAGENTA : CYAN;
        return (
          <div key={s.code} className="flex items-center gap-3">
            <div className="w-10 font-mono text-xs tracking-widest uppercase text-muted-foreground">
              {s.code}
            </div>
            <div className="flex-1 relative h-7 bg-white/[0.03] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: color,
                  opacity: 0.7,
                }}
              />
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${pct}%`,
                  boxShadow: `inset -2px 0 0 ${color}`,
                }}
              />
            </div>
            <div className="w-12 font-mono text-xs text-right text-foreground/80">
              {s.avg.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// Panel 2: Phase Split — two columns side by side
// ============================================================
const PhaseSplit = () => {
  const Stat = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
    <div>
      <div
        className="font-mono text-[10px] tracking-widest uppercase mb-1"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="font-serif text-2xl sm:text-3xl font-light tracking-tight">
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        className="border p-6 sm:p-8 space-y-6"
        style={{ borderColor: `${CYAN}30` }}
      >
        <div className="space-y-1">
          <div className="font-mono text-xs tracking-widest uppercase" style={{ color: CYAN }}>
            Warm-Up Phase
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            T_001 — T_169
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Stat label="Works" value={String(PHASE_SPLIT.warmup.count)} accent={CYAN} />
          <Stat label="Avg Rating" value={PHASE_SPLIT.warmup.avg.toFixed(2)} accent={CYAN} />
          <Stat label="Kill Rate" value={`${PHASE_SPLIT.warmup.killPct}%`} accent={CYAN} />
          <Stat label="Surface" value={`${PHASE_SPLIT.warmup.area} m²`} accent={CYAN} />
        </div>
      </div>

      <div
        className="border p-6 sm:p-8 space-y-6"
        style={{ borderColor: `${MAGENTA}30` }}
      >
        <div className="space-y-1">
          <div className="font-mono text-xs tracking-widest uppercase" style={{ color: MAGENTA }}>
            Production Phase
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            T_170 — T_294
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Stat label="Works" value={String(PHASE_SPLIT.production.count)} accent={MAGENTA} />
          <Stat label="Avg Rating" value={PHASE_SPLIT.production.avg.toFixed(2)} accent={MAGENTA} />
          <Stat label="Kill Rate" value={`${PHASE_SPLIT.production.killPct}%`} accent={MAGENTA} />
          <Stat label="Surface" value={`${PHASE_SPLIT.production.area} m²`} accent={MAGENTA} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Panel 3: Rating Distribution — histogram
// ============================================================
const RatingDistribution = () => {
  const W = 800;
  const H = 280;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 30;
  const PAD_B = 50;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const max = Math.max(...RATING_DISTRIBUTION.map((d) => d.count));
  const yMax = Math.ceil(max / 25) * 25;
  const barWidth = innerW / RATING_DISTRIBUTION.length - 20;

  const yFor = (n: number) => PAD_T + innerH - (n / yMax) * innerH;
  const ticks = [0, yMax / 2, yMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {ticks.map((y) => (
        <g key={y}>
          <line x1={PAD_L} x2={W - PAD_R} y1={yFor(y)} y2={yFor(y)} stroke={GRID} strokeWidth="1" />
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

      {RATING_DISTRIBUTION.map((d, i) => {
        const x = PAD_L + (i / RATING_DISTRIBUTION.length) * innerW + 10;
        const y = yFor(d.count);
        const h = H - PAD_B - y;
        const isFive = d.stars === 5;
        const color = isFive ? MAGENTA : CYAN;
        return (
          <g key={d.stars}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 1)}
              fill={color}
              opacity={isFive ? 0.85 : 0.55}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontFamily="monospace"
              fontWeight="500"
            >
              {d.count}
            </text>
            <text
              x={x + barWidth / 2}
              y={H - PAD_B + 22}
              textAnchor="middle"
              fill={AXIS}
              fontSize="11"
              fontFamily="monospace"
              letterSpacing="0.15em"
            >
              {"★".repeat(d.stars)}
            </text>
          </g>
        );
      })}

      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke={AXIS} strokeWidth="1" />
    </svg>
  );
};

// ============================================================
// Panel 4: Five-Star Works — grid pulled from live data
// ============================================================
const FiveStarGrid = () => {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery({
    phase: "Crucible",
    sort: "year-desc",
  });

  const fiveStars = useMemo(() => {
    if (!data?.items) return [] as CrucibleWork[];
    const set = new Set(FIVE_STAR_TCODES);
    return (data.items as CrucibleWork[])
      .filter((w) => set.has(w.tCode))
      .sort((a, b) => {
        const an = parseInt(a.tCode.replace("T_", ""), 10);
        const bn = parseInt(b.tCode.replace("T_", ""), 10);
        return an - bn;
      });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#d946ef]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-mono text-xs text-red-400 py-8 text-center">
        Could not load five-star works.
      </div>
    );
  }

  if (fiveStars.length === 0) {
    return (
      <div className="font-mono text-xs text-muted-foreground py-8 text-center">
        Five-star works not yet published.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {fiveStars.map((w) => (
        <Link
          key={w.id}
          href={`/works/${w.slug}`}
          className="group relative aspect-square overflow-hidden bg-neutral-950"
          style={{ boxShadow: `0 0 0 1px ${MAGENTA}30` }}
        >
          <img
            src={w.thumbnailUrl || w.imageUrl}
            alt={`${w.title} (${w.tCode})`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="font-mono text-[9px] tracking-widest uppercase text-white/70">
              {w.tCode}
            </div>
            <div
              className="font-serif text-sm leading-tight"
              style={{ color: MAGENTA }}
            >
              {w.title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const CrucibleAnatomy = () => {
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
            Section 05 / Anatomy
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter">
            Anatomy of the Year
          </h1>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The same archive without time as the axis. Surface against rating.
            Phase against phase. Distribution and apex. What the year added up
            to, looked at sideways.
          </p>
        </div>

        {/* Panel 1 */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              01 / Surface Aristocracy
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Which papers produced the strongest work
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            Average rating per substrate, ranked. S11 and S12 are the
            aristocrats. S1 and S5 are the floor. Paper does not just receive
            the gesture; it decides what gestures are even possible.
          </p>
          <div className="border border-white/10 p-6 sm:p-8 bg-neutral-950/50">
            <SurfaceAristocracy />
          </div>
        </section>

        {/* Panel 2 */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              02 / Phase Split
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Before T_170, after T_170
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            Same studio. Same artist. Same year. The numbers stop being
            comparable at T_170 — that is what an inflection point looks like
            in a ledger.
          </p>
          <PhaseSplit />
        </section>

        {/* Panel 3 */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              03 / Rating Distribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              The shape of the year
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            294 works rated. Most live in the lower-middle band. The five-star
            tier is the rarest outcome — only four works across the entire
            year so far.
          </p>
          <div className="border border-white/10 p-4 sm:p-6 bg-neutral-950/50">
            <RatingDistribution />
          </div>
        </section>

        {/* Panel 4 */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              04 / The Five-Star Works
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
              Four survivors
            </h2>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/70 max-w-2xl leading-relaxed">
            The works that earned the highest rating the practice gives.
            Each one is its own argument. Two of the four were made in W18
            and W20 — the production phase coming into its own.
          </p>
          <FiveStarGrid />
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="font-serif text-sm text-foreground/60 italic max-w-2xl">
            This anatomy will keep changing as the year completes. The phase
            split will widen. The rating distribution will sharpen. The
            five-star tier may grow by a few more works.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CrucibleAnatomy;
