import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";

export default function Archive() {
  const files = [
    { name: "MQARCHITECTURAL_THRESHOLDLOGIC_A5V6P.txt", type: "TXT", size: "24KB", date: "2025-12-27" },
    { name: "NEON_ACCOUNTABILITY_PROTOCOLS.txt", type: "TXT", size: "18KB", date: "2025-12-26" },
    { name: "CODE_GLOSSARY_MASTER.txt", type: "TXT", size: "42KB", date: "2025-12-25" },
    { name: "NEON_BRAIN_A5_V2.txt", type: "TXT", size: "156KB", date: "2025-12-24" },
    { name: "NEON_TEMPLE_FORM_VISUAL_CANON.pdf", type: "PDF", size: "4.2MB", date: "2025-12-24" },
  ];

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">DEEP ARCHIVE</h1>
        <p className="font-mono text-sm text-muted-foreground">
          RAW DATA / TECHNICAL PROTOCOLS / PRIMARY SOURCES
        </p>
      </header>

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
            {files.map((file, i) => (
              <TableRow key={i} className="group hover:bg-muted/5 border-border cursor-pointer font-mono text-sm">
                <TableCell>
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </TableCell>
                <TableCell className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {file.name}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{file.size}</TableCell>
                <TableCell className="text-right text-muted-foreground">{file.date}</TableCell>
                <TableCell>
                  <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
