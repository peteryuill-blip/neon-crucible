import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data, isLoading, error } = trpc.gallery.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Back button: return to works with preserved filters
  const handleBack = () => {
    const returnUrl = sessionStorage.getItem("gallery-return-url");
    if (returnUrl) {
      setLocation(returnUrl);
    } else {
      setLocation("/works");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-sm text-muted-foreground">
            WORK NOT FOUND
          </p>
          <Button
            variant="outline"
            onClick={handleBack}
            className="font-mono text-xs border-border"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            BACK TO WORKS
          </Button>
        </div>
      </div>
    );
  }

  const work = data;
  const phase = data.phase;

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
      {/* Hero Image - Natural height based on aspect ratio */}
      <div className="relative w-full">
        <img
          src={work.imageUrl || work.thumbnailUrl || ""}
          alt={work.title}
          className="relative w-full h-auto object-contain bg-black block"
        />

      </div>

      {/* Metadata Section */}
      <div className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
          {/* Title & Phase */}
          <div className="space-y-3">
            {phase && (
              <a
                href={`/works?phase=${phase.code}`}
                className="font-mono text-xs tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                {phase.code}: {phase.title}
              </a>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
              {work.title}
            </h1>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-y border-border py-8">
            {work.year && (
              <div className="space-y-1">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Year
                </dt>
                <dd className="font-mono text-sm text-foreground">
                  <a
                    href={`/works?year=${work.year}`}
                    className="hover:text-primary transition-colors"
                  >
                    {work.year}
                  </a>
                </dd>
              </div>
            )}
            {work.medium && (
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Medium
                </dt>
                <dd className="text-sm text-foreground leading-relaxed">
                  {work.medium}
                </dd>
              </div>
            )}
            {work.dimensions && (
              <div className="space-y-1">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Dimensions
                </dt>
                <dd className="font-mono text-sm text-foreground">
                  {work.dimensions}
                </dd>
              </div>
            )}
            {work.seriesName && (
              <div className="space-y-1">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Series
                </dt>
                <dd className="font-mono text-sm text-foreground">
                  <a
                    href={`/works?series=${encodeURIComponent(work.seriesName)}`}
                    className="hover:text-primary transition-colors"
                  >
                    {work.seriesName}
                  </a>
                </dd>
              </div>
            )}
          </div>

          {/* Curatorial Hook */}
          {work.curatorialHook && (
            <div className="space-y-3">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Curatorial Note
              </h2>
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/90 border-l-2 border-primary/50 pl-6">
                {work.curatorialHook}
              </p>
            </div>
          )}

          {/* Neon Reading */}
          {work.neonReading && (
            <div className="space-y-3">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Neon Reading
              </h2>
              <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
                {work.neonReading.split("\n").filter(Boolean).map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed text-card-foreground/85"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Concept Tags */}
          {work.conceptTags && Array.isArray(work.conceptTags) && work.conceptTags.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Concept Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {work.conceptTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="font-mono text-xs px-3 py-1.5 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Metadata */}
          <div className="border-t border-border pt-8 flex flex-wrap gap-6 text-xs font-mono text-muted-foreground">
            {work.emotionalRegister && (
              <div>
                <span className="text-muted-foreground/50">REGISTER:</span>{" "}
                <span className="text-foreground/70">{work.emotionalRegister}</span>
              </div>
            )}
            {work.colorPalette && (
              <div>
                <span className="text-muted-foreground/50">PALETTE:</span>{" "}
                <span className="text-foreground/70">{work.colorPalette}</span>
              </div>
            )}
          </div>

          {/* Back to Works */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="font-mono text-xs border-border rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              BACK TO WORKS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
