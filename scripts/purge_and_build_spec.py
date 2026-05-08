import os
from pathlib import Path
from datetime import datetime
import json

ROOT = Path("~/neon-crucible/client").expanduser()
OUT = Path.home() / "storage/downloads/neon_crucible_FULL_SPEC.md"

EXCLUDE_DIRS = {".git", "node_modules", "dist", ".pnpm"}

def safe_read(p):
    try:
        return p.read_text(errors="ignore")
    except:
        return ""

def scan():
    files = []
    for p in ROOT.rglob("*"):
        if any(x in p.parts for x in EXCLUDE_DIRS):
            continue
        if p.is_file():
            files.append(p)
    return files

def group_by_ext(files):
    grouped = {}
    for f in files:
        grouped.setdefault(f.suffix, []).append(f)
    return grouped

def extract_env_usage(files):
    hits = []
    for f in files:
        if f.suffix in [".html", ".ts", ".tsx", ".js"]:
            txt = safe_read(f)
            for line in txt.splitlines():
                if "VITE_" in line:
                    hits.append((str(f.relative_to(ROOT)), line.strip()))
    return hits

def extract_import_graph(files):
    imports = []
    for f in files:
        if f.suffix in [".ts", ".tsx", ".js", ".jsx"]:
            txt = safe_read(f)
            for line in txt.splitlines():
                if "from " in line or "import " in line:
                    imports.append((str(f.relative_to(ROOT)), line.strip()))
    return imports[:3000]

def build():
    files = scan()
    grouped = group_by_ext(files)

    env = extract_env_usage(files)
    imports = extract_import_graph(files)

    md = []
    md.append(f"# NEON CRUCIBLE — FULL SYSTEM SPEC\nGenerated: {datetime.now()}\n")

    # FILE MAP
    md.append("## 1. FILE SYSTEM MAP\n")
    for f in sorted(files):
        md.append(f"- {f.relative_to(ROOT)}")

    # TYPE BREAKDOWN
    md.append("\n## 2. FILE TYPES\n")
    for ext, group in grouped.items():
        md.append(f"### {ext or 'no-extension'} ({len(group)})")
        for f in group[:200]:
            md.append(f"- {f.relative_to(ROOT)}")

    # ENV
    md.append("\n## 3. ENVIRONMENT USAGE (VITE)\n")
    for f, line in env:
        md.append(f"- {f}: `{line}`")

    # IMPORT GRAPH (lightweight dependency view)
    md.append("\n## 4. IMPORT RELATIONSHIPS (TRUNCATED)\n")
    for f, line in imports:
        md.append(f"- {f} → {line}")

    # CONFIG FILES
    md.append("\n## 5. CONFIG SNAPSHOT\n")
    for name in ["package.json", "tsconfig.json", "vite.config.ts"]:
        p = ROOT / name
        if p.exists():
            md.append(f"### {name}")
            md.append("```json")
            md.append(safe_read(p))
            md.append("```")

    return "\n".join(md)

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)

    # PURGE OLD FILE FIRST
    if OUT.exists():
        OUT.unlink()

    content = build()
    OUT.write_text(content)
    print(f"Generated full spec → {OUT}")

if __name__ == "__main__":
    main()
