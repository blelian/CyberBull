"use client";
import React, { useState } from "react";

const PRESETS = {
  "Web Server": "80,443",
  "SSH Server": "22",
  "Database": "1433,3306,5432",
  "Windows Server": "445,3389",
  "Custom": ""
} as const;

const PRESET_HINTS: Record<keyof typeof PRESETS, string> = {
  "Web Server": "Example hosts: scanme.nmap.org, google.com, bing.com",
  "SSH Server": "Example hosts: localhost, your server IP",
  "Database": "Database servers are usually private. Scan localhost or your server IP.",
  "Windows Server": "Scan localhost or LAN machine IP",
  "Custom": "Enter any host you like"
};

export default function ScannerPage() {
  const [host, setHost] = useState("");
  const [portsInput, setPortsInput] = useState("");
  const [preset, setPreset] = useState<keyof typeof PRESETS>("Custom");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [portHint, setPortHint] = useState<string>("");

  const api = process.env.NEXT_PUBLIC_PY_BACKEND || "";

  function handlePresetChange(value: keyof typeof PRESETS) {
    setPreset(value);
    if (value !== "Custom") {
      setPortsInput(PRESETS[value]);
      setPortHint(`Scanning common ${value.toLowerCase()} ports: ${PRESETS[value]}`);
    } else {
      setPortsInput("");
      setPortHint("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const cleanHost = host.trim();
      if (!cleanHost) throw new Error("Host is required.");

      // Warn users if scanning private networks from Docker
      if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(cleanHost)) {
        throw new Error(
          "Private network hosts cannot be scanned from this environment. Use a publicly reachable host."
        );
      }

      const ports = portsInput
        .split(",")
        .map((x) => parseInt(x.trim()))
        .filter((n) => !isNaN(n));

      if (ports.length === 0) throw new Error("Enter at least one valid port.");

      const res = await fetch(`${api}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: cleanHost, ports })
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();

      if (json.result && Array.isArray(json.result.open_ports)) {
        const openPorts = json.result.open_ports;
        if (openPorts.length > 0) {
          setResult(openPorts);
        } else {
          setResult(null);
          setError("No open ports detected. Make sure the host is reachable and ports are correct.");
        }
      } else {
        throw new Error("Unexpected backend response format.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-300">Port Scanner</h1>
      <p className="text-white/70">Lightweight port scan via Python FastAPI backend</p>

      <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-xl flex flex-col gap-5">

        {/* HOST INPUT */}
        <label className="text-white/80 text-sm">Target IP or Domain</label>
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Enter target host"
          className="p-2 rounded bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        {preset && host && (
          <div className="text-white/50 text-xs bg-black/20 p-2 rounded">{PRESET_HINTS[preset]}</div>
        )}

        {/* PORT PRESETS */}
        <label className="text-white/80 text-sm">Port Presets</label>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value as keyof typeof PRESETS)}
          className="bg-black/40 p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {Object.keys(PRESETS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* CUSTOM PORTS */}
        <label className="text-white/80 text-sm">
          Ports to Scan
          <span className="block text-white/40 text-xs">
            Enter comma-separated list — e.g., 22, 80, 443
          </span>
        </label>
        <input
          value={portsInput}
          onChange={(e) => {
            setPortsInput(e.target.value);
            setPreset("Custom");
            setPortHint("");
          }}
          className="p-2 rounded bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="22, 80, 443"
        />

        {/* PORT HINT */}
        {portHint && (
          <div className="text-white/50 text-xs bg-black/20 p-2 rounded">{portHint}</div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setHost("");
              setPortsInput("");
              setPreset("Custom");
              setResult(null);
              setError(null);
              setPortHint("");
            }}
          >
            Reset
          </button>
        </div>

        {/* ERROR / RESULTS */}
        {error && <div className="text-red-400">{error}</div>}

        {result && (
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-white/70">Open Ports: {result.join(", ")}</p>
          </div>
        )}

      </form>
    </section>
  );
}
