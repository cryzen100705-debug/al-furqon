"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaAward,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaClipboardList,
  FaExclamationTriangle,
  FaFilter,
  FaLeaf,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaStar,
  FaSyncAlt,
  FaUndo,
  FaUserGraduate,
} from "react-icons/fa";

import SidebarSantri from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getDefaultTahunAjaran() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 7) {
    return `${year}/${year + 1}`;
  }

  return `${year - 1}/${year}`;
}

function getDefaultSemester() {
  const month = new Date().getMonth() + 1;

  // Juli - Desember = Ganjil
  // Januari - Juni = Genap
  return month >= 7 ? "Ganjil" : "Genap";
}

function formatTanggal(date) {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function getNilaiClass(nilai) {
  const angka = Number(nilai || 0);

  if (angka >= 85) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (angka >= 75) return "bg-sky-100 text-sky-700 border-sky-200";
  if (angka >= 65) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-700 border-red-200";
}

function getPredikat(nilai) {
  const angka = Number(nilai || 0);

  if (angka >= 90) return "A";
  if (angka >= 80) return "B";
  if (angka >= 70) return "C";
  if (angka >= 60) return "D";
  return "E";
}

function getKeteranganPredikat(nilai) {
  const angka = Number(nilai || 0);

  if (angka >= 90) return "Sangat Baik";
  if (angka >= 80) return "Baik";
  if (angka >= 70) return "Cukup";
  if (angka >= 60) return "Perlu Ditingkatkan";
  return "Perlu Bimbingan";
}

function StatCard({ icon, label, value, desc, tone = "yellow" }) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-400 text-emerald-950"
      : tone === "blue"
      ? "bg-sky-300 text-sky-950"
      : tone === "red"
      ? "bg-red-300 text-red-950"
      : "bg-yellow-400 text-emerald-950";

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg ${toneClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-wide text-green-200">
            {label}
          </p>

          <h3 className="mt-1 truncate text-2xl font-black leading-none text-white">
            {value}
          </h3>

          <p className="mt-1 text-[11px] font-semibold leading-snug text-emerald-100/70">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/15 bg-white/10 p-8 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-yellow-400 text-3xl text-emerald-950 shadow-sm">
        <FaClipboardList />
      </div>

      <h3 className="mt-4 text-xl font-black text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-emerald-100/70">
        {desc}
      </p>
    </div>
  );
}

function NilaiCard({ item, santri }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white p-4 text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${getNilaiClass(
                item.nilai
              )}`}
            >
              Nilai {item.nilai}
            </span>

            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-black uppercase text-white">
              Predikat {getPredikat(item.nilai)}
            </span>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-emerald-950">
              {getKeteranganPredikat(item.nilai)}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-black text-emerald-950">
            {item.jenis_nilai || "Jenis Nilai"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {item.semester || "-"} • {item.tahun_ajaran || "-"}
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                Guru
              </p>
              <p className="mt-1 text-sm font-black text-emerald-950">
                {item.guru?.nama || "Guru belum tersedia"}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                Kelas
              </p>
              <p className="mt-1 text-sm font-black text-emerald-950">
                {item.kelas?.nama_kelas || santri?.kelas || "-"}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs font-bold text-slate-400">
            Diinput pada {formatTanggal(item.created_at)}
          </p>

          {item.keterangan && (
            <div className="mt-3 rounded-2xl bg-yellow-50 p-3 text-sm font-semibold leading-relaxed text-slate-600">
              {item.keterangan}
            </div>
          )}
        </div>

        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[26px] bg-emerald-950 text-center text-white">
          <div>
            <FaStar className="mx-auto mb-1 text-yellow-400" />
            <p className="text-3xl font-black">{item.nilai}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SantriNilaiPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [santri, setSantri] = useState(null);
  const [nilaiList, setNilaiList] = useState([]);
  const [ringkasan, setRingkasan] = useState({
    totalNilai: 0,
    rataRata: 0,
    nilaiTertinggi: 0,
    totalMapel: 0,
  });

  const [search, setSearch] = useState("");
  const [filterMapel, setFilterMapel] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterSemester, setFilterSemester] = useState(getDefaultSemester());
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(
    getDefaultTahunAjaran()
  );
  const [openMapel, setOpenMapel] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    let parsedUser = null;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    if (parsedUser.role !== "santri") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    setChecking(false);
  }, [router]);

  useEffect(() => {
    const semesterOtomatis = getDefaultSemester();
    const tahunAjaranOtomatis = getDefaultTahunAjaran();

    setFilterSemester(semesterOtomatis);
    setFilterTahunAjaran(tahunAjaranOtomatis);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchNilai(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filterSemester, filterTahunAjaran]);

  const fetchNilai = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();

      if (filterSemester) {
        params.append("semester", filterSemester);
      }

      if (filterTahunAjaran) {
        params.append("tahun_ajaran", filterTahunAjaran);
      }

      const res = await fetch(
        `${API_URL}/api/santri/nilai/${currentUser.id}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": currentUser.id,
          },
        }
      );

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan Express aktif."
        );
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil nilai santri.");
      }

      setSantri(result.data?.santri || null);
      setNilaiList(result.data?.nilai || []);
      setRingkasan(
        result.data?.ringkasan || {
          totalNilai: 0,
          rataRata: 0,
          nilaiTertinggi: 0,
          totalMapel: 0,
        }
      );
    } catch (error) {
      setErrorMessage(error.message || "Gagal mengambil nilai santri.");
    } finally {
      setLoading(false);
    }
  };

  const mapelOptions = useMemo(() => {
    const set = new Set();

    nilaiList.forEach((item) => {
      if (item.mapel) set.add(item.mapel);
    });

    return Array.from(set);
  }, [nilaiList]);

  const jenisOptions = useMemo(() => {
    const set = new Set();

    nilaiList.forEach((item) => {
      if (item.jenis_nilai) set.add(item.jenis_nilai);
    });

    return Array.from(set);
  }, [nilaiList]);

  const filteredNilai = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return nilaiList.filter((item) => {
      const text = [
        item.mapel,
        item.jenis_nilai,
        item.nilai,
        item.semester,
        item.tahun_ajaran,
        item.keterangan,
        item.guru?.nama,
        item.kelas?.nama_kelas,
      ]
        .join(" ")
        .toLowerCase();

      if (keyword && !text.includes(keyword)) return false;
      if (filterMapel && item.mapel !== filterMapel) return false;
      if (filterJenis && item.jenis_nilai !== filterJenis) return false;

      return true;
    });
  }, [nilaiList, search, filterMapel, filterJenis]);

  const groupedByMapel = useMemo(() => {
    const map = new Map();

    filteredNilai.forEach((item) => {
      const key = item.mapel || "Mata Pelajaran Lainnya";

      if (!map.has(key)) {
        map.set(key, {
          mapel: key,
          nilai: [],
        });
      }

      map.get(key).nilai.push(item);
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.mapel || "").localeCompare(String(b.mapel || ""))
    );
  }, [filteredNilai]);

  const nilaiLulus = filteredNilai.filter((item) => Number(item.nilai || 0) >= 75)
    .length;

  const nilaiPerluDitingkatkan = filteredNilai.filter(
    (item) => Number(item.nilai || 0) < 75
  ).length;

  const hasActiveFilter = search || filterMapel || filterJenis;

  const toggleMapel = (mapel) => {
    setOpenMapel((prev) => ({
      ...prev,
      [mapel]: !prev[mapel],
    }));
  };

  const openAllMapel = () => {
    const next = {};

    groupedByMapel.forEach((group) => {
      next[group.mapel] = true;
    });

    setOpenMapel(next);
  };

  const closeAllMapel = () => {
    setOpenMapel({});
  };

  const resetFilter = () => {
    setSearch("");
    setFilterMapel("");
    setFilterJenis("");
    setOpenMapel({});
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07150F] text-white">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-yellow-400" />
          <p className="font-black">Memeriksa akses santri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07150F] text-white">
      <SidebarSantri
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <main
        className={`
          min-h-screen w-full overflow-x-hidden transition-all duration-300
          pt-16 md:pt-0
          ${
            collapsed
              ? "md:ml-[90px] md:w-[calc(100%-90px)]"
              : "md:ml-[280px] md:w-[calc(100%-280px)]"
          }
        `}
      >
        <div className="relative min-h-screen w-full overflow-hidden px-3 py-4 sm:px-5 lg:px-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),linear-gradient(135deg,#07150F_0%,#0B2A1B_48%,#07150F_100%)]" />
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
            <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-none">
            {errorMessage && (
              <div className="mb-5 rounded-[24px] border border-red-400/30 bg-red-500/10 p-4 text-red-100">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 shrink-0 text-red-300" />
                  <div>
                    <p className="font-black">Terjadi Kesalahan</p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HEADER */}
            <section className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl lg:p-6">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                    <FaLeaf />
                    Santri Grade Report
                  </div>

                  <h1 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">
                    Nilai Saya
                    <span className="block text-yellow-400">
                      Semester Aktif.
                    </span>
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-emerald-100/80">
                    Assalamu’alaikum,{" "}
                    <span className="font-black text-yellow-300">
                      {santri?.nama || user?.nama || "Santri"}
                    </span>
                    . Pantau perkembangan nilai berdasarkan semester dan tahun
                    ajaran aktif secara otomatis.
                  </p>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => fetchNilai()}
                      disabled={loading}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 text-xs font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:opacity-70"
                    >
                      Refresh Nilai
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    </button>

                    <button
                      type="button"
                      onClick={openAllMapel}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                    >
                      Buka Semua Mapel
                      <FaChevronDown />
                    </button>

                    <button
                      type="button"
                      onClick={resetFilter}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                    >
                      Reset Filter
                      <FaUndo />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950">
                    <FaUserGraduate />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wide text-green-200">
                      Profil Santri
                    </p>

                    <h3 className="mt-1 truncate text-lg font-black text-white">
                      {santri?.nama || user?.nama || "Santri"}
                    </h3>

                    <p className="truncate text-xs font-semibold text-emerald-100/70">
                      {santri?.jenjang === "Takhassus"
                        ? santri?.jenjang
                        : `${santri?.jenjang || "-"} ${santri?.kelas || ""}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-yellow-400/10 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-yellow-300">
                    Periode Otomatis
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    {filterSemester}
                  </h2>

                  <p className="mt-1 text-sm font-black text-yellow-300">
                    Tahun Ajaran {filterTahunAjaran}
                  </p>

                  <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-100/70">
                    Semester dan tahun ajaran dihitung otomatis dari bulan
                    berjalan.
                  </p>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                icon={<FaClipboardList />}
                label="Total Nilai"
                value={ringkasan.totalNilai || 0}
                desc="Nilai tercatat"
              />

              <StatCard
                icon={<FaChartLine />}
                label="Rata-rata"
                value={ringkasan.rataRata || 0}
                desc="Nilai keseluruhan"
                tone="green"
              />

              <StatCard
                icon={<FaAward />}
                label="Tertinggi"
                value={ringkasan.nilaiTertinggi || 0}
                desc="Pencapaian terbaik"
                tone="blue"
              />

              <StatCard
                icon={<FaBookOpen />}
                label="Mapel"
                value={ringkasan.totalMapel || 0}
                desc="Mata pelajaran"
              />
            </section>

            {/* RINGKASAN PERIODE */}
            <section className="mb-5 grid gap-3 lg:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-wide text-green-200">
                  Nilai Baik
                </p>
                <h3 className="mt-1 text-3xl font-black text-white">
                  {nilaiLulus}
                </h3>
                <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                  Nilai dengan angka 75 ke atas.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-wide text-yellow-300">
                  Perlu Ditingkatkan
                </p>
                <h3 className="mt-1 text-3xl font-black text-white">
                  {nilaiPerluDitingkatkan}
                </h3>
                <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                  Nilai di bawah 75.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-wide text-green-200">
                  Hasil Filter
                </p>
                <h3 className="mt-1 text-3xl font-black text-white">
                  {filteredNilai.length}
                </h3>
                <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                  Data nilai yang sedang tampil.
                </p>
              </div>
            </section>

            {/* FILTER */}
            <section className="mb-5 rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                    <FaFilter />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-white">
                      Filter Nilai
                    </h2>
                    <p className="text-xs font-semibold text-emerald-100/70">
                      Cari berdasarkan mapel, jenis nilai, guru, atau kelas.
                    </p>
                  </div>
                </div>

                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetFilter}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                  >
                    <FaUndo />
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(150px,190px)_minmax(150px,190px)_minmax(150px,180px)_minmax(140px,170px)]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/10 px-12 py-3 text-sm font-bold text-white outline-none placeholder:text-emerald-100/40 focus:border-yellow-400"
                    placeholder="Cari mapel, nilai, guru, kelas..."
                  />
                </div>

                <select
                  value={filterMapel}
                  onChange={(e) => setFilterMapel(e.target.value)}
                  className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-3 text-sm font-bold text-white outline-none focus:border-yellow-400"
                >
                  <option value="">Semua mapel</option>
                  {mapelOptions.map((mapel) => (
                    <option key={mapel} value={mapel}>
                      {mapel}
                    </option>
                  ))}
                </select>

                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-3 text-sm font-bold text-white outline-none focus:border-yellow-400"
                >
                  <option value="">Semua jenis</option>
                  {jenisOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={`Semester ${filterSemester}`}
                  readOnly
                  className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-yellow-300 outline-none"
                />

                <input
                  type="text"
                  value={filterTahunAjaran}
                  readOnly
                  className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-yellow-300 outline-none"
                />
              </div>
            </section>

            {/* LIST NILAI */}
            <section className="rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Daftar Nilai Berdasarkan Mapel
                  </h2>

                  <p className="text-sm font-semibold text-emerald-100/70">
                    Menampilkan {groupedByMapel.length} mapel dan{" "}
                    {filteredNilai.length} nilai.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {loading && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-300">
                      <FaSpinner className="animate-spin" />
                      Memuat data...
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openAllMapel}
                    className="rounded-xl bg-yellow-400 px-4 py-2 text-xs font-black text-emerald-950 transition hover:bg-yellow-300"
                  >
                    Buka Semua
                  </button>

                  <button
                    type="button"
                    onClick={closeAllMapel}
                    className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:bg-white/20"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              {groupedByMapel.length > 0 ? (
                <div className="space-y-4">
                  {groupedByMapel.map((group) => {
                    const isOpen = !!openMapel[group.mapel];

                    const rataMapel =
                      group.nilai.length > 0
                        ? Math.round(
                            group.nilai.reduce(
                              (sum, item) => sum + Number(item.nilai || 0),
                              0
                            ) / group.nilai.length
                          )
                        : 0;

                    const nilaiTertinggiMapel =
                      group.nilai.length > 0
                        ? Math.max(
                            ...group.nilai.map((item) =>
                              Number(item.nilai || 0)
                            )
                          )
                        : 0;

                    return (
                      <div
                        key={group.mapel}
                        className="overflow-hidden rounded-[26px] border border-white/10 bg-white/10 shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMapel(group.mapel)}
                          className="flex w-full flex-col gap-4 p-4 text-left transition hover:bg-white/10 lg:flex-row lg:items-center lg:justify-between"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-lg text-emerald-950">
                              <FaBookOpen />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-white">
                                {group.mapel}
                              </h3>

                              <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                                {group.nilai.length} data nilai • Rata-rata{" "}
                                {rataMapel} • Tertinggi {nilaiTertinggiMapel}
                              </p>

                              <p className="mt-1 text-xs font-bold text-yellow-300">
                                Klik untuk melihat detail nilai mapel ini.
                              </p>
                            </div>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-yellow-300 shadow-sm">
                            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-white/10 bg-white/5 p-4">
                            <div className="grid gap-4">
                              {group.nilai.map((item) => (
                                <NilaiCard
                                  key={item.id}
                                  item={item}
                                  santri={santri}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="Nilai belum tersedia"
                  desc="Nilai akan muncul setelah guru menginput nilai santri dari halaman guru pada semester dan tahun ajaran aktif."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}