import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative w-[40px] h-[40px]">
        <Image src="/CyberBull.png" alt="CyberBull" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="leading-none">
        <span className="block text-sm font-semibold tracking-wider" style={{ color: "white" }}>CYBER</span>
        <span className="block text-xs font-extrabold -mt-1" style={{ background: "linear-gradient(90deg,#d100ff,#00eaff)", WebkitBackgroundClip: "text", color: "transparent" }}>BULL</span>
      </div>
    </Link>
  );
}
