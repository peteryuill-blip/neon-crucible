import React from "react";

export default function CrucibleMaterials() {
  const substrates = [
    "Raw Canvas", "Linen Panel", "Cotton Duck", "Polyester Film",
    "Aluminium Composite", "Birch Plywood", "Arches Watercolour",
    "Hahnemühle Photo Rag", "Clear Acrylic Sheet", "Steel Plate",
    "Glass Substrate", "Recycled Aggregate Board",
  ];

  const inks = [
    "Carbon Black Pigment", "Ultramarine Dispersion",
    "Cadmium Red Medium", "Titanium White Base",
    "Iridescent Medium", "Neon Cyan / Magenta Spot",
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 space-y-24">
      <div>
        <a href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </a>
      </div>
      <div className="space-y-6">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block">Materials</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">Substrates & Inks</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          Every work in the Crucible phase is built from a deliberate pairing of substrate and ink.
        </p>
      </div>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">12 Substrates</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {substrates.map((s, i) => (
            <div key={s} className="border border-border rounded-sm p-4 transition-colors duration-300 hover:border-[#00FFCC]/30">
              <span className="font-mono text-xs text-muted-foreground block mb-2">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-base text-foreground/85">{s}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">6 Inks</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inks.map((ink, i) => (
            <div key={ink} className="border border-border rounded-sm p-4 transition-colors duration-300 hover:border-[#00FFCC]/30">
              <span className="font-mono text-xs text-muted-foreground block mb-2">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-base text-foreground/85">{ink}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
