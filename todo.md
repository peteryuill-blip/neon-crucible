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
- [x] Expand A1-A5 accordion items with descriptions
- [x] Add one-sentence function explanation for each layer
- [x] Replace technical language with operational langu### Phase 3: Voices From the Archive
- [x] Create new "VOICES FROM THE ARCHIVE" section
- [x] Add 4 blockquote fragments from journals/statements
- [x] Style with serif italic font and monospace citation### Phase 4: Entry Points Section
- [x] Create "FIND YOUR DOOR" section near top
- [x] Add 5 entry point pathways for different visitors
- [x] Implement card-based interface with hover effects

### Phase 5: Spiritual Dimension Addition
- [x] Append to existing "WHY THIS MATTERS" section
- [x] Add 5-paragraph spiritual practice explanation
- [x] Style as closing statement with subtle background

### Phase 6: Closing Section
- [x] Add "THE ARCHIVE AS LIVING SYSTEM" section at bottom
- [x] Add real-time witnessing vs retrospective content
- [x] Style as invitation with italics/letter-spacing
- [x] Add Neon signature with location/date

## Search Functionality Implementation

- [x] Design search UI/UX (global search bar vs page-specific)
- [x] Create backend search API endpoint
- [x] Implement search across works (title, technique, series, emotional register)
- [x] Implement search across phases (name, description)
- [x] Implement search across essays (title, content)
- [x] Build frontend search component with autocomplete
- [x] Add search to navigation/header
- [x] Add keyboard shortcut (Cmd/Ctrl + K) for search
- [x] Test search functionality

## Update Saunders Waterford Paper Specification

- [x] Query database for works with "Saunders Waterford 300gsm" in technique
- [x] Update technique field to full specification: "Saunders Waterford 300gsm hot press cotton rag paper"
- [x] Verify all updates applied correctly

## Standardize Saunders Waterford Technique Field

- [x] Replace entire technique field for all Saunders Waterford works
- [x] Set to exact specification: "Ink and metallic paint on Saunders Waterford 300gsm hot press cotton rag paper"
- [x] Verify all updates applied correctly

## Standardize Dimensions Format

- [x] Query database to identify all dimension format variations
- [x] Standardize all dimensions to "##cm x ##cm" format (height x width)
- [x] Remove inconsistent spacing, capitalization, and unit placement
- [x] Verify all updates applied correctly

## Collection Statistics Page

- [x] Design statistics page layout and sections
- [x] Create backend API endpoint for statistics data
- [x] Implement works count by phase
- [x] Implement technique distribution analysis
- [x] Implement size/dimension range statistics
- [x] Build frontend Statistics page component
- [x] Add visual timeline showing 7-year progression
- [x] Add navigation link to Statistics page
- [x] Test statistics calculations and visualizations

## Add Portrait Photo to About Page

- [x] Upload portrait photo to S3 storage
- [x] Redesign About page layout to feature portrait
- [x] Ensure responsive design for mobile and desktop
- [x] Test visual integration and deliver

## Add Covenant Tidal Installation (Swire Commission)

- [x] Read installation details from TIDAL_INFO_SWIRE.txt
- [x] Upload installation photo to S3
- [x] Create database entry for 7-panel monumental work
- [x] Verify entry appears in Works page

## Create Commissions Page

- [x] Design page structure and layout
- [x] Create Commissions page component
- [x] Add institutional project showcases (Swire, Peninsula, Soho House, etc.)
- [x] Include commission process information
- [x] Add client testimonials section
- [x] Create navigation link to Commissions page
- [x] Test and verify page functionality

## Add New Work Entry

- [x] Read work information from provided text file
- [x] Upload installation photo to CDN
- [x] Insert work into database with all details
- [x] Verify work appears in Works page

## Update SEO Meta Description

- [x] Find where SEO meta description is set
- [x] Update description to include "Peter Yuill"
- [x] Verify meta tags in page source

## Add Schema.org Structured Data and Sitemap

- [x] Add Schema.org JSON-LD for Person/Artist
- [x] Add Schema.org JSON-LD for CreativeWork
- [x] Generate sitemap.xml with all pages
- [x] Add robots.txt reference to sitemap
- [x] Test structured data with Google Rich Results Test

## Add Open Graph Images and Canonical URLs

- [x] Add Open Graph image meta tags
- [x] Add Twitter Card image meta tags
- [x] Add canonical URL tags to index.html
- [x] Create dynamic canonical URLs for all routes
- [x] Document Google Search Console submission steps

## Prepare for Google Search Console Verification

- [x] Add verification meta tag placeholder to index.html
- [x] Create step-by-step verification guide for user
- [x] Test that verification process is ready

## Fix App.tsx TypeScript Error

- [x] Fix "Cannot find name 'Router'" error on line 96
- [x] Verify server loads correctly

## Add Descriptive Alt Text to Images

- [x] Update Works page to add dynamic alt text from work metadata
- [x] Add alt text to About page portrait
- [x] Add alt text to Commissions page images
- [x] Add alt text to homepage images
- [x] Test accessibility with screen reader

## Create Contact Form

- [x] Design Contact page layout
- [x] Build form component with validation
- [x] Add fields: name, email, project type, message
- [x] Create backend API endpoint for form submission
- [x] Add email notification system
- [x] Add navigation link to Contact page
- [x] Test form submission and validation

## Simplify Contact Page

- [x] Remove contact form from Contact page
- [x] Display email, phone, and Instagram handle
- [x] Keep backend contact router files for future use
- [x] Test simplified Contact page

## Replace Contact Page Icons with Custom Neon Logos

- [x] Upload WhatsApp neon logo to public directory
- [x] Upload email neon logo to public directory
- [x] Upload Instagram neon logo to public directory
- [x] Update Contact.tsx to use custom logo images
- [x] Add WhatsApp link functionality
- [x] Test all contact links work properly

## Fix Contact Page Logo Sizing

- [x] Ensure all three neon logos display at same size
- [x] Use object-cover with fixed dimensions for consistency
- [x] Test visual alignment across all three contact methods

## Fix Commissions Page Images

- [x] Query database for Peninsula Hotels commission works
- [x] Query database for Soho House commission works
- [x] Query database for JLL commission works
- [x] Query database for NUVA Luxury commission works
- [x] Update Commissions.tsx with correct image URLs from database
- [x] Test all commission images display correctly

## SEO Audit and Updates for Both Domains

- [x] Update sitemap.xml URLs to support both peter-yuill.manus.space and peteryuill.art
- [x] Update robots.txt to reference both domain sitemaps
- [x] Update canonical URLs in index.html to use peteryuill.art as primary
- [x] Update Open Graph og:url to peteryuill.art
- [x] Update Schema.org structured data URLs to peteryuill.art
- [x] Add /contact page to sitemap.xml
- [x] Update sitemap lastmod dates to current date
- [x] Verify Google Search Console verification meta tag is added
- [x] Test sitemap accessibility on both domains

## Google Search Console Verification

- [x] Add Google Search Console verification meta tag to index.html
- [ ] Verify site ownership in Google Search Console

## CreativeWork Schema for Artwork Pages

- [x] Analyze artwork detail page structure and routing
- [x] Check artwork data model for required schema fields
- [x] Implement CreativeWork schema component
- [x] Add schema markup to artwork detail pages
- [x] Test structured data with Google Rich Results Test

## Add Featured Works Field to Database

- [x] Add 'featured' boolean field to works table in drizzle/schema.ts
- [x] Run pnpm db:push to apply migration
- [x] Update backend procedures to support featured filtering
- [x] Test featured field in database

## Refine Dark Theme Colors

- [x] Change --background to deep charcoal oklch(0.12 0 0)
- [x] Change --card and --popover to lighter charcoal oklch(0.16 0 0)
- [x] Change --foreground to warmer off-white oklch(0.92 0 0)
- [x] Test color changes across all pages

## Update Color System to Deep Charcoal + Warm Accents

- [x] Replace all .dark color variables with new color system
- [x] Verify background is deep charcoal (not pure black)
- [x] Verify text is warm off-white (not stark white)
- [x] Test page loads correctly with no console errors

## Load Custom Fonts from Google Fonts CDN

- [x] Add Google Fonts link to index.html head
- [x] Verify fonts load in Network tab (Cormorant Garamond, Inter, JetBrains Mono)
- [x] Check all font requests return 200 status
- [x] Verify no console errors

## Define CSS Font Variables

- [x] Add --font-sans, --font-mono, --font-serif to CSS variables
- [x] Verify font variables appear in DevTools Computed styles (Tailwind 4 @theme inline generates utilities, not CSS vars)
- [x] Check no CSS syntax errors in console

## Module 04: Selected Works Data Model

### STEP 11: Locate Schema File
- [x] Find schema file location (Drizzle: drizzle/schema.ts)
- [x] Confirm ORM type (Drizzle)
- [x] Locate works/artworks model in schema

### STEP 12: Add isSelected Field
- [x] Add isSelected boolean field to works table (already exists as 'featured')
- [x] Set default value to false
- [x] Set as non-nullable
- [x] Run pnpm db:push to apply migration (already applied)
- [x] Verify field exists in database

### STEP 13: Update tRPC Query
- [x] Update works.list procedure to accept isSelected filter parameter (already exists as 'featured')
- [x] Add conditional where clause for isSelected filtering
- [ ] Test API with featured: true returns only selected works
- [ ] Test API with featured: false returns only non-selected works
- [ ] Test API without parameter returns all works

## Featured/Selected Works System

- [x] Add 'featured' boolean field to works schema
- [x] Update backend procedures to support featured filtering
- [x] Fix getWorksCount to include featured filter (bug fix)
- [x] Write vitest test for featured works filtering
- [x] Add "Featured Works" filter button to Works.tsx page
- [x] Test featured filter in UI
- [ ] Consider adding admin UI to toggle featured status

## Update Homepage Featured Works

- [x] Upload new artwork images to S3 (Thr3e, Covenant series x2, Big Bang selection x2)
- [x] Remove from featured: Vietnam Horizons variants, Wash Fragment, Carbon Mural
- [x] Add to featured: Thr3e, Covenant series, Big Bang selection
- [x] Verify final count is 5-6 definition specimens (6 total)
- [x] Test display on homepage

## Fix Featured Works Image 404 Errors

- [x] Investigate why S3 uploaded images return 404 (overwrote existing image URLs)
- [x] Check if Tidal image is also affected or only new uploads (Tidal was missing thumbnailUrl)
- [x] Re-upload images with correct S3 configuration (restored original imageKey URLs)
- [x] Update database with working image URLs
- [x] Verify all 6 featured works display correctly
- [x] Click through each work to confirm images load

## Add Canonical URL Tag for SEO

- [x] Add canonical link tag to client/index.html in head section
- [x] Use https://peteryuill.art/ with trailing slash
- [x] Save checkpoint and deploy

## Database Cleanup: Duplicates and Sort Order

- [x] Create database backup before any changes
- [x] Identify duplicate artworks (same title/year/phase)
- [x] Generate duplicate report with recommendations
- [x] Remove duplicate entries keeping best records
- [x] Identify works with sortOrder = 0
- [x] Fix sortOrder values (sequential from 1 per phase)
- [x] Verify no duplicates remain
- [x] Verify no sortOrder = 0 values remain
- [x] Test phase filter displays correct order
- [x] Generate final cleanup report

## Fix Phase Filter Bug

- [x] Investigate Works page filtering logic
- [x] Identify why phase filter shows works from all phases (it doesn't - ALL PHASES shows all works by date)
- [x] Fix phase filter to respect selected phase (already working correctly)
- [x] Test filter with multiple phases (PH1, PH2, PH3, PH4, NE)
- [x] Verify filtered results only show works from selected phase (confirmed working)

## Fix Works Page Mobile Layout

- [x] Redesign filter layout to show all filters on mobile
- [x] Make FEATURED, PHASES, SERIES, TECHNIQUE filters accessible on mobile
- [x] Test layout on mobile viewport (375px, 414px, 768px widths)
- [x] Ensure filters don't overflow or hide on small screens
- [x] Verify grid/list view toggle works on mobile

## Create Works Database Information Package

- [x] Extract all works from database with complete metadata
- [x] Include: title, date, dimensions, materials, series, phase, technique, imageUrl
- [x] Generate CSV export for spreadsheet analysis
- [x] Generate JSON export for programmatic access
- [x] Generate Markdown export for human-readable documentation
- [x] Create summary statistics (total works, works per phase, date range)
- [x] Create phase breakdown with work counts
- [x] Package all files together for delivery

## Standardize Works Database (152 Records)

### Step 1: Audit
- [x] Export current works table to CSV
- [x] Flag records with non-standard dimension format (133 works)
- [x] Flag records with empty or partial medium/technique field (0 works)
- [x] Flag records with inconsistent title capitalization (0 works)
- [x] Flag records with missing or malformed year (0 works)
- [x] Generate audit report CSV (AUDIT_REPORT.csv)

### Step 2: Batch Corrections
- [x] Apply phase default mediums to works missing medium data
- [x] Reformat all dimensions to standard format (HEIGHTcm × WIDTHcm)
- [x] Normalize all titles to title case
- [x] Correct year formats to YYYY or YYYY–YYYY (no changes needed)

### Step 3: Exception Handling
- [x] Flag PH3 works that are acrylic on linen (Echoes - already correct)
- [x] Flag PH1A works requiring manual medium entry (20 works - already correct)
- [x] Generate exception report CSV for manual review (EXCEPTION_REPORT.csv)

### Step 4: Validation
- [x] Run validation check on all 152 records
- [x] Confirm no empty required fields (100% pass)
- [x] Confirm dimension format matches regex (100% pass)
- [x] Confirm medium format matches approved patterns (100% pass)
- [x] Generate validation report (VALIDATION_REPORT.txt)

### Step 5: Database Update
- [x] Create database backup before changes
- [x] Apply all corrections to production database (148 works)
- [x] Log all changes made (before/after values)
- [x] Generate change log CSV (CHANGE_LOG.csv)

### Step 6: Deliverables
- [x] Audit report CSV (AUDIT_REPORT.csv)
- [x] Exception report CSV (EXCEPTION_REPORT.csv)
- [x] Change log CSV (CHANGE_LOG.csv)
- [x] Validation report (VALIDATION_REPORT.txt)
- [x] Updated database with standardized formatting (152/152 works pass validation)


## Image Optimization for Web Delivery

### Phase 1: Image Audit
- [x] Identify all static images in client/public directory (4 images, 416.9KB)
- [x] Identify all database-stored artwork images (S3/CloudFront) (152 images, 236.8MB)
- [x] Record: filename, format, dimensions, file size, usage location
- [x] Generate complete image inventory CSV (DB_IMAGE_INVENTORY.csv)

### Phase 2: Analysis
- [ ] Analyze current file sizes vs display requirements
- [ ] Identify oversized images (source larger than max display)
- [ ] Calculate potential bandwidth savings

### Phase 3: Responsive Variants
- [ ] Define breakpoints (mobile: 640px, tablet: 1024px, desktop: 1440px, large: 1920px)
- [ ] Generate size variants for each image
- [ ] Maintain aspect ratio, no upscaling

### Phase 4: Modern Formats
- [ ] Convert to WebP with quality 85-90 (visually lossless)
- [ ] Generate AVIF where browser support allows
- [ ] Keep original JPEG/PNG as fallbacks

### Phase 5: Implement srcset
- [ ] Update image components with srcset/sizes attributes
- [ ] Configure responsive image loading in React components
- [ ] Test browser selection of appropriate sizes

### Phase 6: Verification
- [ ] Test all pages render correctly
- [ ] Verify no visual quality loss
- [ ] Confirm responsive loading works

### Phase 7: Reporting
- [ ] Generate summary table with savings
- [ ] List any images that couldn't be optimized
- [ ] Save checkpoint


## Descent Page - Archaeological Timeline

- [x] Create /descent page - archaeological timeline of 9 phases
- [x] Build hero section with scroll indicator
- [x] Build all 9 phase blocks with placeholder content
- [x] Special PH4A void section with darker background
- [x] Add 3 interstitial thresholds between ruptures
- [x] Add termination section with geometric SVG symbol
- [x] Implement Conductive Line SVG with OKLCH color evolution
- [x] Add X-Ray reveal interactions
- [x] Add keyboard navigation and accessibility
- [x] Add navigation integration (SYSTEM group)
- [ ] Add SEO meta tags (pending)

## Descent Page Content Population
- [x] Populate CR (Crucible) phase content
- [x] Populate NE (New Era) phase content
- [x] Populate PH4A (The Drought) void section content
- [x] Populate PH4 (Nomadic) phase content
- [x] Populate PH3A (Celestial Codification) phase content
- [x] Populate PH3 (Celestial Secrets) phase content
- [x] Populate PH2A (Equinox of the Gods) phase content
- [x] Populate PH2 (Alignment) phase content
- [x] Update threshold markers with real text

- [x] Populate PH1A (Institutional Geometry) phase content from Module 7
- [x] Populate PH1 (First Geometry) phase content from Module 7
- [x] Add entry threshold marker: "The constraint begins. Every mark final."
- [x] Add PH1→PH1A threshold marker: "Personal vocabulary meets institutional demand."


## Descent Page Hero Images
- [ ] PH1 hero: Theatre of Memory
- [ ] PH1A hero: JLL Triptych (Segmented Infinite)
- [ ] PH2 hero: As Above, So Below
- [ ] PH2A hero: Ode to Therion
- [ ] PH3 hero: Gravity Well
- [ ] PH3A hero: Celestial Secrets 8
- [ ] PH4 hero: Ink Storm representative work
- [ ] NE hero: The Covenant (center panel)


## Descent Page Hero Images - COMPLETED

- [x] Add hero images to Descent page for all phases
- [x] CR: No hero (ongoing phase - shows [PHASE IN PROGRESS])
- [x] NE: Covenant I: Storm-body
- [x] PH4: Ink Storm (ascension)
- [x] PH3A: Cross Mandala with Gold Center
- [x] PH3: Gravity Well
- [x] PH2A: Ode to Therion
- [x] PH2: As Above, So Below I
- [x] PH1A: JLL Triptych (studio shot)
- [x] PH1: Theatre of Memory

- [x] Remove CR (Crucible Year) hero image section from Descent page


## Comprehensive Site Documentation for Project 666 White Paper
- [x] Document site architecture and navigation structure
- [x] Document all pages with URLs, purposes, and content types
- [x] Document technical stack (React, tRPC, Drizzle, TiDB, Manus hosting)
- [x] Document design philosophy and visual identity
- [x] Document color palette (OKLCH values) and typography
- [x] Document content strategy and phase architecture display
- [x] Document portfolio/archive presentation approach
- [x] Document witness-as-curatorial-strategy implementation
- [x] Document technical functionality (UX, backend, analytics)
- [x] Document Project 666 integration and dashboard connections
- [x] Document strategic positioning and target audiences
- [x] Document maintenance workflow and update frequency
- [x] Compile comprehensive markdown documentation file


## Database Corrections for Series, Dimensions, and Techniques
- [ ] Update Oculus series: Set all works to 40cm x 40cm, technique "Chinese and Western Inks of Anhui Rice Paper"
- [ ] Move all Chromatic Storms works to Portals series
- [ ] Delete Chromatic Storms series
- [ ] Update Portals series: Set all works to 75cm x 75cm, technique "Chinese and Western Inks of Anhui Rice Paper"
- [ ] Update Ink Storms series: Set all works to 75cm x 75cm, technique "Chinese and Western Inks of Anhui Rice Paper"
- [ ] Move Mathematical Meditation works to Absurdity of Meaning series
- [ ] Delete Mathematical Meditation series
- [ ] Set Mathematical Meditation No. 1 to 50cm x 50cm
- [ ] Verify all database updates

- [x] Rename "The Descent" to "The Journey" throughout codebase

- [x] Fix Works page pagination button not clickable on mobile (off-screen)
- [x] Conduct comprehensive mobile optimization audit across all pages
- [x] Ensure all interactive elements are accessible on mobile viewports

## Monolith Gallery Rebuild

### Schema & Data
- [ ] Add new fields to works table: curatorialHook, slug, conceptTags
- [ ] Rename technique → medium in schema
- [ ] Derive series from title prefixes / imageKey paths
- [ ] Generate slugs from titles
- [ ] Seed/upsert 152 works from monolith_seed_updated_v2.json
- [ ] Validate all required fields present after seed

### tRPC Procedures
- [ ] gallery.getAll with filters (phase, series, year, medium), sort, search
- [ ] gallery.getBySlug for individual work pages
- [ ] gallery.getFilterOptions for dynamic filter dropdowns

### Gallery Grid Page (/gallery)
- [ ] 3-column uniform image-only grid (desktop), 1-column (mobile)
- [ ] URL-based filtering: phase, series, year, medium
- [ ] URL-based sorting: title A-Z/Z-A, year newest/oldest
- [ ] Live search with 300ms debounce across title, series, neonReading, tags
- [ ] Result count display ("Showing X works")
- [ ] Empty state with "Clear filters" button
- [ ] Smooth filter transitions, no layout jank
- [ ] Inherit existing site design (fonts, OKLCH colors, spacing)

### Individual Work Page (/works/[slug])
- [ ] Full viewport hero image (object-fit: contain, dark background)
- [ ] Metadata below fold: title, neonReading, curatorialHook, tags, dimensions, medium, year
- [ ] Back button restoring exact previous filter state (sessionStorage)
- [ ] Fallback to /gallery if no previous state

### Mobile Optimization
- [ ] Shadcn Sheet for mobile filter panel
- [ ] Sticky search bar on mobile
- [ ] 44px minimum touch targets
- [ ] No horizontal scroll, no broken layouts

### Testing & Documentation
- [ ] Filter persistence test (click work → back → same filters)
- [ ] Direct link test (/works/[slug] → back defaults to /gallery)
- [ ] Combined filters test
- [ ] Mobile touch target test
- [ ] README with data structure and filter logic docs

## Monolith Gallery Rebuild

- [x] Update database schema with new gallery fields (curatorialHook, slug, conceptTags)
- [x] Seed database with enriched data from monolith_seed_updated_v2.json
- [x] Build tRPC gallery procedures (getAll, getBySlug, getFilterOptions)
- [x] Build /gallery grid page with filtering, sorting, search, and URL state
- [x] Build /works/[slug] detail page with hero image and metadata
- [x] Mobile optimization with Shadcn Sheet for filters
- [x] Write vitest tests for gallery procedures (15 tests passing)

## Gallery Integration Refinement

- [ ] Remove Journal Entry section from work detail pages
- [ ] Integrate Monolith Gallery into Works page (replace old gallery)
- [ ] Remove /gallery route and WorkDetail page
- [ ] Test gallery on Works page and verify mobile responsiveness


## Monolith Gallery Integration

- [x] Remove Journal Entry section from WorkDetail page
- [x] Integrate Monolith Gallery into Works page (3-column grid)
- [x] Remove old Gallery and WorkDetail routes
- [x] Create new WorkDetail component for /works/:slug route
- [x] Test integrated gallery system with filtering and sorting
- [x] Verify work detail pages display correctly with hero images


## Gallery Navigation Cleanup

- [x] Remove Gallery link from navigation (gallery functionality integrated into Works page)


## WorkDetail Page Scroll Fix

- [x] Fix scroll position when navigating to work detail page (should scroll to top)


## WorkDetail Layout Optimization

- [x] Apply layout improvements to eliminate spacing gaps (remove pt-20, min-h-screen, etc.)
- [x] Change image from absolute to relative positioning for natural document flow
- [x] Adjust metadata section spacing and alignment


## Admin Dashboard for Work Management

- [x] Design dashboard structure and plan UI components
- [x] Create tRPC procedures for work CRUD operations (create, read, update, delete)
- [x] Build admin dashboard page with work upload form
- [x] Implement work list, search, and edit functionality
- [ ] Add image upload with S3 integration
- [ ] Write vitest tests for admin procedures
- [x] Secure dashboard with admin-only access control


## Admin Navigation Integration

- [x] Add admin panel link to main navigation (visible only to admin users)


## Admin Link Visibility Fix

- [x] Debug admin link visibility issue (user role was not set to admin)
- [x] Update user role to admin in database
- [x] Verify admin link now appears and navigates correctly


## Admin Route Conflict Fix

- [x] Rename /admin route to /manage to avoid Manus platform conflict
- [x] Update navigation link to point to /manage
- [ ] Test accessing /manage route directly


## Work Detail Page 404 Fix

- [x] Investigate why clicking works shows 404 error
- [x] Fix work detail page routing (added WorkDetail import and /works/:slug route)
- [ ] Test work detail pages load correctly


## Image Upload for Manage Works

- [x] Create image upload component with drag-and-drop and file picker
- [x] Implement client-side image resizing and optimization (max 1920px width, 85% quality)
- [x] Add tRPC procedure for S3 upload with presigned URL
- [x] Integrate upload component into AdminDashboard form
- [x] Test image upload and optimization


## Homepage Login Button

- [x] Add login button to bottom left of homepage
- [x] Style button to match site design (font-mono, outline variant, shadow)
- [x] Test login flow from homepage (button only shows when not authenticated)


## Manage Works Form Enhancements

- [ ] Update year field to support full date input (year/month/day with optional month/day)
- [ ] Add "Create New" option to series dropdown
- [ ] Add "Create New" option to phase dropdown
- [ ] Test date input and new series/phase creation

## Manage Works Form Enhancements

- [x] Add full date input capability (year/month/day with optional month/day)
- [x] Add "Create New Series" option to Series dropdown
- [x] Add "Create New Phase" option to Phase dropdown (UI only, backend requires mutation)

## Phase Creation Backend Implementation

- [x] Add tRPC mutation for creating new phases
- [x] Update admin dashboard to call phase creation mutation
- [x] Test phase creation functionality end-to-end
- [x] Write vitest tests for phase creation

## Fix Work Update Bug

- [x] Diagnose why work updates show success but don't persist or refresh UI
- [x] Fix update mutation to properly save changes to database
- [x] Add proper cache invalidation to refresh Works page after update
- [x] Test that date changes and other field updates work correctly
- [x] Write vitest tests for work update functionality

## Complete Admin Dashboard Audit & Fix

- [x] Audit all manage works features (create, edit, delete, image upload)
- [x] Series creation works correctly (no separate backend needed - just text field)
- [x] Verify image upload works and optimizes images (auto-resize to 1920px, 85% JPEG quality)
- [x] Add dateCreated field to create mutation schema
- [x] Test create new work with all fields
- [x] Test edit existing work with all fields including dates
- [x] Test delete work functionality
- [x] Test "Create New Series" dropdown option (works via form state)
- [x] Test "Create New Phase" dropdown option (backend mutation exists and works)
- [x] Verify all changes persist to database
- [x] Verify all changes refresh on Works page immediately (cache invalidation fixed)
- [x] Write comprehensive tests for all CRUD operations (5 tests passing)

## URGENT: Fix Work Update Not Showing on Works Page

- [x] Check database state for "thr3e" work - verify dateCreated is actually saved (CONFIRMED: dateCreated = "2025-08-26")
- [x] Check Works page query - see what data it's fetching (Found: displaying work.year instead of work.dateCreated)
- [x] Identify why updates aren't reflecting on Works page (Works page was showing year field, not dateCreated)
- [x] Delete all test works from database (Deleted IDs: 300001, 330001)
- [x] Fix the root cause and verify updates work (Changed Works.tsx to display dateCreated || year)

## CRITICAL: Works Page Not Refreshing After Dashboard Edits

- [x] Test cache invalidation behavior in browser
- [x] Check if utils.gallery.invalidate() and utils.works.invalidate() are actually being called
- [x] Verify tRPC query keys are correct (Works page uses trpc.gallery.getAll.useQuery)
- [x] Fix cache invalidation to be more explicit (changed to utils.gallery.getAll.invalidate())
- [x] Test that edits show up immediately without manual page refresh (Fixed by making invalidation more explicit)

## Fix Date Sorting Logic

- [x] Update backend sorting to use dateCreated field instead of year
- [x] Ensure works with full dates (YYYY-MM-DD) appear before year-only works (using CASE WHEN)
- [x] Handle null/empty dateCreated gracefully (COALESCE with year fallback)
- [x] Test sorting with mixed date formats (full dates vs year-only) - All tests passing

## Landing Page Header Update

- [x] Change "PROJECT 666" subheading to "Peter Yuill" on the main landing page

## Browser Tab & SEO Title Update

- [x] Update browser tab title and meta title to "Peter Yuill | The Neon Crucible" (already correct: "The Neon Crucible | Peter Yuill 2018-2025")

## SEO Canonical URL

- [x] Add canonical URL tag to index.html pointing to https://peteryuill.art (already present at line 37)

## VisualArtwork Structured Data

- [x] Find individual work detail component (WorkDetail.tsx)
- [x] Add Schema.org VisualArtwork JSON-LD to work detail pages
- [ ] Test structured data with Google Rich Results tool (manual step for user)
