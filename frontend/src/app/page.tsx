"use client";

import NetworkNodes from "@/components/NetworkNodes";
import SpiralDragon from "@/components/SpiralDragon";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-container container-responsive flex flex-col items-center justify-start pt-10 relative">
      {/* Spiral Background */}
      <SpiralDragon className="absolute inset-0 -z-10" />

      <h1 className="text-4xl font-bold text-cyan-300 mb-4 text-center">
        CyberBull — Secure. Fast. Intelligent.
      </h1>
      <p className="text-white/70 mb-8 text-center max-w-lg">
        Welcome to CyberBull. Protect your digital world with our advanced tools.
      </p>

      {/* Network Nodes Animation */}
      <NetworkNodes />

      {/* Call-to-action buttons */}
      <div className="flex gap-4 mt-6">
        <Link href="/get-started">
          <button className="btn-primary">Get Started</button>
        </Link>
        <Link href="/learn-more">
          <button className="btn-ghost">Learn More</button>
        </Link>
      </div>
    </div>
  );
}
