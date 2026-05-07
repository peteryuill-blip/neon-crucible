import CrucibleLayout from "@/components/CrucibleLayout";

export default function CrucibleTime() {
  return (
    <CrucibleLayout>
      <div className="max-w-4xl mx-auto py-24 px-6 space-y-24">
        <section className="space-y-8">
          <h2 className="text-5xl font-light text-zinc-100 tracking-tighter">Temporal <span className="text-cyan-400">Arc</span></h2>
          <p className="font-serif text-xl italic text-zinc-500 leading-relaxed">
            From December 29, 2025, to May 07, 2026. The archive spans 20 weeks of daily production.
          </p>
        </section>

        <div className="relative border-l border-zinc-900 pl-12 space-y-24">
          <div className="space-y-4">
            <div className="absolute -left-[5px] w-2 h-2 bg-cyan-500 rounded-full" />
            <h3 className="font-mono text-xs tracking-widest text-cyan-400 uppercase">Phase I: The Warmup (W2 - W15)</h3>
            <p className="font-serif text-zinc-400">Baseline telemetry established. Initial interaction with the S1-S5 substrates.</p>
          </div>

          <div className="space-y-4 pt-12 border-t border-zinc-900">
            <div className="absolute left-[43px] mt-[-52px] w-[1px] h-24 bg-magenta-500/50" />
            <div className="absolute -left-[5px] w-2 h-2 bg-magenta-500 rounded-full shadow-[0_0_15px_rgba(255,0,255,0.5)]" />
            <h3 className="font-mono text-xs tracking-widest text-magenta-500 uppercase">T_170: Structural Inflection</h3>
            <p className="font-serif text-zinc-100 text-lg italic">
              "The boundary where the archive shifts from accumulation to production." 
              Temporal arc delta recorded at 1.65.
            </p>
          </div>
        </div>
      </div>
    </CrucibleLayout>
  );
}
