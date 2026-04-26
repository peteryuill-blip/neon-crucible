import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BookOpen, Eye, Flame, Grid, User, Menu, X, Search, Settings } from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { href: "/works", label: "Works", icon: Grid },
    { href: "/practice", label: "The Practice", icon: BookOpen },
    { href: "/crucible", label: "The Crucible", icon: Flame },
    { href: "/neon", label: "Neon", icon: Eye },
    { href: "/about", label: "About", icon: User },
    ...(user?.role === "admin" ? [{ href: "/manage", label: "Manage", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Sticky Metadata Corners */}
      <div className="hidden sm:block fixed top-4 left-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60">
        <span className="block">SYS.STATUS: ONLINE</span>
        <span className="block truncate max-w-[120px] sm:max-w-none">LOC: {location.toUpperCase()}</span>
      </div>
      <div className="hidden sm:block fixed top-4 right-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60 text-right">
        <span className="block">PETER YUILL</span>
        <span className="block">2011—PRESENT</span>
      </div>
      <div className="hidden md:block fixed bottom-4 left-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60">
        <span className="block">OPERATIONAL ARCHIVE</span>
        <span className="block">BANGKOK</span>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs text-primary">
          PETER YUILL
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/98 pt-16">
          <nav className="flex flex-col p-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-4 py-3 border-b border-border/30",
                      isActive ? "text-primary font-medium" : "text-foreground hover:text-primary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                    {item.href === "/crucible" && (
                      <span className="ml-auto font-mono text-[10px] text-primary/60 animate-pulse">LIVE</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-8 left-6 space-y-2">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest">SEARCH</span>
            </button>
            <div className="font-mono text-[10px] text-muted-foreground pt-4">
              <p>WITNESS SYSTEM V.2.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar Navigation - Desktop Only */}
        <nav className="hidden md:flex flex-col w-56 lg:w-64 border-r border-border bg-sidebar p-4 lg:p-6 pt-24 fixed h-full z-40">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 lg:gap-4 cursor-pointer transition-all duration-300 px-2 py-2.5 rounded-none",
                      isActive
                        ? "text-primary translate-x-2"
                        : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", isActive && "animate-pulse")} />
                    <span className="text-sm truncate">{item.label}</span>
                    {item.href === "/crucible" && (
                      <span className="ml-auto font-mono text-[9px] text-primary/60 animate-pulse hidden lg:inline">LIVE</span>
                    )}
                    {isActive && <span className="ml-auto text-xs animate-blink hidden lg:inline">_</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-8 space-y-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 lg:gap-4 text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 group min-h-[44px] py-2"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs lg:text-sm tracking-widest">SEARCH</span>
              <kbd className="ml-auto hidden lg:inline-block text-[10px] px-1.5 py-0.5 border border-border rounded opacity-50 group-hover:opacity-100 transition-opacity">⌘K</kbd>
            </button>

            <div className="pt-6 border-t border-border/50">
              <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                <p>OPERATIONAL ARCHIVE</p>
                <p>WITNESS SYSTEM V.2.0</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main
          className="flex-1 md:ml-56 lg:ml-64 px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-24 pb-32 md:pb-8 min-h-screen relative"
          style={{ paddingBottom: "max(8rem, env(safe-area-inset-bottom, 0px) + 8rem)" }}
        >
          {/* Scanline Effect Overlay */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay"></div>
          <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

          <div className="relative z-10 max-w-5xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
