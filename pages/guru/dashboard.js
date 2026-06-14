import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowRight,
  FaBell,
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaLayerGroup,
  FaLeaf,
  FaPenFancy,
  FaQuran,
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaTasks,
  FaInfoCircle,
} from "react-icons/fa";

import SidebarGuru from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

function FeatureCard({ icon, title, desc, href, router, color = "emerald" }) {
  const colorClass =
    color === "amber"
      ? "bg-amber-400 text-emerald-950"
      : color === "blue"
      ? "bg-sky-500 text-white"
      : color === "rose"
      ? "bg-rose-500 text-white"
      : "bg-emerald-700 text-white";

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group relative overflow-hidden rounded-[32px] border border-emerald-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-50 blur-2xl transition group-hover:bg-amber-100" />

      <div className="relative z-10">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl text-2xl ${colorClass}`}
        >
          {icon}
        </div>

        <h3 className="mt-5 text-xl font-black text-emerald-950">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700">
          Buka Fitur
          <FaArrowRight className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function JadwalCard({ item }) {
  return (
    <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            <FaClock />
            {item.hari || "Hari belum diatur"}
          </div>

          <h3 className="mt-3 text-xl font-black text-emerald-950">
            {item.nama_mapel || "Mata pelajaran"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {item.kelas?.nama_kelas || "Kelas belum ditentukan"}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-emerald-950">
          {item.jam_mulai || "--:--"} - {item.jam_selesai || "--:--"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
          {item.kelas?.jenjang || "Jenjang"}
        </span>

        <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-700">
          {item.ruang ||
            item.ruang_detail?.nama_ruang ||
            "Ruang belum diatur"}
        </span>

        <span className="rounded-full bg-sky-50 px-3 py-2 text-sky-700">
          {item.status || "aktif"}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="rounded-[30px] border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl text-emerald-700 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-black text-emerald-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

export default function GuruDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [dashboard, setDashboard] = useState({
    guru: null,
    ringkasan: {
      jadwalHariIni: 0,
      totalJadwal: 0,
      totalKelas: 0,
      totalSantri: 0,
      totalNilai: 0,
      infoBelumDibaca: 0,
    },
    jadwalHariIni: [],
    kelasSaya: [],
    tugasGuru: [],
    aktivitas: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    let parsedUser = null;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
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
      fetchDashboardGuru(user);
    }
  }, [user]);

  const fetchDashboardGuru = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoadingDashboard(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/api/guru/dashboard/${currentUser.id}`, {
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
        throw new Error(result.message || "Gagal mengambil dashboard guru.");
      }

      setDashboard(result.data);
    } catch (error) {
      setErrorMessage(error.message);

      setDashboard((prev) => ({
        ...prev,
        guru: {
          nama: currentUser.nama,
          users: {
            email: currentUser.email,
            role: currentUser.role,
          },
        },
      }));
    } finally {
      setLoadingDashboard(false);
    }
  };

  const today = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const guruData = dashboard.guru;
  const ringkasan = dashboard.ringkasan || {};

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
                    <p className="font-black">Dashboard belum terhubung penuh</p>
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
                  Teacher Workspace
                </div>

                <h1 className="mt-5 text-[clamp(2.4rem,5vw,5rem)] font-black leading-[0.95] tracking-[-0.06em] text-emerald-950">
                  Ruang Guru
                  <span className="block text-amber-500">Al-Furqon.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Assalamu’alaikum,{" "}
                  <span className="font-black text-emerald-700">
                    {guruData?.nama || user?.nama || user?.email}
                  </span>
                  . Ini adalah ruang kerja guru untuk mengelola pembelajaran,
                  jadwal, nilai, dan santri.
                </p>
              </div>

              <div className="rounded-[34px] border border-emerald-100 bg-yellow-200 p-5 shadow-sm lg:w-[380px]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-3xl text-white">
                    <FaChalkboardTeacher />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-emerald-700">
                      Login sebagai
                    </p>

                    <h3 className="mt-1 truncate text-lg font-black text-emerald-950">
                      {guruData?.nama || user?.nama || "Guru"}
                    </h3>

                    <p className="truncate text-xs font-semibold text-slate-500">
                      {guruData?.users?.email || user?.email || "guru@alfurqon"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-xs font-bold text-emerald-700">Mapel</p>
                    <p className="mt-1 font-black text-emerald-950">
                      {guruData?.mapel || "Belum diisi"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-3">
                    <p className="text-xs font-bold text-amber-700">
                      Wali Kelas
                    </p>
                    <p className="mt-1 font-black text-emerald-950">
                      {guruData?.wali_kelas || "Tidak"}
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
                    Amanah Pembelajaran
                  </p>

                  <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Fokus mengajar, membimbing, dan menumbuhkan adab santri.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/80">
                    Cek jadwal hari ini, pantau kelas yang diajar, dan lanjutkan
                    tugas pembelajaran dari satu ruang guru digital.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => router.push("/guru/jadwal")}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-amber-300 px-6 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
                    >
                      Lihat Jadwal
                      <FaCalendarAlt />
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/guru/nilai")}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/20"
                    >
                      Input Nilai
                      <FaPenFancy />
                    </button>

                    <button
                      type="button"
                      onClick={() => fetchDashboardGuru()}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/20"
                    >
                      Refresh
                      <FaSyncAlt
                        className={loadingDashboard ? "animate-spin" : ""}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[42px] border border-emerald-100 bg-yellow-200 p-7 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-300 text-2xl text-emerald-950">
                  <FaCalendarAlt />
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                  Hari Ini
                </p>

                <h3 className="mt-2 text-3xl font-black leading-tight text-emerald-950">
                  {today}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {ringkasan.jadwalHariIni > 0
                    ? `Ada ${ringkasan.jadwalHariIni} jadwal mengajar hari ini.`
                    : "Tidak ada jadwal mengajar hari ini. Gunakan waktu untuk menyiapkan materi."}
                </p>
              </div>
            </section>

            {/* STATS */}
            <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                icon={<FaCalendarAlt />}
                label="Jadwal Hari Ini"
                value={ringkasan.jadwalHariIni || 0}
                desc={`${ringkasan.totalJadwal || 0} total jadwal mengajar`}
              />

              <StatCard
                icon={<FaLayerGroup />}
                label="Kelas Saya"
                value={ringkasan.totalKelas || 0}
                desc="Kelas yang terhubung"
              />

              <StatCard
                icon={<FaUserGraduate />}
                label="Santri"
                value={ringkasan.totalSantri || 0}
                desc="Santri dari kelas terkait"
              />

              <StatCard
                icon={<FaBell />}
                label="Info Baru"
                value={ringkasan.infoBelumDibaca || 0}
                desc="Informasi dari admin"
              />
            </section>

            {/* FITUR */}
            <section className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
              <FeatureCard
                router={router}
                href="/guru/jadwal"
                icon={<FaCalendarAlt />}
                title="Jadwal Mengajar"
                desc="Lihat jadwal mengajar berdasarkan hari, kelas, ruang, dan mata pelajaran."
              />

              <FeatureCard
                router={router}
                href="/guru/santri"
                icon={<FaUserGraduate />}
                title="Data Santri"
                desc="Lihat daftar santri yang berkaitan dengan kelas atau mata pelajaran."
                color="amber"
              />

              <FeatureCard
                router={router}
                href="/guru/nilai"
                icon={<FaClipboardList />}
                title="Input Nilai"
                desc="Input nilai santri secara rapi dan terstruktur."
                color="blue"
              />

              <FeatureCard
                router={router}
                href="/guru/materi"
                icon={<FaBookOpen />}
                title="Materi Ajar"
                desc="Kelola materi pembelajaran yang akan diberikan kepada santri."
                color="rose"
              />
            </section>

            {/* JADWAL DAN KELAS */}
            <section className="mt-7 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
              <div className="rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-emerald-950">
                        Jadwal Hari Ini
                      </h2>
                      <p className="text-sm text-slate-500">
                        Jadwal mengajar berdasarkan hari ini.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/guru/jadwal")}
                    className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
                  >
                    Lihat Semua
                  </button>
                </div>

                {dashboard.jadwalHariIni?.length > 0 ? (
                  <div className="grid gap-4">
                    {dashboard.jadwalHariIni.map((item) => (
                      <JadwalCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaCalendarAlt />}
                    title="Tidak ada jadwal hari ini"
                    desc="Jadwal mengajar hari ini akan muncul otomatis jika sudah dibuat admin pada menu kelas dan jadwal."
                  />
                )}
              </div>

              <div className="rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-emerald-950">
                    <FaLayerGroup />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-emerald-950">
                      Kelas Saya
                    </h2>
                    <p className="text-sm text-slate-500">
                      Kelas yang terhubung dengan jadwal guru.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {dashboard.kelasSaya?.length > 0 ? (
                    dashboard.kelasSaya.map((kelas) => (
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
                    ))
                  ) : (
                    <EmptyState
                      icon={<FaLayerGroup />}
                      title="Belum ada kelas"
                      desc="Kelas akan muncul jika admin sudah menambahkan guru ini pada jadwal mapel."
                    />
                  )}
                </div>
              </div>
            </section>

            {/* TUGAS DAN AKTIVITAS */}
            <section className="mt-7 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
              <div className="rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <FaTasks />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-emerald-950">
                      Tugas Guru
                    </h2>
                    <p className="text-sm text-slate-500">
                      Checklist pekerjaan utama.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {dashboard.tugasGuru?.length > 0 ? (
                    dashboard.tugasGuru.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                      >
                        <div
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            item.done
                              ? "bg-emerald-700 text-white"
                              : "bg-amber-300 text-emerald-950"
                          }`}
                        >
                          {item.done ? (
                            <FaCheckCircle className="text-xs" />
                          ) : (
                            <FaClock className="text-xs" />
                          )}
                        </div>

                        <div>
                          <p className="font-black text-emerald-950">
                            {item.title}
                          </p>

                          <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<FaTasks />}
                      title="Belum ada tugas"
                      desc="Tugas guru akan muncul otomatis setelah dashboard terhubung dengan data."
                    />
                  )}
                </div>
              </div>

              <div className="rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-emerald-950">
                    <FaInfoCircle />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-emerald-950">
                      Aktivitas Pembelajaran
                    </h2>

                    <p className="text-sm text-slate-500">
                      Ringkasan aktivitas guru terbaru.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {dashboard.aktivitas?.length > 0 ? (
                    dashboard.aktivitas.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
                      >
                        <p className="font-black text-emerald-950">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<FaCheckCircle />}
                      title="Belum ada aktivitas"
                      desc="Aktivitas seperti input nilai, jadwal, dan pengumuman akan tampil di sini setelah fitur digunakan."
                    />
                  )}
                </div>
              </div>
            </section>

            {/* PROFIL GURU */}
            <section className="mt-7 rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FaUserTie />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Profil Guru
                  </h2>

                  <p className="text-sm text-slate-500">
                    Informasi singkat akun dan data kepegawaian.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-700">Nama</p>
                  <p className="mt-1 font-black text-emerald-950">
                    {guruData?.nama || user?.nama || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-700">Email</p>
                  <p className="mt-1 break-all font-black text-emerald-950">
                    {guruData?.users?.email || user?.email || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-700">
                    Pendidikan
                  </p>
                  <p className="mt-1 font-black text-emerald-950">
                    {guruData?.pendidikan_terakhir || "Belum diisi"}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-700">Status</p>
                  <p className="mt-1 font-black text-emerald-950">
                    {guruData?.status_kepegawaian ||
                      guruData?.status ||
                      "Aktif"}
                  </p>
                </div>
              </div>

              {guruData?.alamat && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-slate-600">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-amber-600" />
                  <p>{guruData.alamat}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}