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
  FaAward,
  FaBookOpen,
  FaCampground,
  FaCheckCircle,
  FaChevronDown,
  FaGraduationCap,
  FaHandshake,
  FaHeart,
  FaLayerGroup,
  FaListUl,
  FaMosque,
  FaPlay,
  FaQuran,
  FaRedo,
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

const FALLBACK_IMAGE = "/hero-santri.jpg";
const EASE = [0.22, 1, 0.36, 1];

const ADMIN_WHATSAPP_NUMBER = "6283899601027";
const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai program pesantren.";
const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const DEFAULT_PROGRAM_PAGE = {
  hero: {
    badge: "Program Unggulan Pesantren",
    title: "Bukan sekadar kegiatan.",
    highlight: "Ini ruang tumbuh santri.",
    desc: "Program pembinaan Al-Furqon dirancang untuk membangun keberanian, adab, kreativitas, kedisiplinan, dan kemandirian santri dalam lingkungan pesantren.",
    arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا",
    source: "QS. At-Talaq: 2",
    image: "/hero-santri.jpg",
  },
  stats: [
    { value: "24 Jam", label: "Pembinaan", iconKey: "shield" },
    { value: "4+", label: "Program Aktif", iconKey: "layer" },
    { value: "100+", label: "Santri", iconKey: "users" },
    { value: "Terarah", label: "Pendampingan", iconKey: "star" },
  ],
  programs: [
    {
      title: "Hadroh",
      subtitle: "Seni Islami & Sholawat",
      tag: "Program Unggulan",
      desc: "Melatih kekompakan, keberanian tampil, dan kecintaan kepada sholawat.",
      longDesc:
        "Santri dilatih tampil percaya diri dalam kegiatan pesantren, acara keagamaan, dan perlombaan. Program ini membentuk disiplin, kekompakan, adab, serta keberanian di depan umum.",
      image: "/hero-santri.jpg",
      iconKey: "mosque",
      features: ["Rebana", "Sholawat", "Kompak", "Percaya Diri"],
    },
    {
      title: "MTQ",
      subtitle: "Tilawah Qur'an",
      tag: "Program Qur'an",
      desc: "Membina bacaan Al-Qur'an, tajwid, makharijul huruf, dan irama.",
      longDesc:
        "Program MTQ membantu santri memperbaiki bacaan Al-Qur'an melalui pembinaan tajwid, makharijul huruf, irama tilawah, dan adab membaca Al-Qur'an.",
      image: "/kegiatan-1.jpg",
      iconKey: "quran",
      features: ["Tajwid", "Tilawah", "Irama", "Makharijul Huruf"],
    },
    {
      title: "Pramuka",
      subtitle: "Mandiri & Disiplin",
      tag: "Karakter Santri",
      desc: "Membentuk santri yang mandiri, disiplin, berani, dan bertanggung jawab.",
      longDesc:
        "Pramuka menjadi ruang latihan karakter santri melalui kegiatan lapangan, kerja sama, kepemimpinan, kedisiplinan, dan keberanian menyelesaikan tantangan.",
      image: "/kegiatan-2.jpg",
      iconKey: "camp",
      features: ["Disiplin", "Mandiri", "Tanggung Jawab", "Kerja Sama"],
    },
    {
      title: "Tahfidz Qur'an",
      subtitle: "Hafalan Qur'an",
      tag: "Pembinaan Qur'an",
      desc: "Membimbing santri membaca, menghafal, dan menjaga hafalan Al-Qur'an.",
      longDesc:
        "Tahfidz Qur'an membimbing santri untuk membangun kedekatan dengan Al-Qur'an melalui hafalan bertahap, murajaah, adab Qur'an, dan pembiasaan membaca setiap hari.",
      image: "/masjid.jpg",
      iconKey: "book",
      features: ["Hafalan", "Murajaah", "Adab Qur'an", "Setoran"],
    },
  ],
  timeline: [
    {
      number: "01",
      title: "Masuk ke Lingkungan",
      desc: "Santri dikenalkan dengan suasana pesantren, aturan, dan budaya kegiatan.",
    },
    {
      number: "02",
      title: "Mulai Pembiasaan",
      desc: "Santri mengikuti latihan rutin agar terbentuk disiplin dan tanggung jawab.",
    },
    {
      number: "03",
      title: "Didampingi Pembina",
      desc: "Pembina mengarahkan adab, kemampuan, keberanian, dan ketertiban santri.",
    },
    {
      number: "04",
      title: "Tumbuh Percaya Diri",
      desc: "Santri mulai berani tampil, mandiri, dan aktif dalam kegiatan pesantren.",
    },
  ],
  gallery: [
    "/hero-santri.jpg",
    "/kegiatan-1.jpg",
    "/kegiatan-2.jpg",
    "/masjid.jpg",
    "/smk.jpg",
    "/hero-santri.jpg",
  ],
  advantages: [
    {
      title: "Tidak Pasif",
      desc: "Santri tidak hanya duduk belajar, tetapi ikut aktif membangun kemampuan diri.",
      iconKey: "award",
    },
    {
      title: "Dekat dengan Adab",
      desc: "Setiap kegiatan tetap diarahkan agar sesuai dengan nilai pesantren.",
      iconKey: "heart",
    },
    {
      title: "Berani Tampil",
      desc: "Program membantu santri percaya diri berbicara, tampil, dan bekerja sama.",
      iconKey: "users",
    },
  ],
  faq: [
    {
      q: "Apakah semua santri bisa ikut program?",
      a: "Ya. Santri dapat mengikuti program sesuai jadwal, minat, kemampuan, dan arahan pembina.",
    },
    {
      q: "Apakah program hanya kegiatan tambahan?",
      a: "Tidak. Program juga menjadi bagian dari pembinaan karakter, adab, disiplin, dan keberanian santri.",
    },
    {
      q: "Apakah program dibimbing pembina?",
      a: "Ya. Setiap kegiatan tetap diarahkan oleh pembina agar berjalan tertib dan sesuai nilai pesantren.",
    },
  ],
};

function getIcon(key) {
  const icons = {
    mosque: <FaMosque />,
    quran: <FaQuran />,
    camp: <FaCampground />,
    campground: <FaCampground />,
    users: <FaUsers />,
    book: <FaBookOpen />,
    award: <FaAward />,
    hands: <FaHandshake />,
    shield: <FaShieldAlt />,
    graduate: <FaGraduationCap />,
    star: <FaStar />,
    heart: <FaHeart />,
    layer: <FaLayerGroup />,
  };

  return icons[key] || <FaStar />;
}

function normalizeProgramPage(data) {
  const source = data || {};
  const fallbackPrograms = DEFAULT_PROGRAM_PAGE.programs;

  const rawPrograms =
    Array.isArray(source.programs) && source.programs.length
      ? source.programs
      : fallbackPrograms;

  const programs = rawPrograms.map((item, index) => {
    const fallback = fallbackPrograms[index % fallbackPrograms.length];

    return {
      ...fallback,
      ...item,
      title: item?.title || fallback.title,
      subtitle: item?.subtitle || item?.tag || fallback.subtitle,
      tag: item?.tag || fallback.tag,
      desc: item?.desc || fallback.desc,
      longDesc: item?.longDesc || item?.desc || fallback.longDesc,
      image: item?.image || fallback.image,
      iconKey: item?.iconKey || fallback.iconKey,
      features:
        Array.isArray(item?.features) && item.features.length
          ? item.features
          : fallback.features,
    };
  });

  return {
    hero: {
      ...DEFAULT_PROGRAM_PAGE.hero,
      ...(source.hero || {}),
    },
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
        : DEFAULT_PROGRAM_PAGE.stats,
    programs,
    timeline:
      Array.isArray(source.timeline) && source.timeline.length
        ? source.timeline
        : DEFAULT_PROGRAM_PAGE.timeline,
    gallery:
      Array.isArray(source.gallery) && source.gallery.length
        ? source.gallery
        : DEFAULT_PROGRAM_PAGE.gallery,
    advantages:
      Array.isArray(source.advantages) && source.advantages.length
        ? source.advantages
        : DEFAULT_PROGRAM_PAGE.advantages,
    faq:
      Array.isArray(source.faq) && source.faq.length
        ? source.faq
        : DEFAULT_PROGRAM_PAGE.faq,
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
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.05]" />

      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(circle_at_20%_15%,rgba(250,204,21,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.12),transparent_32%)]"
            : "bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(250,204,21,0.22),transparent_32%)]"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, 12, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -left-28 top-24 h-72 w-72 rounded-full border ${
          dark
            ? "border-yellow-300/15 bg-yellow-300/5"
            : "border-emerald-900/10 bg-emerald-300/15"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, -12, 0],
                scale: [1, 1.07, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-32 bottom-16 h-[28rem] w-[28rem] rounded-full border ${
          dark
            ? "border-emerald-300/15 bg-emerald-300/5"
            : "border-yellow-500/10 bg-yellow-300/15"
        }`}
      />
    </div>
  );
}

function LoadingPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#041b15] text-white">
      <BackgroundArt dark />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative z-10 px-6 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-yellow-300/25 bg-yellow-300/10 text-3xl text-yellow-300">
          <FaListUl />
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.34em] text-yellow-300">
          Loading Program
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-5xl">
          Memuat tampilan...
        </h1>
      </motion.div>
    </main>
  );
}

function MaintenancePage({ onRetry, checking }) {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#041b15] px-6 text-center text-white">
      <BackgroundArt dark />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-yellow-300/25 bg-yellow-300/10 text-3xl text-yellow-300">
          <FaRedo />
        </div>

        <h1 className="mt-6 text-3xl font-black text-yellow-300 sm:text-5xl">
          Program belum dapat dimuat
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base">
          Data program belum berhasil dibaca dari backend. Tekan tombol di bawah
          untuk mencoba kembali.
        </p>

        <button
          onClick={onRetry}
          disabled={checking}
          className="mt-6 rounded-full bg-yellow-400 px-7 py-3.5 font-black text-emerald-950 transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {checking ? "Mengecek..." : "Coba Lagi"}
        </button>
      </div>
    </main>
  );
}

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
      className="fixed left-0 top-0 z-[9999] h-1.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-300"
    />
  );
}

function Section({ children, dark = false, id = "", className = "" }) {
  return (
    <section
      id={id}
      className={`program-section relative w-full overflow-hidden ${
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
      className={`program-container relative z-10 mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, dark = false }) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] sm:text-xs ${
        dark
          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
          : "border-emerald-200 bg-white/85 text-emerald-800 shadow-sm"
      }`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProgramHeader({ badge, title, desc, dark = false, align = "center" }) {
  return (
    <Reveal>
      <div
        className={`${
          align === "center" ? "mx-auto text-center" : "text-left"
        } max-w-5xl`}
      >
        <Badge dark={dark}>{badge}</Badge>

        <h2
          className={`program-section-title mt-5 font-black leading-[0.96] tracking-[-0.055em] ${
            dark ? "text-white" : "text-emerald-950"
          }`}
        >
          {title}
        </h2>

        {desc && (
          <p
            className={`mt-5 max-w-3xl text-sm leading-relaxed sm:text-base lg:text-lg ${
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
      className={`group relative overflow-hidden rounded-[2rem] border shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        dark
          ? "border-white/10 bg-white/10 text-white"
          : "border-emerald-100 bg-white/85 text-emerald-950"
      } ${className}`}
    >
      <div
        className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition duration-700 group-hover:scale-125 ${
          dark ? "bg-yellow-300/10" : "bg-yellow-300/20"
        }`}
      />
      <div
        className={`absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl ${
          dark ? "bg-emerald-300/10" : "bg-emerald-300/20"
        }`}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ChapterRail() {
  const items = [
    ["01", "Hero", "#program-hero"],
    ["02", "Lab", "#program-lab"],
    ["03", "Peta", "#program-map"],
    ["04", "Galeri", "#program-gallery"],
    ["05", "FAQ", "#program-faq"],
  ];

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
      <div className="pointer-events-auto rounded-[1.7rem] border border-white/10 bg-emerald-950/80 p-3 shadow-2xl backdrop-blur-xl">
        <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.26em] text-yellow-300">
          Chapter
        </p>

        <div className="space-y-2">
          {items.map(([number, label, href]) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/15"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 text-[10px] font-black text-emerald-950">
                {number}
              </span>
              <span className="text-xs font-black text-white">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Program() {
  const [programPage, setProgramPage] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [activeProgram, setActiveProgram] = useState(0);
  const [currentGallery, setCurrentGallery] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const { scrollY } = useScroll();

  const heroImageScale = useTransform(scrollY, [0, 900], [1, 1.12]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 55]);
  const overlayOpacity = useTransform(scrollY, [0, 900], [0.42, 0.82]);

  const fetchProgramData = async () => {
    try {
      setChecking(true);
      setMaintenance(false);

      const endpoint = `${API_URL}/api/program`;

      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data program tidak valid");
      }

      setProgramPage(normalizeProgramPage(result.data));
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
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.style.setProperty("overflow", "auto", "important");
    html.style.setProperty("height", "auto", "important");

    body.style.setProperty("overflow", "auto", "important");
    body.style.setProperty("height", "auto", "important");

    if (next) {
      next.style.setProperty("overflow", "visible", "important");
      next.style.setProperty("height", "auto", "important");
    }

    return () => {
      html.style.removeProperty("overflow");
      html.style.removeProperty("height");

      body.style.removeProperty("overflow");
      body.style.removeProperty("height");

      if (next) {
        next.style.removeProperty("overflow");
        next.style.removeProperty("height");
      }
    };
  }, []);

  useEffect(() => {
    fetchProgramData();
  }, []);

  const data = useMemo(() => normalizeProgramPage(programPage), [programPage]);
  const { hero, programs, stats, timeline, gallery, advantages, faq } = data;
  const active = programs[activeProgram] || programs[0];

  useEffect(() => {
    if (!gallery?.length) return;

    const interval = setInterval(() => {
      setCurrentGallery((prev) => (prev + 1) % gallery.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [gallery]);

  if (loading) return <LoadingPage />;

  if (maintenance || !programPage) {
    return <MaintenancePage onRetry={fetchProgramData} checking={checking} />;
  }

  return (
    <main className="program-page overflow-x-hidden bg-[#f7f1df] text-emerald-950">
      <ScrollProgress />
      <Navbar />
      <ChapterRail />

      {/* HERO EDITORIAL */}
      <Section id="program-hero" dark>
        <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
          <SafeImage
            src={hero.image}
            alt="Program Pesantren Al-Furqon"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-[#041b15] via-[#062d22]/95 to-[#0d4f38]/45"
        />
        <div className="absolute inset-0 bg-black/48" />
        <BackgroundArt dark />

        <Container
          style={{ y: heroTextY }}
          className="flex min-h-[100svh] items-center"
        >
          <div className="grid w-full items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, ease: EASE }}
              className="max-w-5xl"
            >
              <Badge dark>{hero.badge}</Badge>

              <h1 className="program-hero-title mt-5 font-black leading-[0.92] tracking-[-0.065em] text-white">
                {hero.title}
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:text-xl">
                {hero.desc}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href="#program-lab"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-4 text-sm font-black text-emerald-950 shadow-[0_18px_50px_rgba(250,204,21,0.32)] transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Masuk Program Lab
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </a>

                <a
                  href="#program-gallery"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
                >
                  <FaPlay />
                  Lihat Galeri
                </a>
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl md:max-w-xl">
                <p className="text-xl leading-loose text-yellow-300 sm:text-2xl">
                  {hero.arabic}
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100">
                  {hero.source}
                </p>
              </div>
            </motion.div>

            <Reveal className="hidden lg:block">
              <div className="program-poster relative ml-auto max-w-xl">
                <div className="absolute -left-8 top-8 hidden h-[88%] w-10 rounded-full bg-yellow-400 xl:block" />

                <GlassCard dark className="rotate-[1.2deg] p-4">
                  <div className="relative overflow-hidden rounded-[1.7rem]">
                    <SafeImage
                      src={gallery[currentGallery]}
                      alt="Preview Program"
                      className="program-hero-preview w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-950">
                      Program Frame
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                        Bukan layout biasa
                      </p>
                      <h3 className="mt-2 text-4xl font-black leading-tight text-white">
                        Kegiatan santri dibuat seperti cerita perjalanan.
                      </h3>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* STATS STRIP */}
      <Section className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50">
        <BackgroundArt />

        <Container className="flex min-h-[72svh] flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <ProgramHeader
              align="left"
              badge="Ringkasan Program"
              title="Setiap aktivitas punya tujuan pembinaan."
              desc="Bukan hanya banyak kegiatan, tetapi kegiatan yang diarahkan untuk membentuk karakter santri."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((item, index) => (
                <Reveal key={`${item.label}-${index}`} delay={index * 0.05}>
                  <div className="program-stat-card rounded-[1.7rem] border border-emerald-100 bg-white/80 p-5 shadow-xl backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                          {item.label}
                        </p>
                        <h3 className="mt-2 text-4xl font-black tracking-[-0.06em] text-emerald-950">
                          {item.value}
                        </h3>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 text-2xl text-yellow-300">
                        {getIcon(item.iconKey)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* PROGRAM LAB */}
      <Section id="program-lab" dark>
        <BackgroundArt dark />

        <Container className="flex min-h-[100svh] items-center">
          <div className="grid w-full gap-7 xl:grid-cols-[0.72fr_1.28fr]">
            <div>
              <ProgramHeader
                dark
                align="left"
                badge="Program Lab"
                title="Pilih program, lihat sorotannya."
                desc="Tampilan dibuat seperti ruang eksplorasi, bukan daftar card biasa."
              />

              <div className="mt-7 grid gap-3">
                {programs.map((item, index) => {
                  const activeItem = activeProgram === index;

                  return (
                    <button
                      key={`${item.title}-${index}`}
                      onClick={() => setActiveProgram(index)}
                      className={`group relative overflow-hidden rounded-[1.6rem] border p-4 text-left transition duration-500 ${
                        activeItem
                          ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-[0_20px_60px_rgba(250,204,21,0.22)]"
                          : "border-white/10 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-1 hover:border-yellow-300/50 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition ${
                            activeItem
                              ? "bg-emerald-950 text-yellow-300"
                              : "bg-white/10 text-yellow-300 group-hover:bg-yellow-400 group-hover:text-emerald-950"
                          }`}
                        >
                          {getIcon(item.iconKey)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                              activeItem
                                ? "text-emerald-900"
                                : "text-yellow-300"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")} •{" "}
                            {item.subtitle}
                          </p>

                          <h3 className="mt-1 truncate text-xl font-black sm:text-2xl">
                            {item.title}
                          </h3>
                        </div>

                        <FaArrowRight
                          className={`hidden transition sm:block ${
                            activeItem
                              ? "translate-x-1"
                              : "group-hover:translate-x-1"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgram}
                initial={{ opacity: 0, x: 44, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -44, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <GlassCard dark className="p-4 sm:p-5">
                  <div className="relative overflow-hidden rounded-[1.6rem]">
                    <SafeImage
                      src={active.image}
                      alt={active.title}
                      className="program-feature-image w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-950 sm:left-6 sm:top-6">
                      {active.tag}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300">
                        {active.subtitle}
                      </p>

                      <h3 className="program-card-title mt-2 font-black leading-[0.92] tracking-[-0.06em] text-white">
                        {active.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
                    <div>
                      <p className="text-sm font-semibold leading-relaxed text-emerald-50 sm:text-base">
                        {active.longDesc}
                      </p>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href="/pendaftaran"
                          className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-6 py-3 text-sm font-black text-emerald-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                        >
                          Daftar Sekarang
                          <FaArrowRight />
                        </Link>

                        <a
                          href={WHATSAPP_ADMIN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/20"
                        >
                          <FaWhatsapp />
                          Tanya Admin
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {active.features.map((feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center"
                        >
                          <FaCheckCircle className="mx-auto text-xl text-yellow-300" />

                          <p className="mt-2 text-sm font-black text-white">
                            {feature}
                          </p>

                          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-100/70">
                            Fokus {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </Section>

      {/* MAP */}
      <Section id="program-map" className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50">
        <BackgroundArt />

        <Container className="flex min-h-[100svh] flex-col justify-center">
          <ProgramHeader
            badge="Peta Program"
            title="Setiap program punya karakter berbeda."
            desc="Bagian ini dibuat tidak simetris agar lebih terasa hidup dan tidak monoton seperti grid website biasa."
          />

          <div className="program-mosaic mt-10 grid gap-5 lg:grid-cols-4">
            {programs.map((item, index) => (
              <Reveal
                key={`${item.title}-mosaic-${index}`}
                delay={index * 0.06}
                className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
              >
                <GlassCard className="h-full overflow-hidden transition duration-500 hover:-translate-y-2">
                  <div
                    className={`program-mosaic-image relative overflow-hidden ${
                      index === 0 ? "program-mosaic-image-main" : ""
                    }`}
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                      {getIcon(item.iconKey)}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                        {item.subtitle}
                      </p>

                      <h3 className="mt-2 text-3xl font-black leading-tight text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-emerald-50">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ROADMAP */}
      <Section dark>
        <BackgroundArt dark />

        <Container className="flex min-h-[90svh] flex-col justify-center">
          <ProgramHeader
            dark
            badge="Roadmap Pembinaan"
            title="Santri bergerak dari adaptasi menuju percaya diri."
            desc="Alurnya dibuat seperti rute perjalanan, bukan timeline biasa."
          />

          <div className="program-road mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {timeline.map((item, index) => (
              <Reveal key={item.number} delay={index * 0.07}>
                <div className="relative h-full rounded-[1.8rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-lg font-black text-emerald-950">
                    {item.number}
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-emerald-100">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* GALLERY */}
      <Section id="program-gallery" className="bg-[#f7f1df]">
        <BackgroundArt />

        <Container className="flex min-h-[92svh] items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <ProgramHeader
              align="left"
              badge="Galeri Program"
              title="Potongan suasana yang terasa hidup."
              desc="Galeri dibuat seperti film strip agar berbeda dari tampilan galeri standar."
            />

            <GlassCard className="p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGallery}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative overflow-hidden rounded-[1.6rem]"
                >
                  <SafeImage
                    src={gallery[currentGallery]}
                    alt="Galeri Program"
                    className="program-gallery-image w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                      Frame {String(currentGallery + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-4xl font-black text-white sm:text-5xl">
                      Kegiatan Santri
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {gallery.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setCurrentGallery(index)}
                    className={`overflow-hidden rounded-2xl border-2 p-1 transition ${
                      currentGallery === index
                        ? "border-yellow-400 bg-yellow-400"
                        : "border-emerald-100 bg-white hover:border-emerald-400"
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-16 w-full rounded-xl object-cover sm:h-20"
                    />
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </Container>
      </Section>

      {/* ADVANTAGES */}
      <Section className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50">
        <BackgroundArt />

        <Container className="flex min-h-[80svh] flex-col justify-center">
          <ProgramHeader
            badge="Kenapa Program Ini Berbeda?"
            title="Program dirancang agar santri tidak hanya mengikuti, tapi ikut tumbuh."
            desc="Bagian ini dibuat seperti highlight manifesto agar terasa berbeda dari section keunggulan biasa."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {advantages.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <GlassCard className="h-full p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-emerald-950 text-2xl text-yellow-300">
                    {getIcon(item.iconKey)}
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.desc}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="program-faq" dark>
        <BackgroundArt dark />

        <Container className="flex min-h-[90svh] items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <ProgramHeader
              dark
              align="left"
              badge="Pertanyaan Umum"
              title="Jawaban singkat untuk orang tua dan calon santri."
              desc="FAQ tetap dibuat simple, tetapi dengan panel gelap agar tidak terasa seperti FAQ default."
            />

            <div className="space-y-4">
              {faq.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <GlassCard key={item.q} dark>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                    >
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                          Q{String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="text-base font-black text-white sm:text-xl">
                          {item.q}
                        </h3>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 text-yellow-300"
                      >
                        <FaChevronDown />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                            <p className="text-sm leading-relaxed text-emerald-100 sm:text-base">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section dark className="min-h-[78svh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#041b15] via-[#063226] to-[#041b15]" />
        <BackgroundArt dark />

        <Container className="flex min-h-[78svh] items-center justify-center text-center">
          <Reveal className="mx-auto w-full max-w-6xl">
            <GlassCard dark className="p-7 sm:p-10 lg:p-14">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-yellow-400 text-2xl text-emerald-950"
              >
                <FaCheckCircle />
              </motion.div>

              <p className="font-black text-yellow-300">
                Perjalanan santri dimulai dari keputusan kecil.
              </p>

              <h2 className="program-section-title mx-auto mt-4 max-w-5xl font-black leading-[0.96] tracking-[-0.06em] text-white">
                Mulai perjalanan santri bersama program Al-Furqon.
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-lg">
                Daftarkan calon santri dan ikuti proses pendidikan yang membangun
                ilmu, ibadah, adab, keberanian, dan kemandirian.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-4 text-sm font-black text-emerald-950 shadow-[0_18px_45px_rgba(250,204,21,0.28)] transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Daftar Sekarang
                  <FaArrowRight />
                </Link>

                <a
                  href={WHATSAPP_ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
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
    </main>
  );
}