"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import SidebarOwner from "./sidebar";

import {
  FaUsers,
  FaWallet,
  FaClock,
  FaPrint,
  FaSyncAlt,
  FaFileInvoiceDollar,
  FaUserGraduate,
  FaInfoCircle,
  FaMosque,
  FaFilter,
  FaChartPie,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaClipboardList,
  FaReceipt,
  FaCrown,
  FaEye,
} from "react-icons/fa";

import { API_URL, formatRupiah, formatTanggal, isServerError } from "./helpers";

export default function OwnerLaporan() {
  const router = useRouter();

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
    checkOwnerAccess();
    fetchLaporan();
  }, [periode]);

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

  const getDateRange = () => {
    const now = new Date();

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    if (periode === "hari") {
      return {
        start: formatDate(now),
        end: formatDate(now),
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
        start: formatDate(start),
        end: formatDate(end),
      };
    }

    if (periode === "bulan") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return {
        start: formatDate(start),
        end: formatDate(end),
      };
    }

    if (periode === "tahun") {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);

      return {
        start: formatDate(start),
        end: formatDate(end),
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

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      const { start, end } = getDateRange();

      const params = new URLSearchParams();

      if (start) params.append("start", start);
      if (end) params.append("end", end);

      const result = await fetchJson(
        `${API_URL}/api/owner/laporan?${params.toString()}`
      );

      setLaporan(result.data);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("OWNER LAPORAN ERROR:", error.message);
      setLaporan(null);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Laporan owner belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const periodeLabel = useMemo(() => {
    const { start, end } = getDateRange();

    if (!start || !end) return "Semua Data";

    return `${formatTanggal(start)} - ${formatTanggal(end)}`;
  }, [periode, customStart, customEnd]);

  const nomorLaporan = useMemo(() => {
    const now = new Date();

    const tahun = now.getFullYear();
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const tanggal = String(now.getDate()).padStart(2, "0");

    return `OWN-LAP-${tahun}${bulan}${tanggal}-${String(
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

  const healthScore = useMemo(() => {
    if (!laporan) return 0;

    const santriScore = rasioAktif;
    const pembayaranScore = rasioLunas;
    const pendingPenalty = laporan.pembayaran?.pending
      ? Math.max(0, 100 - laporan.pembayaran.pending * 5)
      : 100;

    return Math.min(
      100,
      Math.round((santriScore + pembayaranScore + pendingPenalty) / 3)
    );
  }, [laporan, rasioAktif, rasioLunas]);

  const insightText = useMemo(() => {
    if (!laporan) return "Data laporan belum dimuat.";

    if (laporan.pembayaran.pending > 0) {
      return `${laporan.pembayaran.pending} pembayaran masih pending dengan nilai ${formatRupiah(
        laporan.pembayaran.totalPending
      )}. Perlu dipantau oleh admin dan owner.`;
    }

    if (laporan.pendaftaran.pending > 0) {
      return `${laporan.pendaftaran.pending} pendaftaran santri masih menunggu verifikasi pada periode ini.`;
    }

    if (laporan.pembayaran.lunas > 0) {
      return "Kondisi laporan terlihat baik. Pembayaran lunas dan data santri sudah dapat dipantau dalam laporan owner.";
    }

    return "Belum ada aktivitas laporan yang besar pada periode ini.";
  }, [laporan]);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

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
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1004] via-[#4A3410] to-[#064E3B] px-4 py-8 text-white sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:py-12 print:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_35%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#EFE8D8] to-transparent" />
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaMosque className="shrink-0 text-yellow-300" />

                    <span className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-yellow-100 sm:text-xs">
                      Owner Executive Report Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5.3rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Laporan
                    <span className="block text-yellow-300">Pesantren.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-yellow-50/90 sm:text-base lg:text-[17px]">
                    Pantau dan cetak rekap santri, pendaftaran, pembayaran,
                    pemasukan, dan kondisi administrasi pesantren dalam format
                    laporan owner yang lebih sinematik dan informatif.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={fetchLaporan}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                    >
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                      Refresh Data
                    </button>

                    <button
                      onClick={handlePrint}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
                    >
                      <FaPrint />
                      Cetak / Simpan PDF
                    </button>
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <HeroMiniCard
                      title="Total Santri"
                      value={`${laporan?.santri?.total || 0}`}
                      icon={<FaUsers />}
                    />

                    <HeroMiniCard
                      title="Transaksi Lunas"
                      value={`${laporan?.pembayaran?.lunas || 0}`}
                      icon={<FaCheckCircle />}
                    />

                    <HeroMiniCard
                      title="Pendaftaran"
                      value={`${laporan?.pendaftaran?.total || 0}`}
                      icon={<FaUserGraduate />}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
                <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-300/25 blur-3xl" />
                  <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />

                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-yellow-100">
                      Total Pemasukan Periode Ini
                    </p>

                    <h2 className="mt-2 break-words text-[clamp(2rem,5vw,3.4rem)] font-black leading-tight text-yellow-300">
                      {formatRupiah(laporan?.pembayaran?.totalPemasukan || 0)}
                    </h2>

                    <p className="mt-2 text-sm text-yellow-50/70">
                      Periode: {periodeLabel}
                    </p>

                    <div className="mt-5 rounded-2xl bg-black/20 p-4">
                      <p className="text-xs font-semibold text-yellow-100/80">
                        Nomor laporan
                      </p>

                      <p className="mt-1 break-words text-sm font-black text-white sm:text-base">
                        {nomorLaporan}
                      </p>
                    </div>
                  </div>
                </div>

                <HealthScoreCard score={healthScore} insight={insightText} />
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="w-full bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5] print:bg-white">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 lg:py-8 print:max-w-none print:px-0 print:py-0">
            {/* PRINT HEADER */}
            <div className="hidden print:block">
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
                    Laporan Owner Pesantren
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
                    <strong>Dicetak Oleh:</strong> Owner Al-Furqon
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
            <section className="relative mb-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-4 shadow-xl shadow-yellow-950/10 sm:p-5 print:hidden">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

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
                      Pilih periode laporan yang ingin dipantau dan dicetak.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                    {periodeLabel}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 text-sm font-black text-green-950 shadow-md transition hover:-translate-y-0.5 hover:bg-yellow-300"
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
                {/* STAT CARDS */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
                  <StatCard
                    title="Total Santri"
                    value={laporan.santri.total}
                    desc={`${laporan.santri.aktif} santri aktif`}
                    icon={<FaUsers />}
                    color="bg-emerald-600 text-white"
                  />

                  <StatCard
                    title="Pendaftaran Periode"
                    value={laporan.pendaftaran.total}
                    desc={`${laporan.pendaftaran.pending} pending`}
                    icon={<FaUserGraduate />}
                    color="bg-blue-500 text-white"
                  />

                  <StatCard
                    title="Total Pemasukan"
                    value={formatRupiah(laporan.pembayaran.totalPemasukan)}
                    desc={`${laporan.pembayaran.lunas} transaksi lunas`}
                    icon={<FaWallet />}
                    color="bg-yellow-400 text-green-950"
                  />

                  <StatCard
                    title="Pembayaran Pending"
                    value={formatRupiah(laporan.pembayaran.totalPending)}
                    desc={`${laporan.pembayaran.pending} transaksi`}
                    icon={<FaClock />}
                    color="bg-orange-500 text-white"
                  />
                </section>

                {/* EXECUTIVE INSIGHT */}
                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] print:hidden">
                  <ExecutiveInsight
                    insightText={insightText}
                    rasioAktif={rasioAktif}
                    rasioLunas={rasioLunas}
                    laporan={laporan}
                  />

                  <ReportPreviewCard
                    nomorLaporan={nomorLaporan}
                    periodeLabel={periodeLabel}
                    handlePrint={handlePrint}
                  />
                </section>

                {/* REPORT PANELS */}
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
                    <InfoRow label="Putra" value={laporan.santri.putra} />
                    <InfoRow label="Putri" value={laporan.santri.putri} />
                    <InfoRow label="SMP" value={laporan.santri.smp} />
                    <InfoRow label="SMK" value={laporan.santri.smk} />
                    <InfoRow
                      label="Takhassus"
                      value={laporan.santri.takhassus}
                    />
                  </ReportPanel>

                  <ReportPanel
                    title="Ringkasan Pembayaran"
                    icon={<FaFileInvoiceDollar />}
                  >
                    <InfoRow
                      label="Total Transaksi"
                      value={laporan.pembayaran.total}
                    />
                    <InfoRow label="Lunas" value={laporan.pembayaran.lunas} />
                    <InfoRow
                      label="Pending"
                      value={laporan.pembayaran.pending}
                    />
                    <InfoRow
                      label="Ditolak"
                      value={laporan.pembayaran.ditolak}
                    />
                    <InfoRow
                      label="Total Pemasukan"
                      value={formatRupiah(laporan.pembayaran.totalPemasukan)}
                    />
                    <InfoRow
                      label="Total Pending"
                      value={formatRupiah(laporan.pembayaran.totalPending)}
                    />
                  </ReportPanel>
                </section>

                {/* TABLE */}
                <section className="relative mt-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-xl shadow-green-950/10 print:rounded-none print:border print:bg-white print:shadow-none">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl print:hidden" />
                  <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl print:hidden" />

                  <div className="relative z-10">
                    <div className="border-b border-[#E7D7A7] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md print:hidden">
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
                                className="border-t border-[#E7D7A7] bg-white/65 transition hover:bg-yellow-50 print:bg-white"
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
                      <p className="font-bold">Owner Pesantren</p>

                      <div className="h-20" />

                      <p className="font-bold underline">Owner Al-Furqon</p>
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

        <PrintStyle />
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroMiniCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-yellow-100/80">{title}</p>
          <p className="mt-1 break-words text-sm font-black text-white sm:text-base">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function HealthScoreCard({ score, insight }) {
  return (
    <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-[130px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[130px_1fr]">
        <div
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#facc15 ${
              score * 3.6
            }deg, rgba(255,255,255,0.12) 0deg)`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#0B2A1F] shadow-inner">
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
            Report Health
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            Kondisi Laporan
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-emerald-50/80">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon, color }) {
  const isYellow = color?.includes("yellow");
  const isGreen = color?.includes("green") || color?.includes("emerald");
  const isOrange = color?.includes("orange");
  const isBlue = color?.includes("blue");

  const bg = isYellow
    ? "from-white via-[#FFF7D6] to-[#F5E3A3] border-yellow-200 shadow-yellow-950/10"
    : isGreen
    ? "from-white via-[#E8F5E9] to-[#DFF3E8] border-emerald-200 shadow-emerald-950/10"
    : isOrange
    ? "from-white via-[#FFF1DE] to-[#F6D2A6] border-orange-200 shadow-orange-950/10"
    : isBlue
    ? "from-white via-[#EAF2FF] to-[#CFE2FF] border-blue-200 shadow-blue-950/10"
    : "from-white via-[#F8FAFC] to-[#E2E8F0] border-slate-200 shadow-slate-950/10";

  return (
    <div
      className={`
        group relative overflow-hidden rounded-[32px]
        border bg-gradient-to-br ${bg}
        p-5 shadow-xl transition duration-300
        hover:-translate-y-1 hover:shadow-2xl
        print:rounded-xl print:border print:bg-white print:shadow-none
      `}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125 print:hidden" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-500">{title}</p>

          <h2 className="mt-2 break-words text-[clamp(1.4rem,3vw,1.9rem)] font-black leading-tight text-[#1F1607]">
            {value}
          </h2>

          <p className="mt-1 text-xs font-bold text-slate-500">{desc}</p>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-xl shadow-lg transition group-hover:rotate-6 group-hover:scale-110 print:hidden ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ExecutiveInsight({ insightText, rasioAktif, rasioLunas, laporan }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
          <FaCrown />
          Executive Insight
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
            title="Pembayaran Pending"
            value={`${laporan.pembayaran.pending}`}
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
          Dokumen Owner
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
      <span className="break-words text-sm font-black text-[#1F1607]">
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-[28px] bg-white/80"
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
                "Backend belum aktif. Laporan belum dapat dimuat untuk sementara waktu."}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-green-950 shadow-lg transition hover:bg-yellow-300"
            >
              Coba Lagi
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20"
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
        .shadow-md {
          box-shadow: none !important;
        }
      }
    `}</style>
  );
}