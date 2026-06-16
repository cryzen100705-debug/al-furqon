"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaBookOpen,
  FaCheckCircle,
  FaDumbbell,
  FaFeatherAlt,
  FaLayerGroup,
  FaMicrophone,
  FaMoon,
  FaMosque,
  FaPenNib,
  FaQuran,
  FaRedo,
  FaShieldAlt,
  FaSparkles,
  FaStar,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const MotionLink = motion(Link);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "");

const EASE = [0.22, 1, 0.36, 1];

const ADMIN_WHATSAPP_NUMBER = "628999155698";
const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai program non formal pesantren.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const DEFAULT_PROGRAM_PAGE = {
  hero: {
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    badge: "Program Non Formal Pesantren",
    title: "Ruang tumbuh",
    highlight: "santri Al-Furqon.",
    desc: "Program non formal pesantren menjadi ruang pembinaan santri dalam ibadah, Al-Qur'an, adab, dakwah, seni Islami, kemandirian, dan kedisiplinan hidup sehari-hari.",
    source: "QS. Thaha: 114",
  },

  stats: [
    { value: "9", label: "Program Non Formal", iconKey: "layer" },
    { value: "24 Jam", label: "Pembinaan Santri", iconKey: "shield" },
    { value: "Terarah", label: "Pendampingan", iconKey: "star" },
    { value: "Aktif", label: "Kegiatan Harian", iconKey: "users" },
  ],

  programs: [
    {
      title: "Seni Baca Al-Qur'an",
      subtitle: "Tilawah, Tajwid, dan Irama Qur'ani",
      tag: "Qur'ani",
      iconKey: "quran",
      desc: "Membimbing santri memperindah bacaan Al-Qur'an dengan tajwid, makharijul huruf, adab membaca, dan latihan irama.",
      focus: ["Tajwid", "Makharijul Huruf", "Tilawah", "Adab Qur'an"],
      impact: "Santri terbiasa membaca Al-Qur'an dengan baik, benar, dan penuh adab.",
    },
    {
      title: "Pengajian Kitab Kuning",
      subtitle: "Kajian Turats dan Pemahaman Agama",
      tag: "Keilmuan",
      iconKey: "book",
      desc: "Mengenalkan santri pada kitab-kitab klasik sebagai dasar memahami fikih, akhlak, tauhid, dan adab dalam kehidupan.",
      focus: ["Fikih", "Akhlak", "Tauhid", "Adab"],
      impact: "Santri memiliki dasar keilmuan agama yang kuat dan terarah.",
    },
    {
      title: "Kuliah Subuh",
      subtitle: "Nasihat Pagi dan Pembinaan Ruhani",
      tag: "Pembiasaan",
      iconKey: "mosque",
      desc: "Kegiatan setelah subuh untuk mengisi pagi santri dengan nasihat, ilmu, motivasi ibadah, dan pembiasaan disiplin.",
      focus: ["Nasihat", "Motivasi", "Ibadah", "Disiplin"],
      impact: "Santri memulai hari dengan semangat ibadah dan arah hidup yang baik.",
    },
    {
      title: "Tahfidzul Qur'an",
      subtitle: "Hafalan, Setoran, dan Murajaah",
      tag: "Hafalan",
      iconKey: "quran",
      desc: "Program pembinaan hafalan Al-Qur'an secara bertahap melalui setoran, murajaah, pembiasaan membaca, dan penguatan adab Qur'ani.",
      focus: ["Hafalan", "Setoran", "Murajaah", "Konsistensi"],
      impact: "Santri dekat dengan Al-Qur'an dan terbiasa menjaga hafalan.",
    },
    {
      title: "Muhadhoroh",
      subtitle: "Latihan Dakwah dan Public Speaking",
      tag: "Dakwah",
      iconKey: "microphone",
      desc: "Melatih santri berbicara di depan umum, menyampaikan nasihat, menjadi MC, berpidato, dan percaya diri dalam kegiatan pesantren.",
      focus: ["Pidato", "MC", "Dakwah", "Percaya Diri"],
      impact: "Santri berani tampil, tertata dalam bicara, dan siap berdakwah.",
    },
    {
      title: "Lailatul Qiro'ah",
      subtitle: "Malam Qur'ani dan Pembinaan Bacaan",
      tag: "Qur'ani",
      iconKey: "moon",
      desc: "Kegiatan malam bernuansa Qur'ani untuk menguatkan bacaan, kecintaan kepada Al-Qur'an, dan suasana spiritual santri.",
      focus: ["Qiro'ah", "Tilawah", "Ruhani", "Kebersamaan"],
      impact: "Santri merasakan suasana belajar Qur'an yang hidup dan bermakna.",
    },
    {
      title: "Seni Kaligrafi",
      subtitle: "Kreativitas Islami dan Keindahan Tulisan",
      tag: "Kreatif",
      iconKey: "pen",
      desc: "Mengembangkan kreativitas santri melalui seni menulis indah bernuansa Islami, ketelitian, kesabaran, dan estetika.",
      focus: ["Kreativitas", "Ketelitian", "Seni Islami", "Kesabaran"],
      impact: "Santri terlatih sabar, rapi, teliti, dan kreatif.",
    },
    {
      title: "Majelis Ta'lim",
      subtitle: "Kajian, Dzikir, dan Kebersamaan",
      tag: "Pembinaan",
      iconKey: "users",
      desc: "Ruang kajian dan pembinaan bersama untuk memperkuat ilmu, adab, dzikir, ukhuwah, dan kedekatan santri dengan guru.",
      focus: ["Kajian", "Dzikir", "Ukhuwah", "Adab"],
      impact: "Santri terbiasa hadir di majelis ilmu dan menghormati guru.",
    },
    {
      title: "Olahraga / Senam Pagi",
      subtitle: "Kesehatan, Semangat, dan Kedisiplinan",
      tag: "Kebugaran",
      iconKey: "activity",
      desc: "Kegiatan fisik untuk menjaga kesehatan santri, membangun semangat pagi, kekompakan, dan pola hidup disiplin.",
      focus: ["Sehat", "Semangat", "Kompak", "Disiplin"],
      impact: "Santri lebih bugar, aktif, dan siap mengikuti kegiatan harian.",
    },
  ],

  flow: [
    {
      number: "01",
      title: "Pembiasaan Harian",
      desc: "Santri dibiasakan mengikuti kegiatan pesantren secara teratur.",
    },
    {
      number: "02",
      title: "Dibimbing Pembina",
      desc: "Setiap program diarahkan agar tetap sesuai adab dan nilai pesantren.",
    },
    {
      number: "03",
      title: "Dilihat Perkembangannya",
      desc: "Santri didampingi agar kemampuan, disiplin, dan keberaniannya berkembang.",
    },
    {
      number: "04",
      title: "Menjadi Karakter",
      desc: "Kegiatan yang berulang membentuk kebiasaan baik dalam diri santri.",
    },
  ],

  faq: [
    {
      q: "Apakah program non formal wajib diikuti?",
      a: "Beberapa kegiatan menjadi bagian dari pembiasaan pesantren, sedangkan sebagian lainnya dapat diarahkan sesuai minat, kemampuan, dan jadwal santri.",
    },
    {
      q: "Apakah halaman ini memakai foto?",
      a: "Tidak. Tampilan dibuat tanpa foto agar lebih ringan, modern, fokus pada informasi, dan tetap menarik lewat animasi.",
    },
    {
      q: "Apa tujuan utama program non formal?",
      a: "Tujuannya membentuk santri yang dekat dengan Al-Qur'an, beradab, percaya diri, disiplin, kreatif, dan aktif dalam lingkungan pesantren.",
    },
  ],
};

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 19 + 7) % 100}%`,
  top: `${(index * 31 + 13) % 100}%`,
  size: 3 + (index % 4),
  delay: index * 0.22,
  duration: 7 + (index % 5),
}));

const screenVariants = {
  enter: (direction) => ({
    opacity: 0,
    y: direction > 0 ? "4%" : "-4%",
    scale: 0.992,
    filter: "blur(7px)",
  }),
  center: {
    opacity: 1,
    y: "0%",
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction > 0 ? "-4%" : "4%",
    scale: 0.992,
    filter: "blur(7px)",
  }),
};

const stepVariants = {
  enter: (direction) => ({
    opacity: 0,
    y: direction > 0 ? 34 : -34,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction > 0 ? -34 : 34,
    filter: "blur(8px)",
  }),
};

function getIcon(key) {
  const icons = {
    quran: <FaQuran />,
    book: <FaBookOpen />,
    mosque: <FaMosque />,
    microphone: <FaMicrophone />,
    moon: <FaMoon />,
    pen: <FaPenNib />,
    users: <FaUsers />,
    activity: <FaDumbbell />,
    shield: <FaShieldAlt />,
    star: <FaStar />,
    layer: <FaLayerGroup />,
    spark: <FaSparkles />,
  };

  return icons[key] || <FaStar />;
}

function normalizeProgramPage(data) {
  const source = data || {};
  const fallback = DEFAULT_PROGRAM_PAGE;

  return {
    hero: {
      ...fallback.hero,
      ...(source.hero || {}),
    },
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
        : fallback.stats,
    programs:
      Array.isArray(source.programs) && source.programs.length
        ? source.programs.map((item, index) => ({
            ...fallback.programs[index % fallback.programs.length],
            ...item,
            focus:
              Array.isArray(item?.focus) && item.focus.length
                ? item.focus
                : fallback.programs[index % fallback.programs.length].focus,
          }))
        : fallback.programs,
    flow:
      Array.isArray(source.flow) && source.flow.length
        ? source.flow
        : fallback.flow,
    faq:
      Array.isArray(source.faq) && source.faq.length ? source.faq : fallback.faq,
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status}`);
  }

  return response.json();
}

function LoadingPage() {
  return (
    <main className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-[#041b15] text-white">
      <IslamicBackground dark intense />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 px-6 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mx-auto mb-6 h-14 w-14 rounded-full border-4 border-yellow-300/20 border-t-yellow-300"
        />

        <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-300">
          Menghubungkan ke Backend
        </p>

        <h1 className="mt-4 text-2xl font-black sm:text-4xl">
          Memuat Program...
        </h1>
      </motion.div>
    </main>
  );
}

function MaintenancePage({ onRetry, checking }) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#041b15] text-white">
      <IslamicBackground dark intense />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-[92vw] max-w-4xl flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-3xl" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-yellow-300/30 bg-yellow-300/10 text-3xl text-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.25)] backdrop-blur-xl">
            <FaRedo />
          </div>
        </motion.div>

        <Badge dark>Program Maintenance</Badge>

        <h1 className="mt-5 text-[clamp(2.2rem,6vw,5.2rem)] font-black leading-[0.92] tracking-[-0.06em]">
          Program belum
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
            dapat dimuat.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-lg">
          Data program belum berhasil dibaca dari backend. Coba muat ulang atau
          hubungi admin pesantren.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            disabled={checking}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-black text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
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
            {checking ? "Sedang Memuat..." : "Coba Lagi"}
          </button>

          <a
            href={WHATSAPP_ADMIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 sm:text-base"
          >
            <FaWhatsapp />
            Hubungi Admin
          </a>
        </div>
      </div>
    </main>
  );
}

function CursorGlow() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (reduce) return;

    const handleMouseMove = (event) => {
      mouseX.set(event.clientX - 140);
      mouseY.set(event.clientY - 140);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduce]);

  if (reduce) return null;

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl lg:block"
    />
  );
}

function AmbientParticles({ light = false }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{
            opacity: [0, light ? 0.2 : 0.18, 0],
            y: [-8, -58],
            scale: [0.8, 1.18, 0.85],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full ${
            light ? "bg-emerald-800/35" : "bg-yellow-200/60"
          }`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}

function IslamicBackground({ dark = false, intense = false }) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-[url('/pattern.png')] bg-repeat ${
          intense ? "opacity-[0.08]" : "opacity-[0.045]"
        }`}
      />

      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(circle_at_20%_15%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.14),transparent_32%)]"
            : "bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(250,204,21,0.22),transparent_32%)]"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, 18, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -left-32 top-20 h-64 w-64 rounded-full border ${
          dark
            ? "border-yellow-300/18 bg-yellow-300/5"
            : "border-emerald-900/10 bg-emerald-300/16"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, -18, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -right-40 bottom-16 h-[24rem] w-[24rem] rounded-full border ${
          dark
            ? "border-emerald-300/18 bg-emerald-300/5"
            : "border-yellow-600/10 bg-yellow-300/16"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                y: [0, -16, 0],
                opacity: [0.35, 0.65, 0.35],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          dark ? "bg-emerald-400/8" : "bg-yellow-300/14"
        }`}
      />

      <AmbientParticles light={!dark} />
    </div>
  );
}

function Badge({ children, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`inline-flex max-w-full items-center gap-3 rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] sm:text-[10px] ${
        dark
          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
          : "border-emerald-200 bg-white/85 text-emerald-800"
      }`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
      <span className="truncate">{children}</span>
    </motion.div>
  );
}

function TiltCard({ children, className = "" }) {
  const reduce = useReducedMotion();

  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (event) => {
    if (reduce) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRotate({
      x: (y / rect.height - 0.5) * -5,
      y: (x / rect.width - 0.5) * 5,
    });
  };

  const reset = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={
        reduce
          ? undefined
          : {
              rotateX: rotate.x,
              rotateY: rotate.y,
            }
      }
      whileHover={
        reduce
          ? undefined
          : {
              y: -6,
              scale: 1.01,
            }
      }
      transition={{
        type: "spring",
        stiffness: 230,
        damping: 22,
      }}
      style={{ transformStyle: "preserve-3d" }}
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children,
  href,
  variant = "primary",
  external = false,
}) {
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMouseMove = (event) => {
    if (reduce) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const moveX = event.clientX - rect.left - rect.width / 2;
    const moveY = event.clientY - rect.top - rect.height / 2;

    x.set(moveX * 0.12);
    y.set(moveY * 0.12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const className =
    variant === "primary"
      ? "bg-yellow-400 text-emerald-950 shadow-[0_0_36px_rgba(250,204,21,0.25)] hover:bg-yellow-300"
      : "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20";

  const commonClass = `group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-1 sm:w-auto ${className}`;

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={reduce ? undefined : { x: springX, y: springY }}
        whileTap={{ scale: 0.96 }}
        className={commonClass}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={reduce ? undefined : { x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={commonClass}
    >
      {children}
    </MotionLink>
  );
}

function ScreenShell({ children, light = false, sectionKey, direction }) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      key={sectionKey}
      custom={direction}
      variants={
        reduce
          ? {
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
            }
          : screenVariants
      }
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: reduce ? 0.22 : 0.56,
        ease: EASE,
      }}
      className={`fixed inset-0 h-[100dvh] overflow-hidden ${
        light
          ? "bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50 text-emerald-950"
          : "bg-[#041b15] text-white"
      }`}
    >
      {children}
    </motion.section>
  );
}

function ProgressBar({ sections, activeSection, activeStep }) {
  const totalSteps = sections.reduce((sum, item) => sum + item.total, 0);

  const passed = sections
    .slice(0, activeSection)
    .reduce((sum, item) => sum + item.total, 0);

  const progress = ((passed + activeStep + 1) / totalSteps) * 100;

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

function SideDots({ sections, activeSection, activeStep, jumpToSection }) {
  return (
    <div className="fixed right-5 top-1/2 z-[260] hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {sections.map((section, index) => (
        <button
          key={section.key}
          onClick={() => jumpToSection(index)}
          className="group flex items-center justify-end gap-3"
        >
          <span className="rounded-full bg-emerald-950/85 px-3 py-1 text-[11px] font-black text-yellow-300 opacity-0 shadow-xl backdrop-blur transition group-hover:opacity-100">
            {section.label}
            {activeSection === index && section.total > 1
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

function HeroScreen({ hero, stats, direction }) {
  return (
    <ScreenShell sectionKey="program-hero" direction={direction}>
      <IslamicBackground dark intense />

      <div className="program-screen program-hero-screen">
        <div className="program-hero-grid">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key="program-hero-content"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: EASE }}
              className="program-hero-copy"
            >
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
                className="mb-3 text-base leading-loose text-yellow-300 sm:text-lg lg:text-xl"
              >
                {hero.arabic}
              </motion.p>

              <Badge dark>{hero.badge}</Badge>

              <motion.h1
                initial={{ opacity: 0, y: 28, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.16, duration: 0.62, ease: EASE }}
                className="program-title mt-4 font-black leading-[0.94] tracking-[-0.055em]"
              >
                {hero.title}
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.45 }}
                className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base"
              >
                {hero.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.45 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <MagneticButton href="/pendaftaran">
                  Mulai Pendaftaran
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </MagneticButton>

                <MagneticButton
                  href={WHATSAPP_ADMIN_URL}
                  variant="ghost"
                  external
                >
                  Tanya Program
                  <FaWhatsapp />
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
                className="program-stats mt-5 grid max-w-3xl grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3"
              >
                {stats.map((item, index) => (
                  <TiltCard key={`${item.label}-${index}`}>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-xl sm:rounded-3xl sm:p-4">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-400 text-sm text-emerald-950">
                        {getIcon(item.iconKey)}
                      </div>

                      <h3 className="text-base font-black text-yellow-300 sm:text-xl">
                        {item.value}
                      </h3>

                      <p className="mt-1 text-[11px] font-bold text-emerald-100">
                        {item.label}
                      </p>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="program-orbit hidden lg:block"
          >
            <div className="relative ml-auto flex aspect-square max-w-[460px] items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-yellow-300/20"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[12%] rounded-full border border-emerald-300/20"
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-56 w-56 items-center justify-center rounded-[3rem] border border-white/10 bg-white/10 text-7xl text-yellow-300 shadow-2xl backdrop-blur-xl"
              >
                <FaQuran />
              </motion.div>

              {["quran", "book", "mosque", "microphone", "pen", "users"].map(
                (item, index) => (
                  <motion.div
                    key={item}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 22 + index * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0"
                    style={{
                      transformOrigin: "50% 50%",
                    }}
                  >
                    <div
                      className="absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl text-yellow-300 backdrop-blur-xl"
                      style={{
                        left: `${50 + 42 * Math.cos((index / 6) * Math.PI * 2)}%`,
                        top: `${50 + 42 * Math.sin((index / 6) * Math.PI * 2)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {getIcon(item)}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ProgramsScreen({
  programs,
  activeProgram,
  setActiveProgram,
  direction,
}) {
  const active = programs[activeProgram] || programs[0];

  return (
    <ScreenShell light sectionKey="program-list" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" className="program-screen overflow-y-auto">
        <div className="program-list-layout">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="program-list-header"
          >
            <Badge>Daftar Program</Badge>

            <h2 className="program-heading mt-4 font-black leading-[0.96] tracking-[-0.055em] text-emerald-950">
              Non formal pesantren yang membentuk kebiasaan santri
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Pilih salah satu program untuk melihat fokus pembinaan dan
              dampaknya bagi santri.
            </p>
          </motion.div>

          <div className="program-list-grid">
            <div className="program-buttons-grid">
              {programs.map((program, index) => {
                const activeItem = index === activeProgram;

                return (
                  <motion.button
                    key={`${program.title}-${index}`}
                    type="button"
                    onClick={() => setActiveProgram(index)}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.44,
                      delay: index * 0.035,
                      ease: EASE,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className={`program-mini-card ${
                      activeItem ? "program-mini-card-active" : ""
                    }`}
                  >
                    <span className="program-mini-icon">
                      {getIcon(program.iconKey)}
                    </span>

                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-black">
                        {program.title}
                      </span>
                      <span className="mt-1 block truncate text-[11px] font-bold opacity-70">
                        {program.tag}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgram}
                initial={{ opacity: 0, x: 32, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -32, filter: "blur(10px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <TiltCard className="h-full">
                  <div className="program-detail-card">
                    <div className="program-detail-glow" />

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="program-detail-icon">
                          {getIcon(active.iconKey)}
                        </div>

                        <span className="rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950">
                          {active.tag}
                        </span>
                      </div>

                      <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-yellow-300">
                        {active.subtitle}
                      </p>

                      <h3 className="mt-3 text-[clamp(2rem,4vw,4.3rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">
                        {active.title}
                      </h3>

                      <p className="mt-5 text-sm leading-relaxed text-emerald-100 sm:text-base">
                        {active.desc}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {active.focus.map((item, index) => (
                          <motion.div
                            key={`${item}-${index}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.08 + index * 0.06,
                              duration: 0.35,
                            }}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm font-black text-white"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-emerald-950">
                              <FaCheckCircle />
                            </span>
                            {item}
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-[1.5rem] border border-yellow-300/20 bg-yellow-300/10 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">
                          Dampak Pembinaan
                        </p>

                        <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-50">
                          {active.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function FocusScreen({ programs, step, direction }) {
  const current = programs[step] || programs[0];

  return (
    <ScreenShell sectionKey="program-focus" direction={direction}>
      <IslamicBackground dark intense />

      <div className="program-screen program-focus-screen">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${current.title}-${step}`}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.48, ease: EASE }}
            className="program-focus-layout"
          >
            <div className="program-focus-left">
              <Badge dark>
                Program {String(step + 1).padStart(2, "0")} /{" "}
                {String(programs.length).padStart(2, "0")}
              </Badge>

              <h2 className="program-heading mt-4 font-black leading-[0.96] tracking-[-0.055em] text-white">
                {current.title}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base">
                {current.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {current.focus.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-emerald-50 backdrop-blur-xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <TiltCard className="program-focus-card-wrap">
              <div className="program-focus-card">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-6 rounded-full border border-yellow-300/15"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 36,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-16 rounded-full border border-emerald-300/15"
                />

                <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[2.2rem] bg-yellow-400 text-6xl text-emerald-950 shadow-[0_0_70px_rgba(250,204,21,0.25)]">
                  {getIcon(current.iconKey)}
                </div>

                <h3 className="relative z-10 mt-8 max-w-md text-center text-2xl font-black leading-tight text-white sm:text-4xl">
                  {current.impact}
                </h3>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </ScreenShell>
  );
}

function FlowScreen({ flow, direction }) {
  return (
    <ScreenShell light sectionKey="program-flow" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" className="program-screen overflow-y-auto">
        <div className="program-flow-layout">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge>Alur Pembinaan</Badge>

            <h2 className="program-heading mt-4 font-black leading-[0.96] tracking-[-0.055em] text-emerald-950">
              Kegiatan yang berulang menjadi karakter
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Program non formal tidak hanya menjadi kegiatan tambahan, tetapi
              bagian dari pembiasaan yang membentuk kehidupan santri.
            </p>
          </motion.div>

          <div className="program-flow-grid">
            {flow.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: index * 0.09,
                  duration: 0.48,
                  ease: EASE,
                }}
              >
                <TiltCard className="h-full">
                  <div className="program-flow-card">
                    <div className="program-flow-number">{item.number}</div>

                    <h3 className="mt-6 text-2xl font-black text-emerald-950">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function FaqScreen({ faq, openFaq, setOpenFaq, direction }) {
  return (
    <ScreenShell sectionKey="program-faq" direction={direction}>
      <IslamicBackground dark intense />

      <div data-allow-scroll="true" className="program-screen overflow-y-auto">
        <div className="program-faq-layout">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="program-faq-left"
          >
            <Badge dark>Pertanyaan Program</Badge>

            <h2 className="program-heading mt-4 font-black leading-[0.96] tracking-[-0.055em] text-white">
              Informasi singkat tentang program non formal
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">
              Bagian ini membantu calon santri dan wali memahami tujuan program
              pesantren tanpa perlu membuka banyak halaman.
            </p>
          </motion.div>

          <div className="program-faq-list">
            {faq.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.button
                  key={`${item.q}-${index}`}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.42,
                    ease: EASE,
                  }}
                  className="program-faq-item"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-left text-base font-black text-white sm:text-lg">
                      {item.q}
                    </h3>

                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-emerald-950 transition ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        className="overflow-hidden text-left text-sm leading-relaxed text-emerald-100"
                      >
                        <span className="block pt-3">{item.a}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function CtaScreen({ direction }) {
  return (
    <ScreenShell light sectionKey="program-cta" direction={direction}>
      <IslamicBackground />

      <div className="program-screen program-cta-screen">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="program-cta-card"
        >
          <div className="program-cta-icon">
            <FaFeatherAlt />
          </div>

          <Badge>Mulai Perjalanan Santri</Badge>

          <h2 className="program-heading mt-5 font-black leading-[0.96] tracking-[-0.055em] text-emerald-950">
            Siap menjadi bagian dari pembinaan Al-Furqon?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Program non formal menjadi bagian penting dari kehidupan pesantren.
            Dari Al-Qur'an, adab, dakwah, kreativitas, hingga kedisiplinan
            harian.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <MotionLink
              href="/pendaftaran"
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-950 px-7 py-3.5 text-sm font-black text-yellow-300 shadow-xl transition hover:-translate-y-1 hover:bg-emerald-900"
            >
              Daftar Sekarang
              <FaArrowRight />
            </MotionLink>

            <motion.a
              href={WHATSAPP_ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-emerald-200 bg-white px-7 py-3.5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-1"
            >
              Hubungi Admin
              <FaWhatsapp />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

export default function Program() {
  const [mounted, setMounted] = useState(false);
  const [programPage, setProgramPage] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [position, setPosition] = useState({
    section: 0,
    step: 0,
    direction: 1,
  });

  const [activeProgram, setActiveProgram] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const cooldown = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTarget = useRef(null);

  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(92);

  const fetchProgramData = useCallback(async () => {
    try {
      setChecking(true);
      setMaintenance(false);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur");
      }

      await fetchJson(`${API_URL}/api/health`);

      const result = await fetchJson(`${API_URL}/api/program`);

      if (!result?.success || !result?.data) {
        throw new Error("Format data program tidak valid");
      }

      setProgramPage(normalizeProgramPage(result.data));
      setActiveProgram(0);
      setOpenFaq(0);
    } catch (error) {
      console.error("PROGRAM BACKEND ERROR:", error.message);
      setProgramPage(null);
      setMaintenance(true);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  const data = useMemo(() => {
    return normalizeProgramPage(programPage);
  }, [programPage]);

  const sections = useMemo(
    () => [
      { key: "hero", label: "Hero", total: 1 },
      { key: "programs", label: "Program", total: 1 },
      {
        key: "focus",
        label: "Fokus",
        total: data.programs.length || 1,
      },
      { key: "flow", label: "Alur", total: 1 },
      { key: "faq", label: "FAQ", total: 1 },
      { key: "cta", label: "Daftar", total: 1 },
    ],
    [data.programs.length]
  );

  const activeSection = position.section;
  const activeStep = position.step;
  const direction = position.direction;

  const currentTotal = sections[activeSection]?.total || 1;
  const activeSectionKey = sections[activeSection]?.key || "hero";

  const isFirst = activeSection === 0 && activeStep === 0;

  const isLast =
    activeSection === sections.length - 1 && activeStep === currentTotal - 1;

  const jumpToSection = useCallback(
    (index) => {
      cooldown.current = false;

      setPosition((prev) => {
        const safeIndex = Math.min(Math.max(index, 0), sections.length - 1);

        return {
          section: safeIndex,
          step: 0,
          direction: safeIndex >= prev.section ? 1 : -1,
        };
      });
    },
    [sections.length]
  );

  const handleDirection = useCallback(
    (dir) => {
      if (cooldown.current) return;

      cooldown.current = true;

      setPosition((prev) => {
        const total = sections[prev.section]?.total || 1;

        if (dir > 0) {
          if (prev.step < total - 1) {
            return {
              section: prev.section,
              step: prev.step + 1,
              direction: 1,
            };
          }

          if (prev.section < sections.length - 1) {
            return {
              section: prev.section + 1,
              step: 0,
              direction: 1,
            };
          }

          return {
            ...prev,
            direction: 1,
          };
        }

        if (prev.step > 0) {
          return {
            section: prev.section,
            step: prev.step - 1,
            direction: -1,
          };
        }

        if (prev.section > 0) {
          const previousSection = prev.section - 1;

          return {
            section: previousSection,
            step: sections[previousSection].total - 1,
            direction: -1,
          };
        }

        return {
          ...prev,
          direction: -1,
        };
      });

      window.setTimeout(() => {
        cooldown.current = false;
      }, 680);
    },
    [sections]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchProgramData();
  }, [fetchProgramData]);

  useEffect(() => {
    if (!mounted || loading || maintenance) return;

    const oldHtmlOverflow = document.documentElement.style.overflow;
    const oldBodyOverflow = document.body.style.overflow;
    const oldHtmlHeight = document.documentElement.style.height;
    const oldBodyHeight = document.body.style.height;
    const oldBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overscrollBehavior = "none";

    const handleWheel = (event) => {
      const scrollableTarget = event.target.closest?.(
        '[data-allow-scroll="true"]'
      );

      if (scrollableTarget) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableTarget;

        const isScrollingDown = event.deltaY > 0;
        const isScrollingUp = event.deltaY < 0;

        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

        if ((isScrollingDown && !atBottom) || (isScrollingUp && !atTop)) {
          return;
        }
      }

      event.preventDefault();

      if (Math.abs(event.deltaY) < 20) return;

      handleDirection(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (event) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        handleDirection(1);
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        handleDirection(-1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        jumpToSection(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        jumpToSection(sections.length - 1);
      }
    };

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0].clientY;
      touchStartX.current = event.touches[0].clientX;
      touchStartTarget.current = event.target;
    };

    const handleTouchEnd = (event) => {
      const endY = event.changedTouches[0].clientY;
      const endX = event.changedTouches[0].clientX;

      const diffY = touchStartY.current - endY;
      const diffX = touchStartX.current - endX;

      if (Math.abs(diffX) > Math.abs(diffY)) return;
      if (Math.abs(diffY) < 42) return;

      const scrollableTarget = touchStartTarget.current?.closest?.(
        '[data-allow-scroll="true"]'
      );

      if (scrollableTarget) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableTarget;

        const isSwipingUp = diffY > 0;
        const isSwipingDown = diffY < 0;

        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

        if ((isSwipingUp && !atBottom) || (isSwipingDown && !atTop)) {
          return;
        }
      }

      handleDirection(diffY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.documentElement.style.overflow = oldHtmlOverflow;
      document.body.style.overflow = oldBodyOverflow;
      document.documentElement.style.height = oldHtmlHeight;
      document.body.style.height = oldBodyHeight;
      document.body.style.overscrollBehavior = oldBodyOverscroll;

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    mounted,
    loading,
    maintenance,
    handleDirection,
    jumpToSection,
    sections.length,
  ]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const height = navbarRef.current?.offsetHeight || 92;
      setNavbarHeight(height);

      document.documentElement.style.setProperty(
        "--program-navbar-height",
        `${height}px`
      );
    };

    updateNavbarHeight();

    window.addEventListener("resize", updateNavbarHeight);

    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, []);

  useEffect(() => {
    if (activeSectionKey === "focus") {
      setActiveProgram(activeStep);
    }
  }, [activeSectionKey, activeStep]);

  if (!mounted || loading) {
    return <LoadingPage />;
  }

  if (maintenance || !programPage) {
    return <MaintenancePage onRetry={fetchProgramData} checking={checking} />;
  }

  return (
    <main
      className="program-root"
      style={{
        "--program-navbar-height": `${navbarHeight}px`,
      }}
    >
      <CursorGlow />

      <div ref={navbarRef} className="fixed left-0 top-0 z-[500] w-full">
        <Navbar />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {activeSectionKey === "hero" && (
          <HeroScreen
            key="hero"
            hero={data.hero}
            stats={data.stats}
            direction={direction}
          />
        )}

        {activeSectionKey === "programs" && (
          <ProgramsScreen
            key="programs"
            programs={data.programs}
            activeProgram={activeProgram}
            setActiveProgram={setActiveProgram}
            direction={direction}
          />
        )}

        {activeSectionKey === "focus" && (
          <FocusScreen
            key="focus"
            programs={data.programs}
            step={activeStep}
            direction={direction}
          />
        )}

        {activeSectionKey === "flow" && (
          <FlowScreen key="flow" flow={data.flow} direction={direction} />
        )}

        {activeSectionKey === "faq" && (
          <FaqScreen
            key="faq"
            faq={data.faq}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            direction={direction}
          />
        )}

        {activeSectionKey === "cta" && (
          <CtaScreen key="cta" direction={direction} />
        )}
      </AnimatePresence>

      <SideDots
        sections={sections}
        activeSection={activeSection}
        activeStep={activeStep}
        jumpToSection={jumpToSection}
      />

      <ProgressBar
        sections={sections}
        activeSection={activeSection}
        activeStep={activeStep}
      />

      <div className="fixed bottom-7 left-1/2 z-[270] flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => handleDirection(-1)}
          className="rounded-full border border-white/20 bg-emerald-950/70 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="inline-flex items-center gap-2">
            <FaArrowUp />
            Atas
          </span>
        </button>

        <button
          type="button"
          disabled={isLast}
          onClick={() => handleDirection(1)}
          className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-emerald-950 shadow-xl transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="inline-flex items-center gap-2">
            Bawah
            <FaArrowDown />
          </span>
        </button>
      </div>

      <style jsx global>{`
        html,
        body,
        #__next {
          width: 100%;
          height: 100%;
          margin: 0;
        }

        .program-root {
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          background: #041b15;
        }

        .program-screen {
          position: relative;
          z-index: 10;
          height: 100dvh;
          width: min(92vw, 1240px);
          margin-inline: auto;
          box-sizing: border-box;
          padding-top: max(calc(var(--program-navbar-height, 92px) + 18px), 122px);
          padding-bottom: 76px;
          overflow: hidden;
        }

        .program-hero-screen,
        .program-cta-screen,
        .program-focus-screen {
          display: flex;
          align-items: center;
        }

        .program-hero-grid {
          width: 100%;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(340px, 0.88fr);
          align-items: center;
          gap: clamp(1.2rem, 3vw, 3rem);
        }

        .program-title {
          font-size: clamp(2.45rem, 6.6vw, 6rem);
        }

        .program-heading {
          font-size: clamp(2.1rem, 5vw, 4.7rem);
        }

        .program-list-layout,
        .program-flow-layout,
        .program-faq-layout {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.35rem;
        }

        .program-list-header {
          max-width: 900px;
        }

        .program-list-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
          gap: 1rem;
          min-height: 0;
        }

        .program-buttons-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          align-content: start;
        }

        .program-mini-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 1.35rem;
          border: 1px solid rgba(6, 95, 70, 0.1);
          background: rgba(255, 255, 255, 0.78);
          padding: 0.8rem;
          color: #064e3b;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.07);
          transition: 0.28s ease;
        }

        .program-mini-card-active {
          background: #052e22;
          color: white;
          border-color: rgba(250, 204, 21, 0.4);
          box-shadow: 0 24px 70px rgba(4, 120, 87, 0.22);
        }

        .program-mini-icon {
          display: flex;
          height: 2.7rem;
          width: 2.7rem;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          background: #facc15;
          color: #052e22;
          font-size: 1.1rem;
        }

        .program-detail-card {
          position: relative;
          min-height: 100%;
          overflow: hidden;
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(135deg, #052e22, #064e3b);
          padding: clamp(1.3rem, 3vw, 2.1rem);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.22);
        }

        .program-detail-glow {
          position: absolute;
          right: -5rem;
          top: -5rem;
          height: 18rem;
          width: 18rem;
          border-radius: 999px;
          background: rgba(250, 204, 21, 0.16);
          filter: blur(45px);
        }

        .program-detail-icon {
          display: flex;
          height: 4.3rem;
          width: 4.3rem;
          align-items: center;
          justify-content: center;
          border-radius: 1.35rem;
          background: #facc15;
          color: #052e22;
          font-size: 2rem;
          box-shadow: 0 0 45px rgba(250, 204, 21, 0.25);
        }

        .program-focus-layout {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
          align-items: center;
          gap: clamp(1.2rem, 3vw, 3rem);
        }

        .program-focus-card {
          position: relative;
          min-height: min(58vh, 520px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 2.4rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          padding: 2rem;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .program-flow-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .program-flow-card {
          position: relative;
          height: 100%;
          min-height: 260px;
          overflow: hidden;
          border-radius: 2rem;
          border: 1px solid rgba(6, 95, 70, 0.1);
          background: rgba(255, 255, 255, 0.86);
          padding: 1.2rem;
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.09);
        }

        .program-flow-card::before {
          content: "";
          position: absolute;
          right: -4rem;
          top: -4rem;
          height: 12rem;
          width: 12rem;
          border-radius: 999px;
          background: rgba(250, 204, 21, 0.25);
          filter: blur(30px);
        }

        .program-flow-number {
          position: relative;
          z-index: 1;
          display: flex;
          height: 4rem;
          width: 4rem;
          align-items: center;
          justify-content: center;
          border-radius: 1.3rem;
          background: #052e22;
          color: #facc15;
          font-size: 1rem;
          font-weight: 900;
        }

        .program-faq-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          align-items: center;
        }

        .program-faq-list {
          display: grid;
          gap: 0.9rem;
        }

        .program-faq-item {
          width: 100%;
          border-radius: 1.4rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.09);
          padding: 1.15rem;
          backdrop-filter: blur(14px);
          transition: 0.25s ease;
        }

        .program-faq-item:hover {
          background: rgba(255, 255, 255, 0.14);
          transform: translateY(-3px);
        }

        .program-cta-card {
          position: relative;
          width: min(100%, 920px);
          margin-inline: auto;
          overflow: hidden;
          border-radius: 2.4rem;
          border: 1px solid rgba(6, 95, 70, 0.1);
          background: rgba(255, 255, 255, 0.9);
          padding: clamp(1.4rem, 4vw, 3rem);
          text-align: center;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.12);
        }

        .program-cta-card::before {
          content: "";
          position: absolute;
          left: -7rem;
          top: -7rem;
          height: 20rem;
          width: 20rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.18);
          filter: blur(40px);
        }

        .program-cta-card::after {
          content: "";
          position: absolute;
          right: -7rem;
          bottom: -7rem;
          height: 20rem;
          width: 20rem;
          border-radius: 999px;
          background: rgba(250, 204, 21, 0.28);
          filter: blur(40px);
        }

        .program-cta-icon {
          position: relative;
          z-index: 1;
          margin: 0 auto 1.2rem;
          display: flex;
          height: 5rem;
          width: 5rem;
          align-items: center;
          justify-content: center;
          border-radius: 1.7rem;
          background: #052e22;
          color: #facc15;
          font-size: 2rem;
          box-shadow: 0 24px 65px rgba(5, 46, 34, 0.22);
        }

        @media (max-width: 1024px) {
          .program-screen {
            width: min(94vw, 980px);
            padding-top: max(
              calc(var(--program-navbar-height, 84px) + 16px),
              112px
            );
          }

          .program-hero-grid,
          .program-focus-layout,
          .program-list-grid,
          .program-faq-layout {
            grid-template-columns: 1fr;
          }

          .program-orbit {
            display: none !important;
          }

          .program-flow-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .program-screen {
            width: 100%;
            padding-inline: 14px;
            padding-top: calc(var(--program-navbar-height, 76px) + 14px);
            padding-bottom: calc(74px + env(safe-area-inset-bottom));
          }

          .program-title {
            font-size: clamp(2rem, 12vw, 3.45rem);
          }

          .program-heading {
            font-size: clamp(1.75rem, 9.5vw, 3rem);
          }

          .program-hero-grid {
            min-height: calc(
              100dvh - var(--program-navbar-height, 76px) - 100px
            );
          }

          .program-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .program-buttons-grid,
          .program-flow-grid {
            grid-template-columns: 1fr;
          }

          .program-mini-card {
            padding: 0.72rem;
          }

          .program-detail-card {
            padding: 1rem;
          }

          .program-flow-card {
            min-height: 190px;
          }

          .program-focus-card {
            min-height: 360px;
          }
        }

        @media (max-width: 390px) {
          .program-screen {
            padding-inline: 10px;
          }

          .program-title {
            font-size: clamp(1.8rem, 11vw, 2.65rem);
          }

          .program-heading {
            font-size: clamp(1.55rem, 9vw, 2.25rem);
          }
        }
      `}</style>
    </main>
  );
}