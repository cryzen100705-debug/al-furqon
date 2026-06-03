"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePemberitahuanSantri } from "../../hooks/usePemberitahuanSantri";
import SidebarSantri from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import useSantriSettings from "../../hooks/useSantriSettings";

import {
  FaBell,
  FaBullhorn,
  FaSearch,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowRight,
  FaClock,
  FaUsers,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaQuran,
  FaMosque,
  FaFilter,
  FaTimes,
  FaEnvelopeOpenText,
  FaStar,
  FaShieldAlt,
  FaInbox,
} from "react-icons/fa";

export default function SantriPemberitahuan() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
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

    headerButton: isDark
      ? "bg-white/10 text-white hover:bg-white/20"
      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100",

    headerProfile: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-800/10 bg-emerald-50 text-emerald-900",

    headerProfileSub: isDark ? "text-emerald-100/70" : "text-slate-600",

    hero: isDark
      ? "border-white/10 bg-[#071B14]/80 text-white shadow-black/30"
      : "border-emerald-800/20 bg-[#FFFDF6] text-[#102A1F] shadow-yellow-950/10",

    heroOverlay: isDark
      ? "bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.88),rgba(74,52,16,0.72))]"
      : "bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,248,220,0.92),rgba(236,253,245,0.86))]",

    heroText: isDark ? "text-emerald-50/90" : "text-slate-700",

    badge: isDark
      ? "border border-yellow-300/20 bg-yellow-300/10"
      : "border border-emerald-700/15 bg-emerald-50",

    badgeIcon: isDark ? "text-yellow-300" : "text-emerald-700",
    badgeText: isDark ? "text-yellow-100" : "text-emerald-800",

    body: isDark
      ? "bg-[#0B2A20] shadow-black/20"
      : "bg-[#F8F0D6] shadow-yellow-950/10",

    lightCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-yellow-300/70 bg-[#FFFDF6] text-slate-900 shadow-yellow-950/10",

    solidCard: isDark
      ? "border-white/10 bg-[#102E24] text-white shadow-black/20"
      : "border-yellow-300/70 bg-white text-slate-900 shadow-yellow-950/10",

    heroGlass: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-800/10 bg-white/65 text-slate-900 shadow-yellow-950/10",

    heroButtonSecondary: isDark
      ? "border-white/10 bg-white/10 text-white hover:bg-white/20"
      : "border-emerald-700/15 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",

    glassCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-800/10 bg-white/70 text-slate-900",

    title: isDark ? "text-white" : "text-[#102A1F]",
    desc: isDark ? "text-emerald-50/80" : "text-slate-700",
    mutedText: isDark ? "text-emerald-50/70" : "text-slate-600",
    strongText: isDark ? "text-white" : "text-[#102A1F]",

    input: isDark
      ? "border-white/10 bg-white/10 text-white placeholder:text-emerald-50/40 focus:border-yellow-400 focus:ring-yellow-400/20"
      : "border-[#D8C287] bg-[#FFFDF6] text-slate-700 placeholder:text-slate-400 focus:border-yellow-500 focus:ring-yellow-100",

    resetButton: isDark
      ? "bg-white/10 text-white hover:bg-white/20"
      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
  };

  const {
    santri,
    data,
    readIds,
    loading,
    markAsRead: markReadToBackend,
  } = usePemberitahuanSantri();

  const [search, setSearch] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [filterStatusBaca, setFilterStatusBaca] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "null");

    if (!session || session?.user?.role !== "santri") {
      router.push("/login");
      return;
    }
  }, [router]);

  const markAsRead = async (item) => {
    if (!item?.id) return;

    setSelected(item);

    await markReadToBackend(item);
  };

  const getPriorityClass = (prioritas) => {
    if (prioritas === "penting") {
      return {
        badge: "bg-red-100 text-red-700 border-red-200",
        icon: "bg-red-500 text-white",
        border: "border-red-200",
        glow: "bg-red-500/15",
        text: "text-red-700",
      };
    }

    if (prioritas === "sedang") {
      return {
        badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "bg-yellow-400 text-emerald-950",
        border: "border-yellow-200",
        glow: "bg-yellow-400/20",
        text: "text-yellow-700",
      };
    }

    return {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "bg-emerald-600 text-white",
      border: "border-emerald-200",
      glow: "bg-emerald-500/15",
      text: "text-emerald-700",
    };
  };

  const getTargetLabel = (item) => {
    if (item.target_type === "semua") return "Semua Santri";
    if (item.target_type === "jenjang") return `Jenjang ${item.target_jenjang}`;

    if (item.target_type === "kelas") {
      return `${item.target_jenjang} - Kelas ${item.target_kelas}`;
    }

    if (item.target_type === "santri") return "Khusus Untuk Kamu";

    return "-";
  };

  const formatTanggal = (date) => {
    if (!date) return "-";

    const tanggal = new Date(date);

    if (isNaN(tanggal.getTime())) return "-";

    return tanggal.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isUnread = (item) => !readIds.includes(item.id);

  const unreadCount = data.filter((item) => isUnread(item)).length;
  const readCount = data.length - unreadCount;
  const totalPenting = data.filter((item) => item.prioritas === "penting").length;

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.judul?.toLowerCase().includes(keyword) ||
      item.isi?.toLowerCase().includes(keyword) ||
      item.kategori?.toLowerCase().includes(keyword);

    const matchPrioritas = filterPrioritas
      ? item.prioritas === filterPrioritas
      : true;

    const matchStatusBaca =
      filterStatusBaca === "belum_dibaca"
        ? isUnread(item)
        : filterStatusBaca === "sudah_dibaca"
        ? !isUnread(item)
        : true;

    return matchSearch && matchPrioritas && matchStatusBaca;
  });

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
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <main
        className={`
          min-h-screen transition-all duration-300
          pt-16 md:pt-0
          ${collapsed ? "md:ml-[90px]" : "md:ml-[280px]"}
        `}
      >
        <section className="relative min-h-screen overflow-hidden">
          <div className={`absolute inset-0 ${theme.background}`} />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10">
            <header
              className={`
                sticky top-0 z-40 border-b backdrop-blur-2xl transition-all duration-300
                ${theme.header}
              `}
            >
              <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
                  >
                    <FaBars />
                  </button>

                  <div className="min-w-0">
                    <h1
                      className={`truncate text-xl font-black md:text-2xl ${theme.headerTitle}`}
                    >
                      Pemberitahuan Santri
                    </h1>

                    <p
                      className={`mt-1 truncate text-xs font-semibold sm:text-sm ${theme.headerSub}`}
                    >
                      Informasi terbaru dari admin pesantren
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`
                      relative flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-xl transition
                      ${theme.headerButton}
                    `}
                  >
                    <FaBell
                      className={isDark ? "text-yellow-300" : "text-emerald-700"}
                    />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <div
                    className={`
                      hidden items-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-xl sm:flex
                      ${theme.headerProfile}
                    `}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-emerald-950">
                      {santri?.nama?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h3 className="max-w-[150px] truncate text-sm font-black">
                        {santri?.nama || "Santri"}
                      </h3>

                      <p className={`text-xs ${theme.headerProfileSub}`}>
                        Santri Aktif
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <motion.section
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`
                  relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
                  ${
                    isCompact
                      ? "rounded-[30px] p-4 sm:p-5 lg:p-6"
                      : "rounded-[42px] p-5 sm:p-7 lg:p-9"
                  }
                  ${theme.hero}
                `}
              >
                <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                  <div>
                    <div
                      className={`
                        inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-xl
                        ${theme.badge}
                      `}
                    >
                      <FaMosque className={theme.badgeIcon} />

                      <span
                        className={`
                          text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs
                          ${theme.badgeText}
                        `}
                      >
                        Santri Information Center
                      </span>
                    </div>

                    <h2
                      className={`
                        mt-6 font-black leading-[0.9] tracking-[-0.065em]
                        ${
                          isCompact
                            ? "text-[clamp(2rem,5vw,4.5rem)]"
                            : "text-[clamp(2.3rem,6vw,5.6rem)]"
                        }
                      `}
                    >
                      Informasi
                      <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                        Pesantren.
                      </span>
                    </h2>

                    <p
                      className={`
                        mt-5 max-w-3xl leading-relaxed
                        ${theme.heroText}
                        ${
                          isCompact
                            ? "text-xs sm:text-sm"
                            : "text-sm sm:text-base lg:text-lg"
                        }
                      `}
                    >
                      Assalamu’alaikum, {santri?.nama || "Santri"}. Di halaman
                      ini kamu bisa membaca informasi penting, pengumuman, dan
                      pemberitahuan resmi dari admin Pondok Pesantren Al-Furqon.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href="#daftar-pemberitahuan"
                        className={`
                          inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6
                          font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300
                          ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
                        `}
                      >
                        Lihat Pemberitahuan
                        <FaArrowRight />
                      </a>

                      <div
                        className={`
                          inline-flex h-12 items-center justify-center gap-3 rounded-2xl border px-6
                          font-black backdrop-blur-xl
                          ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
                          ${theme.heroButtonSecondary}
                        `}
                      >
                        <FaEyeSlash
                          className={isDark ? "text-yellow-300" : "text-emerald-700"}
                        />
                        {unreadCount} belum dibaca
                      </div>
                    </div>
                  </div>

                  <div className="relative mx-auto w-full max-w-md xl:ml-auto">
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

                    <div
                      className={`
                        relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
                        ${isCompact ? "rounded-[28px] p-4" : "rounded-[40px] p-6"}
                        ${theme.heroGlass}
                      `}
                    >
                      <div
                        className={`
                          absolute inset-0
                          ${
                            isDark
                              ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]"
                              : "bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(236,253,245,0.78),rgba(255,248,220,0.74))]"
                          }
                        `}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`text-sm font-semibold ${theme.mutedText}`}>
                              Belum Dibaca
                            </p>

                            <h3
                              className={`
                                mt-2 font-black ${theme.strongText}
                                ${isCompact ? "text-4xl" : "text-5xl"}
                              `}
                            >
                              {unreadCount}
                            </h3>
                          </div>

                          <div
                            className={`
                              flex items-center justify-center rounded-3xl bg-yellow-400 text-emerald-950 shadow-xl
                              ${isCompact ? "h-14 w-14 text-xl" : "h-16 w-16 text-2xl"}
                            `}
                          >
                            <FaBell />
                          </div>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-4">
                          <HeroMiniCard
                            label="Total"
                            value={data.length}
                            icon={<FaEnvelopeOpenText />}
                            theme={theme}
                            isCompact={isCompact}
                          />

                          <HeroMiniCard
                            label="Penting"
                            value={totalPenting}
                            icon={<FaExclamationCircle />}
                            theme={theme}
                            isCompact={isCompact}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <section
                className={`
                  mt-7 shadow-2xl transition-all duration-300
                  ${
                    isCompact
                      ? "rounded-[30px] p-3 sm:p-4 lg:p-5"
                      : "rounded-[42px] p-4 sm:p-6 lg:p-7"
                  }
                  ${theme.body}
                `}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Semua Pemberitahuan"
                    value={data.length}
                    icon={<FaBell />}
                    color="from-emerald-500 to-green-700"
                    theme={theme}
                    isCompact={isCompact}
                  />

                  <StatCard
                    title="Belum Dibaca"
                    value={unreadCount}
                    icon={<FaEyeSlash />}
                    color="from-red-500 to-orange-500"
                    theme={theme}
                    isCompact={isCompact}
                  />

                  <StatCard
                    title="Sudah Dibaca"
                    value={readCount}
                    icon={<FaEye />}
                    color="from-blue-500 to-cyan-500"
                    theme={theme}
                    isCompact={isCompact}
                  />

                  <StatCard
                    title="Penting"
                    value={totalPenting}
                    icon={<FaExclamationCircle />}
                    color="from-yellow-400 to-orange-500"
                    theme={theme}
                    isCompact={isCompact}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div
                    className={`
                      relative overflow-hidden border shadow-xl transition-all duration-300
                      ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-6"}
                      ${theme.lightCard}
                    `}
                  >
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                        <FaShieldAlt />
                        Ringkasan Informasi
                      </div>

                      <h2
                        className={`
                          mt-3 font-black ${theme.title}
                          ${isCompact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}
                        `}
                      >
                        Baca pemberitahuan agar tidak tertinggal informasi
                      </h2>

                      <p
                        className={`
                          mt-2 max-w-3xl leading-relaxed ${theme.desc}
                          ${isCompact ? "text-xs" : "text-sm"}
                        `}
                      >
                        Informasi yang tampil sudah disesuaikan dengan jenjang,
                        kelas, atau akun santri kamu. Pemberitahuan yang dibuka
                        otomatis ditandai sebagai sudah dibaca.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      relative overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] text-white shadow-xl shadow-green-950/10
                      ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-6"}
                    `}
                  >
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className={`
                          flex shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg
                          ${isCompact ? "h-12 w-12 text-xl" : "h-14 w-14 text-2xl"}
                        `}
                      >
                        <FaQuran />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-emerald-100">
                          Pengingat
                        </p>

                        <h3
                          className={`
                            mt-2 font-black leading-snug text-white
                            ${isCompact ? "text-xl" : "text-2xl"}
                          `}
                        >
                          Informasi yang baik membantu santri lebih tertib.
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="daftar-pemberitahuan"
                  className={`
                    mt-6 border shadow-xl transition-all duration-300
                    ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-5 sm:p-6"}
                    ${theme.solidCard}
                  `}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                        <FaFilter />
                        Filter Pemberitahuan
                      </div>

                      <h2
                        className={`
                          mt-3 font-black ${theme.title}
                          ${isCompact ? "text-xl" : "text-2xl"}
                        `}
                      >
                        Daftar Pemberitahuan
                      </h2>

                      <p
                        className={`
                          mt-1 leading-relaxed ${theme.mutedText}
                          ${isCompact ? "text-xs" : "text-sm"}
                        `}
                      >
                        Cari berdasarkan judul, isi, kategori, prioritas, dan
                        status baca.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setFilterPrioritas("");
                        setFilterStatusBaca("");
                      }}
                      className={`
                        inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4
                        font-black transition
                        ${isCompact ? "text-xs" : "text-sm"}
                        ${theme.resetButton}
                      `}
                    >
                      <FaTimes />
                      Reset Filter
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Cari pemberitahuan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`
                          h-12 w-full rounded-2xl border pl-12 pr-4 font-semibold outline-none transition focus:ring-4
                          ${isCompact ? "text-xs" : "text-sm"}
                          ${theme.input}
                        `}
                      />
                    </div>

                    <select
                      value={filterPrioritas}
                      onChange={(e) => setFilterPrioritas(e.target.value)}
                      className={`
                        h-12 rounded-2xl border px-4 font-semibold outline-none transition focus:ring-4
                        ${isCompact ? "text-xs" : "text-sm"}
                        ${theme.input}
                      `}
                    >
                      <option value="">Semua Prioritas</option>
                      <option value="normal">Normal</option>
                      <option value="sedang">Sedang</option>
                      <option value="penting">Penting</option>
                    </select>

                    <select
                      value={filterStatusBaca}
                      onChange={(e) => setFilterStatusBaca(e.target.value)}
                      className={`
                        h-12 rounded-2xl border px-4 font-semibold outline-none transition focus:ring-4
                        ${isCompact ? "text-xs" : "text-sm"}
                        ${theme.input}
                      `}
                    >
                      <option value="">Semua Status Baca</option>
                      <option value="belum_dibaca">Belum Dibaca</option>
                      <option value="sudah_dibaca">Sudah Dibaca</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  {loading ? (
                    <LoadingBox theme={theme} isCompact={isCompact} />
                  ) : filteredData.length === 0 ? (
                    <EmptyBox theme={theme} isCompact={isCompact} />
                  ) : (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      {filteredData.map((item, index) => (
                        <NotificationCard
                          key={item.id}
                          item={item}
                          index={index}
                          unread={isUnread(item)}
                          style={getPriorityClass(item.prioritas)}
                          getTargetLabel={getTargetLabel}
                          formatTanggal={formatTanggal}
                          onClick={() => markAsRead(item)}
                          theme={theme}
                          isCompact={isCompact}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {selected && (
            <DetailModal
              selected={selected}
              onClose={() => setSelected(null)}
              getPriorityClass={getPriorityClass}
              getTargetLabel={getTargetLabel}
              formatTanggal={formatTanggal}
              theme={theme}
              isDark={isDark}
              isCompact={isCompact}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroMiniCard({ label, value, icon, theme, isCompact }) {
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

      <p className={`text-sm font-semibold ${theme.mutedText}`}>{label}</p>

      <h3
        className={`
          mt-1 font-black ${theme.strongText}
          ${isCompact ? "text-xl" : "text-2xl"}
        `}
      >
        {value}
      </h3>
    </div>
  );
}

function StatCard({ title, value, icon, color, theme, isCompact }) {
  return (
    <motion.div
      whileHover={{
        y: -7,
        scale: 1.01,
      }}
      className={`
        relative overflow-hidden border shadow-xl transition
        ${isCompact ? "rounded-[22px] p-4" : "rounded-[30px] p-6"}
        ${theme.lightCard}
      `}
    >
      <div
        className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${color} opacity-20 blur-3xl`}
      />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p
            className={`
              font-black ${theme.desc}
              ${isCompact ? "text-xs" : "text-sm"}
            `}
          >
            {title}
          </p>

          <h2
            className={`
              mt-3 font-black ${theme.title}
              ${isCompact ? "text-3xl" : "text-4xl"}
            `}
          >
            {value}
          </h2>
        </div>

        <div
          className={`
            flex shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${color} text-white shadow-xl
            ${isCompact ? "h-12 w-12 text-xl" : "h-16 w-16 text-2xl"}
          `}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function NotificationCard({
  item,
  index,
  unread,
  style,
  getTargetLabel,
  formatTanggal,
  onClick,
  theme,
  isCompact,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 35,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={{
        y: -5,
        scale: 1.005,
      }}
      className={`
        group relative overflow-hidden border text-left shadow-xl transition
        ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-5 sm:p-6"}
        ${theme.solidCard}
        ${unread ? "border-red-200" : style.border}
      `}
    >
      <div
        className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl ${
          unread ? "bg-red-500/15" : style.glow
        }`}
      />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />

      {unread && (
        <div className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-[11px] font-black text-white shadow-lg">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Baru
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
        <div
          className={`
            flex shrink-0 items-center justify-center rounded-3xl shadow-lg
            ${isCompact ? "h-14 w-14 text-xl" : "h-16 w-16 text-2xl"}
            ${unread ? "bg-red-500 text-white" : style.icon}
          `}
        >
          {unread ? <FaEyeSlash /> : <FaBullhorn />}
        </div>

        <div className="min-w-0 flex-1 pr-0 sm:pr-14">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-black capitalize ${style.badge}`}
            >
              {item.prioritas || "normal"}
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
              {item.kategori || "Informasi"}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-black ${
                unread
                  ? "border-red-200 bg-red-100 text-red-700"
                  : "border-blue-200 bg-blue-100 text-blue-700"
              }`}
            >
              {unread ? "Belum Dibaca" : "Sudah Dibaca"}
            </span>
          </div>

          <h3
            className={`
              mt-4 line-clamp-2 font-black leading-tight ${theme.title}
              ${isCompact ? "text-lg" : "text-xl"}
            `}
          >
            {item.judul}
          </h3>

          <p
            className={`
              mt-3 line-clamp-3 leading-relaxed ${theme.mutedText}
              ${isCompact ? "text-xs" : "text-sm"}
            `}
          >
            {item.isi}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <FaUsers />
              {getTargetLabel(item)}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-purple-700">
              <FaClock />
              {formatTanggal(item.created_at)}
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 font-black text-[#064E3B]">
            Baca Detail
            <FaArrowRight className="transition group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function LoadingBox({ theme, isCompact }) {
  return (
    <div
      className={`
        border text-center shadow-xl transition-all duration-300
        ${isCompact ? "rounded-[24px] p-10" : "rounded-[35px] p-16"}
        ${theme.solidCard}
      `}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>

      <h3 className={`mt-6 text-xl font-black ${theme.title}`}>
        Memuat Pemberitahuan
      </h3>

      <p className={`mt-2 text-sm ${theme.mutedText}`}>
        Mohon tunggu sebentar...
      </p>
    </div>
  );
}

function EmptyBox({ theme, isCompact }) {
  return (
    <div
      className={`
        border text-center shadow-xl transition-all duration-300
        ${isCompact ? "rounded-[24px] p-10" : "rounded-[35px] p-10 sm:p-16"}
        ${theme.solidCard}
      `}
    >
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-emerald-50 text-5xl text-emerald-700">
        <FaInbox />
      </div>

      <h3
        className={`
          mt-8 font-black ${theme.title}
          ${isCompact ? "text-2xl" : "text-3xl"}
        `}
      >
        Belum Ada Pemberitahuan
      </h3>

      <p
        className={`
          mx-auto mt-3 max-w-md leading-relaxed ${theme.mutedText}
          ${isCompact ? "text-xs" : "text-sm sm:text-base"}
        `}
      >
        Pemberitahuan dari admin pesantren akan muncul di halaman ini.
      </p>
    </div>
  );
}

function DetailModal({
  selected,
  onClose,
  getPriorityClass,
  getTargetLabel,
  formatTanggal,
  theme,
  isDark,
  isCompact,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 35,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.94,
          y: 35,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          relative max-h-[90vh] w-full max-w-3xl overflow-hidden shadow-2xl
          ${isCompact ? "rounded-[26px]" : "rounded-[36px]"}
          ${isDark ? "bg-[#102E24]" : "bg-white"}
        `}
      >
        <div
          className={`
            relative overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] text-white
            ${isCompact ? "p-5" : "p-6 sm:p-8"}
          `}
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <FaTimes />
          </button>

          <div className="relative z-10 flex items-start gap-4 pr-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
              <FaBell />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-100">
                Detail Pemberitahuan
              </p>

              <h2
                className={`
                  mt-2 font-black leading-tight
                  ${isCompact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}
                `}
              >
                {selected.judul}
              </h2>
            </div>
          </div>
        </div>

        <div
          className={`
            max-h-[calc(90vh-190px)] overflow-y-auto
            ${isCompact ? "p-4" : "p-5 sm:p-7"}
          `}
        >
          <div className="mb-5 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${
                getPriorityClass(selected.prioritas).badge
              }`}
            >
              {selected.prioritas || "normal"}
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
              {getTargetLabel(selected)}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {formatTanggal(selected.created_at)}
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
              {selected.kategori || "Informasi"}
            </span>
          </div>

          <div
            className={`
              border transition-all duration-300
              ${isCompact ? "rounded-[22px] p-4" : "rounded-[28px] p-5 sm:p-6"}
              ${
                isDark
                  ? "border-white/10 bg-white/10"
                  : "border-[#E5D6AA] bg-[#FFFDF6]"
              }
            `}
          >
            <p
              className={`
                whitespace-pre-line leading-relaxed ${theme.desc}
                ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
              `}
            >
              {selected.isi}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#064E3B] font-black text-white shadow-lg transition hover:bg-[#086B4F]"
          >
            <FaCheckCircle />
            Saya Mengerti
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}