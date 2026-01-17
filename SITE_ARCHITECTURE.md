# Neon Crucible Site Architecture

## Overview

The Neon Crucible is built on **React 19 + Tailwind CSS 4 + tRPC** with a centralized theme system. Styles are controlled globally through CSS custom properties (CSS variables) with minimal page-specific overrides.

---

## Global Theme System

### Primary Theme File
**Location:** `client/src/index.css`

This is the **single source of truth** for all colors, typography, and global styles.

### Theme Structure

#### 1. **@theme inline** (Lines 6-47)
Tailwind 4's theme configuration defining:
- Font families: `--font-sans`, `--font-mono`, `--font-tech`
- Border radius values
- Color mappings to CSS custom properties

#### 2. **:root** (Lines 49-84)
**Light mode theme** (currently not active):
- Background: `oklch(0.98 0 0)` (near-white)
- Foreground: `oklch(0.1 0 0)` (near-black)
- Primary: `oklch(0.6 0.15 250)` (neon blue)
- All semantic color tokens defined in OKLCH color space

#### 3. **.dark** (Lines 86-120)
**Dark mode theme** (currently active, set in App.tsx):
- Background: `oklch(0 0 0)` (deepest black)
- Foreground: `oklch(0.9 0 0)` (off-white)
- Primary: `oklch(0.85 0.15 190)` (neon cyan #00FFFF)
- Cyber-brutalist aesthetic with high contrast

#### 4. **@layer base** (Lines 122-140)
Global element styles:
- All elements get `border-border` and `outline-ring/50`
- Body gets `bg-background text-foreground`
- Interactive elements get cursor-pointer

#### 5. **@layer components** (Lines 142+)
Custom component utilities:
- `.container`: Responsive centered container with padding
- `.flex`: Min-height/width fixes

---

## Theme Switching

**Location:** `client/src/App.tsx` (Line 124-125)

```tsx
<ThemeProvider
  defaultTheme="dark"  // ← Change this to "light" for light mode
  storageKey="neon-crucible-theme"
>
```

**ThemeProvider** wraps entire app and applies `.dark` class to `<html>` element when `defaultTheme="dark"`.

### To Switch Themes:
1. **Quick switch:** Change `defaultTheme="dark"` to `defaultTheme="light"` in App.tsx
2. **Persistent:** Theme choice is saved to localStorage via `storageKey`
3. **Custom colors:** Edit CSS custom properties in `index.css` :root or .dark blocks

---

## Shared Components

### Global Layout Components

**1. Layout.tsx** (`client/src/components/Layout.tsx`)
- Wraps all public pages
- Provides:
  - Sticky metadata corners (SYS.STATUS, location, artist name, dates)
  - Sidebar navigation (desktop)
  - Mobile menu overlay
  - Search dialog integration
  - Scanline/CRT effect overlays
- Used by: All public routes (Home, Works, About, etc.)

**2. AdminLayout.tsx** (`client/src/components/AdminLayout.tsx`)
- Wraps admin dashboard pages
- Separate navigation for admin functions

**3. DashboardLayout.tsx** (`client/src/components/DashboardLayout.tsx`)
- Pre-built sidebar layout for internal tools
- Includes auth handling, user profile
- **Not currently used** in public pages

### Reusable UI Components

**4. SearchDialog.tsx**
- Global search interface
- Triggered by ⌘K or search button
- Integrated into Layout

**5. Lightbox.tsx**
- Full-screen image viewer
- Used in Works page for artwork viewing

**6. ArtworkSchema.tsx**
- Injects Schema.org VisualArtwork structured data
- Used in Works page modal

**7. ManusDialog.tsx**
- Custom dialog component
- Used across site for modals

**8. ErrorBoundary.tsx**
- Catches React errors
- Wraps entire app in App.tsx

### Specialized Components

**9. AIChatBox.tsx**
- Full-featured chat interface with streaming
- Available but not currently used in public pages

**10. Map.tsx**
- Google Maps integration with proxy auth
- Available for location features

---

## Page-Specific Styles

### Individual Page Files
**Location:** `client/src/pages/*.tsx`

Each page (Home.tsx, Works.tsx, About.tsx, etc.) contains:
- **Structure:** JSX layout specific to that page
- **Inline styles:** Tailwind utility classes (e.g., `className="text-primary bg-card"`)
- **Component imports:** Shared components + shadcn/ui components

### Page-Specific Styling Pattern
Pages use **Tailwind utility classes** that reference global CSS custom properties:
- `bg-background` → `var(--background)`
- `text-foreground` → `var(--foreground)`
- `border-border` → `var(--border)`

**No page has its own CSS file.** All styling comes from:
1. Global theme variables (index.css)
2. Tailwind utilities
3. shadcn/ui component styles (in `client/src/components/ui/`)

---

## shadcn/ui Component System

**Location:** `client/src/components/ui/*`

Pre-built, themeable components:
- `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, etc.
- All styled with Tailwind utilities
- All reference global CSS custom properties
- Automatically adapt to light/dark theme

**To customize:** Edit component files directly or override with Tailwind classes

---

## Fastest Way to Apply Sitewide Style Changes

### 1. **Change Colors**
**File:** `client/src/index.css`

**For dark mode (current):**
Edit `.dark` block (lines 86-120)

```css
.dark {
  --background: oklch(0 0 0);        /* Change background color */
  --foreground: oklch(0.9 0 0);      /* Change text color */
  --primary: oklch(0.85 0.15 190);   /* Change accent/link color */
  /* ... */
}
```

**For light mode:**
Edit `:root` block (lines 49-84)

### 2. **Change Typography**
**File:** `client/src/index.css`

Edit `@theme inline` block (lines 6-10):
```css
@theme inline {
  --font-sans: "Your Font", serif;
  --font-mono: "Your Mono Font", monospace;
}
```

**Then update:** `client/index.html` to import new Google Fonts

### 3. **Change Layout Spacing**
**File:** `client/src/index.css`

Edit `.container` utility (lines 156-181) or add new global spacing rules in `@layer base`

### 4. **Add Global CSS Rules**
**File:** `client/src/index.css`

Add to `@layer base` block (after line 122):
```css
@layer base {
  /* Your global styles here */
  h1 { font-size: 3rem; }
  p { line-height: 1.8; }
}
```

### 5. **Override Component Styles**
**File:** Individual component files in `client/src/components/ui/`

Example: To change all buttons sitewide, edit `client/src/components/ui/button.tsx`

---

## Style Cascade Priority

1. **Highest:** Inline `style={}` attributes (avoid)
2. **High:** Tailwind utilities with `!important` (use sparingly)
3. **Medium:** Component-specific Tailwind classes
4. **Low:** `@layer components` utilities
5. **Lowest:** `@layer base` global styles

---

## Key Files Summary

| File | Purpose | Edit For |
|------|---------|----------|
| `client/src/index.css` | **Global theme & styles** | Colors, fonts, global CSS |
| `client/src/App.tsx` | **Theme provider config** | Switch light/dark mode |
| `client/src/components/Layout.tsx` | **Global layout wrapper** | Navigation, metadata corners |
| `client/src/components/ui/*.tsx` | **Reusable UI components** | Button, card, dialog styles |
| `client/src/pages/*.tsx` | **Page content** | Page-specific structure |
| `client/index.html` | **HTML head** | Font imports, meta tags |

---

## Quick Reference: Common Changes

### Change Background Color
```css
/* client/src/index.css */
.dark {
  --background: oklch(0.05 0 0); /* Slightly lighter black */
}
```

### Change Primary Accent Color
```css
/* client/src/index.css */
.dark {
  --primary: oklch(0.7 0.25 330); /* Magenta instead of cyan */
}
```

### Change Font Globally
```css
/* client/src/index.css */
@theme inline {
  --font-sans: "JetBrains Mono", monospace;
}
```
```html
<!-- client/index.html -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Add Global Text Alignment
```css
/* client/src/index.css */
@layer base {
  h1, h2, h3, p {
    text-align: left !important;
  }
}
```

### Change Container Max-Width
```css
/* client/src/index.css */
@layer components {
  .container {
    max-width: 1400px; /* Wider content area */
  }
}
```

---

## Architecture Philosophy

**Centralized theming** = Easy maintenance
- One file (`index.css`) controls 90% of visual design
- CSS custom properties enable instant theme switching
- Tailwind utilities provide consistency
- Component-level overrides are minimal

**To make a sitewide change:**
1. Edit `index.css` CSS custom properties
2. Changes propagate automatically to all pages
3. No need to touch individual page files
