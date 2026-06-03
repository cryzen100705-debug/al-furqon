export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export const formatTanggal = (date) => {
  if (!date) return "-";

  const tanggal = new Date(date);

  if (isNaN(tanggal.getTime())) return "-";

  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const isServerError = (error) => {
  const message = String(error?.message || "");

  return (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Load failed") ||
    message.includes("fetch") ||
    message.includes("Backend tidak mengembalikan JSON") ||
    message.includes("NEXT_PUBLIC_API_URL") ||
    message.includes("network") ||
    message.includes("Network")
  );
};