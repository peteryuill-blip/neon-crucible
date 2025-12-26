import { Button } from "@/components/ui/button";
import { ExternalLink, Lock } from "lucide-react";

export default function Dashboard() {
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

        <Button 
          size="lg" 
          className="w-full font-mono rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => window.location.href = "https://neonsigns.manus.space/"}
        >
          ENTER SECURE DASHBOARD <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
        
        <p className="text-xs text-muted-foreground font-mono">
          REDIRECTING TO NEONSIGNS.MANUS.SPACE
        </p>
      </div>
    </div>
  );
}
