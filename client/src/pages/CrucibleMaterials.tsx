import CrucibleLayout from "@/components/CrucibleLayout";

const surfaces = [
  { id: "S1", name: "First Test Sheet", count: 1 },
  { id: "S2", name: "Hongxing Fine Mulberry", count: 16 },
  { id: "S3", name: "Tan Xi Special Pure", count: 32 },
  { id: "S4", name: "Tanpi Sandalwood Bark", count: 48 },
  { id: "S5", name: "Water-Damaged Lot", count: 8 },
  { id: "S6", name: "Red Star Dan Xuan", count: 40 },
  { id: "S7", name: "Jing Xian Processed", count: 12 },
  { id: "S8", name: "Heavy Pulp Fiber", count: 21 },
  { id: "S9", name: "Multi-Session Stage", count: 15 },
  { id: "S10", name: "Red Star Ink Field", count: 15 },
  { id: "S11", name: "Red Star Moxin Leather", count: 14 },
  { id: "S12", name: "Red Star Mo Yun Bark", count: 14 }
];

export default function CrucibleMaterials() {
  return (
    <CrucibleLayout>
      <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
        <h2 className="text-5xl font-light text-zinc-100 tracking-tighter">Substrate <span className="text-cyan-400">Intelligence</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {surfaces.map(s => (
            <div key={s.id} className="p-8 border border-zinc-900 bg-zinc-950/30 space-y-4 hover:border-cyan-500/50 transition-all duration-500 group">
              <div className="flex justify-between items-baseline">
                <span className="text-cyan-500 text-xl">{s.id}</span>
                <span className="text-zinc-700 text-[9px] tracking-widest">{s.count} ENTRIES</span>
              </div>
              <p className="text-zinc-100 group-hover:text-cyan-400 transition-colors">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </CrucibleLayout>
  );
}
