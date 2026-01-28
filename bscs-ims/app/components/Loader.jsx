
//first commit Loader js
"use client";

import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    let running = true;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const brandColor =
      document.querySelector('meta[name="theme-color"]')?.content || "#b49cff";

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
