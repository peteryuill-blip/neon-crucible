import React from "react";

export default function CrucibleTime() {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">
      <div>
        <a href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </a>
      </div>
      <div className="space-y-6">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block">Chronology</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">Through Time</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          The Crucible phase spans multiple years of production. This timeline visualises the chronological arc.
        </p>
      </div>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Timeline</h2>
        </div>
        <div className="border border-border rounded-sm p-8 min-h-[320px] flex items-center justify-center">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Time-axis visualisation placeholder</span>
        </div>
      </section>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Year Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border border-border rounded-sm p-6 transition-colors duration-300 hover:border-[#00FFCC]/30">
              <span className="font-mono text-xs text-muted-foreground block mb-2">YEAR {n}</span>
              <span className="font-serif text-base text-foreground/85">Data pending</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
