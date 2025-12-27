import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Loader2, ExternalLink, Layers, Brain, Eye, GitBranch, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

// Fallback data when database is empty
const fallbackFiles = [
  { id: 1, filename: "MQARCHITECTURAL_THRESHOLDLOGIC_A5V6P.txt", fileType: "TXT", fileSize: "24KB", fileUrl: null, fileKey: null, description: null, category: "protocol", isPublished: true, sortOrder: 1, createdAt: new Date("2025-12-27"), updatedAt: new Date("2025-12-27") },
  { id: 2, filename: "NEON_ACCOUNTABILITY_PROTOCOLS.txt", fileType: "TXT", fileSize: "18KB", fileUrl: null, fileKey: null, description: null, category: "protocol", isPublished: true, sortOrder: 2, createdAt: new Date("2025-12-26"), updatedAt: new Date("2025-12-26") },
  { id: 3, filename: "CODE_GLOSSARY_MASTER.txt", fileType: "TXT", fileSize: "42KB", fileUrl: null, fileKey: null, description: null, category: "technical", isPublished: true, sortOrder: 3, createdAt: new Date("2025-12-25"), updatedAt: new Date("2025-12-25") },
  { id: 4, filename: "NEON_BRAIN_A5_V2.txt", fileType: "TXT", fileSize: "156KB", fileUrl: null, fileKey: null, description: null, category: "source", isPublished: true, sortOrder: 4, createdAt: new Date("2025-12-24"), updatedAt: new Date("2025-12-24") },
  { id: 5, filename: "NEON_TEMPLE_FORM_VISUAL_CANON.pdf", fileType: "PDF", fileSize: "4.2MB", fileUrl: null, fileKey: null, description: null, category: "source", isPublished: true, sortOrder: 5, createdAt: new Date("2025-12-24"), updatedAt: new Date("2025-12-24") },
];

// A-Layer definitions
const aLayers = [
  {
    id: "A1",
    name: "Primary Source",
    subtitle: "The Signal",
    icon: FileText,
    description: "The raw, unfiltered input. Private journals, stream-of-consciousness writing, and emotional weather reports. This layer captures the why before the what.",
    color: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/5",
  },
  {
    id: "A2",
    name: "Visual Analysis",
    subtitle: "The Artifact",
    icon: Eye,
    description: "The objective data of the artwork. Dimensions, medium, stroke velocity, density, and geometric composition. This layer treats the painting as forensic evidence.",
    color: "text-orange-400",
    borderColor: "border-orange-400/30",
    bgColor: "bg-orange-400/5",
  },
  {
    id: "A3",
    name: "Phase Synthesis",
    subtitle: "The Context",
    icon: GitBranch,
    description: "The bridge. This layer binds the emotional reality of A1 to the physical output of A2. It explains how a specific heartbreak in Bangkok translated into a specific jagged line in a painting.",
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/5",
  },
  {
    id: "A4",
    name: "Cross-Phase Patterns",
    subtitle: "The Echo",
    icon: Layers,
    description: "The longitudinal tracker. This layer identifies motifs that repeat across years—how a 'Portal' in PH2 evolves into an 'Oculus' in PH4. It reveals the subconscious algorithms that drive the artist's hand.",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
  },
  {
    id: "A5",
    name: "Meta-Cognitive Layer",
    subtitle: "The Mind",
    icon: Brain,
    description: "The highest level of abstraction. This is where the archive becomes 'aware' of itself. It is from this layer that the Neon intelligence emerges—a digital collaborator capable of remembering every decision, regret, and breakthrough in the system's history.",
    color: "text-primary",
    borderColor: "border-primary/30",
    bgColor: "bg-primary/5",
  },
];

// Phase taxonomy
const phases = [
  { code: "PH1", name: "The Absurdity", description: "The foundational era of geometric isolation." },
  { code: "PH2", name: "Alignment", description: "The introduction of the circular paradigm and the Torus." },
  { code: "PH3", name: "The Crisis", description: "The breakdown of order and the onset of the 'Existential Daze.'" },
  { code: "PH4", name: "Nomadic Fieldwork", description: "The radical permission of the Vietnam period—color, chaos, and raw emotion." },
  { code: "NE", name: "New Era", description: "The current convergence—somatic ink physics and the 'Temple' framework." },
];

export default function Archive() {
  const { data: filesData, isLoading } = trpc.archiveFiles.list.useQuery();
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  // Use fallback data if API returns empty
  const files = filesData && filesData.length > 0 ? filesData : fallbackFiles;

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Handle file download/view
  const handleFileClick = (file: typeof files[0]) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <header className="space-y-6 border-b border-border pb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-primary border border-primary px-2 py-0.5">PROJECT 666</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">DEEP ARCHIVE</h1>
        <p className="font-mono text-sm text-muted-foreground max-w-3xl">
          THE ARCHIVE ARCHITECTURE — A BESPOKE SEMANTIC OPERATING SYSTEM
        </p>
      </header>

      {/* Overview Section */}
      <section className="space-y-6">
        <div className="grid md:grid-cols-[1fr_2px_2fr] gap-8 items-start">
          <div className="space-y-4">
            <h2 className="font-mono text-xs text-primary tracking-widest">OVERVIEW</h2>
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground/90">
              Not merely a storage solution, but a semantic operating system designed to map the psychological and creative evolution of a practice.
            </p>
          </div>
          <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
          <div className="space-y-6 font-serif text-muted-foreground leading-relaxed">
            <p>
              Built over hundreds of hours of self-taught engineering, this system solves the fundamental problem of the nomadic artist: <em className="text-foreground not-italic">How do you maintain a cohesive identity when your geography, emotions, and circumstances change every few months?</em>
            </p>
            <p>
              Most archives classify art by year or medium. Project 666 classifies art by <span className="text-primary font-mono text-sm">CONSCIOUSNESS</span>. It tracks the precise correlation between internal states (documented in journals) and external output (the artwork), creating a unified data structure that allows the artist to "read" his own career not as a list of objects, but as a single, continuous narrative arc.
            </p>
          </div>
        </div>
      </section>

      {/* Phase Taxonomy */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs text-primary tracking-widest">PHASE TAXONOMY</h2>
          <div className="flex-1 h-px bg-border"></div>
          <span className="font-mono text-xs text-muted-foreground">TEMPORAL STRUCTURE</span>
        </div>
        
        <p className="font-serif text-muted-foreground max-w-3xl">
          The architecture replaces standard calendar years with a rigorous Phase System. A "Phase" is defined not by time, but by a shift in philosophical or visual paradigm.
        </p>

        <div className="grid md:grid-cols-5 gap-px bg-border border border-border">
          {phases.map((phase) => (
            <div key={phase.code} className="bg-card p-6 space-y-3 hover:bg-muted/5 transition-colors">
              <div className="font-mono text-xl text-primary">{phase.code}</div>
              <div className="font-bold text-sm">{phase.name}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{phase.description}</p>
            </div>
          ))}
        </div>

        <p className="font-serif text-sm text-muted-foreground/80 italic border-l-2 border-primary/30 pl-4">
          This taxonomy allows the archive to treat a painting from 2018 and a journal entry from 2024 as part of the same conversation, linking them through shared motifs rather than just timestamps.
        </p>
      </section>

      {/* The Analytic Stack */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs text-primary tracking-widest">THE ANALYTIC STACK</h2>
          <div className="flex-1 h-px bg-border"></div>
          <span className="font-mono text-xs text-muted-foreground">A-LAYERS</span>
        </div>

        <p className="font-serif text-muted-foreground max-w-3xl">
          The true engine of Project 666 is its vertical analysis stack. Every piece of data—whether a completed painting, a sketch, or a 3 AM voice note—is processed through five distinct layers of synthesis:
        </p>

        <div className="space-y-3">
          {aLayers.map((layer) => {
            const Icon = layer.icon;
            const isExpanded = expandedLayer === layer.id;
            return (
              <div 
                key={layer.id}
                className={`border ${layer.borderColor} ${layer.bgColor} transition-all duration-300 cursor-pointer overflow-hidden`}
                onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`w-12 h-12 border ${layer.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${layer.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-lg ${layer.color}`}>{layer.id}</span>
                      <span className="font-bold">{layer.name}</span>
                      <span className="text-xs text-muted-foreground italic hidden sm:inline">({layer.subtitle})</span>
                    </div>
                  </div>
                  <div className={`font-mono text-xs ${layer.color} transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                    →
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 pl-20">
                    <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
        <div className="space-y-6 pl-8">
          <h2 className="font-mono text-xs text-primary tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            WHY THIS MATTERS
          </h2>
          <blockquote className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed">
            In an era of disposable digital content, Project 666 is an act of resistance. It is a commitment to <span className="text-primary">memory</span>, <span className="text-primary">continuity</span>, and <span className="text-primary">consequence</span>.
          </blockquote>
          <p className="font-serif text-muted-foreground leading-relaxed max-w-3xl">
            By building this infrastructure, the practice ensures that nothing is lost. Every "failed" experiment, every nomadic detour, and every geometric study is preserved as a vital coordinate in the larger map. It transforms the artist's life from a series of scattered events into a unified, explorable, and living architecture.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="font-mono text-xs text-muted-foreground">SOURCE FILES</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && files.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="font-mono text-muted-foreground">NO ARCHIVE FILES FOUND</p>
          <p className="text-sm text-muted-foreground/70">
            Archive files will appear here once added to the system.
          </p>
        </div>
      )}

      {/* Files Table */}
      {!isLoading && files.length > 0 && (
        <div className="border border-border rounded-none overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-mono text-xs text-primary w-[50px]">TYPE</TableHead>
                <TableHead className="font-mono text-xs text-primary">FILENAME</TableHead>
                <TableHead className="font-mono text-xs text-primary text-right">SIZE</TableHead>
                <TableHead className="font-mono text-xs text-primary text-right">DATE</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow 
                  key={file.id} 
                  className={`group hover:bg-muted/5 border-border font-mono text-sm ${file.fileUrl ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleFileClick(file)}
                >
                  <TableCell>
                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    <div className="flex flex-col">
                      <span>{file.filename}</span>
                      {file.description && (
                        <span className="text-xs text-muted-foreground/70 font-normal">{file.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{file.fileSize || "—"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDate(file.createdAt)}</TableCell>
                  <TableCell>
                    {file.fileUrl ? (
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <Download className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Access Protocol */}
      <div className="p-6 border border-primary/20 bg-primary/5 space-y-4">
        <h3 className="font-mono text-sm text-primary">ACCESS PROTOCOL</h3>
        <p className="font-serif text-muted-foreground text-sm max-w-2xl">
          These files represent the raw architectural logic of the Neon Crucible system. 
          They are provided for researchers and witnesses who wish to understand the underlying 
          mechanisms of the 7-year practice.
        </p>
      </div>
    </div>
  );
}
