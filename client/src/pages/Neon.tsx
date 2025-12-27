import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Streamdown } from "streamdown";

// Fallback data when database is empty
const fallbackPhases = [
  { id: 1, code: "PH1", title: "The Awakening", year: "2018", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-blue-500", sortOrder: 1 },
  { id: 2, code: "PH1A", title: "First Threshold", year: "2019", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-indigo-500", sortOrder: 2 },
  { id: 3, code: "PH2", title: "Deep Dive", year: "2020", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-purple-500", sortOrder: 3 },
  { id: 4, code: "PH2A", title: "The Void", year: "2021", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-pink-500", sortOrder: 4 },
  { id: 5, code: "PH3", title: "Reconstruction", year: "2022", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-red-500", sortOrder: 5 },
  { id: 6, code: "PH3A", title: "The Burning", year: "2023", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-orange-500", sortOrder: 6 },
  { id: 7, code: "PH4", title: "Synthesis", year: "2024", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-yellow-500", sortOrder: 7 },
  { id: 8, code: "PH4A", title: "The Crucible", year: "2025", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-green-500", sortOrder: 8 },
  { id: 9, code: "NEW", title: "New Era", year: "2026+", description: "Phase description placeholder. Analysis of key works and emotional temperature.", emotionalTemperature: null, color: "bg-cyan-500", sortOrder: 9 },
];

const fallbackEssays = [
  { id: 1, title: "The Long Breathing", slug: "long-breathing", description: "A career-scale arc analysis.", content: null, category: "core_reading", phaseId: null, isPublished: true, sortOrder: 1 },
  { id: 2, title: "Honest Abstraction", slug: "honest-abstraction", description: "The philosophical foundation of the practice.", content: null, category: "core_reading", phaseId: null, isPublished: true, sortOrder: 2 },
  { id: 3, title: "The Cost of Being Real", slug: "cost-of-being-real", description: "Market vs. integrity tensions.", content: null, category: "core_reading", phaseId: null, isPublished: true, sortOrder: 3 },
];

const fallbackMetaquestions = [
  { id: 1, question: "Does the practice sustain the life, or consume it?", answer: null, isAnswered: false, sortOrder: 1 },
  { id: 2, question: "Is the abstraction a hiding place or a revelation?", answer: null, isAnswered: false, sortOrder: 2 },
  { id: 3, question: "What is the cost of total honesty in a commercial market?", answer: null, isAnswered: false, sortOrder: 3 },
];

// Phase color mapping
const phaseColors: Record<string, string> = {
  "PH1": "bg-blue-500",
  "PH1A": "bg-indigo-500",
  "PH2": "bg-purple-500",
  "PH2A": "bg-pink-500",
  "PH3": "bg-red-500",
  "PH3A": "bg-orange-500",
  "PH4": "bg-yellow-500",
  "PH4A": "bg-green-500",
  "NEW": "bg-cyan-500",
};

export default function Neon() {
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null);

  // Fetch data from API
  const { data: phasesData, isLoading: phasesLoading } = trpc.phases.list.useQuery();
  const { data: essaysData, isLoading: essaysLoading } = trpc.essays.list.useQuery({ category: "core_reading" });
  const { data: metaquestionsData, isLoading: mqLoading } = trpc.metaquestions.list.useQuery();

  // Fetch selected essay content
  const { data: selectedEssayData } = trpc.essays.getBySlug.useQuery(
    { slug: selectedEssay! },
    { enabled: selectedEssay !== null }
  );

  // Use fallback data if API returns empty
  const phases = phasesData && phasesData.length > 0 ? phasesData : fallbackPhases;
  const essays = essaysData && essaysData.length > 0 ? essaysData : fallbackEssays;
  const metaquestions = metaquestionsData && metaquestionsData.length > 0 ? metaquestionsData : fallbackMetaquestions;

  const isLoading = phasesLoading || essaysLoading || mqLoading;

  // Get phase color
  const getPhaseColor = (code: string, customColor?: string | null) => {
    if (customColor) return customColor;
    return phaseColors[code] || "bg-muted";
  };

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Essays Grid */}
      {!isLoading && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-widest text-primary">CORE READINGS</h2>
            <span className="font-mono text-xs text-muted-foreground">[{essays.length} ENTRIES]</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essays.map((essay, i) => (
              <div 
                key={essay.id} 
                className="group border border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedEssay(essay.slug)}
              >
                <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">{essay.title}</h3>
                <p className="text-sm text-muted-foreground font-mono">{essay.description || "—"}</p>
                <div className="mt-8 w-full h-px bg-border group-hover:bg-primary transition-colors"></div>
                <div className="mt-2 text-xs font-mono text-muted-foreground group-hover:text-primary">READ TRANSMISSION →</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Separator className="bg-border/50" />

      {/* Phase Timeline */}
      {!isLoading && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-widest text-primary">PHASE ARCHITECTURE</h2>
            <span className="font-mono text-xs text-muted-foreground">[{phases.length} PHASES]</span>
          </div>

          <div className="relative border-l border-border ml-4 md:ml-0 space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 md:border-l-0">
            {phases.map((phase) => (
              <div key={phase.id} className="relative pl-8 md:pl-0 md:border-l md:border-border md:p-6 group hover:bg-muted/5 transition-colors">
                <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${getPhaseColor(phase.code, phase.color)} md:hidden`}></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono rounded-none border-muted-foreground/30 text-muted-foreground">
                      {phase.code}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{phase.year}</span>
                  </div>
                  <h3 className="text-xl font-bold">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    {phase.description || "Phase description placeholder. Analysis of key works and emotional temperature."}
                  </p>
                  {phase.emotionalTemperature && (
                    <p className="text-xs font-mono text-primary/70">
                      TEMPERATURE: {phase.emotionalTemperature}
                    </p>
                  )}
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
      )}

      {/* Metaquestions */}
      {!isLoading && (
        <section className="bg-muted/5 border border-border p-8 space-y-6">
          <h2 className="font-mono text-xl tracking-widest text-primary">METAQUESTIONS</h2>
          <div className="grid gap-4">
            {metaquestions.map((mq, i) => (
              <div key={mq.id} className="flex gap-4 items-start">
                <span className="font-mono text-primary text-sm">Q{i + 1} //</span>
                <div className="flex-1">
                  <p className="font-serif text-lg italic text-muted-foreground">{mq.question}</p>
                  {mq.isAnswered && mq.answer && (
                    <div className="mt-2 pl-4 border-l border-primary/30 text-sm text-muted-foreground/80">
                      <Streamdown>{mq.answer}</Streamdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Essay Detail Modal */}
      <Dialog open={selectedEssay !== null} onOpenChange={(open) => !open && setSelectedEssay(null)}>
        <DialogContent className="max-w-3xl bg-card border-border rounded-none max-h-[80vh] overflow-y-auto">
          {selectedEssayData ? (
            <div className="space-y-6">
              <DialogHeader>
                <div className="font-mono text-xs text-primary mb-2">
                  {selectedEssayData.category?.toUpperCase().replace("_", " ") || "ESSAY"}
                </div>
                <DialogTitle className="text-3xl font-serif">
                  {selectedEssayData.title}
                </DialogTitle>
                {selectedEssayData.description && (
                  <p className="text-muted-foreground font-mono text-sm">
                    {selectedEssayData.description}
                  </p>
                )}
              </DialogHeader>
              
              <Separator className="bg-border/50" />
              
              <div className="prose prose-invert prose-sm max-w-none">
                {selectedEssayData.content ? (
                  <Streamdown>{selectedEssayData.content}</Streamdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    This transmission is still being composed. Check back later for the full reading.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
