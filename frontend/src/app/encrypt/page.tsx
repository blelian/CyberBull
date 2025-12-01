"use client";
import React, { useState } from "react";

export default function EncryptPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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
      if (!res.ok) throw new Error(await res.text() || `${res.status}`);
      const json = await res.json();
      // Display as compact 3-line string for usability
      setResult(`${json.iv}\n${json.ciphertext}\n${json.tag}`);
    } catch (err: any) {
      setError(err.message || "Encryption failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-cyan-300">Encrypt</h1>
      <p className="text-white/70">Encrypt plaintext using the C++ backend (AES-GCM)</p>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl flex flex-col gap-5">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key / Passphrase"
          required
        />
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={6}
          placeholder="Plaintext to encrypt"
          required
        />

        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Encrypting..." : "Encrypt"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setKey("");
              setData("");
              setResult(null);
              setError(null);
            }}
          >
            Reset
          </button>
        </div>

        {error && <div className="text-red-400 font-medium">{error}</div>}

        {result && (
          <textarea
            readOnly
            value={result}
            className="w-full h-24 bg-transparent text-sm text-white p-2 rounded resize-none"
            onFocus={(e) => e.target.select()}
          />
        )}
      </form>
    </section>
  );
}
