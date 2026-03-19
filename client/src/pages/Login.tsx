/**
 * Login.tsx — Admin login page (portable local auth)
 *
 * Replaces the Manus OAuth redirect. Submits password to POST /api/auth/login.
 * On success, redirects to /manage.
 */

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/manage";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed. Check your password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h1 className="font-mono text-xl font-bold tracking-widest text-foreground">
            ADMIN ACCESS
          </h1>
          <p className="text-xs font-mono text-muted-foreground tracking-wider">
            NEON CRUCIBLE // RESTRICTED
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-xs tracking-widest text-muted-foreground">
              PASSWORD
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              autoComplete="current-password"
              className="font-mono bg-muted/20 border-border focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-xs font-mono text-destructive border border-destructive/30 bg-destructive/5 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full font-mono tracking-widest rounded-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              "ENTER"
            )}
          </Button>
        </form>

        {/* Back link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            ← RETURN TO SITE
          </a>
        </div>
      </div>
    </div>
  );
}
