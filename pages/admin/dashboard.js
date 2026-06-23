"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "../admin/sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaUsers,
  FaMoneyBillWave,
  FaBell,
  FaArrowUp,
  FaArrowRight,
  FaCalendarAlt,
  FaClipboardList,
  FaMosque,
  FaClock,
  FaTimesCircle,
  FaBullhorn,
  FaSearch,
  FaUserCheck,
  FaUserClock,
  FaWallet,
  FaLayerGroup,
  FaSyncAlt,
  FaShieldAlt,
  FaExclamationCircle,
  FaQuran,
  FaSchool,
  FaCheckCircle,
  FaTasks,
  FaBolt,
  FaChartLine,
  FaFingerprint,
  FaInbox,
  FaEye,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminDashboard() {
  const router = useRouter();

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchMenu, setSearchMenu] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [dashboard, setDashboard] = useState({
    totalSantri: 0,
    santriAktif: 0,
    santriPending: 0,
    santriDitolak: 0,
    pendaftaranBaru: 0,
    totalTagihan: 0,
    pembayaranLunas: 0,
    pemasukan: 0,
    totalPemberitahuan: 0,
    adminUnreadNotifications: 0,
    latestAdminNotifications: [],
    latestSantri: [],
    latestPembayaran: [],
    latestPemberitahuan: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
      }

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        method: "GET",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);

        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan Express berjalan di http://localhost:5000"
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil dashboard admin");
      }

      setDashboard(result.data);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("DASHBOARD ERROR:", error.message);

      const message = String(error.message || "");

      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("Load failed") ||
        message.includes("fetch") ||
        message.includes("Backend tidak mengembalikan JSON") ||
        message.includes("NEXT_PUBLIC_API_URL")
      ) {
        setServerMaintenance(true);
        setServerMessage(
          "Server backend belum aktif atau sedang maintenance. Jalankan backend Express terlebih dahulu."
        );
        setErrorMessage("");
        return;
      }

      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const formatTanggal = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTanggalLengkap = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const lower = String(status || "").toLowerCase();

    if (lower === "aktif" || lower === "lunas" || lower === "diterima") {
      return "bg-emerald-400/15 text-emerald-700 border-emerald-300/50";
    }

    if (lower === "pending" || lower === "menunggu") {
      return "bg-yellow-400/20 text-yellow-700 border-yellow-300/60";
    }

    if (lower === "ditolak" || lower === "gagal") {
      return "bg-red-400/15 text-red-700 border-red-300/50";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const totalSantriValid = useMemo(() => {
  return Number(dashboard.santriAktif || 0) + Number(dashboard.santriPending || 0);
}, [dashboard.santriAktif, dashboard.santriPending]);

  const progressAktif = useMemo(() => {
  if (!totalSantriValid) return 0;
  return Math.round((Number(dashboard.santriAktif || 0) / totalSantriValid) * 100);
}, [dashboard.santriAktif, totalSantriValid]);

const progressPending = useMemo(() => {
  if (!totalSantriValid) return 0;
  return Math.round((Number(dashboard.santriPending || 0) / totalSantriValid) * 100);
}, [dashboard.santriPending, totalSantriValid]);

const progressDitolak = useMemo(() => {
  return 0;
}, []);

  const workScore = useMemo(() => {
    const pendingPenalty = Math.min(45, Number(dashboard.santriPending || 0) * 5);
    const notifPenalty = Math.min(
      25,
      Number(dashboard.adminUnreadNotifications || 0) * 2
    );

    return Math.max(10, 100 - pendingPenalty - notifPenalty);
  }, [dashboard]);

  const priorityTasks = [
    {
      title: "Verifikasi Santri",
      desc: "Periksa pendaftaran baru yang belum diterima.",
      value: dashboard.santriPending,
      icon: <FaUserClock />,
      href: "/admin/verifikasi",
      color: "from-yellow-300 via-orange-400 to-orange-600",
      accent: "text-yellow-300",
      button: "Proses Sekarang",
    },
    {
      title: "Cek Pembayaran",
      desc: "Pantau pembayaran masuk dan bukti transfer.",
      value: dashboard.totalTagihan,
      icon: <FaMoneyBillWave />,
      href: "/admin/pembayaran",
      color: "from-emerald-300 via-green-500 to-emerald-700",
      accent: "text-emerald-300",
      button: "Buka Pembayaran",
    },
    {
      title: "Notifikasi Admin",
      desc: "Lihat informasi santri baru dan pembayaran.",
      value: dashboard.adminUnreadNotifications,
      icon: <FaBell />,
      href: "/admin/pemberitahuan",
      color: "from-cyan-300 via-blue-500 to-blue-700",
      accent: "text-cyan-300",
      button: "Lihat Notifikasi",
    },
  ];

  const stats = [
    {
  title: "Total Santri",
  value: totalSantriValid,
  desc: "Santri aktif dan pending",
  icon: <FaUsers />,
  color: "emerald",
  note: `${dashboard.santriAktif} aktif • ${dashboard.santriPending} pending`,
},
    {
      title: "Butuh Verifikasi",
      value: dashboard.santriPending,
      desc: "Pendaftaran menunggu keputusan",
      icon: <FaUserClock />,
      color: "yellow",
      note: `${dashboard.pendaftaranBaru} baru / 7 hari`,
    },
    {
      title: "Pemasukan",
      value: formatRupiah(dashboard.pemasukan),
      desc: "Pembayaran lunas tercatat",
      icon: <FaWallet />,
      color: "green",
      note: `${dashboard.pembayaranLunas} transaksi lunas`,
    },
    {
      title: "Notifikasi",
      value: dashboard.adminUnreadNotifications,
      desc: "Belum dibaca admin",
      icon: <FaBell />,
      color: "blue",
      note: "Santri & pembayaran",
    },
  ];

  const quickStats = [
    {
      label: "Aktif",
      value: dashboard.santriAktif,
      icon: <FaUserCheck />,
      color: "from-emerald-400 to-green-600",
    },
    {
      label: "Pending",
      value: dashboard.santriPending,
      icon: <FaClock />,
      color: "from-yellow-300 to-orange-500",
    },
    {
      label: "Ditolak",
      value: dashboard.santriDitolak,
      icon: <FaTimesCircle />,
      color: "from-red-400 to-red-600",
    },
    {
      label: "Tagihan",
      value: dashboard.totalTagihan,
      icon: <FaMoneyBillWave />,
      color: "from-blue-400 to-cyan-600",
    },
  ];

  const menus = [
    {
      title: "Data Santri",
      desc: "Kelola data santri aktif dan informasi santri.",
      icon: <FaUsers />,
      path: "/admin/santri",
      color: "from-emerald-400 via-green-500 to-emerald-700",
      badge: `${dashboard.santriAktif} aktif`,
    },
    {
      title: "Verifikasi Santri",
      desc: "Terima atau tolak pendaftaran santri baru.",
      icon: <FaClipboardList />,
      path: "/admin/verifikasi",
      color: "from-yellow-300 via-orange-400 to-orange-600",
      badge: `${dashboard.santriPending} pending`,
    },
    {
      title: "Pembayaran",
      desc: "Buat tagihan, cek bukti, dan verifikasi pembayaran.",
      icon: <FaMoneyBillWave />,
      path: "/admin/pembayaran",
      color: "from-green-400 via-emerald-500 to-teal-700",
      badge: formatRupiah(dashboard.pemasukan),
    },
    {
      title: "Pemberitahuan",
      desc: "Kirim informasi kepada santri berdasarkan target.",
      icon: <FaBullhorn />,
      path: "/admin/pemberitahuan",
      color: "from-blue-400 via-cyan-500 to-blue-700",
      badge:
        dashboard.adminUnreadNotifications > 0
          ? `${dashboard.adminUnreadNotifications} notif baru`
          : "Tidak ada notif",
    },
    {
      title: "Program Pesantren",
      desc: "Lihat halaman program unggulan pesantren.",
      icon: <FaMosque />,
      path: "/program",
      color: "from-teal-400 via-emerald-500 to-green-800",
      badge: "Publik",
    },
    {
      title: "Pendidikan",
      desc: "Lihat halaman jenjang pendidikan pesantren.",
      icon: <FaSchool />,
      path: "/pendidikan",
      color: "from-sky-400 via-blue-500 to-indigo-700",
      badge: "Publik",
    },
  ];

  const filteredMenus = menus.filter((item) => {
    const keyword = searchMenu.toLowerCase();

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword)
    );
  });

    const { checking } = useAuthGuard(["admin"]);

  if (checking) {
    return <AuthLoading role="Admin" />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05130F] text-slate-700">
      <SidebarAdmin
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
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_30%),linear-gradient(180deg,#06261C_0%,#071B14_42%,#EAF3EE_42%,#EAF3EE_100%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.045]" />
          <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative z-10">
            {/* TOPBAR */}
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06261C]/80 backdrop-blur-2xl">
              <div className="flex h-[78px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 md:hidden"
                  >
                    <FaLayerGroup />
                  </button>

                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-black text-white md:text-2xl">
                      Admin Mission Control
                    </h1>

                    <p className="mt-1 truncate text-xs font-semibold text-emerald-100/70 md:text-sm">
                      Pusat kerja harian Pondok Pesantren Al-Furqon
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={fetchDashboard}
                    className="hidden h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:flex"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>

                  <button
                    onClick={() => router.push("/admin/pemberitahuan")}
                    className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 transition hover:bg-yellow-300"
                  >
                    <FaBell />

                    {dashboard.adminUnreadNotifications > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                        {dashboard.adminUnreadNotifications > 99
                          ? "99+"
                          : dashboard.adminUnreadNotifications}
                      </span>
                    )}
                  </button>

                  <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 shadow-sm backdrop-blur-xl sm:flex">
                    <img
                      src="/avatar.png"
                      alt="admin"
                      className="h-10 w-10 rounded-2xl object-cover"
                    />

                    <div>
                      <h3 className="text-sm font-black text-white">
                        Admin Pesantren
                      </h3>
                      <p className="text-xs font-semibold text-emerald-100/70">
                        Operator Sistem
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              {errorMessage && (
                <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                  <p className="font-black">Dashboard gagal dimuat</p>
                  <p className="mt-1 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* HERO */}
              <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#071B14]/80 p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-9">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.28),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.25),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.85),rgba(74,52,16,0.74))]" />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                        <FaFingerprint className="text-yellow-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                          Admin Operational Command
                        </span>
                      </div>

                      <h2 className="mt-6 text-[clamp(2.2rem,6vw,5.4rem)] font-black leading-[0.9] tracking-[-0.06em]">
                        Kendali
                        <span className="block text-yellow-300">
                          Operasional.
                        </span>
                      </h2>

                      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                        Proses pendaftaran, pembayaran, pemberitahuan, dan data
                        santri dari satu pusat kerja admin yang lebih hidup,
                        cepat, dan mudah dipantau.
                      </p>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        onClick={() => router.push("/admin/verifikasi")}
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                      >
                        Verifikasi Sekarang
                        <FaArrowRight />
                      </button>

                      <button
                        onClick={() => router.push("/admin/pembayaran")}
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
                      >
                        Cek Pembayaran
                        <FaMoneyBillWave />
                      </button>

                      <button
                        onClick={() => router.push("/admin/pemberitahuan")}
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-6 text-sm font-black text-yellow-200 backdrop-blur-xl transition hover:bg-yellow-300/20 sm:text-base"
                      >
                        Kirim Info
                        <FaBullhorn />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <HeroGlassCard
                      title="Tanggal Operasional"
                      value={formatTanggalLengkap(new Date())}
                      icon={<FaCalendarAlt />}
                    />

                    <HeroGlassCard
                      title="Tugas Mendesak"
                      value={`${dashboard.santriPending} santri`}
                      icon={<FaBolt />}
                      alert
                    />

                    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:col-span-2">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />

                      <div className="relative z-10 flex items-center justify-between gap-5">
                        <div>
                          <p className="text-sm font-semibold text-emerald-50/80">
                            Kesiapan Kerja Admin
                          </p>

                          <h3 className="mt-1 text-5xl font-black text-yellow-300">
                            {workScore}%
                          </h3>

                          <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-50/70">
                            Dipengaruhi oleh jumlah santri pending dan notifikasi
                            yang belum dibaca.
                          </p>
                        </div>

                        <div
                          className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(#facc15 ${
                              workScore * 3.6
                            }deg, rgba(255,255,255,0.12) 0deg)`,
                          }}
                        >
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#071B14] text-xl font-black text-yellow-300 shadow-inner">
                            {workScore}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                          style={{ width: `${workScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* PRIORITY TASKS */}
              <section className="relative z-10 -mt-4 grid grid-cols-1 gap-4 px-1 xl:grid-cols-3">
                {priorityTasks.map((item, index) => (
                  <PriorityTaskCard key={index} item={item} loading={loading} />
                ))}
              </section>

              {/* BODY */}
              <section className="mt-7 rounded-[42px] bg-[#EAF3EE] p-4 shadow-2xl shadow-black/10 sm:p-6 lg:p-7">
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((item, index) => (
                    <StatCard key={index} item={item} loading={loading} />
                  ))}
                </div>

                {/* QUICK STATUS */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {quickStats.map((item, index) => (
                    <QuickStat key={index} item={item} loading={loading} />
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="space-y-6 xl:col-span-2">
                    {/* MENU MANAGEMENT */}
                    <div className="relative overflow-hidden rounded-[36px] border border-white bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-7">
                      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
                      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

                      <div className="relative z-10">
                        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                              <FaLayerGroup />
                              Admin Menu
                            </div>

                            <h2 className="mt-3 text-2xl font-black text-slate-900">
                              Menu Operasional
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              Pilih pekerjaan admin yang ingin diproses.
                            </p>
                          </div>

                          <div className="relative w-full lg:w-[340px]">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                              type="text"
                              placeholder="Cari menu..."
                              value={searchMenu}
                              onChange={(e) => setSearchMenu(e.target.value)}
                              className="h-12 w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          {filteredMenus.map((item, index) => (
                            <MenuCard key={index} item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <PanelCard
                      title="Pendaftaran Terbaru"
                      subtitle="Data santri yang baru masuk ke sistem."
                      icon={<FaUsers />}
                      actionLabel="Lihat Semua"
                      onAction={() => router.push("/admin/verifikasi")}
                    >
                      <div className="space-y-3">
                        {loading ? (
                          <LoadingRows />
                        ) : dashboard.latestSantri.length === 0 ? (
                          <EmptyState text="Belum ada data santri terbaru." />
                        ) : (
                          dashboard.latestSantri.map((item) => (
                            <LatestSantriRow
                              key={item.id}
                              item={item}
                              getStatusBadge={getStatusBadge}
                              formatTanggal={formatTanggal}
                            />
                          ))
                        )}
                      </div>
                    </PanelCard>
                  </div>

                  <div className="space-y-6">
                    <PanelCard
                      title="Ringkasan Verifikasi"
                      subtitle="Komposisi status santri."
                      icon={<FaChartLine />}
                    >
                      <div className="mt-2 space-y-5">
                        <ProgressItem
                          label="Aktif"
                          value={progressAktif}
                          count={dashboard.santriAktif}
                          color="bg-emerald-500"
                        />

                        <ProgressItem
                          label="Pending"
                          value={progressPending}
                          count={dashboard.santriPending}
                          color="bg-yellow-400"
                        />

                        <ProgressItem
                          label="Ditolak"
                          value={progressDitolak}
                          count={dashboard.santriDitolak}
                          color="bg-red-500"
                        />
                      </div>
                    </PanelCard>

                    <PanelCard
                      title="Pembayaran Terbaru"
                      subtitle="Transaksi terakhir yang masuk."
                      icon={<FaMoneyBillWave />}
                      actionLabel="Buka"
                      onAction={() => router.push("/admin/pembayaran")}
                    >
                      <div className="space-y-4">
                        {loading ? (
                          <LoadingRows small />
                        ) : dashboard.latestPembayaran.length === 0 ? (
                          <EmptyState text="Belum ada pembayaran terbaru." />
                        ) : (
                          dashboard.latestPembayaran.map((item) => (
                            <PaymentRow
                              key={item.id}
                              item={item}
                              getStatusBadge={getStatusBadge}
                              formatTanggal={formatTanggal}
                              formatRupiah={formatRupiah}
                            />
                          ))
                        )}
                      </div>
                    </PanelCard>

                    <NotificationPanel dashboard={dashboard} router={router} />

                    <QuoteCard />
                  </div>
                </div>
              </section>
            </section>
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

function HeroGlassCard({ icon, title, value, alert = false }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
      {alert && (
        <span className="absolute right-4 top-4 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400" />
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
            alert ? "bg-yellow-400 text-green-950" : "bg-white/15 text-white"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-50/80">{title}</p>
          <h3 className="mt-1 break-words text-lg font-black text-white">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function PriorityTaskCard({ item, loading }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(item.href)}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#071B14] p-5 text-left text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:shadow-yellow-950/20"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.color}`} />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.035]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-lg transition group-hover:scale-110`}
          >
            {item.icon}
          </div>

          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white">
            {loading ? "..." : item.value}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-50/75">
          {item.desc}
        </p>

        <div className={`mt-5 inline-flex items-center gap-2 text-sm font-black ${item.accent}`}>
          {item.button}
          <FaArrowRight className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function StatCard({ item, loading }) {
  const colorMap = {
    emerald: {
      bg: "from-[#FFFFFF] via-emerald-50 to-green-100",
      icon: "bg-emerald-600 text-white",
      glow: "bg-emerald-300/25",
    },
    yellow: {
      bg: "from-[#FFFFFF] via-yellow-50 to-amber-100",
      icon: "bg-yellow-400 text-green-950",
      glow: "bg-yellow-300/30",
    },
    green: {
      bg: "from-[#FFFFFF] via-green-50 to-emerald-100",
      icon: "bg-green-600 text-white",
      glow: "bg-green-300/25",
    },
    blue: {
      bg: "from-[#FFFFFF] via-blue-50 to-cyan-100",
      icon: "bg-blue-600 text-white",
      glow: "bg-blue-300/25",
    },
  };

  const color = colorMap[item.color] || colorMap.emerald;

  return (
    <div
      className={`group relative overflow-hidden rounded-[32px] border border-white bg-gradient-to-br ${color.bg} p-5 shadow-xl shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${color.glow} blur-2xl transition group-hover:scale-125`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-500">{item.title}</p>

          <h2 className="mt-3 break-words text-[clamp(1.5rem,3vw,2rem)] font-black leading-tight text-slate-950">
            {loading ? "..." : item.value}
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            {item.desc}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-emerald-700">
            <FaArrowUp />
            {item.note}
          </div>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-2xl shadow-lg transition group-hover:rotate-6 group-hover:scale-110 ${color.icon}`}
        >
          {item.icon}
        </div>
      </div>
    </div>
  );
}

function QuickStat({ item, loading }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white bg-white p-5 shadow-lg shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`} />

      <div className="flex items-center gap-4">
        <div
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-md ${item.color}`}
        >
          {item.icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-500">{item.label}</p>
          <h3 className="mt-1 text-3xl font-black text-slate-900">
            {loading ? "..." : item.value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function MenuCard({ item }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(item.path)}
      className="group relative overflow-hidden rounded-[30px] border border-slate-100 bg-slate-950 p-5 text-left text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.color}`} />
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl transition group-hover:scale-125" />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.035]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-lg transition group-hover:scale-110`}
          >
            {item.icon}
          </div>

          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-black text-white">
            {item.badge}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-black text-white group-hover:text-yellow-300">
          {item.title}
        </h3>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-50/70">
          {item.desc}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-yellow-300">
          Buka Menu
          <FaArrowRight className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function PanelCard({ title, subtitle, icon, actionLabel, onAction, children }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-7">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700">
              {icon}
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                {title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          {actionLabel && (
            <button
              onClick={onAction}
              className="hidden items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-200 sm:inline-flex"
            >
              {actionLabel}
              <FaArrowRight />
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

function LatestSantriRow({ item, getStatusBadge, formatTanggal }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:bg-emerald-50">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={item.foto || "/default-user.png"}
          alt={item.nama}
          className="h-14 w-14 rounded-2xl border border-slate-100 object-cover"
        />

        <div className="min-w-0">
          <h3 className="truncate font-black text-slate-900">{item.nama}</h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {item.jenjang} {item.kelas} • {formatTanggal(item.created_at)}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${getStatusBadge(
          item.status
        )}`}
      >
        {item.status || "-"}
      </span>
    </div>
  );
}

function PaymentRow({ item, getStatusBadge, formatTanggal, formatRupiah }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:bg-emerald-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-900">
            {item.santri?.nama || "Santri"}
          </h3>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {item.jenis || "Pembayaran"} • {formatTanggal(item.created_at)}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-black ${getStatusBadge(
            item.status
          )}`}
        >
          {item.status || "-"}
        </span>
      </div>

      <h4 className="mt-3 text-xl font-black text-emerald-700">
        {formatRupiah(item.nominal)}
      </h4>
    </div>
  );
}

function NotificationPanel({ dashboard, router }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0B3B2E] via-[#166534] to-[#B7791F] p-6 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950">
            <FaBell />

            {dashboard.adminUnreadNotifications > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[24px] min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                {dashboard.adminUnreadNotifications > 99
                  ? "99+"
                  : dashboard.adminUnreadNotifications}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-green-100">
              Notifikasi Admin
            </p>

            <h3 className="text-4xl font-black">
              {dashboard.adminUnreadNotifications}
            </h3>

            <p className="mt-1 text-xs text-green-100">
              Santri baru dan pembayaran belum dibaca
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {dashboard.latestAdminNotifications.length === 0 ? (
            <p className="rounded-2xl bg-white/10 p-4 text-sm text-green-100">
              Belum ada notifikasi admin.
            </p>
          ) : (
            dashboard.latestAdminNotifications.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => router.push("/admin/pemberitahuan")}
                className={`w-full rounded-2xl border p-4 text-left transition hover:bg-white/15 ${
                  item.is_read
                    ? "border-white/10 bg-white/10"
                    : "border-yellow-300/30 bg-yellow-400/15"
                }`}
              >
                <p className="text-xs font-black uppercase text-yellow-300">
                  {item.tipe}
                </p>

                <h4 className="mt-1 truncate font-black">{item.judul}</h4>

                <p className="mt-1 line-clamp-2 text-xs text-green-100">
                  {item.isi}
                </p>
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => router.push("/admin/pemberitahuan")}
          className="mt-5 h-12 w-full rounded-2xl bg-yellow-400 font-black text-green-950 transition hover:bg-yellow-300"
        >
          Lihat Notifikasi
        </button>
      </div>
    </div>
  );
}

function QuoteCard() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/5">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
          <FaQuran />
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-500">
          Pesan Hari Ini
        </p>

        <h3 className="mt-3 text-2xl font-black leading-relaxed text-slate-900">
          “Tugas admin bukan hanya mengelola data, tetapi menjaga amanah.”
        </h3>

        <p className="mt-3 font-black text-emerald-700">— Sistem Pesantren</p>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, count, color }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-black text-slate-700">{label}</p>
        <p className="font-black text-slate-900">
          {count} data • {value}%
        </p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LoadingRows({ small = false }) {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`animate-pulse rounded-3xl bg-slate-100 ${
            small ? "h-24" : "h-20"
          }`}
        />
      ))}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
        <FaExclamationCircle />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}

function ServerMaintenanceModal({ message, onRetry, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#14532D] text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 animate-pulse rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-yellow-300/30 bg-yellow-400/15 shadow-xl">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-green-950">
              ⚙️
              <span className="absolute inset-0 animate-ping rounded-full border-4 border-yellow-200/50" />
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
                "Backend belum aktif. Beberapa data dashboard belum dapat dimuat untuk sementara waktu."}
            </p>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                ☪
              </div>

              <div>
                <h3 className="font-black text-white">
                  Silakan menunggu hingga perbaikan selesai
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-green-50/80">
                  Saat ini sistem sedang dalam masa pemeliharaan.
                </p>

                <div className="mt-3 rounded-2xl bg-black/30 px-4 py-3 font-mono text-sm text-yellow-200">
                  Tunggu Hingga 1x24
                  <br />
                  Jika belum normal, hubungi pihak backend.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRetry}
              className="h-[52px] rounded-2xl bg-yellow-400 px-5 py-3 font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Coba Lagi
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-[52px] rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Tutup Popup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}