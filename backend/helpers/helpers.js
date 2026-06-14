import { supabase } from "../config/supabase.js";

export const generatePassword = (nama, tanggalLahir) => {
  const cleanName = String(nama || "")
    .replace(/\s/g, "")
    .toLowerCase();

  const tgl = tanggalLahir ? String(tanggalLahir).replaceAll("-", "") : "0000";

  return `${cleanName.slice(0, 4)}${tgl.slice(-4)}!`;
};

export const uploadToStorage = async (bucketName, file, folderName) => {
  if (!file) return null;

  const originalName = file.originalname || "file";

  const safeName = originalName
    .replace(/\s+/g, "-")
    .replace(/[^\w.-]/g, "");

  const filePath = `${folderName}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload ke bucket ${bucketName}: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
};

export const getAdminInfo = (body = {}) => {
  return {
    admin_id: body.admin_id || null,
    nama_admin: body.nama_admin || "Admin Pesantren",
  };
};

export const logAktivitasAdmin = async ({
  admin_id = null,
  nama_admin = "Admin Pesantren",
  kategori = "sistem",
  aktivitas = "Aktivitas Admin",
  detail = "",
  target_id = null,
  target_nama = "",
}) => {
  try {
    await supabase.from("aktivitas_admin").insert([
      {
        admin_id,
        nama_admin,
        kategori,
        aktivitas,
        detail,
        target_id,
        target_nama,
      },
    ]);
  } catch (error) {
    console.error("LOG AKTIVITAS ERROR:", error.message);
  }
};