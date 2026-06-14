export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const formatRupiah = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const formatTanggal = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatTanggalJam = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isServerError = (error) => {
  const message = String(error?.message || error || "").toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("server") ||
    message.includes("backend") ||
    message.includes("endpoint") ||
    message.includes("cannot") ||
    message.includes("fetch")
  );
};

export const getOwnerInfo = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem("owner") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("owner") ||
      sessionStorage.getItem("user");

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAdminInfo = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem("admin") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("admin") ||
      sessionStorage.getItem("user");

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
  const user = getOwnerInfo() || getAdminInfo();

  return {
    "Content-Type": "application/json",
    ...(user?.id ? { "x-user-id": user.id } : {}),
    ...(user?.role ? { "x-user-role": user.role } : {}),
  };
};

export const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request gagal dengan status ${response.status}`
    );
  }

  return data;
};