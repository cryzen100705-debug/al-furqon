"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaBell,
  FaBullhorn,
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaUsers,
  FaUserGraduate,
  FaLayerGroup,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaPaperPlane,
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
  FaMosque,
  FaShieldAlt,
  FaFilter,
  FaCrown,
  FaClock,
  FaClipboardList,
  FaSchool,
  FaQuran,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminPemberitahuan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [successPopup, setSuccessPopup] = useState({
  show: false,
  title: "",
  message: "",
});

const [errorPopup, setErrorPopup] = useState({
  show: false,
  title: "",
  message: "",
});

const [deleteConfirm, setDeleteConfirm] = useState({
  show: false,
  id: null,
});

  const [data, setData] = useState([]);
  const [santri, setSantri] = useState([]);

  const [adminNotif, setAdminNotif] = useState([]);
  const [adminUnread, setAdminUnread] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingNotif, setLoadingNotif] = useState(true);

  const [activeTab, setActiveTab] = useState("admin");

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [searchNotif, setSearchNotif] = useState("");

  const [filterTarget, setFilterTarget] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [filterNotifType, setFilterNotifType] = useState("");
  const [filterNotifRead, setFilterNotifRead] = useState("");

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    kategori: "Umum",
    prioritas: "normal",
    target_type: "semua",
    target_jenjang: "",
    target_kelas: "",
    target_santri_id: "",
    status: "aktif",
  });

  useEffect(() => {
    fetchPemberitahuan();
    fetchSantri();
    fetchAdminNotifications();
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
  "API tidak mengembalikan JSON. Pastikan endpoint /api/fasilitas sudah berjalan."
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
          "Server backend belum aktif atau sedang maintenance. Data pemberitahuan belum dapat dimuat."
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

  const showSuccessPopup = (title, message) => {
  setSuccessPopup({
    show: true,
    title,
    message,
  });
};

const showErrorPopup = (title, message) => {
  setErrorPopup({
    show: true,
    title,
    message,
  });
};

  const fetchPemberitahuan = async () => {
    try {
      setLoading(true);

      const result = await fetchJson(`${API_URL}/api/admin/pemberitahuan`, {
        cache: "no-store",
      });

      setData(result.data || []);
    } catch (error) {
      console.error("PEMBERITAHUAN ERROR:", error.message);
      setData([]);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data pemberitahuan belum dapat dimuat."
        );
        return;
      }

      showErrorPopup("Gagal Memuat Data", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSantri = async () => {
    try {
      const result = await fetchJson(
        `${API_URL}/api/admin/pemberitahuan/santri`,
        {
          cache: "no-store",
        }
      );

      setSantri(result.data || []);
    } catch (error) {
      console.error("SANTRI TARGET ERROR:", error.message);
      setSantri([]);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data santri target belum dapat dimuat."
        );
      }
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      setLoadingNotif(true);

      const result = await fetchJson(`${API_URL}/api/admin/notifications`, {
        cache: "no-store",
      });

      setAdminNotif(result.data || []);
      setAdminUnread(result.unreadCount || 0);
    } catch (error) {
      console.error("ADMIN NOTIF ERROR:", error.message);
      setAdminNotif([]);
      setAdminUnread(0);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Notifikasi admin belum dapat dimuat."
        );
      }
    } finally {
      setLoadingNotif(false);
    }
  };

  const markAdminNotifRead = async (id) => {
    try {
      await fetchJson(`${API_URL}/api/admin/notifications/${id}/read`, {
        method: "PUT",
      });

      fetchAdminNotifications();
    } catch (error) {
      console.error("READ NOTIF ERROR:", error.message);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Notifikasi belum dapat ditandai dibaca."
        );
        return;
      }

      showErrorPopup("Gagal Menandai Notifikasi", error.message);
    }
  };

  const markAllAdminNotifRead = async () => {
    try {
      await fetchJson(`${API_URL}/api/admin/notifications/read-all`, {
        method: "PUT",
      });

      fetchAdminNotifications();
    } catch (error) {
      console.error("READ ALL NOTIF ERROR:", error.message);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Semua notifikasi belum dapat ditandai dibaca."
        );
        return;
      }

      showErrorPopup("Gagal Menandai Semua Notifikasi", error.message);
    }
  };

  const resetForm = () => {
    setForm({
      judul: "",
      isi: "",
      kategori: "Umum",
      prioritas: "normal",
      target_type: "semua",
      target_jenjang: "",
      target_kelas: "",
      target_santri_id: "",
      status: "aktif",
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.judul.trim() || !form.isi.trim()) {
    showErrorPopup(
      "Data Belum Lengkap",
      "Judul dan isi pemberitahuan wajib diisi sebelum dikirim."
    );
    return;
  }

  const payload = {
    judul: form.judul,
    isi: form.isi,
    kategori: form.kategori,
    prioritas: form.prioritas,
    target_type: form.target_type,
    target_jenjang:
      form.target_type === "jenjang" || form.target_type === "kelas"
        ? form.target_jenjang
        : null,
    target_kelas: form.target_type === "kelas" ? form.target_kelas : null,
    target_santri_id:
      form.target_type === "santri" ? form.target_santri_id : null,
    status: form.status,
    ...getAdminPayload(),
  };

  try {
    const url = editId
      ? `${API_URL}/api/admin/pemberitahuan/${editId}`
      : `${API_URL}/api/admin/pemberitahuan`;

    const method = editId ? "PUT" : "POST";

    const result = await fetchJson(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    resetForm();
    setOpenModal(false);
    fetchPemberitahuan();

    showSuccessPopup(
      editId
        ? "Pemberitahuan Berhasil Diupdate"
        : "Pemberitahuan Berhasil Dikirim",
      result.message ||
        (editId
          ? "Pemberitahuan berhasil diperbarui dan siap dilihat santri."
          : "Pemberitahuan berhasil dikirim kepada santri sesuai target yang dipilih.")
    );
  } catch (error) {
    console.error("SAVE PEMBERITAHUAN ERROR:", error.message);

    if (isServerError(error)) {
      showMaintenancePopup(
        "Server backend belum aktif atau sedang maintenance. Pemberitahuan belum dapat disimpan."
      );
      return;
    }

    showErrorPopup("Gagal Menyimpan Pemberitahuan", error.message);
  }
};

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      judul: item.judul || "",
      isi: item.isi || "",
      kategori: item.kategori || "Umum",
      prioritas: item.prioritas || "normal",
      target_type: item.target_type || "semua",
      target_jenjang: item.target_jenjang || "",
      target_kelas: item.target_kelas || "",
      target_santri_id: item.target_santri_id || "",
      status: item.status || "aktif",
    });

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
  setDeleteConfirm({
    show: true,
    id,
  });
};

const confirmDeletePemberitahuan = async () => {
  if (!deleteConfirm.id) return;

  try {
    const result = await fetchJson(
      `${API_URL}/api/admin/pemberitahuan/${deleteConfirm.id}`,
      {
        method: "DELETE",
      }
    );

    setDeleteConfirm({
      show: false,
      id: null,
    });

    fetchPemberitahuan();

    showSuccessPopup(
      "Pemberitahuan Berhasil Dihapus",
      result.message || "Pemberitahuan berhasil dihapus dari sistem."
    );
  } catch (error) {
    console.error("DELETE PEMBERITAHUAN ERROR:", error.message);

    setDeleteConfirm({
      show: false,
      id: null,
    });

    if (isServerError(error)) {
      showMaintenancePopup(
        "Server backend belum aktif atau sedang maintenance. Pemberitahuan belum dapat dihapus."
      );
      return;
    }

    showErrorPopup("Gagal Menghapus Pemberitahuan", error.message);
  }
};

  const getTargetLabel = (item) => {
    if (item.target_type === "semua") return "Semua Santri";

    if (item.target_type === "jenjang") {
      return `Jenjang ${item.target_jenjang}`;
    }

    if (item.target_type === "kelas") {
      return `${item.target_jenjang} - Kelas ${item.target_kelas}`;
    }

    if (item.target_type === "santri") {
      return item.santri?.nama || "Santri Tertentu";
    }

    return "-";
  };

  const getPriorityClass = (prioritas) => {
    if (prioritas === "penting") {
      return "bg-red-100 text-red-700";
    }

    if (prioritas === "sedang") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-emerald-100 text-emerald-700";
  };

  const getNotifIcon = (tipe) => {
    if (tipe === "pembayaran") return <FaMoneyBillWave />;
    if (tipe === "pendaftaran") return <FaUserGraduate />;
    return <FaBell />;
  };

  const getNotifColor = (tipe) => {
    if (tipe === "pembayaran") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (tipe === "pendaftaran") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
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

  const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.judul?.toLowerCase().includes(keyword) ||
      item.isi?.toLowerCase().includes(keyword) ||
      item.kategori?.toLowerCase().includes(keyword);

    const matchTarget = filterTarget ? item.target_type === filterTarget : true;

    const matchPrioritas = filterPrioritas
      ? item.prioritas === filterPrioritas
      : true;

    return matchSearch && matchTarget && matchPrioritas;
  });

  const filteredAdminNotif = adminNotif.filter((item) => {
    const keyword = searchNotif.toLowerCase();

    const matchSearch =
      item.judul?.toLowerCase().includes(keyword) ||
      item.isi?.toLowerCase().includes(keyword) ||
      item.tipe?.toLowerCase().includes(keyword) ||
      item.data?.nama?.toLowerCase?.().includes(keyword);

    const matchType = filterNotifType ? item.tipe === filterNotifType : true;

    const matchRead =
      filterNotifRead === "belum"
        ? !item.is_read
        : filterNotifRead === "sudah"
        ? item.is_read
        : true;

    return matchSearch && matchType && matchRead;
  });

  const stats = useMemo(() => {
    const totalSemua = data.filter((item) => item.target_type === "semua").length;
    const totalKelas = data.filter((item) => item.target_type === "kelas").length;
    const totalPenting = data.filter(
      (item) => item.prioritas === "penting"
    ).length;

    const totalPendaftaran = adminNotif.filter(
      (item) => item.tipe === "pendaftaran"
    ).length;

    const totalPembayaran = adminNotif.filter(
      (item) => item.tipe === "pembayaran"
    ).length;

    return {
      totalSemua,
      totalKelas,
      totalPenting,
      totalPendaftaran,
      totalPembayaran,
      totalPemberitahuan: data.length,
      totalNotif: adminNotif.length,
      unread: adminUnread,
    };
  }, [data, adminNotif, adminUnread]);

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
                    <FaMosque className="text-yellow-300" />

                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                      Admin Notification Command Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Pusat
                    <span className="block text-yellow-300">Informasi.</span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                    Kelola notifikasi admin otomatis dari sistem dan kirim
                    pemberitahuan manual kepada santri berdasarkan target yang
                    dipilih.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => setActiveTab("admin")}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
                    >
                      <FaBell />
                      Notifikasi Admin
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("santri");
                        resetForm();
                        setOpenModal(true);
                      }}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-6 font-black text-yellow-200 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-yellow-300/20"
                    >
                      <FaPaperPlane />
                      Buat Pemberitahuan
                    </button>

                    <button
                      onClick={() => {
                        fetchPemberitahuan();
                        fetchSantri();
                        fetchAdminNotifications();
                      }}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20"
                    >
                      <FaSyncAlt
                        className={
                          loading || loadingNotif ? "animate-spin" : ""
                        }
                      />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <HeroCard
                  title="Belum Dibaca"
                  value={adminUnread}
                  icon={<FaEyeSlash />}
                />

                <HeroCard
                  title="Total Notifikasi"
                  value={adminNotif.length}
                  icon={<FaBell />}
                />

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-yellow-100/80">
                        Mode Aktif
                      </p>

                      <h3 className="mt-1 text-3xl font-black text-yellow-300">
                        {activeTab === "admin" ? "Admin" : "Santri"}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-emerald-50/70">
                        {activeTab === "admin"
                          ? "Memantau notifikasi sistem."
                          : "Mengirim pengumuman santri."}
                      </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-green-950">
                      {activeTab === "admin" ? <FaShieldAlt /> : <FaBullhorn />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="relative bg-gradient-to-b from-[#EFE8D8] via-[#F7F1E6] to-[#E7DCC5] ">
          <div className="mx-auto -mt-20 max-w-[1600px] px-4 pb-10 sm:px-6 md:px-10">
            {/* STATS */}
            <section className="relative z-20 ">
              <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {activeTab === "admin" ? (
                  <>
                    <StatCard
                      title="Notif Belum Dibaca"
                      value={stats.unread}
                      icon={<FaEyeSlash />}
                      color="bg-red-500 text-white"
                    />

                    <StatCard
                      title="Santri Baru"
                      value={stats.totalPendaftaran}
                      icon={<FaUserGraduate />}
                      color="bg-blue-600 text-white"
                    />

                    <StatCard
                      title="Pembayaran Masuk"
                      value={stats.totalPembayaran}
                      icon={<FaMoneyBillWave />}
                      color="bg-emerald-600 text-white"
                    />

                    <StatCard
                      title="Total Notifikasi"
                      value={stats.totalNotif}
                      icon={<FaBell />}
                      color="bg-yellow-400 text-green-950"
                    />
                  </>
                ) : (
                  <>
                    <StatCard
                      title="Semua Pemberitahuan"
                      value={stats.totalPemberitahuan}
                      icon={<FaBullhorn />}
                      color="bg-emerald-600 text-white"
                    />

                    <StatCard
                      title="Untuk Semua Santri"
                      value={stats.totalSemua}
                      icon={<FaUsers />}
                      color="bg-blue-600 text-white"
                    />

                    <StatCard
                      title="Target Kelas"
                      value={stats.totalKelas}
                      icon={<FaLayerGroup />}
                      color="bg-yellow-400 text-green-950"
                    />

                    <StatCard
                      title="Prioritas Penting"
                      value={stats.totalPenting}
                      icon={<FaExclamationCircle />}
                      color="bg-red-500 text-white"
                    />
                  </>
                )}
              </div>
            </section>

            {/* TAB */}
            <section className="relative z-20 mt-6">
              <div className="grid grid-cols-1 gap-3 rounded-[30px] border border-[#D8C287] bg-white/80 p-3 shadow-xl shadow-yellow-950/5 backdrop-blur-xl sm:grid-cols-2">
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`
                    h-13 rounded-2xl font-black transition
                    ${
                      activeTab === "admin"
                        ? "bg-[#064E3B] text-white shadow-lg"
                        : "bg-white/70 text-slate-600 hover:bg-yellow-50"
                    }
                  `}
                >
                  Notifikasi Admin
                  {adminUnread > 0 && (
                    <span className="ml-2 inline-flex min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                      {adminUnread > 99 ? "99+" : adminUnread}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("santri")}
                  className={`
                    h-13 rounded-2xl font-black transition
                    ${
                      activeTab === "santri"
                        ? "bg-[#064E3B] text-white shadow-lg"
                        : "bg-white/70 text-slate-600 hover:bg-yellow-50"
                    }
                  `}
                >
                  Pemberitahuan Santri
                </button>
              </div>
            </section>

            {activeTab === "admin" && (
              <AdminNotificationPanel
                loadingNotif={loadingNotif}
                filteredAdminNotif={filteredAdminNotif}
                searchNotif={searchNotif}
                setSearchNotif={setSearchNotif}
                filterNotifType={filterNotifType}
                setFilterNotifType={setFilterNotifType}
                filterNotifRead={filterNotifRead}
                setFilterNotifRead={setFilterNotifRead}
                fetchAdminNotifications={fetchAdminNotifications}
                markAllAdminNotifRead={markAllAdminNotifRead}
                markAdminNotifRead={markAdminNotifRead}
                getNotifIcon={getNotifIcon}
                getNotifColor={getNotifColor}
                formatTanggal={formatTanggal}
                formatRupiah={formatRupiah}
              />
            )}

            {activeTab === "santri" && (
              <SantriNotificationPanel
                loading={loading}
                filteredData={filteredData}
                search={search}
                setSearch={setSearch}
                filterTarget={filterTarget}
                setFilterTarget={setFilterTarget}
                filterPrioritas={filterPrioritas}
                setFilterPrioritas={setFilterPrioritas}
                resetForm={resetForm}
                setOpenModal={setOpenModal}
                getPriorityClass={getPriorityClass}
                getTargetLabel={getTargetLabel}
                formatTanggal={formatTanggal}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {openModal && (
          <FormModal
            editId={editId}
            form={form}
            setForm={setForm}
            santri={santri}
            resetForm={resetForm}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit}
          />
        )}

        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");

              fetchPemberitahuan();
              fetchSantri();
              fetchAdminNotifications();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}

        {successPopup.show && (
  <SuccessNotificationPopup
    title={successPopup.title}
    message={successPopup.message}
    onClose={() =>
      setSuccessPopup({
        show: false,
        title: "",
        message: "",
      })
    }
  />
)}

{errorPopup.show && (
  <ErrorNotificationPopup
    title={errorPopup.title}
    message={errorPopup.message}
    onClose={() =>
      setErrorPopup({
        show: false,
        title: "",
        message: "",
      })
    }
  />
)}

{deleteConfirm.show && (
  <ConfirmDeletePopup
    onCancel={() =>
      setDeleteConfirm({
        show: false,
        id: null,
      })
    }
    onConfirm={confirmDeletePemberitahuan}
  />
)}
      </main>

      <style jsx global>{`
        .input {
          width: 100%;
          min-height: 48px;
          border: 1px solid #d8c287;
          background: rgba(255, 255, 255, 0.86);
          border-radius: 16px;
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          transition: 0.2s;
        }

        .input:focus {
          background: white;
          border-color: #eab308;
          box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.16);
        }
      `}</style>
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
    <div className="group relative overflow-hidden rounded-[28px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-xl shadow-yellow-950/5 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black text-[#1F1607]">{value}</h2>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-md ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function AdminNotificationPanel({
  loadingNotif,
  filteredAdminNotif,
  searchNotif,
  setSearchNotif,
  filterNotifType,
  setFilterNotifType,
  filterNotifRead,
  setFilterNotifRead,
  fetchAdminNotifications,
  markAllAdminNotifRead,
  markAdminNotifRead,
  getNotifIcon,
  getNotifColor,
  formatTanggal,
  formatRupiah,
}) {
  return (
    <section className="relative z-20 mt-6 overflow-hidden rounded-[38px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 backdrop-blur-xl">
      <PanelGlow />

      <div className="relative z-10">
        <PanelHeader
          badgeIcon={<FaShieldAlt />}
          badge="Admin System Notification"
          title="Notifikasi Admin"
          desc="Informasi otomatis dari sistem. Santri baru dan pembayaran masuk akan tampil di sini."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={fetchAdminNotifications}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/80 px-4 font-black text-slate-700 shadow-sm transition hover:bg-yellow-50"
              >
                <FaSyncAlt className={loadingNotif ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={markAllAdminNotifRead}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-4 font-black text-white shadow-md transition hover:bg-[#086B4F]"
              >
                <FaCheckCircle />
                Tandai Semua Dibaca
              </button>
            </div>
          }
        />

        <div className="border-b border-[#E7D7A7] px-4 pb-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SearchInput
              value={searchNotif}
              onChange={setSearchNotif}
              placeholder="Cari notifikasi admin..."
            />

            <FilterSelect value={filterNotifType} onChange={setFilterNotifType}>
              <option value="">Semua Tipe</option>
              <option value="pendaftaran">Pendaftaran</option>
              <option value="pembayaran">Pembayaran</option>
            </FilterSelect>

            <FilterSelect value={filterNotifRead} onChange={setFilterNotifRead}>
              <option value="">Semua Status</option>
              <option value="belum">Belum Dibaca</option>
              <option value="sudah">Sudah Dibaca</option>
            </FilterSelect>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {loadingNotif ? (
            <LoadingBox text="Memuat notifikasi admin..." />
          ) : filteredAdminNotif.length === 0 ? (
            <EmptyBox
              title="Belum Ada Notifikasi Admin"
              desc="Santri baru mendaftar dan pembayaran masuk akan muncul di sini."
            />
          ) : (
            filteredAdminNotif.map((item) => (
              <AdminNotifCard
                key={item.id}
                item={item}
                getNotifIcon={getNotifIcon}
                getNotifColor={getNotifColor}
                formatTanggal={formatTanggal}
                formatRupiah={formatRupiah}
                onClick={() => markAdminNotifRead(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SantriNotificationPanel({
  loading,
  filteredData,
  search,
  setSearch,
  filterTarget,
  setFilterTarget,
  filterPrioritas,
  setFilterPrioritas,
  resetForm,
  setOpenModal,
  getPriorityClass,
  getTargetLabel,
  formatTanggal,
  handleEdit,
  handleDelete,
}) {
  return (
    <section className="relative z-20 mt-6 overflow-hidden rounded-[38px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 backdrop-blur-xl">
      <PanelGlow />

      <div className="relative z-10">
        <PanelHeader
          badgeIcon={<FaBullhorn />}
          badge="Santri Broadcast Center"
          title="Pemberitahuan Santri"
          desc="Buat dan kelola pengumuman manual yang akan dilihat oleh santri sesuai target."
          action={
            <button
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
            >
              <FaPlus />
              Buat Pemberitahuan
            </button>
          }
        />

        <div className="border-b border-[#E7D7A7] px-4 pb-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari judul / isi / kategori..."
            />

            <FilterSelect value={filterTarget} onChange={setFilterTarget}>
              <option value="">Semua Target</option>
              <option value="semua">Semua Santri</option>
              <option value="jenjang">Jenjang</option>
              <option value="kelas">Kelas</option>
              <option value="santri">Santri Tertentu</option>
            </FilterSelect>

            <FilterSelect value={filterPrioritas} onChange={setFilterPrioritas}>
              <option value="">Semua Prioritas</option>
              <option value="normal">Normal</option>
              <option value="sedang">Sedang</option>
              <option value="penting">Penting</option>
            </FilterSelect>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <LoadingBox text="Memuat pemberitahuan..." />
          ) : filteredData.length === 0 ? (
            <EmptyBox
              title="Pemberitahuan Tidak Ditemukan"
              desc="Belum ada pemberitahuan yang sesuai dengan filter."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {filteredData.map((item) => (
                  <SantriNotifCard
                    key={item.id}
                    item={item}
                    getPriorityClass={getPriorityClass}
                    getTargetLabel={getTargetLabel}
                    formatTanggal={formatTanggal}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-[28px] border border-[#E7D7A7] bg-white/70 lg:block">
                <table className="w-full">
                  <thead className="bg-[#064E3B] text-white">
                    <tr>
                      <TableHead>Pemberitahuan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Prioritas</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Action</TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-[#E7D7A7] bg-white/60 transition hover:bg-yellow-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                              <FaBullhorn />
                            </div>

                            <div className="max-w-[520px]">
                              <h3 className="text-[15px] font-black text-[#1F1607]">
                                {item.judul}
                              </h3>

                              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                {item.isi}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge>{item.kategori}</Badge>
                        </td>

                        <td className="px-6 py-4">
                          <Badge>{getTargetLabel(item)}</Badge>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-black ${getPriorityClass(
                              item.prioritas
                            )}`}
                          >
                            {item.prioritas}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                          {formatTanggal(item.created_at)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 transition hover:bg-yellow-200"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-200"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function PanelGlow() {
  return (
    <>
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
    </>
  );
}

function PanelHeader({ badgeIcon, badge, title, desc, action }) {
  return (
    <div className="border-b border-[#E7D7A7] p-4 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
            {badgeIcon}
            {badge}
          </div>

          <h2 className="mt-3 text-2xl font-black text-[#1F1607]">{title}</h2>

          <p className="mt-1 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600">
            {desc}
          </p>
        </div>

        {action}
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
      />
    </div>
  );
}

function FilterSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
    >
      {children}
    </select>
  );
}

function AdminNotifCard({
  item,
  getNotifIcon,
  getNotifColor,
  formatTanggal,
  formatRupiah,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full overflow-hidden rounded-[32px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl
        ${
          item.is_read
            ? "border-[#E7D7A7] bg-white/75"
            : "border-yellow-300 bg-yellow-50/90"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl
            ${getNotifColor(item.tipe)}
          `}
        >
          {getNotifIcon(item.tipe)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-700">
              {item.tipe}
            </span>

            {!item.is_read ? (
              <span className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-black text-white">
                Baru
              </span>
            ) : (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black text-blue-700">
                Sudah Dibaca
              </span>
            )}

            <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-black text-purple-700">
              {formatTanggal(item.created_at)}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-black text-[#1F1607]">
            {item.judul}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {item.isi}
          </p>

          {item.data && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {item.data.nama && (
                <InfoMiniBox label="Nama" value={item.data.nama} />
              )}

              {item.data.jenjang && (
                <InfoMiniBox
                  label="Jenjang"
                  value={`${item.data.jenjang} ${item.data.kelas || ""}`}
                />
              )}

              {item.data.nominal && (
                <InfoMiniBox
                  label="Nominal"
                  value={formatRupiah(item.data.nominal)}
                  green
                />
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex">
          {item.is_read ? (
            <FaEye className="text-blue-500" />
          ) : (
            <FaEyeSlash className="text-red-500" />
          )}
        </div>
      </div>
    </button>
  );
}

function SantriNotifCard({
  item,
  getPriorityClass,
  getTargetLabel,
  formatTanggal,
  onEdit,
  onDelete,
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#E7D7A7] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-lg shadow-yellow-950/5">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-[11px] font-black ${getPriorityClass(
                item.prioritas
              )}`}
            >
              {item.prioritas}
            </span>

            <h3 className="mt-3 text-lg font-black text-[#1F1607]">
              {item.judul}
            </h3>

            <p className="mt-2 leading-relaxed text-slate-600">{item.isi}</p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
            <FaBullhorn />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{item.kategori}</Badge>
          <Badge>{getTargetLabel(item)}</Badge>
          <Badge>{formatTanggal(item.created_at)}</Badge>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onEdit}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-100 font-black text-yellow-700"
          >
            <FaEdit />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 font-black text-red-700"
          >
            <FaTrash />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoMiniBox({ label, value, green = false }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p
        className={`mt-1 font-black ${
          green ? "text-emerald-700" : "text-[#1F1607]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-black text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-white">
      {children}
    </th>
  );
}

function LoadingBox({ text = "Memuat data..." }) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#064E3B] border-t-transparent" />
      <p className="mt-4 font-semibold text-slate-500">{text}</p>
    </div>
  );
}

function EmptyBox({
  title = "Data Tidak Ditemukan",
  desc = "Belum ada data yang sesuai.",
}) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-white/70 text-4xl text-slate-400">
        <FaBell />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-700">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {desc}
      </p>
    </div>
  );
}

function FormModal({
  editId,
  form,
  setForm,
  santri,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[34px] bg-[#FFFDF6] shadow-2xl sm:max-h-[92vh] sm:rounded-[34px]">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#4A3410] p-5 text-white sm:p-6">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl font-black">
              {editId ? "Edit Pemberitahuan" : "Buat Pemberitahuan"}
            </h2>

            <p className="mt-1 text-sm text-white/80">
              Isi pemberitahuan dan pilih target penerima.
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6"
        >
          <FormSection title="Isi Pemberitahuan" icon={<FaBullhorn />}>
            <input
              className="input"
              placeholder="Judul pemberitahuan"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              required
            />

            <textarea
              className="input min-h-[140px]"
              placeholder="Isi pemberitahuan"
              value={form.isi}
              onChange={(e) => setForm({ ...form, isi: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                className="input"
                placeholder="Kategori, contoh: Akademik"
                value={form.kategori}
                onChange={(e) =>
                  setForm({ ...form, kategori: e.target.value })
                }
              />

              <select
                className="input"
                value={form.prioritas}
                onChange={(e) =>
                  setForm({ ...form, prioritas: e.target.value })
                }
              >
                <option value="normal">Normal</option>
                <option value="sedang">Sedang</option>
                <option value="penting">Penting</option>
              </select>

              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="aktif">Aktif</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </FormSection>

          <FormSection title="Target Penerima" icon={<FaUsers />}>
            <select
              className="input"
              value={form.target_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  target_type: e.target.value,
                  target_jenjang: "",
                  target_kelas: "",
                  target_santri_id: "",
                })
              }
            >
              <option value="semua">Semua Santri</option>
              <option value="jenjang">Berdasarkan Jenjang</option>
              <option value="kelas">Berdasarkan Kelas</option>
              <option value="santri">Santri Tertentu</option>
            </select>

            {(form.target_type === "jenjang" ||
              form.target_type === "kelas") && (
              <select
                className="input"
                value={form.target_jenjang}
                onChange={(e) =>
                  setForm({
                    ...form,
                    target_jenjang: e.target.value,
                    target_kelas: "",
                  })
                }
              >
                <option value="">Pilih Jenjang</option>
                <option value="SMP">SMP</option>
                <option value="SMK">SMK</option>
                <option value="Takhassus">Takhassus</option>
              </select>
            )}

            {form.target_type === "kelas" && (
              <select
                className="input"
                value={form.target_kelas}
                onChange={(e) =>
                  setForm({ ...form, target_kelas: e.target.value })
                }
              >
                <option value="">Pilih Kelas</option>

                {form.target_jenjang === "SMP" &&
                  ["7", "8", "9"].map((kelas) => (
                    <option key={kelas} value={kelas}>
                      Kelas {kelas}
                    </option>
                  ))}

                {form.target_jenjang === "SMK" &&
                  ["10", "11", "12"].map((kelas) => (
                    <option key={kelas} value={kelas}>
                      Kelas {kelas}
                    </option>
                  ))}

                {form.target_jenjang === "Takhassus" &&
                  ["1", "2", "3", "4"].map((kelas) => (
                    <option key={kelas} value={kelas}>
                      Marhalah {kelas}
                    </option>
                  ))}
              </select>
            )}

            {form.target_type === "santri" && (
              <select
                className="input"
                value={form.target_santri_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    target_santri_id: e.target.value,
                  })
                }
              >
                <option value="">Pilih Santri</option>

                {santri.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} - {item.jenjang} {item.kelas}
                  </option>
                ))}
              </select>
            )}
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
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:bg-[#086B4F]"
            >
              <FaPaperPlane />
              {editId ? "Update" : "Kirim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({ title, icon, children }) {
  return (
    <div className="space-y-3 rounded-3xl border border-[#E7D7A7] bg-white/80 p-4 shadow-sm">
      <h3 className="flex items-center gap-2 font-black text-[#1F1607]">
        <span className="text-[#064E3B]">{icon}</span>
        {title}
      </h3>

      {children}
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
                "Backend belum aktif. Data pemberitahuan belum dapat dimuat untuk sementara waktu."}
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

function SuccessNotificationPopup({
  title = "Pemberitahuan Berhasil Dikirim",
  message = "Pemberitahuan sudah berhasil dikirim kepada santri.",
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="success-popup relative w-full max-w-md overflow-hidden rounded-[34px] border border-emerald-100 bg-white p-7 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <FaTimes />
        </button>

        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-yellow-100 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto flex h-60 w-full items-center justify-center overflow-hidden">
            <div className="plane-stage">
              <div className="circle-bg" />

              <span className="spark spark-1">✦</span>
              <span className="spark spark-2">✦</span>
              <span className="spark spark-3">✦</span>
              <span className="spark spark-4">✦</span>

              <div className="trail trail-1" />
              <div className="trail trail-2" />
              <div className="trail trail-3" />
              <div className="trail-dot dot-a" />
              <div className="trail-dot dot-b" />

              <div className="paper-plane">
                <div className="plane-body" />
                <div className="plane-wing wing-left" />
                <div className="plane-wing wing-right" />

                <div className="plane-face">
                  <span className="eye-left" />
                  <span className="eye-right" />
                  <span className="mouth" />
                  <span className="blush-left" />
                  <span className="blush-right" />
                </div>
              </div>

              <div className="success-check">
                <FaCheckCircle />
              </div>

              <div className="notif-bell">
                <FaBell />
                <span className="bell-wave wave-1" />
                <span className="bell-wave wave-2" />
              </div>
            </div>
          </div>

          <h2 className="mt-2 text-2xl font-black leading-tight text-[#102A1F] sm:text-3xl">
            {title}
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#086B4F]"
          >
            Selesai
          </button>
        </div>
      </div>

      <style jsx>{`
        .success-popup {
          animation: popupIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .plane-stage {
          position: relative;
          width: 320px;
          height: 230px;
        }

        .circle-bg {
          position: absolute;
          left: 58px;
          top: 15px;
          width: 190px;
          height: 190px;
          border-radius: 999px;
          background: radial-gradient(circle, #ecfdf5 0%, #d1fae5 55%, transparent 75%);
          animation: softPulse 2.6s ease-in-out infinite;
        }

        .paper-plane {
          position: absolute;
          left: 42px;
          top: 72px;
          width: 190px;
          height: 115px;
          transform-origin: center;
          animation: flyPlane 2.2s ease-in-out infinite;
          filter: drop-shadow(0 18px 22px rgba(15, 23, 42, 0.16));
        }

        .plane-body {
          position: absolute;
          left: 18px;
          top: 12px;
          width: 155px;
          height: 92px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #dbeafe 100%);
          clip-path: polygon(0 45%, 100% 0, 72% 100%);
          border-radius: 12px;
        }

        .plane-wing {
          position: absolute;
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
          border-radius: 10px;
        }

        .wing-left {
          left: 18px;
          top: 12px;
          width: 155px;
          height: 92px;
          clip-path: polygon(0 45%, 78% 48%, 100% 0);
        }

        .wing-right {
          left: 70px;
          top: 55px;
          width: 105px;
          height: 54px;
          background: linear-gradient(135deg, #cbd5e1 0%, #93a4c1 100%);
          clip-path: polygon(0 0, 100% 0, 38% 100%);
          opacity: 0.85;
        }

        .plane-face {
          position: absolute;
          left: 82px;
          top: 38px;
          width: 58px;
          height: 42px;
        }

        .eye-left,
        .eye-right {
          position: absolute;
          top: 10px;
          width: 14px;
          height: 10px;
          border-top: 4px solid #1f2937;
          border-radius: 999px 999px 0 0;
        }

        .eye-left {
          left: 4px;
        }

        .eye-right {
          right: 4px;
        }

        .mouth {
          position: absolute;
          left: 22px;
          top: 20px;
          width: 16px;
          height: 17px;
          border-radius: 0 0 999px 999px;
          background: #111827;
        }

        .mouth::after {
          content: "";
          position: absolute;
          left: 4px;
          bottom: 2px;
          width: 8px;
          height: 5px;
          border-radius: 999px;
          background: #fb7185;
        }

        .blush-left,
        .blush-right {
          position: absolute;
          top: 24px;
          width: 13px;
          height: 8px;
          border-radius: 999px;
          background: #fca5a5;
        }

        .blush-left {
          left: -5px;
        }

        .blush-right {
          right: -5px;
        }

        .trail {
          position: absolute;
          left: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          opacity: 0.75;
          animation: trailMove 1.2s linear infinite;
        }

        .trail-1 {
          top: 115px;
          width: 130px;
          height: 10px;
          transform: rotate(-18deg);
        }

        .trail-2 {
          top: 138px;
          width: 105px;
          height: 8px;
          transform: rotate(-18deg);
          animation-delay: 0.12s;
          opacity: 0.55;
        }

        .trail-3 {
          top: 160px;
          width: 78px;
          height: 6px;
          transform: rotate(-18deg);
          animation-delay: 0.24s;
          opacity: 0.4;
        }

        .trail-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #16a34a;
          animation: dotMove 1.2s linear infinite;
        }

        .dot-a {
          left: 48px;
          top: 92px;
        }

        .dot-b {
          left: 24px;
          top: 150px;
          animation-delay: 0.35s;
        }

        .success-check {
          position: absolute;
          right: 58px;
          top: 38px;
          display: flex;
          width: 62px;
          height: 62px;
          align-items: center;
          justify-content: center;
          border: 6px solid white;
          border-radius: 999px;
          background: #22c55e;
          color: white;
          font-size: 31px;
          box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);
          animation: checkPop 1.35s ease-in-out infinite;
        }

        .notif-bell {
          position: absolute;
          right: 28px;
          top: 116px;
          z-index: 8;
          display: flex;
          height: 56px;
          width: 56px;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #facc15;
          color: #064e3b;
          font-size: 25px;
          box-shadow: 0 14px 35px rgba(250, 204, 21, 0.35);
          animation: bellShake 0.85s ease-in-out infinite;
        }

        .bell-wave {
          position: absolute;
          border: 3px solid #059669;
          border-bottom: 0;
          border-left: 0;
          border-radius: 999px;
          opacity: 0.8;
        }

        .wave-1 {
          right: -13px;
          top: 13px;
          width: 18px;
          height: 18px;
          animation: wavePulse 1s ease-in-out infinite;
        }

        .wave-2 {
          right: -23px;
          top: 8px;
          width: 28px;
          height: 28px;
          animation: wavePulse 1s ease-in-out infinite 0.18s;
        }

        .spark {
          position: absolute;
          z-index: 9;
          color: #f59e0b;
          font-size: 23px;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .spark-1 {
          left: 44px;
          top: 50px;
        }

        .spark-2 {
          right: 36px;
          top: 72px;
          animation-delay: 0.25s;
        }

        .spark-3 {
          left: 75px;
          bottom: 35px;
          animation-delay: 0.5s;
        }

        .spark-4 {
          right: 78px;
          bottom: 26px;
          color: #16a34a;
          animation-delay: 0.75s;
        }

        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes flyPlane {
          0% {
            transform: translate(-34px, 20px) rotate(-8deg) scale(0.88);
            opacity: 0.85;
          }

          35% {
            transform: translate(10px, -8px) rotate(4deg) scale(1.04);
            opacity: 1;
          }

          65% {
            transform: translate(22px, -14px) rotate(2deg) scale(1);
          }

          100% {
            transform: translate(-34px, 20px) rotate(-8deg) scale(0.88);
            opacity: 0.85;
          }
        }

        @keyframes trailMove {
          0% {
            transform: translateX(25px) rotate(-18deg);
            opacity: 0;
          }

          40% {
            opacity: 0.75;
          }

          100% {
            transform: translateX(-22px) rotate(-18deg);
            opacity: 0;
          }
        }

        @keyframes dotMove {
          0% {
            transform: translateX(35px);
            opacity: 0;
          }

          50% {
            opacity: 1;
          }

          100% {
            transform: translateX(-20px);
            opacity: 0;
          }
        }

        @keyframes checkPop {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.14);
          }
        }

        @keyframes bellShake {
          0%,
          100% {
            transform: rotate(0deg);
          }

          25% {
            transform: rotate(8deg);
          }

          75% {
            transform: rotate(-8deg);
          }
        }

        @keyframes wavePulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.65;
          }

          50% {
            transform: scale(1.4) rotate(18deg);
            opacity: 1;
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.85;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function ErrorNotificationPopup({
  title = "Terjadi Kesalahan",
  message = "Proses tidak dapat dilakukan.",
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-red-100 bg-white p-7 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <FaTimes />
        </button>

        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-yellow-100 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-red-500 text-5xl text-white shadow-xl">
            <FaExclamationCircle />
          </div>

          <h2 className="mt-6 text-2xl font-black text-[#1F1607]">
            {title}
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-500 px-6 font-black text-white shadow-lg transition hover:bg-red-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeletePopup({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-red-100 bg-white p-7 text-center shadow-2xl">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-yellow-100 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-red-100 text-5xl text-red-600 shadow-sm">
            <FaTrash />
          </div>

          <h2 className="mt-6 text-2xl font-black text-[#1F1607]">
            Hapus Pemberitahuan?
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            Data pemberitahuan ini akan dihapus dari sistem. Tindakan ini tidak
            menggunakan alert browser lagi.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-12 rounded-2xl bg-slate-100 px-6 font-black text-slate-700 transition hover:bg-slate-200"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="h-12 rounded-2xl bg-red-500 px-6 font-black text-white shadow-lg transition hover:bg-red-600"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}