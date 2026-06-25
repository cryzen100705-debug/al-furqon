import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const cleanText = (value) => String(value || "").trim();

/* =========================================================
   SYNC GURU DARI DATA KELAS
   - wali_kelas diambil dari kelas.wali_guru_id
   - mapel diambil dari semua kelas_mapel.guru_id
   - tidak menimpa mapel lama, tapi menggabungkan semua mapel guru
========================================================= */

const syncGuruDariKelas = async () => {
  const { data: guruList, error: guruError } = await supabase
    .from("guru")
    .select("id");

  if (guruError) {
    throw new Error(guruError.message);
  }

  const { data: kelasList, error: kelasError } = await supabase
    .from("kelas")
    .select("id, nama_kelas, jenjang, tingkat, wali_guru_id")
    .not("wali_guru_id", "is", null);

  if (kelasError) {
    throw new Error(kelasError.message);
  }

  const { data: kelasMapelList, error: mapelError } = await supabase
    .from("kelas_mapel")
    .select("id, nama_mapel, guru_id")
    .not("guru_id", "is", null);

  if (mapelError) {
    throw new Error(mapelError.message);
  }

  const waliByGuru = {};
  const mapelByGuru = {};

  for (const kelas of kelasList || []) {
    const guruId = cleanText(kelas.wali_guru_id);

    if (!guruId) continue;

    const namaKelas =
      kelas.nama_kelas ||
      `${kelas.jenjang || ""} Kelas ${kelas.tingkat || ""}`.trim();

    if (!waliByGuru[guruId]) {
      waliByGuru[guruId] = [];
    }

    if (namaKelas) {
      waliByGuru[guruId].push(namaKelas);
    }
  }

  for (const mapel of kelasMapelList || []) {
    const guruId = cleanText(mapel.guru_id);
    const namaMapel = cleanText(mapel.nama_mapel);

    if (!guruId || !namaMapel) continue;

    if (!mapelByGuru[guruId]) {
      mapelByGuru[guruId] = [];
    }

    mapelByGuru[guruId].push(namaMapel);
  }

  for (const guru of guruList || []) {
    const guruId = guru.id;

    const waliKelas = [...new Set(waliByGuru[guruId] || [])].join(", ");
    const mapel = [...new Set(mapelByGuru[guruId] || [])].join(", ");

    const { error: updateGuruError } = await supabase
      .from("guru")
      .update({
        wali_kelas: waliKelas || null,
        mapel: mapel || null,
      })
      .eq("id", guruId);

    if (updateGuruError) {
      throw new Error(updateGuruError.message);
    }
  }
};

function toMinutes(time) {
  if (!time) return null;

  const [hour, minute] = String(time).split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return hour * 60 + minute;
}

function isOverlap(startA, endA, startB, endB) {
  const aStart = toMinutes(startA);
  const aEnd = toMinutes(endA);
  const bStart = toMinutes(startB);
  const bEnd = toMinutes(endB);

  if (aStart === null || aEnd === null || bStart === null || bEnd === null) {
    return false;
  }

  return aStart < bEnd && bStart < aEnd;
}

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
        message: "Hanya admin yang boleh mengelola data kelas.",
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

async function getRuangName(ruang_id) {
  if (!ruang_id) return null;

  const { data, error } = await supabase
    .from("ruang")
    .select("nama_ruang")
    .eq("id", ruang_id)
    .single();

  if (error || !data) return null;

  return data.nama_ruang || null;
}

async function validateJadwalBentrok({
  kelasId = null,
  tahun_ajaran,
  semester,
  mapelList = [],
}) {
  const validPayload = mapelList.filter(
    (item) => item.nama_mapel && item.hari && item.jam_mulai && item.jam_selesai
  );

  for (const item of validPayload) {
    const mulai = toMinutes(item.jam_mulai);
    const selesai = toMinutes(item.jam_selesai);

    if (mulai === null || selesai === null) {
      return {
        valid: false,
        message: `Format jam pada mapel ${item.nama_mapel} tidak valid.`,
      };
    }

    if (selesai <= mulai) {
      return {
        valid: false,
        message: `Jam selesai pada mapel ${item.nama_mapel} harus lebih besar dari jam mulai.`,
      };
    }
  }

  for (let i = 0; i < validPayload.length; i++) {
    for (let j = i + 1; j < validPayload.length; j++) {
      const a = validPayload[i];
      const b = validPayload[j];

      if (
        a.hari === b.hari &&
        isOverlap(a.jam_mulai, a.jam_selesai, b.jam_mulai, b.jam_selesai)
      ) {
        return {
          valid: false,
          message: `Jadwal bentrok dalam kelas yang sama: ${a.nama_mapel} dan ${b.nama_mapel} pada ${a.hari}.`,
        };
      }

      if (
        a.guru_id &&
        b.guru_id &&
        a.guru_id === b.guru_id &&
        a.hari === b.hari &&
        isOverlap(a.jam_mulai, a.jam_selesai, b.jam_mulai, b.jam_selesai)
      ) {
        return {
          valid: false,
          message: `Guru yang sama memiliki jadwal bentrok pada ${a.hari}.`,
        };
      }

      if (
        a.ruang_id &&
        b.ruang_id &&
        a.ruang_id === b.ruang_id &&
        a.hari === b.hari &&
        isOverlap(a.jam_mulai, a.jam_selesai, b.jam_mulai, b.jam_selesai)
      ) {
        return {
          valid: false,
          message: `Ruang yang sama memiliki jadwal bentrok pada ${a.hari}.`,
        };
      }
    }
  }

  let kelasQuery = supabase
    .from("kelas")
    .select("id, nama_kelas, tahun_ajaran, semester");

  if (tahun_ajaran) {
    kelasQuery = kelasQuery.eq("tahun_ajaran", tahun_ajaran);
  }

  if (semester) {
    kelasQuery = kelasQuery.eq("semester", semester);
  }

  const { data: kelasData, error: kelasError } = await kelasQuery;

  if (kelasError) {
    return {
      valid: false,
      message: "Gagal memvalidasi jadwal kelas.",
    };
  }

  const kelasIds = (kelasData || [])
    .filter((kelas) => kelas.id !== kelasId)
    .map((kelas) => kelas.id);

  if (kelasIds.length === 0) {
    return { valid: true };
  }

  const { data: existingMapel, error: mapelError } = await supabase
    .from("kelas_mapel")
    .select(
      `
      id,
      kelas_id,
      nama_mapel,
      guru_id,
      hari,
      jam_mulai,
      jam_selesai,
      ruang_id,
      ruang,
      kelas:kelas_id (
        id,
        nama_kelas
      ),
      guru:guru_id (
        id,
        nama
      )
    `
    )
    .in("kelas_id", kelasIds);

  if (mapelError) {
    return {
      valid: false,
      message: "Gagal memeriksa jadwal yang sudah ada.",
    };
  }

  for (const incoming of validPayload) {
    for (const existing of existingMapel || []) {
      if (incoming.hari !== existing.hari) continue;

      const bentrokWaktu = isOverlap(
        incoming.jam_mulai,
        incoming.jam_selesai,
        existing.jam_mulai,
        existing.jam_selesai
      );

      if (!bentrokWaktu) continue;

      if (incoming.guru_id && incoming.guru_id === existing.guru_id) {
        return {
          valid: false,
          message: `Jadwal bentrok. Guru ${
            existing.guru?.nama || ""
          } sudah mengajar ${existing.nama_mapel} di ${
            existing.kelas?.nama_kelas || "kelas lain"
          } pada ${existing.hari}, ${existing.jam_mulai} - ${
            existing.jam_selesai
          }.`,
        };
      }

      if (incoming.ruang_id && incoming.ruang_id === existing.ruang_id) {
        return {
          valid: false,
          message: `Jadwal bentrok. Ruang ${
            existing.ruang || "tersebut"
          } sudah dipakai di ${
            existing.kelas?.nama_kelas || "kelas lain"
          } pada ${existing.hari}, ${existing.jam_mulai} - ${
            existing.jam_selesai
          }.`,
        };
      }
    }
  }

  return { valid: true };
}

router.get("/kelas/options", verifyAdmin, async (req, res) => {
  try {
    const [guruResult, ruangResult, santriResult] = await Promise.all([
      supabase
        .from("guru")
        .select("id, nama, mapel, no_hp, status")
        .order("nama", { ascending: true }),

      supabase
        .from("ruang")
        .select("id, nama_ruang, lokasi, kapasitas, status")
        .order("nama_ruang", { ascending: true }),

      supabase
        .from("santri")
        .select("id, nama, jenjang, kelas, jurusan, status")
        .eq("status", "aktif")
        .order("nama", { ascending: true }),
    ]);

    if (guruResult.error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data guru.",
        error: guruResult.error.message,
      });
    }

    if (ruangResult.error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data ruang.",
        error: ruangResult.error.message,
      });
    }

    if (santriResult.error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriResult.error.message,
      });
    }

    return res.json({
      success: true,
      message: "Data pilihan berhasil diambil.",
      data: {
        guru: guruResult.data || [],
        ruang: ruangResult.data || [],
        santri: santriResult.data || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data pilihan.",
      error: error.message,
    });
  }
});

router.get("/kelas", verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("kelas")
      .select(
        `
        id,
        jenjang,
        nama_kelas,
        tingkat,
        jurusan,
        wali_guru_id,
        tahun_ajaran,
        semester,
        deskripsi,
        status,
        created_at,
        wali:guru!kelas_wali_guru_id_fkey (
          id,
          nama,
          mapel,
          no_hp
        ),
        kelas_mapel (
          id,
          nama_mapel,
          guru_id,
          hari,
          jam_mulai,
          jam_selesai,
          ruang_id,
          ruang,
          jam_per_minggu,
          status,
          keterangan,
          guru:guru_id (
            id,
            nama,
            mapel,
            no_hp
          ),
          ruang_detail:ruang_id (
            id,
            nama_ruang,
            lokasi
          )
        ),
        kelas_siswa (
          id,
          santri_id,
          santri:santri_id (
            id,
            nama,
            jenjang,
            kelas,
            jurusan,
            status
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data kelas.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Data kelas berhasil diambil.",
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

router.post("/ruang", verifyAdmin, async (req, res) => {
  try {
    const { nama_ruang, lokasi, kapasitas, status } = req.body;

    if (!nama_ruang) {
      return res.status(400).json({
        success: false,
        message: "Nama ruang wajib diisi.",
      });
    }

    const { data, error } = await supabase
      .from("ruang")
      .insert([
        {
          nama_ruang,
          lokasi: lokasi || null,
          kapasitas: Number(kapasitas || 0),
          status: status || "aktif",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menambahkan ruang.",
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Ruang berhasil ditambahkan.",
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

router.delete("/ruang/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("ruang").delete().eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus ruang.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Ruang berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

async function insertMapel(kelasId, mapelList = []) {
  const validMapel = [];

  for (const item of mapelList) {
    if (!item.nama_mapel) continue;

    const ruangName = item.ruang_id
      ? await getRuangName(item.ruang_id)
      : item.ruang || null;

    validMapel.push({
      kelas_id: kelasId,
      nama_mapel: item.nama_mapel,
      guru_id: item.guru_id || null,
      hari: item.hari || null,
      jam_mulai: item.jam_mulai || null,
      jam_selesai: item.jam_selesai || null,
      ruang_id: item.ruang_id || null,
      ruang: ruangName || item.ruang || null,
      jam_per_minggu: Number(item.jam_per_minggu || 0),
      status: item.status || "aktif",
      keterangan: item.keterangan || null,
    });
  }

  if (validMapel.length > 0) {
    const { error } = await supabase.from("kelas_mapel").insert(validMapel);
    if (error) throw error;
  }
}

async function insertSiswa(kelasId, siswaList = []) {
  const validSiswa = siswaList
    .filter(Boolean)
    .map((santriId) => ({
      kelas_id: kelasId,
      santri_id: santriId,
    }));

  if (validSiswa.length > 0) {
    const { error } = await supabase.from("kelas_siswa").insert(validSiswa);
    if (error) throw error;
  }
}

router.post("/kelas", verifyAdmin, async (req, res) => {
  try {
    const {
      jenjang,
      nama_kelas,
      tingkat,
      jurusan,
      wali_guru_id,
      tahun_ajaran,
      semester,
      deskripsi,
      status,
      mapelList,
      siswaList,
    } = req.body;

    if (!jenjang || !nama_kelas) {
      return res.status(400).json({
        success: false,
        message: "Jenjang dan nama kelas wajib diisi.",
      });
    }

    const validasi = await validateJadwalBentrok({
      tahun_ajaran,
      semester,
      mapelList,
    });

    if (!validasi.valid) {
      return res.status(400).json({
        success: false,
        message: validasi.message,
      });
    }

    const { data: kelasBaru, error: kelasError } = await supabase
      .from("kelas")
      .insert([
        {
          jenjang,
          nama_kelas,
          tingkat: tingkat || null,
          jurusan: jurusan || null,
          wali_guru_id: wali_guru_id || null,
          tahun_ajaran: tahun_ajaran || null,
          semester: semester || null,
          deskripsi: deskripsi || null,
          status: status || "aktif",
        },
      ])
      .select()
      .single();

    if (kelasError) {
      return res.status(500).json({
        success: false,
        message: "Gagal membuat data kelas.",
        error: kelasError.message,
      });
    }

    try {
      await insertMapel(kelasBaru.id, mapelList || []);
      await insertSiswa(kelasBaru.id, siswaList || []);

      await syncGuruDariKelas();
    } catch (insertError) {
      await supabase.from("kelas").delete().eq("id", kelasBaru.id);

      return res.status(500).json({
        success: false,
        message: "Kelas dibuat, tetapi gagal menyimpan detail kelas.",
        error: insertError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Data kelas berhasil dibuat.",
      data: kelasBaru,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.put("/kelas/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      jenjang,
      nama_kelas,
      tingkat,
      jurusan,
      wali_guru_id,
      tahun_ajaran,
      semester,
      deskripsi,
      status,
      mapelList,
      siswaList,
    } = req.body;

    if (!jenjang || !nama_kelas) {
      return res.status(400).json({
        success: false,
        message: "Jenjang dan nama kelas wajib diisi.",
      });
    }

    const validasi = await validateJadwalBentrok({
      kelasId: id,
      tahun_ajaran,
      semester,
      mapelList,
    });

    if (!validasi.valid) {
      return res.status(400).json({
        success: false,
        message: validasi.message,
      });
    }

    const { data: updatedKelas, error: updateError } = await supabase
      .from("kelas")
      .update({
        jenjang,
        nama_kelas,
        tingkat: tingkat || null,
        jurusan: jurusan || null,
        wali_guru_id: wali_guru_id || null,
        tahun_ajaran: tahun_ajaran || null,
        semester: semester || null,
        deskripsi: deskripsi || null,
        status: status || "aktif",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui kelas.",
        error: updateError.message,
      });
    }

    const { error: deleteMapelError } = await supabase
      .from("kelas_mapel")
      .delete()
      .eq("kelas_id", id);

    if (deleteMapelError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus jadwal lama.",
        error: deleteMapelError.message,
      });
    }

    const { error: deleteSiswaError } = await supabase
      .from("kelas_siswa")
      .delete()
      .eq("kelas_id", id);

    if (deleteSiswaError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus data siswa lama.",
        error: deleteSiswaError.message,
      });
    }

    await insertMapel(id, mapelList || []);
    await insertSiswa(id, siswaList || []);

    await syncGuruDariKelas();

    return res.json({
      success: true,
      message: "Data kelas berhasil diperbarui.",
      data: updatedKelas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

router.delete("/kelas/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("kelas").delete().eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus kelas.",
        error: error.message,
      });
    }

    await syncGuruDariKelas();

    return res.json({
      success: true,
      message: "Kelas berhasil dihapus.",
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