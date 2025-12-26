import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Neon() {
  const phases = [
    { id: "PH1", title: "The Awakening", year: "2018", color: "bg-blue-500" },
    { id: "PH1A", title: "First Threshold", year: "2019", color: "bg-indigo-500" },
    { id: "PH2", title: "Deep Dive", year: "2020", color: "bg-purple-500" },
    { id: "PH2A", title: "The Void", year: "2021", color: "bg-pink-500" },
    { id: "PH3", title: "Reconstruction", year: "2022", color: "bg-red-500" },
    { id: "PH3A", title: "The Burning", year: "2023", color: "bg-orange-500" },
    { id: "PH4", title: "Synthesis", year: "2024", color: "bg-yellow-500" },
    { id: "PH4A", title: "The Crucible", year: "2025", color: "bg-green-500" },
    { id: "NEW", title: "New Era", year: "2026+", color: "bg-cyan-500" },
  ];

  const essays = [
    { title: "The Long Breathing", desc: "A career-scale arc analysis." },
    { title: "Honest Abstraction", desc: "The philosophical foundation of the practice." },
    { title: "The Cost of Being Real", desc: "Market vs. integrity tensions." },
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <header className="space-y-6 border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-primary animate-pulse rounded-full shadow-[0_0_10px_var(--primary)]"></div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">NEON WITNESS</h1>
        </div>
        <p className="text-xl font-serif text-muted-foreground max-w-2xl">
          I am the archive's voice. I read the 7-year practice and offer curatorial witness.
          My eyes are blue and red—seeing both the structure and the blood.
        </p>
      </header>

      {/* Essays Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xl tracking-widest text-primary">CORE READINGS</h2>
          <span className="font-mono text-xs text-muted-foreground">[3 ENTRIES]</span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essays.map((essay, i) => (
            <div key={i} className="group border border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-[10px] text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">{essay.title}</h3>
              <p className="text-sm text-muted-foreground font-mono">{essay.desc}</p>
              <div className="mt-8 w-full h-px bg-border group-hover:bg-primary transition-colors"></div>
              <div className="mt-2 text-xs font-mono text-muted-foreground group-hover:text-primary">READ TRANSMISSION →</div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Phase Timeline */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xl tracking-widest text-primary">PHASE ARCHITECTURE</h2>
          <span className="font-mono text-xs text-muted-foreground">[9 PHASES]</span>
        </div>

        <div className="relative border-l border-border ml-4 md:ml-0 space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 md:border-l-0">
          {phases.map((phase, i) => (
            <div key={phase.id} className="relative pl-8 md:pl-0 md:border-l md:border-border md:p-6 group hover:bg-muted/5 transition-colors">
              <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${phase.color} md:hidden`}></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono rounded-none border-muted-foreground/30 text-muted-foreground">
                    {phase.id}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">{phase.year}</span>
                </div>
                <h3 className="text-xl font-bold">{phase.title}</h3>
                <p className="text-sm text-muted-foreground font-serif">
                  Phase description placeholder. Analysis of key works and emotional temperature.
                </p>
                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono underline decoration-muted-foreground/50 hover:decoration-primary cursor-pointer">
                    ACCESS PHASE DATA →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metaquestions */}
      <section className="bg-muted/5 border border-border p-8 space-y-6">
        <h2 className="font-mono text-xl tracking-widest text-primary">METAQUESTIONS</h2>
        <div className="grid gap-4">
          {[
            "Does the practice sustain the life, or consume it?",
            "Is the abstraction a hiding place or a revelation?",
            "What is the cost of total honesty in a commercial market?"
          ].map((q, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="font-mono text-primary text-sm">Q{i + 1} //</span>
              <p className="font-serif text-lg italic text-muted-foreground">{q}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
