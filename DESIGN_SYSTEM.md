# Neon Crucible Design System

## Overview

A **Cyber-Brutalist Monasticism** theme combining industrial minimalism with contemplative space. Dark mode by default with OKLCH color system.

---

## Color System (OKLCH)

### Dark Mode (Default)

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--background` | `oklch(0.10 0.01 255)` | Page background - deep charcoal |
| `--foreground` | `oklch(0.90 0.015 85)` | Primary text - warm off-white |
| `--card` | `oklch(0.14 0.01 255)` | Card backgrounds - slightly lighter |
| `--card-foreground` | `oklch(0.90 0.015 85)` | Card text |
| `--muted` | `oklch(0.45 0.01 255)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.70 0.01 255)` | Secondary text, labels |
| `--border` | `oklch(0.25 0.01 255)` | Borders, dividers |
| `--primary` | `oklch(0.75 0.10 188)` | **Cyan accent** - links, active states |
| `--primary-foreground` | `oklch(0.10 0.01 255)` | Text on primary |
| `--secondary` | `oklch(0.72 0.12 75)` | **Gold/amber accent** - decorative |
| `--secondary-foreground` | `oklch(0.98 0.02 95)` | Text on secondary |
| `--ring` | `oklch(0.75 0.10 188)` | Focus rings (cyan) |
| `--destructive` | `oklch(0.6 0.25 25)` | Error states |

### Color Usage Guidelines

```css
/* Primary cyan for interactive elements */
.text-primary     /* Links, active nav items */
.border-primary   /* Hover borders on cards */
.bg-primary       /* Primary buttons */

/* Secondary gold for decorative accents */
.bg-secondary     /* Quote decorations, dividers */
.text-secondary   /* Hover states on nav */

/* Muted for supporting content */
.text-muted-foreground  /* Labels, metadata, captions */
.bg-muted              /* Subtle backgrounds */
```

---

## Typography

### Font Families

| Token | Font Stack | Usage |
|-------|------------|-------|
| `--font-sans` | `"Inter", system-ui, sans-serif` | Body text, UI elements |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | Labels, metadata, system text |
| `--font-serif` | `"Cormorant Garamond", Georgia, serif` | Headings, artwork titles |

### Typography Scale

```css
/* Headings - Cormorant Garamond, weight 300 (light) */
h1, h2, h3, h4 {
  font-family: var(--font-serif);
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

/* Body text - Inter */
body {
  font-family: var(--font-sans);
  line-height: 1.65;
}

p {
  line-height: 1.75;
  margin-bottom: 1.25em;
}

/* Monospace labels */
.font-mono {
  font-family: var(--font-mono);
  /* Typically: text-xs, uppercase, tracking-wider */
}
```

### Typography Patterns

| Element | Classes | Example |
|---------|---------|---------|
| Page H1 | `text-4xl md:text-5xl font-serif font-light` | "WORK ARCHIVE" |
| Section Label | `font-mono text-xs uppercase tracking-wider text-muted` | "STUDIO" |
| Artwork Title | `font-serif text-lg` | "Gravity Well" |
| Metadata | `font-mono text-xs text-muted-foreground` | "56cm × 76cm" |
| Body Text | `font-sans text-base` | Paragraph content |

---

## Spacing & Layout

### Border Radius

```css
--radius: 0rem;  /* Brutalist - no rounded corners by default */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);  /* 0 */
--radius-xl: calc(var(--radius) + 4px);
```

**Note:** Cards use `rounded-lg` (8px) as an exception for softer feel.

### Container

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;      /* Mobile: 16px */
}
@media (min-width: 640px) {
  padding: 0 1.5rem;    /* Tablet: 24px */
}
@media (min-width: 1024px) {
  padding: 0 2rem;      /* Desktop: 32px */
  max-width: 1280px;
}
```

### Main Content Area

```css
/* Sidebar: 224px (md) / 256px (lg) */
main {
  margin-left: 224px;  /* md:ml-56 */
  padding: 6rem 2rem 2rem;  /* pt-24 px-8 pb-8 */
  max-width: 64rem;  /* max-w-5xl for content */
}
```

---

## Components

### Card

```tsx
<Card className="...">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Card Styling:**
- Background: `bg-card` (slightly lighter than page)
- Border: `border border-border` (subtle)
- Hover: `hover:border-primary` (cyan border on hover)
- Transition: `transition-colors duration-150`
- Radius: `rounded-lg` (8px)
- Padding: `py-6 px-6`

### Button Variants

| Variant | Style |
|---------|-------|
| `default` | Cyan background, dark text |
| `outline` | Transparent, border, hover cyan |
| `secondary` | Transparent, border, hover cyan |
| `ghost` | No border, hover accent bg |
| `destructive` | Red background |
| `link` | Underline on hover |

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>
```

**Button Styling:**
- Height: `h-9` (default), `h-8` (sm), `h-11` (lg)
- Font: `text-sm font-medium tracking-wide`
- Transition: `transition-all duration-150`
- Focus: `outline-ring` (cyan ring)

---

## Navigation Structure

### Routes

**STUDIO Group (Public-facing):**
| Route | Label | Icon |
|-------|-------|------|
| `/works` | Works | Grid |
| `/about` | About | User |
| `/voices` | Press | Quote |
| `/contact` | Contact | Mail |
| `/commissions` | Commissions | Briefcase |

**SYSTEM Group (Internal tools):**
| Route | Label | Icon |
|-------|-------|------|
| `/` | Threshold | Home |
| `/neon` | Neon | Eye |
| `/archive` | Archive | Archive |
| `/statistics` | Statistics | BarChart3 |
| `/dashboard` | Dashboard | Activity |

### Navigation States

```css
/* Active item */
.text-primary.translate-x-2

/* Inactive item */
.text-muted-foreground.hover:text-secondary.hover:translate-x-1

/* Active indicator */
<span className="animate-blink">_</span>
```

### Sidebar Layout

- Width: `w-56 lg:w-64` (224px / 256px)
- Position: `fixed h-full`
- Background: `bg-sidebar`
- Border: `border-r border-border`

---

## Visual Effects

### Noise Texture Overlay

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.025;
  z-index: 9999;
  background-image: url("data:image/svg+xml,...noise...");
}
```

### Scanline Effect

```css
/* CRT-style scanlines */
background: linear-gradient(
  rgba(18,16,16,0) 50%,
  rgba(0,0,0,0.12) 50%
);
background-size: 100% 2px;
```

### Metadata Corners

Fixed position system status indicators:
- Top-left: `SYS.STATUS: ONLINE` + current route
- Top-right: `PETER YUILL` + `2018—2025`
- Bottom-left: `CRUCIBLE YEAR` + `BANGKOK`

---

## Animation

### Transitions

```css
/* Standard transition */
transition-all duration-150

/* Navigation hover */
transition-all duration-300

/* Page entrance */
animate-in fade-in duration-700 slide-in-from-bottom-4
```

### Keyframes

```css
/* Blinking cursor for active nav */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink { animation: blink 1s step-end infinite; }

/* Pulse for active icons */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Tablet portrait |
| `md` | 768px | Tablet landscape, show sidebar |
| `lg` | 1024px | Desktop, wider sidebar |
| `xl` | 1280px | Large desktop |

### Mobile Considerations

- Mobile header: Fixed top bar with hamburger menu
- Sidebar hidden below `md` breakpoint
- Touch targets: Minimum 44px height
- System group collapsible on mobile

---

## Usage Examples

### Page Header Pattern

```tsx
<section className="space-y-6 mb-12">
  <div className="space-y-2">
    <span className="font-mono text-xs uppercase tracking-wider text-muted">
      SECTION LABEL
    </span>
    <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight">
      Page Title
    </h1>
  </div>
  <p className="text-muted-foreground max-w-2xl">
    Page description text goes here.
  </p>
</section>
```

### Work Card Pattern

```tsx
<Card className="group overflow-hidden">
  <div className="aspect-square overflow-hidden">
    <img 
      src={imageUrl} 
      alt={title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
  <CardContent className="space-y-1">
    <h3 className="font-serif text-lg">{title}</h3>
    <p className="font-mono text-xs text-muted-foreground">{dimensions}</p>
  </CardContent>
</Card>
```

### Quote Block Pattern

```tsx
<section className="max-w-2xl mx-auto text-center py-16">
  <div className="w-16 h-px bg-secondary mx-auto mb-8" />
  <blockquote className="font-serif text-xl md:text-2xl italic text-muted-foreground">
    "Quote text here."
  </blockquote>
  <p className="font-mono text-sm text-muted-foreground mt-4">
    — Attribution
  </p>
  <div className="w-16 h-px bg-secondary mx-auto mt-8" />
</section>
```

---

## File Structure

```
client/src/
├── index.css              # CSS variables, base styles
├── App.tsx                # Routes, theme provider
├── components/
│   ├── Layout.tsx         # Navigation, sidebar
│   ├── ui/
│   │   ├── button.tsx     # Button variants
│   │   ├── card.tsx       # Card components
│   │   └── ...            # Other shadcn/ui components
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── Works.tsx          # Archive grid
│   ├── About.tsx          # Artist bio
│   └── ...
└── contexts/
    └── ThemeContext.tsx   # Dark/light mode
```
