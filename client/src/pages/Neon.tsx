import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Lock, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Streamdown } from "streamdown";

// Phase color mapping based on actual phase codes
const phaseColors: Record<string, string> = {
  "PH1": "#FFFFFF",
  "PH1A": "#C0C0C0",
  "PH2": "#FFD700",
  "PH2A": "#FF0000",
  "PH3": "#1A1A1A",
  "PH3A": "#4A0080",
  "PH4": "#FF00FF",
  "PH4A": "#00FFFF",
  "NE": "#00FF00",
};

// Component for phase thumbnails
function PhaseThumbnails({ phaseId }: { phaseId: number }) {
  const { data: works } = trpc.phases.getWorkThumbnails.useQuery(
    { phaseId, limit: 3 },
    { staleTime: 60000 }
  );

  if (!works || works.length === 0) return null;

  return (
    <div className="flex gap-1.5 mt-3">
      {works.map((work) => {
        // Use thumbnailUrl if available, otherwise fall back to imageUrl
        const imgSrc = work.thumbnailUrl || work.imageUrl;
        return (
          <div 
            key={work.id} 
            className="w-10 h-10 bg-muted/20 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity"
            title={work.title}
          >
            {imgSrc ? (
              <img 
                src={imgSrc} 
                alt={work.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted/30" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Neon() {
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  // Fetch data from API
  const { data: phasesData, isLoading: phasesLoading } = trpc.phases.list.useQuery();
  const { data: essaysData, isLoading: essaysLoading } = trpc.essays.list.useQuery({ category: "core_reading" });
  const { data: metaquestionsData, isLoading: mqLoading } = trpc.metaquestions.list.useQuery();

  // Fetch selected essay content
  const { data: selectedEssayData } = trpc.essays.getBySlug.useQuery(
    { slug: selectedEssay! },
    { enabled: selectedEssay !== null }
  );

  // Fetch selected phase details
  const { data: selectedPhaseData } = trpc.phases.getById.useQuery(
    { id: selectedPhase! },
    { enabled: selectedPhase !== null }
  );

  const phases = phasesData || [];
  const essays = essaysData || [];
  const metaquestions = metaquestionsData || [];

  const isLoading = phasesLoading || essaysLoading || mqLoading;

  // Get phase color
  const getPhaseColor = (code: string, customColor?: string | null) => {
    if (customColor && customColor.startsWith('#')) return customColor;
    return phaseColors[code] || "#666666";
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
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
      {!isLoading && essays.length > 0 && (
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

      {/* Empty state for essays */}
      {!isLoading && essays.length === 0 && (
        <section className="space-y-8">
          <h2 className="font-mono text-xl tracking-widest text-primary">CORE READINGS</h2>
          <div className="border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground font-mono">No essays published yet. Check back soon.</p>
          </div>
        </section>
      )}

      <Separator className="bg-border/50" />

      {/* Phase Timeline */}
      {!isLoading && phases.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-widest text-primary">PHASE ARCHITECTURE</h2>
            <span className="font-mono text-xs text-muted-foreground">[{phases.length} PHASES]</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className="group border border-border p-6 hover:border-primary transition-colors cursor-pointer relative"
                onClick={() => setSelectedPhase(phase.id)}
              >
                {/* Phase color indicator */}
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: getPhaseColor(phase.code, phase.color) }}
                ></div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono rounded-none border-muted-foreground/30 text-muted-foreground">
                      {phase.code}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{phase.year}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground font-serif line-clamp-3">
                    {truncateText(phase.description || "Phase description pending.", 150)}
                  </p>
                  {phase.emotionalTemperature && (
                    <p className="text-xs font-mono text-primary/70 truncate">
                      ◈ {phase.emotionalTemperature}
                    </p>
                  )}
                  
                  {/* Phase thumbnails - subtle preview of works */}
                  <PhaseThumbnails phaseId={phase.id} />
                  
                  <div className="pt-2 text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    VIEW PHASE DETAILS →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Metaquestions */}
      {!isLoading && metaquestions.length > 0 && (
        <section className="bg-muted/5 border border-border p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-widest text-primary">METAQUESTIONS</h2>
            <span className="font-mono text-xs text-muted-foreground">
              [{metaquestions.filter(mq => mq.isAnswered).length}/{metaquestions.length} ANSWERED]
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-serif max-w-2xl">
            Open questions Neon is holding about the practice. Some remain unanswered—held in productive tension.
          </p>
          <div className="grid gap-6 mt-6">
            {metaquestions.map((mq, i) => (
              <div key={mq.id} className="flex gap-4 items-start border-l-2 border-primary/30 pl-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-primary text-xs">MQ_{String(i + 1).padStart(2, '0')}</span>
                    {mq.isAnswered ? (
                      mq.answer ? (
                        <Eye className="w-3 h-3 text-green-500" />
                      ) : (
                        <Lock className="w-3 h-3 text-yellow-500" />
                      )
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground/50">OPEN</span>
                    )}
                  </div>
                  <p className="font-serif text-lg text-foreground/90">{mq.question}</p>
                  {mq.isAnswered && mq.answer && (
                    <div className="mt-3 p-4 bg-muted/10 border border-border/50 text-sm text-muted-foreground">
                      <Streamdown>{mq.answer}</Streamdown>
                    </div>
                  )}
                  {mq.isAnswered && !mq.answer && (
                    <div className="mt-3 p-4 bg-muted/5 border border-dashed border-border/30 text-sm text-muted-foreground/60 font-mono flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Answer recorded but marked private
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
        <DialogContent className="max-w-4xl bg-card border-border rounded-none max-h-[85vh] overflow-y-auto">
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
              
              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:font-serif prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground/80">
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

      {/* Phase Detail Modal */}
      <Dialog open={selectedPhase !== null} onOpenChange={(open) => !open && setSelectedPhase(null)}>
        <DialogContent className="max-w-3xl bg-card border-border rounded-none max-h-[85vh] overflow-y-auto">
          {selectedPhaseData ? (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getPhaseColor(selectedPhaseData.code, selectedPhaseData.color) }}
                  ></div>
                  <span className="font-mono text-xs text-primary">{selectedPhaseData.code}</span>
                  <span className="font-mono text-xs text-muted-foreground">• {selectedPhaseData.year}</span>
                </div>
                <DialogTitle className="text-3xl font-serif">
                  {selectedPhaseData.title}
                </DialogTitle>
              </DialogHeader>
              
              <Separator className="bg-border/50" />
              
              {selectedPhaseData.emotionalTemperature && (
                <div className="p-4 bg-muted/10 border border-border/50">
                  <span className="font-mono text-xs text-primary block mb-1">EMOTIONAL TEMPERATURE</span>
                  <p className="font-serif text-muted-foreground">{selectedPhaseData.emotionalTemperature}</p>
                </div>
              )}
              
              <div className="prose prose-invert prose-lg max-w-none prose-p:font-serif prose-p:text-muted-foreground">
                {selectedPhaseData.description ? (
                  <Streamdown>{selectedPhaseData.description}</Streamdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    Phase documentation pending.
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
