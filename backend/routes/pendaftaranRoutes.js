import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";
import { generatePassword, uploadToStorage } from "../helpers/ownerHelpers.js";

const router = express.Router();

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

      const form = req.body;

      const fotoFile = req.files?.foto?.[0] || null;
      const buktiFile = req.files?.buktiTransfer?.[0] || null;

      if (!form.nama || !form.email || !form.tanggalLahir) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan tanggal lahir wajib diisi.",
        });
      }

      if (!form.jenjang) {
        return res.status(400).json({
          success: false,
          message: "Jenjang wajib dipilih.",
        });
      }

      if (form.jenjang !== "Takhassus" && !form.kelas) {
        return res.status(400).json({
          success: false,
          message: "Kelas wajib dipilih untuk jenjang SMP atau SMK.",
        });
      }

      if (!form.metode) {
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

      const autoPassword = generatePassword(form.nama, form.tanggalLahir);

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
            email: form.email,
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

      const { data: santriData, error: santriError } = await supabase
        .from("santri")
        .insert([
          {
            user_id: userData.id,
            nama: form.nama,
            jenjang: form.jenjang,
            kelas: form.jenjang === "Takhassus" ? "Takhassus" : form.kelas,
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
        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan data santri.",
          error: santriError.message,
        });
      }

      const { error: ortuError } = await supabase.from("orang_tua").insert([
        {
          santri_id: santriData.id,
          ayah_nama: form.ayahNama,
          ayah_pekerjaan: form.ayahPekerjaan,
          ibu_nama: form.ibuNama,
          ibu_pekerjaan: form.ibuPekerjaan,
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
          metode: form.metode,
          bukti_transfer: buktiUrl,
          tanggal_bayar: new Date().toISOString(),
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
          email: form.email,
          password: autoPassword,
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