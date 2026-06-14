"use client";

import { useEffect, useState } from "react";
import SidebarSantri from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";

import {
  FaCog,
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaSave,
  FaHome,
  FaEye,
  FaEyeSlash,
  FaBell,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaQuran,
  FaPalette,
  FaKey,
  FaUserGraduate,
} from "react-icons/fa";

const DEFAULT_SETTINGS = {
  darkMode: true,
  compactMode: false,
  notificationPayment: true,
  notificationSchedule: true,
  notificationAnnouncement: true,
};

export default function PengaturanSantri() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [santri, setSantri] = useState(null);
  const [user, setUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [accountForm, setAccountForm] = useState({
    email: "",
    telepon: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

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

    headerBadge: isDark
      ? "bg-white/10 text-white"
      : "bg-emerald-50 text-emerald-900 border border-emerald-800/10",

    hero: isDark
      ? "border-white/10 bg-[#071B14]/80 text-white shadow-black/30"
      : "border-emerald-800/20 bg-[#FFFDF6] text-[#102A1F] shadow-yellow-950/10",

    heroOverlay: isDark
      ? "bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.92),rgba(7,27,20,0.88),rgba(74,52,16,0.72))]"
      : "bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,248,220,0.92),rgba(236,253,245,0.86))]",

    badge: isDark
      ? "border border-yellow-300/20 bg-yellow-300/10"
      : "border border-emerald-700/15 bg-emerald-50",

    badgeIcon: isDark ? "text-yellow-300" : "text-emerald-700",
    badgeText: isDark ? "text-yellow-100" : "text-emerald-800",

    heroText: isDark ? "text-emerald-50/90" : "text-slate-700",

    profileCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-800/10 bg-white/75 text-slate-900",

    profileOverlay: isDark
      ? "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]"
      : "bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(236,253,245,0.78),rgba(255,248,220,0.74))]",

    body: isDark
      ? "bg-[#0B2A20] shadow-black/20"
      : "bg-[#F8F0D6] shadow-yellow-950/10",

    panel: isDark
      ? "border-white/10 bg-[#102E24] text-white shadow-black/20"
      : "border-[#E5D6AA] bg-gradient-to-br from-white via-[#FFFDF6] to-[#FFF3C4] text-slate-900 shadow-yellow-950/5",

    title: isDark ? "text-white" : "text-[#1F1607]",
    desc: isDark ? "text-emerald-50/75" : "text-slate-600",
    muted: isDark ? "text-emerald-50/70" : "text-slate-500",
    strong: isDark ? "text-white" : "text-[#102A1F]",

    glassCard: isDark
      ? "border-white/10 bg-white/10 text-white"
      : "border-emerald-800/10 bg-white/70 text-slate-900",

    input: isDark
      ? "border-white/10 bg-white/10 text-white placeholder:text-emerald-50/40 focus:border-yellow-400 focus:ring-yellow-400/20"
      : "border-[#D8C287] bg-white text-slate-700 placeholder:text-slate-400 focus:border-yellow-500 focus:ring-yellow-100",

    inputIcon: isDark ? "text-yellow-300" : "text-[#064E3B]",

    toggleItem: isDark
      ? "border-white/10 bg-white/10 hover:bg-white/15"
      : "border-[#E5D6AA] bg-white/75 hover:bg-yellow-50",

    toggleInactiveIcon: isDark
      ? "bg-white/10 text-emerald-50/60"
      : "bg-slate-100 text-slate-500",

    securityCard:
      "bg-gradient-to-br from-[#064E3B] via-[#0B6B4F] to-[#4A3410] text-white shadow-green-950/10",

    toast: isDark
      ? "border-white/10 bg-[#061B14] text-white"
      : "border-emerald-800/10 bg-white text-slate-900",
  };

  useEffect(() => {
    fetchData();
    loadLocalSettings();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadLocalSettings = () => {
    try {
      const saved = localStorage.getItem("santri_settings");

      if (saved) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.log(error.message);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const saveLocalSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("santri_settings", JSON.stringify(newSettings));

    window.dispatchEvent(new Event("santri_settings_updated"));

    showToast("success", "Pengaturan tampilan berhasil disimpan.");
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const session = JSON.parse(localStorage.getItem("session"));

      console.log("SESSION PENGATURAN:", session);
      console.log("USER ID YANG DIKIRIM:", session?.user?.id);

      if (!session?.user?.id) {
        showToast("error", "Session tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/santri/pengaturan?user_id=${session.user.id}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        showToast("error", result.message || "Gagal mengambil data.");
        return;
      }

      setUser(result.data.user);
      setSantri(result.data.santri);

      setAccountForm({
        email: result.data.santri?.email || result.data.user?.email || "",
        telepon: result.data.santri?.telepon || "",
      });
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSave = async (e) => {
    e.preventDefault();

    try {
      setSavingAccount(true);

      const session = JSON.parse(localStorage.getItem("session"));

      if (!session?.user?.id) {
        showToast("error", "Session tidak ditemukan. Silakan login ulang.");
        return;
      }

      if (!accountForm.email.trim()) {
        showToast("error", "Email wajib diisi.");
        return;
      }

      const response = await fetch(`${API_URL}/api/santri/pengaturan/akun`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          email: accountForm.email,
          telepon: accountForm.telepon,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showToast("error", result.message || "Gagal menyimpan akun.");
        return;
      }

      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          email: result.data.user.email,
        },
      };

      localStorage.setItem("session", JSON.stringify(updatedSession));

      setUser(result.data.user);
      setSantri(result.data.santri);

      showToast("success", result.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    try {
      setSavingPassword(true);

      const session = JSON.parse(localStorage.getItem("session"));

      if (!session?.user?.id) {
        showToast("error", "Session tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/santri/pengaturan/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user.id,
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
            confirmPassword: passwordForm.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        showToast("error", result.message || "Gagal mengubah password.");
        return;
      }

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast("success", result.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };

    saveLocalSettings(newSettings);
  };

  const { checking } = useAuthGuard(["santri"]);

  if (checking) {
    return <AuthLoading role="Santri" />;
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
          <div className={`absolute inset-0 ${theme.background}`} />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative z-10">
            <header
              className={`
                sticky top-0 z-30 border-b backdrop-blur-2xl transition-all duration-300
                ${theme.header}
              `}
            >
              <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 shadow-lg md:hidden"
                  >
                    <FaHome />
                  </button>

                  <div className="min-w-0">
                    <h1
                      className={`truncate text-xl font-black md:text-2xl ${theme.headerTitle}`}
                    >
                      Pengaturan Santri
                    </h1>

                    <p
                      className={`mt-1 truncate text-xs font-semibold sm:text-sm ${theme.headerSub}`}
                    >
                      Kelola akun, password, tampilan, dan notifikasi
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    hidden h-11 items-center gap-2 rounded-2xl px-4 text-sm font-black backdrop-blur-xl sm:flex
                    ${theme.headerBadge}
                  `}
                >
                  <FaCog className={isDark ? "text-yellow-300" : "text-emerald-700"} />
                  Setting
                </div>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <section
                className={`
                  relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
                  ${
                    isCompact
                      ? "rounded-[30px] p-4 sm:p-5 lg:p-6"
                      : "rounded-[42px] p-5 sm:p-7 lg:p-9"
                  }
                  ${theme.hero}
                `}
              >
                <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className={`
                        inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-xl
                        ${theme.badge}
                      `}
                    >
                      <FaShieldAlt className={theme.badgeIcon} />

                      <span
                        className={`
                          text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs
                          ${theme.badgeText}
                        `}
                      >
                        Santri Account Center
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.25, duration: 0.7 }}
                      className={`
                        mt-6 font-black leading-[0.92] tracking-[-0.065em]
                        ${theme.strong}
                        ${
                          isCompact
                            ? "text-[clamp(2rem,5vw,4rem)]"
                            : "text-[clamp(2.2rem,6vw,5rem)]"
                        }
                      `}
                    >
                      Atur akun,
                      <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                        jaga keamanan.
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.65 }}
                      className={`
                        mt-5 max-w-3xl leading-relaxed
                        ${theme.heroText}
                        ${
                          isCompact
                            ? "text-xs sm:text-sm"
                            : "text-sm sm:text-base lg:text-lg"
                        }
                      `}
                    >
                      Halaman ini digunakan untuk mengatur akun santri,
                      mengganti password, mengatur tampilan dashboard, dan
                      menentukan notifikasi yang ingin ditampilkan.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.7,
                      type: "spring",
                    }}
                    className="relative mx-auto w-full max-w-md xl:ml-auto"
                  >
                    <div
                      className={`
                        relative overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-300
                        ${isCompact ? "rounded-[28px] p-4" : "rounded-[40px] p-6"}
                        ${theme.profileCard}
                      `}
                    >
                      <div className={`absolute inset-0 ${theme.profileOverlay}`} />

                      <div className="relative z-10 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-yellow-400 text-5xl text-emerald-950 shadow-2xl">
                          <FaUserCircle />
                        </div>

                        <h2
                          className={`
                            mt-6 font-black ${theme.strong}
                            ${isCompact ? "text-xl" : "text-2xl"}
                          `}
                        >
                          {loading ? "Memuat..." : santri?.nama || "Santri"}
                        </h2>

                        <p
                          className={`
                            mt-2 font-semibold ${theme.muted}
                            ${isCompact ? "text-xs" : "text-sm"}
                          `}
                        >
                          {accountForm.email || "-"}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <MiniStatus
                            label="Role"
                            value={user?.role || "Santri"}
                            icon={<FaUserGraduate />}
                            theme={theme}
                            isCompact={isCompact}
                          />

                          <MiniStatus
                            label="Status"
                            value={santri?.status || "Aktif"}
                            icon={<FaCheckCircle />}
                            theme={theme}
                            isCompact={isCompact}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              <section
                className={`
                  mt-7 shadow-2xl transition-all duration-300
                  ${
                    isCompact
                      ? "rounded-[30px] p-3 sm:p-4 lg:p-5"
                      : "rounded-[42px] p-4 sm:p-6 lg:p-7"
                  }
                  ${theme.body}
                `}
              >
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.85fr]">
                  <div className="space-y-5">
                    <SettingPanel
                      title="Pengaturan Akun"
                      desc="Ubah email dan nomor telepon yang digunakan dalam akun santri."
                      icon={<FaEnvelope />}
                      theme={theme}
                      isCompact={isCompact}
                    >
                      <form onSubmit={handleAccountSave} className="space-y-4">
                        <Input
                          label="Email"
                          type="email"
                          value={accountForm.email}
                          onChange={(v) =>
                            setAccountForm({
                              ...accountForm,
                              email: v,
                            })
                          }
                          icon={<FaEnvelope />}
                          theme={theme}
                        />

                        <Input
                          label="Nomor Telepon"
                          value={accountForm.telepon}
                          onChange={(v) =>
                            setAccountForm({
                              ...accountForm,
                              telepon: v,
                            })
                          }
                          icon={<FaUserCircle />}
                          theme={theme}
                        />

                        <button
                          type="submit"
                          disabled={savingAccount}
                          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#064E3B] px-6 font-black text-white shadow-lg transition hover:bg-[#086B4F] disabled:opacity-60 sm:w-auto"
                        >
                          <FaSave />
                          {savingAccount ? "Menyimpan..." : "Simpan Akun"}
                        </button>
                      </form>
                    </SettingPanel>

                    <SettingPanel
                      title="Ubah Password"
                      desc="Gunakan password yang kuat agar akun lebih aman."
                      icon={<FaLock />}
                      theme={theme}
                      isCompact={isCompact}
                    >
                      <form onSubmit={handlePasswordSave} className="space-y-4">
                        <PasswordInput
                          label="Password Lama"
                          value={passwordForm.oldPassword}
                          onChange={(v) =>
                            setPasswordForm({
                              ...passwordForm,
                              oldPassword: v,
                            })
                          }
                          show={showOldPassword}
                          setShow={setShowOldPassword}
                          theme={theme}
                        />

                        <PasswordInput
                          label="Password Baru"
                          value={passwordForm.newPassword}
                          onChange={(v) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: v,
                            })
                          }
                          show={showNewPassword}
                          setShow={setShowNewPassword}
                          theme={theme}
                        />

                        <Input
                          label="Konfirmasi Password Baru"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(v) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: v,
                            })
                          }
                          icon={<FaKey />}
                          theme={theme}
                        />

                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 font-black text-emerald-950 shadow-lg transition hover:bg-yellow-300 disabled:opacity-60 sm:w-auto"
                        >
                          <FaLock />
                          {savingPassword
                            ? "Mengubah Password..."
                            : "Update Password"}
                        </button>
                      </form>
                    </SettingPanel>
                  </div>

                  <div className="space-y-5">
                    <SettingPanel
                      title="Tampilan Dashboard"
                      desc="Atur kenyamanan tampilan sesuai preferensi santri."
                      icon={<FaPalette />}
                      theme={theme}
                      isCompact={isCompact}
                    >
                      <div className="space-y-3">
                        <ToggleItem
                          title="Mode Gelap"
                          desc="Gunakan nuansa gelap dan nyaman untuk mata."
                          icon={<FaMoon />}
                          active={settings.darkMode}
                          onClick={() => toggleSetting("darkMode")}
                          theme={theme}
                        />

                        <ToggleItem
                          title="Mode Ringkas"
                          desc="Tampilan lebih padat untuk perangkat kecil."
                          icon={<FaSun />}
                          active={settings.compactMode}
                          onClick={() => toggleSetting("compactMode")}
                          theme={theme}
                        />
                      </div>
                    </SettingPanel>

                    <div
                      className={`
                        relative overflow-hidden text-white shadow-xl transition-all duration-300
                        ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-6"}
                        ${theme.securityCard}
                      `}
                    >
                      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.075]" />
                      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

                      <div className="relative z-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-emerald-950 shadow-lg">
                          <FaQuran />
                        </div>

                        <p className="mt-5 text-sm font-semibold text-emerald-100">
                          Keamanan Akun
                        </p>

                        <h3
                          className={`
                            mt-2 font-black leading-snug text-white
                            ${isCompact ? "text-xl" : "text-2xl"}
                          `}
                        >
                          Jangan bagikan password kepada orang lain.
                        </h3>

                        <p
                          className={`
                            mt-3 leading-relaxed text-emerald-50/85
                            ${isCompact ? "text-xs" : "text-sm"}
                          `}
                        >
                          Jika lupa password atau akun bermasalah, segera
                          hubungi admin pesantren.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
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
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MiniStatus({ label, value, icon, theme, isCompact }) {
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

      <p className={`font-semibold ${theme.muted} ${isCompact ? "text-xs" : "text-sm"}`}>
        {label}
      </p>

      <h3
        className={`
          mt-1 truncate font-black ${theme.strong}
          ${isCompact ? "text-base" : "text-lg"}
        `}
      >
        {value}
      </h3>
    </div>
  );
}

function SettingPanel({ title, desc, icon, children, theme, isCompact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden border shadow-xl transition-all duration-300
        ${isCompact ? "rounded-[24px] p-4" : "rounded-[34px] p-5 sm:p-6"}
        ${theme.panel}
      `}
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#064E3B] text-xl text-white shadow-lg">
            {icon}
          </div>

          <div>
            <h2
              className={`
                font-black ${theme.title}
                ${isCompact ? "text-lg" : "text-xl"}
              `}
            >
              {title}
            </h2>

            <p
              className={`
                mt-1 leading-relaxed ${theme.desc}
                ${isCompact ? "text-xs" : "text-sm"}
              `}
            >
              {desc}
            </p>
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}

function Input({ label, value, onChange, type = "text", icon, theme }) {
  return (
    <div>
      <label className={`mb-2 block text-xs font-black uppercase tracking-wide ${theme.muted}`}>
        {label}
      </label>

      <div className="relative">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.inputIcon}`}
        >
          {icon}
        </span>

        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`
            h-12 w-full rounded-2xl border px-12 text-sm font-semibold outline-none transition focus:ring-4
            ${theme.input}
          `}
        />
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, setShow, theme }) {
  return (
    <div>
      <label className={`mb-2 block text-xs font-black uppercase tracking-wide ${theme.muted}`}>
        {label}
      </label>

      <div className="relative">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.inputIcon}`}
        >
          <FaLock />
        </span>

        <input
          type={show ? "text" : "password"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`
            h-12 w-full rounded-2xl border px-12 pr-14 text-sm font-semibold outline-none transition focus:ring-4
            ${theme.input}
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme.muted}`}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ title, desc, icon, active, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center justify-between gap-4 rounded-3xl border p-4 text-left shadow-sm transition
        ${theme.toggleItem}
      `}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            active
              ? "bg-[#064E3B] text-white"
              : theme.toggleInactiveIcon
          }`}
        >
          {icon}
        </div>

        <div>
          <h3 className={`font-black ${theme.title}`}>{title}</h3>

          <p className={`mt-1 text-sm leading-relaxed ${theme.muted}`}>
            {desc}
          </p>
        </div>
      </div>

      <div
        className={`relative h-7 w-14 shrink-0 rounded-full transition ${
          active ? "bg-[#064E3B]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
            active ? "left-8" : "left-1"
          }`}
        />
      </div>
    </button>
  );
}

function Toast({ type, message, onClose, theme }) {
  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      className={`
        fixed right-4 top-5 z-[9999] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border p-4 shadow-2xl backdrop-blur-xl
        ${theme.toast}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isSuccess ? "bg-emerald-500" : "bg-red-500"
          } text-white`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`font-black ${theme.strong}`}>
            {isSuccess ? "Berhasil" : "Terjadi Kesalahan"}
          </h3>

          <p className={`mt-1 text-sm leading-relaxed ${theme.muted}`}>
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