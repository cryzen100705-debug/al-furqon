import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* =========================================================
   OWNER DASHBOARD API
   GET /api/owner/dashboard
========================================================= */

router.get("/dashboard", async (req, res) => {
  try {
    const { data: santriData, error: santriError } = await supabase
      .from("santri")
      .select("id, nama, status, jenjang, kelas, jenis_kelamin, created_at");

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriError.message,
      });
    }

    const { data: pembayaranData, error: pembayaranError } = await supabase
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
          id,
          nama,
          nisn,
          kelas,
          jenjang
        )
      `)
      .order("created_at", { ascending: false });

    if (pembayaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pembayaran.",
        error: pembayaranError.message,
      });
    }

    const { data: pemberitahuanData, error: pemberitahuanError } =
      await supabase
        .from("pemberitahuan")
        .select("id, judul, status, prioritas, created_at")
        .order("created_at", { ascending: false });

    if (pemberitahuanError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pemberitahuan.",
        error: pemberitahuanError.message,
      });
    }

    const santri = santriData || [];
    const pembayaran = pembayaranData || [];
    const pemberitahuan = pemberitahuanData || [];

    const now = new Date();

    const isThisMonth = (date) => {
      if (!date) return false;

      const d = new Date(date);

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    };

    const totalPemasukan = pembayaran
      .filter((item) => item.status === "lunas")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const pemasukanBulanIni = pembayaran
      .filter((item) => item.status === "lunas")
      .filter((item) => isThisMonth(item.tanggal_bayar || item.created_at))
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const nominalPending = pembayaran
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    return res.json({
      success: true,
      data: {
        santri: {
          total: santri.length,
          aktif: santri.filter((item) => item.status === "aktif").length,
          pending: santri.filter((item) => item.status === "pending").length,
          ditolak: santri.filter((item) => item.status === "ditolak").length,
          putra: santri.filter((item) => item.jenis_kelamin === "Laki-laki")
            .length,
          putri: santri.filter((item) => item.jenis_kelamin === "Perempuan")
            .length,
          smp: santri.filter((item) => item.jenjang === "SMP").length,
          smk: santri.filter((item) => item.jenjang === "SMK").length,
          takhassus: santri.filter((item) => item.jenjang === "Takhassus")
            .length,
        },

        pembayaran: {
          total: pembayaran.length,
          lunas: pembayaran.filter((item) => item.status === "lunas").length,
          pending: pembayaran.filter((item) => item.status === "pending")
            .length,
          ditolak: pembayaran.filter((item) => item.status === "ditolak")
            .length,
          totalPemasukan,
          pemasukanBulanIni,
          nominalPending,
          terbaru: pembayaran.slice(0, 8),
        },

        pemberitahuan: {
          total: pemberitahuan.length,
          aktif: pemberitahuan.filter((item) => item.status === "aktif")
            .length,
          penting: pemberitahuan.filter((item) => item.prioritas === "penting")
            .length,
          terbaru: pemberitahuan.slice(0, 5),
        },
      },
    });
  } catch (error) {
    console.error("OWNER DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil dashboard owner.",
      error: error.message,
    });
  }
});

/* =========================================================
   OWNER KEUANGAN API
   GET /api/owner/keuangan
========================================================= */

router.get("/keuangan", async (req, res) => {
  try {
    const { status, jenis, start, end } = req.query;

    let query = supabase
      .from("pembayaran")
      .select(`
        id,
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
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (jenis) {
      query = query.eq("jenis", jenis);
    }

    if (start) {
      query = query.gte("created_at", new Date(start).toISOString());
    }

    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data keuangan owner.",
        error: error.message,
      });
    }

    const list = data || [];

    const totalPemasukan = list
      .filter((item) => item.status === "lunas")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const totalPending = list
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const totalDitolak = list
      .filter((item) => item.status === "ditolak")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const jenisPembayaran = [
      ...new Set(list.map((item) => item.jenis).filter(Boolean)),
    ];

    return res.json({
      success: true,
      data: {
        totalTransaksi: list.length,
        totalPemasukan,
        totalPending,
        totalDitolak,
        lunas: list.filter((item) => item.status === "lunas").length,
        pending: list.filter((item) => item.status === "pending").length,
        ditolak: list.filter((item) => item.status === "ditolak").length,
        jenisPembayaran,
        transaksi: list,
      },
    });
  } catch (error) {
    console.error("OWNER KEUANGAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data keuangan owner.",
      error: error.message,
    });
  }
});

/* =========================================================
   OWNER SANTRI API
   GET /api/owner/santri
========================================================= */

router.get("/santri", async (req, res) => {
  try {
    const { status, jenjang, kelas, gender } = req.query;

    let query = supabase
      .from("santri")
      .select(`
        id,
        user_id,
        nama,
        nisn,
        nik,
        jenis_kelamin,
        jenjang,
        kelas,
        status,
        foto,
        alamat,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (jenjang) {
      query = query.eq("jenjang", jenjang);
    }

    if (kelas) {
      query = query.eq("kelas", kelas);
    }

    if (gender) {
      query = query.eq("jenis_kelamin", gender);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri owner.",
        error: error.message,
      });
    }

    const list = data || [];

    const jenjangList = [
      ...new Set(list.map((item) => item.jenjang).filter(Boolean)),
    ];

    const kelasList = [
      ...new Set(list.map((item) => item.kelas).filter(Boolean)),
    ];

    return res.json({
      success: true,
      data: {
        total: list.length,
        aktif: list.filter((item) => item.status === "aktif").length,
        pending: list.filter((item) => item.status === "pending").length,
        ditolak: list.filter((item) => item.status === "ditolak").length,
        putra: list.filter((item) => item.jenis_kelamin === "Laki-laki").length,
        putri: list.filter((item) => item.jenis_kelamin === "Perempuan").length,
        smp: list.filter((item) => item.jenjang === "SMP").length,
        smk: list.filter((item) => item.jenjang === "SMK").length,
        takhassus: list.filter((item) => item.jenjang === "Takhassus").length,
        jenjangList,
        kelasList,
        santri: list,
      },
    });
  } catch (error) {
    console.error("OWNER SANTRI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data santri owner.",
      error: error.message,
    });
  }
});

/* =========================================================
   OWNER LAPORAN API
   GET /api/owner/laporan?start=YYYY-MM-DD&end=YYYY-MM-DD
========================================================= */

router.get("/laporan", async (req, res) => {
  try {
    const { start, end } = req.query;

    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(end) : null;

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const filterDate = (query, column = "created_at") => {
      if (startDate) query = query.gte(column, startDate.toISOString());
      if (endDate) query = query.lte(column, endDate.toISOString());
      return query;
    };

    const { data: santriData, error: santriError } = await supabase
      .from("santri")
      .select("id, nama, status, jenjang, kelas, jenis_kelamin, created_at")
      .order("created_at", { ascending: false });

    if (santriError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriError.message,
      });
    }

    let pendaftaranQuery = supabase
      .from("santri")
      .select("id, nama, status, jenjang, kelas, jenis_kelamin, created_at")
      .order("created_at", { ascending: false });

    pendaftaranQuery = filterDate(pendaftaranQuery, "created_at");

    const { data: pendaftaranData, error: pendaftaranError } =
      await pendaftaranQuery;

    if (pendaftaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pendaftaran.",
        error: pendaftaranError.message,
      });
    }

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
          id,
          nama,
          nisn,
          kelas,
          jenjang
        )
      `)
      .order("created_at", { ascending: false });

    pembayaranQuery = filterDate(pembayaranQuery, "created_at");

    const { data: pembayaranData, error: pembayaranError } =
      await pembayaranQuery;

    if (pembayaranError) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil data pembayaran.",
        error: pembayaranError.message,
      });
    }

    const santri = santriData || [];
    const pendaftaran = pendaftaranData || [];
    const pembayaran = pembayaranData || [];

    const totalPemasukan = pembayaran
      .filter((item) => item.status === "lunas")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const totalPending = pembayaran
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    const totalDitolak = pembayaran
      .filter((item) => item.status === "ditolak")
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    return res.json({
      success: true,
      data: {
        periode: {
          start: start || null,
          end: end || null,
        },

        santri: {
          total: santri.length,
          aktif: santri.filter((item) => item.status === "aktif").length,
          pending: santri.filter((item) => item.status === "pending").length,
          ditolak: santri.filter((item) => item.status === "ditolak").length,
          putra: santri.filter((item) => item.jenis_kelamin === "Laki-laki")
            .length,
          putri: santri.filter((item) => item.jenis_kelamin === "Perempuan")
            .length,
          smp: santri.filter((item) => item.jenjang === "SMP").length,
          smk: santri.filter((item) => item.jenjang === "SMK").length,
          takhassus: santri.filter((item) => item.jenjang === "Takhassus")
            .length,
        },

        pendaftaran: {
          total: pendaftaran.length,
          aktif: pendaftaran.filter((item) => item.status === "aktif").length,
          pending: pendaftaran.filter((item) => item.status === "pending")
            .length,
          ditolak: pendaftaran.filter((item) => item.status === "ditolak")
            .length,
          terbaru: pendaftaran.slice(0, 20),
        },

        pembayaran: {
          total: pembayaran.length,
          lunas: pembayaran.filter((item) => item.status === "lunas").length,
          pending: pembayaran.filter((item) => item.status === "pending")
            .length,
          ditolak: pembayaran.filter((item) => item.status === "ditolak")
            .length,
          totalPemasukan,
          totalPending,
          totalDitolak,
          terbaru: pembayaran.slice(0, 30),
        },
      },
    });
  } catch (error) {
    console.error("OWNER LAPORAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil laporan owner.",
      error: error.message,
    });
  }
});

/* =========================================================
   OWNER AKTIVITAS ADMIN API
   GET /api/owner/aktivitas?kategori=santri&start=YYYY-MM-DD&end=YYYY-MM-DD
========================================================= */

router.get("/aktivitas", async (req, res) => {
  try {
    const { kategori, start, end } = req.query;

    let query = supabase
      .from("aktivitas_admin")
      .select(`
        id,
        admin_id,
        nama_admin,
        kategori,
        aktivitas,
        detail,
        target_id,
        target_nama,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (start) {
      query = query.gte("created_at", new Date(start).toISOString());
    }

    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengambil aktivitas admin.",
        error: error.message,
      });
    }

    const list = data || [];

    const kategoriList = [
      ...new Set(list.map((item) => item.kategori).filter(Boolean)),
    ];

    const hariIni = new Date();
    const isToday = (date) => {
      if (!date) return false;

      const d = new Date(date);

      return (
        d.getDate() === hariIni.getDate() &&
        d.getMonth() === hariIni.getMonth() &&
        d.getFullYear() === hariIni.getFullYear()
      );
    };

    return res.json({
      success: true,
      data: {
        total: list.length,
        hariIni: list.filter((item) => isToday(item.created_at)).length,
        santri: list.filter((item) => item.kategori === "santri").length,
        pembayaran: list.filter((item) => item.kategori === "pembayaran").length,
        pemberitahuan: list.filter((item) => item.kategori === "pemberitahuan")
          .length,
        sistem: list.filter((item) => item.kategori === "sistem").length,
        kategoriList,
        aktivitas: list,
      },
    });
  } catch (error) {
    console.error("OWNER AKTIVITAS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil aktivitas admin.",
      error: error.message,
    });
  }
});


export default router;