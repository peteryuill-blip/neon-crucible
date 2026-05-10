#!/data/data/com.termux/files/usr/bin/bash
cd ~/neon-crucible
echo "🔥 DEPLOYING NEON CRUCIBLE"

# 1. Verify files
for f in server/db.ts server/schema.ts server/routes.ts server/_core/index.ts client/src/App.tsx client/src/pages/Crucible.tsx client/src/components/CrucibleMasonryGallery.tsx vite.config.ts package.json; do
  [ ! -f "$f" ] && echo "❌ MISSING: $f" && exit 1
done
echo "✅ All files present"

# 2. Git commit
git add -A
git commit -m "🔥 Pre-launch build — $(date '+%Y-%m-%d %H:%M')" || true
git branch -M main 2>/dev/null || true

# 3. Push to GitHub
git push -u origin main || echo "⚠️  Push failed — check git remote"

echo ""
echo "🚂 If Railway CLI is installed, run: railway up"
echo "   Otherwise deploy manually at railway.app/dashboard"
