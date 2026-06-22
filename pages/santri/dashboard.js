"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SidebarSantri from "./sidebar";
import { motion } from "framer-motion";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import useSantriSettings from "../../hooks/useSantriSettings";

import {
  FaArrowRight,
  FaBell,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaGraduationCap,
  FaHandSparkles,
  FaHome,
  FaMoneyBillWave,
  FaMoon,
  FaMosque,
  FaQuran,
  FaShieldAlt,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const EASE = [0.22, 1, 0.36, 1];

export default function SantriDashboard() {
  const { checking } = useAuthGuard(["santri"]);
  const { settings } = useSantriSettings();

  const [santri, setSantri] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isDark = settings.darkMode;
  const isCompact = settings.compactMode;

  const theme = useMemo(
    () => ({
      page: isDark
        ? "bg-[#041B15] text-white"
        : "bg-[#F7F1DF] text-slate-900",

      surface: isDark
        ? "border-white/10 bg-white/[0.08] text-white"
        : "border-emerald-900/10 bg-white/80 text-slate-900",

      surfaceStrong: isDark
        ? "border-white/10 bg-[#08241B]/80 text-white"
        : "border-emerald-900/10 bg-[#FFFDF6] text-slate-900",

      header: isDark
        ? "border-white/10 bg-[#041B15]/78"
        : "border-emerald-900/10 bg-white/90 shadow-sm",

      title: isDark ? "text-white" : "text-[#102A1F]",
      desc: isDark ? "text-emerald-50/80" : "text-slate-600",
      muted: isDark ? "text-emerald-100/70" : "text-slate-500",

      mainBg: isDark
        ? "bg-[radial-gradient(circle_at_80%_8%,rgba(250,204,21,0.18),transparent_28%),radial-gradient(circle_at_16%_30%,rgba(16,185,129,0.16),transparent_32%),linear-gradient(135deg,#041B15_0%,#082A20_46%,#0B3B2E_100%)]"
        : "bg-[radial-gradient(circle_at_80%_8%,rgba(250,204,21,0.22),transparent_28%),radial-gradient(circle_at_16%_30%,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,#FFF8E1_0%,#F7F1DF_46%,#ECFDF5_100%)]",

      heroOverlay: isDark
        ? "bg-[radial-gradient(circle_at_12%_10%,rgba(250,204,21,0.18),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(135deg,rgba(6,78,59,0.72),rgba(4,27,21,0.82),rgba(80,57,12,0.50))]"
        : "bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,248,220,0.88),rgba(236,253,245,0.86))]",

      heroText: isDark ? "text-emerald-50/90" : "text-slate-700",
    }),
    [isDark]
  );

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const session = JSON.parse(localStorage.getItem("session"));

        if (!session?.user?.id) {
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

  const pembayaranInfo = dashboard?.pembayaran || {
    total: 0,
    belum_bayar: 0,
    pending: 0,
    lunas: 0,
    total_belum_bayar: 0,
  };

  const pemberitahuanInfo = dashboard?.pemberitahuan || {
    total: 0,
    belum_dibaca: 0,
    penting: 0,
    terbaru: [],
    belum_dibaca_terbaru: [],
  };

  const hasTagihanBelumBayar = pembayaranInfo.belum_bayar > 0;
  const hasPendingPayment = pembayaranInfo.pending > 0;
  const hasPemberitahuanBelumDibaca = pemberitahuanInfo.belum_dibaca > 0;

  const quickStats = useMemo(
    () => [
      {
        title: "Jenjang",
        value: santri?.jenjang || "-",
        icon: <FaBookOpen />,
        color: "from-emerald-400 to-green-700",
      },
      {
        title: santri?.jenjang === "Takhassus" ? "Marhalah" : "Kelas",
        value: santri?.kelas || "-",
        icon: <FaMosque />,
        color: "from-yellow-300 to-amber-600",
      },
      {
        title: "Status",
        value: santri?.status || "Aktif",
        icon: <FaCheckCircle />,
        color: "from-green-400 to-emerald-700",
      },
      {
        title: "Semester",
        value: "Genap",
        icon: <FaClock />,
        color: "from-blue-400 to-cyan-700",
      },
    ],
    [santri]
  );

  const menus = [
    {
      title: "Pembayaran",
      desc: "Cek tagihan, riwayat pembayaran, dan upload bukti transfer dengan cepat.",
      icon: <FaMoneyBillWave />,
      href: "/santri/pembayaran",
      tag: hasTagihanBelumBayar
        ? `${pembayaranInfo.belum_bayar} Tagihan`
        : hasPendingPayment
        ? `${pembayaranInfo.pending} Pending`
        : "Aman",
      color: "from-emerald-400 via-green-500 to-emerald-800",
    },
    {
      title: "Pemberitahuan",
      desc: "Baca pengumuman, informasi penting, dan pesan terbaru dari admin pesantren.",
      icon: <FaBell />,
      href: "/santri/pemberitahuan",
      tag: hasPemberitahuanBelumDibaca
        ? `${pemberitahuanInfo.belum_dibaca} Baru`
        : "Sudah Dibaca",
      color: "from-yellow-300 via-amber-500 to-orange-700",
    },
    {
      title: "Nilai",
      desc: "Pantau nilai dan perkembangan akademik santri secara ringkas dan jelas.",
      icon: <FaGraduationCap />,
      href: "/santri/nilai",
      tag: "Akademik",
      color: "from-sky-400 via-cyan-500 to-blue-800",
    },
    {
      title: "Dokumen",
      desc: "Akses dokumen penting, berkas administrasi, dan persyaratan pondok.",
      icon: <FaFileAlt />,
      href: "/santri/dokumen",
      tag: "Berkas",
      color: "from-purple-400 via-violet-500 to-indigo-800",
    },
  ];

  if (checking) {
    return <AuthLoading role="Santri" />;
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition duration-300 ${theme.page} ${
        isCompact ? "text-sm" : "text-base"
      }`}
    >
      <SidebarSantri
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <motion.main
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: EASE }}
        className={`min-h-screen transition-all duration-300 pt-16 md:pt-0 ${
  collapsed ? "md:ml-[86px]" : "md:ml-[260px]"
}`}
      >
        <section className="relative min-h-screen overflow-hidden">
          <div className={`absolute inset-0 ${theme.mainBg}`} />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.045]" />
          <div className="absolute left-[14%] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute bottom-[-10rem] right-[8%] h-[30rem] w-[30rem] rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10">
            <HeaderBar
              theme={theme}
              today={today}
              setOpen={setOpen}
              pembayaranInfo={pembayaranInfo}
            />

            <div
  className={`mx-auto w-full max-w-[1420px] ${
    isCompact
      ? "px-3 py-3 sm:px-4 lg:px-5"
      : "px-3 py-4 sm:px-5 lg:px-6 xl:px-7"
  }`}
>
              <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-w-0 space-y-4">
                  <HeroPanel
                    santri={santri}
                    loading={loading}
                    theme={theme}
                    isDark={isDark}
                    isCompact={isCompact}
                    quickStats={quickStats}
                    hasTagihanBelumBayar={hasTagihanBelumBayar}
                    hasPendingPayment={hasPendingPayment}
                    pembayaranInfo={pembayaranInfo}
                    hasPemberitahuanBelumDibaca={
                      hasPemberitahuanBelumDibaca
                    }
                    pemberitahuanInfo={pemberitahuanInfo}
                  />

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <AgendaPanel
                      theme={theme}
                      pembayaranInfo={pembayaranInfo}
                      hasTagihanBelumBayar={hasTagihanBelumBayar}
                      hasPendingPayment={hasPendingPayment}
                      pemberitahuanInfo={pemberitahuanInfo}
                      hasPemberitahuanBelumDibaca={
                        hasPemberitahuanBelumDibaca
                      }
                    />

                    <MotivationPanel />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {menus.map((item, index) => (
                      <ActionCard
                        key={item.title}
                        item={item}
                        index={index}
                        theme={theme}
                        isCompact={isCompact}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-1">
                  <ProfilePanel
                    santri={santri}
                    loading={loading}
                    theme={theme}
                    isDark={isDark}
                    isCompact={isCompact}
                  />

                  <PaymentSummary
                    theme={theme}
                    pembayaranInfo={pembayaranInfo}
                  />

                  <NoticeSummary
                    theme={theme}
                    pemberitahuanInfo={pemberitahuanInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function HeaderBar({ theme, today, setOpen, pembayaranInfo }) {
  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${theme.header}`}
    >
      <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
          >
            <FaHome />
          </button>

          <div className="min-w-0">
            <h1 className={`truncate text-xl font-black ${theme.title}`}>
              Dashboard Santri
            </h1>
            <p className={`truncate text-xs font-semibold ${theme.muted}`}>
              {today || "Memuat tanggal..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/santri/pembayaran"
            className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20 sm:flex"
          >
            <FaMoneyBillWave className="text-yellow-300" />
            {pembayaranInfo?.belum_bayar > 0
              ? `${pembayaranInfo.belum_bayar} Tagihan`
              : "Pembayaran"}
          </Link>

          <Link
            href="/santri/profil"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            <FaUserCircle />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroPanel({
  santri,
  loading,
  theme,
  isDark,
  isCompact,
  quickStats,
  hasTagihanBelumBayar,
  hasPendingPayment,
  pembayaranInfo,
  hasPemberitahuanBelumDibaca,
  pemberitahuanInfo,
}) {
  return (
    <section
      className={`relative overflow-hidden border shadow-2xl backdrop-blur-2xl ${
        isCompact
          ? "rounded-[22px] p-3 sm:p-4"
          : "rounded-[24px] p-3 sm:p-4 lg:p-5"
      } ${theme.surfaceStrong}`}
    >
      <div className={`absolute inset-0 ${theme.heroOverlay}`} />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]">
        <div className="min-w-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, ease: EASE }}
            className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-xl ${
              isDark
                ? "border-yellow-300/20 bg-yellow-300/10"
                : "border-emerald-700/15 bg-emerald-50"
            }`}
          >
            <FaSun
              className={`shrink-0 ${
                isDark ? "text-yellow-300" : "text-emerald-700"
              }`}
            />
            <span
              className={`truncate text-[9px] font-black uppercase tracking-[0.2em] sm:text-[10px] ${
                isDark ? "text-yellow-100" : "text-emerald-800"
              }`}
            >
              Santri Learning Center
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.65, ease: EASE }}
            className={`mt-3 max-w-full break-words font-black leading-[0.94] tracking-[-0.055em] ${
              isCompact
                ? "text-[clamp(1.75rem,4vw,3.2rem)]"
                : "text-[clamp(1.9rem,4.25vw,3.6rem)]"
            }`}
          >
            Assalamu’alaikum,
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
              {loading ? "Memuat..." : santri?.nama || "Santri"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease: EASE }}
            className={`mt-3 max-w-2xl leading-relaxed ${theme.heroText} ${
              isCompact ? "text-xs" : "text-xs sm:text-sm"
            }`}
          >
            Pantau pembayaran, pemberitahuan, dokumen, nilai, dan profil santri
            dalam satu dashboard yang lebih nyaman, cepat, dan informatif.
          </motion.p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/santri/pembayaran"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 text-xs font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-sm"
            >
              Lihat Pembayaran
              <FaArrowRight />
            </Link>

            <Link
              href="/santri/pemberitahuan"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 text-xs font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20 sm:text-sm"
            >
              Pemberitahuan
              <FaBell />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {quickStats.map((item, index) => (
              <MetricCard
                key={item.title}
                item={item}
                index={index}
                theme={theme}
                loading={loading}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <StatusGlass
            icon={<FaMoneyBillWave />}
            title="Status Pembayaran"
            value={
              hasTagihanBelumBayar
                ? `${pembayaranInfo.belum_bayar} tagihan belum dibayar`
                : hasPendingPayment
                ? `${pembayaranInfo.pending} menunggu verifikasi`
                : "Tidak ada tagihan aktif"
            }
            status={
              hasTagihanBelumBayar
                ? "danger"
                : hasPendingPayment
                ? "warning"
                : "success"
            }
            href="/santri/pembayaran"
          />

          <StatusGlass
            icon={<FaBell />}
            title="Pemberitahuan"
            value={
              hasPemberitahuanBelumDibaca
                ? `${pemberitahuanInfo.belum_dibaca} belum dibaca`
                : "Semua sudah dibaca"
            }
            status={hasPemberitahuanBelumDibaca ? "warning" : "success"}
            href="/santri/pemberitahuan"
          />

          <StatusGlass
            icon={<FaShieldAlt />}
            title="Akun Santri"
            value="Akses dashboard aktif"
            status="success"
            href="/santri/profil"
          />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ item, index, theme, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42 + index * 0.06, ease: EASE }}
      className={`min-w-0 rounded-2xl border p-2.5 backdrop-blur-xl transition hover:-translate-y-1 sm:p-3 ${theme.surface}`}
    >
      <div
        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-sm text-white shadow-lg sm:h-10 sm:w-10 sm:text-base`}
      >
        {item.icon}
      </div>

      <p className={`text-[10px] font-semibold sm:text-[11px] ${theme.muted}`}>
        {item.title}
      </p>

      <h3
        className={`mt-0.5 truncate text-base font-black sm:text-lg ${theme.title}`}
      >
        {loading ? "..." : item.value}
      </h3>
    </motion.div>
  );
}

function StatusGlass({ icon, title, value, status, href }) {
  const style = {
    success: "bg-emerald-400 text-emerald-950",
    warning: "bg-yellow-400 text-emerald-950",
    danger: "bg-red-500 text-white",
  };

  return (
    <Link
      href={href}
      className="group min-h-[104px] rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${
            style[status] || style.success
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-yellow-300 sm:text-[10px]">
            {title}
          </p>
          <h3 className="mt-1 text-sm font-bold leading-snug text-white">
            {value}
          </h3>
        </div>

        <FaArrowRight className="mt-1 shrink-0 text-sm text-yellow-300 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ProfilePanel({ santri, loading, theme, isCompact }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 26, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.18, duration: 0.6, ease: EASE }}
      className={`relative overflow-hidden border shadow-2xl backdrop-blur-2xl ${
        isCompact ? "rounded-[26px] p-4" : "rounded-[32px] p-4 sm:p-5"
      } ${theme.surfaceStrong}`}
    >
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${theme.muted}`}>
              Profil Santri
            </p>
            <h2 className={`mt-1 truncate text-2xl font-black ${theme.title}`}>
              {loading ? "Memuat..." : santri?.nama || "-"}
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg">
            <FaHandSparkles />
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-300/30 blur-3xl" />

            <motion.img
              initial={{ scale: 0.84, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.55, type: "spring" }}
              whileHover={{ scale: 1.04, rotate: 1 }}
              src={santri?.foto || "/default-user.png"}
              alt="Foto Santri"
              onError={(e) => {
                e.currentTarget.src = "/default-user.png";
              }}
              className="relative h-36 w-36 rounded-[2rem] border-4 border-white object-cover shadow-2xl sm:h-44 sm:w-44"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniProfileData
            label="Jenjang"
            value={santri?.jenjang || "-"}
            icon={<FaBookOpen />}
            theme={theme}
          />
          <MiniProfileData
            label={santri?.jenjang === "Takhassus" ? "Marhalah" : "Kelas"}
            value={santri?.kelas || "-"}
            icon={<FaMosque />}
            theme={theme}
          />
          <MiniProfileData
            label="Status"
            value="Aktif"
            icon={<FaCheckCircle />}
            theme={theme}
          />
          <MiniProfileData
            label="Semester"
            value="Genap"
            icon={<FaMoon />}
            theme={theme}
          />
        </div>

        <Link
          href="/santri/profil"
          className="mt-5 flex min-h-[48px] items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-yellow-300"
        >
          Lihat Profil
          <FaArrowRight />
        </Link>
      </div>
    </motion.aside>
  );
}

function MiniProfileData({ label, value, icon, theme }) {
  return (
    <div className={`min-w-0 rounded-2xl border p-3 backdrop-blur-xl ${theme.surface}`}>
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-emerald-950">
        {icon}
      </div>

      <p className={`text-[11px] font-semibold sm:text-xs ${theme.muted}`}>
        {label}
      </p>
      <h3 className={`mt-1 truncate text-lg font-black ${theme.title}`}>
        {value}
      </h3>
    </div>
  );
}

function AgendaPanel({
  theme,
  pembayaranInfo,
  hasTagihanBelumBayar,
  hasPendingPayment,
  pemberitahuanInfo,
  hasPemberitahuanBelumDibaca,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.34, ease: EASE }}
      className={`rounded-[30px] border p-4 sm:p-5 shadow-xl backdrop-blur-xl ${theme.surfaceStrong}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-emerald-950">
            <FaClipboardList />
            Agenda Santri
          </div>

          <h2 className={`mt-3 text-2xl font-black ${theme.title}`}>
            Yang perlu dicek
          </h2>
        </div>

        <FaCalendarAlt className="text-2xl text-yellow-400" />
      </div>

      <div className="mt-5 space-y-3">
        <ChecklistItem
          text={
            hasTagihanBelumBayar
              ? `Ada ${pembayaranInfo.belum_bayar} tagihan belum dibayar`
              : hasPendingPayment
              ? `Ada ${pembayaranInfo.pending} pembayaran menunggu verifikasi`
              : "Tidak ada tagihan yang belum dibayar"
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
              ? "Bayar"
              : hasPendingPayment
              ? "Pending"
              : "Aman"
          }
        />

        <ChecklistItem
          text={
            hasPemberitahuanBelumDibaca
              ? `Ada ${pemberitahuanInfo.belum_dibaca} pemberitahuan belum dibaca`
              : "Semua pemberitahuan sudah dibaca"
          }
          href="/santri/pemberitahuan"
          status={hasPemberitahuanBelumDibaca ? "warning" : "success"}
          badge={hasPemberitahuanBelumDibaca ? "Baca" : "Aman"}
        />

        <ChecklistItem
          text="Pastikan data profil santri sudah benar"
          href="/santri/profil"
          status="success"
          badge="Profil"
        />
      </div>
    </motion.section>
  );
}

function MotivationPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42, ease: EASE }}
      className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#B7791F] p-4 sm:p-5 text-white shadow-2xl shadow-green-950/15"
    >
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

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
          Tetap semangat belajar, menjaga adab, dan istiqamah dalam ibadah.
        </p>
      </div>
    </motion.section>
  );
}

function ActionCard({ item, index, theme, isCompact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46 + index * 0.07, ease: EASE }}
    >
      <Link href={item.href} className="group block h-full">
        <div
          className={`relative h-full overflow-hidden border shadow-xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
            isCompact ? "rounded-[22px] p-4" : "rounded-[26px] p-4 sm:p-5"
          } ${theme.surface}`}
        >
          <div
            className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${item.color} opacity-25 blur-3xl transition group-hover:scale-125`}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-xl transition group-hover:rotate-3 group-hover:scale-110`}
              >
                {item.icon}
              </div>

              <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-950">
                {item.tag}
              </span>
            </div>

            <h2 className={`mt-5 text-xl font-black ${theme.title}`}>
              {item.title}
            </h2>

            <p className={`mt-2 text-sm leading-relaxed ${theme.desc}`}>
              {item.desc}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-yellow-400">
              Masuk Menu
              <FaArrowRight className="transition group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PaymentSummary({ theme, pembayaranInfo }) {
  const rows = [
    ["Lunas", pembayaranInfo.lunas || 0, "text-emerald-400"],
    ["Pending", pembayaranInfo.pending || 0, "text-yellow-400"],
    ["Belum Bayar", pembayaranInfo.belum_bayar || 0, "text-red-400"],
  ];

  return (
    <section className={`rounded-[30px] border p-4 sm:p-5 shadow-xl ${theme.surface}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${theme.muted}`}>
            Ringkasan Keuangan
          </p>
          <h2 className={`mt-1 text-2xl font-black ${theme.title}`}>
            Pembayaran
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
          <FaMoneyBillWave />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(([label, value, color]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
          >
            <span className={`text-sm font-semibold ${theme.desc}`}>
              {label}
            </span>
            <span className={`text-lg font-black ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      <Link
        href="/santri/pembayaran"
        className="mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-yellow-400 text-sm font-black text-emerald-950 transition hover:bg-yellow-300"
      >
        Detail Pembayaran
        <FaArrowRight />
      </Link>
    </section>
  );
}

function NoticeSummary({ theme, pemberitahuanInfo }) {
  return (
    <section className={`rounded-[30px] border p-4 sm:p-5 shadow-xl ${theme.surface}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${theme.muted}`}>
            Informasi Pesantren
          </p>
          <h2 className={`mt-1 text-2xl font-black ${theme.title}`}>
            Pemberitahuan
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
          <FaBell />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className={`text-xs font-semibold ${theme.muted}`}>Total</p>
          <h3 className={`mt-1 text-2xl font-black ${theme.title}`}>
            {pemberitahuanInfo.total || 0}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className={`text-xs font-semibold ${theme.muted}`}>
            Belum Dibaca
          </p>
          <h3 className="mt-1 text-2xl font-black text-yellow-400">
            {pemberitahuanInfo.belum_dibaca || 0}
          </h3>
        </div>
      </div>

      <Link
        href="/santri/pemberitahuan"
        className="mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-yellow-400 text-sm font-black text-emerald-950 transition hover:bg-yellow-300"
      >
        Buka Pemberitahuan
        <FaArrowRight />
      </Link>
    </section>
  );
}

function ChecklistItem({ text, href = "#", status = "success", badge = "" }) {
  const config = {
    success: {
      icon: <FaCheckCircle />,
      wrapper: "border-emerald-200 bg-emerald-50",
      iconBox: "bg-emerald-600 text-white",
      text: "text-emerald-800",
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
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between ${item.wrapper}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBox}`}
        >
          {item.icon}
        </div>

        <p className={`font-semibold ${item.text}`}>{text}</p>
      </div>

      {badge && (
        <span
          className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${item.badge}`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}