import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaArrowLeft,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaEdit,
  FaExclamationTriangle,
  FaGraduationCap,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaMosque,
  FaPlus,
  FaPrint,
  FaSchool,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaStickyNote,
  FaSyncAlt,
  FaTimes,
  FaTimesCircle,
  FaTrash,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { div } from "framer-motion/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const JENJANG_OPTIONS = ["SMP", "SMK", "Takhassus"];

const KELAS_OPTIONS_BY_JENJANG = {
  SMP: ["7", "8", "9"],
  SMK: ["10", "11", "12"],
  Takhassus: ["Takhassus"],
};

const JURUSAN_SMK_OPTIONS = ["TKJ", "RPL", "DKV", "OTKP", "AKL", "BDP"];

const HARI_OPTIONS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const initialForm = {
  jenjang: "",
  kelas: "",
  jurusan: "",
  wali_guru_id: "",
  tahun_ajaran: "",
  semester: "",
  deskripsi: "",
  status: "aktif",
};

const initialMapel = {
  nama_mapel: "",
  guru_id: "",
  hari: "",
  jam_mulai: "",
  jam_selesai: "",
  ruang_id: "",
  ruang: "",
  jam_per_minggu: "",
  status: "aktif",
  keterangan: "",
};

const initialRuang = {
  nama_ruang: "",
  lokasi: "",
  kapasitas: "",
  status: "aktif",
};

const buildNamaKelas = ({ jenjang, kelas, jurusan }) => {
  if (!jenjang || !kelas) return "";

  if (jenjang === "SMP") {
    return `SMP Kelas ${kelas}`;
  }

  if (jenjang === "SMK") {
    return `SMK Kelas ${kelas}${jurusan ? ` ${jurusan}` : ""}`;
  }

  if (jenjang === "Takhassus") {
    return "Takhassus";
  }

  return `${jenjang} ${kelas}`;
};

function StatCard({ icon, label, value, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-2xl"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950 shadow-lg">
          {icon}
        </div>

        <div>
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
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10"
          placeholder={placeholder}
        />
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

function TextAreaInput({ label, name, value, onChange, placeholder, icon }) {
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
          rows={4}
          className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10"
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
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041b15] via-[#0b3b2e] to-[#14532d] p-7 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />

            <div className="relative z-10">
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border text-4xl ${
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
              </div>

              <h2 className="mt-5 text-2xl font-black">{modal.title}</h2>

              <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">
                {modal.message}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-2xl bg-yellow-400 px-6 py-3 font-black text-emerald-950 transition hover:bg-yellow-300"
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

export default function AdminKelasPage() {
  const router = useRouter();

  const { checking } = useAuthGuard(["admin"]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [adminUser, setAdminUser] = useState(null);
  const [guruList, setGuruList] = useState([]);
  const [ruangList, setRuangList] = useState([]);
  const [santriList, setSantriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [mapelList, setMapelList] = useState([{ ...initialMapel }]);
  const [siswaList, setSiswaList] = useState([]);
  const [ruangForm, setRuangForm] = useState(initialRuang);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [jadwalFilter, setJadwalFilter] = useState({
    jenjang: "",
    kelas_id: "",
    guru_id: "",
    hari: "",
  });

  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const showModal = ({ type = "success", title, message }) => {
    setModal({ show: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: "success", title: "", message: "" });
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
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (adminUser?.id) {
      fetchInitialData();
    }
  }, [adminUser]);

  const fetchInitialData = async () => {
    await Promise.all([fetchOptions(), fetchKelas()]);
  };

  const fetchOptions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/kelas/options`, {
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data pilihan.");
      }

      setGuruList(data.data?.guru || []);
      setRuangList(data.data?.ruang || []);
      setSantriList(data.data?.santri || []);
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Mengambil Pilihan",
        message: error.message,
      });
    }
  };

  const fetchKelas = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/kelas`, {
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data kelas.");
      }

      setKelasList(data.data || []);
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Mengambil Kelas",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .replaceAll("kelas", "")
    .replaceAll("jurusan", "")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeJenjang = (value) => {
  return String(value || "").toLowerCase().trim();
};

const normalizeStatus = (value) => {
  return String(value || "").toLowerCase().trim();
};

const isSantriAktif = (santri) => {
  return normalizeStatus(santri.status) === "aktif";
};

const isSantriMatchKelas = (santri) => {
  const formJenjang = normalizeJenjang(form.jenjang);
  const formKelas = normalizeText(form.kelas);
  const formJurusan = normalizeText(form.jurusan);

  const santriJenjang = normalizeJenjang(santri.jenjang);
  const santriKelas = normalizeText(santri.kelas);
  const santriStatus = normalizeStatus(santri.status);

  if (!form.jenjang || !form.kelas) {
    return false;
  }

  if (santriStatus !== "aktif") {
    return false;
  }

  if (!santriJenjang || santriJenjang !== formJenjang) {
    return false;
  }

  if (!santriKelas || santriKelas !== formKelas) {
    return false;
  }

  if (formJenjang === "smk" && formJurusan) {
  const santriJurusan = normalizeText(santri.jurusan);
  return santriJurusan === formJurusan;
}

  return true;
};

const visibleSantriList = useMemo(() => {
  return santriList.filter((santri) => {
    if (!isSantriAktif(santri)) {
      return false;
    }

    if (!form.jenjang) {
      return true;
    }

    if (normalizeJenjang(santri.jenjang) !== normalizeJenjang(form.jenjang)) {
      return false;
    }

    if (!form.kelas) {
      return true;
    }

    return isSantriMatchKelas(santri);
  });
}, [santriList, form.jenjang, form.kelas, form.jurusan]);

const tarikSantriOtomatis = () => {
  if (!form.jenjang || !form.kelas) {
    showModal({
      type: "warning",
      title: "Data Kelas Belum Lengkap",
      message:
        "Pilih jenjang dan kelas terlebih dahulu sebelum menarik data santri.",
    });
    return;
  }

  const matchedSantri = santriList.filter(isSantriMatchKelas);
  const matchedIds = matchedSantri.map((santri) => santri.id);

  setSiswaList(matchedIds);

  const namaKelas = buildNamaKelas(form);

  showModal({
    type: matchedIds.length > 0 ? "success" : "warning",
    title:
      matchedIds.length > 0
        ? "Santri Berhasil Ditarik"
        : "Santri Tidak Ditemukan",
    message:
      matchedIds.length > 0
        ? `${matchedIds.length} santri aktif berhasil dimasukkan ke ${namaKelas}. Santri berbeda jenjang, berbeda kelas, ditolak, atau pending tidak ikut ditarik.`
        : `Belum ada santri aktif yang cocok dengan ${namaKelas}.`,
  });
};
  const filteredKelas = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return kelasList;

    return kelasList.filter((kelas) => {
      const mapelText = (kelas.kelas_mapel || [])
        .map((item) =>
          [
            item.nama_mapel,
            item.hari,
            item.jam_mulai,
            item.jam_selesai,
            item.ruang,
            item.guru?.nama,
          ].join(" ")
        )
        .join(" ");

      const siswaText = (kelas.kelas_siswa || [])
        .map((item) => item.santri?.nama)
        .join(" ");

      const text = [
        kelas.jenjang,
        kelas.nama_kelas,
        kelas.tingkat,
        kelas.jurusan,
        kelas.tahun_ajaran,
        kelas.semester,
        kelas.wali?.nama,
        mapelText,
        siswaText,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [kelasList, search]);

  const weeklyRows = useMemo(() => {
    const rows = [];

    kelasList.forEach((kelas) => {
      (kelas.kelas_mapel || []).forEach((mapel) => {
        rows.push({
          kelas_id: kelas.id,
          jenjang: kelas.jenjang,
          kelas: kelas.nama_kelas,
          hari: mapel.hari || "-",
          jam_mulai: mapel.jam_mulai || "-",
          jam_selesai: mapel.jam_selesai || "-",
          mapel: mapel.nama_mapel,
          guru_id: mapel.guru_id,
          guru: mapel.guru?.nama || "Belum ditentukan",
          ruang:
            mapel.ruang || mapel.ruang_detail?.nama_ruang || "Belum diatur",
          status: mapel.status || "aktif",
        });
      });
    });

    const orderHari = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
      Minggu: 7,
    };

    return rows
      .filter((row) => {
        if (jadwalFilter.jenjang && row.jenjang !== jadwalFilter.jenjang) {
          return false;
        }

        if (jadwalFilter.kelas_id && row.kelas_id !== jadwalFilter.kelas_id) {
          return false;
        }

        if (jadwalFilter.guru_id && row.guru_id !== jadwalFilter.guru_id) {
          return false;
        }

        if (jadwalFilter.hari && row.hari !== jadwalFilter.hari) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const hariA = orderHari[a.hari] || 99;
        const hariB = orderHari[b.hari] || 99;

        if (hariA !== hariB) return hariA - hariB;

        return String(a.jam_mulai).localeCompare(String(b.jam_mulai));
      });
  }, [kelasList, jadwalFilter]);

  const smpCount = useMemo(
    () => kelasList.filter((item) => item.jenjang === "SMP").length,
    [kelasList]
  );

  const smkCount = useMemo(
    () => kelasList.filter((item) => item.jenjang === "SMK").length,
    [kelasList]
  );

  const takhassusCount = useMemo(
    () => kelasList.filter((item) => item.jenjang === "Takhassus").length,
    [kelasList]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "jenjang") {
        updated.kelas = "";
        updated.jurusan = "";
      }

      if (name === "kelas" && prev.jenjang !== "SMK") {
        updated.jurusan = "";
      }

      return updated;
    });
  };

  const handleMapelChange = (index, e) => {
    const { name, value } = e.target;

    setMapelList((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const updated = { ...item, [name]: value };

        if (name === "ruang_id") {
          const ruang = ruangList.find((r) => r.id === value);
          updated.ruang = ruang?.nama_ruang || "";
        }

        return updated;
      })
    );
  };

  const addMapel = () => {
    setMapelList((prev) => [...prev, { ...initialMapel }]);
  };

  const removeMapel = (index) => {
    setMapelList((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const toggleSiswa = (santriId) => {
    setSiswaList((prev) => {
      if (prev.includes(santriId)) {
        return prev.filter((id) => id !== santriId);
      }

      return [...prev, santriId];
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setMapelList([{ ...initialMapel }]);
    setSiswaList([]);
  };

  const handleEdit = (kelas) => {
    setEditingId(kelas.id);

    setForm({
      jenjang: kelas.jenjang || "",
      kelas: kelas.tingkat || "",
      jurusan: kelas.jenjang === "SMK" ? kelas.jurusan || "" : "",
      wali_guru_id: kelas.wali_guru_id || "",
      tahun_ajaran: kelas.tahun_ajaran || "",
      semester: kelas.semester || "",
      deskripsi: kelas.deskripsi || "",
      status: kelas.status || "aktif",
    });

    setMapelList(
      kelas.kelas_mapel?.length > 0
        ? kelas.kelas_mapel.map((mapel) => ({
            nama_mapel: mapel.nama_mapel || "",
            guru_id: mapel.guru_id || "",
            hari: mapel.hari || "",
            jam_mulai: mapel.jam_mulai || "",
            jam_selesai: mapel.jam_selesai || "",
            ruang_id: mapel.ruang_id || "",
            ruang: mapel.ruang || "",
            jam_per_minggu: mapel.jam_per_minggu || "",
            status: mapel.status || "aktif",
            keterangan: mapel.keterangan || "",
          }))
        : [{ ...initialMapel }]
    );

    setSiswaList((kelas.kelas_siswa || []).map((item) => item.santri_id));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.jenjang || !form.kelas) {
      showModal({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Jenjang dan kelas wajib dipilih.",
      });
      return;
    }

    if (form.jenjang === "SMK" && !form.jurusan) {
      showModal({
        type: "warning",
        title: "Jurusan Belum Dipilih",
        message: "Jurusan wajib dipilih untuk jenjang SMK.",
      });
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/api/admin/kelas/${editingId}`
        : `${API_URL}/api/admin/kelas`;

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...form,
        nama_kelas: buildNamaKelas(form),
        tingkat: form.kelas,
        jurusan:
  String(form.jenjang || "").trim().toUpperCase() === "SMK"
    ? String(form.jurusan || "").trim().toUpperCase()
    : null,
        mapelList,
        siswaList,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminUser.id,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan data kelas.");
      }

      showModal({
        type: "success",
        title: editingId ? "Kelas Berhasil Diperbarui" : "Kelas Berhasil Dibuat",
        message: `${buildNamaKelas(form)} berhasil disimpan beserta jadwal dan data siswanya.`,
      });

      resetForm();
      fetchKelas();
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menyimpan Kelas",
        message: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, namaKelas) => {
    const yakin = confirm(`Yakin ingin menghapus ${namaKelas}?`);

    if (!yakin) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/kelas/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus kelas.");
      }

      showModal({
        type: "success",
        title: "Kelas Dihapus",
        message: `${namaKelas} berhasil dihapus.`,
      });

      fetchKelas();
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menghapus Kelas",
        message: error.message,
      });
    }
  };

  const handleRuangChange = (e) => {
    const { name, value } = e.target;
    setRuangForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRuang = async (e) => {
    e.preventDefault();

    if (!ruangForm.nama_ruang) {
      showModal({
        type: "warning",
        title: "Nama Ruang Kosong",
        message: "Nama ruang wajib diisi.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/ruang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminUser.id,
        },
        body: JSON.stringify(ruangForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambah ruang.");
      }

      setRuangForm(initialRuang);
      fetchOptions();

      showModal({
        type: "success",
        title: "Ruang Ditambahkan",
        message: "Master ruang berhasil ditambahkan.",
      });
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menambah Ruang",
        message: error.message,
      });
    }
  };

  const handleDeleteRuang = async (id) => {
    const yakin = confirm("Yakin ingin menghapus ruang ini?");

    if (!yakin) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/ruang/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": adminUser.id,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus ruang.");
      }

      fetchOptions();

      showModal({
        type: "success",
        title: "Ruang Dihapus",
        message: "Master ruang berhasil dihapus.",
      });
    } catch (error) {
      showModal({
        type: "error",
        title: "Gagal Menghapus Ruang",
        message: error.message,
      });
    }
  };

  const exportCSV = () => {
    const headers = [
      "Jenjang",
      "Kelas",
      "Hari",
      "Jam Mulai",
      "Jam Selesai",
      "Mata Pelajaran",
      "Guru",
      "Ruang",
      "Status",
    ];

    const rows = weeklyRows.map((row) => [
      row.jenjang,
      row.kelas,
      row.hari,
      row.jam_mulai,
      row.jam_selesai,
      row.mapel,
      row.guru,
      row.ruang,
      row.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "jadwal-kelas-guru.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const printJadwal = () => {
    const rowsHtml = weeklyRows
      .map(
        (row) => `
          <tr>
            <td>${row.jenjang}</td>
            <td>${row.kelas}</td>
            <td>${row.hari}</td>
            <td>${row.jam_mulai} - ${row.jam_selesai}</td>
            <td>${row.mapel}</td>
            <td>${row.guru}</td>
            <td>${row.ruang}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Jadwal Kelas dan Guru</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
            }
            h1 {
              margin-bottom: 4px;
            }
            p {
              margin-top: 0;
              color: #4b5563;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 10px;
              font-size: 12px;
              text-align: left;
            }
            th {
              background: #064e3b;
              color: white;
            }
          </style>
        </head>
        <body>
          <h1>Jadwal Kelas dan Guru</h1>
          <p>Pondok Pesantren Al-Furqon</p>
          <table>
            <thead>
              <tr>
                <th>Jenjang</th>
                <th>Kelas</th>
                <th>Hari</th>
                <th>Jam</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Ruang</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (checking) {
  return <AuthLoading role="Admin" />;
}

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
    ${collapsed ? "md:ml-[92px] md:w-[calc(100%-92px)]" : "md:ml-[270px] md:w-[calc(100%-270px)]"}
  `}
>
  <div className="relative min-h-screen w-full overflow-x-hidden bg-[#031A13] px-4 py-6 text-white sm:px-5 lg:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#031A13] via-[#063F2D] to-[#010A07]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.045]" />
          <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-yellow-300/15 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-none">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>


              <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                <FaMosque />
                Admin Panel
              </div>

              <h1 className="mt-5 text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.06em]">
                Kelola Kelas
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  Jadwal & Siswa
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-emerald-50/75 sm:text-base">
                Atur jenjang, kelas, wali kelas, mata pelajaran, guru pengajar,
                jadwal mingguan, master ruang, siswa per kelas, dan cetak jadwal.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl lg:w-[340px]">
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
            </div>
          </div>

          <div className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
                icon={<FaLayerGroup />}
                label="Total Kelas"
                value={kelasList.length}
                desc="Semua kelas dan jenjang"
                delay={0.05}
            />
            <StatCard
                icon={<FaSchool />}
                label="SMP"
                value={smpCount}
                desc="Kelas tingkat SMP"
                delay={0.12}
            />
            <StatCard
                icon={<FaGraduationCap />}
                label="SMK"
                value={smkCount}
                desc="Kelas tingkat SMK"
                delay={0.18}
            />
            <StatCard
                icon={<FaMosque />}
                label="Takhassus"
                value={takhassusCount}
                desc="Program khusus pesantren"
                delay={0.24}
            />
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(380px,500px)_minmax(0,1fr)]">
            <motion.section
              initial={{ opacity: 0, x: -26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="relative min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl"
            >
              <div className="relative z-10 border-b border-white/10 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-3xl text-emerald-950 shadow-xl">
                      {editingId ? <FaEdit /> : <FaPlus />}
                    </div>

                    <div>
                      <h2 className="text-2xl font-black">
                        {editingId ? "Edit Kelas" : "Tambah Kelas"}
                      </h2>
                      <p className="mt-1 text-sm text-emerald-100/60">
                        {editingId
                          ? "Perbarui kelas, jadwal, dan siswa."
                          : "Buat kelas, mapel, jadwal, dan siswa."}
                      </p>
                    </div>
                  </div>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative z-10 space-y-7 p-6"
              >
                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                      <FaLayerGroup />
                    </div>

                    <div>
                      <h3 className="font-black text-white">Data Kelas</h3>
                      <p className="text-xs text-emerald-100/55">
                        Pilih jenjang dan kelas.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectInput
                      label="Jenjang"
                      name="jenjang"
                      value={form.jenjang}
                      onChange={handleFormChange}
                      required
                      icon={<FaSchool />}
                    >
                      <option value="">Pilih jenjang</option>
                      {JENJANG_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </SelectInput>

                    <SelectInput
                      label="Kelas"
                      name="kelas"
                      value={form.kelas}
                      onChange={handleFormChange}
                      required
                      icon={<FaLayerGroup />}
                    >
                      <option value="">
                        {form.jenjang ? "Pilih kelas" : "Pilih jenjang dulu"}
                      </option>

                      {(KELAS_OPTIONS_BY_JENJANG[form.jenjang] || []).map(
                        (kelas) => (
                          <option key={kelas} value={kelas}>
                            {kelas}
                          </option>
                        )
                      )}
                    </SelectInput>
                  </div>

                  {form.jenjang === "SMK" && (
                    <div className="mt-5">
                      <SelectInput
                        label="Jurusan SMK"
                        name="jurusan"
                        value={form.jurusan}
                        onChange={handleFormChange}
                        required
                        icon={<FaGraduationCap />}
                      >
                        <option value="">Pilih jurusan</option>
                        {JURUSAN_SMK_OPTIONS.map((jurusan) => (
                          <option key={jurusan} value={jurusan}>
                            {jurusan}
                          </option>
                        ))}
                      </SelectInput>
                    </div>
                  )}

                  {form.jenjang && form.kelas && (
                    <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-100">
                      Nama kelas akan tersimpan sebagai:{" "}
                      <b className="text-yellow-300">
                        {buildNamaKelas(form)}
                      </b>
                    </div>
                  )}

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <FormInput
                      label="Tahun Ajaran"
                      name="tahun_ajaran"
                      value={form.tahun_ajaran}
                      onChange={handleFormChange}
                      icon={<FaBookOpen />}
                      placeholder="Contoh: 2026/2027"
                    />

                    <SelectInput
                      label="Semester"
                      name="semester"
                      value={form.semester}
                      onChange={handleFormChange}
                      icon={<FaBookOpen />}
                    >
                      <option value="">Pilih semester</option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </SelectInput>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <SelectInput
                      label="Wali Kelas"
                      name="wali_guru_id"
                      value={form.wali_guru_id}
                      onChange={handleFormChange}
                      icon={<FaUserTie />}
                    >
                      <option value="">Belum ditentukan</option>
                      {guruList.map((guru) => (
                        <option key={guru.id} value={guru.id}>
                          {guru.nama} {guru.mapel ? `- ${guru.mapel}` : ""}
                        </option>
                      ))}
                    </SelectInput>

                    <SelectInput
                      label="Status Kelas"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      icon={<FaShieldAlt />}
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </SelectInput>
                  </div>

                  <div className="mt-5">
                    <TextAreaInput
                      label="Deskripsi"
                      name="deskripsi"
                      value={form.deskripsi}
                      onChange={handleFormChange}
                      icon={<FaStickyNote />}
                      placeholder="Informasi tambahan tentang kelas ini"
                    />
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                        <FaBookOpen />
                      </div>

                      <div>
                        <h3 className="font-black text-white">
                          Mata Pelajaran & Jadwal
                        </h3>
                        <p className="text-xs text-emerald-100/55">
                          Sistem akan menolak jadwal guru/ruang yang bentrok.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addMapel}
                      className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-emerald-950 transition hover:bg-yellow-300"
                    >
                      <FaPlus />
                      Tambah
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mapelList.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-yellow-300">
                            Jadwal Mapel #{index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeMapel(index)}
                            disabled={mapelList.length === 1}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                          >
                            <FaTrash />
                            Hapus
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormInput
                            label="Nama Mapel"
                            name="nama_mapel"
                            value={item.nama_mapel}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaBookOpen />}
                            placeholder="Contoh: Matematika"
                          />

                          <SelectInput
                            label="Guru Pengajar"
                            name="guru_id"
                            value={item.guru_id}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaChalkboardTeacher />}
                          >
                            <option value="">Belum ditentukan</option>
                            {guruList.map((guru) => (
                              <option key={guru.id} value={guru.id}>
                                {guru.nama} {guru.mapel ? `- ${guru.mapel}` : ""}
                              </option>
                            ))}
                          </SelectInput>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <SelectInput
                            label="Hari Mengajar"
                            name="hari"
                            value={item.hari}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaClock />}
                          >
                            <option value="">Pilih hari</option>
                            {HARI_OPTIONS.map((hari) => (
                              <option key={hari} value={hari}>
                                {hari}
                              </option>
                            ))}
                          </SelectInput>

                          <SelectInput
                            label="Ruang"
                            name="ruang_id"
                            value={item.ruang_id}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaMapMarkerAlt />}
                          >
                            <option value="">Pilih ruang</option>
                            {ruangList.map((ruang) => (
                              <option key={ruang.id} value={ruang.id}>
                                {ruang.nama_ruang}
                              </option>
                            ))}
                          </SelectInput>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <FormInput
                            label="Jam Mulai"
                            name="jam_mulai"
                            type="time"
                            value={item.jam_mulai}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaClock />}
                          />

                          <FormInput
                            label="Jam Selesai"
                            name="jam_selesai"
                            type="time"
                            value={item.jam_selesai}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaClock />}
                          />
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <FormInput
                            label="Jam / Minggu"
                            name="jam_per_minggu"
                            type="number"
                            value={item.jam_per_minggu}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaBookOpen />}
                            placeholder="Contoh: 4"
                          />

                          <SelectInput
                            label="Status Jadwal"
                            name="status"
                            value={item.status}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaShieldAlt />}
                          >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                            <option value="diganti">Diganti</option>
                            <option value="libur">Libur</option>
                          </SelectInput>
                        </div>

                        <div className="mt-4">
                          <FormInput
                            label="Keterangan"
                            name="keterangan"
                            value={item.keterangan}
                            onChange={(e) => handleMapelChange(index, e)}
                            icon={<FaStickyNote />}
                            placeholder="Opsional"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                      <FaUserGraduate />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-white">
                          Data Siswa Kelas
                        </h3>
                        <p className="text-xs text-emerald-100/55">
                          Pilih santri/siswa yang masuk ke kelas ini.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={tarikSantriOtomatis}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-xs font-black text-emerald-950 transition hover:bg-yellow-300"
                      >
                        <FaSyncAlt />
                        Tarik Santri Otomatis
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-xs leading-relaxed text-yellow-100">
                    Sistem akan mencocokkan data santri berdasarkan{" "}
                    <b>jenjang</b> dan <b>kelas</b>. Contoh: Santri dengan
                    jenjang <b>SMP</b> dan kelas <b>7</b> akan otomatis masuk
                    ke kelas <b>SMP Kelas 7</b>. Jurusan hanya muncul untuk
                    jenjang <b>SMK</b>.
                  </div>

                  <div className="max-h-80 space-y-2 overflow-y-auto pr-2">
                    {visibleSantriList.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-emerald-100/50">
                        Tidak ada santri aktif yang cocok dengan pilihan jenjang dan kelas ini.
                    </p>
                    ) : (
                    visibleSantriList.map((santri) => {
                        const cocok = isSantriMatchKelas(santri);

                        return (
                        <label
                            key={santri.id}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                            cocok
                                ? "border-yellow-300/30 bg-yellow-300/10"
                                : "border-white/10 bg-slate-950/40 hover:bg-slate-950/70"
                            }`}
                        >
                            <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-white">{santri.nama}</p>

                                {cocok && (
                                <span className="rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-black text-emerald-950">
                                    Cocok
                                </span>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-emerald-100/50">
                                {santri.jenjang || "Jenjang belum diisi"} •{" "}
                                {santri.kelas || "Kelas belum diisi"} •{" "}
                                {santri.status || "aktif"}
                            </p>
                            </div>

                            <input
                            type="checkbox"
                            checked={siswaList.includes(santri.id)}
                            onChange={() => toggleSiswa(santri.id)}
                            className="h-5 w-5 accent-yellow-400"
                            />
                        </label>
                        );
                        })
                    )}
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
                    className="flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-300 disabled:translate-y-0 disabled:opacity-60"
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin" />
                    ) : editingId ? (
                      <FaEdit />
                    ) : (
                      <FaPlus />
                    )}
                    {saving
                      ? "Menyimpan..."
                      : editingId
                      ? "Update Kelas"
                      : "Buat Kelas"}
                  </button>
                </div>
              </form>
            </motion.section>

            <div className="min-w-0 space-y-6">
              <section className="rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Jadwal Mingguan</h2>
                    <p className="mt-1 text-sm text-emerald-100/60">
                      Filter, export, dan cetak jadwal guru mengajar.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={exportCSV}
                      className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-emerald-950 transition hover:bg-yellow-300"
                    >
                      <FaDownload />
                      Export CSV
                    </button>

                    <button
                      type="button"
                      onClick={printJadwal}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/20"
                    >
                      <FaPrint />
                      Cetak
                    </button>
                  </div>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-4">
                  <SelectInput
                    label="Filter Jenjang"
                    name="jenjang"
                    value={jadwalFilter.jenjang}
                    onChange={(e) =>
                      setJadwalFilter((prev) => ({
                        ...prev,
                        jenjang: e.target.value,
                      }))
                    }
                    icon={<FaSchool />}
                  >
                    <option value="">Semua jenjang</option>
                    {JENJANG_OPTIONS.map((jenjang) => (
                      <option key={jenjang} value={jenjang}>
                        {jenjang}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="Filter Kelas"
                    name="kelas_id"
                    value={jadwalFilter.kelas_id}
                    onChange={(e) =>
                      setJadwalFilter((prev) => ({
                        ...prev,
                        kelas_id: e.target.value,
                      }))
                    }
                    icon={<FaLayerGroup />}
                  >
                    <option value="">Semua kelas</option>
                    {kelasList.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {kelas.nama_kelas}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="Filter Guru"
                    name="guru_id"
                    value={jadwalFilter.guru_id}
                    onChange={(e) =>
                      setJadwalFilter((prev) => ({
                        ...prev,
                        guru_id: e.target.value,
                      }))
                    }
                    icon={<FaChalkboardTeacher />}
                  >
                    <option value="">Semua guru</option>
                    {guruList.map((guru) => (
                      <option key={guru.id} value={guru.id}>
                        {guru.nama}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="Filter Hari"
                    name="hari"
                    value={jadwalFilter.hari}
                    onChange={(e) =>
                      setJadwalFilter((prev) => ({
                        ...prev,
                        hari: e.target.value,
                      }))
                    }
                    icon={<FaClock />}
                  >
                    <option value="">Semua hari</option>
                    {HARI_OPTIONS.map((hari) => (
                      <option key={hari} value={hari}>
                        {hari}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <div className="max-w-full overflow-x-auto rounded-3xl border border-white/10">
                    <table className="min-w-[760px] w-full text-left text-sm">
                    <thead className="bg-yellow-400 text-emerald-950">
                      <tr>
                        <th className="px-4 py-3 font-black">Hari</th>
                        <th className="px-4 py-3 font-black">Jam</th>
                        <th className="px-4 py-3 font-black">Kelas</th>
                        <th className="px-4 py-3 font-black">Mapel</th>
                        <th className="px-4 py-3 font-black">Guru</th>
                        <th className="px-4 py-3 font-black">Ruang</th>
                        <th className="px-4 py-3 font-black">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {weeklyRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-8 text-center text-emerald-100/60"
                          >
                            Jadwal belum tersedia.
                          </td>
                        </tr>
                      ) : (
                        weeklyRows.map((row, index) => (
                          <tr
                            key={`${row.kelas_id}-${row.mapel}-${index}`}
                            className="border-t border-white/10 bg-slate-950/30 text-emerald-50"
                          >
                            <td className="px-4 py-3 font-black text-yellow-300">
                              {row.hari}
                            </td>
                            <td className="px-4 py-3">
                              {row.jam_mulai} - {row.jam_selesai}
                            </td>
                            <td className="px-4 py-3">
                              {row.kelas}
                              <span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-[10px]">
                                {row.jenjang}
                              </span>
                            </td>
                            <td className="px-4 py-3">{row.mapel}</td>
                            <td className="px-4 py-3">{row.guru}</td>
                            <td className="px-4 py-3">{row.ruang}</td>
                            <td className="px-4 py-3">{row.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="mb-5">
                  <h2 className="text-2xl font-black">Master Ruang</h2>
                  <p className="mt-1 text-sm text-emerald-100/60">
                    Tambah ruang agar jadwal tidak diketik manual.
                  </p>
                </div>

                <form
                  onSubmit={handleAddRuang}
                  className="mb-5 grid gap-3 md:grid-cols-4"
                >
                  <FormInput
                    label="Nama Ruang"
                    name="nama_ruang"
                    value={ruangForm.nama_ruang}
                    onChange={handleRuangChange}
                    icon={<FaMapMarkerAlt />}
                    placeholder="Contoh: Lab TKJ"
                  />

                  <FormInput
                    label="Lokasi"
                    name="lokasi"
                    value={ruangForm.lokasi}
                    onChange={handleRuangChange}
                    icon={<FaSchool />}
                    placeholder="Contoh: Gedung SMK"
                  />

                  <FormInput
                    label="Kapasitas"
                    name="kapasitas"
                    type="number"
                    value={ruangForm.kapasitas}
                    onChange={handleRuangChange}
                    icon={<FaUserGraduate />}
                    placeholder="30"
                  />

                  <button
                    type="submit"
                    className="mt-7 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-emerald-950 transition hover:bg-yellow-300"
                  >
                    Tambah Ruang
                  </button>
                </form>

                <div className="grid gap-3 md:grid-cols-2">
                  {ruangList.map((ruang) => (
                    <div
                      key={ruang.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                    >
                      <div>
                        <p className="font-black text-white">
                          {ruang.nama_ruang}
                        </p>
                        <p className="text-xs text-emerald-100/55">
                          {ruang.lokasi || "-"} • {ruang.kapasitas || 0} orang
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteRuang(ruang.id)}
                        className="rounded-xl bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500 hover:text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Daftar Kelas</h2>
                    <p className="mt-1 text-sm text-emerald-100/60">
                      Edit, hapus, dan lihat detail kelas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchInitialData}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/20 disabled:opacity-60"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>

                <div className="relative mb-5">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-12 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-emerald-100/35 focus:border-yellow-300/60 focus:ring-4 focus:ring-yellow-300/10"
                    placeholder="Cari kelas, mapel, guru, siswa, hari, atau ruang..."
                  />
                </div>

                {loading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/10"
                      />
                    ))}
                  </div>
                ) : filteredKelas.length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-black/15 p-8 text-center">
                    <FaLayerGroup className="text-5xl text-yellow-300" />
                    <h3 className="mt-5 text-2xl font-black">Kelas Belum Ada</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-100/60">
                      Tambahkan kelas baru untuk mulai mengatur jenjang, mapel,
                      guru, siswa, dan jadwal mengajar.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredKelas.map((kelas) => (
                      <div
                        key={kelas.id}
                        className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-300">
                                {kelas.jenjang}
                              </span>

                              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                                {kelas.status || "aktif"}
                              </span>
                            </div>

                            <h3 className="mt-3 text-2xl font-black text-white">
                              {kelas.nama_kelas}
                            </h3>

                            <p className="mt-2 text-sm text-emerald-100/65">
                              Kelas {kelas.tingkat || "-"}{" "}
                              {kelas.jurusan ? `• ${kelas.jurusan}` : ""}{" "}
                              {kelas.tahun_ajaran
                                ? `• ${kelas.tahun_ajaran}`
                                : ""}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(kelas)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-3 text-sm font-black text-yellow-300 transition hover:bg-yellow-400 hover:text-emerald-950"
                            >
                              <FaEdit />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(kelas.id, kelas.nama_kelas)
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white"
                            >
                              <FaTrash />
                              Hapus
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-[22px] border border-white/10 bg-black/15 p-4 text-sm text-emerald-100/70 sm:grid-cols-3">
                          <p>
                            <b>Wali:</b> {kelas.wali?.nama || "Belum ada"}
                          </p>
                          <p>
                            <b>Semester:</b> {kelas.semester || "Belum diisi"}
                          </p>
                          <p>
                            <b>Siswa:</b> {kelas.kelas_siswa?.length || 0}
                          </p>
                        </div>

                        <div className="mt-4">
                          <h4 className="mb-3 font-black text-yellow-300">
                            Mata Pelajaran & Jadwal
                          </h4>

                          {kelas.kelas_mapel?.length > 0 ? (
                            <div className="grid gap-3">
                              {kelas.kelas_mapel.map((mapel) => (
                                <div
                                  key={mapel.id}
                                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                >
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <p className="font-black text-white">
                                        {mapel.nama_mapel}
                                      </p>

                                      <p className="mt-1 text-sm text-emerald-100/60">
                                        Guru:{" "}
                                        {mapel.guru?.nama || "Belum ditentukan"}
                                      </p>

                                      <p className="mt-2 flex items-center gap-2 text-sm text-emerald-100/60">
                                        <FaClock className="text-yellow-300" />
                                        <span>
                                          {mapel.hari || "Hari belum diatur"}
                                          {mapel.jam_mulai && mapel.jam_selesai
                                            ? `, ${mapel.jam_mulai} - ${mapel.jam_selesai}`
                                            : ""}
                                        </span>
                                      </p>

                                      <p className="mt-1 flex items-center gap-2 text-sm text-emerald-100/50">
                                        <FaMapMarkerAlt className="text-yellow-300" />
                                        <span>
                                          Ruang:{" "}
                                          {mapel.ruang ||
                                            mapel.ruang_detail?.nama_ruang ||
                                            "Belum diatur"}
                                        </span>
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-300">
                                      {mapel.status || "aktif"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-emerald-100/50">
                              Belum ada mata pelajaran untuk kelas ini.
                            </p>
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="mb-3 font-black text-yellow-300">
                            Siswa Kelas
                          </h4>

                          {kelas.kelas_siswa?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {kelas.kelas_siswa.map((item) => (
                                <span
                                  key={item.id}
                                  className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50"
                                >
                                  {item.santri?.nama || "Santri"}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-emerald-100/50">
                              Belum ada siswa di kelas ini.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
      </div>
            </div>
    </main>

    <ToastModal modal={modal} onClose={closeModal} />
  </div>
);}