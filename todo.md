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
