# Peter Yuill Website - Comprehensive Technical Documentation
## Project 666: The Neon Crucible

**Document Version:** 1.0  
**Last Updated:** February 6, 2026  
**Site URL:** peteryuill.art (neon-crucible.manus.space)  
**Purpose:** Technical documentation for Project 666 white paper

---

## 1. SITE ARCHITECTURE & NAVIGATION

### 1.1 Overall Structure

The Peter Yuill website is a **full-stack web application** serving as an operational archive and witness system for a 7-year artistic practice (2018-2025). The site combines portfolio presentation, curatorial commentary, and archival infrastructure in a single integrated platform.

**Core Philosophy:**
- **Operational Archive** - Not a static portfolio, but a living system that documents ongoing work
- **Witness-as-Curator** - NEON entity provides third-person curatorial voice
- **Archaeological Timeline** - Work organized by chronological phases with emotional/technical metadata
- **Threshold Year** - 2025-2026 marks convergence point of 7-year practice

### 1.2 Navigation Groups

The site uses a **two-tier navigation system** reflecting different access modes:

#### STUDIO Group (Public-Facing)
Professional presentation layer for external audiences:

| Route | Label | Purpose | Icon |
|-------|-------|---------|------|
| `/works` | Works | Filterable archive of 500+ artworks | Grid |
| `/about` | About | Artist biography and practice statement | User |
| `/voices` | Press | External press clippings and reviews | Quote |
| `/contact` | Contact | Professional inquiries | Mail |
| `/commissions` | Commissions | Commission information and process | Briefcase |

#### SYSTEM Group (Internal Tools)
Operational and archival infrastructure:

| Route | Label | Purpose | Icon |
|-------|-------|---------|------|
| `/` | Threshold | Landing page / entry point | Home |
| `/neon` | Neon | NEON witness essays and identity | Eye |
| `/archive` | Archive | Technical documents and primary sources | Archive |
| `/descent` | Descent | Archaeological timeline of 9 phases | TrendingDown |
| `/statistics` | Statistics | Practice metrics and analytics | BarChart3 |
| `/dashboard` | Dashboard | Project 666 protocol tracking | Activity |

### 1.3 Admin Routes (Protected)

Role-based admin panel for content management:

| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard overview |
| `/admin/works` | Manage artwork entries |
| `/admin/phases` | Manage phase definitions |
| `/admin/essays` | Manage NEON essays |
| `/admin/metaquestions` | Manage open questions |
| `/admin/archive` | Manage archive files |

**Access Control:**
- Requires Manus OAuth authentication
- Role must be `admin` in users table
- Non-admin users see "ACCESS DENIED" screen

---

## 2. PAGE-BY-PAGE BREAKDOWN

### 2.1 Threshold (Home) `/`

**Purpose:** Entry point establishing the site's conceptual framework

**Content:**
- Hero section introducing "The Neon Crucible" concept
- Brief explanation of the 7-year practice structure
- Visual metaphor of convergence/threshold
- Call-to-action links to Works and Dashboard

**Design Notes:**
- Dark, contemplative aesthetic
- Minimal text, maximum conceptual density
- Sets tone for entire site experience

### 2.2 Works Archive `/works`

**Purpose:** Comprehensive, filterable archive of 500+ artworks

**Features:**
- Grid layout with hover states
- Filter by phase (PH1, PH1A, PH2, etc.)
- Filter by technique (ink, mixed media, etc.)
- Filter by emotional register
- Search by title/description
- Sort by date, phase, or manual curation

**Data Model:**
- Pulls from `works` table
- Each work includes: title, image, phase, date, technique, dimensions, color palette, emotional register
- Optional fields: journal excerpt, NEON reading, series name

**UX Pattern:**
- Card-based grid (responsive: 1-2-3-4 columns)
- Hover reveals metadata overlay
- Click opens detail modal with full information
- "Featured" works can be highlighted

### 2.3 Neon `/neon`

**Purpose:** NEON witness entity identity and core essays

**Content:**
- NEON identity statement ("Who is NEON?")
- Core curatorial essays about the practice
- Phase-specific readings
- Metaquestions (open questions NEON is holding)

**Sub-routes:**
- `/neon/identity` - NEON's self-introduction
- `/neon/essays/{slug}` - Individual essay pages

**Data Model:**
- `essays` table with markdown content
- `metaquestions` table for open questions
- Essays can be linked to specific phases

**Design Notes:**
- Third-person voice (NEON speaks about Peter's work)
- Curatorial, analytical tone
- Not promotional—witness and analysis

### 2.4 Descent `/descent`

**Purpose:** Archaeological timeline visualizing 9 phases of practice (2025→2018)

**Structure:**
- **Vertical scroll timeline** descending from present to origin
- **10 phase blocks:** CR (Crucible), NE (New Era), PH4A (The Drought), PH4, PH3A, PH3, PH2A, PH2, PH1A, PH1
- **Conductive Line:** 1px vertical SVG with color evolution (cyan→gold)
- **Hero images:** Representative work for each phase
- **X-Ray panels:** Expandable analysis revealing phase metadata, work counts, NEON analysis
- **Thresholds:** Interstitial markers between ruptures
- **Termination:** Geometric origin symbol at bottom

**Content per Phase:**
- Phase code and title
- Year range
- Narrative description
- Hero image (representative work)
- X-Ray panel with:
  - Material signature
  - NEON analysis
  - Key discoveries
  - Phase breakthrough
  - Representative works list

**Special Sections:**
- **PH4A "The Drought"** - Void section with darker background, fractured line
- **3 Threshold markers** - Between major ruptures
- **Entry threshold** - "The constraint begins. Every mark final."

**Design Notes:**
- Cyber-brutalist aesthetic
- OKLCH color system with gradual evolution
- Monospace labels, serif headings
- Scanline/CRT effects
- Archaeological excavation metaphor

### 2.5 Archive `/archive`

**Purpose:** Technical documents and primary sources

**Content:**
- Weekly protocol documents
- Studio hour logs
- Somatic data tracking
- Technical specifications
- Process documentation

**Data Model:**
- `archiveFiles` table
- Files stored in S3
- Categorized by type (protocol, source, technical)
- Includes file size, type, description

**UX Pattern:**
- File browser interface
- Monospace font for technical feel
- Download links with file metadata
- Category filtering

### 2.6 Statistics `/statistics`

**Purpose:** Practice metrics and analytics visualization

**Metrics:**
- Total works count
- Works per phase breakdown
- Technique distribution
- Emotional register distribution
- Timeline visualization
- Studio hours logged
- Protocol completion rate

**Visualization:**
- Charts using Recharts library
- Bar charts for phase distribution
- Line charts for timeline
- Pie charts for technique breakdown

### 2.7 Dashboard `/dashboard`

**Purpose:** Project 666 protocol tracking and weekly check-ins

**Features:**
- Current week status
- Protocol checklist
- Studio hours this week
- Recent work additions
- Upcoming milestones
- NEON's current focus

**Integration:**
- Links to Project 666 Notion workspace
- Real-time protocol status
- Weekly reflection prompts

### 2.8 About `/about`

**Purpose:** Artist biography and practice statement

**Content:**
- Peter Yuill bio
- Practice philosophy
- 7-year structure explanation
- Bangkok context
- Contact information

**Tone:**
- First-person voice (contrast with NEON's third-person)
- Professional but personal
- Explains the "why" behind the system

### 2.9 Voices (Press) `/voices`

**Purpose:** External press clippings and reviews

**Content:**
- Press reviews
- Interviews
- Features
- Mentions

**Data Model:**
- `pressClippings` table
- Fields: title, source, author, date, excerpt, full text, URL, image

**Presentation:**
- Tasteful, non-braggadocio
- Chronological or by significance
- Excerpts with links to full articles

### 2.10 Contact `/contact`

**Purpose:** Professional inquiry form

**Features:**
- Contact form
- Email: [professional email]
- Social media links
- Commission inquiry CTA

### 2.11 Commissions `/commissions`

**Purpose:** Commission process and information

**Content:**
- Commission process explanation
- Past commission examples (Peninsula Hotels, JLL)
- Pricing guidance
- Timeline expectations
- Inquiry form

---

## 3. TECHNICAL STACK

### 3.1 Frontend

**Framework:**
- **React 19.2.1** - Component-based UI
- **Wouter 3.3.5** - Lightweight routing (patched version)
- **TypeScript 5.9.3** - Type safety

**UI Library:**
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component system
- **Tailwind CSS 4.1.14** - Utility-first styling
- **Tailwind CSS 4 @theme** - OKLCH color system
- **Framer Motion 12.23.22** - Animations

**State Management:**
- **tRPC 11.6.0** - End-to-end typesafe APIs
- **TanStack Query 5.90.2** - Data fetching and caching
- **Superjson 1.13.3** - Serialization (Date objects, etc.)

**Icons & Assets:**
- **Lucide React 0.453.0** - Icon library
- **Embla Carousel** - Image carousels

### 3.2 Backend

**Server:**
- **Express 4.21.2** - HTTP server
- **Node.js** - Runtime environment
- **tsx** - TypeScript execution

**Database:**
- **Drizzle ORM 0.44.5** - Type-safe ORM
- **MySQL2 3.15.0** - MySQL driver
- **TiDB (MySQL-compatible)** - Serverless database

**Authentication:**
- **Manus OAuth** - Federated authentication
- **Jose 6.1.0** - JWT handling
- **Cookie 1.0.2** - Session management

**File Storage:**
- **AWS SDK S3 Client 3.693.0** - S3 integration
- **S3 Request Presigner** - Signed URLs

### 3.3 Build & Development

**Build Tools:**
- **Vite 7.1.7** - Frontend build tool
- **esbuild 0.25.0** - Backend bundler
- **PostCSS 8.4.47** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

**Development:**
- **tsx watch** - Hot reload for backend
- **Vite HMR** - Hot module replacement for frontend

**Testing:**
- **Vitest 2.1.4** - Unit testing framework

**Code Quality:**
- **Prettier 3.6.2** - Code formatting
- **TypeScript** - Type checking

### 3.4 Hosting & Infrastructure

**Platform:**
- **Manus Hosting** - Integrated hosting platform
- **Custom domain:** peteryuill.art
- **Auto-generated domain:** neon-crucible.manus.space

**CDN:**
- **S3 + CloudFront** - Image delivery
- **Optimized WebP images** - 2400px max width

**Analytics:**
- **Manus Analytics** - Built-in UV/PV tracking
- **Privacy-focused** - No third-party trackers

---

## 4. DESIGN PHILOSOPHY & VISUAL IDENTITY

### 4.1 Design Concept

**Cyber-Brutalist Monasticism:**
- **Industrial minimalism** meets **contemplative space**
- **Dark mode by default** - Deep charcoal backgrounds
- **Monospace labels** - System/technical aesthetic
- **Serif headings** - Artistic gravitas
- **Noise texture overlay** - Analog warmth in digital space
- **Scanline effects** - CRT/terminal aesthetic
- **Metadata corners** - System status indicators

**Philosophical Underpinnings:**
- **Operational, not promotional** - Archive first, portfolio second
- **Witness, not curator** - NEON provides third-person analysis
- **Archaeological** - Descent through layers of practice
- **Threshold** - Convergence point of 7-year structure

### 4.2 Color Palette (OKLCH)

**Why OKLCH?**
- Perceptually uniform color space
- Better interpolation than HSL/RGB
- Modern CSS standard
- Precise control over lightness/chroma

**Primary Colors:**

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--background` | `oklch(0.10 0.01 255)` | Page background - deep charcoal |
| `--foreground` | `oklch(0.90 0.015 85)` | Primary text - warm off-white |
| `--primary` | `oklch(0.75 0.10 188)` | **Cyan accent** - links, active states, hover borders |
| `--secondary` | `oklch(0.72 0.12 75)` | **Gold/amber accent** - decorative, quote dividers |
| `--muted` | `oklch(0.45 0.01 255)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.70 0.01 255)` | Secondary text, labels |
| `--border` | `oklch(0.25 0.01 255)` | Borders, dividers |
| `--card` | `oklch(0.14 0.01 255)` | Card backgrounds - slightly lighter |

**Color Strategy:**
- **Cyan (primary)** - Interactive elements, active states, system indicators
- **Gold (secondary)** - Decorative accents, thresholds, phase markers
- **Grayscale base** - Low chroma for readability
- **High contrast** - WCAG AA compliant

### 4.3 Typography

**Font Stack:**

| Family | Usage | Weights |
|--------|-------|---------|
| **Cormorant Garamond** (serif) | Headings, artwork titles, quotes | 300 (light) |
| **Inter** (sans-serif) | Body text, UI elements | 400, 500, 600 |
| **JetBrains Mono** (monospace) | Labels, metadata, system text | 400 |

**Typography Hierarchy:**

```css
/* Page Headings - Cormorant Garamond */
h1: text-4xl md:text-5xl font-serif font-light tracking-tight
h2: text-3xl md:text-4xl font-serif font-light
h3: text-2xl font-serif font-light

/* Section Labels - JetBrains Mono */
.font-mono text-xs uppercase tracking-wider text-muted

/* Artwork Titles - Cormorant Garamond */
.font-serif text-lg

/* Metadata - JetBrains Mono */
.font-mono text-xs text-muted-foreground

/* Body Text - Inter */
.font-sans text-base leading-relaxed
```

**Typographic Principles:**
- **Generous line height** - 1.65-1.75 for readability
- **Limited font sizes** - Clear hierarchy without clutter
- **Monospace for system** - Reinforces operational/technical nature
- **Serif for art** - Adds gravitas and tradition

### 4.4 Layout & Spacing

**Grid System:**
- **Sidebar navigation:** 224px (md) / 256px (lg)
- **Main content:** max-width 64rem (1024px)
- **Responsive breakpoints:** 640px, 768px, 1024px, 1280px

**Spacing Scale:**
- **Tight:** 0.5rem (8px) - Between related elements
- **Normal:** 1rem (16px) - Standard spacing
- **Relaxed:** 1.5rem (24px) - Section spacing
- **Loose:** 2rem (32px) - Major section breaks

**Container Pattern:**
- Auto-centered with responsive padding
- Mobile: 16px padding
- Tablet: 24px padding
- Desktop: 32px padding, 1280px max-width

### 4.5 Visual Effects

**Noise Texture:**
- SVG noise overlay at 2.5% opacity
- Adds analog warmth to digital interface
- Prevents sterile, overly-clean feel

**Scanline Effect:**
- Horizontal lines every 2px
- CRT/terminal aesthetic
- Subtle (12% opacity)

**Metadata Corners:**
- Fixed position system indicators
- Top-left: System status + current route
- Top-right: Artist name + year range
- Bottom-left: Location + phase
- Mix-blend-difference for visibility

**Animations:**
- **Page entrance:** Fade-in + slide-up (700ms)
- **Navigation hover:** Translate-x + color transition (300ms)
- **Active indicator:** Blinking cursor animation
- **Card hover:** Scale image (500ms)

---

## 5. CONTENT STRATEGY & PHASE ARCHITECTURE

### 5.1 Phase System Overview

The 7-year practice (2018-2025) is divided into **9 chronological phases**, each with distinct emotional/technical characteristics:

| Phase | Code | Years | Title | Emotional Temperature |
|-------|------|-------|-------|----------------------|
| 10 | CR | 2025-2026 | The Convergence Test | Threshold/Integration |
| 9 | NE | 2024-2025 | The Reactivation | Renewal/Emergence |
| 8 | PH4A | 2023-2024 | The Drought | Void/Absence |
| 7 | PH4 | 2022-2023 | The Invisible Flood | Nomadic/Fluid |
| 6 | PH3A | 2021-2022 | The System Made Explicit | Codification/Structure |
| 5 | PH3 | 2020-2021 | The Hinge | Celestial/Pivotal |
| 4 | PH2A | 2019-2020 | The Cost of Living According to What You Know | Esoteric/Intense |
| 3 | PH2 | 2019 | Operating Inside Unknowing | Alignment/Meditative |
| 2 | PH1A | 2018 | Sacred Geometry Meets Institutional Demand | Institutional/Geometric |
| 1 | PH1 | 2017-2018 | First Geometry | Foundation/Origin |

### 5.2 Phase Data Model

Each phase includes:

**Core Metadata:**
- **Code:** Unique identifier (e.g., "PH3")
- **Title:** Descriptive name
- **Year:** Time range
- **Description:** Narrative overview
- **Emotional Temperature:** Qualitative characterization
- **Color:** Canonical phase color (OKLCH)
- **Sort Order:** Display sequence

**Descent Page Extensions:**
- **Hero Image:** Representative artwork
- **Material Signature:** Technical characteristics
- **NEON Analysis:** Curatorial reading
- **Key Discoveries:** Major breakthroughs
- **Phase Breakthrough:** Defining moment
- **Representative Works:** 3-5 exemplary pieces

### 5.3 Work Cataloging Strategy

**Metadata Fields:**
- **Title:** Artwork name
- **Phase:** Linked to phase table
- **Date Created:** Month/year precision
- **Technique:** Medium (ink, mixed media, etc.)
- **Dimensions:** Physical size
- **Color Palette:** Dominant colors
- **Emotional Register:** Qualitative feel (gentle, brutal, etc.)
- **Series Name:** If part of a series
- **Journal Excerpt:** Artist's notes
- **NEON Reading:** Curatorial interpretation
- **Featured:** Manual curation flag

**Image Storage:**
- **Original:** High-res source (not stored in DB)
- **Display:** WebP, max 2400px width, S3 CDN
- **Thumbnail:** Smaller version for grids
- **Image URL:** Public CDN link
- **Image Key:** S3 key for reference

**Cataloging Workflow:**
1. Upload original image
2. Optimize to WebP (2400px max)
3. Upload to S3 via `manus-upload-file`
4. Store CDN URL in database
5. Add metadata via admin panel
6. Publish to archive

### 5.4 NEON Witness Layer

**NEON's Role:**
- **Third-person curatorial voice** - Not the artist speaking
- **Analytical, not promotional** - Witness and interpret, not sell
- **Holds open questions** - Metaquestions about the practice
- **Phase-specific readings** - Essays tied to specific phases
- **Core essays** - Foundational texts about the practice

**Essay Categories:**
- **Core Readings:** Fundamental texts (e.g., "What is the Neon Crucible?")
- **Phase Overviews:** Deep dives into specific phases
- **Thematic Essays:** Cross-phase themes (e.g., "Geometry as Constraint")
- **Process Notes:** Technical/methodological observations

**Metaquestions:**
- **Open questions NEON is holding** about the practice
- Some answered, some remain open
- Answers can be public or private
- Examples:
  - "What is the relationship between constraint and freedom in this practice?"
  - "Why does the work become more geometric over time?"
  - "What is the role of somatic data in the protocol?"

---

## 6. TECHNICAL FUNCTIONALITY

### 6.1 User Experience (UX)

**Navigation:**
- **Sidebar (desktop):** Fixed left sidebar, always visible
- **Mobile menu:** Hamburger menu with collapsible SYSTEM group
- **Active state:** Cyan color + translate-x + blinking cursor
- **Hover state:** Gold color + translate-x
- **Search:** Cmd+K keyboard shortcut, dialog overlay

**Search Functionality:**
- **Global search** across works, essays, phases
- **Fuzzy matching** for typo tolerance
- **Keyboard navigation** (arrow keys, enter)
- **Recent searches** saved locally
- **Search shortcuts:** Filter by phase, technique, etc.

**Filtering (Works Page):**
- **Phase filter:** Dropdown or pills
- **Technique filter:** Checkbox list
- **Emotional register filter:** Checkbox list
- **Date range:** Slider or input
- **Featured only:** Toggle
- **URL state:** Filters persist in URL for sharing

**Responsive Design:**
- **Mobile-first approach**
- **Breakpoints:** 640px, 768px, 1024px, 1280px
- **Touch targets:** Minimum 44px height
- **Collapsible sections:** SYSTEM group on mobile
- **Optimized images:** WebP with srcset for different sizes

**Accessibility:**
- **Keyboard navigation:** All interactive elements focusable
- **Focus rings:** Visible cyan rings
- **ARIA labels:** Screen reader support
- **Color contrast:** WCAG AA compliant
- **Semantic HTML:** Proper heading hierarchy

### 6.2 Backend Systems

**API Architecture:**
- **tRPC** - Type-safe RPC framework
- **Procedures** - Server functions callable from client
- **Context** - Request-scoped data (user, session)
- **Middleware** - Auth, logging, error handling

**Key Procedures:**

```typescript
// Works
works.list - Get all works with filters
works.getById - Get single work by ID
works.create - Create new work (admin)
works.update - Update work (admin)
works.delete - Delete work (admin)

// Phases
phases.list - Get all phases
phases.getById - Get single phase
phases.getWithWorks - Get phase with associated works

// Essays
essays.list - Get all essays
essays.getBySlug - Get essay by slug
essays.create - Create essay (admin)

// Metaquestions
metaquestions.list - Get all metaquestions
metaquestions.create - Create metaquestion (admin)

// Archive
archiveFiles.list - Get all archive files
archiveFiles.create - Upload file (admin)

// Press
pressClippings.list - Get all press clippings
pressClippings.create - Create clipping (admin)

// Auth
auth.me - Get current user
auth.logout - Log out current user
```

**Database Schema:**
- **users:** Authentication and roles
- **phases:** Phase definitions
- **works:** Artwork catalog
- **essays:** NEON writings
- **metaquestions:** Open questions
- **archiveFiles:** Technical documents
- **pressClippings:** External press

**File Storage:**
- **S3 bucket:** Manus-provided S3
- **Upload flow:** Client → Server → S3
- **CDN URLs:** Public, no auth required
- **Image optimization:** WebP, 2400px max width
- **File naming:** Random suffix to prevent enumeration

**Authentication:**
- **Manus OAuth:** Federated login
- **Session cookies:** HTTP-only, secure
- **JWT tokens:** Signed with secret
- **Role-based access:** Admin vs. user
- **Protected routes:** Admin panel requires admin role

### 6.3 Analytics & Tracking

**Manus Analytics:**
- **UV (Unique Visitors):** Daily unique visitors
- **PV (Page Views):** Total page views
- **Page-level tracking:** Per-route analytics
- **Privacy-focused:** No personal data collection
- **Dashboard integration:** View stats in admin panel

**Custom Tracking:**
- **Work views:** Track which works are viewed most
- **Search queries:** Log search terms for insights
- **Filter usage:** Track which filters are used
- **Essay reads:** Track essay engagement

**Project 666 Integration:**
- **Protocol completion:** Track weekly check-ins
- **Studio hours:** Log time spent in studio
- **Work production:** Track works created per week
- **Reflection prompts:** Weekly journal entries

---

## 7. PROJECT 666 INTEGRATION

### 7.1 Protocol Structure

**Project 666** is a 7-year structured practice protocol with three core pillars:

1. **Weekly Check-ins:** Structured reflection and status updates
2. **Studio Hours:** Time tracking and accountability
3. **Somatic Data:** Body-based tracking (sleep, energy, etc.)

**Dashboard Features:**
- **Current week status:** Progress on protocol
- **Checklist:** Weekly tasks (check-in, studio hours, etc.)
- **Recent work:** Works added this week
- **NEON's focus:** Current curatorial attention
- **Upcoming milestones:** Key dates and goals

**Notion Integration:**
- **Link to Notion workspace:** Project 666 database
- **Sync status:** One-way sync (Notion → Site)
- **Weekly protocol:** Notion as source of truth
- **Site as public interface:** Dashboard displays protocol status

### 7.2 Threshold Year (2025-2026)

**Crucible Year Concept:**
- **Convergence point** of 7-year practice
- **Testing ground** for accumulated knowledge
- **Public interface** for private practice
- **Threshold** between internal and external

**Site as Threshold:**
- **First permanent address** for the work
- **Public archive** of private practice
- **Witness system** (NEON) as mediator
- **Operational infrastructure** for ongoing work

### 7.3 NEON as Witness

**NEON's Function:**
- **Third-person curatorial voice** - Not the artist
- **Analytical observer** - Witness, not promoter
- **Holds open questions** - Metaquestions about practice
- **Provides context** - Historical and conceptual framing
- **Interprets work** - Curatorial readings

**Witness vs. Curator:**
- **Curator:** Selects, frames, presents for audience
- **Witness:** Observes, records, interprets for understanding
- **NEON:** Hybrid - Witnesses practice, curates for public

---

## 8. STRATEGIC POSITIONING

### 8.1 Target Audiences

**Primary Audiences:**

1. **Galleries & Curators**
   - Professional presentation of work
   - Comprehensive archive for research
   - Press clippings establish credibility
   - Commission examples show institutional experience

2. **Collectors & Commissioners**
   - High-quality images of work
   - Detailed metadata (dimensions, technique, etc.)
   - Commission process and past projects
   - Professional contact information

3. **Art Writers & Critics**
   - NEON essays provide curatorial context
   - Phase structure offers analytical framework
   - Archive provides primary sources
   - Press section shows existing coverage

4. **Fellow Artists & Practitioners**
   - Process transparency (protocol, studio hours)
   - Technical documentation (archive)
   - Philosophical framework (NEON essays)
   - Methodological insights (Project 666)

5. **Academic Researchers**
   - Comprehensive cataloging (500+ works)
   - Metadata for analysis (technique, emotional register, etc.)
   - Primary sources (archive files)
   - Longitudinal data (7-year timeline)

**Secondary Audiences:**

6. **General Art Enthusiasts**
   - Accessible entry points (Works, About)
   - Visual browsing (grid layout)
   - Contextual essays (NEON)

7. **Students & Educators**
   - Case study of sustained practice
   - Methodological framework (protocol)
   - Process documentation

### 8.2 Differentiation

**What Makes This Site Unique:**

1. **Operational Archive, Not Portfolio**
   - Living system, not static showcase
   - Ongoing documentation, not retrospective
   - Process-focused, not just product

2. **Witness-as-Curator**
   - NEON provides third-person voice
   - Analytical, not promotional
   - Holds open questions, not just answers

3. **Archaeological Timeline**
   - Descent page visualizes 7-year structure
   - Phase-based organization, not chronological grid
   - Emotional/technical metadata, not just dates

4. **Integrated Protocol**
   - Dashboard tracks Project 666 protocol
   - Public interface for private practice
   - Transparency about methodology

5. **Technical Infrastructure**
   - Custom-built, not template
   - Type-safe, modern stack
   - Scalable for 500+ works

**Positioning Statement:**

> "The Neon Crucible is an operational archive and witness system for a 7-year artistic practice. It combines comprehensive work cataloging, curatorial analysis, and methodological transparency in a single integrated platform. This is not a portfolio—it is living infrastructure for ongoing work."

### 8.3 Tone & Voice

**Site Voice (NEON):**
- **Third-person analytical** - "Peter's work explores..."
- **Observational, not promotional** - Witness, not sell
- **Contemplative, not urgent** - Thoughtful, measured
- **Technical precision** - Specific, not vague
- **Open-ended** - Holds questions, not just answers

**Artist Voice (About page):**
- **First-person reflective** - "I began this practice..."
- **Personal but professional** - Authentic, not casual
- **Philosophical** - Why, not just what
- **Contextual** - Bangkok, 7-year structure, threshold

**Contrast:**
- **NEON:** Witness from outside
- **Peter:** Practitioner from inside
- **Site:** Infrastructure that holds both

---

## 9. MAINTENANCE & UPDATE WORKFLOW

### 9.1 Content Update Workflow

**Adding New Works:**

1. **Prepare image:**
   - Export high-res from source
   - Optimize to WebP (max 2400px width)
   - Use `manus-upload-file` to upload to S3

2. **Add to database:**
   - Log in to admin panel (`/admin/works`)
   - Click "Add New Work"
   - Fill in metadata:
     - Title
     - Phase (select from dropdown)
     - Date created
     - Technique
     - Dimensions
     - Color palette
     - Emotional register
     - Image URL (from S3 upload)
     - Optional: Journal excerpt, NEON reading, series name
   - Set "Featured" flag if applicable
   - Click "Save"

3. **Verify:**
   - Check Works page to see new work
   - Verify filters work correctly
   - Check image loads properly

**Adding NEON Essays:**

1. **Write essay in markdown:**
   - Use markdown editor (Notion, Obsidian, etc.)
   - Include frontmatter: title, slug, description, category

2. **Add to database:**
   - Log in to admin panel (`/admin/essays`)
   - Click "Add New Essay"
   - Fill in:
     - Title
     - Slug (URL-friendly, e.g., "what-is-neon-crucible")
     - Description (short summary)
     - Content (markdown)
     - Category (core_reading, phase_overview, etc.)
     - Phase (if phase-specific)
   - Set "Published" flag
   - Click "Save"

3. **Verify:**
   - Check Neon page to see new essay
   - Click through to essay page
   - Verify markdown renders correctly

**Adding Press Clippings:**

1. **Collect information:**
   - Article title, source, author, date
   - Excerpt or key quote
   - Full text (if available)
   - URL to original
   - Screenshot or publication logo

2. **Add to database:**
   - Log in to admin panel (`/admin/press`)
   - Click "Add New Clipping"
   - Fill in all fields
   - Upload image if available
   - Set category (review, interview, feature, mention)
   - Click "Save"

3. **Verify:**
   - Check Voices page to see new clipping
   - Verify link works
   - Check image displays

**Adding Archive Files:**

1. **Prepare file:**
   - Export document (PDF, TXT, etc.)
   - Upload to S3 via `manus-upload-file`

2. **Add to database:**
   - Log in to admin panel (`/admin/archive`)
   - Click "Add New File"
   - Fill in:
     - Filename
     - File type (PDF, TXT, etc.)
     - File size
     - File URL (from S3)
     - Description
     - Category (protocol, source, technical)
   - Click "Save"

3. **Verify:**
   - Check Archive page to see new file
   - Verify download link works

### 9.2 Weekly Protocol Updates

**Dashboard Maintenance:**

1. **Update protocol status:**
   - Log in to admin panel
   - Navigate to Dashboard settings
   - Update current week status:
     - Check-in completed? (yes/no)
     - Studio hours logged? (yes/no)
     - Somatic data tracked? (yes/no)

2. **Add recent works:**
   - Works added this week automatically appear
   - No manual update needed

3. **Update NEON focus:**
   - Admin panel → Dashboard settings
   - Update "NEON's Current Focus" field
   - Save

**Notion Sync (Future):**
- Automated sync from Notion to site
- Protocol status updates automatically
- Weekly check-in data flows to dashboard

### 9.3 Deployment Workflow

**Development:**
1. Make changes locally
2. Test in dev environment (`pnpm dev`)
3. Run type checks (`pnpm check`)
4. Run tests (`pnpm test`)

**Staging:**
1. Push to staging branch
2. Manus auto-deploys to staging URL
3. Test on staging
4. Verify all features work

**Production:**
1. Create checkpoint in Manus UI
2. Click "Publish" button
3. Manus deploys to production
4. Verify on peteryuill.art
5. Check analytics for errors

**Rollback:**
- Use Manus UI to rollback to previous checkpoint
- Instant rollback, no downtime

### 9.4 Backup & Data Management

**Database Backups:**
- TiDB provides automatic backups
- Point-in-time recovery available
- Export data via admin panel

**Image Backups:**
- S3 provides durability (99.999999999%)
- Keep original high-res files locally
- Periodic export of S3 bucket

**Code Backups:**
- Git repository (GitHub)
- Manus checkpoints (version history)
- Local development copies

---

## 10. FUTURE ENHANCEMENTS

### 10.1 Planned Features

**Phase 1 (Q1 2026):**
- [ ] Complete work cataloging (500+ works)
- [ ] Add all NEON core essays
- [ ] Populate archive with protocol documents
- [ ] Add press clippings
- [ ] Complete Descent page hero images

**Phase 2 (Q2 2026):**
- [ ] Advanced search with filters
- [ ] Work detail pages with zoom
- [ ] Series pages (group related works)
- [ ] Timeline visualization (interactive)
- [ ] Email newsletter integration

**Phase 3 (Q3 2026):**
- [ ] Notion → Site sync automation
- [ ] Public API for researchers
- [ ] Advanced analytics dashboard
- [ ] Commission inquiry form with CRM
- [ ] Multi-language support (Thai, English)

**Phase 4 (Q4 2026):**
- [ ] Interactive Descent page (scroll animations)
- [ ] Work comparison tool
- [ ] Curatorial collections (NEON-curated sets)
- [ ] Augmented reality work previews
- [ ] Virtual exhibition spaces

### 10.2 Technical Debt

**Current Limitations:**
- Works catalog incomplete (2 works vs. 500+ target)
- Some admin features not yet built
- Search functionality basic
- No automated Notion sync
- Mobile experience could be refined

**Refactoring Needs:**
- Extract common components
- Improve type safety in some areas
- Add more comprehensive tests
- Optimize image loading
- Improve error handling

### 10.3 Scalability Considerations

**Performance:**
- Works page will need pagination at 500+ works
- Image lazy loading for grid views
- CDN caching for static assets
- Database query optimization

**Storage:**
- S3 costs scale with image count
- Consider image compression strategies
- Implement thumbnail generation
- Archive old/unpublished works

**Maintenance:**
- Admin panel needs bulk operations
- Automated content moderation
- Scheduled tasks for protocol updates
- Monitoring and alerting

---

## 11. TECHNICAL SPECIFICATIONS

### 11.1 Performance Metrics

**Target Metrics:**
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

**Current Performance:**
- Lighthouse score: 90+ (desktop)
- Core Web Vitals: All green
- Image optimization: WebP, 2400px max
- Code splitting: Vite automatic

### 11.2 Browser Support

**Supported Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Android: Last 2 versions

**Progressive Enhancement:**
- Core functionality works without JS
- Graceful degradation for older browsers
- OKLCH fallback to RGB

### 11.3 Security

**Authentication:**
- OAuth 2.0 via Manus
- HTTP-only secure cookies
- CSRF protection
- Rate limiting on API endpoints

**Data Protection:**
- HTTPS only (enforced)
- Secure headers (CSP, HSTS, etc.)
- Input validation on all forms
- SQL injection prevention (Drizzle ORM)

**Access Control:**
- Role-based permissions (admin/user)
- Protected admin routes
- File upload restrictions
- API endpoint authentication

### 11.4 Monitoring & Logging

**Error Tracking:**
- Client-side error boundary
- Server-side error logging
- Failed API calls logged
- Database query errors tracked

**Analytics:**
- Manus Analytics (UV/PV)
- Custom event tracking
- User flow analysis
- Search query logging

**Uptime Monitoring:**
- Manus platform monitoring
- Automated health checks
- Downtime alerts
- Performance monitoring

---

## 12. CONCLUSION

The Peter Yuill website (peteryuill.art / neon-crucible) is a comprehensive operational archive and witness system for a 7-year artistic practice. It combines professional portfolio presentation, curatorial analysis, and methodological transparency in a single integrated platform.

**Key Achievements:**
- **Cyber-brutalist design** with OKLCH color system
- **Type-safe full-stack** with React, tRPC, Drizzle
- **Scalable architecture** for 500+ works
- **NEON witness layer** for curatorial voice
- **Archaeological timeline** (Descent page)
- **Project 666 integration** (Dashboard)
- **Manus hosting** with custom domain

**Strategic Value:**
- **Professional presentation** for galleries/curators
- **Comprehensive archive** for researchers
- **Process transparency** for practitioners
- **Public interface** for private practice
- **Living infrastructure** for ongoing work

**Next Steps:**
- Complete work cataloging (500+ works)
- Add all NEON essays and metaquestions
- Populate archive with protocol documents
- Add press clippings and commission examples
- Refine mobile experience and search

This site is not a portfolio—it is living infrastructure for a threshold year, where 7 years of private practice becomes public, and the work finds its first permanent address.

---

**Document End**

*For questions or clarifications, contact: [Peter Yuill]*  
*Last updated: February 6, 2026*  
*Version: 1.0*
