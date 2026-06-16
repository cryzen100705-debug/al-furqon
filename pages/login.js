import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaMosque,
  FaShieldAlt,
  FaUserGraduate,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaTimes,
  FaWhatsapp,
  FaTools,
  FaUserShield,
  FaChalkboardTeacher,
  FaCrown,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ADMIN_WHATSAPP_NUMBER = "628999155698";
const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai akun login saya.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

const EASE = [0.22, 1, 0.36, 1];

function getRedirectByRole(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "owner") return "/owner/dashboard";
  if (role === "santri") return "/santri/dashboard";
  if (role === "guru") return "/guru/dashboard";
  return "/login";
}

function IslamicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.055]" />

      <motion.div
        animate={{ rotate: [0, 16, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="login-orb-left absolute rounded-full border border-yellow-300/20 bg-yellow-300/5"
      />

      <motion.div
        animate={{ rotate: [0, -16, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="login-orb-right absolute rounded-full border border-emerald-300/20 bg-emerald-300/5"
      />

      <motion.div
        animate={{ y: [0, -16, 0], opacity: [0.35, 0.72, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <motion.span
        animate={{ y: [0, 16, 0], x: [0, 10, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[12%] top-[22%] h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_38px_rgba(250,204,21,0.85)]"
      />

      <motion.span
        animate={{ y: [0, -14, 0], x: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[22%] left-[10%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_38px_rgba(110,231,183,0.85)]"
      />
    </div>
  );
}

function Badge({ children }) {
  return (
    <div className="login-badge inline-flex max-w-full items-center gap-3 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function RolePill({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 230, damping: 22 }}
      className="login-role-pill group rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl"
    >
      <div className="login-role-icon flex shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950 transition group-hover:rotate-3 group-hover:scale-105">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-emerald-100/85">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function FormInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  onKeyDown,
  rightElement,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-emerald-100">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="login-input w-full rounded-2xl border border-white/10 bg-white/10 px-12 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-emerald-100/50 focus:border-yellow-300/60 focus:bg-white/15 focus:ring-4 focus:ring-yellow-300/10"
        />

        {rightElement}
      </div>
    </div>
  );
}

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
    icon: "",
  });

  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openModal = ({ type, title, message, icon }) => {
    setModal({ show: true, type, title, message, icon });
  };

  const closeModal = () => {
    setModal({ show: false, type: "", title: "", message: "", icon: "" });
  };

  const isServerError = (error) => {
    const message = String(error?.message || "");

    return (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("Load failed") ||
      message.includes("fetch") ||
      message.includes("Backend tidak mengembalikan JSON") ||
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
        const error = new Error(result.message || "Terjadi kesalahan login.");
        error.type = result.type || "";
        throw error;
      }

      setServerMaintenance(false);
      setServerMessage("");

      return result;
    } catch (error) {
      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Login belum dapat diproses."
        );
      }

      throw error;
    }
  };

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      openModal({
        type: "warning",
        icon: "⚠️",
        title: "Form Belum Lengkap",
        message: "Email dan password wajib diisi terlebih dahulu.",
      });
      return;
    }

    try {
      setLoading(true);

      const result = await fetchJson(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const user = result?.data?.user;
      const santri = result?.data?.santri || null;
      const guru = result?.data?.guru || null;

      if (!user || !user.role) {
        throw new Error("Response login tidak valid. Data user tidak ditemukan.");
      }

      const sessionData = { user, santri, guru };

      localStorage.setItem("session", JSON.stringify(sessionData));
      localStorage.setItem("user", JSON.stringify(user));

      if (santri) localStorage.setItem("santri", JSON.stringify(santri));
      if (guru) localStorage.setItem("guru", JSON.stringify(guru));

      const redirectTo = result.redirectTo || getRedirectByRole(user.role);

      router.push(redirectTo);
    } catch (error) {
      console.error("LOGIN ERROR:", error.message);

      if (isServerError(error)) {
        showMaintenancePopup(
          "Server backend belum aktif atau sedang maintenance. Login belum dapat diproses."
        );
        return;
      }

      if (error.type === "rejected") {
        openModal({
          type: "rejected",
          icon: "❌",
          title: "Pendaftaran Ditolak",
          message:
            error.message ||
            "Mohon maaf, pendaftaran kamu ditolak oleh admin Pondok Pesantren Al-Furqon.",
        });
        return;
      }

      if (error.type === "pending") {
        openModal({
          type: "pending",
          icon: "⏳",
          title: "Akun Belum Aktif",
          message:
            error.message ||
            "Akun kamu masih dalam proses verifikasi oleh admin Pondok Pesantren Al-Furqon.",
        });
        return;
      }

      if (error.type === "not_found") {
        openModal({
          type: "not_found",
          icon: "⚠️",
          title: "Data Tidak Ditemukan",
          message:
            error.message ||
            "Data akun belum ditemukan. Silakan hubungi admin pesantren.",
        });
        return;
      }

      openModal({
        type: "warning",
        icon: "⚠️",
        title: "Login Gagal",
        message: error.message || "Email atau password tidak sesuai.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const html = document.documentElement;
  const body = document.body;
  const next = document.getElementById("__next");

  const updateViewportHeight = () => {
    html.style.setProperty("--login-vh", `${window.innerHeight}px`);
  };

  const updateNavbarHeight = () => {
    const nav = document.querySelector("nav");
    const navHeight = nav?.getBoundingClientRect?.().height || 88;

    html.style.setProperty("--login-navbar-h", `${Math.ceil(navHeight)}px`);
  };

  html.style.setProperty("overflow-x", "hidden", "important");
  html.style.setProperty("overflow-y", "hidden", "important");
  html.style.setProperty("height", "100%", "important");

  body.style.setProperty("overflow-x", "hidden", "important");
  body.style.setProperty("overflow-y", "hidden", "important");
  body.style.setProperty("height", "100%", "important");

  if (next) {
    next.style.setProperty("overflow", "hidden", "important");
    next.style.setProperty("height", "100%", "important");
  }

  updateViewportHeight();
  updateNavbarHeight();

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          updateViewportHeight();
          updateNavbarHeight();
        })
      : null;

  const nav = document.querySelector("nav");

  if (nav) resizeObserver?.observe(nav);

  window.addEventListener("resize", updateViewportHeight);
  window.addEventListener("resize", updateNavbarHeight);
  window.addEventListener("orientationchange", updateViewportHeight);
  window.addEventListener("orientationchange", updateNavbarHeight);

  return () => {
    resizeObserver?.disconnect();

    window.removeEventListener("resize", updateViewportHeight);
    window.removeEventListener("resize", updateNavbarHeight);
    window.removeEventListener("orientationchange", updateViewportHeight);
    window.removeEventListener("orientationchange", updateNavbarHeight);

    html.style.removeProperty("--login-vh");
    html.style.removeProperty("--login-navbar-h");
    html.style.removeProperty("overflow-x");
    html.style.removeProperty("overflow-y");
    html.style.removeProperty("height");

    body.style.removeProperty("overflow-x");
    body.style.removeProperty("overflow-y");
    body.style.removeProperty("height");

    if (next) {
      next.style.removeProperty("overflow");
      next.style.removeProperty("height");
    }
  };
}, []);

  return (
    <main className="login-page relative overflow-x-hidden bg-[#041b15] text-white">
      <Navbar />

      <div className="absolute inset-0">
        <img
          src="/hero-santri.jpg"
          alt="Background Login"
          className="h-full w-full object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#041b15]/98 via-[#062d22]/94 to-[#041b15] lg:bg-gradient-to-r" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <IslamicBackground />

      <section className="login-shell relative z-10 mx-auto grid w-full items-center">
        <motion.div
          initial={{ opacity: 0, x: -42, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: EASE }}
          className="login-portal-panel hidden lg:block"
        >
          <div className="login-portal-card relative overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.055]" />
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />

            <div className="relative z-10">
              <p className="login-arabic mb-4 leading-loose text-yellow-300">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>

              <Badge>Portal Al-Furqon</Badge>

              <h1 className="login-hero-title mt-5 max-w-5xl font-black leading-[0.92] tracking-[-0.07em]">
                Satu pintu
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
                  untuk semua role.
                </span>
              </h1>

              <p className="login-hero-desc mt-5 max-w-3xl leading-relaxed text-emerald-50">
                Masuk sebagai admin, owner, guru, atau santri. Sistem akan
                membaca role akun dan mengarahkan ke dashboard yang sesuai.
              </p>

              <div className="login-role-grid mt-7 grid gap-3">
                <RolePill
                  icon={<FaUserShield />}
                  title="Admin"
                  desc="Mengelola data pesantren, santri, guru, dan informasi utama."
                />

                <RolePill
                  icon={<FaCrown />}
                  title="Owner"
                  desc="Melihat ringkasan keuangan, aktivitas, dan perkembangan sistem."
                />

                <RolePill
                  icon={<FaChalkboardTeacher />}
                  title="Guru"
                  desc="Mengakses fitur pembelajaran, nilai, dan data santri."
                />

                <RolePill
                  icon={<FaUserGraduate />}
                  title="Santri"
                  desc="Melihat pembayaran, pemberitahuan, dokumen, dan informasi pribadi."
                />
              </div>

              <div className="login-mini-strip mt-6 grid grid-cols-3 gap-3">
                {[
                  ["Aman", "Verifikasi akun"],
                  ["Cepat", "Role otomatis"],
                  ["Terarah", "Dashboard sesuai"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur"
                  >
                    <p className="text-sm font-black text-yellow-300">
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-emerald-100">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="login-card-wrap mx-auto w-full"
        >
          <div className="login-card relative overflow-hidden border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06]" />
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="login-card-top-line absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400" />

            <div className="login-card-head relative z-10 border-b border-white/10 bg-white/[0.04] text-center">
              <motion.div
                animate={{ y: [0, -7, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="login-logo-box mx-auto flex items-center justify-center border border-yellow-300/25 bg-yellow-400/15 shadow-[0_0_45px_rgba(250,204,21,0.22)]"
              >
                <img
                  src="/Logo.png"
                  alt="Logo Al-Furqon"
                  className="login-logo-img object-contain"
                />
              </motion.div>

              <p className="login-card-arabic leading-loose text-yellow-300">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>

              <h2 className="login-card-title mt-2 font-black tracking-[-0.04em] text-white">
                Login Portal
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-emerald-100">
                Masuk menggunakan akun yang sudah diverifikasi admin pesantren.
              </p>
            </div>

            <div className="login-form relative z-10 space-y-4">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email akun"
                icon={<FaEnvelope />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
              />

              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                icon={<FaLock />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/70 transition hover:text-yellow-300"
                    aria-label="Toggle Password"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
              />

              <motion.button
                type="submit"
                onClick={login}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-yellow-400 font-black text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.25)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />

                <span className="relative z-10">
                  {loading ? "Memproses Login..." : "Masuk Sekarang"}
                </span>

                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="relative z-10"
                  >
                    <FaRedo />
                  </motion.span>
                ) : (
                  <FaArrowRight className="relative z-10 transition group-hover:translate-x-1" />
                )}
              </motion.button>

              <div className="login-notice rounded-3xl border border-yellow-300/20 bg-yellow-300/10">
                <div className="flex gap-3">
                  <div className="login-notice-icon mt-0.5 flex shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className="font-black text-yellow-300">Pemberitahuan</p>

                    <p className="mt-1 text-sm leading-relaxed text-emerald-50">
                      Gunakan email dan password yang diberikan oleh admin.
                      Akun guru hanya dapat dibuat oleh admin pesantren.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                <FaWhatsapp className="text-yellow-300" />
                Hubungi Admin via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {modal.show && (
          <StatusModal
            modal={modal}
            closeModal={closeModal}
            router={router}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {serverMaintenance && (
          <ServerMaintenanceModal
            message={serverMessage}
            onRetry={() => {
              setServerMaintenance(false);
              setServerMessage("");
              login();
            }}
            onClose={() => setServerMaintenance(false)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
  :root {
    --login-vh: 100svh;
    --login-navbar-h: 88px;
  }

  html,
  body,
  #__next {
    width: 100%;
    max-width: 100%;
    height: 100% !important;
    max-height: 100% !important;
    overflow: hidden !important;
  }

  body {
    background: #041b15;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  ::selection {
    background: #facc15;
    color: #064e3b;
  }

  .login-page {
    width: 100%;
    height: var(--login-vh);
    max-height: var(--login-vh);
    overflow: hidden !important;

    --login-top: calc(var(--login-navbar-h) + clamp(8px, 1.25svh, 16px));
    --login-bottom: clamp(8px, 1.5svh, 18px);
    --login-content-h: calc(
      var(--login-vh) - var(--login-top) - var(--login-bottom)
    );
  }

  .login-shell {
    width: 100%;
    max-width: min(90vw, 1320px);
    height: var(--login-vh);
    max-height: var(--login-vh);
    padding-top: var(--login-top);
    padding-bottom: var(--login-bottom);
    box-sizing: border-box;
    overflow: hidden;

    grid-template-columns: minmax(0, 1fr) minmax(330px, 0.62fr);
    gap: clamp(1.25rem, 2.4vw, 3rem);
    align-items: center;
  }

  .login-portal-panel,
  .login-card-wrap {
    min-height: 0;
    max-height: var(--login-content-h);
  }

  .login-portal-card {
    height: auto;
    max-height: var(--login-content-h);
    overflow: hidden;
    border-radius: clamp(1.5rem, 2.4vw, 2.2rem);
    padding: clamp(1.15rem, 2.25vw, 2rem);
  }

  .login-card-wrap {
    max-width: clamp(340px, 30vw, 405px);
  }

  .login-card {
    height: auto;
    max-height: var(--login-content-h);
    overflow: hidden;
    border-radius: clamp(1.3rem, 2.4vw, 2rem);
  }

  .login-hero-title {
    font-size: clamp(1.55rem, min(3vw, 4.4svh), 3.3rem);
  }

  .login-hero-desc {
    font-size: clamp(0.82rem, min(1vw, 1.55svh), 0.95rem);
  }

  .login-arabic {
    font-size: clamp(0.9rem, min(1.35vw, 2svh), 1.25rem);
  }

  .login-role-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(0.6rem, 1.2vw, 0.9rem);
  }

  .login-role-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    min-height: clamp(4.2rem, 9svh, 5.3rem);
    padding: clamp(0.65rem, 1.15vw, 0.85rem);
    text-align: center;
  }

  .login-role-pill p {
    display: none;
  }

  .login-role-icon {
    width: clamp(2.1rem, 3.5svh, 2.55rem);
    height: clamp(2.1rem, 3.5svh, 2.55rem);
    font-size: clamp(0.85rem, 1.7svh, 1rem);
  }

  .login-role-pill h3 {
    font-size: clamp(0.78rem, 1.2vw, 0.95rem);
  }

  .login-mini-strip {
    display: none;
  }

  .login-card-head {
    padding: clamp(0.68rem, 1.35svh, 0.95rem)
      clamp(0.9rem, 1.45vw, 1.2rem);
  }

  .login-form {
    padding: clamp(0.75rem, 1.45svh, 1rem)
      clamp(0.9rem, 1.45vw, 1.2rem);
  }

  .login-form.space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: clamp(0.55rem, 1.1svh, 0.78rem);
  }

  .login-logo-box {
    width: clamp(2.75rem, 5svh, 3.45rem);
    height: clamp(2.75rem, 5svh, 3.45rem);
    border-radius: clamp(0.9rem, 1.5vw, 1.2rem);
    margin-bottom: clamp(0.35rem, 0.9svh, 0.6rem);
  }

  .login-logo-img {
    width: clamp(1.85rem, 3.7svh, 2.25rem);
    height: clamp(1.85rem, 3.7svh, 2.25rem);
  }

  .login-card-arabic {
    font-size: clamp(0.68rem, min(0.9vw, 1.25svh), 0.78rem);
  }

  .login-card-title {
    font-size: clamp(1.32rem, min(2.05vw, 2.75svh), 1.9rem);
  }

  .login-input {
    padding-top: clamp(0.58rem, 1.15svh, 0.72rem);
    padding-bottom: clamp(0.58rem, 1.15svh, 0.72rem);
  }

  .login-form button[type="submit"] {
    padding: clamp(0.62rem, 1.25svh, 0.78rem) 1.2rem;
  }

  .login-notice {
    display: none;
  }

  .login-form > a {
    padding: clamp(0.58rem, 1.15svh, 0.72rem) 1rem;
  }

  .login-orb-left {
    left: -8rem;
    top: 7rem;
    width: clamp(13rem, 22vw, 20rem);
    height: clamp(13rem, 22vw, 20rem);
  }

  .login-orb-right {
    right: -9rem;
    bottom: 4rem;
    width: clamp(15rem, 26vw, 28rem);
    height: clamp(15rem, 26vw, 28rem);
  }

  @media (min-width: 1024px) and (max-height: 820px) {
    .login-page {
      --login-top: calc(var(--login-navbar-h) + 5px);
      --login-bottom: 8px;
    }

    .login-shell {
      max-width: min(90vw, 1180px);
      grid-template-columns: minmax(0, 1fr) minmax(315px, 0.6fr);
      gap: 1.15rem;
    }

    .login-portal-card {
      padding: 1rem;
    }

    .login-hero-title {
      font-size: clamp(1.35rem, min(2.65vw, 3.8svh), 2.75rem);
    }

    .login-hero-desc {
      font-size: 0.82rem;
    }

    .login-card-wrap {
      max-width: 375px;
    }

    .login-card-head {
      padding: 0.62rem 0.95rem;
    }

    .login-form {
      padding: 0.68rem 0.95rem;
    }

    .login-card-title {
      font-size: 1.45rem;
    }

    .login-logo-box {
      width: 2.55rem;
      height: 2.55rem;
      margin-bottom: 0.25rem;
    }

    .login-logo-img {
      width: 1.72rem;
      height: 1.72rem;
    }
  }

  @media (min-width: 1024px) and (max-height: 690px) {
    .login-page {
      --login-top: calc(var(--login-navbar-h) + 4px);
      --login-bottom: 6px;
    }

    .login-portal-card {
      padding: 0.8rem;
    }

    .login-arabic,
    .login-card-arabic {
      display: none;
    }

    .login-role-pill {
      min-height: 3.8rem;
      padding: 0.52rem;
    }

    .login-role-icon {
      width: 2rem;
      height: 2rem;
    }

    .login-card-wrap {
      max-width: 350px;
    }

    .login-card-head {
      padding: 0.55rem 0.85rem;
    }

    .login-form {
      padding: 0.6rem 0.85rem;
    }

    .login-card-title {
      font-size: 1.25rem;
    }

    .login-logo-box {
      width: 2.2rem;
      height: 2.2rem;
    }

    .login-logo-img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  @media (max-width: 1023px) {
    .login-page {
      --login-top: calc(var(--login-navbar-h) + 8px);
      --login-bottom: 10px;
    }

    .login-shell {
      max-width: min(91vw, 430px);
      grid-template-columns: 1fr;
      place-items: center;
    }

    .login-card-wrap {
      max-width: min(100%, 390px);
    }
  }

  @media (max-width: 640px) {
    .login-page {
      --login-top: calc(var(--login-navbar-h) + 7px);
      --login-bottom: 8px;
    }

    .login-shell {
      max-width: 89vw;
    }

    .login-card {
      border-radius: 1.25rem;
    }

    .login-card-head {
      padding: 0.68rem 0.82rem;
    }

    .login-form {
      padding: 0.72rem 0.82rem;
    }

    .login-form.space-y-4 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.55rem;
    }

    .login-card-title {
      font-size: clamp(1.22rem, 5.8vw, 1.55rem);
    }

    .login-card-head > p:last-child {
      display: none;
    }

    .login-logo-box {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 0.9rem;
    }

    .login-logo-img {
      width: 1.85rem;
      height: 1.85rem;
    }

    .login-input {
      padding-top: 0.58rem;
      padding-bottom: 0.58rem;
    }
  }

  @media (max-width: 430px) {
    .login-page {
      --login-top: calc(var(--login-navbar-h) + 6px);
      --login-bottom: 6px;
    }

    .login-shell {
      max-width: 88vw;
    }

    .login-card-wrap {
      max-width: 100%;
    }

    .login-card-head {
      padding: 0.62rem 0.74rem;
    }

    .login-form {
      padding: 0.65rem 0.74rem;
    }

    .login-card-title {
      font-size: 1.32rem;
    }

    .login-card-arabic {
      display: none;
    }

    .login-badge {
      font-size: 0.52rem;
      letter-spacing: 0.12em;
    }

    .login-form > a {
      font-size: 0.74rem;
    }
  }

  @media (max-height: 780px) and (max-width: 640px) {
    .login-card-arabic {
      display: none;
    }

    .login-logo-box {
      width: 2.45rem;
      height: 2.45rem;
      margin-bottom: 0.2rem;
    }

    .login-logo-img {
      width: 1.6rem;
      height: 1.6rem;
    }

    .login-card-title {
      font-size: 1.18rem;
    }

    .login-card-head {
      padding-top: 0.48rem;
      padding-bottom: 0.48rem;
    }

    .login-form {
      padding-top: 0.52rem;
      padding-bottom: 0.52rem;
    }
  }
`}</style>
    </main>
  );
}

function StatusModal({ modal, closeModal, router }) {
  const style =
    modal.type === "rejected"
      ? {
          iconBox: "bg-red-500/15 text-red-300 border-red-400/20",
          title: "text-red-200",
          button: "bg-red-500 hover:bg-red-400 text-white",
          note: "bg-red-500/10 border-red-400/20 text-red-100",
        }
      : modal.type === "pending"
      ? {
          iconBox: "bg-yellow-400/15 text-yellow-300 border-yellow-300/20",
          title: "text-yellow-200",
          button: "bg-yellow-400 hover:bg-yellow-300 text-emerald-950",
          note: "bg-yellow-400/10 border-yellow-300/20 text-yellow-100",
        }
      : {
          iconBox: "bg-yellow-400/15 text-yellow-300 border-yellow-300/20",
          title: "text-white",
          button: "bg-yellow-400 hover:bg-yellow-300 text-emerald-950",
          note: "bg-white/10 border-white/10 text-emerald-100",
        };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#041b15] via-[#0b3b2e] to-[#14532d] text-center text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />

        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
        >
          <FaTimes />
        </button>

        <div className="relative z-10 p-7 sm:p-8">
          <div
            className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border text-4xl ${style.iconBox}`}
          >
            {modal.icon}
          </div>

          <h2 className={`text-2xl font-black ${style.title}`}>
            {modal.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-emerald-50">
            {modal.message}
          </p>

          {modal.type === "rejected" && (
            <div
              className={`mt-5 rounded-2xl border p-4 text-left ${style.note}`}
            >
              <p className="text-sm font-black">Catatan:</p>

              <p className="mt-1 text-sm leading-relaxed">
                Jika merasa data sudah benar, silakan hubungi pihak admin
                pesantren untuk menanyakan alasan penolakan.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                closeModal();
                router.push("/login");
              }}
              className={`rounded-2xl px-6 py-3 font-black transition ${style.button}`}
            >
              Mengerti
            </button>

            <a
              href={WHATSAPP_ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
            >
              <FaWhatsapp className="text-yellow-300" />
              Admin
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ServerMaintenanceModal({ message, onRetry, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.86, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.86, y: 25 }}
        transition={{ duration: 0.28 }}
        className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#041b15] via-[#0b3b2e] to-[#14532d] text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
        >
          <FaTimes />
        </button>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-yellow-300/30 bg-yellow-400/15 shadow-xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-green-950"
            >
              <FaTools />
              <span className="absolute inset-0 rounded-full border-4 border-yellow-200/50 animate-ping" />
            </motion.div>
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
                "Backend belum aktif. Login belum dapat diproses untuk sementara waktu."}
            </p>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                <FaExclamationTriangle />
              </div>

              <div>
                <h3 className="font-black text-white">
                  Cara mengaktifkan kembali
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-green-50/80">
                  Buka terminal backend, lalu jalankan:
                </p>

                <div className="mt-3 rounded-2xl bg-black/30 px-4 py-3 font-mono text-sm text-yellow-200">
                  cd C:\Projects\al-furqon\backend
                  <br />
                  npm run dev
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

          <p className="mt-5 text-center text-xs text-green-100/70">
            Pastikan backend berjalan di{" "}
            <span className="font-bold text-yellow-300">
              http://localhost:5000
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}