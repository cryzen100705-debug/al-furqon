"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const current = window.scrollY;

      setScrolled(current > heroHeight - 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // STYLE
  const navClass = `
fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
${
  scrolled
    ? "bg-white/50 backdrop-blur-xl shadow-md py-3  border-white/20"
    : "bg-white md:bg-transparent py-4"
}
`;

  const textColor = scrolled
    ? "text-green-900"
    : "text-green-400 md:text-white";
  const linkClass = (path) =>
    `relative px-1 ${
      pathname === path ? "text-yellow-400" : ""
    } hover:text-yellow-400 transition
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-yellow-400
     after:scale-x-0 after:origin-left after:transition-transform
     hover:after:scale-x-100
     ${pathname === path ? "after:scale-x-100" : ""}
    `;

  return (
    <>
      {/* NAVBAR */}
      <nav className={navClass}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {/* LOGO */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />

            {/* TEXT */}
            <div className={`leading-tight ${textColor}`}>
              <p className="text-xs md:text-sm font-medium tracking-wide">
                Pesantren
              </p>
              <h1 className="text-lg md:text-xl font-extrabold">Al Furqon</h1>
            </div>
          </div>

          {/* DESKTOP */}
          <div
            className={`hidden md:flex items-center gap-6 font-medium ${textColor}`}
          >
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/program" className={linkClass("/program")}>
              Program
            </Link>
            <Link href="/pendidikan" className={linkClass("/pendidikan")}>
              Pendidikan
            </Link>
            <Link href="/fasilitas" className={linkClass("/fasilitas")}>
              Fasilitas
            </Link>

            <Link href="/pendaftaran">
              <span className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full shadow hover:scale-105 transition">
                Daftar
              </span>
            </Link>
            <Link href="/login">
              <span className="px-4 py-2 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-green-500 transition">
                Login
              </span>
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-green-700 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden fixed top-[70px] left-0 w-full z-40">
          <div className="mx-4 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
            <div className="flex flex-col text-green-800 font-medium">
              {[
                { name: "Home", path: "/" },
                { name: "Program", path: "/program" },
                { name: "Pendidikan", path: "/pendidikan" },
                { name: "Fasilitas", path: "/fasilitas" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`
              px-6 py-4 flex justify-between items-center
              border-b last:border-none
              hover:bg-green-50 transition
              ${pathname === item.path ? "bg-green-50 font-semibold" : ""}
            `}
                >
                  <span>{item.name}</span>
                  <span className="text-sm text-gray-400">→</span>
                </Link>
              ))}

              {/* CTA */}
              <div className="p-4 space-y-3">
                <Link href="/pendaftaran">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-center py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition">
                    Daftar Sekarang
                  </div>
                </Link>

                <Link href="/login">
                  <div className="border border-yellow-500 text-yellow-500 text-center py-3 rounded-xl font-semibold hover:bg-yellow-500 hover:text-green-900 transition mt-5">
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
