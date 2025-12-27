import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Image, Layers, FileText, HelpCircle, Archive, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: works } = trpc.works.list.useQuery({ limit: 100 });
  const { data: phases } = trpc.phases.list.useQuery();
  const { data: essays } = trpc.essays.list.useQuery();
  const { data: metaquestions } = trpc.metaquestions.list.useQuery();
  const { data: archiveFiles } = trpc.archiveFiles.list.useQuery();

  const stats = [
    { 
      label: "Works", 
      value: works?.total ?? 0, 
      icon: Image, 
      href: "/admin/works",
      color: "text-blue-400"
    },
    { 
      label: "Phases", 
      value: phases?.length ?? 0, 
      icon: Layers, 
      href: "/admin/phases",
      color: "text-purple-400"
    },
    { 
      label: "Essays", 
      value: essays?.length ?? 0, 
      icon: FileText, 
      href: "/admin/essays",
      color: "text-green-400"
    },
    { 
      label: "Metaquestions", 
      value: metaquestions?.length ?? 0, 
      icon: HelpCircle, 
      href: "/admin/metaquestions",
      color: "text-yellow-400"
    },
    { 
      label: "Archive Files", 
      value: archiveFiles?.length ?? 0, 
      icon: Archive, 
      href: "/admin/archive",
      color: "text-red-400"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            NEON CRUCIBLE ADMIN // CONTENT MANAGEMENT
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="rounded-none border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="font-mono text-3xl font-bold">{stat.value}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-xs text-muted-foreground">{stat.label.toUpperCase()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-none border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription className="font-mono text-xs">
                COMMON ADMIN TASKS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/works?action=new">
                <Button variant="outline" className="w-full justify-start rounded-none font-mono text-xs gap-2">
                  <Image className="w-4 h-4" />
                  ADD NEW WORK
                </Button>
              </Link>
              <Link href="/admin/essays?action=new">
                <Button variant="outline" className="w-full justify-start rounded-none font-mono text-xs gap-2">
                  <FileText className="w-4 h-4" />
                  WRITE NEW ESSAY
                </Button>
              </Link>
              <Link href="/admin/archive?action=new">
                <Button variant="outline" className="w-full justify-start rounded-none font-mono text-xs gap-2">
                  <Archive className="w-4 h-4" />
                  UPLOAD ARCHIVE FILE
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border">
            <CardHeader>
              <CardTitle className="text-lg">External Systems</CardTitle>
              <CardDescription className="font-mono text-xs">
                CONNECTED SERVICES
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href="https://neonsigns.manus.space" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full justify-start rounded-none font-mono text-xs gap-2">
                  <ExternalLink className="w-4 h-4" />
                  NEON SIGNS DASHBOARD
                </Button>
              </a>
              <p className="text-xs text-muted-foreground font-mono pl-6">
                Weekly roundups, pattern archaeology, accountability protocols
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card className="rounded-none border-border">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription className="font-mono text-xs">
              OPERATIONAL METRICS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 font-mono text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">DATABASE</p>
                <p className="text-green-400">● CONNECTED</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">FILE STORAGE</p>
                <p className="text-green-400">● ACTIVE</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">AUTH</p>
                <p className="text-green-400">● AUTHENTICATED</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
