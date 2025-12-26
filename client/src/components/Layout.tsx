import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Archive, Eye, Grid, Home, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "THRESHOLD", icon: Home },
    { href: "/neon", label: "NEON", icon: Eye },
    { href: "/works", label: "WORKS", icon: Grid },
    { href: "/dashboard", label: "DASHBOARD", icon: Activity },
    { href: "/archive", label: "ARCHIVE", icon: Archive },
    { href: "/about", label: "ABOUT", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Sticky Metadata Corners */}
      <div className="fixed top-4 left-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference">
        <span className="block">SYS.STATUS: ONLINE</span>
        <span className="block">LOC: {location.toUpperCase()}</span>
      </div>
      <div className="fixed top-4 right-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference text-right">
        <span className="block">PETER YUILL</span>
        <span className="block">2018—2025</span>
      </div>
      <div className="fixed bottom-4 left-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference">
        <span className="block">CRUCIBLE YEAR</span>
        <span className="block">BANGKOK</span>
      </div>

      {/* Main Grid Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar Navigation - Desktop */}
        <nav className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar p-6 pt-24 fixed h-full z-40">
          <div className="space-y-8">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-4 cursor-pointer transition-all duration-300",
                      isActive ? "text-primary translate-x-2" : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
                    <span className="font-mono text-sm tracking-widest">{item.label}</span>
                    {isActive && <span className="ml-auto text-xs animate-blink">_</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-12 border-t border-border/50">
            <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              <p>OPERATIONAL ARCHIVE</p>
              <p>WITNESS SYSTEM V.1.0</p>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-border z-50 px-4 py-3 flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-muted-foreground")}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-mono">{item.label.slice(0, 3)}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-12 pt-24 md:pt-24 min-h-screen relative">
          {/* Scanline Effect Overlay */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay"></div>
          <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
