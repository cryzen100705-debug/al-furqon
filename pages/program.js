import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaBars,
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardList,
  FaGraduationCap,
  FaHeart,
  FaLightbulb,
  FaMicrophone,
  FaPaintBrush,
  FaRunning,
  FaStar,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const programItems = [
  {
    key: "qurani",
    title: "Qur'ani",
    label: "QUR'ANI",
    shortTitle: "Seni Baca Al-Qur'an",
    accent: "Tilawah, Tajwid, dan Irama Qur'ani",
    description:
      "Membimbing santri memperindah bacaan Al-Qur'an dengan tajwid, makharijul huruf, adab membaca, dan irama yang benar.",
    impact:
      "Santri terbiasa membaca Al-Qur'an dengan baik, lancar, dan penuh adab.",
    miniTitle: "Program Qur'an",
    miniDesc: "Bacaan, tajwid, dan hafalan",
    icon: FaBookOpen,
  },
  {
    key: "keilmuan",
    title: "Keilmuan",
    label: "ILMU",
    shortTitle: "Pendalaman Kitab Kuning",
    accent: "Fiqih, Akidah, Nahwu, dan Pemahaman Ilmu",
    description:
      "Santri dibimbing memahami ilmu agama dan dasar keilmuan pesantren melalui pembelajaran terstruktur dan penguatan pemahaman.",
    impact:
      "Santri memiliki pondasi ilmu yang kuat untuk belajar, berpikir, dan mengamalkan pengetahuan.",
    miniTitle: "Penguatan Ilmu",
    miniDesc: "Kitab dan wawasan dasar",
    icon: FaGraduationCap,
  },
  {
    key: "pembiasaan",
    title: "Pembiasaan",
    label: "HARIAN",
    shortTitle: "Kebiasaan Harian Santri",
    accent: "Disiplin, Kerapian, dan Tanggung Jawab",
    description:
      "Program pembiasaan membentuk rutinitas positif santri melalui jadwal harian, kerapian, kepedulian, dan tanggung jawab diri.",
    impact:
      "Santri tumbuh menjadi pribadi disiplin, mandiri, dan terbiasa hidup teratur.",
    miniTitle: "Kebiasaan Harian",
    miniDesc: "Rutinitas dan kedisiplinan",
    icon: FaClipboardList,
  },
  {
    key: "kebugaran",
    title: "Kebugaran",
    label: "SEHAT",
    shortTitle: "Olahraga dan Kebugaran",
    accent: "Sehat Jasmani, Aktif, dan Seimbang",
    description:
      "Santri diajak menjaga kesehatan jasmani melalui aktivitas fisik, olahraga bersama, dan pola hidup sehat yang teratur.",
    impact:
      "Santri lebih bugar, aktif, dan siap menjalani aktivitas belajar maupun ibadah.",
    miniTitle: "Sehat Jasmani",
    miniDesc: "Aktif dan terjaga",
    icon: FaRunning,
  },
  {
    key: "dakwah",
    title: "Dakwah",
    label: "DAKWAH",
    shortTitle: "Muhadhoroh",
    accent: "Latihan Dakwah dan Public Speaking",
    description:
      "Santri dilatih berani tampil di depan umum, menyampaikan nasihat, menjadi MC, berpidato, dan percaya diri dalam kegiatan dakwah.",
    impact:
      "Santri berani tampil, tertata dalam bicara, dan siap berdakwah.",
    miniTitle: "Latihan Dakwah",
    miniDesc: "Pidato dan public speaking",
    icon: FaMicrophone,
  },
  {
    key: "kreatif",
    title: "Kreatif",
    label: "KREATIF",
    shortTitle: "Seni Kaligrafi dan Kreativitas",
    accent: "Ekspresi Seni dan Pengembangan Bakat",
    description:
      "Santri diberi ruang untuk menyalurkan kreativitas melalui seni islami, kaligrafi, desain sederhana, dan karya positif lainnya.",
    impact:
      "Bakat santri berkembang dan tumbuh rasa percaya diri dalam berkarya.",
    miniTitle: "Ekspresi Seni",
    miniDesc: "Kaligrafi dan karya",
    icon: FaPaintBrush,
  },
];

const stats = [
  {
    icon: FaBookOpen,
    title: "8+",
    desc: "Program Pembinaan",
  },
  {
    icon: FaCalendarAlt,
    title: "Setiap Hari",
    desc: "Kegiatan Terjadwal",
  },
  {
    icon: FaUsers,
    title: "Aktif & Terbimbing",
    desc: "Bersama Ustadz Berpengalaman",
  },
];

const reasons = [
  {
    icon: FaHeart,
    title: "Membentuk Karakter Qur’ani",
    desc: "Santri terbiasa dengan Al-Qur’an dalam kehidupan sehari-hari.",
  },
  {
    icon: FaLightbulb,
    title: "Menambah Ilmu & Wawasan",
    desc: "Ilmu agama dan umum seimbang untuk masa depan santri.",
  },
  {
    icon: FaUsers,
    title: "Membiasakan Hidup Disiplin",
    desc: "Jadwal terstruktur membentuk kebiasaan positif.",
  },
  {
    icon: FaStar,
    title: "Mengembangkan Potensi",
    desc: "Setiap santri diberi ruang untuk tumbuh sesuai bakatnya.",
  },
];

export default function ProgramPage() {
  const [activeProgram, setActiveProgram] = useState("qurani");

  const selectedProgram = useMemo(() => {
    return (
      programItems.find((item) => item.key === activeProgram) || programItems[0]
    );
  }, [activeProgram]);

  const SelectedIcon = selectedProgram.icon;

  return (
    <>
      <div className="program-page">
        <div className="program-shell">
          {/* HEADER */}
          <header className="program-header">
            <div className="brand-wrap">
              <div className="brand-logo">AF</div>
              <div className="brand-copy">
                <span>PESANTREN</span>
                <strong>AL FURQON</strong>
              </div>
            </div>

            <button className="menu-btn" type="button" aria-label="Menu">
              <FaBars />
            </button>
          </header>

          {/* HERO */}
          <section className="hero-section">
            <div className="hero-copy">
              <div className="section-badge">Daftar Program</div>

              <h1>
                Non formal pesantren yang
                <br />
                membentuk kebiasaan santri
              </h1>

              <p>
                Program pembinaan harian untuk membentuk karakter Qur’ani,
                berilmu, berakhlak, dan sehat jasmani.
              </p>

              <div className="hero-actions">
                <Link href="/pendaftaran" className="btn-primary">
                  <span>Daftar Program</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-circle" />
              <div className="hero-building">
                <div className="building-dome" />
                <div className="building-base" />
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={index} className="stat-card">
                  <div className="stat-icon">
                    <Icon />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </article>
              );
            })}
          </section>

          {/* FEATURED PROGRAM */}
          <section className="featured-section">
            <div className="featured-top">
              <div className="featured-badge">
                <FaStar />
                <span>Program Unggulan</span>
              </div>

              <div className="featured-pill">{selectedProgram.label}</div>
            </div>

            <div className="featured-main">
              <div className="featured-icon-wrap">
                <div className="featured-icon-ring">
                  <div className="featured-icon">
                    <SelectedIcon />
                  </div>
                </div>
              </div>

              <div className="featured-copy">
                <p className="featured-accent">{selectedProgram.accent}</p>
                <h2>{selectedProgram.shortTitle}</h2>
                <p className="featured-desc">{selectedProgram.description}</p>
              </div>
            </div>

            <div className="impact-box">
              <h4>Dampak Pembinaan</h4>
              <p>{selectedProgram.impact}</p>
            </div>

            <div className="slider-dots">
              {programItems.slice(0, 5).map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={`dot ${
                    activeProgram === item.key ? "dot-active" : ""
                  }`}
                  onClick={() => setActiveProgram(item.key)}
                  aria-label={`Pilih program ${index + 1}`}
                />
              ))}
            </div>
          </section>

          {/* ALL PROGRAMS */}
          <section className="program-list-section">
            <div className="section-head">
              <h2>Semua Program Pembinaan</h2>
              <button className="see-all-btn" type="button">
                <span>Lihat Semua</span>
                <FaArrowRight />
              </button>
            </div>

            <div className="program-card-row">
              {programItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveProgram(item.key)}
                    className={`mini-program-card ${
                      activeProgram === item.key ? "mini-program-card-active" : ""
                    }`}
                  >
                    <div className="mini-program-icon">
                      <Icon />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.miniTitle}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* REASONS */}
          <section className="reason-section">
            <div className="section-head simple-head">
              <h2>Kenapa Program Ini Penting?</h2>
            </div>

            <div className="reason-grid">
              {reasons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={index} className="reason-card">
                    <div className="reason-icon">
                      <Icon />
                    </div>
                    <div className="reason-copy">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {/* STICKY BOTTOM CTA */}
        <div className="sticky-cta">
          <a
            href="https://wa.me/628999155698"
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-wa"
          >
            <FaWhatsapp />
            <span>Hubungi Admin</span>
          </a>

          <Link href="/pendaftaran" className="sticky-daftar">
            <span>Daftar Sekarang</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>

      <style jsx>{`
        :global(html),
        :global(body),
        :global(#__next) {
          margin: 0;
          padding: 0;
          background: #f7f5ef;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #0c3b32;
        }

        * {
          box-sizing: border-box;
        }

        .program-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(230, 210, 105, 0.18), transparent 28%),
            linear-gradient(180deg, #fbfaf6 0%, #f4f1e9 100%);
          padding: 24px 16px 130px;
        }

        .program-shell {
          width: min(100%, 1180px);
          margin: 0 auto;
        }

        .program-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #0c3a33 0%, #01553f 45%, #032e28 100%);
          box-shadow: 0 22px 55px rgba(6, 53, 45, 0.16);
        }

        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .brand-logo {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 35% 35%, #9cff92 0%, #1aae4f 40%, #0b5a2b 100%);
          color: #fff;
          font-weight: 900;
          box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 0.18);
        }

        .brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-copy span {
          color: #f9d12c;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.16em;
        }

        .brand-copy strong {
          color: #ffffff;
          font-size: 2rem;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 700;
        }

        .menu-btn {
          width: 66px;
          height: 66px;
          flex-shrink: 0;
          border: 0;
          border-radius: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          font-size: 1.8rem;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .hero-section {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(240px, 0.8fr);
          align-items: center;
          gap: 28px;
          padding: 36px 18px 18px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #edf1ec;
          color: #0f4638;
          font-size: 0.92rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section-badge::before {
          content: "";
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #9bd28a;
        }

        .hero-copy h1 {
          margin: 20px 0 14px;
          font-size: clamp(2.3rem, 4vw, 4.3rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
          color: #083b31;
        }

        .hero-copy p {
          margin: 0;
          max-width: 620px;
          font-size: 1.24rem;
          line-height: 1.65;
          color: #23473f;
        }

        .hero-actions {
          margin-top: 28px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 28px;
          border-radius: 999px;
          background: #facc15;
          color: #052e22;
          text-decoration: none;
          font-weight: 900;
          font-size: 1.22rem;
          box-shadow: 0 18px 30px rgba(245, 181, 0, 0.2);
        }

        .hero-visual {
          position: relative;
          min-height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .hero-circle {
          position: absolute;
          right: 0;
          bottom: 0;
          width: min(100%, 420px);
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(245, 230, 167, 0.72), rgba(245, 230, 167, 0.28));
        }

        .hero-building {
          position: relative;
          z-index: 1;
          width: min(85%, 340px);
          height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .building-dome {
          width: 170px;
          height: 88px;
          border-radius: 180px 180px 0 0;
          background: linear-gradient(180deg, #1d9c76 0%, #0a6048 100%);
          box-shadow: 0 18px 40px rgba(8, 59, 49, 0.18);
        }

        .building-base {
          width: 260px;
          height: 125px;
          margin-top: -6px;
          border-radius: 14px 14px 0 0;
          background: linear-gradient(180deg, #d8bd85 0%, #b88c4d 100%);
          box-shadow: inset 0 0 0 6px rgba(255, 255, 255, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 10px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 18px 44px rgba(10, 56, 46, 0.08);
          border: 1px solid rgba(10, 56, 46, 0.06);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f0c8;
          color: #0b473b;
          font-size: 1.5rem;
        }

        .stat-card h3 {
          margin: 0 0 6px;
          font-size: 1.9rem;
          line-height: 1;
          color: #0b3b32;
        }

        .stat-card p {
          margin: 0;
          font-size: 1.14rem;
          line-height: 1.45;
          color: #1d4b40;
        }

        .featured-section {
          margin-top: 28px;
          border-radius: 34px;
          padding: 28px;
          background:
            radial-gradient(circle at 18% 34%, rgba(92, 170, 72, 0.22), transparent 22%),
            linear-gradient(135deg, #032d29 0%, #045d43 46%, #032d29 100%);
          color: #ffffff;
          box-shadow: 0 28px 70px rgba(3, 45, 41, 0.22);
        }

        .featured-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffd43b;
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .featured-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          border-radius: 999px;
          background: #facc15;
          color: #032d29;
          font-size: 0.95rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .featured-main {
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          margin-top: 20px;
        }

        .featured-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .featured-icon-ring {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle, rgba(168, 214, 99, 0.36), rgba(168, 214, 99, 0.06));
          box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .featured-icon {
          width: 108px;
          height: 108px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #255e2d 0%, #143e1a 100%);
          color: #ffe167;
          font-size: 2.7rem;
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.2);
        }

        .featured-accent {
          margin: 0 0 10px;
          color: #ffd43b;
          font-size: 1rem;
          line-height: 1.4;
        }

        .featured-copy h2 {
          margin: 0;
          font-size: clamp(2rem, 3vw, 3.5rem);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .featured-desc {
          margin-top: 12px !important;
          font-size: 1.16rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.9);
        }

        .impact-box {
          margin-top: 24px;
          padding: 22px 26px;
          border-radius: 22px;
          background: linear-gradient(90deg, rgba(105, 139, 28, 0.22), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 211, 59, 0.18);
        }

        .impact-box h4 {
          margin: 0 0 12px;
          color: #ffd43b;
          font-size: 1.06rem;
        }

        .impact-box p {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          cursor: pointer;
        }

        .dot-active {
          width: 28px;
          background: #facc15;
        }

        .program-list-section,
        .reason-section {
          margin-top: 28px;
        }

        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .section-head h2 {
          margin: 0;
          font-size: clamp(1.8rem, 2.8vw, 2.6rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: #0c3b32;
        }

        .see-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 0;
          color: #143f36;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
        }

        .program-card-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
        }

        .mini-program-card {
          text-align: left;
          border: 1px solid rgba(12, 59, 50, 0.08);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 22px 18px;
          cursor: pointer;
          box-shadow: 0 16px 42px rgba(10, 56, 46, 0.06);
          transition: 0.25s ease;
          color: #123d33;
        }

        .mini-program-card:hover,
        .mini-program-card-active {
          transform: translateY(-4px);
          border-color: rgba(250, 204, 21, 0.6);
          box-shadow: 0 20px 50px rgba(10, 56, 46, 0.1);
        }

        .mini-program-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9f0c9;
          color: #0d4338;
          font-size: 1.9rem;
          margin-bottom: 18px;
        }

        .mini-program-card h3 {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.15;
        }

        .mini-program-card p {
          margin: 12px 0 0;
          font-size: 1.02rem;
          line-height: 1.45;
          color: #305248;
        }

        .simple-head {
          margin-bottom: 18px;
        }

        .reason-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .reason-card {
          padding: 22px 18px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 16px 42px rgba(10, 56, 46, 0.06);
          border: 1px solid rgba(12, 59, 50, 0.08);
        }

        .reason-icon {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f0c8;
          color: #0d4338;
          font-size: 1.55rem;
          margin-bottom: 16px;
        }

        .reason-copy h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
          line-height: 1.2;
          color: #0d3d33;
        }

        .reason-copy p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.55;
          color: #34564c;
        }

        .sticky-cta {
          position: fixed;
          left: 50%;
          bottom: max(16px, env(safe-area-inset-bottom));
          transform: translateX(-50%);
          z-index: 40;
          width: min(calc(100% - 24px), 1180px);
          padding: 16px;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 14px;
          border-radius: 36px;
          background: linear-gradient(135deg, #0b3a32 0%, #025843 46%, #0b3a32 100%);
          box-shadow: 0 28px 65px rgba(4, 46, 39, 0.26);
        }

        .sticky-wa,
        .sticky-daftar {
          min-height: 74px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-decoration: none;
          font-weight: 900;
          font-size: 1.22rem;
        }

        .sticky-wa {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .sticky-daftar {
          background: #facc15;
          color: #052e22;
        }

        @media (max-width: 1100px) {
          .program-card-row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .reason-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .program-page {
            padding: 18px 12px 120px;
          }

          .program-header {
            padding: 14px 14px;
            border-radius: 28px;
          }

          .brand-logo {
            width: 46px;
            height: 46px;
            font-size: 0.8rem;
          }

          .brand-copy span {
            font-size: 0.78rem;
          }

          .brand-copy strong {
            font-size: 1.6rem;
          }

          .menu-btn {
            width: 54px;
            height: 54px;
            border-radius: 18px;
            font-size: 1.4rem;
          }

          .hero-section {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 22px 6px 10px;
          }

          .hero-copy h1 {
            margin-top: 16px;
            font-size: clamp(2rem, 7vw, 3rem);
          }

          .hero-copy p {
            font-size: 1rem;
            line-height: 1.55;
          }

          .btn-primary {
            padding: 14px 20px;
            font-size: 1rem;
          }

          .hero-visual {
            min-height: 180px;
          }

          .hero-circle {
            width: min(100%, 280px);
          }

          .hero-building {
            width: 220px;
            height: 150px;
          }

          .building-dome {
            width: 110px;
            height: 58px;
          }

          .building-base {
            width: 180px;
            height: 92px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .stat-card {
            padding: 16px;
            border-radius: 18px;
          }

          .stat-icon {
            width: 52px;
            height: 52px;
            font-size: 1.15rem;
          }

          .stat-card h3 {
            font-size: 1.4rem;
          }

          .stat-card p {
            font-size: 0.95rem;
          }

          .featured-section {
            margin-top: 20px;
            padding: 18px;
            border-radius: 24px;
          }

          .featured-badge {
            font-size: 0.78rem;
            letter-spacing: 0.12em;
          }

          .featured-pill {
            padding: 10px 14px;
            font-size: 0.72rem;
          }

          .featured-main {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-top: 14px;
          }

          .featured-icon-wrap {
            justify-content: flex-start;
          }

          .featured-icon-ring {
            width: 110px;
            height: 110px;
          }

          .featured-icon {
            width: 76px;
            height: 76px;
            font-size: 2rem;
          }

          .featured-accent {
            font-size: 0.82rem;
          }

          .featured-copy h2 {
            font-size: 2rem;
          }

          .featured-desc,
          .impact-box p {
            font-size: 0.94rem;
            line-height: 1.5;
          }

          .impact-box {
            margin-top: 16px;
            padding: 16px;
            border-radius: 18px;
          }

          .slider-dots {
            margin-top: 16px;
            gap: 10px;
          }

          .dot {
            width: 9px;
            height: 9px;
          }

          .dot-active {
            width: 22px;
          }

          .section-head {
            margin-bottom: 12px;
          }

          .section-head h2 {
            font-size: 1.6rem;
          }

          .see-all-btn {
            font-size: 0.95rem;
          }

          .program-card-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .mini-program-card {
            padding: 16px 14px;
            border-radius: 18px;
          }

          .mini-program-icon {
            width: 54px;
            height: 54px;
            font-size: 1.4rem;
            margin-bottom: 14px;
          }

          .mini-program-card h3 {
            font-size: 1rem;
          }

          .mini-program-card p {
            margin-top: 8px;
            font-size: 0.9rem;
          }

          .reason-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .reason-card {
            padding: 16px 14px;
            border-radius: 18px;
          }

          .reason-icon {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
            margin-bottom: 12px;
          }

          .reason-copy h3 {
            font-size: 1rem;
          }

          .reason-copy p {
            font-size: 0.9rem;
          }

          .sticky-cta {
            width: calc(100% - 16px);
            padding: 12px;
            grid-template-columns: 1fr 1.2fr;
            gap: 10px;
            border-radius: 24px;
          }

          .sticky-wa,
          .sticky-daftar {
            min-height: 56px;
            font-size: 0.95rem;
            gap: 10px;
          }
        }

        @media (max-width: 520px) {
          .program-page {
            padding: 14px 10px 108px;
          }

          .program-header {
            padding: 12px;
            border-radius: 24px;
          }

          .brand-wrap {
            gap: 10px;
          }

          .brand-logo {
            width: 40px;
            height: 40px;
            font-size: 0.72rem;
          }

          .brand-copy span {
            font-size: 0.66rem;
            letter-spacing: 0.12em;
          }

          .brand-copy strong {
            font-size: 1.18rem;
          }

          .menu-btn {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            font-size: 1.2rem;
          }

          .hero-section {
            padding: 18px 6px 8px;
            gap: 12px;
          }

          .section-badge {
            padding: 8px 12px;
            font-size: 0.68rem;
          }

          .hero-copy h1 {
            margin: 12px 0 10px;
            font-size: 2rem;
            line-height: 1.02;
          }

          .hero-copy p {
            font-size: 0.92rem;
            line-height: 1.5;
          }

          .hero-actions {
            margin-top: 16px;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
            padding: 14px 16px;
            font-size: 0.95rem;
          }

          .hero-visual {
            min-height: 140px;
          }

          .hero-circle {
            width: 220px;
          }

          .hero-building {
            width: 170px;
            height: 120px;
          }

          .building-dome {
            width: 90px;
            height: 48px;
          }

          .building-base {
            width: 150px;
            height: 70px;
          }

          .stats-grid {
            gap: 10px;
          }

          .stat-card {
            gap: 12px;
            padding: 14px;
            border-radius: 16px;
          }

          .stat-icon {
            width: 46px;
            height: 46px;
            font-size: 1rem;
          }

          .stat-card h3 {
            font-size: 1.1rem;
            margin-bottom: 4px;
          }

          .stat-card p {
            font-size: 0.84rem;
            line-height: 1.4;
          }

          .featured-section {
            padding: 16px;
            border-radius: 22px;
          }

          .featured-top {
            align-items: flex-start;
          }

          .featured-badge {
            gap: 8px;
            font-size: 0.66rem;
          }

          .featured-pill {
            padding: 9px 12px;
            font-size: 0.64rem;
          }

          .featured-icon-ring {
            width: 96px;
            height: 96px;
          }

          .featured-icon {
            width: 66px;
            height: 66px;
            font-size: 1.6rem;
          }

          .featured-accent {
            margin-bottom: 8px;
            font-size: 0.72rem;
          }

          .featured-copy h2 {
            font-size: 1.8rem;
          }

          .featured-desc {
            font-size: 0.86rem;
          }

          .impact-box {
            padding: 14px;
            border-radius: 16px;
          }

          .impact-box h4 {
            font-size: 0.9rem;
            margin-bottom: 8px;
          }

          .impact-box p {
            font-size: 0.84rem;
          }

          .section-head h2 {
            font-size: 1.2rem;
          }

          .see-all-btn {
            font-size: 0.82rem;
            gap: 6px;
          }

          .program-card-row {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 6px;
            scroll-snap-type: x proximity;
          }

          .program-card-row::-webkit-scrollbar {
            display: none;
          }

          .mini-program-card {
            min-width: 138px;
            flex: 0 0 138px;
            padding: 14px 12px;
            border-radius: 16px;
            scroll-snap-align: start;
          }

          .mini-program-icon {
            width: 46px;
            height: 46px;
            font-size: 1.15rem;
            margin-bottom: 10px;
          }

          .mini-program-card h3 {
            font-size: 0.95rem;
          }

          .mini-program-card p {
            font-size: 0.82rem;
          }

          .reason-grid {
            gap: 10px;
          }

          .reason-card {
            padding: 14px 12px;
            border-radius: 16px;
          }

          .reason-icon {
            width: 44px;
            height: 44px;
            font-size: 1rem;
            margin-bottom: 10px;
          }

          .reason-copy h3 {
            font-size: 0.95rem;
          }

          .reason-copy p {
            font-size: 0.82rem;
            line-height: 1.45;
          }

          .sticky-cta {
            width: calc(100% - 12px);
            padding: 10px;
            gap: 8px;
            grid-template-columns: 1fr 1.1fr;
            border-radius: 20px;
          }

          .sticky-wa,
          .sticky-daftar {
            min-height: 48px;
            font-size: 0.82rem;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}