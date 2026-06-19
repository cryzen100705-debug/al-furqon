"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [open]);

  const isHomeActive = pathname === "/" || pathname === "/home";

  const isActive = (path) => {
    if (path === "/") return isHomeActive;
    return pathname?.startsWith(path);
  };

  const lightNavbar = scrolled || open;

  const navClass = `
  fixed left-0 top-0 z-[650] w-full transition-all duration-500 ease-out
  py-0
`;

  const shellClass = `
    mx-auto flex max-w-6xl items-center justify-between
    border px-4 transition-all duration-500 ease-out
    rounded-b-3xl md:rounded-full md:px-6
    ${
      lightNavbar
        ? "border-emerald-900/10 bg-white/90 py-2 shadow-[0_18px_60px_rgba(4,27,21,0.14)] backdrop-blur-2xl"
        : "border-white/10 bg-emerald-950/82 py-2.5 shadow-[0_18px_70px_rgba(4,27,21,0.24)] backdrop-blur-2xl"
    }
  `;

  const brandMainColor = lightNavbar ? "text-emerald-950" : "text-white";
  const desktopTextColor = lightNavbar ? "text-emerald-950" : "text-white";

  const linkClass = (path) => `
    group relative px-1 py-2 text-[15px] font-extrabold tracking-[-0.025em]
    transition duration-300
    ${
      isActive(path)
        ? "text-yellow-400"
        : `${desktopTextColor} hover:text-yellow-400`
    }

    after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-full
    after:origin-left after:rounded-full after:bg-yellow-400
    after:transition-transform after:duration-300
    ${isActive(path) ? "after:scale-x-100" : "after:scale-x-0"}
    hover:after:scale-x-100
  `;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Program", path: "/program" },
    { name: "Pendidikan", path: "/pendidikan" },
    { name: "Fasilitas", path: "/fasilitas" },
  ];

  return (
    <>
      <nav
  className={`home-navbar-real ${navClass} ${jakarta.className}`}
  style={{ paddingTop: "max(env(safe-area-inset-top), 6px)" }}
>
        <div className="px-0 md:px-6">
          <div className={shellClass}>
            <Link href="/" className="group flex min-w-0 items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-yellow-400/25 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />

                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 ${
                    lightNavbar
                      ? "border-emerald-900/10 bg-white shadow-md"
                      : "border-white/15 bg-white/10"
                  }`}
                >
                  <img
                    src="/Logo.png"
                    alt="Logo Al Furqon"
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                    draggable={false}
                  />
                </div>
              </div>

              <div className="min-w-0 leading-tight">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400 sm:text-[11px]">
                  Pesantren
                </p>

                <h1
                  className={`${cinzel.className} truncate text-[1.12rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[1.35rem] md:text-[1.55rem] ${brandMainColor}`}
                >
                  Al Furqon
                </h1>
              </div>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={linkClass(item.path)}
                >
                  {item.name}
                </Link>
              ))}

              <Link href="/pendaftaran">
                <span className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-7 py-3 text-[15px] font-extrabold tracking-[-0.025em] text-black shadow-[0_12px_35px_rgba(250,204,21,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_16px_45px_rgba(250,204,21,0.38)]">
                  Daftar
                </span>
              </Link>

              <Link href="/login">
                <span
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-[15px] font-extrabold tracking-[-0.025em] transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 hover:text-emerald-950 ${
                    lightNavbar
                      ? "border-yellow-500 text-yellow-600"
                      : "border-yellow-400 text-yellow-400"
                  }`}
                >
                  Login
                </span>
              </Link>
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-xl font-black shadow-sm transition sm:h-11 sm:w-11 sm:text-2xl md:hidden ${
                lightNavbar
                  ? "border-emerald-900/10 bg-white text-emerald-950"
                  : "border-white/15 bg-white/10 text-white"
              }`}
              aria-label="Toggle menu"
              type="button"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[620] bg-black/45 backdrop-blur-[3px] md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {open && (
        <div
          className={`fixed left-0 z-[700] w-full px-4 md:hidden ${jakarta.className}`}
          style={{
  top: "calc(var(--home-navbar-height, var(--home-nav-h, 76px)) + 12px)",
}}
        >
          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(4,27,21,0.28)] backdrop-blur-2xl">
            <div className="flex flex-col font-bold text-emerald-950">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center justify-between border-b border-emerald-50 px-6 py-4
                    text-[15px] font-extrabold tracking-[-0.025em] transition
                    ${
                      isActive(item.path)
                        ? "bg-emerald-50 text-yellow-600"
                        : "hover:bg-emerald-50"
                    }
                  `}
                >
                  <span>{item.name}</span>
                  <span className="text-sm text-emerald-400">→</span>
                </Link>
              ))}

              <div className="space-y-3 p-4">
                <Link href="/pendaftaran" onClick={() => setOpen(false)}>
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 text-center text-[15px] font-extrabold tracking-[-0.025em] text-black shadow-md transition hover:scale-[1.02]">
                    Daftar Sekarang
                  </div>
                </Link>

                <Link href="/login" onClick={() => setOpen(false)}>
                  <div className="rounded-2xl border border-yellow-500 py-3 text-center text-[15px] font-extrabold tracking-[-0.025em] text-yellow-600 transition hover:bg-yellow-500 hover:text-emerald-950">
                    Login
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}