# Neon Crucible: Artwork Display System Documentation

## Overview

This document explains how artwork is visually displayed across the Neon Crucible website. Use this as a reference when discussing organization strategies with AI assistants or collaborators.

---

## 1. Database Schema: What Data Exists for Each Work

Every artwork in the system has the following fields stored in the database:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | Integer | Auto-generated unique identifier | `42` |
| `title` | String (255 chars) | The work's title | `"STUDY_001"` |
| `phaseId` | Integer (FK) | Links to a Phase record | `3` (links to PH2A) |
| `dateCreated` | String (32 chars) | When the work was made | `"2021-03"` or `"2021"` |
| `technique` | String (128 chars) | Medium/technique used | `"Ink on Paper"`, `"Mixed Media"`, `"Oil on Canvas"` |
| `dimensions` | String (64 chars) | Physical size | `"120x80cm"` |
| `colorPalette` | String (128 chars) | Dominant colors | `"Black, Red, Gold"` |
| `emotionalRegister` | String (64 chars) | Emotional quality | `"gentle"`, `"brutal"`, `"meditative"` |
| `imageUrl` | Text | Full-resolution image URL (S3) | `"https://s3.../work_42.jpg"` |
| `thumbnailUrl` | Text | Smaller preview image URL | `"https://s3.../work_42_thumb.jpg"` |
| `journalExcerpt` | Text | Quote from artist's journal | `"Today I understood..."` |
| `neonReading` | Text | Neon's curatorial interpretation | Markdown text |
| `seriesName` | String (128 chars) | If part of a series | `"Covenant triptych"`, `"Big Bang"` |
| `isPublished` | Boolean | Visibility toggle | `true` / `false` |
| `sortOrder` | Integer | Manual ordering | `1`, `2`, `3`... |

### Phase Information (Linked Table)

Each work can belong to a **Phase**, which has:

| Field | Description | Example |
|-------|-------------|---------|
| `code` | Short identifier | `"PH1"`, `"PH2A"`, `"PH4"` |
| `title` | Full phase name | `"Study Phase"`, `"Void Series"` |
| `year` | Time period | `"2018"`, `"2021-2022"` |
| `description` | What this phase represents | Long text |
| `emotionalTemperature` | Overall mood | `"intense"`, `"meditative"` |
| `color` | Canonical phase color | `"#FF0000"` |

---

## 2. Works Page: Main Gallery View (`/works`)

### 2.1 Page Header

```
┌─────────────────────────────────────────────────────────────┐
│  WORK ARCHIVE                                    [Grid][List]│
│  INDEXING 523 WORKS [2018—2025]                             │
└─────────────────────────────────────────────────────────────┘
```

- **Title**: "WORK ARCHIVE" in large bold text (4xl-6xl)
- **Subtitle**: Shows total work count dynamically: "INDEXING {N} WORKS [2018—2025]"
- **View Toggle**: Two buttons to switch between Grid and List view

### 2.2 Filter Controls (Sticky Bar)

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 SEARCH ARCHIVE...]  [PHASE ▼]  [TECHNIQUE ▼]  [✕ CLEAR] │
└─────────────────────────────────────────────────────────────┘
```

- **Search**: Text input that filters by title (partial match)
- **Phase Dropdown**: Lists all phases (e.g., "PH1 — Study Phase", "PH2A — Void Series")
- **Technique Dropdown**: Lists unique techniques from current works
- **Clear Button**: Resets all filters

The filter bar is **sticky** (stays visible when scrolling) with a blurred background.

### 2.3 Grid View (Default)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│ │         │ │         │ │         │  3 columns on desktop   │
│ │  IMAGE  │ │  IMAGE  │ │  IMAGE  │  2 columns on tablet    │
│ │         │ │         │ │         │  1 column on mobile     │
│ └─────────┘ └─────────┘ └─────────┘                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│ │         │ │         │ │         │                         │
│ │  IMAGE  │ │  IMAGE  │ │  IMAGE  │                         │
│ │         │ │         │ │         │                         │
│ └─────────┘ └─────────┘ └─────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

**Each Grid Cell:**
- **Aspect Ratio**: Square (1:1)
- **Default State**: Shows image only (or placeholder "IMG_42" if no image)
- **Hover State**: Dark overlay (60% black) reveals:
  - Top-left: Phase code badge (e.g., "PH2A") in cyan border
  - Top-right: Date created
  - Bottom: Title (bold, white), Technique, Dimensions
  - Corner marker: Small L-shaped cyan accent

**Visual Treatment:**
- 1px gap between cells (border effect)
- Image scales up 5% on hover (subtle zoom)
- Smooth 500ms transition on hover

### 2.4 List View (Alternative)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌────┐                                                      │
│ │IMG │  STUDY_001                              [PH1]        │
│ │    │  Ink on Paper • 120x80cm                2018-03      │
│ └────┘                                                      │
├─────────────────────────────────────────────────────────────┤
│ ┌────┐                                                      │
│ │IMG │  THRESHOLD_001                          [PH1A]       │
│ │    │  Mixed Media • 150x100cm                2019-01      │
│ └────┘                                                      │
└─────────────────────────────────────────────────────────────┘
```

**Each List Row:**
- **Thumbnail**: 80x80px square on the left
- **Title**: Bold, truncated if too long
- **Meta Line**: Technique • Dimensions
- **Right Side**: Phase badge + Date

### 2.5 Pagination

```
┌─────────────────────────────────────────────────────────────┐
│              [PREV]  PAGE 01 / 44  [NEXT]                   │
└─────────────────────────────────────────────────────────────┘
```

- **Items Per Page**: 12 works
- **Display**: "PAGE 01 / 44" format (zero-padded)
- **Buttons**: PREV/NEXT with disabled states

---

## 3. Work Detail Modal (Lightbox)

When clicking any work, a modal opens:

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┬─────────────────────────────────────┤
│ │                     │  [PH2A]  2021-03                    │
│ │                     │                                     │
│ │                     │  VOID_SERIES_001                    │
│ │      LARGE          │  ─────────────────                  │
│ │      IMAGE          │                                     │
│ │                     │  TECHNIQUE     DIMENSIONS           │
│ │                     │  Acrylic       120x80cm             │
│ │                     │                                     │
│ │                     │  PALETTE       REGISTER             │
│ │                     │  Black, Red    brutal               │
│ │                     │                                     │
│ │                     │  SERIES                             │
│ │                     │  Void Series                        │
│ │                     │                                     │
│ │                     │  ┌─ JOURNAL EXCERPT ──────────────┐ │
│ │                     │  │ "Today I understood that..."   │ │
│ │                     │  └────────────────────────────────┘ │
│ │                     │                                     │
│ │                     │  ┌─ NEON'S READING ───────────────┐ │
│ │                     │  │ This work represents a turning │ │
│ │                     │  │ point in the void series...    │ │
│ │                     │  └────────────────────────────────┘ │
│ └─────────────────────┴─────────────────────────────────────┤
└─────────────────────────────────────────────────────────────┘
```

**Layout**: Two-column on desktop (image left, details right), stacked on mobile

**Left Panel (Image)**:
- Square aspect ratio container
- Image uses `object-contain` (shows full image, may have letterboxing)
- Placeholder if no image

**Right Panel (Details)**:
- **Header**: Phase badge + Date
- **Title**: Large bold text
- **Metadata Grid**: 2-column layout showing:
  - Technique
  - Dimensions
  - Color Palette (if exists)
  - Emotional Register (if exists)
  - Series Name (if exists, spans full width)
- **Journal Excerpt**: Italic serif text with cyan left border
- **Neon's Reading**: Boxed section with muted background, renders Markdown

---

## 4. Visual Design Language

### 4.1 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Black | `#000000` | Background |
| Neon Cyan | `#00FFFF` | Primary accent, phase badges, highlights |
| Hot Pink | `#FF00FF` | Secondary accent |
| Alert Red | `#FF0000` | Warnings, important markers |
| Muted Gray | Various | Text, borders, subtle elements |

### 4.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page Titles | Space Mono | Bold | 4xl-6xl |
| Work Titles | System Sans | Bold | xl-2xl |
| Body Text | EB Garamond | Regular | base |
| Labels/Meta | Space Mono | Regular | xs |
| Journal Excerpts | EB Garamond | Italic | base |

### 4.3 Design Principles

1. **High Contrast**: Deep black backgrounds with bright cyan/white text
2. **Brutalist Geometry**: Sharp corners (no border-radius), 1px borders
3. **Monospace Data**: All metadata uses monospace font
4. **Hover Reveals**: Information hidden until interaction
5. **Minimal Chrome**: No decorative elements, pure function

---

## 5. Data Organization Questions for Discussion

### Current Organization Methods:
1. **By Phase**: Works belong to phases (PH1, PH2A, etc.)
2. **By Technique**: Ink on Paper, Mixed Media, Oil on Canvas, etc.
3. **By Date**: Year-month format
4. **By Series**: Named groups like "Covenant triptych"
5. **By Emotional Register**: gentle, brutal, meditative, etc.

### Questions to Explore:
1. Should works have multiple phases/tags?
2. How to handle works that span multiple techniques?
3. Should there be a "featured" or "highlight" flag?
4. How to organize 500+ works for discoverability?
5. Should there be a timeline view in addition to grid/list?
6. How to surface related works (same series, same register)?
7. Should filters be combinable (AND) or exclusive (OR)?

### Potential New Fields:
- `status`: "available", "sold", "private collection"
- `location`: Where the work currently resides
- `exhibition`: Shows it has appeared in
- `relatedWorks`: Links to other works
- `tags`: Freeform tagging system
- `featured`: Boolean for homepage highlights

---

## 6. File Locations

| File | Purpose |
|------|---------|
| `/client/src/pages/Works.tsx` | Main works gallery page |
| `/drizzle/schema.ts` | Database schema definitions |
| `/server/db.ts` | Database query functions |
| `/server/routers.ts` | API endpoints |
| `/client/src/pages/admin/AdminWorks.tsx` | Admin CRUD interface |

---

## 7. Current Limitations

1. **No individual work pages**: Works only viewable in modal, not at `/works/42`
2. **No image zoom**: Modal shows image at container size only
3. **No related works**: Modal doesn't suggest similar pieces
4. **Single filter at a time**: Can't combine phase + technique + register
5. **No sorting options**: Only shows by sortOrder, can't sort by date/title
6. **No bulk operations**: Must add works one at a time in admin

---

*Document generated for discussion purposes. Take this to Perplexity or another AI to explore organization strategies.*
