"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaChartBar,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaSyncAlt,
  FaCalendarAlt,
  FaUserGraduate,
  FaWallet,
  FaFileInvoiceDollar,
  FaInfoCircle,
  FaMosque,
  FaFilter,
  FaShieldAlt,
  FaClipboardList,
  FaCrown,
  FaChartPie,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminLaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [laporan, setLaporan] = useState(null);

  const [periode, setPeriode] = useState("bulan");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    fetchLaporan();
  }, [periode]);

  const isServerError = (error) => {
    const message = String(error?.message || "");

    return (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Load failed") ||
      message.includes("fetch") ||
      message.includes("Backend tidak mengembalikan JSON") ||
      message.includes("NEXT_PUBLIC_API_URL")
    );
  };

  const showMaintenancePopup = (
    message = "Server backend belum aktif atau sedang maintenance. Jalankan backend Express terlebih dahulu."
  ) => {
    setServerMaintenance(true);
    setServerMessage(message);
  };

  const fetchJson = async (url, options = {}) => {
    if (!API_URL) {
      showMaintenancePopup(
        "Alamat backend belum diatur. Cek NEXT_PUBLIC_API_URL di file .env.local frontend."
      );

      throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);

        showMaintenancePopup(
          "Backend merespons, tetapi tidak mengembalikan JSON yang valid."
        );

        throw new Error(
  "API tidak mengembalikan JSON. Pastikan endpoint /api/fasilitas sudah berjalan."
);
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Terjadi kesalahan pada backend.");
      }

      setServerMaintenance(false);
      setServerMessage("");

      return result;
    } catch (error) {
      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data laporan belum dapat dimuat."
        );
      }

      throw error;
    }
  };

  const getDateRange = () => {
    const now = new Date();

    const format = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    if (periode === "hari") {
      return {
        start: format(now),
        end: format(now),
      };
    }

    if (periode === "minggu") {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      const start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return {
        start: format(start),
        end: format(end),
      };
    }

    if (periode === "bulan") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return {
        start: format(start),
        end: format(end),
      };
    }

    if (periode === "tahun") {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);

      return {
        start: format(start),
        end: format(end),
      };
    }

    if (periode === "custom") {
      return {
        start: customStart,
        end: customEnd,
      };
    }

    return {
      start: "",
      end: "",
    };
  };

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      const { start, end } = getDateRange();
      const params = new URLSearchParams();

      if (start) params.append("start", start);
      if (end) params.append("end", end);

      const result = await fetchJson(
        `${API_URL}/api/admin/laporan?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      setLaporan(result.data);
    } catch (error) {
      console.error("LAPORAN ERROR:", error.message);
      setLaporan(null);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data laporan belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
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

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const periodeLabel = useMemo(() => {
    const range = getDateRange();

    if (!range.start || !range.end) return "Semua Data";

    return `${formatTanggal(range.start)} - ${formatTanggal(range.end)}`;
  }, [periode, customStart, customEnd]);

  const nomorLaporan = useMemo(() => {
    const now = new Date();

    const tahun = now.getFullYear();
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const tanggal = String(now.getDate()).padStart(2, "0");

    return `ADM-LAP-${tahun}${bulan}${tanggal}-${String(
      laporan?.pembayaran?.total || 0
    ).padStart(3, "0")}`;
  }, [laporan]);

  const rasioLunas = useMemo(() => {
    if (!laporan?.pembayaran?.total) return 0;

    return Math.round(
      (laporan.pembayaran.lunas / laporan.pembayaran.total) * 100
    );
  }, [laporan]);

  const rasioAktif = useMemo(() => {
    if (!laporan?.santri?.total) return 0;

    return Math.round((laporan.santri.aktif / laporan.santri.total) * 100);
  }, [laporan]);

  const insightText = useMemo(() => {
    if (!laporan) return "Data laporan belum dimuat.";

    if (laporan.pembayaran?.pending > 0) {
      return `${laporan.pembayaran.pending} pembayaran masih pending dan perlu segera diperiksa oleh admin.`;
    }

    if (laporan.pendaftaran?.total > 0) {
      return `Terdapat ${laporan.pendaftaran.total} pendaftaran pada periode ini. Data perlu dipantau agar administrasi tetap rapi.`;
    }

    return "Kondisi laporan terlihat stabil. Tidak ada aktivitas besar yang membutuhkan perhatian khusus.";
  }, [laporan]);

  const healthScore = useMemo(() => {
    if (!laporan) return 0;

    const pendingPenalty = laporan.pembayaran?.pending
      ? Math.min(45, laporan.pembayaran.pending * 5)
      : 0;

    return Math.max(10, Math.min(100, Math.round((rasioAktif + rasioLunas + (100 - pendingPenalty)) / 3)));
  }, [laporan, rasioAktif, rasioLunas]);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const { checking } = useAuthGuard(["admin"]);

if (checking) {
  return <AuthLoading role="Admin" />;
}

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071B14] text-slate-700">
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
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-32 pt-8 text-white sm:px-6 md:px-10 md:pt-12 print:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,#041B14_0%,#0B3B2E_45%,#4A3410_100%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EFE8D8] to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.13fr_0.87fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaMosque className="text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                      Admin Report Command Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Laporan
                    <span className="block text-yellow-300">
                      Administrasi.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                    Rekap data santri, pendaftaran, transaksi pembayaran, dan
                    pemasukan pesantren dalam tampilan laporan yang rapi,
                    Islamic, dan siap dicetak menjadi PDF.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={fetchLaporan}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
                    >
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                      Refresh Data
                    </button>

                    <button
                      onClick={handlePrint}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20"
                    >
                      <FaPrint />
                      Cetak / Simpan PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <HeroCard
                  title="Periode Laporan"
                  value={periodeLabel}
                  icon={<FaCalendarAlt />}
                />

                <HeroCard
                  title="Nomor Laporan"
                  value={nomorLaporan}
                  icon={<FaClipboardList />}
                />

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-yellow-100/80">
                        Report Health
                      </p>

                      <h3 className="mt-1 text-4xl font-black text-yellow-300">
                        {healthScore}%
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-emerald-50/70">
                        Berdasarkan rasio santri aktif dan pembayaran lunas.
                      </p>
                    </div>

                    <div
                      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#facc15 ${
                          healthScore * 3.6
                        }deg, rgba(255,255,255,0.12) 0deg)`,
                      }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#071B14] text-lg font-black text-yellow-300">
                        {healthScore}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="relative bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5] print:bg-white">
          <div className="mx-auto -mt-20 max-w-[1600px] px-4 pb-10 sm:px-6 md:px-10 print:mt-0 print:max-w-none print:px-0 print:pb-0">
            {/* PRINT HEADER */}
            <div className="hidden print:block print-header">
              <div className="flex items-center gap-4 border-b-4 border-green-800 pb-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-300 bg-white p-2">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center">
                  <h1 className="text-xl font-black uppercase tracking-wide">
                    Pondok Pesantren Al-Furqon
                  </h1>

                  <p className="mt-1 text-sm font-semibold">
                    Laporan Administrasi Pesantren
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Data Santri, Pembayaran, Pendaftaran, dan Pemasukan
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p>
                    <strong>Nomor Laporan:</strong> {nomorLaporan}
                  </p>
                  <p>
                    <strong>Periode:</strong> {periodeLabel}
                  </p>
                </div>

                <div className="text-right">
                  <p>
                    <strong>Tanggal Cetak:</strong> {formatTanggal(new Date())}
                  </p>
                  <p>
                    <strong>Dicetak Oleh:</strong> Admin Pesantren
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-300 p-4">
                <h2 className="text-sm font-black uppercase text-green-800">
                  Ringkasan Laporan
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  Laporan ini memuat rekap data administrasi Pondok Pesantren
                  Al-Furqon berdasarkan periode yang dipilih. Data yang
                  ditampilkan meliputi jumlah santri, status pendaftaran,
                  transaksi pembayaran, pemasukan, serta pembayaran terbaru.
                </p>
              </div>
            </div>

            {/* FILTER */}
            <section className="relative z-20 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] p-4 shadow-2xl shadow-green-950/10 sm:p-6 print:hidden">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                      <FaFilter />
                      Filter Laporan
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                      Periode Laporan
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      Pilih periode untuk menampilkan dan mencetak laporan.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                    {periodeLabel}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <select
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                  >
                    <option value="hari">Hari Ini</option>
                    <option value="minggu">Minggu Ini</option>
                    <option value="bulan">Bulan Ini</option>
                    <option value="tahun">Tahun Ini</option>
                    <option value="custom">Custom</option>
                  </select>

                  <input
                    type="date"
                    value={customStart}
                    disabled={periode !== "custom"}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <input
                    type="date"
                    value={customEnd}
                    disabled={periode !== "custom"}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    onClick={fetchLaporan}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-5 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Terapkan
                  </button>
                </div>
              </div>
            </section>

            {loading ? (
              <LoadingState />
            ) : !laporan ? (
              <EmptyState />
            ) : (
              <>
                {/* STATS */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
                  <StatCard
                    title="Total Santri"
                    value={laporan.santri.total}
                    desc={`${laporan.santri.aktif} aktif`}
                    icon={<FaUsers />}
                    color="bg-emerald-600 text-white"
                  />

                  <StatCard
                    title="Pendaftaran Periode"
                    value={laporan.pendaftaran.total}
                    desc="Santri mendaftar"
                    icon={<FaUserGraduate />}
                    color="bg-blue-500 text-white"
                  />

                  <StatCard
                    title="Pembayaran Lunas"
                    value={laporan.pembayaran.lunas}
                    desc={`${laporan.pembayaran.total} transaksi`}
                    icon={<FaCheckCircle />}
                    color="bg-green-600 text-white"
                  />

                  <StatCard
                    title="Total Pemasukan"
                    value={formatRupiah(laporan.pembayaran.totalPemasukan)}
                    desc="Dari pembayaran lunas"
                    icon={<FaWallet />}
                    color="bg-yellow-400 text-green-950"
                  />
                </section>

                {/* INSIGHT */}
                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] print:hidden">
                  <ExecutiveInsight
                    insightText={insightText}
                    rasioAktif={rasioAktif}
                    rasioLunas={rasioLunas}
                    pending={laporan.pembayaran.pending}
                  />

                  <ReportPreviewCard
                    nomorLaporan={nomorLaporan}
                    periodeLabel={periodeLabel}
                    handlePrint={handlePrint}
                  />
                </section>

                {/* DETAIL CARDS */}
                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2 print:grid-cols-2">
                  <ReportPanel title="Ringkasan Santri" icon={<FaUsers />}>
                    <InfoRow label="Total Santri" value={laporan.santri.total} />
                    <InfoRow label="Santri Aktif" value={laporan.santri.aktif} />
                    <InfoRow
                      label="Santri Pending"
                      value={laporan.santri.pending}
                    />
                    <InfoRow
                      label="Santri Ditolak"
                      value={laporan.santri.ditolak}
                    />
                    <InfoRow label="SMP" value={laporan.santri.smp} />
                    <InfoRow label="SMK" value={laporan.santri.smk} />
                    <InfoRow
                      label="Takhassus"
                      value={laporan.santri.takhassus}
                    />
                  </ReportPanel>

                  <ReportPanel
                    title="Ringkasan Pembayaran"
                    icon={<FaMoneyBillWave />}
                  >
                    <InfoRow
                      label="Total Transaksi"
                      value={laporan.pembayaran.total}
                    />
                    <InfoRow
                      label="Pembayaran Lunas"
                      value={laporan.pembayaran.lunas}
                    />
                    <InfoRow
                      label="Pembayaran Pending"
                      value={laporan.pembayaran.pending}
                    />
                    <InfoRow
                      label="Pembayaran Ditolak"
                      value={laporan.pembayaran.ditolak}
                    />
                    <InfoRow
                      label="Total Pemasukan"
                      value={formatRupiah(laporan.pembayaran.totalPemasukan)}
                    />
                    <InfoRow
                      label="Menunggu Verifikasi"
                      value={formatRupiah(laporan.pembayaran.totalMenunggu)}
                    />
                  </ReportPanel>
                </section>

                {/* TABLE */}
                <section className="relative mt-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 print:rounded-none print:border print:bg-white print:shadow-none">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl print:hidden" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl print:hidden" />

                  <div className="relative z-10">
                    <div className="border-b border-[#E7D7A7] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-md print:hidden">
                            <FaFileInvoiceDollar />
                          </div>

                          <div>
                            <h2 className="text-xl font-black text-[#1F1607]">
                              Pembayaran Terbaru
                            </h2>

                            <p className="text-sm font-semibold text-slate-600">
                              Data transaksi berdasarkan periode laporan.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handlePrint}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-4 text-sm font-black text-white shadow-md transition hover:bg-[#086B4F] print:hidden"
                        >
                          <FaPrint />
                          Cetak
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto print:overflow-visible">
                      <table className="w-full min-w-[900px] print:min-w-0">
                        <thead className="bg-[#064E3B] text-white">
                          <tr>
                            <TableHead>No</TableHead>
                            <TableHead>Santri</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Nominal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                          </tr>
                        </thead>

                        <tbody>
                          {laporan.pembayaran.terbaru.length === 0 ? (
                            <tr>
                              <td colSpan="6">
                                <div className="py-12 text-center text-slate-500">
                                  Tidak ada pembayaran pada periode ini.
                                </div>
                              </td>
                            </tr>
                          ) : (
                            laporan.pembayaran.terbaru.map((item, index) => (
                              <tr
                                key={item.id}
                                className="border-t border-[#E7D7A7] bg-white/70 transition hover:bg-yellow-50 print:bg-white"
                              >
                                <TableCell>{index + 1}</TableCell>

                                <TableCell>
                                  <div>
                                    <p className="font-black text-[#1F1607]">
                                      {item.santri?.nama || "-"}
                                    </p>

                                    <p className="text-xs font-semibold text-slate-500">
                                      {item.santri?.jenjang || "-"}{" "}
                                      {item.santri?.kelas || ""}
                                    </p>
                                  </div>
                                </TableCell>

                                <TableCell>{item.jenis || "-"}</TableCell>

                                <TableCell>
                                  {formatRupiah(item.nominal)}
                                </TableCell>

                                <TableCell>
                                  <StatusBadge status={item.status} />
                                </TableCell>

                                <TableCell>
                                  {formatTanggal(
                                    item.tanggal_bayar || item.created_at
                                  )}
                                </TableCell>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* PRINT SIGNATURE */}
                <section className="mt-10 hidden print:block">
                  <div className="grid grid-cols-2 gap-10 text-sm">
                    <div className="text-center">
                      <p>Mengetahui,</p>
                      <p className="font-bold">Pengasuh Pesantren</p>

                      <div className="h-20" />

                      <p className="font-bold underline">
                        Abah Kh Abdurrahman
                      </p>
                    </div>

                    <div className="text-center">
                      <p>Bogor, {formatTanggal(new Date())}</p>
                      <p className="font-bold">Admin Pesantren</p>

                      <div className="h-20" />

                      <p className="font-bold underline">Admin Al-Furqon</p>
                    </div>
                  </div>
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
              fetchLaporan();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}
      </main>

      <PrintStyle />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroCard({ title, value, icon }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-md">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-yellow-100/80">{title}</p>

          <h3 className="mt-1 break-words text-lg font-black text-white sm:text-xl">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-xl shadow-yellow-950/5 transition hover:-translate-y-1 hover:shadow-2xl print:rounded-xl print:border print:bg-white print:shadow-none">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125 print:hidden" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-500">{title}</p>

          <h2 className="mt-2 break-words text-2xl font-black text-[#1F1607]">
            {value}
          </h2>

          <p className="mt-1 text-xs font-bold text-slate-500">{desc}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-md print:hidden ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ExecutiveInsight({ insightText, rasioAktif, rasioLunas, pending }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
          <FaCrown />
          Admin Insight
        </div>

        <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
          Ringkasan Keputusan
        </h2>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
          {insightText}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InsightMini
            title="Rasio Santri Aktif"
            value={`${rasioAktif}%`}
            icon={<FaUsers />}
          />
          <InsightMini
            title="Rasio Pembayaran Lunas"
            value={`${rasioLunas}%`}
            icon={<FaCheckCircle />}
          />
          <InsightMini
            title="Pending"
            value={pending}
            icon={<FaClock />}
          />
        </div>
      </div>
    </div>
  );
}

function InsightMini({ title, value, icon }) {
  return (
    <div className="rounded-3xl border border-[#E7D7A7] bg-white/75 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md">
        {icon}
      </div>

      <p className="text-xs font-bold text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-[#1F1607]">{value}</p>
    </div>
  );
}

function ReportPreviewCard({ nomorLaporan, periodeLabel, handlePrint }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#0B2A1F] via-[#064E3B] to-[#4A3410] p-5 text-white shadow-xl shadow-green-950/20">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-300">
          <FaClipboardList />
          Preview Laporan
        </div>

        <h2 className="mt-3 text-2xl font-black text-white">
          Dokumen Admin
        </h2>

        <div className="mt-5 space-y-3">
          <PreviewRow label="Nomor" value={nomorLaporan} />
          <PreviewRow label="Periode" value={periodeLabel} />
          <PreviewRow label="Format" value="A4 Print / PDF" />
        </div>

        <button
          onClick={handlePrint}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 text-sm font-black text-green-950 shadow-md transition hover:bg-yellow-300"
        >
          <FaPrint />
          Cetak / Simpan PDF
        </button>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
      <span className="text-sm font-semibold text-emerald-50/80">
        {label}
      </span>

      <span className="text-right text-sm font-black text-yellow-300">
        {value}
      </span>
    </div>
  );
}

function ReportPanel({ title, icon, children }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF4D1] p-5 shadow-xl shadow-yellow-950/10 print:rounded-xl print:border print:bg-white print:shadow-none">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl print:hidden" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-md print:hidden">
            {icon}
          </div>

          <h3 className="text-xl font-black text-[#1F1607]">{title}</h3>
        </div>

        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E7D7A7] bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl print:rounded-none print:border print:bg-white print:shadow-none">
      <span className="text-sm font-semibold text-slate-500">{label}</span>

      <span className="break-words text-right text-sm font-black text-[#1F1607]">
        {value}
      </span>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-5 py-4 text-sm font-semibold text-slate-700">{children}</td>;
}

function StatusBadge({ status }) {
  const style =
    status === "lunas"
      ? "bg-emerald-100 text-emerald-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "ditolak"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status || "-"}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-[28px] bg-white/70"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-[30px] bg-white px-4 py-20 text-center shadow-xl shadow-green-950/5">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-3xl text-slate-400">
        <FaInfoCircle />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-700">
        Laporan Tidak Tersedia
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Data laporan belum dapat ditampilkan.
      </p>
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
                "Backend belum aktif. Data laporan belum dapat dimuat untuk sementara waktu."}
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

function PrintStyle() {
  return (
    <style jsx global>{`
      @media print {
        @page {
          size: A4;
          margin: 14mm;
        }

        html,
        body {
          background: white !important;
          color: #111827 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        aside,
        header,
        nav,
        button,
        .print\\:hidden {
          display: none !important;
        }

        main {
          margin-left: 0 !important;
          padding-top: 0 !important;
          width: 100% !important;
        }

        section {
          page-break-inside: avoid;
        }

        .print-header {
          page-break-after: avoid;
        }

        .print\\:block {
          display: block !important;
        }

        .print\\:grid {
          display: grid !important;
        }

        .print\\:mt-0 {
          margin-top: 0 !important;
        }

        .print\\:max-w-none {
          max-width: none !important;
        }

        .print\\:px-0 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .print\\:pb-0 {
          padding-bottom: 0 !important;
        }

        .print\\:shadow-none {
          box-shadow: none !important;
        }

        .print\\:border {
          border: 1px solid #d1d5db !important;
        }

        .print\\:bg-white {
          background: white !important;
        }

        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 11px !important;
        }

        thead {
          background: #166534 !important;
          color: white !important;
        }

        th {
          color: white !important;
          font-weight: 800 !important;
          padding: 8px !important;
          border: 1px solid #d1d5db !important;
        }

        td {
          padding: 8px !important;
          border: 1px solid #d1d5db !important;
          color: #111827 !important;
        }

        .shadow-xl,
        .shadow-lg,
        .shadow-md,
        .shadow-2xl {
          box-shadow: none !important;
        }

        .overflow-x-auto {
          overflow: visible !important;
        }

        .min-w-\\[900px\\] {
          min-width: 0 !important;
        }
      }
    `}</style>
  );
}