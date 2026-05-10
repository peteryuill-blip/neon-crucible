import { useState, useEffect } from "react";
import { Link } from "wouter";
import type { Work } from "@/types";

interface Props {
  works: Work[];
  bucketUrl: string;
}

function selectSize(rating: number): string {
  if (rating >= 5) return "lg";
  if (rating >= 3) return "md";
  return "sm";
}

export function CrucibleMasonryGallery({ works, bucketUrl }: Props) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 768) setColumns(1);
      else if (w < 1024) setColumns(2);
      else if (w < 1440) setColumns(3);
      else setColumns(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const columnArrays: Work[][] = Array.from({ length: columns }, () => []);
  works.forEach((work, i) => {
    columnArrays[i % columns].push(work);
  });

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {columnArrays.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {col.map((work) => {
            const size = selectSize(work.rating || 0);
            const imgUrl = `${bucketUrl}/${work.sovereignId}_${work.tCode}_${size}.webp`;
            return (
              <Link key={work.id} href={`/work/${work.slug}`}>
                <article className="group relative overflow-hidden rounded-lg bg-neutral-900 cursor-pointer">
                  <img
                    src={imgUrl}
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${bucketUrl}/placeholder.webp`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm truncate">{work.title}</h3>
                      <p className="text-neutral-400 text-xs mt-1">{work.sovereignId} • {work.tCode}</p>
                      {work.rating ? (
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-xs ${i < work.rating ? "text-cyan-400" : "text-neutral-700"}`}>★</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
