#!/usr/bin/env python3
"""
neon_crucible_setup.py
======================
Automates the wiring & sanity-checks for the CrucibleMasonryGallery
component inside the Neon Crucible project.

Designed for Pydroid 3 on Android (works in Termux too).
Safe to re-run — every step is idempotent.

Usage:
    python neon_crucible_setup.py
    python neon_crucible_setup.py --auto        # no prompts, do everything safe
    python neon_crucible_setup.py --dry-run     # show actions, change nothing
"""

from __future__ import annotations
import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# Config — edit only if your project layout differs
# ─────────────────────────────────────────────────────────────
COMPONENT_NAME   = "CrucibleMasonryGallery.tsx"
COMPONENT_DIR    = Path("client/src/components")
TARGET_PAGE      = Path("client/src/pages/CrucibleWorks.tsx")
ROUTER_FILE      = Path("server/routers.ts")
TRPC_LIB         = Path("client/src/lib/trpc.ts")
UTILS_LIB        = Path("client/src/lib/utils.ts")

# Names that must NOT appear in the gallery DOM/classes (spec: "tithe" hidden)
FORBIDDEN_TOKENS = [
    r"\btithe\b",
    r"hidden-work",
    r"empty-block",
    r"tithe-block",
]

# Imports the component must NOT use (wrong conventions for this project)
BAD_IMPORTS = [
    ("react-router-dom", "use 'wouter' instead (the project patches wouter@3.7.1)"),
    ("next/router",       "Next.js — not this project"),
    ("next/link",         "Next.js — not this project"),
    ("@/components/Link", "use wouter's <Link> directly"),
]

# Imports the component SHOULD use
EXPECTED_HINTS = [
    ("wouter",                 "routing"),
    ("@/lib/trpc",             "data fetching"),
    ("@/lib/utils",            "cn() helper"),
]

# ─────────────────────────────────────────────────────────────
# Terminal colors (ANSI). Pydroid's console supports them.
# ─────────────────────────────────────────────────────────────
class C:
    R = "\033[0m";  B = "\033[1m"
    GRN = "\033[32m"; YLW = "\033[33m"; RED = "\033[31m"
    CYN = "\033[36m"; MAG = "\033[35m"; DIM = "\033[2m"

def banner(msg):  print(f"\n{C.B}{C.CYN}━━━ {msg} ━━━{C.R}")
def ok(msg):      print(f"  {C.GRN}✓{C.R} {msg}")
def warn(msg):    print(f"  {C.YLW}⚠{C.R} {msg}")
def fail(msg):    print(f"  {C.RED}✗{C.R} {msg}")
def info(msg):    print(f"  {C.DIM}·{C.R} {msg}")

# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────
def find_project_root(start: Path) -> Path | None:
    """Walk up from `start` looking for a dir that contains package.json
    AND a client/ subfolder (the Neon Crucible signature)."""
    cur = start.resolve()
    for _ in range(8):
        if (cur / "package.json").exists() and (cur / "client").exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    # fall back: look in common Android paths
    candidates = [
        Path.home() / "neon-crucible",
        Path.home() / "projects" / "neon-crucible",
        Path("/sdcard/neon-crucible"),
        Path("/storage/emulated/0/neon-crucible"),
    ]
    for c in candidates:
        if (c / "package.json").exists() and (c / "client").exists():
            return c.resolve()
    return None

def run(cmd: list[str], cwd: Path, dry=False, capture=True) -> tuple[int, str]:
    info(f"$ {' '.join(cmd)}")
    if dry:
        return 0, "(dry-run)"
    try:
        res = subprocess.run(
            cmd, cwd=cwd,
            capture_output=capture, text=True, timeout=600,
        )
        return res.returncode, (res.stdout or "") + (res.stderr or "")
    except FileNotFoundError:
        return 127, f"binary not found: {cmd[0]}"
    except subprocess.TimeoutExpired:
        return 124, "timed out"

def prompt_yn(question: str, default_yes=True, auto=False) -> bool:
    if auto:
        return default_yes
    suffix = "[Y/n]" if default_yes else "[y/N]"
    try:
        ans = input(f"{C.MAG}?{C.R} {question} {suffix} ").strip().lower()
    except EOFError:
        return default_yes
    if not ans:
        return default_yes
    return ans.startswith("y")

def read(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        fail(f"cannot read {p}: {e}")
        return ""

def write(p: Path, content: str, dry=False):
    if dry:
        info(f"(dry) would write {p}")
        return
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

# ─────────────────────────────────────────────────────────────
# Steps
# ─────────────────────────────────────────────────────────────
def step_locate_component(root: Path) -> Path | None:
    banner("Step 1 — Locate component")
    target = root / COMPONENT_DIR / COMPONENT_NAME
    if target.exists():
        ok(f"already in place: {target.relative_to(root)}")
        return target

    # Search the project for it
    info("scanning project for the file …")
    matches = [p for p in root.rglob(COMPONENT_NAME) if "node_modules" not in p.parts]
    if not matches:
        fail(f"{COMPONENT_NAME} not found anywhere under {root}")
        return None
    src = matches[0]
    ok(f"found at: {src.relative_to(root)}")
    return src

def step_move_component(root: Path, src: Path, dry=False, auto=False) -> Path | None:
    banner("Step 2 — Place component in components/")
    dest = root / COMPONENT_DIR / COMPONENT_NAME
    if src == dest:
        ok("already at destination")
        return dest
    if not prompt_yn(f"move {src.relative_to(root)} → {dest.relative_to(root)}?",
                     auto=auto):
        warn("skipped move")
        return src
    if dry:
        info(f"(dry) would move {src} → {dest}")
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(dest))
    ok(f"moved to {dest.relative_to(root)}")
    return dest

def step_audit_imports(root: Path, comp: Path):
    banner("Step 3 — Audit imports & conventions")
    text = read(comp)
    if not text:
        return False

    problems = 0

    # Forbidden imports
    for bad, reason in BAD_IMPORTS:
        if re.search(rf'from\s+["\']{re.escape(bad)}', text):
            fail(f"uses `{bad}` — {reason}")
            problems += 1
    if problems == 0:
        ok("no forbidden imports")

    # Expected imports (informational)
    for hint, purpose in EXPECTED_HINTS:
        if hint in text:
            ok(f"uses `{hint}` ({purpose})")
        else:
            warn(f"does not import `{hint}` ({purpose}) — may be fine if self-contained")

    # Forbidden tithe tokens
    tithe_hits = []
    for pat in FORBIDDEN_TOKENS:
        for m in re.finditer(pat, text, re.IGNORECASE):
            tithe_hits.append((pat, m.start()))
    if tithe_hits:
        fail(f"tithe-related tokens present in DOM/source ({len(tithe_hits)} hits) — "
             f"spec forbids exposing the concept")
        for pat, pos in tithe_hits[:5]:
            line = text.count("\n", 0, pos) + 1
            info(f"line {line}: matched /{pat}/")
        problems += 1
    else:
        ok("no 'tithe' tokens leaked into the component")

    # Rating logic heuristic: must map 5/4/3 → span + 1/2 → transparent
    if re.search(r"rating\s*===?\s*5", text) or re.search(r"rating\s*>=\s*5", text):
        ok("handles 5★ rating")
    else:
        warn("no explicit 5★ rating branch detected")

    if "opacity-0" in text or "invisible" in text or 'visibility' in text.lower():
        ok("has transparent/invisible styling (tithe spacers OK)")
    else:
        warn("no transparent styling found — 1★/2★ may not render as empty spacers")

    return problems == 0

def step_check_router(root: Path):
    banner("Step 4 — Verify gallery tRPC endpoint")
    rf = root / ROUTER_FILE
    if not rf.exists():
        fail(f"{ROUTER_FILE} missing")
        return False
    text = read(rf)
    # Look for a gallery router / procedure
    has_gallery = bool(re.search(r"\bgallery\b", text))
    has_rating  = bool(re.search(r"\brating\b", text))
    if has_gallery:
        ok("`gallery` reference present in server/routers.ts")
    else:
        warn("no `gallery` router procedure detected — component may need one")
    if has_rating:
        ok("`rating` field referenced in router/schema")
    else:
        warn("no `rating` reference in routers — confirm works return rating 1–5")
    return has_gallery

def step_wire_into_page(root: Path, dry=False, auto=False):
    banner("Step 5 — Wire component into CrucibleWorks page")
    page = root / TARGET_PAGE
    if not page.exists():
        fail(f"{TARGET_PAGE} not found")
        return False
    text = read(page)

    import_line = 'import CrucibleMasonryGallery from "@/components/CrucibleMasonryGallery";'
    usage       = "<CrucibleMasonryGallery />"

    already_imported = "CrucibleMasonryGallery" in text
    already_used     = usage in text

    if already_imported and already_used:
        ok("already imported and rendered in CrucibleWorks.tsx")
        return True

    if not prompt_yn("inject import + <CrucibleMasonryGallery /> into CrucibleWorks.tsx?",
                     auto=auto):
        warn("skipped wiring")
        return False

    new_text = text
    if not already_imported:
        # place after the last existing import
        lines = new_text.splitlines()
        last_import = 0
        for i, ln in enumerate(lines):
            if ln.startswith("import "):
                last_import = i
        lines.insert(last_import + 1, import_line)
        new_text = "\n".join(lines)
        ok("import added")

    if not already_used:
        # Try to drop it just before the last closing </…> of the default export
        # Fallback: append a comment the user can relocate
        m = list(re.finditer(r"</[A-Za-z][\w.]*>\s*\)\s*;?\s*}\s*$", new_text, re.MULTILINE))
        if m:
            insert_at = m[-1].start()
            new_text = new_text[:insert_at] + f"      {usage}\n      " + new_text[insert_at:]
            ok("rendered inside last JSX block")
        else:
            new_text += (
                "\n\n/* TODO: move this into the page's JSX tree */\n"
                f"// {usage}\n"
            )
            warn("could not auto-locate JSX tree — left a TODO comment")

    if dry:
        info("(dry) would write CrucibleWorks.tsx")
    else:
        # backup first
        bak = page.with_suffix(page.suffix + ".bak")
        if not bak.exists():
            bak.write_text(text, encoding="utf-8")
            info(f"backup saved → {bak.relative_to(root)}")
        write(page, new_text)
        ok("CrucibleWorks.tsx updated")
    return True

def step_pnpm(root: Path, dry=False, auto=False):
    banner("Step 6 — Install & run")
    has_node_modules = (root / "node_modules").exists()

    if not has_node_modules:
        if prompt_yn("node_modules missing — run `pnpm install` now?", auto=auto):
            rc, out = run(["pnpm", "install"], cwd=root, dry=dry, capture=False)
            if rc == 0:
                ok("pnpm install complete")
            else:
                fail(f"pnpm install failed (code {rc})")
                print(out[-1200:])
                return False
    else:
        ok("node_modules present")

    if prompt_yn("launch `pnpm dev` now? (Ctrl+C to stop the server)",
                 default_yes=False, auto=False):  # never auto-launch a long-running server
        if dry:
            info("(dry) would exec pnpm dev")
            return True
        # Hand control over to pnpm dev — streams directly to console
        try:
            subprocess.run(["pnpm", "dev"], cwd=root)
        except KeyboardInterrupt:
            print()
            info("dev server stopped")
    else:
        info("skipped pnpm dev — run it manually when ready")
    return True

# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--auto",    action="store_true", help="no prompts (safe defaults)")
    ap.add_argument("--dry-run", action="store_true", help="report only, change nothing")
    ap.add_argument("--root",    type=str, default=None,
                    help="explicit project root (otherwise auto-detected)")
    args = ap.parse_args()

    print(f"{C.B}{C.MAG}Neon Crucible — CrucibleMasonryGallery setup{C.R}")
    print(f"{C.DIM}auto={args.auto}  dry-run={args.dry_run}{C.R}")

    # Locate project root
    if args.root:
        root = Path(args.root).expanduser().resolve()
        if not (root / "package.json").exists():
            fail(f"{root} does not look like a Node project")
            sys.exit(2)
    else:
        root = find_project_root(Path.cwd())
    if not root:
        fail("could not locate the neon-crucible project root")
        fail("pass one explicitly:  python neon_crucible_setup.py --root /path/to/neon-crucible")
        sys.exit(2)
    ok(f"project root: {root}")

    # Quick signature check
    for p in (root / "client/src", root / "server", root / "package.json"):
        if not p.exists():
            fail(f"missing expected path: {p.relative_to(root)}")
            sys.exit(2)

    # Run steps
    src = step_locate_component(root)
    if not src:
        fail("Aborting — component file not found. Move it into the repo first.")
        sys.exit(1)

    comp = step_move_component(root, src, dry=args.dry_run, auto=args.auto)
    if not comp:
        sys.exit(1)

    audit_ok  = step_audit_imports(root, comp)
    router_ok = step_check_router(root)
    step_wire_into_page(root, dry=args.dry_run, auto=args.auto)

    if not (audit_ok and router_ok):
        warn("Some audits flagged issues — review the output above before running dev.")

    step_pnpm(root, dry=args.dry_run, auto=args.auto)

    banner("Done")
    ok("If no red ✗ marks appeared, you are ready.")
    info("Re-run any time: python neon_crucible_setup.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        fail("interrupted")
        sys.exit(130)
