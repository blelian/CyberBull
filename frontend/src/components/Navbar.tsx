"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="container-responsive py-4 relative z-20">
      <nav className="flex items-center justify-between">
        <Logo />
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="p-2 rounded bg-transparent border border-white/6"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={`hidden md:flex gap-4 items-center`}>
          <Link href="/encrypt" className="px-3 py-2 rounded btn-ghost">Encrypt</Link>
          <Link href="/decrypt" className="px-3 py-2 rounded btn-ghost">Decrypt</Link>
          <Link href="/scanner" className="px-3 py-2 rounded btn-ghost">Scanner</Link>
          <Link href="/sniffer" className="px-3 py-2 rounded btn-ghost">Sniffer</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mt-3 md:hidden panel p-3 rounded-lg">
          <div className="flex flex-col">
            <Link href="/encrypt" className="py-2">Encrypt</Link>
            <Link href="/decrypt" className="py-2">Decrypt</Link>
            <Link href="/scanner" className="py-2">Scanner</Link>
            <Link href="/sniffer" className="py-2">Sniffer</Link>
          </div>
        </div>
      )}
    </header>
  );
}
