"use client";
import React, { useState } from "react";

export default function ScannerPage() {
  const [host, setHost] = useState("");
  const [portsInput, setPortsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_PY_BACKEND || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const ports = portsInput.split(",").map(s => parseInt(s.trim())).filter(Boolean);
      const res = await fetch(`${api}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, ports: ports.length ? ports : undefined }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      const json = await res.json();
      setResult(json.result || json);
    } catch (err: any) {
      setError(err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold h-underline">Port Scanner</h1>
      <p className="text-sm text-white/80">Lightweight port scan via Python FastAPI backend</p>

      <form onSubmit={handleSubmit} className="panel p-4 rounded-lg flex flex-col gap-4">
        <input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Host or IP (e.g. example.com)" className="p-2 rounded w-full" required />
        <input value={portsInput} onChange={(e) => setPortsInput(e.target.value)} placeholder="Ports (comma separated) — optional" className="p-2 rounded w-full" />

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary px-4 py-2 rounded" disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
          <button type="button" onClick={() => { setHost(""); setPortsInput(""); setResult(null); setError(null); }} className="btn-ghost px-3 py-2 rounded">
            Reset
          </button>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        {result && (
          <div className="mt-2 bg-black/30 p-3 rounded">
            <div className="text-xs text-white/70 mb-2">Open Ports:</div>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
