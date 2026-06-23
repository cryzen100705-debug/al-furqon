import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";
import { generatePassword, uploadToStorage } from "../helpers/ownerHelpers.js";

const router = express.Router();

const cleanText = (value) => {
  return String(value || "").trim();
};

const normalizeUpper = (value) => {
  return cleanText(value).toUpperCase();
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

      const fotoFile = req.files?.foto?.[0] || null;
      const buktiFile = req.files?.buktiTransfer?.[0] || null;

      const nama = cleanText(form.nama);
      const email = cleanText(form.email).toLowerCase();
      const tanggalLahir = cleanText(form.tanggalLahir);

      const jenjangNormal = normalizeUpper(form.jenjang);
      const kelasNormal = cleanText(form.kelas);
      const jurusanNormal = normalizeUpper(form.jurusan);
      const metodeNormal = cleanText(form.metode).toLowerCase();

      console.log("REQ BODY PENDAFTARAN:", req.body);
      console.log("DATA NORMAL:", {
        nama,
        email,
        tanggalLahir,
        jenjangNormal,
        kelasNormal,
        jurusanNormal,
        metodeNormal,
        paid: form.paid,
      });

      if (!nama || !email || !tanggalLahir) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan tanggal lahir wajib diisi.",
        });
      }

      if (!jenjangNormal) {
        return res.status(400).json({
          success: false,
          message: "Jenjang wajib dipilih.",
        });
      }

      if (!["SMP", "SMK", "TAKHASSUS"].includes(jenjangNormal)) {
        return res.status(400).json({
          success: false,
          message: "Jenjang tidak valid. Pilih SMP, SMK, atau Takhassus.",
        });
      }

      if (jenjangNormal !== "TAKHASSUS" && !kelasNormal) {
        return res.status(400).json({
          success: false,
          message: "Kelas wajib dipilih untuk jenjang SMP atau SMK.",
        });
      }

      if (jenjangNormal === "SMK" && !jurusanNormal) {
        return res.status(400).json({
          success: false,
          message: "Jurusan SMK wajib dipilih.",
        });
      }

      if (!metodeNormal) {
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
            nama,
            email,
            password: autoPassword,
            role: "santri",
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
          jenjangNormal === "SMP"
            ? "SMP"
            : jenjangNormal === "SMK"
              ? "SMK"
              : "Takhassus",
        kelas: jenjangNormal === "TAKHASSUS" ? "Takhassus" : kelasNormal,
        jurusan: jenjangNormal === "SMK" ? jurusanNormal : null,
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
        .insert([santriPayload])
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
          metode: metodeNormal,
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