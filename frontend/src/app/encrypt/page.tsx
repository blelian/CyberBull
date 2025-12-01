"use client";
import React, { useState } from "react";

export default function EncryptPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_CPP_BACKEND || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${api}/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Encryption failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold h-underline">Encrypt</h1>
      <p className="text-sm text-white/80">Encrypt plaintext using the C++ backend (AES-GCM).</p>

      <form onSubmit={handleSubmit} className="panel p-4 rounded-lg flex flex-col gap-4">
        <label className="flex flex-col text-sm">
          <span className="mb-2">Key</span>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter passphrase"
            className="p-2 rounded w-full"
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2">Plaintext</span>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={6}
            placeholder="Type text to encrypt"
            className="p-2 rounded w-full"
            required
          />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary px-4 py-2 rounded" disabled={loading}>
            {loading ? "Encrypting..." : "Encrypt"}
          </button>
          <button type="button" onClick={() => { setKey(""); setData(""); setResult(null); setError(null); }} className="btn-ghost px-3 py-2 rounded">
            Reset
          </button>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        {result && (
          <div className="mt-2 bg-black/30 p-3 rounded">
            <div className="text-xs text-white/70 mb-2">Result (iv / ciphertext / tag):</div>
            <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
