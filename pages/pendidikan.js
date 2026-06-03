"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import { useEffect, useRef, useState } from "react";

import {
  FaGraduationCap,
  FaLaptopCode,
  FaQuran,
  FaCheckCircle,
  FaStar,
  FaBookOpen,
  FaMosque,
  FaArrowRight,
  FaShieldAlt,
  FaHeart,
  FaMoon,
  FaQuoteLeft,
  FaRedo,
  FaWrench,
  FaPlay,
  FaCompass,
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaRocket,
  FaHandSparkles,
} from "react-icons/fa";

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
   RESPONSIVE HELPER
========================================================= */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const update = () => setIsDesktop(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else {
      media.addListener(update);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else {
        media.removeListener(update);
      }
    };
  }, []);

  return isDesktop;
}

/* =========================================================
   ICON MAP
========================================================= */

function getIcon(key) {
  const icons = {
    graduate: <FaGraduationCap />,
    laptop: <FaLaptopCode />,
    quran: <FaQuran />,
    mosque: <FaMosque />,
    book: <FaBookOpen />,
    heart: <FaHeart />,
    shield: <FaShieldAlt />,
    star: <FaStar />,
    home: <FaHome />,
    users: <FaUsers />,
    teacher: <FaChalkboardTeacher />,
  };

  return icons[key] || <FaStar />;
}

/* =========================================================
   BASIC COMPONENTS
========================================================= */

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

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[9999] h-1.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.55)]"
    />
  );
}

function CursorGlow() {
  const isDesktop = useIsDesktop();
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 24 });

  useEffect(() => {
    if (!isDesktop || shouldReduceMotion) return;

    const handleMove = (e) => {
      mouseX.set(e.clientX - 170);
      mouseY.set(e.clientY - 170);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isDesktop, mouseX, mouseY, shouldReduceMotion]);

  if (!isDesktop || shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-[340px] w-[340px] rounded-full bg-yellow-300/10 blur-3xl"
    />
  );
}

function IslamicBackground({ dark = false, intense = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-[url('/pattern.png')] bg-repeat ${
          intense ? "opacity-[0.08]" : "opacity-[0.05]"
        }`}
      />

      <motion.div
        animate={{ rotate: [0, 16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -left-40 top-20 h-72 w-72 rounded-full border sm:h-80 sm:w-80 ${
          dark
            ? "border-yellow-300/20 bg-yellow-300/5"
            : "border-emerald-700/10 bg-emerald-300/20"
        }`}
      />

      <motion.div
        animate={{ rotate: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-44 bottom-10 h-80 w-80 rounded-full border sm:h-[34rem] sm:w-[34rem] ${
          dark
            ? "border-emerald-300/20 bg-emerald-300/5"
            : "border-yellow-600/10 bg-yellow-300/25"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[42rem] sm:w-[42rem] ${
          dark ? "bg-emerald-400/10" : "bg-yellow-300/20"
        }`}
      />

      <motion.div
        animate={{ y: [0, 18, 0], x: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[12%] top-[22%] h-3 w-3 rounded-full bg-yellow-300/80 shadow-[0_0_38px_rgba(250,204,21,0.85)]"
      />

      <motion.div
        animate={{ y: [0, -18, 0], x: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[9%] bottom-[22%] h-2 w-2 rounded-full bg-emerald-300/80 shadow-[0_0_38px_rgba(110,231,183,0.85)]"
      />
    </div>
  );
}

function Section({ children, dark = false, id = "", className = "" }) {
  return (
    <section
      id={id}
      className={`relative min-h-[100dvh] w-full max-w-full overflow-hidden ${
        dark ? "bg-[#041b15] text-white" : "bg-[#f7f1df] text-slate-900"
      } ${className}`}
    >
      {children}
    </section>
  );
}

function Container({ children, className = "", style }) {
  const isDesktop = useIsDesktop();

  return (
    <motion.div
      style={isDesktop ? style : undefined}
      className={`relative z-10 mx-auto w-full max-w-[1500px] px-4 py-16 sm:px-6 sm:py-20 lg:w-[92vw] lg:px-0 lg:py-28 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, light = false }) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em] ${
        light
          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
          : "border-emerald-200 bg-white/85 text-emerald-800"
      }`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, type = "up", className = "" }) {
  const variants = {
    up: {
      hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    left: {
      hidden: { opacity: 0, x: -36, filter: "blur(8px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    right: {
      hidden: { opacity: 0, x: 36, filter: "blur(8px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.94, filter: "blur(8px)" },
      show: { opacity: 1, scale: 1, filter: "blur(0px)" },
    },
  };

  return (
    <motion.div
      variants={variants[type] || variants.up}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ badge, title, desc, light = false, align = "center" }) {
  return (
    <Reveal
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
        className={`text-[clamp(2rem,10vw,5.6rem)] font-black leading-[0.98] tracking-[-0.045em] sm:leading-[0.94] lg:tracking-[-0.06em] ${
          light ? "text-white" : "text-emerald-950"
        }`}
      >
        {title}
      </h2>

      {desc && (
        <p
          className={`mt-5 max-w-3xl text-sm leading-relaxed sm:text-base lg:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-emerald-100" : "text-slate-600"}`}
        >
          {desc}
        </p>
      )}
    </Reveal>
  );
}

function TiltCard({ children, className = "" }) {
  const isDesktop = useIsDesktop();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!isDesktop) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRotate({
      x: ((y / rect.height) - 0.5) * -8,
      y: ((x / rect.width) - 0.5) * 8,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={isDesktop ? { rotateX: rotate.x, rotateY: rotate.y } : {}}
      whileHover={isDesktop ? { y: -8, scale: 1.015 } : {}}
      transition={{ type: "spring", stiffness: 240, damping: 23 }}
      style={isDesktop ? { transformStyle: "preserve-3d" } : undefined}
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({ children, onClick, variant = "primary" }) {
  const isDesktop = useIsDesktop();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMove = (e) => {
    if (!isDesktop) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const moveX = e.clientX - rect.left - rect.width / 2;
    const moveY = e.clientY - rect.top - rect.height / 2;

    x.set(moveX * 0.16);
    y.set(moveY * 0.16);
  };

  const className =
    variant === "primary"
      ? "bg-yellow-400 text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.32)] hover:bg-yellow-300"
      : "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20";

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={isDesktop ? { x: springX, y: springY } : undefined}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-black transition hover:-translate-y-1 sm:w-auto sm:px-8 sm:py-4 sm:text-base ${className}`}
    >
      {children}
    </motion.button>
  );
}

function FloatingNavigator() {
  const items = [
    { label: "Hero", href: "#hero" },
    { label: "Nilai", href: "#values" },
    { label: "Jenjang", href: "#journey" },
    { label: "Timeline", href: "#timeline" },
    { label: "Daftar", href: "#cta" },
  ];

  return (
    <div className="fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex items-center justify-end gap-3"
        >
          <span className="rounded-full bg-emerald-950/85 px-3 py-1 text-[11px] font-black text-yellow-300 opacity-0 shadow-lg backdrop-blur-xl transition group-hover:opacity-100">
            {item.label}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-emerald-950/85 text-[10px] font-black text-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.28)] transition group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-emerald-950">
            {String(index + 1).padStart(2, "0")}
          </span>
        </a>
      ))}
    </div>
  );
}

function OrbitRings() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        className="absolute right-[8%] top-[17%] h-[440px] w-[440px] rounded-full border border-yellow-300/15"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute right-[11%] top-[22%] h-[340px] w-[340px] rounded-full border border-emerald-300/15"
      />

      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] top-[20%] flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.4)]"
      >
        <FaCompass />
      </motion.div>
    </div>
  );
}

/* =========================================================
   LOADING & MAINTENANCE
========================================================= */

function LoadingPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#041b15] px-4 text-white">
      <IslamicBackground dark intense />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-yellow-300/20 border-t-yellow-300 sm:h-20 sm:w-20"
        />

        <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300 sm:text-sm">
          Menghubungkan ke Backend
        </p>

        <h1 className="mt-4 text-2xl font-black sm:text-5xl">
          Memuat Pendidikan...
        </h1>
      </motion.div>
    </main>
  );
}

function MaintenancePage({ onRetry, checking }) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#041b15] px-4 text-white">
      <div className="absolute inset-0">
        <SafeImage
          src="/smk.jpg"
          alt="Maintenance Pendidikan"
          className="h-full w-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#041b15] via-[#062d22]/95 to-[#041b15]" />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <IslamicBackground dark intense />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col items-center justify-center py-20 text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 text-3xl text-yellow-300 shadow-[0_0_70px_rgba(250,204,21,0.25)] backdrop-blur-xl sm:h-24 sm:w-24 sm:text-4xl">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaWrench />
          </motion.div>
        </div>

        <p className="mt-8 text-base leading-loose text-yellow-300 sm:text-xl lg:text-2xl">
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>

        <div className="mt-3">
          <Badge light>Education Maintenance</Badge>
        </div>

        <h1 className="mt-5 text-[clamp(2rem,12vw,6.5rem)] font-black leading-[0.95] tracking-[-0.045em] lg:tracking-[-0.065em]">
          Data pendidikan
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
            sedang tidak tersedia.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-xl">
          Backend Express.js belum berjalan atau endpoint{" "}
          <span className="font-black text-yellow-300">/api/pendidikan</span>{" "}
          belum dapat dihubungi.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={onRetry}
            disabled={checking}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-4 font-black text-emerald-950 shadow-[0_0_50px_rgba(250,204,21,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <motion.span
              animate={checking ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                repeat: checking ? Infinity : 0,
                duration: 1,
                ease: "linear",
              }}
            >
              <FaRedo />
            </motion.span>
            {checking ? "Mengecek Backend..." : "Coba Lagi"}
          </button>

          <a
            href="http://localhost:5000/api/pendidikan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
          >
            Cek API Pendidikan
          </a>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Pendidikan() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(false);

  const [active, setActive] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  const journeyRef = useRef(null);

  const isDesktop = useIsDesktop();
  const { scrollY } = useScroll();

  const heroImageScale = useTransform(scrollY, [0, 900], [1.05, 1.2]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0.35]);

  const valuesY = useTransform(scrollY, [550, 1500, 2300], [100, 0, -70]);
  const valuesScale = useTransform(scrollY, [550, 1500, 2300], [0.96, 1, 1.02]);

  const journeyY = useTransform(scrollY, [1500, 2700, 3900], [100, 0, -80]);
  const journeyScale = useTransform(scrollY, [1500, 2700, 3900], [0.96, 1, 1.02]);

  const timelineY = useTransform(scrollY, [2800, 4200, 5400], [100, 0, -80]);
  const timelineScale = useTransform(scrollY, [2800, 4200, 5400], [0.96, 1, 1.02]);

  const ctaY = useTransform(scrollY, [4700, 6200], [90, 0]);

  const fetchPendidikanData = async () => {
    try {
      setChecking(true);
      setMaintenance(false);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur");
      }

      const response = await fetch(`${API_URL}/api/pendidikan`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pendidikan");
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data pendidikan tidak valid");
      }

      setPageData(result.data);
      setActive(0);
      setCurrentQuote(0);
      setMaintenance(false);
    } catch (error) {
      console.error("PENDIDIKAN BACKEND ERROR:", error.message);
      setPageData(null);
      setMaintenance(true);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchPendidikanData();
  }, []);

  useEffect(() => {
    if (!pageData?.education?.length) return;

    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % pageData.education.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [pageData]);

  const scrollToJourney = () => {
    journeyRef.current?.scrollIntoView({
      behavior: isDesktop ? "smooth" : "auto",
      block: "start",
    });
  };

  if (loading) return <LoadingPage />;

  if (maintenance || !pageData) {
    return <MaintenancePage onRetry={fetchPendidikanData} checking={checking} />;
  }

  const { hero, stats, values, education } = pageData;

  const activeData = education[active] || education[0];
  const quoteData = education[currentQuote] || education[0];

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[#041b15] text-slate-900">
      <ScrollProgress />
      <CursorGlow />
      <FloatingNavigator />
      <Navbar />

      {/* HERO */}
      <Section
        id="hero"
        dark
        className="bg-gradient-to-br from-[#041b15] via-[#062d22] to-[#0b3d2d]"
      >
        <motion.div
          style={isDesktop ? { scale: heroImageScale } : undefined}
          className="absolute inset-0"
        >
          <SafeImage
            src={hero.image}
            alt="Pendidikan Pesantren"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#041b15]/95 via-[#062d22]/92 to-[#0d4f38]/70 lg:bg-gradient-to-r" />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        <IslamicBackground dark intense />
        <OrbitRings />

        <Container className="flex min-h-[100dvh] items-center pt-24 sm:pt-28 lg:pt-28">
          <div className="grid w-full max-w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <motion.div
              style={isDesktop ? { y: heroTextY, opacity: heroOpacity } : undefined}
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl text-center lg:text-left"
            >
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.65 }}
                className="mb-4 text-base leading-loose text-yellow-300 sm:text-xl lg:text-2xl"
              >
                {hero.arabic}
              </motion.p>

              <Badge light>{hero.badge}</Badge>

              <motion.h1
                initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.22, duration: 0.85 }}
                className="mx-auto mt-5 max-w-5xl text-[clamp(2.25rem,12vw,7.2rem)] font-black leading-[0.95] tracking-[-0.045em] sm:leading-[0.9] lg:mx-0 lg:tracking-[-0.07em]"
              >
                {hero.title}
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.65 }}
                className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:mx-0 lg:text-xl"
              >
                {hero.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.65 }}
                className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row lg:mx-0 lg:max-w-none"
              >
                <MagneticButton onClick={scrollToJourney}>
                  Jelajahi Pendidikan
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </MagneticButton>

                <MagneticButton
                  variant="secondary"
                  onClick={() =>
                    document
                      .getElementById("values")
                      ?.scrollIntoView({ behavior: isDesktop ? "smooth" : "auto" })
                  }
                >
                  <FaPlay />
                  Lihat Nilai
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.65 }}
                className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0 lg:mt-9"
              >
                {stats.map((item, index) => (
                  <TiltCard key={item.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.66 + index * 0.07 }}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-xl lg:text-left"
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-300/10 blur-2xl" />

                      <h3 className="relative text-3xl font-black text-yellow-300">
                        {item.number}
                      </h3>

                      <p className="relative mt-1 text-xs font-bold text-emerald-100 sm:text-sm">
                        {item.label}
                      </p>
                    </motion.div>
                  </TiltCard>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <TiltCard>
                <div className="relative ml-auto max-w-xl">
                  <motion.div
                    animate={{ rotate: [0, 2, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-6 -top-6 h-full w-full rounded-[2.8rem] border border-yellow-300/30"
                  />

                  <motion.div
                    animate={{ rotate: [0, -2, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-6 -right-6 h-full w-full rounded-[2.8rem] border border-emerald-300/25"
                  />

                  <div className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuote}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-[2.25rem]"
                      >
                        <SafeImage
                          src={quoteData.bgImage}
                          fallback={quoteData.fallbackImage}
                          alt={quoteData.title}
                          className="h-[420px] w-full object-cover xl:h-[58svh]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                        <div className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-950">
                          Education Preview
                        </div>

                        <div className="absolute bottom-0 left-0 p-7">
                          <FaQuoteLeft className="mb-4 text-3xl text-yellow-300" />

                          <p className="max-w-md text-xl leading-relaxed text-emerald-50">
                            {quoteData.quote}
                          </p>

                          <h3 className="mt-4 text-4xl font-black text-white">
                            {quoteData.title}
                          </h3>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* VALUES */}
      <Section
        id="values"
        className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50"
      >
        <IslamicBackground />

        <Container
          style={{ y: valuesY, scale: valuesScale }}
          className="flex min-h-[100dvh] flex-col justify-center"
        >
          <SectionHeader
            badge="Nilai Pendidikan"
            title="Bukan hanya sekolah, tetapi proses pembentukan hidup"
            desc="Pendidikan pesantren membentuk santri melalui keseimbangan ibadah, ilmu, adab, disiplin, dan kemandirian."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
            {values.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <TiltCard>
                  <div className="relative h-full overflow-hidden rounded-[1.7rem] border border-emerald-100 bg-white/90 p-5 shadow-xl backdrop-blur transition group-hover:bg-white sm:rounded-[2rem] sm:p-6">
                    <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-yellow-300/25 blur-3xl transition group-hover:scale-125" />
                    <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex h-13 w-13 h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 text-2xl text-yellow-300 shadow-lg transition group-hover:scale-110">
                        {getIcon(item.iconKey)}
                      </div>

                      <h3 className="mt-5 text-xl font-black text-emerald-950 sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {item.desc}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 sm:tracking-[0.2em]">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        Core Value
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* INTERACTIVE EDUCATION */}
      <Section
        id="journey"
        dark
        className="bg-gradient-to-br from-[#041b15] via-[#062d22] to-[#0b3d2d]"
      >
        <IslamicBackground dark intense />

        <Container
          style={{ y: journeyY, scale: journeyScale }}
          className="flex min-h-[100dvh] items-center"
        >
          <div
            ref={journeyRef}
            className="grid w-full max-w-full items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]"
          >
            <div>
              <SectionHeader
                light
                align="left"
                badge="Jenjang Pendidikan"
                title="Pilih perjalanan pendidikan santri"
                desc="Setiap jenjang memiliki fokus pembinaan berbeda, namun tetap berada dalam satu visi: ilmu, adab, karakter, dan masa depan."
              />

              <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
                {education.map((item, index) => (
                  <button
                    key={item.level}
                    onClick={() => setActive(index)}
                    className={`min-w-[124px] rounded-2xl border p-3 text-center transition ${
                      active === index
                        ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-xl"
                        : "border-white/10 bg-white/10 text-white"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${
                        active === index
                          ? "bg-emerald-950 text-yellow-300"
                          : "bg-white/10 text-yellow-300"
                      }`}
                    >
                      {getIcon(item.iconKey)}
                    </div>

                    <p className="text-xs font-black">{item.shortTitle}</p>
                  </button>
                ))}
              </div>

              <div className="mt-7 hidden gap-3 lg:grid">
                {education.map((item, index) => (
                  <button
                    key={item.level}
                    onClick={() => setActive(index)}
                    className={`group relative overflow-hidden rounded-[1.7rem] border p-5 text-left transition ${
                      active === index
                        ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-2xl shadow-yellow-950/20"
                        : "border-white/10 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/15"
                    }`}
                  >
                    {active === index && (
                      <motion.div
                        layoutId="active-education"
                        className="absolute inset-0 bg-yellow-400"
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                          active === index
                            ? "bg-emerald-950 text-yellow-300"
                            : "bg-white/10 text-yellow-300"
                        }`}
                      >
                        {getIcon(item.iconKey)}
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                          Tahap {item.level}
                        </p>

                        <h3 className="mt-1 text-2xl font-black">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.level}
                initial={{ opacity: 0, y: 34, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -34, scale: 0.97 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl sm:rounded-[2.2rem]"
              >
                <div className={`h-2 bg-gradient-to-r ${activeData.color}`} />

                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative min-h-[260px] overflow-hidden sm:min-h-[340px] lg:min-h-[640px]">
                    <motion.div
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.75 }}
                      className="absolute inset-0"
                    >
                      <SafeImage
                        src={activeData.bgImage}
                        fallback={activeData.fallbackImage}
                        alt={activeData.title}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 sm:left-5 sm:top-5 sm:tracking-[0.24em]">
                      Tahap {activeData.level}
                    </div>

                    <div className="absolute bottom-0 left-0 p-5 sm:p-8">
                      <p className="text-base leading-loose text-yellow-300 sm:text-lg">
                        {activeData.arabic}
                      </p>

                      <h3 className="mt-2 text-[clamp(2rem,12vw,5.3rem)] font-black leading-none text-white">
                        {activeData.shortTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-emerald-950/90 p-5 sm:p-8 lg:p-10">
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 sm:text-xs sm:tracking-[0.3em]">
                        Education Level
                      </p>

                      <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                        {activeData.title}
                      </h2>

                      <p className="mt-3 text-sm font-bold text-emerald-200 sm:text-base">
                        {activeData.subtitle}
                      </p>

                      <p className="mt-5 text-sm leading-relaxed text-emerald-100 sm:text-base">
                        {activeData.story}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {activeData.focus.map((focus) => (
                          <div
                            key={focus}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3"
                          >
                            <FaCheckCircle className="shrink-0 text-yellow-300" />
                            <span className="text-sm font-semibold text-white">
                              {focus}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7 rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300 sm:tracking-[0.28em]">
                          Output Pendidikan
                        </p>

                        <h4 className="mt-3 text-xl font-black text-white sm:text-2xl">
                          {activeData.impact}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </Section>

      {/* TIMELINE */}
      <Section
        id="timeline"
        className="bg-gradient-to-b from-white via-[#f4fff7] to-[#dff5e8]"
      >
        <IslamicBackground />

        <Container style={{ y: timelineY, scale: timelineScale }}>
          <SectionHeader
            badge="Alur Perjalanan"
            title="Pendidikan santri berjalan bertahap dan terarah"
            desc="Setiap jenjang dirancang seperti perjalanan: dimulai dari fondasi, dilanjutkan keterampilan, dan diperdalam dengan nilai Al-Qur’an."
          />

          <div className="relative mt-8 grid gap-5 sm:mt-10 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            <div className="absolute left-0 top-[122px] hidden h-1 w-full bg-gradient-to-r from-emerald-200 via-yellow-300 to-emerald-200 lg:block" />

            {education.map((item, index) => (
              <Reveal key={item.level} delay={index * 0.08}>
                <TiltCard>
                  <div className="relative z-10 overflow-hidden rounded-[1.8rem] border border-emerald-100 bg-white shadow-2xl sm:rounded-[2.2rem]">
                    <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                      <SafeImage
                        src={item.bgImage}
                        fallback={item.fallbackImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                        {getIcon(item.iconKey)}
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300 sm:tracking-[0.28em]">
                          Tahap {item.level}
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item.story}
                      </p>

                      <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700 sm:tracking-[0.25em]">
                          Dampak
                        </p>

                        <h4 className="mt-2 font-black text-emerald-950">
                          {item.impact}
                        </h4>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section
        id="cta"
        dark
        className="bg-gradient-to-br from-[#041b15] via-[#062d22] to-[#0b3d2d]"
      >
        <IslamicBackground dark intense />

        <Container
          style={{ y: ctaY }}
          className="flex min-h-[100dvh] items-center justify-center text-center"
        >
          <Reveal type="zoom">
            <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#041b15] text-white shadow-[0_35px_110px_rgba(0,0,0,0.45)] sm:rounded-[2.6rem]">
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-emerald-300/10" />
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10 border-b border-white/10 bg-white/[0.04] px-4 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300 sm:px-7 sm:text-[11px] sm:tracking-[0.25em]">
                Education Final Scene
              </div>

              <div className="relative z-10 px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                <motion.div
                  animate={{
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.06, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-[0_0_50px_rgba(250,204,21,0.4)] sm:h-20 sm:w-20 sm:text-3xl"
                >
                  <FaMoon />
                </motion.div>

                <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300 sm:text-sm sm:tracking-[0.28em]">
                  Pendidikan adalah perjalanan panjang
                </p>

                <h2 className="mx-auto mt-5 max-w-5xl text-[clamp(2rem,11vw,6rem)] font-black leading-[0.98] tracking-[-0.045em] sm:leading-[0.94] lg:tracking-[-0.06em]">
                  Mulai perjalanan santri bersama
                  <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                    Al-Furqon.
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-xl">
                  Dari fondasi adab, keterampilan modern, hingga pendalaman
                  Al-Qur’an. Setiap langkah diarahkan untuk membentuk pribadi
                  yang berilmu, berakhlak, dan siap menghadapi masa depan.
                </p>

                <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "Ilmu",
                      desc: "Pendidikan terarah",
                      icon: <FaBookOpen />,
                    },
                    {
                      title: "Adab",
                      desc: "Karakter santri",
                      icon: <FaHeart />,
                    },
                    {
                      title: "Masa Depan",
                      desc: "Siap berkembang",
                      icon: <FaRocket />,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-xl"
                    >
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-lg text-emerald-950">
                        {item.icon}
                      </div>

                      <h3 className="mt-3 text-base font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-emerald-100">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mx-auto mt-9 flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
                  <MagneticButton onClick={scrollToJourney}>
                    Lihat Jenjang
                    <FaArrowRight />
                  </MagneticButton>

                  <MagneticButton variant="secondary">
                    Hubungi Admin
                    <FaHandSparkles />
                  </MagneticButton>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 bg-black/20 px-4 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 sm:px-7 sm:text-[11px] sm:tracking-[0.22em]">
                Ilmu • Adab • Ibadah • Kemandirian
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Footer />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        html,
        body,
        #__next {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        body {
          background: #041b15;
        }

        img,
        video,
        canvas,
        svg {
          max-width: 100%;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        ::selection {
          background: #facc15;
          color: #064e3b;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 1023px) {
          html {
            scroll-behavior: auto;
          }

          section {
            min-height: auto;
          }
        }
      `}</style>
    </main>
  );
}