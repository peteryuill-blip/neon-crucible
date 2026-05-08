import os
import re
from pathlib import Path

ROOT = Path.home() / "neon-crucible" / "client"
OUT = Path.home() / "storage" / "downloads" / "site-spec.md"

def read_file(p):
    try:
        return Path(p).read_text(errors="ignore")
    except:
        return ""

def list_tsx_pages():
    pages_dir = ROOT / "src" / "pages"
    if not pages_dir.exists():
        return []
    return sorted([p.name for p in pages_dir.glob("*.tsx")])

def find_imports():
    results = []
    src = ROOT / "src"
    if not src.exists():
        return results

    for path in src.rglob("*.ts*"):
        try:
            text = path.read_text(errors="ignore")
        except:
            continue
        imports = re.findall(r'from\s+[\'"]([^\'"]+)[\'"]', text)
        if imports:
            results.append((str(path.relative_to(ROOT)), imports[:10]))
    return results

def section(title, content):
    return f"\n## {title}\n{content}\n"

def build_md():
    md = []
    md.append("# Site Specification (Auto-generated)\n")

    # Pages
    pages = list_tsx_pages()
    md.append(section("Pages", "\n".join([f"- {p}" for p in pages]) or "- None found"))

    # Structure
    md.append(section("Structure", """
src/
  pages/
  components/
  shared/
  assets/
""".strip()))

    # Key config files
    for f in ["package.json", "tsconfig.json", "vite.config.ts", "vite.config.js", "index.html"]:
        content = read_file(ROOT / f)
        if content:
            md.append(section(f, content[:2000]))

    # Imports map (lightweight)
    imports = find_imports()
    imp_lines = []
    for file, imps in imports[:50]:
        imp_lines.append(f"- {file}: {', '.join(imps)}")
    md.append(section("Import Map (partial)", "\n".join(imp_lines) or "- None found"))

    return "\n".join(md)

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    md = build_md()
    OUT.write_text(md)
    print(f"Wrote: {OUT}")

if __name__ == "__main__":
    main()
