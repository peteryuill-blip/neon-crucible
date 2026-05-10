# NEON CRUCIBLE — Gallery Integration Specification
## For: Agent Building the Gallery Module
## Status: API LIVE, DATABASE SEEDED, AWAITING GALLERY COMPONENT

---

## THE GOAL

Connect your gallery component into a working full-site architecture. The backend, routing, data layer, and types are all operational. You need to ensure your component consumes the correct props, handles the Curation Wall, and renders images from Cloudflare R2.

---

## THE DATA CONTRACT

### API Endpoint
GET /api/works
Returns: Work[] — an array of work objects.

### The Work Interface
Your gallery receives an array of objects matching this TypeScript interface:

interface Work {
  id: number;
  slug: string;
  title: string;
  tCode: string;
  sovereignId: string;
  phaseId: number;
  medium: string | null;
  dimensions: string | null;
  rating: number | null;
  disposition: string;
  technicalObservation: string | null;
  weekNumber: number | null;
  createdAt: string | null;
}

### Image URL Construction
Every work has images in Cloudflare R2. Build URLs like this:

const BUCKET_URL = "https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible";

function getImageUrl(work: Work, size: "lg" | "md" | "sm"): string {
  return `${BUCKET_URL}/${work.sovereignId}_${work.tCode}_${size}.webp`;
}

// Example:
// https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible/666-042_T2026-W18_md.webp

CRITICAL: If an image 404s, fall back to a placeholder. R2 images may not exist for all demo works yet.

---

## THE CURATION WALL (Already Applied — Do Not Re-implement)

The gallery page (Crucible.tsx) already filters works before passing them to your component. Your works prop is pre-filtered. Three rules applied upstream:

1. Hard Kill: disposition === "TR" → hidden
2. Oracle Kill: JSON matrix_flags.is_kill === true AND not "SA" → hidden
3. Quality Floor: rating < 2 AND not "SA" → hidden

Your component receives only valid works. Do NOT re-filter.

---

## COMPONENT ARCHITECTURE

### File Structure (already created)
client/src/
├── App.tsx                    ← Routing (DON'T TOUCH)
├── main.tsx                   ← Entry point (DON'T TOUCH)
├── index.css                  ← Tailwind theme (DON'T TOUCH)
├── lib/
│   ├── query-client.ts        ← TanStack Query (DON'T TOUCH)
│   └── utils.ts               ← cn() helper (DON'T TOUCH)
├── types.ts                   ← Work interface (DON'T TOUCH)
├── pages/
│   ├── Crucible.tsx           ← Gallery PAGE (fetches data, passes to you)
│   ├── WorkDetail.tsx         ← Single work HUD (DON'T TOUCH)
│   └── NotFound.tsx           ← 404 (DON'T TOUCH)
└── components/
    └── CrucibleMasonryGallery.tsx  ← YOUR FILE ← BUILD THIS

### What Crucible.tsx Already Does
- Fetches all works via TanStack Query (useQuery)
- Applies the Curation Wall filter
- Passes validWorks and bucketUrl to your component

### Your Props
interface CrucibleMasonryGalleryProps {
  works: Work[];        // Already filtered by Curation Wall
  bucketUrl: string;    // R2 bucket base URL
}

---

## VISUAL REQUIREMENTS

### Responsive Column Layout
Screen < 768px     → 1 column
768px – 1024px     → 2 columns
1024px – 1440px    → 3 columns
> 1440px           → 4 columns

Use useEffect + window.resize listener to update dynamically.

### Image Size Selection
function selectSize(rating: number): string {
  if (rating >= 5) return "lg";
  if (rating >= 3) return "md";
  return "sm";
}

Gallery grid uses "_md.webp". Detail view uses "_lg.webp".

### Card Design (minimum viable)
Each masonry card should show:
- Image — lazy-loaded, hover scale effect
- Title — on hover overlay
- Sovereign ID + T-Code — monospaced, small
- Rating stars — 1-5 cyan stars
- Disposition badge — subtle indicator
- Click handler — navigates to /work/{slug}

Use Link from "wouter":
import { Link } from "wouter";
<Link href={`/work/${work.slug}`}>
  <article>...</article>
</Link>

### Hover Overlay
Default:  image only
Hover:    gradient overlay from bottom + metadata

### Color Palette (from index.css)
Background:  #0a0a0a  (neutral-950)
Surface:     #171717  (neutral-900)
Border:      #262626  (neutral-800)
Text:        #f5f5f5  (neutral-100)
Muted:       #737373  (neutral-500)
Accent:      #06b6d4  (cyan-500)
Star:        #22d3ee  (cyan-400)
Kill/Trash:  #ef4444  (red-500)
Save:        #4ade80  (green-400)

---

## ROUTING

The site uses wouter. Routes defined in App.tsx:
/              → Crucible (gallery)
/work/:slug    → WorkDetail (single work HUD)
*              → NotFound

Navigation from gallery to detail: Use <Link href={`/work/${slug}`}> — NOT <a href>.

---

## DEPENDENCIES ALREADY INSTALLED

Your component can import these without installing anything:
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { Work } from "@/types";

Tailwind CSS 4.0 is configured. Use utility classes directly.

---

## TESTING CHECKLIST

Before declaring the gallery "done," verify:
- [ ] Gallery renders without crashing
- [ ] Images load from R2 (or show placeholder on 404)
- [ ] Clicking a work navigates to /work/{slug}
- [ ] Responsive: 1 col mobile, 4 col desktop
- [ ] Hover overlay shows title + metadata
- [ ] Rating stars render correctly
- [ ] Loading state handled gracefully
- [ ] Empty state (no works) shows message

---

## COMMON TRAPS

1. Don't fetch data in the gallery component. Crucible.tsx already fetches and filters.
2. Don't use <a> tags for navigation. Use <Link> from wouter.
3. Don't forget the _md.webp suffix. Image URLs must end with size suffix.
4. Handle missing images. R2 may not have every image yet. Use onError for placeholder.
5. Don't re-implement the Curation Wall. It lives in Crucible.tsx.
6. Respect the color palette. The site is dark-themed. White backgrounds look broken.

---

## CONTEXT: WHAT THIS SITE IS

This is not a portfolio. It is a forensic archive of 294 paintings made over 130 days by a single practitioner. Every work is a diagnostic event. The gallery is a curatorial wall that filters raw studio data into a public-facing collection.

Key concepts your UI should respect:
- The T_170 Singularity — work 170 is where WARMUP became PRODUCTION
- The Curation Wall — trash is hidden, quality is surfaced, saves are preserved
- The Somatic HUD — every work carries body telemetry (steps, pain, energy)
- The Live Edge — works T_276–T_294 have null ambient data (unwritten weather)

The gallery should feel like entering a working studio's archive — clinical, dense, alive.

---

## DELIVERABLE

One file: client/src/components/CrucibleMasonryGallery.tsx

It should:
1. Accept works and bucketUrl props
2. Render a responsive masonry grid
3. Display images, titles, ratings, dispositions
4. Link each card to /work/{slug}
5. Handle loading, empty, and error states gracefully
6. Use the dark theme color palette
7. Be lazy-image friendly

Export: named export CrucibleMasonryGallery

---

## CURRENT STATUS

✅ Database: LIVE (Railway MySQL)
✅ API: /api/works returning data
✅ Tables: works + users created
✅ Demo data: 10 works seeded
✅ Server: Running on auto-detected port
✅ Routing: Wouter configured
✅ Types: Work interface defined
✅ Query client: TanStack Query v5 configured
✅ WorkDetail: Single work HUD built
⏳ Gallery component: AWAITING YOUR BUILD

Build the gallery. The rest is wired.
