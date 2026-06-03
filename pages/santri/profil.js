"use client";

import { useEffect, useRef, useState } from "react";
import SidebarSantri from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaUserCircle,
  FaSave,
  FaEdit,
  FaTimes,
  FaCamera,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSchool,
  FaIdCard,
  FaMosque,
  FaGraduationCap,
  FaHome,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaQuran,
  FaCity,
  FaBookOpen,
  FaHeart,
  FaUserGraduate,
  FaStar,
} from "react-icons/fa";

const emptyForm = {
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
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const editableFields = [
  "telepon",
  "email",
  "alamat",
  "kota",
  "provinsi",
  "kode_pos",
  "asal_sekolah",
  "cita_cita",
  "hobi",
];

export default function ProfilSantri() {
  const [santri, setSantri] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchProfil = async () => {
  try {
    setLoading(true);

    const session = JSON.parse(localStorage.getItem("session"));

    if (!session?.user?.id) {
      showToast("error", "Session tidak ditemukan. Silakan login ulang.");
      return;
    }

    const response = await fetch(
      `${API_URL}/api/santri/profile/${session.user.id}`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      showToast("error", result.message || "Gagal mengambil profil santri.");
      return;
    }

    const data = result.data;

    setSantri(data);

    setForm({
      nama: data?.nama || "",
      nisn: data?.nisn || "",
      nik: data?.nik || "",
      tempat_lahir: data?.tempat_lahir || "",
      tanggal_lahir: data?.tanggal_lahir || "",
      agama: data?.agama || "",
      jenjang: data?.jenjang || "",
      kelas: data?.kelas || "",
      jenis_kelamin: data?.jenis_kelamin || "",
      telepon: data?.telepon || "",
      email: data?.email || "",
      alamat: data?.alamat || "",
      kota: data?.kota || "",
      provinsi: data?.provinsi || "",
      kode_pos: data?.kode_pos || "",
      asal_sekolah: data?.asal_sekolah || "",
      cita_cita: data?.cita_cita || "",
      hobi: data?.hobi || "",
      foto: data?.foto || "",
    });
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const canEditSantri = (field) => {
  return editMode && editableFields.includes(field);
};

  const handleCancel = () => {
    if (santri) {
      setForm({
        nama: santri?.nama || "",
        nisn: santri?.nisn || "",
        nik: santri?.nik || "",
        tempat_lahir: santri?.tempat_lahir || "",
        tanggal_lahir: santri?.tanggal_lahir || "",
        agama: santri?.agama || "",
        jenjang: santri?.jenjang || "",
        kelas: santri?.kelas || "",
        jenis_kelamin: santri?.jenis_kelamin || "",
        telepon: santri?.telepon || "",
        email: santri?.email || "",
        alamat: santri?.alamat || "",
        kota: santri?.kota || "",
        provinsi: santri?.provinsi || "",
        kode_pos: santri?.kode_pos || "",
        asal_sekolah: santri?.asal_sekolah || "",
        cita_cita: santri?.cita_cita || "",
        hobi: santri?.hobi || "",
        foto: santri?.foto || "",
      });
    }

    setEditMode(false);
  };

  const handlePhotoClick = () => {
  fileInputRef.current?.click();
};

const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setUploadingPhoto(true);

    const session = JSON.parse(localStorage.getItem("session"));

    if (!session?.user?.id) {
      showToast("error", "Session tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("error", "File harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Ukuran foto maksimal 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);

    const response = await fetch(
      `${API_URL}/api/santri/profile/${session.user.id}/foto`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      showToast("error", result.message || "Gagal upload foto.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      foto: result.data?.foto || "",
    }));

    setSantri(result.data);

    showToast("success", "Foto profil berhasil diperbarui.");
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setUploadingPhoto(false);
    e.target.value = "";
  }
};

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const session = JSON.parse(localStorage.getItem("session"));

    if (!session?.user?.id) {
      showToast("error", "Session tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!form.email.trim()) {
      showToast("error", "Email wajib diisi.");
      return;
    }

    const response = await fetch(
      `${API_URL}/api/santri/profile/${session.user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telepon: form.telepon,
          email: form.email,
          alamat: form.alamat,
          kota: form.kota,
          provinsi: form.provinsi,
          kode_pos: form.kode_pos,
          asal_sekolah: form.asal_sekolah,
          cita_cita: form.cita_cita,
          hobi: form.hobi,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      showToast("error", result.message || "Gagal memperbarui profil.");
      return;
    }

    showToast("success", "Profil berhasil diperbarui.");
    setSantri(result.data);
    setEditMode(false);
    fetchProfil();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setSaving(false);
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

  const profileStats = [
    {
      title: "Jenjang",
      value: santri?.jenjang || "-",
      icon: <FaSchool />,
      color: "bg-emerald-600 text-white",
    },
    {
      title: santri?.jenjang === "Takhassus" ? "Marhalah" : "Kelas",
      value: santri?.kelas || "-",
      icon: <FaMosque />,
      color: "bg-yellow-400 text-emerald-950",
    },
    {
      title: "Status",
      value: "Aktif",
      icon: <FaCheckCircle />,
      color: "bg-green-600 text-white",
    },
    {
      title: "NISN",
      value: santri?.nisn || "-",
      icon: <FaIdCard />,
      color: "bg-blue-600 text-white",
    },
  ];

  const { checking } = useAuthGuard(["santri"]);

if (checking) {
  return <AuthLoading role="Santri" />;
}

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#061B14] text-slate-700">
      <SidebarSantri
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <motion.main
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          min-h-screen transition-all duration-300
          pt-16 md:pt-0
          ${collapsed ? "md:ml-[90px]" : "md:ml-[280px]"}
        `}
      >
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#061B14_0%,#0B3B2E_42%,#F2EAD5_42%,#F2EAD5_100%)]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative z-10">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061B14]/75 backdrop-blur-2xl">
              <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
                  >
                    <FaHome />
                  </button>

                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-black text-white md:text-2xl">
                      Profil Santri
                    </h1>

                    <p className="mt-1 truncate text-xs font-semibold text-emerald-100/75 sm:text-sm">
                      Kelola data diri dan informasi santri
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => window.history.back()}
                  className="hidden h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:flex"
                >
                  <FaArrowLeft className="text-yellow-300" />
                  Kembali
                </button>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#071B14]/80 p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-9">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.88),rgba(74,52,16,0.72))]" />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.15,
                      duration: 0.7,
                      type: "spring",
                    }}
                    className="relative mx-auto w-full max-w-md xl:mx-0"
                  >
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-3 -top-4 z-20 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-2xl"
                    >
                      <FaStar />
                    </motion.div>

                    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]" />

                      <div className="relative z-10 text-center">
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-200">
                          <FaUserCircle />
                          Kartu Profil
                        </div>

                        <div className="mt-8 flex justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-yellow-300/25 blur-3xl" />

                            <button
  type="button"
  onClick={handlePhotoClick}
  disabled={uploadingPhoto}
  className="group relative rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-70"
>
  <motion.img
    initial={{ scale: 0.75, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      delay: 0.35,
      duration: 0.7,
      type: "spring",
    }}
    whileHover={{
      scale: 1.06,
      rotate: 2,
    }}
    src={santri?.foto || "/default-user.png"}
    alt="Foto Santri"
    onError={(e) => {
      e.currentTarget.src = "/default-user.png";
    }}
    className="relative h-44 w-44 rounded-full border-[6px] border-white object-cover shadow-2xl sm:h-56 sm:w-56"
  />

  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
    <FaCamera className="text-3xl text-yellow-300" />

    <span className="mt-2 text-xs font-black uppercase tracking-widest">
      {uploadingPhoto ? "Mengupload..." : "Ganti Foto"}
    </span>
  </div>

  <div className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-yellow-400 text-emerald-950 shadow-xl">
    <FaCamera />
  </div>
</button>

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handlePhotoUpload}
  className="hidden"
/>
                          </div>
                        </div>

                        <h2 className="mt-7 text-3xl font-black text-white">
                          {loading ? "Memuat..." : santri?.nama || "Santri"}
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-emerald-50/75">
                          {santri?.jenjang || "-"}{" "}
                          {santri?.jenjang === "Takhassus"
                            ? `Marhalah ${santri?.kelas || "-"}`
                            : `Kelas ${santri?.kelas || "-"}`}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <ProfileMiniCard
                            label="Status"
                            value="Aktif"
                            icon={<FaCheckCircle />}
                          />

                          <ProfileMiniCard
                            label="NISN"
                            value={santri?.nisn || "-"}
                            icon={<FaIdCard />}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl"
                    >
                      <FaQuran className="text-yellow-300" />
                      <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                        Data Santri Al-Furqon
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.25, duration: 0.7 }}
                      className="mt-6 text-[clamp(2.2rem,6vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]"
                    >
                      Lengkapi data,
                      <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                        rapikan identitas.
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.65 }}
                      className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base lg:text-lg"
                    >
                      Halaman ini digunakan untuk melihat dan memperbarui data
                      pribadi santri. Pastikan informasi kontak, alamat, dan
                      data pendidikan sudah sesuai.
                    </motion.p>

                    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {profileStats.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.48 + index * 0.08 }}
                          className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
                        >
                          <div
                            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${item.color}`}
                          >
                            {item.icon}
                          </div>

                          <p className="text-xs font-semibold text-emerald-50/75">
                            {item.title}
                          </p>

                          <h3 className="mt-1 truncate text-lg font-black text-white">
                            {loading ? "..." : item.value}
                          </h3>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      {!editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                        >
                          <FaEdit />
                          Edit Profil
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:opacity-60 sm:text-base"
                          >
                            <FaSave />
                            {saving ? "Menyimpan..." : "Simpan Perubahan"}
                          </button>

                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20 disabled:opacity-60 sm:text-base"
                          >
                            <FaTimes />
                            Batal
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <form onSubmit={handleSave}>
                <section className="mt-7 rounded-[42px] bg-[#F2EAD5] p-4 shadow-2xl shadow-black/10 sm:p-6 lg:p-7">
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.82fr]">
                    <div className="space-y-5">
                      <ProfileSection
                        title="Identitas Santri"
                        icon={<FaIdCard />}
                        desc="Data utama santri yang digunakan sebagai identitas resmi."
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Input
  label="Nama Lengkap"
  value={form.nama}
  onChange={(v) => handleChange("nama", v)}
  disabled={true}
  required
/>
<Input
  label="NISN"
  value={form.nisn}
  onChange={(v) => handleChange("nisn", v)}
  disabled={true}
/>
<Input
  label="NIK"
  value={form.nik}
  onChange={(v) => handleChange("nik", v)}
  disabled={true}
/>
<Input
  type="date"
  label="Tanggal Lahir"
  value={form.tanggal_lahir}
  onChange={(v) => handleChange("tanggal_lahir", v)}
  disabled={true}
/>
<Input
  label="Agama"
  value={form.agama}
  onChange={(v) => handleChange("agama", v)}
  disabled={true}
/>

                          <Select
                            label="Jenis Kelamin"
                            value={form.jenis_kelamin}
                            onChange={(v) =>
                              handleChange("jenis_kelamin", v)
                            }
                            disabled={!editMode}
                            options={["Laki-laki", "Perempuan"]}
                          />

                          <Input
                            label="Agama"
                            value={form.agama}
                            onChange={(v) => handleChange("agama", v)}
                            disabled={!editMode}
                          />
                        </div>
                      </ProfileSection>

                      <ProfileSection
                        title="Data Pendidikan"
                        icon={<FaGraduationCap />}
                        desc="Informasi akademik dan pendidikan santri."
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
<Select
  label="Jenjang"
  value={form.jenjang}
  onChange={(v) => handleChange("jenjang", v)}
  disabled={true}
  options={["SMP", "SMK", "Takhassus"]}
/>
<Input
  label={form.jenjang === "Takhassus" ? "Marhalah" : "Kelas"}
  value={form.kelas}
  onChange={(v) => handleChange("kelas", v)}
  disabled={true}
/>
<Input
  label="Asal Sekolah"
  value={form.asal_sekolah}
  onChange={(v) => handleChange("asal_sekolah", v)}
  disabled={!canEditSantri("asal_sekolah")}
/>
<Input
  label="Cita-cita"
  value={form.cita_cita}
  onChange={(v) => handleChange("cita_cita", v)}
  disabled={!canEditSantri("cita_cita")}
/>
<Input
  label="Hobi"
  value={form.hobi}
  onChange={(v) => handleChange("hobi", v)}
  disabled={!canEditSantri("hobi")}
/>
                        </div>
                      </ProfileSection>

                      <ProfileSection
                        title="Kontak & Alamat"
                        icon={<FaMapMarkerAlt />}
                        desc="Pastikan nomor HP dan alamat dapat dihubungi."
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 <Input
  label="Telepon"
  value={form.telepon}
  onChange={(v) => handleChange("telepon", v)}
  disabled={!canEditSantri("telepon")}
/>
<Input
  type="email"
  label="Email"
  value={form.email}
  onChange={(v) => handleChange("email", v)}
  disabled={!canEditSantri("email")}
  required
/>
<Input
  label="Kota"
  value={form.kota}
  onChange={(v) => handleChange("kota", v)}
  disabled={!canEditSantri("kota")}
/>
<Input
  label="Provinsi"
  value={form.provinsi}
  onChange={(v) => handleChange("provinsi", v)}
  disabled={!canEditSantri("provinsi")}
/>
<Input
  label="Kode Pos"
  value={form.kode_pos}
  onChange={(v) => handleChange("kode_pos", v)}
  disabled={!canEditSantri("kode_pos")}
/>
                        </div>

                        <div className="mt-4">
<Textarea
  label="Alamat Lengkap"
  value={form.alamat}
  onChange={(v) => handleChange("alamat", v)}
  disabled={!canEditSantri("alamat")}
/>
                        </div>
                      </ProfileSection>
                    </div>

                    <div className="space-y-5">
                      <InfoCard
                        title="Ringkasan Profil"
                        icon={<FaUserGraduate />}
                        items={[
                          ["Nama", santri?.nama],
                          ["NISN", santri?.nisn],
                          ["Jenjang", santri?.jenjang],
                          ["Kelas", santri?.kelas],
                          ["Tanggal Lahir", formatTanggal(santri?.tanggal_lahir)],
                          ["Telepon", santri?.telepon],
                          ["Email", santri?.email],
                        ]}
                      />

                      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] p-6 text-white shadow-xl shadow-green-950/10">
                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

                        <div className="relative z-10">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
                            <FaBookOpen />
                          </div>

                          <p className="mt-5 text-sm font-semibold text-emerald-100">
                            Catatan
                          </p>

                          <h3 className="mt-2 text-2xl font-black leading-snug text-white">
                            Data yang benar memudahkan administrasi pondok.
                          </h3>

<p className="mt-3 text-sm leading-relaxed text-emerald-50/85">
  Santri hanya dapat mengubah foto profil, kontak, alamat,
  asal sekolah, cita-cita, dan hobi. Untuk perubahan nama,
  NISN, NIK, kelas, atau jenjang, silakan hubungi admin pesantren.
</p>
                        </div>
                      </div>

                      {editMode && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-[34px] border border-yellow-200 bg-yellow-50 p-5 shadow-xl shadow-yellow-950/5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                              <FaExclamationCircle />
                            </div>

                            <div>
                              <h3 className="font-black text-[#1F1607]">
                                Mode Edit Aktif
                              </h3>

<p className="mt-1 text-sm leading-relaxed text-slate-600">
  Mode edit hanya berlaku untuk data kontak, alamat,
  asal sekolah, cita-cita, dan hobi. Data identitas resmi
  hanya dapat diubah oleh admin.
</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <div className="sticky bottom-4 z-20 mt-6 rounded-[28px] border border-[#E5D6AA] bg-white/90 p-3 shadow-2xl backdrop-blur-xl">
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={saving}
                          className="h-12 rounded-2xl bg-slate-100 px-5 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                        >
                          Batal
                        </button>

                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:bg-[#086B4F] disabled:opacity-60"
                        >
                          <FaSave />
                          {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </form>
            </div>
          </div>
        </section>
      </motion.main>

      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProfileMiniCard({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
        {icon}
      </div>

      <p className="text-sm font-semibold text-emerald-50/70">{label}</p>

      <h3 className="mt-1 truncate text-lg font-black text-white">{value}</h3>
    </div>
  );
}

function ProfileSection({ title, desc, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[34px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-xl shadow-yellow-950/5 sm:p-6"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#064E3B] text-xl text-white shadow-lg">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-black text-[#1F1607]">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {desc}
            </p>
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={`
          h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none transition
          ${
            disabled
              ? "border-slate-200 bg-slate-100 text-slate-500"
              : "border-[#D8C287] bg-white text-slate-700 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
          }
        `}
      />
    </div>
  );
}

function Select({ label, value, onChange, disabled, options = [] }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <select
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none transition
          ${
            disabled
              ? "border-slate-200 bg-slate-100 text-slate-500"
              : "border-[#D8C287] bg-white text-slate-700 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
          }
        `}
      >
        <option value="">Pilih {label}</option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <textarea
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={`
          min-h-[110px] w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition
          ${
            disabled
              ? "border-slate-200 bg-slate-100 text-slate-500"
              : "border-[#D8C287] bg-white text-slate-700 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
          }
        `}
      />
    </div>
  );
}

function InfoCard({ title, icon, items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[34px] border border-[#E5D6AA] bg-white p-6 shadow-xl shadow-yellow-950/5"
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg">
          {icon}
        </div>

        <h2 className="text-xl font-black text-[#1F1607]">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-none last:pb-0"
          >
            <span className="text-sm font-semibold text-slate-500">
              {label}
            </span>

            <span className="max-w-[58%] break-words text-right text-sm font-black text-slate-800">
              {value || "-"}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Toast({ type, message, onClose }) {
  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      className="fixed right-4 top-5 z-[9999] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#061B14] p-4 text-white shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isSuccess
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-black">
            {isSuccess ? "Berhasil" : "Terjadi Kesalahan"}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-emerald-50/80">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
}