import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Lock, Calendar, TrendingUp, Activity, Eye, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();

  // If user is logged in, show the integrated dashboard
  if (user) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">WEEKLY PROTOCOL</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              ACCOUNTABILITY INFRASTRUCTURE // CRUCIBLE YEAR
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none font-mono text-xs gap-2"
              onClick={() => setIsEmbedded(!isEmbedded)}
            >
              {isEmbedded ? <Minimize2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isEmbedded ? "HIDE EMBED" : "SHOW EMBED"}
            </Button>
            <a href="https://neonsigns.manus.space" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="rounded-none font-mono text-xs gap-2">
                <ExternalLink className="w-4 h-4" />
                OPEN FULL DASHBOARD
              </Button>
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-none border-border">
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-xs">CURRENT WEEK</CardDescription>
              <CardTitle className="text-3xl font-mono text-primary">W52</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono">CRUCIBLE YEAR 2025</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-border">
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-xs">STREAK</CardDescription>
              <CardTitle className="text-3xl font-mono text-green-400">42</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono">CONSECUTIVE WEEKS</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-border">
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-xs">STUDIO HOURS</CardDescription>
              <CardTitle className="text-3xl font-mono">28</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono">THIS WEEK</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-border">
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-xs">ENERGY LEVEL</CardDescription>
              <CardTitle className="text-3xl font-mono text-yellow-400">7/10</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono">CURRENT STATE</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="rounded-none bg-muted/10 border border-border">
            <TabsTrigger value="overview" className="rounded-none font-mono text-xs">OVERVIEW</TabsTrigger>
            <TabsTrigger value="roundups" className="rounded-none font-mono text-xs">ROUNDUPS</TabsTrigger>
            <TabsTrigger value="patterns" className="rounded-none font-mono text-xs">PATTERNS</TabsTrigger>
            <TabsTrigger value="neon" className="rounded-none font-mono text-xs">NEON'S MIRROR</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-none border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-mono text-sm">Week 51 Roundup</span>
                    <span className="text-xs text-muted-foreground">Dec 21</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-mono text-sm">Week 50 Roundup</span>
                    <span className="text-xs text-muted-foreground">Dec 14</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-mono text-sm">Week 49 Roundup</span>
                    <span className="text-xs text-muted-foreground">Dec 7</span>
                  </div>
                  <a 
                    href="https://neonsigns.manus.space" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-primary font-mono text-xs pt-2 hover:underline"
                  >
                    VIEW ALL ROUNDUPS →
                  </a>
                </CardContent>
              </Card>

              <Card className="rounded-none border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Studio Hours</span>
                      <span className="font-mono">26.5/week</span>
                    </div>
                    <div className="h-2 bg-muted/20 rounded-none">
                      <div className="h-full bg-primary w-[75%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Energy</span>
                      <span className="font-mono">6.8/10</span>
                    </div>
                    <div className="h-2 bg-muted/20 rounded-none">
                      <div className="h-full bg-yellow-400 w-[68%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-mono">94%</span>
                    </div>
                    <div className="h-2 bg-muted/20 rounded-none">
                      <div className="h-full bg-green-400 w-[94%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Embedded Dashboard */}
            {isEmbedded && (
              <Card className="rounded-none border-border overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">NEON SIGNS DASHBOARD</CardTitle>
                    <CardDescription className="font-mono text-xs">EMBEDDED VIEW</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="https://neonsigns.manus.space"
                    className={`w-full border-0 ${isFullscreen ? "h-[80vh]" : "h-[500px]"}`}
                    title="Neon Signs Dashboard"
                    allow="clipboard-write"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="roundups">
            <Card className="rounded-none border-border">
              <CardHeader>
                <CardTitle>Weekly Roundups</CardTitle>
                <CardDescription className="font-mono text-xs">
                  ACCESS FULL ROUNDUP HISTORY ON THE NEON SIGNS DASHBOARD
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <Activity className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground text-center max-w-md">
                  Weekly roundups contain sensitive practice data and are managed through the secure Neon Signs dashboard.
                </p>
                <a href="https://neonsigns.manus.space" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-none font-mono gap-2">
                    <ExternalLink className="w-4 h-4" />
                    ACCESS ROUNDUPS
                  </Button>
                </a>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="rounded-none border-border">
              <CardHeader>
                <CardTitle>Pattern Archaeology</CardTitle>
                <CardDescription className="font-mono text-xs">
                  LONG-TERM TREND ANALYSIS AND PATTERN RECOGNITION
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <TrendingUp className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground text-center max-w-md">
                  Pattern archaeology reveals the hidden rhythms in your practice over months and years.
                </p>
                <a href="https://neonsigns.manus.space" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-none font-mono gap-2">
                    <ExternalLink className="w-4 h-4" />
                    EXPLORE PATTERNS
                  </Button>
                </a>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="neon">
            <Card className="rounded-none border-border">
              <CardHeader>
                <CardTitle>Neon's Mirror</CardTitle>
                <CardDescription className="font-mono text-xs">
                  AI-POWERED REFLECTIONS ON YOUR PRACTICE
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <Eye className="w-12 h-12 text-primary" />
                <p className="text-muted-foreground text-center max-w-md font-serif italic">
                  "I watch this arc unfold. I see the patterns that the artist cannot see from inside the work."
                </p>
                <a href="https://neonsigns.manus.space" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-none font-mono gap-2">
                    <ExternalLink className="w-4 h-4" />
                    ENTER THE MIRROR
                  </Button>
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Public view for non-authenticated users
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center border border-primary/20 animate-pulse">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold tracking-tighter">RESTRICTED ACCESS</h1>
        <p className="text-muted-foreground font-serif text-lg">
          The Weekly Protocol dashboard is a secure environment for the artist and authorized witnesses.
        </p>
      </div>

      <div className="p-8 border border-border bg-card max-w-lg w-full space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient"></div>
        
        <div className="space-y-2 text-left">
          <h3 className="font-mono text-sm text-primary">SYSTEM STATUS: ACTIVE</h3>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <p>LAST ROUNDUP: 2025-12-21</p>
            <p>NEXT DUE: 2025-12-28</p>
            <p>CURRENT STREAK: 42 WEEKS</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full font-mono rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.href = "https://neonsigns.manus.space/"}
          >
            ENTER SECURE DASHBOARD <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="w-full font-mono rounded-none"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_OAUTH_PORTAL_URL}?app_id=${import.meta.env.VITE_APP_ID}`;
            }}
          >
            LOGIN TO VIEW MORE
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground font-mono">
          AUTHORIZED WITNESSES ONLY
        </p>
      </div>
    </div>
  );
}
