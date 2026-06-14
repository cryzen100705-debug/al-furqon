import { supabase } from "../config/supabase.js";

export const generatePassword = (nama = "", tanggalLahir = "") => {
  const cleanName = String(nama || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6);

  const cleanDate = String(tanggalLahir || "").replace(/[^0-9]/g, "");
  const datePart = cleanDate.slice(-4) || "1234";

  return `${cleanName || "santri"}${datePart}`;
};

export const uploadToStorage = async (
  bucketName,
  file,
  folderName = "uploads"
) => {
  if (!file) return null;

  const fileExt = file.originalname?.split(".").pop() || "file";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
  const filePath = `${folderName}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
};

export const formatRupiah = (value = 0) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

export const toNumber = (value = 0) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

export const toSafeString = (value = "") => {
  return String(value || "").trim();
};

export const isEmpty = (value) => {
  return value === undefined || value === null || String(value).trim() === "";
};

export const normalizeStatus = (status = "") => {
  const value = String(status || "").toLowerCase().trim();

  if (["lunas", "paid", "success", "berhasil"].includes(value)) {
    return "lunas";
  }

  if (["pending", "menunggu", "diproses", "menunggu verifikasi"].includes(value)) {
    return "pending";
  }

  if (["ditolak", "gagal", "failed", "reject", "rejected"].includes(value)) {
    return "ditolak";
  }

  return value || "pending";
};