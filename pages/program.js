"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {AnimatePresence,motion,useMotionValue,useReducedMotion,useSpring,} from "framer-motion";
import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaDumbbell,
  FaFeatherAlt,
  FaHeart,
  FaLayerGroup,
  FaLightbulb,
  FaMicrophone,
  FaMoon,
  FaMosque,
  FaPenNib,
  FaQuran,
  FaRedo,
  FaShieldAlt,
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
    spark: <FaStar />,
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

  const featuredStats = [
    {
      title: "8+",
      desc: "Program Pembinaan",
      icon: <FaBookOpen />,
    },
    {
      title: "Setiap Hari",
      desc: "Kegiatan Terjadwal",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Aktif & Terbimbing",
      desc: "Bersama Pembina",
      icon: <FaUsers />,
    },
  ];

  const reasons = [
    {
      title: "Membentuk Karakter Qur’ani",
      desc: "Santri terbiasa dengan nilai Al-Qur’an dalam kehidupan sehari-hari.",
      icon: <FaHeart />,
    },
    {
      title: "Menambah Ilmu & Wawasan",
      desc: "Ilmu agama dan adab diperkuat melalui pembinaan terarah.",
      icon: <FaLightbulb />,
    },
    {
      title: "Membiasakan Hidup Disiplin",
      desc: "Jadwal terstruktur membentuk kebiasaan positif santri.",
      icon: <FaClipboardList />,
    },
  ];

  return (
    <ScreenShell light sectionKey="program-list" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" className="program-screen program-new-scroll">
        <div className="program-new-page">
          <motion.section
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="program-new-hero"
          >
            <div className="program-new-hero-copy">
              <Badge>Daftar Program</Badge>

              <h2 className="program-new-title">
                Non formal pesantren yang membentuk kebiasaan santri
              </h2>

              <p>
                Program pembinaan harian untuk membentuk karakter Qur’ani,
                berilmu, berakhlak, dan sehat jasmani.
              </p>

              <button
                type="button"
                onClick={() => setActiveProgram(0)}
                className="program-new-main-btn"
              >
                <span className="program-new-main-btn-icon">
                  <FaClipboardList />
                </span>
                Daftar Program
                <FaArrowRight />
              </button>
            </div>

            <div className="program-new-hero-art">
              <div className="program-new-circle" />
              <div className="program-new-mosque">
                <div className="program-new-dome" />
                <div className="program-new-building" />
              </div>
            </div>
          </motion.section>

          <div className="program-new-stats">
            {featuredStats.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
                className="program-new-stat-card"
              >
                <div className="program-new-stat-icon">{item.icon}</div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeProgram}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.42, ease: EASE }}
              className="program-new-featured"
            >
              <div className="program-new-featured-top">
                <div className="program-new-featured-label">
                  <FaStar />
                  <span>Program Unggulan</span>
                </div>

                <span className="program-new-pill">{active.tag}</span>
              </div>

              <div className="program-new-featured-main">
                <div className="program-new-featured-icon-wrap">
                  <div className="program-new-featured-icon">
                    {getIcon(active.iconKey)}
                  </div>
                </div>

                <div className="program-new-featured-copy">
                  <p className="program-new-accent">{active.subtitle}</p>

                  <h3>{active.title}</h3>

                  <p className="program-new-desc">{active.desc}</p>
                </div>
              </div>

              <div className="program-new-impact">
                <h4>Dampak Pembinaan</h4>
                <p>{active.impact}</p>
              </div>

              <div className="program-new-dots">
                {programs.slice(0, 5).map((program, index) => (
                  <button
                    key={`${program.title}-dot-${index}`}
                    type="button"
                    onClick={() => setActiveProgram(index)}
                    className={`program-new-dot ${
                      activeProgram === index ? "program-new-dot-active" : ""
                    }`}
                  />
                ))}
              </div>
            </motion.section>
          </AnimatePresence>

          <section className="program-new-all">
            <div className="program-new-section-head">
              <h3>Semua Program Pembinaan</h3>

              <button type="button">
                Lihat Semua
                <FaArrowRight />
              </button>
            </div>

            <div className="program-new-card-row">
              {programs.map((program, index) => (
                <button
                  key={`${program.title}-${index}`}
                  type="button"
                  onClick={() => setActiveProgram(index)}
                  className={`program-new-mini ${
                    activeProgram === index ? "program-new-mini-active" : ""
                  }`}
                >
                  <div className="program-new-mini-icon">
                    {getIcon(program.iconKey)}
                  </div>

                  <h4>{program.tag}</h4>
                  <p>{program.title}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="program-new-reasons">
            <div className="program-new-section-head">
              <h3>Kenapa Program Ini Penting?</h3>
            </div>

            <div className="program-new-reason-grid">
              {reasons.map((item, index) => (
                <div key={`${item.title}-${index}`} className="program-new-reason">
                  <div className="program-new-reason-icon">{item.icon}</div>

                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
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

      <div className="program-screen">
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

<style jsx global>{`
html,
body,
#__next {
  width: 100%;
  height: 100%;
  margin: 0;
}

html,
body {
  overscroll-behavior: none;
}

* {
  box-sizing: border-box;
}

.program-root {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #041b15;
}

/* =========================================================
   GLOBAL SECTION SYSTEM
========================================================= */

.program-screen {
  --program-safe-bottom: max(env(safe-area-inset-bottom), 0px);
  --program-nav-space: var(--program-navbar-height, 92px);
  --program-top-space: calc(var(--program-nav-space) + 10px);
  --program-bottom-space: calc(10px + var(--program-safe-bottom));
  --program-available-height: calc(
    100dvh - var(--program-top-space) - var(--program-bottom-space)
  );

  position: relative;
  z-index: 10;
  width: min(92vw, 1240px);
  height: 100dvh;
  max-height: 100dvh;
  margin-inline: auto;
  padding-top: var(--program-top-space);
  padding-bottom: var(--program-bottom-space);
  overflow: hidden;
}

.program-hero-grid,
.program-list-layout,
.program-focus-layout,
.program-flow-layout,
.program-faq-layout {
  width: 100%;
  height: var(--program-available-height);
  max-height: var(--program-available-height);
  min-height: 0;
  overflow: hidden;
}

.program-hero-screen,
.program-focus-screen,
.program-cta-screen {
  display: flex;
  align-items: center;
}

.program-title {
  font-size: clamp(2.25rem, min(5.8vw, 9.2vh), 5.55rem);
  line-height: 0.92;
  letter-spacing: -0.06em;
}

.program-heading {
  font-size: clamp(1.9rem, min(4.6vw, 7vh), 4.2rem);
  line-height: 0.96;
  letter-spacing: -0.055em;
}

/* =========================================================
   HERO DESKTOP
========================================================= */

.program-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(280px, 0.78fr);
  align-items: center;
  gap: clamp(1rem, 2.4vw, 2.7rem);
}

.program-hero-copy {
  min-width: 0;
  min-height: 0;
}

.program-hero-copy p {
  max-width: 780px;
}

.program-stats {
  max-height: 145px;
  overflow: hidden;
}

.program-stats > * {
  min-width: 0;
}

.program-stats h3 {
  line-height: 1;
}

.program-orbit {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-orbit > div {
  width: min(30vw, 45vh, 430px);
  max-width: 430px;
}

/* =========================================================
   PROGRAM LIST DESKTOP
========================================================= */

.program-list-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: clamp(0.75rem, 1.4vh, 1.15rem);
}

.program-list-header {
  max-width: 940px;
  min-height: 0;
}

.program-list-header .program-heading {
  font-size: clamp(1.9rem, min(4.3vw, 6.2vh), 4rem);
}

.program-list-header p {
  margin-top: 0.8rem !important;
}

.program-list-grid {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(260px, 0.82fr) minmax(0, 1.18fr);
  gap: 1rem;
  overflow: hidden;
}

.program-buttons-grid {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(68px, 1fr);
  gap: 0.65rem;
  overflow: hidden;
}

.program-mini-card {
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(6, 95, 70, 0.1);
  background: rgba(255, 255, 255, 0.78);
  padding: 0.7rem;
  color: #064e3b;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.07);
  transition: 0.28s ease;
}

.program-mini-card-active {
  background: #052e22;
  color: #ffffff;
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow: 0 24px 70px rgba(4, 120, 87, 0.22);
}

.program-mini-icon {
  display: flex;
  height: 2.35rem;
  width: 2.35rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  background: #facc15;
  color: #052e22;
  font-size: 0.95rem;
}

.program-detail-card {
  position: relative;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg, #052e22, #064e3b);
  padding: clamp(1rem, 2.2vw, 1.85rem);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.22);
}

.program-detail-card > .relative {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
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
  height: 3.75rem;
  width: 3.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 1.18rem;
  background: #facc15;
  color: #052e22;
  font-size: 1.75rem;
  box-shadow: 0 0 45px rgba(250, 204, 21, 0.25);
}

.program-detail-card h3 {
  font-size: clamp(1.9rem, min(3.8vw, 6vh), 4rem) !important;
}

.program-detail-card p {
  line-height: 1.55;
}

.program-detail-card .mt-7 {
  margin-top: 1.1rem !important;
}

.program-detail-card .mt-6 {
  margin-top: 1rem !important;
}

.program-detail-card .mt-5 {
  margin-top: 0.9rem !important;
}

.program-detail-card .grid {
  gap: 0.65rem !important;
}

.program-detail-card .grid > div {
  padding: 0.72rem !important;
  border-radius: 1rem !important;
  font-size: 0.82rem !important;
}

.program-detail-card .rounded-\\[1\\.5rem\\] {
  padding: 1rem !important;
}

/* =========================================================
   FOCUS
========================================================= */

.program-focus-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(300px, 1.1fr);
  align-items: center;
  gap: clamp(0.9rem, 2.3vw, 2.6rem);
}

.program-focus-left,
.program-focus-card-wrap {
  min-width: 0;
  min-height: 0;
}

.program-focus-card {
  position: relative;
  height: min(100%, 500px);
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 2.4rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  padding: clamp(1rem, 2.8vw, 2rem);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
}

.program-focus-card h3 {
  font-size: clamp(1.3rem, min(2.6vw, 4.5vh), 2.5rem) !important;
}

/* =========================================================
   FLOW
========================================================= */

.program-flow-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.8rem, 1.8vh, 1.3rem);
}

.program-flow-layout > .mx-auto {
  min-height: 0;
}

.program-flow-layout .program-heading {
  font-size: clamp(1.9rem, min(4.3vw, 6.4vh), 4rem);
}

.program-flow-grid {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  overflow: hidden;
}

.program-flow-card {
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid rgba(6, 95, 70, 0.1);
  background: rgba(255, 255, 255, 0.86);
  padding: 1rem;
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
  height: 3.4rem;
  width: 3.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 1.1rem;
  background: #052e22;
  color: #facc15;
  font-size: 0.9rem;
  font-weight: 900;
}

.program-flow-card h3 {
  margin-top: 1rem !important;
  font-size: clamp(1.15rem, 1.8vw, 1.55rem) !important;
  line-height: 1.1;
}

.program-flow-card p {
  margin-top: 0.65rem !important;
  font-size: clamp(0.78rem, 1.1vw, 0.92rem) !important;
  line-height: 1.55;
}

/* =========================================================
   FAQ
========================================================= */

.program-faq-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: center;
  gap: 1.1rem;
}

.program-faq-left {
  min-width: 0;
  min-height: 0;
}

.program-faq-list {
  min-height: 0;
  max-height: 100%;
  display: grid;
  gap: 0.75rem;
  overflow: hidden;
}

.program-faq-item {
  width: 100%;
  min-height: 0;
  border-radius: 1.35rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.09);
  padding: 0.95rem;
  backdrop-filter: blur(14px);
  transition: 0.25s ease;
}

.program-faq-item:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-3px);
}

/* =========================================================
   CTA
========================================================= */

.program-cta-card {
  position: relative;
  width: min(100%, 900px);
  max-height: var(--program-available-height);
  margin-inline: auto;
  overflow: hidden;
  border-radius: 2.4rem;
  border: 1px solid rgba(6, 95, 70, 0.1);
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(1.25rem, 3.2vw, 2.6rem);
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
  margin: 0 auto 1rem;
  display: flex;
  height: 4.5rem;
  width: 4.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
  background: #052e22;
  color: #facc15;
  font-size: 1.8rem;
  box-shadow: 0 24px 65px rgba(5, 46, 34, 0.22);
}

/* =========================================================
   BOTTOM CONTROL
========================================================= */

.program-bottom-control {
  position: fixed;
  left: 50%;
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 270;
  display: flex;
  transform: translateX(-50%);
  align-items: center;
  gap: 0.75rem;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1024px) {
  .program-screen {
    --program-nav-space: var(--program-navbar-height, 84px);
    --program-control-space: 64px;
    width: min(94vw, 980px);
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

  .program-buttons-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(62px, 1fr);
  }

  .program-flow-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* =========================================================
   PHONE ROMBAK LAYOUT
========================================================= */

@media (max-width: 720px) {
  .program-root {
    height: 100svh;
    min-height: 100svh;
    overflow: hidden;
  }

  .program-screen {
    --program-nav-space: var(--program-navbar-height, 64px);
    --program-control-space: 38px;
    --program-progress-space: 5px;
    --program-top-space: calc(var(--program-nav-space) + 5px);
    --program-bottom-space: calc(
      var(--program-control-space) + var(--program-progress-space) +
        var(--program-safe-bottom)
    );
    --program-available-height: calc(
      100svh - var(--program-top-space) - var(--program-bottom-space)
    );

    width: 100%;
    height: 100svh;
    max-height: 100svh;
    padding-inline: 9px;
    padding-top: var(--program-top-space);
    padding-bottom: var(--program-bottom-space);
    overflow: hidden;
  }

  .program-hero-grid,
  .program-list-layout,
  .program-focus-layout,
  .program-flow-layout,
  .program-faq-layout {
    height: var(--program-available-height);
    max-height: var(--program-available-height);
    min-height: 0;
    overflow: hidden;
  }

  .program-orbit {
    display: none !important;
  }

  .program-hero-screen {
    align-items: stretch;
  }

  .program-hero-grid {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.42rem;
  }

  .program-hero-copy {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .program-hero-copy > p:first-child {
    margin-bottom: 0.22rem !important;
    font-size: clamp(0.62rem, 3vw, 0.76rem) !important;
    line-height: 1.08 !important;
  }

  .program-title {
    margin-top: 0.4rem !important;
    font-size: clamp(1.38rem, 7.1vw, 1.9rem) !important;
    line-height: 0.9 !important;
    letter-spacing: -0.06em !important;
  }

  .program-heading {
    font-size: clamp(1rem, 5.4vw, 1.55rem) !important;
    line-height: 0.94 !important;
    letter-spacing: -0.055em !important;
  }

  .program-hero-copy > p.mt-4 {
    margin-top: 0.42rem !important;
    max-width: 100%;
    font-size: clamp(0.52rem, 2.45vw, 0.62rem) !important;
    line-height: 1.2 !important;
  }

  .program-hero-copy .mt-6 {
    margin-top: 0.45rem !important;
    gap: 0.35rem !important;
  }

  .program-hero-copy a {
    min-height: 30px !important;
    padding: 0.42rem 0.65rem !important;
    font-size: 0.54rem !important;
  }

  .program-hero-copy a svg {
    font-size: 0.62rem !important;
  }

  .program-hero-copy .inline-flex,
  .program-list-header .inline-flex,
  .program-focus-left .inline-flex,
  .program-flow-layout .inline-flex,
  .program-faq-left .inline-flex,
  .program-cta-card .inline-flex {
    max-width: 100%;
    padding: 0.32rem 0.5rem !important;
    gap: 0.32rem !important;
    font-size: 0.43rem !important;
    letter-spacing: 0.11em !important;
  }

  .program-hero-copy .inline-flex span:last-child,
  .program-list-header .inline-flex span:last-child,
  .program-focus-left .inline-flex span:last-child,
  .program-flow-layout .inline-flex span:last-child,
  .program-faq-left .inline-flex span:last-child,
  .program-cta-card .inline-flex span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .program-stats {
    margin-top: 0.45rem !important;
    display: grid !important;
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 0.26rem !important;
    max-height: 40px !important;
    overflow: hidden !important;
  }

  .program-stats > div {
    min-width: 0;
    min-height: 0;
  }

  .program-stats > div > div {
    height: 40px !important;
    min-height: 40px !important;
    padding: 0.26rem 0.16rem !important;
    border-radius: 0.65rem !important;
    overflow: hidden;
  }

  .program-stats .mx-auto {
    width: 1.22rem !important;
    height: 1.22rem !important;
    margin-bottom: 0 !important;
    border-radius: 0.45rem !important;
    font-size: 0.5rem !important;
  }

  .program-stats h3,
  .program-stats p {
    display: none !important;
  }

  /* =========================
     DAFTAR PROGRAM MOBILE BARU
  ========================= */

  .program-list-layout {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0.34rem !important;
  }

  .program-list-header {
    max-width: 100%;
  }

  .program-list-header .program-heading {
    margin-top: 0.42rem !important;
    max-width: 100%;
    font-size: clamp(1rem, 5.3vw, 1.42rem) !important;
    line-height: 0.9 !important;
  }

  .program-list-header p {
    display: none !important;
  }

  .program-list-grid {
    height: 100%;
    min-height: 0;
    display: grid !important;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto !important;
    align-content: start;
    gap: 0.34rem !important;
    overflow: hidden;
  }

  .program-buttons-grid {
    width: 100%;
    height: auto !important;
    max-height: none !important;
    min-height: 0 !important;
    display: grid !important;
    grid-auto-flow: row !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    grid-template-rows: repeat(3, 31px) !important;
    grid-auto-columns: unset !important;
    grid-auto-rows: unset !important;
    gap: 0.24rem !important;
    overflow: hidden !important;
    padding: 0 !important;
  }

  .program-mini-card {
    width: 100%;
    height: 31px !important;
    min-height: 31px !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.22rem !important;
    padding: 0.2rem 0.24rem !important;
    border-radius: 0.55rem !important;
    scroll-snap-align: unset !important;
  }

  .program-mini-icon {
    width: 1.08rem !important;
    height: 1.08rem !important;
    border-radius: 0.38rem !important;
    font-size: 0.42rem !important;
  }

  .program-mini-card .text-sm {
    font-size: 0.42rem !important;
    line-height: 1.05 !important;
    white-space: normal !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .program-mini-card .text-\\[11px\\] {
    display: none !important;
  }

  .program-detail-card {
    height: auto !important;
    min-height: 0 !important;
    max-height: calc(var(--program-available-height) - 170px) !important;
    overflow: hidden !important;
    padding: 0.52rem !important;
    border-radius: 0.82rem !important;
  }

  .program-detail-card > .relative {
    height: auto !important;
    min-height: 0 !important;
  }

  .program-detail-card .flex.flex-wrap.items-start.justify-between {
    align-items: center !important;
    gap: 0.35rem !important;
  }

  .program-detail-icon {
    width: 1.75rem !important;
    height: 1.75rem !important;
    border-radius: 0.55rem !important;
    font-size: 0.75rem !important;
  }

  .program-detail-card .rounded-full.bg-yellow-400 {
    padding: 0.32rem 0.55rem !important;
    font-size: 0.42rem !important;
    letter-spacing: 0.1em !important;
  }

  .program-detail-card .text-xs,
  .program-detail-card .text-\\[10px\\] {
    font-size: 0.42rem !important;
    letter-spacing: 0.12em !important;
  }

  .program-detail-card h3 {
    margin-top: 0.28rem !important;
    font-size: clamp(0.95rem, 5vw, 1.28rem) !important;
    line-height: 0.95 !important;
  }

  .program-detail-card p {
    font-size: 0.48rem !important;
    line-height: 1.18 !important;
  }

  .program-detail-card .mt-7,
  .program-detail-card .mt-6,
  .program-detail-card .mt-5,
  .program-detail-card .mt-3 {
    margin-top: 0.3rem !important;
  }

  .program-detail-card .grid {
    display: none !important;
  }

  .program-detail-card .rounded-\\[1\\.5rem\\] {
    padding: 0.44rem !important;
    border-radius: 0.65rem !important;
  }

  .program-detail-card .rounded-\\[1\\.5rem\\] p:first-child {
    font-size: 0.4rem !important;
    letter-spacing: 0.12em !important;
  }

  .program-detail-card .rounded-\\[1\\.5rem\\] p:last-child {
    font-size: 0.47rem !important;
    line-height: 1.18 !important;
  }

  /* =========================
     FOCUS MOBILE
  ========================= */

  .program-focus-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0.38rem;
  }

  .program-focus-left .program-heading {
    margin-top: 0.42rem !important;
    font-size: clamp(1rem, 5.3vw, 1.42rem) !important;
  }

  .program-focus-left p {
    margin-top: 0.36rem !important;
    font-size: 0.52rem !important;
    line-height: 1.18 !important;
  }

  .program-focus-left .mt-6 {
    margin-top: 0.35rem !important;
  }

  .program-focus-left .gap-2 {
    gap: 0.24rem !important;
  }

  .program-focus-left .gap-2 span {
    padding: 0.24rem 0.38rem !important;
    font-size: 0.42rem !important;
  }

  .program-focus-card {
    height: 100%;
    min-height: 0;
    padding: 0.52rem !important;
    border-radius: 0.82rem !important;
  }

  .program-focus-card .h-32 {
    width: 3rem !important;
    height: 3rem !important;
    border-radius: 0.72rem !important;
    font-size: 1.3rem !important;
  }

  .program-focus-card h3 {
    margin-top: 0.48rem !important;
    font-size: 0.78rem !important;
    line-height: 1.16 !important;
  }

  /* =========================
     FLOW MOBILE
  ========================= */

  .program-flow-layout {
    gap: 0.34rem;
  }

  .program-flow-layout .program-heading {
    margin-top: 0.42rem !important;
    font-size: clamp(1rem, 5.3vw, 1.42rem) !important;
  }

  .program-flow-layout p {
    margin-top: 0.36rem !important;
    font-size: 0.5rem !important;
    line-height: 1.18 !important;
  }

  .program-flow-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    grid-auto-rows: minmax(0, 1fr) !important;
    gap: 0.28rem !important;
  }

  .program-flow-card {
    height: 100%;
    padding: 0.42rem !important;
    border-radius: 0.68rem !important;
  }

  .program-flow-number {
    width: 1.45rem !important;
    height: 1.45rem !important;
    border-radius: 0.45rem !important;
    font-size: 0.43rem !important;
  }

  .program-flow-card h3 {
    margin-top: 0.3rem !important;
    font-size: 0.52rem !important;
    line-height: 1.05 !important;
  }

  .program-flow-card p {
    margin-top: 0.18rem !important;
    font-size: 0.4rem !important;
    line-height: 1.15 !important;
  }

  /* =========================
     FAQ MOBILE
  ========================= */

  .program-faq-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0.34rem;
  }

  .program-faq-left .program-heading {
    margin-top: 0.42rem !important;
    font-size: clamp(1rem, 5.3vw, 1.42rem) !important;
  }

  .program-faq-left p {
    display: none !important;
  }

  .program-faq-list {
    gap: 0.28rem !important;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 0.2rem;
    scrollbar-width: none;
  }

  .program-faq-list::-webkit-scrollbar {
    display: none;
  }

  .program-faq-item {
    padding: 0.44rem !important;
    border-radius: 0.65rem !important;
  }

  .program-faq-item h3 {
    font-size: 0.52rem !important;
    line-height: 1.15 !important;
  }

  .program-faq-item p {
    font-size: 0.47rem !important;
    line-height: 1.2 !important;
  }

  .program-faq-item .h-8 {
    width: 1.1rem !important;
    height: 1.1rem !important;
    font-size: 0.55rem !important;
  }

  /* =========================
     CTA MOBILE
  ========================= */

  .program-cta-card {
    max-height: var(--program-available-height);
    padding: 0.68rem !important;
    border-radius: 0.82rem !important;
  }

  .program-cta-icon {
    width: 2.35rem !important;
    height: 2.35rem !important;
    margin-bottom: 0.42rem !important;
    border-radius: 0.65rem !important;
    font-size: 0.85rem !important;
  }

  .program-cta-card .program-heading {
    margin-top: 0.45rem !important;
    font-size: clamp(1rem, 5.3vw, 1.42rem) !important;
  }

  .program-cta-card p {
    margin-top: 0.45rem !important;
    font-size: 0.52rem !important;
    line-height: 1.18 !important;
  }

  .program-cta-card .mt-7 {
    margin-top: 0.55rem !important;
    gap: 0.35rem !important;
  }

  .program-cta-card a {
    min-height: 30px !important;
    padding: 0.42rem 0.65rem !important;
    font-size: 0.54rem !important;
  }

  .program-bottom-control {
    bottom: max(0.28rem, env(safe-area-inset-bottom)) !important;
    gap: 0.28rem !important;
  }

  .program-bottom-control button {
    padding: 0.28rem 0.48rem !important;
    font-size: 0.46rem !important;
    border-radius: 999px !important;
  }
}

/* =========================================================
   SMALL PHONE / PIXEL 7 / GALAXY S8
========================================================= */

@media (max-width: 430px) {
  .program-screen {
    padding-inline: 8px;
  }

  .program-title {
    font-size: clamp(1.28rem, 6.8vw, 1.68rem) !important;
  }

  .program-heading {
    font-size: clamp(0.95rem, 5vw, 1.32rem) !important;
  }

  .program-hero-copy > p.mt-4 {
    font-size: 0.5rem !important;
    line-height: 1.16 !important;
  }

  .program-list-header .program-heading {
    font-size: clamp(0.95rem, 5vw, 1.28rem) !important;
  }

  .program-buttons-grid {
    grid-template-rows: repeat(3, 29px) !important;
    gap: 0.22rem !important;
  }

  .program-mini-card {
    height: 29px !important;
    min-height: 29px !important;
    padding: 0.18rem 0.22rem !important;
  }

  .program-mini-icon {
    width: 1rem !important;
    height: 1rem !important;
    border-radius: 0.35rem !important;
    font-size: 0.38rem !important;
  }

  .program-mini-card .text-sm {
    font-size: 0.39rem !important;
  }

  .program-detail-card {
    max-height: calc(var(--program-available-height) - 158px) !important;
    padding: 0.48rem !important;
  }

  .program-detail-card h3 {
    font-size: clamp(0.9rem, 4.8vw, 1.18rem) !important;
  }

  .program-detail-card p {
    font-size: 0.45rem !important;
  }

  .program-detail-card .rounded-\\[1\\.5rem\\] {
    padding: 0.38rem !important;
  }

  .program-detail-card .rounded-\\[1\\.5rem\\] p:last-child {
    font-size: 0.43rem !important;
  }
}

@media (max-width: 390px) and (max-height: 780px) {
  .program-screen {
    --program-control-space: 34px;
    --program-top-space: calc(var(--program-nav-space) + 4px);
  }

  .program-title {
    font-size: clamp(1.2rem, 6.5vw, 1.55rem) !important;
  }

  .program-hero-copy {
    justify-content: flex-start;
  }

  .program-hero-copy > p:first-child {
    font-size: 0.58rem !important;
  }

  .program-hero-copy > p.mt-4 {
    font-size: 0.47rem !important;
    line-height: 1.12 !important;
  }

  .program-hero-copy a {
    min-height: 28px !important;
    padding: 0.38rem 0.58rem !important;
    font-size: 0.5rem !important;
  }

  .program-stats {
    max-height: 34px !important;
  }

  .program-stats > div > div {
    height: 34px !important;
    min-height: 34px !important;
  }

  .program-stats .mx-auto {
    width: 1rem !important;
    height: 1rem !important;
    font-size: 0.38rem !important;
  }

  .program-buttons-grid {
    grid-template-rows: repeat(3, 27px) !important;
  }

  .program-mini-card {
    height: 27px !important;
    min-height: 27px !important;
  }

  .program-mini-card .text-sm {
    font-size: 0.36rem !important;
  }

  .program-detail-card {
    max-height: calc(var(--program-available-height) - 150px) !important;
  }
}

/* =========================================================
   SHORT HEIGHT
========================================================= */

@media (max-height: 760px) and (max-width: 720px) {
  .program-screen {
    --program-control-space: 34px;
    --program-top-space: calc(var(--program-nav-space) + 4px);
  }

  .program-hero-copy {
    justify-content: flex-start;
  }

  .program-title {
    font-size: clamp(1.18rem, 6.5vw, 1.55rem) !important;
  }

  .program-hero-copy .mt-6 {
    margin-top: 0.34rem !important;
  }

  .program-hero-copy a {
    min-height: 28px !important;
  }

  .program-stats {
    margin-top: 0.34rem !important;
    max-height: 34px !important;
  }

  .program-stats > div > div {
    height: 34px !important;
    min-height: 34px !important;
  }

  .program-list-header .program-heading,
  .program-focus-left .program-heading,
  .program-flow-layout .program-heading,
  .program-faq-left .program-heading,
  .program-cta-card .program-heading {
    font-size: clamp(0.95rem, 5vw, 1.28rem) !important;
  }

  .program-detail-card .grid {
    display: none !important;
  }
}

@media (max-height: 660px) {
  .program-stats {
    display: none !important;
  }

  .program-screen {
    --program-control-space: 32px;
  }

  .program-detail-card .grid {
    display: none !important;
  }
}
/* =========================================================
   NEW PROGRAM SECTION - RESPONSIVE 100% LAYAR
   Khusus section Daftar Program
========================================================= */

.program-new-scroll {
  width: 100% !important;
  height: var(--program-available-height) !important;
  max-height: var(--program-available-height) !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scrollbar-width: none;
  scroll-behavior: smooth;
  padding-bottom: 0.6rem !important;
}

.program-new-scroll::-webkit-scrollbar {
  display: none;
}

.program-new-page {
  min-height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: clamp(0.55rem, 1.1vh, 0.9rem);
}

/* ================= HERO ================= */

.program-new-hero {
  position: relative;
  z-index: 2;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(210px, 0.52fr);
  align-items: center;
  gap: clamp(0.8rem, 1.6vw, 1.6rem);
  overflow: hidden;
  padding: 0;
}

.program-new-hero-copy {
  position: relative;
  z-index: 2;
  min-width: 0;
}

.program-new-title {
  max-width: 760px;
  margin: clamp(0.5rem, 1vh, 0.9rem) 0 clamp(0.32rem, 0.8vh, 0.55rem);
  color: #073b31;
  font-size: clamp(1.65rem, min(3.3vw, 5.1vh), 3.45rem);
  font-weight: 950;
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.program-new-hero-copy p {
  max-width: 700px;
  margin: 0;
  color: #244f45;
  font-size: clamp(0.78rem, min(1.15vw, 1.8vh), 1.06rem);
  font-weight: 650;
  line-height: 1.45;
}

.program-new-main-btn {
  margin-top: clamp(0.55rem, 1.1vh, 0.95rem);
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border: 0;
  border-radius: 999px;
  background: #facc15;
  color: #052e22;
  padding: clamp(0.55rem, 1.1vh, 0.78rem) clamp(0.95rem, 1.8vw, 1.28rem);
  font-size: clamp(0.72rem, 1vw, 0.92rem);
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 18px 35px rgba(250, 204, 21, 0.25);
}

.program-new-main-btn-icon {
  display: inline-flex;
  width: clamp(1.35rem, 2vw, 1.62rem);
  height: clamp(1.35rem, 2vw, 1.62rem);
  align-items: center;
  justify-content: center;
  border-radius: 0.55rem;
  background: rgba(5, 46, 34, 0.12);
}

.program-new-hero-art {
  position: relative;
  min-height: clamp(120px, 22vh, 230px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.program-new-circle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: min(100%, clamp(180px, 24vw, 340px));
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(250, 204, 21, 0.28),
    rgba(250, 204, 21, 0.08)
  );
  border: 1px solid rgba(250, 204, 21, 0.18);
}

.program-new-mosque {
  position: relative;
  z-index: 2;
  width: min(82%, clamp(165px, 21vw, 280px));
  height: clamp(105px, 18vh, 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.program-new-dome {
  width: clamp(82px, 10vw, 135px);
  height: clamp(44px, 6vh, 70px);
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, #15946e, #075640);
  box-shadow: 0 18px 35px rgba(7, 59, 49, 0.2);
}

.program-new-building {
  width: clamp(132px, 17vw, 220px);
  height: clamp(62px, 10vh, 100px);
  margin-top: -4px;
  border-radius: 1rem 1rem 0 0;
  background: linear-gradient(180deg, #dcc68e, #b98c4c);
  box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 0.22);
}

/* ================= STATS ================= */

.program-new-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.55rem, 1vw, 0.9rem);
  min-height: 0;
}

.program-new-stat-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: clamp(0.55rem, 1vw, 0.85rem);
  border: 1px solid rgba(5, 46, 34, 0.08);
  border-radius: clamp(0.9rem, 1.6vw, 1.35rem);
  background: rgba(255, 255, 255, 0.88);
  padding: clamp(0.62rem, 1.1vw, 1rem);
  box-shadow: 0 16px 45px rgba(5, 46, 34, 0.08);
}

.program-new-stat-icon {
  display: flex;
  width: clamp(2.35rem, 3.6vw, 3.2rem);
  height: clamp(2.35rem, 3.6vw, 3.2rem);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #faf0c2;
  color: #073b31;
  font-size: clamp(0.95rem, 1.7vw, 1.25rem);
}

.program-new-stat-card h3 {
  margin: 0 0 0.18rem;
  color: #073b31;
  font-size: clamp(0.88rem, 1.4vw, 1.18rem);
  font-weight: 950;
  line-height: 1.05;
}

.program-new-stat-card p {
  margin: 0;
  color: #244f45;
  font-size: clamp(0.66rem, 1vw, 0.86rem);
  font-weight: 650;
  line-height: 1.25;
}

/* ================= FEATURED CARD ================= */

.program-new-featured {
  min-height: 0;
  overflow: hidden;
  border-radius: clamp(1.1rem, 2vw, 1.8rem);
  background:
    radial-gradient(circle at 17% 35%, rgba(118, 203, 73, 0.18), transparent 24%),
    linear-gradient(135deg, #032e29, #075f45 48%, #032e29);
  padding: clamp(0.75rem, 1.5vw, 1.15rem);
  color: white;
  box-shadow: 0 25px 70px rgba(4, 54, 46, 0.22);
}

.program-new-featured-top,
.program-new-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.program-new-featured-label {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.48rem;
  color: #facc15;
  font-size: clamp(0.56rem, 0.9vw, 0.76rem);
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.program-new-featured-label span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.program-new-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 999px;
  background: #facc15;
  color: #052e22;
  padding: clamp(0.46rem, 0.9vw, 0.7rem) clamp(0.75rem, 1.4vw, 1.05rem);
  font-size: clamp(0.54rem, 0.9vw, 0.7rem);
  font-weight: 950;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.program-new-featured-main {
  display: grid;
  grid-template-columns: clamp(86px, 12vw, 130px) minmax(0, 1fr);
  gap: clamp(0.7rem, 1.4vw, 1rem);
  align-items: center;
  margin-top: clamp(0.6rem, 1.1vh, 0.95rem);
}

.program-new-featured-icon-wrap {
  display: flex;
  justify-content: center;
}

.program-new-featured-icon {
  display: flex;
  width: clamp(4.7rem, min(9vw, 14vh), 7rem);
  height: clamp(4.7rem, min(9vw, 14vh), 7rem);
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: radial-gradient(circle, #315f2e, #102f1e);
  color: #facc15;
  font-size: clamp(1.9rem, min(3.6vw, 5.6vh), 2.85rem);
  box-shadow:
    0 0 0 clamp(7px, 1.2vw, 12px) rgba(250, 204, 21, 0.08),
    0 18px 40px rgba(0, 0, 0, 0.22);
}

.program-new-accent {
  margin: 0 0 0.35rem;
  color: #facc15;
  font-size: clamp(0.62rem, min(1vw, 1.55vh), 0.9rem);
  font-weight: 800;
  line-height: 1.25;
}

.program-new-featured-copy h3 {
  margin: 0;
  color: white;
  font-size: clamp(1.35rem, min(2.8vw, 4.6vh), 2.8rem);
  font-weight: 950;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.program-new-desc {
  margin: clamp(0.35rem, 0.8vh, 0.55rem) 0 0;
  max-width: 700px;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(0.68rem, min(1vw, 1.55vh), 0.95rem);
  font-weight: 550;
  line-height: 1.38;
}

.program-new-impact {
  margin-top: clamp(0.6rem, 1.1vh, 0.9rem);
  border: 1px solid rgba(250, 204, 21, 0.18);
  border-radius: clamp(0.85rem, 1.4vw, 1.15rem);
  background: linear-gradient(
    90deg,
    rgba(250, 204, 21, 0.12),
    rgba(255, 255, 255, 0.04)
  );
  padding: clamp(0.62rem, 1.2vw, 0.95rem);
}

.program-new-impact h4 {
  margin: 0 0 0.35rem;
  color: #facc15;
  font-size: clamp(0.64rem, 1vw, 0.86rem);
  font-weight: 950;
}

.program-new-impact p {
  margin: 0;
  color: white;
  font-size: clamp(0.66rem, 1vw, 0.9rem);
  font-weight: 600;
  line-height: 1.32;
}

.program-new-dots {
  display: flex;
  justify-content: center;
  gap: 0.45rem;
  margin-top: clamp(0.55rem, 1vh, 0.85rem);
}

.program-new-dot {
  width: 0.52rem;
  height: 0.52rem;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
}

.program-new-dot-active {
  width: 1.45rem;
  background: #facc15;
}

/* ================= LIST PROGRAM & REASONS ================= */

.program-new-all,
.program-new-reasons {
  min-height: 0;
}

.program-new-section-head h3 {
  margin: 0;
  color: #073b31;
  font-size: clamp(1rem, 1.6vw, 1.55rem);
  font-weight: 950;
  letter-spacing: -0.035em;
}

.program-new-section-head button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 0;
  background: transparent;
  color: #073b31;
  font-size: clamp(0.72rem, 1vw, 0.92rem);
  font-weight: 850;
  cursor: pointer;
}

.program-new-card-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.5rem, 1vw, 0.8rem);
  margin-top: clamp(0.5rem, 1vh, 0.75rem);
}

.program-new-mini {
  min-width: 0;
  border: 1px solid rgba(5, 46, 34, 0.08);
  border-radius: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(0.62rem, 1.2vw, 0.95rem);
  text-align: center;
  color: #073b31;
  cursor: pointer;
  box-shadow: 0 14px 40px rgba(5, 46, 34, 0.06);
  transition: 0.25s ease;
}

.program-new-mini-active,
.program-new-mini:hover {
  transform: translateY(-3px);
  border-color: rgba(250, 204, 21, 0.75);
}

.program-new-mini-icon {
  display: flex;
  width: clamp(2.25rem, 4.2vw, 3.15rem);
  height: clamp(2.25rem, 4.2vw, 3.15rem);
  margin: 0 auto clamp(0.42rem, 0.8vh, 0.6rem);
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #faf0c2;
  color: #073b31;
  font-size: clamp(0.95rem, 1.9vw, 1.3rem);
}

.program-new-mini h4 {
  margin: 0;
  color: #073b31;
  font-size: clamp(0.72rem, 1vw, 0.9rem);
  font-weight: 950;
  line-height: 1.08;
}

.program-new-mini p {
  margin: 0.32rem 0 0;
  color: #31564d;
  font-size: clamp(0.62rem, 0.9vw, 0.78rem);
  font-weight: 650;
  line-height: 1.25;
}

.program-new-reason-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.5rem, 1vw, 0.8rem);
  margin-top: clamp(0.5rem, 1vh, 0.75rem);
}

.program-new-reason {
  display: flex;
  min-width: 0;
  gap: 0.65rem;
  border: 1px solid rgba(5, 46, 34, 0.08);
  border-radius: clamp(0.85rem, 1.5vw, 1.15rem);
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(0.65rem, 1.2vw, 0.95rem);
  box-shadow: 0 14px 40px rgba(5, 46, 34, 0.06);
}

.program-new-reason-icon {
  display: flex;
  width: clamp(2.25rem, 3.7vw, 2.9rem);
  height: clamp(2.25rem, 3.7vw, 2.9rem);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #faf0c2;
  color: #073b31;
  font-size: clamp(0.92rem, 1.5vw, 1.15rem);
}

.program-new-reason h4 {
  margin: 0;
  color: #073b31;
  font-size: clamp(0.72rem, 1vw, 0.9rem);
  font-weight: 950;
  line-height: 1.12;
}

.program-new-reason p {
  margin: 0.35rem 0 0;
  color: #31564d;
  font-size: clamp(0.62rem, 0.9vw, 0.78rem);
  font-weight: 600;
  line-height: 1.3;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1024px) {
  .program-new-page {
    grid-template-rows: auto auto auto auto;
  }

  .program-new-hero {
    grid-template-columns: minmax(0, 1fr) minmax(160px, 0.45fr);
  }

  .program-new-card-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .program-new-reason-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* =========================================================
   HANDPHONE
========================================================= */

@media (max-width: 720px) {
  .program-new-scroll {
    height: var(--program-available-height) !important;
    max-height: var(--program-available-height) !important;
    padding: 0 0 3.8rem !important;
  }

  .program-new-page {
    min-height: 100%;
    display: block;
  }

  .program-new-hero {
    grid-template-columns: 1fr;
    gap: 0.55rem;
    padding: 0;
  }

  .program-new-title {
    margin: 0.58rem 0 0.35rem;
    font-size: clamp(1.42rem, 7.2vw, 2.05rem);
    line-height: 0.98;
  }

  .program-new-hero-copy p {
    font-size: clamp(0.76rem, 3.25vw, 0.88rem);
    line-height: 1.38;
  }

  .program-new-main-btn {
    width: 100%;
    min-height: 38px;
    margin-top: 0.72rem;
    padding: 0.68rem 0.9rem;
    font-size: 0.78rem;
  }

  .program-new-main-btn-icon {
    width: 1.35rem;
    height: 1.35rem;
  }

  .program-new-hero-art {
    min-height: 104px;
    align-items: center;
  }

  .program-new-circle {
    right: -40px;
    width: 190px;
  }

  .program-new-mosque {
    width: 150px;
    height: 92px;
    margin-left: auto;
  }

  .program-new-dome {
    width: 78px;
    height: 40px;
  }

  .program-new-building {
    width: 126px;
    height: 56px;
  }

  .program-new-stats {
    grid-template-columns: 1fr;
    gap: 0.48rem;
    margin-top: 0.6rem;
  }

  .program-new-stat-card {
    min-height: 62px;
    padding: 0.65rem;
    border-radius: 0.95rem;
  }

  .program-new-stat-icon {
    width: 2.45rem;
    height: 2.45rem;
    font-size: 0.95rem;
  }

  .program-new-stat-card h3 {
    font-size: 0.95rem;
  }

  .program-new-stat-card p {
    font-size: 0.72rem;
  }

  .program-new-featured {
    margin-top: 0.65rem;
    border-radius: 1.2rem;
    padding: 0.78rem;
  }

  .program-new-featured-label {
    font-size: 0.52rem;
    letter-spacing: 0.12em;
  }

  .program-new-pill {
    padding: 0.48rem 0.7rem;
    font-size: 0.52rem;
  }

  .program-new-featured-main {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 0.68rem;
    margin-top: 0.72rem;
  }

  .program-new-featured-icon {
    width: 4.25rem;
    height: 4.25rem;
    font-size: 1.75rem;
  }

  .program-new-accent {
    font-size: 0.62rem;
    line-height: 1.22;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.22rem, 6.3vw, 1.75rem);
  }

  .program-new-desc {
    font-size: 0.72rem;
    line-height: 1.32;
  }

  .program-new-impact {
    margin-top: 0.65rem;
    padding: 0.72rem;
    border-radius: 0.9rem;
  }

  .program-new-impact h4 {
    font-size: 0.68rem;
  }

  .program-new-impact p {
    font-size: 0.72rem;
  }

  .program-new-dots {
    margin-top: 0.65rem;
  }

  .program-new-all,
  .program-new-reasons {
    margin-top: 1rem;
  }

  .program-new-section-head h3 {
    font-size: 1.05rem;
  }

  .program-new-section-head button {
    font-size: 0.74rem;
  }

  .program-new-card-row {
    display: flex;
    gap: 0.62rem;
    overflow-x: auto;
    padding-bottom: 0.38rem;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .program-new-card-row::-webkit-scrollbar {
    display: none;
  }

  .program-new-mini {
    min-width: 128px;
    flex: 0 0 128px;
    padding: 0.75rem 0.65rem;
    border-radius: 0.95rem;
    scroll-snap-align: start;
  }

  .program-new-mini-icon {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.05rem;
  }

  .program-new-mini h4 {
    font-size: 0.78rem;
  }

  .program-new-mini p {
    font-size: 0.68rem;
  }

  .program-new-reason-grid {
    grid-template-columns: 1fr;
    gap: 0.58rem;
  }

  .program-new-reason {
    padding: 0.72rem;
    border-radius: 0.95rem;
  }

  .program-new-reason-icon {
    width: 2.35rem;
    height: 2.35rem;
    font-size: 0.95rem;
  }

  .program-new-reason h4 {
    font-size: 0.78rem;
  }

  .program-new-reason p {
    font-size: 0.68rem;
  }
}

/* =========================================================
   HANDPHONE PENDEK / GALAXY S8
========================================================= */

@media (max-width: 430px) and (max-height: 820px) {
  .program-new-title {
    font-size: clamp(1.24rem, 6.7vw, 1.72rem);
  }

  .program-new-hero-copy p {
    font-size: 0.7rem;
    line-height: 1.3;
  }

  .program-new-main-btn {
    min-height: 34px;
    padding: 0.56rem 0.75rem;
    font-size: 0.7rem;
  }

  .program-new-hero-art {
    min-height: 80px;
  }

  .program-new-mosque {
    height: 78px;
    width: 125px;
  }

  .program-new-dome {
    width: 62px;
    height: 32px;
  }

  .program-new-building {
    width: 102px;
    height: 48px;
  }

  .program-new-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.35rem;
  }

  .program-new-stat-card {
    min-height: 58px;
    display: block;
    text-align: center;
    padding: 0.42rem 0.28rem;
    border-radius: 0.78rem;
  }

  .program-new-stat-icon {
    width: 1.85rem;
    height: 1.85rem;
    margin: 0 auto 0.22rem;
    font-size: 0.72rem;
  }

  .program-new-stat-card h3 {
    font-size: 0.62rem;
  }

  .program-new-stat-card p {
    font-size: 0.48rem;
    line-height: 1.15;
  }

  .program-new-featured {
    padding: 0.62rem;
  }

  .program-new-featured-main {
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 0.55rem;
  }

  .program-new-featured-icon {
    width: 3.2rem;
    height: 3.2rem;
    font-size: 1.35rem;
    box-shadow:
      0 0 0 6px rgba(250, 204, 21, 0.08),
      0 12px 28px rgba(0, 0, 0, 0.2);
  }

  .program-new-accent {
    font-size: 0.5rem;
  }

  .program-new-featured-copy h3 {
    font-size: 1.12rem;
  }

  .program-new-desc {
    font-size: 0.6rem;
    line-height: 1.22;
  }

  .program-new-impact {
    padding: 0.55rem;
  }

  .program-new-impact h4 {
    font-size: 0.56rem;
  }

  .program-new-impact p {
    font-size: 0.6rem;
    line-height: 1.22;
  }
}

/* =========================================================
   DESKTOP PENDEK / LAPTOP KECIL
========================================================= */

@media (min-width: 721px) and (max-height: 760px) {
  .program-new-page {
    gap: 0.48rem;
  }

  .program-new-title {
    font-size: clamp(1.45rem, min(2.8vw, 4.8vh), 2.85rem);
  }

  .program-new-hero-copy p {
    font-size: 0.78rem;
    line-height: 1.32;
  }

  .program-new-main-btn {
    min-height: 36px;
    padding: 0.55rem 0.9rem;
    font-size: 0.76rem;
  }

  .program-new-hero-art {
    min-height: 130px;
  }

  .program-new-stats {
    gap: 0.45rem;
  }

  .program-new-stat-card {
    min-height: 58px;
    padding: 0.5rem;
  }

  .program-new-featured {
    padding: 0.72rem;
  }

  .program-new-featured-main {
    grid-template-columns: 84px minmax(0, 1fr);
  }

  .program-new-featured-icon {
    width: 4.4rem;
    height: 4.4rem;
    font-size: 1.8rem;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.35rem, min(2.4vw, 4vh), 2.3rem);
  }

  .program-new-desc {
    font-size: 0.72rem;
    line-height: 1.25;
  }

  .program-new-impact {
    padding: 0.6rem;
  }

  .program-new-card-row,
  .program-new-reason-grid {
    gap: 0.45rem;
  }

  .program-new-mini,
  .program-new-reason {
    padding: 0.55rem;
  }

  .program-new-mini-icon,
  .program-new-reason-icon {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 0.9rem;
  }
}

/* =========================================================
   REMOVE PROGRAM INDICATORS + FULL SCREEN PROGRAM SECTION
========================================================= */

.program-bottom-control,
.program-root .fixed.bottom-0.left-0.z-\[260\],
.program-root .fixed.right-5.top-1\/2.z-\[260\] {
  display: none !important;
}

/* section daftar program memakai 100% layar setelah header */
.program-new-scroll {
  width: 100% !important;
  height: var(--program-available-height) !important;
  max-height: var(--program-available-height) !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
  scrollbar-width: none;
}

.program-new-scroll::-webkit-scrollbar {
  display: none;
}

.program-new-page {
  min-height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto auto auto auto;
  align-content: start;
  gap: clamp(0.55rem, 1.15vh, 0.95rem);
}

/* desktop: lebih rapat agar 1 layar lebih lega */
@media (min-width: 1025px) {
  .program-screen {
    --program-top-space: calc(var(--program-nav-space) + 12px);
    --program-bottom-space: 12px;
    width: min(96vw, 1440px);
  }

  .program-new-hero {
    min-height: clamp(210px, 28vh, 310px);
  }

  .program-new-title {
    font-size: clamp(2.2rem, min(3.2vw, 5.4vh), 4rem) !important;
    line-height: 0.95 !important;
  }

  .program-new-featured {
    min-height: 0 !important;
  }
}

/* tablet */
@media (max-width: 1024px) {
  .program-screen {
    --program-nav-space: var(--program-navbar-height, 84px);
    --program-top-space: calc(var(--program-nav-space) + 10px);
    --program-bottom-space: calc(10px + var(--program-safe-bottom));
    width: min(95vw, 980px);
  }

  .program-new-page {
    gap: 0.7rem;
  }
}

/* HP: header + isi tetap 100% layar, tanpa tombol bawah */
@media (max-width: 720px) {
  .program-screen {
    --program-nav-space: var(--program-navbar-height, 64px);
    --program-top-space: calc(var(--program-nav-space) + 8px);
    --program-bottom-space: calc(8px + var(--program-safe-bottom));
    --program-available-height: calc(
      100svh - var(--program-top-space) - var(--program-bottom-space)
    );

    width: 100%;
    height: 100svh;
    max-height: 100svh;
    padding-inline: 10px;
    padding-top: var(--program-top-space);
    padding-bottom: var(--program-bottom-space);
  }

  .program-new-scroll {
    height: var(--program-available-height) !important;
    max-height: var(--program-available-height) !important;
    padding-bottom: max(10px, env(safe-area-inset-bottom)) !important;
  }

  .program-new-page {
    display: block;
    min-height: 100%;
  }

  .program-new-hero {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }

  .program-new-title {
    margin: 0.52rem 0 0.32rem !important;
    font-size: clamp(1.35rem, 7vw, 2rem) !important;
    line-height: 0.98 !important;
  }

  .program-new-hero-copy p {
    font-size: clamp(0.72rem, 3.15vw, 0.86rem) !important;
    line-height: 1.35 !important;
  }

  .program-new-main-btn {
    min-height: 36px !important;
    margin-top: 0.62rem !important;
    padding: 0.62rem 0.85rem !important;
    font-size: 0.76rem !important;
  }

  .program-new-hero-art {
    min-height: 82px !important;
  }

  .program-new-stats {
    margin-top: 0.58rem !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.4rem !important;
  }

  .program-new-stat-card {
    display: block !important;
    min-height: 58px !important;
    padding: 0.42rem 0.3rem !important;
    text-align: center !important;
    border-radius: 0.82rem !important;
  }

  .program-new-stat-icon {
    width: 1.9rem !important;
    height: 1.9rem !important;
    margin: 0 auto 0.22rem !important;
    font-size: 0.76rem !important;
  }

  .program-new-stat-card h3 {
    font-size: 0.64rem !important;
    line-height: 1 !important;
  }

  .program-new-stat-card p {
    font-size: 0.5rem !important;
    line-height: 1.14 !important;
  }

  .program-new-featured {
    margin-top: 0.62rem !important;
    padding: 0.68rem !important;
    border-radius: 1rem !important;
  }

  .program-new-featured-main {
    grid-template-columns: 58px minmax(0, 1fr) !important;
    gap: 0.58rem !important;
    margin-top: 0.6rem !important;
  }

  .program-new-featured-icon {
    width: 3.35rem !important;
    height: 3.35rem !important;
    font-size: 1.35rem !important;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.12rem, 5.8vw, 1.65rem) !important;
    line-height: 0.98 !important;
  }

  .program-new-desc {
    font-size: 0.64rem !important;
    line-height: 1.26 !important;
  }

  .program-new-impact {
    margin-top: 0.58rem !important;
    padding: 0.58rem !important;
    border-radius: 0.82rem !important;
  }

  .program-new-impact h4 {
    font-size: 0.58rem !important;
  }

  .program-new-impact p {
    font-size: 0.62rem !important;
    line-height: 1.24 !important;
  }

  .program-new-all,
  .program-new-reasons {
    margin-top: 0.85rem !important;
  }
}

/* HP pendek seperti Galaxy S8 */
@media (max-width: 430px) and (max-height: 820px) {
  .program-screen {
    --program-top-space: calc(var(--program-nav-space) + 6px);
    --program-bottom-space: calc(6px + var(--program-safe-bottom));
    padding-inline: 8px;
  }

  .program-new-title {
    font-size: clamp(1.18rem, 6.5vw, 1.62rem) !important;
  }

  .program-new-hero-copy p {
    font-size: 0.66rem !important;
    line-height: 1.25 !important;
  }

  .program-new-main-btn {
    min-height: 32px !important;
    padding: 0.5rem 0.72rem !important;
    font-size: 0.68rem !important;
  }

  .program-new-hero-art {
    min-height: 62px !important;
  }

  .program-new-mosque {
    height: 64px !important;
    width: 110px !important;
  }

  .program-new-dome {
    width: 56px !important;
    height: 28px !important;
  }

  .program-new-building {
    width: 92px !important;
    height: 38px !important;
  }

  .program-new-stats {
    gap: 0.32rem !important;
  }

  .program-new-stat-card {
    min-height: 50px !important;
    padding: 0.32rem 0.24rem !important;
  }

  .program-new-stat-icon {
    width: 1.55rem !important;
    height: 1.55rem !important;
    font-size: 0.62rem !important;
  }

  .program-new-stat-card h3 {
    font-size: 0.54rem !important;
  }

  .program-new-stat-card p {
    font-size: 0.42rem !important;
  }

  .program-new-featured {
    padding: 0.55rem !important;
  }

  .program-new-featured-label {
    font-size: 0.46rem !important;
  }

  .program-new-pill {
    padding: 0.38rem 0.58rem !important;
    font-size: 0.46rem !important;
  }

  .program-new-featured-main {
    grid-template-columns: 48px minmax(0, 1fr) !important;
  }

  .program-new-featured-icon {
    width: 2.75rem !important;
    height: 2.75rem !important;
    font-size: 1.1rem !important;
  }

  .program-new-accent {
    font-size: 0.48rem !important;
  }

  .program-new-featured-copy h3 {
    font-size: 1rem !important;
  }

  .program-new-desc {
    font-size: 0.54rem !important;
  }

  .program-new-impact {
    padding: 0.48rem !important;
  }

  .program-new-impact h4 {
    font-size: 0.5rem !important;
  }

  .program-new-impact p {
    font-size: 0.54rem !important;
  }
}

/* =========================================================
   FIX PUTIH KOSONG DI BAWAH SECTION DAFTAR PROGRAM
   Membuat section program penuh 100% layar dan featured card
   mengisi sisa ruang bawah.
========================================================= */

.program-new-scroll {
  background:
    radial-gradient(circle at 15% 20%, rgba(16, 185, 129, 0.12), transparent 30%),
    radial-gradient(circle at 88% 72%, rgba(250, 204, 21, 0.2), transparent 34%),
    linear-gradient(180deg, #f8f4e8 0%, #f7f1df 42%, #064e3b 42%, #052e22 100%) !important;
}

.program-new-page {
  height: 100% !important;
  min-height: 100% !important;
  display: grid !important;
  grid-template-rows: auto auto minmax(0, 1fr) !important;
  align-content: stretch !important;
  gap: clamp(0.55rem, 1vh, 0.85rem) !important;
}

.program-new-featured {
  height: 100% !important;
  min-height: 0 !important;
  max-height: none !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  overflow: hidden !important;
  margin-top: 0 !important;
}

.program-new-featured-main {
  flex-shrink: 0 !important;
}

.program-new-impact {
  flex-shrink: 0 !important;
}

.program-new-dots {
  flex-shrink: 0 !important;
}

/* bagian bawah yang bikin putih panjang di desktop disembunyikan dari 1 layar */
.program-new-all,
.program-new-reasons {
  display: none !important;
}

/* Desktop besar: featured card jadi area bawah penuh */
@media (min-width: 1025px) {
  .program-screen {
    width: min(96vw, 1480px) !important;
    --program-top-space: calc(var(--program-nav-space) + 10px) !important;
    --program-bottom-space: 0px !important;
  }

  .program-new-scroll {
    height: var(--program-available-height) !important;
    max-height: var(--program-available-height) !important;
    padding-bottom: 0 !important;
  }

  .program-new-hero {
    min-height: 210px !important;
    max-height: 260px !important;
  }

  .program-new-title {
    font-size: clamp(2.15rem, 3vw, 3.8rem) !important;
    line-height: 0.94 !important;
  }

  .program-new-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.75rem !important;
  }

  .program-new-stat-card {
    min-height: 78px !important;
    padding: 0.85rem !important;
  }

  .program-new-featured {
    border-radius: 1.6rem 1.6rem 0 0 !important;
    padding: 1.15rem !important;
  }

  .program-new-featured-main {
    grid-template-columns: 130px minmax(0, 1fr) !important;
    gap: 1rem !important;
  }

  .program-new-featured-icon {
    width: 6.8rem !important;
    height: 6.8rem !important;
    font-size: 2.75rem !important;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(2rem, 2.8vw, 3rem) !important;
  }

  .program-new-desc {
    font-size: 0.95rem !important;
    line-height: 1.42 !important;
  }
}

/* Laptop pendek: rapatkan agar tidak ada putih kosong */
@media (min-width: 721px) and (max-height: 820px) {
  .program-new-page {
    grid-template-rows: auto auto minmax(0, 1fr) !important;
    gap: 0.55rem !important;
  }

  .program-new-hero {
    min-height: 170px !important;
    max-height: 220px !important;
  }

  .program-new-title {
    margin: 0.55rem 0 0.35rem !important;
    font-size: clamp(1.75rem, 2.7vw, 3rem) !important;
  }

  .program-new-hero-copy p {
    font-size: 0.82rem !important;
    line-height: 1.3 !important;
  }

  .program-new-main-btn {
    min-height: 38px !important;
    margin-top: 0.55rem !important;
    padding: 0.55rem 0.95rem !important;
    font-size: 0.78rem !important;
  }

  .program-new-hero-art {
    min-height: 145px !important;
  }

  .program-new-stats {
    gap: 0.5rem !important;
  }

  .program-new-stat-card {
    min-height: 64px !important;
    padding: 0.58rem 0.75rem !important;
  }

  .program-new-stat-icon {
    width: 2.4rem !important;
    height: 2.4rem !important;
    font-size: 0.95rem !important;
  }

  .program-new-stat-card h3 {
    font-size: 1rem !important;
  }

  .program-new-stat-card p {
    font-size: 0.72rem !important;
  }

  .program-new-featured {
    padding: 0.85rem !important;
  }

  .program-new-featured-main {
    grid-template-columns: 90px minmax(0, 1fr) !important;
    gap: 0.8rem !important;
    margin-top: 0.7rem !important;
  }

  .program-new-featured-icon {
    width: 4.9rem !important;
    height: 4.9rem !important;
    font-size: 2rem !important;
  }

  .program-new-accent {
    font-size: 0.68rem !important;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.45rem, 2.4vw, 2.4rem) !important;
  }

  .program-new-desc {
    font-size: 0.72rem !important;
    line-height: 1.28 !important;
  }

  .program-new-impact {
    margin-top: 0.65rem !important;
    padding: 0.65rem !important;
  }

  .program-new-impact h4 {
    font-size: 0.64rem !important;
  }

  .program-new-impact p {
    font-size: 0.68rem !important;
    line-height: 1.25 !important;
  }
}

/* HP tetap scroll internal, tapi tidak ada blok putih kosong */
@media (max-width: 720px) {
  .program-new-scroll {
    background:
      radial-gradient(circle at 15% 16%, rgba(16, 185, 129, 0.12), transparent 32%),
      radial-gradient(circle at 88% 72%, rgba(250, 204, 21, 0.18), transparent 34%),
      linear-gradient(180deg, #f8f4e8 0%, #f7f1df 50%, #064e3b 50%, #052e22 100%) !important;
  }

  .program-new-page {
    display: grid !important;
    grid-template-rows: auto auto minmax(0, 1fr) !important;
    height: 100% !important;
  }

  .program-new-featured {
    height: 100% !important;
    border-radius: 1rem 1rem 0 0 !important;
  }

  .program-new-all,
  .program-new-reasons {
    display: none !important;
  }
}

.program-root {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #041b15;
}

/* semua section harus benar-benar mengikuti layar */
.program-screen {
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: 100dvh;
  margin: 0;
  padding-inline: clamp(14px, 3vw, 54px);
  padding-top: calc(var(--program-navbar-height, 92px) + clamp(14px, 2vh, 22px));
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  overflow: hidden;
}

/* khusus halaman daftar program */
.program-new-scroll {
  height: 100dvh;
  max-height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* hilangkan scrollbar besar tapi tetap bisa scroll */
.program-new-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.program-new-page {
  width: 100%;
  min-height: calc(100dvh - var(--program-navbar-height, 92px));
  display: grid;
  grid-template-rows: auto auto auto auto auto;
  gap: clamp(12px, 1.8vh, 22px);
  padding-bottom: clamp(16px, 3vh, 38px);
}

/* HERO PROGRAM */
.program-new-hero {
  position: relative;
  width: 100%;
  min-height: clamp(230px, 34vh, 360px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.6fr);
  align-items: center;
  gap: clamp(14px, 3vw, 34px);
  overflow: hidden;
  border-radius: clamp(26px, 3vw, 42px);
  border: 1px solid rgba(6, 95, 70, 0.12);
  background:
    radial-gradient(circle at 85% 5%, rgba(250, 204, 21, 0.34), transparent 34%),
    radial-gradient(circle at 5% 15%, rgba(16, 185, 129, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(242, 251, 246, 0.88));
  padding: clamp(18px, 3vw, 42px);
  box-shadow: 0 26px 80px rgba(4, 47, 34, 0.14);
}

.program-new-hero-copy {
  position: relative;
  z-index: 2;
  min-width: 0;
}

.program-new-title {
  max-width: 820px;
  margin-top: clamp(12px, 1.6vh, 18px);
  font-size: clamp(2rem, 5vw, 5.2rem);
  line-height: 0.92;
  letter-spacing: -0.065em;
  font-weight: 950;
  color: #043f32;
}

.program-new-hero-copy > p {
  max-width: 720px;
  margin-top: clamp(10px, 1.4vh, 16px);
  font-size: clamp(0.86rem, 1.25vw, 1.12rem);
  line-height: 1.6;
  font-weight: 750;
  color: rgba(4, 64, 50, 0.72);
}

.program-new-main-btn {
  margin-top: clamp(16px, 2vh, 24px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  border: 0;
  border-radius: 999px;
  background: #facc15;
  padding: 0 24px;
  font-size: clamp(0.82rem, 1vw, 0.95rem);
  font-weight: 950;
  color: #043f32;
  box-shadow: 0 18px 40px rgba(250, 204, 21, 0.28);
  cursor: pointer;
  transition: 0.25s ease;
}

.program-new-main-btn:hover {
  transform: translateY(-3px);
  background: #fde047;
}

.program-new-main-btn-icon {
  display: flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(4, 63, 50, 0.12);
}

/* ART HERO */
.program-new-hero-art {
  position: relative;
  height: 100%;
  min-height: 220px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.program-new-circle {
  position: absolute;
  top: -36%;
  right: -16%;
  width: min(34vw, 360px);
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(250, 204, 21, 0.35), rgba(250, 204, 21, 0.08));
  border: 1px solid rgba(250, 204, 21, 0.35);
}

.program-new-mosque {
  position: relative;
  width: min(100%, 270px);
  height: 170px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.program-new-dome {
  position: absolute;
  bottom: 66px;
  width: 120px;
  height: 86px;
  border-radius: 90px 90px 14px 14px;
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 20px 40px rgba(4, 120, 87, 0.22);
}

.program-new-building {
  position: absolute;
  bottom: 24px;
  width: 230px;
  height: 70px;
  border-radius: 18px 18px 0 0;
  background: linear-gradient(180deg, #e5c27a, #c79542);
  border: 7px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 18px 40px rgba(4, 47, 34, 0.18);
}

/* STAT CARD */
.program-new-stats {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.5vw, 18px);
}

.program-new-stat-card {
  min-width: 0;
  min-height: 82px;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.3vw, 18px);
  border-radius: clamp(18px, 2vw, 28px);
  border: 1px solid rgba(6, 95, 70, 0.11);
  background: rgba(255, 255, 255, 0.84);
  padding: clamp(12px, 1.7vw, 20px);
  box-shadow: 0 18px 48px rgba(4, 47, 34, 0.1);
  backdrop-filter: blur(16px);
}

.program-new-stat-icon {
  flex: 0 0 auto;
  display: flex;
  width: clamp(44px, 4vw, 58px);
  height: clamp(44px, 4vw, 58px);
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #fef3c7;
  color: #065f46;
  font-size: clamp(1rem, 1.4vw, 1.25rem);
}

.program-new-stat-card h3 {
  margin: 0;
  font-size: clamp(1rem, 1.7vw, 1.42rem);
  line-height: 1.05;
  font-weight: 950;
  color: #043f32;
}

.program-new-stat-card p {
  margin: 4px 0 0;
  font-size: clamp(0.72rem, 0.95vw, 0.86rem);
  line-height: 1.25;
  font-weight: 850;
  color: rgba(4, 64, 50, 0.78);
}

/* FEATURED CARD */
.program-new-featured {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: clamp(24px, 3vw, 38px);
  border: 1px solid rgba(250, 204, 21, 0.22);
  background:
    radial-gradient(circle at 0% 0%, rgba(250, 204, 21, 0.11), transparent 30%),
    radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.16), transparent 34%),
    linear-gradient(135deg, #064e3b, #022c22);
  padding: clamp(18px, 3vw, 34px);
  color: white;
  box-shadow: 0 28px 80px rgba(4, 47, 34, 0.22);
}

.program-new-featured-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: clamp(18px, 2vh, 26px);
}

.program-new-featured-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(0.72rem, 1vw, 0.9rem);
  font-weight: 950;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #facc15;
}

.program-new-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: 999px;
  background: #facc15;
  padding: 0 22px;
  font-size: clamp(0.72rem, 1vw, 0.88rem);
  font-weight: 950;
  letter-spacing: 0.12em;
  color: #043f32;
  text-transform: uppercase;
  white-space: nowrap;
}

.program-new-featured-main {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(16px, 2.2vw, 30px);
}

.program-new-featured-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-new-featured-icon {
  position: relative;
  display: flex;
  width: clamp(82px, 9vw, 122px);
  height: clamp(82px, 9vw, 122px);
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(250, 204, 21, 0.13);
  color: #facc15;
  font-size: clamp(2rem, 3.2vw, 3.8rem);
  box-shadow:
    inset 0 0 0 14px rgba(250, 204, 21, 0.05),
    0 24px 54px rgba(0, 0, 0, 0.2);
}

.program-new-accent {
  margin: 0 0 8px;
  font-size: clamp(0.76rem, 1vw, 0.92rem);
  line-height: 1.3;
  font-weight: 950;
  color: #fde047;
}

.program-new-featured-copy h3 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.program-new-desc {
  max-width: 920px;
  margin: 10px 0 0;
  font-size: clamp(0.84rem, 1.1vw, 1rem);
  line-height: 1.55;
  font-weight: 750;
  color: rgba(236, 253, 245, 0.88);
}

.program-new-impact {
  margin-top: clamp(16px, 2vh, 24px);
  border-radius: clamp(18px, 2vw, 28px);
  border: 1px solid rgba(250, 204, 21, 0.18);
  background: rgba(255, 255, 255, 0.07);
  padding: clamp(14px, 2vw, 20px);
}

.program-new-impact h4 {
  margin: 0;
  font-size: clamp(0.78rem, 1vw, 0.92rem);
  font-weight: 950;
  color: #facc15;
}

.program-new-impact p {
  margin: 6px 0 0;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
  line-height: 1.5;
  font-weight: 700;
  color: rgba(236, 253, 245, 0.86);
}

.program-new-dots {
  display: flex;
  gap: 8px;
  margin-top: clamp(14px, 2vh, 22px);
}

.program-new-dot {
  width: 10px;
  height: 10px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  cursor: pointer;
}

.program-new-dot-active {
  width: 34px;
  background: #facc15;
}

/* SEMUA PROGRAM */
.program-new-all,
.program-new-reasons {
  width: 100%;
  border-radius: clamp(22px, 3vw, 34px);
  border: 1px solid rgba(6, 95, 70, 0.1);
  background: rgba(255, 255, 255, 0.72);
  padding: clamp(16px, 2.5vw, 28px);
  box-shadow: 0 22px 60px rgba(4, 47, 34, 0.1);
  backdrop-filter: blur(16px);
}

.program-new-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: clamp(12px, 1.8vh, 20px);
}

.program-new-section-head h3 {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 2rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -0.04em;
  color: #043f32;
}

.program-new-section-head button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  border: 0;
  border-radius: 999px;
  background: #064e3b;
  padding: 0 16px;
  color: #facc15;
  font-size: 0.78rem;
  font-weight: 950;
  cursor: pointer;
}

.program-new-card-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(130px, 1fr));
  gap: clamp(10px, 1.4vw, 16px);
}

.program-new-mini {
  min-width: 0;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 8px;
  border-radius: clamp(18px, 2vw, 26px);
  border: 1px solid rgba(6, 95, 70, 0.12);
  background: #ffffff;
  padding: clamp(12px, 1.6vw, 18px);
  text-align: left;
  color: #043f32;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 16px 42px rgba(4, 47, 34, 0.08);
}

.program-new-mini:hover {
  transform: translateY(-4px);
}

.program-new-mini-active {
  background: #043f32;
  color: #ffffff;
  border-color: rgba(250, 204, 21, 0.4);
}

.program-new-mini-icon {
  display: flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #facc15;
  color: #043f32;
  font-size: 1.05rem;
}

.program-new-mini h4 {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: currentColor;
  opacity: 0.82;
}

.program-new-mini p {
  margin: 0;
  font-size: clamp(0.82rem, 1vw, 0.95rem);
  line-height: 1.2;
  font-weight: 950;
  color: currentColor;
}

/* REASONS */
.program-new-reason-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 16px);
}

.program-new-reason {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: clamp(18px, 2vw, 26px);
  border: 1px solid rgba(6, 95, 70, 0.1);
  background: rgba(255, 255, 255, 0.82);
  padding: clamp(14px, 2vw, 20px);
}

.program-new-reason-icon {
  flex: 0 0 auto;
  display: flex;
  width: 46px;
  height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 17px;
  background: #facc15;
  color: #043f32;
}

.program-new-reason h4 {
  margin: 0;
  font-size: clamp(0.92rem, 1.2vw, 1.05rem);
  line-height: 1.18;
  font-weight: 950;
  color: #043f32;
}

.program-new-reason p {
  margin: 6px 0 0;
  font-size: clamp(0.76rem, 0.95vw, 0.88rem);
  line-height: 1.45;
  font-weight: 700;
  color: rgba(4, 64, 50, 0.72);
}

/* =========================================================
   TABLET
========================================================= */
@media (max-width: 1024px) {
  .program-screen {
    padding-inline: clamp(14px, 3vw, 28px);
    padding-top: calc(var(--program-navbar-height, 86px) + 12px);
  }

  .program-new-page {
    gap: 14px;
  }

  .program-new-hero {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
  }

  .program-new-hero-art {
    min-height: 160px;
  }

  .program-new-circle {
    top: -60%;
    right: -8%;
    width: 310px;
  }

  .program-new-mosque {
    height: 140px;
    width: 230px;
  }

  .program-new-building {
    width: 210px;
    height: 62px;
  }

  .program-new-dome {
    width: 108px;
    height: 78px;
    bottom: 58px;
  }

  .program-new-card-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .program-new-reason-grid {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   HP BESAR
========================================================= */
@media (max-width: 768px) {
  .program-screen {
    padding-inline: 12px;
    padding-top: calc(var(--program-navbar-height, 76px) + 10px);
  }

  .program-new-page {
    gap: 12px;
  }

  .program-new-hero {
    border-radius: 26px;
    padding: 18px;
  }

  .program-new-title {
    font-size: clamp(2rem, 10vw, 3.2rem);
    line-height: 0.95;
  }

  .program-new-hero-copy > p {
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .program-new-main-btn {
    width: 100%;
    min-height: 50px;
  }

  .program-new-hero-art {
    display: none;
  }

  .program-new-stats {
    grid-template-columns: 1fr;
  }

  .program-new-stat-card {
    min-height: 72px;
    border-radius: 22px;
  }

  .program-new-featured {
    border-radius: 26px;
    padding: 18px;
  }

  .program-new-featured-top {
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .program-new-featured-label {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
  }

  .program-new-pill {
    min-height: 38px;
    padding: 0 14px;
    font-size: 0.68rem;
  }

  .program-new-featured-main {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .program-new-featured-icon-wrap {
    justify-content: flex-start;
  }

  .program-new-featured-icon {
    width: 78px;
    height: 78px;
    font-size: 2rem;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.8rem, 9vw, 2.8rem);
  }

  .program-new-desc {
    font-size: 0.82rem;
  }

  .program-new-all,
  .program-new-reasons {
    border-radius: 24px;
    padding: 16px;
  }

  .program-new-section-head {
    align-items: flex-start;
  }

  .program-new-section-head button {
    display: none;
  }

  .program-new-card-row {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    scroll-snap-type: x mandatory;
  }

  .program-new-card-row::-webkit-scrollbar {
    height: 0;
  }

  .program-new-mini {
    flex: 0 0 155px;
    min-height: 126px;
    scroll-snap-align: start;
  }

  .program-new-reason {
    border-radius: 20px;
    padding: 14px;
  }
}

/* =========================================================
   HP KECIL
========================================================= */
@media (max-width: 430px) {
  .program-screen {
    padding-inline: 10px;
    padding-top: calc(var(--program-navbar-height, 70px) + 8px);
  }

  .program-new-hero {
    padding: 15px;
    border-radius: 22px;
  }

  .program-new-title {
    font-size: clamp(1.72rem, 9.5vw, 2.35rem);
    letter-spacing: -0.055em;
  }

  .program-new-hero-copy > p {
    font-size: 0.78rem;
  }

  .program-new-main-btn {
    min-height: 46px;
    font-size: 0.78rem;
  }

  .program-new-stat-card {
    min-height: 66px;
    padding: 11px;
  }

  .program-new-stat-icon {
    width: 40px;
    height: 40px;
  }

  .program-new-featured {
    padding: 15px;
    border-radius: 22px;
  }

  .program-new-featured-label {
    font-size: 0.62rem;
  }

  .program-new-pill {
    min-height: 34px;
    padding: 0 12px;
    font-size: 0.62rem;
  }

  .program-new-featured-icon {
    width: 66px;
    height: 66px;
    font-size: 1.7rem;
  }

  .program-new-featured-copy h3 {
    font-size: clamp(1.55rem, 8.8vw, 2.15rem);
  }

  .program-new-desc,
  .program-new-impact p {
    font-size: 0.76rem;
  }

  .program-new-impact {
    padding: 12px;
    border-radius: 18px;
  }

  .program-new-all,
  .program-new-reasons {
    padding: 14px;
    border-radius: 20px;
  }

  .program-new-section-head h3 {
    font-size: 1.1rem;
  }

  .program-new-mini {
    flex-basis: 142px;
    min-height: 118px;
    padding: 12px;
    border-radius: 18px;
  }

  .program-new-mini-icon {
    width: 38px;
    height: 38px;
    border-radius: 14px;
  }

  .program-new-mini h4 {
    font-size: 0.62rem;
  }

  .program-new-mini p {
    font-size: 0.78rem;
  }

  .program-new-reason {
    gap: 10px;
  }

  .program-new-reason-icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
  }

  .program-new-reason h4 {
    font-size: 0.86rem;
  }

  .program-new-reason p {
    font-size: 0.74rem;
  }
}

/* HP sangat kecil */
@media (max-width: 360px) {
  .program-screen {
    padding-inline: 8px;
  }

  .program-new-title {
    font-size: 1.55rem;
  }

  .program-new-hero-copy > p {
    font-size: 0.73rem;
  }

  .program-new-mini {
    flex-basis: 132px;
  }
}


`}</style>
          </main>
  );
}
