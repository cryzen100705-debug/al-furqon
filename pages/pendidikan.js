"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
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

function ProgressBar({ sections = [], activeSection = 0, activeStep = 0 }) {
  const totalSteps =
    sections.reduce((sum, item) => sum + Number(item.total || 1), 0) || 1;

  const safeActiveSection = Math.min(
    Math.max(activeSection, 0),
    sections.length - 1
  );

  const passed = sections
    .slice(0, safeActiveSection)
    .reduce((sum, item) => sum + Number(item.total || 1), 0);

  const currentSectionTotal = Number(
    sections[safeActiveSection]?.total || 1
  );

  const safeStep = Math.min(Math.max(activeStep, 0), currentSectionTotal - 1);

  const progress = ((passed + safeStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed bottom-0 left-0 z-[260] w-full">
      <div className="h-1.5 w-full bg-emerald-950/25 backdrop-blur-md">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.38, ease: EASE }}
          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-emerald-300 shadow-[0_0_20px_rgba(250,204,21,0.75)]"
        />
      </div>

      <div className="pointer-events-none h-[env(safe-area-inset-bottom)] bg-emerald-950/20" />
    </div>
  );
}

function SideDots({
  sections = [],
  activeSection = 0,
  activeStep = 0,
  jumpToSection,
}) {
  return (
    <div className="fixed right-5 top-1/2 z-[260] hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {sections.map((section, index) => (
        <button
          key={section.key}
          type="button"
          onClick={() => jumpToSection(index)}
          className="group flex items-center justify-end gap-3"
        >
          <span className="rounded-full bg-emerald-950/85 px-3 py-1 text-[11px] font-black text-yellow-300 opacity-0 shadow-xl backdrop-blur transition group-hover:opacity-100">
            {section.label}
            {activeSection === index && Number(section.total || 1) > 1
              ? ` ${activeStep + 1}/${section.total}`
              : ""}
          </span>

          <span
            className={`h-3 w-3 rounded-full border transition ${
              activeSection === index
                ? "scale-150 border-yellow-300 bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                : "border-white/30 bg-white/20"
            }`}
          />
        </button>
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
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const lockRef = useRef(false);
  const touchStartY = useRef(0);
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

  const sections = useMemo(
  () => [
    { key: "hero", label: "Pendidikan", total: 1 },
    { key: "values", label: "Nilai", total: 1 },
    { key: "journey", label: "Jenjang", total: 1 },
    { key: "timeline", label: "Alur", total: 1 },
    { key: "cta", label: "Daftar", total: 1 },
  ],
  []
);

const activeStep = 0;

const jumpToSection = (index) => {
  if (index < 0 || index >= sections.length) return;

  const target = document.getElementById(sections[index]?.key);
  if (!target) return;

  lockRef.current = true;
  setActiveSectionIndex(index);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  window.setTimeout(() => {
    lockRef.current = false;
  }, 780);
};

useEffect(() => {
  if (!sections.length) return;

  const isInteractiveElement = (target) => {
    if (!target?.closest) return false;

    return Boolean(
      target.closest(
        "button, input, textarea, select, [role='button'], [data-no-section-swipe='true']"
      )
    );
  };

  const getActiveSection = () => {
    return document.getElementById(sections[activeSectionIndex]?.key);
  };

  const getActiveContainer = () => {
    return getActiveSection()?.querySelector(".edu-container") || null;
  };

  const canScrollInsideSection = (direction) => {
    const section = getActiveSection();
    const container = getActiveContainer();

    if (!section || !container) return false;

    /*
      HERO jangan dibuat scroll internal.
      Kalau user scroll di hero, langsung pindah ke section berikutnya.
    */
    if (section.id === "hero") return false;

    const maxScroll = container.scrollHeight - container.clientHeight;

    if (maxScroll <= 12) return false;

    if (direction > 0) {
      return container.scrollTop < maxScroll - 6;
    }

    return container.scrollTop > 6;
  };

  const moveSection = (direction) => {
    if (lockRef.current) return;

    const nextIndex =
      direction > 0
        ? Math.min(activeSectionIndex + 1, sections.length - 1)
        : Math.max(activeSectionIndex - 1, 0);

    if (nextIndex === activeSectionIndex) return;

    jumpToSection(nextIndex);
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 10) return;
    if (isInteractiveElement(event.target)) return;

    const direction = event.deltaY > 0 ? 1 : -1;

    if (canScrollInsideSection(direction)) {
      return;
    }

    event.preventDefault();
    moveSection(direction);
  };

  const handleKeyDown = (event) => {
    const downKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
    const upKeys = ["ArrowUp", "PageUp"];

    if (![...downKeys, ...upKeys].includes(event.key)) return;

    const direction = downKeys.includes(event.key) ? 1 : -1;

    if (canScrollInsideSection(direction)) {
      return;
    }

    event.preventDefault();
    moveSection(direction);
  };

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches?.[0]?.clientY || 0;
  };

  const handleTouchMove = (event) => {
    if (isInteractiveElement(event.target)) return;

    const currentY = event.touches?.[0]?.clientY || 0;
    const diff = touchStartY.current - currentY;

    if (Math.abs(diff) < 10) return;

    const direction = diff > 0 ? 1 : -1;

    if (canScrollInsideSection(direction)) {
      return;
    }

    event.preventDefault();
  };

  const handleTouchEnd = (event) => {
    if (isInteractiveElement(event.target)) return;

    const touchEndY = event.changedTouches?.[0]?.clientY || 0;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) < 52) return;

    const direction = diff > 0 ? 1 : -1;

    if (canScrollInsideSection(direction)) {
      return;
    }

    moveSection(direction);
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeyDown, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });

  return () => {
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [activeSectionIndex, sections]);

  useEffect(() => {
    if (!education?.length) return;

    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % education.length);
    }, 3900);

    return () => clearInterval(interval);
  }, [education]);

  useEffect(() => {
  if (!sections.length) return;

  const handleScroll = () => {
    if (lockRef.current) return;

    const viewportMiddle = window.innerHeight / 2;
    let currentIndex = 0;

    sections.forEach((section, index) => {
      const element = document.getElementById(section.key);

      if (!element) return;

      const rect = element.getBoundingClientRect();

      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        currentIndex = index;
      }
    });

    setActiveSectionIndex(currentIndex);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
}, [sections]);

  if (loading) return <LoadingPage />;

  return (
  <main className="edu-page edu-home-mode overflow-x-hidden bg-[#041b15] text-emerald-950">
    <Navbar />

    <ProgressBar
      sections={sections}
      activeSection={activeSectionIndex}
      activeStep={activeStep}
    />

    <SideDots
      sections={sections}
      activeSection={activeSectionIndex}
      activeStep={activeStep}
      jumpToSection={jumpToSection}
    />

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

  <Container className="flex items-center justify-center">

    <div className="edu-hero-layout grid w-full items-center gap-4 lg:grid-cols-[1.05fr_0.95fr]">
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
          <button
  type="button"
  onClick={() => jumpToSection(2)}
  className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-black text-emerald-950 shadow-[0_18px_50px_rgba(250,204,21,0.32)] transition hover:-translate-y-1 hover:bg-yellow-300"
>
  Jelajahi Pendidikan
  <FaArrowRight />
</button>

          <button
  type="button"
  onClick={() => jumpToSection(1)}
  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
>
  <FaPlay />
  Lihat Nilai
</button>
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
          <div className="grid w-full items-center gap-4 lg:grid-cols-[0.78fr_1.22fr]">
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
                    className={`group relative overflow-hidden rounded-[1.15rem] border p-3 text-left transition xl:p-3.5 ${
                      active === index
                        ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-xl shadow-yellow-950/20"
                        : "border-white/10 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/15"
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${
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

                        <h3 className="mt-1 truncate text-lg font-black xl:text-xl">
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

                  <div className="relative overflow-hidden bg-emerald-950/90 p-4 lg:p-5 xl:p-5">
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
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-2.5"
                          >
                            <FaCheckCircle className="shrink-0 text-yellow-300" />
                            <span className="text-sm font-semibold text-white">
                              {focus}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-3.5">
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

    </main>
  );
}