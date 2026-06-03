export const getSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const session = localStorage.getItem("session");

    if (!session) return null;

    return JSON.parse(session);
  } catch (error) {
    console.error("GET SESSION ERROR:", error.message);
    return null;
  }
};

export const getRedirectByRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "owner") return "/owner/dashboard";
  if (role === "santri") return "/santri/dashboard";

  return "/login";
};

export const clearSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("session");
};