import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaIdCard,
  FaLayerGroup,
  FaLeaf,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTimesCircle,
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

function StatCard({ icon, label, value, desc }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-[30px] border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative z-10 flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-emerald-700 text-xl text-white">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-emerald-700">
            {label}
          </p>

          <h3 className="mt-1 truncate text-3xl font-black text-emerald-950">
            {value}
          </h3>

          <p className="mt-1 text-xs leading-snug text-slate-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-[34px] border border-dashed border-emerald-200 bg-emerald-50 p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-4xl text-emerald-700 shadow-sm">
        <FaUserGraduate />
      </div>

      <h3 className="mt-5 text-2xl font-black text-emerald-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

function SantriCard({ santri }) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-100 blur-2xl transition group-hover:bg-amber-100" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-emerald-700 text-2xl font-black text-white">
              {String(santri.nama || "S").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-2xl font-black text-emerald-950">
                  {santri.nama || "Nama Santri"}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${getStatusClass(
                    santri.status
                  )}`}
                >
                  {santri.status || "aktif"}
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {santri.kelas_detail?.nama_kelas ||
                  `${santri.jenjang || "-"} Kelas ${santri.kelas || "-"}`}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-emerald-950">
            {santri.jenjang || "-"}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <FaIdCard />
              NISN
            </p>

            <p className="mt-1 font-black text-emerald-950">
              {santri.nisn || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <FaVenusMars />
              Gender
            </p>

            <p className="mt-1 font-black text-emerald-950">
              {santri.jenis_kelamin || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <FaCalendarAlt />
              Lahir
            </p>

            <p className="mt-1 font-black text-emerald-950">
              {santri.tempat_lahir || "-"},{" "}
              {formatTanggal(santri.tanggal_lahir)}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <FaPhoneAlt />
              Wali
            </p>

            <p className="mt-1 font-black text-emerald-950">
              {santri.no_hp_wali || santri.no_hp || "Belum diisi"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
              <FaUserShield />
              Orang Tua / Wali
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              {santri.nama_wali || "Belum diisi"}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
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

      if (
        filterStatus &&
        String(santri.status || "").toLowerCase() !== filterStatus
      ) {
        return false;
      }

      return true;
    });
  }, [santriList, search, filterKelas, filterStatus]);

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
        <div className="relative min-h-screen w-full overflow-hidden px-4 py-6 sm:px-5 lg:px-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#F8F4E8_0%,#ECFDF5_45%,#FFFBEB_100%)]" />
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-none">
            {errorMessage && (
              <div className="mb-5 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-amber-800">
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
            <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>

                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
                  <FaLeaf />
                  Student Guidance
                </div>

                <h1 className="mt-5 text-[clamp(2.3rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.06em] text-emerald-950">
                  Data
                  <span className="block text-amber-500">Santri.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Assalamu’alaikum,{" "}
                  <span className="font-black text-emerald-700">
                    {guru?.nama || user?.nama || user?.email}
                  </span>
                  . Pantau daftar santri yang terhubung dengan kelas dan mata
                  pelajaran yang Anda ajar.
                </p>
              </div>

              <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-sm lg:w-[380px]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-3xl text-white">
                    <FaChalkboardTeacher />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-emerald-700">
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
              </div>
            </section>

            {/* HERO */}
            <section className="mb-7 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[42px] bg-emerald-800 p-7 text-white shadow-xl lg:p-9">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                    <FaQuran />
                    Bimbingan Santri
                  </p>

                  <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Kenali santri yang berada dalam kelas pembelajaran Anda.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/80">
                    Halaman ini membantu guru melihat data santri, kelas,
                    status, wali santri, dan informasi dasar pembelajaran.
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchSantri()}
                    disabled={loading}
                    className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-amber-300 px-6 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-70"
                  >
                    Refresh Data
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <div className="rounded-[42px] border border-emerald-100 bg-white p-7 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-300 text-2xl text-emerald-950">
                  <FaUsers />
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                  Total Santri
                </p>

                <h3 className="mt-2 text-5xl font-black leading-tight text-emerald-950">
                  {ringkasan.totalSantri || 0}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Santri yang terhubung dengan kelas dan jadwal mengajar guru.
                </p>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                icon={<FaLayerGroup />}
                label="Kelas Saya"
                value={ringkasan.totalKelas || 0}
                desc="Kelas terhubung"
              />

              <StatCard
                icon={<FaUsers />}
                label="Total Santri"
                value={ringkasan.totalSantri || 0}
                desc="Santri dalam kelas"
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
              />
            </section>

            {/* KELAS SAYA */}
            <section className="mb-7 rounded-[34px] border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FaLayerGroup />
                </div>

                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Kelas Saya
                  </h2>
                  <p className="text-sm text-slate-500">
                    Kelas yang terhubung dengan jadwal mengajar.
                  </p>
                </div>
              </div>

              {kelasSaya.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {kelasSaya.map((kelas) => (
                    <div
                      key={kelas.id}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                    >
                      <p className="font-black text-emerald-950">
                        {kelas.nama_kelas}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {kelas.jenjang || "-"} • {kelas.tingkat || "-"}{" "}
                        {kelas.jurusan ? `• ${kelas.jurusan}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada kelas"
                  desc="Kelas akan muncul jika admin sudah memilih guru ini pada jadwal mata pelajaran."
                />
              )}
            </section>

            {/* FILTER */}
            <section className="mb-7 rounded-[34px] border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FaFilter />
                </div>

                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Filter Santri
                  </h2>
                  <p className="text-sm text-slate-500">
                    Cari berdasarkan nama, NISN, kelas, status, atau wali.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_260px_220px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-4 text-sm font-bold text-emerald-950 outline-none transition placeholder:text-emerald-700/40 focus:border-emerald-500 focus:bg-white"
                    placeholder="Cari nama santri, NISN, wali, kelas..."
                  />
                </div>

                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
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
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="pending">Pending</option>
                  <option value="ditolak">Ditolak</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </section>

            {/* LIST SANTRI */}
            <section className="rounded-[34px] border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Daftar Santri
                  </h2>

                  <p className="text-sm text-slate-500">
                    Menampilkan {filteredSantri.length} dari{" "}
                    {santriList.length} santri.
                  </p>
                </div>

                {loading && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                    <FaSpinner className="animate-spin" />
                    Memuat data...
                  </div>
                )}
              </div>

              {filteredSantri.length > 0 ? (
                <div className="grid gap-4">
                  {filteredSantri.map((santri) => (
                    <SantriCard key={santri.id} santri={santri} />
                  ))}
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