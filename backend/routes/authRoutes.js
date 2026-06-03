import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const cleanEmail = String(email).trim();
    const cleanPassword = String(password).trim();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanEmail)
      .eq("password", cleanPassword)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    if (!["admin", "owner", "santri"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Role akun tidak dikenali.",
      });
    }

    let santriData = null;

    if (user.role === "santri") {
      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (santriError || !santri) {
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

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      nama: user.nama || null,
    };

    let redirectTo = "/login";

    if (user.role === "admin") {
      redirectTo = "/admin/dashboard";
    }

    if (user.role === "owner") {
      redirectTo = "/owner/dashboard";
    }

    if (user.role === "santri") {
      redirectTo = "/santri/dashboard";
    }

    return res.json({
      success: true,
      message: "Login berhasil.",
      redirectTo,
      data: {
        user: safeUser,
        santri: santriData,
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