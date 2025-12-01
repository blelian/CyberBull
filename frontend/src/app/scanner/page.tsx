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
      if (!res.ok) throw new Error(await res.text() || `${res.status}`);
      const json = await res.json();
      setResult(json.result);
    } catch (err: any) {
      setError(err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-cyan-300">Port Scanner</h1>
      <p className="text-white/70">Lightweight port scan via Python FastAPI backend</p>

      <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-xl flex flex-col gap-5">
        <input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Host or IP (example.com)" required />
        <input value={portsInput} onChange={(e) => setPortsInput(e.target.value)} placeholder="Ports (comma separated, optional)" />

        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => { setHost(""); setPortsInput(""); setResult(null); setError(null); }}>
            Reset
          </button>
        </div>

        {error && <div className="text-red-400 font-medium">{error}</div>}
        {result && (
          <div className="bg-black/20 p-4 rounded-lg break-words">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
