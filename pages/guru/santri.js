import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaIdCard,
  FaInfoCircle,
  FaLayerGroup,
  FaLeaf,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTimesCircle,
  FaUndo,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
  FaVenusMars,
} from "react-icons/fa";

import SidebarGuru from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

function getStatusClass(status) {
  const lower = String(status || "").toLowerCase();

  if (lower === "aktif" || lower === "diterima") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (lower === "pending" || lower === "menunggu") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (lower === "ditolak" || lower === "nonaktif") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getStatusLabel(status) {
  const lower = String(status || "").toLowerCase();

  if (lower === "diterima") return "Aktif";
  if (!status) return "Aktif";

  return status;
}

function isAktifStatus(status) {
  const lower = String(status || "").toLowerCase();
  return lower === "aktif" || lower === "diterima";
}

function isPendingStatus(status) {
  const lower = String(status || "").toLowerCase();
  return lower === "pending" || lower === "menunggu";
}

function isNonaktifStatus(status) {
  const lower = String(status || "").toLowerCase();
  return lower === "ditolak" || lower === "nonaktif";
}

function StatCard({ icon, label, value, desc, tone = "emerald" }) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : tone === "red"
      ? "bg-red-100 text-red-700"
      : tone === "sky"
      ? "bg-sky-100 text-sky-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative z-10 flex min-w-0 items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg ${toneClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-wide text-emerald-700">
            {label}
          </p>

          <h3 className="mt-1 truncate text-2xl font-black leading-none text-emerald-950">
            {value}
          </h3>

          <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-500">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-3xl text-emerald-700 shadow-sm">
        <FaUserGraduate />
      </div>

      <h3 className="mt-4 text-xl font-black text-emerald-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

function InfoBox({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-emerald-950">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function SantriCard({ santri }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-100 blur-2xl transition group-hover:bg-amber-100" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-black text-white">
              {String(santri.nama || "S").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-xl font-black text-emerald-950">
                  {santri.nama || "Nama Santri"}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase ${getStatusClass(
                    santri.status
                  )}`}
                >
                  {getStatusLabel(santri.status)}
                </span>
              </div>

              <p className="mt-1 text-xs font-bold text-slate-500">
                {santri.kelas_detail?.nama_kelas ||
                  `${santri.jenjang || "-"} Kelas ${santri.kelas || "-"}`}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                ID Santri: {santri.id || "-"}
              </p>
            </div>
          </div>

          <div className="w-fit rounded-2xl bg-amber-100 px-4 py-2 text-xs font-black text-emerald-950">
            {santri.jenjang || "-"}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
              <FaIdCard />
              NISN
            </p>

            <p className="mt-1 break-words text-sm font-black text-emerald-950">
              {santri.nisn || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
              <FaVenusMars />
              Gender
            </p>

            <p className="mt-1 text-sm font-black text-emerald-950">
              {santri.jenis_kelamin || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
              <FaCalendarAlt />
              Lahir
            </p>

            <p className="mt-1 text-sm font-black text-emerald-950">
              {santri.tempat_lahir || "-"},{" "}
              {formatTanggal(santri.tanggal_lahir)}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
              <FaPhoneAlt />
              Wali
            </p>

            <p className="mt-1 break-words text-sm font-black text-emerald-950">
              {santri.no_hp_wali || santri.no_hp || "Belum diisi"}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-3">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
              <FaUserShield />
              Orang Tua / Wali
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              {santri.nama_wali || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-3">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
              <FaMapMarkerAlt />
              Alamat
            </p>

            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-600">
              {santri.alamat || "Belum diisi"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuruSantriPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [guru, setGuru] = useState(null);
  const [kelasSaya, setKelasSaya] = useState([]);
  const [santriList, setSantriList] = useState([]);
  const [ringkasan, setRingkasan] = useState({
    totalKelas: 0,
    totalSantri: 0,
    santriAktif: 0,
    santriPending: 0,
    santriDitolak: 0,
  });

  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openKelas, setOpenKelas] = useState({});

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

    if (parsedUser.role !== "guru") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    setChecking(false);
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      fetchSantri(user);
    }
  }, [user]);

  const fetchSantri = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/api/guru/santri/${currentUser.id}`, {
        method: "GET",
        headers: {
          "x-user-id": currentUser.id,
        },
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan Express aktif."
        );
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data santri guru.");
      }

      setGuru(result.data?.guru || null);
      setKelasSaya(result.data?.kelasSaya || []);
      setSantriList(result.data?.santri || []);
      setRingkasan(
        result.data?.ringkasan || {
          totalKelas: 0,
          totalSantri: 0,
          santriAktif: 0,
          santriPending: 0,
          santriDitolak: 0,
        }
      );
    } catch (error) {
      setErrorMessage(error.message);
      setGuru({
        nama: currentUser.nama,
        users: {
          email: currentUser.email,
        },
      });
      setKelasSaya([]);
      setSantriList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSantri = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return santriList.filter((santri) => {
      const text = [
        santri.nama,
        santri.nisn,
        santri.jenjang,
        santri.kelas,
        santri.status,
        santri.jenis_kelamin,
        santri.nama_wali,
        santri.no_hp_wali,
        santri.no_hp,
        santri.alamat,
        santri.kelas_detail?.nama_kelas,
      ]
        .join(" ")
        .toLowerCase();

      if (keyword && !text.includes(keyword)) return false;

      if (filterKelas && santri.kelas_detail?.id !== filterKelas) {
        return false;
      }

      if (filterStatus) {
        const status = String(santri.status || "").toLowerCase();

        if (filterStatus === "aktif" && !isAktifStatus(status)) return false;
        if (filterStatus === "pending" && !isPendingStatus(status)) return false;
        if (filterStatus === "nonaktif" && !isNonaktifStatus(status)) {
          return false;
        }
      }

      return true;
    });
  }, [santriList, search, filterKelas, filterStatus]);

  const groupedByKelas = useMemo(() => {
    const map = new Map();

    filteredSantri.forEach((santri) => {
      const kelasId =
        santri.kelas_detail?.id ||
        santri.kelas_detail?.nama_kelas ||
        santri.kelas ||
        "tanpa-kelas";

      const namaKelas =
        santri.kelas_detail?.nama_kelas ||
        `${santri.jenjang || "-"} Kelas ${santri.kelas || "-"}` ||
        "Tanpa Kelas";

      if (!map.has(kelasId)) {
        map.set(kelasId, {
          id: kelasId,
          nama_kelas: namaKelas,
          jenjang: santri.kelas_detail?.jenjang || santri.jenjang || "-",
          tingkat: santri.kelas_detail?.tingkat || santri.kelas || "-",
          jurusan: santri.kelas_detail?.jurusan || "",
          santri: [],
        });
      }

      map.get(kelasId).santri.push(santri);
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.nama_kelas || "").localeCompare(String(b.nama_kelas || ""))
    );
  }, [filteredSantri]);

  const totalAktifFilter = filteredSantri.filter((item) =>
    isAktifStatus(item.status)
  ).length;

  const totalPendingFilter = filteredSantri.filter((item) =>
    isPendingStatus(item.status)
  ).length;

  const totalNonaktifFilter = filteredSantri.filter((item) =>
    isNonaktifStatus(item.status)
  ).length;

  const hasActiveFilter = search || filterKelas || filterStatus;

  const toggleKelas = (kelasId) => {
    setOpenKelas((prev) => ({
      ...prev,
      [kelasId]: !prev[kelasId],
    }));
  };

  const openAllKelas = () => {
    const next = {};

    groupedByKelas.forEach((kelas) => {
      next[kelas.id] = true;
    });

    setOpenKelas(next);
  };

  const closeAllKelas = () => {
    setOpenKelas({});
  };

  const resetFilter = () => {
    setSearch("");
    setFilterKelas("");
    setFilterStatus("");
    setOpenKelas({});
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4E8] text-emerald-950">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-emerald-700" />
          <p className="font-black">Memeriksa akses guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F4E8] text-emerald-950">
      <SidebarGuru
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`
          min-h-screen w-full overflow-x-hidden transition-all duration-300
          pt-16 md:pt-0
          ${
            collapsed
              ? "md:ml-[92px] md:w-[calc(100%-92px)]"
              : "md:ml-[272px] md:w-[calc(100%-272px)]"
          }
        `}
      >
        <div className="relative min-h-screen w-full overflow-hidden px-3 py-4 sm:px-5 lg:px-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#F8F4E8_0%,#ECFDF5_45%,#FFFBEB_100%)]" />
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-none">
            {errorMessage && (
              <div className="mb-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 shrink-0" />
                  <div>
                    <p className="font-black">
                      Data santri belum terhubung penuh
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HEADER */}
            <section className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="relative overflow-hidden rounded-[30px] bg-emerald-800 p-5 text-white shadow-xl lg:p-6">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                    <FaLeaf />
                    Student Guidance
                  </div>

                  <h1 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.95] tracking-[-0.055em]">
                    Data Santri
                    <span className="block text-amber-300">Per Kelas.</span>
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-emerald-50/85">
                    Assalamu’alaikum,{" "}
                    <span className="font-black text-amber-200">
                      {guru?.nama || user?.nama || user?.email}
                    </span>
                    . Lihat data santri berdasarkan kelas agar lebih mudah
                    dipantau, dicari, dan dibimbing.
                  </p>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => fetchSantri()}
                      disabled={loading}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 text-xs font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-70"
                    >
                      Refresh Data
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    </button>

                    <button
                      type="button"
                      onClick={openAllKelas}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                    >
                      Buka Semua Kelas
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

              <div className="rounded-[30px] border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white">
                    <FaChalkboardTeacher />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                      Guru Pengajar
                    </p>

                    <h3 className="mt-1 truncate text-lg font-black text-emerald-950">
                      {guru?.nama || user?.nama || "Guru"}
                    </h3>

                    <p className="truncate text-xs font-semibold text-slate-500">
                      {guru?.mapel || "Mata pelajaran belum diisi"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                    Total Santri
                  </p>

                  <h2 className="mt-1 text-4xl font-black text-emerald-950">
                    {ringkasan.totalSantri || 0}
                  </h2>

                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                    Santri yang terhubung dengan kelas dan jadwal mengajar guru.
                  </p>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-5">
              <StatCard
                icon={<FaLayerGroup />}
                label="Kelas"
                value={ringkasan.totalKelas || 0}
                desc="Kelas terhubung"
              />

              <StatCard
                icon={<FaUsers />}
                label="Total"
                value={ringkasan.totalSantri || 0}
                desc="Semua santri"
                tone="sky"
              />

              <StatCard
                icon={<FaCheckCircle />}
                label="Aktif"
                value={ringkasan.santriAktif || 0}
                desc="Santri aktif"
              />

              <StatCard
                icon={<FaClock />}
                label="Pending"
                value={ringkasan.santriPending || 0}
                desc="Perlu pengecekan"
                tone="amber"
              />

              <StatCard
                icon={<FaTimesCircle />}
                label="Nonaktif"
                value={ringkasan.santriDitolak || 0}
                desc="Ditolak/nonaktif"
                tone="red"
              />
            </section>

            {/* INFORMASI SINGKAT */}
            <section className="mb-5 grid gap-3 lg:grid-cols-3">
              <InfoBox
                icon={<FaInfoCircle />}
                title="Cara menggunakan"
                desc="Pilih kelas untuk membuka daftar santri di dalamnya. Gunakan pencarian jika ingin menemukan santri tertentu."
              />

              <InfoBox
                icon={<FaFilter />}
                title="Filter cepat"
                desc="Filter dapat digunakan berdasarkan kelas dan status agar data lebih mudah dibaca."
              />

              <InfoBox
                icon={<FaQuran />}
                title="Fokus bimbingan"
                desc="Data ini membantu guru mengenali santri, wali, alamat, status, dan identitas dasar santri."
              />
            </section>

            {/* FILTER */}
            <section className="mb-5 rounded-[28px] border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <FaFilter />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-emerald-950">
                      Filter Santri
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      Menampilkan {filteredSantri.length} dari{" "}
                      {santriList.length} santri.
                    </p>
                  </div>
                </div>

                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetFilter}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    <FaUndo />
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_240px_220px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-3 text-sm font-bold text-emerald-950 outline-none transition placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white"
                    placeholder="Cari nama, NISN, wali, kelas, alamat..."
                  />
                </div>

                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua kelas</option>
                  {kelasSaya.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.nama_kelas}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="pending">Pending</option>
                  <option value="nonaktif">Nonaktif/Ditolak</option>
                </select>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xs font-black text-emerald-700">
                    Aktif dalam hasil filter
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-950">
                    {totalAktifFilter}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-xs font-black text-amber-700">
                    Pending dalam hasil filter
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-950">
                    {totalPendingFilter}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-3">
                  <p className="text-xs font-black text-red-700">
                    Nonaktif dalam hasil filter
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-950">
                    {totalNonaktifFilter}
                  </p>
                </div>
              </div>
            </section>

            {/* LIST SANTRI */}
            <section className="rounded-[30px] border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Daftar Santri Berdasarkan Kelas
                  </h2>

                  <p className="text-sm font-semibold text-slate-500">
                    Menampilkan {groupedByKelas.length} kelas dan{" "}
                    {filteredSantri.length} santri.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {loading && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                      <FaSpinner className="animate-spin" />
                      Memuat data...
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openAllKelas}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-800"
                  >
                    Buka Semua
                  </button>

                  <button
                    type="button"
                    onClick={closeAllKelas}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              {groupedByKelas.length > 0 ? (
                <div className="space-y-4">
                  {groupedByKelas.map((kelas) => {
                    const isOpen = !!openKelas[kelas.id];

                    const totalSantri = kelas.santri.length;

                    const totalAktif = kelas.santri.filter((item) =>
                      isAktifStatus(item.status)
                    ).length;

                    const totalPending = kelas.santri.filter((item) =>
                      isPendingStatus(item.status)
                    ).length;

                    const totalNonaktif = kelas.santri.filter((item) =>
                      isNonaktifStatus(item.status)
                    ).length;

                    return (
                      <div
                        key={kelas.id}
                        className="overflow-hidden rounded-[26px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => toggleKelas(kelas.id)}
                          className="flex w-full flex-col gap-4 p-4 text-left transition hover:bg-emerald-50 lg:flex-row lg:items-center lg:justify-between"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-lg text-white">
                              <FaLayerGroup />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-emerald-950">
                                {kelas.nama_kelas}
                              </h3>

                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {kelas.jenjang || "-"} • Tingkat{" "}
                                {kelas.tingkat || "-"}
                                {kelas.jurusan ? ` • ${kelas.jurusan}` : ""}
                              </p>

                              <p className="mt-1 text-xs font-bold text-emerald-700">
                                Klik untuk melihat daftar santri kelas ini.
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
                                  Total: {totalSantri}
                                </span>

                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
                                  Aktif: {totalAktif}
                                </span>

                                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-700">
                                  Pending: {totalPending}
                                </span>

                                <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-black text-red-700">
                                  Nonaktif: {totalNonaktif}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-emerald-100 bg-white p-4">
                            <div className="grid gap-4">
                              {kelas.santri.map((santri) => (
                                <SantriCard
                                  key={santri.id}
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
                  title="Santri belum ditemukan"
                  desc="Jika data kosong, pastikan admin sudah memasukkan santri ke kelas dan memilih guru pada jadwal mapel."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}