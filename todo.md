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
