"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaAward,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaFilter,
  FaGraduationCap,
  FaLeaf,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaStar,
  FaSyncAlt,
  FaUserGraduate,
} from "react-icons/fa";

import SidebarSantri from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SEMESTER_OPTIONS = ["Ganjil", "Genap"];

function getDefaultTahunAjaran() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 7) {
    return `${year}/${year + 1}`;
  }

  return `${year - 1}/${year}`;
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

function StatCard({ icon, label, value, desc }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-400/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-xl text-emerald-950">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-green-200">{label}</p>
          <h3 className="mt-1 truncate text-3xl font-black text-white">
            {value}
          </h3>
          <p className="mt-1 text-xs leading-snug text-emerald-100/70">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-[34px] border border-dashed border-white/15 bg-white/10 p-10 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-yellow-400 text-4xl text-emerald-950 shadow-sm">
        <FaClipboardList />
      </div>

      <h3 className="mt-5 text-2xl font-black text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-100/70">
        {desc}
      </p>
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
  const [filterSemester, setFilterSemester] = useState("Ganjil");
const [filterTahunAjaran, setFilterTahunAjaran] = useState(
  getDefaultTahunAjaran()
);

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
  if (user?.id) {
    fetchNilai(user);
  }
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
      setErrorMessage(error.message);
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

  const semesterOptions = useMemo(() => {
    const set = new Set();

    nilaiList.forEach((item) => {
      if (item.semester) set.add(item.semester);
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
      if (filterSemester && item.semester !== filterSemester) return false;

      return true;
    });
  }, [nilaiList, search, filterMapel, filterJenis, filterSemester]);

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
        <div className="relative min-h-screen w-full overflow-hidden px-4 py-6 sm:px-5 lg:px-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),linear-gradient(135deg,#07150F_0%,#0B2A1B_48%,#07150F_100%)]" />
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
            <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-none">
            {errorMessage && (
              <div className="mb-5 rounded-[28px] border border-red-400/30 bg-red-500/10 p-5 text-red-100">
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

            <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>

                <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
                  <FaLeaf />
                  Santri Grade Report
                </div>

                <h1 className="mt-5 text-[clamp(2.3rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.06em] text-white">
                  Nilai
                  <span className="block text-yellow-400">Saya.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-emerald-100/75 sm:text-base">
                  Assalamu’alaikum,{" "}
                  <span className="font-black text-yellow-300">
                    {santri?.nama || user?.nama || "Santri"}
                  </span>
                  . Di halaman ini kamu dapat melihat nilai yang sudah diinput
                  oleh guru.
                </p>
              </div>

              <div className="rounded-[34px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl lg:w-[380px]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-emerald-950">
                    <FaUserGraduate />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-green-200">
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
              </div>
            </section>

            <section className="mb-7 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl lg:p-9">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

                <div className="relative z-10">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                    <FaQuran />
                    Rekap Pembelajaran
                  </p>

                  <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Pantau perkembangan nilai dengan lebih mudah.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-100/75">
                    Nilai akan tampil setelah guru menginput data nilai dari
                    halaman guru.
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchNilai()}
                    disabled={loading}
                    className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:opacity-70"
                  >
                    Refresh Nilai
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <div className="rounded-[42px] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950">
                  <FaChartLine />
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-green-200">
                  Rata-rata Nilai
                </p>

                <h3 className="mt-2 text-5xl font-black leading-tight text-white">
                  {ringkasan.rataRata || 0}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">
                  Rata-rata nilai pada semester {filterSemester} tahun ajaran{" "}
{filterTahunAjaran || "-"}.
                </p>
              </div>
            </section>

            <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
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
              />

              <StatCard
                icon={<FaAward />}
                label="Nilai Tertinggi"
                value={ringkasan.nilaiTertinggi || 0}
                desc="Pencapaian terbaik"
              />

              <StatCard
                icon={<FaBookOpen />}
                label="Mapel"
                value={ringkasan.totalMapel || 0}
                desc="Mata pelajaran"
              />
            </section>

            <section className="mb-7 rounded-[34px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                  <FaFilter />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    Filter Nilai
                  </h2>
                  <p className="text-sm text-emerald-100/70">
                    Cari berdasarkan mapel, jenis nilai, semester, atau guru.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_190px_190px_190px_190px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-sm font-bold text-white outline-none placeholder:text-emerald-100/40 focus:border-yellow-400"
                    placeholder="Cari nilai..."
                  />
                </div>

                <select
                  value={filterMapel}
                  onChange={(e) => setFilterMapel(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-4 text-sm font-bold text-white outline-none focus:border-yellow-400"
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
                  className="rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-4 text-sm font-bold text-white outline-none focus:border-yellow-400"
                >
                  <option value="">Semua jenis</option>
                  {jenisOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>

                <select
  value={filterSemester}
  onChange={(e) => setFilterSemester(e.target.value)}
  className="rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-4 text-sm font-bold text-white outline-none focus:border-yellow-400"
>
  {SEMESTER_OPTIONS.map((semester) => (
    <option key={semester} value={semester}>
      Semester {semester}
    </option>
  ))}
</select>

<input
  type="text"
  value={filterTahunAjaran}
  onChange={(e) => setFilterTahunAjaran(e.target.value)}
  className="rounded-2xl border border-white/10 bg-[#0B2A1B] px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-emerald-100/40 focus:border-yellow-400"
  placeholder="2025/2026"
/>
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Daftar Nilai
                  </h2>
                  <p className="text-sm text-emerald-100/70">
                    Menampilkan {filteredNilai.length} nilai semester {filterSemester} tahun ajaran{" "}
{filterTahunAjaran || "-"}.
                  </p>
                </div>

                {loading && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-300">
                    <FaSpinner className="animate-spin" />
                    Memuat data...
                  </div>
                )}
              </div>

              {filteredNilai.length > 0 ? (
                <div className="grid gap-4">
                  {filteredNilai.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[30px] border border-white/10 bg-white p-5 text-emerald-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-4 py-1 text-xs font-black uppercase ${getNilaiClass(
                                item.nilai
                              )}`}
                            >
                              Nilai {item.nilai}
                            </span>

                            <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-black uppercase text-emerald-700">
                              Predikat {getPredikat(item.nilai)}
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-black text-emerald-950">
                            {item.mapel || "Mata Pelajaran"}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            {item.jenis_nilai || "Jenis nilai"} •{" "}
                            {item.semester || "-"} •{" "}
                            {item.tahun_ajaran || "-"}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            Guru: {item.guru?.nama || "Guru"} • Kelas:{" "}
                            {item.kelas?.nama_kelas || santri?.kelas || "-"}
                          </p>

                          <p className="mt-2 text-xs font-bold text-slate-400">
                            Diinput pada {formatTanggal(item.created_at)}
                          </p>

                          {item.keterangan && (
                            <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-slate-600">
                              {item.keterangan}
                            </div>
                          )}
                        </div>

                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-emerald-950 text-center text-white">
                          <div>
                            <FaStar className="mx-auto mb-1 text-yellow-400" />
                            <p className="text-3xl font-black">{item.nilai}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Nilai belum tersedia"
                  desc="Nilai akan muncul setelah guru menginput nilai santri dari halaman guru."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}