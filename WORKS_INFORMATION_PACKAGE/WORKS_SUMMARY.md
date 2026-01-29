# NEON CRUCIBLE - Works Database Summary

**Generated:** January 29, 2026  
**Database:** Complete Archive Export

---

## Overview Statistics

| Metric | Count |
|--------|-------|
| **Total Works** | 152 |
| **Phases** | 9 |
| **Series** | 40+ |
| **Featured Works** | 6 |
| **Date Range** | 2018-03 — 2025-12 |
| **Years Covered** | 7 years (2018-2025) |

---

## Works by Phase

| Phase | Name | Year | Works |
|-------|------|------|-------|
| **NE** | Neon Era | 2025 | 16 |
| **PH4A** | Phase 4A | 2024 | 0 |
| **PH4** | Phase 4 | 2023-2024 | 42 |
| **PH3A** | Phase 3A | 2022-2023 | 0 |
| **PH3** | Phase 3 | 2021-2022 | 27 |
| **PH2A** | Phase 2A | 2020-2021 | 0 |
| **PH2** | Phase 2 | 2019-2020 | 27 |
| **PH1A** | Phase 1A | 2018-2019 | 13 |
| **PH1** | Phase 1 | 2018 | 27 |

**Total:** 152 works across 9 phases

---

## Phase Distribution

```
PH1  (2018):        27 works ████████████████████
PH1A (2018-2019):   13 works ██████████
PH2  (2019-2020):   27 works ████████████████████
PH2A (2020-2021):    0 works 
PH3  (2021-2022):   27 works ████████████████████
PH3A (2022-2023):    0 works 
PH4  (2023-2024):   42 works ███████████████████████████████
PH4A (2024):         0 works 
NE   (2025):        16 works ████████████
```

---

## Featured Works (6)

1. **Tidal** - Covenant series, NE (2025-12)
2. **Covenant III: Threshold-Body** - Covenant series, NE (2025-09)
3. **Covenant II: Vessel-Body** - Covenant series, NE (2025-09)
4. **Covenant I: Storm-Body** - Covenant series, NE (2025-09)
5. **THR3E (Standing Bruise)** - Thr3e series, NE (2025-08)
6. **Big Bang: Shadow Self** - Big Bang series, NE (2025-05)

---

## Major Series

- **Big Bang** (12 works) - NE phase, 2025
- **Covenant** (4 works) - NE phase, 2025
- **Absurdity of Meaning** (27 works) - PH1 phase, 2018
- **Cross Mandala** series - PH2 phase, 2019-2020
- **Ode to Osiris** series - PH2 phase, 2019-2020
- **Constructivist Composition** series - PH3 phase, 2021-2022
- **The Limitless Path of the Intuitive Mind** series - PH3 phase, 2021-2022

---

## Technical Information

### Data Fields Included

Each work record contains:
- **Core Metadata:** ID, title, date created, dimensions
- **Classification:** Phase code/name, series name, technique
- **Visual Data:** Color palette, emotional register
- **Images:** Full resolution URL, thumbnail URL
- **Curatorial:** Journal excerpts, Neon readings
- **Status:** Featured flag, sort order, publish status

### Export Formats

1. **JSON** (`WORKS_EXPORT.json`) - Structured data for programmatic access
2. **CSV** (`WORKS_EXPORT.csv`) - Spreadsheet format for analysis
3. **Markdown** (`WORKS_EXPORT.md`) - Human-readable documentation

---

## Database Schema

### Works Table
- Primary key: `id`
- Foreign keys: `phaseId` → phases table
- Text fields: `title`, `technique`, `dimensions`, `seriesName`
- Large text: `journalExcerpt`, `neonReading`
- URLs: `imageUrl`, `thumbnailUrl`, `imageKey`
- Metadata: `colorPalette`, `emotionalRegister`
- Flags: `featured`, `isPublished`
- Ordering: `sortOrder`
- Timestamps: `createdAt`, `updatedAt`

### Phases Table
- Primary key: `id`
- Unique: `code` (PH1, PH1A, PH2, etc.)
- Fields: `title`, `year`, `description`, `emotionalTemperature`, `color`
- Ordering: `sortOrder`

---

## Archive Integrity

✅ **Complete:** All 152 works have image URLs  
✅ **Classified:** All works assigned to phases  
✅ **Dated:** All works have creation dates  
✅ **No Duplicates:** Cleaned January 2026 (removed 9 duplicates)  
✅ **Sorted:** All works have valid sortOrder values  

---

## Usage Notes

- **CSV Export:** Open in Excel, Google Sheets, or any spreadsheet software
- **JSON Export:** Use for programmatic access, data analysis, or API integration
- **Markdown Export:** Human-readable format with works grouped by phase
- **Image URLs:** All CloudFront CDN URLs, publicly accessible
- **Dimensions:** Format is "height(cm) x width(cm)"

---

**Archive Status:** Production-ready  
**Last Cleanup:** January 29, 2026  
**Database Version:** c6b6b894
