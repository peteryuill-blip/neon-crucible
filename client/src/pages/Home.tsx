import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";

const CRUCIBLE_PAGES = [
  { href: "/crucible/works",     n: "01", label: "The Archive",    desc: "294 works. Weighted by significance."          },
  { href: "/crucible/materials", n: "02", label: "Materials",      desc: "12 papers. 6 inks. 396.2m² consumed."          },
  { href: "/crucible/time",      n: "03", label: "Time",           desc: "Quality arc, kill rate, weekly volume."         },
  { href: "/crucible/anatomy",   n: "04", label: "Anatomy",        desc: "Every variable. Every condition. The full data." },
];

const OTHER_PAGES = [
  { href: "/works",    label: "Works",        desc: "The full 15-year archive."         },
  { href: "/practice", label: "The Practice", desc: "The arc from structure to gesture." },
  { href: "/neon",     label: "Neon",         desc: "The witness system."               },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-24 sm:space-y-32">

        {/* ── IDENTITY ─────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Peter Yuill · Bangkok · 2011–Present
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tighter leading-[0.95]">
            THE{" "}
            <span style={{ color: CYAN }}>NEON</span>
            <br />
            CRUCIBLE
          </h1>
          <p className="font-serif text-base sm:text-lg text-foreground/70 max-w-xl leading-relaxed">
            Fifteen years. Four continents. A practice built from ink, paper, and the refusal to let the work disappear.
          </p>
        </section>

        {/* ── CRUCIBLE HERO ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: CYAN }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: CYAN }} />
            </span>
            Live · The Crucible Year · 2026
          </div>

          {/* Main Crucible entry — full width, prominent */}
          <Link href="/crucible">
            <div
              className="group border p-8 sm:p-10 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
              style={{ borderColor: `${CYAN}40` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: CYAN }}>
                    Enter The Crucible
                  </div>
                  <h2
                    className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight group-hover:opacity-80 transition-opacity"
                    style={{ color: CYAN }}
                  >
                    The Crucible Year
                  </h2>
                  <p className="font-serif text-base sm:text-lg text-foreground/65 max-w-lg leading-relaxed">
                    A year-long intensive studio practice. Large-format sumi ink on Chinese rice paper. Every work documented. Every variable tracked. The experiment is running now.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase" style={{ color: CYAN }}>
                    Read the introduction <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                <ArrowRight
                  className="w-6 h-6 shrink-0 mt-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  style={{ color: CYAN }}
                />
              </div>
            </div>
          </Link>

          {/* Four sub-pages directly accessible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CRUCIBLE_PAGES.map((page) => (
              <Link key={page.href} href={page.href}>
                <div
                  className="group border border-white/10 p-5 hover:border-white/25 transition-all duration-200 cursor-pointer h-full"
                  style={{ borderColor: `${MAGENTA}15` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                        {page.n}
                      </div>
                      <div
                        className="font-serif text-lg font-light leading-tight group-hover:opacity-80 transition-opacity"
                        style={{ color: MAGENTA }}
                      >
                        {page.label}
                      </div>
                      <div className="font-mono text-[10px] tracking-wide text-foreground/50">
                        {page.desc}
                      </div>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 shrink-0 mt-1 opacity-20 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all"
                      style={{ color: MAGENTA }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ──────────────────────────────────────────────────── */}
        <div className="border-t border-white/10" />

        {/* ── OTHER SECTIONS ───────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-6">
            Also in the archive
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {OTHER_PAGES.map((page) => (
              <Link key={page.href} href={page.href}>
                <div className="group border border-white/10 p-5 hover:border-white/25 transition-all duration-200 cursor-pointer h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="font-serif text-base font-light group-hover:text-[#00FFCC] transition-colors">
                        {page.label}
                      </div>
                      <div className="font-mono text-[10px] tracking-wide text-foreground/45">
                        {page.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 shrink-0 mt-1 opacity-20 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all text-[#00FFCC]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── QUOTE ────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 pt-16 max-w-2xl space-y-6">
          <blockquote className="font-serif text-xl sm:text-2xl italic text-foreground/60 leading-relaxed">
            "Every time someone dies, a library burns down."
          </blockquote>
          <div className="font-serif text-sm text-foreground/45 space-y-1">
            <p>She said it twenty years ago.</p>
            <p>It has followed me ever since.</p>
          </div>
          <p className="font-serif text-base text-foreground/80">
            This is mine. While I'm still here.
          </p>
        </section>

      </div>
    </div>
  );
}
