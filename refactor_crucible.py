import os, re

def update_file(path, pattern, replacement, is_regex=False):
    if not os.path.exists(path):
        print(f"! File not found: {path}")
        return
    with open(path, "r") as f:
        content = f.read()
    
    if is_regex:
        updated = re.sub(pattern, replacement, content, flags=re.DOTALL | re.MULTILINE)
    else:
        updated = content.replace(pattern, replacement)
        
    with open(path, "w") as f:
        f.write(updated)
    print(f"✓ Updated: {path}")

# --- 1. ADMIN DASHBOARD REFACTOR ---
# Updates state, interfaces, and loading logic in the AdminWorks page
admin_path = "client/src/pages/admin/AdminWorks.tsx"
update_file(admin_path, "isPublished: boolean;", "isPublished: boolean;\n  rating: number;")
update_file(admin_path, "isPublished: true,", "isPublished: true,\n  rating: 1,")
update_file(admin_path, "isPublished: work.isPublished ?? true,", "isPublished: work.isPublished ?? true,\n      rating: work.rating || 1,")
update_file(admin_path, "isPublished: form.isPublished,", "isPublished: form.isPublished,\n      rating: form.rating,")

# Inject the Rating UI Selector before the Published Toggle
rating_ui = """
              <div className="space-y-2">
                <Label className="font-mono text-xs">WORK RATING (1-5)</Label>
                <Select
                  value={form.rating?.toString() || "1"}
                  onValueChange={(v) => setForm(prev => ({ ...prev, rating: parseInt(v) }))}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {[1, 2, 3, 4, 5].map(r => (
                      <SelectItem key={r} value={r.toString()}>{r} — {r === 5 ? "MASTER" : "LEVEL " + r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>"""
update_file(admin_path, "{/* Published Toggle */}", rating_ui + "\n              {/* Published Toggle */}")

# --- 2. GALLERY LOGIC REFACTOR ---
# Replaces the repetitive size pattern with asymmetric logic based on your sketches
gallery_path = "client/src/pages/CrucibleWorks.tsx"
new_size_logic = """function getSizeTier(index: number, rating: number): SizeTier {
  if (rating >= 5) return { col: 2, row: 2 }; 
  if (rating === 4) return (index % 2 === 0) ? { col: 2, row: 1 } : { col: 1, row: 2 };
  if (rating === 3 && index % 3 === 0) return { col: 2, row: 1 };
  return { col: 1, row: 1 };
}"""
update_file(gallery_path, r"function getSizeTier\(index: number, rating: number\): SizeTier \{.*?^\}", new_size_logic, True)

# Fix sorting to use the correct 'featured' column name from Drizzle schema
update_file(gallery_path, "a.isFeatured", "a.featured")
