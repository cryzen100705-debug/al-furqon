import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaLayerGroup,
  FaLeaf,
  FaMapMarkerAlt,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaUndo,
  FaUserGraduate,
} from "react-icons/fa";

import SidebarGuru from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const HARI_OPTIONS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const ORDER_HARI = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
  Minggu: 7,
};

function getTodayName() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });
}

function getStatusLabel(status) {
  const value = String(status || "aktif").toLowerCase();

  if (value === "aktif") return "Aktif";
  if (value === "nonaktif") return "Nonaktif";

  return status || "Aktif";
}

function getStatusClass(status) {
  const value = String(status || "aktif").toLowerCase();

  if (value === "aktif") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (value === "nonaktif") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
}

function StatCard({ icon, label, value, desc, tone = "emerald" }) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : tone === "sky"
      ? "bg-sky-100 text-sky-700"
      : tone === "red"
      ? "bg-red-100 text-red-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">
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
        <FaCalendarAlt />
      </div>

      <h3 className="mt-4 text-xl font-black text-emerald-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

function JadwalItem({ item, today }) {
  const isToday =
    String(item.hari || "").toLowerCase() === String(today || "").toLowerCase();

  return (
    <div
      className={`rounded-[22px] border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        isToday
          ? "border-amber-200 bg-amber-50"
          : "border-emerald-100 bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black ${
                isToday
                  ? "border-amber-300 bg-amber-300 text-emerald-950"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <FaCalendarAlt />
              {item.hari || "Hari belum diatur"}
            </span>

            {isToday && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-black text-white">
                <FaCheckCircle />
                Hari Ini
              </span>
            )}

            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusClass(
                item.status
              )}`}
            >
              {getStatusLabel(item.status)}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-black text-emerald-950">
            {item.nama_mapel || "Mata Pelajaran"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {item.kelas?.nama_kelas || "Kelas belum ditentukan"}
          </p>
        </div>

        <div className="w-fit rounded-2xl bg-emerald-700 px-4 py-3 text-white">
          <p className="text-[11px] font-bold text-emerald-100">Waktu</p>
          <p className="mt-1 text-base font-black">
            {item.jam_mulai || "--:--"} - {item.jam_selesai || "--:--"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <FaLayerGroup />
            Jenjang
          </p>

          <p className="mt-1 text-sm font-black text-emerald-950">
            {item.kelas?.jenjang || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <FaUserGraduate />
            Kelas
          </p>

          <p className="mt-1 text-sm font-black text-emerald-950">
            {item.kelas?.tingkat || "-"}{" "}
            {item.kelas?.jurusan ? item.kelas.jurusan : ""}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <FaMapMarkerAlt />
            Ruang
          </p>

          <p className="mt-1 text-sm font-black text-emerald-950">
            {item.ruang || item.ruang_detail?.nama_ruang || "Belum diatur"}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <FaClock />
            Jam/Minggu
          </p>

          <p className="mt-1 text-sm font-black text-emerald-950">
            {item.jam_per_minggu || "-"} jam
          </p>
        </div>
      </div>

      {item.keterangan && (
        <div className="mt-3 rounded-2xl border border-emerald-100 bg-white p-3 text-sm font-semibold leading-relaxed text-slate-600">
          {item.keterangan}
        </div>
      )}
    </div>
  );
}

export default function GuruJadwalPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [guru, setGuru] = useState(null);
  const [jadwalList, setJadwalList] = useState([]);

  const [search, setSearch] = useState("");
  const [filterHari, setFilterHari] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openHari, setOpenHari] = useState({});

  const today = useMemo(() => getTodayName(), []);

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
      fetchJadwal(user);
    }
  }, [user]);

  const fetchJadwal = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/api/guru/jadwal/${currentUser.id}`, {
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
        throw new Error(result.message || "Gagal mengambil jadwal guru.");
      }

      setGuru(result.data?.guru || null);
      setJadwalList(result.data?.jadwal || []);
    } catch (error) {
      setErrorMessage(error.message);
      setGuru({
        nama: currentUser.nama,
        users: {
          email: currentUser.email,
        },
      });
      setJadwalList([]);
    } finally {
      setLoading(false);
    }
  };

  const jadwalHariIni = useMemo(() => {
    return jadwalList.filter(
      (item) =>
        String(item.hari || "").toLowerCase() ===
        String(today || "").toLowerCase()
    );
  }, [jadwalList, today]);

  const totalKelas = useMemo(() => {
    const map = new Map();

    jadwalList.forEach((item) => {
      if (item.kelas?.id) {
        map.set(item.kelas.id, item.kelas);
      }
    });

    return map.size;
  }, [jadwalList]);

  const totalMapel = useMemo(() => {
    const map = new Map();

    jadwalList.forEach((item) => {
      if (item.nama_mapel) {
        map.set(String(item.nama_mapel).toLowerCase(), item.nama_mapel);
      }
    });

    return map.size;
  }, [jadwalList]);

  const filteredJadwal = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...jadwalList]
      .filter((item) => {
        const text = [
          item.nama_mapel,
          item.hari,
          item.jam_mulai,
          item.jam_selesai,
          item.ruang,
          item.ruang_detail?.nama_ruang,
          item.kelas?.nama_kelas,
          item.kelas?.jenjang,
          item.kelas?.tingkat,
          item.kelas?.jurusan,
          item.status,
        ]
          .join(" ")
          .toLowerCase();

        if (keyword && !text.includes(keyword)) return false;
        if (filterHari && item.hari !== filterHari) return false;

        if (
          filterStatus &&
          String(item.status || "aktif").toLowerCase() !== filterStatus
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const hariA = ORDER_HARI[a.hari] || 99;
        const hariB = ORDER_HARI[b.hari] || 99;

        if (hariA !== hariB) return hariA - hariB;

        return String(a.jam_mulai || "").localeCompare(
          String(b.jam_mulai || "")
        );
      });
  }, [jadwalList, search, filterHari, filterStatus]);

  const groupedByHari = useMemo(() => {
    const map = new Map();

    filteredJadwal.forEach((item) => {
      const hari = item.hari || "Belum Diatur";

      if (!map.has(hari)) {
        map.set(hari, {
          hari,
          jadwal: [],
        });
      }

      map.get(hari).jadwal.push(item);
    });

    return Array.from(map.values()).sort((a, b) => {
      const hariA = ORDER_HARI[a.hari] || 99;
      const hariB = ORDER_HARI[b.hari] || 99;

      return hariA - hariB;
    });
  }, [filteredJadwal]);

  const jadwalAktif = jadwalList.filter(
    (item) => String(item.status || "aktif").toLowerCase() === "aktif"
  ).length;

  const jadwalNonaktif = jadwalList.filter(
    (item) => String(item.status || "aktif").toLowerCase() === "nonaktif"
  ).length;

  const hasActiveFilter = search || filterHari || filterStatus;

  const toggleHari = (hari) => {
    setOpenHari((prev) => ({
      ...prev,
      [hari]: !prev[hari],
    }));
  };

  const openAllHari = () => {
    const next = {};

    groupedByHari.forEach((group) => {
      next[group.hari] = true;
    });

    setOpenHari(next);
  };

  const closeAllHari = () => {
    setOpenHari({});
  };

  const resetFilter = () => {
    setSearch("");
    setFilterHari("");
    setFilterStatus("");
    setOpenHari({});
  };

  useEffect(() => {
    if (groupedByHari.length > 0) {
      setOpenHari((prev) => ({
        ...prev,
        [today]: true,
      }));
    }
  }, [groupedByHari.length, today]);

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
                    <p className="font-black">Jadwal belum terhubung penuh</p>
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
                    Teacher Schedule
                  </div>

                  <h1 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.95] tracking-[-0.055em]">
                    Jadwal Mengajar
                    <span className="block text-amber-300">Mingguan.</span>
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-emerald-50/85">
                    Assalamu’alaikum,{" "}
                    <span className="font-black text-amber-200">
                      {guru?.nama || user?.nama || user?.email}
                    </span>
                    . Pantau jadwal mengajar berdasarkan hari, kelas, ruang, dan
                    mata pelajaran.
                  </p>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => fetchJadwal()}
                      disabled={loading}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 text-xs font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-70"
                    >
                      Refresh Jadwal
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterHari(today)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20"
                    >
                      Jadwal Hari Ini
                      <FaCheckCircle />
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
                    Hari Ini
                  </p>

                  <h2 className="mt-1 text-3xl font-black text-emerald-950">
                    {today}
                  </h2>

                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                    {jadwalHariIni.length > 0
                      ? `Ada ${jadwalHariIni.length} jadwal mengajar hari ini.`
                      : "Tidak ada jadwal mengajar hari ini."}
                  </p>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-5">
              <StatCard
                icon={<FaCalendarAlt />}
                label="Hari Ini"
                value={jadwalHariIni.length}
                desc="Jadwal hari ini"
                tone="amber"
              />

              <StatCard
                icon={<FaClock />}
                label="Total"
                value={jadwalList.length}
                desc="Semua jadwal"
                tone="sky"
              />

              <StatCard
                icon={<FaLayerGroup />}
                label="Kelas"
                value={totalKelas}
                desc="Kelas diajar"
              />

              <StatCard
                icon={<FaBookOpen />}
                label="Mapel"
                value={totalMapel}
                desc="Mapel terkait"
              />

              <StatCard
                icon={<FaCheckCircle />}
                label="Aktif"
                value={jadwalAktif}
                desc={`Nonaktif: ${jadwalNonaktif}`}
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
                      Filter Jadwal
                    </h2>

                    <p className="text-xs font-semibold text-slate-500">
                      Menampilkan {filteredJadwal.length} dari{" "}
                      {jadwalList.length} jadwal.
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

              <div className="grid gap-3 lg:grid-cols-[1fr_220px_200px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-3 text-sm font-bold text-emerald-950 outline-none transition placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white"
                    placeholder="Cari mapel, kelas, ruang, hari..."
                  />
                </div>

                <select
                  value={filterHari}
                  onChange={(e) => setFilterHari(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua hari</option>
                  {HARI_OPTIONS.map((hari) => (
                    <option key={hari} value={hari}>
                      {hari}
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
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </section>

            {/* LIST */}
            <section className="rounded-[30px] border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Jadwal Berdasarkan Hari
                  </h2>

                  <p className="text-sm font-semibold text-slate-500">
                    Jadwal dikelompokkan agar mudah dibaca per hari.
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
                    onClick={openAllHari}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-800"
                  >
                    Buka Semua
                  </button>

                  <button
                    type="button"
                    onClick={closeAllHari}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              {groupedByHari.length > 0 ? (
                <div className="space-y-4">
                  {groupedByHari.map((group) => {
                    const isOpen = !!openHari[group.hari];

                    const isToday =
                      String(group.hari || "").toLowerCase() ===
                      String(today || "").toLowerCase();

                    return (
                      <div
                        key={group.hari}
                        className={`overflow-hidden rounded-[26px] border shadow-sm ${
                          isToday
                            ? "border-amber-200 bg-amber-50"
                            : "border-emerald-100 bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleHari(group.hari)}
                          className="flex w-full flex-col gap-4 p-4 text-left transition hover:bg-emerald-50 lg:flex-row lg:items-center lg:justify-between"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg ${
                                isToday
                                  ? "bg-amber-300 text-emerald-950"
                                  : "bg-emerald-700 text-white"
                              }`}
                            >
                              <FaCalendarAlt />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-black text-emerald-950">
                                  {group.hari}
                                </h3>

                                {isToday && (
                                  <span className="rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-black text-white">
                                    Hari Ini
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {group.jadwal.length} jadwal mengajar
                              </p>
                            </div>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-emerald-100 bg-white p-4">
                            <div className="grid gap-4">
                              {group.jadwal.map((item) => (
                                <JadwalItem
                                  key={item.id}
                                  item={item}
                                  today={today}
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
                  title="Jadwal belum ditemukan"
                  desc="Jika jadwal kosong, pastikan admin sudah membuat data kelas dan memilih guru ini pada bagian mapel."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}