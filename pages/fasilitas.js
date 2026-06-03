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
  FaChevronLeft,
  FaChevronRight,
  FaMosque,
  FaBed,
  FaBookOpen,
  FaFutbol,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaHome,
  FaQuran,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaRedo,
  FaWrench,
  FaPlay,
  FaCompass,
  FaHandSparkles,
  FaLayerGroup,
  FaQuoteLeft,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const FALLBACK_IMAGE = "/hero-santri.jpg";

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
    mosque: <FaMosque />,
    bed: <FaBed />,
    book: <FaBookOpen />,
    sport: <FaFutbol />,
    home: <FaHome />,
    quran: <FaQuran />,
    users: <FaUsers />,
    shield: <FaShieldAlt />,
    star: <FaStar />,
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
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
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
  }, [isDesktop, shouldReduceMotion, mouseX, mouseY]);

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
          intense ? "opacity-[0.09]" : "opacity-[0.055]"
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

      <motion.div
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
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
      hidden: { opacity: 0, y: 42, filter: "blur(10px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    left: {
      hidden: { opacity: 0, x: -42, filter: "blur(10px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    right: {
      hidden: { opacity: 0, x: 42, filter: "blur(10px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
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

function MagneticButton({ children, onClick, href, variant = "primary" }) {
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

  const button = (
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

  if (href) {
    return <a href={href}>{button}</a>;
  }

  return button;
}

function FloatingNavigator() {
  const items = [
    { label: "Hero", href: "#hero" },
    { label: "Unggulan", href: "#featured" },
    { label: "Jelajah", href: "#explorer" },
    { label: "Cinematic", href: "#cinematic" },
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
          Memuat Fasilitas...
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
          src="/hero-santri.jpg"
          alt="Maintenance Fasilitas"
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
          <Badge light>Facilities Maintenance</Badge>
        </div>

        <h1 className="mt-5 text-[clamp(2rem,12vw,6.5rem)] font-black leading-[0.95] tracking-[-0.045em] lg:tracking-[-0.065em]">
          Data fasilitas
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
            sedang tidak tersedia.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-xl">
          Backend Express.js belum berjalan atau endpoint{" "}
          <span className="font-black text-yellow-300">/api/fasilitas</span>{" "}
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
            href="http://localhost:5000/api/fasilitas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
          >
            Cek API Fasilitas
          </a>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Fasilitas() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const explorerRef = useRef(null);

  const isDesktop = useIsDesktop();
  const { scrollY } = useScroll();

  const heroImageScale = useTransform(scrollY, [0, 900], [1.05, 1.2]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0.35]);

  const featuredY = useTransform(scrollY, [600, 1600, 2600], [100, 0, -80]);
  const featuredScale = useTransform(scrollY, [600, 1600, 2600], [0.96, 1, 1.02]);

  const explorerY = useTransform(scrollY, [1700, 3100, 4300], [100, 0, -80]);
  const explorerScale = useTransform(scrollY, [1700, 3100, 4300], [0.96, 1, 1.02]);

  const cinematicY = useTransform(scrollY, [3200, 4600, 5900], [100, 0, -80]);
  const cinematicScale = useTransform(scrollY, [3200, 4600, 5900], [0.96, 1, 1.02]);

  const ctaY = useTransform(scrollY, [5200, 6800], [90, 0]);

  const fetchFasilitasData = async () => {
    try {
      setChecking(true);
      setMaintenance(false);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur");
      }

      const response = await fetch(`${API_URL}/api/fasilitas`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data fasilitas");
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data fasilitas tidak valid");
      }

      setPageData(result.data);
      setActiveIndex(0);
      setSelectedCategory("Semua");
      setMaintenance(false);
    } catch (error) {
      console.error("FASILITAS BACKEND ERROR:", error.message);
      setPageData(null);
      setMaintenance(true);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchFasilitasData();
  }, []);

  if (loading) return <LoadingPage />;

  if (maintenance || !pageData) {
    return <MaintenancePage onRetry={fetchFasilitasData} checking={checking} />;
  }

  const { hero, stats, featuredInfo, featuredCards, qualities, facilities } =
    pageData;

  const categories = ["Semua", ...new Set(facilities.map((item) => item.category))];

  const filteredFacilities =
    selectedCategory === "Semua"
      ? facilities
      : facilities.filter((item) => item.category === selectedCategory);

  const featured =
    facilities.find((item) => item.featured) || facilities[0];

  const activeFacility =
    filteredFacilities[activeIndex] || filteredFacilities[0] || facilities[0];

  const next = () => {
    setActiveIndex((prev) => {
      if (filteredFacilities.length === 0) return 0;
      return (prev + 1) % filteredFacilities.length;
    });
  };

  const prev = () => {
    setActiveIndex((prev) => {
      if (filteredFacilities.length === 0) return 0;
      return prev === 0 ? filteredFacilities.length - 1 : prev - 1;
    });
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setActiveIndex(0);
  };

  const scrollToExplorer = () => {
    explorerRef.current?.scrollIntoView({
      behavior: isDesktop ? "smooth" : "auto",
      block: "start",
    });
  };

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
            alt="Fasilitas Pesantren"
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
              style={
                isDesktop
                  ? { y: heroTextY, opacity: heroOpacity }
                  : undefined
              }
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
                <MagneticButton onClick={scrollToExplorer}>
                  Jelajahi Fasilitas
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </MagneticButton>

                <MagneticButton href="#featured" variant="secondary">
                  <FaPlay />
                  Lihat Unggulan
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.65 }}
                className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-0 lg:mt-9"
              >
                {stats.map((item, index) => (
                  <TiltCard key={item.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.66 + index * 0.06 }}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-xl lg:text-left"
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-300/10 blur-2xl" />

                      <h3 className="relative text-2xl font-black text-yellow-300 sm:text-3xl">
                        {item.value}
                      </h3>

                      <p className="relative mt-1 text-xs font-bold text-emerald-100">
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
                        key={activeFacility?.id || activeFacility?.name}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-[2.25rem]"
                      >
                        <SafeImage
                          src={activeFacility?.img}
                          alt={activeFacility?.name}
                          className="h-[420px] w-full object-cover xl:h-[58svh]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                        <div className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-950">
                          Facility Preview
                        </div>

                        <div className="absolute bottom-0 left-0 p-7">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950">
                            {getIcon(activeFacility?.iconKey)}
                          </div>

                          <h3 className="text-4xl font-black text-white">
                            {activeFacility?.name}
                          </h3>

                          <p className="mt-3 text-base leading-relaxed text-emerald-100">
                            {activeFacility?.desc}
                          </p>
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

      {/* FEATURED */}
      <Section
        id="featured"
        dark
        className="bg-gradient-to-br from-[#041b15] via-[#062d22] to-[#0b3d2d]"
      >
        <IslamicBackground dark intense />

        <Container
          style={{ y: featuredY, scale: featuredScale }}
          className="flex min-h-[100dvh] items-center"
        >
          <div className="grid w-full max-w-full items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionHeader
                light
                align="left"
                badge={featuredInfo.badge}
                title={featuredInfo.title}
                desc={featuredInfo.desc}
              />

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {featuredCards.map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={index * 0.08}
                    type={index % 2 === 0 ? "left" : "right"}
                  >
                    <TiltCard>
                      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/10 blur-3xl" />

                        <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                          {getIcon(item.iconKey)}
                        </div>

                        <h3 className="relative z-10 text-lg font-black text-white">
                          {item.title}
                        </h3>

                        <p className="relative z-10 mt-2 text-sm leading-relaxed text-emerald-100">
                          {item.desc}
                        </p>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal type="zoom">
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:rounded-[2.2rem]">
                <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.8rem]">
                  <SafeImage
                    src={featured?.img}
                    alt={featured?.name}
                    className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[64svh]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <Badge light>{featured?.category}</Badge>

                    <h2 className="mt-4 text-[clamp(2rem,10vw,5.6rem)] font-black leading-[0.95] tracking-[-0.045em] text-white lg:tracking-[-0.06em]">
                      {featured?.name}
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                      {featured?.detail || featured?.desc}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* EXPLORER */}
      <Section
        id="explorer"
        className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50"
      >
        <IslamicBackground />

        <Container
          style={{ y: explorerY, scale: explorerScale }}
          className="min-h-[100dvh]"
        >
          <div ref={explorerRef}>
            <SectionHeader
              badge="Jelajah Fasilitas"
              title="Pilih fasilitas dan lihat detailnya"
              desc="Gunakan kategori untuk melihat fasilitas berdasarkan kebutuhan santri. Setiap kartu punya animasi perpindahan agar terasa interaktif."
            />

            <div className="no-scrollbar mx-auto mt-8 flex max-w-5xl gap-3 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${
                    selectedCategory === category
                      ? "border-emerald-950 bg-emerald-950 text-white shadow-xl"
                      : "border-emerald-100 bg-white/80 text-emerald-900 hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-9 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 lg:grid lg:overflow-visible">
                {filteredFacilities.map((item, index) => (
                  <button
                    key={item.id || item.name}
                    onClick={() => setActiveIndex(index)}
                    className={`group min-w-[260px] rounded-[1.5rem] border p-4 text-left transition lg:min-w-0 lg:rounded-[1.7rem] ${
                      activeIndex === index
                        ? "border-yellow-300 bg-emerald-950 text-white shadow-2xl"
                        : "border-emerald-100 bg-white/85 text-emerald-950 shadow-lg hover:-translate-y-1 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition ${
                          activeIndex === index
                            ? "bg-yellow-400 text-emerald-950"
                            : "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-900 group-hover:text-yellow-300"
                        }`}
                      >
                        {getIcon(item.iconKey)}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                            activeIndex === index
                              ? "text-yellow-300"
                              : "text-emerald-700"
                          }`}
                        >
                          {item.category}
                        </p>

                        <h3 className="mt-1 truncate text-xl font-black">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFacility?.id || activeFacility?.name}
                  initial={{ opacity: 0, y: 34, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -34, scale: 0.97 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-[1.8rem] bg-emerald-950 shadow-2xl sm:rounded-[2.2rem]"
                >
                  <div className="relative h-[300px] overflow-hidden sm:h-[420px] lg:h-[54svh]">
                    <motion.div
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.75 }}
                      className="h-full w-full"
                    >
                      <SafeImage
                        src={activeFacility?.img}
                        alt={activeFacility?.name}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/25 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950">
                        {getIcon(activeFacility?.iconKey)}
                      </div>

                      <p className="text-xs font-black uppercase tracking-[0.26em] text-yellow-300 sm:tracking-[0.3em]">
                        {activeFacility?.category}
                      </p>

                      <h3 className="mt-2 text-[clamp(2rem,9vw,5rem)] font-black tracking-[-0.045em] text-white lg:tracking-[-0.06em]">
                        {activeFacility?.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-[1.1fr_0.9fr] sm:p-6 lg:p-8">
                    <div>
                      <p className="text-sm leading-relaxed text-emerald-100 sm:text-base">
                        {activeFacility?.detail || activeFacility?.desc}
                      </p>

                      <button className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-yellow-400 px-6 py-3 font-black text-emerald-950 transition hover:bg-yellow-300 sm:w-auto">
                        Lihat Detail
                        <FaArrowRight />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {qualities.map((point) => (
                        <div
                          key={point}
                          className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur"
                        >
                          <FaCheckCircle className="mx-auto mb-2 text-yellow-300" />

                          <p className="text-xs font-bold text-white sm:text-sm">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </Section>

      {/* CINEMATIC */}
      <Section
        id="cinematic"
        dark
        className="bg-gradient-to-br from-[#041b15] via-[#062d22] to-[#0b3d2d]"
      >
        <IslamicBackground dark intense />

        <Container
          style={{ y: cinematicY, scale: cinematicScale }}
          className="flex min-h-[100dvh] flex-col justify-center"
        >
          <SectionHeader
            light
            badge="Cinematic View"
            title="Fasilitas dalam satu tampilan interaktif"
            desc="Gunakan tombol navigasi untuk melihat setiap fasilitas pesantren dengan transisi visual yang lebih hidup."
          />

          <div className="mx-auto mt-9 w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFacility?.id || activeFacility?.name}
                initial={{ opacity: 0, x: 70, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -70, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:rounded-[2.2rem]"
              >
                <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.8rem]">
                  <SafeImage
                    src={activeFacility?.img}
                    alt={activeFacility?.name}
                    className="h-[420px] w-full object-cover sm:h-[560px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950">
                      {getIcon(activeFacility?.iconKey)}
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.26em] text-yellow-300 sm:tracking-[0.3em]">
                      {activeFacility?.category}
                    </p>

                    <h3 className="mt-2 text-[clamp(2.2rem,10vw,5rem)] font-black text-white">
                      {activeFacility?.name}
                    </h3>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                      {activeFacility?.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={prev}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:h-14 sm:w-14"
              >
                <FaChevronLeft />
              </button>

              <div className="no-scrollbar flex max-w-[70vw] justify-center gap-2 overflow-x-auto pb-1">
                {filteredFacilities.map((item, index) => (
                  <button
                    key={item.id || item.name}
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 shrink-0 rounded-full transition ${
                      activeIndex === index
                        ? "w-10 bg-yellow-400"
                        : "w-3 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:h-14 sm:w-14"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
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
                Facility Final Scene
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
                  <FaMapMarkedAlt />
                </motion.div>

                <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300 sm:text-sm sm:tracking-[0.28em]">
                  Lingkungan yang baik membentuk kebiasaan yang baik
                </p>

                <h2 className="mx-auto mt-5 max-w-5xl text-[clamp(2rem,11vw,6rem)] font-black leading-[0.98] tracking-[-0.045em] sm:leading-[0.94] lg:tracking-[-0.06em]">
                  Fasilitas pesantren mendukung
                  <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                    perjalanan santri.
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-xl">
                  Mulai dari masjid, asrama, kelas, hingga ruang aktivitas.
                  Semua disiapkan untuk mendukung pendidikan, ibadah, keamanan,
                  dan pembinaan karakter santri.
                </p>

                <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "Aman",
                      desc: "Lingkungan terjaga",
                      icon: <FaShieldAlt />,
                    },
                    {
                      title: "Nyaman",
                      desc: "Ruang belajar hidup",
                      icon: <FaHome />,
                    },
                    {
                      title: "Terarah",
                      desc: "Mendukung pembinaan",
                      icon: <FaLayerGroup />,
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
                  <MagneticButton onClick={scrollToExplorer}>
                    Lihat Fasilitas
                    <FaArrowRight />
                  </MagneticButton>

<MagneticButton href={WHATSAPP_ADMIN_URL} variant="secondary">
  Hubungi Admin
  <FaHandSparkles />
</MagneticButton>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 bg-black/20 px-4 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 sm:px-7 sm:text-[11px] sm:tracking-[0.22em]">
                Masjid • Asrama • Kelas • Aktivitas • Keamanan
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