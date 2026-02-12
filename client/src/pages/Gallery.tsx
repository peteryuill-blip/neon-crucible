import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

// Parse URL search params
function useQueryParams() {
  const search = useSearch();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Build URL with query params
function buildGalleryUrl(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const qs = searchParams.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export default function Gallery() {
  const [, setLocation] = useLocation();
  const queryParams = useQueryParams();

  // Read filters from URL
  const phase = queryParams.get("phase") || undefined;
  const series = queryParams.get("series") || undefined;
  const year = queryParams.get("year") || undefined;
  const medium = queryParams.get("medium") || undefined;
  const sort = (queryParams.get("sort") as "title-asc" | "title-desc" | "year-desc" | "year-asc") || undefined;
  const searchParam = queryParams.get("search") || undefined;

  // Local search state for debouncing
  const [searchInput, setSearchInput] = useState(searchParam || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam || "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync debounced search to URL
  useEffect(() => {
    const currentSearch = queryParams.get("search") || "";
    if (debouncedSearch !== currentSearch) {
      const newUrl = buildGalleryUrl({
        phase,
        series,
        year,
        medium,
        sort,
        search: debouncedSearch || undefined,
      });
      setLocation(newUrl, { replace: true });
    }
  }, [debouncedSearch]);

  // Sync URL search param to input
  useEffect(() => {
    if (searchParam !== undefined && searchParam !== searchInput) {
      setSearchInput(searchParam);
    }
  }, [searchParam]);

  // Fetch filter options
  const { data: filterOptions } = trpc.gallery.getFilterOptions.useQuery();

  // Fetch gallery works
  const queryInput = useMemo(
    () => ({
      phase,
      series,
      year,
      medium,
      sort,
      search: debouncedSearch || undefined,
    }),
    [phase, series, year, medium, sort, debouncedSearch]
  );

  const { data: galleryData, isLoading } = trpc.gallery.getAll.useQuery(queryInput);

  const works = galleryData?.items ?? [];
  const total = galleryData?.total ?? 0;

  // Check if any filters are active
  const hasActiveFilters = phase || series || year || medium || sort || debouncedSearch;

  // Update URL with new filter
  const setFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params: Record<string, string | undefined> = {
        phase,
        series,
        year,
        medium,
        sort,
        search: debouncedSearch || undefined,
      };
      params[key] = value;
      const newUrl = buildGalleryUrl(params);
      setLocation(newUrl, { replace: true });
    },
    [phase, series, year, medium, sort, debouncedSearch, setLocation]
  );

  const clearAllFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setLocation("/gallery", { replace: true });
  }, [setLocation]);

  // Store current gallery URL in sessionStorage for back-button support
  useEffect(() => {
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem("gallery-return-url", currentUrl);
  }, [phase, series, year, medium, sort, debouncedSearch]);

  // Filter select component (reused for desktop and mobile)
  const FilterSelect = ({
    label,
    value,
    onValueChange,
    options,
  }: {
    label: string;
    value: string | undefined;
    onValueChange: (val: string | undefined) => void;
    options: { value: string; label: string }[];
  }) => (
    <Select
      value={value || "all"}
      onValueChange={(val) => onValueChange(val === "all" ? undefined : val)}
    >
      <SelectTrigger className="w-full sm:w-[180px] bg-card text-card-foreground border-border font-mono text-xs h-9">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-popover text-popover-foreground border-border">
        <SelectItem value="all" className="font-mono text-xs">
          All {label}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="font-mono text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Phase options
  const phaseOptions = useMemo(
    () =>
      (filterOptions?.phases ?? []).map((p) => ({
        value: p.code,
        label: `${p.code}: ${p.title}`,
      })),
    [filterOptions]
  );

  // Series options
  const seriesOptions = useMemo(
    () =>
      (filterOptions?.series ?? []).map((s) => ({
        value: s,
        label: s,
      })),
    [filterOptions]
  );

  // Year options
  const yearOptions = useMemo(
    () =>
      (filterOptions?.years ?? []).map((y) => ({
        value: y,
        label: y,
      })),
    [filterOptions]
  );

  // Medium options
  const mediumOptions = useMemo(
    () =>
      (filterOptions?.mediums ?? []).map((m) => ({
        value: m,
        label: m.length > 40 ? m.substring(0, 37) + "..." : m,
      })),
    [filterOptions]
  );

  // Sort options
  const sortOptions = [
    { value: "year-desc", label: "Newest First" },
    { value: "year-asc", label: "Oldest First" },
    { value: "title-asc", label: "Title A–Z" },
    { value: "title-desc", label: "Title Z–A" },
  ];

  // Desktop filter bar
  const DesktopFilters = () => (
    <div className="hidden md:flex flex-wrap items-center gap-3">
      <FilterSelect
        label="Phase"
        value={phase}
        onValueChange={(val) => setFilter("phase", val)}
        options={phaseOptions}
      />
      <FilterSelect
        label="Series"
        value={series}
        onValueChange={(val) => setFilter("series", val)}
        options={seriesOptions}
      />
      <FilterSelect
        label="Year"
        value={year}
        onValueChange={(val) => setFilter("year", val)}
        options={yearOptions}
      />
      <FilterSelect
        label="Medium"
        value={medium}
        onValueChange={(val) => setFilter("medium", val)}
        options={mediumOptions}
      />
      <FilterSelect
        label="Sort"
        value={sort}
        onValueChange={(val) => setFilter("sort", val)}
        options={sortOptions}
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="font-mono text-xs text-muted-foreground hover:text-primary h-9"
        >
          <X className="w-3 h-3 mr-1" />
          CLEAR
        </Button>
      )}
    </div>
  );

  // Mobile filter sheet
  const MobileFilters = () => (
    <div className="md:hidden">
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs border-border h-9"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            FILTERS
            {hasActiveFilters && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-background text-foreground border-border max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-mono text-sm tracking-widest text-foreground">
              FILTER WORKS
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">PHASE</label>
              <FilterSelect
                label="Phase"
                value={phase}
                onValueChange={(val) => { setFilter("phase", val); }}
                options={phaseOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">SERIES</label>
              <FilterSelect
                label="Series"
                value={series}
                onValueChange={(val) => { setFilter("series", val); }}
                options={seriesOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">YEAR</label>
              <FilterSelect
                label="Year"
                value={year}
                onValueChange={(val) => { setFilter("year", val); }}
                options={yearOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">MEDIUM</label>
              <FilterSelect
                label="Medium"
                value={medium}
                onValueChange={(val) => { setFilter("medium", val); }}
                options={mediumOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">SORT</label>
              <FilterSelect
                label="Sort"
                value={sort}
                onValueChange={(val) => { setFilter("sort", val); }}
                options={sortOptions}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 font-mono text-xs bg-primary text-primary-foreground"
              >
                APPLY FILTERS
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => {
                    clearAllFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="font-mono text-xs border-border"
                >
                  CLEAR ALL
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="min-h-screen -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
      {/* Header */}
      <div className="border-b border-border">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
          <h1 className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-2">
            MONOLITH GALLERY
          </h1>
          <p className="font-serif text-2xl sm:text-3xl text-foreground">
            The Complete Archive
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 md:top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-3">
          <div className="flex items-center gap-3">
            {/* Search - always visible */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search works..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-9 font-mono text-xs bg-card text-card-foreground border-border placeholder:text-muted-foreground"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Desktop filters */}
            <DesktopFilters />

            {/* Mobile filter button */}
            <MobileFilters />
          </div>

          {/* Result count */}
          <div className="mt-2 font-mono text-xs text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading...
              </span>
            ) : debouncedSearch ? (
              `${total} result${total !== 1 ? "s" : ""} for "${debouncedSearch}"`
            ) : (
              `Showing ${total} work${total !== 1 ? "s" : ""}`
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="py-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-card animate-pulse" />
            ))}
          </div>
        ) : works.length === 0 ? (
          /* Empty state */
          <div className="py-24 text-center space-y-6">
            <p className="font-mono text-sm text-muted-foreground">
              No works match your current filters.
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="font-mono text-xs border-border"
            >
              CLEAR ALL FILTERS
            </Button>
          </div>
        ) : (
          /* Image grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className="block aspect-square relative overflow-hidden bg-card group"
              >
                <img
                  src={work.imageUrl || work.thumbnailUrl || ""}
                  alt={work.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay - desktop only */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 hidden md:flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <span className="font-mono text-xs text-white/90 truncate">
                    {work.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
