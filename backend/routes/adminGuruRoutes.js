import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

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
  mapel,
  no_hp,
  alamat,
  tempat_lahir,
  tanggal_lahir,
  jenis_kelamin,
  pendidikan_terakhir,
  status_kepegawaian,
  tanggal_bergabung,
  wali_kelas,
  catatan,
  foto,
  status,
  created_at,
  users (
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
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.post("/guru", verifyAdmin, async (req, res) => {
  try {
    const {
  nama,
  email,
  password,
  nip,
  nuptk,
  mapel,
  no_hp,
  alamat,
  tempat_lahir,
  tanggal_lahir,
  jenis_kelamin,
  pendidikan_terakhir,
  status_kepegawaian,
  tanggal_bergabung,
  wali_kelas,
  catatan,
} = req.body;

    if (!nama || !email || !tanggal_lahir) {
  return res.status(400).json({
    success: false,
    message: "Nama, email, dan tanggal lahir wajib diisi.",
  });
}

const autoPassword = String(tanggal_lahir).replaceAll("-", "");
const finalPassword = password || autoPassword;

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }

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

    const { data: newGuru, error: guruError } = await supabase
      .from("guru")
      .insert([
        {
  user_id: newUser.id,
  nama,
  nip: nip || null,
  nuptk: nuptk || null,
  mapel: mapel || null,
  no_hp: no_hp || null,
  alamat: alamat || null,
  tempat_lahir: tempat_lahir || null,
  tanggal_lahir: tanggal_lahir || null,
  jenis_kelamin: jenis_kelamin || null,
  pendidikan_terakhir: pendidikan_terakhir || null,
  status_kepegawaian: status_kepegawaian || null,
  tanggal_bergabung: tanggal_bergabung || null,
  wali_kelas: wali_kelas || null,
  catatan: catatan || null,
  status: "aktif",
},
      ])
      .select()
      .single();

    if (guruError) {
      await supabase.from("users").delete().eq("id", newUser.id);

      return res.status(500).json({
        success: false,
        message: "User berhasil dibuat, tetapi data guru gagal dibuat.",
        error: guruError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Akun guru berhasil dibuat.",
      data: {
        user: newUser,
        guru: newGuru,
      },
    });
  } catch (error) {
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

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", guru.user_id);

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus akun guru.",
        error: deleteError.message,
      });
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