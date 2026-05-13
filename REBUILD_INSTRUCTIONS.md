# Project 666: Crucible Masonry Gallery - Rebuild Instructions

If you are rebuilding the site from scratch, you want the cleanest, most predictable implementation of the gallery possible. Here is the exact, step-by-step blueprint to implement the Masonry Gallery without the tangled legacy code that caused the white screens.

## Step 1: Create the Gallery Component
**File Location:** `src/components/CrucibleMasonryGallery.tsx`

This is the pure presentation component. It expects an array of works and handles the "Ghost Holes" and Cloudflare R2 sizing.

```tsx
import { Link } from "wouter";

export function CrucibleMasonryGallery({ works, bucketUrl }: { works: any[], bucketUrl: string }) {
  if (!works || works.length === 0) {
    return <div className="text-white p-8">No archive data found.</div>;
  }

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen text-[#f5f5f5] py-12 px-4 sm:px-8">
      {/* Tailwind Columns create the masonry effect natively */}
      <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-8 space-y-8">
        {works.map((work) => {
          const rating = work.rating || 1;

          // 1. Ghost Hole Logic: Hide items rated 2 or lower natively
          if (rating <= 2) {
            return <div key={work.id} aria-hidden="true" className="opacity-0 pointer-events-none" />;
          }

          // 2. R2 Sizing Logic
          let size = "sm";
          if (rating >= 5) size = "lg";
          else if (rating >= 3) size = "md";

          const imgSrc = `${bucketUrl}/${work.sovereignId}_${work.tCode}_${size}.webp`;

          return (
            <div key={work.id} className="break-inside-avoid relative group cursor-crosshair overflow-hidden rounded bg-[#171717]">
              <Link href={`/work/${work.slug || work.sovereignId}`}>
                <div className="w-full h-auto block transition-all duration-700">
                  <img
                    src={imgSrc}
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-auto object-contain transition-all duration-500 hover:scale-[1.02]"
                  />
                  
                  {/* Hover Information */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 flex flex-col justify-end p-6">
                    <div className="font-mono text-[10px] text-[#22d3ee] mb-2">{work.tCode}</div>
                    <div className="font-serif text-lg text-white mb-1">{work.title}</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Step 2: Create the Page (Data Fetching)
**File Location:** `src/pages/Crucible.tsx`

This page is responsible *only* for fetching the data and filtering out trash before passing it to the gallery. By doing this in a fresh React setup, you avoid state-crashes.

```tsx
import { useMemo } from "react";
import { trpc } from "@/lib/trpc"; // Adjust import to your new setup
import { CrucibleMasonryGallery } from "../components/CrucibleMasonryGallery";

export default function Crucible() {
  // Use your primary, tested database fetcher here
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  // Clean data filtering
  const validWorks = useMemo(() => {
    // Safely extract the array
    const itemsArray = Array.isArray(data) ? data : (data as any)?.items || [];
    
    return itemsArray
      .filter((work: any) => work && work.disposition !== "TR") // Remove explicit trash
      .sort((a: any, b: any) => {
        // Sort by Rating (highest first), then by date
        const scoreA = (a.rating || 1) * 10000 + new Date(a.createdAt || 0).getTime() / 1000000;
        const scoreB = (b.rating || 1) * 10000 + new Date(b.createdAt || 0).getTime() / 1000000;
        return scoreB - scoreA;
      });
  }, [data]);

  if (isLoading) return <div className="p-8 text-white">Loading Archive...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading data.</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <header className="px-8 pt-24 pb-12 border-b border-white/5 text-white">
        <h1 className="font-serif text-5xl mb-2">The Archive</h1>
        <p className="font-mono text-xs text-white/50">{validWorks.length} Works Found</p>
      </header>
      
      <CrucibleMasonryGallery 
        works={validWorks} 
        bucketUrl="https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible" 
      />
    </main>
  );
}
```

## Critical Architecture Notes for the Rebuild
1. **Routing:** Ensure `wouter` (or `react-router-dom` if you switch to it) is properly wrapped around your *entire* App component in your new `main.tsx` or `index.tsx`. The white screen in the legacy repo was likely caused by a routing context error triggered by `wouter`'s `<Link>` tag being used incorrectly somewhere in the dependency tree.
2. **React Version:** Stick to a single React version (e.g., React 18). During debugging, the build logs showed dependency conflicts (`ERESOLVE`) between React 19 and `react-helmet-async`. A clean install will fix this.
3. **Data Safety:** Always ensure your `trpc` endpoints return a guaranteed array format `{ items: [...] }` so your frontend doesn't have to guess the data structure.
