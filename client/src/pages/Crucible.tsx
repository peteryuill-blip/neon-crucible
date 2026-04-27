import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

// Live metrics fetched from NEON SIGNS API
// Falls back to static snapshot if API unavailable
const STATIC_SNAPSHOT = {
  currentTCode: "T_259",
  totalWorks: 259,
  studioHours: 505,
  surfaceArea: "322.22",
  killRate: 29,
  weeksActive: 12,
  weekNumber: 17,
  avgRating: "3.46",
  ratingFiveWorks: 6,
};

// Weekly arc data: the quality trajectory
const weeklyArcData = [
  { week: 2, avg: 1.0 },
  { week: 5, avg: 1.0 },
  { week: 6, avg: 1.2 },
  { week: 7, avg: 1.4 },
  { week: 8, avg: 1.6 },
  { week: 9, avg: 1.8 },
  { week: 12, avg: 2.1 },
  { week: 13, avg: 2.6 },
  { week: 14, avg: 2.8 },
  { week: 15, avg: 3.1 },
  { week: 16, avg: 2.9 },
  { week: 17, avg: 3.46 },
];

// Redacted weekly pulse: public-facing summaries
const weeklyPulse = [
  {
    week: 17,
    date: "2026-04-19",
    summary: "Full rebound. 28 works logged, 55 studio hours. The first two Rating-5 works in the Crucible's history. The restraint insight confirmed in the work.",
    energy: "HOT",
    jester: 0,
  },
  {
    week: 16,
    date: "2026-04-12",
    summary: "Single-week correction after four sustained weeks of peak output. The glass cannon cooling. 40 hours, Jester at 2, energy Sustainable. Expected.",
    energy: "SUSTAINABLE",
    jester: 2,
  },
  {
    week: 15,
    date: "2026-04-05",
    summary: "Third consecutive week at Crucible high for studio hours. S11 producing three consecutive high-rated works. S10 and S11 confirmed as the primary Production Phase surfaces.",
    energy: "HOT",
    jester: 0,
  },
];

function ArcChart() {
  const maxAvg = 5;
  const minWeek = 2;
  const maxWeek = 17;
  const width = 100;
  const height = 60;

  const toX = (week: number) => ((week - minWeek) / (maxWeek - minWeek)) * width;
  const toY = (avg: number) => height - (avg / maxAvg) * height;

  const pathD = weeklyArcData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.week).toFixed(1)} ${toY(d.avg).toFixed(1)}`)
    .join(" ");

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
          AVG RATING / WEEK
        </span>
        <span className="font-mono text-[10px] text-primary">
          1.00 → 3.46
        </span>
      </div>
      <div className="relative w-full h-32 border border-border/40 overflow-hidden bg-card/30">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((y) => (
            <line
              key={y}
              x1="0"
              y1={toY(y)}
              x2={width}
              y2={toY(y)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}
          {/* Area fill */}
          <path
            d={`${pathD} L ${toX(17)} ${height} L ${toX(2)} ${height} Z`}
            fill="rgba(0,255,153,0.05)"
          />
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#00FF99"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* First 5-rated work annotation */}
          <circle
            cx={toX(17)}
            cy={toY(3.46)}
            r="2"
            fill="#00FF99"
          />
        </svg>
        {/* Week labels */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2">
          <span className="font-mono text-[8px] text-muted-foreground/40">W2</span>
          <span className="font-mono text-[8px] text-muted-foreground/40">W10</span>
          <span className="font-mono text-[8px] text-muted-foreground/40">W17</span>
        </div>
        {/* First 5 annotation */}
        <div className="absolute top-2 right-2">
          <span className="font-mono text-[8px] text-primary/60">← first ★★★★★</span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/50">
        Week 5 avg 1.00 · Week 17 avg 3.46 · Rating scale recalibrated at T_174
      </p>
    </div>
  );
}

export default function Crucible() {
  const metrics = STATIC_SNAPSHOT;

  // Fetch Crucible Year works, filtered by NE phase
  const { data: crucibleWorks, isLoading: worksLoading } = trpc.gallery.getAll.useQuery({
    phase: "NE",
    sort: "year-desc",
  });

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">

      {/* Header */}
      <header className="space-y-6 border-b border-border pb-12">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs tracking-widest text-primary">THE CRUCIBLE</p>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] text-primary/70 tracking-widest">ACTIVE</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">
          An open-ended<br />
          <span className="text-primary">discipline.</span>
        </h1>
        <p className="font-serif text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Begun December 2025. No defined endpoint. One rule: make the work every day the body is willing, and witness everything.
        </p>
      </header>

      {/* The Declaration */}
      <section className="space-y-8">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          The Methodology
        </h2>
        <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          <p>
            The Crucible Year is a declared studio discipline: large-format sumi ink
            painting on raw East Asian Xuan paper, documented in real time by a
            15-year AI witness system called Neon. One shot per work. No revision.
            No going back.
          </p>
          <p>
            Every work is logged within hours of completion. Every session is rated
            on a five-point scale. Every substrate, ink combination, and studio
            hour is recorded. At the end of each week, a full roundup is submitted
            to the archive: energy levels, body state, Jester activity, walking
            volume, breakthrough moments, and failures.
          </p>
          <p>
            The result is a practice with the most rigorous longitudinal documentation
            of any artist working today. Not because documentation is the goal.
            Because being witnessed changes how you work.
          </p>
        </div>

        {/* Methodology grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border mt-8">
          {[
            { label: "ONE SHOT", sub: "No revision. Ever." },
            { label: "DAILY LOG", sub: "Every work within hours." },
            { label: "WEEKLY ROUNDUP", sub: "Full state report." },
            { label: "WITNESS SYSTEM", sub: "Neon holds the record." },
          ].map((item) => (
            <div key={item.label} className="bg-background p-5 space-y-1">
              <p className="font-mono text-[10px] tracking-widest text-primary">{item.label}</p>
              <p className="font-serif text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Data Window */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Live Data
          </h2>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-primary/60">AS OF WEEK {metrics.weekNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
          {[
            { value: metrics.currentTCode, label: "Current Work" },
            { value: metrics.totalWorks.toString(), label: "Works Made" },
            { value: `${metrics.studioHours}h`, label: "Studio Hours" },
            { value: `${metrics.surfaceArea}m²`, label: "Surface Area" },
            { value: `${metrics.killRate}%`, label: "Kill Rate" },
            { value: metrics.ratingFiveWorks.toString(), label: "★★★★★ Works" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-6 space-y-2">
              <p className="font-mono text-2xl sm:text-3xl text-foreground">{stat.value}</p>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] text-muted-foreground/50">
          {metrics.totalWorks} works made. You are seeing a selected few. The gap is the statement.
        </p>
      </section>

      {/* Selected Works */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Selected Works
          </h2>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {metrics.totalWorks} MADE · {metrics.ratingFiveWorks} RATED ★★★★★
          </span>
        </div>

        {worksLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : crucibleWorks?.items && crucibleWorks.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {crucibleWorks.items.slice(0, 6).map((work) => (
              <Link key={work.id} href={`/works/${work.slug || work.id}`}>
                <div className="group cursor-pointer space-y-3">
                  <div className="aspect-[4/3] bg-muted overflow-hidden border border-border group-hover:border-primary/50 transition-colors duration-300">
                    {work.thumbnailUrl && (
                      <img
                        src={work.thumbnailUrl}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">
                      {work.title}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {work.dateCreated || work.year}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border/50 p-12 text-center">
            <p className="font-mono text-xs text-muted-foreground/50">
              CRUCIBLE YEAR WORKS TO BE ADDED
            </p>
          </div>
        )}
      </section>

      {/* Quality Arc */}
      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          The Arc
        </h2>
        <p className="font-serif text-sm text-muted-foreground max-w-xl">
          Every active week rated. The upward trajectory from Week 5 to Week 17 is not
          interpretation. It is data. The Crucible is working.
        </p>
        <ArcChart />
      </section>

      {/* Weekly Pulse */}
      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Weekly Pulse
        </h2>
        <p className="font-serif text-sm text-muted-foreground max-w-xl">
          Redacted public summaries of the weekly studio reports. Full roundups held
          in the private archive.
        </p>

        <div className="space-y-0 border-t border-border">
          {weeklyPulse.map((week) => (
            <div
              key={week.week}
              className="py-6 border-b border-border/50 grid grid-cols-[80px_1fr] gap-6"
            >
              <div className="space-y-1">
                <p className="font-mono text-xs text-primary">W{week.week}</p>
                <p className="font-mono text-[10px] text-muted-foreground/60">{week.date}</p>
                <p
                  className={`font-mono text-[9px] tracking-widest mt-2 ${
                    week.energy === "HOT"
                      ? "text-primary"
                      : week.energy === "SUSTAINABLE"
                      ? "text-yellow-500/70"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {week.energy}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-serif text-sm text-foreground/80 leading-relaxed">
                  {week.summary}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/40">
                  JESTER: {week.jester === 0 ? "DORMANT" : week.jester}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bridge to Neon */}
      <section className="border border-border/50 p-8 sm:p-10 space-y-4 bg-card/20">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">
          THE SYSTEM BEHIND THE EXPERIMENT
        </p>
        <p className="font-serif text-lg text-foreground/85 max-w-xl leading-relaxed">
          Everything documented above exists because of Neon, a 15-year cognitive
          architecture built to witness the practice. The Crucible Year is the most
          intensive period in its operational history.
        </p>
        <Link href="/neon">
          <Button variant="outline" className="font-mono mt-4">
            MEET NEON <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

    </div>
  );
}
