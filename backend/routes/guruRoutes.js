import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

function getTodayName() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });
}

async function verifyGuru(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. User guru tidak terdeteksi.",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, nama, email, role")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    if (user.role !== "guru") {
      return res.status(403).json({
        success: false,
        message: "Hanya guru yang boleh mengakses halaman ini.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi guru.",
      error: error.message,
    });
  }
}

async function safeCount(table, queryBuilder) {
  try {
    const query = queryBuilder
      ? queryBuilder(supabase.from(table))
      : supabase.from(table);

    const { count, error } = await query.select("*", {
      count: "exact",
      head: true,
    });

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

async function safeSelect(table, queryBuilder, fallback = []) {
  try {
    const query = queryBuilder
      ? queryBuilder(supabase.from(table))
      : supabase.from(table);

    const { data, error } = await query;

    if (error) return fallback;
    return data || fallback;
  } catch {
    return fallback;
  }
}

router.get("/dashboard/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses dashboard guru lain.",
      });
    }

    const today = getTodayName();

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select(
        `
        id,
        user_id,
        nama,
        mapel,
        no_hp,
        alamat,
        pendidikan_terakhir,
        status_kepegawaian,
        wali_kelas,
        status,
        users:user_id (
          id,
          nama,
          email,
          role
        )
      `
      )
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message:
          "Data guru tidak ditemukan. Pastikan akun guru sudah terhubung dengan tabel guru.",
        error: guruError?.message,
      });
    }

    const jadwalGuru = await safeSelect("kelas_mapel", (q) =>
      q
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
          status,
          keterangan,
          kelas:kelas_id (
            id,
            jenjang,
            nama_kelas,
            tingkat,
            jurusan,
            tahun_ajaran,
            semester,
            status
          ),
          ruang_detail:ruang_id (
            id,
            nama_ruang,
            lokasi
          )
        `
        )
        .eq("guru_id", guru.id)
        .order("hari", { ascending: true })
        .order("jam_mulai", { ascending: true })
    );

    const jadwalHariIni = (jadwalGuru || []).filter(
      (item) =>
        String(item.hari || "").toLowerCase() ===
          String(today || "").toLowerCase() &&
        String(item.status || "aktif").toLowerCase() === "aktif"
    );

    const kelasMap = new Map();

    for (const item of jadwalGuru || []) {
      if (item.kelas?.id) {
        kelasMap.set(item.kelas.id, item.kelas);
      }
    }

    const kelasSaya = Array.from(kelasMap.values());
    const kelasIds = kelasSaya.map((kelas) => kelas.id);

    let totalSantri = 0;

    if (kelasIds.length > 0) {
      totalSantri = await safeCount("kelas_siswa", (q) =>
        q.in("kelas_id", kelasIds)
      );
    }

    const totalNilai = await safeCount("nilai", (q) =>
      q.eq("guru_id", guru.id)
    );

    const infoBelumDibaca = await safeCount("pemberitahuan", (q) =>
      q
        .or("target.eq.semua,target.eq.guru")
        .eq("status", "aktif")
    );

    const aktivitas = [];

    if (jadwalHariIni.length > 0) {
      aktivitas.push({
        id: "jadwal-hari-ini",
        type: "jadwal",
        title: "Jadwal mengajar hari ini tersedia",
        desc: `${jadwalHariIni.length} jadwal mengajar perlu diperiksa.`,
      });
    }

    if (kelasSaya.length > 0) {
      aktivitas.push({
        id: "kelas-saya",
        type: "kelas",
        title: "Kelas mengajar sudah terhubung",
        desc: `${kelasSaya.length} kelas terhubung dengan akun guru.`,
      });
    }

    if (totalNilai === 0) {
      aktivitas.push({
        id: "nilai-belum-ada",
        type: "nilai",
        title: "Nilai belum diinput",
        desc: "Silakan mulai input nilai santri jika fitur nilai sudah digunakan.",
      });
    }

    const tugasGuru = [
      {
        id: "cek-jadwal",
        title: "Cek jadwal mengajar hari ini",
        desc:
          jadwalHariIni.length > 0
            ? `${jadwalHariIni.length} jadwal perlu diperhatikan.`
            : "Tidak ada jadwal mengajar hari ini.",
        done: jadwalHariIni.length === 0,
      },
      {
        id: "cek-santri",
        title: "Cek data santri kelas",
        desc:
          totalSantri > 0
            ? `${totalSantri} santri terhubung dengan kelas Anda.`
            : "Belum ada santri yang terhubung.",
        done: totalSantri > 0,
      },
      {
        id: "input-nilai",
        title: "Input nilai santri",
        desc:
          totalNilai > 0
            ? `${totalNilai} data nilai sudah tercatat.`
            : "Belum ada nilai yang tercatat.",
        done: totalNilai > 0,
      },
      {
        id: "baca-info",
        title: "Baca pemberitahuan admin",
        desc:
          infoBelumDibaca > 0
            ? `${infoBelumDibaca} informasi tersedia.`
            : "Tidak ada informasi baru.",
        done: infoBelumDibaca === 0,
      },
    ];

    return res.json({
      success: true,
      message: "Dashboard guru berhasil diambil.",
      data: {
        guru,
        ringkasan: {
          jadwalHariIni: jadwalHariIni.length,
          totalJadwal: jadwalGuru.length,
          totalKelas: kelasSaya.length,
          totalSantri,
          totalNilai,
          infoBelumDibaca,
        },
        jadwalHariIni,
        kelasSaya,
        tugasGuru,
        aktivitas,
      },
    });
  } catch (error) {
    console.error("GURU DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil dashboard guru.",
      error: error.message,
    });
  }
});

router.get("/jadwal/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses jadwal guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { data: jadwal, error: jadwalError } = await supabase
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
        jam_per_minggu,
        status,
        keterangan,
        kelas:kelas_id (
          id,
          jenjang,
          nama_kelas,
          tingkat,
          jurusan,
          tahun_ajaran,
          semester,
          status
        ),
        ruang_detail:ruang_id (
          id,
          nama_ruang,
          lokasi,
          kapasitas
        )
      `
      )
      .eq("guru_id", guru.id)
      .order("hari", { ascending: true })
      .order("jam_mulai", { ascending: true });

    if (jadwalError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil jadwal guru.",
        error: jadwalError.message,
      });
    }

    return res.json({
      success: true,
      message: "Jadwal guru berhasil diambil.",
      data: {
        guru,
        jadwal: jadwal || [],
      },
    });
  } catch (error) {
    console.error("GURU JADWAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil jadwal guru.",
      error: error.message,
    });
  }
});

router.get("/santri/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses data santri guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
        error: guruError?.message,
      });
    }

    const { data: jadwal, error: jadwalError } = await supabase
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
        kelas:kelas_id (
          id,
          jenjang,
          nama_kelas,
          tingkat,
          jurusan,
          tahun_ajaran,
          semester,
          status
        )
      `
      )
      .eq("guru_id", guru.id);

    if (jadwalError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil kelas guru.",
        error: jadwalError.message,
      });
    }

    const kelasMap = new Map();

    for (const item of jadwal || []) {
      if (item.kelas?.id) {
        kelasMap.set(item.kelas.id, item.kelas);
      }
    }

    const kelasSaya = Array.from(kelasMap.values());
    const kelasIds = kelasSaya.map((kelas) => kelas.id);

    if (kelasIds.length === 0) {
      return res.json({
        success: true,
        message: "Guru belum memiliki kelas.",
        data: {
          guru,
          kelasSaya: [],
          santri: [],
          ringkasan: {
            totalKelas: 0,
            totalSantri: 0,
            santriAktif: 0,
            santriPending: 0,
            santriDitolak: 0,
          },
        },
      });
    }

    /*
      Ambil kelas_siswa TANPA nested relation.
      Ini lebih aman kalau foreign key belum lengkap.
    */
    const { data: kelasSiswaRaw, error: kelasSiswaError } = await supabase
      .from("kelas_siswa")
      .select("id, kelas_id, santri_id")
      .in("kelas_id", kelasIds);

    let santri = [];

    if (kelasSiswaError) {
      console.warn("KELAS_SISWA ERROR:", kelasSiswaError.message);
    }

    if (!kelasSiswaError && kelasSiswaRaw?.length > 0) {
      const santriIds = [
        ...new Set(
          kelasSiswaRaw
            .map((item) => item.santri_id)
            .filter(Boolean)
        ),
      ];

      if (santriIds.length > 0) {
        const { data: santriRaw, error: santriError } = await supabase
          .from("santri")
          .select(
            `
            id,
            user_id,
            nama,
            nisn,
            jenjang,
            kelas,
            status,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            telepon,

            created_at
          `
          )
          .in("id", santriIds);

        if (santriError) {
          console.warn("SANTRI SELECT ERROR:", santriError.message);
        } else {
          const santriMap = new Map();
          const kelasMapById = new Map();

          for (const item of santriRaw || []) {
            santriMap.set(item.id, item);
          }

          for (const kelas of kelasSaya || []) {
            kelasMapById.set(kelas.id, kelas);
          }

          santri = (kelasSiswaRaw || [])
            .map((item) => {
              const dataSantri = santriMap.get(item.santri_id);
              const dataKelas = kelasMapById.get(item.kelas_id);

              if (!dataSantri) return null;

              return {
                ...dataSantri,
                kelas_detail: dataKelas || null,
                kelas_siswa_id: item.id,
              };
            })
            .filter(Boolean);
        }
      }
    }

    /*
      Fallback:
      Kalau kelas_siswa kosong, coba ambil santri berdasarkan jenjang + kelas.
      Ini berguna kalau santri sudah ada di tabel santri,
      tapi belum dihubungkan ke kelas_siswa.
    */
    if (santri.length === 0) {
      const { data: semuaSantri, error: semuaSantriError } = await supabase
        .from("santri")
        .select(
          `
          id,
          user_id,
          nama,
          nisn,
          jenjang,
          kelas,
          status,
          jenis_kelamin,
          tempat_lahir,
          tanggal_lahir,
          alamat,
          telepon,
          created_at
        `
        );

      if (semuaSantriError) {
        console.warn("FALLBACK SANTRI ERROR:", semuaSantriError.message);
      } else {
        santri = (semuaSantri || [])
          .map((item) => {
            const matchedKelas = kelasSaya.find((kelas) => {
              const sameJenjang =
                String(kelas.jenjang || "").toLowerCase() ===
                String(item.jenjang || "").toLowerCase();

              const sameKelas =
                String(kelas.tingkat || "").toLowerCase() ===
                  String(item.kelas || "").toLowerCase() ||
                String(kelas.nama_kelas || "")
                  .toLowerCase()
                  .includes(String(item.kelas || "").toLowerCase());

              return sameJenjang && sameKelas;
            });

            if (!matchedKelas) return null;

            return {
              ...item,
              kelas_detail: matchedKelas,
              kelas_siswa_id: null,
            };
          })
          .filter(Boolean);
      }
    }

    const santriAktif = santri.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "aktif" ||
        String(item.status || "").toLowerCase() === "diterima"
    ).length;

    const santriPending = santri.filter(
      (item) => String(item.status || "").toLowerCase() === "pending"
    ).length;

    const santriDitolak = santri.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "ditolak" ||
        String(item.status || "").toLowerCase() === "nonaktif"
    ).length;

    return res.json({
      success: true,
      message: "Data santri guru berhasil diambil.",
      data: {
        guru,
        kelasSaya,
        santri,
        ringkasan: {
          totalKelas: kelasSaya.length,
          totalSantri: santri.length,
          santriAktif,
          santriPending,
          santriDitolak,
        },
      },
    });
  } catch (error) {
    console.error("GURU SANTRI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data santri guru.",
      error: error.message,
    });
  }
});

router.get("/nilai/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;
    const { semester, tahun_ajaran } = req.query;

    

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses data nilai guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
        error: guruError?.message,
      });
    }

    const { data: jadwal, error: jadwalError } = await supabase
      .from("kelas_mapel")
      .select(
        `
        id,
        kelas_id,
        nama_mapel,
        guru_id,
        hari,
        kelas:kelas_id (
          id,
          jenjang,
          nama_kelas,
          tingkat,
          jurusan,
          tahun_ajaran,
          semester,
          status
        )
      `
      )
      .eq("guru_id", guru.id);

    if (jadwalError) {
      console.error("JADWAL NILAI ERROR:", jadwalError);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil kelas guru.",
        error: jadwalError.message,
      });
    }

    const kelasMap = new Map();
    const mapelMap = new Map();

    for (const item of jadwal || []) {
      if (item.kelas?.id) {
        kelasMap.set(item.kelas.id, item.kelas);
      }

      if (item.nama_mapel) {
        mapelMap.set(String(item.nama_mapel).toLowerCase(), item.nama_mapel);
      }
    }

    const kelasSaya = Array.from(kelasMap.values());
    const kelasIds = kelasSaya.map((kelas) => kelas.id);
    const mapelSaya = Array.from(mapelMap.values());

    let santri = [];

    /*
      Catatan:
      Bagian ini dibuat aman.
      Kalau tabel kelas_siswa / santri belum ada datanya,
      halaman nilai tetap jalan.
    */
    if (kelasIds.length > 0) {
      const { data: kelasSiswa, error: siswaError } = await supabase
        .from("kelas_siswa")
        .select(
          `
          id,
          kelas_id,
          santri_id,
          kelas:kelas_id (
            id,
            jenjang,
            nama_kelas,
            tingkat,
            jurusan,
            tahun_ajaran,
            semester
          ),
          santri:santri_id (
            id,
            nama,
            nisn,
            jenjang,
            kelas,
            status,
            jenis_kelamin
          )
        `
        )
        .in("kelas_id", kelasIds);

      if (siswaError) {
        console.warn("KELAS SISWA / SANTRI BELUM TERSEDIA:", siswaError.message);
      } else {
        santri = (kelasSiswa || [])
          .filter((item) => item.santri)
          .map((item) => ({
            ...item.santri,
            kelas_detail: item.kelas,
            kelas_siswa_id: item.id,
          }));
      }
    }

    /*
      Ambil nilai tanpa relasi nested.
      Ini penting karena santri belum masuk Supabase.
    */
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
  .eq("guru_id", guru.id);

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
      console.error("NILAI SELECT ERROR:", nilaiError);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data nilai.",
        error: nilaiError.message,
      });
    }

    const santriMap = new Map();
    const kelasMapForNilai = new Map();

    for (const item of santri || []) {
      santriMap.set(item.id, item);
    }

    for (const kelas of kelasSaya || []) {
      kelasMapForNilai.set(kelas.id, kelas);
    }

    const nilaiList = (nilaiRaw || []).map((item) => ({
      ...item,
      santri: santriMap.get(item.santri_id) || {
        id: item.santri_id,
        nama: "Santri belum tersedia",
        nisn: "-",
      },
      kelas: kelasMapForNilai.get(item.kelas_id) || {
        id: item.kelas_id,
        nama_kelas: "Kelas belum tersedia",
        jenjang: "-",
        tingkat: "-",
        jurusan: "",
      },
    }));

    return res.json({
      success: true,
      message: "Data nilai guru berhasil diambil.",
      data: {
        guru,
        kelasSaya,
        mapelSaya,
        santri,
        nilai: nilaiList,
        ringkasan: {
          totalKelas: kelasSaya.length,
          totalSantri: santri.length,
          totalNilai: nilaiList.length,
          totalMapel: mapelSaya.length,
        },
      },
    });
  } catch (error) {
    console.error("GURU NILAI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data nilai guru.",
      error: error.message,
    });
  }
});

router.post("/nilai/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh menyimpan nilai guru lain.",
      });
    }

    const {
      santri_id,
      kelas_id,
      mapel,
      jenis_nilai,
      nilai,
      semester,
      tahun_ajaran,
      keterangan,
    } = req.body;

    if (
  !santri_id ||
  !kelas_id ||
  !mapel ||
  !jenis_nilai ||
  nilai === "" ||
  !semester ||
  !tahun_ajaran
) {
  return res.status(400).json({
    success: false,
    message:
      "Santri, kelas, mapel, jenis nilai, semester, tahun ajaran, dan nilai wajib diisi.",
  });
}

    const nilaiAngka = Number(nilai);

    if (Number.isNaN(nilaiAngka) || nilaiAngka < 0 || nilaiAngka > 100) {
      return res.status(400).json({
        success: false,
        message: "Nilai harus berupa angka 0 sampai 100.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { data: jadwalGuru, error: jadwalError } = await supabase
      .from("kelas_mapel")
      .select("id, kelas_id, guru_id, nama_mapel")
      .eq("guru_id", guru.id)
      .eq("kelas_id", kelas_id);

    if (jadwalError || !jadwalGuru || jadwalGuru.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "Guru tidak memiliki akses ke kelas ini. Pastikan admin sudah memilih guru pada jadwal mapel.",
      });
    }

    const { data: siswaKelas, error: siswaError } = await supabase
      .from("kelas_siswa")
      .select("id, kelas_id, santri_id")
      .eq("kelas_id", kelas_id)
      .eq("santri_id", santri_id)
      .single();

    if (siswaError || !siswaKelas) {
      return res.status(403).json({
        success: false,
        message: "Santri tidak terdaftar pada kelas yang dipilih.",
      });
    }

    const { data: existingNilai } = await supabase
      .from("nilai")
      .select("id")
      .eq("guru_id", guru.id)
      .eq("santri_id", santri_id)
      .eq("kelas_id", kelas_id)
      .eq("mapel", mapel || "")
      .eq("jenis_nilai", jenis_nilai)
      .eq("semester", semester || "")
      .eq("tahun_ajaran", tahun_ajaran || "")
      .maybeSingle();

    const payload = {
      guru_id: guru.id,
      santri_id,
      kelas_id,
      mapel: mapel || "",
      jenis_nilai,
      nilai: nilaiAngka,
      semester: semester || "",
      tahun_ajaran: tahun_ajaran || "",
      keterangan: keterangan || "",
      updated_at: new Date().toISOString(),
    };

    let savedData = null;
    let saveError = null;

    if (existingNilai?.id) {
      const result = await supabase
        .from("nilai")
        .update(payload)
        .eq("id", existingNilai.id)
        .select()
        .single();

      savedData = result.data;
      saveError = result.error;
    } else {
      const result = await supabase
        .from("nilai")
        .insert(payload)
        .select()
        .single();

      savedData = result.data;
      saveError = result.error;
    }

    if (saveError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan nilai.",
        error: saveError.message,
      });
    }

    return res.json({
      success: true,
      message: existingNilai?.id
        ? "Nilai berhasil diperbarui."
        : "Nilai berhasil disimpan.",
      data: savedData,
    });
  } catch (error) {
    console.error("GURU SIMPAN NILAI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan nilai.",
      error: error.message,
    });
  }
});

router.delete("/nilai/:userId/:nilaiId", verifyGuru, async (req, res) => {
  try {
    const { userId, nilaiId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh menghapus nilai guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { error } = await supabase
      .from("nilai")
      .delete()
      .eq("id", nilaiId)
      .eq("guru_id", guru.id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus nilai.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Nilai berhasil dihapus.",
    });
  } catch (error) {
    console.error("GURU HAPUS NILAI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus nilai.",
      error: error.message,
    });
  }
});

router.get("/materi/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses materi guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
        error: guruError?.message,
      });
    }

    const { data: jadwal, error: jadwalError } = await supabase
      .from("kelas_mapel")
      .select(
        `
        id,
        kelas_id,
        nama_mapel,
        guru_id,
        kelas:kelas_id (
          id,
          jenjang,
          nama_kelas,
          tingkat,
          jurusan,
          tahun_ajaran,
          semester,
          status
        )
      `
      )
      .eq("guru_id", guru.id);

    if (jadwalError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil kelas guru.",
        error: jadwalError.message,
      });
    }

    const kelasMap = new Map();
    const mapelMap = new Map();

    for (const item of jadwal || []) {
      if (item.kelas?.id) {
        kelasMap.set(item.kelas.id, item.kelas);
      }

      if (item.nama_mapel) {
        mapelMap.set(String(item.nama_mapel).toLowerCase(), item.nama_mapel);
      }
    }

    const kelasSaya = Array.from(kelasMap.values());
    const mapelSaya = Array.from(mapelMap.values());

    const { data: materiRaw, error: materiError } = await supabase
      .from("materi")
      .select(
        `
        id,
        guru_id,
        kelas_id,
        judul,
        mapel,
        deskripsi,
        link_materi,
        status,
        created_at,
        updated_at
      `
      )
      .eq("guru_id", guru.id)
      .order("created_at", { ascending: false });

    if (materiError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data materi.",
        error: materiError.message,
      });
    }

    const kelasMapForMateri = new Map();

    for (const kelas of kelasSaya || []) {
      kelasMapForMateri.set(kelas.id, kelas);
    }

    const materi = (materiRaw || []).map((item) => ({
      ...item,
      kelas: kelasMapForMateri.get(item.kelas_id) || {
        id: item.kelas_id,
        nama_kelas: "Kelas belum tersedia",
        jenjang: "-",
        tingkat: "-",
      },
    }));

    const materiAktif = materi.filter(
      (item) => String(item.status || "").toLowerCase() === "aktif"
    ).length;

    const materiDraft = materi.filter(
      (item) => String(item.status || "").toLowerCase() === "draft"
    ).length;

    return res.json({
      success: true,
      message: "Data materi guru berhasil diambil.",
      data: {
        guru,
        kelasSaya,
        mapelSaya,
        materi,
        ringkasan: {
          totalKelas: kelasSaya.length,
          totalMapel: mapelSaya.length,
          totalMateri: materi.length,
          materiAktif,
          materiDraft,
        },
      },
    });
  } catch (error) {
    console.error("GURU MATERI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil materi guru.",
      error: error.message,
    });
  }
});

router.get("/kelulusan/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses data kelulusan guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message:
          "Data guru tidak ditemukan. Pastikan akun guru sudah terhubung dengan tabel guru.",
        error: guruError?.message,
      });
    }

    /*
      Ambil kelas yang diajar guru dari kelas_mapel.
      Ini mengikuti pola route santri/nilai/materi yang sudah ada di file kamu.
    */
    const { data: jadwal, error: jadwalError } = await supabase
      .from("kelas_mapel")
      .select(
        `
        id,
        kelas_id,
        nama_mapel,
        guru_id,
        kelas:kelas_id (
          id,
          jenjang,
          nama_kelas,
          tingkat,
          jurusan,
          tahun_ajaran,
          semester,
          status
        )
      `
      )
      .eq("guru_id", guru.id);

    if (jadwalError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil kelas guru.",
        error: jadwalError.message,
      });
    }

    const kelasMap = new Map();

    for (const item of jadwal || []) {
      if (item.kelas?.id) {
        kelasMap.set(item.kelas.id, item.kelas);
      }
    }

    const kelasSaya = Array.from(kelasMap.values());
    const kelasIds = kelasSaya.map((kelas) => kelas.id);

    if (kelasIds.length === 0) {
      return res.json({
        success: true,
        message: "Guru belum memiliki kelas.",
        data: [],
      });
    }

    /*
      Ambil santri berdasarkan tabel kelas_siswa.
      Ini lebih cocok dengan struktur project kamu karena route /santri guru juga pakai kelas_siswa.
    */
    const { data: kelasSiswaRaw, error: kelasSiswaError } = await supabase
      .from("kelas_siswa")
      .select("id, kelas_id, santri_id")
      .in("kelas_id", kelasIds);

    if (kelasSiswaError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil relasi kelas santri.",
        error: kelasSiswaError.message,
      });
    }

    const santriIds = [
      ...new Set((kelasSiswaRaw || []).map((item) => item.santri_id).filter(Boolean)),
    ];

    if (santriIds.length === 0) {
      return res.json({
        success: true,
        message: "Belum ada santri pada kelas guru.",
        data: [],
      });
    }

    const { data: santriRaw, error: santriError } = await supabase
      .from("santri")
      .select(
        `
        id,
        user_id,
        nama,
        nisn,
        jenjang,
        kelas,
        status,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        telepon,
        created_at
      `
      )
      .in("id", santriIds)
      .order("nama", { ascending: true });

    if (santriError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data santri.",
        error: santriError.message,
      });
    }

    const { data: kelulusanList, error: kelulusanError } = await supabase
      .from("kelulusan_santri")
      .select("*")
      .eq("guru_id", guru.id)
      .in("santri_id", santriIds);

    if (kelulusanError) {
      return res.status(500).json({
        success: false,
        message:
          "Gagal mengambil data kelulusan. Pastikan tabel kelulusan_santri sudah dibuat.",
        error: kelulusanError.message,
      });
    }

    const santriMap = new Map();
    const kelasMapById = new Map();

    for (const item of santriRaw || []) {
      santriMap.set(item.id, item);
    }

    for (const kelas of kelasSaya || []) {
      kelasMapById.set(kelas.id, kelas);
    }

    const mappedData = (kelasSiswaRaw || [])
      .map((item) => {
        const santri = santriMap.get(item.santri_id);
        const kelas = kelasMapById.get(item.kelas_id);

        if (!santri) return null;

        const kelulusan = (kelulusanList || []).find(
          (row) => row.santri_id === santri.id
        );

        return {
          id: santri.id,
          nama: santri.nama || "-",
          nis: santri.nis || santri.nisn || "-",
          nisn: santri.nisn || "-",
          kelas_id: item.kelas_id,
          kelas_nama:
            kelas?.nama_kelas ||
            `${kelas?.jenjang || ""} ${kelas?.tingkat || ""}`.trim() ||
            santri.kelas ||
            "-",
          jenjang: santri.jenjang || kelas?.jenjang || "-",
          status_santri: santri.status || "-",

          status_kelulusan: kelulusan?.status_kelulusan || "",
          catatan_guru: kelulusan?.catatan_guru || "",
          status_verifikasi: kelulusan?.status_verifikasi || "belum_dikirim",
          catatan_admin: kelulusan?.catatan_admin || "",
        };
      })
      .filter(Boolean);

    return res.json({
      success: true,
      message: "Data kelulusan santri berhasil diambil.",
      data: mappedData,
    });
  } catch (error) {
    console.error("GET KELULUSAN GURU ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data kelulusan guru.",
      error: error.message,
    });
  }
});

router.post("/kelulusan/submit", verifyGuru, async (req, res) => {
  try {
    const { user_id, data } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID guru wajib dikirim.",
      });
    }

    if (String(user_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengirim data kelulusan guru lain.",
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data kelulusan tidak boleh kosong.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama")
      .eq("user_id", user_id)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
        error: guruError?.message,
      });
    }

    const invalidData = data.find(
      (item) =>
        !item.santri_id ||
        !item.kelas_id ||
        !["lulus", "tidak_lulus"].includes(item.status_kelulusan)
    );

    if (invalidData) {
      return res.status(400).json({
        success: false,
        message:
          "Data tidak valid. Setiap santri wajib punya kelas, santri_id, dan status lulus/tidak_lulus.",
      });
    }

    const santriIds = data.map((item) => item.santri_id);

    const payload = data.map((item) => ({
      guru_id: guru.id,
      kelas_id: item.kelas_id,
      santri_id: item.santri_id,
      status_kelulusan: item.status_kelulusan,
      catatan_guru: item.catatan_guru || "",
      status_verifikasi: "pending",
      submitted_at: new Date().toISOString(),
    }));

    /*
      Hapus data lama guru untuk santri yang sama.
      Setelah itu insert ulang sebagai pending agar admin bisa verifikasi ulang.
    */
    const { error: deleteError } = await supabase
      .from("kelulusan_santri")
      .delete()
      .eq("guru_id", guru.id)
      .in("santri_id", santriIds);

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui data kelulusan lama.",
        error: deleteError.message,
      });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("kelulusan_santri")
      .insert(payload)
      .select("*");

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengirim data kelulusan ke admin.",
        error: insertError.message,
      });
    }

    return res.json({
      success: true,
      message: "Data kelulusan berhasil dikirim ke admin untuk diverifikasi.",
      data: inserted,
    });
  } catch (error) {
    console.error("SUBMIT KELULUSAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengirim data kelulusan.",
      error: error.message,
    });
  }
});

router.post("/materi/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh menyimpan materi guru lain.",
      });
    }

    const {
      id,
      kelas_id,
      judul,
      mapel,
      deskripsi,
      link_materi,
      status,
    } = req.body;

    if (!judul) {
      return res.status(400).json({
        success: false,
        message: "Judul materi wajib diisi.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    if (kelas_id) {
      const { data: aksesKelas, error: aksesError } = await supabase
        .from("kelas_mapel")
        .select("id")
        .eq("guru_id", guru.id)
        .eq("kelas_id", kelas_id);

      if (aksesError || !aksesKelas || aksesKelas.length === 0) {
        return res.status(403).json({
          success: false,
          message:
            "Guru tidak memiliki akses ke kelas ini. Pastikan admin sudah memilih guru pada jadwal mapel.",
        });
      }
    }

    const payload = {
      guru_id: guru.id,
      kelas_id: kelas_id || null,
      judul,
      mapel: mapel || "",
      deskripsi: deskripsi || "",
      link_materi: link_materi || "",
      status: status || "aktif",
      updated_at: new Date().toISOString(),
    };

    let savedData = null;
    let saveError = null;

    if (id) {
      const result = await supabase
        .from("materi")
        .update(payload)
        .eq("id", id)
        .eq("guru_id", guru.id)
        .select()
        .single();

      savedData = result.data;
      saveError = result.error;
    } else {
      const result = await supabase
        .from("materi")
        .insert(payload)
        .select()
        .single();

      savedData = result.data;
      saveError = result.error;
    }

    if (saveError) {
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan materi.",
        error: saveError.message,
      });
    }

    return res.json({
      success: true,
      message: id ? "Materi berhasil diperbarui." : "Materi berhasil dibuat.",
      data: savedData,
    });
  } catch (error) {
    console.error("GURU SIMPAN MATERI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan materi.",
      error: error.message,
    });
  }
});

router.delete("/materi/:userId/:materiId", verifyGuru, async (req, res) => {
  try {
    const { userId, materiId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh menghapus materi guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { error } = await supabase
      .from("materi")
      .delete()
      .eq("id", materiId)
      .eq("guru_id", guru.id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus materi.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Materi berhasil dihapus.",
    });
  } catch (error) {
    console.error("GURU HAPUS MATERI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus materi.",
      error: error.message,
    });
  }
});

router.get("/pemberitahuan/:userId", verifyGuru, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengakses pemberitahuan guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama, mapel, wali_kelas")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
        error: guruError?.message,
      });
    }

    /*
      Ambil semua kolom agar tidak error kalau ada kolom yang belum tersedia,
      misalnya isi, prioritas, kategori, atau updated_at.
    */
    const { data: pemberitahuanRaw, error: pemberitahuanError } =
      await supabase
        .from("pemberitahuan")
        .select("*");

    if (pemberitahuanError) {
      console.error("PEMBERITAHUAN SELECT ERROR:", pemberitahuanError);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil pemberitahuan guru.",
        error: pemberitahuanError.message,
      });
    }

    /*
      Kalau tabel pemberitahuan_guru_reads belum ada,
      halaman tetap bisa berjalan. Hanya status baca yang dianggap belum dibaca.
    */
    const { data: readData, error: readError } = await supabase
      .from("pemberitahuan_guru_reads")
      .select("id, pemberitahuan_id, guru_id, user_id, read_at")
      .eq("guru_id", guru.id)
      .eq("user_id", userId);

    if (readError) {
      console.warn("GURU READ STATUS ERROR:", readError.message);
    }

    const readMap = new Map();

    for (const item of readData || []) {
      readMap.set(item.pemberitahuan_id, item);
    }

    const pemberitahuan = (pemberitahuanRaw || [])
      .filter((item) => {
        const target = String(item.target || "semua").toLowerCase();
        const status = String(item.status || "aktif").toLowerCase();

        const targetCocok =
          target === "semua" ||
          target === "guru" ||
          target === "all" ||
          target === "";

        const statusAktif =
          status === "aktif" ||
          status === "active" ||
          status === "publish" ||
          status === "";

        return targetCocok && statusAktif;
      })
      .map((item) => ({
        ...item,
        judul: item.judul || item.title || "Pemberitahuan",
        pesan_final: item.pesan || item.isi || item.deskripsi || item.message || "",
        kategori: item.kategori || item.jenis || "Info",
        prioritas: item.prioritas || item.priority || "normal",
        is_read: readMap.has(item.id),
        read_at: readMap.get(item.id)?.read_at || null,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();

        return dateB - dateA;
      });

    const belumDibaca = pemberitahuan.filter((item) => !item.is_read).length;

    const penting = pemberitahuan.filter((item) => {
      const prioritas = String(item.prioritas || "").toLowerCase();
      const kategori = String(item.kategori || "").toLowerCase();

      return (
        prioritas === "penting" ||
        prioritas === "urgent" ||
        kategori === "penting" ||
        kategori === "urgent"
      );
    }).length;

    return res.json({
      success: true,
      message: "Pemberitahuan guru berhasil diambil.",
      data: {
        guru,
        pemberitahuan,
        ringkasan: {
          total: pemberitahuan.length,
          belumDibaca,
          sudahDibaca: pemberitahuan.length - belumDibaca,
          penting,
        },
      },
    });
  } catch (error) {
    console.error("GURU PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil pemberitahuan guru.",
      error: error.message,
    });
  }
});

router.post("/pemberitahuan/:userId/:pemberitahuanId/read", verifyGuru, async (req, res) => {
  try {
    const { userId, pemberitahuanId } = req.params;

    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak boleh mengubah status pemberitahuan guru lain.",
      });
    }

    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id, user_id, nama")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return res.status(404).json({
        success: false,
        message: "Data guru tidak ditemukan.",
      });
    }

    const { data: existingRead } = await supabase
      .from("pemberitahuan_guru_reads")
      .select("id")
      .eq("guru_id", guru.id)
      .eq("user_id", userId)
      .eq("pemberitahuan_id", pemberitahuanId)
      .maybeSingle();

    if (existingRead?.id) {
      return res.json({
        success: true,
        message: "Pemberitahuan sudah ditandai dibaca.",
      });
    }

    const { error } = await supabase
      .from("pemberitahuan_guru_reads")
      .insert({
        pemberitahuan_id: pemberitahuanId,
        guru_id: guru.id,
        user_id: userId,
        read_at: new Date().toISOString(),
      });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal menandai pemberitahuan sebagai dibaca.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Pemberitahuan berhasil ditandai dibaca.",
    });
  } catch (error) {
    console.error("GURU READ PEMBERITAHUAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menandai pemberitahuan.",
      error: error.message,
    });
  }
});
export default router;