"use client";

export default function NetworkNodes() {
  return (
    <div className="relative w-full h-[400px] bg-black/40 overflow-hidden rounded-2xl mb-10">
      {/* Floating nodes */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Circles floating */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-cyan-500/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "120px",
              height: "120px",
              borderRadius: "9999px",
              transform: "translate(-50%, -50%)",
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
