import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================================================
   SANTRI DOKUMEN
   GET /api/santri/dokumen?user_id=...
========================================================= */

router.get("/dokumen", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    const { data: santri, error } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !santri) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: error?.message,
      });
    }

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const docs = [
  {
    title: "Surat Pernyataan Menjadi Santri",
    desc: "Dokumen pernyataan resmi untuk calon santri Yayasan Al Furqon.",
    file: `${BACKEND_URL}/docs/SURAT-PERNYATAAN-MENJADI-SANTRI.pdf`,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Surat Pernyataan Orang Tua Santri",
    desc: "Dokumen persetujuan dan pernyataan dari orang tua/wali santri.",
    file: `${BACKEND_URL}/docs/SURAT-PERNYATAAN-ORANG-TUA-SANTRI.pdf`,
    color: "from-yellow-400 to-orange-500",
  },
];

    return res.json({
      success: true,
      message: "Data dokumen berhasil diambil.",
      data: {
        santri,
        docs,
      },
    });
  } catch (error) {
    console.error("GET SANTRI DOKUMEN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil dokumen santri.",
      error: error.message,
    });
  }
});

/* =========================================================
   SANTRI PENGATURAN
   GET /api/santri/pengaturan?user_id=...
========================================================= */

router.get("/pengaturan", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    const { data: santriData, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (santriError || !santriData) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id, email, role, nama")
      .eq("id", santriData.user_id)
      .maybeSingle();

    const safeUser = userData || {
      id: santriData.user_id,
      email: santriData.email,
      role: "santri",
      nama: santriData.nama,
    };

    return res.json({
      success: true,
      message: "Data pengaturan berhasil diambil.",
      data: {
        user: safeUser,
        santri: santriData,
      },
    });
  } catch (error) {
    console.error("GET SANTRI PENGATURAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil pengaturan.",
      error: error.message,
    });
  }
});

/* UPDATE AKUN SANTRI */
router.put("/pengaturan/akun", async (req, res) => {
  try {
    const { user_id, email, telepon } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi.",
      });
    }

    const cleanEmail = String(email).trim();
    const cleanTelepon = String(telepon || "").trim();

    const { data: santriData, error: findSantriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (findSantriError || !santriData) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: findSantriError?.message,
      });
    }

    const { data: updatedSantri, error: santriError } = await supabase
      .from("santri")
      .update({
        email: cleanEmail,
        telepon: cleanTelepon,
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupdate data santri.",
        error: santriError.message,
      });
    }

    const { data: updatedUser } = await supabase
      .from("users")
      .update({
        email: cleanEmail,
      })
      .eq("id", santriData.user_id)
      .select("id, email, role, nama")
      .maybeSingle();

    const safeUser = updatedUser || {
      id: santriData.user_id,
      email: cleanEmail,
      role: "santri",
      nama: updatedSantri.nama,
    };

    return res.json({
      success: true,
      message: "Pengaturan akun berhasil diperbarui.",
      data: {
        user: safeUser,
        santri: updatedSantri,
      },
    });
  } catch (error) {
    console.error("UPDATE AKUN SANTRI ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat update akun.",
      error: error.message,
    });
  }
});

/* UPDATE PASSWORD SANTRI */
router.put("/pengaturan/password", async (req, res) => {
  try {
    const { user_id, oldPassword, newPassword, confirmPassword } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru wajib diisi.",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 6 karakter.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Konfirmasi password tidak sama.",
      });
    }

    const { data: santriData, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (santriError || !santriData) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", santriData.user_id)
      .maybeSingle();

    if (!userData) {
      return res.status(404).json({
        success: false,
        message:
          "Akun user tidak ditemukan di tabel users. Password tidak bisa diubah.",
      });
    }

    if (userData.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Password lama tidak sesuai.",
      });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPassword,
      })
      .eq("id", userData.id);

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupdate password.",
        error: updateError.message,
      });
    }

    return res.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD SANTRI ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat update password.",
      error: error.message,
    });
  }
});

/* =========================================================
   SANTRI PEMBAYARAN KONFIRMASI
   POST /api/santri/pembayaran/konfirmasi
========================================================= */

router.post(
  "/pembayaran/konfirmasi",
  upload.single("bukti"),
  async (req, res) => {
    try {
      const { user_id, tagihan_id, metode } = req.body;

      if (!user_id || !tagihan_id || !metode) {
        return res.status(400).json({
          success: false,
          message: "User ID, tagihan ID, dan metode pembayaran wajib dikirim.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Bukti pembayaran wajib diupload.",
        });
      }

      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (santriError || !santri) {
        return res.status(404).json({
          success: false,
          message: "Data santri tidak ditemukan.",
          error: santriError?.message,
        });
      }

      const { data: tagihan, error: tagihanError } = await supabase
        .from("tagihan")
        .select("*")
        .eq("id", tagihan_id)
        .eq("santri_id", santri.id)
        .single();

      if (tagihanError || !tagihan) {
        return res.status(404).json({
          success: false,
          message: "Data tagihan tidak ditemukan.",
          error: tagihanError?.message,
        });
      }

      const { data: existingPembayaran } = await supabase
        .from("pembayaran")
        .select("*")
        .eq("tagihan_id", tagihan_id)
        .eq("santri_id", santri.id)
        .maybeSingle();

      let pembayaranId = existingPembayaran?.id || null;

      if (!pembayaranId) {
        const { data: pembayaranBaru, error: createError } = await supabase
          .from("pembayaran")
          .insert({
            santri_id: santri.id,
            tagihan_id,
            jenis: tagihan.jenis,
            nominal: tagihan.nominal,
            metode,
            deadline: tagihan.deadline,
            status: "pending",
            tanggal_bayar: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return res.status(500).json({
            success: false,
            message: "Gagal membuat data pembayaran.",
            error: createError.message,
          });
        }

        pembayaranId = pembayaranBaru.id;
      }

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `bukti-${pembayaranId}-${Date.now()}.${fileExt}`;
      const filePath = `pembayaran/${santri.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("bukti-pembayaran")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Gagal upload bukti pembayaran.",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("bukti-pembayaran")
        .getPublicUrl(filePath);

      const buktiUrl = publicUrlData.publicUrl;

      await supabase
        .from("pembayaran")
        .update({
          bukti_transfer: buktiUrl,
          metode,
          tanggal_bayar: new Date().toISOString(),
          status: "pending",
        })
        .eq("id", pembayaranId);

      await supabase
        .from("tagihan")
        .update({
          status: "pending",
          metode,
          tanggal_bayar: new Date().toISOString(),
        })
        .eq("id", tagihan_id)
        .eq("santri_id", santri.id);

      return res.json({
        success: true,
        message: "Pembayaran berhasil dikirim. Menunggu verifikasi admin.",
      });
    } catch (error) {
      console.error("KONFIRMASI PEMBAYARAN ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   SANTRI KONFIRMASI PEMBAYARAN BERDASARKAN ID PEMBAYARAN
   POST /api/santri/pembayaran/:pembayaran_id/konfirmasi
========================================================= */

router.post(
  "/pembayaran/:pembayaran_id/konfirmasi",
  upload.single("bukti"),
  async (req, res) => {
    try {
      const { pembayaran_id } = req.params;
      const { metode, user_id, nominal_bayar } = req.body;

      if (!pembayaran_id) {
        return res.status(400).json({
          success: false,
          message: "ID pembayaran wajib dikirim.",
        });
      }

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID wajib dikirim.",
        });
      }

      if (!metode) {
        return res.status(400).json({
          success: false,
          message: "Metode pembayaran wajib dipilih.",
        });
      }

      if (!nominal_bayar || Number(nominal_bayar) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Nominal cicilan wajib diisi dan harus lebih dari 0.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Bukti pembayaran wajib diupload.",
        });
      }

      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (santriError || !santri) {
        return res.status(404).json({
          success: false,
          message: "Data santri tidak ditemukan.",
          error: santriError?.message,
        });
      }

      const { data: pembayaran, error: pembayaranError } = await supabase
        .from("pembayaran")
        .select("*")
        .eq("id", pembayaran_id)
        .eq("santri_id", santri.id)
        .single();

      if (pembayaranError || !pembayaran) {
        return res.status(404).json({
          success: false,
          message: "Data pembayaran tidak ditemukan.",
          error: pembayaranError?.message,
        });
      }

      if (pembayaran.status === "lunas") {
        return res.status(400).json({
          success: false,
          message: "Tagihan ini sudah lunas.",
        });
      }

      const nominalTagihan = Number(pembayaran.nominal || 0);
      const nominalSudahDibayar = Number(pembayaran.nominal_dibayar || 0);
      const sisaPembayaran = nominalTagihan - nominalSudahDibayar;
      const nominalCicilan = Number(nominal_bayar);

      if (sisaPembayaran <= 0) {
  return res.status(400).json({
    success: false,
    message: "Tagihan ini sudah tidak memiliki sisa pembayaran.",
  });
}

if (!Number.isFinite(nominalCicilan)) {
  return res.status(400).json({
    success: false,
    message: "Nominal pembayaran tidak valid.",
  });
}

      if (nominalCicilan > sisaPembayaran) {
        return res.status(400).json({
          success: false,
          message: `Nominal cicilan melebihi sisa tagihan. Sisa tagihan: Rp ${sisaPembayaran.toLocaleString(
            "id-ID"
          )}.`,
        });
      }

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `cicilan-${pembayaran_id}-${Date.now()}.${fileExt}`;
      const filePath = `pembayaran/${santri.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("bukti-pembayaran")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Gagal upload bukti cicilan.",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("bukti-pembayaran")
        .getPublicUrl(filePath);

      const buktiUrl = publicUrlData.publicUrl;

      const { data: cicilanData, error: cicilanError } = await supabase
        .from("pembayaran_cicilan")
        .insert([
          {
            pembayaran_id: pembayaran.id,
            tagihan_id: pembayaran.tagihan_id,
            santri_id: santri.id,
            nominal_cicilan: nominalCicilan,
            metode,
            bukti_transfer: buktiUrl,
            status: "pending",
            tanggal_bayar: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (cicilanError) {
        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan data cicilan.",
          error: cicilanError.message,
        });
      }

      await supabase
        .from("pembayaran")
        .update({
          status: "pending",
          metode,
          bukti_transfer: buktiUrl,
          tanggal_bayar: new Date().toISOString(),
        })
        .eq("id", pembayaran.id);

      if (pembayaran.tagihan_id) {
        await supabase
          .from("tagihan")
          .update({
            status: "pending",
            metode,
            tanggal_bayar: new Date().toISOString(),
          })
          .eq("id", pembayaran.tagihan_id);
      }

      return res.json({
        success: true,
        message:
          "Cicilan berhasil dikirim. Menunggu verifikasi admin.",
        data: cicilanData,
      });
    } catch (error) {
      console.error("KONFIRMASI CICILAN ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }
);

// ================================
// SANTRI DASHBOARD API
// ================================
router.get("/dashboard/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    // 1. Ambil data santri
    const { data: santri, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (santriError || !santri) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

    // 2. Ambil data pembayaran santri
    const { data: pembayaran, error: pembayaranError } = await supabase
      .from("pembayaran")
      .select(`
        id,
        jenis,
        nominal,
        status,
        metode,
        bukti_transfer,
        deadline,
        tanggal_bayar,
        created_at,
        tagihan_id
      `)
      .eq("santri_id", santri.id)
      .order("created_at", { ascending: false });

    if (pembayaranError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data pembayaran santri.",
        error: pembayaranError.message,
      });
    }

    const listPembayaran = pembayaran || [];

    const belumBayar = listPembayaran.filter(
      (item) => item.status === "belum_bayar" || item.status === "ditolak"
    );

    const pending = listPembayaran.filter(
      (item) => item.status === "pending"
    );

    const lunas = listPembayaran.filter(
      (item) => item.status === "lunas"
    );

    const totalBelumBayar = belumBayar.reduce(
      (sum, item) => sum + Number(item.nominal || 0),
      0
    );

    // 3. Ambil data pemberitahuan aktif
    const { data: pemberitahuanData, error: pemberitahuanError } =
      await supabase
        .from("pemberitahuan")
        .select(`
          id,
          judul,
          isi,
          kategori,
          prioritas,
          target_type,
          target_jenjang,
          target_kelas,
          target_santri_id,
          status,
          created_at
        `)
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

    if (pemberitahuanError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data pemberitahuan santri.",
        error: pemberitahuanError.message,
      });
    }

    // 4. Filter pemberitahuan sesuai target santri
    const semuaPemberitahuan = pemberitahuanData || [];

    const pemberitahuanUntukSantri = semuaPemberitahuan.filter((item) => {
      const targetType = String(item.target_type || "").toLowerCase();

      if (targetType === "semua") {
        return true;
      }

      if (targetType === "santri") {
        return String(item.target_santri_id) === String(santri.id);
      }

      if (targetType === "jenjang") {
        return String(item.target_jenjang) === String(santri.jenjang);
      }

      if (targetType === "kelas") {
        return (
          String(item.target_jenjang) === String(santri.jenjang) &&
          String(item.target_kelas) === String(santri.kelas)
        );
      }

      return false;
    });

    const pemberitahuanPenting = pemberitahuanUntukSantri.filter((item) => {
      const prioritas = String(item.prioritas || "").toLowerCase();

      return (
        prioritas === "tinggi" ||
        prioritas === "penting" ||
        prioritas === "urgent"
      );
    });

    const { data: pemberitahuanDibacaData, error: pemberitahuanDibacaError } =
  await supabase
    .from("pemberitahuan_dibaca")
    .select("pemberitahuan_id")
    .eq("santri_id", santri.id);

if (pemberitahuanDibacaError) {
  return res.status(500).json({
    success: false,
    message: "Gagal mengambil status baca pemberitahuan.",
    error: pemberitahuanDibacaError.message,
  });
}

const readIds = new Set(
  (pemberitahuanDibacaData || []).map((item) =>
    String(item.pemberitahuan_id)
  )
);

const pemberitahuanBelumDibaca = pemberitahuanUntukSantri.filter(
  (item) => !readIds.has(String(item.id))
);

    // 5. Kirim data lengkap ke frontend dashboard
    return res.json({
      success: true,
      message: "Data dashboard santri berhasil diambil.",
      data: {
        santri,

        pembayaran: {
          total: listPembayaran.length,
          belum_bayar: belumBayar.length,
          pending: pending.length,
          lunas: lunas.length,
          total_belum_bayar: totalBelumBayar,
          terbaru: listPembayaran.slice(0, 5),
        },

pemberitahuan: {
  total: pemberitahuanUntukSantri.length,
  belum_dibaca: pemberitahuanBelumDibaca.length,
  penting: pemberitahuanPenting.length,
  terbaru: pemberitahuanUntukSantri.slice(0, 5),
  belum_dibaca_terbaru: pemberitahuanBelumDibaca.slice(0, 5),
},
      },
    });
  } catch (error) {
    console.error("SANTRI DASHBOARD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});

router.get("/pembayaran/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    const { data: santri, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (santriError || !santri) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

    const { data: pembayaran, error: pembayaranError } = await supabase
      .from("pembayaran")
      .select(`
        id,
        tagihan_id,
        santri_id,
        jenis,
        nominal,
        nominal_dibayar,
        deadline,
        status,
        metode,
        bukti_transfer,
        tanggal_bayar,
        created_at,

        tagihan:tagihan_id (
          id,
          status,
          deadline
        )
      `)
      .eq("santri_id", santri.id)
      .order("created_at", { ascending: false });

    if (pembayaranError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data pembayaran.",
        error: pembayaranError.message,
      });
    }

    const { data: pemberitahuanData, error: pemberitahuanError } = await supabase
  .from("pemberitahuan")
  .select(`
    id,
    judul,
    isi,
    kategori,
    prioritas,
    target_type,
    target_jenjang,
    target_kelas,
    target_santri_id,
    status,
    created_at
  `)
  .eq("status", "aktif")
  .order("created_at", { ascending: false });

if (pemberitahuanError) {
  return res.status(500).json({
    success: false,
    message: "Gagal mengambil data pemberitahuan santri.",
    error: pemberitahuanError.message,
  });
}

const semuaPemberitahuan = pemberitahuanData || [];

const pemberitahuanUntukSantri = semuaPemberitahuan.filter((item) => {
  const targetType = String(item.target_type || "").toLowerCase();

  if (targetType === "semua") {
    return true;
  }

  if (targetType === "santri") {
    return item.target_santri_id === santri.id;
  }

  if (targetType === "jenjang") {
    return item.target_jenjang === santri.jenjang;
  }

  if (targetType === "kelas") {
    return (
      item.target_jenjang === santri.jenjang &&
      item.target_kelas === santri.kelas
    );
  }

  return false;
});

const pemberitahuanPenting = pemberitahuanUntukSantri.filter((item) => {
  const prioritas = String(item.prioritas || "").toLowerCase();

  return (
    prioritas === "tinggi" ||
    prioritas === "penting" ||
    prioritas === "urgent"
  );
});

    return res.json({
      success: true,
      message: "Data pembayaran santri berhasil diambil.",
      santri,
      data: pembayaran || [],
    });
  } catch (error) {
    console.error("GET SANTRI PEMBAYARAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});

// ================================
// SANTRI PEMBERITAHUAN API
// ================================

// Ambil pemberitahuan santri berdasarkan user_id
router.get("/pemberitahuan/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    // 1. Ambil data santri berdasarkan user_id
    const { data: santri, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (santriError || !santri) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

    // 2. Ambil semua pemberitahuan aktif
    const { data: pemberitahuanData, error: pemberitahuanError } =
      await supabase
        .from("pemberitahuan")
        .select("*")
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

    if (pemberitahuanError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil pemberitahuan.",
        error: pemberitahuanError.message,
      });
    }

    // 3. Filter target pemberitahuan sesuai santri
    const filtered = (pemberitahuanData || []).filter((item) => {
      if (item.target_type === "semua") return true;

      if (item.target_type === "jenjang") {
        return item.target_jenjang === santri.jenjang;
      }

      if (item.target_type === "kelas") {
        return (
          item.target_jenjang === santri.jenjang &&
          String(item.target_kelas) === String(santri.kelas)
        );
      }

      if (item.target_type === "santri") {
        return item.target_santri_id === santri.id;
      }

      return false;
    });

    // 4. Ambil data pemberitahuan yang sudah dibaca
    const { data: dibacaData, error: dibacaError } = await supabase
      .from("pemberitahuan_dibaca")
      .select("pemberitahuan_id")
      .eq("santri_id", santri.id);

    if (dibacaError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil status baca pemberitahuan.",
        error: dibacaError.message,
      });
    }

    const readIds = (dibacaData || []).map((item) => item.pemberitahuan_id);

    return res.json({
      success: true,
      message: "Data pemberitahuan berhasil diambil.",
      santri,
      data: filtered,
      readIds,
    });
  } catch (error) {
    console.error("GET SANTRI PEMBERITAHUAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});


// Tandai pemberitahuan sebagai sudah dibaca
const tandaiPemberitahuanDibaca = async ({ user_id, pemberitahuan_id }) => {
  if (!user_id || !pemberitahuan_id) {
    return {
      status: 400,
      body: {
        success: false,
        message: "User ID dan ID pemberitahuan wajib dikirim.",
      },
    };
  }

  const { data: santri, error: santriError } = await supabase
    .from("santri")
    .select("id, user_id, nama")
    .eq("user_id", user_id)
    .single();

  if (santriError || !santri) {
    return {
      status: 404,
      body: {
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      },
    };
  }

  const { error } = await supabase.from("pemberitahuan_dibaca").upsert(
    [
      {
        pemberitahuan_id,
        santri_id: santri.id,
        dibaca_pada: new Date().toISOString(),
      },
    ],
    {
      onConflict: "pemberitahuan_id,santri_id",
    }
  );

  if (error) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Gagal menandai pemberitahuan sebagai dibaca.",
        error: error.message,
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: "Pemberitahuan berhasil ditandai sebagai dibaca.",
    },
  };
};


// Versi lama: POST /api/santri/pemberitahuan/read
router.post("/pemberitahuan/read", async (req, res) => {
  try {
    const { user_id, pemberitahuan_id } = req.body;

    const result = await tandaiPemberitahuanDibaca({
      user_id,
      pemberitahuan_id,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("READ PEMBERITAHUAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});


// Versi baru: POST /api/santri/pemberitahuan/:id/read
router.post("/pemberitahuan/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const result = await tandaiPemberitahuanDibaca({
      user_id,
      pemberitahuan_id: id,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("READ PEMBERITAHUAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});
/* =========================================================
   SANTRI PROFILE API
========================================================= */

// Ambil profil santri berdasarkan user_id
router.get("/profile/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    const { data, error } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Data profil santri tidak ditemukan.",
        error: error?.message,
      });
    }

    return res.json({
      success: true,
      message: "Profil santri berhasil diambil.",
      data,
    });
  } catch (error) {
    console.error("GET PROFILE SANTRI ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});

router.put("/profile/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const form = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib dikirim.",
      });
    }

    if (!form.email || !String(form.email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi.",
      });
    }

    const { data, error } = await supabase
      .from("santri")
      .update({
        telepon: form.telepon,
        email: form.email,
        alamat: form.alamat,
        kota: form.kota,
        provinsi: form.provinsi,
        kode_pos: form.kode_pos,
        asal_sekolah: form.asal_sekolah,
        cita_cita: form.cita_cita,
        hobi: form.hobi,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal memperbarui profil santri.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Profil santri berhasil diperbarui.",
      data,
    });
  } catch (error) {
    console.error("UPDATE PROFILE SANTRI ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});

router.put("/profile/:user_id/foto", upload.single("foto"),async (req, res) => {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID wajib dikirim.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Foto wajib diupload.",
        });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "File harus berupa gambar.",
        });
      }

      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Ukuran foto maksimal 2MB.",
        });
      }

      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (santriError || !santri) {
        return res.status(404).json({
          success: false,
          message: "Data santri tidak ditemukan.",
          error: santriError?.message,
        });
      }

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `foto-${user_id}-${Date.now()}.${fileExt}`;
      const filePath = `santri/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("foto-santri")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Gagal upload foto.",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("foto-santri")
        .getPublicUrl(filePath);

      const fotoUrl = publicUrlData.publicUrl;

      const { data: updatedSantri, error: updateError } = await supabase
        .from("santri")
        .update({
          foto: fotoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .select()
        .single();

      if (updateError) {
        return res.status(400).json({
          success: false,
          message: "Gagal menyimpan foto profil.",
          error: updateError.message,
        });
      }

      return res.json({
        success: true,
        message: "Foto profil berhasil diperbarui.",
        data: updatedSantri,
      });
    } catch (error) {
      console.error("UPLOAD FOTO PROFILE ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }
);

router.get("/nilai/:userId", async (req, res) => {
  
  try {
    const { userId } = req.params;
    const headerUserId = req.headers["x-user-id"];
    const { semester, tahun_ajaran } = req.query;

    if (!headerUserId) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. User tidak terdeteksi.",
      });
    }

    if (String(userId) !== String(headerUserId)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses nilai santri lain.",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, nama, email, role")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
        error: userError?.message,
      });
    }

    if (user.role !== "santri") {
      return res.status(403).json({
        success: false,
        message: "Hanya santri yang dapat melihat halaman nilai.",
      });
    }

    const { data: santri, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (santriError || !santri) {
      return res.status(404).json({
        success: false,
        message:
          "Data santri tidak ditemukan. Pastikan akun user sudah terhubung dengan tabel santri.",
        error: santriError?.message,
      });
    }

    let nilaiQuery = supabase
  .from("nilai")
  .select(
    `
    id,
    guru_id,
    santri_id,
    kelas_id,
    mapel,
    jenis_nilai,
    nilai,
    semester,
    tahun_ajaran,
    keterangan,
    created_at,
    updated_at
  `
  )
  .eq("santri_id", santri.id);

if (semester) {
  nilaiQuery = nilaiQuery.eq("semester", semester);
}

if (tahun_ajaran) {
  nilaiQuery = nilaiQuery.eq("tahun_ajaran", tahun_ajaran);
}

const { data: nilaiRaw, error: nilaiError } = await nilaiQuery.order(
  "created_at",
  { ascending: false }
);

    if (nilaiError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data nilai santri.",
        error: nilaiError.message,
      });
    }

    const guruIds = [
      ...new Set((nilaiRaw || []).map((item) => item.guru_id).filter(Boolean)),
    ];

    const kelasIds = [
      ...new Set((nilaiRaw || []).map((item) => item.kelas_id).filter(Boolean)),
    ];

    let guruRaw = [];
    let kelasRaw = [];

    if (guruIds.length > 0) {
      const { data, error } = await supabase
        .from("guru")
        .select("id, nama, mapel")
        .in("id", guruIds);

      if (error) {
        console.warn("SANTRI NILAI GURU ERROR:", error.message);
      } else {
        guruRaw = data || [];
      }
    }

    if (kelasIds.length > 0) {
      const { data, error } = await supabase
        .from("kelas")
        .select(
          `
          id,
          nama_kelas,
          jenjang,
          tingkat,
          jurusan,
          semester,
          tahun_ajaran
        `
        )
        .in("id", kelasIds);

      if (error) {
        console.warn("SANTRI NILAI KELAS ERROR:", error.message);
      } else {
        kelasRaw = data || [];
      }
    }

    const guruMap = new Map();
    const kelasMap = new Map();

    for (const guruItem of guruRaw || []) {
      guruMap.set(guruItem.id, guruItem);
    }

    for (const kelasItem of kelasRaw || []) {
      kelasMap.set(kelasItem.id, kelasItem);
    }

    const nilai = (nilaiRaw || []).map((item) => ({
      ...item,
      guru: guruMap.get(item.guru_id) || {
        id: item.guru_id,
        nama: "Guru belum tersedia",
        mapel: item.mapel || "-",
      },
      kelas: kelasMap.get(item.kelas_id) || {
        id: item.kelas_id,
        nama_kelas: santri.kelas || "Kelas belum tersedia",
        jenjang: santri.jenjang || "-",
      },
    }));

    const totalNilai = nilai.length;

    const rataRata =
      totalNilai > 0
        ? Math.round(
            nilai.reduce((sum, item) => sum + Number(item.nilai || 0), 0) /
              totalNilai
          )
        : 0;

    const nilaiTertinggi =
      totalNilai > 0
        ? Math.max(...nilai.map((item) => Number(item.nilai || 0)))
        : 0;

    const mapelSet = new Set();

    for (const item of nilai) {
      if (item.mapel) {
        mapelSet.add(item.mapel);
      }
    }

    return res.json({
      success: true,
      message: "Data nilai santri berhasil diambil.",
      data: {
        user,
        santri,
        nilai,
        ringkasan: {
          totalNilai,
          rataRata,
          nilaiTertinggi,
          totalMapel: mapelSet.size,
        },
      },
    });
  } catch (error) {
    console.error("SANTRI NILAI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil nilai santri.",
      error: error.message,
    });
  }
});

export default router;