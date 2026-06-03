"use client";

import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaDownload, FaFilePdf, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Pembayaran() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dataSantri"));
    setData(saved);
  }, []);

  const generatePDF = () => {
    if (!data) {
      alert("Data tidak ditemukan");
      return;
    }

    // =========================================
    // PDF BUKTI PENDAFTARAN
    // =========================================
    const bukti = new jsPDF();

    // HEADER
    bukti.setFillColor(6, 78, 59);
    bukti.rect(0, 0, 220, 35, "F");

    bukti.setTextColor(255, 255, 255);
    bukti.setFontSize(20);
    bukti.setFont("helvetica", "bold");
    bukti.text("BUKTI PENDAFTARAN SANTRI", 20, 20);

    bukti.setFontSize(11);
    bukti.setFont("helvetica", "normal");
    bukti.text("Pondok Pesantren Al Furqon", 20, 28);

    // CONTENT
    bukti.setTextColor(0, 0, 0);

    let y = 55;

    const addBuktiLine = (label, value) => {
      bukti.setFont("helvetica", "bold");
      bukti.text(`${label}`, 20, y);

      bukti.setFont("helvetica", "normal");
      bukti.text(`: ${value || "-"}`, 70, y);

      y += 10;
    };

    addBuktiLine("Nama Santri", data.nama);
    addBuktiLine("NISN", data.nisn);
    addBuktiLine("Email", data.email);
    addBuktiLine("No HP", data.telepon);
    addBuktiLine("Jenjang", data.jenjang);
    addBuktiLine("Tanggal Lahir", data.tanggalLahir);

    y += 10;

    // STATUS BOX
    bukti.setFillColor(220, 252, 231);
    bukti.roundedRect(20, y, 170, 18, 4, 4, "F");

    bukti.setTextColor(22, 101, 52);
    bukti.setFont("helvetica", "bold");
    bukti.text("STATUS: PENDAFTARAN BERHASIL", 28, y + 11);

    y += 35;

    bukti.setTextColor(120);
    bukti.setFontSize(10);

    bukti.text("Dokumen ini merupakan bukti resmi pendaftaran santri.", 20, y);

    bukti.text("Harap simpan dokumen ini dengan baik.", 20, y + 7);

    bukti.save("Bukti_Pendaftaran_AlFurqon.pdf");

    // =========================================
    // PDF FORMULIR LENGKAP
    // =========================================
    const form = new jsPDF();

    // HEADER
    form.setFillColor(6, 78, 59);
    form.rect(0, 0, 220, 35, "F");

    form.setTextColor(255, 255, 255);
    form.setFontSize(20);
    form.setFont("helvetica", "bold");
    form.text("FORMULIR SANTRI", 20, 20);

    form.setFontSize(11);
    form.setFont("helvetica", "normal");
    form.text("Pondok Pesantren Al Furqon", 20, 28);

    form.setTextColor(0, 0, 0);

    let fy = 50;

    const addFormLine = (label, value) => {
      form.setFont("helvetica", "bold");
      form.text(label, 20, fy);

      form.setFont("helvetica", "normal");
      form.text(`: ${value || "-"}`, 75, fy);

      fy += 9;
    };

    // DATA SANTRI
    form.setFont("helvetica", "bold");
    form.setFontSize(14);
    form.text("DATA SANTRI", 20, fy);

    fy += 12;

    form.setFontSize(11);

    addFormLine("Nama Lengkap", data.nama);
    addFormLine("Email", data.email);
    addFormLine("NISN", data.nisn);
    addFormLine("Tanggal Lahir", data.tanggalLahir);
    addFormLine("No HP", data.telepon);
    addFormLine("Alamat", data.alamat);
    addFormLine("Kota", data.kota);
    addFormLine("Provinsi", data.provinsi);
    addFormLine("Jenjang", data.jenjang);

    fy += 8;

    // DATA ORANG TUA
    form.setFont("helvetica", "bold");
    form.setFontSize(14);
    form.text("DATA ORANG TUA", 20, fy);

    fy += 12;

    form.setFontSize(11);

    addFormLine("Nama Ayah", data.ayahNama);
    addFormLine("Nama Ibu", data.ibuNama);

    fy += 15;

    // TANDA TANGAN
    form.setFont("helvetica", "normal");

    form.text("Mengetahui,", 140, fy);
    form.text("Admin PP Al Furqon", 140, fy + 7);

    fy += 35;

    form.setFont("helvetica", "bold");
    form.text("(________________)", 135, fy);

    form.save("Formulir_Santri_AlFurqon.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4 py-10">
      {/* CARD */}
      <div
        className="
          w-full max-w-2xl
          bg-white/10
          backdrop-blur-2xl
          border border-white/10
          rounded-[32px]
          overflow-hidden
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="relative p-10 text-center">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

          <div className="relative z-10">
            {/* ICON */}
            <div
              className="
                mx-auto
                w-28 h-28
                rounded-full
                bg-green-500/20
                border border-green-300/20
                flex items-center justify-center
                text-green-300
                text-6xl
              "
            >
              <FaCheckCircle />
            </div>

            {/* TITLE */}
            <h1 className="mt-8 text-4xl md:text-5xl font-black text-white">
              Pembayaran Berhasil
            </h1>

            {/* DESC */}
            <p className="mt-4 text-green-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Data pendaftaran santri berhasil dikirim. Silakan download bukti
              pendaftaran dan formulir santri sebagai arsip resmi.
            </p>
          </div>
        </div>

        {/* INFO BOX */}
        {data && (
          <div className="px-6 md:px-10">
            <div
              className="
                bg-white/10
                border border-white/10
                rounded-3xl
                p-6
              "
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-green-200 text-sm">Nama Santri</p>

                  <h2 className="text-white font-bold text-lg mt-1">
                    {data.nama}
                  </h2>
                </div>

                <div>
                  <p className="text-green-200 text-sm">Jenjang</p>

                  <h2 className="text-white font-bold text-lg mt-1">
                    {data.jenjang || "-"}
                  </h2>
                </div>

                <div>
                  <p className="text-green-200 text-sm">NISN</p>

                  <h2 className="text-white font-bold text-lg mt-1">
                    {data.nisn}
                  </h2>
                </div>

                <div>
                  <p className="text-green-200 text-sm">Email</p>

                  <h2 className="text-white font-bold text-lg mt-1 break-all">
                    {data.email}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <div className="p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-4">
            {/* DOWNLOAD */}
            <button
              onClick={generatePDF}
              className="
                h-14
                rounded-2xl
                bg-yellow-400
                hover:bg-yellow-300
                text-black
                font-bold
                transition-all
                hover:scale-[1.02]
                flex items-center justify-center gap-3
                shadow-xl
              "
            >
              <FaDownload />
              Download PDF
            </button>

            {/* HOME */}
            <Link href="/">
              <button
                className="
                  w-full h-14
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  border border-white/10
                  text-white
                  font-semibold
                  transition-all
                  flex items-center justify-center gap-3
                "
              >
                <FaHome />
                Kembali ke Beranda
              </button>
            </Link>
          </div>

          {/* NOTE */}
          <div
            className="
              mt-6
              bg-yellow-400/10
              border border-yellow-400/20
              rounded-2xl
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <FaFilePdf className="text-yellow-400 mt-1 shrink-0" />

              <p className="text-sm text-yellow-100 leading-relaxed">
                Sistem akan mengunduh 2 file PDF:
                <br />
                • Bukti Pendaftaran
                <br />• Formulir Lengkap Santri
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
