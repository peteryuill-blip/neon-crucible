import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold tracking-tighter text-cyan-500 mb-4">404</h1>
      <p className="text-neutral-400 mb-8 text-sm tracking-widest uppercase">Signal Lost — This sector does not exist</p>
      <Link href="/" className="px-6 py-3 border border-cyan-500/30 text-cyan-400 text-sm uppercase tracking-wider hover:bg-cyan-500/10 transition-colors rounded">
        ← Return to Archive
      </Link>
    </div>
  );
}
