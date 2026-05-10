import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CrucibleMasonryGallery } from "@/components/CrucibleMasonryGallery";
import type { Work } from "@/types";
const R2_BUCKET = import.meta.env.VITE_R2_BUCKET_URL || "https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible";
interface ApiResponse { data: Work[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }; }
async function fetchWorks(page = 1, limit = 100): Promise<ApiResponse> {
  const res = await fetch(`/api/works?page=${page}&limit=${limit}&sort=rating&order=desc`);
  if (!res.ok) throw new Error("FETCH_FAILURE");
  return res.json();
}
export default function Crucible() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({ queryKey: ["works", page], queryFn: () => fetchWorks(page, 100) });
  const allWorks = data?.data || [];
  const pagination = data?.pagination;
  const validWorks = allWorks.filter((work: Work) => {
    if (work.disposition === "TR") return false;
    try { const oracle = JSON.parse(work.technicalObservation ?? "{}"); if (oracle?.matrix_flags?.is_kill && work.disposition !== "SA") return false; } catch { }
    return (work.rating || 0) >= 2 || work.disposition === "SA";
  });
  if (isLoading) return <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4" /><p className="text-sm tracking-widest uppercase text-neutral-500">Loading Archive...</p></div></div>;
  if (error) return <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-red-500 mb-2">FETCH_FAILURE</h2><p className="text-neutral-400">The Oracle connection is severed.</p></div></div>;
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-8"><h1 className="text-3xl font-bold tracking-tighter">NEON CRUCIBLE</h1><p className="text-neutral-500 text-sm mt-1">{validWorks.length} curated of {pagination?.total || 0} total works{pagination && pagination.totalPages > 1 && ` • Page ${page} of ${pagination.totalPages}`}</p></header>
      <main className="p-4 md:p-8">
        <CrucibleMasonryGallery works={validWorks} bucketUrl={R2_BUCKET} />
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-neutral-800">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.hasPrev} className="px-4 py-2 border border-neutral-700 rounded text-sm disabled:opacity-30 hover:border-cyan-500/50 transition-colors">← Previous</button>
            <span className="px-4 py-2 text-sm text-neutral-500 font-mono">{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNext} className="px-4 py-2 border border-neutral-700 rounded text-sm disabled:opacity-30 hover:border-cyan-500/50 transition-colors">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
