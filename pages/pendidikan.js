"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaGraduationCap,
  FaHeart,
  FaHome,
  FaLaptopCode,
  FaMoon,
  FaMosque,
  FaPlay,
  FaQuran,
  FaQuoteLeft,
  FaRocket,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "");

const FALLBACK_IMAGE = "/smk.jpg";

const ADMIN_WHATSAPP_NUMBER = "08999155698";
const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai pendidikan pesantren.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_PENDIDIKAN_PAGE = {
  hero: {
    badge: "Islamic Education Journey",
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    title: "Journey of",
    highlight: "Santri Education.",
    desc: "Perjalanan pendidikan islami modern yang membentuk akhlak, spiritualitas, ilmu pengetahuan, keterampilan hidup, dan masa depan santri.",
    image: "/smk.jpg",
  },
  stats: [
    { number: "3+", label: "Jenjang Pendidikan" },
    { number: "24J", label: "Lingkungan Pembinaan" },
    { number: "1", label: "Visi Pendidikan" },
  ],
  values: [
    {
      title: "Adab Dahulu",
      desc: "Santri dibimbing agar ilmu berjalan bersama sopan santun, akhlak, dan tanggung jawab.",
      iconKey: "heart",
    },
    {
      title: "Ilmu Terarah",
      desc: "Pembelajaran dirancang agar santri memahami agama, akademik, dan keterampilan dasar.",
      iconKey: "book",
    },
    {
      title: "Mandiri",
      desc: "Kehidupan pesantren melatih kedisiplinan, kebersihan, tanggung jawab, dan keberanian.",
      iconKey: "shield",
    },
    {
      title: "Siap Berkembang",
      desc: "Pendidikan diarahkan agar santri mampu melanjutkan perjalanan hidup dengan percaya diri.",
      iconKey: "rocket",
    },
  ],
  education: [
    {
      level: "01",
      title: "MTs Setara",
      shortTitle: "MTs",
      subtitle: "Fondasi karakter & adab sebelum ilmu tinggi",
      story:
        "Tahap awal pembentukan karakter santri melalui disiplin, ibadah, pembiasaan adab, dan keseimbangan antara pendidikan umum serta agama.",
      impact: "Santri memiliki fondasi karakter, adab, dan disiplin yang kuat.",
      quote: "Adab dan ilmu menjadi fondasi perjalanan santri.",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      iconKey: "graduate",
      bgImage: "/mts.jpg",
      fallbackImage: "/smk.jpg",
      color: "from-yellow-400 to-emerald-400",
      focus: [
        "Kurikulum umum & agama",
        "Tahsin & hafalan dasar",
        "Pembentukan adab",
        "Disiplin & ibadah harian",
      ],
    },
    {
      level: "02",
      title: "SMK",
      shortTitle: "SMK",
      subtitle: "Ilmu akademik dan keterampilan masa depan.",
      story:
        "Pendidikan formal membantu santri tetap berkembang secara akademik, memahami pelajaran sekolah, dan menyiapkan diri untuk jenjang berikutnya.",
      impact: "Santri siap berkembang secara akademik, sosial, dan keterampilan.",
      quote: "Ilmu agama berjalan bersama keterampilan masa depan.",
      arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
      iconKey: "laptop",
      bgImage: "/smk.jpg",
      fallbackImage: "/hero-santri.jpg",
      color: "from-emerald-400 to-yellow-400",
      focus: ["Akademik", "Kedisiplinan", "Keterampilan", "Evaluasi"],
    },
    {
      level: "03",
      title: "Takhossus",
      shortTitle: "Takhossus",
      subtitle: "Pendalaman Qur'an, agama, dan pembinaan khusus.",
      story:
        "Program takhossus membantu santri memperkuat hafalan, pemahaman agama, adab, serta pembiasaan ibadah dalam lingkungan yang lebih fokus.",
      impact: "Santri lebih fokus dalam agama, hafalan, dan kedisiplinan ibadah.",
      quote: "Pendalaman ilmu menjadi jalan memperkuat karakter santri.",
      arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      iconKey: "quran",
      bgImage: "/masjid.jpg",
      fallbackImage: "/smk.jpg",
      color: "from-yellow-400 to-orange-300",
      focus: ["Hafalan", "Kitab", "Adab", "Ibadah"],
    },
  ],
};

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
    rocket: <FaRocket />,
  };

  return icons[key] || <FaStar />;
}

function normalizePendidikanPage(data) {
  const source = data || {};
  const fallbackEducation = DEFAULT_PENDIDIKAN_PAGE.education;

  const rawEducation =
    Array.isArray(source.education) && source.education.length
      ? source.education
      : fallbackEducation;

  const education = rawEducation.map((item, index) => {
    const fallback = fallbackEducation[index % fallbackEducation.length];

    return {
      ...fallback,
      ...item,
      level: item?.level || fallback.level,
      title: item?.title || fallback.title,
      shortTitle: item?.shortTitle || item?.title || fallback.shortTitle,
      subtitle: item?.subtitle || fallback.subtitle,
      story: item?.story || item?.desc || fallback.story,
      impact: item?.impact || fallback.impact,
      quote: item?.quote || fallback.quote,
      arabic: item?.arabic || fallback.arabic,
      iconKey: item?.iconKey || fallback.iconKey,
      bgImage: item?.bgImage || item?.image || fallback.bgImage,
      fallbackImage: item?.fallbackImage || fallback.fallbackImage,
      color: item?.color || fallback.color,
      focus:
        Array.isArray(item?.focus) && item.focus.length
          ? item.focus
          : fallback.focus,
    };
  });

  return {
    hero: {
      ...DEFAULT_PENDIDIKAN_PAGE.hero,
      ...(source.hero || {}),
    },
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
        : DEFAULT_PENDIDIKAN_PAGE.stats,
    values:
      Array.isArray(source.values) && source.values.length
        ? source.values
        : DEFAULT_PENDIDIKAN_PAGE.values,
    education,
  };
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
      draggable={false}
      loading="lazy"
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
      className="fixed left-0 top-0 z-[9999] h-1.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400"
    />
  );
}

function BackgroundArt({ dark = false }) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.045]" />

      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(circle_at_16%_20%,rgba(250,204,21,0.13),transparent_30%),radial-gradient(circle_at_82%_68%,rgba(16,185,129,0.11),transparent_32%)]"
            : "bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.11),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(250,204,21,0.18),transparent_32%)]"
        }`}
      />

      <motion.div
        animate={
          reduce ? undefined : { rotate: [0, 12, 0], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -left-28 top-20 h-64 w-64 rounded-full border sm:h-72 sm:w-72 ${
          dark
            ? "border-yellow-300/14 bg-yellow-300/5"
            : "border-emerald-900/10 bg-emerald-300/14"
        }`}
      />

      <motion.div
        animate={
          reduce ? undefined : { rotate: [0, -12, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-32 bottom-14 h-80 w-80 rounded-full border sm:h-[24rem] sm:w-[24rem] ${
          dark
            ? "border-emerald-300/14 bg-emerald-300/5"
            : "border-yellow-500/10 bg-yellow-300/14"
        }`}
      />
    </div>
  );
}

function Badge({ children, dark = false }) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs ${
        dark
          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
          : "border-emerald-200 bg-white/85 text-emerald-800"
      }`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ children, dark = false, id = "", className = "" }) {
  return (
    <section
      id={id}
      className={`edu-section relative w-full overflow-hidden ${
        dark ? "bg-[#041b15] text-white" : "bg-[#f7f1df] text-emerald-950"
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
      className={`edu-container relative z-10 mx-auto flex-1 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ badge, title, desc, dark = false, align = "center" }) {
  return (
    <Reveal>
      <div
        className={`${
          align === "center" ? "mx-auto text-center" : "text-left"
        } max-w-5xl`}
      >
        {badge && (
          <div className="mb-4">
            <Badge dark={dark}>{badge}</Badge>
          </div>
        )}

        <h2
          className={`edu-section-title font-black leading-[0.98] tracking-[-0.05em] ${
            dark ? "text-white" : "text-emerald-950"
          }`}
        >
          {title}
        </h2>

        {desc && (
          <p
            className={`mt-4 max-w-3xl text-sm leading-relaxed sm:text-base lg:text-[1.05rem] ${
              align === "center" ? "mx-auto" : ""
            } ${dark ? "text-emerald-100" : "text-slate-600"}`}
          >
            {desc}
          </p>
        )}
      </div>
    </Reveal>
  );
}

function GlassCard({ children, dark = false, className = "" }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.6rem] border shadow-[0_20px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:rounded-[2rem] ${
        dark
          ? "border-white/10 bg-white/10 text-white"
          : "border-emerald-100 bg-white/85 text-emerald-950"
      } ${className}`}
    >
      <div
        className={`absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl transition duration-700 group-hover:scale-125 ${
          dark ? "bg-yellow-300/10" : "bg-yellow-300/18"
        }`}
      />
      <div
        className={`absolute -bottom-24 -left-24 h-56 w-56 rounded-full blur-3xl ${
          dark ? "bg-emerald-300/10" : "bg-emerald-300/18"
        }`}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function LoadingPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#041b15] px-6 text-center text-white">
      <BackgroundArt dark />

      <div className="relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-16 w-16 rounded-full border-4 border-yellow-300/20 border-t-yellow-300"
        />

        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
          Loading Pendidikan
        </p>

        <h1 className="mt-3 text-3xl font-black">Memuat data...</h1>
      </div>
    </main>
  );
}

function BackendNotice({ show, onRetry, checking }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[90] hidden -translate-x-1/2 items-center gap-3 rounded-full border border-yellow-300/30 bg-emerald-950/90 px-5 py-3 text-xs font-bold text-yellow-100 shadow-2xl backdrop-blur-xl md:flex">
      <span>Backend belum terbaca, tampilan memakai data contoh.</span>

      <button
        onClick={onRetry}
        disabled={checking}
        className="rounded-full bg-yellow-400 px-4 py-2 font-black text-emerald-950 disabled:opacity-60"
      >
        {checking ? "Cek..." : "Coba Lagi"}
      </button>
    </div>
  );
}

function ChapterDots() {
  const items = [
    ["01", "#hero"],
    ["02", "#values"],
    ["03", "#journey"],
    ["04", "#timeline"],
    ["05", "#cta"],
  ];

  return (
    <div className="fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-3 2xl:flex">
      {items.map(([label, href]) => (
        <a
          key={href}
          href={href}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-emerald-950/85 text-[10px] font-black text-yellow-300 shadow-lg backdrop-blur-xl transition hover:scale-110 hover:bg-yellow-400 hover:text-emerald-950"
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export default function Pendidikan() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [checking, setChecking] = useState(false);
  const [active, setActive] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  const { scrollY } = useScroll();

  const heroImageScale = useTransform(scrollY, [0, 900], [1, 1.06]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 34]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0.68]);

  const fetchPendidikanData = async () => {
    try {
      setChecking(true);

      const endpoint = API_URL ? `${API_URL}/api/pendidikan` : "/api/pendidikan";

      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data pendidikan tidak valid");
      }

      setPageData(normalizePendidikanPage(result.data));
      setUsingFallback(false);
      setActive(0);
      setCurrentQuote(0);
    } catch (error) {
      console.error("PENDIDIKAN BACKEND ERROR:", error.message);
      setPageData(DEFAULT_PENDIDIKAN_PAGE);
      setUsingFallback(true);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    const updateViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--edu-vh",
        `${window.innerHeight}px`
      );
    };

    const updateNavbarHeight = () => {
      const nav = document.querySelector("nav");
      const navHeight = nav?.getBoundingClientRect?.().height || 88;

      document.documentElement.style.setProperty(
        "--edu-navbar-h",
        `${Math.ceil(navHeight)}px`
      );
    };

    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("overflow-y", "auto", "important");
    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("min-height", "100%", "important");

    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overflow-y", "auto", "important");
    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100%", "important");

    if (next) {
      next.style.setProperty("overflow", "visible", "important");
      next.style.setProperty("height", "auto", "important");
      next.style.setProperty("min-height", "100%", "important");
    }

    updateViewportHeight();
    updateNavbarHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            updateViewportHeight();
            updateNavbarHeight();
          })
        : null;

    const nav = document.querySelector("nav");

    if (nav) {
      resizeObserver?.observe(nav);
    }

    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("resize", updateNavbarHeight);
    window.addEventListener("orientationchange", updateViewportHeight);
    window.addEventListener("orientationchange", updateNavbarHeight);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("resize", updateNavbarHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
      window.removeEventListener("orientationchange", updateNavbarHeight);

      html.style.removeProperty("overflow-x");
      html.style.removeProperty("overflow-y");
      html.style.removeProperty("height");
      html.style.removeProperty("min-height");
      html.style.removeProperty("--edu-vh");
      html.style.removeProperty("--edu-navbar-h");

      body.style.removeProperty("overflow-x");
      body.style.removeProperty("overflow-y");
      body.style.removeProperty("height");
      body.style.removeProperty("min-height");

      if (next) {
        next.style.removeProperty("overflow");
        next.style.removeProperty("height");
        next.style.removeProperty("min-height");
      }
    };
  }, []);

  useEffect(() => {
    fetchPendidikanData();
  }, []);

  const data = useMemo(() => normalizePendidikanPage(pageData), [pageData]);
  const { hero, stats, values, education } = data;
  const activeData = education[active] || education[0];
  const quoteData = education[currentQuote] || education[0];

  useEffect(() => {
    if (!education?.length) return;

    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % education.length);
    }, 3900);

    return () => clearInterval(interval);
  }, [education]);

  if (loading) return <LoadingPage />;

  return (
    <main className="edu-page overflow-x-hidden bg-[#041b15] text-emerald-950">
      <ScrollProgress />
      <Navbar />
      <ChapterDots />

      <BackendNotice
        show={usingFallback}
        onRetry={fetchPendidikanData}
        checking={checking}
      />

      <Section id="hero" dark className="edu-hero-section">
  <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
    <SafeImage
      src={hero.image}
      alt="Pendidikan Pesantren Al-Furqon"
      className="h-full w-full object-cover"
    />
  </motion.div>

  <div className="absolute inset-0 bg-gradient-to-r from-[#03130f] via-[#06271f]/96 to-[#06271f]/78" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(250,204,21,0.16),transparent_28%),radial-gradient(circle_at_80%_55%,rgba(16,185,129,0.16),transparent_34%)]" />
  <div className="absolute inset-0 bg-black/38" />
  <BackgroundArt dark />

  <Container
  style={{ y: heroTextY, opacity: heroOpacity }}
  className="flex items-center justify-center"
>
    <div className="edu-hero-layout grid w-full items-center gap-7 lg:grid-cols-[1.02fr_0.98fr]">
      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative z-10 max-w-4xl text-center lg:text-left"
      >
        <div className="mb-4 inline-flex rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-sm leading-loose text-yellow-300 backdrop-blur-xl sm:text-base lg:text-lg">
          {hero.arabic}
        </div>

        <div>
          <Badge dark>{hero.badge}</Badge>
        </div>

        <h1 className="edu-hero-title mx-auto mt-4 max-w-5xl font-black leading-[0.9] tracking-[-0.065em] text-white lg:mx-0">
          {hero.title}
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
            {hero.highlight}
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:mx-0 lg:text-[1.02rem]">
          {hero.desc}
        </p>

        <div className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row lg:mx-0 lg:max-w-none">
          <a
            href="#journey"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-black text-emerald-950 shadow-[0_18px_50px_rgba(250,204,21,0.32)] transition hover:-translate-y-1 hover:bg-yellow-300"
          >
            Jelajahi Pendidikan
            <FaArrowRight />
          </a>

          <a
            href="#values"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
          >
            <FaPlay />
            Lihat Nilai
          </a>
        </div>

        <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
          {stats.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-xl"
            >
              <p className="text-lg font-black text-yellow-300 sm:text-2xl">
                {item.number}
              </p>
              <p className="mt-1 text-[10px] font-bold leading-tight text-emerald-100 sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <Reveal className="hidden lg:block">
        <div className="edu-hero-showcase relative ml-auto w-full max-w-[540px]">
          <div className="absolute -left-5 top-8 h-[82%] w-8 rounded-full bg-yellow-400/90 blur-[1px]" />
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full border border-yellow-300/25" />
          <div className="absolute -bottom-8 right-8 h-40 w-40 rounded-full border border-emerald-300/20" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <SafeImage
                    src={quoteData.bgImage}
                    fallback={quoteData.fallbackImage}
                    alt={quoteData.title}
                    className="edu-hero-preview-new w-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

              <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-950">
                Education Preview
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <FaQuoteLeft className="mb-3 text-2xl text-yellow-300" />

                <p className="max-w-md text-sm leading-relaxed text-emerald-50 xl:text-base">
                  {quoteData.quote}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <h3 className="text-3xl font-black leading-none text-white xl:text-4xl">
                    {quoteData.title}
                  </h3>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                    {getIcon(quoteData.iconKey)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </Container>
</Section>

      <Section
        id="values"
        className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50"
      >
        <BackgroundArt />

        <Container className="flex flex-col justify-center">
          <SectionHeader
            badge="Nilai Pendidikan"
            title="Bukan hanya sekolah, tapi proses pembentukan hidup."
            desc="Pendidikan pesantren membentuk santri melalui keseimbangan ibadah, ilmu, adab, disiplin, dan kemandirian."
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <GlassCard className="h-full p-4 transition duration-500 hover:-translate-y-2 sm:p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300">
                    {getIcon(item.iconKey)}
                  </div>

                  <h3 className="mt-4 text-lg font-black text-emerald-950 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    Core Value
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="journey" dark>
        <BackgroundArt dark />

        <Container className="flex items-center">
          <div className="grid w-full items-start gap-6 lg:grid-cols-[0.62fr_1.38fr]">
            <div>
              <SectionHeader
                dark
                align="left"
                badge="Jenjang Pendidikan"
                title="Pilih perjalanan pendidikan santri."
                desc="Setiap jenjang memiliki fokus pembinaan berbeda, namun tetap berada dalam satu visi: ilmu, adab, karakter, dan masa depan."
              />

              <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
                {education.map((item, index) => (
                  <button
                    key={item.level}
                    onClick={() => setActive(index)}
                    className={`min-w-[126px] rounded-2xl border p-3 text-center transition ${
                      active === index
                        ? "border-yellow-300 bg-yellow-400 text-emerald-950"
                        : "border-white/10 bg-white/10 text-white"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${
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

              <div className="mt-6 hidden gap-3 lg:grid">
                {education.map((item, index) => (
                  <button
                    key={item.level}
                    onClick={() => setActive(index)}
                    className={`group relative overflow-hidden rounded-[1.35rem] border p-3.5 text-left transition xl:p-4 ${
                      active === index
                        ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-xl shadow-yellow-950/20"
                        : "border-white/10 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/15"
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                          active === index
                            ? "bg-emerald-950 text-yellow-300"
                            : "bg-white/10 text-yellow-300"
                        }`}
                      >
                        {getIcon(item.iconKey)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em]">
                          Tahap {item.level}
                        </p>

                        <h3 className="mt-1 truncate text-xl font-black xl:text-2xl">
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
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl"
              >
                <div className={`h-2 bg-gradient-to-r ${activeData.color}`} />

                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="edu-journey-image relative overflow-hidden">
                    <SafeImage
                      src={activeData.bgImage}
                      fallback={activeData.fallbackImage}
                      alt={activeData.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-950">
                      Tahap {activeData.level}
                    </div>

                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="text-sm leading-loose text-yellow-300 sm:text-base">
                        {activeData.arabic}
                      </p>

                      <h3 className="edu-card-title mt-2 font-black leading-none text-white">
                        {activeData.shortTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-emerald-950/90 p-5 lg:p-6 xl:p-7">
                    <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-yellow-300/10 blur-3xl" />

                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-300">
                        Education Level
                      </p>

                      <h2 className="mt-3 edu-detail-title font-black leading-tight text-white">
                        {activeData.title}
                      </h2>

                      <p className="mt-3 text-sm font-bold leading-relaxed text-emerald-200 sm:text-base">
                        {activeData.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-[0.95rem]">
                        {activeData.story}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

                      <div className="mt-5 rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                          Output Pendidikan
                        </p>

                        <h4 className="mt-2 text-base font-black leading-snug text-white sm:text-xl">
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

      <Section
        id="timeline"
        className="bg-gradient-to-b from-white via-[#f4fff7] to-[#dff5e8]"
      >
        <BackgroundArt />

        <Container className="flex flex-col justify-center">
          <SectionHeader
            badge="Alur Perjalanan"
            title="Pendidikan santri berjalan bertahap dan terarah."
            desc="Setiap jenjang dirancang seperti perjalanan: dimulai dari fondasi, dilanjutkan keterampilan, dan diperdalam dengan nilai Al-Qur’an."
          />

          <div className="relative mt-8 grid gap-5 lg:grid-cols-3">
            <div className="absolute left-0 top-[98px] hidden h-1 w-full bg-gradient-to-r from-emerald-200 via-yellow-300 to-emerald-200 lg:block" />

            {education.map((item, index) => (
              <Reveal key={item.level} delay={index * 0.08}>
                <GlassCard className="h-full overflow-hidden">
                  <div className="edu-timeline-image relative overflow-hidden">
                    <SafeImage
                      src={item.bgImage}
                      fallback={item.fallbackImage}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-lg text-emerald-950 shadow-lg">
                      {getIcon(item.iconKey)}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                        Tahap {item.level}
                      </p>

                      <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {item.story}
                    </p>

                    <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                        Dampak
                      </p>

                      <h4 className="mt-2 font-black text-emerald-950">
                        {item.impact}
                      </h4>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="cta" dark>
        <BackgroundArt dark />

        <Container className="flex items-center justify-center text-center">
          <Reveal className="mx-auto w-full max-w-6xl">
            <GlassCard dark className="p-6 sm:p-8 lg:p-10 xl:p-12">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-yellow-400 text-xl text-emerald-950 sm:h-16 sm:w-16 sm:text-2xl"
              >
                <FaMoon />
              </motion.div>

              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300 sm:text-xs">
                Pendidikan adalah perjalanan panjang
              </p>

              <h2 className="edu-section-title mx-auto mt-4 max-w-5xl font-black leading-[0.98] tracking-[-0.055em] text-white">
                Mulai perjalanan santri bersama Al-Furqon.
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                Dari fondasi adab, keterampilan modern, hingga pendalaman
                Al-Qur’an. Setiap langkah diarahkan untuk membentuk pribadi
                yang berilmu, berakhlak, dan siap menghadapi masa depan.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-black text-emerald-950 shadow-[0_18px_45px_rgba(250,204,21,0.28)] transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Daftar Sekarang
                  <FaArrowRight />
                </Link>

                <a
                  href={WHATSAPP_ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
                >
                  <FaWhatsapp />
                  Hubungi Admin
                </a>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

            <Footer />

<style jsx global>{`
  :root {
  --edu-navbar-h: 92px;
  --edu-vh: 100svh;
  --edu-page-x: clamp(0.75rem, 3vw, 4.5rem);
  --edu-section-y: clamp(0.6rem, 1.6vh, 1.2rem);
}

  html,
  body,
  #__next {
    width: 100%;
    min-height: 100%;
    margin: 0;
    overflow-x: hidden !important;
    background: #041b15;
  }

  .edu-page {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    background: #041b15;
  }

  /*
    FIX UTAMA:
    Semua section dibuat 100% layar perangkat.
    Isi di dalamnya ikut mengecil/membesar sesuai ukuran layar.
  */
  .edu-section {
  width: 100%;
  min-height: var(--edu-vh);
  box-sizing: border-box;
  padding-top: var(--edu-section-y);
  padding-bottom: var(--edu-section-y);
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

/* HERO BENAR-BENAR 100% LAYAR */
.edu-hero-section {
  height: var(--edu-vh);
  min-height: var(--edu-vh);
  max-height: var(--edu-vh);
  padding-top: calc(var(--edu-navbar-h) + 0.25rem);
  padding-bottom: 0.5rem;
  overflow: hidden;
}

/* Jarak section selain hero dibuat lebih rapat */
#values,
#journey,
#timeline,
#cta {
  padding-top: clamp(0.8rem, 2vh, 1.5rem);
  padding-bottom: clamp(0.8rem, 2vh, 1.5rem);
}

#values .edu-container,
#journey .edu-container,
#timeline .edu-container,
#cta .edu-container {
  align-items: center;
}

/* Kurangi jarak antara judul section dan isi */
.edu-section .mt-7 {
  margin-top: clamp(1rem, 2vh, 1.6rem) !important;
}

.edu-section .mt-8 {
  margin-top: clamp(1rem, 2vh, 1.7rem) !important;
}

.edu-section .mt-6 {
  margin-top: clamp(0.8rem, 1.6vh, 1.3rem) !important;
}

.edu-section .mt-5 {
  margin-top: clamp(0.7rem, 1.4vh, 1.1rem) !important;
}

.edu-section .mt-4 {
  margin-top: clamp(0.55rem, 1.2vh, 0.9rem) !important;
}

.edu-container {
  width: min(100% - calc(var(--edu-page-x) * 2), 1320px);
  min-width: 0;
  min-height: 0;
  height: 100%;
  margin-inline: auto;
  display: flex;
}

  .edu-hero-layout {
  min-height: 0;
  height: 100%;
  align-items: center;
}

#hero .edu-hero-layout > div {
  min-height: 0;
}

#hero .edu-hero-title {
  margin-top: clamp(0.45rem, 1.2vh, 1rem);
}

#hero p {
  margin-top: clamp(0.65rem, 1.4vh, 1.25rem);
}

#hero .mx-auto.mt-7.flex {
  margin-top: clamp(0.8rem, 2vh, 1.5rem);
}

#hero .mt-7.grid {
  margin-top: clamp(0.8rem, 2vh, 1.5rem);
}

.edu-hero-showcase {
  transform: scale(0.92);
  transform-origin: center right;
}

.edu-hero-preview-new {
  height: clamp(300px, 46vh, 500px);
}

  /*
    Ukuran font dibuat responsif dan tidak terlalu besar,
    jadi tidak kepotong pada laptop kecil, tablet, dan HP.
  */
  .edu-hero-title {
    font-size: clamp(2.1rem, 7.2vw, 6.2rem);
  }

  .edu-section-title {
    font-size: clamp(1.9rem, 4.8vw, 4.6rem);
  }

  .edu-detail-title {
    font-size: clamp(1.65rem, 3.7vw, 3.6rem);
  }

  .edu-card-title {
    font-size: clamp(2rem, 5.4vw, 4.5rem);
  }

  .edu-hero-preview-new {
    height: clamp(320px, 50vh, 560px);
  }

  .edu-journey-image {
    min-height: clamp(260px, 42vh, 520px);
  }

  .edu-timeline-image {
    height: clamp(210px, 29vh, 320px);
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /*
    Supaya kalau isi terlalu panjang di layar kecil,
    section tetap 100% layar minimum,
    tapi tidak memotong konten.
  */
  .edu-section > .edu-container {
    overflow: visible;
  }

  .edu-page img {
    max-width: 100%;
  }

  .edu-page h1,
  .edu-page h2,
  .edu-page h3,
  .edu-page p {
    word-break: normal;
    overflow-wrap: anywhere;
  }

  .edu-page a,
  .edu-page button {
    -webkit-tap-highlight-color: transparent;
  }

  @media (min-width: 1025px) and (max-height: 900px) {
  .edu-hero-section {
    height: var(--edu-vh);
    min-height: var(--edu-vh);
    max-height: var(--edu-vh);
    padding-top: calc(var(--edu-navbar-h) + 0.35rem);
    padding-bottom: 0.5rem;
  }

  #hero .edu-hero-title {
    font-size: clamp(2.5rem, 5.9vw, 5.2rem);
  }

  #hero p {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  #hero .edu-hero-layout {
    gap: 1rem;
  }

  #hero .mx-auto.mt-7.flex {
    margin-top: 1rem;
  }

  #hero .mt-7.grid {
    margin-top: 1rem;
  }

  .edu-hero-showcase {
    transform: scale(0.86);
  }

  .edu-hero-preview-new {
    height: clamp(280px, 42vh, 420px);
  }
}

  @media (max-width: 1280px) {
    :root {
      --edu-page-x: clamp(1rem, 2.5vw, 2.5rem);
      --edu-section-y: clamp(1rem, 2.5vh, 2rem);
    }

    .edu-hero-title {
      font-size: clamp(2.2rem, 6.7vw, 5.5rem);
    }

    .edu-section-title {
      font-size: clamp(1.9rem, 4.4vw, 4rem);
    }

    .edu-hero-preview-new {
      height: clamp(300px, 46vh, 500px);
    }
  }

  @media (max-width: 1024px) {
    :root {
      --edu-page-x: 1rem;
      --edu-section-y: 2.3rem;
    }

    .edu-section {
  min-height: var(--edu-vh);
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
}

    .edu-hero-section {
      min-height: var(--edu-vh);
      padding-top: calc(var(--edu-navbar-h) + 1rem);
      padding-bottom: 2rem;
    }

    .edu-container {
      width: min(100% - 2rem, 940px);
    }

    .edu-hero-layout {
      grid-template-columns: 1fr !important;
      align-content: center;
    }

    #hero .edu-container {
      align-items: center;
    }

    #journey .edu-container,
    #values .edu-container,
    #timeline .edu-container,
    #cta .edu-container {
      align-items: center;
    }

    #journey .grid {
      gap: 1.2rem;
    }

    .edu-hero-title {
      font-size: clamp(2.2rem, 9vw, 4.7rem);
    }

    .edu-section-title {
      font-size: clamp(1.9rem, 7vw, 3.4rem);
    }
  }

  @media (max-width: 768px) {
    :root {
      --edu-page-x: 0.8rem;
      --edu-section-y: 2rem;
    }

    .edu-section {
  min-height: var(--edu-vh);
  padding-top: 1rem;
  padding-bottom: 1rem;
}

    .edu-hero-section {
      min-height: var(--edu-vh);
      padding-top: calc(var(--edu-navbar-h) + 0.8rem);
      padding-bottom: 1.8rem;
    }

    .edu-container {
      width: calc(100% - 1.2rem);
    }

    .edu-hero-title {
      font-size: clamp(2rem, 11vw, 3.45rem);
      line-height: 0.92;
      letter-spacing: -0.055em;
    }

    .edu-section-title {
      font-size: clamp(1.75rem, 8.5vw, 2.9rem);
      line-height: 1;
      letter-spacing: -0.045em;
    }

    .edu-detail-title {
      font-size: clamp(1.5rem, 7.5vw, 2.35rem);
      line-height: 1.05;
    }

    .edu-card-title {
      font-size: clamp(2rem, 11vw, 3rem);
    }

    .edu-page p {
      font-size: 0.88rem;
      line-height: 1.6;
    }

    #hero .edu-container {
      align-items: center;
    }

    #hero .edu-hero-layout {
      gap: 1rem;
    }

    #hero .mt-7.grid {
      width: 100%;
      max-width: 100%;
      gap: 0.55rem;
    }

    #hero .mt-7.grid > div {
      padding: 0.65rem 0.4rem;
      border-radius: 1rem;
    }

    #journey .rounded-\\[1\\.6rem\\] {
      border-radius: 1.2rem;
    }

    #journey .grid.lg\\:grid-cols-\\[0\\.82fr_1\\.18fr\\] {
      display: grid;
      grid-template-columns: 1fr;
    }

    #journey .bg-emerald-950\\/90 {
      padding: 1.1rem;
    }

    #journey .sm\\:grid-cols-2 {
      grid-template-columns: 1fr;
    }

    .edu-journey-image {
      min-height: 250px;
    }

    .edu-timeline-image {
      height: 220px;
    }
  }

  @media (max-width: 480px) {
    :root {
      --edu-page-x: 0.55rem;
      --edu-section-y: 1.6rem;
    }

    .edu-section {
  min-height: var(--edu-vh);
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}

    .edu-hero-section {
      min-height: var(--edu-vh);
      padding-top: calc(var(--edu-navbar-h) + 0.5rem);
      padding-bottom: 1.5rem;
    }

    .edu-container {
      width: calc(100% - 0.8rem);
    }

    .edu-hero-title {
      font-size: clamp(1.85rem, 12vw, 2.7rem);
      line-height: 0.94;
    }

    .edu-section-title {
      font-size: clamp(1.6rem, 9vw, 2.25rem);
    }

    .edu-detail-title {
      font-size: clamp(1.45rem, 8vw, 2rem);
    }

    .edu-page p {
      font-size: 0.8rem;
      line-height: 1.58;
    }

    .edu-page .rounded-full {
      max-width: 100%;
    }

    .edu-page .tracking-\\[0\\.3em\\],
    .edu-page .tracking-\\[0\\.28em\\],
    .edu-page .tracking-\\[0\\.24em\\],
    .edu-page .tracking-\\[0\\.22em\\],
    .edu-page .tracking-\\[0\\.18em\\] {
      letter-spacing: 0.11em;
    }

    #hero .inline-flex.rounded-full {
      font-size: 0.66rem;
      line-height: 1.45;
      padding: 0.5rem 0.75rem;
    }

    #hero .mx-auto.mt-7.flex {
      width: 100%;
      margin-top: 1.2rem;
    }

    #hero .mx-auto.mt-7.flex a {
      width: 100%;
      padding: 0.8rem 1rem;
      font-size: 0.76rem;
    }

    #hero .mt-7.grid {
      grid-template-columns: 1fr;
      margin-top: 1.2rem;
    }

    #values .grid,
    #timeline .grid {
      gap: 0.8rem;
    }

    #journey .no-scrollbar {
      margin-inline: -0.25rem;
      padding-inline: 0.25rem;
    }

    #journey .no-scrollbar button {
      min-width: 106px;
      padding: 0.7rem;
    }

    #journey .edu-journey-image {
      min-height: 220px;
    }

    #journey .absolute.bottom-0.left-0.p-5 {
      padding: 1rem;
    }

    #journey .mt-5.grid {
      gap: 0.55rem;
    }

    #journey .mt-5.grid > div {
      border-radius: 1rem;
      padding: 0.75rem;
    }

    #cta .p-6 {
      padding: 1.15rem;
    }

    #cta a {
      width: 100%;
    }
  }

  @media (max-width: 380px) {
    .edu-section {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    .edu-container {
      width: calc(100% - 0.5rem);
    }

    .edu-hero-title {
      font-size: 2rem;
    }

    .edu-section-title {
      font-size: 1.68rem;
    }

    .edu-page p {
      font-size: 0.76rem;
    }

    #journey .no-scrollbar button {
      min-width: 94px;
    }

    #journey .edu-journey-image {
      min-height: 205px;
    }
  }

  @media (max-height: 720px) and (min-width: 769px) {

  #hero .edu-hero-title {
  font-size: clamp(2rem, 5.4vw, 4.4rem);
}

#hero p {
  font-size: 0.9rem;
  line-height: 1.55;
}

#hero .inline-flex.rounded-full {
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}

#hero .mx-auto.mt-7.flex a {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

#hero .mt-7.grid > div {
  padding: 0.55rem;
}

.edu-hero-showcase {
  transform: scale(0.84);
}

.edu-hero-preview-new {
  height: clamp(260px, 40vh, 380px);
}
    .edu-section {
      min-height: var(--edu-vh);
      padding-top: 1.2rem;
      padding-bottom: 1.2rem;
    }

    .edu-hero-section {
  height: var(--edu-vh);
  min-height: var(--edu-vh);
  max-height: var(--edu-vh);
  padding-top: calc(var(--edu-navbar-h) + 0.25rem);
  padding-bottom: 0.45rem;
}

    .edu-hero-title {
      font-size: clamp(2.1rem, 6vw, 5rem);
    }

    .edu-section-title {
      font-size: clamp(1.8rem, 4.2vw, 3.8rem);
    }

    .edu-hero-preview-new {
      height: clamp(290px, 44vh, 440px);
    }

    .edu-journey-image {
      min-height: clamp(230px, 38vh, 440px);
    }

    .edu-timeline-image {
      height: clamp(190px, 27vh, 280px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }
`}</style>
    </main>
  );
}