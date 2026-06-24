import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";
import { uploadToStorage } from "../helpers/helpers.js";

const router = express.Router();

const cleanText = (value) => String(value || "").trim();

async function verifyAdmin(req, res, next) {
  try {
    const adminUserId = req.headers["x-user-id"];

    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Admin belum terdeteksi.",
      });
    }

    const { data: admin, error } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", adminUserId)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: "User admin tidak ditemukan.",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Hanya admin yang boleh mengelola akun guru.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi admin.",
      error: error.message,
    });
  }
}

router.get("/guru", verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("guru")
      .select(`
        id,
        user_id,
        nama,
        nip,
        nuptk,
        no_hp,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        pendidikan_terakhir,
        status_kepegawaian,
        tanggal_bergabung,
        catatan,
        foto,
        status,
        created_at,
        users:user_id (
          id,
          email,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data guru.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Data guru berhasil diambil.",
      data: data || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.post("/guru", verifyAdmin, upload.single("foto"), async (req, res) => {
  try {
    const body = req.body || {};

    const nama = cleanText(body.nama);
    const email = cleanText(body.email).toLowerCase();
    const tanggalLahir = cleanText(body.tanggal_lahir);

    if (!nama || !email || !tanggalLahir) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan tanggal lahir wajib diisi.",
      });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengecek email guru.",
        error: existingUserError.message,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }

    let fotoUrl = null;

    if (req.file) {
      fotoUrl = await uploadToStorage("foto-guru", req.file, "guru");
    }

    const autoPassword = String(tanggalLahir).replaceAll("-", "");
    const finalPassword = cleanText(body.password) || autoPassword;

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          nama,
          email,
          password: finalPassword,
          role: "guru",
        },
      ])
      .select()
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        message: "Gagal membuat akun user guru.",
        error: userError.message,
      });
    }

    const guruPayload = {
      user_id: newUser.id,
      nama,
      nip: cleanText(body.nip) || null,
      nuptk: cleanText(body.nuptk) || null,
      no_hp: cleanText(body.no_hp) || null,
      alamat: cleanText(body.alamat) || null,
      tempat_lahir: cleanText(body.tempat_lahir) || null,
      tanggal_lahir: tanggalLahir || null,
      jenis_kelamin: cleanText(body.jenis_kelamin) || null,
      pendidikan_terakhir: cleanText(body.pendidikan_terakhir) || null,
      status_kepegawaian: cleanText(body.status_kepegawaian) || null,
      tanggal_bergabung: cleanText(body.tanggal_bergabung) || null,
      catatan: cleanText(body.catatan) || null,
      foto: fotoUrl,
      status: "aktif",
    };

    const { data: newGuru, error: guruError } = await supabase
      .from("guru")
      .insert([guruPayload])
      .select()
      .single();

    if (guruError) {
      await supabase.from("users").delete().eq("id", newUser.id);

      return res.status(500).json({
        success: false,
        message: "User berhasil dibuat, tetapi data guru gagal dibuat.",
        error: guruError.message,
        detail: guruError.details || null,
        hint: guruError.hint || null,
        code: guruError.code || null,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Akun guru berhasil dibuat.",
      data: {
        user: newUser,
        guru: newGuru,
        password: finalPassword,
      },
    });
  } catch (error) {
    console.error("CREATE GURU ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.delete("/guru/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: guru, error: findError } = await supabase
      .from("guru")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (findError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { error: deleteGuruError } = await supabase
      .from("guru")
      .delete()
      .eq("id", id);

    if (deleteGuruError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus data guru.",
        error: deleteGuruError.message,
      });
    }

    if (guru.user_id) {
      await supabase.from("users").delete().eq("id", guru.user_id);
    }

    return res.json({
      success: true,
      message: "Akun guru berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

export default router;