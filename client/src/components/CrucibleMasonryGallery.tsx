/**
 * CrucibleMasonryGallery.tsx
 *
 * Rating-weighted CSS Grid masonry gallery backed by Cloudflare R2 naming:
 *
 *   666xxx_T_xxx_full.jpg
 *   666xxx_T_xxx_lg.webp
 *   666xxx_T_xxx_md.webp
 *   666xxx_T_xxx_sm.webp
 *   666xxx_T_xxx_thumb.jpg
 *   666xxx_T_xxx_card.jpg
 *   666xxx_T_xxx_detail.jpg
 *
 * R2 bucket directory:
 *   neonwebsite/Crucible/
 *
 * Public URL:
 *   https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible/
 */

import React from "react";
import { Link } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Work {
  id: number;
  tCode: string;        // "T_249"
  title: string;        // Often "666249" (sovereign ID)
  slug: string;         // "T_249" — drives /works/T_249
  rating: number;       // 1–5
  thumbnailUrl: string; // Fallback URL from DB
  imageUrl: string;     // Fallback URL from DB
  dimensions: string;   // "97x180cm"
  dateCreated: string;
  medium: string;
  surfaceName: string;
}

interface Props {
  works: Work[];

  /**
   * If true, resolve src from Cloudflare naming convention + base URL.
   * If false, resolve local files.
   */
  useCloudflare?: boolean;

  /** Base path for local files. */
  localBasePath?: string;

  /** Public HTTP base URL for R2 objects (browser-reachable). */
  r2PublicBaseUrl?: string;
}

// ─── Cloudflare R2 constants ────────────────────────────────────────────────

const R2_ACCOUNT_ID = "ee59ee5cb7da30e22c2451223113cff8";
const R2_BUCKET = "neonwebsite";
const R2_PREFIX = "Crucible";

// Public r2.dev URL — browser-reachable, no signing required.
const R2_PUBLIC_HOST = "https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev";

const DEFAULT_R2_PUBLIC_BASE_URL = `${R2_PUBLIC_HOST}/${R2_PREFIX}/`;

// S3 API endpoint (kept for reference / server-side boto3 usage only —
// NOT browser-usable, requires SigV4 signing).
const R2_S3_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeBaseUrl(base: string): string {
  return base.endsWith("/") ? base : `${base}/`;
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

/**
 * Extract xxx from "T_xxx" and build:
 *  - sovereignId: "666xxx"
 *  - stem: "666xxx_T_xxx"
 */
function buildArtworkStem(work: Work): { sovereignId: string; stem: string } {
  const m = work.tCode.match(/^T_(\d{1,})$/i);
  const index = m ? pad3(Number(m[1])) : "000";

  // If title already looks like sovereign ID, trust it.
  const sovereignFromTitle = /^666\d{3}$/.test(work.title) ? work.title : null;
  const sovereignId = sovereignFromTitle ?? `666${index}`;

  return {
    sovereignId,
    stem: `${sovereignId}_T_${index}`,
  };
}

function ratingToGallerySuffix(rating: number): "_lg" | "_md" | "_sm" | null {
  switch (rating) {
    case 5:
      return "_lg";
    case 4:
      return "_md";
    case 3:
      return "_sm";
    default:
      return null; // 1 & 2 = ghost hole
  }
}

function getGridSpan(rating: number): { colSpan: string; rowSpan: string } | null {
  switch (rating) {
    case 5:
      return { colSpan: "col-span-3", rowSpan: "row-span-3" };
    case 4:
      return { colSpan: "col-span-2", rowSpan: "row-span-2" };
    case 3:
      return { colSpan: "col-span-1", rowSpan: "row-span-1" };
    default:
      return null;
  }
}

/**
 * Resolve image src:
 * - Cloudflare mode: `${r2BaseUrl}${stem}${suffix}.webp`
 * - Local mode:      `${localBasePath}${stem}${suffix}.webp`
 */
function getImageSrc(
  work: Work,
  localBasePath: string,
  useCloudflare: boolean,
  r2PublicBaseUrl: string
): string | null {
  const suffix = ratingToGallerySuffix(work.rating);
  if (!suffix) return null;

  const { stem } = buildArtworkStem(work);

  if (useCloudflare) {
    const base = normalizeBaseUrl(r2PublicBaseUrl);
    return `${base}${stem}${suffix}.webp`;
  }

  const localBase = localBasePath.endsWith("/") ? localBasePath : `${localBasePath}/`;
  return `${localBase}${stem}${suffix}.webp`;
}

/**
 * T_170 inflection: cyan (Warm-Up) vs magenta (Production Phase)
 */
function getPhaseGlow(tCode: string): { border: string; glow: string } {
  const n = parseInt(tCode.replace("T_", ""), 10);
  if (n >= 170) {
    return {
      border: "border-fuchsia-500/20 hover:border-fuchsia-500/60",
      glow: "hover:shadow-[0_0_24px_rgba(217,70,239,0.25)]",
    };
  }
  return {
    border: "border-cyan-500/20 hover:border-cyan-500/60",
    glow: "hover:shadow-[0_0_24px_rgba(0,255,204,0.2)]",
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CrucibleMasonryGallery({
  works,
  useCloudflare = true,
  localBasePath = "/works/crucible/",
  r2PublicBaseUrl = DEFAULT_R2_PUBLIC_BASE_URL,
}: Props) {
  if (!works.length) {
    return (
      <div className="border border-dashed border-border/40 p-16 text-center">
        <p className="font-mono text-xs text-muted-foreground/40 tracking-widest">
          NO WORKS IN ARCHIVE
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-6 auto-rows-[200px] gap-px bg-border"
        style={{ contain: "layout" }}
      >
        {works.map((work) => {
          const span = getGridSpan(work.rating);

          // Ghost hole for rating 1 & 2
          if (!span) {
            return (
              <div
                key={work.id}
                className="col-span-1 row-span-1 bg-background"
                aria-hidden="true"
              />
            );
          }

          const src = getImageSrc(
            work,
            localBasePath,
            useCloudflare,
            r2PublicBaseUrl
          );
          const glow = getPhaseGlow(work.tCode);

          return (
            <Link key={work.id} href={`/works/${work.slug}`}>
              <div
                className={[
                  span.colSpan,
                  span.rowSpan,
                  "group relative overflow-hidden bg-background border cursor-pointer",
                  "transition-all duration-300",
                  glow.border,
                  glow.glow,
                ].join(" ")}
              >
                <img
                  src={src ?? work.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={(e) => {
                    // Fallback chain: thumbnailUrl -> imageUrl
                    const img = e.currentTarget;
                    if (img.src !== work.thumbnailUrl && work.thumbnailUrl) {
                      img.src = work.thumbnailUrl;
                      return;
                    }
                    if (img.src !== work.imageUrl && work.imageUrl) {
                      img.src = work.imageUrl;
                    }
                  }}
                />

                <div
                  className={[
                    "absolute inset-0 flex flex-col justify-end p-4",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
                  ].join(" ")}
                >
                  <p className="font-mono text-xs tracking-widest text-white/90">
                    {work.title}
                  </p>
                  <p className="font-mono text-[10px] text-white/50 mt-0.5">
                    {work.dimensions}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/*
        Tailwind safelist reminder (tailwind.config):
        safelist: [
          "col-span-1", "col-span-2", "col-span-3",
          "row-span-1", "row-span-2", "row-span-3",
        ]
      */}
    </>
  );
}
