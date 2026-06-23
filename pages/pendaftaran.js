"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const JURUSAN_SMK_OPTIONS = ["TKJ", "RPL", "DKV", "OTKP", "AKL", "BDP"];

export default function PendaftaranWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [paid, setPaid] = useState(false);
  const [status, setStatus] = useState(null);
  const [foto, setFoto] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    jenjang: "",
    kelas: "",
    jurusan: "",
    metode: "",
    jenisKelamin: "",
    nisn: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "",
    alamat: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    telepon: "",
    email: "",
    ayahNama: "",
    ayahPekerjaan: "",
    ibuNama: "",
    ibuPekerjaan: "",
    asalSekolah: "",
    citaCita: "",
    hobi: "",
  });

  const steps = ["Data Santri", "Data Orang Tua", "Pembayaran", "Selesai"];

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    if (name === "jenjang") {
      updated.kelas = value === "Takhassus" ? "Takhassus" : "";
      updated.jurusan = "";
    }

    if (name === "kelas") {
      updated.jurusan = "";
    }

    return updated;
  });
};

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submitData = async () => {
  try {
    if (!API_URL) {
      alert("NEXT_PUBLIC_API_URL belum diatur di .env.local");
      return;
    }

    if (!paid) {
      alert("Klik konfirmasi pembayaran dulu");
      return;
    }

    if (!form.metode) {
      alert("Pilih metode pembayaran dulu");
      return;
    }

    if (form.jenjang === "SMK" && !form.jurusan) {
      alert("Pilih jurusan SMK dulu");
      return;
    }

    if (!buktiTransfer) {
      alert("Upload bukti pembayaran dulu");
      return;
    }

    setLoading(true);

    if (form.jenjang === "SMK" && !form.jurusan) {
  alert("Pilih jurusan SMK dulu");
  return;
}

const payload = new FormData();

Object.entries(form).forEach(([key, value]) => {
  payload.append(key, value || "");
});

// Paksa jurusan ikut terkirim
payload.set("jenjang", form.jenjang || "");
payload.set("kelas", form.kelas || "");
payload.set("jurusan", form.jenjang === "SMK" ? form.jurusan || "" : "");

payload.append("paid", paid ? "true" : "false");

console.log("FORM SEBELUM DIKIRIM:", form);
console.log("FORMDATA JURUSAN:", payload.get("jurusan"));
console.log("FORMDATA JENJANG:", payload.get("jenjang"));
console.log("FORMDATA KELAS:", payload.get("kelas"));

    if (foto) {
      payload.append("foto", foto);
    }

    if (buktiTransfer) {
      payload.append("buktiTransfer", buktiTransfer);
    }

    const response = await fetch(`${API_URL}/api/pendaftaran`, {
      method: "POST",
      body: payload,
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Response bukan JSON:", text);

      throw new Error(
        "Backend tidak mengembalikan JSON. Cek apakah backend Express aktif di http://localhost:5000"
      );
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengirim pendaftaran");
    }

    setStatus(`
Akun berhasil dibuat!

Email: ${result.data.email}
Password: ${result.data.password}
`);

    setStep(4);
  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

console.log("API_URL =", API_URL);

  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-[#eefaf2] via-white to-[#eefaf2] min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-santri.jpg"
            className="w-full h-full object-cover"
            alt="Hero Santri"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-green-950/95 via-green-900/90 to-black/80"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.07]" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-400/10 blur-3xl rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border border-yellow-400/40 bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.25)]">
                <span className="text-5xl text-yellow-300">☪</span>
              </div>
            </div>

            <p className="arabic text-green-200 mb-3 text-lg tracking-widest">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>

            <h1 className="mt-7 text-2xl md:text-2xl font-black text-white leading-tight">
              Form Pendaftaran
              <br />
              <span className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                Pondok Pesantren
              </span>
              <span className="block text-green-200">Al Furqon</span>
            </h1>

            <div className="w-40 h-1 bg-gradient-to-r from-yellow-400 via-white to-green-400 mx-auto rounded-full mt-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-[30px] border border-white/20 bg-white/[0.08] backdrop-blur-3xl shadow-[0_25px_120px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            <div className="relative px-6 md:px-12 py-12 border-b border-white/10 bg-gradient-to-r from-green-950 via-green-900 to-green-950">
              <div className="absolute top-[72px] left-0 w-full h-[3px] bg-white/10"></div>

              <div
                className="absolute top-[72px] left-0 h-[3px] bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-500"
                style={{
                  width: `${((step - 1) / 3) * 100}%`,
                }}
              />

              <div className="relative flex justify-between">
                {steps.map((item, i) => {
                  const active = step === i + 1;
                  const done = step > i + 1;

                  return (
                    <div
                      key={i}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 font-bold text-lg transition-all duration-500 ${
                          active
                            ? "bg-yellow-400 border-white text-black scale-110 shadow-[0_0_35px_rgba(250,204,21,0.45)]"
                            : done
                              ? "bg-green-400 border-white text-black"
                              : "bg-white/10 border-white/20 text-white"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </div>

                      <p className="text-white text-xs md:text-sm mt-4 text-center">
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative p-6 md:p-12 space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                  >
                    <SectionTitle
                      title="Data Santri"
                      subtitle="Lengkapi informasi data pribadi calon santri"
                    />

                    <div className="md:col-span-2 mb-6">
                      <label className="text-sm text-green-100 mb-2 block">
                        Foto Santri
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFoto(e.target.files?.[0] || null)}
                        className="w-full bg-white/10 border border-white/10 text-white rounded-2xl p-4"
                      />
                    </div>

                    <FormGrid>
                      <Input
                        icon="👤"
                        label="Nama Lengkap"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                      />

                      <Select
                        icon="⚧"
                        label="Jenis Kelamin"
                        name="jenisKelamin"
                        value={form.jenisKelamin}
                        onChange={handleChange}
                        options={["Laki-laki", "Perempuan"]}
                      />

                      <div className="md:col-span-2">
                        <label className="text-sm text-green-100 mb-4 block">
                          Jenjang Pendidikan
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {["MTS", "SMK", "Takhassus"].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => {
  setForm((prev) => ({
    ...prev,
    jenjang: item,
    kelas: item === "Takhassus" ? "Takhassus" : "",
    jurusan: "",
  }));
}}
                              className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
                                form.jenjang === item
                                  ? "bg-yellow-400 text-black border-yellow-300 scale-105 shadow-[0_10px_35px_rgba(250,204,21,0.35)]"
                                  : "bg-white/10 border-white/10 text-white hover:bg-white/15 hover:border-green-400/40"
                              }`}
                            >
                              <div className="text-5xl mb-4">
                                {item === "MTS"
                                  ? "📘"
                                  : item === "SMK"
                                    ? "🛠️"
                                    : "🕌"}
                              </div>

                              <h3 className="font-black text-xl">{item}</h3>

                              <p className="text-sm mt-3 opacity-80 leading-relaxed">
                                {item === "MTS" &&
                                  "Program pendidikan tingkat MTS berbasis pesantren."}

                                {item === "SMK" &&
                                  "Program kejuruan dan keterampilan santri modern."}

                                {item === "Takhassus" &&
                                  "Program khusus pendalaman ilmu agama Islam."}
                              </p>
                            </button>
                          ))}
                        </div>

                        {form.jenjang && form.jenjang !== "Takhassus" && (
  <div className="mt-6 space-y-6">
    <div>
      <label className="text-sm text-green-100 mb-4 block">
        Pilih Kelas
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {form.jenjang === "MTS" &&
          ["7", "8", "9"].map((item) => (
            <ClassButton
              key={item}
              label={`Kelas ${item}`}
              active={form.kelas === item}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  kelas: item,
                  jurusan: "",
                }))
              }
            />
          ))}

        {form.jenjang === "SMK" &&
          ["10", "11", "12"].map((item) => (
            <ClassButton
              key={item}
              label={`Kelas ${item}`}
              active={form.kelas === item}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  kelas: item,
                  jurusan: "",
                }))
              }
            />
          ))}
      </div>
    </div>

    {form.jenjang === "SMK" && form.kelas && (
      <div>
        <label className="text-sm text-green-100 mb-4 block">
          Pilih Jurusan SMK
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {JURUSAN_SMK_OPTIONS.map((item) => (
            <ClassButton
              key={item}
              label={item}
              active={form.jurusan === item}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  jurusan: item,
                }))
              }
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-green-100/70">
          Jurusan hanya muncul jika calon santri memilih jenjang SMK.
        </p>
      </div>
    )}
  </div>
)}

{form.jenjang === "Takhassus" && (
  <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">
    <p className="font-semibold">Program Takhassus</p>
    <p className="text-sm mt-1 opacity-90">
      Program Takhassus tidak menggunakan kelas seperti MTS atau SMK.
    </p>
  </div>
)}
                      </div>

                      <Input
                        icon="🪪"
                        label="NISN"
                        name="nisn"
                        value={form.nisn}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🆔"
                        label="NIK"
                        name="nik"
                        value={form.nik}
                        onChange={handleChange}
                      />

                      <Input
                        icon="📍"
                        label="Tempat Lahir"
                        name="tempatLahir"
                        value={form.tempatLahir}
                        onChange={handleChange}
                      />

                      <Input
                        icon="📅"
                        type="date"
                        label="Tanggal Lahir"
                        name="tanggalLahir"
                        value={form.tanggalLahir}
                        onChange={handleChange}
                      />

                      <Input
                        icon="☪"
                        label="Agama"
                        name="agama"
                        value={form.agama}
                        onChange={handleChange}
                      />

                      <Input
                        icon="⭐"
                        label="Hobi"
                        name="hobi"
                        value={form.hobi}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🎯"
                        label="Cita-cita"
                        name="citaCita"
                        value={form.citaCita}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🏫"
                        label="Asal Sekolah"
                        name="asalSekolah"
                        value={form.asalSekolah}
                        onChange={handleChange}
                      />
                    </FormGrid>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                  >
                    <SectionTitle
                      title="Data Orang Tua"
                      subtitle="Lengkapi data wali atau orang tua santri"
                    />

                    <FormGrid>
                      <Input
                        icon="👳"
                        label="Nama Ayah"
                        name="ayahNama"
                        value={form.ayahNama}
                        onChange={handleChange}
                      />

                      <Input
                        icon="💼"
                        label="Pekerjaan Ayah"
                        name="ayahPekerjaan"
                        value={form.ayahPekerjaan}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🧕"
                        label="Nama Ibu"
                        name="ibuNama"
                        value={form.ibuNama}
                        onChange={handleChange}
                      />

                      <Input
                        icon="💼"
                        label="Pekerjaan Ibu"
                        name="ibuPekerjaan"
                        value={form.ibuPekerjaan}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🏠"
                        label="Alamat"
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🏙️"
                        label="Kota"
                        name="kota"
                        value={form.kota}
                        onChange={handleChange}
                      />

                      <Input
                        icon="🌎"
                        label="Provinsi"
                        name="provinsi"
                        value={form.provinsi}
                        onChange={handleChange}
                      />

                      <Input
                        icon="📮"
                        label="Kode Pos"
                        name="kodePos"
                        value={form.kodePos}
                        onChange={handleChange}
                      />

                      <Input
                        icon="📞"
                        label="No HP"
                        name="telepon"
                        value={form.telepon}
                        onChange={handleChange}
                      />

                      <Input
                        icon="✉️"
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </FormGrid>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="relative overflow-hidden rounded-[30px] border border-yellow-400/20 bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-12 text-center space-y-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full"></div>

                      <div className="relative z-10">
                        <div className="text-8xl mb-6">🕌</div>

                        <p className="tracking-[0.4em] text-yellow-300 text-sm">
                          PEMBAYARAN PENDAFTARAN
                        </p>

                        <h2 className="text-6xl font-black text-white mt-5">
                          Rp 150.000
                        </h2>

                        <p className="text-green-100 mt-6 leading-relaxed max-w-xl mx-auto">
                          Silakan lakukan pembayaran biaya registrasi untuk
                          menyelesaikan proses pendaftaran santri baru Pondok
                          Pesantren Al Furqon.
                        </p>

                        <div className="mt-10 grid md:grid-cols-3 gap-5">
                          <PaymentCard
                            active={form.metode === "transfer"}
                            icon="🏦"
                            title="Transfer"
                            desc="Bank Syariah Indonesia"
                            info="1234567890"
                            subInfo="a/n Pondok Pesantren"
                            onClick={() =>
                              setForm({
                                ...form,
                                metode: "transfer",
                              })
                            }
                          />

                          <PaymentCard
                            active={form.metode === "qris"}
                            icon="📱"
                            title="QRIS"
                            desc="Scan QRIS pembayaran pesantren"
                            image="/qris.png"
                            onClick={() => {
                              setForm({
                                ...form,
                                metode: "qris",
                              });
                              setShowPaymentModal(true);
                            }}
                          />

                          <PaymentCard
                            active={form.metode === "ewallet"}
                            icon="💳"
                            title="E-Wallet"
                            desc="Dana / OVO / GoPay"
                            info="08123456789"
                            subInfo="a/n Pondok Pesantren"
                            onClick={() => {
                              setForm({
                                ...form,
                                metode: "ewallet",
                              });
                              setShowPaymentModal(true);
                            }}
                          />
                        </div>

                        <div className="mt-6">
                          <label className="block text-sm text-green-100 mb-3">
                            Upload Bukti Pembayaran
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setBuktiTransfer(e.target.files?.[0] || null)
                            }
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!form.metode) {
                              alert("Pilih metode pembayaran dulu");
                              return;
                            }

                            if (form.jenjang === "SMK" && !form.jurusan) {
  alert("Pilih jurusan SMK dulu");
  return;
}

                            if (!buktiTransfer) {
                              alert("Upload bukti pembayaran dulu");
                              return;
                            }

                            setPaid(true);
                          }}
                          className={`mt-10 px-10 py-4 rounded-2xl font-bold transition-all duration-300 ${
                            paid
                              ? "bg-green-400 text-black scale-105"
                              : "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black hover:scale-105 shadow-[0_15px_40px_rgba(250,204,21,0.4)]"
                          }`}
                        >
                          {paid
                            ? "✔ Pembayaran Berhasil"
                            : "Konfirmasi Pembayaran"}
                        </button>

                        <AnimatePresence>
                          {showPaymentModal && (
                            <PaymentModal
                              metode={form.metode}
                              buktiTransfer={buktiTransfer}
                              setPaid={setPaid}
                              onClose={() => setShowPaymentModal(false)}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-14"
                  >
                    <div className="text-9xl mb-5">✨</div>

                    <h2 className="text-5xl md:text-6xl font-black text-white">
                      Pendaftaran
                      <span className="block text-yellow-400 mt-2">
                        Berhasil
                      </span>
                    </h2>

                    <p className="text-green-100 mt-6 text-lg max-w-2xl mx-auto">
                      Data santri telah berhasil dikirim ke sistem pesantren.
                      Silakan menunggu informasi selanjutnya dari pihak admin.
                    </p>

                    <div className="mt-8 inline-block bg-white/10 border border-white/20 rounded-3xl px-10 py-6">
                      <pre className="text-yellow-300 text-lg whitespace-pre-wrap text-left">
                        {status}
                      </pre>
                    </div>

                    <button
                      onClick={() => router.push("/")}
                      className="mt-10 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(250,204,21,0.35)]"
                    >
                      Kembali ke Beranda
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {step < 4 && (
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={back}
                disabled={step === 1 || loading}
                className="px-7 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-40"
              >
                Kembali
              </button>

              {step < 3 ? (
                <button
                  onClick={next}
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-bold hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(250,204,21,0.35)] disabled:opacity-60"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  onClick={submitData}
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(16,185,129,0.35)] disabled:opacity-60"
                >
                  {loading ? "Mengirim..." : "Submit Pendaftaran"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-10">
      <p className="text-yellow-300 tracking-[0.3em] text-sm mb-2">
        FORMULIR PENDAFTARAN
      </p>

      <h2 className="text-3xl md:text-4xl font-black text-white">{title}</h2>

      <p className="text-green-100 mt-3">{subtitle}</p>
    </div>
  );
}

function Input({ label, name, onChange, type = "text", icon, value }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-green-100 mb-2">{label}</label>

      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 group-focus-within:text-yellow-400 transition">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Masukkan ${label}`}
          className="w-full bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl pl-12 pr-5 py-3 outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 focus:bg-white/15 hover:border-green-400/40"
        />
      </div>
    </div>
  );
}

function Select({ label, name, onChange, options, icon, value }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-green-100 mb-2">{label}</label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 z-10">
          {icon}
        </div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl pl-12 pr-5 py-4 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 hover:border-green-400/40"
        >
          <option value="">Pilih {label}</option>

          {options.map((item, i) => (
            <option key={i} value={item} className="text-black">
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FormGrid({ children }) {
  return <div className="grid md:grid-cols-2 gap-6 mt-6">{children}</div>;
}

function ClassButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-300 font-bold ${
        active
          ? "bg-green-400 text-black border-green-300 scale-105"
          : "bg-white/10 border-white/10 text-white hover:bg-white/15"
      }`}
    >
      {label}
    </button>
  );
}

function PaymentCard({
  active,
  icon,
  title,
  desc,
  info,
  subInfo,
  image,
  onClick,
}) {
  return (
    <div
      className={`rounded-3xl p-6 border cursor-pointer transition-all duration-300 ${
        active
          ? "bg-yellow-400 text-black border-yellow-300 scale-105"
          : "bg-white/10 border-white/10 text-white hover:bg-white/15"
      }`}
      onClick={onClick}
    >
      <div className="text-5xl mb-4">{icon}</div>

      <h3 className="font-black text-xl">{title}</h3>

      <p className="mt-2 text-sm opacity-80">{desc}</p>

      {info && <p className="mt-4 font-bold text-lg">{info}</p>}

      {subInfo && <p className="text-sm mt-1">{subInfo}</p>}

      {image && <img src={image} className="w-32 mx-auto mt-4 rounded-xl" />}
    </div>
  );
}

function PaymentModal({ metode, buktiTransfer, setPaid, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-b from-green-950 to-green-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">
          ✕
        </button>

        <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">
          Detail Pembayaran
        </h2>

        {metode === "transfer" && (
          <div className="space-y-4">
            <PaymentBox title="Bank BSI" number="1234567890" />
            <PaymentBox title="Bank Mandiri" number="9876543210" />
          </div>
        )}

        {metode === "qris" && (
          <div className="text-center">
            <img src="/qris.png" className="w-64 mx-auto rounded-2xl" />

            <p className="mt-5 text-green-100">
              Scan QRIS untuk melakukan pembayaran
            </p>
          </div>
        )}

        {metode === "ewallet" && (
          <div className="space-y-4">
            <PaymentBox title="DANA" number="08123456789" />
            <PaymentBox title="OVO" number="08123456789" />
            <PaymentBox title="GoPay" number="08123456789" />
          </div>
        )}

        <button
          onClick={() => {
            if (!buktiTransfer) {
              alert("Upload bukti pembayaran dulu");
              return;
            }

            setPaid(true);
            onClose();
          }}
          className="mt-8 w-full bg-yellow-400 text-black py-4 rounded-2xl font-bold hover:scale-105 transition"
        >
          Saya Sudah Bayar
        </button>
      </motion.div>
    </motion.div>
  );
}

function PaymentBox({ title, number }) {
  return (
    <div className="bg-white/10 rounded-2xl p-5">
      <p className="text-yellow-300 mb-2">{title}</p>
      <p className="text-3xl font-black">{number}</p>
      <p className="mt-2 text-green-100">a/n Pondok Pesantren</p>
    </div>
  );
}