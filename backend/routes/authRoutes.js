import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const getRedirectByRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "owner") return "/owner/dashboard";
  if (role === "santri") return "/santri/dashboard";
  if (role === "guru") return "/guru/dashboard";
  return "/login";
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanEmail)
      .eq("password", cleanPassword)
      .maybeSingle();

    if (userError) {
      console.error("SUPABASE LOGIN ERROR:", userError);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data user.",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        type: "wrong_credentials",
        message: "Email atau password salah.",
      });
    }

    const role = String(user.role || "").toLowerCase().trim();

    if (!["admin", "owner", "santri", "guru"].includes(role)) {
      return res.status(403).json({
        success: false,
        type: "invalid_role",
        message: "Role akun tidak dikenali.",
      });
    }

    let santriData = null;
    let guruData = null;

    if (role === "santri") {
      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (santriError) {
        console.error("SUPABASE SANTRI ERROR:", santriError);

        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengambil data santri.",
        });
      }

      if (!santri) {
        return res.status(404).json({
          success: false,
          type: "not_found",
          message: "Data santri tidak ditemukan.",
        });
      }

      if (santri.status === "ditolak") {
        return res.status(403).json({
          success: false,
          type: "rejected",
          message:
            "Mohon maaf, pendaftaran kamu ditolak oleh admin Pondok Pesantren Al-Furqon. Silakan hubungi admin untuk informasi lebih lanjut.",
        });
      }

      if (santri.status === "pending" || santri.status !== "aktif") {
        return res.status(403).json({
          success: false,
          type: "pending",
          message:
            "Akun kamu masih dalam proses verifikasi oleh admin Pondok Pesantren Al-Furqon. Silakan tunggu hingga akun diaktifkan.",
        });
      }

      santriData = santri;
    }

    if (role === "guru") {
      const { data: guru, error: guruError } = await supabase
        .from("guru")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (guruError) {
        console.error("SUPABASE GURU ERROR:", guruError);

        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengambil data guru.",
        });
      }

      if (!guru) {
        return res.status(404).json({
          success: false,
          type: "not_found",
          message: "Data guru tidak ditemukan.",
        });
      }

      if (guru.status !== "aktif") {
        return res.status(403).json({
          success: false,
          type: "inactive",
          message:
            "Akun guru belum aktif. Silakan hubungi admin Pondok Pesantren Al-Furqon.",
        });
      }

      guruData = guru;
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role,
      nama: user.nama || user.name || user.nama_lengkap || user.username || null,
      created_at: user.created_at || null,
    };

    const redirectTo = getRedirectByRole(role);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      redirectTo,
      data: {
        user: safeUser,
        santri: santriData,
        guru: guruData,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat login.",
      error: error.message,
    });
  }
});

export default router;