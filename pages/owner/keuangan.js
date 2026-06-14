"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import SidebarOwner from "./sidebar";

import {
  FaMoneyBillWave,
  FaWallet,
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaSyncAlt,
  FaSearch,
  FaEye,
  FaInfoCircle,
  FaChartLine,
  FaCalendarAlt,
  FaReceipt,
  FaMosque,
  FaShieldAlt,
  FaFilter,
} from "react-icons/fa";

import { API_URL, formatRupiah, formatTanggal, isServerError } from "../../lib/ownerHelpers";

export default function OwnerKeuangan() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [keuangan, setKeuangan] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("bulan");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    checkOwnerAccess();
    fetchKeuangan();
  }, [filterStatus, filterJenis, filterPeriode]);

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

    if (filterPeriode === "hari") {
      return {
        start: formatDate(now),
        end: formatDate(now),
      };
    }

    if (filterPeriode === "minggu") {
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

    if (filterPeriode === "bulan") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return {
        start: formatDate(start),
        end: formatDate(end),
      };
    }

    if (filterPeriode === "tahun") {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);

      return {
        start: formatDate(start),
        end: formatDate(end),
      };
    }

    if (filterPeriode === "custom") {
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

  const fetchKeuangan = async () => {
    try {
      setLoading(true);

      const { start, end } = getDateRange();

      const params = new URLSearchParams();

      if (filterStatus) params.append("status", filterStatus);
      if (filterJenis) params.append("jenis", filterJenis);
      if (start) params.append("start", start);
      if (end) params.append("end", end);

      const result = await fetchJson(
        `${API_URL}/api/owner/keuangan?${params.toString()}`
      );

      setKeuangan(result.data);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("OWNER KEUANGAN ERROR:", error.message);
      setKeuangan(null);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data keuangan owner belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const transaksiFiltered = useMemo(() => {
    const keyword = search.toLowerCase();

    return (keuangan?.transaksi || []).filter((item) => {
      return (
        item.santri?.nama?.toLowerCase()?.includes(keyword) ||
        item.santri?.nisn?.toLowerCase()?.includes(keyword) ||
        item.jenis?.toLowerCase()?.includes(keyword) ||
        item.metode?.toLowerCase()?.includes(keyword) ||
        item.status?.toLowerCase()?.includes(keyword)
      );
    });
  }, [keuangan, search]);

  const periodeLabel = useMemo(() => {
    const { start, end } = getDateRange();

    if (!start || !end) return "Semua Data";

    return `${formatTanggal(start)} - ${formatTanggal(end)}`;
  }, [filterPeriode, customStart, customEnd]);

  const persentaseLunas = useMemo(() => {
    if (!keuangan?.totalTransaksi) return 0;

    return Math.round((keuangan.lunas / keuangan.totalTransaksi) * 100);
  }, [keuangan]);

  const persentasePending = useMemo(() => {
    if (!keuangan?.totalTransaksi) return 0;

    return Math.round((keuangan.pending / keuangan.totalTransaksi) * 100);
  }, [keuangan]);

  const persentaseDitolak = useMemo(() => {
    if (!keuangan?.totalTransaksi) return 0;

    return Math.round((keuangan.ditolak / keuangan.totalTransaksi) * 100);
  }, [keuangan]);

  const insightText = useMemo(() => {
    if (!keuangan) return "Data belum dimuat.";

    if (keuangan.pending > 0) {
      return `${keuangan.pending} pembayaran masih menunggu verifikasi admin dengan total ${formatRupiah(
        keuangan.totalPending
      )}.`;
    }

    if (keuangan.ditolak > 0) {
      return `${keuangan.ditolak} pembayaran tercatat ditolak pada periode ini.`;
    }

    if (keuangan.lunas > 0) {
      return "Kondisi pembayaran periode ini terlihat baik karena transaksi yang tampil sudah banyak berstatus lunas.";
    }

    return "Belum ada transaksi pada periode yang dipilih.";
  }, [keuangan]);

  const resetFilter = () => {
    setSearch("");
    setFilterStatus("");
    setFilterJenis("");
    setFilterPeriode("bulan");
    setCustomStart("");
    setCustomEnd("");
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#241604] via-[#4A3410] to-[#064E3B] px-4 py-8 text-white sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:py-12">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EFE8D8] to-transparent" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.16fr_0.84fr] xl:items-center">
              <div className="max-w-4xl">
                <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-xl">
                  <FaMosque className="shrink-0 text-yellow-300" />

                  <span className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-yellow-100 sm:text-xs">
                    Owner Financial Monitoring
                  </span>
                </div>

                <h1 className="mt-5 text-[clamp(2.25rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.05em]">
                  Monitoring
                  <span className="block text-yellow-300">Keuangan.</span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-yellow-50/90 sm:text-base lg:text-[17px]">
                  Pantau pemasukan pesantren, transaksi lunas, pembayaran
                  pending, dan riwayat pembayaran santri secara lebih rapi,
                  informatif, dan responsif.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={fetchKeuangan}
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Refresh Data
                  </button>

                  <button
                    onClick={resetFilter}
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
                  >
                    <FaFilter />
                    Reset Filter
                  </button>
                </div>
              </div>

              <div className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6 xl:ml-auto xl:max-w-[480px]">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-yellow-100">
                        Total Pemasukan
                      </p>

                      <h2 className="mt-2 break-words text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-tight text-yellow-300">
                        {formatRupiah(keuangan?.totalPemasukan || 0)}
                      </h2>

                      <p className="mt-2 text-sm text-yellow-50/70">
                        Periode: {periodeLabel}
                      </p>
                    </div>

                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-green-950 sm:flex">
                      <FaWallet />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <HeroMiniCard
                      title="Pending"
                      value={formatRupiah(keuangan?.totalPending || 0)}
                    />

                    <HeroMiniCard
                      title="Lunas"
                      value={`${keuangan?.lunas || 0} transaksi`}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-black/20 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-yellow-100/80">
                        Rasio transaksi lunas
                      </p>

                      <p className="text-xs font-black text-yellow-300">
                        {persentaseLunas}%
                      </p>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                        style={{ width: `${persentaseLunas}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="w-full bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 lg:py-8">
            {/* FILTER */}
            <section className="relative mb-6 overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-4 shadow-xl shadow-yellow-950/10 sm:p-5">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                      <FaCalendarAlt />
                      Filter Periode
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                      Filter Keuangan
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      Pilih status, jenis pembayaran, dan periode data yang
                      ingin dipantau owner.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                    {periodeLabel}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <SelectInput
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="lunas">Lunas</option>
                    <option value="pending">Pending</option>
                    <option value="ditolak">Ditolak</option>
                  </SelectInput>

                  <SelectInput
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                  >
                    <option value="">Semua Jenis</option>

                    {(keuangan?.jenisPembayaran || []).map((jenis) => (
                      <option key={jenis} value={jenis}>
                        {jenis}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    value={filterPeriode}
                    onChange={(e) => setFilterPeriode(e.target.value)}
                  >
                    <option value="hari">Hari Ini</option>
                    <option value="minggu">Minggu Ini</option>
                    <option value="bulan">Bulan Ini</option>
                    <option value="tahun">Tahun Ini</option>
                    <option value="custom">Custom</option>
                  </SelectInput>

                  <input
                    type="date"
                    value={customStart}
                    disabled={filterPeriode !== "custom"}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={customEnd}
                      disabled={filterPeriode !== "custom"}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="h-12 min-w-0 flex-1 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      onClick={fetchKeuangan}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md transition hover:bg-yellow-300"
                      title="Terapkan filter"
                    >
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {loading ? (
              <LoadingState />
            ) : !keuangan ? (
              <EmptyState />
            ) : (
              <>
                {/* STAT CARDS */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total Pemasukan"
                    value={formatRupiah(keuangan.totalPemasukan)}
                    desc="Pembayaran lunas"
                    icon={<FaWallet />}
                    color="bg-yellow-400 text-green-950"
                  />

                  <StatCard
                    title="Pembayaran Pending"
                    value={formatRupiah(keuangan.totalPending)}
                    desc={`${keuangan.pending} transaksi pending`}
                    icon={<FaClock />}
                    color="bg-orange-500 text-white"
                  />

                  <StatCard
                    title="Pembayaran Ditolak"
                    value={formatRupiah(keuangan.totalDitolak)}
                    desc={`${keuangan.ditolak} transaksi ditolak`}
                    icon={<FaTimesCircle />}
                    color="bg-red-500 text-white"
                  />

                  <StatCard
                    title="Total Transaksi"
                    value={keuangan.totalTransaksi}
                    desc={`${keuangan.lunas} lunas`}
                    icon={<FaCheckCircle />}
                    color="bg-emerald-600 text-white"
                  />
                </section>

                {/* INSIGHT */}
                <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-green-950 shadow-md">
                        <FaChartLine />
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-[#1F1607]">
                          Insight Keuangan
                        </h3>

                        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                          {insightText}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <InsightBadge
                            icon={<FaCheckCircle />}
                            label={`${keuangan.lunas} lunas`}
                          />
                          <InsightBadge
                            icon={<FaClock />}
                            label={`${keuangan.pending} pending`}
                          />
                          <InsightBadge
                            icon={<FaTimesCircle />}
                            label={`${keuangan.ditolak} ditolak`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#0B2A1F] via-[#064E3B] to-[#4A3410] p-5 text-white shadow-xl shadow-green-950/20">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-white">
                            Status Transaksi
                          </h3>
                          <p className="text-sm text-emerald-50/75">
                            Rasio pembayaran periode ini
                          </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md">
                          <FaShieldAlt />
                        </div>
                      </div>

                      <StatusProgress
                        label="Lunas"
                        value={keuangan.lunas}
                        total={keuangan.totalTransaksi}
                        percentage={persentaseLunas}
                        color="bg-emerald-400"
                      />
                      <StatusProgress
                        label="Pending"
                        value={keuangan.pending}
                        total={keuangan.totalTransaksi}
                        percentage={persentasePending}
                        color="bg-yellow-400"
                      />
                      <StatusProgress
                        label="Ditolak"
                        value={keuangan.ditolak}
                        total={keuangan.totalTransaksi}
                        percentage={persentaseDitolak}
                        color="bg-red-400"
                      />
                    </div>
                  </div>
                </section>

                {/* SEARCH + TRANSAKSI */}
                <section className="relative mt-6 overflow-hidden rounded-[34px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] p-4 shadow-xl shadow-green-950/10 sm:p-5">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          <FaReceipt />
                          Riwayat Pembayaran
                        </div>

                        <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                          Riwayat Transaksi
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          Owner hanya dapat melihat transaksi, bukan mengubah
                          data.
                        </p>
                      </div>

                      <div className="relative w-full lg:max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="Cari nama, NISN, jenis, metode..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {transaksiFiltered.length === 0 ? (
                        <div className="xl:col-span-2">
                          <EmptyMini text="Tidak ada transaksi yang sesuai filter." />
                        </div>
                      ) : (
                        transaksiFiltered.map((item) => (
                          <TransactionCard
                            key={item.id}
                            item={item}
                            onPreview={() =>
                              setPreviewImage(item.bukti_transfer)
                            }
                          />
                        ))
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>

        {previewImage && (
          <ImagePreview
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}

        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");
              fetchKeuangan();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
    >
      {children}
    </select>
  );
}

function HeroMiniCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
      <p className="text-xs font-semibold text-yellow-100/80">{title}</p>
      <p className="mt-1 break-words text-sm font-black text-white sm:text-base">
        {value}
      </p>
    </div>
  );
}

function StatCard({ title, value, desc, icon, color }) {
  const isYellow = color?.includes("yellow");
  const isGreen = color?.includes("emerald") || color?.includes("green");
  const isRed = color?.includes("red");
  const isOrange = color?.includes("orange");

  const bg = isYellow
    ? "from-white via-[#FFF7D6] to-[#F5E3A3] border-yellow-200 shadow-yellow-950/10"
    : isGreen
    ? "from-white via-[#E8F5E9] to-[#DFF3E8] border-emerald-200 shadow-emerald-950/10"
    : isRed
    ? "from-white via-[#FFF0F0] to-[#FFD6D6] border-red-200 shadow-red-950/10"
    : isOrange
    ? "from-white via-[#FFF1DE] to-[#F6D2A6] border-orange-200 shadow-orange-950/10"
    : "from-white via-[#F8FAFC] to-[#E2E8F0] border-slate-200 shadow-slate-950/10";

  return (
    <div
      className={`
        group relative overflow-hidden rounded-[32px]
        border bg-gradient-to-br ${bg}
        p-5 shadow-xl transition duration-300
        hover:-translate-y-1 hover:shadow-2xl
      `}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-500">{title}</p>

          <h2 className="mt-2 break-words text-[clamp(1.45rem,3vw,2rem)] font-black leading-tight text-[#1F1607]">
            {value}
          </h2>

          <p className="mt-1 text-xs font-bold text-slate-500">{desc}</p>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-xl shadow-lg transition group-hover:rotate-6 group-hover:scale-110 ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InsightBadge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D7A7] bg-white/75 px-3 py-2 text-xs font-black text-slate-600 shadow-sm backdrop-blur-xl">
      {icon}
      {label}
    </span>
  );
}

function StatusProgress({ label, value, total, percentage, color }) {
  return (
    <div className="mt-4 rounded-2xl bg-white/10 p-3 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-emerald-50/85">{label}</span>
        <span className="font-black text-yellow-300">
          {value} / {total || 0}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${percentage || 0}%` }}
        />
      </div>
    </div>
  );
}

function TransactionCard({ item, onPreview }) {
  const statusStyle =
    item.status === "lunas"
      ? "bg-emerald-100 text-emerald-700"
      : item.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : item.status === "ditolak"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  const statusIcon =
    item.status === "lunas" ? (
      <FaCheckCircle />
    ) : item.status === "pending" ? (
      <FaClock />
    ) : item.status === "ditolak" ? (
      <FaTimesCircle />
    ) : (
      <FaReceipt />
    );

  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-4 shadow-lg shadow-yellow-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-black text-[#1F1607]">
              {item.santri?.nama || "Santri"}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {item.santri?.jenjang || "-"} {item.santri?.kelas || ""} • NISN{" "}
              {item.santri?.nisn || "-"}
            </p>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase ${statusStyle}`}
          >
            {statusIcon}
            {item.status || "-"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoBox label="Jenis Pembayaran" value={item.jenis || "-"} />
          <InfoBox label="Metode" value={item.metode || "-"} />
          <InfoBox label="Nominal" value={formatRupiah(item.nominal)} />
          <InfoBox
            label="Tanggal"
            value={formatTanggal(item.tanggal_bayar || item.created_at)}
          />
        </div>

        {item.bukti_transfer ? (
          <button
            onClick={onPreview}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#4A3410] font-black text-yellow-300 shadow-md transition hover:bg-[#064E3B]"
          >
            <FaEye />
            Lihat Bukti Transfer
          </button>
        ) : (
          <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-center text-sm font-semibold text-slate-400">
            Bukti transfer belum tersedia
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7D7A7] bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-[#1F1607]">
        {value}
      </p>
    </div>
  );
}

function ImagePreview({ image, onClose }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="font-black text-slate-900">Bukti Transfer</h3>

          <button
            onClick={onClose}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
          >
            Tutup
          </button>
        </div>

        <div className="max-h-[80vh] overflow-auto bg-slate-100 p-4">
          <img
            src={image}
            alt="Bukti Transfer"
            className="mx-auto max-h-[75vh] rounded-2xl object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyMini({ text }) {
  return (
    <div className="rounded-[26px] border border-[#E7D7A7] bg-white/75 px-4 py-14 text-center shadow-sm backdrop-blur-xl">
      <FaInfoCircle className="mx-auto text-4xl text-slate-300" />

      <p className="mt-3 text-sm font-semibold text-slate-500">{text}</p>
    </div>
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
        Data Keuangan Tidak Tersedia
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Data keuangan belum dapat ditampilkan.
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
                "Backend belum aktif. Data keuangan belum dapat dimuat untuk sementara waktu."}
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