"use client";
import React, { useState } from "react";

export default function SnifferPage() {
  const [iface, setIface] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [packets, setPackets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_PY_BACKEND || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPackets([]);
    setLoading(true);
    try {
      const res = await fetch(`${api}/sniff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interface: iface, packet_count: count }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      const json = await res.json();
      setPackets(json.packets || []);
    } catch (err: any) {
      setError(err.message || "Sniff failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold h-underline">Packet Sniffer</h1>
      <p className="text-sm text-white/80">Capture packets from server-side interface (server must permit raw socket access)</p>

      <form onSubmit={handleSubmit} className="panel p-4 rounded-lg flex flex-col gap-4">
        <input value={iface} onChange={(e) => setIface(e.target.value)} placeholder="Interface (e.g. eth0)" className="p-2 rounded w-full" required />
        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={1000} className="p-2 rounded w-full" />

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary px-4 py-2 rounded" disabled={loading}>
            {loading ? "Sniffing..." : "Sniff"}
          </button>
          <button type="button" onClick={() => { setIface(""); setCount(10); setPackets([]); setError(null); }} className="btn-ghost px-3 py-2 rounded">
            Reset
          </button>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        {packets.length > 0 && (
          <div className="mt-2 bg-black/30 p-3 rounded">
            <div className="text-xs text-white/70 mb-2">Captured Packets:</div>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(packets, null, 2)}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
