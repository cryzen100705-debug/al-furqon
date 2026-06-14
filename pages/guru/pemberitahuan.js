import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaBell,
  FaBullhorn,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaFilter,
  FaLeaf,
  FaQuran,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTimesCircle,
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function getBadgeClass(item) {
  const prioritas = String(item.prioritas || "").toLowerCase();
  const kategori = String(item.kategori || "").toLowerCase();

  if (
    prioritas === "penting" ||
    prioritas === "urgent" ||
    kategori === "penting" ||
    kategori === "urgent"
  ) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (kategori === "jadwal") {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }

  if (kategori === "akademik") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-emerald-100 text-emerald-700 border-emerald-200";
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
        <FaBell />
      </div>

      <h3 className="mt-5 text-2xl font-black text-emerald-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

export default function GuruPemberitahuanPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [guru, setGuru] = useState(null);
  const [pemberitahuanList, setPemberitahuanList] = useState([]);
  const [ringkasan, setRingkasan] = useState({
    total: 0,
    belumDibaca: 0,
    sudahDibaca: 0,
    penting: 0,
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

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
      fetchPemberitahuan(user);
    }
  }, [user]);

  const fetchPemberitahuan = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(
        `${API_URL}/api/guru/pemberitahuan/${currentUser.id}`,
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
        throw new Error(
          result.message || "Gagal mengambil pemberitahuan guru."
        );
      }

      setGuru(result.data?.guru || null);
      setPemberitahuanList(result.data?.pemberitahuan || []);
      setRingkasan(
        result.data?.ringkasan || {
          total: 0,
          belumDibaca: 0,
          sudahDibaca: 0,
          penting: 0,
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
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (item) => {
    if (!user?.id || !item?.id || item.is_read) return;

    try {
      setMarkingId(item.id);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(
        `${API_URL}/api/guru/pemberitahuan/${user.id}/${item.id}/read`,
        {
          method: "POST",
          headers: {
            "x-user-id": user.id,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menandai dibaca.");
      }

      setSuccessMessage("Pemberitahuan berhasil ditandai dibaca.");
      fetchPemberitahuan();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setMarkingId("");
    }
  };

  const kategoriOptions = useMemo(() => {
    const set = new Set();

    pemberitahuanList.forEach((item) => {
      if (item.kategori) set.add(item.kategori);
    });

    return Array.from(set);
  }, [pemberitahuanList]);

  const filteredPemberitahuan = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return pemberitahuanList.filter((item) => {
      const text = [
        item.judul,
        item.pesan,
        item.isi,
        item.kategori,
        item.prioritas,
        item.target,
      ]
        .join(" ")
        .toLowerCase();

      if (keyword && !text.includes(keyword)) return false;

      if (filterStatus === "belum" && item.is_read) return false;
      if (filterStatus === "sudah" && !item.is_read) return false;

      if (filterKategori && item.kategori !== filterKategori) return false;

      return true;
    });
  }, [pemberitahuanList, search, filterStatus, filterKategori]);

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
              <div className="mb-5 rounded-[28px] border border-red-200 bg-red-50 p-5 text-red-700">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 shrink-0" />
                  <div>
                    <p className="font-black">Terjadi Kesalahan</p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0" />
                  <div>
                    <p className="font-black">Berhasil</p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {successMessage}
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
                  Teacher Announcement
                </div>

                <h1 className="mt-5 text-[clamp(2.3rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.06em] text-emerald-950">
                  Pemberitahuan
                  <span className="block text-amber-500">Guru.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Assalamu’alaikum,{" "}
                  <span className="font-black text-emerald-700">
                    {guru?.nama || user?.nama || user?.email}
                  </span>
                  . Pantau informasi terbaru dari admin untuk kegiatan
                  pembelajaran dan pesantren.
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
                      {guru?.mapel || "Pemberitahuan akademik"}
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
                    Informasi Pesantren
                  </p>

                  <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Jangan lewatkan arahan penting dari admin pesantren.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/80">
                    Guru dapat membaca informasi kegiatan, jadwal, akademik,
                    dan pemberitahuan penting lainnya.
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchPemberitahuan()}
                    disabled={loading}
                    className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-amber-300 px-6 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-70"
                  >
                    Refresh Info
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <div className="rounded-[42px] border border-emerald-100 bg-white p-7 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-300 text-2xl text-emerald-950">
                  <FaBell />
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                  Belum Dibaca
                </p>

                <h3 className="mt-2 text-5xl font-black leading-tight text-emerald-950">
                  {ringkasan.belumDibaca || 0}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Informasi yang belum dibaca oleh guru.
                </p>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                icon={<FaBullhorn />}
                label="Total Info"
                value={ringkasan.total || 0}
                desc="Semua pemberitahuan"
              />

              <StatCard
                icon={<FaBell />}
                label="Belum Dibaca"
                value={ringkasan.belumDibaca || 0}
                desc="Butuh perhatian"
              />

              <StatCard
                icon={<FaEnvelopeOpenText />}
                label="Sudah Dibaca"
                value={ringkasan.sudahDibaca || 0}
                desc="Sudah dibuka guru"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                label="Penting"
                value={ringkasan.penting || 0}
                desc="Prioritas tinggi"
              />
            </section>

            {/* FILTER */}
            <section className="mb-7 rounded-[34px] border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FaFilter />
                </div>

                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Filter Pemberitahuan
                  </h2>
                  <p className="text-sm text-slate-500">
                    Cari berdasarkan judul, kategori, atau isi informasi.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                    placeholder="Cari pemberitahuan..."
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua status baca</option>
                  <option value="belum">Belum dibaca</option>
                  <option value="sudah">Sudah dibaca</option>
                </select>

                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="">Semua kategori</option>
                  {kategoriOptions.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* LIST */}
            <section className="rounded-[34px] border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Daftar Pemberitahuan
                  </h2>
                  <p className="text-sm text-slate-500">
                    Menampilkan {filteredPemberitahuan.length} dari{" "}
                    {pemberitahuanList.length} pemberitahuan.
                  </p>
                </div>

                {loading && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                    <FaSpinner className="animate-spin" />
                    Memuat data...
                  </div>
                )}
              </div>

              {filteredPemberitahuan.length > 0 ? (
                <div className="grid gap-4">
                  {filteredPemberitahuan.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-[30px] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                        item.is_read
                          ? "border-emerald-100 bg-white"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${getBadgeClass(
                                item
                              )}`}
                            >
                              {item.kategori || item.prioritas || "Info"}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                                item.is_read
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-300 text-emerald-950"
                              }`}
                            >
                              {item.is_read ? "Sudah dibaca" : "Belum dibaca"}
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-black text-emerald-950">
                            {item.judul || "Pemberitahuan"}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            {formatTanggal(item.created_at)}
                          </p>

                          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                            {item.pesan_final || "Tidak ada isi pesan."}
                          </p>
                        </div>

                        {!item.is_read ? (
                          <button
                            type="button"
                            onClick={() => markAsRead(item)}
                            disabled={markingId === item.id}
                            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:opacity-70"
                          >
                            {markingId === item.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}
                            Tandai Dibaca
                          </button>
                        ) : (
                          <div className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-5 text-sm font-black text-emerald-700">
                            <FaCheckCircle />
                            Selesai
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada pemberitahuan"
                  desc="Informasi dari admin untuk guru akan muncul di halaman ini."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}