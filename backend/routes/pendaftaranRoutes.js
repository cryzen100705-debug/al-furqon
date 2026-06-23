import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";
import { generatePassword, uploadToStorage } from "../helpers/ownerHelpers.js";

const router = express.Router();

const cleanText = (value) => {
  return String(value || "").trim();
};

const normalizeJenjang = (value) => {
  return cleanText(value).toLowerCase();
};

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint pendaftaran aktif. Gunakan method POST untuk submit data.",
  });
});

router.post(
  "/",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "buktiTransfer", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({
          success: false,
          message:
            "Konfigurasi Supabase backend belum lengkap. Cek SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di backend/.env.",
        });
      }

      const form = req.body || {};

      console.log("REQ BODY PENDAFTARAN:", req.body);
      console.log("JENJANG:", form.jenjang);
      console.log("KELAS:", form.kelas);
      console.log("JURUSAN:", form.jurusan);

      const nama = cleanText(form.nama);
      const email = cleanText(form.email).toLowerCase();
      const tanggalLahir = cleanText(form.tanggalLahir);

      const jenjangRaw = cleanText(form.jenjang);
      const jenjangNormal = normalizeJenjang(form.jenjang);

      const kelas = cleanText(form.kelas);
      const jurusan = cleanText(form.jurusan).toUpperCase();
      const metode = cleanText(form.metode);

      const fotoFile = req.files?.foto?.[0] || null;
      const buktiFile = req.files?.buktiTransfer?.[0] || null;

      console.log("DATA PENDAFTARAN MASUK:", {
        nama,
        email,
        jenjang: jenjangRaw,
        kelas,
        jurusan,
        metode,
        paid: form.paid,
      });

      if (!nama || !email || !tanggalLahir) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan tanggal lahir wajib diisi.",
        });
      }

      if (!jenjangRaw) {
        return res.status(400).json({
          success: false,
          message: "Jenjang wajib dipilih.",
        });
      }

      if (!["smp", "smk", "takhassus"].includes(jenjangNormal)) {
        return res.status(400).json({
          success: false,
          message: "Jenjang tidak valid. Pilih SMP, SMK, atau Takhassus.",
        });
      }

      if (jenjangNormal !== "takhassus" && !kelas) {
        return res.status(400).json({
          success: false,
          message: "Kelas wajib dipilih untuk jenjang SMP atau SMK.",
        });
      }

      const jenjangNormal = String(form.jenjang || "").trim().toUpperCase();
      const jurusanNormal = String(form.jurusan || "").trim().toUpperCase();

      if (jenjangNormal === "SMK" && !jurusanNormal) {
        return res.status(400).json({
          success: false,
          message: "Jurusan SMK wajib dipilih.",
        });
      }

      if (!metode) {
        return res.status(400).json({
          success: false,
          message: "Metode pembayaran wajib dipilih.",
        });
      }

      if (form.paid !== "true") {
        return res.status(400).json({
          success: false,
          message: "Pembayaran belum dikonfirmasi.",
        });
      }

      if (!buktiFile) {
        return res.status(400).json({
          success: false,
          message: "Bukti pembayaran wajib diupload.",
        });
      }

      const autoPassword = generatePassword(nama, tanggalLahir);

      let fotoUrl = null;
      let buktiUrl = null;

      if (fotoFile) {
        fotoUrl = await uploadToStorage("foto-santri", fotoFile, "pendaftaran");
      }

      buktiUrl = await uploadToStorage(
        "bukti-transfer",
        buktiFile,
        "pendaftaran"
      );

      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            email,
            password: autoPassword,
            role: "santri",
            nama,
          },
        ])
        .select()
        .single();

      if (userError) {
        return res.status(400).json({
          success: false,
          message: "Gagal membuat user.",
          error: userError.message,
        });
      }

      const santriPayload = {
        user_id: userData.id,
        nama,
        jenjang:
          jenjangNormal === "smp"
            ? "SMP"
            : jenjangNormal === "smk"
              ? "SMK"
              : "Takhassus",
        kelas: jenjangNormal === "takhassus" ? "Takhassus" : kelas,
        jurusan: jenjangNormal === "smk" ? jurusan : null,
        jenis_kelamin: cleanText(form.jenisKelamin),
        nisn: cleanText(form.nisn),
        nik: cleanText(form.nik),
        tempat_lahir: cleanText(form.tempatLahir),
        tanggal_lahir: tanggalLahir,
        agama: cleanText(form.agama),
        alamat: cleanText(form.alamat),
        kota: cleanText(form.kota),
        provinsi: cleanText(form.provinsi),
        kode_pos: cleanText(form.kodePos),
        telepon: cleanText(form.telepon),
        email,
        asal_sekolah: cleanText(form.asalSekolah),
        status: "pending",
        cita_cita: cleanText(form.citaCita),
        hobi: cleanText(form.hobi),
        foto: fotoUrl,
      };

      console.log("PAYLOAD SANTRI KE SUPABASE:", santriPayload);

      const { data: santriData, error: santriError } = await supabase
  .from("santri")
  .insert([
    {
      user_id: userData.id,
      nama: form.nama,
      jenjang: form.jenjang,
      kelas: form.jenjang === "Takhassus" ? "Takhassus" : form.kelas,
      jurusan:
        String(form.jenjang || "").trim().toUpperCase() === "SMK"
          ? String(form.jurusan || "").trim().toUpperCase()
          : null,
      jenis_kelamin: form.jenisKelamin,
      nisn: form.nisn,
      nik: form.nik,
      tempat_lahir: form.tempatLahir,
      tanggal_lahir: form.tanggalLahir,
      agama: form.agama,
      alamat: form.alamat,
      kota: form.kota,
      provinsi: form.provinsi,
      kode_pos: form.kodePos,
      telepon: form.telepon,
      email: form.email,
      asal_sekolah: form.asalSekolah,
      status: "pending",
      cita_cita: form.citaCita,
      hobi: form.hobi,
      foto: fotoUrl,
    },
  ])
  .select()
  .single();

      if (santriError) {
        await supabase.from("users").delete().eq("id", userData.id);

        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan data santri.",
          error: santriError.message,
        });
      }

      const { error: ortuError } = await supabase.from("orang_tua").insert([
        {
          santri_id: santriData.id,
          ayah_nama: cleanText(form.ayahNama),
          ayah_pekerjaan: cleanText(form.ayahPekerjaan),
          ibu_nama: cleanText(form.ibuNama),
          ibu_pekerjaan: cleanText(form.ibuPekerjaan),
        },
      ]);

      if (ortuError) {
        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan data orang tua.",
          error: ortuError.message,
        });
      }

      const { error: bayarError } = await supabase.from("tagihan").insert([
        {
          santri_id: santriData.id,
          nominal: 150000,
          status: "lunas",
          jenis: "pendaftaran",
          metode,
          bukti_transfer: buktiUrl,
          tanggal_bayar: new Date().toISOString(),
          nominal_dibayar: 150000,
        },
      ]);

      if (bayarError) {
        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan data pembayaran.",
          error: bayarError.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Pendaftaran berhasil.",
        data: {
          santri_id: santriData.id,
          user_id: userData.id,
          email,
          password: autoPassword,
          jenjang: santriData.jenjang,
          kelas: santriData.kelas,
          jurusan: santriData.jurusan,
        },
      });
    } catch (error) {
      console.error("PENDAFTARAN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }
);

export default router;