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
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaRedo,
  FaMosque,
  FaQuran,
  FaBookOpen,
  FaHeart,
  FaShieldAlt,
  FaHome,
  FaChalkboardTeacher,
  FaUsers,
  FaMoon,
  FaStar,
  FaCheckCircle,
  FaWrench,
  FaWhatsapp,
  FaQuoteLeft,
} from "react-icons/fa";

const MotionLink = motion(Link);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const ADMIN_WHATSAPP_NUMBER = "6283899601027";

const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai pesantren.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const EASE_PREMIUM = [0.22, 1, 0.36, 1];

const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";
const CLIP_LEFT = "inset(0% 100% 0% 0%)";
const CLIP_RIGHT = "inset(0% 0% 0% 100%)";

function clipIn(direction) {
  return direction > 0 ? CLIP_RIGHT : CLIP_LEFT;
}

function clipOut(direction) {
  return direction > 0 ? CLIP_LEFT : CLIP_RIGHT;
}

const PRELOAD_ASSETS = ["/hero-santri.jpg", "/logo.png", "/pattern.png"];

const DEFAULT_HERO = {
  arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
  badge: "Islamic Boarding School",
  title: "Pondok Pesantren",
  highlight: "Al-Furqon",
  desc: "Tempat santri tumbuh melalui ilmu, ibadah, adab, kemandirian, dan pembinaan yang terarah.",
  image: "/hero-santri.jpg",
};

const DEFAULT_STATS = [
  { value: "100+", label: "Santri" },
  { value: "24 Jam", label: "Pembinaan" },
  { value: "Aktif", label: "Kegiatan Santri" },
];

const DEFAULT_VALUES = [
  {
    title: "Ibadah",
    iconKey: "quran",
    desc: "Membiasakan santri dekat dengan Al-Qur'an, shalat berjamaah, dan kegiatan keislaman.",
  },
  {
    title: "Adab",
    iconKey: "heart",
    desc: "Membentuk karakter santri agar sopan, bertanggung jawab, dan menghargai sesama.",
  },
  {
    title: "Ilmu",
    iconKey: "book",
    desc: "Menggabungkan pendidikan agama dan pendidikan formal untuk masa depan santri.",
  },
  {
    title: "Mandiri",
    iconKey: "home",
    desc: "Kehidupan asrama melatih disiplin, kebersihan, kemandirian, dan tanggung jawab.",
  },
];

const DEFAULT_PEMBINA = [
  {
    name: "Pembina Santri",
    role: "Pembinaan Harian",
    badge: "Pembina",
    focus:
      "Mendampingi adab, disiplin, ibadah, kebersihan, dan kehidupan santri sehari-hari.",
    image: "/masjid.jpg",
    iconKey: "teacher",
  },
];

const DEFAULT_REQUIREMENTS = [
  {
    title: "Dokumen Pendaftaran",
    iconKey: "book",
    items: [
      "Fotokopi ijazah terakhir legalisir 3 lembar",
      "Fotokopi SKL 3 lembar",
      "Fotokopi NISN 3 lembar",
      "Fotokopi akta kelahiran 3 lembar",
      "Fotokopi KTP orang tua 3 lembar",
      "Fotokopi Kartu Keluarga 3 lembar",
      "Pas foto 3x4 background biru 3 lembar",
      "SKCK / surat kelakuan baik dari sekolah",
    ],
  },
  {
    title: "Syarat Calon Santri",
    iconKey: "users",
    items: [
      "Mengisi formulir pendaftaran dengan data yang benar",
      "Bersedia mengikuti tata tertib pesantren",
      "Bersedia tinggal di lingkungan pesantren/asrama",
      "Sehat jasmani dan rohani",
      "Mendapat izin dari orang tua/wali",
    ],
  },
  {
    title: "Ketentuan Pesantren",
    iconKey: "shield",
    items: [
      "Santri wajib mengikuti kegiatan ibadah dan pembinaan",
      "Santri wajib menjaga adab, kebersihan, dan kedisiplinan",
      "Barang bawaan pribadi menjadi tanggung jawab masing-masing",
      "Santri wajib mematuhi arahan pengurus dan pembina",
      "Informasi pembayaran dan administrasi mengikuti ketentuan pesantren",
    ],
  },
  {
    title: "Khusus Yatim / Piatu",
    iconKey: "heart",
    items: [
      "Melampirkan surat keterangan kematian orang tua",
      "Melampirkan data wali yang bertanggung jawab",
    ],
  },
];

const DEFAULT_GUIDES = [
  {
    title: "Isi Data Santri",
    badge: "Langkah 1",
    desc: "Lengkapi data calon santri seperti nama lengkap, jenis kelamin, jenjang pendidikan, NISN, NIK, tempat lahir, tanggal lahir, agama, hobi, cita-cita, dan asal sekolah.",
    image: "/panduan-daftar-1.png",
  },
  {
    title: "Isi Data Orang Tua",
    badge: "Langkah 2",
    desc: "Lengkapi data ayah, ibu, alamat, kota, provinsi, kode pos, nomor HP, dan email yang aktif agar pihak pesantren dapat menghubungi wali santri.",
    image: "/panduan-daftar-2.png",
  },
  {
    title: "Lakukan Pembayaran",
    badge: "Langkah 3",
    desc: "Lakukan pembayaran pendaftaran melalui metode yang tersedia seperti transfer, QRIS, atau e-wallet. Setelah itu upload bukti pembayaran.",
    image: "/panduan-daftar-3.png",
  },
  {
    title: "Pendaftaran Berhasil",
    badge: "Langkah 4",
    desc: "Setelah data dan pembayaran dikirim, sistem akan menampilkan halaman berhasil. Simpan email dan password akun santri yang muncul.",
    image: "/panduan-daftar-4.png",
  },
];

const PARTICLES = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 11) % 100}%`,
  top: `${(index * 29 + 19) % 100}%`,
  size: 3 + (index % 3),
  duration: 8 + (index % 6),
  delay: index * 0.35,
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
    filter: "blur(7px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction > 0 ? -34 : 34,
    filter: "blur(7px)",
  }),
};

function getIcon(key) {
  const icons = {
    mosque: <FaMosque />,
    quran: <FaQuran />,
    book: <FaBookOpen />,
    heart: <FaHeart />,
    shield: <FaShieldAlt />,
    home: <FaHome />,
    teacher: <FaChalkboardTeacher />,
    users: <FaUsers />,
    moon: <FaMoon />,
    star: <FaStar />,
  };

  return icons[key] || <FaStar />;
}

const IMAGE_FALLBACK = "/hero-santri.jpg";

const IMAGE_ALIASES = {
  "/kegiatan-1.jpg": "/hero-santri.jpg",
  "/kegiatan-2.jpg": "/hero-santri.jpg",
  "/masjid.jpg": "/hero-santri.jpg",
};

function normalizeImage(src, fallback = IMAGE_FALLBACK) {
  if (!src || typeof src !== "string") return fallback;

  const clean = src.trim();

  if (!clean) return fallback;

  return IMAGE_ALIASES[clean] || clean;
}

function SafeImage({ src, alt, className = "", fallback = IMAGE_FALLBACK }) {
  const safeFallback = normalizeImage(fallback, IMAGE_FALLBACK);

  const [currentSrc, setCurrentSrc] = useState(() =>
    normalizeImage(src, safeFallback)
  );

  useEffect(() => {
    setCurrentSrc(normalizeImage(src, safeFallback));
  }, [src, safeFallback]);

  return (
    <img
      src={currentSrc}
      alt={alt || "image"}
      className={className}
      draggable={false}
      loading="lazy"
      onError={() => {
        if (currentSrc !== safeFallback) {
          setCurrentSrc(safeFallback);
        }
      }}
    />
  );
}

function LoadingPage() {
  return (
    <main className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-[#041b15] text-white">
      <IslamicBackground dark intense />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE_PREMIUM }}
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
          Mohon tunggu...
        </h1>
      </motion.div>
    </main>
  );
}

function MaintenancePage({ onRetry, checking }) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#041b15] text-white">
      <div className="absolute inset-0">
        <SafeImage
          src="/hero-santri.jpg"
          alt="Maintenance Al-Furqon"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#041b15] via-[#062d22]/95 to-[#041b15]" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <IslamicBackground dark intense />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-[92vw] max-w-5xl flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_PREMIUM }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-3xl" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-yellow-300/30 bg-yellow-300/10 text-3xl text-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.25)] backdrop-blur-xl">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaWrench />
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          className="mt-7 text-lg leading-loose text-yellow-300 sm:text-xl"
        >
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.25, duration: 0.65 }}
        >
          <Badge dark>Website Maintenance</Badge>

          <h1 className="mt-5 text-[clamp(2.2rem,6vw,5.4rem)] font-black leading-[0.92] tracking-[-0.06em]">
            Sistem sedang
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
              dalam perawatan.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base lg:text-lg">
            Assalamu’alaikum, Santri Al-Furqon. Informasi pondok sedang
            dipersiapkan oleh sistem. Silakan tunggu sebentar atau coba kembali
            beberapa saat lagi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.55 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <button
            onClick={onRetry}
            disabled={checking}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-black text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.35)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
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
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 sm:text-base"
          >
            Hubungi Admin
          </a>
        </motion.div>
      </div>
      
    </main>
  );
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

function CursorGlow() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (reduce) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 140);
      mouseY.set(e.clientY - 140);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduce]);

  if (reduce) return null;

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl lg:block"
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
            opacity: [0, light ? 0.2 : 0.16, 0],
            y: [-8, -52],
            scale: [0.8, 1.1, 0.85],
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
          intense ? "opacity-[0.07]" : "opacity-[0.04]"
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
      transition={{ duration: 0.45, ease: EASE_PREMIUM }}
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

  const handleMouseMove = (e) => {
    if (reduce) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const moveX = e.clientX - rect.left - rect.width / 2;
    const moveY = e.clientY - rect.top - rect.height / 2;

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

function TiltCard({ children, className = "" }) {
  const reduce = useReducedMotion();

  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e) => {
    if (reduce) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRotate({
      x: (y / rect.height - 0.5) * -4,
      y: (x / rect.width - 0.5) * 4,
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
              y: -5,
              scale: 1.008,
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
        ease: EASE_PREMIUM,
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
    <div className="fixed left-0 top-0 z-[400] h-1 w-full bg-white/10">
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.38, ease: EASE_PREMIUM }}
        className="h-full bg-yellow-400"
      />
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

function BottomControls({ onPrev, onNext, isFirst, isLast }) {
  return (
    <div className="home-bottom-controls fixed bottom-4 left-1/2 z-[280] flex -translate-x-1/2 items-center gap-3">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <FaArrowUp />
      </button>

      <div className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-xl backdrop-blur-xl sm:block">
        Scroll / Swipe
      </div>

      <button
        onClick={onNext}
        disabled={isLast}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-yellow-400 text-emerald-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <FaArrowDown />
      </button>
    </div>
  );
}

function HeroScreen({ hero, stats, direction, handleDirection }) {
  return (
    <ScreenShell sectionKey="hero" direction={direction}>
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1.03, 1.07, 1.03] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full"
        >
          <SafeImage
            src={hero.image}
            alt="Pondok Pesantren Al-Furqon"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#041b15] via-[#062d22]/95 to-[#0d4f38]/45" />
      <div className="absolute inset-0 bg-black/58" />

      <IslamicBackground dark intense />

      <div className="home-screen mx-auto grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key="hero-content"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="max-w-4xl"
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
              transition={{ delay: 0.16, duration: 0.62, ease: EASE_PREMIUM }}
              className="home-title mt-4 font-black leading-[0.94] tracking-[-0.055em]"
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

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {stats.map((item, index) => (
                <TiltCard key={`${item.label}-${index}`}>
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                    <h3 className="text-2xl font-black text-yellow-300">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-xs font-bold text-emerald-100">
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
          className="hidden lg:block"
        >
          <TiltCard>
            <div className="relative ml-auto max-w-md xl:max-w-lg">
              <motion.div
                animate={{ rotate: [0, 2, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-yellow-300/30"
              />

              <motion.div
                animate={{ rotate: [0, -2, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] border border-emerald-300/25"
              />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <SafeImage
                    src="/logo.png"
                    alt="Logo Al-Furqon"
                    className="mx-auto w-40 drop-shadow-[0_0_40px_rgba(255,255,255,0.35)] xl:w-48"
                  />
                </motion.div>

                <div className="mt-5 rounded-3xl bg-emerald-950/80 p-5">
                  <FaQuoteLeft className="mb-3 text-lg text-yellow-300" />

                  <p className="text-sm leading-relaxed text-emerald-50">
                    “Tempat belajar menemukan arah, bukan hanya mengejar nilai.”
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function ValuesScreen({ values, direction }) {
  return (
    <ScreenShell light sectionKey="values" direction={direction}>
      <IslamicBackground />

      <div className="home-screen flex flex-col justify-center">
        <div className="mx-auto max-w-4xl text-center">
          <Badge>Nilai Pendidikan</Badge>

          <motion.h2
            initial={{ opacity: 0, y: 28, filter: "blur(7px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.55, ease: EASE_PREMIUM }}
            className="home-heading mt-4 font-black leading-[0.98] tracking-[-0.05em] text-emerald-950"
          >
            Lingkungan pesantren membentuk kehidupan santri
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            Pendidikan di Al-Furqon tidak hanya mengajarkan ilmu, tetapi
            membentuk ibadah, adab, disiplin, dan kemandirian.
          </motion.p>
        </div>

        <div className="home-card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 24, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.48,
                delay: 0.24 + index * 0.06,
                ease: EASE_PREMIUM,
              }}
            >
              <TiltCard>
                <div className="group relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white/85 p-4 shadow-xl backdrop-blur transition hover:bg-white xl:p-5">
                  <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-yellow-300/20 blur-3xl transition group-hover:scale-125" />

                  <div className="relative z-10">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300 transition group-hover:scale-110 xl:h-12 xl:w-12">
                      {getIcon(item.iconKey)}
                    </div>

                    <h3 className="mt-4 text-xl font-black text-emerald-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

function PembinaScreen({ pembinaItems, step, direction, setStep }) {
  const currentPembina = pembinaItems[step] || pembinaItems[0];

  const nextPembina = () => {
    const nextIndex = step >= pembinaItems.length - 1 ? 0 : step + 1;
    setStep(nextIndex);
  };

  const prevPembina = () => {
    const prevIndex = step <= 0 ? pembinaItems.length - 1 : step - 1;
    setStep(prevIndex);
  };

  return (
    <ScreenShell sectionKey="pembina" direction={direction}>
      <IslamicBackground dark intense />

      <div data-allow-scroll="true" className="pembina-screen-v2">
        <div className="pembina-content-v2">
          {/* FOTO PEMBINA */}
          <motion.div
            initial={{ opacity: 0, x: -24, filter: "blur(7px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.14, duration: 0.5, ease: EASE_PREMIUM }}
            className="pembina-photo-card-v2"
          >
            <div className="relative h-full overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    scale: 0.985,
                    x: direction > 0 ? 22 : -22,
                    clipPath: clipIn(direction),
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    clipPath: CLIP_VISIBLE,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.985,
                    x: direction > 0 ? -22 : 22,
                    clipPath: clipOut(direction),
                  }}
                  transition={{ duration: 0.46, ease: EASE_PREMIUM }}
                  className="relative h-full overflow-hidden rounded-[1.3rem]"
                >
                  <div className="relative h-full overflow-hidden bg-emerald-950">
                    <SafeImage
                      src={currentPembina.image}
                      alt={currentPembina.name}
                      className="pembina-photo-v2 h-full w-full object-cover"
                      fallback="/masjid.jpg"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 shadow-lg">
                      {currentPembina.badge || "Pembina"}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                        {currentPembina.role}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-white lg:text-3xl">
                        {currentPembina.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-emerald-100">
                        {currentPembina.focus}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* PANEL KANAN */}
          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(7px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.18, duration: 0.5, ease: EASE_PREMIUM }}
            className="pembina-panel-v2"
          >
            <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
              {/* HEADER DALAM PANEL */}
              <div className="shrink-0">
                <Badge dark>Pembina Pesantren</Badge>

                <h2 className="pembina-title-v2 mt-3 font-black leading-[0.98] tracking-[-0.05em] text-white">
                  Santri tumbuh bersama
                  <span className="block text-yellow-300">
                    pembina yang mendampingi.
                  </span>
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100">
                  Pembina pesantren mendampingi adab, disiplin, ibadah,
                  kebersihan, dan kehidupan santri sehari-hari.
                </p>
              </div>

              {/* DETAIL UTAMA */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`detail-${step}`}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: EASE_PREMIUM }}
                  className="pembina-focus-v2 relative mt-4 shrink-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-white/15 via-white/10 to-yellow-300/10 p-4 sm:p-5"
                >
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />

                  <div className="relative z-10 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg sm:h-12 sm:w-12">
                      {getIcon(currentPembina.iconKey)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300">
                        Fokus Pembinaan
                      </p>

                      <h3 className="mt-2 max-w-full break-words text-[clamp(1.2rem,2.15vw,1.85rem)] font-black leading-[1.08] tracking-[-0.04em] text-white">
                        Membina santri dengan ilmu, adab, dan keteladanan.
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-emerald-100">
                        {currentPembina.focus}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* MINI VALUE */}
              <div className="mt-3 grid shrink-0 grid-cols-3 gap-2 sm:gap-3">
                {[
                  ["Adab", "Pembiasaan"],
                  ["Ibadah", "Pendampingan"],
                  ["Disiplin", "Rutinitas"],
                ].map((item, index) => (
                  <motion.div
                    key={item[0]}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.28 + index * 0.05,
                      duration: 0.38,
                      ease: EASE_PREMIUM,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3"
                  >
                    <p className="text-xs font-black text-yellow-300">
                      {item[0]}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-semibold text-emerald-100/80">
                      {item[1]}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* LIST PEMBINA */}
              <div
                data-allow-scroll="true"
                className="mt-3 min-h-0 flex-1 overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/10 p-2 sm:p-3"
              >
                <div
                  data-allow-scroll="true"
                  className="no-scrollbar h-full overflow-y-auto pr-1"
                >
                  <div className="grid gap-2">
                    {pembinaItems.map((item, index) => (
                      <motion.button
                        key={`${item.name}-${index}`}
                        onClick={() => setStep(index)}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ x: 5 }}
                        className={`group flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          step === index
                            ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-lg shadow-yellow-950/20"
                            : "border-white/10 bg-white/10 text-white hover:border-yellow-300/40 hover:bg-white/15"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base transition ${
                            step === index
                              ? "bg-emerald-950 text-yellow-300"
                              : "bg-white/10 text-yellow-300 group-hover:bg-yellow-300 group-hover:text-emerald-950"
                          }`}
                        >
                          {getIcon(item.iconKey)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black">
                            {item.name}
                          </p>

                          <p
                            className={`mt-1 truncate text-xs font-semibold ${
                              step === index
                                ? "text-emerald-900"
                                : "text-emerald-100/75"
                            }`}
                          >
                            {item.role}
                          </p>
                        </div>

                        <span
                          className={`hidden rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] sm:block ${
                            step === index
                              ? "bg-emerald-950 text-yellow-300"
                              : "bg-white/10 text-yellow-300"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTROL INTERNAL */}
              <div className="mt-3 flex shrink-0 items-center justify-between gap-3">
                <button
                  onClick={prevPembina}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-white/20"
                >
                  <FaArrowUp />
                </button>

                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                  {step + 1} / {pembinaItems.length}
                </div>

                <button
                  onClick={nextPembina}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  <FaArrowDown />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  );
}

function RequirementsScreen({ requirements, direction }) {
  return (
    <ScreenShell light sectionKey="requirements" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" className="home-screen overflow-y-auto py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Badge>Syarat & Ketentuan</Badge>

          <motion.h2
            initial={{ opacity: 0, y: 28, filter: "blur(7px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.55, ease: EASE_PREMIUM }}
            className="home-heading mt-4 font-black leading-[0.98] tracking-[-0.05em] text-emerald-950"
          >
            Persiapkan dokumen dan pahami ketentuan pesantren
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            Calon santri dan wali santri diharapkan membaca persyaratan berikut
            sebelum melakukan pendaftaran agar proses administrasi berjalan
            lebih mudah.
          </motion.p>
        </div>

        <div className="mx-auto mt-7 grid max-w-6xl gap-4 md:grid-cols-2">
          {requirements.map((group, index) => (
            <motion.div
              key={`${group.title}-${index}`}
              initial={{ opacity: 0, y: 24, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.48,
                delay: 0.24 + index * 0.06,
                ease: EASE_PREMIUM,
              }}
            >
              <TiltCard>
                <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-white/90 p-5 text-left shadow-xl backdrop-blur transition hover:bg-white">
                  <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-yellow-300/20 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300">
                        {getIcon(group.iconKey)}
                      </div>

                      <div>
                        <h3 className="text-xl font-black leading-tight text-emerald-950">
                          {group.title}
                        </h3>

                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700/70">
                          {group.items.length} poin penting
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {group.items.map((item, itemIndex) => (
                        <div
                          key={`${item}-${itemIndex}`}
                          className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3"
                        >
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[10px] text-yellow-300">
                            <FaCheckCircle />
                          </div>

                          <p className="text-sm font-semibold leading-relaxed text-slate-700">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}
          className="mx-auto mt-7 max-w-5xl rounded-[1.5rem] border border-yellow-300/30 bg-emerald-950 p-5 text-center text-white shadow-2xl"
        >
          <p className="text-sm leading-relaxed text-emerald-100">
            Catatan: Persyaratan dapat berubah sesuai kebijakan pesantren.
            Untuk memastikan informasi terbaru, silakan hubungi admin
            pesantren.
          </p>

          <div className="mt-4 flex justify-center">
            <MagneticButton
              href={WHATSAPP_ADMIN_URL}
              variant="secondary"
              external
            >
              <FaWhatsapp />
              Tanya Admin
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function GuideScreen({ guides, direction }) {
  const [guideIndex, setGuideIndex] = useState(0);

  const currentGuide = guides[guideIndex] || guides[0];

  const nextGuide = () => {
    setGuideIndex((prev) => (prev >= guides.length - 1 ? 0 : prev + 1));
  };

  const prevGuide = () => {
    setGuideIndex((prev) => (prev <= 0 ? guides.length - 1 : prev - 1));
  };

  return (
    <ScreenShell sectionKey="guide" direction={direction}>
      <IslamicBackground dark intense />

      <div data-allow-scroll="true" className="home-screen overflow-y-auto py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Badge dark>Panduan Pendaftaran</Badge>

          <motion.h2
            initial={{ opacity: 0, y: 28, filter: "blur(7px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.55, ease: EASE_PREMIUM }}
            className="home-heading mt-4 font-black leading-[0.98] tracking-[-0.05em] text-white"
          >
            Ikuti alur pendaftaran santri dengan mudah
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base"
          >
            Panduan ini membantu wali santri memahami tahapan pendaftaran dari
            pengisian data santri sampai pendaftaran berhasil.
          </motion.p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -24, filter: "blur(7px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.22, duration: 0.5, ease: EASE_PREMIUM }}
            className="rounded-[1.8rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
              {currentGuide.badge}
            </p>

            <h3 className="mt-3 text-3xl font-black leading-tight text-white">
              {currentGuide.title}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-emerald-100">
              {currentGuide.desc}
            </p>

            <div className="mt-6 grid gap-3">
              {guides.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  onClick={() => setGuideIndex(index)}
                  className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    guideIndex === index
                      ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-lg shadow-yellow-950/20"
                      : "border-white/10 bg-white/10 text-white hover:border-yellow-300/40 hover:bg-white/15"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      guideIndex === index
                        ? "bg-emerald-950 text-yellow-300"
                        : "bg-white/10 text-yellow-300"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{item.title}</p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        guideIndex === index
                          ? "text-emerald-900"
                          : "text-emerald-100/75"
                      }`}
                    >
                      {item.badge}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={prevGuide}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-white/20"
              >
                <FaArrowUp />
              </button>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                {guideIndex + 1} / {guides.length}
              </div>

              <button
                onClick={nextGuide}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-950 transition hover:-translate-y-1 hover:bg-yellow-300"
              >
                <FaArrowDown />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(7px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.28, duration: 0.5, ease: EASE_PREMIUM }}
            className="rounded-[1.8rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={guideIndex}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                  clipPath: CLIP_RIGHT,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  clipPath: CLIP_VISIBLE,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  clipPath: CLIP_LEFT,
                }}
                transition={{ duration: 0.45, ease: EASE_PREMIUM }}
                className="relative overflow-hidden rounded-[1.5rem] bg-emerald-950"
              >
                <SafeImage
                  src={currentGuide.image}
                  alt={currentGuide.title}
                  className="h-full max-h-[520px] w-full object-contain"
                />

                <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 shadow-xl">
                  {currentGuide.badge}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mx-auto mt-7 flex max-w-5xl flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-yellow-300/30 bg-emerald-950/80 p-5 text-center backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-2xl text-sm leading-relaxed text-emerald-100">
            Setelah memahami panduan, wali santri dapat langsung membuka halaman
            pendaftaran dan mengisi data sesuai langkah-langkah di atas.
          </p>

          <MagneticButton href="/pendaftaran">
            Mulai Daftar
            <FaArrowRight />
          </MagneticButton>
        </div>
      </div>
    </ScreenShell>
  );
}

function CtaScreen({ direction }) {
  return (
    <ScreenShell light sectionKey="cta" direction={direction}>
      <IslamicBackground />

      <div className="home-screen flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.95, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -36, scale: 0.95, filter: "blur(7px)" }}
          transition={{ duration: 0.52, ease: EASE_PREMIUM }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-emerald-950 p-7 text-white shadow-2xl md:p-10"
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative z-10">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-yellow-400 text-xl text-emerald-950"
            >
              <FaCheckCircle />
            </motion.div>

            <p className="font-bold text-yellow-300">
              Perjalanan dimulai dari keputusan kecil.
            </p>

            <h2 className="home-heading mt-4 font-black leading-[0.98] tracking-[-0.05em]">
              Mulai perjalanan santri bersama Al-Furqon.
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base">
              Daftarkan calon santri dan jadikan Al-Furqon sebagai tempat
              tumbuh ilmu, adab, ibadah, dan masa depan.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
              <MagneticButton href="/pendaftaran">
                Daftar Sekarang
                <FaArrowRight />
              </MagneticButton>

              <MagneticButton
                href={WHATSAPP_ADMIN_URL}
                variant="secondary"
                external
              >
                <FaWhatsapp />
                Hubungi Admin
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function isInteractiveElement(target) {
  if (!target?.closest) return false;

  return Boolean(
    target.closest(
      "button, a, input, textarea, select, [role='button'], [data-no-section-swipe='true']"
    )
  );
}

function getScrollableHomeScreen(target) {
  if (!target?.closest) return null;

  const candidates = [
    target.closest("[data-allow-scroll='true']"),
    target.closest(".pembina-screen-v2"),
    target.closest(".home-screen"),
  ].filter(Boolean);

  return (
    candidates.find(
      (element) => element.scrollHeight > element.clientHeight + 4
    ) || null
  );
}

function canScrollElement(element, deltaY) {
  if (!element) return false;

  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 4;
  }

  return element.scrollTop > 4;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(false);

  const [position, setPosition] = useState({
    section: 0,
    step: 0,
    direction: 1,
  });

  const cooldown = useRef(false);
const touchStartY = useRef(0);
const touchStartX = useRef(0);
const touchStartTarget = useRef(null);

const navbarRef = useRef(null);
const [navbarHeight, setNavbarHeight] = useState(92);

  const hero = homeData?.hero || DEFAULT_HERO;
  const stats = homeData?.heroStats?.length ? homeData.heroStats : DEFAULT_STATS;
  const values = homeData?.values?.length ? homeData.values : DEFAULT_VALUES;

  const pembinaItems = homeData?.pembina?.length
    ? homeData.pembina
    : DEFAULT_PEMBINA;

    const requirements = homeData?.requirements?.length
  ? homeData.requirements
  : DEFAULT_REQUIREMENTS;


const sections = useMemo(
  () => [
    { key: "hero", label: "Home", total: 1 },
    { key: "values", label: "Nilai", total: 1 },
    { key: "pembina", label: "Pembina", total: pembinaItems.length || 1 },
    { key: "requirements", label: "Syarat", total: 1 },
    { key: "guide", label: "Panduan", total: 1 },
    { key: "cta", label: "Daftar", total: 1 },
  ],
  [pembinaItems.length]
); 

  const activeSection = position.section;
  const activeStep = position.step;
  const direction = position.direction;

  const currentTotal = sections[activeSection]?.total || 1;

  const isFirst = activeSection === 0 && activeStep === 0;

  const isLast =
    activeSection === sections.length - 1 && activeStep === currentTotal - 1;

  const fetchHomeData = async () => {
  try {
    setChecking(true);
    setMaintenance(false);

    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL belum diatur");
    }

    await fetchJson(`${API_URL}/api/health`);

    const result = await fetchJson(`${API_URL}/api/home`);

    if (!result?.success || !result?.data) {
      throw new Error("Format data backend salah");
    }

    setHomeData(result.data);
    setMaintenance(false);
  } catch (error) {
    console.error("BACKEND ERROR:", error.message);
    setHomeData(null);
    setMaintenance(true);
  } finally {
    setLoading(false);
    setChecking(false);
  }
};

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    PRELOAD_ASSETS.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

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
    const scrollableScreen = getScrollableHomeScreen(event.target);

    if (
      scrollableScreen &&
      canScrollElement(scrollableScreen, event.deltaY)
    ) {
      return;
    }

    event.preventDefault();

    if (Math.abs(event.deltaY) < 18) return;

    handleDirection(event.deltaY > 0 ? 1 : -1);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === " "
    ) {
      event.preventDefault();
      handleDirection(1);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
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
    const target = touchStartTarget.current;

    if (isInteractiveElement(target)) return;

    const endY = event.changedTouches[0].clientY;
    const endX = event.changedTouches[0].clientX;

    const diffY = touchStartY.current - endY;
    const diffX = touchStartX.current - endX;

    if (Math.abs(diffY) < 44) return;
    if (Math.abs(diffY) < Math.abs(diffX) * 1.15) return;

    const scrollableScreen = getScrollableHomeScreen(target);

    if (scrollableScreen && canScrollElement(scrollableScreen, diffY)) {
      return;
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

const setCurrentPembinaStep = (index) => {
  setPosition({
    section: 2,
    step: index,
    direction: index >= activeStep ? 1 : -1,
  });
};

  const renderScreen = () => {
    const key = sections[activeSection]?.key;

    if (key === "hero") {
      return (
        <HeroScreen
          key="hero"
          hero={hero}
          stats={stats}
          direction={direction}
          handleDirection={handleDirection}
        />
      );
    }

    if (key === "values") {
      return <ValuesScreen key="values" values={values} direction={direction} />;
    }

    if (key === "pembina") {
  return (
    <PembinaScreen
      key="pembina"
      pembinaItems={pembinaItems}
      step={activeStep}
      direction={direction}
      setStep={setCurrentPembinaStep}
    />
  );
}

if (key === "requirements") {
  return (
    <RequirementsScreen
      key="requirements"
      requirements={requirements}
      direction={direction}
    />
  );
}

if (key === "guide") {
  return (
    <GuideScreen
      key="guide"
      guides={guides}
      direction={direction}
    />
  );
}

return <CtaScreen key="cta" direction={direction} />;
  };

useEffect(() => {
  if (!mounted) return;

  const wrapper = navbarRef.current;
  if (!wrapper) return;

  const getRealNavbar = () => wrapper.querySelector("nav") || wrapper;

  const updateNavbarHeight = () => {
    const navbarElement = getRealNavbar();
    if (!navbarElement) return;

    const rect = navbarElement.getBoundingClientRect();
    const height = Math.ceil(rect.height || navbarElement.offsetHeight || 86);

    setNavbarHeight(Math.max(height, 64));
  };

  updateNavbarHeight();

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateNavbarHeight)
      : null;

  resizeObserver?.observe(getRealNavbar());
  resizeObserver?.observe(wrapper);

  window.addEventListener("resize", updateNavbarHeight);
  window.addEventListener("orientationchange", updateNavbarHeight);

  return () => {
    resizeObserver?.disconnect();
    window.removeEventListener("resize", updateNavbarHeight);
    window.removeEventListener("orientationchange", updateNavbarHeight);
  };
}, [mounted]);

  if (!mounted) {
    return (
      <main
        suppressHydrationWarning
        className="fixed inset-0 h-[100dvh] overflow-hidden bg-[#041b15]"
      />
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (maintenance) {
    return <MaintenancePage onRetry={fetchHomeData} checking={checking} />;
  }

  return (
  <main
  style={{
    "--home-nav-h": `${navbarHeight || 92}px`,
    "--home-navbar-height": `${navbarHeight || 92}px`,
  }}
    className="fixed inset-0 h-[100dvh] overflow-hidden bg-[#041b15] text-white"
  >
    <CursorGlow />

    <div ref={navbarRef} className="home-navbar-layer">
      <Navbar />
    </div>

    <ProgressBar
      sections={sections}
      activeSection={activeSection}
      activeStep={activeStep}
    />

    <SideDots
      sections={sections}
      activeSection={activeSection}
      activeStep={activeStep}
      jumpToSection={jumpToSection}
    />

    {sections[activeSection]?.key !== "pembina" && (
      <BottomControls
        onPrev={() => handleDirection(-1)}
        onNext={() => handleDirection(1)}
        isFirst={isFirst}
        isLast={isLast}
      />
    )}

    <AnimatePresence mode="wait" custom={direction}>
      {renderScreen()}
    </AnimatePresence>
  </main>
);
}