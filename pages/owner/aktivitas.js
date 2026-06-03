"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import SidebarOwner from "./sidebar";

import {
  FaHistory,
  FaUsers,
  FaMoneyBillWave,
  FaBullhorn,
  FaCog,
  FaSyncAlt,
  FaSearch,
  FaInfoCircle,
  FaMosque,
  FaFilter,
  FaUserShield,
  FaClock,
  FaEye,
  FaTimes,
  FaLayerGroup,
  FaShieldAlt,
  FaCrown,
  FaFingerprint,
  FaCalendarAlt,
  FaChartPie,
  FaClipboardList,
} from "react-icons/fa";

import { API_URL, formatTanggal, isServerError } from "./helpers";

export default function OwnerAktivitas() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dataAktivitas, setDataAktivitas] = useState(null);

  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("bulan");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [selectedAktivitas, setSelectedAktivitas] = useState(null);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    checkOwnerAccess();
    fetchAktivitas();
  }, [filterKategori, filterPeriode]);

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

  const fetchAktivitas = async () => {
    try {
      setLoading(true);

      const { start, end } = getDateRange();

      const params = new URLSearchParams();

      if (filterKategori) params.append("kategori", filterKategori);
      if (start) params.append("start", start);
      if (end) params.append("end", end);

      const result = await fetchJson(
        `${API_URL}/api/owner/aktivitas?${params.toString()}`
      );

      setDataAktivitas(result.data);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("OWNER AKTIVITAS ERROR:", error.message);
      setDataAktivitas(null);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Aktivitas admin belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const aktivitasFiltered = useMemo(() => {
    const keyword = search.toLowerCase();

    return (dataAktivitas?.aktivitas || []).filter((item) => {
      return (
        item.nama_admin?.toLowerCase()?.includes(keyword) ||
        item.kategori?.toLowerCase()?.includes(keyword) ||
        item.aktivitas?.toLowerCase()?.includes(keyword) ||
        item.detail?.toLowerCase()?.includes(keyword) ||
        item.target_nama?.toLowerCase()?.includes(keyword)
      );
    });
  }, [dataAktivitas, search]);

  const periodeLabel = useMemo(() => {
    const { start, end } = getDateRange();

    if (!start || !end) return "Semua Data";

    return `${formatTanggal(start)} - ${formatTanggal(end)}`;
  }, [filterPeriode, customStart, customEnd]);

  const resetFilter = () => {
    setSearch("");
    setFilterKategori("");
    setFilterPeriode("bulan");
    setCustomStart("");
    setCustomEnd("");
  };

  const insightText = useMemo(() => {
    if (!dataAktivitas) return "Data belum dimuat.";

    if (dataAktivitas.total === 0) {
      return "Belum ada aktivitas admin pada periode yang dipilih.";
    }

    if (dataAktivitas.pembayaran > 0) {
      return `${dataAktivitas.pembayaran} aktivitas pembayaran tercatat pada periode ini. Owner dapat memantau proses administrasi pembayaran tanpa mengubah data.`;
    }

    if (dataAktivitas.santri > 0) {
      return `${dataAktivitas.santri} aktivitas terkait data santri tercatat pada periode ini.`;
    }

    return "Aktivitas admin sudah tercatat dan dapat dipantau oleh owner.";
  }, [dataAktivitas]);

  const healthScore = useMemo(() => {
    if (!dataAktivitas?.total) return 0;

    const todayScore = Math.min(100, (dataAktivitas.hariIni || 0) * 10);
    const paymentScore = dataAktivitas.pembayaran > 0 ? 85 : 65;
    const systemScore = dataAktivitas.total > 0 ? 90 : 50;

    return Math.min(100, Math.round((todayScore + paymentScore + systemScore) / 3));
  }, [dataAktivitas]);

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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1004] via-[#4A3410] to-[#064E3B] px-4 py-8 text-white sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:py-12">
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
                      Owner Admin Activity Intelligence
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5.3rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Aktivitas
                    <span className="block text-yellow-300">Admin.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-yellow-50/90 sm:text-base lg:text-[17px]">
                    Pantau jejak tindakan admin seperti verifikasi santri,
                    pembayaran, pemberitahuan, dan aktivitas sistem dalam
                    tampilan monitoring owner yang lebih sinematik.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={fetchAktivitas}
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

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <HeroMiniCard
                      title="Total Aktivitas"
                      value={`${dataAktivitas?.total || 0}`}
                      icon={<FaHistory />}
                    />

                    <HeroMiniCard
                      title="Hari Ini"
                      value={`${dataAktivitas?.hariIni || 0}`}
                      icon={<FaClock />}
                    />

                    <HeroMiniCard
                      title="Pembayaran"
                      value={`${dataAktivitas?.pembayaran || 0}`}
                      icon={<FaMoneyBillWave />}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
                <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-300/25 blur-3xl" />
                  <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-yellow-100">
                          Total Aktivitas
                        </p>

                        <h2 className="mt-2 text-[clamp(2.5rem,6vw,4rem)] font-black leading-tight text-yellow-300">
                          {dataAktivitas?.total || 0}
                        </h2>

                        <p className="mt-2 text-sm text-yellow-50/70">
                          Periode: {periodeLabel}
                        </p>
                      </div>

                      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-green-950 sm:flex">
                        <FaFingerprint />
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-black/20 p-4">
                      <p className="text-xs font-semibold text-yellow-100/80">
                        Insight aktivitas
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-relaxed text-white">
                        {insightText}
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
        <div className="w-full bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 lg:py-8">
            {/* FILTER */}
            <section className="relative mb-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-4 shadow-xl shadow-yellow-950/10 sm:p-5">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                      <FaFilter />
                      Filter Aktivitas
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                      Filter Aktivitas Admin
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      Pantau aktivitas admin berdasarkan kategori, periode, dan
                      kata kunci tertentu.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                    {aktivitasFiltered.length} data tampil
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <SelectInput
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                  >
                    <option value="">Semua Kategori</option>
                    <option value="santri">Santri</option>
                    <option value="pembayaran">Pembayaran</option>
                    <option value="pemberitahuan">Pemberitahuan</option>
                    <option value="sistem">Sistem</option>

                    {(dataAktivitas?.kategoriList || [])
                      .filter(
                        (item) =>
                          ![
                            "santri",
                            "pembayaran",
                            "pemberitahuan",
                            "sistem",
                          ].includes(item)
                      )
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
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

                  <input
                    type="date"
                    value={customEnd}
                    disabled={filterPeriode !== "custom"}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      placeholder="Cari aktivitas..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                {filterPeriode === "custom" && (
                  <button
                    onClick={fetchAktivitas}
                    className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 text-sm font-black text-green-950 shadow-md transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:w-fit"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Terapkan Tanggal Custom
                  </button>
                )}
              </div>
            </section>

            {loading ? (
              <LoadingState />
            ) : !dataAktivitas ? (
              <EmptyState />
            ) : (
              <>
                {/* STAT CARDS */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total Aktivitas"
                    value={dataAktivitas.total}
                    desc="Semua aktivitas tercatat"
                    icon={<FaHistory />}
                    color="bg-yellow-400 text-green-950"
                  />

                  <StatCard
                    title="Aktivitas Hari Ini"
                    value={dataAktivitas.hariIni}
                    desc="Aktivitas pada tanggal ini"
                    icon={<FaClock />}
                    color="bg-blue-500 text-white"
                  />

                  <StatCard
                    title="Aktivitas Santri"
                    value={dataAktivitas.santri}
                    desc="Verifikasi / data santri"
                    icon={<FaUsers />}
                    color="bg-emerald-600 text-white"
                  />

                  <StatCard
                    title="Aktivitas Pembayaran"
                    value={dataAktivitas.pembayaran}
                    desc="Verifikasi pembayaran"
                    icon={<FaMoneyBillWave />}
                    color="bg-green-600 text-white"
                  />
                </section>

                {/* INSIGHT */}
                <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-[#FFF7D6] to-[#E8F5E9] p-5 shadow-xl shadow-yellow-950/10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/25 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-green-950 shadow-md">
                        <FaUserShield />
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-[#1F1607]">
                          Insight Aktivitas
                        </h3>

                        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                          {insightText}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <InsightBadge
                            icon={<FaUsers />}
                            label={`${dataAktivitas.santri} santri`}
                          />
                          <InsightBadge
                            icon={<FaMoneyBillWave />}
                            label={`${dataAktivitas.pembayaran} pembayaran`}
                          />
                          <InsightBadge
                            icon={<FaBullhorn />}
                            label={`${dataAktivitas.pemberitahuan} pemberitahuan`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#0B2A1F] via-[#064E3B] to-[#4A3410] p-5 text-white shadow-xl shadow-green-950/20">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-white">
                            Komposisi Aktivitas
                          </h3>

                          <p className="text-sm text-emerald-50/75">
                            Perbandingan kategori aktivitas.
                          </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-md">
                          <FaChartPie />
                        </div>
                      </div>

                      <StatusProgress
                        label="Santri"
                        value={dataAktivitas.santri}
                        total={dataAktivitas.total}
                        color="bg-emerald-400"
                      />
                      <StatusProgress
                        label="Pembayaran"
                        value={dataAktivitas.pembayaran}
                        total={dataAktivitas.total}
                        color="bg-yellow-400"
                      />
                      <StatusProgress
                        label="Pemberitahuan"
                        value={dataAktivitas.pemberitahuan}
                        total={dataAktivitas.total}
                        color="bg-blue-400"
                      />
                      <StatusProgress
                        label="Sistem"
                        value={dataAktivitas.sistem}
                        total={dataAktivitas.total}
                        color="bg-slate-300"
                      />
                    </div>
                  </div>
                </section>

                {/* LIST */}
                <section className="relative mt-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] p-4 shadow-xl shadow-green-950/10 sm:p-5">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          <FaClipboardList />
                          Log Aktivitas
                        </div>

                        <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                          Riwayat Aktivitas Admin
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          Owner hanya dapat melihat aktivitas, bukan mengubah
                          data.
                        </p>
                      </div>

                      <button
                        onClick={fetchAktivitas}
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-[#064E3B] px-5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
                      >
                        <FaSyncAlt className={loading ? "animate-spin" : ""} />
                        Muat Ulang
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {aktivitasFiltered.length === 0 ? (
                        <EmptyMini text="Tidak ada aktivitas admin yang sesuai filter." />
                      ) : (
                        aktivitasFiltered.map((item) => (
                          <ActivityCard
                            key={item.id}
                            item={item}
                            onDetail={() => setSelectedAktivitas(item)}
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

        {selectedAktivitas && (
          <AktivitasDetailModal
            item={selectedAktivitas}
            onClose={() => setSelectedAktivitas(null)}
          />
        )}

        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");
              fetchAktivitas();
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
            Activity Health
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            Kondisi Aktivitas
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
  const isBlue = color?.includes("blue");

  const bg = isYellow
    ? "from-white via-[#FFF7D6] to-[#F5E3A3] border-yellow-200 shadow-yellow-950/10"
    : isGreen
    ? "from-white via-[#E8F5E9] to-[#DFF3E8] border-emerald-200 shadow-emerald-950/10"
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
      `}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-500">{title}</p>

          <h2 className="mt-2 break-words text-[clamp(1.6rem,3vw,2rem)] font-black leading-tight text-[#1F1607]">
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

function StatusProgress({ label, value, total, color }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

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
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActivityCard({ item, onDetail }) {
  const config = getKategoriConfig(item.kategori);

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-4 shadow-lg shadow-yellow-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl shadow-md ${config.iconBg}`}
          >
            {config.icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase ${config.badge}`}
              >
                {item.kategori || "sistem"}
              </span>

              <span className="inline-flex rounded-full border border-[#E7D7A7] bg-white/75 px-3 py-1 text-[11px] font-black text-slate-500">
                {formatTanggal(item.created_at)}
              </span>
            </div>

            <h3 className="mt-3 break-words text-lg font-black text-[#1F1607]">
              {item.aktivitas || "Aktivitas Admin"}
            </h3>

            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
              {item.detail || "Tidak ada detail aktivitas."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <MiniPill
                icon={<FaUserShield />}
                text={item.nama_admin || "Admin"}
              />

              {item.target_nama && (
                <MiniPill icon={<FaEye />} text={item.target_nama} />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onDetail}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#4A3410] px-4 font-black text-yellow-300 shadow-md transition hover:bg-[#064E3B]"
        >
          <FaEye />
          Detail
        </button>
      </div>
    </div>
  );
}

function MiniPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D7A7] bg-white/75 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm backdrop-blur-xl">
      {icon}
      {text}
    </span>
  );
}

function getKategoriConfig(kategori) {
  if (kategori === "santri") {
    return {
      icon: <FaUsers />,
      iconBg: "bg-emerald-600 text-white",
      badge: "bg-emerald-100 text-emerald-700",
    };
  }

  if (kategori === "pembayaran") {
    return {
      icon: <FaMoneyBillWave />,
      iconBg: "bg-green-600 text-white",
      badge: "bg-green-100 text-green-700",
    };
  }

  if (kategori === "pemberitahuan") {
    return {
      icon: <FaBullhorn />,
      iconBg: "bg-blue-500 text-white",
      badge: "bg-blue-100 text-blue-700",
    };
  }

  return {
    icon: <FaCog />,
    iconBg: "bg-yellow-400 text-green-950",
    badge: "bg-yellow-100 text-yellow-700",
  };
}

function AktivitasDetailModal({ item, onClose }) {
  const config = getKategoriConfig(item.kategori);

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#241604] via-[#4A3410] to-[#064E3B] p-6 text-white">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-green-950 shadow-lg">
                {config.icon}
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                  Detail Aktivitas
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {item.aktivitas || "Aktivitas Admin"}
                </h2>

                <p className="text-sm text-yellow-50/80">
                  {item.kategori || "sistem"} • {formatTanggal(item.created_at)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto bg-gradient-to-b from-[#FFFDF6] to-[#E8F5E9] p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBox label="Nama Admin" value={item.nama_admin || "-"} />
            <InfoBox label="Kategori" value={item.kategori || "-"} />
            <InfoBox label="Aktivitas" value={item.aktivitas || "-"} />
            <InfoBox label="Target" value={item.target_nama || "-"} />
            <InfoBox label="Tanggal" value={formatTanggal(item.created_at)} />
            <InfoBox label="ID Target" value={item.target_id || "-"} />
          </div>

          <div className="mt-4 rounded-2xl border border-[#E7D7A7] bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-bold text-slate-400">Detail</p>

            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#1F1607]">
              {item.detail || "-"}
            </p>
          </div>
        </div>
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
        Aktivitas Tidak Tersedia
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Data aktivitas admin belum dapat ditampilkan.
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
                "Backend belum aktif. Aktivitas admin belum dapat dimuat untuk sementara waktu."}
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