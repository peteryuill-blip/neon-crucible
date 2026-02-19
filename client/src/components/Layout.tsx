import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Archive, Eye, Grid, Home, User, Quote, Menu, X, Search, BarChart3, Briefcase, Mail, TrendingDown, Settings } from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [systemExpanded, setSystemExpanded] = useState(false);
  const { user } = useAuth();

  // STUDIO group - always visible
  const studioItems = [
    { href: "/works", label: "Works", icon: Grid },
    { href: "/about", label: "About", icon: User },
    { href: "/voices", label: "Press", icon: Quote },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/commissions", label: "Commissions", icon: Briefcase },
  ];

  // SYSTEM group - collapsible on mobile
  const systemItems = [
    { href: "/", label: "Threshold", icon: Home },
    { href: "/neon", label: "Neon", icon: Eye },
    { href: "/archive", label: "Archive", icon: Archive },
    { href: "/descent", label: "Journey", icon: TrendingDown },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    ...(user?.role === 'admin' ? [{ href: "/manage", label: "Manage", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Sticky Metadata Corners - Hidden on very small screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60">
        <span className="block">SYS.STATUS: ONLINE</span>
        <span className="block truncate max-w-[120px] sm:max-w-none">LOC: {location.toUpperCase()}</span>
      </div>
      <div className="hidden sm:block fixed top-4 right-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60 text-right">
        <span className="block">PETER YUILL</span>
        <span className="block">2018—2025</span>
      </div>
      <div className="hidden md:block fixed bottom-4 left-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference opacity-60">
        <span className="block">CRUCIBLE YEAR</span>
        <span className="block">BANGKOK</span>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs text-primary">
          NEON CRUCIBLE
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
          <nav className="flex flex-col p-6 space-y-6">
            {/* STUDIO GROUP - Always visible */}
            <div className="nav-group">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                STUDIO
              </p>
              <div className="space-y-3">
                {studioItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-4 py-1",
                          isActive ? "text-primary font-medium" : "text-foreground hover:text-secondary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* SYSTEM GROUP - Collapsible on mobile */}
            <div className="nav-group">
              <button
                onClick={() => setSystemExpanded(!systemExpanded)}
                className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted mb-3"
              >
                <span>SYSTEM</span>
                <span>{systemExpanded ? '−' : '+'}</span>
              </button>
              <div className={`space-y-3 ${systemExpanded ? 'block' : 'hidden'}`}>
                {systemItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-4 py-1",
                          isActive ? "text-primary font-medium" : "text-foreground hover:text-secondary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
          <div className="absolute bottom-8 left-6 font-mono text-[10px] text-muted-foreground">
            <p>OPERATIONAL ARCHIVE</p>
            <p>WITNESS SYSTEM V.1.0</p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar Navigation - Desktop Only */}
        <nav className="hidden md:flex flex-col w-56 lg:w-64 border-r border-border bg-sidebar p-4 lg:p-6 pt-24 fixed h-full z-40">
          <div className="space-y-6 lg:space-y-8">
            {/* STUDIO GROUP */}
            <div className="nav-group">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                STUDIO
              </p>
              <div className="space-y-4">
                {studioItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "group flex items-center gap-3 lg:gap-4 cursor-pointer transition-all duration-300",
                          isActive ? "text-primary translate-x-2" : "text-muted-foreground hover:text-secondary hover:translate-x-1"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 shrink-0", isActive && "animate-pulse")} />
                        <span className="text-sm truncate">{item.label}</span>
                        {isActive && <span className="ml-auto text-xs animate-blink hidden lg:inline">_</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* SYSTEM GROUP - Always expanded on desktop */}
            <div className="nav-group">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                SYSTEM
              </p>
              <div className="space-y-4">
                {systemItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "group flex items-center gap-3 lg:gap-4 cursor-pointer transition-all duration-300",
                          isActive ? "text-primary translate-x-2" : "text-muted-foreground hover:text-secondary hover:translate-x-1"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 shrink-0", isActive && "animate-pulse")} />
                        <span className="text-sm truncate">{item.label}</span>
                        {isActive && <span className="ml-auto text-xs animate-blink hidden lg:inline">_</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 space-y-6">
            {/* Search Button */}
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
                <p>WITNESS SYSTEM V.1.0</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-56 lg:ml-64 px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-24 pb-32 md:pb-8 min-h-screen relative" style={{paddingBottom: 'max(8rem, env(safe-area-inset-bottom, 0px) + 8rem)'}}>
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
