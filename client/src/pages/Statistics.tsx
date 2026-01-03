import { trpc } from "@/lib/trpc";
import { Loader2, BarChart3, Layers, Ruler, Calendar } from "lucide-react";

export default function Statistics() {
  const { data: stats, isLoading } = trpc.statistics.collection.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No statistics available
      </div>
    );
  }

  const maxPhaseCount = Math.max(...stats.worksByPhase.map(p => p.count));

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <BarChart3 className="w-6 h-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            COLLECTION STATISTICS
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Quantitative analysis of a 7-year artistic practice. {stats.totalWorks} works across {stats.totalPhases} consciousness phases, spanning {stats.yearSpan}.
        </p>
      </section>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="text-5xl font-bold text-primary font-mono">{stats.totalWorks}</div>
          <div className="text-sm text-muted-foreground font-mono">TOTAL WORKS</div>
        </div>
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="text-5xl font-bold text-primary font-mono">{stats.totalPhases}</div>
          <div className="text-sm text-muted-foreground font-mono">PHASES</div>
        </div>
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="text-5xl font-bold text-primary font-mono">7</div>
          <div className="text-sm text-muted-foreground font-mono">YEARS</div>
        </div>
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="text-5xl font-bold text-primary font-mono">
            {stats.techniqueDistribution.length}
          </div>
          <div className="text-sm text-muted-foreground font-mono">TECHNIQUES</div>
        </div>
      </section>

      {/* Works by Phase - Timeline Visualization */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight font-mono">WORKS BY PHASE</h2>
        </div>
        <div className="space-y-4">
          {stats.worksByPhase.map((phase) => {
            const percentage = maxPhaseCount > 0 ? (phase.count / maxPhaseCount) * 100 : 0;
            
            return (
              <div key={phase.phaseId} className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-primary">{phase.phaseCode}</span>
                    <span className="text-sm text-foreground">{phase.phaseTitle}</span>
                    <span className="text-xs text-muted-foreground">({phase.year})</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-primary">{phase.count}</span>
                </div>
                <div className="relative h-8 bg-muted/20 border border-border overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/20 border-r-2 border-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {phase.count} {phase.count === 1 ? 'work' : 'works'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Visualization */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight font-mono">TEMPORAL DISTRIBUTION</h2>
        </div>
        <div className="border border-border bg-card p-8">
          <div className="relative">
            {/* Timeline axis */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border" />
            
            {/* Phase markers */}
            <div className="flex justify-between items-start pt-4">
              {stats.worksByPhase.map((phase, index) => (
                <div key={phase.phaseId} className="flex flex-col items-center space-y-2 flex-1">
                  {/* Marker dot */}
                  <div className="w-3 h-3 rounded-full bg-primary border-2 border-background -mt-[1.375rem]" />
                  
                  {/* Phase info */}
                  <div className="text-center space-y-1">
                    <div className="font-mono text-xs text-primary">{phase.phaseCode}</div>
                    <div className="font-mono text-xs text-muted-foreground">{phase.year}</div>
                    <div className="font-mono text-sm font-bold text-foreground">{phase.count}</div>
                  </div>
                  
                  {/* Connection line to next phase */}
                  {index < stats.worksByPhase.length - 1 && (
                    <div className="absolute top-0 h-px bg-border" 
                         style={{ 
                           left: `${(index + 0.5) * (100 / stats.worksByPhase.length)}%`,
                           width: `${100 / stats.worksByPhase.length}%`
                         }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technique Distribution */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight font-mono">TECHNIQUE DISTRIBUTION</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.techniqueDistribution.map((tech, index) => (
            <div key={index} className="border border-border bg-card p-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-foreground line-clamp-2">{tech.technique}</span>
                <span className="font-mono text-lg font-bold text-primary ml-4">{tech.count}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {((tech.count / stats.totalWorks) * 100).toFixed(1)}% of collection
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size Ranges */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Ruler className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight font-mono">SIZE DISTRIBUTION</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.sizeRanges.map((size, index) => (
            <div key={index} className="border border-border bg-card p-6 space-y-3">
              <div className="text-3xl font-bold text-primary font-mono">{size.count}</div>
              <div className="text-sm text-muted-foreground">{size.range}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {((size.count / stats.totalWorks) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <section className="border-t border-border pt-8">
        <p className="text-sm text-muted-foreground font-mono text-center">
          Statistics generated from {stats.totalWorks} published works in the archive. Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
        </p>
      </section>
    </div>
  );
}
