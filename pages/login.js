"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  FaClock,
  FaRedo,
  FaTimes,
  FaWhatsapp,
  FaTools,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/* =========================================================
   WHATSAPP ADMIN
   Ganti nomor ini dengan nomor admin asli.
   Format: 62812xxxxxxx, tanpa +, tanpa 0 di depan.
========================================================= */

const ADMIN_WHATSAPP_NUMBER = "628999155698";

const ADMIN_WHATSAPP_MESSAGE =
  "Assalamu'alaikum Admin Pesantren Al-Furqon, saya ingin bertanya mengenai akun login saya.";

const WHATSAPP_ADMIN_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  ADMIN_WHATSAPP_MESSAGE
)}`;

/* =========================================================
   BACKGROUND ISLAMIC
========================================================= */

function IslamicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.07]" />

      <motion.div
        animate={{
          rotate: [0, 18, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-32 top-24 h-72 w-72 rounded-full border border-yellow-300/20 bg-yellow-300/5 sm:h-96 sm:w-96"
      />

      <motion.div
        animate={{
          rotate: [0, -18, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-40 bottom-16 h-80 w-80 rounded-full border border-emerald-300/20 bg-emerald-300/5 sm:h-[34rem] sm:w-[34rem]"
      />

      <motion.div
        animate={{
          y: [0, -24, 0],
          opacity: [0.45, 0.8, 0.45],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          x: [0, 14, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[12%] top-[20%] h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_38px_rgba(250,204,21,0.85)]"
      />

      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] bottom-[22%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_38px_rgba(110,231,183,0.85)]"
      />
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Badge({ children }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300 sm:text-xs">
      <span className="h-2 w-2 rounded-full bg-current" />
      {children}
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 230, damping: 20 }}
      className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-emerald-950">
        {icon}
      </div>

      <h3 className="font-black text-white">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-emerald-100">{desc}</p>
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
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-emerald-100/50 focus:border-yellow-300/60 focus:bg-white/15 focus:ring-4 focus:ring-yellow-300/10"
        />

        {rightElement}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN LOGIN
========================================================= */

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
    setModal({
      show: true,
      type,
      title,
      message,
      icon,
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: "",
      title: "",
      message: "",
      icon: "",
    });
  };

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

      const sessionData = {
        user: result.data.user,
        santri: result.data.santri,
      };

      localStorage.setItem("session", JSON.stringify(sessionData));
      localStorage.setItem("user", JSON.stringify(result.data.user));

      router.push(result.redirectTo);
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
          title: "Data Santri Tidak Ditemukan",
          message:
            error.message ||
            "Data santri belum ditemukan. Silakan hubungi admin pesantren.",
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

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#041b15] text-white">
      <Navbar />

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-santri.jpg"
          alt="Background Login"
          className="h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#041b15]/95 via-[#062d22]/92 to-[#041b15] lg:bg-gradient-to-r" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <IslamicBackground />

      <section className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-7xl items-center gap-8 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-16 lg:pt-32">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <p className="mb-5 text-2xl leading-loose text-yellow-300">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          <Badge>Portal Santri Al-Furqon</Badge>

          <h1 className="mt-6 max-w-5xl text-[clamp(3rem,6vw,6.7rem)] font-black leading-[0.92] tracking-[-0.07em]">
            Masuk ke sistem
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-200 bg-clip-text text-transparent">
              Pesantren.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50">
            Akses dashboard sesuai akun yang telah diverifikasi admin. Gunakan
            email dan password yang diberikan setelah proses pendaftaran santri.
          </p>

          <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
            <InfoCard
              icon={<FaShieldAlt />}
              title="Aman"
              desc="Akun diverifikasi oleh admin pesantren."
            />

            <InfoCard
              icon={<FaUserGraduate />}
              title="Santri"
              desc="Akses informasi santri dan aktivitas pesantren."
            />

            <InfoCard
              icon={<FaMosque />}
              title="Terarah"
              desc="Sistem membantu proses administrasi pesantren."
            />
          </div>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md lg:max-w-lg"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[2.6rem]">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-white/[0.04] px-6 py-7 text-center sm:px-8">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-yellow-300/25 bg-yellow-400/15 shadow-[0_0_45px_rgba(250,204,21,0.25)]"
              >
                <img
                  src="/logo.png"
                  alt="Logo Al-Furqon"
                  className="h-14 w-14 object-contain"
                />
              </motion.div>

              <p className="text-sm leading-loose text-yellow-300">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Login Sistem
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-emerald-100">
                Masuk ke akun Pondok Pesantren Al-Furqon.
              </p>
            </div>

            {/* Form */}
            <div className="relative z-10 space-y-5 px-6 py-7 sm:px-8">
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
                onClick={login}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-yellow-400 px-6 py-4 font-black text-emerald-950 shadow-[0_0_45px_rgba(250,204,21,0.25)] transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />

                <span className="relative z-10">
                  {loading ? "Memproses Login..." : "Masuk Sekarang"}
                </span>

                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="relative z-10"
                  >
                    <FaRedo />
                  </motion.span>
                ) : (
                  <FaArrowRight className="relative z-10 transition group-hover:translate-x-1" />
                )}
              </motion.button>

              <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-emerald-950">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className="font-black text-yellow-300">
                      Pemberitahuan
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-emerald-50">
                      Masukkan email dan password yang diberikan saat
                      pendaftaran. Setelah mendaftar, mohon tunggu maksimal
                      1x24 jam untuk proses verifikasi admin.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                <FaWhatsapp className="text-yellow-300" />
                Hubungi Admin via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MODAL STATUS SANTRI */}
      <AnimatePresence>
        {modal.show && (
          <StatusModal
            modal={modal}
            closeModal={closeModal}
            router={router}
          />
        )}
      </AnimatePresence>

      {/* MODAL MAINTENANCE */}
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
        html,
        body,
        #__next {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
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
      `}</style>
    </main>
  );
}

/* =========================================================
   STATUS MODAL
========================================================= */

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

/* =========================================================
   SERVER MAINTENANCE MODAL
========================================================= */

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
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
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
                  cd backend
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