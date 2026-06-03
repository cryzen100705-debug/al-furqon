import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  const { data: santri } = await supabase
    .from("santri")
    .select("*")
    .eq("id", id)
    .single();

  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  let y = 800;

  const draw = (text, size = 12) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 20;
  };

  draw("SURAT PERNYATAAN MENJADI SANTRI", 16);

  y -= 20;

  draw(`Nama Lengkap : ${santri.nama}`);
  draw(`Tempat/Tanggal Lahir : ${santri.ttl || "-"}`);
  draw(`Jenis Kelamin : ${santri.jenis_kelamin || "-"}`);
  draw(`Nama Orang Tua : ${santri.nama_ortu || "-"}`);
  draw(`Pendidikan : ${santri.pendidikan || "-"}`);
  draw(`Pekerjaan : ${santri.pekerjaan || "-"}`);
  draw(`Alamat : ${santri.alamat || "-"}`);

  y -= 20;

  draw("Dengan sungguh-sungguh serta penuh kesadaran saya menyatakan:");

  y -= 10;

  draw("1. Akan belajar dengan tekun dan penuh semangat.");
  draw("2. Akan mengikuti pendidikan Pondok Pesantren.");
  draw("3. Akan menjaga nama baik Pondok Pesantren.");

  y -= 40;

  draw(`Bogor, ${new Date().toLocaleDateString("id-ID")}`);

  y -= 80;

  draw(santri.nama);

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=surat-santri.pdf",
    },
  });
}
