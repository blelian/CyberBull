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

  const api = process.env.NEXT_PUBLIC_CPP_BACKEND;
  if (!api) console.error("NEXT_PUBLIC_CPP_BACKEND not set!");

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const paste = e.clipboardData.getData("text");
    const lines = paste.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      setIv(lines[0]);
      setCiphertext(lines[1]);
      setTag(lines[2]);
      e.preventDefault();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    if (!api) {
      setError("Backend API URL not configured.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: key.trim(),
          iv: iv.trim(),
          ciphertext: ciphertext.trim(),
          tag: tag.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const json = await res.json();
      setResult(json.data ?? "");
    } catch (err: any) {
      console.error("Decrypt error:", err);
      setError(err.message || "Decryption failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-cyan-300">Decrypt</h1>
      <p className="text-white/70">
        Paste 3-line encrypted output or enter key + IV / Ciphertext / Tag manually
      </p>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl flex flex-col gap-5">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key / Passphrase"
          required
        />
        <textarea
          value={iv}
          onChange={(e) => setIv(e.target.value)}
          onPaste={handlePaste}
          rows={1}
          placeholder="IV (base64)"
        />
        <textarea
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          rows={2}
          placeholder="Ciphertext (base64)"
        />
        <textarea
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          rows={1}
          placeholder="Tag (base64)"
        />

        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Decrypting..." : "Decrypt"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setKey("");
              setIv("");
              setCiphertext("");
              setTag("");
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
