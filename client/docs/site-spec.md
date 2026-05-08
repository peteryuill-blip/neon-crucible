# Site Specification — Neon Crucible

## 1. Purpose
- What this site *is*
- What it is *not*
- Core intent (1–3 sentences max)

---

## 2. Architecture Overview
- Framework (React / Vite / etc)
- Routing strategy (file-based / manual / hybrid)
- State management (if any)
- Rendering model (SPA / SSR / static export)

Include a simple map:

/ → Home  
/works → CrucibleWorks  
/materials → CrucibleMaterials  
/time → CrucibleTime  
/anatomy → CrucibleAnatomy  

---

## 3. Directory Structure

/client/src
  /pages
  /components
  /shared
  /styles
  /assets

Explain:
- what belongs where
- what is forbidden (important)

---

## 4. Design System

### Typography
- fonts used
- fallback stack
- where defined

### Color system
- tokens or hardcoded palette
- semantic meaning (if any)

### Layout rules
- spacing system
- grid rules
- responsiveness rules

---

## 5. Visual Language
- composition rules
- motion philosophy
- interaction style
- constraints (what you intentionally avoid)

---

## 6. Fonts & Assets

### Fonts
- list all fonts
- source (local / Google / bundled)
- usage rules

### Assets
- SVG handling
- image pipeline
- optimization rules

---

## 7. Data Flow

- where data comes from
- static vs dynamic
- API endpoints (if any)
- caching strategy

---

## 8. Routing & Pages

For each route:

### /works
- file: `CrucibleWorks.tsx`
- purpose:
- dependencies:
- key components:

(repeat per page)

---

## 9. Shared Modules

- `/shared/constants`
- `/shared/hooks`
- `/shared/utils`

What lives here and why

---

## 10. Build System

- Vite config summary
- env variables
- build output structure
- known warnings (like analytics placeholders)

---

## 11. External Dependencies

- major libraries
- why they exist
- what they replace

---

## 12. Constraints

This is important:
- what must never be added
- architectural rules
- styling restrictions
- performance constraints

---

## 13. Known Issues / Technical Debt

- unresolved warnings
- bundle size issues
- hacks / temporary fixes

---

## 14. Deployment

- build command
- output directory
- hosting target
- environment variables

---

## 15. Design Intent (Optional but powerful)

Not documentation — *positioning*

- emotional tone of interface
- what experience it tries to create
- what it refuses to become
