import Link from "next/link";
import {
  FaMosque,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaBookOpen,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#041b15] text-white">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.06]" />

      {/* Glow Decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

      {/* Top Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400" />

      <div className="relative z-10 mx-auto w-[92vw] max-w-7xl py-14 sm:py-16 lg:py-20">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_0.9fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
                <FaMosque />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                  Pesantren
                </p>
                <h3 className="text-2xl font-black text-white">
                  Al Furqon
                </h3>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-emerald-100">
              Pesantren modern yang membentuk generasi islami berakhlak mulia,
              berilmu, disiplin, dan mandiri.
            </p>

            <div className="mt-6 flex gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ppalfurqonpusat.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-emerald-950"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/628999155698"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-emerald-950"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/alfurqoncimulang"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-emerald-950"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
            

          {/* Menu */}
          <div>
            <h3 className="mb-5 text-lg font-black text-white">Menu</h3>

            <ul className="space-y-3 text-sm font-semibold text-emerald-100">
              {[
                { label: "Home", href: "/" },
                { label: "Program", href: "/program" },
                { label: "Pendidikan", href: "/pendidikan" },
                { label: "Fasilitas", href: "/fasilitas" },
                { label: "Pendaftaran", href: "/pendaftaran" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 transition hover:text-yellow-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 opacity-0 transition group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="mb-5 text-lg font-black text-white">Layanan</h3>

            <ul className="space-y-3 text-sm font-semibold text-emerald-100">
              {[
                "Pendaftaran Santri",
                "Informasi Program",
                "Pembayaran",
                "Akademik",
                "Pengumuman",
              ].map((item) => (
                <li key={item}>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-black text-white">Kontak</h3>

            <ul className="space-y-4 text-sm text-emerald-100">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-emerald-950">
                  <FaMapMarkerAlt />
                </div>
                <span className="leading-relaxed">Tangerang, Banten</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-emerald-950">
                  <FaPhone />
                </div>
                <span className="leading-relaxed">08999155698</span>
                <span className="leading-relaxed">085810255160</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-emerald-950">
                  <FaEnvelope />
                </div>
                <span className="break-all leading-relaxed">
                  mtsalfurqon976@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}