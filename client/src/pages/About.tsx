import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="space-y-16 pb-24 max-w-3xl">
      <header className="space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">PETER YUILL</h1>
        <div className="font-mono text-sm text-primary border-l-2 border-primary pl-4">
          ARTIST / ARCHITECT OF THE CRUCIBLE / 2018—2025
        </div>
      </header>

      <section className="space-y-6 font-serif text-lg leading-relaxed text-muted-foreground">
        <p>
          <span className="text-foreground font-bold">Peter Yuill</span> is an artist based in Bangkok, formerly of Hong Kong and Tokyo. 
          For the past seven years, he has been engaged in a rigorous, hermetic practice focused on 
          geometric abstraction, somatic discipline, and the construction of private accountability systems.
        </p>
        <p>
          The work explores the tension between the "Void" (absolute silence/emptiness) and the "Signal" 
          (the noise of existence/market). His pieces are often large-scale, intricate ink works on paper 
          or canvas, created through a meditative, physically demanding process.
        </p>
        <p>
          This site, the <span className="text-foreground italic">Neon Crucible</span>, marks the end of a 7-year cycle of silence. 
          It is the first time the full scope of the practice—including the private "Roundup" protocols—has 
          been made visible to the public.
        </p>
      </section>

      <Separator className="bg-border" />

      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="font-mono text-sm tracking-widest text-primary">CONTACT</h3>
          <div className="space-y-2 font-mono text-sm text-muted-foreground">
            <p>STUDIO@PETERYUILL.COM</p>
            <p>BANGKOK, THAILAND</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-sm tracking-widest text-primary">REPRESENTATION</h3>
          <div className="space-y-2 font-mono text-sm text-muted-foreground">
            <p>AVAILABLE FOR INQUIRY</p>
            <p>ARCHIVE ACCESS BY REQUEST</p>
          </div>
        </div>
      </section>

      <div className="pt-12">
        <div className="p-6 border border-border bg-card font-mono text-xs text-muted-foreground space-y-2">
          <p>SITE BUILT BY MANUS AI</p>
          <p>SYSTEM VERSION: 1.0.0</p>
          <p>LAST UPDATE: 2025-12-27</p>
        </div>
      </div>
    </div>
  );
}
