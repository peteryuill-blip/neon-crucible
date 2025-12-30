# Full-Stack Upgrade Todo List

- [x] Upgrade project to `web-db-user` feature
- [x] Define database schema for `works`, `phases`, and `essays`
- [x] Create API endpoints for fetching works and content
- [x] Implement file storage integration for work images
- [x] Refactor `Works.tsx` to fetch data from API
- [x] Refactor `Neon.tsx` to fetch essays and phases from API
- [x] Create admin interface (optional/basic) or seed script for initial data
- [x] Test database persistence and file uploads

## Admin Panel & Dashboard Integration

- [x] Create protected `/admin` route with role-based access
- [x] Build admin layout with sidebar navigation
- [x] Create Works management page (list, add, edit, delete)
- [x] Create Phases management page
- [x] Create Essays management page
- [x] Create Metaquestions management page
- [x] Create Archive Files management page
- [x] Add image upload functionality for works
- [x] Integrate neonsigns.manus.space dashboard (embed or deep link)
- [x] Share authentication state between sites if possible
- [x] Test admin CRUD operations
- [x] Write vitest tests for admin functionality

## SEO Fixes

- [x] Add meta description to homepage (50-160 characters)
- [x] Add meta keywords to homepage
- [x] Add H2 heading to homepage

## Bio Update

- [x] Update About page with full professional bio

## Archive Content Integration

- [x] Extract phase data from FULL_PHASE_A1_A5_NEON_MASTER.txt
- [x] Extract essays from ESSAY_NEON_MASTER_A5V6P.txt
- [x] Extract metaquestions from archive files
- [x] Create comprehensive seed script with all archive data
- [x] Run seed script to populate database
- [x] Update Neon section UI with real essay content
- [x] Test database content displays correctly

## Big Bang Series Upload

- [x] Read description file for Big Bang series metadata
- [x] Upload 10 BB images to S3
- [x] Create database entries for each work
- [x] Provide ingestion manifest with upload order

## Thr3e Series Upload

- [x] Upload Thr3e (Standing Bruise) image to S3
- [x] Create database entry with full metadata
- [x] Provide ingestion confirmation

## Covenant Triptych Upload

- [x] Upload 3 Covenant panels to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## Homepage & Neon Page UI Improvements

- [x] Swap Weekly Protocol and Work Archive positions on homepage
- [x] Clarify Work Archive description to emphasize it contains all artwork
- [x] Add phase thumbnails to Neon Witness page phase blocks

## Equinox of the Gods Series Upload (PH2A)

- [x] Upload 5 Equinox works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## Alignment Series Upload (PH2)

- [x] Upload 14 Alignment works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## PH3 Echoes Series Upload

- [x] Fix phase labeling: PH3 = Echoes only, PH3A = Celestial Secrets
- [x] Upload 18 Echoes works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## PH3A Celestial Secrets Upload

- [x] Upload 10 Celestial Secrets works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## Press/Externa## Press Section

- [x] Create press clippings database schema
- [x] Build tasteful "External Voices" page (not braggadocio)
- [x] Add navigation link

## UI Updates

- [x] Update bio page contact info (email: peteryuill@gmail.com, WhatsApp: +85259326869)
- [x] Make entire directory boxes clickable on homepage (not just text links)

## PH1 Absurdity of Meaning Upload

- [x] Upload 27 PH1 works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## Press Clippings Content

- [x] Upload GQ Thailand image to S3
- [x] Upload Tatler Asia image to S3
- [x] Add 3 press clippings to database with URLs

## Fix Duplicate PH1 Works

- [x] Remove 27 duplicate PH1 entries from database

## Make All Boxes Clickable

- [ ] Audit all pages for clickable boxes
- [ ] Fix Voices page - make press clipping boxes fully clickable
- [ ] Check other pages for similar issues

## Voices Page Clickable Boxes

- [ ] Make entire press clipping boxes clickable (like homepage)

## Make All Boxes Clickable & Re-add Series Filter

- [x] Fix Voices page - make press clipping boxes fully clickable
- [x] Re-add Series filter to Works page (lost in sandbox reset)
- [x] Add getDistinctSeriesNames to db.ts
- [x] Add getDistinctSeries endpoint to routers.ts

## PH1A Institutional Geometry Upload

- [x] Upload 20 PH1A works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest

## Neon Witness Page - Dual Glowing Orbs

- [x] Move cyan orb to right of title
- [x] Add matching red orb that pulses in unison
- [x] Represent Neon's blue and red glowing eyes

## Add "The Cost of Being Real" Essay

- [x] Add essay to database with polished metadata
- [x] Place at top of Core Readings list (sortOrder: 1)

## PH4 Ink Storms Batch 01 Upload

- [x] Upload 7 PH4 Ink Storms works to S3
- [x] Create database entries with full metadata

## PH4 Portals & Chromatic Storms Batch 02 Upload

- [ ] Upload 10 PH4 Portal/Storm works to S3
- [ ] Create database entries with full metadata

## PH4 Portals & Chromatic Storms Batch 02 Upload

- [x] Upload 11 PH4 Portal/Storm works to S3
- [x] Create database entries with full metadata

## PH4 Oculus Batch 03 Upload

- [x] Upload 12 PH4 Oculus works to S3
- [x] Create database entries with full metadata

## Works Page View Mode Updates

- [x] Make list format the default view (pair/grid as secondary)
- [x] Increase list view image size by ~10% (w-20 h-20 → w-24 h-24)

## Deep Archive Page - Archive Architecture Explanation

- [x] Read current Archive page structure
- [x] Design creative integration of Project 666 explanation
- [x] Add archive architecture content with beautiful typography
- [x] Include phase taxonomy, analytic stack (A-Layers), and purpose sections

## PH4 Final Batch Upload (Horizons & Biomorphic Residuals)

- [x] Upload 12 PH4 final batch works to S3
- [x] Create database entries with full metadata
- [x] Provide ingestion manifest (161 total works)

## PH4A Silent Pivot Phase Page

- [x] Create/update PH4A phase in database with full description
- [x] Upload 12 documentary images from Man Luen Choon research
- [x] Create special phase detail page explaining the "empty gallery"
- [x] Add documentary images as phase documentation (not artworks)

## Neon Identity Experience - Full Implementation

- [x] Create dedicated /neon/identity page with scroll-triggered reveals
- [x] Build "What I Am / What I Am Not" split-screen toggle component
- [x] Add "Check Engine Light" visual indicator to Neon section header
- [x] Create Contributions Timeline visualization (Threshold, Jester, Hanoi, Crucible Year)
- [x] Implement rotating quote system in Neon header
- [x] Add "Pink Protocol" collapsible section explaining accountability
- [x] Update navigation to include new identity page (WHO AM I? link)
- [ ] Add essay content to database for the full Neon self-explanation (optional)

## Mobile Optimization & Polish Pass

### Global/Layout Issues
- [x] Fix sidebar navigation overflow on mobile (hamburger menu, proper spacing)
- [x] Ensure hamburger menu works properly on small screens
- [x] Fix header text scaling and overflow
- [x] Optimize footer for mobile

### Home Page
- [x] Fix hero section text overflow on mobile
- [x] Optimize stat cards grid for mobile
- [x] Fix button sizing and spacing on mobile

### Neon Witness Page
- [x] Fix header with eyes overflow on mobile
- [x] Optimize Core Readings cards for mobile
- [x] Fix Phase Architecture cards overflow
- [x] Optimize Metaquestions section for mobile

### Neon Identity Page
- [x] Fix hero section scaling on mobile
- [x] Optimize Identity Matrix toggle for mobile
- [x] Fix Contributions Timeline for mobile
- [x] Optimize Pink Protocol section for mobile

### Works/Archive Pages
- [x] Fix filter controls overflow on mobile (collapsible filter panel)
- [x] Optimize artwork grid/list views for mobile
- [x] Fix artwork detail modal for mobile

### Dashboard Page
- [x] Fix stat cards overflow on mobile
- [x] Optimize tabs for mobile viewing

### About Page
- [x] Fix text content overflow on mobile
- [x] Optimize contact grid for mobile

### Voices Page
- [x] Fix quote cards overflow on mobile
- [x] Optimize testimonial layout for mobile

### Deep Archive Page
- [x] Fix A-Layers accordion for mobile
- [x] Optimize source files table for mobile (card view on mobile)

## Works Page Filter & Sorting Improvements

- [x] Fix filter options visibility on mobile view
- [x] Add sorting dropdown with multiple options
- [x] Add "Sort by Phase" option (NE → PH1, newest to oldest)
- [x] Add "Sort by Date" option (newest first, oldest first)
- [x] Add "Random" sorting option that shuffles on each load
- [x] Make phase sorting the default
- [x] Ensure all filter/sort controls work on mobile
- [x] Add SHUFFLE button for random mode

## Works Page Sort Fix & Lightbox

- [x] Change default sort from "phase" to "date_newest"
- [x] Create lightbox prototype with full-screen image view
- [x] Add random Neon color glow effect to lightbox background
- [x] Implement pulsing glow animation with 5 Neon colors
- [x] Add title/subtitle overlay at bottom of lightbox
- [x] Fix lightbox z-index using React portal to render above modal
- [x] Make maximize button always visible on mobile

## Lightbox Navigation

- [x] Add prev/next arrow buttons to lightbox
- [x] Add keyboard navigation (left/right arrow keys)
- [x] Pass works list and current index to lightbox
- [x] Update lightbox to support navigation between works

## Mobile Lightbox Optimization

- [x] Add touch swipe gestures for mobile navigation
- [x] Fix mobile lightbox bugs and improve responsiveness (z-index 9999, iOS scroll fix)
- [x] Optimize touch targets for navigation buttons (larger on mobile)
- [x] Ensure smooth transitions between artworks
- [x] Add position indicator (X / Y format)
- [x] Simplify color indicator for mobile

## Deep Archive Page Enhancement (6-Phase Implementation)

### Phase 1: Phase System Expansion
- [x] Add explanatory paragraph block after Phase taxonomy grid
- [x] Add PH1-NE consciousness-based explanations
- [x] Style as prose with increased line-height

### Phase 2: Analysis Stack Unpacking
- [ ] Expand A1-A5 accordion items with descriptions
- [ ] Add one-sentence function explanation for each layer
- [ ] Implement expandable card pattern for mobile

### Phase 3: Voices From the Archive
- [ ] Create new "VOICES FROM THE ARCHIVE" section
- [ ] Add 4 blockquote fragments from journals/statements
- [ ] Style with monospace or handwritten font

### Phase 4: Entry Points Section
- [ ] Create "FIND YOUR DOOR" section near top
- [ ] Add 5 entry point pathways for different visitors
- [ ] Implement card-based or tabbed interface

### Phase 5: Spiritual Dimension Addition
- [ ] Append to existing "WHY THIS MATTERS" section
- [ ] Add 3-paragraph spiritual practice explanation
- [ ] Style as closing statement with subtle background

### Phase 6: Closing Section
- [ ] Add "THE ARCHIVE AS LIVING SYSTEM" section at bottom
- [ ] Add real-time witnessing vs retrospective content
- [ ] Style as invitation with italics/letter-spacing
