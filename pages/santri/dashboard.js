"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SidebarSantri from "./sidebar";
import { motion } from "framer-motion";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import useSantriSettings from "../../hooks/useSantriSettings";

import {
  FaBookOpen,
  FaMosque,
  FaArrowRight,
  FaGraduationCap,
  FaSun,
  FaStar,
  FaHandSparkles,
  FaQuran,
  FaMoneyBillWave,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUserCircle,
  FaBell,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaMoon,
  FaShieldAlt,
  FaHome,
} from "react-icons/fa";

const API_URL = "";

export default function SantriDashboard() {
const [santri, setSantri] = useState(null);
const [dashboard, setDashboard] = useState(null);
const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { settings } = useSantriSettings();

  const isDark = settings.darkMode;
const isCompact = settings.compactMode;

const theme = {
  page: isDark
    ? "bg-[#061B14] text-white"
    : "bg-[#F7F1DF] text-slate-900",

  background: isDark
    ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#061B14_0%,#0B3B2E_42%,#F2EAD5_42%,#F2EAD5_100%)]"
    : "bg-[linear-gradient(180deg,#FFF8E1_0%,#F7F1DF_42%,#FDFBF4_42%,#FDFBF4_100%)]",

  header: isDark
    ? "border-white/10 bg-[#061B14]/75"
    : "border-yellow-200 bg-white/95 shadow-sm",

  headerTitle: isDark ? "text-white" : "text-[#102A1F]",
  headerSub: isDark ? "text-emerald-100/75" : "text-slate-600",

  hero: isDark
    ? "border-white/10 bg-[#071B14]/80 text-white shadow-black/30"
    : "border-emerald-800/20 bg-[#FFFDF6] text-[#102A1F] shadow-yellow-950/10",

  heroOverlay: isDark
    ? "bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.88),rgba(74,52,16,0.72))]"
    : "bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,248,220,0.92),rgba(236,253,245,0.86))]",

  heroText: isDark ? "text-emerald-50/90" : "text-slate-700",

  body: isDark
    ? "bg-[#0B2A20] shadow-black/20"
    : "bg-[#F8F0D6] shadow-yellow-950/10",

  lightCard: isDark
    ? "border-white/10 bg-white/10 text-white"
    : "border-yellow-300/70 bg-[#FFFDF6] text-slate-900 shadow-yellow-950/10",

  title: isDark ? "text-white" : "text-[#102A1F]",
  desc: isDark ? "text-emerald-50/80" : "text-slate-700",

  glassCard: isDark
    ? "border-white/10 bg-white/10 text-white"
    : "border-emerald-800/10 bg-white/70 text-slate-900",
};

  useEffect(() => {
  const getData = async () => {
    try {
      setLoading(true);

      const session = JSON.parse(localStorage.getItem("session"));

      if (!session?.user?.id) {
        console.log("Session tidak ditemukan.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/santri/dashboard/${session.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response backend bukan JSON:", text);

        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan Express aktif."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data dashboard.");
      }

      setSantri(result.data?.santri || null);
      setDashboard(result.data || null);
    } catch (err) {
  console.error("DASHBOARD SANTRI ERROR:", err.message);
  setSantri(null);
  setDashboard(null);
} finally {
  setLoading(false);
}
  };

  getData();
}, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const menus = [
    {
      title: "Pembayaran",
      desc: "Lihat tagihan dan upload bukti pembayaran pondok.",
      icon: <FaMoneyBillWave />,
      color: "from-emerald-400 via-green-500 to-emerald-700",
      href: "/santri/pembayaran",
      badge: "Keuangan",
    },
    {
      title: "Pemberitahuan",
      desc: "Lihat informasi, pengumuman, dan pesan terbaru dari admin pesantren.",
      icon: <FaBell />,
      color: "from-yellow-300 via-amber-400 to-orange-600",
      href: "/santri/pemberitahuan",
      badge: "Informasi",
    },
    {
      title: "Profil",
      desc: "Kelola data diri dan informasi akun santri.",
      icon: <FaGraduationCap />,
      color: "from-sky-400 via-cyan-500 to-blue-700",
      href: "/santri/profil",
      badge: "Identitas",
    },
  ];

  const quickStats = useMemo(() => {
    return [
      {
        title: "Jenjang",
        value: santri?.jenjang || "-",
        icon: <FaBookOpen />,
        color: "bg-emerald-600 text-white",
      },
      {
        title: santri?.jenjang === "Takhassus" ? "Marhalah" : "Kelas",
        value: santri?.kelas || "-",
        icon: <FaMosque />,
        color: "bg-yellow-400 text-emerald-950",
      },
      {
        title: "Status",
        value: "Aktif",
        icon: <FaCheckCircle />,
        color: "bg-green-600 text-white",
      },
      {
        title: "Semester",
        value: "Genap",
        icon: <FaClock />,
        color: "bg-blue-600 text-white",
      },
    ];
  }, [santri]);

  const pembayaranInfo = dashboard?.pembayaran || {
  total: 0,
  belum_bayar: 0,
  pending: 0,
  lunas: 0,
  total_belum_bayar: 0,
};

const hasTagihanBelumBayar = pembayaranInfo.belum_bayar > 0;
const hasPendingPayment = pembayaranInfo.pending > 0;

const pemberitahuanInfo = dashboard?.pemberitahuan || {
  total: 0,
  belum_dibaca: 0,
  penting: 0,
  terbaru: [],
  belum_dibaca_terbaru: [],
};

const hasPemberitahuanBelumDibaca = pemberitahuanInfo.belum_dibaca > 0;

const { checking } = useAuthGuard(["santri"]);

if (checking) {
  return <AuthLoading role="Santri" />;
}

  return (
  <div
  className={`
    min-h-screen overflow-x-hidden transition-all duration-300
    ${theme.page}
    ${isCompact ? "text-sm" : "text-base"}
  `}
>
      <SidebarSantri
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <motion.main
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -28 }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          min-h-screen transition-all duration-300
          pt-16 md:pt-0
          ${collapsed ? "md:ml-[90px]" : "md:ml-[280px]"}
        `}
      >
        <section className="relative min-h-screen overflow-hidden">
          {/* BACKGROUND */}
          <div className={`absolute inset-0 ${theme.background}`} />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative z-10">
            {/* TOP BAR */}
            <header
  className={`
    sticky top-0 z-30 border-b backdrop-blur-2xl transition-all duration-300
    ${theme.header}
  `}
>
              <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
                  >
                    <FaHome />
                  </button>

                  <div className="min-w-0">
                    <h1 className={`truncate text-xl font-black md:text-2xl ${theme.headerTitle}`}>
                      Dashboard Santri
                    </h1>

                    <p className={`mt-1 truncate text-xs font-semibold sm:text-sm ${theme.headerSub}`}>
                      {today}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/santri/pembayaran"
                    className="hidden h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:flex"
                  >
                    <FaMoneyBillWave className="text-yellow-300" />
                    Pembayaran
                  </Link>

                  <Link
                    href="/santri/profil"
                    className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg transition hover:bg-yellow-300"
                  >
                    <FaUserCircle />
                  </Link>
                </div>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              {/* HERO */}
              <section
  className={`
    relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
    ${isCompact ? "rounded-[30px] p-4 sm:p-5 lg:p-6" : "rounded-[42px] p-5 sm:p-7 lg:p-9"}
    ${theme.hero}
  `}
>
                <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
                  {/* LEFT HERO */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className={`
  inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-xl
  ${
    isDark
      ? "border border-yellow-300/20 bg-yellow-300/10"
      : "border border-emerald-700/15 bg-emerald-50"
  }
`}
                    >
                      <motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className={`
    inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-xl
    ${
      isDark
        ? "border border-yellow-300/20 bg-yellow-300/10"
        : "border border-emerald-700/15 bg-emerald-50"
    }
  `}
>
  <FaSun className={isDark ? "text-yellow-300" : "text-emerald-700"} />

  <span
    className={`
      text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs
      ${isDark ? "text-yellow-100" : "text-emerald-800"}
    `}
  >
    Santri Learning Center
  </span>
</motion.div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.25, duration: 0.7 }}
                      className="mt-6 text-[clamp(2.25rem,6vw,5.6rem)] font-black leading-[0.9] tracking-[-0.065em]"
                    >
                      Assalamu’alaikum,
                      <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                        {loading ? "Memuat..." : santri?.nama || "Santri"}
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.65 }}
                      className={`mt-5 max-w-3xl leading-relaxed ${theme.heroText} ${ isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base lg:text-lg" }`}
                    >
                      Selamat datang di sistem digital Pondok Pesantren Al
                      Furqon. Pantau pembayaran, pemberitahuan, dan profil santri
                      dalam satu dashboard yang nyaman digunakan.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.65 }}
                      className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                    >
                      <Link
                        href="/santri/pembayaran"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                      >
                        Lihat Pembayaran
                        <FaArrowRight />
                      </Link>

                      <Link
                        href="/santri/pemberitahuan"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20 sm:text-base"
                      >
                        Pemberitahuan
                        <FaBell />
                      </Link>
                    </motion.div>

                    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {quickStats.map((item, index) => (
                        <motion.div
  key={item.title}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.55 + index * 0.08 }}
  className={`
    border backdrop-blur-xl transition-all duration-300
    ${isCompact ? "rounded-2xl p-3" : "rounded-3xl p-4"}
    ${theme.glassCard}
  `}
>
  <div
    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${item.color}`}
  >
    {item.icon}
  </div>

  <p className={`text-xs font-semibold ${isDark ? "text-emerald-50/75" : "text-slate-600"}`}>
    {item.title}
  </p>

  <h3 className={`mt-1 truncate font-black ${isCompact ? "text-lg" : "text-xl"} ${theme.title}`}>
    {loading ? "..." : item.value}
  </h3>
</motion.div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT PROFILE CARD */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.7,
                      type: "spring",
                    }}
                    className="relative mx-auto w-full max-w-md xl:ml-auto"
                  >
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-3 -top-4 z-20 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-2xl"
                    >
                      <FaStar />
                    </motion.div>

                    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                      <div
  className={`
    absolute inset-0
    ${
      isDark
        ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]"
        : "bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(236,253,245,0.82),rgba(255,248,220,0.86))]"
    }
  `}
/>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${isDark ? "text-emerald-50/70" : "text-slate-600"}`}>
                              Profil Santri
                            </p>

                            <h2 className={`mt-2 truncate font-black ${isCompact ? "text-xl" : "text-2xl"} ${theme.title}`}>
                              {loading ? "Memuat..." : santri?.nama || "-"}
                            </h2>
                          </div>

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-xl">
                            <FaHandSparkles />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-yellow-300/25 blur-3xl" />

                            <motion.img
                              initial={{ scale: 0.75, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 0.45,
                                duration: 0.7,
                                type: "spring",
                              }}
                              whileHover={{
                                scale: 1.06,
                                rotate: 2,
                              }}
                              src={santri?.foto || "/default-user.png"}
                              alt="Foto Santri"
                              onError={(e) => {
                                e.currentTarget.src = "/default-user.png";
                              }}
                              className="relative h-44 w-44 rounded-full border-[6px] border-white object-cover shadow-2xl sm:h-52 sm:w-52"
                            />
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                          <ProfileMiniCard
  label="Status"
  value="Aktif"
  icon={<FaCheckCircle />}
  isDark={isDark}
  theme={theme}
  isCompact={isCompact}
/>

<ProfileMiniCard
  label="Semester"
  value="Genap"
  icon={<FaMoon />}
  isDark={isDark}
  theme={theme}
  isCompact={isCompact}
/>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* BODY WRAPPER */}
              <section
  className={`
    mt-7 rounded-[42px] shadow-2xl transition-all duration-300
    ${isCompact ? "p-3 sm:p-4 lg:p-5" : "p-4 sm:p-6 lg:p-7"}
    ${theme.body}
  `}
>
                {/* INFO STRIP */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`
  relative overflow-hidden rounded-[34px] border shadow-xl transition-all duration-300
  ${isCompact ? "p-4" : "p-6"}
  ${theme.lightCard}
`}
                  >
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          <FaShieldAlt />
                          Ringkasan Santri
                        </div>

                        <h2 className={`mt-3 font-black ${theme.title} ${
  isCompact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
}`}>
                          Pantau aktivitas pondok dengan mudah
                        </h2>

                        <p className={`mt-2 max-w-2xl leading-relaxed ${theme.desc} ${
  isCompact ? "text-xs" : "text-sm"
}`}>
                          Gunakan dashboard ini untuk mengakses pembayaran,
                          pemberitahuan terbaru, serta memperbarui informasi profil
                          santri.
                        </p>
                      </div>

                      <Link
                        href="/santri/profil"
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#064E3B] px-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
                      >
                        Buka Profil
                        <FaArrowRight />
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                    className="relative overflow-hidden rounded-[34px] border border-[#E5D6AA] bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] p-6 text-white shadow-xl shadow-green-950/10"
                  >
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
                        <FaQuran />
                      </div>

                      <p className="mt-5 text-sm font-semibold text-emerald-100">
                        Motivasi Hari Ini
                      </p>

                      <h3 className="mt-2 text-2xl font-black leading-snug text-white">
                        “Menuntut ilmu adalah perjalanan menuju kemuliaan.”
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-emerald-50/85">
                        Tetap semangat belajar, menjaga adab, dan istiqamah
                        dalam ibadah.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* MENU */}
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {menus.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 45 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.45 + i * 0.12,
                        duration: 0.55,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="group block h-full"
                      >
                        <div
  className={`
    relative h-full overflow-hidden border shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl
    ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-6"}
    ${theme.lightCard}
  `}
>
                          <div
                            className={`
                              absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-25
                              bg-gradient-to-br ${item.color}
                              transition group-hover:scale-125
                            `}
                          />

                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-4">
                              <div
                                className={`
                                  flex h-20 w-20 items-center justify-center rounded-3xl
                                  bg-gradient-to-br ${item.color}
                                  text-3xl text-white shadow-2xl
                                  transition group-hover:rotate-3 group-hover:scale-110
                                `}
                              >
                                {item.icon}
                              </div>

                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
                                {item.badge}
                              </span>
                            </div>

                            <h2
  className={`
    mt-7 font-black
    ${theme.title}
    ${isCompact ? "text-2xl" : "text-3xl"}
  `}
>
                              {item.title}
                            </h2>

                            <p
  className={`
    mt-4 leading-relaxed
    ${theme.desc}
    ${isCompact ? "text-xs" : "text-sm"}
  `}
>
                              {item.desc}
                            </p>

                            <div className="mt-7 inline-flex items-center gap-3 font-black text-[#064E3B]">
                              Masuk Menu
                              <FaArrowRight className="transition group-hover:translate-x-2" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* ACTIVITY + QUOTE */}
                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                  <motion.div
                    initial={{ opacity: 0, y: 45 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className={`
  border shadow-xl transition-all duration-300
  ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-6"}
  ${theme.lightCard}
`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                          <FaClipboardList />
                          Checklist Santri
                        </div>

                        <h2 className={`mt-3 font-black ${theme.title} ${isCompact ? "text-xl" : "text-2xl"}`}>
                          Agenda yang bisa dicek
                        </h2>
                      </div>

                      <FaBell className="text-2xl text-yellow-500" />
                    </div>

<div className="mt-5 space-y-3">
  <ChecklistItem
    text={
      hasTagihanBelumBayar
        ? `Ada ${pembayaranInfo.belum_bayar} tagihan yang belum dibayar`
        : hasPendingPayment
        ? `Ada ${pembayaranInfo.pending} pembayaran menunggu verifikasi`
        : "Tidak ada tagihan pembayaran yang belum dibayar"
    }
    href="/santri/pembayaran"
    status={
      hasTagihanBelumBayar
        ? "danger"
        : hasPendingPayment
        ? "warning"
        : "success"
    }
    badge={
      hasTagihanBelumBayar
        ? "Perlu Dibayar"
        : hasPendingPayment
        ? "Menunggu Admin"
        : "Aman"
    }
  />

<ChecklistItem
  text={
    hasPemberitahuanBelumDibaca
      ? `Ada ${pemberitahuanInfo.belum_dibaca} pemberitahuan yang belum dibaca`
      : "Semua pemberitahuan sudah dibaca"
  }
  href="/santri/pemberitahuan"
  status={hasPemberitahuanBelumDibaca ? "warning" : "success"}
  badge={hasPemberitahuanBelumDibaca ? "Belum Dibaca" : "Aman"}
/>

  <ChecklistItem
    text="Pastikan data profil sudah benar"
    href="/santri/profil"
    status="success"
    badge="Profil"
  />
</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 45 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#B7791F] p-6 text-white shadow-2xl shadow-green-950/15"
                  >
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <FaQuran className="text-4xl text-yellow-300" />

                          <h2 className="text-3xl font-black">
                            Pesan Hari Ini
                          </h2>
                        </div>

                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50 sm:text-lg">
                          “Barang siapa menempuh jalan untuk mencari ilmu, maka
                          Allah akan mudahkan baginya jalan menuju surga.”
                        </p>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
                        <p className="text-sm text-emerald-100">
                          Tetap Semangat ✨
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                          Menuntut Ilmu
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProfileMiniCard({ label, value, icon, isDark, theme, isCompact }) {
  return (
    <div
      className={`
        border backdrop-blur-xl transition-all duration-300
        ${isCompact ? "rounded-2xl p-3" : "rounded-3xl p-4"}
        ${theme.glassCard}
      `}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
        {icon}
      </div>

      <p className={`text-sm font-semibold ${isDark ? "text-emerald-50/70" : "text-slate-600"}`}>
        {label}
      </p>

      <h3 className={`mt-1 font-black ${isCompact ? "text-lg" : "text-xl"} ${theme.title}`}>
        {value}
      </h3>
    </div>
  );
}

function ChecklistItem({ text, href = "#", status = "success", badge = "" }) {
  const config = {
    success: {
      icon: <FaCheckCircle />,
      wrapper: "border-emerald-100 bg-emerald-50",
      iconBox: "bg-emerald-600 text-white",
      text: "text-slate-700",
      badge: "bg-emerald-100 text-emerald-700",
    },
    warning: {
      icon: <FaClock />,
      wrapper: "border-yellow-200 bg-yellow-50",
      iconBox: "bg-yellow-400 text-emerald-950",
      text: "text-yellow-800",
      badge: "bg-yellow-100 text-yellow-700",
    },
    danger: {
      icon: <FaExclamationTriangle />,
      wrapper: "border-red-200 bg-red-50",
      iconBox: "bg-red-600 text-white",
      text: "text-red-800",
      badge: "bg-red-100 text-red-700",
    },
  };

  const item = config[status] || config.success;

  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${item.wrapper}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBox}`}
        >
          {item.icon}
        </div>

        <p className={`font-semibold ${item.text}`}>
          {text}
        </p>
      </div>

      {badge && (
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${item.badge}`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}