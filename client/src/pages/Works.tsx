import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Grid as GridIcon, List, Loader2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Streamdown } from "streamdown";

const ITEMS_PER_PAGE = 12;

export default function Works() {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [techniqueFilter, setTechniqueFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWork, setSelectedWork] = useState<number | null>(null);

  // Fetch phases for filter dropdown
  const { data: phases } = trpc.phases.list.useQuery();

  // Build filter object
  const filter = useMemo(() => ({
    search: search || undefined,
    phaseId: phaseFilter !== "all" ? parseInt(phaseFilter) : undefined,
    technique: techniqueFilter !== "all" ? techniqueFilter : undefined,
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  }), [search, phaseFilter, techniqueFilter, page]);

  // Fetch works with filters
  const { data: worksData, isLoading } = trpc.works.list.useQuery(filter);

  // Fetch selected work details
  const { data: selectedWorkData } = trpc.works.getById.useQuery(
    { id: selectedWork! },
    { enabled: selectedWork !== null }
  );

  const works = worksData?.items ?? [];
  const totalWorks = worksData?.total ?? 0;
  const totalPages = Math.ceil(totalWorks / ITEMS_PER_PAGE);

  // Get unique techniques from works for filter
  const techniques = useMemo(() => {
    const uniqueTechniques = new Set<string>();
    works.forEach(w => w.technique && uniqueTechniques.add(w.technique));
    return Array.from(uniqueTechniques);
  }, [works]);

  // Find phase info for a work
  const getPhaseCode = (phaseId: number | null) => {
    if (!phaseId || !phases) return "—";
    const phase = phases.find(p => p.id === phaseId);
    return phase?.code ?? "—";
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">WORK ARCHIVE</h1>
          <p className="font-mono text-sm text-muted-foreground">
            INDEXING {totalWorks} WORKS [2018—2025]
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "grid" ? "outline" : "ghost"} 
            size="icon" 
            className="rounded-none border-muted-foreground/30"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "outline" : "ghost"} 
            size="icon" 
            className="rounded-none text-muted-foreground"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-4 sticky top-24 z-30 bg-background/95 backdrop-blur py-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="SEARCH ARCHIVE..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-10 font-mono text-sm rounded-none border-muted-foreground/30 bg-background focus-visible:ring-primary"
          />
        </div>
        <Select value={phaseFilter} onValueChange={(v) => { setPhaseFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[180px] rounded-none border-muted-foreground/30 font-mono text-sm">
            <SelectValue placeholder="PHASE" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-card">
            <SelectItem value="all">ALL PHASES</SelectItem>
            {phases?.map(phase => (
              <SelectItem key={phase.id} value={phase.id.toString()}>
                {phase.code} — {phase.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={techniqueFilter} onValueChange={(v) => { setTechniqueFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[180px] rounded-none border-muted-foreground/30 font-mono text-sm">
            <SelectValue placeholder="TECHNIQUE" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-card">
            <SelectItem value="all">ALL TECHNIQUES</SelectItem>
            {techniques.map(tech => (
              <SelectItem key={tech} value={tech}>{tech}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          className="rounded-none border-muted-foreground/30 font-mono gap-2"
          onClick={() => {
            setSearch("");
            setPhaseFilter("all");
            setTechniqueFilter("all");
            setPage(0);
          }}
        >
          <X className="w-4 h-4" /> CLEAR
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && works.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="font-mono text-muted-foreground">NO WORKS FOUND</p>
          <p className="text-sm text-muted-foreground/70">
            {search || phaseFilter !== "all" || techniqueFilter !== "all" 
              ? "Try adjusting your filters" 
              : "Works will appear here once added to the archive"}
          </p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && works.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {works.map((work) => (
            <div 
              key={work.id} 
              className="group bg-card aspect-square relative overflow-hidden cursor-pointer hover:bg-muted/5 transition-colors"
              onClick={() => setSelectedWork(work.id)}
            >
              {/* Image or Placeholder */}
              {work.imageUrl ? (
                <img 
                  src={work.imageUrl} 
                  alt={work.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-muted/10 flex items-center justify-center text-muted-foreground/20 font-mono text-4xl font-bold group-hover:scale-105 transition-transform duration-500">
                  IMG_{work.id}
                </div>
              )}
              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-primary border border-primary px-1 bg-black/50">
                    {getPhaseCode(work.phaseId)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{work.dateCreated || "—"}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-white tracking-tight">{work.title}</h3>
                  <div className="flex flex-col gap-1 font-mono text-xs text-gray-300">
                    <span>{work.technique || "—"}</span>
                    <span>{work.dimensions || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Corner Marker */}
              <div className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && works.length > 0 && viewMode === "list" && (
        <div className="border border-border divide-y divide-border">
          {works.map((work) => (
            <div 
              key={work.id} 
              className="flex items-center gap-6 p-4 hover:bg-muted/5 cursor-pointer transition-colors"
              onClick={() => setSelectedWork(work.id)}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 bg-muted/10 flex-shrink-0 overflow-hidden">
                {work.thumbnailUrl || work.imageUrl ? (
                  <img 
                    src={work.thumbnailUrl || work.imageUrl || ""} 
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-mono text-xs">
                    IMG
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{work.title}</h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {work.technique || "—"} • {work.dimensions || "—"}
                </p>
              </div>
              
              {/* Meta */}
              <div className="text-right flex-shrink-0">
                <span className="font-mono text-xs text-primary border border-primary px-1">
                  {getPhaseCode(work.phaseId)}
                </span>
                <p className="font-mono text-xs text-muted-foreground mt-1">{work.dateCreated || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <div className="flex gap-2 font-mono text-sm">
            <Button 
              variant="outline" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="rounded-none border-muted-foreground/30"
            >
              PREV
            </Button>
            <div className="flex items-center px-4 border border-muted-foreground/30 text-muted-foreground">
              PAGE {String(page + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </div>
            <Button 
              variant="outline" 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-none border-muted-foreground/30"
            >
              NEXT
            </Button>
          </div>
        </div>
      )}

      {/* Work Detail Modal */}
      <Dialog open={selectedWork !== null} onOpenChange={(open) => !open && setSelectedWork(null)}>
        <DialogContent className="max-w-4xl bg-card border-border rounded-none p-0 overflow-hidden">
          {selectedWorkData && (
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square bg-muted/10 relative">
                {selectedWorkData.imageUrl ? (
                  <img 
                    src={selectedWorkData.imageUrl} 
                    alt={selectedWorkData.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-mono text-6xl font-bold">
                    IMG
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className="p-8 space-y-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-primary border border-primary px-1">
                      {getPhaseCode(selectedWorkData.phaseId)}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {selectedWorkData.dateCreated || "—"}
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {selectedWorkData.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-muted-foreground">TECHNIQUE</span>
                      <p className="text-foreground">{selectedWorkData.technique || "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">DIMENSIONS</span>
                      <p className="text-foreground">{selectedWorkData.dimensions || "—"}</p>
                    </div>
                    {selectedWorkData.colorPalette && (
                      <div>
                        <span className="text-muted-foreground">PALETTE</span>
                        <p className="text-foreground">{selectedWorkData.colorPalette}</p>
                      </div>
                    )}
                    {selectedWorkData.emotionalRegister && (
                      <div>
                        <span className="text-muted-foreground">REGISTER</span>
                        <p className="text-foreground">{selectedWorkData.emotionalRegister}</p>
                      </div>
                    )}
                    {selectedWorkData.seriesName && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">SERIES</span>
                        <p className="text-foreground">{selectedWorkData.seriesName}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedWorkData.journalExcerpt && (
                    <div className="border-l-2 border-primary/50 pl-4">
                      <span className="font-mono text-xs text-muted-foreground block mb-2">JOURNAL EXCERPT</span>
                      <p className="font-serif italic text-muted-foreground">
                        "{selectedWorkData.journalExcerpt}"
                      </p>
                    </div>
                  )}
                  
                  {selectedWorkData.neonReading && (
                    <div className="bg-muted/10 p-4 border border-border">
                      <span className="font-mono text-xs text-primary block mb-2">NEON'S READING</span>
                      <div className="text-sm text-muted-foreground">
                        <Streamdown>{selectedWorkData.neonReading}</Streamdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
