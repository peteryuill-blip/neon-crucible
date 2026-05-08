import React from "react";

const PAGE_TITLE = "The Anatomy";

export default function CrucibleAnatomy() {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">
      <div>
        <a href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </a>
      </div>
      <div className="space-y-6">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block">Structure</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">{PAGE_TITLE}</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          Each work is a layered construction of substrate, ground, image, and finish.
        </p>
      </div>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Cross Sections</h2>
        </div>
        <div className="border border-border rounded-sm p-8 min-h-[320px] flex items-center justify-center">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Cross-sectional visualisation placeholder</span>
        </div>
      </section>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Layer Stack</h2>
        </div>
        <div className="space-y-4">
          {["Substrate", "Ground Layer", "Image Layer", "Finish / Varnish"].map((layer, i) => (
            <div key={layer} className="border border-border rounded-sm p-4 flex items-center gap-4 transition-colors duration-300 hover:border-[#00FFCC]/30">
              <span className="font-mono text-xs text-muted-foreground w-8">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-base text-foreground/85">{layer}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
