import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Archive, Eye, Grid, Home, User, Quote, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "THRESHOLD", icon: Home },
    { href: "/neon", label: "NEON", icon: Eye },
    { href: "/works", label: "WORKS", icon: Grid },
    { href: "/dashboard", label: "DASHBOARD", icon: Activity },
    { href: "/archive", label: "ARCHIVE", icon: Archive },
    { href: "/voices", label: "VOICES", icon: Quote },
    { href: "/about", label: "ABOUT", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Sticky Metadata Corners - Hidden on very small screens */}
      <div className="hidden sm:block fixed top-4 left-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference">
        <span className="block">SYS.STATUS: ONLINE</span>
        <span className="block truncate max-w-[120px] sm:max-w-none">LOC: {location.toUpperCase()}</span>
      </div>
      <div className="hidden sm:block fixed top-4 right-4 z-50 font-mono text-[10px] sm:text-xs text-muted-foreground pointer-events-none mix-blend-difference text-right">
        <span className="block">PETER YUILL</span>
        <span className="block">2018—2025</span>
      </div>
      <div className="hidden md:block fixed bottom-4 left-4 z-50 font-mono text-xs text-muted-foreground pointer-events-none mix-blend-difference">
        <span className="block">CRUCIBLE YEAR</span>
        <span className="block">BANGKOK</span>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs text-primary">
          NEON CRUCIBLE
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/98 pt-16">
          <nav className="flex flex-col p-6 space-y-6">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-4 py-2",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-mono text-lg tracking-widest">{item.label}</span>
                  </div>
                </Link>
              );
            })}
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
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 lg:gap-4 cursor-pointer transition-all duration-300",
                      isActive ? "text-primary translate-x-2" : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", isActive && "animate-pulse")} />
                    <span className="font-mono text-xs lg:text-sm tracking-widest truncate">{item.label}</span>
                    {isActive && <span className="ml-auto text-xs animate-blink hidden lg:inline">_</span>}
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

        {/* Main Content Area */}
        <main className="flex-1 md:ml-56 lg:ml-64 px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-24 pb-8 min-h-screen relative">
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
