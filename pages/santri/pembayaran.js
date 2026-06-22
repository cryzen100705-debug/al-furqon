"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import SidebarSantri from "../santri/sidebar";
import { usePembayaran } from "../../hooks/usePembayaran";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import useSantriSettings from "../../hooks/useSantriSettings";

import {
  FaMoneyBillWave,
  FaUpload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaWallet,
  FaCreditCard,
  FaUniversity,
  FaArrowRight,
  FaBell,
  FaBars,
  FaQuran,
  FaShieldAlt,
  FaMosque,
  FaReceipt,
  FaInfoCircle,
  FaFileUpload,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";

export default function PembayaranSantri() {
  const fileRefs = useRef({});
  const { settings } = useSantriSettings();

const isDark = settings.darkMode;
const isCompact = settings.compactMode;

const theme = {
  page: isDark
    ? "bg-[#061B14] text-white"
    : "bg-[#F7F1DF] text-slate-900",

  background: isDark
    ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#061B14_0%,#0B3B2E_42%,#F2EAD5_42%,#F2EAD5_100%)]"
    : "bg-[linear-gradient(180deg,#FFF8E1_0%,#F7F1DF_42%,#FDFBF4_42%,#FDFBF4_100%)]",

  header: isDark
    ? "border-white/10 bg-[#061B14]/75"
    : "border-yellow-200 bg-white/95 shadow-sm",

  headerTitle: isDark ? "text-white" : "text-[#102A1F]",
  headerSub: isDark ? "text-emerald-100/75" : "text-slate-600",

  hero: isDark
    ? "border-white/10 bg-[#071B14]/80 text-white shadow-black/30"
    : "border-emerald-800/20 bg-[#FFFDF6] text-[#102A1F] shadow-yellow-950/10",

  heroOverlay: isDark
    ? "bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.88),rgba(74,52,16,0.72))]"
    : "bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,248,220,0.92),rgba(236,253,245,0.86))]",

  heroText: isDark ? "text-emerald-50/90" : "text-slate-700",

  badge: isDark
    ? "border border-yellow-300/20 bg-yellow-300/10"
    : "border border-emerald-700/15 bg-emerald-50",

  badgeIcon: isDark ? "text-yellow-300" : "text-emerald-700",
  badgeText: isDark ? "text-yellow-100" : "text-emerald-800",

  body: isDark
    ? "bg-[#0B2A20] shadow-black/20"
    : "bg-[#F8F0D6] shadow-yellow-950/10",

  lightCard: isDark
    ? "border-white/10 bg-white/10 text-white"
    : "border-yellow-300/70 bg-[#FFFDF6] text-slate-900 shadow-yellow-950/10",

  title: isDark ? "text-white" : "text-[#102A1F]",
  desc: isDark ? "text-emerald-50/80" : "text-slate-700",

  glassCard: isDark
    ? "border-white/10 bg-white/10 text-white"
    : "border-emerald-800/10 bg-white/70 text-slate-900",

  heroButtonSecondary: isDark
    ? "border-white/10 bg-white/10 text-white hover:bg-white/20"
    : "border-emerald-700/15 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",

  heroGlass: isDark
    ? "border-white/10 bg-white/10 text-white"
    : "border-emerald-800/10 bg-white/65 text-slate-900 shadow-yellow-950/10",

  mutedText: isDark ? "text-emerald-50/70" : "text-slate-600",
  strongText: isDark ? "text-white" : "text-[#102A1F]",
};

  const [selectedMethod, setSelectedMethod] = useState({});
const [selectedFile, setSelectedFile] = useState({});
const [selectedAmount, setSelectedAmount] = useState({});

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState("belum_bayar");

  const { data, loading, bayar, uploadingId, santri, refresh } =
    usePembayaran();

  const totalTagihan = data.length;

  const tagihanBelumBayar = data.filter(
    (item) => item.status === "belum_bayar" || item.status === "ditolak"
  );

  const tagihanPending = data.filter((item) => item.status === "pending");

  const tagihanLunas = data.filter((item) => item.status === "lunas");

  const totalBelumBayar = tagihanBelumBayar.length;
  const totalPending = tagihanPending.length;
  const totalLunas = tagihanLunas.length;

  const filteredTagihan =
    activeTab === "belum_bayar"
      ? tagihanBelumBayar
      : activeTab === "pending"
      ? tagihanPending
      : tagihanLunas;

  const totalNominal = data.reduce(
    (sum, item) => sum + Number(item.nominal || 0),
    0
  );

  const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
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

const handleConfirmPayment = (item) => {
  const nominalTagihan = Number(item.nominal || 0);
  const nominalDibayar = Number(item.nominal_dibayar || 0);
  const sisaTagihan = Math.max(nominalTagihan - nominalDibayar, 0);
  const nominalBayar = Number(selectedAmount[item.id] || 0);

  if (!selectedMethod[item.id]) {
    alert("Pilih metode pembayaran terlebih dahulu.");
    return;
  }

  if (!selectedFile[item.id]) {
    alert("Upload bukti pembayaran terlebih dahulu.");
    return;
  }

  if (!nominalBayar || nominalBayar <= 0) {
    alert("Nominal pembayaran wajib diisi dan harus lebih dari 0.");
    return;
  }

  if (nominalBayar > sisaTagihan) {
    alert(
      `Nominal pembayaran tidak boleh melebihi sisa tagihan.\n\nSisa tagihan: ${formatRupiah(
        sisaTagihan
      )}`
    );
    return;
  }

  bayar({
    item,
    metode: selectedMethod[item.id],
    file: selectedFile[item.id],
    nominal_bayar: nominalBayar,
  });
};

  const getEmptyMessage = () => {
    if (activeTab === "belum_bayar") {
      return {
        title: "Tidak Ada Tagihan Belum Dibayar",
        desc: "Saat ini tidak ada tagihan yang perlu dibayar.",
      };
    }

    if (activeTab === "pending") {
      return {
        title: "Tidak Ada Pembayaran Pending",
        desc: "Saat ini tidak ada pembayaran yang sedang menunggu verifikasi admin.",
      };
    }

    return {
      title: "Belum Ada Tagihan Lunas",
      desc: "Saat ini belum ada tagihan yang sudah dinyatakan lunas.",
    };
  };

    const { checking } = useAuthGuard(["santri"]);

if (checking) {
  return <AuthLoading role="Santri" />;
}

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061B14] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_34%)]" />
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 shadow-2xl backdrop-blur-xl">
            <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-yellow-300 border-t-transparent" />
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.32em] text-yellow-300">
            Memuat Pembayaran
          </p>

          <h1 className="mt-3 text-3xl font-black">Mohon tunggu...</h1>
        </div>
      </div>
    );
  }

  return (
    <div
  className={`
    min-h-screen overflow-x-hidden transition-all duration-300
    ${theme.page}
    ${isCompact ? "text-sm" : "text-base"}
  `}
>
      <SidebarSantri
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        santri={santri}
      />

      <main
        className={`
          min-h-screen transition-all duration-300
          pt-16 md:pt-0
          ${collapsed ? "md:ml-[90px]" : "md:ml-[280px]"}
        `}
      >
        <section className="relative min-h-screen overflow-hidden">
          <div className={`absolute inset-0 ${theme.background}`} />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10">
            <header
  className={`
    sticky top-0 z-40 border-b backdrop-blur-2xl transition-all duration-300
    ${theme.header}
  `}
>
              <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
                  >
                    <FaBars />
                  </button>

                  <div className="min-w-0">
                    <h1 className={`truncate text-xl font-black md:text-2xl ${theme.headerTitle}`}>
                      Pembayaran Santri
                    </h1>

                    <p className={`mt-1 truncate text-xs font-semibold sm:text-sm ${theme.headerSub}`}>
                      Pantau tagihan dan upload bukti pembayaran
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20">
                    <FaBell className="text-yellow-300" />
                    {totalPending > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                        {totalPending > 99 ? "99+" : totalPending}
                      </span>
                    )}
                  </button>

                  <div
  className={`
    hidden items-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-xl sm:flex
    ${isDark ? "border-white/10 bg-white/10 text-white" : "border-emerald-800/10 bg-emerald-50 text-emerald-900"}
  `}
>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-emerald-950">
                      {santri?.nama?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h3 className="max-w-[150px] truncate text-sm font-black">
                        {santri?.nama || "Santri"}
                      </h3>

<p className={isDark ? "text-xs text-emerald-100/70" : "text-xs text-slate-600"}>
  Santri Aktif
</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <motion.section
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`
  relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
  ${isCompact ? "rounded-[30px] p-4 sm:p-5 lg:p-6" : "rounded-[42px] p-5 sm:p-7 lg:p-9"}
  ${theme.hero}
`}
              >
                <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
                  <div>
<div
  className={`
    inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-xl
    ${theme.badge}
  `}
>
  <FaMosque className={theme.badgeIcon} />

  <span
    className={`
      text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs
      ${theme.badgeText}
    `}
  >
    Santri Payment Center
  </span>
</div>

                    <h2 className="mt-6 text-[clamp(2.3rem,6vw,5.6rem)] font-black leading-[0.9] tracking-[-0.065em]">
                      Kelola
                      <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                        Pembayaran.
                      </span>
                    </h2>

                    <p
  className={`
    mt-5 max-w-3xl leading-relaxed
    ${theme.heroText}
    ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base lg:text-lg"}
  `}
>
                      Assalamu’alaikum, {santri?.nama || "Santri"}. Di halaman
                      ini kamu bisa melihat tagihan, memilih metode pembayaran,
                      dan mengirim bukti pembayaran untuk diverifikasi admin.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href="#daftar-tagihan"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 text-sm font-black text-emerald-950 shadow-lg shadow-yellow-950/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:text-base"
                      >
                        Lihat Tagihan
                        <FaArrowRight />
                      </a>

                      <button
                        type="button"
                        onClick={refresh}
                        className={`
  inline-flex h-12 items-center justify-center gap-3 rounded-2xl border px-6 
  font-black backdrop-blur-xl transition hover:-translate-y-0.5
  ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
  ${theme.heroButtonSecondary}
`}
                      >
                        <FaRedo />
                        Refresh
                      </button>

                      <div
  className={`
    inline-flex h-12 items-center justify-center gap-3 rounded-2xl border px-6
    font-black backdrop-blur-xl
    ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
    ${theme.heroButtonSecondary}
  `}
>
  <FaWallet className={isDark ? "text-yellow-300" : "text-emerald-700"} />
  {formatRupiah(totalNominal)}
</div>
                    </div>
                  </div>

                  <div className="relative mx-auto w-full max-w-md xl:ml-auto">
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-3 -top-4 z-20 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-2xl"
                    >
                      <FaReceipt />
                    </motion.div>

                    <div
  className={`
    relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
    ${isCompact ? "rounded-[28px] p-4" : "rounded-[40px] p-6"}
    ${theme.heroGlass}
  `}
>
                      <div
  className={`
    absolute inset-0
    ${
      isDark
        ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]"
        : "bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(236,253,245,0.78),rgba(255,248,220,0.74))]"
    }
  `}
/>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`text-sm font-semibold ${theme.mutedText}`}>
  Total Tagihan
</p>

<h3 className={`mt-2 font-black ${theme.strongText} ${isCompact ? "text-4xl" : "text-5xl"}`}>
  {totalTagihan}
</h3>
                          </div>

                          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-2xl text-emerald-950 shadow-xl">
                            <FaWallet />
                          </div>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-4">
                          <HeroMiniCard
  label="Belum Bayar"
  value={totalBelumBayar}
  icon={<FaExclamationTriangle />}
  theme={theme}
  isDark={isDark}
  isCompact={isCompact}
/>

<HeroMiniCard
  label="Lunas"
  value={totalLunas}
  icon={<FaCheckCircle />}
  theme={theme}
  isDark={isDark}
  isCompact={isCompact}
/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <section
  className={`
    mt-7 shadow-2xl transition-all duration-300
    ${isCompact ? "rounded-[30px] p-3 sm:p-4 lg:p-5" : "rounded-[42px] p-4 sm:p-6 lg:p-7"}
    ${theme.body}
  `}
>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
  title="Total Tagihan"
  value={totalTagihan}
  icon={<FaFileInvoiceDollar />}
  color="from-blue-500 to-cyan-500"
  theme={theme}
  isCompact={isCompact}
/>

                  <StatCard
                    title="Belum Bayar"
                    value={totalBelumBayar}
                    icon={<FaExclamationTriangle />}
                    color="from-red-500 to-orange-500"
                    theme={theme}
  isCompact={isCompact}
                  />

                  <StatCard
                    title="Menunggu Verifikasi"
                    value={totalPending}
                    icon={<FaClock />}
                    color="from-yellow-400 to-orange-500"
                    theme={theme}
  isCompact={isCompact}
                  />

                  <StatCard
                    title="Pembayaran Lunas"
                    value={totalLunas}
                    icon={<FaCheckCircle />}
                    color="from-emerald-500 to-green-700"
                    theme={theme}
  isCompact={isCompact}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden rounded-[34px] border border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] p-6 shadow-xl shadow-yellow-950/5">
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                        <FaShieldAlt />
                        Informasi Pembayaran
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-[#1F1607] sm:text-3xl">
                        Upload bukti pembayaran dengan jelas
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                        Pastikan nominal pembayaran sesuai tagihan dan bukti
                        transfer terlihat jelas agar admin dapat melakukan
                        verifikasi lebih cepat.
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] p-6 text-white shadow-xl shadow-green-950/10">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
                        <FaQuran />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-emerald-100">
                          Pengingat
                        </p>

                        <h3 className="mt-2 text-2xl font-black leading-snug text-white">
                          Bayar tepat waktu, administrasi lebih tertib.
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <TabCard
                    active={activeTab === "belum_bayar"}
                    onClick={() => setActiveTab("belum_bayar")}
                    title="Belum Dibayar"
                    value={tagihanBelumBayar.length}
                    desc="Tagihan yang belum dibayar atau pembayaran ditolak."
                    icon={<FaTimesCircle />}
                    activeClass="border-red-300 bg-red-50 shadow-xl"
                    inactiveClass="border-[#E5D6AA] bg-white hover:bg-red-50"
                    iconClass="bg-red-500 text-white"
                    valueClass="text-red-600"
                  />

                  <TabCard
                    active={activeTab === "pending"}
                    onClick={() => setActiveTab("pending")}
                    title="Menunggu Verifikasi"
                    value={tagihanPending.length}
                    desc="Bukti pembayaran sudah dikirim dan menunggu admin."
                    icon={<FaClock />}
                    activeClass="border-yellow-300 bg-yellow-50 shadow-xl"
                    inactiveClass="border-[#E5D6AA] bg-white hover:bg-yellow-50"
                    iconClass="bg-yellow-400 text-emerald-950"
                    valueClass="text-yellow-600"
                  />

                  <TabCard
                    active={activeTab === "lunas"}
                    onClick={() => setActiveTab("lunas")}
                    title="Sudah Dibayar"
                    value={tagihanLunas.length}
                    desc="Pembayaran sudah diverifikasi dan dinyatakan lunas."
                    icon={<FaCheckCircle />}
                    activeClass="border-emerald-300 bg-emerald-50 shadow-xl"
                    inactiveClass="border-[#E5D6AA] bg-white hover:bg-emerald-50"
                    iconClass="bg-emerald-600 text-white"
                    valueClass="text-emerald-600"
                  />
                </div>

                <div id="daftar-tagihan" className="mt-8 grid gap-6">
                  {filteredTagihan.length > 0 ? (
                    filteredTagihan.map((item, index) => (

                      <PaymentCard
  key={item.id}
  item={item}
  index={index}
  selectedMethod={selectedMethod}
  setSelectedMethod={setSelectedMethod}
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  selectedAmount={selectedAmount}
  setSelectedAmount={setSelectedAmount}
  fileRefs={fileRefs}
  uploadingId={uploadingId}
  onConfirm={handleConfirmPayment}
  formatRupiah={formatRupiah}
  formatTanggal={formatTanggal}
/>
                    ))
                  ) : (
                    <EmptyState
                      title={getEmptyMessage().title}
                      desc={getEmptyMessage().desc}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function TabCard({
  active,
  onClick,
  title,
  value,
  desc,
  icon,
  activeClass,
  inactiveClass,
  iconClass,
  valueClass,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left transition ${
        active ? activeClass : inactiveClass
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-slate-500">{title}</p>

          <h3 className={`mt-2 text-4xl font-black ${valueClass}`}>
            {value}
          </h3>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">{desc}</p>
    </button>
  );
}

function HeroMiniCard({ label, value, icon, theme, isDark, isCompact }) {
  return (
    <div
      className={`
        border backdrop-blur-xl transition-all duration-300
        ${isCompact ? "rounded-2xl p-3" : "rounded-3xl p-4"}
        ${theme.glassCard}
      `}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
        {icon}
      </div>

      <p className={`text-sm font-semibold ${theme.mutedText}`}>
        {label}
      </p>

      <h3 className={`mt-1 font-black ${theme.strongText} ${isCompact ? "text-xl" : "text-2xl"}`}>
        {value}
      </h3>
    </div>
  );
}

function StatCard({ title, value, icon, color, theme, isCompact }) {
  return (
    <motion.div
      whileHover={{
        y: -7,
        scale: 1.01,
      }}
      className={`
        relative overflow-hidden border shadow-xl transition
        ${isCompact ? "rounded-[22px] p-4" : "rounded-[30px] p-6"}
        ${theme.lightCard}
      `}
    >
      <div
        className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${color} opacity-20 blur-3xl`}
      />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className={`font-black ${theme.desc} ${isCompact ? "text-xs" : "text-sm"}`}>
            {title}
          </p>

          <h2 className={`mt-3 font-black ${theme.title} ${isCompact ? "text-3xl" : "text-4xl"}`}>
            {value}
          </h2>
        </div>

        <div
          className={`flex shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${color} text-white shadow-xl ${
            isCompact ? "h-12 w-12 text-xl" : "h-16 w-16 text-2xl"
          }`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function PaymentCard({
  item,
  index,
  selectedMethod,
  setSelectedMethod,
  selectedFile,
  setSelectedFile,
  selectedAmount,
  setSelectedAmount,
  fileRefs,
  uploadingId,
  onConfirm,
  formatRupiah,
  formatTanggal,
}) {
  const canPay = item.status === "belum_bayar" || item.status === "ditolak";
  const deadline = item.deadline || item.tagihan?.deadline;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={{
        y: -4,
      }}
      className="relative overflow-hidden rounded-[35px] border border-[#E5D6AA] bg-white shadow-2xl shadow-yellow-950/5"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />

      <div className="relative z-10 p-5 sm:p-7 md:p-9">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#064E3B] to-emerald-700 text-3xl text-white shadow-2xl">
              <FaMoneyBillWave />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-700">
                  Tagihan Santri
                </span>

                {deadline && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-black text-yellow-700">
                    Deadline {formatTanggal(deadline)}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-black text-[#064E3B] sm:text-3xl">
                {item.jenis}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Tagihan pembayaran santri Pondok Pesantren Al-Furqon.
              </p>

              <div className="mt-5">
  {Number(item.nominal_dibayar || 0) > 0 &&
  Number(item.nominal_dibayar || 0) < Number(item.nominal || 0) ? (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-2xl font-black tracking-[-0.04em] text-slate-400 line-through sm:text-3xl">
          {formatRupiah(item.nominal)}
        </span>

        <span className="text-[clamp(2rem,6vw,4rem)] font-black tracking-[-0.06em] text-[#1F1607]">
          {formatRupiah(
            Number(item.nominal || 0) - Number(item.nominal_dibayar || 0)
          )}
        </span>
      </div>

      <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
        <span>
          Sudah dibayar: {formatRupiah(item.nominal_dibayar || 0)}
        </span>
        <span className="text-slate-400">•</span>
        <span>
          Sisa tagihan:{" "}
          {formatRupiah(
            Number(item.nominal || 0) - Number(item.nominal_dibayar || 0)
          )}
        </span>
      </div>
    </div>
  ) : (
    <h1 className="text-[clamp(2rem,6vw,4rem)] font-black tracking-[-0.06em] text-[#1F1607]">
      {formatRupiah(item.nominal)}
    </h1>
  )}
</div>
            </div>
          </div>

          <StatusBadge status={item.status} />
        </div>

        {canPay && (
          <div className="mt-8 rounded-[30px] border border-[#E5D6AA] bg-gradient-to-br from-[#FFFDF6] to-[#FFF3C4] p-5 sm:p-6">
            {item.status === "ditolak" && (
              <div className="mb-5 flex items-start gap-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500 text-white">
                  <FaTimesCircle />
                </div>

                <div>
                  <h3 className="font-black">Pembayaran Ditolak</h3>

                  <p className="mt-1 text-sm leading-relaxed">
                    Mohon upload ulang bukti pembayaran yang benar dan pastikan
                    nominal sesuai tagihan.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  Pilih Metode Pembayaran
                </label>

                <select
                  value={selectedMethod[item.id] || ""}
                  onChange={(e) =>
                    setSelectedMethod({
                      ...selectedMethod,
                      [item.id]: e.target.value,
                    })
                  }
                  className="h-14 w-full rounded-2xl border border-[#D8C287] bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
                >
                  <option value="">Pilih Metode</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="va">Virtual Account</option>
                  <option value="qris">QRIS</option>
                  <option value="cash">Cash</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>

              <PaymentInfo method={selectedMethod[item.id]} />
            </div>

            <div>
  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
    Nominal Cicilan
  </label>

  <input
  type="number"
  min="1"
  max={Math.max(
    Number(item.nominal || 0) - Number(item.nominal_dibayar || 0),
    0
  )}
  value={selectedAmount[item.id] || ""}
  onChange={(e) => {
    const sisaTagihan = Math.max(
      Number(item.nominal || 0) - Number(item.nominal_dibayar || 0),
      0
    );

    const value = e.target.value;

    if (value === "") {
      setSelectedAmount({
        ...selectedAmount,
        [item.id]: "",
      });
      return;
    }

    const nominalInput = Number(value);

    if (nominalInput <= 0) {
      setSelectedAmount({
        ...selectedAmount,
        [item.id]: "",
      });
      return;
    }

    if (nominalInput > sisaTagihan) {
      setSelectedAmount({
        ...selectedAmount,
        [item.id]: sisaTagihan,
      });

      alert(
        `Nominal pembayaran tidak boleh lebih dari sisa tagihan: Rp ${sisaTagihan.toLocaleString(
          "id-ID"
        )}`
      );
      return;
    }

    setSelectedAmount({
      ...selectedAmount,
      [item.id]: value,
    });
  }}
  placeholder={`Maksimal Rp ${Math.max(
    Number(item.nominal || 0) - Number(item.nominal_dibayar || 0),
    0
  ).toLocaleString("id-ID")}`}
  className="h-14 w-full rounded-2xl border border-[#D8C287] bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
/>

  <p className="mt-2 text-xs font-bold text-slate-500">
    Sudah dibayar: Rp{" "}
    {Number(item.nominal_dibayar || 0).toLocaleString("id-ID")} • Sisa:
    Rp{" "}
    {(
      Number(item.nominal || 0) - Number(item.nominal_dibayar || 0)
    ).toLocaleString("id-ID")}
  </p>
</div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => fileRefs.current[item.id]?.click()}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <FaFileUpload />
                Pilih Bukti
              </button>

              <button
  type="button"
  onClick={() => onConfirm(item)}
  disabled={
    uploadingId === item.id ||
    !selectedAmount[item.id] ||
    Number(selectedAmount[item.id]) <= 0 ||
    Number(selectedAmount[item.id]) >
      Math.max(Number(item.nominal || 0) - Number(item.nominal_dibayar || 0), 0)
  }
  className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#064E3B] to-emerald-700 px-6 font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
>
                <FaCreditCard />
                {uploadingId === item.id
                  ? "Mengirim..."
                  : item.status === "ditolak"
                  ? "Kirim Ulang"
                  : "Konfirmasi Pembayaran"}
                <FaArrowRight />
              </button>
            </div>

            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              ref={(el) => {
                fileRefs.current[item.id] = el;
              }}
              onChange={(e) =>
                setSelectedFile({
                  ...selectedFile,
                  [item.id]: e.target.files?.[0],
                })
              }
            />

            {selectedFile[item.id] && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
                <FaUpload className="mt-1 shrink-0" />

                <div>
                  <p className="font-black">File dipilih</p>

                  <p className="mt-1 break-all text-sm">
                    {selectedFile[item.id].name}
                  </p>
                </div>
              </div>
            )}

            {uploadingId === item.id && (
              <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm font-bold text-yellow-700">
                Bukti pembayaran sedang dikirim ke admin...
              </div>
            )}
          </div>
        )}

        {item.status === "pending" && (
          <InfoBox
            icon={<FaClock />}
            title="Menunggu Verifikasi Admin"
            desc="Bukti pembayaran sudah dikirim. Mohon menunggu admin melakukan pengecekan."
            color="yellow"
          />
        )}

        {item.status === "lunas" && (
          <InfoBox
            icon={<FaCheckCircle />}
            title="Pembayaran Sudah Lunas"
            desc="Pembayaran telah diverifikasi oleh admin pesantren."
            color="green"
          />
        )}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const config = {
    belum_bayar: {
      label: "Belum Bayar",
      icon: <FaClock />,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    pending: {
      label: "Menunggu Verifikasi",
      icon: <FaClock />,
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    lunas: {
      label: "Sudah Diverifikasi",
      icon: <FaCheckCircle />,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    ditolak: {
      label: "Ditolak",
      icon: <FaTimesCircle />,
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const item = config[status] || config.belum_bayar;

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-black ${item.className}`}
    >
      {item.icon}
      {item.label}
    </div>
  );
}

function PaymentInfo({ method }) {
  if (!method) {
    return (
      <div className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-dashed border-[#D8C287] bg-white/60 px-5 text-sm font-semibold text-slate-500">
        <FaInfoCircle className="text-yellow-600" />
        Pilih metode untuk melihat informasi pembayaran.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="mb-3 flex items-center gap-3">
        <FaUniversity className="text-emerald-700" />

        <h3 className="font-black text-emerald-800">
          Informasi Pembayaran
        </h3>
      </div>

      {method === "transfer" && (
        <div className="space-y-2 text-sm font-semibold text-slate-600">
          <p>
            Bank BCA:
            <span className="ml-2 font-black text-slate-800">
              1234567890
            </span>
          </p>

          <p>A/N Pondok Pesantren Al-Furqon</p>
        </div>
      )}

      {method === "qris" && (
        <p className="text-sm font-semibold text-slate-600">
          Silakan scan QRIS yang diberikan admin, lalu upload bukti pembayaran.
        </p>
      )}

      {method === "ewallet" && (
        <p className="text-sm font-semibold text-slate-600">
          Dana / OVO / GoPay: <b>08123456789</b>
        </p>
      )}

      {method === "va" && (
        <p className="text-sm font-semibold text-slate-600">
          Virtual Account akan dibuat otomatis setelah konfirmasi.
        </p>
      )}

      {method === "cash" && (
        <p className="text-sm font-semibold text-slate-600">
          Silakan bayar langsung ke admin pesantren, lalu upload bukti jika
          tersedia.
        </p>
      )}
    </div>
  );
}

function InfoBox({ icon, title, desc, color }) {
  const colorClass =
    color === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <div
      className={`mt-8 flex items-start gap-4 rounded-3xl border p-5 ${colorClass}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
        {icon}
      </div>

      <div>
        <h3 className="font-black">{title}</h3>

        <p className="mt-1 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="mt-8 rounded-[35px] border border-[#E5D6AA] bg-white p-10 text-center shadow-xl shadow-yellow-950/5 sm:p-16">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-emerald-50 text-5xl text-emerald-700">
        <FaFileInvoiceDollar />
      </div>

      <h2 className="mt-8 text-3xl font-black text-[#1F1607] sm:text-4xl">
        {title || "Tidak Ada Tagihan"}
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
        {desc || "Belum ada tagihan pembayaran untuk santri saat ini."}
      </p>
    </div>
  );
}