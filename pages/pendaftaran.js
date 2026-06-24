"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const JURUSAN_SMK_OPTIONS = ["TKJ", "RPL", "DKV", "OTKP", "AKL", "BDP"];

const STEPS = [
  { id: 1, title: "Santri", desc: "Data calon santri", icon: "👨‍🎓" },
  { id: 2, title: "Orang Tua", desc: "Data keluarga", icon: "👨‍👩‍👧" },
  { id: 3, title: "Pembayaran", desc: "Konfirmasi biaya", icon: "💳" },
  { id: 4, title: "Selesai", desc: "Akun berhasil", icon: "✅" },
];

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

  const progress = Math.round((step / STEPS.length) * 100);

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

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const validateStep1 = () => {
    if (!form.nama.trim()) {
      alert("Nama lengkap wajib diisi");
      return false;
    }

    if (!form.jenisKelamin) {
      alert("Jenis kelamin wajib dipilih");
      return false;
    }

    if (!form.jenjang) {
      alert("Jenjang pendidikan wajib dipilih");
      return false;
    }

    if (form.jenjang !== "Takhassus" && !form.kelas) {
      alert("Kelas wajib dipilih");
      return false;
    }

    if (form.jenjang === "SMK" && !form.jurusan) {
      alert("Jurusan SMK wajib dipilih");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!form.ayahNama.trim()) {
      alert("Nama ayah wajib diisi");
      return false;
    }

    if (!form.ibuNama.trim()) {
      alert("Nama ibu wajib diisi");
      return false;
    }

    if (!form.telepon.trim()) {
      alert("Nomor HP wajib diisi");
      return false;
    }

    if (!form.email.trim()) {
      alert("Email wajib diisi");
      return false;
    }

    return true;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    setStep((prev) => Math.min(prev + 1, 4));
    setTimeout(scrollTop, 80);
  };

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setTimeout(scrollTop, 80);
  };

  const selectJenjang = (item) => {
    setForm((prev) => ({
      ...prev,
      jenjang: item,
      kelas: item === "Takhassus" ? "Takhassus" : "",
      jurusan: "",
    }));
  };

  const selectKelas = (item) => {
    setForm((prev) => ({
      ...prev,
      kelas: item,
      jurusan: "",
    }));
  };

  const selectJurusan = (item) => {
    setForm((prev) => ({
      ...prev,
      jurusan: item,
    }));
  };

  const selectMetode = (metode) => {
    setPaid(false);
    setForm((prev) => ({
      ...prev,
      metode,
    }));
  };

  const submitData = async () => {
    try {
      if (!API_URL) {
        alert("NEXT_PUBLIC_API_URL belum diatur di .env.local");
        return;
      }

      if (!form.metode) {
        alert("Pilih metode pembayaran dulu");
        return;
      }

      if (!buktiTransfer) {
        alert("Upload bukti pembayaran dulu");
        return;
      }

      if (!paid) {
        alert("Klik konfirmasi pembayaran dulu");
        return;
      }

      if (form.jenjang === "SMK" && !form.jurusan) {
        alert("Pilih jurusan SMK dulu");
        return;
      }

      setLoading(true);

      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value || "");
      });

      payload.set("jenjang", form.jenjang || "");
      payload.set("kelas", form.kelas || "");
      payload.set("jurusan", form.jenjang === "SMK" ? form.jurusan || "" : "");
      payload.append("paid", paid ? "true" : "false");

      if (foto) payload.append("foto", foto);
      if (buktiTransfer) payload.append("buktiTransfer", buktiTransfer);

      const response = await fetch(`${API_URL}/api/pendaftaran`, {
        method: "POST",
        body: payload,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response bukan JSON:", text);
        throw new Error("Backend tidak mengembalikan JSON. Cek backend Express.");
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
      setTimeout(scrollTop, 80);
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#031711] text-slate-900">
      <Navbar />

      <main className="relative min-h-screen pt-[170px] sm:pt-[175px] lg:pt-[175px]">
        <BackgroundDecor />

        <section className="relative z-10 px-3 pb-10 sm:px-5 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px] space-y-5">
  <HeroPanel step={step} progress={progress} paid={paid} form={form} />

  <section className="overflow-hidden rounded-[28px] border border-white/15 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <StepBar step={step} />

              <div className="p-4 sm:p-5 md:p-7 lg:p-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <StepMotion keyName="step1">
                      <SectionTitle
                        eyebrow="Langkah 01"
                        title="Data Calon Santri"
                        subtitle="Lengkapi data utama santri sebelum melanjutkan ke data orang tua."
                      />

                      <UploadBox
                        label="Foto Santri"
                        helper="Gunakan foto yang jelas. Format gambar: JPG, PNG, atau WEBP."
                        file={foto}
                        onChange={(e) => setFoto(e.target.files?.[0] || null)}
                      />

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
                          <LabelText>Jenjang Pendidikan</LabelText>

                          <div className="grid gap-3 sm:grid-cols-3">
                            {["MTS", "SMK", "Takhassus"].map((item) => (
                              <ProgramCard
                                key={item}
                                title={item}
                                active={form.jenjang === item}
                                icon={
                                  item === "MTS"
                                    ? "📘"
                                    : item === "SMK"
                                      ? "🛠️"
                                      : "🕌"
                                }
                                desc={
                                  item === "MTS"
                                    ? "Pendidikan formal tingkat MTS."
                                    : item === "SMK"
                                      ? "Program kejuruan santri."
                                      : "Pendalaman ilmu agama."
                                }
                                onClick={() => selectJenjang(item)}
                              />
                            ))}
                          </div>

                          {form.jenjang && form.jenjang !== "Takhassus" && (
                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                              <OptionPanel title="Pilih Kelas">
                                <div className="grid grid-cols-3 gap-2">
                                  {form.jenjang === "MTS" &&
                                    ["7", "8", "9"].map((item) => (
                                      <OptionButton
                                        key={item}
                                        label={`Kelas ${item}`}
                                        active={form.kelas === item}
                                        onClick={() => selectKelas(item)}
                                      />
                                    ))}

                                  {form.jenjang === "SMK" &&
                                    ["10", "11", "12"].map((item) => (
                                      <OptionButton
                                        key={item}
                                        label={`Kelas ${item}`}
                                        active={form.kelas === item}
                                        onClick={() => selectKelas(item)}
                                      />
                                    ))}
                                </div>
                              </OptionPanel>

                              {form.jenjang === "SMK" && form.kelas && (
                                <OptionPanel title="Pilih Jurusan SMK">
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {JURUSAN_SMK_OPTIONS.map((item) => (
                                      <OptionButton
                                        key={item}
                                        label={item}
                                        active={form.jurusan === item}
                                        onClick={() => selectJurusan(item)}
                                      />
                                    ))}
                                  </div>
                                </OptionPanel>
                              )}
                            </div>
                          )}

                          {form.jenjang === "Takhassus" && (
                            <InfoBox
                              title="Program Takhassus"
                              desc="Program Takhassus tidak menggunakan pilihan kelas seperti MTS atau SMK."
                            />
                          )}
                        </div>

                        <Input icon="🪪" label="NISN" name="nisn" value={form.nisn} onChange={handleChange} />
                        <Input icon="🆔" label="NIK" name="nik" value={form.nik} onChange={handleChange} />
                        <Input icon="📍" label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={handleChange} />
                        <Input icon="📅" type="date" label="Tanggal Lahir" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} />
                        <Input icon="☪" label="Agama" name="agama" value={form.agama} onChange={handleChange} />
                        <Input icon="⭐" label="Hobi" name="hobi" value={form.hobi} onChange={handleChange} />
                        <Input icon="🎯" label="Cita-cita" name="citaCita" value={form.citaCita} onChange={handleChange} />
                        <Input icon="🏫" label="Asal Sekolah" name="asalSekolah" value={form.asalSekolah} onChange={handleChange} />
                      </FormGrid>
                    </StepMotion>
                  )}

                  {step === 2 && (
                    <StepMotion keyName="step2">
                      <SectionTitle
                        eyebrow="Langkah 02"
                        title="Data Orang Tua"
                        subtitle="Masukkan data keluarga dan kontak yang aktif agar admin mudah melakukan verifikasi."
                      />

                      <FormGrid>
                        <Input icon="👳" label="Nama Ayah" name="ayahNama" value={form.ayahNama} onChange={handleChange} />
                        <Input icon="💼" label="Pekerjaan Ayah" name="ayahPekerjaan" value={form.ayahPekerjaan} onChange={handleChange} />
                        <Input icon="🧕" label="Nama Ibu" name="ibuNama" value={form.ibuNama} onChange={handleChange} />
                        <Input icon="💼" label="Pekerjaan Ibu" name="ibuPekerjaan" value={form.ibuPekerjaan} onChange={handleChange} />
                        <Input icon="🏠" label="Alamat" name="alamat" value={form.alamat} onChange={handleChange} />
                        <Input icon="🏙️" label="Kota" name="kota" value={form.kota} onChange={handleChange} />
                        <Input icon="🌎" label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} />
                        <Input icon="📮" label="Kode Pos" name="kodePos" value={form.kodePos} onChange={handleChange} />
                        <Input icon="📞" label="No HP" name="telepon" value={form.telepon} onChange={handleChange} />
                        <Input icon="✉️" label="Email" name="email" value={form.email} onChange={handleChange} />
                      </FormGrid>
                    </StepMotion>
                  )}

                  {step === 3 && (
                    <StepMotion keyName="step3">
                      <SectionTitle
                        eyebrow="Langkah 03"
                        title="Pembayaran Pendaftaran"
                        subtitle="Pilih metode pembayaran, upload bukti, lalu konfirmasi pembayaran."
                      />

                      <div className="grid gap-4 xl:grid-cols-[330px_1fr]">
                        <PaymentSummary paid={paid} />

                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <PaymentCard
                              active={form.metode === "transfer"}
                              icon="🏦"
                              title="Transfer"
                              desc="Bank Syariah Indonesia"
                              info="1234567890"
                              subInfo="a/n Pondok Pesantren"
                              onClick={() => selectMetode("transfer")}
                            />

                            <PaymentCard
                              active={form.metode === "qris"}
                              icon="📱"
                              title="QRIS"
                              desc="Scan QRIS pembayaran"
                              image="/qris.png"
                              onClick={() => {
                                selectMetode("qris");
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
                                selectMetode("ewallet");
                                setShowPaymentModal(true);
                              }}
                            />
                          </div>

                          <UploadBox
                            label="Upload Bukti Pembayaran"
                            helper="Upload bukti dalam bentuk gambar agar admin dapat melakukan pengecekan."
                            file={buktiTransfer}
                            onChange={(e) => {
                              setPaid(false);
                              setBuktiTransfer(e.target.files?.[0] || null);
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              if (!form.metode) {
                                alert("Pilih metode pembayaran dulu");
                                return;
                              }

                              if (!buktiTransfer) {
                                alert("Upload bukti pembayaran dulu");
                                return;
                              }

                              setPaid(true);
                            }}
                            className={`w-full rounded-2xl px-5 py-3.5 text-sm font-black shadow-sm transition active:scale-[0.99] ${
                              paid
                                ? "bg-green-700 text-white hover:bg-green-800"
                                : "bg-yellow-400 text-green-950 hover:bg-yellow-300"
                            }`}
                          >
                            {paid ? "✔ Pembayaran Sudah Dikonfirmasi" : "Konfirmasi Pembayaran"}
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
                    </StepMotion>
                  )}

                  {step === 4 && (
                    <StepMotion keyName="step4">
                      <SuccessBox status={status} router={router} />
                    </StepMotion>
                  )}
                </AnimatePresence>

                {step < 4 && (
                  <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={back}
                      disabled={step === 1 || loading}
                      className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Kembali
                    </button>

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={next}
                        disabled={loading}
                        className="rounded-full bg-green-900 px-8 py-3 text-sm font-black text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:opacity-60 active:scale-[0.98]"
                      >
                        Lanjut
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitData}
                        disabled={loading}
                        className="rounded-full bg-green-900 px-8 py-3 text-sm font-black text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:opacity-60 active:scale-[0.98]"
                      >
                        {loading ? "Mengirim..." : "Submit Pendaftaran"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#031711_0%,#064e3b_48%,#02110c_100%)]" />
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-400/25 blur-[90px]" />
      <div className="absolute right-[-120px] top-[250px] h-96 w-96 rounded-full bg-yellow-300/20 blur-[120px]" />
      <div className="absolute bottom-[-160px] left-1/3 h-[460px] w-[460px] rounded-full bg-green-500/15 blur-[140px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:26px_26px]" />
    </div>
  );
}

function HeroPanel({ step, progress, paid, form }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/10 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="relative p-4 sm:p-5 lg:p-6">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="mt-5 relative grid gap-5 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mt-10 mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-yellow-200">
                Pendaftaran Santri Baru
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-[42px]">
              Daftar Santri
              <span className="block text-yellow-300">Al Furqon</span>
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
              Isi formulir dengan benar. Data akan dikirim ke admin pesantren untuk proses verifikasi.
            </p>

            <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/75">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-yellow-300 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-sm font-black text-white">
                Langkah {step} dari 4
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <SideMini title="Jenjang" value={form.jenjang || "-"} icon="🎓" />
              <SideMini title="Kelas" value={form.kelas || "-"} icon="🏫" />
              <SideMini title="Jurusan" value={form.jurusan || "-"} icon="🛠️" />
              <SideMini title="Status" value={paid ? "Paid" : "Belum"} icon="✅" />
            </div>

            <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-200">
                Biaya Registrasi
              </p>

              <p className="mt-1 text-2xl font-black text-yellow-300">
                Rp 150.000
              </p>

              <p className="mt-1 text-xs leading-relaxed text-white/70">
                Upload bukti pembayaran dengan jelas agar mudah diverifikasi admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideMini({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <div className="text-base">{icon}</div>
      <p className="mt-1 text-[10px] text-white/60">{title}</p>
      <p className="truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}

function StepBar({ step }) {
  return (
    <div className="border-b border-slate-100 bg-white/95 p-3 sm:p-4 md:p-5">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {STEPS.map((item) => {
          const active = step === item.id;
          const done = step > item.id;

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border p-3 transition ${
                active
                  ? "border-yellow-400 bg-yellow-50 shadow-[0_12px_28px_rgba(250,204,21,0.18)]"
                  : done
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`absolute bottom-0 left-0 h-1 transition-all ${
                  active || done ? "w-full bg-green-700" : "w-0 bg-slate-300"
                }`}
              />

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    active
                      ? "bg-yellow-400 text-green-950"
                      : done
                        ? "bg-green-700 text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {done ? "✓" : item.icon}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepMotion({ children, keyName }) {
  return (
    <motion.div
      key={keyName}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-green-700">
        {eyebrow}
      </p>

      <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
        {title}
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function LabelText({ children }) {
  return (
    <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-600">
      {children}
    </label>
  );
}

function UploadBox({ label, helper, onChange, file }) {
  return (
    <div className="mb-4 rounded-3xl border border-dashed border-green-300 bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <LabelText>{label}</LabelText>
          <p className="text-xs leading-relaxed text-slate-500">{helper}</p>
        </div>

        {file && (
          <span className="max-w-full truncate rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-800 sm:max-w-[240px]">
            {file.name}
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="mt-3 w-full rounded-2xl border border-green-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-green-800 file:px-3 file:py-2 file:text-xs file:font-black file:text-white hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}

function FormGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Input({ label, name, onChange, type = "text", icon, value }) {
  return (
    <div>
      <LabelText>{label}</LabelText>

      <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-green-300 focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[15px]">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Masukkan ${label}`}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function Select({ label, name, onChange, options, icon, value }) {
  return (
    <div>
      <LabelText>{label}</LabelText>

      <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-green-300 focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[15px]">
          {icon}
        </span>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none"
        >
          <option value="">Pilih {label}</option>

          {options.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProgramCard({ title, desc, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
        active
          ? "border-yellow-400 bg-yellow-50 shadow-[0_14px_30px_rgba(250,204,21,0.2)]"
          : "border-slate-200 bg-white hover:border-green-400 hover:bg-green-50 hover:shadow-md"
      }`}
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition ${
          active ? "bg-yellow-400" : "bg-green-100 group-hover:bg-green-200"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
    </button>
  );
}

function OptionPanel({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <LabelText>{title}</LabelText>
      {children}
    </div>
  );
}

function OptionButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-xs font-black transition active:scale-[0.98] ${
        active
          ? "border-green-700 bg-green-700 text-green-400 shadow-md shadow-green-700/20 "
          : "border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:bg-green-50"
      }`}
    >
      {label}
    </button>
  );
}

function InfoBox({ title, desc }) {
  return (
    <div className="mt-4 rounded-3xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-900 shadow-sm">
      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function PaymentSummary({ paid }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-green-950 via-green-900 to-emerald-700 p-5 text-white shadow-[0_20px_50px_rgba(6,78,59,0.32)] sm:p-6">
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-3xl shadow-lg">
          🧾
        </div>

        <p className="text-xs font-black tracking-[0.22em] text-yellow-300">
          BIAYA REGISTRASI
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">Rp 150.000</h2>

        <p className="mt-3 text-sm leading-relaxed text-green-50/85">
          Pembayaran digunakan untuk menyelesaikan proses pendaftaran santri baru.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs text-green-100/75">Status Pembayaran</p>
          <p className={`mt-1 text-sm font-black ${paid ? "text-yellow-300" : "text-white"}`}>
            {paid ? "Sudah dikonfirmasi" : "Menunggu konfirmasi"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentCard({ active, icon, title, desc, info, subInfo, image, onClick }) {
  return (
    <button
      type="button"
      className={`rounded-3xl border p-4 text-left transition active:scale-[0.99] ${
        active
          ? "border-yellow-400 bg-yellow-50 shadow-[0_14px_30px_rgba(250,204,21,0.2)]"
          : "border-slate-200 bg-white hover:border-green-400 hover:bg-green-50 hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
        {icon}
      </div>

      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>

      {info && <p className="mt-2 text-sm font-black text-green-900">{info}</p>}
      {subInfo && <p className="mt-0.5 text-[11px] text-slate-500">{subInfo}</p>}

      {image && <img src={image} className="mx-auto mt-2 w-16 rounded-lg" alt={title} />}
    </button>
  );
}

function PaymentModal({ metode, buktiTransfer, setPaid, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-700 transition hover:bg-slate-200"
        >
          ✕
        </button>

        <h2 className="mb-5 pr-10 text-center text-2xl font-black text-green-900">
          Detail Pembayaran
        </h2>

        {metode === "transfer" && (
          <div className="space-y-3">
            <PaymentBox title="Bank BSI" number="1234567890" />
            <PaymentBox title="Bank Mandiri" number="9876543210" />
          </div>
        )}

        {metode === "qris" && (
          <div className="text-center">
            <img
              src="/qris.png"
              className="mx-auto w-52 rounded-2xl border border-slate-200 shadow-sm"
              alt="QRIS Pembayaran"
            />

            <p className="mt-4 text-sm text-slate-600">
              Scan QRIS untuk melakukan pembayaran.
            </p>
          </div>
        )}

        {metode === "ewallet" && (
          <div className="space-y-3">
            <PaymentBox title="DANA" number="08123456789" />
            <PaymentBox title="OVO" number="08123456789" />
            <PaymentBox title="GoPay" number="08123456789" />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (!buktiTransfer) {
              alert("Upload bukti pembayaran dulu");
              return;
            }

            setPaid(true);
            onClose();
          }}
          className="mt-6 w-full rounded-2xl bg-yellow-400 py-3 text-sm font-black text-green-950 shadow-md shadow-yellow-400/20 transition hover:bg-yellow-300 active:scale-[0.98]"
        >
          Saya Sudah Bayar
        </button>
      </motion.div>
    </motion.div>
  );
}

function PaymentBox({ title, number }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
      <p className="text-xs font-bold text-green-700">{title}</p>
      <p className="mt-1 text-2xl font-black text-green-950">{number}</p>
      <p className="mt-1 text-xs text-slate-600">a/n Pondok Pesantren</p>
    </div>
  );
}

function SuccessBox({ status, router }) {
  return (
    <div className="flex min-h-[430px] items-center justify-center text-center">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-6xl shadow-inner">
          ✨
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-green-700">
          Pendaftaran Berhasil
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
          Akun Santri Berhasil Dibuat
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Simpan email dan password berikut untuk login ke dashboard santri.
        </p>

        <div className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-4 text-left shadow-sm">
          <pre className="whitespace-pre-wrap text-sm font-semibold leading-relaxed text-green-950">
            {status}
          </pre>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 rounded-full bg-green-900 px-7 py-3 text-sm font-black text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 active:scale-[0.98]"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}