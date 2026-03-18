import Link from "next/link"
import Image from "next/image"

export default function RootPage() {
  return (
    <div
      className="h-screen overflow-hidden flex flex-col bg-white"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="shrink-0 flex items-center justify-between px-8 md:px-16 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image
            src="/LOGO_CLEAR.png"
            alt="Murang Bigas Logo"
            width={34}
            height={34}
            className="object-contain"
            priority
          />
          <span className="text-sm font-semibold text-[#1F384C] leading-tight">
            Murang Bigas{" "}
            <span className="hidden md:inline">
              <br />
            </span>
            Livelihood
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-[#1F384C] hover:opacity-60 transition-opacity"
        >
          Sign in →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8 md:px-16 overflow-hidden relative">
        {/* Corner accent — top right */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-72 h-72 rounded-full border border-gray-100" />
        <div className="pointer-events-none absolute -top-4 -right-4 w-52 h-52 rounded-full border border-gray-100" />

        {/* Corner accent — bottom left */}
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-56 h-56 rounded-full border border-gray-100" />

        {/* Dot grid accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1F384C 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-2xl w-full text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-[#1F384C]/15 text-[#1F384C]/60 text-xs font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F384C]/40 shrink-0" />
            Inventory Management System
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[3.75rem] font-bold text-[#1F384C] leading-[1.08] tracking-tight mb-5">
            Clarity for your
            <br />
            rice business.
          </h1>

          {/* Accent line */}
          <div className="w-8 h-[3px] bg-[#1F384C] mx-auto mb-6 rounded-full" />

          {/* Sub */}
          <p className="text-gray-400 text-base md:text-[1.0625rem] leading-relaxed mb-10 max-w-sm mx-auto">
            Track inventory, manage resellers, and oversee livelihood operations
            — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="tel:+1234567890"
              className="px-7 py-3 bg-[#1F384C] text-white text-sm font-medium rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Book a Call
            </a>
            <Link
              href="/login"
              className="px-7 py-3 border border-gray-200 text-[#1F384C] text-sm font-medium rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-gray-100 px-8 md:px-16 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-300">Murang Bigas Livelihood</p>
        <p className="text-xs text-gray-300">BSCS © 2027</p>
      </footer>
    </div>
  )
}
