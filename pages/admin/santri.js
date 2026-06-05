"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaUsers,
  FaSearch,
  FaUserGraduate,
  FaVenusMars,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEye,
  FaEnvelope,
  FaSchool,
  FaIdCard,
  FaHome,
  FaCamera,
  FaSyncAlt,
  FaUserPlus,
  FaChild,
  FaLayerGroup,
  FaFilter,
  FaBookOpen,
  FaMosque,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const emptyForm = {
  id: "",
  user_id: "",
  orang_tua_id: "",

  nama: "",
  nisn: "",
  nik: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  agama: "",
  jenjang: "",
  kelas: "",
  jenis_kelamin: "",
  telepon: "",
  email: "",
  alamat: "",
  kota: "",
  provinsi: "",
  kode_pos: "",
  asal_sekolah: "",
  cita_cita: "",
  hobi: "",
  foto: "",
  fotoFile: null,

  ayah_nama: "",
  ayah_pekerjaan: "",
  ibu_nama: "",
  ibu_pekerjaan: "",
};

export default function SantriPage() {
  const [santri, setSantri] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [search, setSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState(null);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSantri();
  }, []);

  const isBackendError = (error) => {
    const message = String(error?.message || "");

    return (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Load failed") ||
      message.includes("fetch") ||
      message.includes("Backend tidak mengembalikan JSON") ||
      message.includes("NEXT_PUBLIC_API_URL")
    );
  };

  const fetchSantri = async () => {
    try {
      setLoading(true);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
      }

      const response = await fetch(`${API_URL}/api/admin/santri?status=aktif`, {
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);

        throw new Error(
  "API tidak mengembalikan JSON. Pastikan endpoint /api/fasilitas sudah berjalan."
);
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data santri");
      }

      setSantri(result.data || []);
      setServerMaintenance(false);
      setServerMessage("");
    } catch (error) {
      console.error("SANTRI ERROR:", error.message);
      setSantri([]);

      if (isBackendError(error)) {
        setServerMaintenance(true);
        setServerMessage(
          "Server backend belum aktif atau sedang maintenance. Jalankan backend Express terlebih dahulu."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const getOrtu = (item) => {
    if (Array.isArray(item?.orang_tua)) return item.orang_tua[0] || {};
    return item?.orang_tua || {};
  };

  const formatTanggal = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama.trim()) {
      alert("Nama santri wajib diisi");
      return;
    }

    if (!form.email.trim()) {
      alert("Email wajib diisi");
      return;
    }

    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
      }

      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "fotoFile") {
          payload.append(key, value || "");
        }
      });

      if (form.fotoFile) {
        payload.append("foto", form.fotoFile);
      }

      const url = editId
        ? `${API_URL}/api/admin/santri/${editId}`
        : `${API_URL}/api/admin/santri`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: payload,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);
        throw new Error("Backend tidak mengembalikan JSON.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan data santri");
      }

      if (!editId && result.data?.password) {
        alert(
          `Akun berhasil dibuat\n\nEmail: ${result.data.email}\nPassword: ${result.data.password}`
        );
      } else {
        alert(result.message || "Data santri berhasil disimpan");
      }

      resetForm();
      setOpenModal(false);
      fetchSantri();
    } catch (error) {
      console.error(error);

      if (isBackendError(error)) {
        setServerMaintenance(true);
        setServerMessage(
          "Server backend belum aktif atau sedang maintenance. Data santri belum dapat disimpan."
        );
        return;
      }

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const ortu = getOrtu(item);

    setEditId(item.id);

    setForm({
      id: item.id || "",
      user_id: item.user_id || "",
      orang_tua_id: ortu.id || "",

      nama: item.nama || "",
      nisn: item.nisn || "",
      nik: item.nik || "",
      tempat_lahir: item.tempat_lahir || "",
      tanggal_lahir: item.tanggal_lahir || "",
      agama: item.agama || "",
      jenjang: item.jenjang || "",
      kelas: item.kelas || "",
      jenis_kelamin: item.jenis_kelamin || "",
      telepon: item.telepon || "",
      email: item.email || "",
      alamat: item.alamat || "",
      kota: item.kota || "",
      provinsi: item.provinsi || "",
      kode_pos: item.kode_pos || "",
      asal_sekolah: item.asal_sekolah || "",
      cita_cita: item.cita_cita || "",
      hobi: item.hobi || "",
      foto: item.foto || "",
      fotoFile: null,

      ayah_nama: ortu.ayah_nama || "",
      ayah_pekerjaan: ortu.ayah_pekerjaan || "",
      ibu_nama: ortu.ibu_nama || "",
      ibu_pekerjaan: ortu.ibu_pekerjaan || "",
    });

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus data santri ini?");

    if (!confirmDelete) return;

    try {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL belum diatur di .env.local");
      }

      const response = await fetch(`${API_URL}/api/admin/santri/${id}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend tidak mengembalikan JSON.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus data santri");
      }

      alert(result.message || "Data santri berhasil dihapus");
      fetchSantri();
    } catch (error) {
      console.error(error);

      if (isBackendError(error)) {
        setServerMaintenance(true);
        setServerMessage(
          "Server backend belum aktif atau sedang maintenance. Data santri belum dapat dihapus."
        );
        return;
      }

      alert(error.message);
    }
  };

  const handleUploadFoto = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      foto: previewUrl,
      fotoFile: file,
    }));
  };

  const filteredSantri = santri.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.nama?.toLowerCase().includes(keyword) ||
      item.nisn?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.telepon?.toLowerCase().includes(keyword);

    const matchJenjang = filterJenjang ? item.jenjang === filterJenjang : true;

    const matchKelas = filterKelas
      ? String(item.kelas) === String(filterKelas)
      : true;

    const matchGender = filterGender
      ? item.jenis_kelamin === filterGender
      : true;

    return matchSearch && matchJenjang && matchKelas && matchGender;
  });

  const stats = useMemo(() => {
    return {
      total: santri.length,
      tampil: filteredSantri.length,
      putra: santri.filter((s) => s.jenis_kelamin === "Laki-laki").length,
      putri: santri.filter((s) => s.jenis_kelamin === "Perempuan").length,
      smp: santri.filter((s) => s.jenjang === "SMP").length,
      smk: santri.filter((s) => s.jenjang === "SMK").length,
      takhassus: santri.filter((s) => s.jenjang === "Takhassus").length,
    };
  }, [santri, filteredSantri.length]);

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
          ${collapsed ? "md:ml-[90px]" : "md:ml-[260px]"}
        `}
      >
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-32 pt-8 text-white sm:px-6 md:px-10 md:pt-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,#041B14_0%,#0B3B2E_45%,#4A3410_100%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EFE8D8] to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaMosque className="text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                      Admin Santri Management
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Kelola Data
                    <span className="block text-yellow-300">Santri.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                    Pantau, tambah, edit, dan kelola data santri aktif dengan
                    tampilan yang lebih rapi, interaktif, responsif, dan
                    bernuansa Islamic.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => {
                        resetForm();
                        setOpenModal(true);
                      }}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
                    >
                      <FaUserPlus />
                      Tambah Santri
                    </button>

                    <button
                      onClick={fetchSantri}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20"
                    >
                      <FaSyncAlt className={loading ? "animate-spin" : ""} />
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
                <HeroCard title="Total Santri" value={stats.total} icon={<FaUsers />} />
                <HeroCard title="Data Tampil" value={stats.tampil} icon={<FaFilter />} />
                <HeroCard
                  title="Putra / Putri"
                  value={`${stats.putra}/${stats.putri}`}
                  icon={<FaVenusMars />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="relative bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5]">
          <div className="mx-auto -mt-20 max-w-[1600px] px-4 pb-10 sm:px-6 md:px-10">
            {/* STATS */}
            <section className="relative z-20">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                <StatCard title="Total Aktif" value={stats.total} icon={<FaUsers />} color="bg-green-600 text-white" />
                <StatCard title="Putra" value={stats.putra} icon={<FaUserGraduate />} color="bg-blue-600 text-white" />
                <StatCard title="Putri" value={stats.putri} icon={<FaVenusMars />} color="bg-pink-500 text-white" />
                <StatCard title="SMP" value={stats.smp} icon={<FaSchool />} color="bg-emerald-600 text-white" />
                <StatCard title="SMK" value={stats.smk} icon={<FaChild />} color="bg-yellow-400 text-green-950" />
                <StatCard title="Takhassus" value={stats.takhassus} icon={<FaBookOpen />} color="bg-purple-600 text-white" />
              </div>
            </section>

            {/* FILTER + LIST */}
            <section className="relative mt-6 overflow-hidden rounded-[36px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 backdrop-blur-xl">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10">
                <div className="border-b border-[#E7D7A7] p-4 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                        <FaShieldAlt />
                        Data Santri Aktif
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                        Manajemen Santri Aktif
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        Menampilkan santri yang sudah diterima atau diverifikasi admin.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        resetForm();
                        setOpenModal(true);
                      }}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
                    >
                      <FaPlus />
                      Tambah Santri
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari nama, NISN, email, telepon..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                      />
                    </div>

                    <select
                      value={filterJenjang}
                      onChange={(e) => {
                        setFilterJenjang(e.target.value);
                        setFilterKelas("");
                      }}
                      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                    >
                      <option value="">Semua Jenjang</option>
                      <option value="SMP">SMP</option>
                      <option value="SMK">SMK</option>
                      <option value="Takhassus">Takhassus</option>
                    </select>

                    <select
                      value={filterKelas}
                      onChange={(e) => setFilterKelas(e.target.value)}
                      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                    >
                      <option value="">Semua Kelas</option>
                      {["7", "8", "9", "10", "11", "12"].map(
                        (kelas) => (
                          <option key={kelas} value={kelas}>
                            {filterJenjang === "Takhassus"
                              ? `Marhalah ${kelas}`
                              : `Kelas ${kelas}`}
                          </option>
                        )
                      )}
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
                </div>

                <div className="p-4 sm:p-6">
                  {loading ? (
                    <LoadingState />
                  ) : filteredSantri.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                      {filteredSantri.map((item) => (
                        <SantriCard
                          key={item.id}
                          item={item}
                          formatTanggal={formatTanggal}
                          onDetail={() => {
                            setSelectedSantri(item);
                            setOpenDetail(true);
                          }}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {serverMaintenance && (
              <ServerMaintenanceModal
                message={serverMessage}
                onRetry={() => {
                  setServerMaintenance(false);
                  setServerMessage("");
                  fetchSantri();
                }}
                onClose={() => setServerMaintenance(false)}
              />
            )}
          </div>
        </div>

        {openModal && (
          <FormModal
            editId={editId}
            form={form}
            setForm={setForm}
            saving={saving}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit}
            onUpload={handleUploadFoto}
          />
        )}

        {openDetail && selectedSantri && (
          <DetailModal
            item={selectedSantri}
            getOrtu={getOrtu}
            formatTanggal={formatTanggal}
            onClose={() => {
              setOpenDetail(false);
              setSelectedSantri(null);
            }}
            onEdit={() => {
              handleEdit(selectedSantri);
              setOpenDetail(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeroCard({ title, value, icon }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-md">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-yellow-100/80">{title}</p>
          <h3 className="mt-1 truncate text-3xl font-black text-white">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-4 shadow-xl shadow-yellow-950/5 transition hover:-translate-y-1 hover:shadow-2xl">
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

function Avatar({ src, name, large = false }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-3xl border border-[#E7D7A7] bg-slate-100 shadow-sm ${
        large ? "h-20 w-20" : "h-16 w-16"
      }`}
    >
      <img
        src={src || "/user.png"}
        alt={name || "Santri"}
        onError={(e) => {
          e.currentTarget.src = "/user.png";
        }}
        className="h-full w-full object-cover"
      />
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

function SantriCard({ item, formatTanggal, onDetail, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-lg shadow-yellow-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl transition group-hover:scale-125" />
      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl transition group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Avatar src={item.foto} name={item.nama} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#1F1607]">
                  {item.nama || "-"}
                </h3>

                <p className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase text-emerald-700">
                  <FaCheckCircle className="mr-1 mt-[1px]" />
                  Santri Aktif
                </p>
              </div>

              <Pill color={item.jenis_kelamin === "Laki-laki" ? "blue" : "pink"}>
                {item.jenis_kelamin || "-"}
              </Pill>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Pill color="green">{item.jenjang || "-"}</Pill>

              <Pill color="yellow">
                {item.jenjang === "Takhassus"
                  ? `Marhalah ${item.kelas || "-"}`
                  : `Kelas ${item.kelas || "-"}`}
              </Pill>

              <Pill color="gray">NISN {item.nisn || "-"}</Pill>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-3xl border border-[#E7D7A7] bg-white/65 p-4 text-sm text-slate-600 shadow-sm backdrop-blur-xl">
          <InfoMini icon={<FaPhone />} text={item.telepon || "-"} />
          <InfoMini icon={<FaEnvelope />} text={item.email || "-"} />
          <InfoMini icon={<FaMapMarkerAlt />} text={item.alamat || "-"} multiline />
          <InfoMini
            icon={<FaCalendarAlt />}
            text={`Terdaftar ${formatTanggal(item.created_at)}`}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <button
            onClick={onDetail}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] font-black text-white shadow-md transition hover:bg-[#086B4F]"
          >
            <FaEye />
            <span className="hidden sm:inline">Detail</span>
          </button>

          <button
            onClick={onEdit}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-yellow-400 font-black text-green-950 shadow-md transition hover:bg-yellow-300"
          >
            <FaEdit />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={onDelete}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 font-black text-white shadow-md transition hover:bg-red-600"
          >
            <FaTrash />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoMini({ icon, text, multiline = false }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#064E3B]">{icon}</span>
      <span className={multiline ? "line-clamp-2" : "truncate"}>{text}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-72 animate-pulse rounded-[32px] bg-white/70"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-3xl text-slate-400">
        <FaExclamationCircle />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-700">
        Data Tidak Ditemukan
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Coba gunakan kata kunci atau filter lain.
      </p>
    </div>
  );
}

function FormModal({
  editId,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
  onUpload,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[32px] bg-[#FFFDF6] shadow-2xl sm:max-h-[92vh] sm:rounded-[34px]">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#4A3410] p-5 text-white sm:p-6">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-xl font-black sm:text-2xl">
              {editId ? "Edit Data Santri" : "Tambah Santri Baru"}
            </h2>

            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Isi data dengan lengkap dan benar.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
        >
          <FormSection title="Data Utama" icon="👤">
            <FormGrid>
              <Input label="Nama Santri" value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} required />
              <Input label="NISN" value={form.nisn} onChange={(v) => setForm({ ...form, nisn: v })} />
              <Input label="NIK" value={form.nik} onChange={(v) => setForm({ ...form, nik: v })} />
              <Input label="Tempat Lahir" value={form.tempat_lahir} onChange={(v) => setForm({ ...form, tempat_lahir: v })} />
              <Input type="date" label="Tanggal Lahir" value={form.tanggal_lahir} onChange={(v) => setForm({ ...form, tanggal_lahir: v })} />
              <Input label="Agama" value={form.agama} onChange={(v) => setForm({ ...form, agama: v })} />
            </FormGrid>
          </FormSection>

          <FormSection title="Pendidikan" icon="🏫">
            <FormGrid>
              <Select
                label="Jenjang"
                value={form.jenjang}
                onChange={(v) =>
                  setForm({
                    ...form,
                    jenjang: v,
                    kelas: v === "Takhassus" ? "" : form.kelas,
                  })
                }
                options={["SMP", "SMK", "Takhassus"]}
              />

              <Input
                label={form.jenjang === "Takhassus" ? "Marhalah" : "Kelas"}
                value={form.kelas}
                onChange={(v) => setForm({ ...form, kelas: v })}
              />

              <Select
                label="Jenis Kelamin"
                value={form.jenis_kelamin}
                onChange={(v) => setForm({ ...form, jenis_kelamin: v })}
                options={["Laki-laki", "Perempuan"]}
              />

              <Input label="Asal Sekolah" value={form.asal_sekolah} onChange={(v) => setForm({ ...form, asal_sekolah: v })} />
              <Input label="Cita-cita" value={form.cita_cita} onChange={(v) => setForm({ ...form, cita_cita: v })} />
              <Input label="Hobi" value={form.hobi} onChange={(v) => setForm({ ...form, hobi: v })} />
            </FormGrid>
          </FormSection>

          <FormSection title="Kontak & Alamat" icon="📍">
            <FormGrid>
              <Input label="Telepon" value={form.telepon} onChange={(v) => setForm({ ...form, telepon: v })} />
              <Input type="email" label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Input label="Kota" value={form.kota} onChange={(v) => setForm({ ...form, kota: v })} />
              <Input label="Provinsi" value={form.provinsi} onChange={(v) => setForm({ ...form, provinsi: v })} />
              <Input label="Kode Pos" value={form.kode_pos} onChange={(v) => setForm({ ...form, kode_pos: v })} />
            </FormGrid>

            <textarea
              className="mt-3 min-h-[90px] w-full rounded-2xl border border-[#D8C287] bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
              placeholder="Alamat Lengkap"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            />
          </FormSection>

          <FormSection title="Data Orang Tua" icon="👨‍👩‍👧">
            <FormGrid>
              <Input label="Nama Ayah" value={form.ayah_nama} onChange={(v) => setForm({ ...form, ayah_nama: v })} />
              <Input label="Pekerjaan Ayah" value={form.ayah_pekerjaan} onChange={(v) => setForm({ ...form, ayah_pekerjaan: v })} />
              <Input label="Nama Ibu" value={form.ibu_nama} onChange={(v) => setForm({ ...form, ibu_nama: v })} />
              <Input label="Pekerjaan Ibu" value={form.ibu_pekerjaan} onChange={(v) => setForm({ ...form, ibu_pekerjaan: v })} />
            </FormGrid>
          </FormSection>

          <FormSection title="Foto Santri" icon="📷">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[#D8C287] bg-white">
                {form.foto ? (
                  <img
                    src={form.foto}
                    alt="Foto Santri"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaCamera className="text-3xl text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-2xl border border-[#D8C287] bg-white p-3 text-sm"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Foto akan dikirim ke backend saat data disimpan.
                </p>
              </div>
            </div>
          </FormSection>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#E7D7A7] bg-[#FFFDF6] py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl bg-slate-100 px-5 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:bg-[#086B4F] disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : editId ? "Update Data" : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({ title, icon, children }) {
  return (
    <div className="rounded-3xl border border-[#E7D7A7] bg-white/80 p-4 shadow-sm">
      <h3 className="mb-4 font-black text-[#1F1607]">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function FormGrid({ children }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Input({ label, value, onChange, type = "text", required = false }) {
  return (
    <input
      type={type}
      placeholder={label}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white px-4 text-sm outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
    />
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white px-4 text-sm outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
    >
      <option value="">Pilih {label}</option>
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

function DetailModal({ item, getOrtu, formatTanggal, onClose, onEdit }) {
  const ortu = getOrtu(item);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-t-[32px] bg-[#FFFDF6] shadow-2xl sm:max-h-[92vh] sm:rounded-[34px]">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#4A3410] p-5 text-white sm:p-6">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 flex min-w-0 items-center gap-4">
            <Avatar src={item.foto} name={item.nama} large />

            <div className="min-w-0">
              <h2 className="line-clamp-2 text-xl font-black sm:text-2xl">
                {item.nama}
              </h2>

              <p className="text-sm text-white/80">
                {item.jenjang} {item.kelas} • {item.jenis_kelamin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoBox
              icon={<FaIdCard />}
              title="Identitas"
              items={[
                ["NISN", item.nisn],
                ["NIK", item.nik],
                ["Tempat Lahir", item.tempat_lahir],
                ["Tanggal Lahir", item.tanggal_lahir],
                ["Agama", item.agama],
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
              icon={<FaPhone />}
              title="Kontak"
              items={[
                ["Telepon", item.telepon],
                ["Email", item.email],
                ["Kota", item.kota],
                ["Provinsi", item.provinsi],
                ["Kode Pos", item.kode_pos],
              ]}
            />

            <InfoBox
              icon={<FaHome />}
              title="Orang Tua"
              items={[
                ["Nama Ayah", ortu.ayah_nama],
                ["Pekerjaan Ayah", ortu.ayah_pekerjaan],
                ["Nama Ibu", ortu.ibu_nama],
                ["Pekerjaan Ibu", ortu.ibu_pekerjaan],
              ]}
            />
          </div>

          <div className="mt-4 rounded-3xl border border-[#E7D7A7] bg-white/80 p-5">
            <h3 className="font-black text-[#1F1607]">Alamat Lengkap</h3>
            <p className="mt-2 text-slate-600">{item.alamat || "-"}</p>
            <p className="mt-3 text-xs font-semibold text-slate-400">
              Terdaftar pada {formatTanggal(item.created_at)}
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="h-12 rounded-2xl bg-slate-100 px-5 font-bold text-slate-700 hover:bg-slate-200"
            >
              Tutup
            </button>

            <button
              onClick={onEdit}
              className="h-12 rounded-2xl bg-yellow-400 px-5 font-black text-green-950 hover:bg-yellow-300"
            >
              Edit Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, title, items }) {
  return (
    <div className="rounded-3xl border border-[#E7D7A7] bg-white/80 p-5">
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
                "Backend belum aktif. Beberapa data belum dapat dimuat untuk sementara waktu."}
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
                  Saat ini sedang dalam masa pemeliharaan.
                </p>

                <div className="mt-3 rounded-2xl bg-black/30 px-4 py-3 font-mono text-sm text-yellow-200">
                  Tunggu Hingga 1x24
                  <br />
                  Jika belum normal, hubungi pihak backend.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRetry}
              className="h-[52px] rounded-2xl bg-yellow-400 px-5 py-3 font-black text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Coba Lagi
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-[52px] rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Tutup Popup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}