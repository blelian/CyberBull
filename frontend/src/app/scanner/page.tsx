"use client";
import React, { useState } from "react";

export default function ScannerPage() {
  const [host, setHost] = useState("");
  const [portsInput, setPortsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_PY_BACKEND || "";

  const PRESETS: { [label: string]: string } = {
    "Web Server": "80,443",
    "SSH Server": "22",
    "Database": "3306,5432,27017,6379",
    "Windows Server": "3389,445",
    "Custom": "",
  };

  // Extract hostname from any URL or IP
  function normalizeHost(input: string): string {
    let clean = input.trim().replace(/^Host:\s*/i, "");
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        const url = new URL(clean);
        return url.hostname;
      }
    } catch {}
    clean = clean.replace(/https?:\/\//, "");
    clean = clean.split("/")[0].trim();
    return clean;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const cleanHost = normalizeHost(host);
      if (!cleanHost) throw new Error("Invalid host.");

      const ports = portsInput
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n) && n > 0 && n <= 65535);

      const res = await fetch(`${api}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: cleanHost,
          ports: ports.length ? ports : undefined,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setResult(json.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-cyan-300">Port Scanner</h1>
      <p className="text-white/70">Scan common ports easily using presets or custom ports</p>

      <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-xl flex flex-col gap-5">
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Host, IP or URL"
          required
        />

        <div className="flex gap-2 flex-wrap items-center">
          {Object.keys(PRESETS).map((label) => (
            <button
              key={label}
              type="button"
              className={`btn-ghost ${PRESETS[label] === portsInput ? "bg-cyan-500/20" : ""}`}
              onClick={() => setPortsInput(PRESETS[label])}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          value={portsInput}
          onChange={(e) => setPortsInput(e.target.value)}
          placeholder="Ports (comma separated, optional)"
        />

        <div className="flex gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setHost("");
              setPortsInput("");
              setResult(null);
              setError(null);
            }}
          >
            Reset
          </button>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        {result && (
          <div className="bg-black/20 p-4 rounded-lg">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
