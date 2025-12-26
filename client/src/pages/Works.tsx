import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid as GridIcon, List } from "lucide-react";

export default function Works() {
  // Mock data for works
  const works = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    title: `WORK_STUDY_${100 + i}`,
    date: `202${Math.floor(i / 3)}`,
    phase: `PH${(i % 4) + 1}`,
    technique: i % 2 === 0 ? "Ink on Paper" : "Mixed Media",
    dims: "120x80cm"
  }));

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">WORK ARCHIVE</h1>
          <p className="font-mono text-sm text-muted-foreground">
            INDEXING 500+ WORKS [2018—2025]
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-none border-muted-foreground/30">
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-none text-muted-foreground">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 sticky top-24 z-30 bg-background/95 backdrop-blur py-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="SEARCH ARCHIVE..." 
            className="pl-10 font-mono text-sm rounded-none border-muted-foreground/30 bg-background focus-visible:ring-primary"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px] rounded-none border-muted-foreground/30 font-mono text-sm">
            <SelectValue placeholder="PHASE" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border bg-card">
            <SelectItem value="all">ALL PHASES</SelectItem>
            <SelectItem value="ph1">PHASE 1</SelectItem>
            <SelectItem value="ph2">PHASE 2</SelectItem>
            <SelectItem value="ph3">PHASE 3</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="rounded-none border-muted-foreground/30 font-mono gap-2">
          <Filter className="w-4 h-4" /> FILTERS
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {works.map((work) => (
          <div key={work.id} className="group bg-card aspect-square relative overflow-hidden cursor-pointer hover:bg-muted/5 transition-colors">
            {/* Placeholder Image */}
            <div className="absolute inset-0 bg-muted/10 flex items-center justify-center text-muted-foreground/20 font-mono text-4xl font-bold group-hover:scale-105 transition-transform duration-500">
              IMG_{work.id}
            </div>
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-primary border border-primary px-1 bg-black/50">
                  {work.phase}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{work.date}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-white tracking-tight">{work.title}</h3>
                <div className="flex flex-col gap-1 font-mono text-xs text-gray-300">
                  <span>{work.technique}</span>
                  <span>{work.dims}</span>
                </div>
              </div>
            </div>

            {/* Corner Marker */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-8">
        <div className="flex gap-2 font-mono text-sm">
          <Button variant="outline" disabled className="rounded-none border-muted-foreground/30">PREV</Button>
          <div className="flex items-center px-4 border border-muted-foreground/30 text-muted-foreground">
            PAGE 01 / 42
          </div>
          <Button variant="outline" className="rounded-none border-muted-foreground/30">NEXT</Button>
        </div>
      </div>
    </div>
  );
}
