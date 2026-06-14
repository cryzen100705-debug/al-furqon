"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import SidebarOwner from "./sidebar";

import {
  FaCrown,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaBell,
  FaSyncAlt,
  FaWallet,
  FaUserGraduate,
  FaInfoCircle,
  FaChartPie,
  FaTimesCircle,
  FaChartLine,
  FaMosque,
  FaShieldAlt,
  FaReceipt,
  FaArrowUp,
  FaEye,
  FaFileInvoiceDollar,
  FaHistory,
  FaStar,
} from "react-icons/fa";

import { API_URL, formatRupiah, formatTanggal, isServerError } from "../../helpers/ownerHelpers";

export default function OwnerDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    checkOwnerAccess();
    fetchDashboard();
  }, []);

  const checkOwnerAccess = () => {
    const session = localStorage.getItem("session");
    const userOnly = localStorage.getItem("user");

    const userData = session
      ? JSON.parse(session)?.user
      : userOnly
      ? JSON.parse(userOnly)
      : null;

    if (!userData) {
      router.push("/login");
      return;
    }

    if (userData.role !== "owner") {
      router.push("/login");
    }
  };

  const showMaintenancePopup = (message) => {
    setServerMaintenance(true);
    setServerMessage(message);
  };

  const fetchJson = async (url) => {
    if (!API_URL) {
      showMaintenancePopup(
        "NEXT_PUBLIC_API_URL belum diatur di file .env.local frontend."
      );

      throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Backend tidak mengembalikan JSON.");
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Terjadi kesalahan backend.");
    }

    return result;
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const result = await fetchJson(`${API_URL}/api/owner/dashboard`);

      setDashboard(result.data);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("OWNER DASHBOARD ERROR:", error.message);
      setDashboard(null);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Dashboard owner belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const santri = dashboard?.santri || {};
    const pembayaran = dashboard?.pembayaran || {};
    const pemberitahuan = dashboard?.pemberitahuan || {};

    const totalSantri = Number(santri.total || 0);
    const santriAktif = Number(santri.aktif || 0);
    const totalTransaksi = Number(pembayaran.total || 0);
    const transaksiLunas = Number(pembayaran.lunas || 0);
    const transaksiPending = Number(pembayaran.pending || 0);
    const pemberitahuanAktif = Number(pemberitahuan.aktif || 0);

    const rasioSantriAktif = totalSantri
      ? Math.round((santriAktif / totalSantri) * 100)
      : 0;

    const rasioLunas = totalTransaksi
      ? Math.round((transaksiLunas / totalTransaksi) * 100)
      : 0;

    const rasioPending = totalTransaksi
      ? Math.round((transaksiPending / totalTransaksi) * 100)
      : 0;

    const healthScore = Math.min(
      100,
      Math.round((rasioSantriAktif + rasioLunas + (100 - rasioPending)) / 3)
    );

    return {
      totalSantri,
      santriAktif,
      totalTransaksi,
      transaksiLunas,
      transaksiPending,
      pemberitahuanAktif,
      rasioSantriAktif,
      rasioLunas,
      rasioPending,
      healthScore,
    };
  }, [dashboard]);

  const executiveInsight = useMemo(() => {
    if (!dashboard) return "Data belum dimuat.";

    if (dashboard?.pembayaran?.pending > 0) {
      return `${dashboard.pembayaran.pending} pembayaran masih menunggu perhatian admin dengan nilai ${formatRupiah(
        dashboard.pembayaran.nominalPending
      )}.`;
    }

    if (dashboard?.santri?.pending > 0) {
      return `${dashboard.santri.pending} pendaftaran santri masih menunggu verifikasi.`;
    }

    if (dashboard?.pembayaran?.lunas > 0) {
      return "Kondisi sistem terlihat baik. Pembayaran lunas sudah tercatat dan data santri dapat dipantau.";
    }

    return "Belum banyak aktivitas pada periode ini. Owner dapat memantau perkembangan dari menu laporan.";
  }, [dashboard]);

  const { checking } = useAuthGuard(["owner"]);

if (checking) {
  return <AuthLoading role="Owner" />;
}

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EFE8D8] text-slate-700">
      <SidebarOwner
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`
          min-h-screen transition-all duration-300
          pt-16 md:pt-0
          ${collapsed ? "md:ml-[92px]" : "md:ml-[270px]"}
        `}
      >
        {/* HERO EXECUTIVE */}
        <section className="relative overflow-hidden bg-[#120B03] px-4 py-8 text-white sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_35%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#120B03] via-[#4A3410] to-[#064E3B]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EFE8D8] to-transparent" />

          <div className="absolute -right-16 top-12 hidden h-72 w-72 rounded-full border border-yellow-300/20 xl:block" />
          <div className="absolute -right-5 top-24 hidden h-40 w-40 rounded-full border border-white/10 xl:block" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.08fr_0.92fr] 2xl:items-stretch">
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaCrown className="shrink-0 text-yellow-300" />
                    <span className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-yellow-100 sm:text-xs">
                      Executive Control Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.3rem,6vw,5.4rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Dashboard
                    <span className="block text-yellow-300">Owner.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base lg:text-[17px]">
                    Pantau performa pesantren secara menyeluruh melalui
                    keuangan, santri, pembayaran, pemberitahuan, dan laporan
                    eksekutif dalam satu tampilan.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={fetchDashboard}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                    >
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                      Refresh Data
                    </button>

                    <Link
                      href="/owner/laporan"
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
                    >
                      <FaFileInvoiceDollar />
                      Lihat Laporan
                    </Link>
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <HeroMini
                      icon={<FaUsers />}
                      title="Santri Aktif"
                      value={`${dashboard?.santri?.aktif || 0}`}
                    />
                    <HeroMini
                      icon={<FaCheckCircle />}
                      title="Transaksi Lunas"
                      value={`${dashboard?.pembayaran?.lunas || 0}`}
                    />
                    <HeroMini
                      icon={<FaBell />}
                      title="Info Aktif"
                      value={`${dashboard?.pemberitahuan?.aktif || 0}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-1">
                <ExecutiveMoneyCard
                  title="Total Pemasukan"
                  value={formatRupiah(dashboard?.pembayaran?.totalPemasukan || 0)}
                  subtitle="Akumulasi pembayaran lunas"
                  secondTitle="Pemasukan Bulan Ini"
                  secondValue={formatRupiah(
                    dashboard?.pembayaran?.pemasukanBulanIni || 0
                  )}
                />

                <HealthScoreCard
                  score={stats.healthScore}
                  insight={executiveInsight}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="w-full bg-gradient-to-b from-[#EFE8D8] via-[#F6F1E7] to-[#E7DCC5]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            {loading ? (
              <LoadingState />
            ) : !dashboard ? (
              <EmptyState />
            ) : (
              <>
                {/* KPI */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    title="Santri Aktif"
                    value={dashboard.santri.aktif}
                    desc={`${dashboard.santri.total} total santri`}
                    icon={<FaUsers />}
                    accent="emerald"
                    progress={stats.rasioSantriAktif}
                  />

                  <MetricCard
                    title="Pemasukan Bulan Ini"
                    value={formatRupiah(dashboard.pembayaran.pemasukanBulanIni)}
                    desc="Pembayaran lunas bulan ini"
                    icon={<FaWallet />}
                    accent="yellow"
                    progress={stats.rasioLunas}
                  />

                  <MetricCard
                    title="Pembayaran Pending"
                    value={dashboard.pembayaran.pending}
                    desc={formatRupiah(dashboard.pembayaran.nominalPending)}
                    icon={<FaClock />}
                    accent="orange"
                    progress={stats.rasioPending}
                  />

                  <MetricCard
                    title="Pendaftaran Pending"
                    value={dashboard.santri.pending}
                    desc="Menunggu verifikasi admin"
                    icon={<FaUserGraduate />}
                    accent="blue"
                    progress={dashboard.santri.total ? Math.round((dashboard.santri.pending / dashboard.santri.total) * 100) : 0}
                  />
                </section>

                {/* EXECUTIVE INSIGHTS */}
                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <InsightPanel
                    dashboard={dashboard}
                    stats={stats}
                    executiveInsight={executiveInsight}
                  />

                  <QuickNavigation />
                </section>

                {/* MONITORING GRID */}
                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <CompositionPanel dashboard={dashboard} />

                  <RecentPayments payments={dashboard.pembayaran.terbaru} />
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <RecentAnnouncements items={dashboard.pemberitahuan.terbaru} />

                  <ExecutiveSummary dashboard={dashboard} />
                </section>
              </>
            )}
          </div>
        </div>

        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");
              fetchDashboard();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroMini({ icon, title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-yellow-50/70">{title}</p>
          <p className="mt-1 truncate text-xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ExecutiveMoneyCard({
  title,
  value,
  subtitle,
  secondTitle,
  secondValue,
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-yellow-300/20 via-white/10 to-emerald-400/10 p-6 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-yellow-100">{title}</p>
            <h2 className="mt-2 break-words text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-yellow-300">
              {value}
            </h2>
            <p className="mt-2 text-sm text-yellow-50/70">{subtitle}</p>
          </div>

          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-green-950 sm:flex">
            <FaWallet />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-black/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-yellow-100/80">
                {secondTitle}
              </p>

              <p className="mt-1 break-words text-xl font-black text-white">
                {secondValue}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
              <FaArrowUp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthScoreCard({ score, insight }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-[140px_1fr] sm:items-center lg:grid-cols-1 xl:grid-cols-[140px_1fr]">
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#facc15 ${score * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#0B2A1F] shadow-inner">
            <span className="text-4xl font-black text-yellow-300">
              {score}
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-yellow-100/70">
              Score
            </span>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
            <FaShieldAlt />
            Health Monitoring
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            Kondisi Sistem
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-emerald-50/80">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, desc, icon, accent, progress }) {
  const accentMap = {
    emerald: {
      icon: "bg-emerald-500 text-white",
      bar: "bg-emerald-500",
      soft: "from-[#FFFFFF] via-[#F6F1E7] to-[#DFF3E8]",
      border: "border-emerald-200",
      glow: "shadow-emerald-950/10",
      orb: "bg-emerald-400/20",
    },
    yellow: {
      icon: "bg-yellow-400 text-green-950",
      bar: "bg-yellow-500",
      soft: "from-[#FFFFFF] via-[#FFF7D6] to-[#F5E3A3]",
      border: "border-yellow-200",
      glow: "shadow-yellow-950/10",
      orb: "bg-yellow-400/25",
    },
    orange: {
      icon: "bg-orange-500 text-white",
      bar: "bg-orange-500",
      soft: "from-[#FFFFFF] via-[#FFF1DE] to-[#F6D2A6]",
      border: "border-orange-200",
      glow: "shadow-orange-950/10",
      orb: "bg-orange-400/20",
    },
    blue: {
      icon: "bg-blue-500 text-white",
      bar: "bg-blue-500",
      soft: "from-[#FFFFFF] via-[#EAF2FF] to-[#CFE2FF]",
      border: "border-blue-200",
      glow: "shadow-blue-950/10",
      orb: "bg-blue-400/20",
    },
  };

  const color = accentMap[accent] || accentMap.emerald;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-[32px] border ${color.border}
        bg-gradient-to-br ${color.soft}
        p-5 shadow-xl ${color.glow}
        transition duration-300 hover:-translate-y-1 hover:shadow-2xl
      `}
    >
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${color.orb} blur-2xl transition group-hover:scale-125`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-500">{title}</p>

            <h2 className="mt-2 break-words text-[clamp(1.55rem,3vw,2.1rem)] font-black leading-tight text-slate-950">
              {value}
            </h2>

            <p className="mt-1 text-xs font-bold text-slate-500">{desc}</p>
          </div>

          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-xl shadow-lg transition group-hover:rotate-6 group-hover:scale-110 ${color.icon}`}
          >
            {icon}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-black text-slate-500">
            <span>Progress</span>
            <span>{progress || 0}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/70 shadow-inner">
            <div
              className={`h-full rounded-full ${color.bar} transition-all duration-700`}
              style={{ width: `${Math.min(100, progress || 0)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightPanel({ dashboard, stats, executiveInsight }) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10 sm:p-6">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
              <FaStar />
              Executive Insight
            </div>

            <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
              Ringkasan Keputusan
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {executiveInsight}
            </p>
          </div>

          <Link
            href="/owner/aktivitas"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
          >
            <FaHistory />
            Aktivitas Admin
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InsightMini
            label="Rasio Santri Aktif"
            value={`${stats.rasioSantriAktif}%`}
            icon={<FaUsers />}
          />
          <InsightMini
            label="Rasio Pembayaran Lunas"
            value={`${stats.rasioLunas}%`}
            icon={<FaCheckCircle />}
          />
          <InsightMini
            label="Pembayaran Pending"
            value={`${stats.rasioPending}%`}
            icon={<FaClock />}
          />
        </div>
      </div>
    </div>
  );
}

function InsightMini({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-yellow-100 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md">
        {icon}
      </div>

      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#1F1607]">{value}</p>
    </div>
  );
}

function QuickNavigation() {
  const items = [
    {
      title: "Keuangan",
      desc: "Pantau pemasukan dan transaksi",
      href: "/owner/keuangan",
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Santri",
      desc: "Lihat perkembangan santri",
      href: "/owner/santri",
      icon: <FaUsers />,
    },
    {
      title: "Laporan",
      desc: "Cetak dan simpan PDF",
      href: "/owner/laporan",
      icon: <FaFileInvoiceDollar />,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#0B2A1F] via-[#064E3B] to-[#4A3410] p-5 text-white shadow-xl shadow-green-950/15 sm:p-6">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-200">
          <FaMosque />
          Navigasi Owner
        </div>

        <h2 className="mt-3 text-2xl font-black text-white">
          Akses Cepat
        </h2>

        <p className="mt-1 text-sm text-emerald-50/75">
          Menu pemantauan utama untuk owner.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-yellow-300/15"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-lg transition group-hover:scale-110">
                  {item.icon}
                </div>

                <div>
                  <p className="font-black text-white">{item.title}</p>
                  <p className="text-sm text-emerald-50/70">{item.desc}</p>
                </div>
              </div>

              <FaEye className="text-yellow-200/60 transition group-hover:text-yellow-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompositionPanel({ dashboard }) {
  const santri = dashboard?.santri || {};
  const total = Number(santri.total || 0);

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-white via-[#FFF8E1] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10 sm:p-6">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
              <FaChartPie />
              Komposisi Santri
            </div>

            <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
              Sebaran Jenjang
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-lg">
            <FaUsers />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <ProgressRow label="SMP" value={santri.smp || 0} total={total} />
          <ProgressRow label="SMK" value={santri.smk || 0} total={total} />
          <ProgressRow
            label="Takhassus"
            value={santri.takhassus || 0}
            total={total}
          />
          <ProgressRow label="Putra" value={santri.putra || 0} total={total} />
          <ProgressRow label="Putri" value={santri.putri || 0} total={total} />
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, total }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-black text-slate-600">{label}</span>
        <span className="font-black text-[#1F1607]">
          {value} / {total || 0}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#EFE3C6]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-yellow-400 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RecentPayments({ payments = [] }) {
  return (
    <div className="rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF4D1] p-5 shadow-xl shadow-yellow-950/10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
            <FaReceipt />
            Pembayaran
          </div>

          <h2 className="mt-3 text-2xl font-black text-slate-900">
            Transaksi Terbaru
          </h2>
        </div>

        <Link
          href="/owner/keuangan"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-yellow-100 hover:text-yellow-700"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {payments.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            Belum ada transaksi pembayaran.
          </p>
        ) : (
          payments.slice(0, 6).map((item) => (
            <TimelineItem
              key={item.id}
              title={item.santri?.nama || "Santri"}
              desc={`${item.jenis || "Pembayaran"} • ${formatTanggal(
                item.tanggal_bayar || item.created_at
              )}`}
              value={formatRupiah(item.nominal)}
              status={item.status}
              icon={<FaMoneyBillWave />}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RecentAnnouncements({ items = [] }) {
  return (
    <div className="rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-white via-[#F7FBF8] to-[#E8F5E9] p-5 shadow-xl shadow-emerald-950/10 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
            <FaBell />
            Pemberitahuan
          </div>

          <h2 className="mt-3 text-2xl font-black text-slate-900">
            Informasi Terbaru
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            Belum ada pemberitahuan.
          </p>
        ) : (
          items.slice(0, 5).map((item) => (
            <TimelineItem
              key={item.id}
              title={item.judul || "Pemberitahuan"}
              desc={`${item.status || "-"} • ${formatTanggal(item.created_at)}`}
              value={item.prioritas || "normal"}
              status={item.prioritas}
              icon={<FaBell />}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TimelineItem({ title, desc, value, status, icon }) {
  const statusColor =
    status === "lunas" || status === "aktif" || status === "normal"
      ? "text-emerald-700 bg-emerald-100"
      : status === "pending" || status === "sedang"
      ? "text-yellow-700 bg-yellow-100"
      : status === "ditolak" || status === "penting"
      ? "text-red-700 bg-red-100"
      : "text-slate-700 bg-slate-100";

  return (
    <div className="group flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-yellow-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4A3410] text-yellow-300 shadow-md">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-black text-[#1F1607]">
            {title}
          </p>
          <p className="mt-1 break-words text-xs font-semibold text-slate-500">
            {desc}
          </p>
        </div>
      </div>

      <span
        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-black ${statusColor}`}
      >
        {value}
      </span>
    </div>
  );
}

function ExecutiveSummary({ dashboard }) {
  const pembayaran = dashboard?.pembayaran || {};
  const pemberitahuan = dashboard?.pemberitahuan || {};
  const santri = dashboard?.santri || {};

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-yellow-300/20 bg-gradient-to-br from-[#120B03] via-[#4A3410] to-[#064E3B] p-5 text-white shadow-xl shadow-green-950/20 sm:p-6">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-300">
          <FaMosque />
          Amanah Monitoring
        </div>

        <h2 className="mt-4 text-2xl font-black">Kesimpulan Owner</h2>

        <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">
          Dashboard ini berfungsi sebagai pusat pemantauan owner, bukan sebagai
          halaman operasional. Owner dapat melihat kondisi pesantren, pemasukan,
          pembayaran, santri, dan informasi terbaru tanpa mengubah data utama.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <SummaryRow label="Total Santri" value={santri.total || 0} />
          <SummaryRow label="Santri Aktif" value={santri.aktif || 0} />
          <SummaryRow label="Pembayaran Lunas" value={pembayaran.lunas || 0} />
          <SummaryRow label="Pembayaran Pending" value={pembayaran.pending || 0} />
          <SummaryRow
            label="Pemberitahuan Aktif"
            value={pemberitahuan.aktif || 0}
          />
        </div>

        <Link
          href="/owner/laporan"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 text-sm font-black text-green-950 shadow-lg transition hover:bg-yellow-300"
        >
          <FaFileInvoiceDollar />
          Buka Laporan Owner
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
      <span className="text-sm font-semibold text-emerald-50/75">{label}</span>
      <span className="text-sm font-black text-yellow-300">{value}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-40 animate-pulse rounded-[30px] bg-white"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[30px] bg-white px-4 py-20 text-center shadow-xl shadow-green-950/5">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-3xl text-slate-400">
        <FaInfoCircle />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-700">
        Dashboard Tidak Tersedia
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Data owner belum dapat ditampilkan.
      </p>
    </div>
  );
}

function ServerMaintenanceModal({ message, onRetry, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#14532D] text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-yellow-300/30 bg-yellow-400/15 shadow-xl">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-green-950">
              ⚙️
              <span className="absolute inset-0 rounded-full border-4 border-yellow-200/50 animate-ping" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-300">
              Server Maintenance
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Sistem sedang
              <span className="block text-yellow-300">dalam perawatan</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-green-50/90 sm:text-base">
              {message ||
                "Backend belum aktif. Data owner belum dapat dimuat untuk sementara waktu."}
            </p>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                ☪
              </div>

              <div>
                <h3 className="font-black text-white">
                  Cara mengaktifkan kembali
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-green-50/80">
                  Buka terminal backend, lalu jalankan:
                </p>

                <div className="mt-3 rounded-2xl bg-black/30 px-4 py-3 font-mono text-sm text-yellow-200">
                  cd backend
                  <br />
                  npm run dev
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Coba Lagi
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Tutup Popup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}