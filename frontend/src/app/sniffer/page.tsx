"use client";
import React, { useState } from "react";

export default function SnifferPage() {
  const [iface, setIface] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [packets, setPackets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPackets([]);
    setLoading(true);

    try {
      const res = await fetch(`/api/proxy/py/sniff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interface: iface, packet_count: count }),
      });

      if (!res.ok) throw new Error(await res.text() || `${res.status}`);
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
      <h1 className="text-3xl font-bold text-cyan-300">Packet Sniffer</h1>
      <p className="text-white/70">Capture packets from server-side interface (server must permit raw socket access)</p>

      <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-xl flex flex-col gap-5">
        <input value={iface} onChange={(e) => setIface(e.target.value)} placeholder="Interface (e.g. eth0)" required />
        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={1000} />

        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Sniffing..." : "Sniff"}</button>
          <button type="button" className="btn-ghost" onClick={() => { setIface(""); setCount(10); setPackets([]); setError(null); }}>Reset</button>
        </div>

        {error && <div className="text-red-400 font-medium">{error}</div>}
        {packets.length > 0 && <div className="bg-black/20 p-4 rounded-lg break-words"><pre className="text-sm">{JSON.stringify(packets, null, 2)}</pre></div>}
      </form>
    </section>
  );
}
