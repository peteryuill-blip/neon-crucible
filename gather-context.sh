#!/bin/bash

# Set the output location to your phone's Downloads folder
OUTPUT=~/storage/downloads/neon-crucible-architecture.md

echo "Generating System Architecture Document..."

# Start writing the Markdown file
cat << 'MD' > $OUTPUT
# Neon Crucible - System Architecture & Context Guide
**Generated:** $(date)

This document contains the complete technical architecture, folder structure, and environment setup for the Neon Crucible project. Use this file as context to pick up work on the project.

## 1. Tech Stack & Environment
* **OS:** Termux (Android Local Environment)
* **Runtime:** Node.js / TypeScript (tsx)
* **Package Manager:** pnpm
* **Database:** MySQL (Railway)
* **Storage Approach:** Quarantined Local Processing (Images pulled from ./pull/, optimized, output to ./public/works/crucible/).

## 2. Global Directory Structure
```text
MD

# Append the directory tree (ignoring heavy folders)
tree -L 4 -I "node_modules|.git|.next|dist|pull" >> $OUTPUT

# Append dependencies
cat << 'MD' >> $OUTPUT
```

## 3. Package & Dependencies
```json
MD
grep -A 40 '"dependencies"' package.json >> $OUTPUT
grep -A 40 '"devDependencies"' package.json >> $OUTPUT 2>/dev/null || true

# Append Environment Variables safely
cat << 'MD' >> $OUTPUT
```

## 4. Environment Variables (Architecture)
*Note: Secrets are redacted for security, but the structure is required for local setup.*
```env
MD
sed -e 's/=.*/=[REDACTED]/' .env >> $OUTPUT

# Add the specific architecture rules
cat << 'MD' >> $OUTPUT
```

## 5. Specific Feature Architectures

### A. Image Processing Engine
* **Location:** scripts/generate-image-sizes.mjs
* **Logic:** Reads `_full.jpg` originals from `./pull/`. Generates web-optimized `_lg.webp`, `_md.webp`, and `_sm.webp` formats while strictly maintaining the exact original aspect ratio. Outputs to `./public/works/crucible/`. No cloud uploads (strictly local output).

### B. Masonry Grid (Frontend Component)
* **Display Logic:** Based on database rating (INT 1-5).
    * **5* Rating:** Largest image (_lg), spans 3 grid units.
    * **4* Rating:** Medium image (_md), spans 2 grid units.
    * **3* Rating:** Smallest image (_sm), spans 1 grid unit.
    * **1* and 2* Ratings (The "Tithe"):** Renders a transparent, empty grid block to create organic holes in the masonry. No explicitly named classes exposing the "tithe" concept in the DOM.
MD

echo "✅ Done! Your master architecture file has been saved to your Downloads folder:"
echo "📂 $OUTPUT"
