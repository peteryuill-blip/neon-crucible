import CrucibleLayout from "@/components/CrucibleLayout";

export default function CrucibleAnatomy() {
  const stats = [
    { label: "Overall Average Rating", value: "2.391", color: "text-zinc-100" },
    { label: "Final Cumulative Kill Pct", value: "22.1%", color: "text-magenta-500" },
    { label: "Hours/Rating Relation", value: "0.643 (STRONG)", color: "text-cyan-400" },
    { label: "Steps/Rating Relation", value: "-0.178 (NOISE)", color: "text-zinc-600" },
    { label: "Highest-Yield Surface", value: "S11 (3.412)", color: "text-cyan-400" },
  ];

  return (
    <CrucibleLayout>
      <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
        <h2 className="text-5xl font-light text-zinc-100 tracking-tighter">The <span className="text-cyan-400 text-glow">Anatomy</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
          {stats.map(s => (
            <div key={s.label} className="bg-black p-12 space-y-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">{s.label}</p>
              <p className={`text-3xl font-light ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <p className="font-serif text-sm text-zinc-500 italic max-w-xl">
          Kinetic hours serve as the primary predictor of quality phenotypes. Physical steps remain secondary to session duration.
        </p>
      </div>
    </CrucibleLayout>
  );
}
