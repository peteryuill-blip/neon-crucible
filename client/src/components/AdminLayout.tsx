import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Image, 
  Layers, 
  FileText, 
  HelpCircle, 
  Archive, 
  LogOut,
  ChevronLeft,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/works", icon: Image, label: "Works" },
  { href: "/admin/phases", icon: Layers, label: "Phases" },
  { href: "/admin/essays", icon: FileText, label: "Essays" },
  { href: "/admin/metaquestions", icon: HelpCircle, label: "Metaquestions" },
  { href: "/admin/archive", icon: Archive, label: "Archive Files" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link href="/">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="font-mono text-xs">BACK TO SITE</span>
            </a>
          </Link>
          <h1 className="mt-4 text-xl font-bold tracking-tight">ADMIN PANEL</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            NEON CRUCIBLE
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-3 py-2 rounded-none text-sm font-mono transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* User Info & Logout */}
        <div className="p-4 space-y-4">
          {user && (
            <div className="space-y-1">
              <p className="font-mono text-xs text-muted-foreground">LOGGED IN AS</p>
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              <p className="font-mono text-xs text-primary">{user.role?.toUpperCase()}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-none font-mono text-xs gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-3 h-3" />
            LOGOUT
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
