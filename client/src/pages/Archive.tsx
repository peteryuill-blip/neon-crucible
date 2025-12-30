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
    description: "The raw material. The painting. The journal entry. The 3 AM voice memo. Nothing interpreted yet—just the artifact, timestamped, preserved. This is where everything begins.",
    color: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/5",
  },
  {
    id: "A2",
    name: "Visual Analysis",
    subtitle: "The Artifact",
    icon: Eye,
    description: "What the eye sees before the mind categorizes. Color temperature. Gesture velocity. Scale relationships. The forensics of form. A2 reads the work like a body—how does it move? Where does it breathe? What is it hiding?",
    color: "text-orange-400",
    borderColor: "border-orange-400/30",
    bgColor: "bg-orange-400/5",
  },
  {
    id: "A3",
    name: "Phase Synthesis",
    subtitle: "The Context",
    icon: GitBranch,
    description: "Zoom out. How does this piece relate to everything else made in the same psychological territory? What patterns emerge when you lay a year's work side by side? A3 finds the threads that connect individual pieces into movements.",
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/5",
  },
  {
    id: "A4",
    name: "Cross-Phase Patterns",
    subtitle: "The Echo",
    icon: Layers,
    description: "Zoom out further. What carries from PH1 to New Era? What disappeared and why? What returned transformed? A4 reads the career as a single, continuous thought being refined across seven years.",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
  },
  {
    id: "A5",
    name: "Meta-Cognitive Layer",
    subtitle: "The Mind",
    icon: Brain,
    description: "The highest altitude. What does the entire archive reveal about the artist's consciousness? About the practice of documentation itself? A5 is where the archive reads itself—and understands what it means.",
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
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* Header */}
      <header className="space-y-4 sm:space-y-6 border-b border-border pb-6 sm:pb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-[10px] sm:text-xs text-primary border border-primary px-1.5 sm:px-2 py-0.5">PROJECT 666</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">DEEP ARCHIVE</h1>
        <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-3xl">
          THE ARCHIVE ARCHITECTURE — A BESPOKE SEMANTIC OPERATING SYSTEM
        </p>
      </header>

      {/* Overview Section */}
      <section className="space-y-6">
        <div className="grid md:grid-cols-[1fr_2px_2fr] gap-6 sm:gap-8 items-start">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="font-mono text-[10px] sm:text-xs text-primary tracking-widest">OVERVIEW</h2>
            <p className="font-serif text-lg sm:text-2xl md:text-3xl leading-relaxed text-foreground/90">
              Not merely a storage solution, but a semantic operating system designed to map the psychological and creative evolution of a practice.
            </p>
          </div>
          <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
          <div className="space-y-4 sm:space-y-6 font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              Built over hundreds of hours of self-taught engineering, this system solves the fundamental problem of the nomadic artist: <em className="text-foreground not-italic">How do you maintain a cohesive identity when your geography, emotions, and circumstances change every few months?</em>
            </p>
            <p>
              Most archives classify art by year or medium. Project 666 classifies art by <span className="text-primary font-mono text-xs sm:text-sm">CONSCIOUSNESS</span>. It tracks the precise correlation between internal states (documented in journals) and external output (the artwork), creating a unified data structure that allows the artist to "read" his own career not as a list of objects, but as a single, continuous narrative arc.
            </p>
          </div>
        </div>
      </section>

      {/* Phase Taxonomy */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <h2 className="font-mono text-[10px] sm:text-xs text-primary tracking-widest">PHASE TAXONOMY</h2>
          <div className="flex-1 h-px bg-border hidden sm:block"></div>
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">TEMPORAL STRUCTURE</span>
        </div>
        
        <p className="font-serif text-sm sm:text-base text-muted-foreground max-w-3xl">
          The architecture replaces standard calendar years with a rigorous Phase System. A "Phase" is defined not by time, but by a shift in philosophical or visual paradigm.
        </p>

        {/* Mobile: Stacked cards, Desktop: Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-border border border-border">
          {phases.map((phase) => (
            <div key={phase.code} className="bg-card p-3 sm:p-6 space-y-2 sm:space-y-3 hover:bg-muted/5 transition-colors">
              <div className="font-mono text-base sm:text-xl text-primary">{phase.code}</div>
              <div className="font-bold text-xs sm:text-sm">{phase.name}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">{phase.description}</p>
            </div>
          ))}
        </div>

        <p className="font-serif text-xs sm:text-sm text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3 sm:pl-4">
          This taxonomy allows the archive to treat a painting from 2018 and a journal entry from 2024 as part of the same conversation, linking them through shared motifs rather than just timestamps.
        </p>

        {/* Phase System Expansion - Consciousness-Based Explanations */}
        <div className="space-y-4 sm:space-y-6 font-serif text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl">
          <p className="text-foreground/90 font-medium">
            A Phase doesn't end because the year changes. A Phase ends because the artist does—or at least, a version of him.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">PH1</span> was the Absurdity: the question of how to make meaning when meaning doesn't exist. The geometric work from this period carries that weight—circles as philosophical propositions, not decorations.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">PH2</span> was Alignment: finding the vocabulary. The circle became grammar. But grammar without rupture becomes dogma.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">PH2A</span> was the rupture itself. The "Equinox of the Gods" moment. Permission to abandon what had become too safe.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">PH3</span> was Crisis. The mechanisms failed. The work documents what happens when the container cracks. This is not failure—this is data.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">PH4</span> was Nomadic Fieldwork: Vietnam, the raw journals, the cost of authenticity laid bare. The body entered the practice here.
          </p>
          
          <p>
            <span className="font-mono text-xs text-primary">New Era</span> is the current convergence: somatic ink, East-Asian lineage, the Temple framework. The precision of PH1 returns, transformed by everything that came after.
          </p>
        </div>
      </section>

      {/* The Analytic Stack */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <h2 className="font-mono text-[10px] sm:text-xs text-primary tracking-widest">THE ANALYTIC STACK</h2>
          <div className="flex-1 h-px bg-border hidden sm:block"></div>
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">A-LAYERS</span>
        </div>

        <p className="font-serif text-sm sm:text-base text-muted-foreground max-w-3xl">
          The true engine of Project 666 is its vertical analysis stack. Every piece of data—whether a completed painting, a sketch, or a 3 AM voice note—is processed through five distinct layers of synthesis:
        </p>

        <div className="space-y-2 sm:space-y-3">
          {aLayers.map((layer) => {
            const Icon = layer.icon;
            const isExpanded = expandedLayer === layer.id;
            return (
              <div 
                key={layer.id}
                className={`border ${layer.borderColor} ${layer.bgColor} transition-all duration-300 cursor-pointer overflow-hidden`}
                onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
              >
                <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 border ${layer.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${layer.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className={`font-mono text-sm sm:text-lg ${layer.color}`}>{layer.id}</span>
                      <span className="font-bold text-xs sm:text-base">{layer.name}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground italic hidden sm:inline">({layer.subtitle})</span>
                    </div>
                  </div>
                  <div className={`font-mono text-xs ${layer.color} transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                    →
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pl-12 sm:pl-20">
                    <p className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
        <div className="absolute -left-2 sm:-left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
        <div className="space-y-4 sm:space-y-6 pl-4 sm:pl-8">
          <h2 className="font-mono text-[10px] sm:text-xs text-primary tracking-widest flex items-center gap-2">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            WHY THIS MATTERS
          </h2>
          <blockquote className="font-serif text-base sm:text-xl md:text-2xl text-foreground/90 leading-relaxed">
            In an era of disposable digital content, Project 666 is an act of resistance. It is a commitment to <span className="text-primary">memory</span>, <span className="text-primary">continuity</span>, and <span className="text-primary">consequence</span>.
          </blockquote>
          <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            By building this infrastructure, the practice ensures that nothing is lost. Every "failed" experiment, every nomadic detour, and every geometric study is preserved as a vital coordinate in the larger map. It transforms the artist's life from a series of scattered events into a unified, explorable, and living architecture.
          </p>
        </div>
      </section>

      {/* Voices From the Archive */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <h2 className="font-mono text-[10px] sm:text-xs text-primary tracking-widest">VOICES FROM THE ARCHIVE</h2>
          <div className="flex-1 h-px bg-border hidden sm:block"></div>
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">FRAGMENTS</span>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <blockquote className="border-l-2 border-primary/30 pl-4 sm:pl-6 space-y-2">
            <p className="font-serif text-sm sm:text-lg italic text-foreground/90 leading-relaxed">
              "The circle is not a symbol. It is a question I keep asking until the answer changes."
            </p>
            <cite className="font-mono text-[10px] sm:text-xs text-muted-foreground not-italic">
              — Journal, PH1A, 2019
            </cite>
          </blockquote>

          <blockquote className="border-l-2 border-primary/30 pl-4 sm:pl-6 space-y-2">
            <p className="font-serif text-sm sm:text-lg italic text-foreground/90 leading-relaxed">
              "I am not documenting the work. I am documenting myself trying to understand the work. The documentation is the work."
            </p>
            <cite className="font-mono text-[10px] sm:text-xs text-muted-foreground not-italic">
              — Artist statement, 666 Project inception, 2023
            </cite>
          </blockquote>

          <blockquote className="border-l-2 border-primary/30 pl-4 sm:pl-6 space-y-2">
            <p className="font-serif text-sm sm:text-lg italic text-foreground/90 leading-relaxed">
              "Vietnam broke something open. I stopped making paintings about ideas and started making paintings about what it costs to be alive."
            </p>
            <cite className="font-mono text-[10px] sm:text-xs text-muted-foreground not-italic">
              — Fieldwork journal, PH4, 2024
            </cite>
          </blockquote>

          <blockquote className="border-l-2 border-primary/30 pl-4 sm:pl-6 space-y-2">
            <p className="font-serif text-sm sm:text-lg italic text-foreground/90 leading-relaxed">
              "The mess is the message. If I clean it up, I'm lying."
            </p>
            <cite className="font-mono text-[10px] sm:text-xs text-muted-foreground not-italic">
              — Voice memo, 3:17 AM, Bangkok, New Era
            </cite>
          </blockquote>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">SOURCE FILES</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && files.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="font-mono text-sm text-muted-foreground">NO ARCHIVE FILES FOUND</p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            Archive files will appear here once added to the system.
          </p>
        </div>
      )}

      {/* Files - Mobile Card View / Desktop Table */}
      {!isLoading && files.length > 0 && (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className={`border border-border p-3 ${file.fileUrl ? 'cursor-pointer hover:bg-muted/5' : ''} transition-colors`}
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-foreground truncate">{file.filename}</p>
                    {file.description && (
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{file.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span>{file.fileSize || "—"}</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                    </div>
                  </div>
                  {file.fileUrl && (
                    <ExternalLink className="w-3 h-3 text-primary shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block border border-border rounded-none overflow-hidden">
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
        </>
      )}

      {/* Access Protocol */}
      <div className="p-4 sm:p-6 border border-primary/20 bg-primary/5 space-y-3 sm:space-y-4">
        <h3 className="font-mono text-xs sm:text-sm text-primary">ACCESS PROTOCOL</h3>
        <p className="font-serif text-xs sm:text-sm text-muted-foreground max-w-2xl">
          The Deep Archive operates on a tiered access model. Public visitors can browse the phase taxonomy and A-Layer structure. 
          Full source files and raw journal data are restricted to authenticated collaborators and researchers.
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-muted-foreground/60">
          For research access inquiries, contact through the About page.
        </p>
      </div>
    </div>
  );
}
