import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CrucibleWorks() {
  const { data, isLoading, error } = trpc.gallery.getAll.useQuery();

  let rawData = "No data (undefined)";
  try {
    if (data !== undefined && data !== null) {
      rawData = JSON.stringify(data, null, 2);
      if (rawData.length > 2000) rawData = rawData.slice(0, 2000) + "...";
    }
  } catch (e) {
    rawData = "Failed to stringify: " + String(e);
  }

  const errorMsg = error ? String(error.message || error) : null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/crucible" className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-[#00FFCC]">
          &larr; THE CRUCIBLE
        </Link>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter leading-tight mb-6">The Archive</h1>

      <div className="mb-8 border border-red-500/30 rounded-sm p-4 bg-red-950/20">
        <h3 className="font-mono text-xs text-red-400 uppercase mb-2">Debug Info</h3>
        <p className="font-mono text-xs text-yellow-400">isLoading: {isLoading ? "YES" : "NO"}</p>
        <p className="font-mono text-xs text-yellow-400">hasError: {error ? "YES" : "NO"}</p>
        <p className="font-mono text-xs text-yellow-400">data type: {typeof data}</p>
        <p className="font-mono text-xs text-yellow-400">data isArray: {Array.isArray(data) ? "YES" : "NO"}</p>
        {errorMsg && <p className="font-mono text-xs text-red-400 mt-2">Error: {errorMsg}</p>}
        {!error && (
          <>
            <p className="font-mono text-xs text-green-400 mt-2">Raw data:</p>
            <pre className="font-mono text-[10px] text-muted-foreground overflow-x-auto mt-1 whitespace-pre-wrap break-all">
              {rawData}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
