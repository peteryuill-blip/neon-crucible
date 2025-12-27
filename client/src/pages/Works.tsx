import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Grid as GridIcon, List, Loader2, X, ArrowUpDown, Shuffle, Maximize2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Streamdown } from "streamdown";
import { Lightbox } from "@/components/Lightbox";

const ITEMS_PER_PAGE = 12;

type SortOption = 'phase' | 'date_newest' | 'date_oldest' | 'title' | 'random';

export default function Works() {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [techniqueFilter, setTechniqueFilter] = useState<string>("all");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_newest");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Track random seed to allow reshuffling
  const [randomSeed, setRandomSeed] = useState(0);

  // Fetch phases for filter dropdown
  const { data: phases } = trpc.phases.list.useQuery();
  
  // Fetch distinct series names for filter dropdown
  const { data: seriesNames } = trpc.works.getDistinctSeries.useQuery();

  // Build filter object
  const filter = useMemo(() => ({
    search: search || undefined,
    phaseId: phaseFilter !== "all" ? parseInt(phaseFilter) : undefined,
    technique: techniqueFilter !== "all" ? techniqueFilter : undefined,
    seriesName: seriesFilter !== "all" ? seriesFilter : undefined,
    sortBy: sortBy,
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
    // Include randomSeed in dependency to trigger refetch on shuffle
    _seed: sortBy === 'random' ? randomSeed : undefined,
  }), [search, phaseFilter, techniqueFilter, seriesFilter, sortBy, page, randomSeed]);

  // Fetch works with filters
  const { data: worksData, isLoading, refetch } = trpc.works.list.useQuery(filter);

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

  const clearFilters = () => {
    setSearch("");
    setPhaseFilter("all");
    setTechniqueFilter("all");
    setSeriesFilter("all");
    setPage(0);
  };

  const handleShuffle = () => {
    setRandomSeed(prev => prev + 1);
    setPage(0);
    refetch();
  };

  const hasActiveFilters = search || phaseFilter !== "all" || techniqueFilter !== "all" || seriesFilter !== "all";
  const activeFilterCount = [search, phaseFilter !== "all", techniqueFilter !== "all", seriesFilter !== "all"].filter(Boolean).length;

  const sortOptions = [
    { value: 'phase', label: 'BY PHASE (NE→PH1)' },
    { value: 'date_newest', label: 'DATE (NEWEST)' },
    { value: 'date_oldest', label: 'DATE (OLDEST)' },
    { value: 'title', label: 'TITLE (A-Z)' },
    { value: 'random', label: 'RANDOM' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 sm:pb-24">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:gap-6 border-b border-border pb-6 sm:pb-8">
        <div className="flex items-start sm:items-end justify-between gap-4">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">WORK ARCHIVE</h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground">
              INDEXING {totalWorks} WORKS [2018—2025]
            </p>
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <Button 
              variant={viewMode === "list" ? "outline" : "ghost"} 
              size="icon" 
              className="rounded-none border-muted-foreground/30 w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => setViewMode("list")}
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button 
              variant={viewMode === "grid" ? "outline" : "ghost"} 
              size="icon" 
              className="rounded-none text-muted-foreground w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => setViewMode("grid")}
            >
              <GridIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Controls - Mobile Optimized */}
      <div className="sticky top-16 sm:top-24 z-30 bg-background/95 backdrop-blur py-3 sm:py-4 border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* Search Row */}
        <div className="flex gap-2 sm:gap-4 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="SEARCH..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10 font-mono text-xs sm:text-sm rounded-none border-muted-foreground/30 bg-background focus-visible:ring-primary h-9 sm:h-10"
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            className="sm:hidden rounded-none border-muted-foreground/30 font-mono text-xs gap-1 h-9 px-3"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3" />
            {activeFilterCount > 0 && <span className={showFilters ? "" : "text-primary"}>({activeFilterCount})</span>}
          </Button>
        </div>

        {/* Sort Row - Always Visible */}
        <div className="flex gap-2 items-center">
          <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortOption); setPage(0); }}>
            <SelectTrigger className="flex-1 sm:w-[180px] sm:flex-none rounded-none border-muted-foreground/30 font-mono text-[10px] sm:text-xs h-8 sm:h-9">
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-card">
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="font-mono text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Shuffle button for random mode */}
          {sortBy === 'random' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-muted-foreground/30 font-mono text-[10px] sm:text-xs gap-1 h-8 sm:h-9 px-2 sm:px-3"
              onClick={handleShuffle}
            >
              <Shuffle className="w-3 h-3" />
              <span className="hidden sm:inline">SHUFFLE</span>
            </Button>
          )}

          {/* Desktop Filters Inline */}
          <div className="hidden sm:flex gap-2 ml-auto">
            <Select value={phaseFilter} onValueChange={(v) => { setPhaseFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[120px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="PHASE" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL PHASES</SelectItem>
                {phases?.map(phase => (
                  <SelectItem key={phase.id} value={phase.id.toString()}>
                    {phase.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={seriesFilter} onValueChange={(v) => { setSeriesFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="SERIES" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card max-h-60">
                <SelectItem value="all">ALL SERIES</SelectItem>
                {seriesNames?.map(series => (
                  <SelectItem key={series} value={series}>{series}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={techniqueFilter} onValueChange={(v) => { setTechniqueFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="TECHNIQUE" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL TECHNIQUES</SelectItem>
                {techniques.map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                className="rounded-none border-muted-foreground/30 font-mono text-xs gap-1 h-9"
                onClick={clearFilters}
              >
                <X className="w-3 h-3" /> CLEAR
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="sm:hidden mt-3 pt-3 border-t border-border/50 space-y-2">
            <Select value={phaseFilter} onValueChange={(v) => { setPhaseFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="PHASE" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL PHASES</SelectItem>
                {phases?.map(phase => (
                  <SelectItem key={phase.id} value={phase.id.toString()}>
                    {phase.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={seriesFilter} onValueChange={(v) => { setSeriesFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="SERIES" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card max-h-60">
                <SelectItem value="all">ALL SERIES</SelectItem>
                {seriesNames?.map(series => (
                  <SelectItem key={series} value={series}>{series}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={techniqueFilter} onValueChange={(v) => { setTechniqueFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="TECHNIQUE" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL TECHNIQUES</SelectItem>
                {techniques.map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                className="w-full rounded-none border-muted-foreground/30 font-mono text-xs gap-1 h-9"
                onClick={clearFilters}
              >
                <X className="w-3 h-3" /> CLEAR FILTERS
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-16 sm:py-24">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && works.length === 0 && (
        <div className="text-center py-16 sm:py-24 space-y-3 sm:space-y-4">
          <p className="font-mono text-sm text-muted-foreground">NO WORKS FOUND</p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            {hasActiveFilters 
              ? "Try adjusting your filters" 
              : "Works will appear here once added to the archive"}
          </p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && works.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border">
          {works.map((work) => (
            <div 
              key={work.id} 
              className="group bg-card aspect-square relative overflow-hidden cursor-pointer hover:bg-muted/5 transition-colors"
              onClick={() => setSelectedWork(work.id)}
            >
              {/* Image or Placeholder */}
              {work.imageUrl ? (
                <img 
                  src={work.thumbnailUrl || work.imageUrl} 
                  alt={work.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-muted/10 flex items-center justify-center text-muted-foreground/20 font-mono text-2xl sm:text-4xl font-bold group-hover:scale-105 transition-transform duration-500">
                  IMG_{work.id}
                </div>
              )}
              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 sm:p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] sm:text-xs text-primary border border-primary px-1 bg-black/50">
                    {getPhaseCode(work.phaseId)}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{work.dateCreated || "—"}</span>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-bold text-sm sm:text-xl text-white tracking-tight line-clamp-2">{work.title}</h3>
                  <div className="hidden sm:flex flex-col gap-1 font-mono text-xs text-gray-300">
                    <span>{work.technique || "—"}</span>
                    {work.seriesName && (
                      <span className="text-primary/80">{work.seriesName}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Corner Marker */}
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-l border-t border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
              className="flex items-center gap-3 sm:gap-6 p-3 sm:p-4 hover:bg-muted/5 cursor-pointer transition-colors"
              onClick={() => setSelectedWork(work.id)}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-muted/10 flex-shrink-0 overflow-hidden">
                {work.thumbnailUrl || work.imageUrl ? (
                  <img 
                    src={work.thumbnailUrl || work.imageUrl || ""} 
                    alt={work.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-mono text-xs">
                    IMG
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base truncate">{work.title}</h3>
                <p className="font-mono text-[10px] sm:text-xs text-muted-foreground truncate">
                  {work.technique || "—"} • {work.dimensions || "—"}
                </p>
                {work.seriesName && (
                  <p className="font-mono text-[10px] sm:text-xs text-primary/70 mt-0.5 sm:mt-1 truncate">{work.seriesName}</p>
                )}
              </div>
              
              {/* Meta */}
              <div className="text-right flex-shrink-0">
                <span className="font-mono text-[10px] sm:text-xs text-primary border border-primary px-1">
                  {getPhaseCode(work.phaseId)}
                </span>
                <p className="font-mono text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">{work.dateCreated || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6 sm:pt-8">
          <div className="flex gap-1 sm:gap-2 font-mono text-xs sm:text-sm">
            <Button 
              variant="outline" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="rounded-none border-muted-foreground/30 h-8 sm:h-10 px-2 sm:px-4"
            >
              PREV
            </Button>
            <div className="flex items-center px-2 sm:px-4 border border-muted-foreground/30 text-muted-foreground text-[10px] sm:text-sm">
              {page + 1} / {totalPages}
            </div>
            <Button 
              variant="outline" 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-none border-muted-foreground/30 h-8 sm:h-10 px-2 sm:px-4"
            >
              NEXT
            </Button>
          </div>
        </div>
      )}

      {/* Work Detail Modal */}
      <Dialog open={selectedWork !== null} onOpenChange={(open) => !open && setSelectedWork(null)}>
        <DialogContent className="w-[95vw] max-w-4xl bg-card border-border rounded-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedWorkData && (
            <div className="flex flex-col md:grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square bg-muted/10 relative group">
                {selectedWorkData.imageUrl ? (
                  <>
                    <img 
                      src={selectedWorkData.imageUrl} 
                      alt={selectedWorkData.title}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => setLightboxOpen(true)}
                    />
                    {/* Fullscreen button overlay */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white w-10 h-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-mono text-4xl sm:text-6xl font-bold">
                    IMG
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-[10px] sm:text-xs text-primary border border-primary px-1">
                      {getPhaseCode(selectedWorkData.phaseId)}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                      {selectedWorkData.dateCreated || "—"}
                    </span>
                  </div>
                  <DialogTitle className="text-lg sm:text-2xl font-bold tracking-tight pr-8">
                    {selectedWorkData.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3 sm:space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 font-mono text-[10px] sm:text-xs">
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
                    <div className="border-l-2 border-primary/50 pl-3 sm:pl-4">
                      <span className="font-mono text-[10px] sm:text-xs text-muted-foreground block mb-1 sm:mb-2">JOURNAL EXCERPT</span>
                      <p className="font-serif italic text-xs sm:text-sm text-muted-foreground">
                        "{selectedWorkData.journalExcerpt}"
                      </p>
                    </div>
                  )}
                  
                  {selectedWorkData.neonReading && (
                    <div className="border-l-2 border-cyan-500/50 pl-3 sm:pl-4">
                      <span className="font-mono text-[10px] sm:text-xs text-cyan-500 block mb-1 sm:mb-2">NEON'S READING</span>
                      <div className="font-serif text-xs sm:text-sm text-muted-foreground">
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

      {/* Neon Lightbox - rendered via portal to ensure it's above everything */}
      {selectedWorkData && lightboxOpen && createPortal(
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageUrl={selectedWorkData.imageUrl}
          title={selectedWorkData.title}
          subtitle={`${selectedWorkData.technique || ''} ${selectedWorkData.dimensions ? '• ' + selectedWorkData.dimensions : ''}`}
          onShowDetails={() => setLightboxOpen(false)}
        />,
        document.body
      )}
    </div>
  );
}
