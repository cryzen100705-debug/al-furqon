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
    badge: "Program Unggulan Pesantren",
    title: "Membentuk santri yang",
    highlight: "aktif, mandiri, dan berakhlak.",
    desc: "Program pembinaan Al-Furqon dirancang untuk mengembangkan spiritual, karakter, kreativitas, keberanian, dan kemampuan sosial santri secara seimbang.",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    source: "QS. At-Talaq : 2",
    image: "/hero-santri.jpg",
  },

  programs: [
    {
      title: "Hadroh",
      subtitle: "Seni Islami & Sholawat",
      iconKey: "mosque",
      image: "/hadroh.jpg",
      desc: "Membina santri dalam seni rebana, sholawat, kekompakan tim, keberanian tampil, dan kecintaan terhadap budaya Islami.",
      longDesc:
        "Santri dilatih tampil percaya diri dalam kegiatan pesantren, acara keagamaan, dan perlombaan. Program ini membentuk disiplin, kekompakan, adab, serta keberanian di depan umum.",
      features: ["Rebana", "Sholawat", "Kekompakan", "Percaya Diri"],
    },
    {
      title: "MTQ",
      subtitle: "Tilawah & Tahsin Al-Qur’an",
      iconKey: "quran",
      image: "/mtq.jpg",
      desc: "Berfokus pada pembinaan tilawah Al-Qur’an, tahsin, tajwid, makharijul huruf, irama, dan pembiasaan akhlak Qurani.",
      longDesc:
        "Pembinaan dilakukan bertahap agar santri mampu membaca Al-Qur’an dengan tartil, indah, dan sesuai kaidah. Santri diarahkan mencintai Al-Qur’an dalam kehidupan sehari-hari.",
      features: ["Tahsin", "Tajwid", "Tilawah", "Akhlak Qurani"],
    },
    {
      title: "Pramuka",
      subtitle: "Mandiri, Disiplin & Tangguh",
      iconKey: "campground",
      image: "/pramuka.png",
      desc: "Membangun karakter disiplin, tanggung jawab, kepemimpinan, kerja sama, dan kesiapan menghadapi tantangan.",
      longDesc:
        "Melalui latihan lapangan, kegiatan kemah, kerja tim, dan aktivitas sosial, santri dibentuk menjadi pribadi aktif, mandiri, peduli, dan bertanggung jawab.",
      features: ["Leadership", "Mandiri", "Kerja Sama", "Disiplin"],
    },
  ],

  stats: [
    { value: "100+", label: "Santri", iconKey: "users" },
    { value: "3", label: "Program", iconKey: "book" },
    { value: "3", label: "Jenjang", iconKey: "award" },
    { value: "50+", label: "Pembimbing", iconKey: "hands" },
  ],

  timeline: [
    {
      number: "01",
      title: "Pengenalan Minat",
      desc: "Santri diarahkan mengenali potensi dan minat melalui kegiatan awal.",
    },
    {
      number: "02",
      title: "Latihan Terjadwal",
      desc: "Pembinaan dilakukan rutin agar kemampuan berkembang konsisten.",
    },
    {
      number: "03",
      title: "Evaluasi",
      desc: "Pembimbing mengevaluasi perkembangan santri dan memberi arahan.",
    },
    {
      number: "04",
      title: "Berprestasi",
      desc: "Santri diberi ruang untuk tampil dan membangun percaya diri.",
    },
  ],

  gallery: [
    "/hadroh.jpg",
    "/mtq.jpg",
    "/pramuka.png",
    "/doa.png",
    "/lulus.png",
    "/eid.png",
  ],

  advantages: [
    {
      iconKey: "shield",
      title: "Membentuk Disiplin",
      desc: "Santri terbiasa mengikuti jadwal, aturan, arahan, dan tanggung jawab.",
    },
    {
      iconKey: "star",
      title: "Mengasah Potensi",
      desc: "Minat dan bakat santri diberi ruang agar berkembang secara positif.",
    },
    {
      iconKey: "graduate",
      title: "Menyiapkan Masa Depan",
      desc: "Santri dilatih agar percaya diri, aktif, dan siap menghadapi tantangan.",
    },
  ],

  faq: [
    {
      q: "Apakah semua santri wajib mengikuti program?",
      a: "Santri diarahkan mengikuti program sesuai minat, bakat, dan kebutuhan pembinaan. Beberapa kegiatan dapat bersifat wajib sesuai aturan pesantren.",
    },
    {
      q: "Apakah program dibimbing langsung oleh pembina?",
      a: "Ya, setiap program memiliki pembimbing agar latihan lebih terarah, disiplin, dan sesuai tujuan pembinaan.",
    },
    {
      q: "Apakah santri bisa mengikuti lebih dari satu program?",
      a: "Bisa, selama tidak bertabrakan dengan jadwal utama dan tetap mengikuti arahan pembina.",
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