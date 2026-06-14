import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClipboardList,
  FaEdit,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFilter,
  FaLayerGroup,
  FaLeaf,
  FaLink,
  FaPenFancy,
  FaQuran,
  FaSave,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import SidebarGuru from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const initialForm = {
  id: "",
  kelas_id: "",
  judul: "",
  mapel: "",
  deskripsi: "",
  link_materi: "",
  status: "aktif",
};

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

  if (lower === "aktif") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (lower === "draft") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
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
        <FaBookOpen />
      </div>

      <h3 className="mt-5 text-2xl font-black text-emerald-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

export default function GuruMateriPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [guru, setGuru] = useState(null);
  const [kelasSaya, setKelasSaya] = useState([]);
  const [mapelSaya, setMapelSaya] = useState([]);
  const [materiList, setMateriList] = useState([]);

  const [ringkasan, setRingkasan] = useState({
    totalKelas: 0,
    totalMapel: 0,
    totalMateri: 0,
    materiAktif: 0,
    materiDraft: 0,
  });

  const [form, setForm] = useState(initialForm);

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
      fetchMateri(user);
    }
  }, [user]);

  const fetchMateri = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(`${API_URL}/api/guru/materi/${currentUser.id}`, {
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
        throw new Error(result.message || "Gagal mengambil data materi.");
      }

      setGuru(result.data?.guru || null);
      setKelasSaya(result.data?.kelasSaya || []);
      setMapelSaya(result.data?.mapelSaya || []);
      setMateriList(result.data?.materi || []);
      setRingkasan(
        result.data?.ringkasan || {
          totalKelas: 0,
          totalMapel: 0,
          totalMateri: 0,
          materiAktif: 0,
          materiDraft: 0,
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

  const filteredMateri = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return materiList.filter((item) => {
      const text = [
        item.judul,
        item.mapel,
        item.deskripsi,
        item.status,
        item.kelas?.nama_kelas,
      ]
        .join(" ")
        .toLowerCase();

      if (keyword && !text.includes(keyword)) return false;
      if (filterKelas && item.kelas_id !== filterKelas) return false;
      if (filterStatus && item.status !== filterStatus) return false;

      return true;
    });
  }, [materiList, search, filterKelas, filterStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id || "",
      kelas_id: item.kelas_id || "",
      judul: item.judul || "",
      mapel: item.mapel || "",
      deskripsi: item.deskripsi || "",
      link_materi: item.link_materi || "",
      status: item.status || "aktif",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.judul) {
      setErrorMessage("Judul materi wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(`${API_URL}/api/guru/materi/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan materi.");
      }

      setSuccessMessage(result.message || "Materi berhasil disimpan.");
      resetForm();
      fetchMateri();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (materiId) => {
    const yakin = confirm("Yakin ingin menghapus materi ini?");

    if (!yakin) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(
        `${API_URL}/api/guru/materi/${user.id}/${materiId}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": user.id,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus materi.");
      }

      setSuccessMessage("Materi berhasil dihapus.");
      fetchMateri();
    } catch (error) {
      setErrorMessage(error.message);
    }
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

            <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>

                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
                  <FaLeaf />
                  Learning Material
                </div>

                <h1 className="mt-5 text-[clamp(2.3rem,5vw,4.7rem)] font-black leading-[0.95] tracking-[-0.06em] text-emerald-950">
                  Materi
                  <span className="block text-amber-500">Ajar.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Assalamu’alaikum,{" "}
                  <span className="font-black text-emerald-700">
                    {guru?.nama || user?.nama || user?.email}
                  </span>
                  . Kelola materi pembelajaran untuk santri sesuai kelas dan
                  mata pelajaran yang Anda ajar.
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

            <section className="mb-7 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[42px] bg-emerald-800 p-7 text-white shadow-xl lg:p-9">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                    <FaQuran />
                    Bahan Ajar Santri
                  </p>

                  <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Susun materi agar pembelajaran lebih rapi dan terarah.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/80">
                    Guru dapat membuat materi, menautkan link Google Drive,
                    video pembelajaran, dokumen PDF, atau sumber belajar lain.
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchMateri()}
                    disabled={loading}
                    className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-amber-300 px-6 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-70"
                  >
                    Refresh Materi
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <div className="rounded-[42px] border border-emerald-100 bg-white p-7 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-300 text-2xl text-emerald-950">
                  <FaBookOpen />
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                  Total Materi
                </p>

                <h3 className="mt-2 text-5xl font-black leading-tight text-emerald-950">
                  {ringkasan.totalMateri || 0}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Materi pembelajaran yang sudah dibuat guru.
                </p>
              </div>
            </section>

            <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                icon={<FaLayerGroup />}
                label="Kelas Saya"
                value={ringkasan.totalKelas || 0}
                desc="Kelas terhubung"
              />
              <StatCard
                icon={<FaBookOpen />}
                label="Mapel"
                value={ringkasan.totalMapel || 0}
                desc="Mata pelajaran terkait"
              />
              <StatCard
                icon={<FaClipboardList />}
                label="Total Materi"
                value={ringkasan.totalMateri || 0}
                desc="Materi tersimpan"
              />
              <StatCard
                icon={<FaCheckCircle />}
                label="Aktif"
                value={ringkasan.materiAktif || 0}
                desc="Materi aktif"
              />
            </section>

            <section className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-[460px_1fr]">
              <div className="rounded-[34px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <FaPenFancy />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-emerald-950">
                      {form.id ? "Edit Materi" : "Tambah Materi"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Buat materi pembelajaran untuk kelas tertentu.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Judul Materi
                    </label>
                    <input
                      type="text"
                      name="judul"
                      value={form.judul}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Contoh: Bab 1 - Adab Menuntut Ilmu"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Kelas
                    </label>
                    <select
                      name="kelas_id"
                      value={form.kelas_id}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="">Pilih kelas</option>
                      {kelasSaya.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Mata Pelajaran
                    </label>
                    <select
                      name="mapel"
                      value={form.mapel}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="">Pilih mapel</option>
                      {mapelSaya.map((mapel) => (
                        <option key={mapel} value={mapel}>
                          {mapel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Link Materi
                    </label>
                    <div className="relative">
                      <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
                      <input
                        type="url"
                        name="link_materi"
                        value={form.link_materi}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-emerald-700">
                      Deskripsi Materi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={form.deskripsi}
                      onChange={handleChange}
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Tuliskan penjelasan singkat materi..."
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white font-black text-emerald-700 transition hover:bg-emerald-50"
                    >
                      <FaTimes />
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-black text-white transition hover:bg-emerald-800 disabled:opacity-70"
                    >
                      {saving ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaSave />
                      )}
                      {saving ? "Menyimpan..." : "Simpan Materi"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-[34px] border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-emerald-950">
                      Daftar Materi
                    </h2>
                    <p className="text-sm text-slate-500">
                      Menampilkan {filteredMateri.length} dari{" "}
                      {materiList.length} materi.
                    </p>
                  </div>

                  {loading && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                      <FaSpinner className="animate-spin" />
                      Memuat data...
                    </div>
                  )}
                </div>

                <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px_180px]">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-4 text-sm font-bold text-emerald-950 outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Cari judul, mapel, kelas..."
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
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {filteredMateri.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredMateri.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-black text-emerald-950">
                                {item.judul}
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status || "aktif"}
                              </span>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-500">
                              {item.kelas?.nama_kelas || "Semua kelas"} •{" "}
                              {item.mapel || "Mapel umum"} •{" "}
                              {formatTanggal(item.created_at)}
                            </p>

                            {item.deskripsi && (
                              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {item.deskripsi}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {item.link_materi && (
                              <a
                                href={item.link_materi}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800"
                              >
                                <FaExternalLinkAlt />
                                Buka
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 text-sm font-black text-emerald-950 transition hover:bg-amber-200"
                            >
                              <FaEdit />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-600"
                            >
                              <FaTrash />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Materi belum ditemukan"
                    desc="Buat materi pertama dengan mengisi form di sebelah kiri."
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}