import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkDetail() {
  const { slug } = useParams();
  
  // Fetch the work data
  const { data: work, isLoading } = useQuery({ 
    queryKey: [`/api/works/${slug}`] 
  });

  if (isLoading) return (
    <div className="p-24 bg-background min-h-screen">
      <Skeleton className="h-[60vh] w-full opacity-5" />
    </div>
  );
  
  if (!work) return <div className="p-24 font-mono text-red-500">ERROR_404_DATA_NOT_FOUND</div>;

  // Extracting only the permitted somatic data points
  const oracle = work.technicalObservation ? JSON.parse(work.technicalObservation) : null;

  return (
    <main className="min-h-screen bg-background text-white selection:bg-[#00FFCC]">
      {/* Structural Navigation */}
      <nav className="p-8 flex justify-between items-center border-b border-white/5">
        <Link href="/crucible" className="font-mono text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
          ← Return_To_Archive
        </Link>
        <div className="font-mono text-[10px] tracking-widest text-[#00FFCC]">
          {work.tCode} // {work.sovereignId}
        </div>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 lg:p-16 max-w-[1600px] mx-auto">
        {/* THE WORK (High Fidelity) */}
        <div className="lg:col-span-8 flex items-center justify-center bg-[#050505] border border-white/5 p-4">
          <img 
            src={`https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible/${work.sovereignId}_${work.tCode}_lg.webp`}
            alt={work.title}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-2xl"
            loading="eager"
          />
        </div>

        {/* THE PERFORMANCE HUD */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <header className="space-y-4">
            <h1 className="font-serif text-5xl tracking-tight text-white/95">{work.title}</h1>
            <div className="h-[1px] w-12 bg-[#00FFCC]/40" />
            <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
              {work.medium} <br />
              {work.dimensions} <br />
              {work.surfaceName}
            </p>
          </header>

          {/* Somatic Telemetry: Filtered for Public Disclosure */}
          <div className="p-8 border border-white/5 bg-white/[0.01] font-mono text-[10px] tracking-wider leading-relaxed">
            <h3 className="text-[#00FFCC] mb-6 tracking-[0.4em] uppercase opacity-80">Telemetry_Data</h3>
            <div className="space-y-5 opacity-70">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>TOTAL_STEPS</span>
                <span className="text-white">{oracle?.ambient_context?.steps?.toLocaleString() || "NULL"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>AMBIENT_ENERGY</span>
                <span className="text-white">{oracle?.ambient_context?.energy}/10</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>WK_PROD_COUNT</span>
                <span className="text-white">{oracle?.weekly_stats?.count} UNITS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>WEEK_REF</span>
                <span className="text-white">WEEK_{work.weekNumber}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto opacity-10 font-mono text-[8px] tracking-[0.5em] uppercase">
            // Access_Restricted: [Rating_Lock] [Labor_Lock] [Disposition_Lock]
          </div>
        </div>
      </section>
    </main>
  );
}


function WorkStructuredData({ work, phase }: { work: any; phase: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": work.title,
    "url": `https://peteryuill.art/works/${work.slug}`,
    "image": work.imageUrl || work.thumbnailUrl,
    "dateCreated": work.dateCreated || work.year,
    "creator": {
      "@type": "Person",
      "name": "Peter Yuill",
      "url": "https://peter-yuill.com"
    },
    ...(work.medium && { "artMedium": work.medium }),
    ...(work.dimensions && { "size": work.dimensions }),
    ...(work.seriesName && { "isPartOf": { "@type": "CreativeWorkSeries", "name": work.seriesName } }),
    ...(work.neonReading && { "description": work.neonReading }),
    ...(work.conceptTags?.length && { "keywords": work.conceptTags.join(", ") }),
    ...(phase && { "genre": `${phase.code}: ${phase.title}` }),
    "locationCreated": {
      "@type": "Place",
      "name": work.location || "Bangkok, Thailand"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data, isLoading, error } = trpc.gallery.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Preload the main work image for instant display
  useEffect(() => {
    if (!data?.imageUrl && !data?.thumbnailUrl) return;

    setImageLoaded(false);
    const imageUrl = (data.imageUrl || data.thumbnailUrl) as string;
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Show image even if preload fails
    img.src = imageUrl;
  }, [data?.imageUrl, data?.thumbnailUrl]);

  // ✅ Update head tags BEFORE early returns - this prevents hook violation
  useEffect(() => {
    if (!data) return;

    const work = data;
    // Title
    const pageTitle = `${work.title} — Peter Yuill | The Neon Crucible`;
    document.title = pageTitle;

    // Meta description: first 160 chars of neonReading or a fallback
    const description = work.neonReading
      ? work.neonReading.slice(0, 157).trimEnd() + (work.neonReading.length > 157 ? '...' : '')
      : `${work.title} — ${work.medium || 'Artwork'} by Peter Yuill, ${work.year || ''}. Part of the Neon Crucible archive.`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    // og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // og:image
    const imageUrl = work.imageUrl || work.thumbnailUrl || '';
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl);

    // og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://peteryuill.art/works/${work.slug}`);

    // Twitter title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);

    // Twitter description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    // Twitter image
    let twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', imageUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://peteryuill.art/works/${work.slug}`);

    // Restore defaults on unmount
    return () => {
      document.title = 'The Neon Crucible | Peter Yuill 2018-2025';
      if (metaDesc) metaDesc.setAttribute('content', "Peter Yuill's 7-year artistic practice archive and witness system. 500+ works spanning ink, mixed media, and oil. Bangkok-based contemporary artist, 2018-2025.");
      if (ogTitle) ogTitle.setAttribute('content', 'The Neon Crucible | Peter Yuill 2018-2025');
      if (ogDesc) ogDesc.setAttribute('content', "Peter Yuill's 7-year artistic practice archive and witness system.");
      if (ogUrl) ogUrl.setAttribute('content', 'https://peteryuill.art');
      if (canonical) canonical.setAttribute('href', 'https://peteryuill.art/');
    };
  }, [data]);

  // Back button: return to works with preserved filters
  const handleBack = () => {
    const returnUrl = sessionStorage.getItem("gallery-return-url");
    if (returnUrl) {
      setLocation(returnUrl);
    } else {
      setLocation("/works");
    }
  };

  // ✅ NOW early returns are safe - all hooks have been called
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
    <>
      <WorkStructuredData work={work} phase={phase} />
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
      {/* Hero Image - Natural height based on aspect ratio */}
      <div className="relative w-full bg-black">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <img
          src={work.imageUrl || work.thumbnailUrl || ""}
          alt={work.title}
          className={`relative w-full h-auto object-contain bg-black block transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
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
    </>
  );
}
