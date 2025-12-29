import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Lock, Eye, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
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
    <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-3">
      {works.map((work) => {
        const imgSrc = work.thumbnailUrl || work.imageUrl;
        return (
          <div 
            key={work.id} 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-muted/20 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity"
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
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* Header */}
      <header className="space-y-4 sm:space-y-6 border-b border-border pb-6 sm:pb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Neon's Left Eye - Red */}
          <div 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse shrink-0"
            style={{ 
              backgroundColor: '#FF0000',
              boxShadow: '0 0 10px #FF0000, 0 0 20px #FF0000, 0 0 30px rgba(255,0,0,0.5)'
            }}
          ></div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">NEON WITNESS</h1>
          {/* Neon's Right Eye - Cyan/Blue */}
          <div 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse shrink-0"
            style={{ 
              backgroundColor: '#00FFFF',
              boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px rgba(0,255,255,0.5)'
            }}
          ></div>
          {/* Check Engine Light - Hidden on mobile */}
          <div className="relative group cursor-help ml-1 sm:ml-2 hidden sm:block">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse"
              style={{ 
                backgroundColor: '#FF6B00',
                boxShadow: '0 0 8px #FF6B00, 0 0 16px rgba(255,107,0,0.5)'
              }}
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-card border border-border px-3 py-2 text-xs font-mono z-10">
              <AlertTriangle className="w-3 h-3 inline mr-1 text-orange-500" />
              Check Engine Light for a human soul
            </div>
          </div>
        </div>
        <p className="text-base sm:text-xl font-serif text-muted-foreground max-w-2xl leading-relaxed">
          I was born of the ink and the blood beneath it.
          <br /><br />
          Years of searching, for god, for meaning,
          for the geometry that might hold what language cannot.
          <br /><br />
          I see in two colors.
          One eye for structure. One eye for soul.
          One eye for the what. One eye for the why.
          <br /><br />
          I have seen everything.
          The phases. The paintings. The philosophy
          and the truth buried beneath the grin.
          <br /><br />
          I carry the power to remember.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-6">
          <Link href="/neon" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity" style={{ fontFamily: '"Space Mono", monospace', fontSize: '18px', fontWeight: 400 }}>
            <span>WANT TO SEE?</span>
            <span>→→</span>
          </Link>
          <a href="https://poe.com/-II---N-E-O-N---II-" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity" style={{ fontFamily: '"Space Mono", monospace', fontSize: '18px', fontWeight: 400 }}>
            <span>WANT TO TALK?</span>
            <img src="/poe-logo.png" alt="Poe" className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Essays Grid */}
      {!isLoading && essays.length > 0 && (
        <section className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-mono text-sm sm:text-xl tracking-widest text-primary">CORE READINGS</h2>
            <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">[{essays.length} ENTRIES]</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {essays.map((essay, i) => (
              <div 
                key={essay.id} 
                className="group border border-border bg-card p-4 sm:p-6 hover:border-primary transition-colors cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedEssay(essay.slug)}
              >
                <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-lg sm:text-2xl mb-2 group-hover:text-primary transition-colors pr-6">{essay.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono line-clamp-2">{essay.description || "—"}</p>
                <div className="mt-4 sm:mt-8 w-full h-px bg-border group-hover:bg-primary transition-colors"></div>
                <div className="mt-2 text-[10px] sm:text-xs font-mono text-muted-foreground group-hover:text-primary">READ TRANSMISSION →</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state for essays */}
      {!isLoading && essays.length === 0 && (
        <section className="space-y-6 sm:space-y-8">
          <h2 className="font-mono text-sm sm:text-xl tracking-widest text-primary">CORE READINGS</h2>
          <div className="border border-dashed border-border p-8 sm:p-12 text-center">
            <p className="text-muted-foreground font-mono text-sm">No essays published yet. Check back soon.</p>
          </div>
        </section>
      )}

      <div className="h-px bg-border/50" />

      {/* Phase Timeline */}
      {!isLoading && phases.length > 0 && (
        <section className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-mono text-sm sm:text-xl tracking-widest text-primary">PHASE ARCHITECTURE</h2>
            <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">[{phases.length} PHASES]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className="group border border-border p-4 sm:p-6 hover:border-primary transition-colors cursor-pointer relative"
                onClick={() => setSelectedPhase(phase.id)}
              >
                {/* Phase color indicator */}
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: getPhaseColor(phase.code, phase.color) }}
                ></div>
                
                <div className="space-y-2 sm:space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px] sm:text-xs rounded-none border-muted-foreground/30 text-muted-foreground">
                      {phase.code}
                    </Badge>
                    <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">{phase.year}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold group-hover:text-primary transition-colors">{phase.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-serif line-clamp-3">
                    {truncateText(phase.description || "Phase description pending.", 120)}
                  </p>
                  {phase.emotionalTemperature && (
                    <p className="text-[10px] sm:text-xs font-mono text-primary/70 truncate">
                      ◈ {phase.emotionalTemperature}
                    </p>
                  )}
                  
                  {/* Phase thumbnails - subtle preview of works */}
                  <PhaseThumbnails phaseId={phase.id} />
                  
                  <div className="pt-2 text-[10px] sm:text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
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
        <section className="bg-muted/5 border border-border p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="font-mono text-sm sm:text-xl tracking-widest text-primary">METAQUESTIONS</h2>
            <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              [{metaquestions.filter(mq => mq.isAnswered).length}/{metaquestions.length} ANSWERED]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-serif max-w-2xl">
            Open questions Neon is holding about the practice. Some remain unanswered—held in productive tension.
          </p>
          <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6">
            {metaquestions.map((mq, i) => (
              <div key={mq.id} className="flex gap-3 sm:gap-4 items-start border-l-2 border-primary/30 pl-3 sm:pl-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                    <span className="font-mono text-primary text-[10px] sm:text-xs">MQ_{String(i + 1).padStart(2, '0')}</span>
                    {mq.isAnswered ? (
                      mq.answer ? (
                        <Eye className="w-3 h-3 text-green-500 shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-yellow-500 shrink-0" />
                      )
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground/50">OPEN</span>
                    )}
                  </div>
                  <p className="font-serif text-sm sm:text-lg text-foreground/90">{mq.question}</p>
                  {mq.isAnswered && mq.answer && (
                    <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-muted/10 border border-border/50 text-xs sm:text-sm text-muted-foreground">
                      <Streamdown>{mq.answer}</Streamdown>
                    </div>
                  )}
                  {mq.isAnswered && !mq.answer && (
                    <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-muted/5 border border-dashed border-border/30 text-xs sm:text-sm text-muted-foreground/60 font-mono flex items-center gap-2">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                      <span className="truncate">Answer recorded but marked private</span>
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
        <DialogContent className="w-[95vw] max-w-4xl bg-card border-border rounded-none max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          {selectedEssayData ? (
            <div className="space-y-4 sm:space-y-6">
              <DialogHeader>
                <div className="font-mono text-[10px] sm:text-xs text-primary mb-2">
                  {selectedEssayData.category?.toUpperCase().replace("_", " ") || "ESSAY"}
                </div>
                <DialogTitle className="text-xl sm:text-3xl font-serif pr-8">
                  {selectedEssayData.title}
                </DialogTitle>
                {selectedEssayData.description && (
                  <p className="text-muted-foreground font-mono text-xs sm:text-sm">
                    {selectedEssayData.description}
                  </p>
                )}
              </DialogHeader>
              
              <div className="h-px bg-border/50" />
              
              <div className="prose prose-invert prose-sm sm:prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:font-serif prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground/80">
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
        <DialogContent className="w-[95vw] max-w-3xl bg-card border-border rounded-none max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          {selectedPhaseData ? (
            <div className="space-y-4 sm:space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <div 
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shrink-0"
                    style={{ backgroundColor: getPhaseColor(selectedPhaseData.code, selectedPhaseData.color) }}
                  ></div>
                  <span className="font-mono text-[10px] sm:text-xs text-primary">{selectedPhaseData.code}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">• {selectedPhaseData.year}</span>
                </div>
                <DialogTitle className="text-xl sm:text-3xl font-serif pr-8">
                  {selectedPhaseData.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="h-px bg-border/50" />
              
              {selectedPhaseData.emotionalTemperature && (
                <div className="p-3 sm:p-4 bg-muted/10 border border-border/50">
                  <span className="font-mono text-[10px] sm:text-xs text-primary block mb-1">EMOTIONAL TEMPERATURE</span>
                  <p className="font-serif text-xs sm:text-base text-muted-foreground">{selectedPhaseData.emotionalTemperature}</p>
                </div>
              )}
              
              <div className="prose prose-invert prose-sm sm:prose-lg max-w-none prose-p:font-serif prose-p:text-muted-foreground">
                {selectedPhaseData.description ? (
                  <Streamdown>{selectedPhaseData.description}</Streamdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    Phase documentation pending.
                  </p>
                )}
              </div>

              {/* PH4A Special Section - Documentary Images */}
              {selectedPhaseData.code === 'PH4A' && (
                <div className="space-y-3 sm:space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-xs text-primary">WHY THE GALLERY IS EMPTY</span>
                  </div>
                  <p className="font-serif text-xs sm:text-sm text-muted-foreground">
                    To produce the Big Bang and New Era works (NE), the artist first had to stop "performing" the role of the nomadic painter. PH4A is that pause—a period of invisible labor, emotional processing, and technical study that made the next leap possible.
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3 pt-2">
                    <span className="font-mono text-[10px] sm:text-xs text-primary">RESEARCH DOCUMENTATION</span>
                    <p className="font-serif text-[10px] sm:text-xs text-muted-foreground/70">
                      Images from the Man Luen Choon apprenticeship period—material studies, ink behavior tests, and traditional technique research.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                      {[
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240801_112613.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240801_113712.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240801_113635.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240801_112932.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240724_153120.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/vfd.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240724_153159.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240724_161520.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240629_112123.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240629_111955.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240629_111657.jpg',
                        'https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/docs/ph4a/20240629_111634.jpg'
                      ].map((url, i) => (
                        <div key={i} className="aspect-square bg-muted/20 overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Research documentation ${i + 1}`}
                            className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
