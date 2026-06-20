import express from "express";
import { supabase } from "../config/supabase.js";
import upload from "../middleware/upload.js";
import {
  generatePassword,
  uploadToStorage,
  logAktivitasAdmin,
} from "../helpers/helpers.js";

const router = express.Router();

router.get("/test-kelulusan", (req, res) => {
  return res.json({
    success: true,
    message: "Admin kelulusan routes aktif",
    routes: [
      "GET /api/admin/kelulusan",
      "POST /api/admin/kelulusan/:id/verifikasi",
      "POST /api/admin/kelulusan/:id/proses-kelas",
    ],
  });
});


/* =========================================================
   ADMIN DASHBOARD
   GET /api/admin/dashboard
========================================================= */

router.get("/dashboard", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalSantriResult,
      santriAktifResult,
      santriPendingResult,
      santriDitolakResult,
      pendaftaranBaruResult,
      latestSantriResult,
      pemberitahuanResult,
      latestPemberitahuanResult,
      tagihanResult,
      latestTagihanResult,
      adminUnreadNotifResult,
      latestAdminNotifResult,
    ] = await Promise.all([
      supabase.from("santri").select("*", { count: "exact", head: true }),

      supabase
        .from("santri")
        .select("*", { count: "exact", head: true })
        .eq("status", "aktif"),

      supabase
        .from("santri")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("santri")
        .select("*", { count: "exact", head: true })
        .eq("status", "ditolak"),

      supabase
        .from("santri")
        .select("id")
        .gte("created_at", sevenDaysAgo.toISOString()),

      supabase
        .from("santri")
        .select("id, nama, jenjang, kelas, status, foto, created_at")
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("pemberitahuan")
        .select("*", { count: "exact", head: true })
        .eq("status", "aktif"),

      supabase
        .from("pemberitahuan")
        .select("id, judul, kategori, prioritas, target_type, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("tagihan")
        .select("id, nominal, status, jenis, metode, created_at, tanggal_bayar"),

      supabase
        .from("tagihan")
        .select(
          "id, nominal, status, jenis, metode, created_at, tanggal_bayar, santri(nama, jenjang, kelas)"
        )
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("admin_notifikasi")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),

      supabase
        .from("admin_notifikasi")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const errors = [
      totalSantriResult.error,
      santriAktifResult.error,
      santriPendingResult.error,
      santriDitolakResult.error,
      pendaftaranBaruResult.error,
      latestSantriResult.error,
      pemberitahuanResult.error,
      latestPemberitahuanResult.error,
      tagihanResult.error,
      latestTagihanResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data dashboard admin.",
        error: errors[0].message,
      });
    }

    const tagihanData = tagihanResult.data || [];

    const pembayaranLunas = tagihanData.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      return status === "lunas" || status === "paid" || status === "aktif";
    });

    const pemasukan = pembayaranLunas.reduce((total, item) => {
      return total + Number(item.nominal || 0);
    }, 0);

    return res.json({
      success: true,
      page: "admin-dashboard",
      data: {
        totalSantri: totalSantriResult.count || 0,
        santriAktif: santriAktifResult.count || 0,
        santriPending: santriPendingResult.count || 0,
        santriDitolak: santriDitolakResult.count || 0,
        pendaftaranBaru: pendaftaranBaruResult.data?.length || 0,
        totalTagihan: tagihanData.length || 0,
        pembayaranLunas: pembayaranLunas.length || 0,
        pemasukan,
        totalPemberitahuan: pemberitahuanResult.count || 0,
        adminUnreadNotifications: adminUnreadNotifResult.count || 0,
        latestAdminNotifications: latestAdminNotifResult.data || [],
        latestSantri: latestSantriResult.data || [],
        latestPembayaran: latestTagihanResult.data || [],
        latestPemberitahuan: latestPemberitahuanResult.data || [],
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server dashboard admin.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN SANTRI
   GET /api/admin/santri
========================================================= */

const buildAdminSantriPayload = (body, fotoUrl = null) => {
  const payload = {
    nama: body.nama || "",
    nisn: body.nisn || "",
    nik: body.nik || "",
    tempat_lahir: body.tempat_lahir || "",
    tanggal_lahir: body.tanggal_lahir || null,
    agama: body.agama || "",
    jenjang: body.jenjang || "",
    kelas: body.kelas || "",
    jenis_kelamin: body.jenis_kelamin || "",
    telepon: body.telepon || "",
    email: body.email || "",
    alamat: body.alamat || "",
    kota: body.kota || "",
    provinsi: body.provinsi || "",
    kode_pos: body.kode_pos || "",
    asal_sekolah: body.asal_sekolah || "",
    cita_cita: body.cita_cita || "",
    hobi: body.hobi || "",
  };

  if (fotoUrl) {
    payload.foto = fotoUrl;
  } else if (body.foto && !body.foto.startsWith("blob:")) {
    payload.foto = body.foto;
  }

  return payload;
};

const buildAdminOrtuPayload = (body) => {
  return {
    ayah_nama: body.ayah_nama || "",
    ayah_pekerjaan: body.ayah_pekerjaan || "",
    ibu_nama: body.ibu_nama || "",
    ibu_pekerjaan: body.ibu_pekerjaan || "",
  };
};

router.get("/santri", async (req, res) => {
  try {
    const status = req.query.status || "aktif";

    const { data, error } = await supabase
      .from("santri")
      .select("*, orang_tua(*)")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data santri.",
      error: error.message,
    });
  }
});

router.post("/santri", upload.single("foto"), async (req, res) => {
  try {
    const body = req.body;

    if (!body.nama || !body.email) {
      return res.status(400).json({
        success: false,
        message: "Nama dan email santri wajib diisi.",
      });
    }

    let fotoUrl = null;

    if (req.file) {
      fotoUrl = await uploadToStorage("foto-santri", req.file, "santri");
    }

    const autoPassword = generatePassword(body.nama, body.tanggal_lahir);

    const { data: userData, error: userError } = await supabase
  .from("users")
  .insert([
    {
      nama: body.nama || "",
      email: body.email,
      password: autoPassword,
      role: "santri",
    },
  ])
  .select()
  .single();

    if (userError) {
      return res.status(400).json({
        success: false,
        message: "Gagal membuat akun user.",
        error: userError.message,
      });
    }

    const { data: santriData, error: santriError } = await supabase
      .from("santri")
      .insert([
        {
          ...buildAdminSantriPayload(body, fotoUrl),
          user_id: userData.id,
          status: "aktif",
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
        ...buildAdminOrtuPayload(body),
      },
    ]);

    if (ortuError) {
      return res.status(400).json({
        success: false,
        message: "Data santri tersimpan, tetapi data orang tua gagal.",
        error: ortuError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Data santri berhasil dibuat.",
      data: {
        santri: santriData,
        email: body.email,
        password: autoPassword,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat membuat santri.",
      error: error.message,
    });
  }
});

router.put("/santri/:id", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body.nama || !body.email) {
      return res.status(400).json({
        success: false,
        message: "Nama dan email santri wajib diisi.",
      });
    }

    let fotoUrl = null;

    if (req.file) {
      fotoUrl = await uploadToStorage("foto-santri", req.file, "santri");
    }

    const { error: santriError } = await supabase
      .from("santri")
      .update(buildAdminSantriPayload(body, fotoUrl))
      .eq("id", id);

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupdate data santri.",
        error: santriError.message,
      });
    }

    if (body.user_id) {
  await supabase
    .from("users")
    .update({
      nama: body.nama || "",
      email: body.email || "",
    })
    .eq("id", body.user_id);
}

    const ortuPayload = buildAdminOrtuPayload(body);

    if (body.orang_tua_id) {
      await supabase.from("orang_tua").update(ortuPayload).eq("id", body.orang_tua_id);
    } else {
      await supabase.from("orang_tua").insert([
        {
          santri_id: id,
          ...ortuPayload,
        },
      ]);
    }

    return res.json({
      success: true,
      message: "Data santri berhasil diupdate.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat update santri.",
      error: error.message,
    });
  }
});

router.delete("/santri/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: santriData } = await supabase
      .from("santri")
      .select("id, user_id")
      .eq("id", id)
      .single();

    await supabase.from("orang_tua").delete().eq("santri_id", id);

    const { error: santriError } = await supabase
      .from("santri")
      .delete()
      .eq("id", id);

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal menghapus data santri.",
        error: santriError.message,
      });
    }

    if (santriData?.user_id) {
      await supabase.from("users").delete().eq("id", santriData.user_id);
    }

    return res.json({
      success: true,
      message: "Data santri berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat hapus santri.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN VERIFIKASI SANTRI
========================================================= */

router.get("/verifikasi-santri", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("santri")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data verifikasi santri.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data verifikasi.",
      error: error.message,
    });
  }
});

router.put("/verifikasi-santri/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_id, nama_admin } = req.body;

    if (!["aktif", "ditolak"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid. Gunakan aktif atau ditolak.",
      });
    }

    const { data: santriData, error: findError } = await supabase
      .from("santri")
      .select("id, nama, status")
      .eq("id", id)
      .single();

    if (findError || !santriData) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: findError?.message,
      });
    }

    const { data, error } = await supabase
      .from("santri")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          status === "aktif"
            ? "Gagal menerima santri."
            : "Gagal menolak santri.",
        error: error.message,
      });
    }

    await logAktivitasAdmin({
      admin_id,
      nama_admin: nama_admin || "Admin Pesantren",
      kategori: "santri",
      aktivitas:
        status === "aktif"
          ? "Menerima pendaftaran santri"
          : "Menolak pendaftaran santri",
      detail:
        status === "aktif"
          ? `Admin menerima pendaftaran santri bernama ${santriData.nama}.`
          : `Admin menolak pendaftaran santri bernama ${santriData.nama}.`,
      target_id: santriData.id,
      target_nama: santriData.nama,
    });

    return res.json({
      success: true,
      message:
        status === "aktif"
          ? "Santri berhasil diterima."
          : "Santri berhasil ditolak.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengubah status santri.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN NOTIFICATION API
   GET /api/admin/notifications
   PUT /api/admin/notifications/:id/read
   PUT /api/admin/notifications/read-all
========================================================= */

router.get("/notifications", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_notifikasi")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil notifikasi admin.",
        error: error.message,
      });
    }

    const unreadCount = (data || []).filter((item) => !item.is_read).length;

    return res.json({
      success: true,
      data: data || [],
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("admin_notifikasi")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal menandai notifikasi sebagai dibaca.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Notifikasi sudah dibaca.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.put("/notifications/read-all", async (req, res) => {
  try {
    const { error } = await supabase
      .from("admin_notifikasi")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal menandai semua notifikasi.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Semua notifikasi sudah dibaca.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN PEMBAYARAN API
   Endpoint:
   GET  /api/admin/pembayaran
   GET  /api/admin/pembayaran/santri
   POST /api/admin/tagihan
   PUT  /api/admin/pembayaran/:id/verify
   PUT  /api/admin/pembayaran/:id/reject
========================================================= */

router.get("/pembayaran", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pembayaran")
      .select(`
        id,
        tagihan_id,
        santri_id,
        nominal,
        jenis,
        status,
        metode,
        bukti_transfer,
        tanggal_bayar,
        created_at,

        santri:santri_id (
          id,
          nama,
          nisn,
          kelas,
          jenjang
        ),

        tagihan:tagihan_id (
          id,
          deadline
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pembayaran.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET ADMIN PEMBAYARAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil pembayaran.",
      error: error.message,
    });
  }
});

router.get("/pembayaran/santri", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("santri")
      .select("id, nama, nisn, kelas, jenjang, status")
      .eq("status", "aktif")
      .order("nama", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET SANTRI PEMBAYARAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil santri.",
      error: error.message,
    });
  }
});

router.post("/tagihan", async (req, res) => {
  try {
    const {
      target_type,
      santri_id,
      kelas,
      jenjang,
      jenis,
      nominal,
      deadline,
      metode,
      admin_id,
      nama_admin,
    } = req.body;

    const metodePembayaran = String(metode || "transfer")
      .toLowerCase()
      .trim();

    const isTunai = metodePembayaran === "tunai";
    const statusPembayaran = isTunai ? "lunas" : "belum_bayar";
    const tanggalBayar = isTunai ? new Date().toISOString() : null;

    console.log("CREATE TAGIHAN BODY:", req.body);
    console.log("METODE PEMBAYARAN:", metodePembayaran);
    console.log("STATUS PEMBAYARAN:", statusPembayaran);

    if (!target_type || !jenis || !nominal || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Target, jenis, nominal, dan deadline wajib diisi.",
      });
    }

    if (Number(nominal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Nominal harus lebih dari 0.",
      });
    }

    let santriQuery = supabase
      .from("santri")
      .select("id, nama, nisn, kelas, jenjang, status")
      .eq("status", "aktif");

    if (target_type === "santri") {
      if (!santri_id) {
        return res.status(400).json({
          success: false,
          message: "Pilih santri terlebih dahulu.",
        });
      }

      santriQuery = santriQuery.eq("id", santri_id);
    }

    if (target_type === "kelas") {
      if (!kelas) {
        return res.status(400).json({
          success: false,
          message: "Pilih kelas terlebih dahulu.",
        });
      }

      santriQuery = santriQuery.eq("kelas", kelas);
    }

    if (target_type === "jenjang") {
      if (!jenjang) {
        return res.status(400).json({
          success: false,
          message: "Pilih jenjang terlebih dahulu.",
        });
      }

      santriQuery = santriQuery.eq("jenjang", jenjang);
    }

    const { data: targetSantri, error: santriError } = await santriQuery;

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriError.message,
      });
    }

    if (!targetSantri || targetSantri.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada santri aktif yang sesuai dengan target tagihan.",
      });
    }

    const createdTagihan = [];
    const createdPembayaran = [];

    for (const item of targetSantri) {
      const tagihanPayload = {
        santri_id: item.id,
        jenis,
        nominal: Number(nominal),
        deadline,
        status: statusPembayaran,
        metode: metodePembayaran,
        tanggal_bayar: tanggalBayar,
      };

      console.log("INSERT TAGIHAN PAYLOAD:", tagihanPayload);

      const { data: tagihanData, error: tagihanError } = await supabase
        .from("tagihan")
        .insert([tagihanPayload])
        .select()
        .single();

      if (tagihanError) {
        return res.status(400).json({
          success: false,
          message: `Gagal membuat tagihan untuk ${item.nama}.`,
          error: tagihanError.message,
          detail: tagihanError.details,
          hint: tagihanError.hint,
          code: tagihanError.code,
        });
      }

      createdTagihan.push(tagihanData);

      const pembayaranPayload = {
        santri_id: item.id,
        tagihan_id: tagihanData.id,
        jenis,
        nominal: Number(nominal),
        status: statusPembayaran,
        metode: metodePembayaran,
        bukti_transfer: null,
        deadline,
        tanggal_bayar: tanggalBayar,
      };

      console.log("INSERT PEMBAYARAN PAYLOAD:", pembayaranPayload);

      const { data: pembayaranData, error: pembayaranError } = await supabase
        .from("pembayaran")
        .insert([pembayaranPayload])
        .select()
        .single();

      if (pembayaranError) {
        console.error("INSERT PEMBAYARAN ERROR:", pembayaranError);

        await supabase.from("tagihan").delete().eq("id", tagihanData.id);

        return res.status(400).json({
          success: false,
          message: `Gagal membuat data pembayaran untuk ${item.nama}. Tagihan yang gagal sudah dibatalkan.`,
          error: pembayaranError.message,
          detail: pembayaranError.details,
          hint: pembayaranError.hint,
          code: pembayaranError.code,
        });
      }

      createdPembayaran.push(pembayaranData);
    }

    await logAktivitasAdmin({
      admin_id,
      nama_admin: nama_admin || "Admin Pesantren",
      kategori: "pembayaran",
      aktivitas: isTunai
        ? "Mencatat pembayaran tunai"
        : "Membuat tagihan transfer",
      detail: isTunai
        ? `Admin mencatat pembayaran tunai ${jenis} sebesar Rp ${Number(
            nominal
          ).toLocaleString("id-ID")} untuk ${targetSantri.length} santri.`
        : `Admin membuat tagihan transfer ${jenis} sebesar Rp ${Number(
            nominal
          ).toLocaleString("id-ID")} untuk ${targetSantri.length} santri.`,
      target_id: null,
      target_nama:
        target_type === "santri"
          ? targetSantri[0]?.nama || ""
          : target_type === "kelas"
          ? `Kelas ${kelas}`
          : `Jenjang ${jenjang}`,
    });

    return res.status(201).json({
      success: true,
      message: isTunai
        ? `Pembayaran tunai berhasil dicatat lunas untuk ${targetSantri.length} santri.`
        : `Tagihan transfer berhasil dibuat untuk ${targetSantri.length} santri.`,
      data: {
        metode: metodePembayaran,
        status: statusPembayaran,
        tagihan: createdTagihan,
        pembayaran: createdPembayaran,
      },
    });
  } catch (error) {
    console.error("CREATE TAGIHAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat membuat tagihan.",
      error: error.message,
    });
  }
});

router.put("/pembayaran/cicilan/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_admin } = req.body;

    const { data: cicilan, error: cicilanError } = await supabase
      .from("pembayaran_cicilan")
      .select("*")
      .eq("id", id)
      .single();

    if (cicilanError || !cicilan) {
      return res.status(404).json({
        success: false,
        message: "Data cicilan tidak ditemukan.",
        error: cicilanError?.message,
      });
    }

    if (cicilan.status === "lunas") {
      return res.status(400).json({
        success: false,
        message: "Cicilan ini sudah diverifikasi.",
      });
    }

    const { data: pembayaran, error: pembayaranError } = await supabase
      .from("pembayaran")
      .select("*")
      .eq("id", cicilan.pembayaran_id)
      .single();

    if (pembayaranError || !pembayaran) {
      return res.status(404).json({
        success: false,
        message: "Data pembayaran utama tidak ditemukan.",
        error: pembayaranError?.message,
      });
    }

    await supabase
      .from("pembayaran_cicilan")
      .update({
        status: "lunas",
        verified_at: new Date().toISOString(),
        catatan_admin: catatan_admin || null,
      })
      .eq("id", id);

    const { data: cicilanLunas, error: totalError } = await supabase
      .from("pembayaran_cicilan")
      .select("nominal_cicilan")
      .eq("pembayaran_id", cicilan.pembayaran_id)
      .eq("status", "lunas");

    if (totalError) {
      return res.status(400).json({
        success: false,
        message: "Gagal menghitung total cicilan.",
        error: totalError.message,
      });
    }

    const totalDibayar = (cicilanLunas || []).reduce((sum, item) => {
      return sum + Number(item.nominal_cicilan || 0);
    }, 0);

    const nominalTagihan = Number(pembayaran.nominal || 0);
    const sudahLunas = totalDibayar >= nominalTagihan;
    const statusAkhir = sudahLunas ? "lunas" : "belum_bayar";

    await supabase
      .from("pembayaran")
      .update({
        nominal_dibayar: totalDibayar,
        status: statusAkhir,
        tanggal_bayar: sudahLunas ? new Date().toISOString() : null,
      })
      .eq("id", pembayaran.id);

    if (pembayaran.tagihan_id) {
      await supabase
        .from("tagihan")
        .update({
          nominal_dibayar: totalDibayar,
          status: statusAkhir,
          tanggal_bayar: sudahLunas ? new Date().toISOString() : null,
        })
        .eq("id", pembayaran.tagihan_id);
    }

    return res.json({
      success: true,
      message: sudahLunas
        ? "Cicilan diverifikasi. Tagihan sudah lunas."
        : "Cicilan diverifikasi. Tagihan masih belum lunas.",
      data: {
        total_dibayar: totalDibayar,
        nominal_tagihan: nominalTagihan,
        sisa: Math.max(nominalTagihan - totalDibayar, 0),
        status: statusAkhir,
      },
    });
  } catch (error) {
    console.error("VERIFY CICILAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat verifikasi cicilan.",
      error: error.message,
    });
  }
});

router.put("/pembayaran/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { tagihan_id, tanggal_bayar, admin_id, nama_admin } = req.body;

    const { data: pembayaranData } = await supabase
  .from("pembayaran")
  .select(`
    id,
    nominal,
    jenis,
    status,
    santri:santri_id (
      nama
    )
  `)
  .eq("id", id)
  .single();

    const { error: pembayaranError } = await supabase
      .from("pembayaran")
      .update({
        status: "lunas",
        tanggal_bayar: tanggal_bayar || new Date().toISOString(),
      })
      .eq("id", id);

    if (pembayaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal update pembayaran.",
        error: pembayaranError.message,
      });
    }

    if (tagihan_id) {
      const { error: tagihanError } = await supabase
        .from("tagihan")
        .update({
          status: "lunas",
        })
        .eq("id", tagihan_id);

      if (tagihanError) {
        return res.status(400).json({
          success: false,
          message: "Pembayaran lunas, tetapi update tagihan gagal.",
          error: tagihanError.message,
        });
      }
    }

    return res.json({
      success: true,
      message: "Pembayaran berhasil diverifikasi.",
    });
  } catch (error) {
    console.error("VERIFY PEMBAYARAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat verifikasi pembayaran.",
      error: error.message,
    });
  }
});

router.put("/pembayaran/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { tagihan_id, admin_id, nama_admin } = req.body;

    const { data: pembayaranData } = await supabase
      .from("pembayaran")
      .select(`
        id,
        nominal,
        jenis,
        status,
        santri:santri_id (
          nama
        )
      `)
      .eq("id", id)
      .single();

    const { error: pembayaranError } = await supabase
      .from("pembayaran")
      .update({
        status: "ditolak",
      })
      .eq("id", id);

    if (pembayaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal menolak pembayaran.",
        error: pembayaranError.message,
      });
    }

    if (tagihan_id) {
      await supabase
        .from("tagihan")
        .update({
          status: "ditolak",
        })
        .eq("id", tagihan_id);
    }

    await logAktivitasAdmin({
      admin_id,
      nama_admin: nama_admin || "Admin Pesantren",
      kategori: "pembayaran",
      aktivitas: "Menolak pembayaran",
      detail: `Admin menolak pembayaran ${
        pembayaranData?.jenis || "pembayaran"
      } sebesar Rp ${Number(pembayaranData?.nominal || 0).toLocaleString(
        "id-ID"
      )}.`,
      target_id: pembayaranData?.id || id,
      target_nama: pembayaranData?.santri?.nama || "Santri",
    });

    return res.json({
      success: true,
      message: "Pembayaran berhasil ditolak.",
    });
  } catch (error) {
    console.error("REJECT PEMBAYARAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menolak pembayaran.",
      error: error.message,
    });
  }
});

/* =========================================================
   DELETE PEMBAYARAN DITOLAK
   DELETE /api/admin/pembayaran/:id
========================================================= */

router.delete("/pembayaran/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: pembayaran, error: findError } = await supabase
      .from("pembayaran")
      .select("id, status, tagihan_id")
      .eq("id", id)
      .single();

    if (findError || !pembayaran) {
      return res.status(404).json({
        success: false,
        message: "Data pembayaran tidak ditemukan.",
        error: findError?.message,
      });
    }

    if (pembayaran.status !== "ditolak") {
      return res.status(400).json({
        success: false,
        message: "Hanya pembayaran yang ditolak yang boleh dihapus.",
      });
    }

    const { error: deleteError } = await supabase
      .from("pembayaran")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(400).json({
        success: false,
        message: "Gagal menghapus pembayaran.",
        error: deleteError.message,
      });
    }

    if (pembayaran.tagihan_id) {
      await supabase
        .from("tagihan")
        .update({ status: "belum_bayar" })
        .eq("id", pembayaran.tagihan_id);
    }

    return res.json({
      success: true,
      message: "Pembayaran ditolak berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE PEMBAYARAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menghapus pembayaran.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN PEMBERITAHUAN API
   Endpoint:
   GET    /api/admin/pemberitahuan
   GET    /api/admin/pemberitahuan/santri
   POST   /api/admin/pemberitahuan
   PUT    /api/admin/pemberitahuan/:id
   DELETE /api/admin/pemberitahuan/:id
========================================================= */

/* GET SEMUA PEMBERITAHUAN SANTRI */
router.get("/pemberitahuan", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pemberitahuan")
      .select("*, santri:target_santri_id(nama, jenjang, kelas)")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pemberitahuan.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil pemberitahuan.",
      error: error.message,
    });
  }
});

/* GET SANTRI AKTIF UNTUK TARGET PEMBERITAHUAN */
router.get("/pemberitahuan/santri", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("santri")
      .select("id, nama, jenjang, kelas, status")
      .eq("status", "aktif")
      .order("nama", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri aktif.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET SANTRI PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil santri.",
      error: error.message,
    });
  }
});

/* CREATE PEMBERITAHUAN */
router.post("/pemberitahuan", async (req, res) => {
  try {
    const {
      judul,
      isi,
      kategori,
      prioritas,
      target_type,
      target_jenjang,
      target_kelas,
      target_santri_id,
      status,
      admin_id,
      nama_admin,
    } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({
        success: false,
        message: "Judul dan isi pemberitahuan wajib diisi.",
      });
    }

    const payload = {
      judul,
      isi,
      kategori: kategori || "Umum",
      prioritas: prioritas || "normal",
      target_type: target_type || "semua",
      target_jenjang:
        target_type === "jenjang" || target_type === "kelas"
          ? target_jenjang || null
          : null,
      target_kelas: target_type === "kelas" ? target_kelas || null : null,
      target_santri_id:
        target_type === "santri" ? target_santri_id || null : null,
      status: status || "aktif",
    };

    const { data, error } = await supabase
      .from("pemberitahuan")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal membuat pemberitahuan.",
        error: error.message,
      });
    }

    await logAktivitasAdmin({
  admin_id,
  nama_admin: nama_admin || "Admin Pesantren",
  kategori: "pemberitahuan",
  aktivitas: "Membuat pemberitahuan",
  detail: `Admin membuat pemberitahuan berjudul "${judul}".`,
  target_id: target_santri_id || null,
  target_nama:
    target_type === "semua"
      ? "Semua Santri"
      : target_type === "jenjang"
      ? `Jenjang ${target_jenjang}`
      : target_type === "kelas"
      ? `Kelas ${target_kelas}`
      : "Santri tertentu",
});

    return res.status(201).json({
      success: true,
      message: "Pemberitahuan berhasil dikirim.",
      data,
    });
  } catch (error) {
    console.error("CREATE PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat membuat pemberitahuan.",
      error: error.message,
    });
  }
});

/* UPDATE PEMBERITAHUAN */
router.put("/pemberitahuan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      judul,
      isi,
      kategori,
      prioritas,
      target_type,
      target_jenjang,
      target_kelas,
      target_santri_id,
      status,
    } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({
        success: false,
        message: "Judul dan isi pemberitahuan wajib diisi.",
      });
    }

    const payload = {
      judul,
      isi,
      kategori: kategori || "Umum",
      prioritas: prioritas || "normal",
      target_type: target_type || "semua",
      target_jenjang:
        target_type === "jenjang" || target_type === "kelas"
          ? target_jenjang || null
          : null,
      target_kelas: target_type === "kelas" ? target_kelas || null : null,
      target_santri_id:
        target_type === "santri" ? target_santri_id || null : null,
      status: status || "aktif",
    };

    const { data, error } = await supabase
      .from("pemberitahuan")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupdate pemberitahuan.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Pemberitahuan berhasil diupdate.",
      data,
    });
  } catch (error) {
    console.error("UPDATE PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat update pemberitahuan.",
      error: error.message,
    });
  }
});

/* DELETE PEMBERITAHUAN */
router.delete("/pemberitahuan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("pemberitahuan")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal menghapus pemberitahuan.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Pemberitahuan berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat hapus pemberitahuan.",
      error: error.message,
    });
  }
});

/* =========================================================
   ADMIN LAPORAN API
   Endpoint:
   GET /api/admin/laporan?start=YYYY-MM-DD&end=YYYY-MM-DD
========================================================= */

router.get("/laporan", async (req, res) => {
  try {
    const { start, end } = req.query;

    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(end) : null;

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const filterByDate = (query, column = "created_at") => {
      if (startDate) {
        query = query.gte(column, startDate.toISOString());
      }

      if (endDate) {
        query = query.lte(column, endDate.toISOString());
      }

      return query;
    };

    /* ================= SANTRI ================= */

    const { data: santriAll, error: santriError } = await supabase
      .from("santri")
      .select("id, status, jenjang, kelas, jenis_kelamin, created_at");

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriError.message,
      });
    }

    const santri = santriAll || [];

    const santriAktif = santri.filter((s) => s.status === "aktif").length;
    const santriPending = santri.filter((s) => s.status === "pending").length;
    const santriDitolak = santri.filter((s) => s.status === "ditolak").length;

    const santriSMP = santri.filter((s) => s.jenjang === "SMP").length;
    const santriSMK = santri.filter((s) => s.jenjang === "SMK").length;
    const santriTakhassus = santri.filter(
      (s) => s.jenjang === "Takhassus"
    ).length;

    /* ================= PEMBAYARAN ================= */

    let pembayaranQuery = supabase
      .from("pembayaran")
      .select(`
        id,
        nominal,
        jenis,
        status,
        metode,
        tanggal_bayar,
        created_at,
        santri:santri_id (
          nama,
          nisn,
          kelas,
          jenjang
        )
      `)
      .order("created_at", { ascending: false });

    pembayaranQuery = filterByDate(pembayaranQuery, "created_at");

    const { data: pembayaranData, error: pembayaranError } =
      await pembayaranQuery;

    if (pembayaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pembayaran.",
        error: pembayaranError.message,
      });
    }

    const pembayaran = pembayaranData || [];

    const pembayaranLunas = pembayaran.filter(
      (p) => p.status === "lunas"
    ).length;

    const pembayaranPending = pembayaran.filter(
      (p) => p.status === "pending"
    ).length;

    const pembayaranDitolak = pembayaran.filter(
      (p) => p.status === "ditolak"
    ).length;

    const totalPemasukan = pembayaran
      .filter((p) => p.status === "lunas")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const totalMenunggu = pembayaran
      .filter((p) => p.status === "pending")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    /* ================= PENDAFTARAN PERIODE ================= */

    let pendaftaranQuery = supabase
      .from("santri")
      .select("id, nama, status, jenjang, kelas, created_at")
      .order("created_at", { ascending: false });

    pendaftaranQuery = filterByDate(pendaftaranQuery, "created_at");

    const { data: pendaftaranData, error: pendaftaranError } =
      await pendaftaranQuery;

    if (pendaftaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pendaftaran.",
        error: pendaftaranError.message,
      });
    }

    const pendaftaran = pendaftaranData || [];

    return res.json({
      success: true,
      data: {
        periode: {
          start: start || null,
          end: end || null,
        },

        santri: {
          total: santri.length,
          aktif: santriAktif,
          pending: santriPending,
          ditolak: santriDitolak,
          smp: santriSMP,
          smk: santriSMK,
          takhassus: santriTakhassus,
        },

        pembayaran: {
          total: pembayaran.length,
          lunas: pembayaranLunas,
          pending: pembayaranPending,
          ditolak: pembayaranDitolak,
          totalPemasukan,
          totalMenunggu,
          terbaru: pembayaran.slice(0, 20),
        },

        pendaftaran: {
          total: pendaftaran.length,
          terbaru: pendaftaran.slice(0, 20),
        },
      },
    });
  } catch (error) {
    console.error("GET LAPORAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil laporan.",
      error: error.message,
    });
  }
});

// GET semua pengajuan kelulusan untuk admin
router.get("/kelulusan", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("kelulusan_santri")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("GET ADMIN KELULUSAN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data kelulusan.",
        error: error.message,
      });
    }

    const santriIds = [...new Set((data || []).map((item) => item.santri_id).filter(Boolean))];
    const guruIds = [...new Set((data || []).map((item) => item.guru_id).filter(Boolean))];
    const kelasIds = [...new Set((data || []).map((item) => item.kelas_id).filter(Boolean))];

    const kelasTujuanIds = [
  ...new Set((data || []).map((item) => item.kelas_tujuan_id).filter(Boolean)),
];

    const { data: santriList } = santriIds.length
      ? await supabase.from("santri").select("*").in("id", santriIds)
      : { data: [] };

    const { data: guruList } = guruIds.length
      ? await supabase.from("guru").select("*").in("id", guruIds)
      : { data: [] };

    const { data: kelasList } = kelasIds.length
      ? await supabase.from("kelas").select("*").in("id", kelasIds)
      : { data: [] };

      const { data: kelasTujuanList } = kelasTujuanIds.length
  ? await supabase.from("kelas").select("*").in("id", kelasTujuanIds)
  : { data: [] };

    const santriMap = new Map((santriList || []).map((item) => [item.id, item]));
    const guruMap = new Map((guruList || []).map((item) => [item.id, item]));
    const kelasMap = new Map((kelasList || []).map((item) => [item.id, item]));
const kelasTujuanMap = new Map(
  (kelasTujuanList || []).map((item) => [item.id, item])
);

    const mapped = (data || []).map((item) => {
      const santri = santriMap.get(item.santri_id);
      const guru = guruMap.get(item.guru_id);
      const kelas = kelasMap.get(item.kelas_id);
const kelasTujuan = kelasTujuanMap.get(item.kelas_tujuan_id);

      return {
        ...item,
        santri: santri || null,
        guru: guru || null,
        kelas: kelas || null,
        kelas_tujuan: kelasTujuan || null,
status_kenaikan: item.status_kenaikan || "belum_diproses",
        nama_santri: santri?.nama || "-",
        nis: santri?.nis || santri?.nisn || "-",
        nama_guru: guru?.nama || "-",
        nama_kelas:
          kelas?.nama_kelas ||
          kelas?.kelas ||
          santri?.kelas ||
          "-",
      };
    });

    return res.json({
      success: true,
      message: "Data kelulusan berhasil diambil.",
      data: mapped,
    });
  } catch (error) {
    console.error("ADMIN KELULUSAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

// POST verifikasi kelulusan oleh admin
router.post("/kelulusan/:id/verifikasi", async (req, res) => {
  try {
    const { id } = req.params;
    const { status_verifikasi, catatan_admin } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID kelulusan wajib dikirim.",
      });
    }

    if (!["disetujui", "ditolak"].includes(status_verifikasi)) {
      return res.status(400).json({
        success: false,
        message: "Status verifikasi tidak valid.",
      });
    }

    const { data, error } = await supabase
      .from("kelulusan_santri")
      .update({
        status_verifikasi,
        catatan_admin: catatan_admin || "",
        verified_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("VERIFIKASI KELULUSAN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal memverifikasi data kelulusan.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message:
        status_verifikasi === "disetujui"
          ? "Kelulusan berhasil disetujui."
          : "Kelulusan berhasil ditolak.",
      data,
    });
  } catch (error) {
    console.error("ADMIN VERIFIKASI KELULUSAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.post("/kelulusan/:id/proses-kelas", async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_user_id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID kelulusan wajib dikirim.",
      });
    }

    const { data: kelulusan, error: kelulusanError } = await supabase
      .from("kelulusan_santri")
      .select("*")
      .eq("id", id)
      .single();

    if (kelulusanError || !kelulusan) {
      return res.status(404).json({
        success: false,
        message: "Data kelulusan tidak ditemukan.",
        error: kelulusanError?.message,
      });
    }

    if (kelulusan.status_verifikasi !== "disetujui") {
      return res.status(400).json({
        success: false,
        message: "Kelulusan harus disetujui admin terlebih dahulu.",
      });
    }

    if (kelulusan.status_kenaikan !== "belum_diproses") {
      return res.status(400).json({
        success: false,
        message: "Proses kelas untuk data ini sudah pernah dijalankan.",
      });
    }

    const { data: santri, error: santriError } = await supabase
      .from("santri")
      .select("*")
      .eq("id", kelulusan.santri_id)
      .single();

    if (santriError || !santri) {
      return res.status(404).json({
        success: false,
        message: "Data santri tidak ditemukan.",
        error: santriError?.message,
      });
    }

  const { data: kelasSiswaList, error: kelasSiswaError } = await supabase
  .from("kelas_siswa")
  .select("*")
  .eq("santri_id", kelulusan.santri_id)
  .order("created_at", { ascending: false })
  .limit(1);

if (kelasSiswaError) {
  return res.status(500).json({
    success: false,
    message: "Gagal mengecek relasi kelas_siswa santri.",
    error: kelasSiswaError.message,
  });
}

const kelasSiswa = kelasSiswaList?.[0] || null;

if (kelasSiswaError) {
  return res.status(500).json({
    success: false,
    message: "Gagal mengecek relasi kelas_siswa santri.",
    error: kelasSiswaError.message,
  });
}

/*
  Jika data kelas_siswa belum ada, gunakan kelas_id dari kelulusan_santri.
  Ini penting untuk data lama yang belum punya relasi kelas_siswa.
*/
const kelasAsalId = kelasSiswa?.kelas_id || kelulusan.kelas_id || null;

if (!kelasAsalId) {
  return res.status(404).json({
    success: false,
    message:
      "Kelas asal santri tidak ditemukan. Pastikan data kelulusan memiliki kelas_id atau santri sudah masuk ke kelas_siswa.",
  });
}

const { data: kelasAsal, error: kelasAsalError } = await supabase
  .from("kelas")
  .select("*")
  .eq("id", kelasAsalId)
  .single();

    if (kelasAsalError || !kelasAsal) {
      return res.status(404).json({
        success: false,
        message: "Data kelas asal tidak ditemukan.",
        error: kelasAsalError?.message,
      });
    }

    const jenjangRaw = String(kelasAsal.jenjang || santri.jenjang || "").toLowerCase();
    const tingkat = Number(kelasAsal.tingkat);

    const batasAkhir = ["smp", "mts"].includes(jenjangRaw)
      ? 9
      : ["sma", "smk", "ma"].includes(jenjangRaw)
      ? 12
      : null;

    if (!batasAkhir || !tingkat) {
      return res.status(400).json({
        success: false,
        message: "Jenjang atau tingkat kelas tidak valid untuk diproses.",
      });
    }

    const now = new Date().toISOString();

    // =========================
    // JIKA TIDAK LULUS
    // =========================
    if (kelulusan.status_kelulusan === "tidak_lulus") {
      const { error: updateKelulusanError } = await supabase
        .from("kelulusan_santri")
        .update({
          kelas_tujuan_id: kelasAsal.id,
          status_kenaikan: "tinggal_kelas",
          processed_at: now,
          processed_by: admin_user_id || null,
        })
        .eq("id", id);

      if (updateKelulusanError) {
        return res.status(500).json({
          success: false,
          message: "Gagal memperbarui status tinggal kelas.",
          error: updateKelulusanError.message,
        });
      }

      if (!kelasSiswa?.id) {
  const { error: insertKelasSiswaError } = await supabase
    .from("kelas_siswa")
    .insert([
      {
        santri_id: santri.id,
        kelas_id: kelasAsal.id,
      },
    ]);

  if (insertKelasSiswaError) {
    return res.status(500).json({
      success: false,
      message: "Gagal membuat relasi kelas_siswa untuk santri tidak lulus.",
      error: insertKelasSiswaError.message,
    });
  }
}

      await supabase.from("riwayat_kelas_santri").insert({
        santri_id: santri.id,
        kelas_asal_id: kelasAsal.id,
        kelas_tujuan_id: kelasAsal.id,
        aksi: "tinggal_kelas",
        kelulusan_id: kelulusan.id,
        diproses_oleh: admin_user_id || null,
      });

      return res.json({
        success: true,
        message: "Santri ditetapkan tinggal di kelas saat ini.",
      });
    }

    // =========================
    // JIKA LULUS DAN KELAS AKHIR
    // =========================
    if (tingkat >= batasAkhir) {
      const { error: updateSantriError } = await supabase
        .from("santri")
        .update({
          status: "lulus",
          updated_at: now,
        })
        .eq("id", santri.id);

      if (updateSantriError) {
        return res.status(500).json({
          success: false,
          message: "Gagal memperbarui status santri.",
          error: updateSantriError.message,
        });
      }

      const { error: updateKelulusanError } = await supabase
        .from("kelulusan_santri")
        .update({
          kelas_tujuan_id: null,
          status_kenaikan: "lulus_akhir",
          processed_at: now,
          processed_by: admin_user_id || null,
        })
        .eq("id", id);

      if (updateKelulusanError) {
        return res.status(500).json({
          success: false,
          message: "Gagal memperbarui status lulus akhir.",
          error: updateKelulusanError.message,
        });
      }

      await supabase.from("riwayat_kelas_santri").insert({
        santri_id: santri.id,
        kelas_asal_id: kelasAsal.id,
        kelas_tujuan_id: null,
        aksi: "lulus_akhir",
        kelulusan_id: kelulusan.id,
        diproses_oleh: admin_user_id || null,
      });

      return res.json({
        success: true,
        message: "Santri lulus akhir jenjang.",
      });
    }

    // =========================
    // JIKA LULUS DAN NAIK KELAS
    // =========================
    const tingkatTujuan = tingkat + 1;

    let kelasTujuan = null;

const { data: kelasTujuanList, error: kelasTujuanError } = await supabase
  .from("kelas")
  .select("*")
  .eq("jenjang", kelasAsal.jenjang)
  .eq("tingkat", String(tingkatTujuan))
  .eq("status", "aktif")
  .limit(1);

if (kelasTujuanError) {
  return res.status(500).json({
    success: false,
    message: "Gagal mencari kelas tujuan.",
    error: kelasTujuanError.message,
  });
}

kelasTujuan = kelasTujuanList?.[0] || null;

/*
  Jika kelas tujuan belum ada,
  sistem otomatis membuat kelas baru.
  Contoh:
  SMP kelas 7 -> dibuat SMP Kelas 8
  SMK kelas 10 RPL -> dibuat SMK Kelas 11 RPL
*/
if (!kelasTujuan) {
  const namaKelasTujuan = kelasAsal.jurusan
    ? `${kelasAsal.jenjang} Kelas ${tingkatTujuan} ${kelasAsal.jurusan}`
    : `${kelasAsal.jenjang} Kelas ${tingkatTujuan}`;

  const { data: kelasBaru, error: createKelasError } = await supabase
    .from("kelas")
    .insert([
      {
        jenjang: kelasAsal.jenjang,
        nama_kelas: namaKelasTujuan,
        tingkat: String(tingkatTujuan),
        jurusan: kelasAsal.jurusan || null,
        wali_guru_id: null,
        tahun_ajaran: kelasAsal.tahun_ajaran || null,
        semester: kelasAsal.semester || null,
        deskripsi: `Kelas otomatis dibuat dari proses kenaikan kelas.`,
        status: "aktif",
      },
    ])
    .select("*")
    .single();

  if (createKelasError) {
    return res.status(500).json({
      success: false,
      message: `Kelas tujuan tingkat ${tingkatTujuan} belum ada dan gagal dibuat otomatis.`,
      error: createKelasError.message,
    });
  }

  kelasTujuan = kelasBaru;
}

    let updateKelasSiswaError = null;

if (kelasSiswa?.id) {
  const { error } = await supabase
    .from("kelas_siswa")
    .update({
      kelas_id: kelasTujuan.id,
    })
    .eq("id", kelasSiswa.id);

  updateKelasSiswaError = error;
} else {
  const { error } = await supabase.from("kelas_siswa").insert([
    {
      santri_id: santri.id,
      kelas_id: kelasTujuan.id,
    },
  ]);

  updateKelasSiswaError = error;
}

if (updateKelasSiswaError) {
  return res.status(500).json({
    success: false,
    message: "Gagal memperbarui atau membuat relasi kelas_siswa.",
    error: updateKelasSiswaError.message,
  });
}

const labelKelasTujuan =
  kelasTujuan.nama_kelas ||
  `${kelasTujuan.jenjang || ""} kelas ${kelasTujuan.tingkat || ""}`.trim();

const { error: updateSantriError } = await supabase
  .from("santri")
  .update({
    kelas: String(tingkatTujuan),
    jenjang: kelasTujuan.jenjang || santri.jenjang,
    updated_at: now,
  })
  .eq("id", santri.id);
  
if (updateSantriError) {
  return res.status(500).json({
    success: false,
    message: "Gagal memperbarui data kelas di tabel santri.",
    error: updateSantriError.message,
  });
}

const { error: updateKelulusanError } = await supabase
      .from("kelulusan_santri")
      .update({
        kelas_tujuan_id: kelasTujuan.id,
        status_kenaikan: "naik_kelas",
        processed_at: now,
        processed_by: admin_user_id || null,
      })
      .eq("id", id);

    if (updateKelulusanError) {
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui status kenaikan kelas.",
        error: updateKelulusanError.message,
      });
    }

    await supabase.from("riwayat_kelas_santri").insert({
      santri_id: santri.id,
      kelas_asal_id: kelasAsal.id,
      kelas_tujuan_id: kelasTujuan.id,
      aksi: "naik_kelas",
      kelulusan_id: kelulusan.id,
      diproses_oleh: admin_user_id || null,
    });

    return res.json({
      success: true,
      message: `Santri berhasil dinaikkan ke ${labelKelasTujuan}.`,
    });
  } catch (error) {
    console.error("PROSES NAIK KELAS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses kenaikan kelas.",
      error: error.message,
    });
  }
});

export default router;