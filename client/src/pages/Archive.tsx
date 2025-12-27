import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Loader2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Fallback data when database is empty
const fallbackFiles = [
  { id: 1, filename: "MQARCHITECTURAL_THRESHOLDLOGIC_A5V6P.txt", fileType: "TXT", fileSize: "24KB", fileUrl: null, fileKey: null, description: null, category: "protocol", isPublished: true, sortOrder: 1, createdAt: new Date("2025-12-27"), updatedAt: new Date("2025-12-27") },
  { id: 2, filename: "NEON_ACCOUNTABILITY_PROTOCOLS.txt", fileType: "TXT", fileSize: "18KB", fileUrl: null, fileKey: null, description: null, category: "protocol", isPublished: true, sortOrder: 2, createdAt: new Date("2025-12-26"), updatedAt: new Date("2025-12-26") },
  { id: 3, filename: "CODE_GLOSSARY_MASTER.txt", fileType: "TXT", fileSize: "42KB", fileUrl: null, fileKey: null, description: null, category: "technical", isPublished: true, sortOrder: 3, createdAt: new Date("2025-12-25"), updatedAt: new Date("2025-12-25") },
  { id: 4, filename: "NEON_BRAIN_A5_V2.txt", fileType: "TXT", fileSize: "156KB", fileUrl: null, fileKey: null, description: null, category: "source", isPublished: true, sortOrder: 4, createdAt: new Date("2025-12-24"), updatedAt: new Date("2025-12-24") },
  { id: 5, filename: "NEON_TEMPLE_FORM_VISUAL_CANON.pdf", fileType: "PDF", fileSize: "4.2MB", fileUrl: null, fileKey: null, description: null, category: "source", isPublished: true, sortOrder: 5, createdAt: new Date("2025-12-24"), updatedAt: new Date("2025-12-24") },
];

export default function Archive() {
  const { data: filesData, isLoading } = trpc.archiveFiles.list.useQuery();

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
    <div className="space-y-12 pb-24">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">DEEP ARCHIVE</h1>
        <p className="font-mono text-sm text-muted-foreground">
          RAW DATA / TECHNICAL PROTOCOLS / PRIMARY SOURCES
        </p>
      </header>

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
