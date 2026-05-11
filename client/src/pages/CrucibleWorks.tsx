import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { CrucibleMasonryGallery } from "@/components/CrucibleMasonryGallery";

export default function CrucibleWorks() {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  const errorMsg = error ? String(error.message || error) : null;
  const works = (data as any)?.items || [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </Link>
      </div>
      <div className="space-y-6 mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight">The Archive</h1>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          Ordered by rating, then by T-code descending. Higher-rated works command larger positions.
        </p>
        <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFCC] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFCC]"></span>
          </span>
          <span>LIVE</span>
          <span className="text-muted-foreground/50">|</span>
          <span>{works.length} works</span>
        </div>
      </div>

      {isLoading && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Loading archive...</div>
      )}

      {errorMsg && (
        <div className="font-mono text-xs tracking-widest text-red-400 uppercase">Error: {errorMsg}</div>
      )}

      {!isLoading && !error && works.length === 0 && (
        <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">No works found.</div>
      )}

      {!isLoading && !error && works.length > 0 && (
        <CrucibleMasonryGallery 
          works={works} 
          bucketUrl="https://ee59ee5cb7da30e22c2451223113cff8.r2.cloudflarestorage.com/Crucible" 
        />
      )}
    </div>
  );
}