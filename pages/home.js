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
  FaLandmark,
  FaBullseye,
  FaLightbulb,
  FaSchool,
  FaScroll,
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

const ADMIN_WHATSAPP_NUMBER = "628999155698";

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

const DEFAULT_PROFILE = {
  introduction: {
    badge: "Profil Pesantren",
    title: "Jejak panjang Pondok Pesantren Al Qur'an Al Furqon",
    desc: "Pondok Pesantren Al Qur'an Al Furqon berdiri pada tahun 1976 yang berlokasi di Cilendek Barat Kota Bogor oleh Abah KH. Abdurrochman. Perkembangannya berlanjut dengan pembangunan kembali pada tahun 1992 di daerah Cimulang Rancabungur, dan hingga saat ini tetap eksis dalam membina santri.",
    points: [
      "Berdiri sejak tahun 1976 di Cilendek Barat Kota Bogor.",
      "Didirikan oleh Abah KH. Abdurrochman.",
      "Berkembang kembali pada tahun 1992 di Cimulang Rancabungur.",
      "Tahun 2004 membuka Madrasah Tsanawiyah (MTs) Al Furqon.",
      "Tahun 2015 membuka Sekolah Menengah Kejuruan (SMK) Al Furqon.",
    ],
  },
  foundation: {
    title: "Landasan",
    verse: "QS. An-Nisa ayat 9",
    desc: "Dan hendaklah takut kepada Allah, orang-orang yang seandainya meninggalkan di belakang mereka anak-anak yang lemah, yang mereka khawatir terhadap kesejahteraan mereka. Oleh sebab itu hendaklah mereka bertaqwa kepada Allah dan hendaklah berbicara dengan tutur kata yang benar.",
  },
  vision: "Membentuk Generasi Qur'ani yang berdaya Fikir dan Dzikir",
  missions: [
    "Memahami dan mendalami qo'idah-qo'idah bacaan Al Qur'an (Tilawatil Qur'an) dengan baik dan benar.",
    "Mengkaji, memahami, dan mengamalkan isi kandungan Al Qur'an.",
    "Menjadikan Al Qur'an sebagai pedoman hidup sepanjang hayat.",
  ],
  programs: [
    {
      title: "Pendidikan Formal",
      iconKey: "school",
      items: ["Madrasah Tsanawiyah (MTs)", "Sekolah Menengah Kejuruan (SMK)"],
    },
    {
      title: "Pendidikan Non Formal Pesantren",
      iconKey: "quran",
      items: [
        "Seni Baca Al Qur'an",
        "Pengajian Kitab Kuning",
        "Kuliah Subuh",
        "Tahfidzul Qur'an",
        "Muhadhoroh",
        "Lailatul Qiro'ah",
        "Seni Kaligrafi",
        "Majelis Ta'lim",
        "Olahraga / Senam Pagi",
      ],
    },
  ],
};

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
      "Membayar Uang Pendaftaran / Formulir",
      "Mengisi Formulir Pendaftaran",
      "Mengisi Surat Pernyataan Pesantren",
      "3 Lembar Fotokopi Ijazah telah dilegalisir",
      "3 Lembar Fotokopi Surat Keterangan Lulus",
      "3 Lembar Fotokopi NISN",
      "3 Lembar Fotokopi Akta Kelahiran",
      "3 Lembar Fotokopi Ktp Orang Tua / Wali",
      "3 Lembar Fotokopi Kartu Keluarga",
      "3 Lembar Foto 3x4 background biru (SMK)",
      "Fotokopi Surat Kelakuan Baik dari Sekolah",
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

const DEFAULT_FEES = {
  registration: {
    label: "Biaya Pendaftaran",
    title: "Formulir Pendaftaran",
    price: 250000,
  },
  entryFees: [
    {
      level: "MTs",
      price: 5200000,
      desc: "Biaya masuk santri jenjang Madrasah Tsanawiyah",
      iconKey: "school",
      highlight: false,
    },
    {
      level: "SMK",
      price: 6000000,
      desc: "Biaya masuk santri jenjang Sekolah Menengah Kejuruan",
      iconKey: "school",
      highlight: true,
    },
    {
      level: "Takhossus",
      price: 4350000,
      desc: "Biaya masuk santri program Takhossus",
      iconKey: "quran",
      highlight: false,
    },
  ],
  monthlyFees: [
    {
      level: "MTs",
      price: 650000,
    },
    {
      level: "SMK",
      price: 750000,
    },
    {
      level: "Takhossus",
      price: 600000,
    },
  ],
  includes: [
    "1 stell Seragam Pesantren",
    "1 stell Seragam Khas Pondok / Kotak-Kotak",
    "1 stell Seragam Sekolah Putih-Biru / Putih-Abu",
    "1 stell Kaos Olahraga",
    "Al-Qur'an dan Kitab-kitab",
    "1 set Kasur dan Bantal",
  ],
  notes: [
    "Siswa/siswi yang berasal dari MTs Al-Furqon mendapatkan pengurangan biaya masuk ke SMK Al-Furqon.",
    "Seluruh pembayaran dapat dilakukan di kantor Sekretariat Pesantren.",
  ],
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

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
    landmark: <FaLandmark />,
    vision: <FaBullseye />,
    mission: <FaLightbulb />,
    school: <FaSchool />,
    scroll: <FaScroll />,
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
          className="h-full w-full object-contain"
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
    <div className="fixed bottom-0 left-0 z-[260] w-full">
      <div className="h-1.5 w-full bg-emerald-950/25 backdrop-blur-md">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.38, ease: EASE_PREMIUM }}
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

      <div className="home-hero-screen">
      <div className="hero-shell">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key="hero-content"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="hero-copy max-w-4xl"
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
              className="hero-stats mt-4 grid max-w-2xl grid-cols-3 gap-2 sm:mt-6 sm:gap-3"
            >
              {stats.map((item, index) => (
                <TiltCard key={`${item.label}-${index}`}>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-xl sm:rounded-3xl sm:p-4">
                    <h3 className="text-lg font-black text-yellow-300 sm:text-2xl">
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
          className="hero-visual hidden lg:block"
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
      </div>
    </ScreenShell>
  );
}

function ProfileScreen({ profile, direction }) {
  return (
    <ScreenShell light sectionKey="profile" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" 
      className="home-screen overflow-y-auto py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* KIRI: PENDAHULUAN */}
          <motion.div
            initial={{ opacity: 0, x: -34, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.58, ease: EASE_PREMIUM }}
            className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />

            <div className="relative z-10">
              <Badge>{profile.introduction.badge}</Badge>

              <h2 className="home-heading mt-4 font-black leading-[0.98] tracking-[-0.05em] text-emerald-950">
                {profile.introduction.title}
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                {profile.introduction.desc}
              </p>

              <div className="mt-6 space-y-3">
                {profile.introduction.points.map((point, index) => (
                  <motion.div
                    key={`${point}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18 + index * 0.06,
                      duration: 0.42,
                      ease: EASE_PREMIUM,
                    }}
                    className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[10px] text-yellow-300">
                      <FaCheckCircle />
                    </div>

                    <p className="text-sm font-semibold leading-relaxed text-slate-700">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* KANAN: LANDASAN, VISI MISI, PROGRAM */}
          <div className="grid gap-5">
            {/* LANDASAN */}
            <motion.div
              initial={{ opacity: 0, x: 34, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.12, duration: 0.58, ease: EASE_PREMIUM }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-emerald-950 p-6 text-white shadow-2xl"
            >
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-yellow-300/15 blur-3xl" />

              <div className="relative z-10 flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950">
                  {getIcon("scroll")}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                    {profile.foundation.verse}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    {profile.foundation.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-emerald-100">
                    “{profile.foundation.desc}”
                  </p>
                </div>
              </div>
            </motion.div>

            {/* VISI MISI */}
            <div className="grid gap-5 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE_PREMIUM }}
              >
                <TiltCard>
                  <div className="h-full rounded-[2rem] border border-emerald-100 bg-white/90 p-5 shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300">
                      {getIcon("vision")}
                    </div>

                    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                      Visi
                    </p>

                    <h3 className="mt-2 text-2xl font-black leading-tight text-emerald-950">
                      {profile.vision}
                    </h3>
                  </div>
                </TiltCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.28, duration: 0.5, ease: EASE_PREMIUM }}
              >
                <TiltCard>
                  <div className="h-full rounded-[2rem] border border-emerald-100 bg-white/90 p-5 shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300">
                      {getIcon("mission")}
                    </div>

                    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                      Misi
                    </p>

                    <div className="mt-3 space-y-3">
                      {profile.missions.map((mission, index) => (
                        <div key={`${mission}-${index}`} className="flex gap-3">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-emerald-950">
                            {index + 1}
                          </span>

                          <p className="text-sm font-semibold leading-relaxed text-slate-700">
                            {mission}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            {/* PROGRAM */}
            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.36, duration: 0.52, ease: EASE_PREMIUM }}
              className="grid gap-4 md:grid-cols-2"
            >
              {profile.programs.map((program, index) => (
                <TiltCard key={program.title}>
                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-5 shadow-xl">
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-xl text-yellow-300">
                          {getIcon(program.iconKey)}
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                            Program {index + 1}
                          </p>

                          <h3 className="text-xl font-black text-emerald-950">
                            {program.title}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-2">
                        {program.items.map((item, itemIndex) => (
                          <div
                            key={`${item}-${itemIndex}`}
                            className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[10px] font-black text-yellow-300">
                              {itemIndex + 1}
                            </span>

                            <p className="text-sm font-bold text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ValuesScreen({ values, direction }) {
  return (
    <ScreenShell light sectionKey="values" direction={direction}>
      <IslamicBackground />

      <div className="values-screen-v2">
        <div className="values-inner-v2">
          <div className="values-header-v2 mx-auto text-center">
            <Badge>Nilai Pendidikan</Badge>

            <motion.h2
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE_PREMIUM }}
              className="values-title-v2 font-black leading-[0.98] tracking-[-0.05em] text-emerald-950"
            >
              Lingkungan pesantren membentuk kehidupan santri
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.42 }}
              className="values-desc-v2 mx-auto text-slate-600"
            >
              Pendidikan di Al-Furqon tidak hanya mengajarkan ilmu, tetapi
              membentuk ibadah, adab, disiplin, dan kemandirian.
            </motion.p>
          </div>

          <div className="values-layout-v2">
            <motion.div
              initial={{ opacity: 0, x: -24, filter: "blur(7px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.48, ease: EASE_PREMIUM }}
              className="values-feature-v2"
            >
              <div className="values-feature-glow-v2" />

              <div className="relative z-10">
                <div className="values-feature-icon-v2">
                  <FaQuran />
                </div>

                <p className="values-feature-kicker-v2">
                  Karakter Santri
                </p>

                <h3 className="values-feature-title-v2">
                  Ilmu, adab, ibadah, dan kemandirian berjalan bersama.
                </h3>

                <p className="values-feature-desc-v2">
                  Setiap aktivitas santri diarahkan agar terbiasa hidup disiplin,
                  menghormati guru, menjaga ibadah, serta bertanggung jawab dalam
                  kehidupan sehari-hari.
                </p>
              </div>
            </motion.div>

            <div className="values-grid-v2">
              {values.map((item, index) => (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 20, filter: "blur(7px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.44,
                    delay: 0.24 + index * 0.06,
                    ease: EASE_PREMIUM,
                  }}
                  className="min-h-0"
                >
                  <TiltCard className="h-full">
                    <div className="values-card-v2">
                      <div className="values-card-orb-v2" />

                      <div className="relative z-10 flex h-full min-h-0 flex-col">
                        <div className="values-card-icon-v2">
                          {getIcon(item.iconKey)}
                        </div>

                        <div className="mt-auto">
                          <p className="values-card-number-v2">
                            {String(index + 1).padStart(2, "0")}
                          </p>

                          <h3 className="values-card-title-v2">
                            {item.title}
                          </h3>

                          <p className="values-card-desc-v2">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
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

                      <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-white lg:text-2xl xl:text-3xl">
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

                      <h3 className="mt-2 max-w-full break-words text-[clamp(1.02rem,1.75vw,1.55rem)] font-black leading-[1.08] tracking-[-0.04em] text-white">
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
              <div className="pembina-list-v2 mt-3 shrink-0 rounded-[1.25rem] border border-white/10 bg-black/10 p-2">
  <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
    {pembinaItems.map((item, index) => (
      <motion.button
        key={`${item.name}-${index}`}
        onClick={() => setStep(index)}
        whileTap={{ scale: 0.97 }}
        whileHover={{ x: 4 }}
        className={`group flex min-h-[50px] min-w-0 items-center gap-2 rounded-2xl border px-3 py-2 text-left transition ${
          step === index
            ? "border-yellow-300 bg-yellow-400 text-emerald-950 shadow-lg shadow-yellow-950/20"
            : "border-white/10 bg-white/10 text-white hover:border-yellow-300/40 hover:bg-white/15"
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm transition ${
            step === index
              ? "bg-emerald-950 text-yellow-300"
              : "bg-white/10 text-yellow-300 group-hover:bg-yellow-300 group-hover:text-emerald-950"
          }`}
        >
          {getIcon(item.iconKey)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-black leading-tight">
            {item.name}
          </p>

          <p
            className={`mt-0.5 truncate text-[11px] font-semibold ${
              step === index ? "text-emerald-900" : "text-emerald-100/75"
            }`}
          >
            {item.role}
          </p>
        </div>

        <span
          className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] sm:block ${
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

      <div className="requirements-screen-v2">
        <div className="requirements-inner-v2">
          <div className="requirements-header-v2 mx-auto text-center">
            <Badge>Syarat & Ketentuan</Badge>

            <motion.h2
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE_PREMIUM }}
              className="requirements-title-v2 font-black leading-[0.98] tracking-[-0.05em] text-emerald-950"
            >
              Persiapkan dokumen dan pahami ketentuan pesantren
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.42 }}
              className="requirements-desc-v2 mx-auto text-slate-600"
            >
              Calon santri dan wali santri diharapkan membaca persyaratan berikut
              sebelum melakukan pendaftaran agar proses administrasi berjalan
              lebih mudah.
            </motion.p>
          </div>

          <div className="requirements-grid-v2">
            {requirements.map((group, index) => (
              <motion.div
                key={`${group.title}-${index}`}
                initial={{ opacity: 0, y: 20, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.44,
                  delay: 0.22 + index * 0.05,
                  ease: EASE_PREMIUM,
                }}
                className="min-h-0"
              >
                <TiltCard className="h-full">
                  <div className="requirements-card-v2">
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10 flex min-h-0 h-full flex-col">
                      <div className="requirements-card-head-v2">
                        <div className="requirements-icon-v2">
                          {getIcon(group.iconKey)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="requirements-card-title-v2">
                            {group.title}
                          </h3>

                          <p className="requirements-count-v2">
                            {group.items.length} poin penting
                          </p>
                        </div>
                      </div>

                      <div data-allow-scroll="true" className="requirements-items-v2">
                        {group.items.map((item, itemIndex) => (
                          <div
                            key={`${item}-${itemIndex}`}
                            className="requirements-item-v2"
                          >
                            <div className="requirements-check-v2">
                              <FaCheckCircle />
                            </div>

                            <p className="requirements-item-text-v2">
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
        </div>
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

      <div className="guide-screen-v2">
        <div className="guide-inner-v2">
          <div className="guide-header-v2 mx-auto text-center">
            <Badge dark>Panduan Pendaftaran</Badge>

            <motion.h2
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE_PREMIUM }}
              className="guide-title-v2 font-black leading-[0.98] tracking-[-0.05em] text-white"
            >
              Ikuti alur pendaftaran santri dengan mudah
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.42 }}
              className="guide-desc-v2 mx-auto text-emerald-100"
            >
              Panduan ini membantu wali santri memahami tahapan pendaftaran dari
              pengisian data santri sampai pendaftaran berhasil.
            </motion.p>
          </div>

          <div className="guide-content-v2">
            {/* PANEL KIRI */}
            <motion.div
              initial={{ opacity: 0, x: -22, filter: "blur(7px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.48, ease: EASE_PREMIUM }}
              className="guide-panel-v2"
            >
              <div className="guide-current-v2">
                <p className="guide-step-label-v2">{currentGuide.badge}</p>

                <h3 className="guide-current-title-v2">
                  {currentGuide.title}
                </h3>

                <p className="guide-current-desc-v2">
                  {currentGuide.desc}
                </p>
              </div>

              <div className="guide-step-list-v2">
                {guides.map((item, index) => (
                  <button
                    key={`${item.title}-${index}`}
                    onClick={() => setGuideIndex(index)}
                    className={`guide-step-button-v2 ${
                      guideIndex === index ? "is-active" : ""
                    }`}
                  >
                    <span className="guide-step-number-v2">{index + 1}</span>

                    <span className="min-w-0 flex-1">
                      <span className="guide-step-title-v2">{item.title}</span>
                      <span className="guide-step-badge-v2">{item.badge}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="guide-controls-v2">
                <button onClick={prevGuide} className="guide-control-btn-v2">
                  <FaArrowUp />
                </button>

                <div className="guide-count-v2">
                  {guideIndex + 1} / {guides.length}
                </div>

                <button
                  onClick={nextGuide}
                  className="guide-control-btn-v2 is-next"
                >
                  <FaArrowDown />
                </button>
              </div>
            </motion.div>

            {/* PANEL GAMBAR */}
            <motion.div
              initial={{ opacity: 0, x: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.26, duration: 0.48, ease: EASE_PREMIUM }}
              className="guide-image-card-v2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={guideIndex}
                  initial={{ opacity: 0, scale: 0.98, clipPath: CLIP_RIGHT }}
                  animate={{ opacity: 1, scale: 1, clipPath: CLIP_VISIBLE }}
                  exit={{ opacity: 0, scale: 0.98, clipPath: CLIP_LEFT }}
                  transition={{ duration: 0.42, ease: EASE_PREMIUM }}
                  className="guide-image-wrap-v2"
                >
                  <SafeImage
                    src={currentGuide.image}
                    alt={currentGuide.title}
                    className="guide-image-v2"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-emerald-950/20" />

                  <div className="guide-image-badge-v2">
                    {currentGuide.badge}
                  </div>

                  <div className="guide-image-caption-v2">
                    <p>Panduan Pendaftaran</p>
                    <h3>{currentGuide.title}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </ScreenShell>
  );
}

function FeesScreen({ fees, direction }) {
  return (
    <ScreenShell light sectionKey="fees" direction={direction}>
      <IslamicBackground />

      <div data-allow-scroll="true" className="fees-screen-v2">
        <div className="fees-inner-v2">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.52, ease: EASE_PREMIUM }}
            className="fees-header-v2"
          >
            <Badge>Biaya Santri</Badge>

            <h2 className="fees-title-v2">
              Informasi biaya masuk dan iuran bulanan santri
            </h2>

            <p className="fees-desc-v2">
              Rincian biaya dibuat jelas agar wali santri mudah memahami
              kebutuhan administrasi awal, iuran bulanan, serta fasilitas yang
              sudah termasuk di dalam biaya masuk.
            </p>
          </motion.div>

          <div className="fees-layout-v2">
            <motion.div
              initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.12, duration: 0.52, ease: EASE_PREMIUM }}
              className="fees-main-card-v2"
            >
              <div className="fees-main-glow-v2" />

              <div className="relative z-10">
                <div className="fees-main-top-v2">
                  <div>
                    <p className="fees-kicker-v2">Biaya Pendaftaran</p>
                    <h3 className="fees-main-title-v2">
                      {fees.registration.title}
                    </h3>
                  </div>

                  <div className="fees-form-price-v2">
                    {formatRupiah(fees.registration.price)}
                  </div>
                </div>

                <div className="fees-entry-grid-v2">
                  {fees.entryFees.map((item, index) => (
                    <TiltCard key={item.level} className="h-full">
                      <div
                        className={`fees-entry-card-v2 ${
                          item.highlight ? "is-highlight" : ""
                        }`}
                      >
                        <div className="fees-entry-icon-v2">
                          {getIcon(item.iconKey)}
                        </div>

                        <p className="fees-entry-label-v2">Biaya Masuk</p>

                        <h3 className="fees-entry-level-v2">{item.level}</h3>

                        <h4 className="fees-entry-price-v2">
                          {formatRupiah(item.price)}
                        </h4>

                        <p className="fees-entry-desc-v2">{item.desc}</p>

                        {item.highlight && (
                          <div className="fees-popular-v2">
                            Pilihan Formal
                          </div>
                        )}
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.18, duration: 0.52, ease: EASE_PREMIUM }}
              className="fees-side-v2"
            >
              <div className="fees-monthly-card-v2">
                <div className="fees-card-head-v2">
                  <div className="fees-card-icon-v2">
                    <FaScroll />
                  </div>

                  <div>
                    <p className="fees-kicker-v2">Iuran Bulanan</p>
                    <h3>Per Jenjang Santri</h3>
                  </div>
                </div>

                <div className="fees-monthly-list-v2">
                  {fees.monthlyFees.map((item) => (
                    <div key={item.level} className="fees-monthly-item-v2">
                      <span>{item.level}</span>
                      <strong>{formatRupiah(item.price)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fees-include-card-v2">
                <div className="fees-card-head-v2">
                  <div className="fees-card-icon-v2">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className="fees-kicker-v2">Sudah Termasuk</p>
                    <h3>Perlengkapan Awal Santri</h3>
                  </div>
                </div>

                <div className="fees-include-grid-v2">
                  {fees.includes.map((item, index) => (
                    <div key={`${item}-${index}`} className="fees-include-item-v2">
                      <FaCheckCircle />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fees-note-card-v2">
                <p className="fees-kicker-v2">Catatan Penting</p>

                <div className="fees-note-list-v2">
                  {fees.notes.map((note, index) => (
                    <div key={`${note}-${index}`} className="fees-note-item-v2">
                      <span>{index + 1}</span>
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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
  const profile = homeData?.profile || DEFAULT_PROFILE;

  const pembinaItems = homeData?.pembina?.length
    ? homeData.pembina
    : DEFAULT_PEMBINA;

    const requirements = homeData?.requirements?.length
  ? homeData.requirements
  : DEFAULT_REQUIREMENTS;

    const guides = homeData?.guides?.length
  ? homeData.guides
  : DEFAULT_GUIDES;

  const fees = homeData?.fees || DEFAULT_FEES;


const sections = useMemo(
  () => [
    { key: "hero", label: "Home", total: 1 },
    { key: "profile", label: "Profil", total: 1 },
    { key: "values", label: "Nilai", total: 1 },
    { key: "pembina", label: "Pembina", total: pembinaItems.length || 1 },
    { key: "requirements", label: "Syarat", total: 1 },
    { key: "guide", label: "Panduan", total: 1 },
    { key: "fees", label: "Biaya", total: 1 },
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
    section: 3,
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

if (key === "profile") {
  return (
    <ProfileScreen
      key="profile"
      profile={profile}
      direction={direction}
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

if (key === "fees") {
  return (
    <FeesScreen
      key="fees"
      fees={fees}
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

    <AnimatePresence mode="wait" custom={direction}>
      {renderScreen()}
    </AnimatePresence>
  </main>
);
}