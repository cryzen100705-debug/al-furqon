"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFileInvoiceDollar,
  FaUserGraduate,
  FaUsers,
  FaSchool,
  FaReceipt,
  FaCalendarAlt,
  FaEye,
  FaTimes,
  FaSyncAlt,
  FaPaperPlane,
  FaWallet,
  FaFilter,
  FaImage,
  FaInfoCircle,
  FaCheck,
  FaBan,
  FaTrash,
  FaMosque,
  FaShieldAlt,
  FaChartLine,
  FaLayerGroup,
  FaCrown,
  FaArrowRight,
  FaBell,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const initialForm = {
  target_type: "santri",
  santri_id: "",
  kelas: "",
  jenjang: "",
  jenis: "",
  nominal: "",
  deadline: "",
};

export default function AdminPembayaran() {
  const [data, setData] = useState([]);
  const [santri, setSantri] = useState([]);

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [tab, setTab] = useState("tagihan");
  const [search, setSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    getData();
    getSantri();
  }, []);

  const isServerError = (error) => {
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
  throw new Error(
    result.error
      ? `${result.message}\n\nDetail: ${result.error}`
      : result.message || "Terjadi kesalahan pada backend."
  );
}

      setServerMaintenance(false);
      setServerMessage("");

      return result;
    } catch (error) {
      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Jalankan backend Express terlebih dahulu."
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

      const result = await fetchJson(`${API_URL}/api/admin/pembayaran`, {
        cache: "no-store",
      });

      setData(result.data || []);
    } catch (error) {
      console.error(error);
      setData([]);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data pembayaran belum dapat dimuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingPage(false);
    }
  };

  const getSantri = async () => {
    try {
      const result = await fetchJson(`${API_URL}/api/admin/pembayaran/santri`, {
        cache: "no-store",
      });

      setSantri(result.data || []);
    } catch (error) {
      console.error(error);
      setSantri([]);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Data santri untuk tagihan belum dapat dimuat."
        );
      }
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
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

  const formatTanggalInput = (date) => {
    if (!date) return "";

    const tanggal = new Date(date);

    if (isNaN(tanggal.getTime())) return "";

    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${tanggal.getDate()} ${bulan[tanggal.getMonth()]} ${tanggal.getFullYear()}`;
  };

  const isSamePeriod = (date, period) => {
    if (!period) return true;
    if (!date) return false;

    const targetDate = new Date(date);
    const now = new Date();

    if (isNaN(targetDate.getTime())) return false;

    const targetStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === "hari") {
      return targetStart.getTime() === todayStart.getTime();
    }

    if (period === "minggu") {
      const day = todayStart.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      const startOfWeek = new Date(todayStart);
      startOfWeek.setDate(todayStart.getDate() + diffToMonday);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return targetDate >= startOfWeek && targetDate <= endOfWeek;
    }

    if (period === "bulan") {
      return (
        targetDate.getMonth() === now.getMonth() &&
        targetDate.getFullYear() === now.getFullYear()
      );
    }

    if (period === "tahun") {
      return targetDate.getFullYear() === now.getFullYear();
    }

    return true;
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const createTagihan = async () => {
    try {
      if (!form.jenis || !form.nominal || !form.deadline) {
        alert("Jenis pembayaran, nominal, dan deadline wajib diisi.");
        return;
      }

      if (form.target_type === "santri" && !form.santri_id) {
        alert("Pilih santri terlebih dahulu.");
        return;
      }

      if (form.target_type === "kelas" && !form.kelas) {
        alert("Pilih kelas terlebih dahulu.");
        return;
      }

      if (form.target_type === "jenjang" && !form.jenjang) {
        alert("Pilih jenjang terlebih dahulu.");
        return;
      }

      if (Number(form.nominal) <= 0) {
        alert("Nominal harus lebih dari 0.");
        return;
      }

      setLoadingAction(true);

      const result = await fetchJson(`${API_URL}/api/admin/tagihan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_type: form.target_type,
          santri_id: form.santri_id,
          kelas: form.kelas,
          jenjang: form.jenjang,
          jenis: form.jenis,
          nominal: form.nominal,
          deadline: form.deadline,
          ...getAdminPayload(),
        }),
      });

      alert(result.message || "Tagihan berhasil dibuat.");
      resetForm();
      getData();
    } catch (error) {
      console.error(error);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Tagihan belum dapat dibuat."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const verify = async (item) => {
    const confirmVerify = confirm(
      `Verifikasi pembayaran ${item.santri?.nama || "santri"} sebesar ${formatRupiah(
        item.nominal
      )}?`
    );

    if (!confirmVerify) return;

    try {
      setLoadingAction(true);

      const result = await fetchJson(
        `${API_URL}/api/admin/pembayaran/${item.id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tagihan_id: item.tagihan_id,
            tanggal_bayar: item.tanggal_bayar || new Date().toISOString(),
            ...getAdminPayload(),
          }),
        }
      );

      alert(result.message || "Pembayaran berhasil diverifikasi.");
      getData();
    } catch (error) {
      console.error(error);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Pembayaran belum dapat diverifikasi."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const reject = async (item) => {
    const confirmReject = confirm(
      `Tolak pembayaran ${item.santri?.nama || "santri"}?`
    );

    if (!confirmReject) return;

    try {
      setLoadingAction(true);

      const result = await fetchJson(
        `${API_URL}/api/admin/pembayaran/${item.id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tagihan_id: item.tagihan_id,
            ...getAdminPayload(),
          }),
        }
      );

      alert(result.message || "Pembayaran berhasil ditolak.");
      getData();
    } catch (error) {
      console.error(error);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Pembayaran belum dapat ditolak."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const deleteRejectedPayment = async (item) => {
    if (item.status !== "ditolak") {
      alert("Hanya pembayaran yang ditolak yang boleh dihapus.");
      return;
    }

    const confirmDelete = confirm(
      `Hapus pembayaran ditolak milik ${
        item.santri?.nama || "santri"
      } sebesar ${formatRupiah(item.nominal)}?`
    );

    if (!confirmDelete) return;

    try {
      setLoadingAction(true);

      const result = await fetchJson(`${API_URL}/api/admin/pembayaran/${item.id}`, {
        method: "DELETE",
      });

      alert(result.message || "Pembayaran ditolak berhasil dihapus.");
      getData();
    } catch (error) {
      console.error(error);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Pembayaran ditolak belum dapat dihapus."
        );
        return;
      }

      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.santri?.nama?.toLowerCase()?.includes(keyword) ||
      item.santri?.nisn?.toLowerCase()?.includes(keyword) ||
      item.jenis?.toLowerCase()?.includes(keyword) ||
      item.metode?.toLowerCase()?.includes(keyword);

    const matchStatus = filterStatus ? item.status === filterStatus : true;
    const matchJenis = filterJenis ? item.jenis === filterJenis : true;

    const tanggalAcuan = item.tanggal_bayar || item.created_at;
    const matchPeriode = isSamePeriod(tanggalAcuan, filterPeriode);

    return matchSearch && matchStatus && matchJenis && matchPeriode;
  });

  const jenisOptions = [...new Set(data.map((item) => item.jenis).filter(Boolean))];

  const stats = useMemo(() => {
    const displayedData = filteredData;

    const total = displayedData.length;
    const lunas = displayedData.filter((d) => d.status === "lunas").length;
    const pending = displayedData.filter((d) => d.status === "pending").length;
    const ditolak = displayedData.filter((d) => d.status === "ditolak").length;

    const pemasukan = displayedData
      .filter((d) => d.status === "lunas")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const menungguNominal = displayedData
      .filter((d) => d.status === "pending")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const rasioLunas = total ? Math.round((lunas / total) * 100) : 0;

    return {
      total,
      lunas,
      pending,
      ditolak,
      pemasukan,
      menungguNominal,
      tampil: displayedData.length,
      rasioLunas,
    };
  }, [filteredData]);

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
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.13fr_0.87fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 backdrop-blur-xl">
                    <FaMosque className="text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100 sm:text-xs">
                      Admin Payment Command Center
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(2.35rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
                    Manajemen
                    <span className="block text-yellow-300">
                      Pembayaran.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                    Buat tagihan, pantau pembayaran, verifikasi bukti transfer,
                    dan kelola status pembayaran santri dengan tampilan yang
                    lebih Islamic, rapi, sinematik, dan interaktif.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => setTab("tagihan")}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-green-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
                    >
                      <FaFileInvoiceDollar />
                      Buat Tagihan
                    </button>

                    <button
                      onClick={() => setTab("riwayat")}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-6 font-black text-yellow-200 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-yellow-300/20"
                    >
                      <FaReceipt />
                      Riwayat Pembayaran
                    </button>

                    <button
                      onClick={getData}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20"
                    >
                      <FaSyncAlt className={loadingPage ? "animate-spin" : ""} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <HeroCard
                  title="Pemasukan Ditampilkan"
                  value={formatRupiah(stats.pemasukan)}
                  icon={<FaWallet />}
                />

                <HeroCard
                  title="Rasio Lunas"
                  value={`${stats.rasioLunas}%`}
                  icon={<FaChartLine />}
                />

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-yellow-100/80">
                        Pembayaran Pending
                      </p>

                      <h3 className="mt-1 text-4xl font-black text-yellow-300">
                        {stats.pending}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-emerald-50/70">
                        Total nilai: {formatRupiah(stats.menungguNominal)}
                      </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-green-950">
                      <FaClock />
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
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  title="Total Ditampilkan"
                  value={stats.total}
                  desc="Sesuai filter"
                  icon={<FaMoneyBillWave />}
                  color="bg-emerald-600 text-white"
                />

                <StatCard
                  title="Lunas"
                  value={stats.lunas}
                  desc={formatRupiah(stats.pemasukan)}
                  icon={<FaCheckCircle />}
                  color="bg-green-600 text-white"
                />

                <StatCard
                  title="Pending"
                  value={stats.pending}
                  desc={formatRupiah(stats.menungguNominal)}
                  icon={<FaClock />}
                  color="bg-yellow-400 text-green-950"
                />

                <StatCard
                  title="Ditolak"
                  value={stats.ditolak}
                  desc="Pembayaran gagal"
                  icon={<FaTimesCircle />}
                  color="bg-red-500 text-white"
                />
              </div>
            </section>

            {/* PANEL */}
            <section className="relative mt-6 overflow-hidden rounded-[38px] border border-[#D8C287] bg-gradient-to-br from-[#FFFDF6] via-white to-[#E8F5E9] shadow-2xl shadow-green-950/10 backdrop-blur-xl">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative z-10">
                <div className="border-b border-[#E7D7A7] p-4 sm:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#4A3410] px-3 py-1 text-xs font-black text-yellow-200">
                        <FaShieldAlt />
                        Payment Management
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-[#1F1607]">
                        Pusat Pembayaran Santri
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        Kelola tagihan, verifikasi pembayaran, dan hapus
                        pembayaran yang ditolak.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#E7D7A7] bg-white/70 p-2 shadow-sm backdrop-blur-xl sm:w-[420px]">
                      <button
                        onClick={() => setTab("tagihan")}
                        className={`
                          h-12 rounded-2xl font-black transition
                          ${
                            tab === "tagihan"
                              ? "bg-[#064E3B] text-white shadow-lg"
                              : "text-slate-600 hover:bg-yellow-50"
                          }
                        `}
                      >
                        Buat Tagihan
                      </button>

                      <button
                        onClick={() => setTab("riwayat")}
                        className={`
                          h-12 rounded-2xl font-black transition
                          ${
                            tab === "riwayat"
                              ? "bg-[#064E3B] text-white shadow-lg"
                              : "text-slate-600 hover:bg-yellow-50"
                          }
                        `}
                      >
                        Riwayat
                      </button>
                    </div>
                  </div>
                </div>

                {tab === "tagihan" && (
                  <TagihanForm
                    form={form}
                    setForm={setForm}
                    santri={santri}
                    loadingAction={loadingAction}
                    createTagihan={createTagihan}
                    formatTanggalInput={formatTanggalInput}
                    formatRupiah={formatRupiah}
                  />
                )}

                {tab === "riwayat" && (
                  <RiwayatPembayaran
                    search={search}
                    setSearch={setSearch}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterJenis={filterJenis}
                    setFilterJenis={setFilterJenis}
                    filterPeriode={filterPeriode}
                    setFilterPeriode={setFilterPeriode}
                    jenisOptions={jenisOptions}
                    loadingPage={loadingPage}
                    filteredData={filteredData}
                    formatRupiah={formatRupiah}
                    formatTanggal={formatTanggal}
                    verify={verify}
                    reject={reject}
                    deleteRejectedPayment={deleteRejectedPayment}
                    setPreviewImage={setPreviewImage}
                  />
                )}
              </div>
            </section>

            {serverMaintenance && (
              <ServerMaintenanceModal
                message={serverMessage}
                onRetry={() => {
                  setServerMaintenance(false);
                  setServerMessage("");
                  getData();
                  getSantri();
                }}
                onClose={() => setServerMaintenance(false)}
              />
            )}
          </div>
        </div>

        {previewImage && (
          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </main>

      <style jsx global>{`
        .input {
          width: 100%;
          height: 48px;
          border-radius: 16px;
          border: 1px solid #d8c287;
          background: rgba(255, 255, 255, 0.82);
          padding: 0 14px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          outline: none;
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
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-green-950 shadow-md">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-yellow-100/80">{title}</p>

          <h3 className="mt-1 truncate text-2xl font-black sm:text-3xl">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-4 shadow-xl shadow-yellow-950/5 transition hover:-translate-y-1 hover:shadow-2xl sm:p-5">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-slate-500 sm:text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#1F1607] sm:text-3xl">
            {value}
          </h2>

          <p className="mt-1 truncate text-xs font-bold text-slate-500">
            {desc}
          </p>
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

function TagihanForm({
  form,
  setForm,
  santri,
  loadingAction,
  createTagihan,
  formatTanggalInput,
  formatRupiah,
}) {
  return (
    <div className="flex justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#E7D7A7] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF4D1] p-4 shadow-xl shadow-yellow-950/10 sm:p-6">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064E3B] text-2xl text-white shadow-md">
              <FaReceipt />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#1F1607]">
                Form Tagihan
              </h3>

              <p className="text-sm font-semibold text-slate-500">
                Lengkapi data tagihan santri, kelas, atau jenjang.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Label>Target Tagihan</Label>

              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <TargetButton
                  active={form.target_type === "santri"}
                  icon={<FaUserGraduate />}
                  title="Santri"
                  desc="Tagihan individual"
                  onClick={() =>
                    setForm({
                      ...form,
                      target_type: "santri",
                      santri_id: "",
                      kelas: "",
                      jenjang: "",
                    })
                  }
                />

                <TargetButton
                  active={form.target_type === "kelas"}
                  icon={<FaUsers />}
                  title="Kelas"
                  desc="Tagihan satu kelas"
                  onClick={() =>
                    setForm({
                      ...form,
                      target_type: "kelas",
                      santri_id: "",
                      kelas: "",
                      jenjang: "",
                    })
                  }
                />

                <TargetButton
                  active={form.target_type === "jenjang"}
                  icon={<FaSchool />}
                  title="Jenjang"
                  desc="Tagihan per jenjang"
                  onClick={() =>
                    setForm({
                      ...form,
                      target_type: "jenjang",
                      santri_id: "",
                      kelas: "",
                      jenjang: "",
                    })
                  }
                />
              </div>
            </div>

            {form.target_type === "santri" && (
              <InputGroup label="Pilih Santri">
                <select
                  value={form.santri_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      santri_id: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="">Pilih Santri</option>

                  {santri.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} - {s.nisn || "Tanpa NISN"}
                    </option>
                  ))}
                </select>
              </InputGroup>
            )}

            {form.target_type === "kelas" && (
              <InputGroup label="Pilih Kelas">
                <select
                  value={form.kelas}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kelas: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                  <option value="10">Kelas 10</option>
                  <option value="11">Kelas 11</option>
                  <option value="12">Kelas 12</option>
                </select>
              </InputGroup>
            )}

            {form.target_type === "jenjang" && (
              <InputGroup label="Pilih Jenjang">
                <select
                  value={form.jenjang}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jenjang: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="">Pilih Jenjang</option>
                  <option value="SMP">SMP</option>
                  <option value="SMK">SMK</option>
                  <option value="Takhassus">Takhassus</option>
                </select>
              </InputGroup>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputGroup label="Jenis Pembayaran">
                <select
                  value={form.jenis}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jenis: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Semester">Semester</option>
                  <option value="Daftar Ulang">Daftar Ulang</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Uang Buku">Uang Buku</option>
                </select>
              </InputGroup>

              <InputGroup label="Nominal">
                <input
                  type="number"
                  placeholder="Contoh: 250000"
                  value={form.nominal}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nominal: e.target.value,
                    })
                  }
                  className="input"
                />
              </InputGroup>

              <InputGroup label="Deadline Pembayaran">
                <div className="relative">
                  <input
                    type="text"
                    value={formatTanggalInput(form.deadline)}
                    placeholder="Pilih tanggal deadline"
                    readOnly
                    className="input cursor-pointer pr-14"
                    onClick={() => {
                      document
                        .getElementById("deadline-hidden-input")
                        ?.showPicker?.();

                      document
                        .getElementById("deadline-hidden-input")
                        ?.click();
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("deadline-hidden-input")
                        ?.showPicker?.();

                      document
                        .getElementById("deadline-hidden-input")
                        ?.click();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#064E3B]"
                  >
                    <FaCalendarAlt />
                  </button>

                  <input
                    id="deadline-hidden-input"
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        deadline: e.target.value,
                      })
                    }
                    className="pointer-events-none absolute inset-0 opacity-0"
                    tabIndex={-1}
                  />
                </div>

                {form.deadline && (
                  <p className="mt-2 text-xs font-black text-[#064E3B]">
                    Deadline: {formatTanggalInput(form.deadline)}
                  </p>
                )}
              </InputGroup>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#4A3410] p-4 text-white shadow-lg">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-wide text-yellow-200">
                    Ringkasan Nominal
                  </p>

                  <h4 className="mt-2 break-words text-2xl font-black text-yellow-300">
                    {formatRupiah(form.nominal || 0)}
                  </h4>

                  <p className="mt-1 text-xs text-emerald-50/80">
                    Akan dibuat sebagai tagihan baru.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={createTagihan}
              disabled={loadingAction}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#064E3B] to-[#0B8A5F] font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
            >
              <FaPaperPlane />
              {loadingAction ? "Mengirim Tagihan..." : "Kirim Tagihan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiwayatPembayaran({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterJenis,
  setFilterJenis,
  filterPeriode,
  setFilterPeriode,
  jenisOptions,
  loadingPage,
  filteredData,
  formatRupiah,
  formatTanggal,
  verify,
  reject,
  deleteRejectedPayment,
  setPreviewImage,
}) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_200px_200px]">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Cari nama santri, NISN, jenis pembayaran, metode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-[#D8C287] bg-white/80 pl-12 pr-4 font-semibold outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
          />
        </div>

        <FilterSelect value={filterStatus} onChange={setFilterStatus}>
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="lunas">Lunas</option>
          <option value="ditolak">Ditolak</option>
        </FilterSelect>

        <FilterSelect value={filterJenis} onChange={setFilterJenis}>
          <option value="">Semua Jenis</option>

          {jenisOptions.map((jenis) => (
            <option key={jenis} value={jenis}>
              {jenis}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={filterPeriode} onChange={setFilterPeriode}>
          <option value="">Semua Waktu</option>
          <option value="hari">Hari Ini</option>
          <option value="minggu">Minggu Ini</option>
          <option value="bulan">Bulan Ini</option>
          <option value="tahun">Tahun Ini</option>
        </FilterSelect>
      </div>

      {loadingPage ? (
        <LoadingState />
      ) : filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredData.map((item) => (
            <PaymentCard
              key={item.id}
              item={item}
              formatRupiah={formatRupiah}
              formatTanggal={formatTanggal}
              onVerify={() => verify(item)}
              onReject={() => reject(item)}
              onDeleteRejected={() => deleteRejectedPayment(item)}
              onPreview={() => setPreviewImage(item.bukti_transfer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-2xl border border-[#D8C287] bg-white/80 px-4 font-semibold text-slate-700 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
    >
      {children}
    </select>
  );
}

function Label({ children }) {
  return <label className="text-sm font-black text-[#1F1607]">{children}</label>;
}

function InputGroup({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TargetButton({ active, icon, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border p-4 text-left transition
        ${
          active
            ? "border-[#064E3B] bg-[#064E3B] text-white shadow-lg"
            : "border-[#E7D7A7] bg-white/75 text-slate-700 hover:bg-yellow-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${
            active ? "bg-yellow-400 text-green-950" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {icon}
        </span>

        <div>
          <p className="font-black">{title}</p>
          <p
            className={`mt-0.5 text-xs font-semibold ${
              active ? "text-emerald-50/80" : "text-slate-500"
            }`}
          >
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}

function PaymentCard({
  item,
  formatRupiah,
  formatTanggal,
  onVerify,
  onReject,
  onDeleteRejected,
  onPreview,
}) {
  const statusStyle =
    item.status === "lunas"
      ? "bg-emerald-100 text-emerald-700"
      : item.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : item.status === "ditolak"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  const statusLabel =
    item.status === "pending"
      ? "Menunggu Verifikasi"
      : item.status === "lunas"
      ? "Lunas"
      : item.status === "ditolak"
      ? "Ditolak"
      : item.status || "-";

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-5 shadow-lg shadow-yellow-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl transition group-hover:scale-125" />
      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl transition group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#064E3B] text-2xl text-white shadow-md">
            <FaUserGraduate />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-black text-[#1F1607]">
              {item.santri?.nama || "Santri"}
            </h3>

            <p className="mt-1 text-xs font-bold text-slate-500">
              NISN: {item.santri?.nisn || "-"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black text-blue-700">
                {item.jenis || "-"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-black ${statusStyle}`}
              >
                {statusLabel}
              </span>

              {item.metode && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-black text-purple-700">
                  {item.metode}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-[#E7D7A7] bg-white/70 p-4 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            Nominal Pembayaran
          </p>

          <h2 className="mt-1 break-words text-3xl font-black text-[#064E3B]">
            {formatRupiah(item.nominal)}
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <SmallInfo
              icon={<FaCalendarAlt />}
              label="Tanggal Bayar"
              value={formatTanggal(item.tanggal_bayar || item.created_at)}
            />

            <SmallInfo
              icon={<FaClock />}
              label="Deadline"
              value={formatTanggal(item.tagihan?.deadline)}
            />
          </div>
        </div>

        {item.bukti_transfer ? (
          <button
            onClick={onPreview}
            className="mt-4 flex w-full items-center gap-3 rounded-3xl border border-[#E7D7A7] bg-white/70 p-3 text-left shadow-sm transition hover:bg-yellow-50"
          >
            <img
              src={item.bukti_transfer}
              alt="Bukti Transfer"
              className="h-16 w-16 rounded-2xl object-cover"
            />

            <div>
              <p className="font-black text-[#1F1607]">Bukti Transfer</p>

              <p className="text-xs text-slate-500">
                Klik untuk melihat gambar.
              </p>
            </div>

            <FaEye className="ml-auto text-[#064E3B]" />
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-3xl bg-white/70 p-4 text-slate-500">
            <FaImage />
            <p className="text-sm">Belum ada bukti transfer.</p>
          </div>
        )}

        {item.status === "pending" && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={onVerify}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] font-black text-white transition hover:bg-[#086B4F]"
            >
              <FaCheck />
              Verifikasi
            </button>

            <button
              onClick={onReject}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 font-black text-white transition hover:bg-red-600"
            >
              <FaBan />
              Tolak
            </button>
          </div>
        )}

        {item.status === "ditolak" && (
          <button
            onClick={onDeleteRejected}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 font-black text-white transition hover:bg-red-700"
          >
            <FaTrash />
            Hapus Pembayaran Ditolak
          </button>
        )}

        {item.status === "lunas" && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 font-black text-emerald-700">
            <FaCheckCircle />
            Pembayaran sudah lunas
          </div>
        )}
      </div>
    </div>
  );
}

function SmallInfo({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-[#064E3B]">{icon}</span>
        <span>{label}</span>
      </div>

      <span className="text-right font-bold text-[#1F1607]">{value}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-80 animate-pulse rounded-[32px] bg-white/70"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-3xl text-slate-400">
        <FaInfoCircle />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-700">
        Data Pembayaran Tidak Ditemukan
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Coba gunakan kata kunci atau filter lain.
      </p>
    </div>
  );
}

function ImagePreviewModal({ image, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-3xl overflow-hidden rounded-[34px] bg-[#FFFDF6] shadow-2xl">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#041B14] via-[#0B3B2E] to-[#4A3410] p-4 text-white">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />

          <div className="relative z-10">
            <h3 className="text-lg font-black">Bukti Transfer</h3>

            <p className="text-sm text-white/80">
              Periksa bukti sebelum melakukan verifikasi.
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-auto bg-[#FFFDF6] p-4">
          <img
            src={image}
            alt="Preview Bukti Transfer"
            className="mx-auto max-h-[70vh] rounded-2xl object-contain"
          />
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
                "Backend belum aktif. Data pembayaran belum dapat dimuat untuk sementara waktu."}
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