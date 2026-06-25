"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelope,
  FaSyncAlt,
  FaClock,
  FaUserGraduate,
  FaInfoCircle,
  FaSearch,
  FaEye,
  FaPhone,
  FaSchool,
  FaIdCard,
  FaCalendarAlt,
  FaFilter,
  FaVenusMars,
  FaQuran,
  FaShieldAlt,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle,
  FaMosque,
  FaHome,
  FaClipboardCheck,
  FaLayerGroup,
  FaCrown,
  FaFingerprint,
  FaUsers,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function VerifikasiSantri() {
  const [data, setData] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [loadingId, setLoadingId] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const [search, setSearch] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [selectedSantri, setSelectedSantri] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const isServerError = (error) => {
    const message = String(error?.message || "");

    return (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Load failed") ||
      message.includes("fetch") ||
      message.includes("Backend tidak mengembalikan JSON") ||
      message.includes("NEXT_PUBLIC_API_URL") ||
      message.includes("network") ||
      message.includes("Network")
    );
  };

  const showMaintenancePopup = (
    message = "Server backend belum aktif atau sedang maintenance. Jalankan backend Express terlebih dahulu."
  ) => {
    setServerMaintenance(true);
    setServerMessage(message);
  };

  const fetchJson = async (url, options = {}) => {
    if (!API_URL) {
      showMaintenancePopup(
        "Alamat backend belum diatur. Cek NEXT_PUBLIC_API_URL di file .env.local frontend."
      );

      throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);

        showMaintenancePopup(
          "Backend merespons, tetapi tidak mengembalikan JSON yang valid. Cek route Express backend."
        );

        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan Express aktif di http://localhost:5000"
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Terjadi kesalahan pada backend.");
      }

      setServerMaintenance(false);
      setServerMessage("");

      return result;
    } catch (error) {
      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data verifikasi santri belum dapat dimuat."
        );
      }

      throw error;
    }
  };

  const getAdminPayload = () => {
    try {
      const session = localStorage.getItem("session");
      const userOnly = localStorage.getItem("user");

      const user = session
        ? JSON.parse(session)?.user
        : userOnly
        ? JSON.parse(userOnly)
        : null;

      return {
        admin_id: user?.id || null,
        nama_admin: user?.email || "Admin Pesantren",
      };
    } catch (error) {
      return {
        admin_id: null,
        nama_admin: "Admin Pesantren",
      };
    }
  };

  const getData = async () => {
    try {
      setLoadingPage(true);

      const result = await fetchJson(`${API_URL}/api/admin/verifikasi-santri`, {
        cache: "no-store",
      });

      setData(result.data || []);
    } catch (error) {
      console.error("VERIFIKASI SANTRI ERROR:", error.message);
      setData([]);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data verifikasi santri belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingPage(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);

      const result = await fetchJson(
        `${API_URL}/api/admin/verifikasi-santri/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            ...getAdminPayload(),
          }),
        }
      );

      alert(result.message);

      setConfirmAction(null);
      setSelectedSantri(null);

      await getData();
    } catch (error) {
      console.error("UPDATE VERIFIKASI ERROR:", error.message);

      if (isServerError(error)) {
        showMaintenancePopup(
          status === "aktif"
            ? "Server sedang maintenance. Santri belum dapat diterima untuk sementara."
            : "Server sedang maintenance. Santri belum dapat ditolak untuk sementara."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const formatTanggal = (date) => {
    if (!date) return "-";

    const tanggal = new Date(date);

    if (isNaN(tanggal.getTime())) return "-";

    return tanggal.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitial = (name) => {
    return String(name || "S").trim().charAt(0).toUpperCase();
  };

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.nama?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.nisn?.toLowerCase().includes(keyword) ||
      item.telepon?.toLowerCase().includes(keyword) ||
      item.kota?.toLowerCase().includes(keyword) ||
      item.alamat?.toLowerCase().includes(keyword);

    const matchJenjang = filterJenjang ? item.jenjang === filterJenjang : true;

    const matchGender = filterGender
      ? item.jenis_kelamin === filterGender
      : true;

    return matchSearch && matchJenjang && matchGender;
  });

  const stats = useMemo(() => {
    return {
      total: data.length,
      tampil: filteredData.length,
      putra: data.filter((item) => item.jenis_kelamin === "Laki-laki").length,
      putri: data.filter((item) => item.jenis_kelamin === "Perempuan").length,
      mts: data.filter((item) => item.jenjang === "MTS").length,
      smk: data.filter((item) => item.jenjang === "SMK").length,
      takhassus: data.filter((item) => item.jenjang === "Takhassus").length,
    };
  }, [data, filteredData.length]);

  const reviewScore = useMemo(() => {
    if (!stats.total) return 100;

    const shownRatio = stats.total ? Math.round((stats.tampil / stats.total) * 100) : 0;
    const balanceScore = stats.putra + stats.putri > 0 ? 88 : 70;

    return Math.max(30, Math.min(100, Math.round((shownRatio + balanceScore) / 2)));
  }, [stats]);

  const { checking } = useAuthGuard(["admin"]);

if (checking) {
  return <AuthLoading role="Admin" />;
}

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071B14] text-sm text-slate-700">
      <SidebarAdmin
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
        <section className="relative overflow-hidden px-4 pb-32 pt-8 text-white sm:px-6 md:px-10 md:pt-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,#041B14_0%,#0B3B2E_45%,#4A3410_100%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EFE8D8] to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.12fr_0.88fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaShieldAlt className="text-yellow-300" />

                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                      Admin Verification Command Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Verifikasi
                    <span className="block text-yellow-300">Santri Baru.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                    Tinjau setiap pendaftaran santri baru secara rapi,
                    informatif, dan aman. Admin dapat melihat detail pendaftar,
                    lalu menerima atau menolak pendaftaran dengan konfirmasi.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={getData}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
                    >
                      <FaSyncAlt className={loadingPage ? "animate-spin" : ""} />
                      Refresh Data
                    </button>

                    <div className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white backdrop-blur-xl">
                      <FaClock className="text-yellow-300" />
                      {stats.total} menunggu review
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <HeroCard
                  title="Menunggu Verifikasi"
                  value={stats.total}
                  icon={<FaClock />}
                />

                <HeroCard
                  title="Data Ditampilkan"
                  value={stats.tampil}
                  icon={<FaFilter />}
                />

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-yellow-100/80">
                        Review Readiness
                      </p>

                      <h3 className="mt-1 text-4xl font-black text-yellow-300">
                        {reviewScore}%
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-emerald-50/70">
                        Berdasarkan data yang tampil dan kelengkapan filter.
                      </p>
                    </div>

                    <div
                      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#facc15 ${
                          reviewScore * 3.6
                        }deg, rgba(255,255,255,0.12) 0deg)`,
                      }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#071B14] text-lg font-black text-yellow-300">
                        {reviewScore}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="relative bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5]">
          <div className="mx-auto -mt-20 max-w-[1600px] px-4 pb-10 sm:px-6 md:px-10">
            {/* STATS */}
            <section className="relative z-20">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 2xl:grid-cols-6">
                <StatCard
                  title="Total Pending"
                  value={stats.total}
                  icon={<FaClock />}
                  color="bg-yellow-400 text-green-950"
                />

                <StatCard
                  title="Ditampilkan"
                  value={stats.tampil}
                  icon={<FaFilter />}
                  color="bg-emerald-600 text-white"
                />

                <StatCard
                  title="MTS"
                  value={stats.mts}
                  icon={<FaSchool />}
                  color="bg-blue-600 text-white"
                />

                <StatCard
                  title="SMK"
                  value={stats.smk}
                  icon={<FaIdCard />}
                  color="bg-purple-600 text-white"
                />

                <StatCard
                  title="Takhassus"
                  value={stats.takhassus}
                  icon={<FaQuran />}
                  color="bg-green-600 text-white"
                />

                <StatCard
                  title="Butuh Review"
                  value={stats.total}
                  icon={<FaExclamationTriangle />}
                  color="bg-red-500 text-white"
                />
              </div>
            </section>

            {/* PANEL */}
            <section className="relative z-20 mt-6 overflow-hidden rounded-[38px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 backdrop-blur-xl">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10">
                <div className="border-b border-[#E7D7A7] p-4 sm:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                        <FaClipboardCheck />
                        Pendaftaran Menunggu Verifikasi
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                        Review Data Pendaftar
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        Gunakan pencarian dan filter untuk meninjau calon
                        santri lebih cepat.
                      </p>
                    </div>

                    <button
                      onClick={getData}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
                    >
                      <FaSyncAlt className={loadingPage ? "animate-spin" : ""} />
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Cari nama, NISN, email, kota..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                      />
                    </div>

                    <select
                      value={filterJenjang}
                      onChange={(e) => setFilterJenjang(e.target.value)}
                      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                    >
                      <option value="">Semua Jenjang</option>
                      <option value="MTS">MTS</option>
                      <option value="SMK">SMK</option>
                      <option value="Takhassus">Takhassus</option>
                    </select>

                    <select
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                    >
                      <option value="">Semua Gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  {(search || filterJenjang || filterGender) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
                        Filter aktif
                      </span>

                      {search && (
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                          Cari: {search}
                        </span>
                      )}

                      {filterJenjang && (
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                          Jenjang: {filterJenjang}
                        </span>
                      )}

                      {filterGender && (
                        <span className="rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700">
                          Gender: {filterGender}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSearch("");
                          setFilterJenjang("");
                          setFilterGender("");
                        }}
                        className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-200"
                      >
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  {loadingPage ? (
                    <LoadingState />
                  ) : filteredData.length === 0 ? (
                    <EmptyState
                      hasFilter={search || filterJenjang || filterGender}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                      {filteredData.map((item) => (
                        <VerificationCard
                          key={item.id}
                          item={item}
                          loadingId={loadingId}
                          formatTanggal={formatTanggal}
                          getInitial={getInitial}
                          onDetail={() => setSelectedSantri(item)}
                          onAccept={() =>
                            setConfirmAction({
                              type: "aktif",
                              item,
                            })
                          }
                          onReject={() =>
                            setConfirmAction({
                              type: "ditolak",
                              item,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        {selectedSantri && (
          <DetailModal
            item={selectedSantri}
            formatTanggal={formatTanggal}
            getInitial={getInitial}
            onClose={() => setSelectedSantri(null)}
            onAccept={() => {
              setConfirmAction({
                type: "aktif",
                item: selectedSantri,
              });
            }}
            onReject={() => {
              setConfirmAction({
                type: "ditolak",
                item: selectedSantri,
              });
            }}
          />
        )}

        {confirmAction && (
          <ConfirmModal
            action={confirmAction}
            loadingId={loadingId}
            onClose={() => setConfirmAction(null)}
            onConfirm={() =>
              updateStatus(confirmAction.item.id, confirmAction.type)
            }
          />
        )}

        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");
              getData();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroCard({ title, value, icon }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-lg">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-yellow-100/80">{title}</p>
          <h3 className="mt-1 truncate text-3xl font-black">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-4 shadow-xl shadow-yellow-950/5 transition hover:-translate-y-1 hover:shadow-2xl sm:p-5">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-slate-500 sm:text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#1F1607] sm:text-3xl">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg shadow-md ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function VerificationCard({
  item,
  loadingId,
  formatTanggal,
  getInitial,
  onDetail,
  onAccept,
  onReject,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-lg shadow-yellow-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl transition group-hover:scale-125" />
      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl transition group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Avatar src={item.foto} name={item.nama} getInitial={getInitial} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#1F1607]">
                  {item.nama || "-"}
                </h3>

                <p className="mt-1 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-black uppercase text-yellow-700">
                  Pending Verification
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#064E3B] px-3 py-1 text-[10px] font-black text-white">
                BARU
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Pill color="green">{item.jenjang || "-"}</Pill>

              <Pill color="yellow">
                {item.jenjang === "Takhassus"
                  ? `Marhalah ${item.kelas || "-"}`
                  : `Kelas ${item.kelas || "-"}`}
              </Pill>

              <Pill color={item.jenis_kelamin === "Perempuan" ? "pink" : "blue"}>
                {item.jenis_kelamin || "-"}
              </Pill>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-3xl border border-[#E7D7A7] bg-white/65 p-4 text-sm text-slate-600 shadow-sm backdrop-blur-xl">
          <InfoMini icon={<FaIdCard />} text={`NISN: ${item.nisn || "-"}`} />
          <InfoMini icon={<FaEnvelope />} text={item.email || "-"} />
          <InfoMini icon={<FaPhone />} text={item.telepon || "-"} />
          <InfoMini
            icon={<FaMapMarkerAlt />}
            text={item.kota || item.alamat || "Alamat belum diisi"}
          />
          <InfoMini
            icon={<FaCalendarAlt />}
            text={`Mendaftar ${formatTanggal(item.created_at)}`}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={onDetail}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 font-black text-slate-700 transition hover:bg-slate-200"
          >
            <FaEye />
            Detail
          </button>

          <button
            onClick={onAccept}
            disabled={loadingId === item.id}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] font-black text-white shadow-lg transition hover:bg-[#086B4F] disabled:opacity-60"
          >
            <FaCheck />
            Terima
          </button>

          <button
            onClick={onReject}
            disabled={loadingId === item.id}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 font-black text-white shadow-lg transition hover:bg-red-600 disabled:opacity-60"
          >
            <FaTimes />
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, name, getInitial, large = false }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-3xl border border-[#E7D7A7] bg-gradient-to-br from-emerald-100 to-yellow-50 shadow-sm ${
        large ? "h-24 w-24" : "h-16 w-16"
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Santri"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-2xl font-black text-[#064E3B]">
          {getInitial(name)}
        </div>
      )}
    </div>
  );
}

function Pill({ children, color = "gray" }) {
  const colors = {
    gray: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    pink: "bg-pink-100 text-pink-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function InfoMini({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#064E3B]">{icon}</span>
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-80 animate-pulse rounded-[32px] bg-white/70"
        />
      ))}
    </div>
  );
}

function EmptyState({ hasFilter }) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-white/70 text-4xl text-slate-400">
        <FaInfoCircle />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-700">
        {hasFilter
          ? "Data Tidak Ditemukan"
          : "Tidak Ada Pendaftaran Pending"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {hasFilter
          ? "Coba gunakan kata kunci atau filter lain untuk menemukan data santri."
          : "Semua pendaftaran santri sudah diverifikasi. Tidak ada data yang perlu diproses saat ini."}
      </p>
    </div>
  );
}

function DetailModal({
  item,
  formatTanggal,
  getInitial,
  onClose,
  onAccept,
  onReject,
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-t-[34px] bg-[#FFFDF6] shadow-2xl sm:rounded-[34px]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#4A3410] p-5 text-white sm:p-7">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar
                src={item.foto}
                name={item.nama}
                getInitial={getInitial}
                large
              />

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                  Detail Pendaftar
                </p>

                <h2 className="mt-2 line-clamp-2 text-2xl font-black sm:text-3xl">
                  {item.nama || "-"}
                </h2>

                <p className="mt-1 text-sm text-green-50/80">
                  {item.jenjang || "-"} {item.kelas || ""} •{" "}
                  {item.jenis_kelamin || "-"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto bg-gradient-to-b from-[#FFFDF6] to-[#E8F5E9] p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <InfoBox
              icon={<FaIdCard />}
              title="Identitas"
              items={[
                ["Nama", item.nama],
                ["NISN", item.nisn],
                ["NIK", item.nik],
                ["Jenis Kelamin", item.jenis_kelamin],
                ["Tanggal Lahir", item.tanggal_lahir],
              ]}
            />

            <InfoBox
              icon={<FaSchool />}
              title="Pendidikan"
              items={[
                ["Jenjang", item.jenjang],
                ["Kelas", item.kelas],
                ["Asal Sekolah", item.asal_sekolah],
                ["Cita-cita", item.cita_cita],
                ["Hobi", item.hobi],
              ]}
            />

            <InfoBox
              icon={<FaEnvelope />}
              title="Kontak"
              items={[
                ["Email", item.email],
                ["Telepon", item.telepon],
                ["Kota", item.kota],
                ["Provinsi", item.provinsi],
                ["Kode Pos", item.kode_pos],
              ]}
            />

            <InfoBox
              icon={<FaMosque />}
              title="Status Pendaftaran"
              items={[
                ["Status", item.status],
                ["Tanggal Daftar", formatTanggal(item.created_at)],
                ["Agama", item.agama],
                ["Tempat Lahir", item.tempat_lahir],
              ]}
            />
          </div>

          <div className="mt-4 rounded-3xl border border-[#E7D7A7] bg-white/75 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <FaHome />
              </div>

              <h3 className="font-black text-[#1F1607]">Alamat Lengkap</h3>
            </div>

            <p className="mt-3 leading-relaxed text-slate-600">
              {item.alamat || "-"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              onClick={onClose}
              className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Tutup
            </button>

            <button
              onClick={onAccept}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] font-black text-white transition hover:bg-[#086B4F]"
            >
              <FaUserCheck />
              Terima Santri
            </button>

            <button
              onClick={onReject}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 font-black text-white transition hover:bg-red-600"
            >
              <FaUserTimes />
              Tolak Santri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, title, items }) {
  return (
    <div className="rounded-3xl border border-[#E7D7A7] bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          {icon}
        </div>

        <h3 className="font-black text-[#1F1607]">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-[#E7D7A7] pb-2 last:border-none"
          >
            <span className="text-sm text-slate-500">{label}</span>

            <span className="text-right text-sm font-bold text-slate-800">
              {value || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmModal({ action, loadingId, onClose, onConfirm }) {
  const isAccept = action.type === "aktif";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-[34px] bg-[#FFFDF6] shadow-2xl">
        <div
          className={`relative overflow-hidden p-6 text-white ${
            isAccept
              ? "bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#064E3B]"
              : "bg-gradient-to-br from-[#450A0A] via-[#991B1B] to-[#7F1D1D]"
          }`}
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-yellow-400 text-4xl text-green-950 shadow-lg">
              {isAccept ? <FaUserCheck /> : <FaUserTimes />}
            </div>

            <h2 className="mt-5 text-center text-2xl font-black">
              {isAccept ? "Terima Santri Ini?" : "Tolak Pendaftaran Ini?"}
            </h2>

            <p className="mt-2 text-center text-sm text-white/85">
              {isAccept
                ? "Santri akan berubah menjadi aktif dan dapat mengakses sistem."
                : "Santri akan berubah menjadi ditolak dan tidak masuk ke data aktif."}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-3xl border border-[#E7D7A7] bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Nama Santri
            </p>

            <h3 className="mt-1 text-xl font-black text-[#1F1607]">
              {action.item.nama || "-"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {action.item.jenjang || "-"} {action.item.kelas || ""}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={onClose}
              disabled={loadingId === action.item.id}
              className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
            >
              Batal
            </button>

            <button
              onClick={onConfirm}
              disabled={loadingId === action.item.id}
              className={`h-12 rounded-2xl font-black text-white shadow-lg transition disabled:opacity-60 ${
                isAccept
                  ? "bg-[#064E3B] hover:bg-[#086B4F]"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loadingId === action.item.id
                ? "Memproses..."
                : isAccept
                ? "Ya, Terima"
                : "Ya, Tolak"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServerMaintenanceModal({ message, onRetry, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#14532D] text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />

        <div className="absolute -right-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 animate-pulse rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-yellow-300/30 bg-yellow-400/15 shadow-xl">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-green-950">
              ⚙️
              <span className="absolute inset-0 animate-ping rounded-full border-4 border-yellow-200/50" />
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
                "Backend belum aktif. Data verifikasi santri belum dapat dimuat untuk sementara waktu."}
            </p>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                ☪
              </div>

              <div>
                <h3 className="font-black text-white">
                  Silahkan Menunggu hingga Perbaikan Selesai
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-green-50/80">
                  Saat ini sistem sedang dalam masa pemeliharaan.
                </p>

                <div className="mt-3 rounded-2xl bg-black/30 px-4 py-3 font-mono text-sm text-yellow-200">
                  Tunggu hingga 1x24 jam
                  <br />
                  Jika belum normal, hubungi pihak backend
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Coba Lagi
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Tutup Popup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}