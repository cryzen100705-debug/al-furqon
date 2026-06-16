import express from "express";

const router = express.Router();

/* =========================================================
   HOME PAGE DATA
========================================================= */

const homeData = {
  hero: {
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    badge: "Pondok Pesantren Al-Furqon",
    title: "Mondok bukan sekadar sekolah.",
    highlight: "Ini perjalanan hidup.",
    desc: "Santri datang membawa harapan. Di Al-Furqon, harapan itu diproses melalui ilmu, ibadah, adab, kemandirian, dan pembinaan yang terarah.",
    image: "/hero-santri.jpg",
  },

  heroStats: [
    { value: "100+", label: "Santri" },
  { value: "24 Jam", label: "Pembinaan" },
  { value: "Aktif", label: "Kegiatan Santri" },
  ],

  storyChapters: [
    {
      number: "01",
      label: "Harapan",
      title: "Orang tua mencari tempat yang aman untuk masa depan anak.",
      desc: "Bukan hanya tempat belajar. Tetapi lingkungan yang membentuk ibadah, adab, disiplin, dan kemandirian.",
      image: "/harapan.png",
    },
    {
      number: "02",
      label: "Adaptasi",
      title: "Santri mulai belajar hidup terarah dan mandiri.",
      desc: "Dari bangun pagi, shalat berjamaah, belajar bersama, sampai menjaga adab kepada guru dan teman.",
      image: "/adaptasi.png",
    },
    {
      number: "03",
      label: "Pembinaan",
      title: "Ilmu agama dan pendidikan formal berjalan berdampingan.",
      desc: "Al-Qur’an, akademik, kegiatan santri, dan pembinaan karakter menjadi bagian dari proses yang saling melengkapi.",
      image: "/pembinaan.png",
    },
    {
      number: "04",
      label: "Masa Depan",
      title: "Lahir santri yang berilmu, beradab, dan siap berkembang.",
      desc: "Perjalanan di pesantren menjadi bekal untuk membangun pribadi yang kuat, santun, dan memiliki arah hidup.",
      image: "/masadepan.png",
    },
  ],

  programs: [
    {
      iconKey: "mosque",
      title: "Hadroh",
      tag: "Seni Islami",
      image: "/hadroh.jpg",
      desc: "Melatih kekompakan, keberanian tampil, dan kecintaan kepada sholawat.",
    },
    {
      iconKey: "quran",
      title: "MTQ",
      tag: "Tilawah Qur’an",
      image: "/mtq.jpg",
      desc: "Membina bacaan Al-Qur’an, tajwid, makharijul huruf, dan irama.",
    },
    {
      iconKey: "camp",
      title: "Pramuka",
      tag: "Mandiri & Disiplin",
      image: "/pramuka.png",
      desc: "Membentuk kedisiplinan, kepemimpinan, kerja sama, dan tanggung jawab.",
    },
  ],

  values: [
    {
      iconKey: "mosque",
      title: "Ibadah",
      desc: "Pembiasaan shalat berjamaah, dzikir, kajian, dan kedisiplinan spiritual.",
    },
    {
      iconKey: "book",
      title: "Ilmu",
      desc: "Pendidikan umum dan agama berjalan seimbang untuk masa depan santri.",
    },
    {
      iconKey: "heart",
      title: "Adab",
      desc: "Pembentukan akhlak dan karakter menjadi dasar utama pendidikan.",
    },
    {
      iconKey: "shield",
      title: "Aman",
      desc: "Lingkungan pesantren terarah, terpantau, dan mendukung perkembangan santri.",
    },
  ],

  pembina: [
    {
      iconKey: "teacher",
      name: "Abah Kh Abdurrahman bin Kh Abdul Karim",
      role: "Pengasuh Pesantren",
      image: "/Abah Kh Abdurrahman bin Kh Abdul Karim.png",
      focus: "Pembinaan akhlak, adab, ibadah, dan arah pendidikan santri.",
      badge: "Pengasuh",
    },
    {
      iconKey: "quran",
      name: "Abi Kh Dadun Abdurrohim bin Kh Abdurrahman",
      role: "Pembina Tahfidz",
      image: "/Abi Kh Dadun Abdurrohim bin Kh Abdurrahman.png",
      focus: "Membimbing hafalan, tahsin, tajwid, dan murojaah harian.",
      badge: "Tahfidz",
    },
    {
      iconKey: "home",
      name: "Akang Haji Fitroh Burhani",
      role: "Pembina Asrama",
      image: "/Akang Haji Fitroh Burhani.png",
      focus: "Mendampingi kedisiplinan, kebersihan, dan kemandirian santri.",
      badge: "Asrama",
    },
    {
      iconKey: "book",
      name: "Umi Hj Siti Aisya binti H Ahmad Amir",
      role: "Pembina Akademik",
      image: "/Umi Hj Siti Aisya binti H Ahmad Amir.png",
      focus:
        "Membimbing pembelajaran formal, kedisiplinan belajar, dan perkembangan akademik santri.",
      badge: "Akademik",
    },
    {
      iconKey: "users",
      name: "Ustadzah, hj. Pipih Muraapi'ah s. pd. i",
      role: "Pimpinan",
      image: "/Ustadzah, hj. Pipih Muraapi'ah s. pd. i.png",
      focus:
        "Mendampingi kegiatan harian santri, pembinaan karakter, kedisiplinan, dan kehidupan pesantren.",
      badge: "Kesantrian",
    },
  ],
};

/* =========================================================
   PROGRAM PAGE DATA
========================================================= */

const programPageData = {
  hero: {
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    badge: "Program Non Formal Pesantren",
    title: "Ruang tumbuh",
    highlight: "santri Al-Furqon.",
    desc: "Program non formal pesantren menjadi ruang pembinaan santri dalam ibadah, Al-Qur'an, adab, dakwah, seni Islami, kemandirian, dan kedisiplinan hidup sehari-hari.",
    source: "QS. Thaha: 114",
  },

  stats: [
    { value: "9", label: "Program Non Formal", iconKey: "layer" },
    { value: "24 Jam", label: "Pembinaan Santri", iconKey: "shield" },
    { value: "Terarah", label: "Pendampingan", iconKey: "star" },
    { value: "Aktif", label: "Kegiatan Harian", iconKey: "users" },
  ],

  programs: [
    {
      title: "Seni Baca Al-Qur'an",
      subtitle: "Tilawah, Tajwid, dan Irama Qur'ani",
      tag: "Qur'ani",
      iconKey: "quran",
      desc: "Membimbing santri memperindah bacaan Al-Qur'an dengan tajwid, makharijul huruf, adab membaca, dan latihan irama.",
      focus: ["Tajwid", "Makharijul Huruf", "Tilawah", "Adab Qur'an"],
      impact: "Santri terbiasa membaca Al-Qur'an dengan baik, benar, dan penuh adab.",
    },
    {
      title: "Pengajian Kitab Kuning",
      subtitle: "Kajian Turats dan Pemahaman Agama",
      tag: "Keilmuan",
      iconKey: "book",
      desc: "Mengenalkan santri pada kitab-kitab klasik sebagai dasar memahami fikih, akhlak, tauhid, dan adab dalam kehidupan.",
      focus: ["Fikih", "Akhlak", "Tauhid", "Adab"],
      impact: "Santri memiliki dasar keilmuan agama yang kuat dan terarah.",
    },
    {
      title: "Kuliah Subuh",
      subtitle: "Nasihat Pagi dan Pembinaan Ruhani",
      tag: "Pembiasaan",
      iconKey: "mosque",
      desc: "Kegiatan setelah subuh untuk mengisi pagi santri dengan nasihat, ilmu, motivasi ibadah, dan pembiasaan disiplin.",
      focus: ["Nasihat", "Motivasi", "Ibadah", "Disiplin"],
      impact: "Santri memulai hari dengan semangat ibadah dan arah hidup yang baik.",
    },
    {
      title: "Tahfidzul Qur'an",
      subtitle: "Hafalan, Setoran, dan Murajaah",
      tag: "Hafalan",
      iconKey: "quran",
      desc: "Program pembinaan hafalan Al-Qur'an secara bertahap melalui setoran, murajaah, pembiasaan membaca, dan penguatan adab Qur'ani.",
      focus: ["Hafalan", "Setoran", "Murajaah", "Konsistensi"],
      impact: "Santri dekat dengan Al-Qur'an dan terbiasa menjaga hafalan.",
    },
    {
      title: "Muhadhoroh",
      subtitle: "Latihan Dakwah dan Public Speaking",
      tag: "Dakwah",
      iconKey: "microphone",
      desc: "Melatih santri berbicara di depan umum, menyampaikan nasihat, menjadi MC, berpidato, dan percaya diri dalam kegiatan pesantren.",
      focus: ["Pidato", "MC", "Dakwah", "Percaya Diri"],
      impact: "Santri berani tampil, tertata dalam bicara, dan siap berdakwah.",
    },
    {
      title: "Lailatul Qiro'ah",
      subtitle: "Malam Qur'ani dan Pembinaan Bacaan",
      tag: "Qur'ani",
      iconKey: "moon",
      desc: "Kegiatan malam bernuansa Qur'ani untuk menguatkan bacaan, kecintaan kepada Al-Qur'an, dan suasana spiritual santri.",
      focus: ["Qiro'ah", "Tilawah", "Ruhani", "Kebersamaan"],
      impact: "Santri merasakan suasana belajar Qur'an yang hidup dan bermakna.",
    },
    {
      title: "Seni Kaligrafi",
      subtitle: "Kreativitas Islami dan Keindahan Tulisan",
      tag: "Kreatif",
      iconKey: "pen",
      desc: "Mengembangkan kreativitas santri melalui seni menulis indah bernuansa Islami, ketelitian, kesabaran, dan estetika.",
      focus: ["Kreativitas", "Ketelitian", "Seni Islami", "Kesabaran"],
      impact: "Santri terlatih sabar, rapi, teliti, dan kreatif.",
    },
    {
      title: "Majelis Ta'lim",
      subtitle: "Kajian, Dzikir, dan Kebersamaan",
      tag: "Pembinaan",
      iconKey: "users",
      desc: "Ruang kajian dan pembinaan bersama untuk memperkuat ilmu, adab, dzikir, ukhuwah, dan kedekatan santri dengan guru.",
      focus: ["Kajian", "Dzikir", "Ukhuwah", "Adab"],
      impact: "Santri terbiasa hadir di majelis ilmu dan menghormati guru.",
    },
    {
      title: "Olahraga / Senam Pagi",
      subtitle: "Kesehatan, Semangat, dan Kedisiplinan",
      tag: "Kebugaran",
      iconKey: "activity",
      desc: "Kegiatan fisik untuk menjaga kesehatan santri, membangun semangat pagi, kekompakan, dan pola hidup disiplin.",
      focus: ["Sehat", "Semangat", "Kompak", "Disiplin"],
      impact: "Santri lebih bugar, aktif, dan siap mengikuti kegiatan harian.",
    },
  ],

  flow: [
    {
      number: "01",
      title: "Pembiasaan Harian",
      desc: "Santri dibiasakan mengikuti kegiatan pesantren secara teratur.",
    },
    {
      number: "02",
      title: "Dibimbing Pembina",
      desc: "Setiap program diarahkan agar tetap sesuai adab dan nilai pesantren.",
    },
    {
      number: "03",
      title: "Dilihat Perkembangannya",
      desc: "Santri didampingi agar kemampuan, disiplin, dan keberaniannya berkembang.",
    },
    {
      number: "04",
      title: "Menjadi Karakter",
      desc: "Kegiatan yang berulang membentuk kebiasaan baik dalam diri santri.",
    },
  ],

  faq: [
    {
      q: "Apakah program non formal wajib diikuti?",
      a: "Beberapa kegiatan menjadi bagian dari pembiasaan pesantren, sedangkan sebagian lainnya dapat diarahkan sesuai minat, kemampuan, dan jadwal santri.",
    },
    {
      q: "Apakah program ini memakai foto kegiatan?",
      a: "Tidak. Tampilan halaman program ini dibuat tanpa foto agar lebih ringan, modern, dan fokus pada informasi program.",
    },
    {
      q: "Apa tujuan utama program non formal?",
      a: "Tujuannya membentuk santri yang dekat dengan Al-Qur'an, beradab, percaya diri, disiplin, kreatif, dan aktif dalam lingkungan pesantren.",
    },
  ],
};

/* =========================================================
   PENDIDIKAN PAGE DATA
========================================================= */

const pendidikanPageData = {
  hero: {
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    badge: "Islamic Education Journey",
    title: "Journey of",
    highlight: "Santri Education.",
    desc: "Perjalanan pendidikan islami modern yang membentuk akhlak, spiritualitas, ilmu pengetahuan, keterampilan hidup, dan masa depan santri dalam satu sistem pembinaan terpadu.",
    image: "/smk.jpg",
  },

  stats: [
    { number: "3", label: "Jenjang Pendidikan" },
    { number: "24 Jam", label: "Pembinaan Karakter" },
    { number: "100+", label: "Program Pembiasaan" },
  ],

  values: [
    {
      iconKey: "mosque",
      title: "Ibadah",
      desc: "Rutinitas santri dibangun dengan shalat berjamaah, dzikir, dan pembiasaan ibadah harian.",
    },
    {
      iconKey: "book",
      title: "Ilmu",
      desc: "Pendidikan umum dan agama berjalan seimbang agar santri siap menghadapi masa depan.",
    },
    {
      iconKey: "heart",
      title: "Adab",
      desc: "Pembinaan karakter menjadi dasar utama sebelum santri mengejar prestasi akademik.",
    },
    {
      iconKey: "shield",
      title: "Disiplin",
      desc: "Lingkungan pesantren membentuk kebiasaan hidup teratur, mandiri, dan bertanggung jawab.",
    },
  ],

  education: [
    {
      level: "01",
      title: "MTs Setara",
      shortTitle: "SMP",
      iconKey: "graduate",
      bgImage: "/icon_smp.png",
      fallbackImage: "/smk.jpg",
      color: "from-emerald-400 via-green-500 to-emerald-800",
      subtitle: "Fondasi karakter & adab sebelum ilmu tinggi",
      arabic: "الأدب قبل العلم",
      quote: "Adab sebelum ilmu, karakter sebelum prestasi.",
      story:
        "Tahap awal pembentukan karakter santri melalui disiplin, ibadah, pembiasaan adab, dan keseimbangan antara pendidikan umum serta agama.",
      focus: [
        "Kurikulum umum & agama",
        "Tahsin & hafalan dasar",
        "Pembentukan adab",
        "Disiplin & ibadah harian",
      ],
      impact: "Fondasi karakter kuat untuk masa depan",
    },
    {
      level: "02",
      title: "SMK",
      shortTitle: "SMK",
      iconKey: "laptop",
      bgImage: "/icon_smk.png",
      fallbackImage: "/smk.jpg",
      color: "from-yellow-300 via-amber-400 to-orange-500",
      subtitle: "Skill modern & kemandirian santri",
      arabic: "العلم والعمل",
      quote: "Ilmu agama berjalan bersama keterampilan masa depan.",
      story:
        "Santri diarahkan menuju dunia nyata melalui entrepreneurship, dan project industri modern.",
      focus: [
        "Programming & multimedia",
        "Digital entrepreneurship",
        "Project industri",
        "Soft skill & teamwork",
      ],
      impact: "Mandiri secara ekonomi & siap dunia kerja",
    },
    {
      level: "03",
      title: "Takhossus",
      shortTitle: "Takhossus",
      iconKey: "quran",
      bgImage: "/icon_takhassus.png",
      fallbackImage: "/hero-santri.jpg",
      color: "from-emerald-600 via-green-800 to-black",
      subtitle: "Puncak pendalaman Al-Qur’an",
      arabic: "حَمَلَةُ الْقُرْآن",
      quote: "Mendalami Al-Qur’an untuk menjadi cahaya bagi umat.",
      story:
        "Tahap pembinaan tertinggi untuk mencetak hafidz Qur’an, dai, dan calon ulama dengan pemahaman ilmu syar’i mendalam.",
      focus: [
        "Tahfidz 30 Juz",
        "Tafsir & Hadits",
        "Kitab turats klasik",
        "Bahasa Arab intensif",
      ],
      impact: "Lahirnya hafidz Qur’an & calon ulama",
    },
  ],
};

/* =========================================================
   FASILITAS PAGE DATA
========================================================= */

const fasilitasPageData = {
  hero: {
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    badge: "Fasilitas Pesantren",
    title: "Lingkungan nyaman",
    highlight: "untuk tumbuhnya santri.",
    desc: "Fasilitas pesantren dirancang untuk mendukung ibadah, pendidikan, pembinaan akhlak, kemandirian, keamanan, dan kehidupan santri selama 24 jam.",
    image: "/hero-santri.jpg",
  },

  stats: [
    { value: "10+", label: "Fasilitas" },
    { value: "24/7", label: "Keamanan" },
    { value: "Islami", label: "Lingkungan" },
    { value: "Nyaman", label: "Asrama" },
  ],

  featuredInfo: {
    badge: "Featured Facility",
    title: "Pusat kegiatan spiritual santri",
    desc: "Masjid menjadi ruang utama pembentukan ibadah, kajian, dzikir, dan pembiasaan akhlak harian.",
  },

  featuredCards: [
    {
      iconKey: "mosque",
      title: "Ibadah Harian",
      desc: "Shalat berjamaah, dzikir, dan pembiasaan ibadah.",
    },
    {
      iconKey: "quran",
      title: "Kajian Qur’an",
      desc: "Tahsin, tilawah, murojaah, dan pembinaan rohani.",
    },
    {
      iconKey: "users",
      title: "Kebersamaan",
      desc: "Santri belajar disiplin dan adab bersama.",
    },
    {
      iconKey: "shield",
      title: "Terarah",
      desc: "Kegiatan dibimbing oleh pembina pesantren.",
    },
  ],

  qualities: ["Nyaman", "Aman", "Terarah", "Islami"],

  facilities: [
    {
      id: 1,
      name: "Masjid Al-Barokah",
      desc: "Pusat ibadah, kajian, dzikir, shalat berjamaah, dan pembinaan spiritual santri setiap hari.",
      detail:
        "Masjid menjadi pusat kehidupan pesantren. Santri dibiasakan menjaga ibadah, mengikuti kajian, dan membangun kedekatan dengan Al-Qur’an dalam suasana yang nyaman.",
      iconKey: "mosque",
      img: "/masjid.png",
      category: "Ibadah",
      featured: true,
    },
    {
      id: 2,
      name: "Asrama Putra",
      desc: "Lingkungan asrama yang nyaman, terarah, dan berada dalam pengawasan pembina.",
      detail:
        "Asrama dirancang untuk membentuk kemandirian, kedisiplinan, kebersihan, dan tanggung jawab santri dalam kehidupan sehari-hari.",
      iconKey: "bed",
      img: "Asrama-Putra.jpeg",
      category: "Asrama",
      featured: false,
    },
    {
      id: 3,
      name: "Asrama Putri",
      desc: "Asrama aman dan tertata untuk kenyamanan santri putri selama proses pendidikan.",
      detail:
        "Asrama putri dilengkapi dengan pendampingan dan suasana yang mendukung pembinaan adab, kebiasaan baik, serta kedisiplinan.",
      iconKey: "bed",
      img: "Assrama-putri.jpg",
      category: "Asrama",
      featured: false,
    },
    {
      id: 4,
      name: "Ruang Kelas",
      desc: "Ruang belajar interaktif untuk mendukung pendidikan formal dan agama.",
      detail:
        "Kelas menjadi ruang santri mengembangkan ilmu akademik, berdiskusi, belajar bersama guru, dan membangun kemampuan berpikir.",
      iconKey: "book",
      img: "Ruang-kelas.jpeg",
      category: "Pendidikan",
      featured: false,
    },
    {
      id: 5,
      name: "Lapangan Olahraga",
      desc: "Tempat kegiatan olahraga, latihan fisik, dan aktivitas kebersamaan santri.",
      detail:
        "Lapangan menjadi ruang santri menjaga kesehatan, membangun kerja sama, sportivitas, dan keseimbangan antara belajar dan aktivitas fisik.",
      iconKey: "sport",
      img: "Lapangan-olahraga.jpeg",
      category: "Aktivitas",
      featured: false,
    },
  ],
};

/* =========================================================
   PUBLIC ROUTES
========================================================= */

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Express.js Al-Furqon aktif",
    endpoints: [
      "/api/health",
      "/api/home",
      "/api/program",
      "/api/pendidikan",
      "/api/fasilitas",
      "/api/pendaftaran",
    ],
  });
});

router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "online",
    message: "Backend aktif",
  });
});

router.get("/home", (req, res) => {
  res.json({
    success: true,
    page: "home",
    data: homeData,
  });
});

router.get("/program", (req, res) => {
  res.json({
    success: true,
    page: "program",
    data: programPageData,
  });
});

router.get("/pendidikan", (req, res) => {
  res.json({
    success: true,
    page: "pendidikan",
    data: pendidikanPageData,
  });
});

router.get("/fasilitas", (req, res) => {
  res.json({
    success: true,
    page: "fasilitas",
    data: fasilitasPageData,
  });
});

export default router;