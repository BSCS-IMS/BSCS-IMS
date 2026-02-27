"use client";

import { useEffect } from "react";

// General page loader
export default function Loader() {
  useEffect(() => {
    let running = true;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const brandColor =
      document.querySelector('meta[name="theme-color"]')?.content || "#1F384C";

    // OVERLAY
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: prefersDark
        ? "rgba(10,10,20,0.4)"
        : "rgba(255,255,255,0.4)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      zIndex: "9999",
      transition: "opacity 0.5s ease",
    });
    document.documentElement.appendChild(overlay);

    // CONTAINER
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "relative",
      width: "88px",
      height: "88px",
      pointerEvents: "none",
      willChange: "transform, opacity",
    });
    overlay.appendChild(container);

    // WHEAT GRAINS
    const grainCount = 12;
    const radius = 34;
    const grains = [];
    for (let i = 0; i < grainCount; i++) {
      const grain = document.createElement("div");
      Object.assign(grain.style, {
        position: "absolute",
        width: "8px",
        height: "14px",
        borderRadius: "50%",
        background: brandColor,
        opacity: "0.85",
      });
      container.appendChild(grain);
      grains.push(grain);
    }

    // NOTICE
    const notice = document.createElement("div");
    Object.assign(notice.style, {
      position: "absolute",
      bottom: "12%",
      padding: "10px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontFamily: "system-ui, sans-serif",
      background: prefersDark ? "#1a1a2e" : "#ffffff",
      color: prefersDark ? "#eee" : "#333",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      opacity: "0",
      transition: "opacity 0.4s ease",
    });
    notice.textContent = "Still loading… try refreshing the page.";
    overlay.appendChild(notice);

    setTimeout(() => {
      if (running) notice.style.opacity = "1";
    }, 8000);

    // ANIMATION LOOP
    let angle = 0;
    let pulse = 0;

    function animate() {
      if (!running) return;

      angle += 0.6;
      pulse += 0.04;

      container.style.opacity = 0.65 + Math.sin(pulse) * 0.2;

      grains.forEach((grain, i) => {
        const t = (360 / grainCount) * i + angle;
        const r = (t * Math.PI) / 180;
        const x = Math.cos(r) * radius;
        const y = Math.sin(r) * radius;
        grain.style.transform = `translate(${44 + x}px, ${44 + y}px) rotate(${t}deg)`;
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      running = false;
      overlay.remove();
    };
  }, []);

  return null;
}

// Login-specific loader - named export
export function LoginLoader() {
  useEffect(() => {
    // Prevent scroll when loader is active
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning wheat animation */}
        <div className="relative w-16 h-16">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-3 bg-[#1F384C] rounded-full opacity-80"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 45}deg) translateY(-24px)`,
                animation: `spin 1s linear infinite`,
                animationDelay: `${i * 0.125}s`,
              }}
            />
          ))}
        </div>
        
        {/* Loading text */}
        <p className="text-[#1F384C] font-medium text-sm">Signing you in...</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}