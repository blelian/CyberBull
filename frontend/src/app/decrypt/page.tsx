"use client";
import React, { useState } from "react";

export default function DecryptPage() {
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [tag, setTag] = useState("");
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
      const res = await fetch(`${api}/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, iv, ciphertext, tag }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      const json = await res.json();
      setResult(json.data ?? JSON.stringify(json));
    } catch (err: any) {
      setError(err.message || "Decryption failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold h-underline">Decrypt</h1>
      <p className="text-sm text-white/80">Provide key + iv/ciphertext/tag (from Encrypt) to decrypt.</p>

      <form onSubmit={handleSubmit} className="panel p-4 rounded-lg flex flex-col gap-4">
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key" className="p-2 rounded w-full" required />
        <input value={iv} onChange={(e) => setIv(e.target.value)} placeholder="IV (base64)" className="p-2 rounded w-full" />
        <input value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} placeholder="Ciphertext (base64)" className="p-2 rounded w-full" />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag (base64)" className="p-2 rounded w-full" />

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary px-4 py-2 rounded" disabled={loading}>
            {loading ? "Decrypting..." : "Decrypt"}
          </button>
          <button type="button" onClick={() => { setKey(""); setIv(""); setCiphertext(""); setTag(""); setResult(null); setError(null); }} className="btn-ghost px-3 py-2 rounded">
            Reset
          </button>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        {result && (
          <div className="mt-2 bg-black/30 p-3 rounded">
            <div className="text-xs text-white/70 mb-2">Plaintext:</div>
            <pre className="text-sm whitespace-pre-wrap break-words">{result}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
