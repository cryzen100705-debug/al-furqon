"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
// ✅ Penggantinya
import {
  FaMosque,
  FaKaaba,            // ← ganti FaKaaba (tidak ada di fa6)
  FaCampground,
  FaArrowRight,
  FaCircleCheck,
  FaStar,
  FaUsers,
  FaAward,
  FaBookOpen,
  FaChevronDown,
  FaPlay,
  FaShield,
  FaGraduationCap,
  FaHandshake,
  FaRotateRight,
  FaWrench,
  FaFilm,
  FaListUl,           // ← ganti FaListUl & FaListUl (tidak ada di fa6)
} from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const FALLBACK_IMAGE = "/smk.jpg";

/* =========================================================
   WHATSAPP ADMIN
   Ganti nomor di bawah dengan nomor admin pesantren.
   Format wajib: kode negara + nomor, tanpa 0, tanpa +, tanpa spasi.
   Contoh:
   0812-3456-7890 menjadi 6281234567890
========================================================= */

const ADMIN_WHATSAPP_NUMBER = "6283899601027";

const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai pesantren.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;


/* =========================================================
   HELPERS
========================================================= */

function getIcon(key) {
  const icons = {
    mosque: <FaMosque />,
    quran: <FaKaaba />,
    campground: <FaCampground />,
    users: <FaUsers />,
    book: <FaBookOpen />,
    award: <FaAward />,
    hands: <FaHandshake />,
    shield: <FaShield />,
    graduate: <FaGraduationCap />,
    star: <FaStar />,
  };

  return icons[key] || <FaStar />;
}

function SafeImage({ src, alt, className = "", fallback = FALLBACK_IMAGE }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={currentSrc}
      alt={alt || "image"}
      className={className}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}

/* =========================================================
   GLOBAL SCROLL PROGRESS
   - progress bar seperti timeline video di bagian atas
========================================================= */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[9999] h-1.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-300 shadow-[0_0_20px_rgba(250,204,21,0.45)]"
    />
  );
}

/* =========================================================
   WRAPPERS
========================================================= */

function Section({ children, dark = false, className = "", id = "" }) {
  return (
    <section
      id={id}
      className={`relative min-h-[100svh] w-full overflow-hidden ${
        dark ? "bg-[#071a15] text-white" : "bg-[#f6f1e4] text-slate-900"
      } ${className}`}
    >
      {children}
    </section>
  );
}

function Container({ children, className = "", style }) {
  return (
    <motion.div
      style={style}
      className={`relative z-10 mx-auto w-[92vw] max-w-[1500px] py-20 sm:py-24 lg:py-28 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function IslamicBackground({ dark = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.055]" />

      <motion.div
        animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -left-24 top-16 h-64 w-64 rounded-full border ${
          dark
            ? "border-yellow-300/15 bg-yellow-300/5"
            : "border-emerald-900/10 bg-emerald-300/15"
        }`}
      />

      <motion.div
        animate={{ rotate: [0, -14, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-20 bottom-16 h-[26rem] w-[26rem] rounded-full border ${
          dark
            ? "border-emerald-300/15 bg-emerald-300/5"
            : "border-yellow-400/10 bg-yellow-300/15"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          dark ? "bg-emerald-400/10" : "bg-yellow-300/15"
        }`}
      />
    </div>
  );
}

function Badge({ children, light = false }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] sm:text-xs ${
        light
          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
          : "border-emerald-200 bg-white/85 text-emerald-800"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {children}
    </div>
  );
}

function SectionHeader({
  badge,
  title,
  desc,
  light = false,
  align = "center",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.65 }}
      className={`${
        align === "center" ? "mx-auto text-center" : "text-left"
      } max-w-5xl`}
    >
      {badge && (
        <div className="mb-4">
          <Badge light={light}>{badge}</Badge>
        </div>
      )}

      <h2
        className={`text-[clamp(2rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] ${
          light ? "text-white" : "text-emerald-950"
        }`}
      >
        {title}
      </h2>

      {desc && (
        <p
          className={`mt-4 max-w-3xl text-sm leading-relaxed sm:text-base lg:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-emerald-100" : "text-slate-600"}`}
        >
          {desc}
        </p>
      )}
    </motion.div>
  );
}

/* =========================================================
   REVEAL
   - animasi fade-in + slide antar panel
========================================================= */
function Reveal({ children, delay = 0, y = 30, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   STORYBOARD PANEL
   - panel utama dengan border tebal, nomor scene, label bawah
========================================================= */
function StoryPanel({
  scene = "01",
  title = "",
  subtitle = "",
  children,
  dark = false,
  footerLabel = "Story Panel",
  className = "",
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.8rem] border-[3px] ${
        dark
  ? "border-white/15 bg-emerald-950 text-white"
  : "border-[#173c32]/10 bg-white/90 text-slate-900"
      } shadow-[0_20px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl ${className}`}
    >
      {/* header storyboard */}
      <div
        className={`flex items-center justify-between border-b-[3px] px-4 py-3 sm:px-5 ${
          dark ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-950">
            Scene {scene}
          </div>

          {subtitle && (
            <p
              className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                dark ? "text-emerald-100/70" : "text-slate-500"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        <FaFilm className={dark ? "text-yellow-300" : "text-emerald-700"} />
      </div>

      {/* body */}
      <div className="relative p-4 sm:p-5 lg:p-6">
        {title && (
          <h3
            className={`mb-4 text-2xl font-black leading-tight sm:text-3xl ${
              dark ? "text-white" : "text-emerald-950"
            }`}
          >
            {title}
          </h3>
        )}

        {children}
      </div>

      {/* footer storyboard */}
      <div
        className={`border-t-[3px] px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] sm:px-5 ${
          dark ? "border-white/10 bg-black/20 text-yellow-300" : "border-slate-200 bg-slate-50 text-emerald-800"
        }`}
      >
        {footerLabel}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING CLAPPERBOARD
========================================================= */
function LoadingPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#071a15] text-white">
      <IslamicBackground dark />

      <div className="relative z-10 text-center">
        {/* Animasi clapperboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 text-4xl text-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.18)]"
        >
          <motion.div
            animate={{ rotate: [0, -12, 0, -12, 0] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            <FaListUl />
          </motion.div>
        </motion.div>

        <p className="text-sm font-black uppercase tracking-[0.34em] text-yellow-300">
          Loading Storyboard
        </p>

        <h1 className="mt-4 text-3xl font-black sm:text-5xl">
          Memuat Program...
        </h1>

        <div className="mx-auto mt-7 h-2 w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-full w-24 rounded-full bg-gradient-to-r from-yellow-300 to-emerald-300"
          />
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAINTENANCE PAGE
========================================================= */
function ProgramMaintenance({ onRetry, checking }) {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#071a15] text-white">
      <div className="absolute inset-0">
        <SafeImage
          src="/hero-santri.jpg"
          alt="Maintenance Program"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071a15] via-[#0b2f25]/95 to-[#071a15]" />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <IslamicBackground dark />

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-300/10"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[92vw] max-w-5xl flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 text-4xl text-yellow-300 shadow-[0_0_70px_rgba(250,204,21,0.22)] backdrop-blur-xl">
            <FaWrench />
          </div>

          <p className="mt-8 text-lg leading-loose text-yellow-300 sm:text-xl lg:text-2xl">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>

          <div className="mt-3">
            <Badge light>Program Maintenance</Badge>
          </div>

          <h1 className="mt-5 text-[clamp(2.4rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.065em]">
            Data program sedang
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
              tidak tersedia.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-xl">
            Backend Express.js belum berjalan atau endpoint{" "}
            <span className="font-black text-yellow-300">/api/program</span>{" "}
            belum dapat dihubungi.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            disabled={checking}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-4 font-black text-emerald-950 shadow-[0_0_50px_rgba(250,204,21,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:opacity-70"
          >
            <motion.span
              animate={checking ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                repeat: checking ? Infinity : 0,
                duration: 1,
                ease: "linear",
              }}
            >
              <FaRotateRight />
            </motion.span>
            {checking ? "Mengecek Backend..." : "Coba Lagi"}
          </button>

          <a
            href="http://localhost:5000/api/program"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
          >
            Cek API Program
          </a>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Program() {
  const [programPage, setProgramPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(false);

  const [activeProgram, setActiveProgram] = useState(0);
  const [currentGallery, setCurrentGallery] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const { scrollY } = useScroll();

  const sceneLinks = useMemo(
    () => [
      { number: "01", label: "Intro", href: "#hero" },
      { number: "02", label: "Stats", href: "#stats" },
      { number: "03", label: "Program", href: "#program-showcase" },
      { number: "04", label: "Detail", href: "#detail-program" },
      { number: "05", label: "Timeline", href: "#timeline-program" },
      { number: "06", label: "Galeri", href: "#galeri" },
      { number: "07", label: "FAQ", href: "#faq" },
      { number: "08", label: "Ending", href: "#closing-scene" },
    ],
    []
  );

  /* ==========================================
     HERO PARALLAX
     - efek kamera bergerak / zoom cinematic
  ========================================== */
  const heroImageScale = useTransform(scrollY, [0, 900], [1, 1.18]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 120]);
  const heroOverlayOpacity = useTransform(scrollY, [0, 900], [0.38, 0.82]);

  const fetchProgramData = async () => {
    try {
      setChecking(true);
      setMaintenance(false);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur");
      }

      const response = await fetch(`${API_URL}/api/program`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data program");
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data program tidak valid");
      }

      setProgramPage(result.data);
      setMaintenance(false);
      setActiveProgram(0);
      setCurrentGallery(0);
    } catch (error) {
      console.error("PROGRAM BACKEND ERROR:", error.message);
      setProgramPage(null);
      setMaintenance(true);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchProgramData();
  }, []);

  /* ==========================================
     AUTO GALLERY
     - pergantian scene otomatis seperti slideshow film
  ========================================== */
  useEffect(() => {
    if (!programPage?.gallery?.length) return;

    const interval = setInterval(() => {
      setCurrentGallery((prev) => (prev + 1) % programPage.gallery.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [programPage]);

  if (loading) return <LoadingPage />;
  if (maintenance || !programPage) {
    return <ProgramMaintenance onRetry={fetchProgramData} checking={checking} />;
  }

  const { hero, programs, stats, timeline, gallery, advantages, faq } =
    programPage;

  const active = programs[activeProgram] || programs[0];

  return (
    <main className="overflow-x-hidden bg-[#f6f1e4] text-slate-900">
      <ScrollProgress />
      <Navbar />

      {/* MINI STORYBOARD NAV */}
      <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div className="pointer-events-auto rounded-[1.8rem] border-[3px] border-white/10 bg-[#071a15]/80 p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.3em] text-yellow-300">
            Timeline
          </p>

          <div className="space-y-2">
            {sceneLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-[10px] font-black text-emerald-950">
                  {item.number}
                </div>
                <span className="text-xs font-bold text-white">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================
         HERO
      ====================================================== */}
      <Section id="hero" dark>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041b15] via-[#062d22]/95 to-[#0d4f38]/45" />
        <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
          <SafeImage
            src={hero.image}
            alt="Background Program Pesantren"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOverlayOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-[#071a15] via-[#0b2c23]/90 to-[#0e553f]/35"
        />
        <div className="absolute inset-0 bg-black/45" />

        <IslamicBackground dark />

        <Container className="flex min-h-[100svh] items-center">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              style={{ y: heroTextY }}
              initial={{ opacity: 0, y: 46 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              className="max-w-5xl"
            >
              <Badge light>{hero.badge}</Badge>

              <h1 className="mt-5 font-mono text-[clamp(2.4rem,6vw,6rem)] font-black leading-[0.93] tracking-[-0.06em]">
                {hero.title}
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
              </h1>

              <p className="mt-5 max-w-4xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:text-xl">
                {hero.desc}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#program-showcase">
                  <button className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 font-black text-emerald-950 shadow-2xl transition hover:-translate-y-1 hover:bg-yellow-300 sm:w-auto">
                    Jelajahi Scene Program
                    <FaArrowRight className="transition group-hover:translate-x-1" />
                  </button>
                </a>

                <a href="#galeri">
                  <button className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto">
                    <FaPlay />
                    Lihat Galeri
                  </button>
                </a>
              </div>

              <div className="mt-7 hidden border-l-4 border-yellow-400 pl-6 md:block">
                <p className="text-xl leading-loose text-yellow-300 lg:text-2xl">
                  {hero.arabic}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.35em] text-emerald-100">
                  {hero.source}
                </p>
              </div>
            </motion.div>

            {/* HERO STORYBOARD POSTER */}
            <Reveal delay={0.15} className="hidden lg:block">
              <StoryPanel
                dark
                scene="01"
                subtitle="Opening Shot"
                title="Program unggulan dalam satu frame."
                footerLabel="Establishing Shot"
                className="ml-auto max-w-xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGallery}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-[1.4rem]"
                  >
                    <SafeImage
                      src={gallery[currentGallery]}
                      alt="Galeri Program"
                      className="h-[56svh] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-300">
                        Frame Preview
                      </p>
                      <h3 className="mt-2 text-3xl font-black text-white">
                        Pembinaan hidup melalui kegiatan bermakna.
                      </h3>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </StoryPanel>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ======================================================
         STATS - STORYBOARD GRID
      ====================================================== */}
      <Section
        id="stats"
        className="bg-gradient-to-br from-[#f6f1e4] via-white to-emerald-50"
      >
        <IslamicBackground />

        <Container className="flex min-h-[100svh] flex-col justify-center">
          <SectionHeader
            badge="Storyboard Metrics"
            title="Program yang tumbuh bersama santri"
            desc="Panel statistik ini disusun seperti frame storyboard untuk menampilkan gambaran besar pembinaan."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <StoryPanel
                  scene={`0${index + 2}`}
                  subtitle="Metric Panel"
                  title=""
                  footerLabel={item.label}
                  className="h-full"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-2xl text-yellow-300">
                    {getIcon(item.iconKey)}
                  </div>

                  <h3 className="mt-5 text-[clamp(2.2rem,4vw,4rem)] font-black tracking-[-0.06em] text-emerald-950">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-base">
                    {item.label}
                  </p>
                </StoryPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================
         PROGRAM SHOWCASE
      ====================================================== */}
      <Section
        id="program-showcase"
        className="scroll-mt-24 bg-[#f6f1e4]"
      >
        <IslamicBackground />

        <Container className="flex min-h-[100svh] items-center">
          <div className="grid w-full items-start gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionHeader
                align="left"
                badge="Scene Selector"
                title="Pilih program dan lihat detail adegannya"
                desc="Layout dibuat seperti panel storyboard. Klik salah satu scene program untuk melihat sorotan utamanya."
              />

              {/* MOBILE GRID SELECTOR */}
              <div className="mt-5 grid grid-cols-2 gap-3 lg:hidden">
                {programs.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => setActiveProgram(index)}
                    className={`rounded-[1.4rem] border-[3px] p-3 text-left transition ${
                      activeProgram === index
                        ? "border-emerald-950 bg-emerald-950 text-white shadow-xl"
                        : "border-[#173c32]/10 bg-white text-emerald-950 shadow-md"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                        activeProgram === index
                          ? "bg-yellow-400 text-emerald-950"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {getIcon(item.iconKey)}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">
                      Scene {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-sm font-black leading-tight">
                      {item.title}
                    </p>
                  </button>
                ))}
              </div>

              {/* DESKTOP SELECTOR */}
              <div className="mt-6 hidden gap-3 lg:grid">
                {programs.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => setActiveProgram(index)}
                    className={`group rounded-[1.6rem] border-[3px] p-4 text-left transition ${
                      activeProgram === index
                        ? "border-yellow-300 bg-emerald-950 text-white shadow-2xl"
                        : "border-[#173c32]/10 bg-white text-emerald-950 shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition ${
                          activeProgram === index
                            ? "bg-yellow-400 text-emerald-950"
                            : "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-900 group-hover:text-yellow-300"
                        }`}
                      >
                        {getIcon(item.iconKey)}
                      </div>

                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                            activeProgram === index
                              ? "text-yellow-300"
                              : "text-emerald-700"
                          }`}
                        >
                          Scene {String(index + 1).padStart(2, "0")} •{" "}
                          {item.subtitle}
                        </p>

                        <h3 className="mt-1 text-xl font-black sm:text-2xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE PROGRAM STORY PANEL */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgram}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.98 }}
                transition={{ duration: 0.45 }}
              >
                <StoryPanel
                  dark
                  scene={String(activeProgram + 1).padStart(2, "0")}
                  subtitle={active.subtitle}
                  title={active.title}
                  footerLabel="Program Focus Scene"
                >
                  <div className="relative h-[260px] overflow-hidden rounded-[1.35rem] sm:h-[340px] lg:h-[48svh]">
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.7 }}
                      className="h-full w-full"
                    >
                      <SafeImage
                        src={active.image}
                        alt={active.title}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-300 sm:text-xs">
                        Program Unggulan
                      </p>

                      <h3 className="mt-1 text-[clamp(2rem,8vw,5rem)] font-black tracking-[-0.06em] text-white">
                        {active.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                    <div>
                      <p className="text-sm font-semibold leading-relaxed text-white sm:text-base">
  {active.longDesc}
</p>

                      <Link href="/pendaftaran">
                        <button className="mt-5 inline-flex items-center gap-3 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-yellow-300 sm:px-6 sm:text-base">
                          Daftar Sekarang
                          <FaArrowRight />
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {active.features.map((feature, idx) => (
                        <div
                          key={feature}
                          className="rounded-2xl border-[2px] border-white/10 bg-white/10 p-3 text-center backdrop-blur"
                        >
                          <FaCircleCheck className="mx-auto mb-2 text-yellow-300" />
                          <p className="text-[11px] font-bold text-white sm:text-sm">
                            {feature}
                          </p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-emerald-100/70">
                            Beat {idx + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </StoryPanel>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </Section>

      {/* ======================================================
         DETAIL PROGRAM GRID - seperti storyboard comic grid
      ====================================================== */}
      <Section id="detail-program" dark>
        <IslamicBackground dark />

        <Container className="flex min-h-[100svh] flex-col justify-center">
          <SectionHeader
            light
            badge="Storyboard Grid"
            title="Detail program dalam panel-panel adegan"
            desc="Bagian ini menggunakan format grid seperti komik / storyboard agar informasi terasa lebih visual."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {programs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <StoryPanel
                  dark
                  scene={String(index + 1).padStart(2, "0")}
                  subtitle={item.subtitle}
                  title=""
                  footerLabel={`Detail • ${item.title}`}
                  className="h-full"
                >
                  <div className="grid grid-cols-[105px_1fr] gap-3 lg:block">
                    <div className="relative h-full min-h-[150px] overflow-hidden rounded-[1.2rem] lg:h-[260px] xl:h-[320px]">
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-lg text-emerald-950 lg:h-12 lg:w-12">
                        {getIcon(item.iconKey)}
                      </div>
                    </div>

                    <div className="pt-1 lg:pt-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300">
                        {item.subtitle}
                      </p>

                      <h3 className="mt-1 text-2xl font-black text-white lg:text-3xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-emerald-100 sm:text-sm lg:text-base">
                        {item.desc}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {item.features.map((feature) => (
                          <div
                            key={feature}
                            className="rounded-xl border border-white/10 bg-white/10 px-2 py-2 text-center text-[10px] font-bold text-white sm:text-xs"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StoryPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================
         TIMELINE
      ====================================================== */}
      <Section
        id="timeline-program"
        className="bg-gradient-to-br from-[#f6f1e4] via-white to-emerald-50"
      >
        <IslamicBackground />

        <Container className="flex min-h-[100svh] flex-col justify-center">
          <SectionHeader
            badge="Timeline Story"
            title="Alur pembinaan seperti perjalanan cerita"
            desc="Timeline ini berfungsi seperti urutan scene dalam film, dari awal pembinaan hingga pembentukan karakter."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {timeline.map((item, index) => (
              <Reveal key={item.number} delay={index * 0.08}>
                <StoryPanel
                  scene={item.number}
                  subtitle="Timeline Beat"
                  title={item.title}
                  footerLabel={`Step ${item.number}`}
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-lg font-black text-yellow-300">
                      {item.number}
                    </div>

                    <div>
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </StoryPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================
         GALLERY
      ====================================================== */}
      <Section id="galeri" dark className="scroll-mt-24">
        <IslamicBackground dark />

        <Container className="flex min-h-[100svh] items-center">
          <div className="grid w-full items-start gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <SectionHeader
              light
              align="left"
              badge="Gallery Frames"
              title="Suasana pembinaan santri yang hidup"
              desc="Galeri ini disusun seperti kumpulan frame sinematik agar pengunjung merasa sedang melihat potongan adegan."
            />

            <div className="grid gap-4">
              <StoryPanel
                dark
                scene="06"
                subtitle="Gallery Scene"
                title=""
                footerLabel="Moving Frames"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGallery}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45 }}
                    className="relative overflow-hidden rounded-[1.4rem]"
                  >
                    <SafeImage
                      src={gallery[currentGallery]}
                      alt="Galeri Program"
                      className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[54svh]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                        Galeri Program
                      </p>
                      <h3 className="mt-2 text-3xl font-black text-white sm:text-5xl">
                        Kegiatan Santri
                      </h3>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGallery(index)}
                      className={`group overflow-hidden rounded-xl border-[2px] p-1 transition ${
                        currentGallery === index
                          ? "border-yellow-300 bg-yellow-300"
                          : "border-white/10 bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-14 w-full rounded-lg object-cover transition duration-500 group-hover:scale-105 sm:h-20"
                      />
                    </button>
                  ))}
                </div>
              </StoryPanel>
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================================================
         ADVANTAGES
      ====================================================== */}
      <Section className="bg-gradient-to-br from-[#f6f1e4] via-white to-emerald-50">
        <IslamicBackground />

        <Container className="flex min-h-[100svh] flex-col justify-center">
          <SectionHeader
            badge="Highlights"
            title="Mengapa program pembinaan ini penting?"
            desc="Program bukan hanya aktivitas tambahan, tetapi bagian dari proses pembentukan karakter santri."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {advantages.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <StoryPanel
                  scene={`A${index + 1}`}
                  subtitle="Key Highlight"
                  title={item.title}
                  footerLabel="Highlight Panel"
                  className="h-full"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-2xl text-yellow-300">
                    {getIcon(item.iconKey)}
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.desc}
                  </p>
                </StoryPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================
         FAQ
      ====================================================== */}
      <Section id="faq" dark>
        <IslamicBackground dark />

        <Container className="flex min-h-[100svh] items-center">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeader
              light
              align="left"
              badge="Frequently Asked Scenes"
              title="Informasi yang sering ditanyakan"
              desc="Bagian ini membantu calon santri dan orang tua memahami program pembinaan dengan lebih jelas."
            />

            <div className="space-y-3">
              {faq.map((item, index) => {
                const open = openFaq === index;

                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-[1.5rem] border-[3px] border-white/10 bg-white/10 backdrop-blur-xl"
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-center justify-between gap-5 border-b-[3px] border-white/10 px-5 py-5 text-left"
                    >
                      <div>
                        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300">
                          Scene Q{index + 1}
                        </p>
                        <h3 className="text-base font-black text-white sm:text-lg">
                          {item.q}
                        </h3>
                      </div>

                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 text-yellow-300"
                      >
                        <FaChevronDown />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 py-4">
                            <p className="text-sm leading-relaxed text-emerald-100 sm:text-base">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================================================
   CTA / ENDING
====================================================== */}
<Section
  id="closing-scene"
  dark
  className="bg-gradient-to-br from-[#f6f1e4] via-white to-emerald-50"
>
  <IslamicBackground dark />

  <Container className="flex min-h-[100svh] items-center justify-center text-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 45, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7 }}
      className="mx-auto w-full max-w-6xl"
    >
      <div className="rounded-[1.8rem] border-[3px] border-white/15 bg-emerald-950/95 text-white shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-white/10 bg-black/20 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-950">
              Scene 08
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/80">
              Final Scene
            </p>
          </div>

          <FaFilm className="text-yellow-300" />
        </div>

        {/* Body */}
        <div className="relative px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-emerald-300/10" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-[clamp(2rem,5vw,4.8rem)] font-black leading-[1.02] tracking-[-0.05em] text-white">
              Mulai perjalanan santri melalui program yang aktif dan bermakna.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:text-lg">
              Daftarkan calon santri sekarang dan ikuti proses pendidikan yang
              membangun ilmu, adab, keberanian, dan kemandirian.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/pendaftaran">
                <button className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-4 font-black text-emerald-950 shadow-[0_12px_35px_rgba(250,204,21,0.25)] transition hover:-translate-y-1 hover:bg-yellow-300 sm:w-auto">
                  Daftar Sekarang
                  <FaArrowRight />
                </button>
              </Link>

              <Link href="/pendidikan">
                <button className="w-full rounded-full border border-white/30 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 sm:w-auto">
                  Lihat Pendidikan
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-[3px] border-white/10 bg-black/20 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 sm:px-5">
          Closing Scene
        </div>
      </div>
    </motion.div>
  </Container>
</Section>

      <Footer />

      {/* ======================================================
         GLOBAL STYLE
         - font feel kreatif / film
         - smooth scroll
         - utility kecil untuk cinematic feel
      ====================================================== */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #f6f1e4;
        }

        ::selection {
          background: #facc15;
          color: #052e25;
        }

        .story-caption {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
        }
      `}</style>
    </main>
  );
}