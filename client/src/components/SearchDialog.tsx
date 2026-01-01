import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Image, FileText, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocation } from "wouter";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [, setLocation] = useLocation();

  const { data: results, isLoading } = trpc.search.query.useQuery(
    { q: debouncedQuery, limit: 20 },
    { enabled: debouncedQuery.length > 0 }
  );

  const handleSelect = useCallback((result: { type: string; id: number; title: string; description?: string; imageUrl?: string; phaseCode?: string; emotionalRegister?: string }) => {
    onOpenChange(false);
    setQuery("");

    if (result.type === "work") {
      setLocation(`/works?id=${result.id}`);
    } else if (result.type === "phase") {
      setLocation(`/neon`);
    } else if (result.type === "essay") {
      setLocation(`/neon`);
    }
  }, [setLocation, onOpenChange]);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const getIcon = (type: string) => {
    switch (type) {
      case "work":
        return <Image className="w-4 h-4" />;
      case "phase":
        return <Layers className="w-4 h-4" />;
      case "essay":
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "work":
        return "Work";
      case "phase":
        return "Phase";
      case "essay":
        return "Essay";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm text-muted-foreground">
            SEARCH ARCHIVE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search works, phases, essays..."
              className="pl-10 bg-background border-border font-mono"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {debouncedQuery.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm font-mono">
                Type to search across works, phases, and essays
              </div>
            )}

            {debouncedQuery.length > 0 && !isLoading && results?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm font-mono">
                No results found for "{debouncedQuery}"
              </div>
            )}

            {results?.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="w-full text-left p-3 hover:bg-muted/10 border border-transparent hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail or Icon */}
                  {result.imageUrl ? (
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-12 h-12 object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center border border-border bg-muted/5">
                      {getIcon(result.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-primary">
                        {getTypeLabel(result.type)}
                      </span>
                      {result.phaseCode && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {result.phaseCode}
                        </span>
                      )}
                      {result.emotionalRegister && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {result.emotionalRegister}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          {debouncedQuery.length === 0 && (
            <div className="text-center text-xs text-muted-foreground font-mono pt-2 border-t border-border">
              Press <kbd className="px-1 border border-border rounded">Cmd</kbd> +{" "}
              <kbd className="px-1 border border-border rounded">K</kbd> to toggle
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
