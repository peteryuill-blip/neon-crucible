import { Link, useLocation } from "wouter";

const navItems = [
  { name: "Intro", path: "/crucible" },
  { name: "Paintings", path: "/crucible/paintings" },
  { name: "Materials", path: "/crucible/materials" },
  { name: "Through Time", path: "/crucible/time" },
  { name: "The Anatomy", path: "/crucible/anatomy" },
];

export default function CrucibleLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-black text-zinc-400">
      <nav className="max-auto px-6 py-12 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-baseline gap-6">
          <div className="space-y-1">
            <h2 className="font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-500">Project 60606</h2>
            <p className="font-mono text-[8px] text-zinc-600 tracking-widest uppercase">The Crucible Year Archive</p>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-[10px] tracking-[0.2em] uppercase">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <span className={`cursor-pointer transition-all duration-500 hover:text-cyan-400 ${
                    location === item.path ? "text-zinc-100 border-b border-cyan-500/50 pb-1" : "text-zinc-600"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="pb-24">{children}</main>
    </div>
  );
}
