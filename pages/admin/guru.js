import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion"; 
import SidebarAdmin from "./sidebar";

import {
  FaChalkboardTeacher,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaBookOpen,
  FaTrash,
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaSyncAlt,
  FaArrowLeft,
  FaShieldAlt,
  FaMosque,
  FaSpinner,
  FaCalendarAlt,
  FaVenusMars,
  FaGraduationCap,
  FaUserTie,
  FaStickyNote,
  FaInfoCircle,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const initialForm = {
  nama: "",
  email: "",
  password: "",
  nip: "",
  nuptk: "",
  mapel: "",
  no_hp: "",
  alamat: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  pendidikan_terakhir: "",
  status_kepegawaian: "",
  tanggal_bergabung: "",
  wali_kelas: "",
  catatan: "",
};

const WALI_KELAS_OPTIONS = [
  {
    group: "SMP",
    options: [
      "SMP Kelas 7",
      "SMP Kelas 8",
      "SMP Kelas 9",
    ],
  },
  {
    group: "SMK",
    options: ["SMK Kelas 10", "SMK Kelas 11 ", "SMK Kelas 12"],
  },
  {
    group: "Takhassus",
    options: ["Takhassus", "Takhassus Tahfidz", "Takhassus Kitab"],
  },
];

function generatePasswordFromBirthDate(tanggalLahir) {
  if (!tanggalLahir) return "";
  return String(tanggalLahir).replaceAll("-", "");
}

function formatDate(date) {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function StatCard({ icon, label, value, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-2xl"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-100/70">{label}</p>
          <h3 className="mt-1 text-3xl font-black text-white">{value}</h3>
          <p className="mt-1 text-xs text-emerald-100/55">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  required = false,
  rightElement = null,
  readOnly = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-emerald-50">
        {label} {required && <span className="text-yellow-300">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          className={`w-full rounded-2xl border border-white/10 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10 ${
            readOnly
              ? "bg-yellow-300/10 text-yellow-200"
              : "bg-slate-950/60 focus:bg-slate-950/80"
          }`}
          placeholder={placeholder}
        />

        {rightElement}
      </div>
    </div>
  );
}

function SelectInput({
  label,
  name,
  value,
  onChange,
  required = false,
  icon,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-emerald-50">
        {label} {required && <span className="text-yellow-300">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300">
          {icon}
        </div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/60 px-12 py-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10"
        >
          {children}
        </select>
      </div>
    </div>
  );
}

function TextAreaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  rows = 4,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-emerald-50">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-4 text-yellow-300">{icon}</div>

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-yellow-300/10"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ToastModal({ modal, onClose }) {
  const isSuccess = modal.type === "success";
  const isError = modal.type === "error";

  return (
    <AnimatePresence>
      {modal.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041b15] via-[#0b3b2e] to-[#14532d] p-7 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-300/15 blur-3xl" />

            <div className="relative z-10">
              <motion.div
                initial={{ rotate: -18, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border text-4xl shadow-xl ${
                  isSuccess
                    ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-300"
                    : isError
                    ? "border-red-300/30 bg-red-400/15 text-red-300"
                    : "border-yellow-300/30 bg-yellow-400/15 text-yellow-300"
                }`}
              >
                {isSuccess ? (
                  <FaCheckCircle />
                ) : isError ? (
                  <FaTimesCircle />
                ) : (
                  <FaExclamationTriangle />
                )}
              </motion.div>

              <h2 className="mt-5 text-2xl font-black">{modal.title}</h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-emerald-50/80">
                {modal.message}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-2xl bg-yellow-400 px-6 py-3 font-black text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Mengerti
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ConfirmDeleteModal({ selectedGuru, onClose, onConfirm, deleting }) {
  return (
    <AnimatePresence>
      {selectedGuru && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.9 }}
            className="relative w-full max-w-md overflow-hidden rounded-[34px] bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-8 text-center text-white">
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/20 bg-white/15 text-4xl shadow-xl backdrop-blur-md">
                  <FaTrash />
                </div>

                <h2 className="mt-5 text-3xl font-black">Hapus Guru?</h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-red-50/90">
                  Akun guru dan data login yang terhubung akan ikut dihapus.
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-bold text-slate-700">
                  {selectedGuru.nama}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedGuru.users?.email || "Email tidak tersedia"}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleting}
                  className="h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={deleting}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                >
                  {deleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminGuruPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); 

  const [adminUser, setAdminUser] = useState(null);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);

  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const [form, setForm] = useState(initialForm);

  const showModal = ({ type = "success", title, message }) => {
    setModal({
      show: true,
      type,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "admin") {
        router.push("/login");
        return;
      }

      setAdminUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (adminUser?.id) {
      fetchGuru();
    }
  }, [adminUser]);

  const filteredGuru = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return guruList;

    return guruList.filter((guru) => {
      const data = [
        guru.nama,
        guru.users?.email,
        guru.mapel,
        guru.nip,
        guru.nuptk,
        guru.no_hp,
        guru.tempat_lahir,
        guru.jenis_kelamin,
        guru.pendidikan_terakhir,
        guru.status_kepegawaian,
        guru.wali_kelas,
      ]
        .join(" ")
        .toLowerCase();

      return data.includes(keyword);
    });
  }, [guruList, search]);

  const activeGuru = useMemo(() => {
    return guruList.filter((guru) => guru.status === "aktif").length;
  }, [guruList]);

  const inactiveGuru = useMemo(() => {
    return guruList.filter((guru) => guru.status !== "aktif").length;
  }, [guruList]);

  const waliKelasCount = useMemo(() => {
    return guruList.filter((guru) => guru.wali_kelas).length;
  }, [guruList]);

  const fetchGuru = async () => {
    if (!adminUser?.id) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/guru`, {
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data guru.");
      }

      setGuruList(data.data || []);
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Memuat Data",
        message: error.message || "Data guru gagal diambil dari server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "tanggal_lahir") {
        updated.password = generatePasswordFromBirthDate(value);
      }

      return updated;
    });
  };

  const generatePassword = () => {
    if (!form.tanggal_lahir) {
      showModal({
        type: "warning",
        title: "Tanggal Lahir Belum Diisi",
        message:
          "Isi tanggal lahir guru terlebih dahulu agar password otomatis bisa dibuat.",
      });
      return;
    }

    const password = generatePasswordFromBirthDate(form.tanggal_lahir);

    setForm((prev) => ({
      ...prev,
      password,
    }));

    showModal({
      type: "success",
      title: "Password Otomatis Dibuat",
      message: `Password dibuat berdasarkan tanggal lahir guru: ${password}`,
    });
  };

  const copyPassword = async () => {
    if (!form.password) {
      showModal({
        type: "warning",
        title: "Password Kosong",
        message:
          "Isi tanggal lahir terlebih dahulu agar password otomatis muncul.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(form.password);
      showModal({
        type: "success",
        title: "Password Disalin",
        message: "Password guru berhasil disalin ke clipboard.",
      });
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menyalin",
        message: "Browser tidak mengizinkan akses clipboard.",
      });
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminUser?.id) {
      showModal({
        type: "error",
        title: "Admin Tidak Terdeteksi",
        message: "Silakan Logout lalu login ulang sebagai admin.",
      });
      return;
    }

    if (!form.nama || !form.email || !form.tanggal_lahir) {
      showModal({
        type: "warning",
        title: "Data Wajib Belum Lengkap",
        message: "Nama, email, dan tanggal lahir guru wajib diisi.",
      });
      return;
    }

    const finalForm = {
      ...form,
      password:
        form.password || generatePasswordFromBirthDate(form.tanggal_lahir),
    };

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/api/admin/guru`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminUser.id,
        },
        body: JSON.stringify(finalForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat akun guru.");
      }

      showModal({
        type: "success",
        title: "Akun Guru Berhasil Dibuat",
        message: `${form.nama} sekarang dapat login. Password otomatisnya adalah ${finalForm.password}.`,
      });

      resetForm();
      fetchGuru();
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Membuat Akun",
        message:
          error.message || "Terjadi kesalahan saat menyimpan akun guru.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedGuru || !adminUser?.id) return;

    try {
      setDeleting(true);

      const res = await fetch(`${API_URL}/api/admin/guru/${selectedGuru.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus guru.");
      }

      showModal({
        type: "success",
        title: "Guru Berhasil Dihapus",
        message: `Akun ${selectedGuru.nama} berhasil dihapus dari sistem.`,
      });

      setSelectedGuru(null);
      fetchGuru();
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menghapus",
        message:
          error.message || "Terjadi kesalahan saat menghapus akun guru.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#031A13] text-white">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-yellow-300" />
          <p className="font-bold">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen overflow-x-hidden bg-[#031A13] text-white">
    <SidebarAdmin
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
            : "md:ml-[270px] md:w-[calc(100%-270px)]"
        }
      `}
    >
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#031A13] px-4 py-6 text-white sm:px-5 lg:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#031A13] via-[#063F2D] to-[#010A07]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.045]" />

          <motion.div
            animate={{ y: [0, -22, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl"
          />

          <motion.div
            animate={{ y: [0, 25, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-yellow-300/15 blur-3xl"
          />
        </div>

        <div className="relative z-10 w-full max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>

              <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                <FaMosque />
                Admin Panel
              </div>

              <h1 className="mt-5 text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.06em]">
                Kelola Akun
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  Guru Pesantren
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-emerald-50/75 sm:text-base">
                Buat, pantau, dan kelola akun guru dengan data lengkap.
                Password guru otomatis dibuat dari tanggal lahir dengan format
                tahun-bulan-tanggal.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl lg:w-[340px]"
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-yellow-300/20 blur-3xl" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-emerald-950 shadow-xl">
                  <FaShieldAlt />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-emerald-100/70">
                    Login sebagai
                  </p>

                  <h3 className="mt-1 truncate text-lg font-black text-white">
                    {adminUser.nama || "Administrator"}
                  </h3>

                  <p className="truncate text-xs text-emerald-100/50">
                    {adminUser.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              icon={<FaUsers />}
              label="Total Guru"
              value={guruList.length}
              desc="Semua akun guru"
              delay={0.05}
            />

            <StatCard
              icon={<FaCheckCircle />}
              label="Guru Aktif"
              value={activeGuru}
              desc="Bisa login ke sistem"
              delay={0.12}
            />

            <StatCard
              icon={<FaUserTie />}
              label="Wali Kelas"
              value={waliKelasCount}
              desc="Guru yang menjadi wali kelas"
              delay={0.18}
            />

            <StatCard
              icon={<FaTimesCircle />}
              label="Tidak Aktif"
              value={inactiveGuru}
              desc="Perlu pengecekan admin"
              delay={0.24}
            />
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(380px,470px)_minmax(0,1fr)]">
            <motion.section
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="relative min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.04]" />
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />

              <div className="relative z-10 border-b border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-emerald-950 shadow-xl"
                  >
                    <FaUserPlus />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-black">Tambah Guru</h2>
                    <p className="mt-1 text-sm text-emerald-100/60">
                      Isi data lengkap guru baru.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative z-10 space-y-7 p-6"
              >
                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                      <FaInfoCircle />
                    </div>

                    <div>
                      <h3 className="font-black text-white">Data Login</h3>
                      <p className="text-xs text-emerald-100/55">
                        Email dan password untuk akses guru.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <FormInput
                      label="Nama Guru"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      required
                      icon={<FaChalkboardTeacher />}
                      placeholder="Contoh: Ustadz Ahmad"
                    />

                    <FormInput
                      label="Email Login"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      icon={<FaEnvelope />}
                      placeholder="guru@email.com"
                    />

                    <FormInput
                      label="Password Otomatis"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      icon={<FaLock />}
                      placeholder="Akan otomatis dari tanggal lahir"
                      readOnly
                      rightElement={
                        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                          <button
                            type="button"
                            onClick={copyPassword}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-100 transition hover:bg-white/20 hover:text-yellow-300"
                            title="Salin password"
                          >
                            <FaCopy />
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-100 transition hover:bg-white/20 hover:text-yellow-300"
                            title="Lihat password"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      }
                    />

                    <button
                      type="button"
                      onClick={generatePassword}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 px-4 py-3 text-sm font-black text-yellow-300 transition hover:bg-yellow-300 hover:text-emerald-950"
                    >
                      <FaSyncAlt />
                      Buat Ulang Password dari Tanggal Lahir
                    </button>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <h3 className="font-black text-white">Data Pribadi</h3>
                      <p className="text-xs text-emerald-100/55">
                        Tanggal lahir wajib karena menjadi password.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormInput
                      label="Tempat Lahir"
                      name="tempat_lahir"
                      value={form.tempat_lahir}
                      onChange={handleChange}
                      required
                      icon={<FaMapMarkerAlt />}
                      placeholder="Contoh: Depok"
                    />

                    <FormInput
                      label="Tanggal Lahir"
                      name="tanggal_lahir"
                      type="date"
                      value={form.tanggal_lahir}
                      onChange={handleChange}
                      required
                      icon={<FaCalendarAlt />}
                      placeholder="Tanggal lahir"
                    />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <SelectInput
                      label="Jenis Kelamin"
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={handleChange}
                      required
                      icon={<FaVenusMars />}
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </SelectInput>

                    <FormInput
                      label="No HP"
                      name="no_hp"
                      value={form.no_hp}
                      onChange={handleChange}
                      icon={<FaPhoneAlt />}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div className="mt-5">
                    <TextAreaInput
                      label="Alamat"
                      name="alamat"
                      value={form.alamat}
                      onChange={handleChange}
                      icon={<FaMapMarkerAlt />}
                      placeholder="Alamat lengkap guru"
                    />
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                      <FaGraduationCap />
                    </div>

                    <div>
                      <h3 className="font-black text-white">
                        Data Kepegawaian
                      </h3>
                      <p className="text-xs text-emerald-100/55">
                        Informasi mengajar dan status guru.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormInput
                      label="NIP"
                      name="nip"
                      value={form.nip}
                      onChange={handleChange}
                      icon={<FaIdCard />}
                      placeholder="Opsional"
                    />

                    <FormInput
                      label="NUPTK"
                      name="nuptk"
                      value={form.nuptk}
                      onChange={handleChange}
                      icon={<FaIdCard />}
                      placeholder="Opsional"
                    />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <FormInput
                      label="Mata Pelajaran"
                      name="mapel"
                      value={form.mapel}
                      onChange={handleChange}
                      icon={<FaBookOpen />}
                      placeholder="Contoh: Bahasa Arab"
                    />

                    <SelectInput
                      label="Wali Kelas"
                      name="wali_kelas"
                      value={form.wali_kelas}
                      onChange={handleChange}
                      icon={<FaUserTie />}
                    >
                      <option value="">Bukan wali kelas</option>

                      {WALI_KELAS_OPTIONS.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.options.map((kelas) => (
                            <option key={kelas} value={kelas}>
                              {kelas}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </SelectInput>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <FormInput
                      label="Pendidikan Terakhir"
                      name="pendidikan_terakhir"
                      value={form.pendidikan_terakhir}
                      onChange={handleChange}
                      icon={<FaGraduationCap />}
                      placeholder="Contoh: S1 Pendidikan Agama Islam"
                    />

                    <SelectInput
                      label="Status Kepegawaian"
                      name="status_kepegawaian"
                      value={form.status_kepegawaian}
                      onChange={handleChange}
                      icon={<FaShieldAlt />}
                    >
                      <option value="">Pilih status</option>
                      <option value="Guru Tetap">Guru Tetap</option>
                      <option value="Guru Honorer">Guru Honorer</option>
                      <option value="Guru Pengabdian">Guru Pengabdian</option>
                      <option value="Guru Magang">Guru Magang</option>
                    </SelectInput>
                  </div>

                  <div className="mt-5">
                    <FormInput
                      label="Tanggal Bergabung"
                      name="tanggal_bergabung"
                      type="date"
                      value={form.tanggal_bergabung}
                      onChange={handleChange}
                      icon={<FaCalendarAlt />}
                      placeholder="Tanggal bergabung"
                    />
                  </div>

                  <div className="mt-5">
                    <TextAreaInput
                      label="Catatan"
                      name="catatan"
                      value={form.catatan}
                      onChange={handleChange}
                      icon={<FaStickyNote />}
                      placeholder="Catatan tambahan tentang guru"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-1 hover:bg-yellow-300 disabled:translate-y-0 disabled:opacity-60"
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaUserPlus />
                    )}
                    {saving ? "Menyimpan..." : "Buat Akun Guru"}
                  </button>
                </div>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.035]" />
              <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

              <div className="relative z-10 border-b border-white/10 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Daftar Guru</h2>
                    <p className="mt-1 text-sm text-emerald-100/60">
                      Pantau seluruh akun guru yang telah dibuat admin.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchGuru}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/20 disabled:opacity-60"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>

                <div className="relative mt-5">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10"
                    placeholder="Cari nama, email, mapel, NIP, NUPTK, wali kelas..."
                  />
                </div>
              </div>

              <div className="relative z-10 p-6">
                {loading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/10"
                      />
                    ))}
                  </div>
                ) : filteredGuru.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-black/15 p-8 text-center"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-yellow-400/15 text-4xl text-yellow-300">
                      <FaChalkboardTeacher />
                    </div>

                    <h3 className="mt-5 text-2xl font-black">
                      Guru Tidak Ditemukan
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-100/60">
                      Belum ada akun guru atau kata kunci pencarian tidak cocok
                      dengan data manapun.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {filteredGuru.map((guru, index) => (
                        <motion.div
                          key={guru.id}
                          initial={{ opacity: 0, y: 18, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -15, scale: 0.96 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          whileHover={{ y: -4, scale: 1.01 }}
                          className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/35 p-5 transition hover:border-yellow-300/30 hover:bg-slate-950/55"
                        >
                          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/0 blur-2xl transition group-hover:bg-yellow-300/10" />

                          <div className="relative z-10 flex flex-col gap-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex min-w-0 items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-xl font-black text-emerald-950 shadow-lg">
                                  {String(guru.nama || "G")
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="truncate text-xl font-black text-white">
                                      {guru.nama}
                                    </h3>

                                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-300">
                                      {guru.status || "aktif"}
                                    </span>
                                  </div>

                                  <p className="mt-2 flex items-center gap-2 text-sm text-emerald-100/70">
                                    <FaEnvelope className="text-yellow-300" />
                                    <span className="truncate">
                                      {guru.users?.email || "-"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedGuru(guru)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white"
                              >
                                <FaTrash />
                                Hapus
                              </button>
                            </div>

                            <div className="grid gap-3 rounded-[22px] border border-white/10 bg-black/15 p-4 text-sm text-emerald-100/70 sm:grid-cols-2 xl:grid-cols-3">
                              <p className="flex items-center gap-2">
                                <FaBookOpen className="text-yellow-300" />
                                <span>{guru.mapel || "Mapel belum diisi"}</span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaIdCard className="text-yellow-300" />
                                <span>{guru.nip || "NIP belum diisi"}</span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaIdCard className="text-yellow-300" />
                                <span>{guru.nuptk || "NUPTK belum diisi"}</span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaPhoneAlt className="text-yellow-300" />
                                <span>{guru.no_hp || "No HP belum diisi"}</span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaVenusMars className="text-yellow-300" />
                                <span>
                                  {guru.jenis_kelamin ||
                                    "Jenis kelamin belum diisi"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaCalendarAlt className="text-yellow-300" />
                                <span>
                                  {guru.tempat_lahir || "-"},{" "}
                                  {formatDate(guru.tanggal_lahir)}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaGraduationCap className="text-yellow-300" />
                                <span>
                                  {guru.pendidikan_terakhir ||
                                    "Pendidikan belum diisi"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaShieldAlt className="text-yellow-300" />
                                <span>
                                  {guru.status_kepegawaian ||
                                    "Status belum diisi"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaUserTie className="text-yellow-300" />
                                <span>
                                  {guru.wali_kelas || "Bukan wali kelas"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaCalendarAlt className="text-yellow-300" />
                                <span>
                                  Bergabung:{" "}
                                  {formatDate(guru.tanggal_bergabung)}
                                </span>
                              </p>
                            </div>

                            {guru.alamat && (
                              <p className="flex items-start gap-2 rounded-[20px] bg-white/5 p-4 text-sm leading-relaxed text-emerald-100/60">
                                <FaMapMarkerAlt className="mt-1 shrink-0 text-yellow-300" />
                                {guru.alamat}
                              </p>
                            )}

                            {guru.catatan && (
                              <p className="flex items-start gap-2 rounded-[20px] bg-yellow-300/10 p-4 text-sm leading-relaxed text-yellow-100/80">
                                <FaStickyNote className="mt-1 shrink-0 text-yellow-300" />
                                {guru.catatan}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
              </div>
          </div>
    </main>

    <ToastModal modal={modal} onClose={closeModal} />

    <ConfirmDeleteModal
      selectedGuru={selectedGuru}
      onClose={() => setSelectedGuru(null)}
      onConfirm={handleConfirmDelete}
      deleting={deleting}
    />
  </div>
);}