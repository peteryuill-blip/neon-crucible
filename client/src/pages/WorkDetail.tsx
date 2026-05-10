import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Work } from "@/types";

const R2_BUCKET = import.meta.env.VITE_R2_BUCKET_URL || "https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible";

async function fetchWork(slug: string): Promise<Work> {
  const res = await fetch(`/api/works/${slug}`);
  if (!res.ok) throw new Error("FETCH_FAILURE");
  return res.json();
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: work, isLoading, error } = useQuery({
    queryKey: ["work", slug],
    queryFn: () => fetchWork(slug),
    enabled: !!slug,
  });

  let oracle: Record<string, any> = {};
  try {
    oracle = JSON.parse(work?.technicalObservation ?? "{}");
  } catch { oracle = {}; }

  const steps = oracle?.ambient_context?.steps ?? "—";
  const heartRate = oracle?.ambient_context?.heart_rate ?? "—";
  const energy = oracle?.ambient_context?.energy ?? "—";
  const week = work?.weekNumber ?? oracle?.week_number ?? "—";
  const imgUrl = work ? `${R2_BUCKET}/${work.sovereignId}_${work.tCode}_lg.webp` : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">WORK_NOT_FOUND</h2>
          <Link href="/" className="text-cyan-400 hover:underline text-sm">← Return to Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">← Back to Archive</Link>
        <span className="text-xs font-mono text-neutral-600">{work.sovereignId}</span>
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative rounded-lg overflow-hidden bg-neutral-900">
          <img src={imgUrl} alt={work.title} className="w-full h-auto object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = `${R2_BUCKET}/placeholder.webp`; }} />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{work.title}</h1>
            <p className="text-neutral-500 mt-2 font-mono text-sm">{work.tCode}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Medium</span>
              <span className="text-neutral-200">{work.medium || "—"}</span>
            </div>
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Dimensions</span>
              <span className="text-neutral-200">{work.dimensions || "—"}</span>
            </div>
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Phase</span>
              <span className="text-neutral-200">{work.phaseId}</span>
            </div>
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Week</span>
              <span className="text-neutral-200">{week}</span>
            </div>
          </div>
          <div className="bg-neutral-900/50 rounded-lg p-6 border border-cyan-900/30">
            <h2 className="text-cyan-400 text-xs uppercase tracking-widest mb-4 font-semibold">Oracle Telemetry</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center"><div className="text-2xl font-bold text-white">{steps}</div><div className="text-xs text-neutral-500 mt-1 uppercase">Steps</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white">{heartRate}</div><div className="text-xs text-neutral-500 mt-1 uppercase">Heart Rate</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white">{energy}</div><div className="text-xs text-neutral-500 mt-1 uppercase">Energy</div></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              work.disposition === "SA" ? "bg-green-900/30 text-green-400 border border-green-800" :
              work.disposition === "TR" ? "bg-red-900/30 text-red-400 border border-red-800" :
              "bg-neutral-800 text-neutral-400 border border-neutral-700"
            }`}>{work.disposition === "SA" ? "SAVED" : work.disposition === "TR" ? "TRASH" : "UNKNOWN"}</span>
            {work.rating ? (
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < work.rating! ? "text-cyan-400" : "text-neutral-700"}`}>★</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
