# TECHNICAL DOCUMENTATION: Crucible Masonry Gallery

## 1. Core Architecture & Purpose
The `CrucibleMasonryGallery` is designed as a "Living Sovereign Dataweb." It replaces standard rigid grids with an organic, weighted masonry layout. It reads from the `tRPC` or `React Query` database feeds and visually prioritizes works based on their Oracle rating, chronological age, and a calculated "chaos" jitter.

### 1.1 Layout Engine (CSS Columns)
Instead of CSS Grid, the gallery uses Tailwind CSS columns (`columns-1 md:columns-2 lg:columns-3 2xl:columns-4`). 
- **Why?** CSS columns naturally flow content top-to-bottom, left-to-right, allowing items of varying heights (due to image aspect ratios) to pack tightly without massive horizontal gaps.
- **Constraints:** Individual items are wrapped in `break-inside-avoid` to prevent images from being sliced across two columns.

## 2. The Weighting System (Algorithm)
Before rendering, the gallery intercepts the raw array of works and calculates a `presenceScore` for each piece. The array is sorted by this score in descending order (highest score = top of the wall).

**The Formula:**
`presenceScore = ratingWeight + recencyWeight + jitter`

- **Rating Weight:** `(rating * 10000)`. This ensures that a 5-star rating ALWAYS appears above a 4-star rating, regardless of age.
- **Recency Weight:** `(Date.now - createdAt) / 1000000`. This acts as a tie-breaker. Between two 5-star works, the newer one appears higher.
- **Chaos Jitter:** `(T-Code Number % 10) * 500`. This adds a slight organic "shuffle" to the masonry blocks so it doesn't look purely mechanical, while maintaining the heavy weights at the top.

## 3. Dynamic R2 Image Routing
The gallery dynamically requests specific image files from the Cloudflare R2 bucket to optimize load times and bandwidth. 

**URL Template:**
`[bucketUrl]/[sovereignId]_[tCode]_[size].webp`

**Size Calculation Rule:**
- Rating 5 (Sovereign): Requests the `_lg.webp` suffix.
- Rating 3-4 (Standard): Requests the `_md.webp` suffix.
- Rating 1-2 (Low): Requests the `_sm.webp` suffix.

## 4. "Ghost Holes" Logic
To make the masonry wall feel like an excavated, ancient ruin, low-rated works are weaponized as negative space.
- **Trigger:** Any work with a rating of `1` or `2`.
- **Execution:** Instead of an image, the component renders an empty, invisible div (`<div aria-hidden="true" className="opacity-0 pointer-events-none" />`).
- **Result:** This creates physical "holes" in the masonry layout, allowing the background to bleed through and creating organic gaps between the higher-rated works.

## 5. Instructions for Future Machine Updating (LLMs/Agents)
If you are an AI tasked with modifying this component, adhere to these constraints:
1. **Do not remove `break-inside-avoid`.** Doing so will shatter the masonry layout across column boundaries.
2. **Preserve the `presenceScore` sorting.** If the user asks for new sorting mechanisms (e.g., sort by color), append it as a toggle state, do not overwrite the default weight system.
3. **Data Integrity:** The gallery expects `work.disposition === "TR"` (Trash) to be pre-filtered by the parent component (e.g., `Crucible.tsx`). However, if TR works leak through, they are styled with grayscale/sepia filters. Do not remove this fallback aesthetic.
4. **Image Errors:** Currently, there is no generic `onError` fallback because the R2 bucket mapping must be strictly maintained. If broken images appear, debug the R2 upload pipeline, do not add an `onError` placeholder that masks missing sovereign data.
