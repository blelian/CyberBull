"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="container-responsive py-6 relative z-20 flex justify-between items-center">
      <Logo />

      {/* Desktop links */}
      {isDesktop ? (
        <div className="flex gap-6 items-center">
          <Link href="/encrypt" className="nav-link">Encrypt</Link>
          <Link href="/decrypt" className="nav-link">Decrypt</Link>
          <Link href="/scanner" className="nav-link">Scanner</Link>
          <Link href="/sniffer" className="nav-link">Sniffer</Link>
        </div>
      ) : (
        <div>
          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="p-2 rounded bg-transparent border border-white/20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {open && (
            <div className="mt-3 panel p-3 rounded-lg flex flex-col gap-2">
              <Link href="/encrypt" className="mobile-nav-link">Encrypt</Link>
              <Link href="/decrypt" className="mobile-nav-link">Decrypt</Link>
              <Link href="/scanner" className="mobile-nav-link">Scanner</Link>
              <Link href="/sniffer" className="mobile-nav-link">Sniffer</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
