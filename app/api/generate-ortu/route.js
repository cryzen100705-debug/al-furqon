import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const getSupabase = () => {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "ENV Supabase belum lengkap. Isi SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Vercel."
    );
  }

  return createClient(supabaseUrl, supabaseKey);
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID santri wajib dikirim.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: santri, error } = await supabase
      .from("santri")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !santri) {
      return NextResponse.json(
        {
          success: false,
          message: "Data santri tidak ditemukan.",
          error: error?.message || null,
        },
        { status: 404 }
      );
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let y = 800;

    const draw = (text, size = 12, options = {}) => {
      page.drawText(String(text || ""), {
        x: options.x || 50,
        y,
        size,
        font: options.bold ? boldFont : font,
        color: rgb(0, 0, 0),
      });

      y -= options.gap || 20;
    };

    const drawCenter = (text, size = 16) => {
      const pageWidth = page.getWidth();
      const textWidth = boldFont.widthOfTextAtSize(text, size);

      page.drawText(text, {
        x: (pageWidth - textWidth) / 2,
        y,
        size,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      y -= 24;
    };

    drawCenter("SURAT PERNYATAAN ORANG TUA SANTRI", 16);

    y -= 20;

    draw(`Nama Lengkap : ${santri.nama_ortu || santri.nama_orang_tua || "-"}`);
    draw(`Pendidikan & Pekerjaan : ${santri.pekerjaan_ortu || "-"}`);
    draw(`Nama Anak : ${santri.nama || santri.nama_lengkap || "-"}`);
    draw(`Kelas : ${santri.kelas || "-"}`);
    draw(`Alamat : ${santri.alamat || "-"}`);

    y -= 20;

    draw("Dengan sungguh-sungguh menyatakan:", 12, { bold: true });

    y -= 10;

    draw("1. Bersedia membimbing dan mengawasi santri.");
    draw("2. Bersedia mematuhi tata tertib pesantren.");
    draw("3. Bersedia menerima sanksi bila melanggar.");

    y -= 40;

    draw(`Bogor, ${new Date().toLocaleDateString("id-ID")}`);

    y -= 80;

    draw(santri.nama_ortu || santri.nama_orang_tua || "-");

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=surat-ortu.pdf",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat surat pernyataan orang tua.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}