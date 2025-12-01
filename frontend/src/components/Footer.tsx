export default function Footer() {
  return (
    <footer className="mt-20 pb-10 text-white">
      <div className="container-responsive bg-black/40 panel rounded-xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/10 shadow-lg">
        <div className="text-lg">
          <strong>CyberBull</strong> — Secure. Fast. Intelligent.<br/>
          © {new Date().getFullYear()} CyberBull Technologies
        </div>
        <div className="flex gap-6 text-base">
          <a href="#" className="footer-link">Docs</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}
