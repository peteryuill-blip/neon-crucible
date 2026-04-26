import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X, ArrowUpDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";

const ITEMS_PER_PAGE = 12;

export default function Works() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [mediumFilter, setMediumFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "title-asc" | "title-desc">("year-desc");
  const [page, setPage] = useState(0);

  const { data: filterOptions } = trpc.gallery.getFilterOptions.useQuery();

  const filter = useMemo(() => ({
    search: search || undefined,
    phase: phaseFilter !== "all" ? phaseFilter : undefined,
    series: seriesFilter !== "all" ? seriesFilter : undefined,
    year: yearFilter !== "all" ? yearFilter : undefined,
    medium: mediumFilter !== "all" ? mediumFilter : undefined,
    sort: sortBy,
  }), [search, phaseFilter, seriesFilter, yearFilter, mediumFilter, sortBy]);

  const { data: galleryData, isLoading } = trpc.gallery.getAll.useQuery(filter);

  const works = galleryData?.items ?? [];
  const totalWorks = galleryData?.total ?? 0;
  const totalPages = Math.ceil(totalWorks / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch("");
    setPhaseFilter("all");
    setSeriesFilter("all");
    setYearFilter("all");
    setMediumFilter("all");
    setPage(0);
  };

  const hasActiveFilters =
    search || phaseFilter !== "all" || seriesFilter !== "all" || yearFilter !== "all" || mediumFilter !== "all";

  const sortOptions = [
    { value: "year-desc", label: "YEAR (NEWEST)" },
    { value: "year-asc", label: "YEAR (OLDEST)" },
    { value: "title-asc", label: "TITLE (A-Z)" },
  ];

  const handleWorkClick = (slug: string) => {
    sessionStorage.setItem("gallery-return-url", window.location.href);
    setLocation(`/works/${slug}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 sm:pb-24">
      <header className="flex flex-col gap-4 sm:gap-6 border-b border-border pb-6 sm:pb-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-light tracking-tighter">WORK ARCHIVE</h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground">
            INDEXING {totalWorks} WORKS [2018—PRESENT]
          </p>
        </div>
      </header>

      <div className="sticky top-16 sm:top-24 z-30 bg-background/95 backdrop-blur py-3 sm:py-4 border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
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
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v as any); setPage(0); }}>
            <SelectTrigger className="flex-1 sm:w-[180px] sm:flex-none rounded-none border-muted-foreground/30 font-mono text-[10px] sm:text-xs h-8 sm:h-9">
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-card">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-mono text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden sm:flex gap-2 ml-auto">
            <Select value={phaseFilter} onValueChange={(v) => { setPhaseFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[120px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="PHASE" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL PHASES</SelectItem>
                {filterOptions?.phases.map((phase) => (
                  <SelectItem key={phase.code} value={phase.code}>
                    {phase.code}: {phase.title}
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
                {filterOptions?.series.map((series) => (
                  <SelectItem key={series} value={series}>{series}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[100px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="YEAR" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="all">ALL YEARS</SelectItem>
                {filterOptions?.years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={mediumFilter} onValueChange={(v) => { setMediumFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px] rounded-none border-muted-foreground/30 font-mono text-xs h-9">
                <SelectValue placeholder="MEDIUM" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card max-h-60">
                <SelectItem value="all">ALL MEDIUMS</SelectItem>
                {filterOptions?.mediums.map((medium) => (
                  <SelectItem key={medium} value={medium}>{medium}</SelectItem>
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

        <div className="sm:hidden mt-3 pt-3 border-t border-border/50 space-y-2">
          <Select value={phaseFilter} onValueChange={(v) => { setPhaseFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
              <SelectValue placeholder="PHASE" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-card">
              <SelectItem value="all">ALL PHASES</SelectItem>
              {filterOptions?.phases.map((phase) => (
                <SelectItem key={phase.code} value={phase.code}>
                  {phase.code}: {phase.title}
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
              {filterOptions?.series.map((series) => (
                <SelectItem key={series} value={series}>{series}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
              <SelectValue placeholder="YEAR" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-card">
              <SelectItem value="all">ALL YEARS</SelectItem>
              {filterOptions?.years.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={mediumFilter} onValueChange={(v) => { setMediumFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full rounded-none border-muted-foreground/30 font-mono text-xs h-9">
              <SelectValue placeholder="MEDIUM" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-card max-h-60">
              <SelectItem value="all">ALL MEDIUMS</SelectItem>
              {filterOptions?.mediums.map((medium) => (
                <SelectItem key={medium} value={medium}>{medium}</SelectItem>
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-mono text-sm text-muted-foreground">NO WORKS FOUND</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {works.map((work) => (
              <button
                key={work.id}
                onClick={() => handleWorkClick(work.slug || "")}
                className="group relative aspect-square overflow-hidden bg-muted border border-border hover:border-primary transition-all duration-300 cursor-pointer rounded-none"
              >
                <img
                  src={work.thumbnailUrl || work.imageUrl || ""}
                  alt={work.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-end justify-end p-4">
                  <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-serif text-sm sm:text-base text-white leading-tight">{work.title}</p>
                    {(work.dateCreated || work.year) && (
                      <p className="font-mono text-xs text-white/70">{work.dateCreated || work.year}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-border">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-none border-muted-foreground/30 font-mono text-xs h-9"
              >
                ← PREVIOUS
              </Button>
              <span className="font-mono text-xs text-muted-foreground">
                PAGE {page + 1} OF {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="rounded-none border-muted-foreground/30 font-mono text-xs h-9"
              >
                NEXT →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
