"use client";

import SidebarSantri from "./sidebar";
import { useEffect, useMemo, useState } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import useSantriSettings from "../../hooks/useSantriSettings";

import {
  FaFileDownload,
  FaFilePdf,
  FaArrowDown,
  FaCloudDownloadAlt,
  FaFolderOpen,
  FaCheckCircle,
  FaShieldAlt,
  FaUserGraduate,
  FaExclamationCircle,
  FaBookOpen,
  FaPrint,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaMosque,
  FaQuran,
  FaStarAndCrescent,
  FaKaaba,
  FaUpload,
  FaLock,
  FaSyncAlt,
  FaClipboardCheck,
  FaRegClock,
  FaMobileAlt,
  FaMoneyBillWave,
  FaFileSignature,
  FaIdCard,
  FaGraduationCap,
  FaUsers,
  FaCamera,
  FaHeart,
  FaListAlt,
} from "react-icons/fa";

export default function DokumenSantri() {
  const [santri, setSantri] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { settings } = useSantriSettings();

  const isDark = settings.darkMode;
  const isCompact = settings.compactMode;

  const theme = {
    page: isDark
      ? "bg-[#04180F] text-white"
      : "bg-[#F7F1DF] text-slate-900",

    background: isDark
      ? "bg-[radial-gradient(circle_at_top_left,#166534_0%,#064E3B_24%,#022C22_52%,#020617_100%)]"
      : "bg-[linear-gradient(180deg,#FFF8E1_0%,#F7F1DF_42%,#FDFBF4_42%,#FDFBF4_100%)]",

    gridPattern: isDark
      ? "opacity-[0.08]"
      : "opacity-[0.045]",

    heroOuter: isDark
      ? "border-white/15 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
      : "border-yellow-300/60 bg-white/80 shadow-[0_30px_90px_rgba(120,90,20,0.16)]",

    heroInner: isDark
      ? "bg-gradient-to-br from-emerald-900/95 via-green-700/95 to-lime-600/90 text-white"
      : "bg-gradient-to-br from-[#FFFDF6] via-[#ECFDF5] to-[#FFF8DC] text-[#102A1F]",

    heroBadge: isDark
      ? "border-yellow-200/30 bg-white/10 text-yellow-100"
      : "border-emerald-700/15 bg-emerald-50 text-emerald-800",

    heroBadgeIcon: isDark ? "text-yellow-100" : "text-emerald-700",

    heroTitle: isDark ? "text-white" : "text-[#102A1F]",
    heroDesc: isDark ? "text-emerald-50" : "text-slate-700",

    glassCard: isDark
      ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
      : "border-emerald-800/10 bg-white/75 text-slate-900 hover:bg-white",

    glassCardSub: isDark ? "text-emerald-100" : "text-slate-600",
    glassCardLabel: isDark ? "text-emerald-50" : "text-slate-600",

    profileCard: isDark
      ? "border-white/20 bg-white/15 text-white"
      : "border-emerald-800/10 bg-white/75 text-slate-900",

    profileSub: isDark ? "text-emerald-50" : "text-slate-600",
    profileLabel: isDark ? "text-yellow-100" : "text-emerald-700",

    miniProfileRow: isDark
      ? "bg-white/15 text-white"
      : "bg-emerald-50 text-emerald-900",

    sectionCard: isDark
      ? "border-white/10 bg-[#102E24] text-white shadow-black/20"
      : "border-yellow-300/70 bg-white/95 text-slate-900 shadow-yellow-950/10",

    sectionTitle: isDark ? "text-white" : "text-gray-900",
    sectionDesc: isDark ? "text-emerald-50/80" : "text-gray-600",

    processCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-100 bg-gradient-to-br from-white to-emerald-50 text-gray-900",

    requirementSection: isDark
      ? "border-white/10 bg-gradient-to-br from-[#102E24] via-[#0B3B2E] to-[#162A12] text-white shadow-black/20"
      : "border-yellow-200/60 bg-gradient-to-br from-yellow-50 via-white to-emerald-50 text-gray-900 shadow-[0_30px_90px_rgba(250,204,21,0.22)]",

    requirementCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-100 bg-white text-gray-900",

    warningSection: isDark
      ? "border-yellow-300/20 bg-gradient-to-br from-[#4A3410] via-[#1F2A13] to-[#102E24] text-white shadow-black/20"
      : "border-yellow-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-white text-gray-900 shadow-[0_20px_70px_rgba(245,158,11,0.18)]",

    docHeaderBadge: isDark
      ? "bg-white/10 text-yellow-100 ring-white/15"
      : "bg-emerald-50 text-emerald-800 ring-emerald-700/15",

    docHeaderTitle: isDark ? "text-white" : "text-[#102A1F]",
    docHeaderDesc: isDark ? "text-emerald-50" : "text-slate-700",

    docCounter: isDark
      ? "border-white/15 bg-white/10 text-white"
      : "border-emerald-800/10 bg-white text-emerald-900",

    emptyCard: isDark
      ? "border-white/25 bg-white/10 text-white"
      : "border-yellow-300/70 bg-white text-slate-900",

    documentCardInner: isDark
      ? "bg-[#102E24] text-white"
      : "bg-white text-gray-900",

    documentDesc: isDark ? "text-emerald-50/80" : "text-gray-500",

    muted: isDark ? "text-emerald-50/80" : "text-gray-600",
    strong: isDark ? "text-white" : "text-gray-900",
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const getData = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"));

        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/santri/dokumen?user_id=${session.user.id}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.log(result.message);
          return;
        }

        setSantri(result.data.santri);
        setDocs(result.data.docs || []);
      } catch (err) {
        console.log("GET DOKUMEN ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [API_URL]);

  const getInitial = (name = "") => {
    return String(name || "S").trim().charAt(0).toUpperCase();
  };

  const today = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  const steps = [
    {
      icon: <FaCloudDownloadAlt />,
      title: "Unduh Dokumen",
      desc: "Ambil file PDF resmi yang tersedia pada halaman ini.",
    },
    {
      icon: <FaPrint />,
      title: "Cetak Dokumen",
      desc: "Cetak dokumen dengan jelas agar mudah diverifikasi.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Isi & Tanda Tangan",
      desc: "Lengkapi data, lalu tanda tangani sesuai ketentuan.",
    },
    {
      icon: <FaMosque />,
      title: "Bawa ke Pondok",
      desc: "Serahkan dokumen saat datang ke Pondok Pesantren Al-Furqon.",
    },
  ];

  const adminNotes = [
    {
      icon: <FaUpload />,
      title: "Dokumen dari Admin",
      desc: "Jika admin menambahkan dokumen baru, daftar dokumen di halaman ini dapat ditampilkan otomatis dari backend.",
    },
    {
      icon: <FaLock />,
      title: "File Resmi",
      desc: "Santri hanya dapat melihat dan mengunduh dokumen. Pengelolaan file tetap berada di pihak admin.",
    },
    {
      icon: <FaSyncAlt />,
      title: "Siap Dikembangkan",
      desc: "Nanti bisa dibuat fitur upload dokumen admin agar file tidak perlu ditaruh manual di backend.",
    },
  ];

  const syaratPendaftaran = [
    {
      icon: <FaMoneyBillWave />,
      title: "Membayar uang pendaftaran / formulir",
      desc: "Pembayaran dilakukan sesuai ketentuan dari pihak pondok pesantren.",
      tag: "Wajib",
    },
    {
      icon: <FaFileSignature />,
      title: "Mengisi Formulir Pendaftaran",
      desc: "Formulir wajib diisi lengkap sesuai identitas calon santri.",
      tag: "Wajib",
    },
    {
      icon: <FaFileSignature />,
      title: "Mengisi Surat Pernyataan Pesantren",
      desc: "Surat pernyataan harus diisi dan ditandatangani sesuai arahan pondok.",
      tag: "Wajib",
    },
    {
      icon: <FaGraduationCap />,
      title: "3 lembar fotokopi ijazah telah dilegalisir",
      desc: "Pastikan ijazah sudah dilegalisir oleh pihak sekolah asal.",
      tag: "3 Lembar",
    },
    {
      icon: <FaGraduationCap />,
      title: "3 lembar fotokopi surat keterangan lulus",
      desc: "Dibawa sebagai bukti kelulusan dari sekolah sebelumnya.",
      tag: "3 Lembar",
    },
    {
      icon: <FaIdCard />,
      title: "3 lembar fotokopi NISN",
      desc: "NISN harus terbaca jelas untuk kebutuhan pendataan santri.",
      tag: "3 Lembar",
    },
    {
      icon: <FaIdCard />,
      title: "3 lembar fotokopi akte kelahiran",
      desc: "Digunakan untuk validasi data tempat dan tanggal lahir.",
      tag: "3 Lembar",
    },
    {
      icon: <FaUsers />,
      title: "3 lembar fotokopi KTP orang tua",
      desc: "KTP ayah/ibu/wali harus jelas dan sesuai data keluarga.",
      tag: "3 Lembar",
    },
    {
      icon: <FaUsers />,
      title: "3 lembar fotokopi kartu keluarga",
      desc: "Kartu keluarga dibutuhkan untuk verifikasi data keluarga.",
      tag: "3 Lembar",
    },
    {
      icon: <FaCamera />,
      title: "3 lembar foto 3x4 background biru khusus SMK",
      desc: "Foto digunakan untuk kebutuhan administrasi dan identitas santri.",
      tag: "SMK",
    },
    {
      icon: <FaShieldAlt />,
      title: "Fotokopi surat kelakuan baik dari sekolah",
      desc: "Surat ini menjadi bukti perilaku baik dari sekolah sebelumnya.",
      tag: "Wajib",
    },
    {
      icon: <FaHeart />,
      title: "Bagi yatim menyertakan surat keterangan kematian",
      desc: "Khusus calon santri yatim, lampirkan surat keterangan kematian orang tua.",
      tag: "Khusus",
    },
  ];

  const { checking } = useAuthGuard(["santri"]);

  if (checking) {
    return <AuthLoading role="Santri" />;
  }

  return (
    <div
      className={`
        min-h-screen overflow-hidden transition-all duration-300
        ${theme.page}
        ${isCompact ? "text-sm" : "text-base"}
      `}
    >
      <SidebarSantri
        open={open}
        setOpen={setOpen}
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

          <div className={`absolute inset-0 ${theme.gridPattern}`}>
            <div className="h-full w-full bg-[linear-gradient(90deg,#FACC15_1px,transparent_1px),linear-gradient(#FACC15_1px,transparent_1px)] bg-[size:56px_56px]" />
          </div>

          <div className="absolute -top-40 -right-40 h-[460px] w-[460px] rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute top-[420px] -left-44 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-[420px] w-[420px] rounded-full bg-lime-300/10 blur-3xl" />

          {isDark && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 opacity-20">
              <div className="absolute bottom-0 left-[6%] h-28 w-20 rounded-t-full bg-white/20" />
              <div className="absolute bottom-0 left-[18%] h-40 w-28 rounded-t-full bg-white/20" />
              <div className="absolute bottom-0 left-[42%] h-44 w-40 rounded-t-full bg-white/20" />
              <div className="absolute bottom-0 right-[18%] h-40 w-28 rounded-t-full bg-white/20" />
              <div className="absolute bottom-0 right-[6%] h-28 w-20 rounded-t-full bg-white/20" />
            </div>
          )}

          <div
            className={`
              relative z-10 px-4 pb-14 sm:px-6 md:px-10
              ${isCompact ? "pt-16 md:pt-20" : "pt-20 md:pt-28"}
            `}
          >
            <div className="mx-auto max-w-7xl">
              {/* HERO */}
              <div
                className={`
                  relative overflow-hidden border p-1 backdrop-blur-2xl transition-all duration-300
                  ${isCompact ? "rounded-[28px]" : "rounded-[32px] sm:rounded-[44px]"}
                  ${theme.heroOuter}
                `}
              >
                <div
                  className={`
                    relative overflow-hidden transition-all duration-300
                    ${
                      isCompact
                        ? "rounded-[26px] px-4 py-6 sm:px-6 md:px-8 md:py-9"
                        : "rounded-[30px] px-5 py-8 sm:rounded-[42px] sm:px-7 md:px-10 md:py-14"
                    }
                    ${theme.heroInner}
                  `}
                >
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-200 blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
                  </div>

                  <div
                    className={`
                      absolute right-6 top-6 hidden text-[160px] lg:block
                      ${isDark ? "text-white/5" : "text-emerald-900/5"}
                    `}
                  >
                    <FaMosque />
                  </div>

                  <div className="relative z-10 grid gap-9 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
                    <div>
                      <div
                        className={`
                          inline-flex max-w-full items-center gap-3 rounded-full border px-4 py-3 text-xs font-black shadow-lg backdrop-blur-xl sm:px-5 sm:text-sm
                          ${theme.heroBadge}
                        `}
                      >
                        <FaStarAndCrescent
                          className={`shrink-0 ${theme.heroBadgeIcon}`}
                        />
                        <span className="truncate">
                          Pusat Dokumen Digital Santri Al-Furqon
                        </span>
                      </div>

                      <h1
                        className={`
                          mt-6 max-w-4xl font-black leading-[1.05]
                          ${theme.heroTitle}
                          ${
                            isCompact
                              ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                              : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                          }
                        `}
                      >
                        Dokumen & Syarat
                        <span className="block bg-gradient-to-r from-yellow-300 via-lime-200 to-emerald-200 bg-clip-text text-transparent">
                          Pendaftaran Santri
                        </span>
                      </h1>

                      <p
                        className={`
                          mt-5 max-w-3xl leading-relaxed
                          ${theme.heroDesc}
                          ${isCompact ? "text-xs sm:text-sm md:text-base" : "text-sm sm:text-base md:text-lg"}
                        `}
                      >
                        Unduh dokumen resmi, pahami alur penggunaan, dan siapkan
                        seluruh persyaratan pendaftaran agar proses administrasi
                        santri berjalan lancar.
                      </p>

                      <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        <HeroStatCard
                          label="Total Dokumen"
                          value={docs.length}
                          desc="File tersedia"
                          icon={<FaFolderOpen />}
                          theme={theme}
                          isCompact={isCompact}
                        />

                        <HeroStatCard
                          label="Syarat"
                          value={syaratPendaftaran.length}
                          desc="Berkas wajib"
                          icon={<FaListAlt />}
                          theme={theme}
                          isCompact={isCompact}
                        />

                        <HeroStatCard
                          label="Tanggal"
                          value={today}
                          desc="Akses hari ini"
                          icon={<FaRegClock />}
                          theme={theme}
                          isCompact={isCompact}
                          smallValue
                        />
                      </div>
                    </div>

                    {/* PROFILE CARD */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-[34px] bg-yellow-200/20 blur-2xl" />

                      <div
                        className={`
                          relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
                          ${isCompact ? "rounded-[26px] p-4" : "rounded-[34px] p-5 sm:p-6"}
                          ${theme.profileCard}
                        `}
                      >
                        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-yellow-200/20 blur-2xl" />

                        <div className="relative z-10">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[30px] bg-white text-4xl font-black text-emerald-700 shadow-2xl sm:mx-0">
                              {santri?.foto ? (
                                <img
                                  src={santri.foto}
                                  alt={santri.nama || "Santri"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitial(santri?.nama)
                              )}
                            </div>

                            <div className="text-center sm:text-left">
                              <p
                                className={`text-sm font-bold ${theme.profileLabel}`}
                              >
                                Identitas Santri
                              </p>

                              <h3
                                className={`
                                  mt-1 font-black ${theme.strong}
                                  ${isCompact ? "text-xl" : "text-2xl"}
                                `}
                              >
                                {santri?.nama || "Memuat data..."}
                              </h3>

                              <p className={`mt-1 text-sm ${theme.profileSub}`}>
                                {santri?.jenjang || "-"}{" "}
                                {santri?.kelas ? `• Kelas ${santri.kelas}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 grid gap-3">
                            <ProfileInfoRow
                              icon={<FaUserGraduate />}
                              label="NISN"
                              value={santri?.nisn || "-"}
                              theme={theme}
                            />

                            <div
                              className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${theme.miniProfileRow}`}
                            >
                              <span className="flex items-center gap-2 text-sm">
                                <FaShieldAlt /> Status
                              </span>

                              <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-green-950">
                                {santri?.status || "-"}
                              </span>
                            </div>

                            <ProfileInfoRow
                              icon={<FaMobileAlt />}
                              label="Responsif"
                              value="Mobile Ready"
                              theme={theme}
                              small
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`
                      pointer-events-none absolute bottom-5 right-8 hidden animate-pulse text-5xl md:block
                      ${isDark ? "text-white/20" : "text-emerald-900/10"}
                    `}
                  >
                    <FaQuran />
                  </div>
                </div>
              </div>

              {/* ADMIN UPLOAD FUTURE INFORMATION */}
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {adminNotes.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      group relative overflow-hidden border shadow-[0_18px_60px_rgba(0,0,0,0.13)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1
                      ${isCompact ? "rounded-[22px] p-4" : "rounded-[28px] p-5 sm:p-6"}
                      ${theme.glassCard}
                    `}
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-200/15 blur-2xl" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-300 text-2xl text-green-950 shadow-xl transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                        {item.icon}
                      </div>

                      <h3
                        className={`
                          mt-5 font-black ${theme.strong}
                          ${isCompact ? "text-lg" : "text-xl"}
                        `}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`
                          mt-3 leading-relaxed ${theme.glassCardSub}
                          ${isCompact ? "text-xs" : "text-sm"}
                        `}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PROCESS SECTION */}
              <div
                className={`
                  mt-10 border shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300
                  ${isCompact ? "rounded-[26px] p-4 sm:p-5 md:p-6" : "rounded-[34px] p-5 sm:p-7 md:p-8"}
                  ${theme.sectionCard}
                `}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                      <FaInfoCircle />
                      Alur Penggunaan
                    </p>

                    <h2
                      className={`
                        mt-4 font-black ${theme.sectionTitle}
                        ${isCompact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}
                      `}
                    >
                      Cara menggunakan dokumen
                    </h2>

                    <p
                      className={`
                        mt-2 max-w-2xl leading-relaxed ${theme.sectionDesc}
                        ${isCompact ? "text-xs md:text-sm" : "text-sm md:text-base"}
                      `}
                    >
                      Ikuti langkah berikut agar dokumen yang dibawa sudah
                      lengkap dan siap diverifikasi.
                    </p>
                  </div>

                  <div className="hidden rounded-full bg-gradient-to-r from-emerald-600 to-lime-500 px-5 py-3 text-sm font-black text-white shadow-lg md:block">
                    Validasi Administrasi Pondok
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`
                        group relative overflow-hidden border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl
                        ${isCompact ? "rounded-[22px] p-4" : "rounded-[28px] p-5"}
                        ${theme.processCard}
                      `}
                    >
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-xl">
                            {step.icon}
                          </div>

                          <span
                            className={`
                              text-4xl font-black
                              ${isDark ? "text-white/10" : "text-emerald-100"}
                            `}
                          >
                            0{index + 1}
                          </span>
                        </div>

                        <h3 className={`mt-5 text-lg font-black ${theme.strong}`}>
                          {step.title}
                        </h3>

                        <p
                          className={`
                            mt-2 leading-relaxed ${theme.muted}
                            ${isCompact ? "text-xs" : "text-sm"}
                          `}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SYARAT PENDAFTARAN */}
              <div
                className={`
                  mt-10 overflow-hidden border transition-all duration-300
                  ${isCompact ? "rounded-[28px] p-4 sm:p-5 md:p-6" : "rounded-[38px] p-5 sm:p-7 md:p-8"}
                  ${theme.requirementSection}
                `}
              >
                <div className="relative">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-200/50 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />

                  <div className="relative z-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
                      <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-green-950">
                          <FaListAlt />
                          Syarat Pendaftaran Santri
                        </p>

                        <h2
                          className={`
                            mt-5 font-black leading-tight ${theme.strong}
                            ${isCompact ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}
                          `}
                        >
                          Berkas yang wajib disiapkan
                          <span className="block text-emerald-600">
                            sebelum datang ke pondok
                          </span>
                        </h2>

                        <p
                          className={`
                            mt-4 max-w-3xl leading-relaxed ${theme.muted}
                            ${isCompact ? "text-xs md:text-sm" : "text-sm md:text-base"}
                          `}
                        >
                          Selain mengunduh 2 dokumen pernyataan yang tersedia,
                          calon santri juga wajib menyiapkan berkas berikut
                          untuk proses pendaftaran dan verifikasi administrasi.
                        </p>
                      </div>

                      <div
                        className={`
                          mx-auto flex items-center justify-center rounded-[42px] bg-gradient-to-br from-emerald-700 to-lime-500 text-white shadow-2xl lg:mx-0
                          ${isCompact ? "h-36 w-36 text-6xl" : "h-44 w-44 text-7xl"}
                        `}
                      >
                        <FaClipboardCheck />
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {syaratPendaftaran.map((item, index) => (
                        <div
                          key={index}
                          className={`
                            group relative overflow-hidden border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            ${isCompact ? "rounded-[22px] p-4" : "rounded-[28px] p-5"}
                            ${theme.requirementCard}
                          `}
                        >
                          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-100/80 blur-2xl transition group-hover:bg-yellow-100" />

                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 p-4 text-xl text-white shadow-lg transition group-hover:rotate-6 group-hover:scale-110">
                                {item.icon}
                              </div>

                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                                {item.tag}
                              </span>
                            </div>

                            <h3 className={`mt-5 text-base font-black leading-tight ${theme.strong}`}>
                              {item.title}
                            </h3>

                            <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 rounded-[28px] border border-dashed border-emerald-300 bg-emerald-50 p-5 text-emerald-900 md:p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white">
                          <FaExclamationCircle />
                        </div>

                        <div>
                          <h3 className="text-xl font-black">
                            Catatan penting untuk calon santri
                          </h3>

                          <p className="mt-1 text-sm leading-relaxed text-emerald-800 md:text-base">
                            Semua fotokopi sebaiknya disiapkan dalam map
                            terpisah dan diberi nama calon santri agar proses
                            verifikasi lebih cepat. Jika ada berkas yang belum
                            lengkap, segera hubungi admin pondok.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMPORTANT WARNING */}
              <div
                className={`
                  mt-8 overflow-hidden border transition-all duration-300
                  ${isCompact ? "rounded-[26px] p-4 sm:p-5 md:p-6" : "rounded-[34px] p-5 sm:p-7 md:p-8"}
                  ${theme.warningSection}
                `}
              >
                <div className="grid gap-7 lg:grid-cols-[1fr_180px] lg:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
                      <FaExclamationCircle />
                      Informasi Penting
                    </div>

                    <h2
                      className={`
                        mt-5 font-black leading-tight ${theme.strong}
                        ${isCompact ? "text-xl sm:text-2xl md:text-3xl" : "text-2xl sm:text-3xl md:text-4xl"}
                      `}
                    >
                      Setelah download, dokumen wajib dicetak dan dibawa ke
                      pondok.
                    </h2>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {[
                        "Surat santri wajib ditandatangani",
                        "Surat orang tua wajib ditandatangani wali",
                        "Berkas pendaftaran disusun rapi",
                        "Semua dokumen dibawa saat verifikasi",
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`
                            flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold shadow-sm
                            ${
                              isDark
                                ? "bg-white/10 text-white"
                                : "bg-white/85 text-gray-700"
                            }
                          `}
                        >
                          <FaCheckCircle className="shrink-0 text-emerald-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`
                      mx-auto flex items-center justify-center rounded-[34px] bg-gradient-to-br from-yellow-300 to-orange-400 shadow-2xl lg:mx-0
                      ${isCompact ? "h-28 w-28 text-5xl" : "h-36 w-36 text-6xl"}
                    `}
                  >
                    <FaKaaba className="text-white" />
                  </div>
                </div>
              </div>

              {/* DOCUMENT LIST */}
              <div className="mt-12">
                <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p
                      className={`
                        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ring-1
                        ${theme.docHeaderBadge}
                      `}
                    >
                      <FaBookOpen />
                      Daftar Dokumen
                    </p>

                    <h2
                      className={`
                        mt-4 font-black ${theme.docHeaderTitle}
                        ${isCompact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}
                      `}
                    >
                      Dokumen yang tersedia
                    </h2>

                    <p
                      className={`
                        mt-2 max-w-2xl leading-relaxed ${theme.docHeaderDesc}
                        ${isCompact ? "text-xs md:text-sm" : "text-sm md:text-base"}
                      `}
                    >
                      Jika admin menambahkan dokumen baru di masa depan,
                      dokumen tersebut akan tampil di daftar ini melalui data
                      backend.
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-2xl border px-5 py-4 text-sm font-bold backdrop-blur-xl
                      ${theme.docCounter}
                    `}
                  >
                    {docs.length} file tersedia
                  </div>
                </div>

                {loading ? (
                  <div className="grid gap-7 md:grid-cols-2">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className={`
                          h-[390px] animate-pulse rounded-[34px] shadow-xl
                          ${isDark ? "bg-white/15" : "bg-white/80"}
                        `}
                      />
                    ))}
                  </div>
                ) : docs.length === 0 ? (
                  <div
                    className={`
                      rounded-[34px] border border-dashed p-10 text-center shadow-xl backdrop-blur-xl
                      ${theme.emptyCard}
                    `}
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-300 text-4xl text-green-950">
                      <FaFolderOpen />
                    </div>

                    <h3 className={`mt-5 text-2xl font-black ${theme.strong}`}>
                      Dokumen belum tersedia
                    </h3>

                    <p className={`mt-2 ${theme.muted}`}>
                      Saat admin menambahkan dokumen, file akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-7 lg:grid-cols-2">
                    {docs.map((doc, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-[36px] bg-gradient-to-br from-yellow-300 via-emerald-300 to-green-500 p-[1px] shadow-[0_30px_90px_rgba(0,0,0,0.20)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(250,204,21,0.20)]"
                      >
                        <div
                          className={`
                            relative h-full overflow-hidden rounded-[35px] transition-all duration-300
                            ${isCompact ? "p-4 sm:p-5 md:p-6" : "p-5 sm:p-7 md:p-8"}
                            ${theme.documentCardInner}
                          `}
                        >
                          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-100 blur-3xl transition duration-500 group-hover:bg-yellow-100" />
                          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-green-100 blur-3xl" />

                          <div className="relative z-10">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                              <div
                                className={`
                                  flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px]
                                  bg-gradient-to-br ${doc.color}
                                  text-4xl text-white shadow-2xl
                                  transition-all duration-500 group-hover:rotate-3 group-hover:scale-110
                                `}
                              >
                                <FaFilePdf />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600">
                                  PDF
                                </span>
                                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
                                  Resmi
                                </span>
                              </div>
                            </div>

                            <h3
                              className={`
                                mt-7 font-black leading-tight ${theme.strong}
                                ${isCompact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}
                              `}
                            >
                              {doc.title}
                            </h3>

                            <p
                              className={`
                                mt-4 leading-relaxed md:min-h-[72px]
                                ${theme.documentDesc}
                                ${isCompact ? "text-xs md:text-sm" : "text-sm md:text-base"}
                              `}
                            >
                              {doc.desc}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                <FaShieldAlt />
                                File Resmi Pondok
                              </div>

                              <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700">
                                <FaPrint />
                                Siap Cetak
                              </div>
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                              <a
                                href={doc.file}
                                download
                                className={`
                                  inline-flex flex-1 items-center justify-center gap-3 rounded-2xl
                                  bg-gradient-to-r ${doc.color}
                                  px-6 py-4 text-center font-black text-white
                                  shadow-xl transition-all duration-300
                                  hover:scale-[1.03] hover:shadow-2xl
                                `}
                              >
                                <FaArrowDown />
                                Download
                              </a>

                              <a
                                href={doc.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-white px-6 py-4 font-black text-emerald-700 shadow-sm transition-all duration-300 hover:bg-emerald-50"
                              >
                                <FaExternalLinkAlt />
                                Buka
                              </a>
                            </div>

                            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-800">
                              Pastikan dokumen sudah dicetak dan ditandatangani
                              sebelum diserahkan ke pondok.
                            </div>
                          </div>

                          <div
                            className={`
                              absolute bottom-5 right-5 text-6xl transition-all duration-500 group-hover:scale-125
                              ${isDark ? "text-emerald-900/50" : "text-emerald-50 group-hover:text-emerald-100"}
                            `}
                          >
                            <FaFileDownload />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function HeroStatCard({
  label,
  value,
  desc,
  icon,
  theme,
  isCompact,
  smallValue = false,
}) {
  return (
    <div
      className={`
        group rounded-3xl border p-5 backdrop-blur-xl transition hover:-translate-y-1
        ${theme.glassCard}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm ${theme.glassCardLabel}`}>{label}</p>
        <span className={theme.heroBadgeIcon}>{icon}</span>
      </div>

      <h2
        className={`
          mt-2 font-black ${theme.strong}
          ${
            smallValue
              ? isCompact
                ? "text-base leading-tight"
                : "text-xl leading-tight"
              : isCompact
              ? "text-3xl"
              : "text-4xl"
          }
        `}
      >
        {value}
      </h2>

      <p className={`mt-1 text-xs ${theme.glassCardSub}`}>{desc}</p>
    </div>
  );
}

function ProfileInfoRow({ icon, label, value, theme, small = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${theme.miniProfileRow}`}
    >
      <span className="flex items-center gap-2 text-sm">
        {icon} {label}
      </span>

      <span
        className={`text-right font-black ${small ? "text-sm" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}