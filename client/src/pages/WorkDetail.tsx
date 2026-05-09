import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "../components/ui/skeleton";

export default function WorkDetail() {
  const { slug } = useParams();
  const { data: work, isLoading, error } = useQuery<any>({ 
    queryKey: [`/api/works/${slug}`] 
  });

  if (isLoading) return <div className="p-24 bg-background min-h-screen"><Skeleton className="h-[60vh] w-full opacity-5" /></div>;
  if (error || !work) return <div className="p-24 font-mono text-red-500 bg-background min-h-screen">ERROR_NOT_FOUND</div>;

  const oracle = work.technicalObservation ? JSON.parse(work.technicalObservation) : null;

  return (
    <main className="min-h-screen bg-background text-white">
      <nav className="p-8 flex justify-between items-center border-b border-white/5">
        <Link href="/crucible" className="font-mono text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
          ← Return_To_Archive
        </Link>
        <div className="font-mono text-[10px] tracking-widest text-[#00FFCC]">
          {work.tCode} // {work.sovereignId}
        </div>
      </nav>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 lg:p-16 max-w-[1600px] mx-auto">
        <div className="lg:col-span-8 flex items-center justify-center bg-[#050505] border border-white/5 p-4">
          <img 
            src={`https://pub-d8e49212a92f42b9b23e248fb91591da.r2.dev/Crucible/${work.sovereignId}_${work.tCode}_lg.webp`}
            alt={work.title}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-2xl"
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-10">
          <header className="space-y-4 text-left">
            <h1 className="font-serif text-5xl tracking-tight text-white/95">{work.title}</h1>
            <div className="h-[1px] w-12 bg-[#00FFCC]/40" />
            <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
              {work.medium} <br />
              {work.dimensions} <br />
              {work.surfaceName}
            </p>
          </header>
          <div className="p-8 border border-white/5 bg-white/[0.01] font-mono text-[10px] tracking-wider leading-relaxed text-left">
            <h3 className="text-[#00FFCC] mb-6 tracking-[0.4em] uppercase opacity-80">Telemetry_Data</h3>
            <div className="space-y-5 opacity-70">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>TOTAL_STEPS</span><span className="text-white">{oracle?.ambient_context?.steps?.toLocaleString() || "NULL"}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>AMBIENT_ENERGY</span><span className="text-white">{oracle?.ambient_context?.energy}/10</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>WK_PROD_COUNT</span><span className="text-white">{oracle?.weekly_stats?.count} UNITS</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>WEEK_REF</span><span className="text-white">WEEK_{work.weekNumber}</span></div>
            </div>
          </div>
          <div className="mt-auto opacity-10 font-mono text-[8px] tracking-[0.5em] uppercase text-left">// Access_Restricted: [Rating_Lock] [Labor_Lock] [Disposition_Lock]</div>
        </div>
      </section>
    </main>
  );
}
