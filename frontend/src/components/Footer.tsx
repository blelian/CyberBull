import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 pb-8 container-responsive">
      <div className="panel p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <strong>CyberBull</strong> — built with passion. © {new Date().getFullYear()}
        </div>
        <div className="flex gap-4 items-center">
          <a href="#" className="text-sm btn-ghost px-3 py-1 rounded">Docs</a>
          <a href="#" className="text-sm btn-ghost px-3 py-1 rounded">Privacy</a>
          <a href="#" className="text-sm btn-ghost px-3 py-1 rounded">Contact</a>
        </div>
      </div>
    </footer>
  );
}
