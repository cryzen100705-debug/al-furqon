"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FaArrowRight,
  FaBed,
  FaBookOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCompass,
  FaFutbol,
  FaHandSparkles,
  FaHome,
  FaLayerGroup,
  FaMapMarkedAlt,
  FaMosque,
  FaPlay,
  FaQuran,
  FaRedo,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_IMAGE = "/hero-santri.jpg";

const ADMIN_WHATSAPP_NUMBER = "08999155698";
const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai fasilitas pesantren.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_FASILITAS_PAGE = {
  hero: {
    badge: "Premium Facilities",
    arabic: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى",
    title: "Fasilitas yang",
    highlight: "menghidupkan suasana santri.",
    desc: "Lingkungan pesantren dirancang untuk mendukung ibadah, belajar, istirahat, aktivitas, keamanan, dan pembinaan karakter santri setiap hari.",
    image: "/hero-santri.jpg",
  },
  stats: [
    { value: "24J", label: "Lingkungan Terpantau" },
    { value: "5+", label: "Area Utama" },
    { value: "100+", label: "Santri Terlayani" },
    { value: "Aktif", label: "Ruang Kegiatan" },
  ],
  qualities: ["Aman", "Nyaman", "Terarah", "Mendukung Pembinaan"],
  facilities: [
    {
      id: "masjid",
      name: "Masjid Pesantren",
      category: "Ibadah",
      iconKey: "mosque",
      featured: true,
      img: "/masjid.jpg",
      desc: "Pusat kegiatan ibadah, kajian, tilawah, pembinaan akhlak, dan kebiasaan spiritual santri.",
      detail:
        "Masjid menjadi titik utama kegiatan santri. Di tempat ini santri dibiasakan shalat berjamaah, membaca Al-Qur’an, mengikuti kajian, dan membangun kedekatan dengan ibadah harian.",
    },
    {
      id: "asrama",
      name: "Asrama Santri",
      category: "Hunian",
      iconKey: "bed",
      img: "/hero-santri.jpg",
      desc: "Ruang tinggal santri yang melatih kemandirian, kedisiplinan, tanggung jawab, dan kebersamaan.",
      detail:
        "Asrama menjadi ruang pembentukan karakter. Santri belajar menjaga kebersihan, mengatur waktu, hidup bersama teman, dan mengikuti rutinitas pesantren secara tertib.",
    },
    {
      id: "kelas",
      name: "Ruang Kelas",
      category: "Belajar",
      iconKey: "book",
      img: "/smk.jpg",
      desc: "Tempat pembelajaran formal dan pendampingan akademik agar santri berkembang secara ilmu.",
      detail:
        "Ruang kelas mendukung proses belajar santri melalui pembelajaran yang terarah, suasana yang kondusif, dan kegiatan akademik yang membantu masa depan santri.",
    },
    {
      id: "quran",
      name: "Ruang Qur’an",
      category: "Belajar",
      iconKey: "quran",
      img: "/kegiatan-1.jpg",
      desc: "Area pembinaan tahsin, tilawah, hafalan, dan murajaah Al-Qur’an.",
      detail:
        "Ruang Qur’an membantu santri membangun kedekatan dengan Al-Qur’an melalui bimbingan bacaan, hafalan bertahap, murajaah, dan pembiasaan tilawah.",
    },
    {
      id: "lapangan",
      name: "Area Aktivitas",
      category: "Aktivitas",
      iconKey: "sport",
      img: "/kegiatan-2.jpg",
      desc: "Ruang kegiatan santri untuk olahraga, pramuka, latihan, dan pembinaan luar kelas.",
      detail:
        "Area aktivitas membantu santri bergerak aktif, bekerja sama, melatih keberanian, menjaga kesehatan, dan membangun rasa tanggung jawab melalui kegiatan bersama.",
    },
  ],
  featuredInfo: {
    badge: "Facility Spotlight",
    title: "Bukan hanya tempat, tapi ruang pembentukan kebiasaan.",
    desc: "Setiap fasilitas memiliki fungsi pembinaan agar santri tidak hanya nyaman, tetapi juga terbiasa hidup tertib, aktif, dan dekat dengan nilai pesantren.",
  },
  featuredCards: [
    {
      title: "Ibadah Lebih Terarah",
      desc: "Fasilitas mendukung pembiasaan shalat berjamaah, tilawah, dan kajian.",
      iconKey: "mosque",
    },
    {
      title: "Belajar Lebih Fokus",
      desc: "Ruang belajar membantu santri mengikuti pendidikan formal dan agama.",
      iconKey: "book",
    },
    {
      title: "Hidup Lebih Mandiri",
      desc: "Asrama dan rutinitas melatih tanggung jawab, disiplin, dan kebersihan.",
      iconKey: "home",
    },
    {
      title: "Aktivitas Lebih Seimbang",
      desc: "Kegiatan luar kelas mendukung kesehatan, kerja sama, dan keberanian.",
      iconKey: "sport",
    },
  ],
};

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
    layer: <FaLayerGroup />,
  };

  return icons[key] || <FaStar />;
}

function normalizeFasilitasPage(data) {
  const source = data || {};
  const fallbackFacilities = DEFAULT_FASILITAS_PAGE.facilities;

  const rawFacilities =
    Array.isArray(source.facilities) && source.facilities.length
      ? source.facilities
      : fallbackFacilities;

  const facilities = rawFacilities.map((item, index) => {
    const fallback = fallbackFacilities[index % fallbackFacilities.length];

    return {
      ...fallback,
      ...item,
      id: item?.id || fallback.id || `${index}`,
      name: item?.name || item?.title || fallback.name,
      category: item?.category || fallback.category,
      iconKey: item?.iconKey || fallback.iconKey,
      img: item?.img || item?.image || fallback.img,
      desc: item?.desc || fallback.desc,
      detail: item?.detail || item?.desc || fallback.detail,
      featured: Boolean(item?.featured || fallback.featured),
    };
  });

  return {
    hero: {
      ...DEFAULT_FASILITAS_PAGE.hero,
      ...(source.hero || {}),
    },
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
        : DEFAULT_FASILITAS_PAGE.stats,
    qualities:
      Array.isArray(source.qualities) && source.qualities.length
        ? source.qualities
        : DEFAULT_FASILITAS_PAGE.qualities,
    facilities,
    featuredInfo: {
      ...DEFAULT_FASILITAS_PAGE.featuredInfo,
      ...(source.featuredInfo || {}),
    },
    featuredCards:
      Array.isArray(source.featuredCards) && source.featuredCards.length
        ? source.featuredCards
        : DEFAULT_FASILITAS_PAGE.featuredCards,
  };
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);

    update();

    media.addEventListener?.("change", update);

    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);

  return isDesktop;
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
      className="fixed left-0 top-0 z-[9999] h-1.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.55)]"
    />
  );
}

function CursorGlow() {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 24 });

  useEffect(() => {
    if (!isDesktop || reduce) return;

    const handleMove = (e) => {
      mouseX.set(e.clientX - 170);
      mouseY.set(e.clientY - 170);
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isDesktop, reduce, mouseX, mouseY]);

  if (!isDesktop || reduce) return null;

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-[340px] w-[340px] rounded-full bg-yellow-300/10 blur-3xl"
    />
  );
}

function BackgroundArt({ dark = false, intense = false }) {
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
            ? "bg-[radial-gradient(circle_at_16%_22%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_82%_68%,rgba(16,185,129,0.12),transparent_32%)]"
            : "bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(250,204,21,0.2),transparent_32%)]"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, 14, 0],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -left-32 top-20 h-64 w-64 rounded-full border sm:h-72 sm:w-72 ${
          dark
            ? "border-yellow-300/15 bg-yellow-300/5"
            : "border-emerald-900/10 bg-emerald-300/14"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, -12, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-32 bottom-14 h-80 w-80 rounded-full border sm:h-[26rem] sm:w-[26rem] ${
          dark
            ? "border-emerald-300/15 bg-emerald-300/5"
            : "border-yellow-500/10 bg-yellow-300/16"
        }`}
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                y: [0, -16, 0],
                opacity: [0.35, 0.75, 0.35],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[34rem] sm:w-[34rem] ${
          dark ? "bg-emerald-400/10" : "bg-yellow-300/18"
        }`}
      />
    </div>
  );
}

function PremiumAtmosphere() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = [
    { left: "8%", top: "18%", delay: 0, size: "h-2 w-2" },
    { left: "18%", top: "72%", delay: 0.7, size: "h-1.5 w-1.5" },
    { left: "78%", top: "24%", delay: 1.1, size: "h-2.5 w-2.5" },
    { left: "88%", top: "68%", delay: 1.6, size: "h-1.5 w-1.5" },
    { left: "54%", top: "14%", delay: 2.1, size: "h-2 w-2" },
  ];

  if (!mounted || reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((item, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, -18, 0],
            x: [0, index % 2 === 0 ? 10 : -10, 0],
            opacity: [0.25, 0.9, 0.25],
            scale: [1, 1.35, 1],
          }}
          transition={{
            duration: 5.5 + index,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${item.size} rounded-full bg-yellow-300 shadow-[0_0_32px_rgba(250,204,21,0.85)]`}
          style={{ left: item.left, top: item.top }}
        />
      ))}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute right-[8%] top-[18%] hidden h-[360px] w-[360px] rounded-full border border-yellow-300/10 lg:block"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute right-[13%] top-[25%] hidden h-[250px] w-[250px] rounded-full border border-emerald-300/10 lg:block"
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

function Reveal({ children, delay = 0, y = 26, className = "" }) {
  return (
    <motion.div
  initial={{
    opacity: 0,
    y,
    scale: 0.985,
    filter: "blur(10px)",
  }}
  whileInView={{
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  }}
  viewport={{ once: true, amount: 0.18 }}
  transition={{
    duration: 0.72,
    delay,
    ease: EASE,
  }}
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
      className={`fac-section relative flex w-full overflow-hidden ${
        dark ? "bg-[#041b15] text-white" : "bg-[#f7f1df] text-emerald-950"
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-[calc(var(--fac-navbar-h)+10px)] z-[2] h-px bg-gradient-to-r from-transparent via-yellow-300/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[2] h-px bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent" />
      {children}
    </section>
  );
}

function Container({ children, className = "", style }) {
  return (
    <motion.div
      style={style}
      className={`fac-container relative z-10 mx-auto flex-1 ${className}`}
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
          className={`fac-section-title font-black leading-[0.98] tracking-[-0.05em] ${
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

function TiltCard({ children, className = "" }) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!isDesktop || reduce) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRotate({
      x: ((y / rect.height) - 0.5) * -7,
      y: ((x / rect.width) - 0.5) * 7,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={isDesktop && !reduce ? { rotateX: rotate.x, rotateY: rotate.y } : {}}
      whileHover={isDesktop && !reduce ? { y: -6, scale: 1.012 } : {}}
      transition={{ type: "spring", stiffness: 240, damping: 23 }}
      style={isDesktop && !reduce ? { transformStyle: "preserve-3d" } : undefined}
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({ children, href, onClick, variant = "primary" }) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMove = (e) => {
    if (!isDesktop || reduce) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left - rect.width / 2;
    const moveY = e.clientY - rect.top - rect.height / 2;

    x.set(moveX * 0.14);
    y.set(moveY * 0.14);
  };

  const className =
    variant === "primary"
      ? "bg-yellow-400 text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.32)] hover:bg-yellow-300"
      : "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20";

  const content = (
    <motion.span
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={isDesktop && !reduce ? { x: springX, y: springY } : undefined}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-black transition hover:-translate-y-1 sm:w-auto sm:px-8 ${className}`}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full sm:w-auto">
      {content}
    </button>
  );
}

function LoadingPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#041b15] px-6 text-center text-white">
      <BackgroundArt dark intense />
      <PremiumAtmosphere />

      <div className="relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-16 w-16 rounded-full border-4 border-yellow-300/20 border-t-yellow-300"
        />

        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
          Loading Fasilitas
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

export default function Fasilitas() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [checking, setChecking] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const lockRef = useRef(false);
  const touchStartY = useRef(0);

  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const heroImageScale = useTransform(scrollY, [0, 900], [1, 1.08]);
  const heroTextY = useTransform(scrollY, [0, 900], [0, 34]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0.68]);

  const fetchFasilitasData = async () => {
    try {
      setChecking(true);

      const endpoint = API_URL ? `${API_URL}/api/fasilitas` : "/api/fasilitas";

      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success || !result?.data) {
        throw new Error("Format data fasilitas tidak valid");
      }

      setPageData(normalizeFasilitasPage(result.data));
      setUsingFallback(false);
      setActiveIndex(0);
      setSelectedCategory("Semua");
    } catch (error) {
      console.error("FASILITAS BACKEND ERROR:", error.message);
      setPageData(DEFAULT_FASILITAS_PAGE);
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
        "--fac-vh",
        `${window.innerHeight}px`
      );
    };

    const updateNavbarHeight = () => {
      const nav = document.querySelector("nav");
      const navHeight = nav?.getBoundingClientRect?.().height || 88;

      document.documentElement.style.setProperty(
        "--fac-navbar-h",
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
      html.style.removeProperty("--fac-vh");
      html.style.removeProperty("--fac-navbar-h");

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
    fetchFasilitasData();
  }, []);

  const data = useMemo(() => normalizeFasilitasPage(pageData), [pageData]);

  const { hero, stats, qualities, facilities, featuredInfo, featuredCards } =
    data;

  const categories = [
    "Semua",
    ...new Set(facilities.map((item) => item.category).filter(Boolean)),
  ];

  const filteredFacilities =
    selectedCategory === "Semua"
      ? facilities
      : facilities.filter((item) => item.category === selectedCategory);

  const activeFacility =
    filteredFacilities[activeIndex] || filteredFacilities[0] || facilities[0];

  const featured =
    facilities.find((item) => item.featured) || facilities[0] || activeFacility;

    const sections = useMemo(
  () => [
    { key: "hero", label: "Fasilitas", total: 1 },
    { key: "spotlight", label: "Unggulan", total: 1 },
    { key: "explorer", label: "Jelajah", total: 1 },
    { key: "cinematic", label: "Cinematic", total: 1 },
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

  const innerContainer = target.querySelector(".fac-container");

  if (innerContainer) {
    innerContainer.scrollTop = 0;
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });

  window.setTimeout(() => {
    lockRef.current = false;
  }, 780);
};

useEffect(() => {
  if (!sections.length) return;

  const isMobile = () => window.innerWidth <= 1024;

  const getActiveSection = () => {
    return document.getElementById(sections[activeSectionIndex]?.key);
  };

  const getActiveContainer = () => {
    const activeSection = getActiveSection();
    if (!activeSection) return null;

    return activeSection.querySelector(".fac-container");
  };

  const canMoveSection = (direction) => {
    const container = getActiveContainer();

    if (!container) return true;

    /*
      Desktop:
      Jangan cek inner scroll.
      Sekali scroll harus langsung pindah section.
    */
    if (!isMobile()) return true;

    /*
      Mobile:
      Kalau isi section masih bisa discroll,
      biarkan scroll bagian dalam dulu.
    */
    const hasInnerScroll = container.scrollHeight > container.clientHeight + 12;

    if (!hasInnerScroll) return true;

    const atTop = container.scrollTop <= 2;
    const atBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 4;

    if (direction > 0) return atBottom;

    return atTop;
  };

  const moveSection = (direction) => {
    if (lockRef.current) return;
    if (!canMoveSection(direction)) return;

    const nextIndex =
      direction > 0
        ? Math.min(activeSectionIndex + 1, sections.length - 1)
        : Math.max(activeSectionIndex - 1, 0);

    if (nextIndex === activeSectionIndex) return;

    jumpToSection(nextIndex);
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 10) return;

    const direction = event.deltaY > 0 ? 1 : -1;

    if (!isMobile()) {
      event.preventDefault();
      moveSection(direction);
      return;
    }

    if (canMoveSection(direction)) {
      event.preventDefault();
      moveSection(direction);
    }
  };

  const handleKeyDown = (event) => {
    const downKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
    const upKeys = ["ArrowUp", "PageUp"];

    if (![...downKeys, ...upKeys].includes(event.key)) return;

    event.preventDefault();

    if (downKeys.includes(event.key)) {
      moveSection(1);
      return;
    }

    moveSection(-1);
  };

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches?.[0]?.clientY || 0;
  };

  const handleTouchMove = (event) => {
    if (!isMobile()) return;

    const currentY = event.touches?.[0]?.clientY || 0;
    const diff = touchStartY.current - currentY;

    if (Math.abs(diff) < 12) return;

    const direction = diff > 0 ? 1 : -1;

    if (canMoveSection(direction)) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event) => {
    if (!isMobile()) return;

    const endY = event.changedTouches?.[0]?.clientY || 0;
    const diff = touchStartY.current - endY;

    if (Math.abs(diff) < 55) return;

    const direction = diff > 0 ? 1 : -1;

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

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setActiveIndex(0);
  };

  const next = () => {
    setActiveIndex((prev) => {
      if (!filteredFacilities.length) return 0;
      return (prev + 1) % filteredFacilities.length;
    });
  };

  const prev = () => {
    setActiveIndex((prev) => {
      if (!filteredFacilities.length) return 0;
      return prev === 0 ? filteredFacilities.length - 1 : prev - 1;
    });
  };

  if (loading) return <LoadingPage />;

  return (
    <main className="fac-page overflow-x-hidden bg-[#041b15] text-emerald-950">
<CursorGlow />
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
        onRetry={fetchFasilitasData}
        checking={checking}
      />

      <Section id="hero" dark className="fac-hero-section">
        <motion.div
          style={
            isDesktop && !reduce
              ? {
                  scale: heroImageScale,
                }
              : undefined
          }
          className="absolute inset-0"
        >
          <SafeImage
            src={hero.image}
            alt="Fasilitas Pesantren Al-Furqon"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#03130f] via-[#06271f]/96 to-[#06271f]/78" />
        <div className="absolute inset-0 bg-black/42" />
        <BackgroundArt dark intense />
        <PremiumAtmosphere />

        <Container
          style={
            isDesktop && !reduce
              ? {
                  y: heroTextY,
                  opacity: heroOpacity,
                }
              : undefined
          }
          className="flex items-center"
        >
          <div className="grid w-full items-center gap-7 lg:grid-cols-[1.02fr_0.98fr]">
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

              <h1 className="fac-hero-title mx-auto mt-4 max-w-5xl font-black leading-[0.9] tracking-[-0.065em] text-white lg:mx-0">
                {hero.title}
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base lg:mx-0 lg:text-[1.02rem]">
                {hero.desc}
              </p>

              <div className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row lg:mx-0 lg:max-w-none">
                <MagneticButton onClick={() => jumpToSection(2)}>
  Jelajahi Fasilitas
  <FaArrowRight />
</MagneticButton>

<MagneticButton onClick={() => jumpToSection(1)} variant="secondary">
  <FaPlay />
  Lihat Unggulan
</MagneticButton>
              </div>

              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-xl"
                  >
                    <p className="text-lg font-black text-yellow-300 sm:text-2xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold leading-tight text-emerald-100 sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <Reveal className="hidden lg:block">
              <div className="fac-hero-showcase relative ml-auto w-full max-w-[540px]">
                <div className="absolute -left-5 top-8 h-[82%] w-8 rounded-full bg-yellow-400/90 blur-[1px]" />
                <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full border border-yellow-300/25" />
                <div className="absolute -bottom-8 right-8 h-40 w-40 rounded-full border border-emerald-300/20" />

                <TiltCard>
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <SafeImage
                        src={featured?.img}
                        alt={featured?.name}
                        className="fac-hero-preview w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-950">
                        Facility Preview
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                          {getIcon(featured?.iconKey)}
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-yellow-300">
                          {featured?.category}
                        </p>

                        <h3 className="mt-2 text-3xl font-black leading-none text-white xl:text-4xl">
                          {featured?.name}
                        </h3>

                        <p className="mt-3 max-w-md text-sm leading-relaxed text-emerald-50">
                          {featured?.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section id="spotlight" dark>
        <BackgroundArt dark intense />
        <PremiumAtmosphere />

        <Container className="flex items-center">
          <div className="grid w-full items-center gap-7 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionHeader
                dark
                align="left"
                badge={featuredInfo.badge}
                title={featuredInfo.title}
                desc={featuredInfo.desc}
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {featuredCards.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.06}>
                    <TiltCard>
                      <GlassCard dark className="h-full p-4">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                          {getIcon(item.iconKey)}
                        </div>

                        <h3 className="text-lg font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-emerald-100">
                          {item.desc}
                        </p>
                      </GlassCard>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal>
              <GlassCard dark className="p-3">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <SafeImage
                    src={featured?.img}
                    alt={featured?.name}
                    className="fac-spotlight-image w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <Badge dark>{featured?.category}</Badge>

                    <h2 className="fac-card-title mt-3 font-black leading-none text-white">
                      {featured?.name}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                      {featured?.detail || featured?.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section
        id="explorer"
        className="bg-gradient-to-br from-[#f7f1df] via-white to-emerald-50"
      >
        <BackgroundArt />
        <PremiumAtmosphere />

        <Container className="flex flex-col justify-center">
          <SectionHeader
            badge="Jelajah Fasilitas"
            title="Pilih fasilitas dan lihat detailnya."
            desc="Setiap fasilitas ditampilkan dalam bentuk explorer interaktif agar halaman terasa hidup, bukan sekadar daftar gambar biasa."
          />

          <div className="no-scrollbar mx-auto mt-7 flex max-w-5xl gap-3 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center">
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

          <div className="mt-8 grid gap-7 lg:grid-cols-[0.58fr_1.42fr]">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 lg:grid lg:overflow-visible">
              {filteredFacilities.map((item, index) => (
                <button
                  key={item.id || item.name}
                  onClick={() => setActiveIndex(index)}
                  className={`group min-w-[245px] rounded-[1.35rem] border p-3.5 text-left transition lg:min-w-0 ${
                    activeIndex === index
                      ? "border-yellow-300 bg-emerald-950 text-white shadow-2xl"
                      : "border-emerald-100 bg-white/85 text-emerald-950 shadow-lg hover:-translate-y-1 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition ${
                        activeIndex === index
                          ? "bg-yellow-400 text-emerald-950"
                          : "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-900 group-hover:text-yellow-300"
                      }`}
                    >
                      {getIcon(item.iconKey)}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[9px] font-black uppercase tracking-[0.22em] ${
                          activeIndex === index
                            ? "text-yellow-300"
                            : "text-emerald-700"
                        }`}
                      >
                        {item.category}
                      </p>

                      <h3 className="mt-1 truncate text-lg font-black">
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
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="overflow-hidden rounded-[1.6rem] bg-emerald-950 shadow-2xl"
              >
                <div className="fac-explorer-image relative overflow-hidden">
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

                  <div className="absolute bottom-0 left-0 p-5">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                      {getIcon(activeFacility?.iconKey)}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.26em] text-yellow-300">
                      {activeFacility?.category}
                    </p>

                    <h3 className="fac-card-title mt-2 font-black tracking-[-0.055em] text-white">
                      {activeFacility?.name}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-[1.08fr_0.92fr]">
                  <div>
                    <p className="text-sm leading-relaxed text-emerald-100 sm:text-base">
                      {activeFacility?.detail || activeFacility?.desc}
                    </p>

                    <a
                      href={WHATSAPP_ADMIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-yellow-400 px-6 py-3 font-black text-emerald-950 transition hover:bg-yellow-300 sm:w-auto"
                    >
                      Tanya Admin
                      <FaWhatsapp />
                    </a>
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
        </Container>
      </Section>

      <Section id="cinematic" dark>
        <BackgroundArt dark intense />
        <PremiumAtmosphere />

        <Container className="flex flex-col justify-center">
          <SectionHeader
            dark
            badge="Cinematic View"
            title="Fasilitas dalam satu tampilan bergerak."
            desc="Gunakan navigasi untuk berpindah antar fasilitas dengan transisi cinematic yang lebih premium."
          />

          <div className="mx-auto mt-8 w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFacility?.id || activeFacility?.name}
                initial={{ opacity: 0, x: 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="relative overflow-hidden rounded-[1.35rem]">
                  <SafeImage
                    src={activeFacility?.img}
                    alt={activeFacility?.name}
                    className="fac-cinematic-image w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
                      {getIcon(activeFacility?.iconKey)}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.26em] text-yellow-300">
                      {activeFacility?.category}
                    </p>

                    <h3 className="fac-card-title mt-2 font-black text-white">
                      {activeFacility?.name}
                    </h3>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                      {activeFacility?.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                onClick={prev}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
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
                    aria-label={`Pilih ${item.name}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="cta" dark>
        <BackgroundArt dark intense />
        <PremiumAtmosphere />

        <Container className="flex items-center justify-center text-center">
          <Reveal className="mx-auto w-full max-w-6xl">
            <GlassCard dark className="p-6 sm:p-8 lg:p-10 xl:p-12">
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : {
                        rotate: [0, 8, -8, 0],
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-yellow-400 text-xl text-emerald-950 sm:h-16 sm:w-16 sm:text-2xl"
              >
                <FaMapMarkedAlt />
              </motion.div>

              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300 sm:text-xs">
                Lingkungan yang baik membentuk kebiasaan yang baik
              </p>

              <h2 className="fac-section-title mx-auto mt-4 max-w-5xl font-black leading-[0.98] tracking-[-0.055em] text-white">
                Fasilitas pesantren mendukung perjalanan santri.
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-emerald-100 sm:text-base">
                Mulai dari masjid, asrama, kelas, ruang Qur’an, hingga area
                aktivitas. Semua disiapkan untuk mendukung pendidikan, ibadah,
                keamanan, dan pembinaan karakter santri.
              </p>

              <div className="mx-auto mt-7 grid max-w-4xl gap-3 sm:grid-cols-3">
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

              <div className="mx-auto mt-8 flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
                <MagneticButton onClick={() => jumpToSection(2)}>
                  Jelajahi Fasilitas
                  <FaArrowRight />
                </MagneticButton>

                <MagneticButton onClick={() => jumpToSection(1)} variant="secondary">
                  <FaPlay />
                  Lihat Unggulan
                </MagneticButton>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

    </main>
  );
}